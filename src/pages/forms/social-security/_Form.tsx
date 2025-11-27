import type { FormEvent } from "react";
import {
  FormContainer,
  type Step,
} from "@/components/react/forms/FormContainer";
import type { FieldName, FieldType } from "@/constants/fields";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";
import { useForm } from "@/utils/useForm";
import { AddressStep } from "./_steps/AddressStep";
import { BirthplaceStep } from "./_steps/BirthplaceStep";
import { CitizenshipStep } from "./_steps/CitizenshipStep";
import { DateOfBirthStep } from "./_steps/DateOfBirthStep";
import { EthnicityStep } from "./_steps/EthnicityStep";
import { FilingForSomeoneElseStep } from "./_steps/FilingForSomeoneElseStep";
import { NewNameStep } from "./_steps/NewNameStep";
import { OldNameStep } from "./_steps/OldNameStep";
import { ParentOneNameStep } from "./_steps/ParentOneNameStep";
import { ParentTwoNameStep } from "./_steps/ParentTwoNameStep";
import { PhoneNumberStep } from "./_steps/PhoneNumberStep";
import { PreviousNamesStep } from "./_steps/PreviousNamesStep";
import { PreviousSocialSecurityCardStep } from "./_steps/PreviousSocialSecurityCardStep";
import { RaceStep } from "./_steps/RaceStep";
import { SexStep } from "./_steps/SexStep";

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
  "phoneNumber",
  "isCurrentlyUnhoused",
  "mailingStreetAddress",
  "mailingCity",
  "mailingState",
  "mailingZipCode",
  "isFilingForSomeoneElse",
  "relationshipToFilingFor",
  "relationshipToFilingForOther",
] as const;

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

const STEPS: readonly Step[] = [
  { id: "new-name", component: NewNameStep },
  { id: "old-name", component: OldNameStep },
  { id: "previous-names", component: PreviousNamesStep },
  { id: "birthplace", component: BirthplaceStep },
  { id: "date-of-birth", component: DateOfBirthStep },
  { id: "citizenship", component: CitizenshipStep },
  { id: "ethnicity", component: EthnicityStep },
  { id: "race", component: RaceStep },
  { id: "sex", component: SexStep },
  { id: "parent-one", component: ParentOneNameStep },
  { id: "parent-two", component: ParentTwoNameStep },
  {
    id: "previous-social-security-card",
    component: PreviousSocialSecurityCardStep,
  },
  { id: "phone-number", component: PhoneNumberStep },
  { id: "address", component: AddressStep },
  { id: "filing-for-someone-else", component: FilingForSomeoneElseStep },
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
