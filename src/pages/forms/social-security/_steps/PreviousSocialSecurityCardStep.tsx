import { useFormContext } from "react-hook-form";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function PreviousSocialSecurityCardStep() {
  const form = useFormContext();

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
      {form.watch("hasPreviousSocialSecurityCard") === true && (
        <FormSubsection title="What is the name shown on your most recent Social Security card?">
          <NameField type="previousSocialSecurityCardName" />
        </FormSubsection>
      )}
    </FormStep>
  );
}
