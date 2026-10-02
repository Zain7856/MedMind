
import express from "express";
import {
    createsymptom,
    getallsymptoms,
    getSymptomById,
    updatesymptom,
    deleteSymptom
} from "../Services/Symptoms.js";

const sy = express.Router();

sy.post("/symptoms", async (req, res) => {
    try {
        const { Name, Description } = req.body;
        
        if (!Name || !Description) {
            return res.status(400).json({ 
                error: "Missing required fields: Name, Description" 
            });
        }
        
        const symptomId = await createsymptom(Name, Description);
        res.status(201).json({ 
            message: "Symptom created successfully", 
            symptomId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

sy.get("/symptoms", (req, res) => {
    try {
        const symptoms = getallsymptoms();
        res.status(200).json(symptoms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

sy.get("/symptoms/:id", (req, res) => {
    try {
        const { id } = req.params;
        const symptom = getSymptomById(id);
        
        if (!symptom) {
            return res.status(404).json({ error: "Symptom not found" });
        }
        
        res.status(200).json(symptom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

sy.put("/symptoms/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Description } = req.body;
        
        if (!Name || !Description) {
            return res.status(400).json({ 
                error: "Missing required fields: Name, Description" 
            });
        }
        
        const result = updatesymptom(id, Name, Description);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: "Symptom not found" });
        }
        
        res.status(200).json({ 
            message: "Symptom updated successfully",
            changes: result.changes 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

sy.delete("/symptoms/:id", (req, res) => {
    try {
        const { id } = req.params;
        const result = deleteSymptom(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: "Symptom not found" });
        }
        
        res.status(200).json({ 
            message: "Symptom deleted successfully",
            changes: result.changes 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default sy;
