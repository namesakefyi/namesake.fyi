import { FormStep, FormSubsection, useFieldVisible } from "@/components/react/forms/FormStep";
import { PronounSelectField } from "@/components/react/forms/PronounSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const pronounsStep: Step = {
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
  component: ({ stepConfig }) => {
    const pronounsVisible = useFieldVisible(stepConfig, "pronouns");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isOkayToSharePronouns"
          label="Share my pronouns with the court staff?"
          labelHidden
        />
        <FormSubsection isVisible={pronounsVisible}>
          <PronounSelectField />
        </FormSubsection>
      </FormStep>
    );
  },
};
