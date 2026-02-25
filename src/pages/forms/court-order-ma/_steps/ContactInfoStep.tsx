import { EmailField } from "@/components/react/forms/EmailField";
import { FormStep } from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";
import type { Step } from "@/forms/types";

export const contactInfoStep: Step = {
  id: "contact-info",
  title: "What is your contact information?",
  description:
    "The court uses this to communicate with you about your filing status.",
  fields: ["phoneNumber", "email"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
      <EmailField name="email" />
    </FormStep>
  ),
};
