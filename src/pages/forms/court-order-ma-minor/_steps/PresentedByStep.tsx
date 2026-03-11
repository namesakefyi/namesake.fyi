import { FormStep } from "@/components/react/forms/FormStep";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import type { Step } from "@/forms/types";

export const presentedByStep: Step = {
  id: "presented-by",
  title: "Who is presenting this petition?",
  description:
    "Select all that apply.",
  fields: [
    "isPresentedByLegalMotherParent1",
    "isPresentedByLegalFatherParent2",
    "isPresentedByCourtAppointedGuardian",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField
        name="isPresentedByLegalMotherParent1"
        label="Legal mother (or first parent)"
      />
      <CheckboxField
        name="isPresentedByLegalFatherParent2"
        label="Legal father (or second parent)"
      />
      <CheckboxField
        name="isPresentedByCourtAppointedGuardian"
        label="Court-appointed guardian(s)"
      />
    </FormStep>
  ),
};
