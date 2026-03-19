import { FormStep } from "@/components/react/forms/FormStep";
import { MemorableDateField } from "@/components/react/forms/MemorableDateField";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const dateOfBirthStep: Step = {
  id: "date-of-birth",
  title: (data) =>
    `What is ${nameOrFallback(data, "the minor")}'s date of birth?`,
  fields: ["dateOfBirth"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  ),
};
