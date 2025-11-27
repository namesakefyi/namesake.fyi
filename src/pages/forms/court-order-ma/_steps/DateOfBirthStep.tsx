import { FormStep } from "@/components/react/forms/FormStep";
import { MemorableDateField } from "@/components/react/forms/MemorableDateField";

export function DateOfBirthStep() {
  return (
    <FormStep title="What is your date of birth?">
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  );
}
