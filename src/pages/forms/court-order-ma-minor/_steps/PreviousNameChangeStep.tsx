import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: "Has the minor ever changed their name before?",
  fields: [
    "hasPreviousNameChange",
    "previousNameFrom",
    "previousNameTo",
    "previousNameReason",
  ],
  isFieldVisible: (fieldName, data) => {
    if (
      fieldName === "previousNameFrom" ||
      fieldName === "previousNameTo" ||
      fieldName === "previousNameReason"
    ) {
      return data.hasPreviousNameChange === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const previousNameVisible = useFieldVisible(stepConfig, "previousNameFrom");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviousNameChange"
          label="Has the child ever changed their name before?"
          labelHidden
          yesLabel="Yes, the minor has changed their name"
          noLabel="No, the minor has never changed their name"
        />
        <FormSubsection
          title="Please list the minor's past legal name."
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
