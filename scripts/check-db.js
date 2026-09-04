import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("report.db");

const count = db
  .prepare("SELECT COUNT(*) AS count FROM orders")
  .get();

console.log(`Order count: ${count.count}`);

const sampleOrders = db
  .prepare(`
    SELECT
      id,
      customer,
      product,
      amount,
      created_at
    FROM orders
    ORDER BY id
    LIMIT 5
  `)
  .all();

console.table(sampleOrders);

db.close();