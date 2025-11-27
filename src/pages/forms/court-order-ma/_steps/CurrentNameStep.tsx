import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export function CurrentNameStep() {
  return (
    <FormStep
      title="What is your current legal name?"
      description="This is the name you're leaving behind. Type it exactly as it appears on your ID."
    >
      <NameField type="oldName" />
    </FormStep>
  );
}
