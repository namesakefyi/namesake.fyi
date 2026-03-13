import { FormStep } from "@/components/react/forms/FormStep";
import { MemorableDateField } from "@/components/react/forms/MemorableDateField";
import type { Step } from "@/forms/types";

export const dateOfBirthStep: Step = {
  id: "date-of-birth",
  title: "What is your date of birth?",
  fields: ["dateOfBirth"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  ),
};
