import db from "./db.js";

function getSymptoms() {
    return db.prepare("SELECT ID, Name, Description FROM symptoms ORDER BY Name").all();
}

// One symptom, with the diseases that have it: symptom.Diseases = [{ ID, Name }, ...]
function getSymptom(ID) {
    const symptom = db.prepare("SELECT ID, Name, Description FROM symptoms WHERE ID = ?").get(ID);
    if (!symptom) return undefined;

    symptom.Diseases = db.prepare(
        "SELECT d.ID, d.Name FROM symptomdiseases sd " +
        "JOIN diseases d ON d.ID = sd.DiseaseID WHERE sd.SymptomID = ? ORDER BY d.Name"
    ).all(ID);
    return symptom;
}

function addSymptom(Name, Description) {
    const result = db.prepare("INSERT INTO symptoms (Name, Description) VALUES (?, ?)").run(Name, Description ?? null);
    return result.lastInsertRowid;
}

function updateSymptom(ID, Name, Description) {
    return db.prepare("UPDATE symptoms SET Name = ?, Description = ? WHERE ID = ?").run(Name, Description ?? null, ID);
}

function deleteSymptom(ID) {
    return db.prepare("DELETE FROM symptoms WHERE ID = ?").run(ID);
}

// The symptom checker. Gives back the diseases that have at least one of the ticked
// symptoms, the one with the most matching symptoms first.
function checkSymptoms(SymptomIDs) {
    // One "?" for each ticked symptom, like "?, ?, ?"
    const marks = SymptomIDs.map(() => "?").join(", ");
    return db.prepare(
        "SELECT d.ID, d.Name, d.Description, COUNT(*) AS Matches " +
        "FROM symptomdiseases sd JOIN diseases d ON d.ID = sd.DiseaseID " +
        "WHERE sd.SymptomID IN (" + marks + ") " +
        "GROUP BY d.ID ORDER BY Matches DESC, d.Name"
    ).all(...SymptomIDs);
}

export { getSymptoms, getSymptom, addSymptom, updateSymptom, deleteSymptom, checkSymptoms }
