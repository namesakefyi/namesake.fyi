import { FormStep } from "@/components/react/forms/FormStep";

export function ImpoundCaseStep() {
  return (
    <FormStep
      title="Would you like to impound your case?"
      description="All court actions are public record by default. However, you can apply to impound your case to keep it private."
    >
      {/* TODO: Add YesNoField, conditional LongTextField and Banner */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
