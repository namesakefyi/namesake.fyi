import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const consentStep: Step = {
  id: "consent",
  title: "Does everyone consent to the name change?",
  fields: [
    "isParent1Assenting",
    "parent1DissentReason",
    "isParent2Assenting",
    "parent2DissentReason",
    "hasCourtAppointedGuardian",
    "isAllGuardiansAssenting",
    "guardianDissentReason",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "parent1DissentReason") {
      return data.isParent1Assenting === false;
    }
    if (fieldName === "parent2DissentReason") {
      return data.isParent2Assenting === false;
    }
    if (fieldName === "guardianDissentReason") {
      return data.isAllGuardiansAssenting === false;
    }
    if (fieldName === "hasCourtAppointedGuardian") {
      return data.hasCourtAppointedGuardian === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const parent1DissentVisible = useFieldVisible(
      stepConfig,
      "parent1DissentReason",
    );
    const parent2DissentVisible = useFieldVisible(
      stepConfig,
      "parent2DissentReason",
    );
    const guardianVisible = useFieldVisible(
      stepConfig,
      "hasCourtAppointedGuardian",
    );
    const guardianDissentVisible = useFieldVisible(
      stepConfig,
      "guardianDissentReason",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isParent1Assenting"
          label="Does parent 1 consent to the name change?"
        />
        <FormSubsection isVisible={parent1DissentVisible}>
          <LongTextField name="parent1DissentReason" label="Reason" />
        </FormSubsection>
        <YesNoField
          name="isParent2Assenting"
          label="Does parent 2 consent to the name change?"
        />
        <FormSubsection isVisible={parent2DissentVisible}>
          <LongTextField name="parent2DissentReason" label="Reason" />
        </FormSubsection>
        {guardianVisible && (
          <>
            <YesNoField
              name="isAllGuardiansAssenting"
              label="Do all court-appointed guardians consent to the name change?"
            />
            <FormSubsection isVisible={guardianDissentVisible}>
              <LongTextField name="guardianDissentReason" label="Reason" />
            </FormSubsection>
          </>
        )}
      </FormStep>
    );
  },
};
