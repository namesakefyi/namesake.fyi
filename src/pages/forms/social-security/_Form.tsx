import type { FormEvent } from "react";
import { FormContainer } from "@/components/react/forms/FormContainer";
import { resolveVisibleFields } from "@/components/react/forms/FormContainer/resolveVisibleFields";
import type { FieldType } from "@/constants/fields";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";
import { useForm } from "@/utils/useForm";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { citizenshipStep } from "./_steps/CitizenshipStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { ethnicityStep } from "./_steps/EthnicityStep";
import { filingForSomeoneElseStep } from "./_steps/FilingForSomeoneElseStep";
import { newNameStep } from "./_steps/NewNameStep";
import { oldNameStep } from "./_steps/OldNameStep";
import { parentOneNameStep } from "./_steps/ParentOneNameStep";
import { parentTwoNameStep } from "./_steps/ParentTwoNameStep";
import { phoneNumberStep } from "./_steps/PhoneNumberStep";
import { previousNamesStep } from "./_steps/PreviousNamesStep";
import { previousSocialSecurityCardStep } from "./_steps/PreviousSocialSecurityCardStep";
import { raceStep } from "./_steps/RaceStep";
import { sexStep } from "./_steps/SexStep";

const STEPS = [
  newNameStep,
  oldNameStep,
  previousNamesStep,
  birthplaceStep,
  dateOfBirthStep,
  citizenshipStep,
  ethnicityStep,
  raceStep,
  sexStep,
  parentOneNameStep,
  parentTwoNameStep,
  previousSocialSecurityCardStep,
  phoneNumberStep,
  addressStep,
  filingForSomeoneElseStep,
] as const;

const FORM_FIELDS = STEPS.flatMap((step) => step.fields);

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

export function SocialSecurityForm({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { onSubmit, ...form } = useForm<FormData>(FORM_FIELDS);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const pdfs = await loadPdfs([
        { pdfId: "ss5-application-for-social-security-card" },
      ]);

      // Get only the visible fields based on conditional logic
      const visibleData = resolveVisibleFields(STEPS, form.getValues());

      await downloadMergedPdf({
        title: "Social Security Card",
        instructions: [
          "Please review all documents carefully.",
          "Fill in your social security number—for security, Namesake never asks for this.",
          "Make an Appointment with a Social Security Administration Office.",
          "Remember to bring certified copies of your completed court order, along with other required supporting documents.",
          form.watch("citizenshipStatus") === "legalAlienNotAllowedToWork" ||
          form.watch("citizenshipStatus") === "other"
            ? "You must provide a document from a U.S. Federal, State, or local government agency that explains why you need a Social Security number and that you meet all the requirements for the government benefit."
            : "",
        ],
        pdfs,
        userData: visibleData,
      });

      // Save form to user documents
      // await saveDocuments({ pdfIds: pdfs.map((pdf) => pdf.id) });

      // Save encrypted responses
      await onSubmit();
    } catch (_error) {
      // TODO: Error handling
      console.error(_error);
    }
  };

  return (
    <FormContainer
      title={title}
      description={description}
      steps={STEPS}
      form={form}
      onSubmit={handleSubmit}
    />
  );
}
