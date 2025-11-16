import type { Meta, StoryFn } from "@storybook/react";
import { Button } from "../Button";

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Button>;

export const Example: Story = (args) => <Button {...args}>Press me</Button>;

Example.args = {
  onPress: () => alert("Hello world!"),
};
