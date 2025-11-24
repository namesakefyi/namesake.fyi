import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function OldNameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What was your name at birth?"
      description="This is the name that appears on your original birth certificate."
    >
      {/* TODO: Add NameField component for oldName */}
    </FormStep>
  );
}
