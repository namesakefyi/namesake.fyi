import { Banner } from "@/components/react/common/Banner";
import type { StepConfig } from "@/components/react/forms/FormContainer/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const otherNamesStep: StepConfig = {
  id: "other-names",
  title: "Have you ever used any other name or alias?",
  description:
    "This includes any names that you have used over a long period of time but did not change legally.",
  fields: ["hasUsedOtherNameOrAlias", "otherNamesOrAliases"],
  isFieldVisible: (fieldName, data) => {
    // otherNamesOrAliases only visible if hasUsedOtherNameOrAlias is true
    if (fieldName === "otherNamesOrAliases") {
      return data.hasUsedOtherNameOrAlias === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="hasUsedOtherNameOrAlias"
        label="Have you ever used any other name or alias?"
        labelHidden
        yesLabel="Yes, I've used other names"
        noLabel="No, there are no other major names I've used"
      />
      <Banner variant="info">
        This does not include nicknames or other names you've used for short
        periods of time.
      </Banner>
      <FormSubsection
        title="Please list all names you haven't previously listed."
        isVisible={form.watch("hasUsedOtherNameOrAlias") === true}
      >
        <LongTextField
          name="otherNamesOrAliases"
          label="Other names or aliases"
        />
      </FormSubsection>
    </FormStep>
  ),
};
