import db from "./db.js";

async function createSymptomDisease(SymptomID, DiseaseID) {
    const query = db.prepare(
        "INSERT OR IGNORE INTO symptomdiseases (SymptomID, DiseaseID) VALUES (?, ?)"
    );
    const result = query.run(SymptomID, DiseaseID);
    return result.changes;
}

function getAllSymptomDiseases() {
    const query = db.prepare(`
        SELECT sd.SymptomID, sd.DiseaseID, 
               s.Name as SymptomName, d.Name as DiseaseName 
        FROM symptomdiseases sd 
        JOIN symptoms s ON sd.SymptomID = s.ID 
        JOIN diseases d ON sd.DiseaseID = d.ID
    `);
    const result = query.all();
    return result;
}

function getSymptomDiseasesBySymptomId(SymptomID) {
    const query = db.prepare(`
        SELECT sd.SymptomID, sd.DiseaseID, 
               s.Name as SymptomName, d.Name as DiseaseName 
        FROM symptomdiseases sd 
        JOIN symptoms s ON sd.SymptomID = s.ID 
        JOIN diseases d ON sd.DiseaseID = d.ID 
        WHERE sd.SymptomID = ?
    `);
    const result = query.all(SymptomID);
    return result;
}

function getSymptomDiseaseById(SymptomID, DiseaseID) {
    const query = db.prepare(`
        SELECT sd.SymptomID, sd.DiseaseID, 
               s.Name as SymptomName, d.Name as DiseaseName 
        FROM symptomdiseases sd 
        JOIN symptoms s ON sd.SymptomID = s.ID 
        JOIN diseases d ON sd.DiseaseID = d.ID 
        WHERE sd.SymptomID = ? AND sd.DiseaseID = ?
    `);
    const result = query.get(SymptomID, DiseaseID);
    return result;
}

function deleteSymptomDisease(SymptomID, DiseaseID) {
    try {
        const query = db.prepare("DELETE FROM symptomdiseases WHERE SymptomID = ? AND DiseaseID = ?");
        const result = query.run(SymptomID, DiseaseID);
        console.log(`Deleted symptom disease link: Symptom ${SymptomID}, Disease ${DiseaseID}`);
        return result;
    } catch (error) {
        console.error("Error deleting symptom disease:", error.message);
        throw error;
    }
}

export {
    createSymptomDisease,
    getAllSymptomDiseases,
    getSymptomDiseasesBySymptomId,
    getSymptomDiseaseById,
    deleteSymptomDisease
}
