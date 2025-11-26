import { MemorableDateField } from "~/components/react/forms";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";
import { FormStep } from "../../../components/react/forms/FormStep";

export function DateOfBirthStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your date of birth?">
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  );
}
