import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import type { Step } from "@/forms/types";

export const birthplaceStep: Step = {
  id: "birthplace",
  title: "Where were you born?",
  fields: ["birthplaceCity"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField
        name="birthplaceCity"
        label="City and state (or country)"
      />
    </FormStep>
  ),
};
