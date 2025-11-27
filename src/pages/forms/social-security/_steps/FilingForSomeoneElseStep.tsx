import { useFormContext } from "react-hook-form";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export function FilingForSomeoneElseStep() {
  const form = useFormContext();

  return (
    <FormStep title="Are you filing this form for someone else?">
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
  );
}
