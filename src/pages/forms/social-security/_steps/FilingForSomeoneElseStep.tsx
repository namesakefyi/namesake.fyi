import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const filingForSomeoneElseStep: StepConfig = {
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
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isFilingForSomeoneElse"
        label="Are you filing this form for someone else?"
        labelHidden
        yesLabel="Yes, I am filing this for someone else"
        noLabel="No, I am filing this for myself"
      />
      {form.watch("isFilingForSomeoneElse") === true && (
        <FormSubsection title="What is your relationship to the person you are filing for?">
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
          {form.watch("relationshipToFilingFor") === "other" && (
            <ShortTextField
              name="relationshipToFilingForOther"
              label="Specify relationship"
              size={34}
            />
          )}
        </FormSubsection>
      )}
    </FormStep>
  ),
};
