import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const parentsDeceasedStep: Step = {
  id: "parent-deceased",
  title: "Are any of the minor's legal parents deceased?",
  fields: ["isALegalParentDeceased"],
  component: ({ stepConfig }) => {
    const form = useFormContext();

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isALegalParentDeceased"
          label="Are any of the minor's parents deceased?"
          labelHidden
          yesLabel="Yes, one or more parents have died"
          noLabel="No, the minor's parents are both living"
        />
        {form.watch("isALegalParentDeceased") === true && (
          <Banner>
            You will need to attach a copy of the death certificate to the
            application.
          </Banner>
        )}
      </FormStep>
    );
  },
};
