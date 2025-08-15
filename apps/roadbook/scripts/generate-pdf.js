const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // List of documentation slugs to export
  const docs = ['intro', 'getting-started'];

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../pdf');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const doc of docs) {
    const url = `http://localhost:3000/docs/${doc}`;
    // Navigate to the documentation page. Assumes dev server is running.
    await page.goto(url, { waitUntil: 'networkidle0' });
    const filePath = path.join(outputDir, `${doc}.pdf`);
    await page.pdf({ path: filePath, format: 'A4' });
    console.log(`Generated PDF for ${doc} at ${filePath}`);
  }

  await browser.close();
}

generatePDF().catch((err) => {
  console.error(err);
  process.exit(1);
});
