import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function ParentTwoNameStep() {
  return (
    <FormStep title="What is your father's (or second parent's) name?">
      <NameField type="fathersName" />
    </FormStep>
  );
}
