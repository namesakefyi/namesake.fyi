import { AddressField } from "@/components/react/forms/AddressField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";

export const addressStep: StepConfig = {
  id: "address",
  title: "What is your mailing address?",
  fields: [
    "isCurrentlyUnhoused",
    "mailingStreetAddress",
    "mailingCity",
    "mailingState",
    "mailingZipCode",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <AddressField type="mailing" />
    </FormStep>
  ),
};
