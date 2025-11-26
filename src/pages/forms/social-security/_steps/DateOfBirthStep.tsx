import {
  FormStep,
  MemorableDateField,
  type StepComponentProps,
} from "~/components/react/forms";

export function DateOfBirthStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your date of birth?">
      <MemorableDateField name="dateOfBirth" label="Date of birth" />
    </FormStep>
  );
}
