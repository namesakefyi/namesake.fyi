import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import type { Step } from "@/forms/types";

export const newNameStep: Step = {
  id: "new-name",
  title: "What is your new name?",
  description:
    "Type your full name exactly as you want it to appear on your court order.",
  fields: ["newFullName"],
  guard: (data) => data.shouldChangeName === true,
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="newFullName" label="New full name" />
    </FormStep>
  ),
};
