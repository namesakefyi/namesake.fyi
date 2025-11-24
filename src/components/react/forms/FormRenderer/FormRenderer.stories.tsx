import type { Meta } from "@storybook/react-vite";
import { FormRenderer, type FormRendererProps } from "./FormRenderer";

const meta: Meta<typeof FormRenderer> = {
  component: FormRenderer,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const MassachusettsCourtOrder = (args: FormRendererProps) => (
  <FormRenderer {...args} />
);

MassachusettsCourtOrder.args = {
  componentId: "ma-court-order",
  title: "Massachusetts Court Order",
  description:
    "File for a court-ordered name change in Massachusetts. This is the first step in the legal name change process.",
};

export const SocialSecurity = (args: FormRendererProps) => (
  <FormRenderer {...args} />
);

SocialSecurity.args = {
  componentId: "social-security",
  title: "Social Security Card",
  description:
    "Apply for a new Social Security card with your updated name. This form helps you complete the SS-5 application.",
};

export const WithoutDescription = (args: FormRendererProps) => (
  <FormRenderer {...args} />
);

WithoutDescription.args = {
  componentId: "ma-court-order",
  title: "Massachusetts Court Order",
};

export const InvalidFormId = (args: FormRendererProps) => (
  <FormRenderer {...args} />
);

InvalidFormId.args = {
  componentId: "non-existent-form",
  title: "Non-existent Form",
  description: "This form ID doesn't exist in the registry.",
};

export const EmptyFormId = (args: FormRendererProps) => (
  <FormRenderer {...args} />
);

EmptyFormId.args = {
  componentId: "",
  title: "Empty Form ID",
};
