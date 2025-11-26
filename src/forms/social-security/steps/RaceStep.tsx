import { Banner } from "~/components/react/common/Banner";
import { CheckboxGroupField } from "~/components/react/forms";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function RaceStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your race?"
      description="This response is optional and does not affect your application."
    >
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
  );
}
