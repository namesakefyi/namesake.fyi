import { FormStep } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";

export function CitizenshipStep() {
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
