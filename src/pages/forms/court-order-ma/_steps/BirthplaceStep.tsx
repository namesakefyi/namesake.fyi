import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { COUNTRIES } from "@/constants/countries";
import { JURISDICTIONS } from "@/constants/jurisdictions";

export const birthplaceStep: StepConfig = {
  id: "birthplace",
  title: "Where were you born?",
  fields: ["birthplaceCity", "birthplaceCountry", "birthplaceState"],
  isFieldVisible: (fieldName, data) => {
    // birthplaceState is only visible if birthplaceCountry is the US
    if (fieldName === "birthplaceState") {
      return data.birthplaceCountry === "US";
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="birthplaceCity" label="City" />
      <ComboBoxField
        name="birthplaceCountry"
        label="Country"
        placeholder="Select a country"
        options={Object.entries(COUNTRIES).map(([value, label]) => ({
          label,
          value,
        }))}
      />
      {form.watch("birthplaceCountry") === "US" && (
        <ComboBoxField
          name="birthplaceState"
          label="State"
          placeholder="Select a state"
          options={Object.entries(JURISDICTIONS).map(([value, label]) => ({
            label,
            value,
          }))}
        />
      )}
    </FormStep>
  ),
};
