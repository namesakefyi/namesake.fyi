import { useForm } from "react-hook-form";
import {
  FormContainer,
  type Step,
} from "../../components/react/forms/FormContainer";
import * as Steps from "./steps";

const STEPS: readonly Step[] = [
  { id: "new-name", component: Steps.NewNameStep },
  { id: "current-name", component: Steps.CurrentNameStep },
  { id: "reason", component: Steps.ReasonStep },
  { id: "contact-info", component: Steps.ContactInfoStep },
  { id: "birthplace", component: Steps.BirthplaceStep },
  { id: "date-of-birth", component: Steps.DateOfBirthStep },
  { id: "residential-address", component: Steps.ResidentialAddressStep },
  { id: "previous-name-change", component: Steps.PreviousNameChangeStep },
  { id: "other-names", component: Steps.OtherNamesStep },
  { id: "interpreter", component: Steps.InterpreterStep },
  { id: "pronouns", component: Steps.PronounsStep },
  { id: "return-documents", component: Steps.ReturnDocumentsStep },
  { id: "waive-publication", component: Steps.WaivePublicationStep },
  { id: "impound-case", component: Steps.ImpoundCaseStep },
  { id: "fee-waiver", component: Steps.FeeWaiverStep },
  { id: "mothers-maiden-name", component: Steps.MothersMaidenNameStep },
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
