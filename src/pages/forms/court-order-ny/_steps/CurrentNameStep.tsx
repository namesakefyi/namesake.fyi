import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import type { Step } from "@/forms/types";

export const currentNameStep: Step = {
  id: "current-name",
  title: "What is your current legal name?",
  description: "Enter your name exactly as it appears on your legal documents.",
  fields: ["oldFullName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="oldFullName" label="Current full name" />
    </FormStep>
  ),
};
