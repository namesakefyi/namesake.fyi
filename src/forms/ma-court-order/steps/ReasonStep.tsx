import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function ReasonStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is the reason you're changing your name?">
      {/* TODO: Add LongTextField and Banner components here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
