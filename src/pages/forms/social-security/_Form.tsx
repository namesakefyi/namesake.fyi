import type { FormEvent } from "react";
import { FormContainer, type Step } from "~/components/react/forms";
import type { FieldName, FieldType } from "~/constants";
import { useForm } from "~/forms/useForm";
import { downloadMergedPdf, loadPdfs } from "~/pdfs/utils";
import * as Steps from "./_steps";

const FORM_FIELDS: FieldName[] = [
  "newFirstName",
  "newMiddleName",
  "newLastName",
  "oldFirstName",
  "oldMiddleName",
  "oldLastName",
  "previousLegalNames",
  "birthplaceCity",
  "birthplaceState",
  "birthplaceCountry",
  "dateOfBirth",
  "citizenshipStatus",
  "isHispanicOrLatino",
  "race",
  "sexAssignedAtBirth",
  "mothersFirstName",
  "mothersMiddleName",
  "mothersLastName",
  "fathersFirstName",
  "fathersMiddleName",
  "fathersLastName",
  "hasPreviousSocialSecurityCard",
  "previousSocialSecurityCardFirstName",
  "previousSocialSecurityCardMiddleName",
  "previousSocialSecurityCardLastName",
  "isCurrentlyUnhoused",
  "isFilingForSomeoneElse",
  "relationshipToFilingFor",
  "relationshipToFilingForOther",
] as const;

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

const STEPS: readonly Step[] = [
  { id: "new-name", component: Steps.NewNameStep },
  { id: "old-name", component: Steps.OldNameStep },
  { id: "previous-names", component: Steps.PreviousNamesStep },
  { id: "birthplace", component: Steps.BirthplaceStep },
  { id: "date-of-birth", component: Steps.DateOfBirthStep },
  { id: "citizenship", component: Steps.CitizenshipStep },
  { id: "ethnicity", component: Steps.EthnicityStep },
  { id: "race", component: Steps.RaceStep },
  { id: "sex", component: Steps.SexStep },
  { id: "parent-one", component: Steps.ParentOneNameStep },
  { id: "parent-two", component: Steps.ParentTwoNameStep },
  {
    id: "previous-social-security-card",
    component: Steps.PreviousSocialSecurityCardStep,
  },
  { id: "phone-number", component: Steps.PhoneNumberStep },
  { id: "address", component: Steps.AddressStep },
  { id: "filing-for-someone-else", component: Steps.FilingForSomeoneElseStep },
];

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
        userData: form.getValues(),
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
