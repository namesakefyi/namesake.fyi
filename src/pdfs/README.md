# PDFs

This directory contains all the blank PDFs that Namesake uses to fill forms, including schemas and tests for those PDFs.

## Adding new PDFs

### Step 1: Review and rename field names

Use the [BentoPDF Form Creator](https://bentopdf.com/form-creator.html). Upload the PDF form that was downloaded from a .gov site.

The task now is to observe the position and name of all fields in the form. Each form field name will be mapped to our own internal names and types.

Guidance on choosing names:

1. Use `camelCase` naming for all fields, like `residenceAddress` or `newFirstName`.
2. Prefix checkbox fields with `is` or `should`, like `isReceivingMedicaid` or `shouldReturnOriginalDocuments`.
3. Try to match the list of [existing field definitions](../constants/fields.ts). It's okay if they're not exactly the same, but keeping them close will make the next step easier. 

When all user-enterable fields have been labeled and positioned, download the modified PDF and save it anywhere.

### Step 2: Generate PDF definitions

Next we'll run a script which iterates through all of the fields in the pdf and generates a schema that maps to our internal field definitions. For definitions which don't yet exist, the script will help create them.

From the terminal, within the `/namesake` repo, type:

```zsh
pnpm pdf:generate-defs
```

Drag the .pdf document to your terminal to insert a path to it. (Don't worry about where the .pdf file is located on your system — the script will put a renamed version in the correct spot in the codebase.)

```zsh
pnpm pdf:generate-defs ./path/to/form.pdf
```

Once the path is present, run the script.

The script will walk you through the process of filling out everything that's required for the definition. When you are done, it should have generated a new `.ts` and `.test.ts` file.

### Step 3: Write tests

Every PDF and definition should also include a test to validate that the form renders, checkboxes get checked, text fields get filled, etc.

Since we've already defined definitions for the data, this is pretty straightforward. Use `getPdfForm` to return a [PDFForm](https://pdf-lib.js.org/docs/api/classes/pdfform) object from `pdf-lib`, and then use methods like [getCheckBox](https://pdf-lib.js.org/docs/api/classes/pdfform#getcheckbox) and [getTextField](https://pdf-lib.js.org/docs/api/classes/pdfform#gettextfield) to test the values in the PDF.

> [!IMPORTANT]
> Take extra care to test any conditional logic. If certain fields should only be filled when a checkbox is checked, verify that via testing.

```ts
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
  })
});
```

Run your tests to verify they work:

```zsh
pnpm test ./path/to/form.test.ts
```

Then open a pull request with your changes! Congrats! You've added a new PDF definition to Namesake. All that's left now is to create the new form.