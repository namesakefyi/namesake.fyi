/** Auto-generated from affidavit-of-indigency.pdf — do not edit */
import { PDFCheckBox, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  Court: PDFTextField,
  "Case Name and Number if known": PDFTextField,
  "A I receive public assistance under check form of public assistance received":
    PDFCheckBox,
  "Transitional Aid to Families with Dependent Children TAFDC": PDFCheckBox,
  "Emergency Aid to Elderly Disabled or Children EAEDC": PDFCheckBox,
  "Massachusetts Veterans Benefits Programs or": PDFCheckBox,
  "Medicaid MassHealth": PDFCheckBox,
  "Supplemental Security Income SSI": PDFCheckBox,
  "persons consisting of myself and": PDFTextField,
  week: PDFCheckBox,
  biweekly: PDFCheckBox,
  month: PDFCheckBox,
  year: PDFCheckBox,
  "check the period that applies for a household of": PDFTextField,
  "which income is at or below the court systems poverty level Note The court systems poverty levels for households":
    PDFTextField,
  "List any other available household income for the checked period on this line":
    PDFTextField,
  "lower cost paid for by the state Check all that apply and in any":
    PDFTextField,
  "guess as to the cost if known": PDFTextField,
  "Filing fee and any surcharge": PDFCheckBox,
  "Filing fee and any surcharge for appeal": PDFCheckBox,
  "Fees or costs for serving court summons witness subpoenas or other court papers":
    PDFCheckBox,
  "Other fees or costs of": PDFCheckBox,
  "Substitution specify": PDFCheckBox,
  undefined: PDFTextField,
  undefined_2: PDFTextField,
  undefined_3: PDFTextField,
  "for  specify": PDFTextField,
  undefined_4: PDFTextField,
  Cost: PDFCheckBox,
  "of expert services for testing examination testimony or other assistance specify":
    PDFTextField,
  Cost_2: PDFCheckBox,
  "of taking andor transcribing a deposition of specify name of person":
    PDFTextField,
  undefined_5: PDFTextField,
  "Cassette copies of tape recording of trial or other proceeding needed to prepare appeal for applicant not":
    PDFCheckBox,
  "Appeal bond": PDFCheckBox,
  Cost_3: PDFCheckBox,
  "of preparing written transcript of trial or other proceeding": PDFTextField,
  undefined_6: PDFTextField,
  "for  specify_2": PDFTextField,
  "Other fees and costs": PDFCheckBox,
  "Substitution specify_2": PDFCheckBox,
  undefined_7: PDFTextField,
  "Date signed": PDFTextField,
  x: PDFTextField,
  B: PDFCheckBox,
  C: PDFCheckBox,
  applicantName: PDFTextField,
  residenceStreetAddress: PDFTextField,
  residenceCity: PDFTextField,
  residenceStateAndZip: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
