import { useFormContext } from "react-hook-form";
import { PronounSelectField } from "@/components/react/forms/PronounSelectField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";

export function PronounsStep() {
  const form = useFormContext();

  return (
    <FormStep title="Do you want to share your pronouns with the court staff?">
      <YesNoField
        name="isOkayToSharePronouns"
        label="Share my pronouns with the court staff?"
        labelHidden
      />
      <FormSubsection isVisible={form.watch("isOkayToSharePronouns") === true}>
        <PronounSelectField />
      </FormSubsection>
    </FormStep>
  );
}
