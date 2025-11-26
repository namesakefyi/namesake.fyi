import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function NewNameStep(_props: StepComponentProps) {
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
