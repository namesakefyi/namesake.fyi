import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const sealingRequestStep: Step = {
  id: "sealing-request",
  title: "Do you want to seal the court record?",
  description:
    "Sealing the record means it won't be publicly accessible. This is optional.",
  fields: ["shouldSealRecords", "sealingRequestDetails"],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "sealingRequestDetails") {
      return data.shouldSealRecords === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(stepConfig, "sealingRequestDetails");

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldSealRecords"
          label="Would you like to request that the court seal the record?"
          labelHidden
          yesLabel="Yes, seal the record"
          noLabel="No, don't seal the record"
        />
        <FormSubsection
          title="Please explain why you want the record sealed."
          isVisible={detailsVisible}
        >
          <LongTextField
            name="sealingRequestDetails"
            label="Reason for sealing request"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
