import { FormStep } from "@/components/react/forms/FormStep";

export function ContactInfoStep() {
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
