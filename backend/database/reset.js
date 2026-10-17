// This script deletes the old database and rebuilds a fresh one from app.sql.
import { rmSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const dbPath = fileURLToPath(new URL("app.db", import.meta.url));
const walPath = fileURLToPath(new URL("app.db-wal", import.meta.url));
const shmPath = fileURLToPath(new URL("app.db-shm", import.meta.url));
const sqlPath = fileURLToPath(new URL("app.sql", import.meta.url));

// Remove the old database file and any temporary journal files.
try {
  rmSync(dbPath, { force: true });
  rmSync(walPath, { force: true });
  rmSync(shmPath, { force: true });
} catch (error) {
  if (error.code === "EBUSY" || error.code === "EPERM") {
    console.error(
      "\nCannot reset database: 'app.db' is locked by a running process.\n" +
      "Please stop the server first (press Ctrl + C in the 'npm run dev' terminal), then run 'npm run db:reset' again.\n"
    );
    process.exit(1);
  }
  throw error;
}

// Read the setup instructions from app.sql.
const sql = readFileSync(sqlPath, "utf8");

// Open a fresh database file and run all the SQL commands.
const db = new DatabaseSync(dbPath);
db.exec(sql);
db.close();

console.log("Database reset successfully from app.sql!");
