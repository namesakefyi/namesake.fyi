import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { COUNTRIES } from "@/constants/countries";
import { BIRTHPLACES } from "@/constants/jurisdictions";

export const birthplaceStep: StepConfig = {
  id: "birthplace",
  title: "Where were you born?",
  fields: ["birthplaceCity", "birthplaceState", "birthplaceCountry"],
  isFieldVisible: (fieldName, data) => {
    // birthplaceCountry is only visible if birthplaceState is "other"
    if (fieldName === "birthplaceCountry") {
      return data.birthplaceState === "other";
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="birthplaceCity" label="City of birth" />
      <ComboBoxField
        name="birthplaceState"
        label="State"
        placeholder="Select a state"
        options={Object.entries(BIRTHPLACES).map(([value, label]) => ({
          label,
          value,
        }))}
      />
      {form.watch("birthplaceState") === "other" && (
        <ComboBoxField
          name="birthplaceCountry"
          label="Country"
          placeholder="Select a country"
          options={Object.entries(COUNTRIES)
            .filter(([value]) => value !== "US")
            .map(([value, label]) => ({
              label,
              value,
            }))}
        />
      )}
    </FormStep>
  ),
};
