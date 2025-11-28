import type { FormEvent } from "react";
import {
  FormContainer,
  resolveVisibleFields,
} from "@/components/react/forms/FormContainer";
import type { FieldType } from "@/constants/fields";
import { downloadMergedPdf } from "@/pdfs/utils/downloadMergedPdf";
import { loadPdfs } from "@/pdfs/utils/loadPdfs";
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
  updatedAt,
}: {
  title: string;
  description: string;
  updatedAt: string;
}) {
  const { ...form } = useForm<FormData>(FORM_FIELDS);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pdfs = await loadPdfs([
      { pdfId: "cjp27-petition-to-change-name-of-adult" },
      { pdfId: "cjp34-cori-and-wms-release-request" },
      {
        pdfId: "cjd400-motion-to-waive-publication",
        include: form.watch("shouldWaivePublicationRequirement") === true,
      },
      {
        pdfId: "cjd400-motion-to-impound-records",
        include: form.watch("shouldImpoundCourtRecords") === true,
      },
      {
        pdfId: "affidavit-of-indigency",
        include: form.watch("shouldApplyForFeeWaiver") === true,
      },
    ]);

    const visibleData = resolveVisibleFields(STEPS, form.getValues());

    await downloadMergedPdf({
      title: "Massachusetts Court Order",
      instructions: [
        "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
        "Review all documents carefully.",
        "File with the Probate and Family Court in your county.",
        form.watch("shouldApplyForFeeWaiver") === true
          ? "Complete the Affidavit of Indigency on your own."
          : "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
        "Remember to bring all supporting documents to the court.",
      ],
      pdfs,
      userData: visibleData,
    });
  };

  return (
    <FormContainer
      title={title}
      description={description}
      updatedAt={updatedAt}
      steps={STEPS}
      form={form}
      onSubmit={handleSubmit}
    />
  );
}
