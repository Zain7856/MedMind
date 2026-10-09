import db from "./db.js";

function addAppointment(UserID, ProviderID, AppointmentDate) {
    const result = db.prepare(
        "INSERT INTO appointments (UserID, ProviderID, AppointmentDate, Status) VALUES (?, ?, ?, 'Pending')"
    ).run(UserID, ProviderID, AppointmentDate);
    return result.lastInsertRowid;
}

// What a patient sees: who they booked.
function getPatientAppointments(UserID) {
    return db.prepare(
        "SELECT a.ID, a.AppointmentDate, a.Status, p.Name AS ProviderName, p.Role AS ProviderRole " +
        "FROM appointments a JOIN users p ON p.ID = a.ProviderID " +
        "WHERE a.UserID = ? ORDER BY a.AppointmentDate"
    ).all(UserID);
}

// What a doctor or hospital sees: who booked them.
function getProviderAppointments(ProviderID) {
    return db.prepare(
        "SELECT a.ID, a.AppointmentDate, a.Status, u.Name AS PatientName, u.Phone AS PatientPhone " +
        "FROM appointments a JOIN users u ON u.ID = a.UserID " +
        "WHERE a.ProviderID = ? ORDER BY a.AppointmentDate"
    ).all(ProviderID);
}

function setAppointmentStatus(ID, Status) {
    return db.prepare("UPDATE appointments SET Status = ? WHERE ID = ?").run(Status, ID);
}

export { addAppointment, getPatientAppointments, getProviderAppointments, setAppointmentStatus }
