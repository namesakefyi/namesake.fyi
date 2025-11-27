import { Banner } from "@/components/react/common/Banner";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";

export const mothersMaidenNameStep: StepConfig = {
  id: "mothers-maiden-name",
  title: "What is your mother's maiden name?",
  description:
    "The court requests this information in order to look up past court records and verify your identity.",
  fields: ["mothersMaidenName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="mothersMaidenName" label="Mother's maiden name" />
      <Banner variant="info">
        The maiden name is the last name (or family name) of your mother (or
        guardian) before marriage.
      </Banner>
    </FormStep>
  ),
};
