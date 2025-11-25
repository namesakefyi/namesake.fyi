import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function CitizenshipStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your citizenship status?">
      {/* TODO: Add RadioGroupField for citizenshipStatus */}
      {/* Options: usCitizen, legalAlienAllowedToWork, legalAlienNotAllowedToWork, other */}
      {/* TODO: Add conditional Banner for legalAlienNotAllowedToWork and other */}
    </FormStep>
  );
}
