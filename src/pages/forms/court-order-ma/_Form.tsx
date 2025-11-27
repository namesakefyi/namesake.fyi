import { FormContainer } from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { useForm } from "@/utils/useForm";
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

const FORM_FIELDS = STEPS.flatMap((step) => step.fields);

type FormData = {
  [K in (typeof FORM_FIELDS)[number]]: FieldType<K>;
};

export function MaCourtOrderForm({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { onSubmit, ...form } = useForm<FormData>(FORM_FIELDS);

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
