import { FormStep } from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import type { Step } from "@/forms/types";

export const oldNameStep: Step = {
  id: "old-name",
  title: "What was your name at birth?",
  description:
    "This is the name that appears on your original birth certificate.",
  fields: ["oldFirstName", "oldMiddleName", "oldLastName"],
  render: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
    </FormStep>
  ),
};
