import db from "./db.js";

function countUsersByRole(Role) {
    const query = db.prepare("SELECT COUNT(*) AS count FROM users WHERE Role = ?");
    const result = query.get(Role);
    return result.count;
}

function getStats() {
    const doctors = countUsersByRole("Doctor");
    const hospitals = countUsersByRole("Hospital");

    const diseaseQuery = db.prepare("SELECT COUNT(*) AS count FROM diseases");
    const diseases = diseaseQuery.get().count;

    return { doctors, hospitals, diseases };
}

export {
    getStats
}
