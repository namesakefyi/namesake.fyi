import type { FormConfig } from "@/constants/forms";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { contactInfoStep } from "./_steps/ContactInfoStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { feeWaiverStep } from "./_steps/FeeWaiverStep";
import { impoundCaseStep } from "./_steps/ImpoundCaseStep";
import { interpreterStep } from "./_steps/InterpreterStep";
import { mothersMaidenNameStep } from "./_steps/MothersMaidenNameStep";
import { newNameStep } from "./_steps/NewNameStep";
import { otherNamesStep } from "./_steps/OtherNamesStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { pronounsStep } from "./_steps/PronounsStep";
import { reasonStep } from "./_steps/ReasonStep";
import { returnDocumentsStep } from "./_steps/ReturnDocumentsStep";
import { waivePublicationStep } from "./_steps/WaivePublicationStep";

const STEPS = [
  newNameStep,
  currentNameStep,
  reasonStep,
  contactInfoStep,
  birthplaceStep,
  dateOfBirthStep,
  addressStep,
  previousNameChangeStep,
  otherNamesStep,
  interpreterStep,
  pronounsStep,
  returnDocumentsStep,
  waivePublicationStep,
  impoundCaseStep,
  feeWaiverStep,
  mothersMaidenNameStep,
] as const;

const FIELDS = STEPS.flatMap((step) => step.fields);

export const courtOrderMaConfig = {
  slug: "court-order-ma",
  steps: STEPS,
  fields: FIELDS,
  pdfs: [
    { pdfId: "cjp27-petition-to-change-name-of-adult" },
    { pdfId: "cjp34-cori-and-wms-release-request" },
    {
      pdfId: "cjd400-motion-to-waive-publication",
      include: (data) => data.shouldWaivePublicationRequirement === true,
    },
    {
      pdfId: "cjd400-motion-to-impound-records",
      include: (data) => data.shouldImpoundCourtRecords === true,
    },
    {
      pdfId: "affidavit-of-indigency",
      include: (data) => data.shouldApplyForFeeWaiver === true,
    },
  ],
  downloadTitle: "Massachusetts Court Order",
  instructions: (data) => [
    "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    data.shouldApplyForFeeWaiver === true
      ? "Complete the Affidavit of Indigency on your own."
      : "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
    "Remember to bring all supporting documents to the court.",
  ],
} satisfies FormConfig;
