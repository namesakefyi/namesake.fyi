import { AddressField } from "@/components/react/forms/AddressField";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import type { Step } from "@/forms/types";

export const parentAddressStep: Step = {
  id: "parent-address",
  title: "Where do the minor's parents live?",
  description: "Enter the address for the minor's legal parents.",
  fields: [
    "parent1StreetAddress",
    "parent1City",
    "parent1State",
    "parent1ZipCode",
    "parentsHaveDifferentAddresses",
    "parent2StreetAddress",
    "parent2City",
    "parent2State",
    "parent2ZipCode",
  ],
  isFieldVisible: (fieldName, data) => {
    if (
      fieldName === "parent2StreetAddress" ||
      fieldName === "parent2City" ||
      fieldName === "parent2State" ||
      fieldName === "parent2ZipCode"
    ) {
      return data.parentsHaveDifferentAddresses === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const secondAddressVisible = useFieldVisible(
      stepConfig,
      "parent2StreetAddress",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="parentsHaveDifferentAddresses"
          label="Parents have different addresses"
        />
        {!secondAddressVisible && <AddressField type="parent1" />}
        <FormSubsection
          title="First parent's address"
          isVisible={secondAddressVisible}
        >
          <AddressField type="parent1" />
        </FormSubsection>
        <FormSubsection
          title="Second parent's address"
          isVisible={secondAddressVisible}
        >
          <AddressField type="parent2" />
        </FormSubsection>
      </FormStep>
    );
  },
};
