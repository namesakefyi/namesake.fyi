import {
  FormContainer,
  type Step,
} from "@/components/react/forms/FormContainer";
import type { FieldName } from "@/constants/fields";
import { useForm } from "@/utils/useForm";
import { BirthplaceStep } from "./_steps/BirthplaceStep";
import { ContactInfoStep } from "./_steps/ContactInfoStep";
import { CurrentNameStep } from "./_steps/CurrentNameStep";
import { DateOfBirthStep } from "./_steps/DateOfBirthStep";
import { FeeWaiverStep } from "./_steps/FeeWaiverStep";
import { ImpoundCaseStep } from "./_steps/ImpoundCaseStep";
import { InterpreterStep } from "./_steps/InterpreterStep";
import { MothersMaidenNameStep } from "./_steps/MothersMaidenNameStep";
import { NewNameStep } from "./_steps/NewNameStep";
import { OtherNamesStep } from "./_steps/OtherNamesStep";
import { PreviousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { PronounsStep } from "./_steps/PronounsStep";
import { ReasonStep } from "./_steps/ReasonStep";
import { ResidentialAddressStep } from "./_steps/ResidentialAddressStep";
import { ReturnDocumentsStep } from "./_steps/ReturnDocumentsStep";
import { WaivePublicationStep } from "./_steps/WaivePublicationStep";

const FORM_FIELDS: FieldName[] = [
  "newFirstName",
  "newMiddleName",
  "newLastName",
  "oldFirstName",
  "oldMiddleName",
  "oldLastName",
  "reasonForChangingName",
  "phoneNumber",
  "email",
  "birthplaceCity",
  "birthplaceState",
  "birthplaceCountry",
  "dateOfBirth",
  "residenceStreetAddress",
  "residenceCity",
  "residenceCounty",
  "residenceState",
  "residenceZipCode",
  "isMailingAddressDifferentFromResidence",
  "mailingStreetAddress",
  "mailingCity",
  "mailingCounty",
  "mailingState",
  "mailingZipCode",
  "hasPreviousNameChange",
  "previousNameFrom",
  "previousNameTo",
  "previousNameReason",
  "hasUsedOtherNameOrAlias",
  "otherNamesOrAliases",
  "isInterpreterNeeded",
  "language",
  "isOkayToSharePronouns",
  "pronouns",
  "otherPronouns",
  "shouldReturnOriginalDocuments",
  "shouldWaivePublicationRequirement",
  "reasonToWaivePublication",
  "shouldImpoundCourtRecords",
  "reasonToImpoundCourtRecords",
  "shouldApplyForFeeWaiver",
  "mothersMaidenName",
] as const;

const STEPS: readonly Step[] = [
  { id: "new-name", component: NewNameStep },
  { id: "current-name", component: CurrentNameStep },
  { id: "reason", component: ReasonStep },
  { id: "contact-info", component: ContactInfoStep },
  { id: "birthplace", component: BirthplaceStep },
  { id: "date-of-birth", component: DateOfBirthStep },
  { id: "residential-address", component: ResidentialAddressStep },
  { id: "previous-name-change", component: PreviousNameChangeStep },
  { id: "other-names", component: OtherNamesStep },
  { id: "interpreter", component: InterpreterStep },
  { id: "pronouns", component: PronounsStep },
  { id: "return-documents", component: ReturnDocumentsStep },
  { id: "waive-publication", component: WaivePublicationStep },
  { id: "impound-case", component: ImpoundCaseStep },
  { id: "fee-waiver", component: FeeWaiverStep },
  { id: "mothers-maiden-name", component: MothersMaidenNameStep },
];

export function MaCourtOrderForm({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { onSubmit, ...form } = useForm(FORM_FIELDS);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", form.getValues());

    // Save all form data to IndexedDB
    await onSubmit();

    // TODO: Generate and download PDFs
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
