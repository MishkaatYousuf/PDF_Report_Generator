import { generateTestPdf } from "../src/generatePdf.js";

try {
  const outputPath = await generateTestPdf();

  console.log(`PDF generated successfully: ${outputPath}`);
} catch (error) {
  console.error("Failed to generate PDF:");
  console.error(error);

  process.exit(1);
}