import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function ReturnDocumentsStep(_props: StepComponentProps) {
  return (
    <FormStep title="Do you want your original documents returned afterwards?">
      {/* TODO: Add YesNoField and conditional Banner */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
