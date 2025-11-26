import { FormStep, type StepComponentProps } from "~/components/react/forms";

export function FeeWaiverStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="Do you need to apply for a fee waiver?"
      description="If you are unable to pay the filing fee, you can file an Affidavit of Indigency—a document proving that you are unable to pay."
    >
      {/* TODO: Add YesNoField, conditional Banner and QuestCostsTable */}
      <p>Form fields will go here...</p>
    </FormStep>
  );
}
