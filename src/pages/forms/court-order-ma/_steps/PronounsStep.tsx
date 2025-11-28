import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { PronounSelectField } from "@/components/react/forms/PronounSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const pronounsStep: StepConfig = {
  id: "pronouns",
  title: "Do you want to share your pronouns with the court staff?",
  fields: ["isOkayToSharePronouns", "pronouns", "otherPronouns"],
  isFieldVisible: (fieldName, data) => {
    // pronouns only visible if isOkayToSharePronouns is true
    if (fieldName === "pronouns") {
      return data.isOkayToSharePronouns === true;
    }
    // otherPronouns only visible if pronouns includes "other pronouns"
    if (fieldName === "otherPronouns") {
      return data.pronouns?.includes("other") === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isOkayToSharePronouns"
        label="Share my pronouns with the court staff?"
        labelHidden
      />
      <FormSubsection isVisible={form.watch("isOkayToSharePronouns") === true}>
        <PronounSelectField />
      </FormSubsection>
    </FormStep>
  ),
};
