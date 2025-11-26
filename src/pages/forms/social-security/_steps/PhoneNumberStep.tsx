import { FormStep } from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";

export function PhoneNumberStep() {
  return (
    <FormStep title="What is your phone number?">
      <PhoneField name="phoneNumber" />
    </FormStep>
  );
}
