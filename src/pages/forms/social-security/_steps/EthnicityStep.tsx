import { Banner } from "@/components/react/common/Banner";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const ethnicityStep: StepConfig = {
  id: "ethnicity",
  title: "What is your ethnicity?",
  description:
    "This response is optional and does not affect your application. The Social Security Administration requests this information for research and statistical purposes.",
  fields: ["isHispanicOrLatino"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isHispanicOrLatino"
        label="Ethnicity"
        yesLabel="I am Hispanic or Latino"
        noLabel="I am not Hispanic or Latino"
        includePreferNotToAnswer
      />
      <Banner variant="info">
        The Social Security Administration requests this information for
        research and statistical purposes.
      </Banner>
    </FormStep>
  ),
};
