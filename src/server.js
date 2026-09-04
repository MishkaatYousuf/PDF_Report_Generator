import express from "express";
import path from "node:path";

import "./database.js";

import { generatePdf } from "./generatePdf.js";
import {
  createPendingReport,
  updateReportPath,
  getReportById,
  getTodaysReport
} from "./reportRepository.js";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.post("/reports", async (req, res) => {
  try {
    const force = req.body?.force === true;

    if (!force) {
      const existingReport = getTodaysReport();

      if (existingReport) {
        return res.status(200).json({
          id: existingReport.id,
          file: `/reports/${existingReport.id}/file`
        });
      }
    }

    const pendingReport = createPendingReport();

    const relativePath = `reports/${pendingReport.id}.pdf`;

    await generatePdf(relativePath);

    const report = updateReportPath(
      pendingReport.id,
      relativePath
    );

    return res.status(201).json({
      id: report.id,
      file: `/reports/${report.id}/file`
    });
  } catch (error) {
    console.error("Failed to generate report:", error);

    return res.status(500).json({
      error: "Failed to generate report"
    });
  }
});

app.get("/reports/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      error: "Report not found"
    });
  }

  const report = getReportById(id);

  if (!report) {
    return res.status(404).json({
      error: "Report not found"
    });
  }

  res.status(200).json({
    id: report.id,
    path: report.path,
    created_at: report.created_at,
    file: `/reports/${report.id}/file`
  });
});

app.get("/reports/:id/file", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      error: "Report not found"
    });
  }

  const report = getReportById(id);

  if (!report) {
    return res.status(404).json({
      error: "Report not found"
    });
  }

  const absolutePath = path.resolve(report.path);

  res.sendFile(absolutePath, (error) => {
    if (error && !res.headersSent) {
      console.error("Failed to send report:", error);

      res.status(500).json({
        error: "Failed to send report"
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});