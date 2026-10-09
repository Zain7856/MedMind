import express from "express";
import { getUser } from "../Services/Users.js";
import { getProvider } from "../Services/Providers.js";
import {
    addAppointment,
    getPatientAppointments,
    getProviderAppointments,
    setAppointmentStatus
} from "../Services/Appointments.js";

const router = express.Router();

// A new booking. It always starts as Pending. The doctor or hospital confirms it.
router.post("/appointments", (req, res) => {
    const { UserID, ProviderID, AppointmentDate } = req.body;

    if (!UserID || !ProviderID || !AppointmentDate) {
        return res.status(400).json({ error: "Please pick a date and time." });
    }
    if (isNaN(new Date(AppointmentDate))) {
        return res.status(400).json({ error: "That date does not look right." });
    }
    if (new Date(AppointmentDate) <= new Date()) {
        return res.status(400).json({ error: "Please pick a date in the future." });
    }

    const patient = getUser(UserID);
    if (!patient || patient.Role !== "Patient") {
        return res.status(400).json({ error: "Only patients can book appointments." });
    }
    if (!getProvider(ProviderID)) {
        return res.status(404).json({ error: "Doctor or hospital not found." });
    }

    const ID = addAppointment(UserID, ProviderID, AppointmentDate);
    res.status(201).json({ message: "Appointment booked.", ID: ID });
});

router.get("/appointments/patient/:id", (req, res) => {
    res.json(getPatientAppointments(req.params.id));
});

router.get("/appointments/provider/:id", (req, res) => {
    res.json(getProviderAppointments(req.params.id));
});

// Confirm or cancel.
router.patch("/appointments/:id/status", (req, res) => {
    const { Status } = req.body;

    if (!["Confirmed", "Cancelled"].includes(Status)) {
        return res.status(400).json({ error: "Status must be Confirmed or Cancelled." });
    }

    const result = setAppointmentStatus(req.params.id, Status);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Appointment not found." });
    }
    res.json({ message: "Appointment " + Status.toLowerCase() + "." });
});

export default router;
