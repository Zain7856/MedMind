import express from "express";
import {
    createHospital,
    getallHospitals,
    getHospitalById,
    getHospitalByName,
    getHospitalByUserId,
    upsertHospitalProfile,
    updateHospital,
    deleteHospital
} from "../Services/Doctors.js";

const hs = express.Router();

hs.post("/hospitals", async (req, res) => {
    try {
        const { ID, Name, Location, Phone, img, Services } = req.body;
        if (!Name || !Location || !Phone) {
            return res.status(400).json({ error: "Missing required fields: Name, Location, Phone" });
        }
        const hospitalId = await createHospital(ID || null, Name, Location, Phone, img, Services);
        res.status(201).json({ message: "Hospital created successfully", hospitalId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.get("/hospitals", (req, res) => {
    try {
        const hospitals = getallHospitals();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.get("/hospitals/user/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const hospital = getHospitalByUserId(userId);
        if (!hospital) {
            return res.status(404).json({ error: "Hospital profile not found for this user" });
        }
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.put("/hospitals/user/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const { Name, Location, Phone, img, Services } = req.body;
        if (!Name) {
            return res.status(400).json({ error: "Missing required field: Name" });
        }
        const result = upsertHospitalProfile(userId, Name, Location || null, Phone || null, img || null, Services || null);
        res.status(200).json({ message: "Hospital profile saved successfully", result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.get("/hospitals/:id", (req, res) => {
    try {
        const { id } = req.params;
        let hospital;
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
            hospital = getHospitalById(numericId);
        } else {
            hospital = getHospitalByName(id);
        }
        if (!hospital) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.put("/hospitals/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Location, Phone, img, Services } = req.body;
        if (!Name || !Location || !Phone) {
            return res.status(400).json({ error: "Missing required fields: Name, Location, Phone" });
        }
        const result = updateHospital(id, Name, Location, Phone, img, Services);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital updated successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

hs.delete("/hospitals/:id", (req, res) => {
    try {
        const { id } = req.params;
        const result = deleteHospital(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital deleted successfully", changes: result.changes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default hs;
