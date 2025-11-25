import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function BirthplaceStep(_props: StepComponentProps) {
  return (
    <FormStep title="Where were you born?">
      {/* TODO: Add ShortTextField for birthplaceCity */}
      {/* TODO: Add ComboBoxField for birthplaceState with BIRTHPLACES options */}
      {/* TODO: Add conditional ComboBoxField for birthplaceCountry with COUNTRIES options */}
    </FormStep>
  );
}
