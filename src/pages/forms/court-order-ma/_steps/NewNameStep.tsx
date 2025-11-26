import { FormStep } from "@/components/react/forms/FormStep";

export function NewNameStep() {
  return (
    <FormStep
      title="What is your new name?"
      description="This is the name you're making official! Type it exactly as you want it to appear."
    >
      {/* TODO: Add NameField components here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
