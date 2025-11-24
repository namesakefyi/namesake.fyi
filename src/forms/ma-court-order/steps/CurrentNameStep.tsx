import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function CurrentNameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your current legal name?"
      description="This is the name you're leaving behind. Type it exactly as it appears on your ID."
    >
      {/* TODO: Add NameField components here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
