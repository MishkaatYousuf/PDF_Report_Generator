import { getReportData } from "../src/reportData.js";

const reportData = getReportData();

console.log(JSON.stringify(reportData, null, 2));