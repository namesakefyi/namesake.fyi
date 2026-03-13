import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { PronounSelectField } from "@/components/react/forms/PronounSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const pronounsStep: Step = {
  id: "pronouns",
  title: "Do you want to share your pronouns with the court staff?",
  fields: [
    "isOkayToSharePronouns",
    {
      id: "pronouns",
      when: { field: "isOkayToSharePronouns", equals: true },
    },
    {
      id: "otherPronouns",
      when: { field: "pronouns", includes: "other" },
    },
  ],
  render: ({ stepConfig }) => {
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
