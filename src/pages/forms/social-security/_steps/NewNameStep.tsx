import {
  FormStep,
  NameField,
  type StepComponentProps,
} from "~/components/react/forms";

export function NewNameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your new name?"
      description="This is the name that will show on your new card."
    >
      <NameField type="newName" />
    </FormStep>
  );
}
