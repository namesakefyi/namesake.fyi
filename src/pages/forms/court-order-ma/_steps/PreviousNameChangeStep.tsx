import { useFormContext } from "react-hook-form";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";

export function PreviousNameChangeStep() {
  const form = useFormContext();

  return (
    <FormStep title="Have you legally changed your name before?">
      <YesNoField
        name="hasPreviousNameChange"
        label="Have you ever changed your name before?"
        labelHidden
        yesLabel="Yes, I've changed my name"
        noLabel="No, I've never changed my name"
      />
      <FormSubsection
        title="Please list your past legal name."
        isVisible={form.watch("hasPreviousNameChange") === true}
      >
        <ShortTextField name="previousNameFrom" label="From" />
        <ShortTextField name="previousNameTo" label="To" />
        <LongTextField name="previousNameReason" label="Reason for change" />
      </FormSubsection>
    </FormStep>
  );
}
