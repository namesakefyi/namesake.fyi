import { createForm } from "@/forms/createForm";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { contactInfoStep } from "./_steps/ContactInfoStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { feeWaiverStep } from "./_steps/FeeWaiverStep";
import { interpreterStep } from "./_steps/InterpreterStep";
import { mothersMaidenNameStep } from "./_steps/MothersMaidenNameStep";
import { newNameStep } from "./_steps/NewNameStep";
import { otherNamesStep } from "./_steps/OtherNamesStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { pronounsStep } from "./_steps/PronounsStep";
import { reasonStep } from "./_steps/ReasonStep";
import { returnDocumentsStep } from "./_steps/ReturnDocumentsStep";

export const courtOrderMaForm = createForm({
  slug: "court-order-ma",
  steps: [
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
    feeWaiverStep,
    mothersMaidenNameStep,
  ],
  pdfs: [
    "cjp27-petition-to-change-name-of-adult",
    "cjp34-cori-and-wms-release-request",
    {
      id: "affidavit-of-indigency",
      when: { field: "shouldApplyForFeeWaiver", equals: true },
    },
  ],
  downloadTitle: "Massachusetts Court Order",
  instructions: [
    "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    {
      text: "Complete the Affidavit of Indigency on your own.",
      when: { field: "shouldApplyForFeeWaiver", equals: true },
    },
    {
      text: "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
      when: { field: "shouldApplyForFeeWaiver", equals: false },
    },
    "Remember to bring all supporting documents to the court.",
  ],
});
