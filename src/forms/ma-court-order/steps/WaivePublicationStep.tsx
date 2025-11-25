import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function WaivePublicationStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="Would you like to waive the newspaper publication requirement?"
      description="The legal name change process requires publication in a newspaper. However, we can help you file a motion to waive this requirement."
    >
      {/* TODO: Add YesNoField, conditional LongTextField and Banner */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
