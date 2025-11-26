import {
  FormStep,
  PhoneField,
  type StepComponentProps,
} from "~/components/react/forms";

export function PhoneNumberStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your phone number?">
      <PhoneField name="phoneNumber" />
    </FormStep>
  );
}
