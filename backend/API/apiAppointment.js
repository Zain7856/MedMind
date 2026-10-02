import express from "express";
import db from "../Services/db.js";
import {
    createAppointment,
    getallAppointments,
    getAppointmentById,
    getAppointmentsByDoctorUserId,
    getAppointmentsByHospitalUserId,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment
} from "../Services/Appointments.js";

const ap = express.Router();

ap.post("/appointments", async (req, res) => {
    try {
        const { UserID, ProviderID, ProviderType, AppointmentDate, Status } = req.body;

        if (!UserID || !AppointmentDate) {
            return res.status(400).json({
                error: "Missing required fields: UserID, AppointmentDate"
            });
        }

        if (!ProviderID || !ProviderType) {
            return res.status(400).json({
                error: "ProviderID and ProviderType are required"
            });
        }

        if (!['Doctor', 'Hospital'].includes(ProviderType)) {
            return res.status(400).json({
                error: "ProviderType must be 'Doctor' or 'Hospital'"
            });
        }

        const appointmentStatus = Status || 'Pending';

        try {
            const appointmentId = await createAppointment(UserID, ProviderID, ProviderType, AppointmentDate, appointmentStatus);
            res.status(201).json({
                message: "Appointment created successfully",
                appointmentId,
                ProviderID,
                ProviderType
            });
        } catch (validationError) {
            console.error('Validation error:', validationError);
            res.status(400).json({
                error: validationError.message
            });
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

ap.get("/appointments", (req, res) => {
    try {
        const appointments = getallAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.get("/appointments/doctor/:doctorUserId", (req, res) => {
    try {
        const { doctorUserId } = req.params;
        const appointments = getAppointmentsByDoctorUserId(doctorUserId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.get("/appointments/hospital/:hospitalUserId", (req, res) => {
    try {
        const { hospitalUserId } = req.params;
        const appointments = getAppointmentsByHospitalUserId(hospitalUserId);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.get("/appointments/:id", (req, res) => {
    try {
        const { id } = req.params;
        const appointment = getAppointmentById(id);

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.patch("/appointments/:id/status", (req, res) => {
    try {
        const { id } = req.params;
        const { Status } = req.body;

        if (!Status) {
            return res.status(400).json({ error: "Missing required field: Status" });
        }

        const result = updateAppointmentStatus(id, Status);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.put("/appointments/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { UserID, ProviderID, ProviderType, AppointmentDate, Status } = req.body;

        if (!UserID || !AppointmentDate) {
            return res.status(400).json({
                error: "Missing required fields: UserID, AppointmentDate"
            });
        }

        const appointmentStatus = Status || 'Pending';
        const result = updateAppointment(id, UserID, ProviderID, ProviderType, AppointmentDate, appointmentStatus);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment updated successfully",
            changes: result.changes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ap.delete("/appointments/:id", (req, res) => {
    try {
        const { id } = req.params;
        const result = deleteAppointment(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment deleted successfully",
            changes: result.changes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default ap;
