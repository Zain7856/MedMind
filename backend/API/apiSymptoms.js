import express from "express";
import {
    getSymptoms,
    getSymptom,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    checkSymptoms
} from "../Services/Symptoms.js";

const router = express.Router();

router.get("/symptoms", (req, res) => {
    res.json(getSymptoms());
});

// One symptom and the diseases that have it.
router.get("/symptoms/:id", (req, res) => {
    const symptom = getSymptom(req.params.id);
    if (!symptom) {
        return res.status(404).json({ error: "Symptom not found." });
    }
    res.json(symptom);
});

// The symptom checker page. SymptomIDs is the list of ticked symptoms.
router.post("/symptom-check", (req, res) => {
    const { SymptomIDs } = req.body;

    if (!SymptomIDs || SymptomIDs.length === 0) {
        return res.status(400).json({ error: "Tick at least one symptom." });
    }

    res.json(checkSymptoms(SymptomIDs));
});

// The three routes below are for the admin's "Symptoms" tab.
router.post("/symptoms", (req, res) => {
    const { Name, Description } = req.body;

    if (!Name) {
        return res.status(400).json({ error: "Please type a name for the symptom." });
    }

    const ID = addSymptom(Name, Description);
    res.status(201).json({ message: "Symptom added.", ID: ID });
});

router.put("/symptoms/:id", (req, res) => {
    const { Name, Description } = req.body;

    if (!Name) {
        return res.status(400).json({ error: "Please type a name for the symptom." });
    }

    const result = updateSymptom(req.params.id, Name, Description);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Symptom not found." });
    }
    res.json({ message: "Symptom saved." });
});

router.delete("/symptoms/:id", (req, res) => {
    const result = deleteSymptom(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Symptom not found." });
    }
    res.json({ message: "Symptom deleted." });
});

export default router;
