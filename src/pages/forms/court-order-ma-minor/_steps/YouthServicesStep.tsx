import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const youthServicesStep: Step = {
  id: "youth-services",
  title: "Is the minor under the supervision of the Massachusetts Department of Youth Services?",
  fields: ["isUnderSupervisionOfMassDeptOfYouthServices"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isUnderSupervisionOfMassDeptOfYouthServices"
        label="Is the minor under the supervision of the Massachusetts Department of Youth Services?"
        labelHidden
        yesLabel="Yes"
        noLabel="No"
      />
    </FormStep>
  ),
};
