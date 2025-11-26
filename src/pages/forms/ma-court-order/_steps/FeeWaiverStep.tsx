import { FormStep } from "@/components/react/forms/FormStep";

export function FeeWaiverStep() {
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
