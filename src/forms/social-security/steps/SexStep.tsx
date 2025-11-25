import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function SexStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your sex?"
      description="The Social Security Administration accepts only two options: male or female."
    >
      {/* TODO: Add Banner with warning about SSA gender marker policy */}
      {/* TODO: Add RadioGroupField for sexAssignedAtBirth (options: male, female) */}
    </FormStep>
  );
}
