import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { LongTextField } from "@/components/react/forms/LongTextField";

export function ReasonStep() {
  return (
    <FormStep title="What is the reason you're changing your name?">
      <LongTextField
        name="reasonForChangingName"
        label="Reason for name change"
      />
      <Banner>
        <p>
          <strong>What do I write?</strong> Provide a basic reason—no need to go
          into detail. Examples:
        </p>
        <ul>
          <li>"I want a name which aligns with my gender identity."</li>
          <li>"This is the name everyone knows me by."</li>
          <li>
            "This is my preferred name and I wish to obtain proper
            documentation."
          </li>
          <li>"I am transgender."</li>
        </ul>
      </Banner>
    </FormStep>
  );
}
