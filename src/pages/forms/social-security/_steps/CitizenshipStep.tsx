import { Banner } from "@/components/react/common/Banner";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";

export const citizenshipStep: StepConfig = {
  id: "citizenship",
  title: "What is your citizenship status?",
  fields: ["citizenshipStatus"],
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="citizenshipStatus"
        label="Citizenship status"
        options={[
          {
            label: "U.S. Citizen",
            value: "usCitizen",
          },
          {
            label: "Legal Alien Allowed To Work",
            value: "legalAlienAllowedToWork",
          },
          {
            label: "Legal Alien Not Allowed To Work",
            value: "legalAlienNotAllowedToWork",
          },
          {
            label: "Other",
            value: "other",
          },
        ]}
      />
      {(form.watch("citizenshipStatus") === "other" ||
        form.watch("citizenshipStatus") === "legalAlienNotAllowedToWork") && (
        <Banner variant="warning">
          You must provide a document from a U.S. Federal, State, or local
          government agency that explains why you need a Social Security number
          and that you meet all the requirements for the government benefit.
        </Banner>
      )}{" "}
    </FormStep>
  ),
};
