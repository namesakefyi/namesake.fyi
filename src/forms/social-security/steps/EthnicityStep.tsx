import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function EthnicityStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your ethnicity?"
      description="This response is optional and does not affect your application. The Social Security Administration requests this information for research and statistical purposes."
    >
      {/* TODO: Add YesNoField for isHispanicOrLatino with includePreferNotToAnswer */}
    </FormStep>
  );
}
