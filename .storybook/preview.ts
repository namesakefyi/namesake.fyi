import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

import "../src/styles/base.css";
import "../src/styles/reset.css";
import "../src/styles/theme.css";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    actions: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    docs: {
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themes.dark
        : themes.light,
    },
  },
  decorators: [
    withThemeByDataAttribute({
      attributeName: "data-color",
      themes: {
        purple: "purple",
        pink: "pink",
        blue: "blue",
        yellow: "yellow",
        green: "green",
        brown: "brown",
        white: "white",
      },
      defaultTheme: "white",
    }),
  ],
};

export default preview;
