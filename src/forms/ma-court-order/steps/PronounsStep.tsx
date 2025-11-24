import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function PronounsStep(_props: StepComponentProps) {
  return (
    <FormStep title="Do you want to share your pronouns with the court staff?">
      {/* TODO: Add YesNoField and conditional PronounSelectField */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
