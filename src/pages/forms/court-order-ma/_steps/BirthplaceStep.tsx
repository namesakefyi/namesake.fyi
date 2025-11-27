import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { FormStep } from "@/components/react/forms/FormStep";
import { JURISDICTIONS } from "@/constants/jurisdictions";

export function BirthplaceStep() {
  return (
    <FormStep title="Where were you born?">
      <ShortTextField name="birthplaceCity" label="City" />
      <ComboBoxField
        name="birthplaceState"
        label="State"
        placeholder="Select a state"
        options={Object.entries(JURISDICTIONS).map(([value, label]) => ({
          label,
          value,
        }))}
      />
    </FormStep>
  );
}
