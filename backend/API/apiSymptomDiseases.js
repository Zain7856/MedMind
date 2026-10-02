import express from "express";
import {
    createSymptomDisease,
    getAllSymptomDiseases,
    getSymptomDiseasesBySymptomId,
    getSymptomDiseaseById,
    deleteSymptomDisease
} from "../Services/SymptomDiseases.js";

const router = express.Router();

router.post("/symptomdiseases", async (req, res) => {
    try {
        const { SymptomID, DiseaseID } = req.body;

        if (!SymptomID || !DiseaseID) {
            return res.status(400).json({
                error: "Missing required fields: SymptomID, DiseaseID"
            });
        }

        const changes = await createSymptomDisease(SymptomID, DiseaseID);
        if (changes === 0) {
            return res.status(409).json({ error: "Symptom disease link already exists" });
        }
        res.status(201).json({
            message: "Symptom disease created successfully",
            SymptomID,
            DiseaseID
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/symptomdiseases", (req, res) => {
    try {
        const symptomDiseases = getAllSymptomDiseases();
        res.status(200).json(symptomDiseases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/symptomdiseases/symptom/:symptomId/disease/:diseaseId", (req, res) => {
    try {
        const { symptomId, diseaseId } = req.params;
        const symptomDisease = getSymptomDiseaseById(symptomId, diseaseId);

        if (!symptomDisease) {
            return res.status(404).json({ error: "Symptom disease link not found" });
        }

        res.status(200).json(symptomDisease);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/symptomdiseases/symptom/:symptomId", (req, res) => {
    try {
        const { symptomId } = req.params;
        const symptomDiseases = getSymptomDiseasesBySymptomId(symptomId);
        res.status(200).json(symptomDiseases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/symptomdiseases/symptom/:symptomId/disease/:diseaseId", (req, res) => {
    try {
        const { symptomId, diseaseId } = req.params;
        const result = deleteSymptomDisease(symptomId, diseaseId);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Symptom disease link not found" });
        }

        res.status(200).json({
            message: "Symptom disease deleted successfully",
            changes: result.changes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
