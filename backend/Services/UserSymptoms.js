import db from "./db.js";

async function createUserSymptom(UserID, SymptomID) {
    const query = db.prepare(
        "INSERT OR IGNORE INTO usersymptoms (UserID, SymptomID) VALUES (?, ?)"
    );
    const result = query.run(UserID, SymptomID);
    return result.changes;
}

function getAllUserSymptoms() {
    const query = db.prepare(`
        SELECT us.UserID, us.SymptomID, 
               u.Name as UserName, s.Name as SymptomName 
        FROM usersymptoms us 
        JOIN users u ON us.UserID = u.ID 
        JOIN symptoms s ON us.SymptomID = s.ID
    `);
    const result = query.all();
    return result;
}

function getUserSymptomsByUserId(UserID) {
    const query = db.prepare(`
        SELECT us.UserID, us.SymptomID, 
               u.Name as UserName, s.Name as SymptomName, s.Description 
        FROM usersymptoms us 
        JOIN users u ON us.UserID = u.ID 
        JOIN symptoms s ON us.SymptomID = s.ID 
        WHERE us.UserID = ?
    `);
    const result = query.all(UserID);
    return result;
}

function getUserSymptomById(UserID, SymptomID) {
    const query = db.prepare(`
        SELECT us.UserID, us.SymptomID, 
               u.Name as UserName, s.Name as SymptomName, s.Description 
        FROM usersymptoms us 
        JOIN users u ON us.UserID = u.ID 
        JOIN symptoms s ON us.SymptomID = s.ID 
        WHERE us.UserID = ? AND us.SymptomID = ?
    `);
    const result = query.get(UserID, SymptomID);
    return result;
}

function deleteUserSymptom(UserID, SymptomID) {
    try {
        const query = db.prepare("DELETE FROM usersymptoms WHERE UserID = ? AND SymptomID = ?");
        const result = query.run(UserID, SymptomID);
        console.log(`Deleted user symptom link: User ${UserID}, Symptom ${SymptomID}`);
        return result;
    } catch (error) {
        console.error("Error deleting user symptom:", error.message);
        throw error;
    }
}

export {
    createUserSymptom,
    getAllUserSymptoms,
    getUserSymptomsByUserId,
    getUserSymptomById,
    deleteUserSymptom
}
