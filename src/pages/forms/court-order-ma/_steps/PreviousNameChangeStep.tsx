import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { VisibilityRule } from "@/forms/formVisibility";
import type { Step } from "@/forms/types";

const whenHasPrevious: VisibilityRule = {
  field: "hasPreviousNameChange",
  equals: true,
};

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: "Have you ever changed your name before?",
  fields: [
    "hasPreviousNameChange",
    {
      names: ["previousNameFrom", "previousNameTo", "previousNameReason"],
      when: whenHasPrevious,
    },
  ],
  render: ({ stepConfig }) => {
    const previousNameVisible = useFieldVisible(stepConfig, "previousNameFrom");
    return (
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
          isVisible={previousNameVisible}
        >
          <ShortTextField name="previousNameFrom" label="From" />
          <ShortTextField name="previousNameTo" label="To" />
          <LongTextField name="previousNameReason" label="Reason for change" />
        </FormSubsection>
      </FormStep>
    );
  },
};
