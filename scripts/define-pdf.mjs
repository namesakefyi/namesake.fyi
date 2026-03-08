#!/usr/bin/env node
// Usage: pnpm pdf:define path/to/form.pdf
// Generates a PDF definition (index.ts, schema.ts) by mapping each form field to a field definition.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, PDFName } from "@cantoo/pdf-lib";
import * as clack from "@clack/prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT = join(__dirname, "..");
const FIELDS_PATH = join(ROOT, "src/constants/fields.ts");
const JURISDICTIONS_PATH = join(ROOT, "src/constants/jurisdictions.ts");
const PDF_TS_PATH = join(ROOT, "src/constants/pdf.ts");

const SKIP = "__skip__";
const CREATE_NEW = "__create_new__";
const CREATE_NEW_PREFIX = "__create_new__|";

const DEFINITION_EXISTS_MSG =
  "Definition already exists. Use a different form or remove the existing file first.";

const onCancel = () => exitWith("Operation canceled.", 0);

/** @param {{ type?: string }} field */
function isCheckboxOrRadio(field) {
  return field?.type === "checkbox" || field?.type === "radio";
}

/** Return true if the user chose to create a new field definition. */
function isCreateNewChoice(choice) {
  return choice === CREATE_NEW || String(choice).startsWith(CREATE_NEW_PREFIX);
}

/** Return true if a field definition with the given name exists. */
function fieldExistsInDefs(fieldDefs, name) {
  return fieldDefs.some((d) => d.name === name);
}

/** Exit the process with a Clack cancel message. */
function exitWith(message, code = 1) {
  clack.cancel(message);
  process.exit(code);
}

/** Validate that the form title is non-empty. */
function validateTitle(value) {
  if (!value?.trim()) return "Title is required";
  return undefined;
}

/** Return a validator for camelCase field names; optionally allow existing names. */
function validateFieldName(existingNames, { allowExisting = false } = {}) {
  return (value) => {
    const v = value?.trim() || "";
    if (!/^[a-z][a-zA-Z0-9]*$/.test(v))
      return "Use camelCase (e.g. myFieldName)";
    if (!allowExisting && existingNames.some((d) => d.name === v)) {
      return "Field already exists";
    }
    return undefined;
  };
}

/** Convert camelCase to a human-readable label (e.g. "residenceStreetAddress" → "Residence street address"). */
function fieldNameToLabel(name) {
  const words = String(name || "")
    .split(/(?=[A-Z])/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ");
}

/** Generate a suggested camelCase field name from a PDF field name; prefix "is" for checkbox/radio when needed. */
function generateFieldName(pdfFieldName, type) {
  const words = String(pdfFieldName || "")
    .split(/(?=[A-Z])|[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0].toLowerCase() + words[0].slice(1).toLowerCase();
  const rest = words
    .slice(1)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join("");
  const camel = first + rest;
  if (isCheckboxOrRadio({ type })) {
    const lower = camel.toLowerCase();
    if (
      !lower.startsWith("is") &&
      !lower.startsWith("should") &&
      !lower.startsWith("has")
    ) {
      return `is${camel[0].toUpperCase()}${camel.slice(1)}`;
    }
  }
  return camel;
}

/** Generate a PDF id from code and title (e.g. "CJP 27", "Petition to Change Name" → "cjp27-petition-to-change-name"). */
function generatePdfId(code, title) {
  const codePart = (code || "").replace(/[\s-]/g, "").toLowerCase();
  const titlePart = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!titlePart) return codePart || "form";
  return codePart ? `${codePart}-${titlePart}` : titlePart;
}

/** Filter field defs to those compatible with the PDF field type (boolean for checkbox/radio, string for text). */
function filterDefsByPdfFieldType(defs, pdfField) {
  if (isCheckboxOrRadio(pdfField)) {
    return defs.filter((d) => d.type === "boolean");
  }
  return defs.filter((d) => d.type === "string" || d.type === "string[]");
}

/** Parse jurisdictions from jurisdictions.ts (usaStates array). */
function loadJurisdictions() {
  const content = readFileSync(JURISDICTIONS_PATH, "utf8");
  const jurisdictions = [];
  const regex = /\{\s*name:\s*"([^"]+)",\s*abbreviation:\s*"([^"]+)"/g;
  for (const m of content.matchAll(regex)) {
    jurisdictions.push({ name: m[1], abbreviation: m[2] });
  }
  return jurisdictions;
}

/** Parse FIELD_DEFS from fields.ts. */
function loadFieldDefs() {
  const content = readFileSync(FIELDS_PATH, "utf8");
  const defs = [];
  const regex =
    /\{\s*name:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*type:\s*"([^"]+)"\s*,?\s*\}/g;
  for (const m of content.matchAll(regex)) {
    defs.push({ name: m[1], label: m[2], type: m[3] });
  }
  return defs;
}

/** Extract form fields from a PDF document with name and type. */
function extractPdfFields(pdfDoc) {
  let form;
  try {
    form = pdfDoc.getForm();
  } catch {
    return [];
  }
  const result = [];
  for (const field of form.getFields()) {
    const name = field.getName();
    const ctor = field.constructor.name;
    let type;
    if (ctor === "PDFTextField") type = "text";
    else if (ctor === "PDFCheckBox") type = "checkbox";
    else if (ctor === "PDFRadioGroup") type = "radio";
    else if (ctor === "PDFDropdown" || ctor === "PDFOptionList")
      type = "dropdown";
    else type = "other";
    result.push({ name, type });
  }
  return result;
}

/** Remove borders and backgrounds from all form fields (delete AP, set border width to 0, remove BG/BC). */
function stripFormFieldStyles(pdfDoc) {
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

/** Return the output directory for a given jurisdiction (federal, state, or root). */
function getOutputDir(jurisdiction) {
  if (!jurisdiction || jurisdiction === "federal") {
    return join(
      ROOT,
      jurisdiction === "federal" ? "src/pdfs/federal" : "src/pdfs",
    );
  }
  return join(ROOT, "src/pdfs", jurisdiction.toLowerCase());
}

/** Compute id, outDir, pdfDir, pdfDestPath, and outPath from metadata. */
function computeOutputPaths(metadata) {
  const id = generatePdfId(metadata.code, metadata.title);
  const outDir = getOutputDir(metadata.jurisdiction);
  const pdfDir = join(outDir, id);
  return {
    id,
    outDir,
    pdfDir,
    pdfDestPath: join(pdfDir, `${id}.pdf`),
    outPath: join(pdfDir, "index.ts"),
  };
}

/** Normalize metadata (trim title/code, coalesce jurisdiction). */
function normalizeMetadata(metadata) {
  return {
    title: metadata.title.trim(),
    code: (metadata.code || "").trim(),
    jurisdiction: metadata.jurisdiction || undefined,
  };
}

/** Generate the .ts definition file content. */
function generateDefinition({ id, title, code, jurisdiction, mappings }) {
  const props = [
    `id: "${id}",`,
    `title: "${title}",`,
    ...(code ? [`code: "${code}",`] : []),
    ...(jurisdiction && jurisdiction !== "federal"
      ? [`jurisdiction: "${jurisdiction}",`]
      : []),
    "pdfPath: pdf,",
  ];

  const fieldLines = mappings.map((m) => {
    const value = m.inverse
      ? `!data.${m.fieldDefName}`
      : `data.${m.fieldDefName}`;
    return `${m.pdfFieldName}: ${value},`;
  });

  return `import { definePdf } from "@/pdfs/utils/definePdf";
import pdf from "./${id}.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
${props.join("\n")}
  resolver: (data) => ({
    // TODO: Add conditionals per field (e.g. isDifferent ? data.value : undefined)
${fieldLines.join("\n")}
  }),
});
`;
}

/** Build jurisdiction options for the autocomplete prompt. */
function buildJurisdictionOptions(jurisdictions) {
  return [
    { value: "federal", label: "Federal" },
    ...jurisdictions.map((j) => ({
      value: j.abbreviation,
      label: `${j.name} (${j.abbreviation})`,
    })),
  ];
}

/** Prompts for form title, code, and jurisdiction. */
async function promptMetadata(jurisdictionOptions) {
  const metadata = await clack.group(
    {
      title: () =>
        clack.text({
          message: "Form title",
          placeholder: "Petition to Change Name of Adult",
          validate: validateTitle,
        }),
      code: () =>
        clack.text({
          message: "Form code (optional)",
          placeholder: "CJP-27",
        }),
      jurisdiction: () =>
        clack.autocomplete({
          message: "Jurisdiction",
          options: jurisdictionOptions,
          placeholder: "Type to search...",
          maxItems: 10,
        }),
    },
    { onCancel },
  );

  if (clack.isCancel(metadata)) exitWith("Operation canceled.", 0);
  return metadata;
}

/** Build autocomplete options for mapping a PDF field to a field definition. */
function buildFieldMappingOptions(pdfField, fieldDefs) {
  const compatibleDefs = filterDefsByPdfFieldType(fieldDefs, pdfField);
  return [
    { value: CREATE_NEW, label: "+ Create new field definition" },
    { value: SKIP, label: "Skip this field" },
    ...compatibleDefs.map((d) => ({
      value: d.name,
      label: `${d.name} (${d.label})`,
    })),
  ];
}

/** Returns an async function that prompts to map a single PDF field to a field definition. */
function createFieldMappingPrompt(pdfField, prefix, fieldDefs, mappings) {
  return async () => {
    const getExistingNames = () => [
      ...fieldDefs,
      ...mappings.map((m) => ({ name: m.fieldDefName })),
    ];
    const baseOptions = buildFieldMappingOptions(pdfField, fieldDefs);

    const innerResult = await clack.group(
      {
        map: () =>
          clack.autocomplete({
            message: `${prefix} "${pdfField.name}" (${pdfField.type}) maps to`,
            options: function () {
              const search = (this.userInput ?? "").trim().toLowerCase();
              if (!search) return baseOptions;
              const hasMatch = baseOptions.some(
                (o) =>
                  o.value !== CREATE_NEW &&
                  o.value !== SKIP &&
                  (String(o.label).toLowerCase().includes(search) ||
                    String(o.value).toLowerCase().includes(search)),
              );
              if (!hasMatch && search.length > 0) {
                return [
                  {
                    value: `${CREATE_NEW_PREFIX}${this.userInput.trim()}`,
                    label: `Create new: "${this.userInput.trim()}"`,
                  },
                  ...baseOptions,
                ];
              }
              return baseOptions;
            },
            placeholder: "Type to search (or type new name to create)...",
            maxItems: 10,
          }),
        createNew: ({ results }) => {
          const choice = results.map;
          if (choice === SKIP) return undefined;
          if (!isCreateNewChoice(choice)) return undefined;
          const userTyped = String(choice).startsWith(CREATE_NEW_PREFIX)
            ? String(choice).slice(CREATE_NEW_PREFIX.length).trim()
            : "";
          const initialValue = /^[a-z][a-zA-Z0-9]*$/.test(userTyped)
            ? userTyped
            : generateFieldName(pdfField.name, pdfField.type);
          return clack.text({
            message: `${prefix} Field name (camelCase)`,
            placeholder: "myNewField",
            initialValue: initialValue || undefined,
            validate: validateFieldName(getExistingNames(), {
              allowExisting: true,
            }),
          });
        },
        inverse: ({ results }) => {
          if (results.map === SKIP) return undefined;
          if (!isCheckboxOrRadio(pdfField)) return undefined;
          const fieldDefName = results.createNew ?? results.map;
          if (results.createNew && fieldExistsInDefs(fieldDefs, fieldDefName)) {
            clack.log.info("Field already exists; using existing definition");
          }
          return clack.select({
            message: `${prefix} When should "${pdfField.name}" be checked?`,
            initialValue: false,
            options: [
              { value: false, label: `When data.${fieldDefName} is true` },
              { value: true, label: `When data.${fieldDefName} is false` },
            ],
          });
        },
      },
      { onCancel },
    );

    if (clack.isCancel(innerResult)) exitWith("Operation canceled.", 0);

    const { map: choice, createNew: newName, inverse: inv } = innerResult;
    if (choice === SKIP) return null;

    const fieldDefName = newName?.trim() ?? choice;
    const inverse = inv ?? false;

    if (newName) {
      if (
        fieldExistsInDefs(fieldDefs, fieldDefName) &&
        !isCheckboxOrRadio(pdfField)
      ) {
        clack.log.info("Field already exists; using existing definition");
      } else if (!fieldExistsInDefs(fieldDefs, fieldDefName)) {
        clack.note(
          `New field "${fieldDefName}" will be added to FIELD_DEFS automatically`,
        );
      }
    }

    const result = { pdfFieldName: pdfField.name, fieldDefName, inverse };
    mappings.push(result);
    return result;
  };
}

/** Prompt to map each PDF field to a field definition; return the mappings array. */
async function promptFieldMappings(pdfFields, fieldDefs) {
  const mappings = [];
  const fieldGroup = {};

  for (let i = 0; i < pdfFields.length; i++) {
    const pdfField = pdfFields[i];
    const prefix = `${i + 1}/${pdfFields.length}`;
    fieldGroup[`field_${i}`] = createFieldMappingPrompt(
      pdfField,
      prefix,
      fieldDefs,
      mappings,
    );
  }

  const results = await clack.group(fieldGroup, { onCancel });

  if (clack.isCancel(results)) exitWith("Operation canceled.", 0);
  return mappings;
}

/** Strip form field styles and write the PDF to the given path. */
async function writeStrippedPdf(pdfDoc, pdfDestPath) {
  stripFormFieldStyles(pdfDoc);
  const strippedBytes = await pdfDoc.save();
  writeFileSync(pdfDestPath, strippedBytes);
}

/** Return [name, type] entries for field defs that are new (not in fieldDefs). */
function computeNewFields(mappings, pdfFields, fieldDefs) {
  const existingNames = new Set(fieldDefs.map((d) => d.name));
  const newFieldsByType = {};

  for (const m of mappings) {
    if (!existingNames.has(m.fieldDefName)) {
      existingNames.add(m.fieldDefName);
      const pdfField = pdfFields.find((f) => f.name === m.pdfFieldName);
      const type = isCheckboxOrRadio(pdfField) ? "boolean" : "string";
      if (!newFieldsByType[m.fieldDefName]) {
        newFieldsByType[m.fieldDefName] = type;
      }
    }
  }

  return Object.entries(newFieldsByType);
}

/** Run biome format on the given file paths. */
function formatFiles(paths) {
  if (paths.length === 0) return;
  spawnSync("pnpm", ["exec", "biome", "format", "--write", ...paths], {
    cwd: ROOT,
    stdio: "inherit",
  });
}

/** Add the given id to PDF_IDS in pdf.ts; return false if already present. */
function addIdToPdfConstants(id) {
  let content = readFileSync(PDF_TS_PATH, "utf8");
  if (content.includes(`"${id}"`)) return false;
  content = content.replace(/(\] as const;)/, `  "${id}",\n$1`);
  writeFileSync(PDF_TS_PATH, content);
  return true;
}

/** Append new field definitions to FIELD_DEFS in fields.ts. */
function addFieldsToConstants(newFields) {
  if (newFields.length === 0) return;
  let content = readFileSync(FIELDS_PATH, "utf8");
  const entries = newFields.map(
    ([name, type]) =>
      `  { name: "${name}", label: "${fieldNameToLabel(name)}", type: "${type}" },`,
  );
  content = content.replace(/(\]\s*as const;)/, `\n${entries.join("\n")}\n$1`);
  writeFileSync(FIELDS_PATH, content);
}

/** Convert a kebab-case id to camelCase (e.g. "cjp27-foo" → "cjp27Foo"). */
function idToImportName(id) {
  return id
    .split("-")
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
}

/** Escape a string for safe inclusion in a double-quoted JavaScript string literal. */
function escapeForJsDoubleQuotedString(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Generate starter test file content. */
function generateStarterTest({ id, title, mappings, pdfFields }) {
  const importName = idToImportName(id);
  const escapedTitle = escapeForJsDoubleQuotedString(title);
  const seen = new Set();
  const testDataEntries = mappings
    .filter((m) => {
      if (seen.has(m.fieldDefName)) return false;
      seen.add(m.fieldDefName);
      return true;
    })
    .map((m) => {
      const pdfField = pdfFields.find((f) => f.name === m.pdfFieldName);
      const value = isCheckboxOrRadio(pdfField) ? false : '"value"';
      return `${m.fieldDefName}: ${value},`;
    });

  return `import { describe, expect, it } from "vitest";
import { getPdfForm } from "@/pdfs/utils/getPdfForm";
import ${importName} from ".";

describe("${escapedTitle}", () => {
  const testData = {
${testDataEntries.join("\n")}
  };

  it("maps fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: ${importName},
      userData: testData,
    });
    // TODO: Add assertions for each field
    expect(form).toBeDefined();
  });
});
`;
}

/** Write the starter test file to disk. */
function writeStarterTest({ testPath, id, title, mappings, pdfFields }) {
  const testDir = dirname(testPath);
  if (!existsSync(testDir)) mkdirSync(testDir, { recursive: true });
  const content = generateStarterTest({ id, title, mappings, pdfFields });
  writeFileSync(testPath, `${content}\n`);
}

/** Build the list of write tasks (definition, PDF_IDS, FIELD_DEFS, starter test). */
function buildWriteTasks({
  outPath,
  output,
  id,
  title,
  newFields,
  mappings,
  pdfFields,
  pdfDir,
}) {
  const needsPdfId = !readFileSync(PDF_TS_PATH, "utf8").includes(`"${id}"`);

  const testPath = join(pdfDir, `${id}.test.ts`);
  const needsStarterTest = !existsSync(testPath);

  const tasks = [
    {
      title: "Write definition file",
      task: async () => {
        writeFileSync(outPath, `${output}\n`);
        return `Wrote ${outPath}`;
      },
    },
    needsPdfId && {
      title: "Update PDF_IDS",
      task: async () => {
        addIdToPdfConstants(id);
        return `Added "${id}"`;
      },
    },
    newFields.length > 0 && {
      title: "Update FIELD_DEFS",
      task: async () => {
        addFieldsToConstants(newFields);
        return `Added ${newFields.map(([n]) => n).join(", ")}`;
      },
    },
    needsStarterTest && {
      title: "Write starter test file",
      task: async () => {
        writeStarterTest({ testPath, id, title, mappings, pdfFields });
        return `Wrote ${testPath}`;
      },
    },
    {
      title: "Format generated files",
      task: async () => {
        const toFormat = [outPath];
        if (existsSync(testPath)) toFormat.push(testPath);
        formatFiles(toFormat);
        return "Formatted with biome";
      },
    },
  ];

  return tasks.filter(Boolean);
}

/** Run schema extraction (all PDFs or a single path). */
function runSchemaExtraction(pdfPath) {
  const args = pdfPath ? ["pdf:schema", pdfPath] : ["pdf:schema"];
  const result = spawnSync("pnpm", args, {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    exitWith("Schema extraction failed.", result.status ?? 1);
  }
}

/** Main entry: validate input, prompt for metadata and mappings, write files. */
async function main() {
  clack.intro("Let's define a Namesake PDF! ♥︎");

  const pdfPathArg = process.argv[2];
  if (!pdfPathArg?.trim()) {
    exitWith(
      "A path to the PDF file is required.\n\nUsage: pnpm pdf:define path/to/form.pdf",
    );
  }

  const resolvedPath = resolve(process.cwd(), pdfPathArg.trim());
  if (!existsSync(resolvedPath)) exitWith(`File not found: ${resolvedPath}`);
  if (!resolvedPath.toLowerCase().endsWith(".pdf"))
    exitWith("File must be a .pdf");

  clack.log.step("Updating PDF schemas…");
  runSchemaExtraction();

  clack.note(
    "Before beginning, use BentoPDF to create, rename, and/or reposition form fields in the document.\n\nhttps://bentopdf.com/form-creator.html",
  );

  const fieldDefs = loadFieldDefs();
  const jurisdictions = loadJurisdictions();
  const jurisdictionOptions = buildJurisdictionOptions(jurisdictions);

  const metadata = await promptMetadata(jurisdictionOptions);
  const normalized = normalizeMetadata(metadata);
  const { id, outDir, pdfDir, pdfDestPath, outPath } =
    computeOutputPaths(normalized);

  if (existsSync(outPath)) {
    exitWith(`${outPath} — ${DEFINITION_EXISTS_MSG}`);
  }

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(readFileSync(resolvedPath));
  } catch (err) {
    exitWith(err.code === "ENOENT" ? "File not found." : err.message);
  }

  const pdfFields = extractPdfFields(pdfDoc);
  if (pdfFields.length === 0) exitWith("No form fields found in this PDF.");

  const unsupported = pdfFields.filter(
    (f) => f.type === "dropdown" || f.type === "other",
  );
  if (unsupported.length > 0) {
    clack.log.warn(
      `${unsupported.length} field(s) are dropdown/other — fillPdf only supports text and checkbox. Map to string for dropdown; you may need custom fill logic.`,
    );
  }
  clack.log.success(`Found ${pdfFields.length} form field(s)`);

  clack.log.step("Map PDF field names to Namesake field definitions");
  const mappings = await promptFieldMappings(pdfFields, fieldDefs);

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  if (!existsSync(pdfDir)) mkdirSync(pdfDir, { recursive: true });

  try {
    await writeStrippedPdf(pdfDoc, pdfDestPath);
    clack.log.success(
      `Wrote PDF (borders/backgrounds stripped) to ${pdfDestPath}`,
    );
  } catch (err) {
    exitWith(`Failed to write PDF: ${err.message}`);
  }

  clack.log.step("Generating schema for new PDF…");
  runSchemaExtraction(pdfDestPath);

  const output = generateDefinition({
    id,
    ...normalized,
    mappings,
  });

  clack.log.info(`Generated id: ${id}`);

  const newFields = computeNewFields(mappings, pdfFields, fieldDefs);
  const tasks = buildWriteTasks({
    outPath,
    output,
    id,
    title: normalized.title,
    newFields,
    mappings,
    pdfFields,
    pdfDir,
  });
  await clack.tasks(tasks);

  clack.outro("Done!");

  clack.box(
    `1. index.ts — Apply conditional logic to resolver fields
2. ${id}.test.ts — Write tests to validate all form fields and conditional logic
3. Open a pull request with the new form definition!`,
    "Next steps",
    {
      contentAlign: "left",
      titleAlign: "left",
      width: "auto",
      rounded: true,
      contentPadding: 2,
    },
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
