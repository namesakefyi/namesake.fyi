import type { Meta } from "@storybook/react-vite";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { FormTitleStep, type FormTitleStepProps } from "./FormTitleStep";

const meta: Meta<typeof FormTitleStep> = {
  component: FormTitleStep,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <FormStepContext.Provider
        value={{
          onNext: () => console.log("Next clicked"),
          onBack: () => console.log("Back clicked"),
          formTitle: "Massachusetts Court Order",
          currentStepIndex: 0, // Title step
          totalSteps: 5, // 5 actual steps
          isReviewStep: false,
        }}
      >
        <Story />
      </FormStepContext.Provider>
    ),
  ],
};

export default meta;

export const Example = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

Example.args = {
  title: "Massachusetts Court Order",
  onStart: () => console.log("Start clicked"),
};

export const WithDescription = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

WithDescription.args = {
  title: "Massachusetts Court Order",
  description:
    "File for a court-ordered name change in Massachusetts. This is the first step in the legal name change process.",
  onStart: () => console.log("Start clicked"),
};

export const WithChildren = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

WithChildren.args = {
  title: "Massachusetts Court Order",
  description:
    "File for a court-ordered name change in Massachusetts. This is the first step in the legal name change process.",
  onStart: () => console.log("Start clicked"),
  children: (
    <div>
      <p>
        <strong>What you'll need:</strong>
      </p>
      <ul>
        <li>Your current legal name</li>
        <li>Your desired new name</li>
        <li>Your contact information</li>
        <li>Your birthplace and date of birth</li>
      </ul>
    </div>
  ),
};

export const LongTitle = (args: FormTitleStepProps) => (
  <FormTitleStep {...args} />
);

LongTitle.args = {
  title:
    "Application for Social Security Card Name Change and Gender Marker Update",
  description:
    "This form helps you apply for a new Social Security card with your updated name and gender marker. The process typically takes 2-4 weeks after submission.",
  onStart: () => console.log("Start clicked"),
};
