import { defineFormConfig, step } from "@/forms/defineFormConfig";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { changeTypeStep } from "./_steps/ChangeTypeStep";
import { childSupportStep } from "./_steps/ChildSupportStep";
import { courtSelectionStep } from "./_steps/CourtSelectionStep";
import { criminalHistoryStep } from "./_steps/CriminalHistoryStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { marriageAndFamilyStep } from "./_steps/MarriageAndFamilyStep";
import { nameChangeReasonStep } from "./_steps/NameChangeReasonStep";
import { newNameStep } from "./_steps/NewNameStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { sealingRequestStep } from "./_steps/SealingRequestStep";
import { sexDesignationStep } from "./_steps/SexDesignationStep";
import { spousalSupportStep } from "./_steps/SpousalSupportStep";

export const courtOrderNyConfig = defineFormConfig({
  slug: "court-order-ny",
  steps: [
    step(changeTypeStep),
    step(newNameStep),
    step(currentNameStep),
    step(dateOfBirthStep),
    step(birthplaceStep),
    step(addressStep),
    step(criminalHistoryStep),
    step(marriageAndFamilyStep),
    step(childSupportStep),
    step(spousalSupportStep),
    step(previousNameChangeStep),
    step(nameChangeReasonStep),
    step(sexDesignationStep),
    step(sealingRequestStep),
    step(courtSelectionStep),
  ],
  pdfs: [
    {
      pdfId:
        "ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult",
    },
  ],
  downloadTitle: "New York Court Order",
  instructions: (data) =>
    [
      "Do not sign the petition until in the presence of a notary.",
      "Review all documents carefully.",
      "File with the court in your county.",
      data.shouldSealRecords === true
        ? "Your request to seal records will be reviewed by the court."
        : undefined,
      "Remember to bring all supporting documents to the court.",
    ].filter((instruction): instruction is string => instruction !== undefined),
});
