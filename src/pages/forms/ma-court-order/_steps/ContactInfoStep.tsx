import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function ContactInfoStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your contact information?"
      description="The court uses this to communicate with you about your status."
    >
      {/* TODO: Add PhoneField and EmailField components here */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
