import db from "./db.js";
import { getuserById } from "./Users.js";

async function createAppointment(UserID, ProviderID, ProviderType, AppointmentDate, Status) {
    const userQuery = db.prepare("SELECT ID FROM users WHERE ID = ?");
    const user = userQuery.get(UserID);
    if (!user) {
        throw new Error(`User with ID ${UserID} does not exist`);
    }

    let ProviderIDValid = null;
    let ProviderTypeValid = null;

    if (ProviderType === 'Doctor' || ProviderType === 'Hospital') {
        const providerQuery = db.prepare("SELECT ID FROM users WHERE ID = ? AND Role = ?");
        const provider = providerQuery.get(ProviderID, ProviderType);
        if (!provider) {
            throw new Error(`Provider with ID ${ProviderID} and role ${ProviderType} does not exist`);
        }
        ProviderIDValid = ProviderID;
        ProviderTypeValid = ProviderType;
    } else {
        throw new Error("ProviderType must be 'Doctor' or 'Hospital'");
    }

    const appointmentStatus = Status || 'Pending';
    const query = db.prepare(
        "INSERT INTO appointments (UserID, ProviderID, ProviderType, AppointmentDate, Status) VALUES (?, ?, ?, ?, ?)"
    );
    const result = query.run(UserID, ProviderIDValid, ProviderTypeValid, AppointmentDate, appointmentStatus);
    return result.lastInsertRowid;
}

function getallAppointments() {
    const query = db.prepare(`
        SELECT a.*, u.Name as UserName, p.Name as ProviderName, p.Role as ProviderType
        FROM appointments a
        LEFT JOIN users u ON a.UserID = u.ID
        LEFT JOIN users p ON a.ProviderID = p.ID
    `);
    const result = query.all();
    return result;
}

function getAppointmentById(ID) {
    const query = db.prepare(`
        SELECT a.*, u.Name as UserName, p.Name as ProviderName, p.Role as ProviderType
        FROM appointments a
        LEFT JOIN users u ON a.UserID = u.ID
        LEFT JOIN users p ON a.ProviderID = p.ID
        WHERE a.ID = ?
    `);
    const result = query.get(ID);
    return result;
}

function getAppointmentsByDoctorUserId(doctorUserId) {
    const query = db.prepare(`
        SELECT a.*, u.Name as UserName, u.Phone as PatientPhone, u.Age as PatientAge, p.Name as ProviderName, p.Role as ProviderType
        FROM appointments a
        JOIN users u ON a.UserID = u.ID
        JOIN users p ON a.ProviderID = p.ID
        WHERE p.ID = ?
    `);
    const result = query.all(doctorUserId);
    return result;
}

function getAppointmentsByHospitalUserId(hospitalUserId) {
    const query = db.prepare(`
        SELECT a.*, u.Name as UserName, u.Phone as PatientPhone, u.Age as PatientAge, p.Name as ProviderName, p.Role as ProviderType
        FROM appointments a
        JOIN users u ON a.UserID = u.ID
        JOIN users p ON a.ProviderID = p.ID
        WHERE p.ID = ?
    `);
    const result = query.all(hospitalUserId);
    return result;
}

function updateAppointment(ID, UserID, ProviderID, ProviderType, AppointmentDate, Status) {
    try {
        const query = db.prepare(
            "UPDATE appointments SET UserID = ?, ProviderID = ?, ProviderType = ?, AppointmentDate = ?, Status = ? WHERE ID = ?"
        );
        const result = query.run(UserID, ProviderID || null, ProviderType || null, AppointmentDate, Status, ID);
        return result;
    } catch (error) {
        console.error("Error updating appointment:", error.message);
        throw error;
    }
}

function updateAppointmentStatus(ID, Status) {
    try {
        const query = db.prepare("UPDATE appointments SET Status = ? WHERE ID = ?");
        const result = query.run(Status, ID);
        return result;
    } catch (error) {
        console.error("Error updating appointment status:", error.message);
        throw error;
    }
}

function deleteAppointment(ID) {
    try {
        const query = db.prepare("DELETE FROM appointments WHERE ID = ?");
        const result = query.run(ID);
        return result;
    } catch (error) {
        console.error("Error deleting appointment:", error.message);
        throw error;
    }
}

export {
    createAppointment,
    getallAppointments,
    getAppointmentById,
    getAppointmentsByDoctorUserId,
    getAppointmentsByHospitalUserId,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment
}
