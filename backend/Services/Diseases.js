import db from "./db.js";

function getDiseases() {
    return db.prepare("SELECT ID, Name, Description FROM diseases ORDER BY Name").all();
}

// One disease, with its symptoms as a list: disease.Symptoms = [{ ID, Name, Description }, ...]
function getDisease(ID) {
    const disease = db.prepare("SELECT * FROM diseases WHERE ID = ?").get(ID);
    if (!disease) return undefined;

    disease.Symptoms = db.prepare(
        "SELECT s.ID, s.Name, s.Description FROM symptomdiseases sd " +
        "JOIN symptoms s ON s.ID = sd.SymptomID WHERE sd.DiseaseID = ? ORDER BY s.Name"
    ).all(ID);
    return disease;
}

// Throws the old links away and saves the ticked ones.
function setDiseaseSymptoms(DiseaseID, SymptomIDs) {
    db.prepare("DELETE FROM symptomdiseases WHERE DiseaseID = ?").run(DiseaseID);
    for (const SymptomID of SymptomIDs) {
        db.prepare("INSERT OR IGNORE INTO symptomdiseases (SymptomID, DiseaseID) VALUES (?, ?)").run(SymptomID, DiseaseID);
    }
}

function addDisease(Name, Description, Treatment, SymptomIDs) {
    const result = db.prepare(
        "INSERT INTO diseases (Name, Description, Treatment) VALUES (?, ?, ?)"
    ).run(Name, Description ?? null, Treatment ?? null);
    setDiseaseSymptoms(result.lastInsertRowid, SymptomIDs);
    return result.lastInsertRowid;
}

function updateDisease(ID, Name, Description, Treatment, SymptomIDs) {
    const result = db.prepare(
        "UPDATE diseases SET Name = ?, Description = ?, Treatment = ? WHERE ID = ?"
    ).run(Name, Description ?? null, Treatment ?? null, ID);
    setDiseaseSymptoms(ID, SymptomIDs);
    return result;
}

function deleteDisease(ID) {
    return db.prepare("DELETE FROM diseases WHERE ID = ?").run(ID);
}

export { getDiseases, getDisease, addDisease, updateDisease, deleteDisease }
