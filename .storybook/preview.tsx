import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: We need to import React for Storybook previews
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { themes } from "storybook/theming";

// Storybook does not go through Astro's experimental Fonts API, so we
// re-declare the @font-face rules + --font-sans variable here. Imported
// before base.css so the cascade resolves the variable correctly.
// See: https://github.com/namesakefyi/namesake/issues/500
import "./storybook-fonts.css";
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
    (Story) => {
      const form = useForm();

      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export default preview;
