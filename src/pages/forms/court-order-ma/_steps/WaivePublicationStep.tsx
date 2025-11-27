import { Banner } from "@/components/react/common/Banner";
import type { StepConfig } from "@/components/react/forms/FormContainer";
import { FormStep, FormSubsection } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import { YesNoField } from "@/components/react/forms/YesNoField";

export const waivePublicationStep: StepConfig = {
  id: "waive-publication",
  title: "Would you like to waive the newspaper publication requirement?",
  description:
    "The legal name change process requires publication in a newspaper. However, we can help you file a motion to waive this requirement.",
  fields: ["shouldWaivePublicationRequirement", "reasonToWaivePublication"],
  isFieldVisible: (fieldName, data) => {
    // reasonToWaivePublication only visible if shouldWaivePublicationRequirement is true
    if (fieldName === "reasonToWaivePublication") {
      return data.shouldWaivePublicationRequirement === true;
    }
    return true;
  },
  component: ({ stepConfig, form }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="shouldWaivePublicationRequirement"
        label="Waive the publication requirement?"
        labelHidden
        yesLabel="Yes, apply to waive the publication requirement"
        noLabel="No, I will publish my name change in a newspaper"
      />
      <FormSubsection
        isVisible={form.watch("shouldWaivePublicationRequirement") === true}
      >
        <LongTextField
          name="reasonToWaivePublication"
          label="Reason to waive publication"
          description='Ask for a waiver of publication for your name change and state a "good cause" for it.'
        />
        <Banner>
          <p>
            <strong>What do I write?</strong> The court is looking for a legal
            basis to exempt you from the newspaper publishing requirement.
            Recommendations:
          </p>
          <ul>
            <li>
              Note how publishing could pose a threat to your privacy or safety.
            </li>
            <li>Be as specific to your personal situation as possible.</li>
            <li>
              Explain that you are not changing your name for an impermissible
              reason, such as evasion of debts or criminal liabilities.
            </li>
            <li>
              If you are not changing your last name, explicitly mention that "I
              am not changing my last name" in the motion. (You can still file
              this form if you are changing your name in its entirety.)
            </li>
          </ul>
        </Banner>
      </FormSubsection>
    </FormStep>
  ),
};
