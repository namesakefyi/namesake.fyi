# PDFs

This directory contains all the blank PDFs that Namesake uses to fill forms, including schemas and tests for those PDFs.

## Naming and organization

Each PDF has its own folder under a jurisdiction (`ma`, `federal`, `ny`). The folder name is the PDF id in `kebab-case`. For example:

```
src/pdfs/
  ma/
    affidavit-of-indigency/
      index.ts           # typed PDF definition
      schema.ts          # auto-generated form schema
      affidavit-of-indigency.pdf
      affidavit-of-indigency.test.ts
```

## Adding new PDFs

### Step 1: Review and rename fields

Use the [BentoPDF Form Creator](https://bentopdf.com/form-creator.html). Upload the original PDF form that was downloaded.

Examine the names of all fields in the form. These names are what we use to map user submissions from Namesake forms to the final output in the completed PDF. Often, the raw PDF from a .gov site has field names that are vague ("type"), full sentences ("[A] I receive assistance from ..."), meaningless internal markers ("form1[0].BodyPage1[0].S1[0].Ln[0]"), or a mix of all three.

To make things easier for us, let's rename them:

1. Use `camelCase` naming for all fields, like `residenceStreetAddress` or `newFirstName`.
2. Prefix checkbox fields with `is`, `should`, or `has`. For example, `isReceivingMedicaid` or `shouldReturnOriginalDocuments`.
   - If there are two separate checkboxes representing the same boolean value (such as a "Yes" and "No" checkbox for the same question), you can add the suffix `True` and `False`. For example, `hasPreviousNameChangeTrue` and `hasPreviousNameChangeFalse`.
3. Try to match the list of [existing field definitions](../constants/fields.ts). Nothing needs to *exactly* match, but keeping the names close will make the next step easier.
4. Don't hesitate to make a name long, if it needs to be; some of these form fields are very specific.

When all user-enterable fields have been labeled and positioned, download the modified PDF and save it anywhere.

### Step 2: Generate PDF definitions

Run the define script with the path to your modified PDF:

```zsh
pnpm pdf:define ./path/to/form.pdf
```

The path can be anywhere (e.g. Downloads, Desktop). The script will copy the PDF into the correct folder and generate `index.ts`, `schema.ts`, and a starter test file.

The script will prompt for:
- **Form title** — e.g. "Petition to Change Name of Adult"
- **Form code** (optional) — e.g. "CJP-27"
- **Jurisdiction** — Federal or a state (MA, NY, etc.)

### Step 3: Map PDF fields to form data

We've generated an `index.ts` file with all of our field definitions in a flat list. Right now, all those fields are `undefined`.

```ts
resolver: (data) => ({
  petitionerFirstName: undefined,
  petitionerMiddleName: undefined,
  petitionerLastName: undefined,
  county: undefined,
  // etc.
})
```

The resolver maps each PDF field name (left) to a value from user-submitted form data (right). Form data comes from [FIELD_DEFS](../constants/fields.ts).

For each PDF field, look up a matching FIELD_DEF by name. Use it directly: `data.existingFieldName`, or derive a value (e.g. `formatDateMMDDYYYY(data.dateOfBirth)`). Format helpers can be imported from `@/utils`.

If no FIELD_DEF exists for a PDF field, add one to `src/constants/fields.ts`.

Wherever fields depend on a condition, check that condition for each field and return `undefined` when the condition isn't met:

```ts
// Mailing address (if different from residence)
mailingStreetAddress: data.isMailingAddressDifferentFromResidence
  ? data.mailingStreetAddress
  : undefined,
mailingCity: data.isMailingAddressDifferentFromResidence
  ? data.mailingCity
  : undefined,
mailingState: data.isMailingAddressDifferentFromResidence
  ? data.mailingState
  : undefined,
mailingZipCode: data.isMailingAddressDifferentFromResidence
  ? data.mailingZipCode
  : undefined,
```

This ensures we never print values to the final PDF unless the condition is met. Look at the PDF structure to determine which fields are conditional.

### Step 4: Write tests

Every PDF and definition should also include a test to validate that the form renders, checkboxes get checked, text fields get filled, and conditional logic applies as expected.

Use `getPdfForm` with your test data to get a [PDFForm](https://pdf-lib.js.org/docs/api/classes/pdfform), then use [getCheckBox](https://pdf-lib.js.org/docs/api/classes/pdfform#getcheckbox) and [getTextField](https://pdf-lib.js.org/docs/api/classes/pdfform#gettextfield) to assert values.

```ts
import { getPdfForm } from "@/pdfs/utils/getPdfForm";
import petitionToChangeNameOfAdult from ".";

describe("CJP27 Petition to Change Name of Adult", () => {
  const testData = {
    newFirstName: "New",
    newMiddleName: "Newly",
    newLastName: "Name",
    oldFirstName: "Old",
    oldMiddleName: "Oldly",
    oldLastName: "Name",
    // More test data...
  } as const;

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: testData,
    });

    expect(form.getTextField("newFirstName").getText()).toBe("New");
    expect(form.getTextField("newMiddleName").getText()).toBe("Newly");
    expect(form.getTextField("newLastName").getText()).toBe("Name");

    // Test more fields...
  });

  // Test conditional fields...
  it("shows language when interpreter is needed", async () => {
    const dataWithInterpreter = {
      ...testData,
      isInterpreterNeeded: true,
      language: "es",
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithInterpreter,
    });

    expect(form.getCheckBox("isInterpreterNeeded").isChecked()).toBe(true);
    expect(form.getTextField("language").getText()).toBe("Spanish");
  });
});
```

Run your tests:

```zsh
pnpm test path/to/pdf.test.ts
```

Then open a pull request. You've added a new PDF definition to Namesake!

## Regenerating schema.ts

If you modify a PDF file (e.g. in BentoPDF or another tool) to rename form fields, regenerate the schema:

```zsh
pnpm pdf:schema path/to/form.pdf
```

To regenerate schemas for all PDFs in `src/pdfs`, run without an argument:

```zsh
pnpm pdf:schema
```
