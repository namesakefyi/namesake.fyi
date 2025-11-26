import {
  AddressField,
  FormStep,
  type StepComponentProps,
} from "~/components/react/forms";

export function AddressStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your mailing address?">
      <AddressField type="mailing" />
    </FormStep>
  );
}
