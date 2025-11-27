import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";

export const phoneNumberStep: StepConfig = {
  id: "phone-number",
  title: "What is your phone number?",
  fields: ["phoneNumber"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
    </FormStep>
  ),
};
