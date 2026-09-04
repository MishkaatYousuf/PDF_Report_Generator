import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("report.db");

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    product TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at TEXT NOT NULL
  )
`;

db.exec(createTableSQL);

db.exec("DELETE FROM orders");

const products = [
  "Classic T-Shirt",
  "Canvas Sneakers",
  "Denim Jacket",
  "Leather Wallet",
  "Cotton Hoodie",
  "Baseball Cap"
];

const customers = [
  "Ali Khan",
  "Sara Ahmed",
  "Hamza Malik",
  "Ayesha Noor",
  "Omar Hassan",
  "Zainab Ali",
  "Usman Tariq",
  "Maha Raza",
  "Bilal Sheikh",
  "Hira Aslam"
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomAmount() {
  return Number((Math.random() * (200 - 5) + 5).toFixed(2));
}

function randomDateWithinLast30Days() {
  const now = new Date();

  const daysAgo = Math.floor(Math.random() * 30);

  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString().split("T")[0];
}

const insertOrder = db.prepare(`
  INSERT INTO orders (
    customer,
    product,
    amount,
    created_at
  )
  VALUES (?, ?, ?, ?)
`);

for (let i = 0; i < 200; i++) {
  const customer = randomItem(customers);
  const product = randomItem(products);
  const amount = randomAmount();
  const createdAt = randomDateWithinLast30Days();

  insertOrder.run(
    customer,
    product,
    amount,
    createdAt
  );
}

const countResult = db
  .prepare("SELECT COUNT(*) AS count FROM orders")
  .get();

console.log(`Seed complete: ${countResult.count} orders inserted.`);

db.close();