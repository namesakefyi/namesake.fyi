import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function NewNameStep() {
  return (
    <FormStep
      title="What is your new name?"
      description="This is the name that will show on your new card."
    >
      <NameField type="newName" />
    </FormStep>
  );
}
