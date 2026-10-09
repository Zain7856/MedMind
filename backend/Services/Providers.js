import db from "./db.js";

// The columns a doctor or hospital card needs. No Email, no Password.
const CARD_COLUMNS = "ID, Name, Phone, Role, Specialization, Location, Cost, About, Img, Services";

// Role is 'Doctor' or 'Hospital'. Only approved ones are listed.
function getProviders(Role) {
    return db.prepare(
        "SELECT " + CARD_COLUMNS + " FROM users WHERE Role = ? AND ApprovalStatus = 'Approved' ORDER BY Name"
    ).all(Role);
}

function getProvider(ID) {
    return db.prepare(
        "SELECT " + CARD_COLUMNS + " FROM users WHERE ID = ? AND Role IN ('Doctor', 'Hospital') AND ApprovalStatus = 'Approved'"
    ).get(ID);
}

export { getProviders, getProvider }
