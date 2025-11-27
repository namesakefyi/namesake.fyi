import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LanguageSelectField } from "@/components/react/forms/LanguageSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const interpreterStep: StepConfig = {
  id: "interpreter",
  title:
    "If there is a hearing for your name change, do you need an interpreter?",
  description: "In most cases, a hearing is not required.",
  fields: ["isInterpreterNeeded", "language"],
  isFieldVisible: (fieldName, data) => {
    // language only visible if isInterpreterNeeded is true
    if (fieldName === "language") {
      return data.isInterpreterNeeded === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isInterpreterNeeded"
        label="If there is a hearing for your name change, do you need an interpreter?"
        labelHidden
        yesLabel="Yes, I need an interpreter"
        noLabel="No, I don't need an interpreter"
      />
      <FormSubsection isVisible={form.watch("isInterpreterNeeded") === true}>
        <LanguageSelectField name="language" />
      </FormSubsection>
    </FormStep>
  ),
};
