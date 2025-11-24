import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function FilingForSomeoneElseStep(_props: StepComponentProps) {
  return (
    <FormStep title="Are you filing this form for someone else?">
      {/* TODO: Add YesNoField for isFilingForSomeoneElse */}
      {/* TODO: Add conditional subsection if isFilingForSomeoneElse is true */}
      {/* Subsection: "What is your relationship to the person you are filing for?" */}
      {/* TODO: Add RadioGroupField for relationshipToFilingFor */}
      {/* Options: parent (Natural or Adoptive Parent), legalGuardian (Legal Guardian), other (Other) */}
      {/* TODO: Add conditional ShortTextField for relationshipToFilingForOther if relationshipToFilingFor is "other" */}
    </FormStep>
  );
}
