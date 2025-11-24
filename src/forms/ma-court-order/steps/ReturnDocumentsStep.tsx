import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function ReturnDocumentsStep(_props: StepComponentProps) {
  return (
    <FormStep title="Do you want your original documents returned afterwards?">
      {/* TODO: Add YesNoField and conditional Banner */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
