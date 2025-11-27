import { Banner } from "@/components/react/common/Banner";
import { CheckboxGroupField } from "@/components/react/forms/CheckboxGroupField";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep } from "@/components/react/forms/FormStep";

export const raceStep: StepConfig = {
  id: "race",
  title: "What is your race?",
  description: "This response is optional.",
  fields: ["race"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxGroupField
        name="race"
        label="Race"
        includePreferNotToAnswer
        options={[
          {
            label: "Native Hawaiian",
            value: "nativeHawaiian",
          },
          {
            label: "Alaska Native",
            value: "alaskaNative",
          },
          {
            label: "Asian",
            value: "asian",
          },
          {
            label: "American Indian",
            value: "americanIndian",
          },
          {
            label: "Black or African American",
            value: "black",
          },
          {
            label: "Other Pacific Islander",
            value: "otherPacificIslander",
          },
          {
            label: "White",
            value: "white",
          },
        ]}
      />
      <Banner variant="info">
        The Social Security Administration requests this information for
        research and statistical purposes.
      </Banner>
    </FormStep>
  ),
};
