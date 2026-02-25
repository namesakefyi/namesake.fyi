import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import type { Step } from "@/forms/types";

export const currentNameStep: Step = {
  id: "current-name",
  title: "What is your current legal name?",
  description:
    "This is the name you're leaving behind. Type it exactly as it appears on your ID.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
    </FormStep>
  ),
};
