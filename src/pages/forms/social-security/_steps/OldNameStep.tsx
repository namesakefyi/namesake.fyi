import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function OldNameStep() {
  return (
    <FormStep
      title="What was your name at birth?"
      description="This is the name that appears on your original birth certificate."
    >
      <NameField type="oldName" />
    </FormStep>
  );
}
