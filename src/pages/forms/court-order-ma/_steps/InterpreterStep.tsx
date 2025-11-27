import { useFormContext } from "react-hook-form";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LanguageSelectField } from "@/components/react/forms/LanguageSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function InterpreterStep() {
  const form = useFormContext();

  return (
    <FormStep
      title="If there is a hearing for your name change, do you need an interpreter?"
      description="In most cases, a hearing is not required."
    >
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
  );
}
