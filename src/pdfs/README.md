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

PDFs should be titled using all lowercase `kebab-case`. File names should begin with the form code, if one exists, followed by the full form title. For example, the form "Petition to Change Name of Adult" with the code "CJP 27" has the folder name `cjp27-petition-to-change-name-of-adult`.

If the form code contains any spaces or hyphens, those should be omitted. For example, the form code "CJ-D 400" is `cjd400`. State-specific PDFs go in `/ma`, `/ny`, etc. Federal forms go in `/federal`.

## Defining PDF schemas

Each PDF folder contains an `index.ts` with a single `default export`. For example:

```ts
// index.ts
import { definePdf } from "@/pdfs/utils/definePdf";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP-27",
  jurisdiction: "MA",
  pdfPath: pdf,

  // Map PDF field names to resolvers that derive values from form data.
  // Keys are strictly typed—typos will cause type errors.
  resolver: {
    oldFirstName: (data) => data.oldFirstName,
    oldMiddleName: (data) => data.oldMiddleName,
    oldLastName: (data) => data.oldLastName,
    newFirstName: (data) => data.newFirstName,
    // ... Additional field value resolvers
  },
});
```

Run `pnpm pdf:schema` to regenerate `schema.ts` from the PDF after adding or modifying form fields.

## Renaming PDF fields and adding new fields

Sometimes original PDFs do not include form fields embedded within the PDF. Other PDFs do include form fields, but they are named poorly. In either case, you will want to make modifications to the PDF to add missing fields and name fields consistently.

To edit a PDF, download the original, then open it in the [Nutrient.io PDF Form Creator](https://www.nutrient.io/demo/pdf-form-creator). In the left sidebar, expand the "Create a Fillable Form" section, and it will allow you to add new form fields. Click on each field within the PDF to see a popover that allows you to rename it.

In general, it's good to name the fields so that they match the global constants for user form data. This will make mapping between the PDF field names and the names in our database much easier.

Once you have finished editing the PDF, click the download button in the top right, rename the file, and add it to the appropriate PDF folder within `/src/pdfs`.

## Testing PDFs

Each PDF folder includes a `[pdfid].test.ts` file to validate that the form renders, checkboxes get checked, text fields get filled, etc.

Use `getPdfForm` to return a [PDFForm](https://pdf-lib.js.org/docs/api/classes/pdfform) object from `pdf-lib`, then use methods like [getCheckBox](https://pdf-lib.js.org/docs/api/classes/pdfform#getcheckbox) and [getTextField](https://pdf-lib.js.org/docs/api/classes/pdfform#gettextfield) to test the values. Take extra care to test any conditional logic around checkboxes.

```ts
// cjp27-petition-to-change-name-of-adult.test.ts
import { getPdfForm } from "@/pdfs/utils/getPdfForm";
import petitionToChangeNameOfAdult from ".";

describe("CJP27 Petition to Change Name of Adult", () => {
  const testData = { newFirstName: "New", oldFirstName: "Old", /* ... */ } as const;

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: testData,
    });
    expect(form.getTextField("newFirstName").getText()).toBe("New");
    // ...
  });
});
```
