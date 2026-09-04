import db from "./database.js";

export function createPendingReport() {
  const createdAt = new Date().toISOString();

  const result = db
    .prepare(`
      INSERT INTO reports (
        path,
        created_at
      )
      VALUES (?, ?)
    `)
    .run("pending", createdAt);

  return {
    id: Number(result.lastInsertRowid),
    created_at: createdAt
  };
}

export function updateReportPath(id, path) {
  db
    .prepare(`
      UPDATE reports
      SET path = ?
      WHERE id = ?
    `)
    .run(path, id);

  return getReportById(id);
}

export function getReportById(id) {
  return db
    .prepare(`
      SELECT
        id,
        path,
        created_at
      FROM reports
      WHERE id = ?
    `)
    .get(id);
}