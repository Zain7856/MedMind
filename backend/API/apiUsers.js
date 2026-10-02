import express from "express";
import {
    createuser,
    getallusers,
    getuserById,
    getuserByEmail,
    updateuser,
    updateUserStatus,
    updateUserBanned,
    updateuserPassword,
    deleteuser,
    updateDoctorProfile,
    updateHospitalProfile
} from "../Services/Users.js";

const router = express.Router();

router.post("/users/login", (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing required fields: email, password"
            });
        }

        const user = getuserByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        if (user.Password !== password) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        if (user.IsBanned === 1) {
            return res.status(403).json({
                error: "Your account has been banned by the Admin."
            });
        }

        if (user.ApprovalStatus === 'Pending') {
            return res.status(403).json({
                error: "Your account is pending Admin approval."
            });
        }

        if (user.ApprovalStatus === 'Rejected') {
            return res.status(403).json({
                error: "Your account registration was rejected."
            });
        }

        const { Password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/users", async (req, res) => {
    try {
        const { Name, Email, Password, Age, Phone, Role, Specialization, Location, cost, About, Img, Services } = req.body;

        if (!Name || !Email || !Password) {
            return res.status(400).json({
                error: "Missing required fields: Name, Email, Password"
            });
        }

        const existingUser = getuserByEmail(Email);
        if (existingUser) {
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        const userId = createuser(Name, Email, Password, Age, Phone, Role, "Pending");

        if (Role === 'Doctor') {
            const costNum = cost ? parseFloat(cost) : null;
            updateDoctorProfile(userId, Specialization || null, Location || null, costNum, About || null, Img || null);
        } else if (Role === 'Hospital') {
            updateHospitalProfile(userId, Location || null, Services || null, Img || null);
        }

        res.status(201).json({
            message: "User created successfully with status Pending",
            userId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/users", (req, res) => {
    try {
        const users = getallusers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/users/:id", (req, res) => {
    try {
        const { id } = req.params;
        const user = getuserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/users/email/:email", (req, res) => {
    try {
        const { email } = req.params;
        const user = getuserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/users/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email, Age, Phone, Role, Specialization, Location, cost, About, Img, Services } = req.body;

        if (!Name || !Email) {
            return res.status(400).json({
                error: "Missing required fields: Name, Email"
            });
        }

        const result = updateuser(id, Name, Email, Age, Phone, Role);
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        if (Role === 'Doctor') {
            const costNum = cost ? parseFloat(cost) : null;
            updateDoctorProfile(id, Specialization || null, Location || null, costNum, About || null, Img || null);
        } else if (Role === 'Hospital') {
            updateHospitalProfile(id, Location || null, Services || null, Img || null);
        }

        res.status(200).json({
            message: "User updated successfully",
            changes: result.changes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/users/:id/password", (req, res) => {
    try {
        const { id } = req.params;
        const { PasswordHash } = req.body;
        if (!PasswordHash) {
            return res.status(400).json({ error: "Missing required field: PasswordHash" });
        }
        const result = updateuserPassword(id, PasswordHash);
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Password updated successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/users/:id", (req, res) => {
    try {
        const { id } = req.params;
        const result = deleteuser(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/users/:id/approve", (req, res) => {
    try {
        const { id } = req.params;
        const result = updateUserStatus(id, 'Approved');
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User account approved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/users/:id/reject", (req, res) => {
    try {
        const { id } = req.params;
        const result = updateUserStatus(id, 'Rejected');
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User account rejected successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/users/:id/ban", (req, res) => {
    try {
        const { id } = req.params;
        const result = updateUserBanned(id, 1);
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User has been banned and pending appointments cancelled" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/users/:id/unban", (req, res) => {
    try {
        const { id } = req.params;
        const result = updateUserBanned(id, 0);
        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User has been unbanned successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
