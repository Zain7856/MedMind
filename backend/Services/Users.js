import db from "./db.js";

// Every column except Password. The browser must never get passwords.
const SAFE_COLUMNS = "ID, Name, Email, Age, Phone, Role, Specialization, Location, Cost, About, Img, Services, ApprovalStatus";

// Full row, including Password. Only for login checks.
function findUserByEmail(Email) {
    return db.prepare("SELECT * FROM users WHERE Email = ?").get(Email);
}

function findUserById(ID) {
    return db.prepare("SELECT * FROM users WHERE ID = ?").get(ID);
}

// Same as findUserById but without the password. Safe to send to the browser.
function getUser(ID) {
    return db.prepare("SELECT " + SAFE_COLUMNS + " FROM users WHERE ID = ?").get(ID);
}

function getUsers() {
    return db.prepare("SELECT " + SAFE_COLUMNS + " FROM users ORDER BY ID").all();
}

// user is an object like { Name, Email, Password, Age, Phone, Role, ApprovalStatus, ... }
function addUser(user) {
    const result = db.prepare(
        "INSERT INTO users (Name, Email, Password, Age, Phone, Role, Specialization, Location, Cost, About, Img, Services, ApprovalStatus) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
        user.Name, user.Email, user.Password, user.Age ?? null, user.Phone ?? null, user.Role,
        user.Specialization ?? null, user.Location ?? null, user.Cost ?? null,
        user.About ?? null, user.Img ?? null, user.Services ?? null, user.ApprovalStatus
    );
    return result.lastInsertRowid;
}

// Changes everything a person can edit about themselves. Role and Password are not in here on purpose.
function updateUser(ID, user) {
    return db.prepare(
        "UPDATE users SET Name = ?, Email = ?, Age = ?, Phone = ?, Specialization = ?, Location = ?, Cost = ?, About = ?, Img = ?, Services = ? WHERE ID = ?"
    ).run(
        user.Name, user.Email, user.Age ?? null, user.Phone ?? null,
        user.Specialization ?? null, user.Location ?? null, user.Cost ?? null,
        user.About ?? null, user.Img ?? null, user.Services ?? null, ID
    );
}

function setPassword(ID, Password) {
    return db.prepare("UPDATE users SET Password = ? WHERE ID = ?").run(Password, ID);
}

function setApprovalStatus(ID, ApprovalStatus) {
    return db.prepare("UPDATE users SET ApprovalStatus = ? WHERE ID = ?").run(ApprovalStatus, ID);
}

// Their appointments are deleted too (ON DELETE CASCADE in the schema).
function deleteUser(ID) {
    return db.prepare("DELETE FROM users WHERE ID = ?").run(ID);
}

export {
    findUserByEmail,
    findUserById,
    getUser,
    getUsers,
    addUser,
    updateUser,
    setPassword,
    setApprovalStatus,
    deleteUser
}
