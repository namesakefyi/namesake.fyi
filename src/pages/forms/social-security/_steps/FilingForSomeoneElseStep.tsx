import { FormStep, FormSubsection, useFieldVisible } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const filingForSomeoneElseStep: Step = {
  id: "filing-for-someone-else",
  title: "Are you filing this form for someone else?",
  fields: [
    "isFilingForSomeoneElse",
    "relationshipToFilingFor",
    "relationshipToFilingForOther",
  ],
  isFieldVisible: (fieldName, data) => {
    // relationshipToFilingFor only visible if filing for someone else
    if (fieldName === "relationshipToFilingFor") {
      return data.isFilingForSomeoneElse === true;
    }
    // relationshipToFilingForOther only visible if filing for someone else AND relationship is "other"
    if (fieldName === "relationshipToFilingForOther") {
      return (
        data.isFilingForSomeoneElse === true &&
        data.relationshipToFilingFor === "other"
      );
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const relationshipVisible = useFieldVisible(stepConfig, "relationshipToFilingFor");
    const relationshipOtherVisible = useFieldVisible(stepConfig, "relationshipToFilingForOther");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isFilingForSomeoneElse"
          label="Are you filing this form for someone else?"
          labelHidden
          yesLabel="Yes, I am filing this for someone else"
          noLabel="No, I am filing this for myself"
        />
        <FormSubsection
          title="What is your relationship to the person you are filing for?"
          isVisible={relationshipVisible}
        >
          <RadioGroupField
            name="relationshipToFilingFor"
            label="Relationship"
            labelHidden
            options={[
              { label: "Natural or Adoptive Parent", value: "parent" },
              { label: "Legal Guardian", value: "legalGuardian" },
              { label: "Other", value: "other" },
            ]}
          />
          {relationshipOtherVisible && (
            <ShortTextField
              name="relationshipToFilingForOther"
              label="Specify relationship"
              size={34}
            />
          )}
        </FormSubsection>
      </FormStep>
    );
  },
};
