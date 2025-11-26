import {
  FormStep,
  NameField,
  type StepComponentProps,
} from "~/components/react/forms";

export function OldNameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What was your name at birth?"
      description="This is the name that appears on your original birth certificate."
    >
      <NameField type="oldName" />
    </FormStep>
  );
}
