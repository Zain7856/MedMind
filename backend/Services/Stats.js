import db from "./db.js";

function countRows(sql) {
    return db.prepare(sql).get().count;
}

// The three numbers on the home page.
function getStats() {
    return {
        doctors: countRows("SELECT COUNT(*) AS count FROM users WHERE Role = 'Doctor' AND ApprovalStatus = 'Approved'"),
        hospitals: countRows("SELECT COUNT(*) AS count FROM users WHERE Role = 'Hospital' AND ApprovalStatus = 'Approved'"),
        diseases: countRows("SELECT COUNT(*) AS count FROM diseases")
    };
}

export { getStats }
