#!/usr/bin/env node
// Usage: pnpm pdf:clean path/to/form.pdf
// Removes borders and backgrounds from all form fields in the PDF (in place).

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, PDFName } from "@cantoo/pdf-lib";

/** Removes borders and backgrounds from all form fields in place. */
export function stripFormFieldStyles(pdfDoc) {
  const form = pdfDoc.getForm();
  for (const field of form.getFields()) {
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(PDFName.of("AP"));
      const borderStyle = widget.getOrCreateBorderStyle?.();
      if (borderStyle) borderStyle.setWidth(0);
      const ac = widget.getOrCreateAppearanceCharacteristics?.();
      if (ac) {
        ac.dict.delete(PDFName.of("BG"));
        ac.dict.delete(PDFName.of("BC"));
      }
    }
  }
}

async function main() {
  const pathArg = process.argv[2];
  if (!pathArg) {
    console.error("Usage: pnpm pdf:clean path/to/form.pdf");
    process.exit(1);
  }

  const pdfPath = resolve(process.cwd(), pathArg);
  let pdfDoc;
  try {
    const bytes = readFileSync(pdfPath);
    pdfDoc = await PDFDocument.load(bytes);
  } catch (err) {
    console.error(`Failed to load PDF: ${err.message}`);
    process.exit(1);
  }

  stripFormFieldStyles(pdfDoc);
  const strippedBytes = await pdfDoc.save();
  writeFileSync(pdfPath, strippedBytes);
  console.log("Cleaned PDF:", pdfPath);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
