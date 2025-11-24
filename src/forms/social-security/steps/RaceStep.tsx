import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function RaceStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your race?"
      description="This response is optional."
    >
      {/* TODO: Add CheckboxGroupField for race with includePreferNotToAnswer */}
      {/* Options: nativeHawaiian, alaskaNative, asian, americanIndian, black, otherPacificIslander, white */}
    </FormStep>
  );
}
