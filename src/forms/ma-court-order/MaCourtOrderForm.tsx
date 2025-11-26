import { useForm } from "react-hook-form";
import {
  FormContainer,
  type Step,
} from "../../components/react/forms/FormContainer";
import { BirthplaceStep } from "./steps/BirthplaceStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { CurrentNameStep } from "./steps/CurrentNameStep";
import { DateOfBirthStep } from "./steps/DateOfBirthStep";
import { FeeWaiverStep } from "./steps/FeeWaiverStep";
import { ImpoundCaseStep } from "./steps/ImpoundCaseStep";
import { InterpreterStep } from "./steps/InterpreterStep";
import { MothersMaidenNameStep } from "./steps/MothersMaidenNameStep";
import { NewNameStep } from "./steps/NewNameStep";
import { OtherNamesStep } from "./steps/OtherNamesStep";
import { PreviousNameChangeStep } from "./steps/PreviousNameChangeStep";
import { PronounsStep } from "./steps/PronounsStep";
import { ReasonStep } from "./steps/ReasonStep";
import { ResidentialAddressStep } from "./steps/ResidentialAddressStep";
import { ReturnDocumentsStep } from "./steps/ReturnDocumentsStep";
import { WaivePublicationStep } from "./steps/WaivePublicationStep";

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
