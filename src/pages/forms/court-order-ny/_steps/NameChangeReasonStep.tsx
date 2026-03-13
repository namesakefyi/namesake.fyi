import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";
import type { Step } from "@/forms/types";

export const nameChangeReasonStep: Step = {
  id: "name-change-reason",
  title: "Why are you changing your name?",
  guard: (data) => data.shouldChangeName === true,
  fields: ["reasonForChangingName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <LongTextField
        name="reasonForChangingName"
        label="Reason for name change"
      />
      <Banner>
        <p>
          <strong>What do I write?</strong> Provide a basic reason. Examples:
        </p>
        <ul>
          <li>"I want a name which aligns with my gender identity."</li>
          <li>"This is the name everyone knows me by."</li>
          <li>"I am transgender."</li>
        </ul>
      </Banner>
    </FormStep>
  ),
};
