import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

import { getReportData, getAllOrders } from "./reportData.js";
import { buildReportHtml } from "./reportTemplate.js";

export async function generatePdf(outputPath) {
  const reportData = getReportData();
  const orders = getAllOrders();

  const html = buildReportHtml(reportData, orders);

  await mkdir("reports", { recursive: true });

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load"
    });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true
    });
  } finally {
    await browser.close();
  }

  return outputPath;
}