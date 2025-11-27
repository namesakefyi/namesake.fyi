import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function NewNameStep() {
  return (
    <FormStep
      title="What is your new name?"
      description="This is the name you're making official! Type it exactly as you want it to appear."
    >
      <NameField type="newName" />
    </FormStep>
  );
}
