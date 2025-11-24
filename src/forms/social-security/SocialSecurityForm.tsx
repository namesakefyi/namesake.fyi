import { useForm } from "react-hook-form";
import {
  FormContainer,
  type Step,
} from "../../components/react/forms/FormContainer";
import { AddressStep } from "./steps/AddressStep";
import { BirthplaceStep } from "./steps/BirthplaceStep";
import { CitizenshipStep } from "./steps/CitizenshipStep";
import { DateOfBirthStep } from "./steps/DateOfBirthStep";
import { EthnicityStep } from "./steps/EthnicityStep";
import { FilingForSomeoneElseStep } from "./steps/FilingForSomeoneElseStep";
import { NewNameStep } from "./steps/NewNameStep";
import { OldNameStep } from "./steps/OldNameStep";
import { ParentsNamesStep } from "./steps/ParentsNamesStep";
import { PhoneNumberStep } from "./steps/PhoneNumberStep";
import { PreviousNamesStep } from "./steps/PreviousNamesStep";
import { PreviousSocialSecurityCardStep } from "./steps/PreviousSocialSecurityCardStep";
import { RaceStep } from "./steps/RaceStep";
import { SexStep } from "./steps/SexStep";

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
  { id: "parents-names", component: ParentsNamesStep },
  {
    id: "previous-social-security-card",
    component: PreviousSocialSecurityCardStep,
  },
  { id: "phone-number", component: PhoneNumberStep },
  { id: "address", component: AddressStep },
  { id: "filing-for-someone-else", component: FilingForSomeoneElseStep },
];

export interface SocialSecurityFormProps {
  /** Form title from Sanity (optional, falls back to default) */
  title?: string;
  /** Form description from Sanity (optional, falls back to default) */
  description?: string;
}

export function SocialSecurityForm({
  title = "Social Security Card",
  description = "Apply for a new Social Security card with your updated name. This form helps you complete the SS-5 application.",
}: SocialSecurityFormProps = {}) {
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
