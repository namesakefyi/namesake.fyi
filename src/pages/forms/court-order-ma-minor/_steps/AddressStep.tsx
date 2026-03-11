import { AddressField } from "@/components/react/forms/AddressField";
import {
  FormStep,
} from "@/components/react/forms/FormStep";
import type { Step } from "@/forms/types";

export const addressStep: Step = {
  id: "address",
  title: "What is the minor's address?",
  description:
    "You must file in the county where the minor lives. We'll help you find where to file.",
  fields: [
    "residenceStreetAddress",
    "residenceCity",
    "residenceCounty",
    "residenceState",
    "residenceZipCode",
  ],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <AddressField type="residence" includeCounty />
      </FormStep>
    );
  },
};
