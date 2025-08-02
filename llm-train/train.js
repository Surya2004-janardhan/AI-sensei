const fs = require("fs");
const { DOMMatrix } = require("canvas");
global.DOMMatrix = DOMMatrix;
const path = require("path");
const { createWorker } = require("tesseract.js");
const { PDFDocument, rgb } = require("pdf-lib");
const { createCanvas } = require("canvas");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const inputPDF = "v.pdf";
const outputPDF = "jlpt-n5-vocabulary-list-OCR.pdf";

(async () => {
  const loadingTask = pdfjsLib.getDocument(inputPDF);
  const pdf = await loadingTask.promise;

  const worker = await createWorker("jpn+eng");
  const newPdf = await PDFDocument.create();

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    await page.render({ canvasContext: context, viewport }).promise;

    console.log(`🔍 OCR on page ${i + 1}...`);
    const {
      data: { text },
    } = await worker.recognize(canvas);

    const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
    const pngBytes = canvas.toBuffer("image/png");
    const embeddedImage = await newPdf.embedPng(pngBytes);

    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    pdfPage.drawText(text, {
      x: 30,
      y: 30,
      size: 10,
      color: rgb(1, 1, 1),
      maxWidth: viewport.width - 60,
      lineHeight: 12,
    });
  }

  await worker.terminate();

  fs.writeFileSync(outputPDF, await newPdf.save());
  console.log(`✅ Searchable OCR PDF saved as ${outputPDF}`);
})();
