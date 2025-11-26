import { useForm } from "react-hook-form";
import {
  FormContainer,
  type Step,
} from "@/components/react/forms/FormContainer";
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
  const form = useForm({
    defaultValues: {
      // TODO: Add form field defaults here
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", form.getValues());
    // TODO: Handle form submission
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
