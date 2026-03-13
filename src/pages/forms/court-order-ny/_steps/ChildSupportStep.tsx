import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const childSupportStep: Step = {
  id: "child-support",
  title: "Child support",
  guard: (data) => data.hasChildrenUnder21 === true,
  fields: [
    "hasChildSupportObligation",
    "isChildSupportPaymentsCurrent",
    "childSupportOwed",
    "courtIssuingChildSupportOrder",
    "childSupportCollectionsUnit",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "hasChildSupportObligation") return true;
    return data.hasChildSupportObligation === true;
  },
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "isChildSupportPaymentsCurrent",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasChildSupportObligation"
          label="Do you have a child support obligation?"
        />
        <FormSubsection
          title="Child support details"
          isVisible={detailsVisible}
        >
          <YesNoField
            name="isChildSupportPaymentsCurrent"
            label="Are your child support payments current?"
          />
          <ShortTextField
            name="childSupportOwed"
            label="Amount owed (if not current)"
          />
          <ShortTextField
            name="courtIssuingChildSupportOrder"
            label="Court that issued the child support order"
          />
          <ShortTextField
            name="childSupportCollectionsUnit"
            label="Child support collections unit"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
