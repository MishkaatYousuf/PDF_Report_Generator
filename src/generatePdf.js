import { DatabaseSync } from "node:sqlite";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

import { getReportData } from "./reportData.js";
import { buildReportHtml } from "./reportTemplate.js";

export async function generateTestPdf() {
  const reportData = getReportData();

  const db = new DatabaseSync("report.db");

  const orders = db
    .prepare(`
      SELECT
        id,
        customer,
        product,
        amount,
        created_at
      FROM orders
      ORDER BY created_at DESC, id DESC
    `)
    .all();

  db.close();

  const html = buildReportHtml(reportData, orders);

  await mkdir("reports", { recursive: true });

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load"
    });

    await page.pdf({
      path: "reports/test.pdf",
      format: "A4",
      printBackground: true
    });
  } finally {
    await browser.close();
  }

  return "reports/test.pdf";
}