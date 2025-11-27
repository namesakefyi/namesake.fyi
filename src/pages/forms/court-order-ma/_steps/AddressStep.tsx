import { AddressField } from "@/components/react/forms/AddressField";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";

export const addressStep: StepConfig = {
  id: "address",
  title: "What is your residential address?",
  description:
    "You must reside in the same county where you file your name change. We'll help you find where to file.",
  fields: [
    "isCurrentlyUnhoused",
    "residenceStreetAddress",
    "residenceCity",
    "residenceCounty",
    "residenceState",
    "residenceZipCode",
    "isMailingAddressDifferentFromResidence",
    "mailingStreetAddress",
    "mailingCity",
    "mailingCounty",
    "mailingState",
    "mailingZipCode",
  ],
  isFieldVisible: (fieldName, data) => {
    // Residence fields hidden if currently unhoused
    if (
      fieldName === "residenceStreetAddress" ||
      fieldName === "residenceCity" ||
      fieldName === "residenceCounty" ||
      fieldName === "residenceState" ||
      fieldName === "residenceZipCode"
    ) {
      return data.isCurrentlyUnhoused !== true;
    }
    // isMailingAddressDifferentFromResidence also hidden if unhoused
    if (fieldName === "isMailingAddressDifferentFromResidence") {
      return data.isCurrentlyUnhoused !== true;
    }
    // Mailing address fields only visible if different from residence and not unhoused
    if (
      fieldName === "mailingStreetAddress" ||
      fieldName === "mailingCity" ||
      fieldName === "mailingCounty" ||
      fieldName === "mailingState" ||
      fieldName === "mailingZipCode"
    ) {
      return (
        data.isCurrentlyUnhoused !== true &&
        data.isMailingAddressDifferentFromResidence === true
      );
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField
        name="isCurrentlyUnhoused"
        label="I am currently unhoused or without permanent housing"
      />
      {form.watch("isCurrentlyUnhoused") !== true && (
        <>
          <AddressField type="residence" includeCounty />
          <CheckboxField
            name="isMailingAddressDifferentFromResidence"
            label="I use a different mailing address"
          />
        </>
      )}
      <FormSubsection
        title="What is your mailing address?"
        isVisible={
          form.watch("isMailingAddressDifferentFromResidence") === true
        }
      >
        <AddressField type="mailing" />
      </FormSubsection>
    </FormStep>
  ),
};
