import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";

export const previousNamesStep: StepConfig = {
  id: "previous-names",
  title: "What other legal names have you used, if any?",
  fields: ["previousLegalNames"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <LongTextField name="previousLegalNames" label="Other names used" />
    </FormStep>
  ),
};
