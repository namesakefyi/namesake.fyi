import { EmailField } from "@/components/react/forms/EmailField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";

export const contactInfoStep: StepConfig = {
  id: "contact-info",
  title: "What is your contact information?",
  description: "The court uses this to communicate with you about your status.",
  fields: ["phoneNumber", "email"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
      <EmailField name="email" />
    </FormStep>
  ),
};
