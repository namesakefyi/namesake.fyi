import { AddressField } from "@/components/react/forms/AddressField";
import { FormStep } from "@/components/react/forms/FormStep";
import type { Step } from "@/forms/types";

export const addressStep: Step = {
  id: "address",
  title: "What is your residential address?",
  fields: [
    "residenceStreetAddress",
    "residenceCity",
    "residenceState",
    "residenceZipCode",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <AddressField type="residence" />
    </FormStep>
  ),
};
