import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function PreviousSocialSecurityCardStep() {
  return (
    <FormStep
      title="Do you have a previous Social Security card?"
      description="Or, have you ever filed for a Social Security number in the past?"
    >
      <YesNoField
        name="hasPreviousSocialSecurityCard"
        label="Have you ever filed for or received a Social Security number card before?"
        labelHidden
        yesLabel="Yes, I have a previous Social Security card or have applied for one"
        noLabel="No, I have never filed for or received a Social Security card before"
      />
      {/* TODO: Add conditional subsection if hasPreviousSocialSecurityCard is true */}
      {/* Subsection: "What is the name shown on your most recent Social Security card?" */}
      {/* TODO: Add NameField for previousSocialSecurityCardName */}
    </FormStep>
  );
}
