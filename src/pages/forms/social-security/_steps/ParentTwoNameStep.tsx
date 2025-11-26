import {
  FormStep,
  NameField,
  type StepComponentProps,
} from "~/components/react/forms";

export function ParentTwoNameStep(_props: StepComponentProps) {
  return (
    <FormStep title="What is your father's (or second parent's) name?">
      <NameField type="fathersName" />
    </FormStep>
  );
}
