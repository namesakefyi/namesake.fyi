import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function PreviousNameChangeStep(_props: StepComponentProps) {
  return (
    <FormStep title="Have you legally changed your name before?">
      {/* TODO: Add YesNoField and conditional subsection */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
