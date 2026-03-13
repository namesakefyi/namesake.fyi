import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const sexDesignationStep: Step = {
  id: "sex-designation",
  title: "Sex designation change",
  guard: (data) => data.shouldChangeSexDesignation === true,
  fields: [
    "newSexDesignation",
    "sexDesignationChangeReason",
    "hasPreviousSexDesignationChangePetition",
    "previousSexDesignationChangePetitionReason",
  ],
  isFieldVisible: (fieldName, data) => {
    if (fieldName === "previousSexDesignationChangePetitionReason") {
      return data.hasPreviousSexDesignationChangePetition === true;
    }
    return true;
  },
  component: ({ stepConfig }) => {
    const previousPetitionReasonVisible = useFieldVisible(
      stepConfig,
      "previousSexDesignationChangePetitionReason",
    );

    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="newSexDesignation"
          label="What sex designation would you like on your documents?"
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "X", value: "X" },
          ]}
        />

        <LongTextField
          name="sexDesignationChangeReason"
          label="Reason for sex designation change"
        />

        <YesNoField
          name="hasPreviousSexDesignationChangePetition"
          label="Have you previously filed a sex designation change petition?"
        />

        <FormSubsection
          title="Please explain."
          isVisible={previousPetitionReasonVisible}
        >
          <LongTextField
            name="previousSexDesignationChangePetitionReason"
            label="Reason for previous petition"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
