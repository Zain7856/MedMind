import express from "express";
import {
    findUserByEmail,
    findUserById,
    getUser,
    getUsers,
    addUser,
    updateUser,
    setPassword,
    setApprovalStatus,
    deleteUser
} from "../Services/Users.js";

const router = express.Router();

// A password shorter than this is too easy to guess.
const MIN_PASSWORD_LENGTH = 6;

// Sign in. Gives back the user (without the password) when the email and password match.
router.post("/users/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please type your email and password." });
    }

    const user = findUserByEmail(email);
    if (!user || user.Password !== password) {
        return res.status(401).json({ error: "Wrong email or password." });
    }
    if (user.ApprovalStatus === "Pending") {
        return res.status(403).json({ error: "Your account is waiting for the admin to approve it." });
    }
    if (user.ApprovalStatus === "Rejected") {
        return res.status(403).json({ error: "Your account was rejected by the admin." });
    }

    res.json(getUser(user.ID));
});

// Sign up.
router.post("/users", (req, res) => {
    const user = req.body;

    if (!user.Name || !user.Email || !user.Password) {
        return res.status(400).json({ error: "Please fill in your name, email and password." });
    }
    if (!user.Email.includes("@")) {
        return res.status(400).json({ error: "That email does not look right." });
    }
    if (user.Password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: "Your password needs at least " + MIN_PASSWORD_LENGTH + " characters." });
    }
    if (!["Patient", "Doctor", "Hospital"].includes(user.Role)) {
        return res.status(400).json({ error: "Please choose Patient, Doctor or Hospital." });
    }
    if (findUserByEmail(user.Email)) {
        return res.status(409).json({ error: "That email is already used." });
    }

    // Patients can sign in right away. Doctors and hospitals show up in the
    // public lists, so the admin has to approve them first.
    if (user.Role === "Patient") {
        user.ApprovalStatus = "Approved";
    } else {
        user.ApprovalStatus = "Pending";
    }

    const ID = addUser(user);
    res.status(201).json({ message: "Account created.", ID: ID, ApprovalStatus: user.ApprovalStatus });
});

// The admin's list of everybody.
router.get("/users", (req, res) => {
    res.json(getUsers());
});

// Edit your own info (and your doctor or hospital listing).
router.put("/users/:id", (req, res) => {
    const user = req.body;

    if (!getUser(req.params.id)) {
        return res.status(404).json({ error: "User not found." });
    }
    if (!user.Name || !user.Email || !user.Email.includes("@")) {
        return res.status(400).json({ error: "Please fill in your name and a good email." });
    }
    const sameEmail = findUserByEmail(user.Email);
    if (sameEmail && String(sameEmail.ID) !== req.params.id) {
        return res.status(409).json({ error: "That email is already used." });
    }

    updateUser(req.params.id, user);
    res.json(getUser(req.params.id));
});

router.put("/users/:id/password", (req, res) => {
    const { CurrentPassword, NewPassword } = req.body;
    const user = findUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    if (user.Password !== CurrentPassword) {
        return res.status(401).json({ error: "Your current password is wrong." });
    }
    if (!NewPassword || NewPassword.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: "Your new password needs at least " + MIN_PASSWORD_LENGTH + " characters." });
    }

    setPassword(req.params.id, NewPassword);
    res.json({ message: "Password changed." });
});

// Deletes the account and all of its appointments.
router.delete("/users/:id", (req, res) => {
    const user = getUser(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    if (user.Role === "Admin") {
        return res.status(400).json({ error: "The admin account cannot be deleted." });
    }

    deleteUser(req.params.id);
    res.json({ message: "Account deleted." });
});

router.patch("/admin/users/:id/approve", (req, res) => {
    if (!getUser(req.params.id)) {
        return res.status(404).json({ error: "User not found." });
    }
    setApprovalStatus(req.params.id, "Approved");
    res.json({ message: "User approved." });
});

// Rejected users cannot sign in, and they disappear from the doctor and hospital lists.
router.patch("/admin/users/:id/reject", (req, res) => {
    const user = getUser(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    if (user.Role === "Admin") {
        return res.status(400).json({ error: "The admin cannot be rejected." });
    }
    setApprovalStatus(req.params.id, "Rejected");
    res.json({ message: "User rejected." });
});

export default router;
