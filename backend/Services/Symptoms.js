import db from "./db.js";

async function createsymptom(Name, Description) {
    const query = db.prepare(
        "INSERT INTO symptoms (Name,Description) VALUES (?, ?)"
    );
    const result = query.run(Name, Description);
    return result.lastInsertRowid;
}

function getallsymptoms() {
    const query = db.prepare("SELECT * FROM symptoms");
    const result = query.all();
    return result;
}

function getSymptomById(ID) {
    const query = db.prepare("SELECT * FROM symptoms WHERE ID = ?");
    const result = query.get(ID);
    return result;
}

function updatesymptom(ID, Name, Description) {
    try {
        const query = db.prepare(
            "UPDATE symptoms SET Name = ?, Description = ? WHERE ID = ?"
        );
        const result = query.run(Name, Description, ID);
        console.log(`Updated symptom with ID: ${ID}`);
        return result;
    } catch (error) {
        console.error("Error updating symptom:", error.message);
        throw error;
    }
}

function deleteSymptom(ID) {
    try {
        // Foreign key constraints with ON DELETE CASCADE will handle related records
        const query = db.prepare("DELETE FROM symptoms WHERE ID = ?");
        const result = query.run(ID);
        console.log(`Deleted symptom with ID: ${ID}`);
        return result;
    } catch (error) {
        console.error("Error deleting symptom:", error.message);
        throw error;
    }
}




export {
    createsymptom,
    getallsymptoms,
    getSymptomById,
    updatesymptom,
    deleteSymptom
}