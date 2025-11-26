import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function OtherNamesStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="Have you ever used any other name or alias?"
      description="This includes any names that you have used over a long period of time but did not change legally. This does not include nicknames or other names you've used for short periods of time."
    >
      {/* TODO: Add YesNoField and conditional LongTextField */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
