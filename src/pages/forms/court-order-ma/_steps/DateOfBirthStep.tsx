import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { MemorableDateField } from "@/components/react/forms/MemorableDateField";

export const dateOfBirthStep: StepConfig = {
  id: "date-of-birth",
  title: "What is your date of birth?",
  fields: ["dateOfBirth"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  ),
};
