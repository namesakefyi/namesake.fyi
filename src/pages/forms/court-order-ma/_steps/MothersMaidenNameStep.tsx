import { FormStep } from "@/components/react/forms/FormStep";

export function MothersMaidenNameStep() {
  return (
    <FormStep
      title="What is your mother's maiden name?"
      description="The court requests this information in order to look up past court records and verify your identity. The maiden name is the last name (or family name) of your mother (or guardian) before marriage."
    >
      {/* TODO: Add ShortTextField component here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
