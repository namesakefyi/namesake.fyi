import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function FilingForSomeoneElseStep() {
  return (
    <FormStep title="Are you filing this form for someone else?">
      <YesNoField
        name="isFilingForSomeoneElse"
        label="Are you filing this form for someone else?"
        labelHidden
        yesLabel="Yes, I am filing this for someone else"
        noLabel="No, I am filing this for myself"
      />
      {/* TODO: Add conditional subsection if isFilingForSomeoneElse is true */}
      {/* Subsection: "What is your relationship to the person you are filing for?" */}
      {/* TODO: Add RadioGroupField for relationshipToFilingFor */}
      {/* Options: parent (Natural or Adoptive Parent), legalGuardian (Legal Guardian), other (Other) */}
      {/* TODO: Add conditional ShortTextField for relationshipToFilingForOther if relationshipToFilingFor is "other" */}
    </FormStep>
  );
}
