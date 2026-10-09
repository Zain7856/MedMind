import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

// The whole database is one file: backend/database/app.db
const dbPath = fileURLToPath(new URL("../database/app.db", import.meta.url));
const db = new DatabaseSync(dbPath);

// Without this, deleting a user would not delete their appointments.
db.exec("PRAGMA foreign_keys = ON");

export default db;
