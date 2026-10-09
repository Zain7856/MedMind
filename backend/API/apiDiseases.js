import express from "express";
import { getDiseases, getDisease, addDisease, updateDisease, deleteDisease } from "../Services/Diseases.js";

const router = express.Router();

router.get("/diseases", (req, res) => {
    res.json(getDiseases());
});

router.get("/diseases/:id", (req, res) => {
    const disease = getDisease(req.params.id);
    if (!disease) {
        return res.status(404).json({ error: "Disease not found." });
    }
    res.json(disease);
});

// The three routes below are for the admin's "Diseases" tab.
// SymptomIDs is the list of ticked symptoms, like [2, 5, 9].
router.post("/diseases", (req, res) => {
    const { Name, Description, Treatment, SymptomIDs } = req.body;

    if (!Name) {
        return res.status(400).json({ error: "Please type a name for the disease." });
    }

    const ID = addDisease(Name, Description, Treatment, SymptomIDs || []);
    res.status(201).json({ message: "Disease added.", ID: ID });
});

router.put("/diseases/:id", (req, res) => {
    const { Name, Description, Treatment, SymptomIDs } = req.body;

    if (!Name) {
        return res.status(400).json({ error: "Please type a name for the disease." });
    }

    const result = updateDisease(req.params.id, Name, Description, Treatment, SymptomIDs || []);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Disease not found." });
    }
    res.json({ message: "Disease saved." });
});

router.delete("/diseases/:id", (req, res) => {
    const result = deleteDisease(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Disease not found." });
    }
    res.json({ message: "Disease deleted." });
});

export default router;
