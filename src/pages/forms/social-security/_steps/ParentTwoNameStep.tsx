import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export const parentTwoNameStep: StepConfig = {
  id: "parent-two",
  title: "What is your father's (or second parent's) name?",
  fields: ["fathersFirstName", "fathersMiddleName", "fathersLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="fathersName" />
    </FormStep>
  ),
};
