import {
  ComboBoxField,
  FormStep,
  ShortTextField,
  type StepComponentProps,
} from "~/components/react/forms";
import { COUNTRIES } from "~/constants/countries";
import { BIRTHPLACES } from "~/constants/jurisdictions";

export function BirthplaceStep(_props: StepComponentProps) {
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
