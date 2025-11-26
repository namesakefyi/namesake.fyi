import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function PronounsStep(_props: StepComponentProps) {
  return (
    <FormStep title="Do you want to share your pronouns with the court staff?">
      {/* TODO: Add YesNoField and conditional PronounSelectField */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
