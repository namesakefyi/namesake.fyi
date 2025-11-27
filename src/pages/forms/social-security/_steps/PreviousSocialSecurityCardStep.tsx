import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const previousSocialSecurityCardStep: StepConfig = {
  id: "previous-social-security-card",
  title: "Do you have a previous Social Security card?",
  description:
    "Or, have you ever filed for a Social Security number in the past?",
  fields: [
    "hasPreviousSocialSecurityCard",
    "previousSocialSecurityCardFirstName",
    "previousSocialSecurityCardMiddleName",
    "previousSocialSecurityCardLastName",
  ],
  isFieldVisible: (fieldName, data) => {
    // Name fields only visible if user has previous card
    if (
      fieldName.startsWith("previousSocialSecurityCard") &&
      fieldName !== "hasPreviousSocialSecurityCard"
    ) {
      return data.hasPreviousSocialSecurityCard === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
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
  ),
};
