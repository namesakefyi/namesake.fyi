import type { FormConfig } from "@/constants/forms";
import { addressStep } from "./_steps/AddressStep";
import { birthCertificateParentsStep } from "./_steps/BirthCerticiateParentsStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { coGuardianStep } from "./_steps/CoGuardianStep";
import { consentStep } from "./_steps/ConsentStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { feeWaiverStep } from "./_steps/FeeWaiverStep";
import { guardianStep } from "./_steps/GuardianStep";
import { interpreterStep } from "./_steps/InterpreterStep";
import { newNameStep } from "./_steps/NewNameStep";
import { parentAddressStep } from "./_steps/ParentAddressStep";
import { parentalRightsTerminatedStep } from "./_steps/ParentalRightsTerminatedStep";
import { parentInfoStep } from "./_steps/ParentInfoStep";
import { parentsDeceasedStep } from "./_steps/ParentsDeceasedStep";
import { presentedByStep } from "./_steps/PresentedByStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { pronounsStep } from "./_steps/PronounsStep";
import { reasonStep } from "./_steps/ReasonStep";
import { returnDocumentsStep } from "./_steps/ReturnDocumentsStep";
import { youthServicesStep } from "./_steps/YouthServicesStep";

export const courtOrderMinorMaConfig: FormConfig = {
  slug: "court-order-ma-minor",
  steps: [
    newNameStep,
    currentNameStep,
    reasonStep,
    presentedByStep,
    dateOfBirthStep,
    birthplaceStep,
    addressStep,
    parentInfoStep,
    parentAddressStep,
    birthCertificateParentsStep,
    parentsDeceasedStep,
    parentalRightsTerminatedStep,
    guardianStep,
    coGuardianStep,
    consentStep,
    previousNameChangeStep,
    youthServicesStep,
    returnDocumentsStep,
    interpreterStep,
    pronounsStep,
    feeWaiverStep,
  ],
  pdfs: [
    { pdfId: "cjp25-petition-to-change-name-of-minor" },
    { pdfId: "cjp34-cori-and-wms-release-request" },
    {
      pdfId: "affidavit-of-indigency",
      include: (data) => data.shouldApplyForFeeWaiver === true,
    },
  ],
  downloadTitle: "Massachusetts Court Order (Minor)",
  instructions: (data) => [
    "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    data.shouldApplyForFeeWaiver === true
      ? "Complete the Affidavit of Indigency on your own."
      : "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
    "Remember to bring all supporting documents to the court.",
  ],
};
