import { AddressField } from "@/components/react/forms/AddressField";
import { FormStep } from "@/components/react/forms/FormStep";

export function AddressStep() {
  return (
    <FormStep title="What is your mailing address?">
      <AddressField type="mailing" />
    </FormStep>
  );
}
