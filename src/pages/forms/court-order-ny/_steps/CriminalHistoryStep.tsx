import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const criminalHistoryStep: Step = {
  id: "criminal-history",
  title: "Criminal history and legal disclosures",
  fields: [
    "hasConviction",
    "courtOfConviction",
    "crime",
    "hasBankruptcy",
    "hasJudgementsOrLiens",
    "isPartyToAction",
    "partyToActionDetails",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "courtOfConviction" || fieldName === "crime") {
      return data.hasConviction === true;
    }
    if (fieldName === "partyToActionDetails") {
      return data.isPartyToAction === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const convictionDetailsVisible = useFieldVisible(
      stepConfig,
      "courtOfConviction",
    );
    const partyDetailsVisible = useFieldVisible(
      stepConfig,
      "partyToActionDetails",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasConviction"
          label="Have you ever been convicted of a crime?"
        />
        <FormSubsection
          title="Conviction details"
          isVisible={convictionDetailsVisible}
        >
          <ShortTextField
            name="courtOfConviction"
            label="Court of conviction"
          />
          <ShortTextField name="crime" label="Crime" />
        </FormSubsection>

        <YesNoField
          name="hasBankruptcy"
          label="Have you ever filed for bankruptcy?"
        />

        <YesNoField
          name="hasJudgementsOrLiens"
          label="Are there any judgements or liens filed against you?"
        />

        <YesNoField
          name="isPartyToAction"
          label="Are you party to any actions or proceedings in any court?"
        />
        <FormSubsection
          title="Please provide details."
          isVisible={partyDetailsVisible}
        >
          <LongTextField
            name="partyToActionDetails"
            label="Details of action or proceeding"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
