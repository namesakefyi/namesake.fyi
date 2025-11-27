import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { FormStep } from "@/components/react/forms/FormStep";

export function MothersMaidenNameStep() {
  return (
    <FormStep
      title="What is your mother's maiden name?"
      description="The court requests this information in order to look up past court records and verify your identity. The maiden name is the last name (or family name) of your mother (or guardian) before marriage."
    >
      <ShortTextField name="mothersMaidenName" label="Mother's maiden name" />
    </FormStep>
  );
}
