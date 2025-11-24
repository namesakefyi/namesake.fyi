import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function DateOfBirthStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your date of birth?">
      {/* TODO: Add MemorableDateField component here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
