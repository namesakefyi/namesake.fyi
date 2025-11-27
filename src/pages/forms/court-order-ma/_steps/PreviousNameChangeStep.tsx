import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const previousNameChangeStep: StepConfig = {
  id: "previous-name-change",
  title: "Have you ever changed your name before?",
  fields: [
    "hasPreviousNameChange",
    "previousNameFrom",
    "previousNameTo",
    "previousNameReason",
  ],
  isFieldVisible: (fieldName, data) => {
    // Previous name details only visible if hasPreviousNameChange is true
    if (
      fieldName === "previousNameFrom" ||
      fieldName === "previousNameTo" ||
      fieldName === "previousNameReason"
    ) {
      return data.hasPreviousNameChange === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
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
  ),
};
