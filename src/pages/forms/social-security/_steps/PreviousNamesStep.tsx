import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const previousNamesStep: StepConfig = {
  id: "previous-names",
  title: "Have you used any other legal names?",
  fields: ["hasOtherLegalNames", "previousLegalNames"],
  isFieldVisible: (fieldName, data) => {
    // previousLegalNames only visible if hasOtherLegalNames is true
    if (fieldName === "previousLegalNames") {
      return data.hasOtherLegalNames === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="hasOtherLegalNames"
        label="Have you used any other legal names?"
        labelHidden
        yesLabel="Yes"
        noLabel="No, I've never changed my name before"
      />
      {form.watch("hasOtherLegalNames") === true && (
        <FormSubsection>
          <LongTextField name="previousLegalNames" label="Other names used" />
        </FormSubsection>
      )}
    </FormStep>
  ),
};
