import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { COUNTRIES } from "@/constants/countries";
import { BIRTHPLACES } from "@/constants/jurisdictions";

export function BirthplaceStep() {
  return (
    <FormStep title="Where were you born?">
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
      {/* TODO: Add conditional ComboBoxField for birthplaceState when country is US */}
    </FormStep>
  );
}
