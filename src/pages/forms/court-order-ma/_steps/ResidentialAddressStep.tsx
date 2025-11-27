import { useFormContext } from "react-hook-form";
import { AddressField } from "@/components/react/forms/AddressField";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";

export function ResidentialAddressStep() {
  const form = useFormContext();

  return (
    <FormStep
      title="What is your residential address?"
      description="You must reside in the same county where you file your name change. We'll help you find where to file."
    >
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
  );
}
