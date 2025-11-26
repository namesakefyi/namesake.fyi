import { FormStep } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";

export function PreviousNamesStep() {
  return (
    <FormStep title="What other legal names have you used, if any?">
      <LongTextField name="previousLegalNames" label="Other names used" />
    </FormStep>
  );
}
