import { useFormContext } from "react-hook-form";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";

export function OtherNamesStep() {
  const form = useFormContext();

  return (
    <FormStep
      title="Have you ever used any other name or alias?"
      description="This includes any names that you have used over a long period of time but did not change legally. This does not include nicknames or other names you've used for short periods of time."
    >
      <YesNoField
        name="hasUsedOtherNameOrAlias"
        label="Have you ever used any other name or alias?"
        labelHidden
        yesLabel="Yes, I've used other names"
        noLabel="No, there are no other major names I've used"
      />
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
  );
}
