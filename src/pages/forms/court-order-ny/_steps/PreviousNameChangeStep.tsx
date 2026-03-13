import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: "Have you changed your name before?",
  guard: (data) => data.shouldChangeName === true,
  fields: ["hasPreviousNameChange", "previousNameReason"],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "previousNameReason") {
      return data.hasPreviousNameChange === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const reasonVisible = useFieldVisible(stepConfig, "previousNameReason");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviousNameChange"
          label="Have you ever changed your name before?"
          labelHidden
          yesLabel="Yes, I've changed my name"
          noLabel="No, I've never changed my name"
        />
        <FormSubsection title="What was the reason?" isVisible={reasonVisible}>
          <ShortTextField
            name="previousNameReason"
            label="Reason for previous name change"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
