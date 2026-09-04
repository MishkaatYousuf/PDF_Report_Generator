import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("report.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export default db;