import {
  FormStep,
  LongTextField,
  type StepComponentProps,
} from "~/components/react/forms";

export function PreviousNamesStep(_props: StepComponentProps) {
  return (
    <FormStep title="What other legal names have you used, if any?">
      <LongTextField name="previousLegalNames" label="Other names used" />
    </FormStep>
  );
}
