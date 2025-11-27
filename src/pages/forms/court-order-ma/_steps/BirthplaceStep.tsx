import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { JURISDICTIONS } from "@/constants/jurisdictions";

export const birthplaceStep: StepConfig = {
  id: "birthplace",
  title: "Where were you born?",
  fields: ["birthplaceCity", "birthplaceState", "birthplaceCountry"],
  isFieldVisible: (fieldName, data) => {
    // birthplaceCountry is only visible if birthplaceState is "other" (Outside the US)
    if (fieldName === "birthplaceCountry") {
      return data.birthplaceState === "other";
    }
    return true;
  },
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
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
  ),
};
