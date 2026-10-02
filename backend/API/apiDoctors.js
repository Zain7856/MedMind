import express from "express";
import {
    createDoctor,
    getallDoctors,
    getDoctorById,
    getDoctorByUserId,
    upsertDoctorProfile,
    updateDoctor,
    deleteDoctor
} from "../Services/Doctors.js";

const dc = express.Router();

dc.post("/doctors", async (req, res) => {
    try {
        const { ID, Name, Img, Specialization, Phone, Location, cost, About } = req.body;
        if (!Name || !Phone || !Location || cost == null) {
            return res.status(400).json({
                error: "Missing required fields: Name, Phone, Location, cost"
            });
        }
        const doctorId = await createDoctor(ID || null, Name, Img, Specialization, Phone, Location, cost, About);
        res.status(201).json({
            message: "Doctor created successfully",
            doctorId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.get("/doctors", (req, res) => {
    try {
        const doctors = getallDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.get("/doctors/:id", (req, res) => {
    try {
        const { id } = req.params;
        const doctor = getDoctorById(id);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.get("/doctors/user/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const doctor = getDoctorByUserId(userId);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor profile not found for this user" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.put("/doctors/user/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const { Name, Img, Specialization, Phone, Location, cost, About } = req.body;
        if (!Name) {
            return res.status(400).json({ error: "Missing required field: Name" });
        }
        const result = upsertDoctorProfile(userId, Name, Img || null, Specialization || null, Phone || null, Location || null, cost || 0, About || null);
        res.status(200).json({ message: "Doctor profile saved successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.put("/doctors/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Img, Specialization, Phone, Location, cost, About } = req.body;
        if (!Name || !Phone || !Location || cost == null) {
            return res.status(400).json({ error: "Missing required fields: Name, Phone, Location, cost" });
        }
        const result = updateDoctor(id, Name, Img, Specialization, Phone, Location, cost, About);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor updated successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

dc.delete("/doctors/:id", (req, res) => {
    try {
        const { id } = req.params;
        const result = deleteDoctor(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor deleted successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default dc;
