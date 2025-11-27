import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";

export const parentOneNameStep: StepConfig = {
  id: "parent-one",
  title: "What is your mother's (or first parent's) name?",
  description:
    "Use your parent's name at their birth, before marriage. This is also known as a maiden name.",
  fields: ["mothersFirstName", "mothersMiddleName", "mothersLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="mothersName" />
    </FormStep>
  ),
};
