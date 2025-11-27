import { EmailField } from "@/components/react/forms/EmailField";
import { FormStep } from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";

export function ContactInfoStep() {
  return (
    <FormStep
      title="What is your contact information?"
      description="The court uses this to communicate with you about your status."
    >
      <PhoneField name="phoneNumber" />
      <EmailField name="email" />
    </FormStep>
  );
}
