#!/usr/bin/env node

/**
 * Extract AcroForm field names from PDFs and generate schema.ts files.
 * Usage: pnpm pdf:schema [path/to/file.pdf] [--quiet]
 *   - No arg: process all .pdf files in src/pdfs
 *   - With arg: process single PDF file
 *   - --quiet: suppress intro, progress, and success output (for use by define-pdf)
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import { intro, log, taskLog } from "@clack/prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PDFS_DIR = join(ROOT, "src/pdfs");

function findPdfFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findPdfFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".pdf")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function extractFields(pdfPath) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const fields = form.getFields();
  return fields.map((f) => ({
    name: f.getName(),
    fieldClass: f.constructor.name,
  }));
}

function escapeKey(key) {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) return key;
  return JSON.stringify(key);
}

function generateTypesContent(stem, fields) {
  const usedClasses = [...new Set(fields.map((f) => f.fieldClass))];
  const imports =
    usedClasses.length > 0
      ? `import { ${usedClasses.sort().join(", ")} } from "@cantoo/pdf-lib";`
      : "";
  const schemaEntries = fields
    .map((f) => `  ${escapeKey(f.name)}: ${f.fieldClass}`)
    .join(",\n");
  const schemaBody = schemaEntries ? `\n${schemaEntries},\n` : "\n";
  return `/** Auto-generated from ${stem}.pdf — do not edit */
${imports}

export const pdfSchema = {${schemaBody}} as const;

export type PdfFieldName = keyof typeof pdfSchema;
`;
}

async function processPdf(pdfPath, task) {
  const dir = dirname(pdfPath);
  const filename = basename(pdfPath);
  const stem = filename.slice(0, -extname(filename).length);
  const schemaPath = join(dir, "schema.ts");

  try {
    const fields = await extractFields(pdfPath);
    const content = generateTypesContent(stem, fields);
    writeFileSync(schemaPath, content);
    const displayPath = relative(PDFS_DIR, join(dir, stem));
    const checkboxCount = fields.filter(
      (f) => f.fieldClass === "PDFCheckBox",
    ).length;
    task?.message(
      `${displayPath}\n→ extracted ${fields.length} fields (${checkboxCount} checkbox)`,
    );
    return { path: schemaPath, count: fields.length };
  } catch (err) {
    task?.error(err.message);
    throw err;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const quiet = argv.includes("--quiet");
  const arg = argv.find((a) => a !== "--quiet");

  if (!quiet) intro("PDF Schema Extraction");

  let pdfPaths;

  if (arg) {
    const resolved = resolve(process.cwd(), arg);
    pdfPaths = [resolved];
    if (!resolved.endsWith(".pdf")) {
      if (!quiet) log.error("Path must be a .pdf file");
      process.exit(1);
    }
  } else {
    pdfPaths = findPdfFiles(PDFS_DIR);
  }

  if (pdfPaths.length === 0) {
    if (!quiet) log.warn("No PDF files found in src/pdfs");
    return;
  }

  const task = quiet
    ? null
    : taskLog({ title: "Extracting schema", retainLog: true });
  const schemaPaths = [];
  for (const pdfPath of pdfPaths) {
    const result = await processPdf(pdfPath, task);
    schemaPaths.push(result.path);
  }

  if (!quiet) task.message("Formatting with Biome...");
  const result = spawnSync(
    "pnpm",
    ["exec", "biome", "format", "--write", ...schemaPaths],
    {
      cwd: ROOT,
      stdio: quiet ? "pipe" : "inherit",
    },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  if (!quiet) task.success(`Extracted schema for ${pdfPaths.length} PDFs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
