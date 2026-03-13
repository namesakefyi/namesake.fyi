import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const marriageAndFamilyStep: Step = {
  id: "marriage-and-family",
  title: "Marriage and family status",
  fields: ["isCurrentlyMarried", "isPreviouslyMarried", "hasChildrenUnder21"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isCurrentlyMarried"
        label="Are you currently married?"
      />
      <YesNoField
        name="isPreviouslyMarried"
        label="Have you been previously married?"
      />
      <YesNoField
        name="hasChildrenUnder21"
        label="Do you have children under the age of 21?"
      />
    </FormStep>
  ),
};
