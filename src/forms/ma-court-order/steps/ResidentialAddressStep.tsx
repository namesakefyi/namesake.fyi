import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function ResidentialAddressStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your residential address?"
      description="You must reside in the same county where you file your name change. We'll help you find where to file."
    >
      {/* TODO: Add AddressField and CheckboxField components here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
