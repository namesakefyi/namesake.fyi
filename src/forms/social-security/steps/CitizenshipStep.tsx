import { RadioGroupField } from "~/components/react/forms";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function CitizenshipStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your citizenship status?">
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
      {/* TODO: Add conditional Banner for legalAlienNotAllowedToWork and other */}
    </FormStep>
  );
}
