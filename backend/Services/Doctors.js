import db from "./db.js";
import { getuserById } from "./Users.js";

async function createDoctor(ID, Name, Img, Specialization, Phone, Location, cost, About) {
    const query = db.prepare(
        "INSERT INTO users (ID, Name, Img, Specialization, Phone, Location, cost, About, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Doctor')"
    );
    const result = query.run(ID || null, Name, Img ?? null, Specialization ?? null, Phone ?? null, Location ?? null, cost ?? null, About ?? null);
    return result.lastInsertRowid;
}

function getallDoctors() {
    const query = db.prepare("SELECT * FROM users WHERE Role = 'Doctor'");
    const result = query.all();
    return result;
}

function getDoctorById(ID) {
    const query = db.prepare("SELECT * FROM users WHERE ID = ? AND Role = 'Doctor'");
    const result = query.get(ID);
    return result;
}

function getDoctorByUserId(ID) {
    const query = db.prepare("SELECT * FROM users WHERE ID = ? AND Role = 'Doctor'");
    const result = query.get(ID);
    return result;
}

function upsertDoctorProfile(ID, Name, Img, Specialization, Phone, Location, cost, About) {
    const existing = getDoctorById(ID);
    if (existing) {
        return updateDoctor(ID, Name, Img, Specialization, Phone, Location, cost, About);
    } else {
        return createDoctor(ID, Name, Img, Specialization, Phone, Location, cost, About);
    }
}

function updateDoctor(ID, Name, Img, Specialization, Phone, Location, cost, About) {
    try {
        const query = db.prepare(
            "UPDATE users SET Name = ?, Img = ?, Specialization = ?, Phone = ?, Location = ?, cost = ?, About = ? WHERE ID = ? AND Role = 'Doctor'"
        );
        const result = query.run(Name, Img ?? null, Specialization, Phone, Location, cost, About ?? null, ID);
        return result;
    } catch (error) {
        console.error("Error updating Doctor:", error.message);
        throw error;
    }
}

function deleteDoctor(ID) {
    try {
        const query = db.prepare("DELETE FROM users WHERE ID = ? AND Role = 'Doctor'");
        const result = query.run(ID);
        return result;
    } catch (error) {
        console.error("Error deleting Doctor:", error.message);
        throw error;
    }
}

function createHospital(ID, Name, Location, Phone, img, Services) {
    const query = db.prepare(
        "INSERT INTO users (ID, Name, Location, Phone, img, Services, Role) VALUES (?, ?, ?, ?, ?, ?, 'Hospital')"
    );
    const result = query.run(ID || null, Name, Location || null, Phone || null, img || null, Services || null);
    return result.lastInsertRowid;
}

function getallHospitals() {
    const query = db.prepare("SELECT * FROM users WHERE Role = 'Hospital'");
    const result = query.all();
    return result;
}

function getHospitalById(ID) {
    const query = db.prepare("SELECT * FROM users WHERE ID = ? AND Role = 'Hospital'");
    const result = query.get(ID);
    return result;
}

function getHospitalByName(Name) {
    const query = db.prepare("SELECT * FROM users WHERE Name = ? AND Role = 'Hospital'");
    const result = query.get(Name);
    return result;
}

function getHospitalByUserId(ID) {
    const query = db.prepare("SELECT * FROM users WHERE ID = ? AND Role = 'Hospital'");
    const result = query.get(ID);
    return result;
}

function upsertHospitalProfile(ID, Name, Location, Phone, img, Services) {
    const existing = getHospitalById(ID);
    if (existing) {
        return updateHospital(ID, Name, Location, Phone, img, Services);
    } else {
        return createHospital(ID, Name, Location, Phone, img, Services);
    }
}

function updateHospital(ID, Name, Location, Phone, img, Services) {
    try {
        const query = db.prepare(
            "UPDATE users SET Name = ?, Location = ?, Phone = ?, img = ?, Services = ? WHERE ID = ? AND Role = 'Hospital'"
        );
        const result = query.run(Name, Location, Phone, img || null, Services || null, ID);
        return result;
    } catch (error) {
        console.error("Error updating Hospital:", error.message);
        throw error;
    }
}

function deleteHospital(ID) {
    try {
        const query = db.prepare("DELETE FROM users WHERE ID = ? AND Role = 'Hospital'");
        const result = query.run(ID);
        return result;
    } catch (error) {
        console.error("Error deleting Hospital:", error.message);
        throw error;
    }
}

export {
    createDoctor,
    getallDoctors,
    getDoctorById,
    getDoctorByUserId,
    upsertDoctorProfile,
    updateDoctor,
    deleteDoctor,
    createHospital,
    getallHospitals,
    getHospitalById,
    getHospitalByName,
    getHospitalByUserId,
    upsertHospitalProfile,
    updateHospital,
    deleteHospital
}
