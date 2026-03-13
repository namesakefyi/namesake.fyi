import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const spousalSupportStep: Step = {
  id: "spousal-support",
  title: "Spousal support",
  guard: (data) =>
    data.isCurrentlyMarried === true || data.isPreviouslyMarried === true,
  fields: [
    "hasSpousalSupportObligation",
    "isSpousalSupportPaymentsCurrent",
    "spousalSupportOwed",
    "courtIssuingSpousalSupportOrder",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "hasSpousalSupportObligation") return true;
    return data.hasSpousalSupportObligation === true;
  },
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "isSpousalSupportPaymentsCurrent",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasSpousalSupportObligation"
          label="Do you have a spousal support obligation?"
        />
        <FormSubsection
          title="Spousal support details"
          isVisible={detailsVisible}
        >
          <YesNoField
            name="isSpousalSupportPaymentsCurrent"
            label="Are your spousal support payments current?"
          />
          <ShortTextField
            name="spousalSupportOwed"
            label="Amount owed (if not current)"
          />
          <ShortTextField
            name="courtIssuingSpousalSupportOrder"
            label="Court that issued the spousal support order"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
