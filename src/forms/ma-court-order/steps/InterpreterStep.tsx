import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function InterpreterStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="If there is a hearing for your name change, do you need an interpreter?"
      description="In most cases, a hearing is not required."
    >
      {/* TODO: Add YesNoField and conditional LanguageSelectField */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
