import express from "express";
import { getProviders, getProvider } from "../Services/Providers.js";

const router = express.Router();

router.get("/doctors", (req, res) => {
    res.json(getProviders("Doctor"));
});

router.get("/hospitals", (req, res) => {
    res.json(getProviders("Hospital"));
});

// One doctor or hospital. The booking page uses this.
router.get("/providers/:id", (req, res) => {
    const provider = getProvider(req.params.id);
    if (!provider) {
        return res.status(404).json({ error: "Doctor or hospital not found." });
    }
    res.json(provider);
});

export default router;
