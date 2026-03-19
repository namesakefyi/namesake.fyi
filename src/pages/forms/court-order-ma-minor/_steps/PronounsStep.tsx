import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { PronounSelectField } from "@/components/react/forms/PronounSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const pronounsStep: Step = {
  id: "pronouns",
  title: (data) =>
    `Do you want to share ${nameOrFallback(data, "the minor")}'s pronouns with the court staff?`,
  fields: ["isOkayToSharePronouns", "pronouns", "otherPronouns"],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "pronouns") {
      return data.isOkayToSharePronouns === true;
    }
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
          label="Share the child's pronouns with the court staff?"
          labelHidden
        />
        <FormSubsection isVisible={pronounsVisible}>
          <PronounSelectField />
        </FormSubsection>
      </FormStep>
    );
  },
};
