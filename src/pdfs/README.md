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

## Adding new PDFs

### Step 1: Review and rename fields

Use the [BentoPDF Form Creator](https://bentopdf.com/form-creator.html). Upload the original PDF form that was downloaded.

Examine the names of all fields in the form. These names are what we use to map user submittions from Namesake forms to the final output in the completed PDF. Often times, the raw .pdf downloaded from a .gov website will have PDF field names that are vague ("type"), full sentences ("[A] I receive assistance from ..."), meaningless internal markers ("OptC[B]select_1"), or a mix of all three.

To make things easier for us, let's rename them:

1. Use `camelCase` naming for all fields, like `residenceStreetAddress` or `newFirstName`.
2. Prefix checkbox fields with `is`, `should`, or `has`. For example, `isReceivingMedicaid` or `shouldReturnOriginalDocuments`.
   a. If there are two separate checkboxes representing the same boolean value (such as a "Yes" and "No" checkbox for the same question), you can add the suffix `True` and `False`. For example, `hasPreviousNameChangeTrue` and `hasPreviousNameChangeFalse`.
3. Try to match the list of [existing field definitions](../constants/fields.ts). Nothing needs to *exactly* match, but keeping the names close will make the next step easier.
4. Don't hesitate to make a name long, if it needs to be; some of these form fields are very specific.

When all user-enterable fields have been labeled and positioned, download the modified PDF and save it anywhere.

### Step 2: Generate PDF definitions

Next, we'll run a script which iterates through all of the fields in the pdf and generates a schema that maps to our internal field definitions. For definitions which don't yet exist, the script will help create them.

From the terminal, within the repo, type:

```zsh
pnpm pdf:define
```

Drag the .pdf document to your terminal to insert a path to it. (Don't worry if the .pdf is located in /Downloads, /Desktop, or somewhere else outside of the repo—the script will put a renamed version in the correct spot in the codebase.)

```zsh
pnpm pdf:define ./path/to/form.pdf
```

Once the path is present, run the script.

The script will walk you through the process of filling out everything that's required for the definition. When you are done, it should have generated a new `index.ts`, `schema.ts`, and `.test.ts` file.

### Step 3: Add conditional logic

We've generated an `index.ts` file with all of our field definitions in a flat list. Wherever fields depend on a condition, check that condition for each field and return `undefined` when the condition isn't met:

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

Since we've already defined definitions for the data, this is pretty straightforward. Use `getPdfForm` to return a [PDFForm](https://pdf-lib.js.org/docs/api/classes/pdfform) object from `pdf-lib`, and then use methods like [getCheckBox](https://pdf-lib.js.org/docs/api/classes/pdfform#getcheckbox) and [getTextField](https://pdf-lib.js.org/docs/api/classes/pdfform#gettextfield) to test the values in the PDF.

> [!IMPORTANT]
> Take extra care to test any conditional logic. If certain fields should only be filled when a checkbox is checked, verify that via testing.

```ts
// cjp27-petition-to-change-name-of-adult.test.ts
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
});
```

Run your tests to verify they work:

```zsh
pnpm test ./path/to/form.test.ts
```

Then open a pull request with your changes! Congrats! You've added a new PDF definition to Namesake. All that's left now is to create the new form.

Run `pnpm pdf:schema` to regenerate `schema.ts` from the PDF after adding or modifying form fields.
