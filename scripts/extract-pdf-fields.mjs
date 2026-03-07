#!/usr/bin/env node
/**
 * Extract AcroForm field names from PDFs and generate .types.ts files.
 * Usage: pnpm pdf:extract-fields [path/to/file.pdf]
 *   - No arg: process all .pdf files in src/pdfs
 *   - With arg: process single PDF file
 */

import { intro, log, taskLog } from "@clack/prompts";
import { PDFDocument } from "@cantoo/pdf-lib";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PDFS_DIR = join(ROOT, "src/pdfs");

function findPdfFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findPdfFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".pdf")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function extractFieldNames(pdfPath) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const fields = form.getFields();
  return fields.map((f) => f.getName());
}

function generateTypesContent(stem, fieldNames) {
  return `/** Auto-generated from ${stem}.pdf — do not edit */
export const pdfFieldNames = ${JSON.stringify(fieldNames)} as const;
export type PdfFieldName = (typeof pdfFieldNames)[number];
`;
}

async function processPdf(pdfPath, task) {
  const dir = dirname(pdfPath);
  const filename = basename(pdfPath);
  const stem = filename.slice(0, -extname(filename).length);
  const typesPath = join(dir, `${stem}.types.ts`);

  try {
    const fieldNames = await extractFieldNames(pdfPath);
    const content = generateTypesContent(stem, fieldNames);
    writeFileSync(typesPath, content);
    const displayPath = relative(PDFS_DIR, join(dir, stem));
    task?.message(`${displayPath}\n→ extracted ${fieldNames.length} fields`);
    return { path: typesPath, count: fieldNames.length };
  } catch (err) {
    task?.error(err.message);
    throw err;
  }
}

async function main() {
  intro("PDF Field Extraction");

  const arg = process.argv[2];
  let pdfPaths;

  if (arg) {
    const resolved = resolve(process.cwd(), arg);
    pdfPaths = [resolved];
    if (!resolved.endsWith(".pdf")) {
      log.error("Path must be a .pdf file");
      process.exit(1);
    }
  } else {
    pdfPaths = findPdfFiles(PDFS_DIR);
  }

  if (pdfPaths.length === 0) {
    log.warn("No PDF files found in src/pdfs");
    return;
  }

  const task = taskLog({ title: "Extracting fields", retainLog: true });
  const typesPaths = [];
  for (const pdfPath of pdfPaths) {
    const result = await processPdf(pdfPath, task);
    typesPaths.push(result.path);
  }

  task.message("Formatting with Biome...");
  spawnSync("pnpm", ["exec", "biome", "format", "--write", ...typesPaths], {
    cwd: ROOT,
    stdio: "inherit",
  });

  task.success(`Extracted types for ${pdfPaths.length} PDFs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
