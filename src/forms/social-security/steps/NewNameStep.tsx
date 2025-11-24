import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function NewNameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your new name?"
      description="This is the name that will show on your new card."
    >
      {/* TODO: Add NameField component for newName */}
    </FormStep>
  );
}
