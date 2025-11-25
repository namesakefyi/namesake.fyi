import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function PreviousSocialSecurityCardStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="Do you have a previous Social Security card?"
      description="Or, have you ever filed for a Social Security number in the past?"
    >
      {/* TODO: Add YesNoField for hasPreviousSocialSecurityCard */}
      {/* TODO: Add conditional subsection if hasPreviousSocialSecurityCard is true */}
      {/* Subsection: "What is the name shown on your most recent Social Security card?" */}
      {/* TODO: Add NameField for previousSocialSecurityCardName */}
    </FormStep>
  );
}
