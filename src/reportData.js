import { DatabaseSync } from "node:sqlite";

export function getReportData() {
  const db = new DatabaseSync("report.db");

  const totalOrders = db
    .prepare(`
      SELECT COUNT(*) AS total_orders
      FROM orders
    `)
    .get();

  const totalRevenue = db
    .prepare(`
      SELECT ROUND(SUM(amount), 2) AS total_revenue
      FROM orders
    `)
    .get();

  const topProducts = db
    .prepare(`
      SELECT
        product,
        COUNT(*) AS order_count,
        ROUND(SUM(amount), 2) AS revenue
      FROM orders
      GROUP BY product
      ORDER BY revenue DESC
      LIMIT 5
    `)
    .all();

  const ordersPerDay = db
    .prepare(`
      SELECT
        created_at,
        COUNT(*) AS order_count
      FROM orders
      WHERE created_at >= date('now', '-6 days')
      GROUP BY created_at
      ORDER BY created_at ASC
    `)
    .all();

  db.close();

  return {
    totalOrders: totalOrders.total_orders,
    totalRevenue: totalRevenue.total_revenue ?? 0,
    topProducts,
    ordersPerDay
  };
}