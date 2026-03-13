import { CheckboxField } from "@/components/react/forms/CheckboxField";
import { FormStep } from "@/components/react/forms/FormStep";
import type { Step } from "@/forms/types";

export const changeTypeStep: Step = {
  id: "change-type",
  title: "What would you like to change?",
  description: "Select all that apply.",
  fields: ["shouldChangeName", "shouldChangeSexDesignation"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField name="shouldChangeName" label="Change my name" />
      <CheckboxField
        name="shouldChangeSexDesignation"
        label="Change my sex designation"
      />
    </FormStep>
  ),
};
