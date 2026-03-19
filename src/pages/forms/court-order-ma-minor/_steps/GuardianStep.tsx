import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem } from "@/components/react/common/ComboBox";
import { EmailField } from "@/components/react/forms/EmailField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { PhoneField } from "@/components/react/forms/PhoneField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { JURISDICTIONS } from "@/constants/jurisdictions";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const guardianStep: Step = {
  id: "guardian",
  title: (data) =>
    `Does ${nameOrFallback(data, "the minor")} have a court-appointed guardian?`,
  fields: [
    "hasCourtAppointedGuardian",
    "guardianFullName",
    "guardianStreetAddress",
    "guardianCity",
    "guardianState",
    "guardianZipCode",
    "guardianPhone",
    "guardianEmail",
    "coGuardianFullName",
    "coGuardianStreetAddress",
    "coGuardianCity",
    "coGuardianState",
    "coGuardianZipCode",
    "coGuardianPhone",
    "coGuardianEmail",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "hasCourtAppointedGuardian") return true;
    return data.hasCourtAppointedGuardian === true;
  },
  component: ({ stepConfig }) => {
    const guardianVisible = useFieldVisible(stepConfig, "guardianFullName");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasCourtAppointedGuardian"
          label="Is there a court-appointed guardian?"
          labelHidden
          yesLabel="Yes"
          noLabel="No"
        />
        <FormSubsection
          title="Guardian information"
          isVisible={guardianVisible}
        >
          <ShortTextField name="guardianFullName" label="Guardian full name" />
          <ShortTextField name="guardianStreetAddress" label="Street address" />
          <ShortTextField name="guardianCity" label="City" />
          <GuardianStateField />
          <ShortTextField name="guardianZipCode" label="ZIP code" />
          <PhoneField name="guardianPhone" />
          <EmailField name="guardianEmail" />
        </FormSubsection>
        <FormSubsection
          title="Co-guardian (if any)"
          isVisible={guardianVisible}
        >
          <ShortTextField
            name="coGuardianFullName"
            label="Co-guardian full name"
          />
          <ShortTextField
            name="coGuardianStreetAddress"
            label="Street address"
          />
          <ShortTextField name="coGuardianCity" label="City" />
          <CoGuardianStateField />
          <ShortTextField name="coGuardianZipCode" label="ZIP code" />
          <PhoneField name="coGuardianPhone" />
          <EmailField name="coGuardianEmail" />
        </FormSubsection>
      </FormStep>
    );
  },
};

function GuardianStateField() {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="guardianState"
      defaultValue=""
      render={({ field, fieldState: { invalid, error } }) => (
        <ComboBox
          {...field}
          label="State"
          placeholder="Select state"
          selectedKey={field.value}
          onSelectionChange={(key) => field.onChange(key)}
          isInvalid={invalid}
          errorMessage={error?.message}
          menuTrigger="focus"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <ComboBoxItem key={value} id={value}>
              {label}
            </ComboBoxItem>
          ))}
        </ComboBox>
      )}
    />
  );
}

function CoGuardianStateField() {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="coGuardianState"
      defaultValue=""
      render={({ field, fieldState: { invalid, error } }) => (
        <ComboBox
          {...field}
          label="State"
          placeholder="Select state"
          selectedKey={field.value}
          onSelectionChange={(key) => field.onChange(key)}
          isInvalid={invalid}
          errorMessage={error?.message}
          menuTrigger="focus"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <ComboBoxItem key={value} id={value}>
              {label}
            </ComboBoxItem>
          ))}
        </ComboBox>
      )}
    />
  );
}
