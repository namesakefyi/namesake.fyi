import type { StorybookConfig } from "@storybook/react-vite";

const excludedProps = new Set([
  "id",
  "slot",
  "onCopy",
  "onCut",
  "onPaste",
  "onCompositionStart",
  "onCompositionEnd",
  "onCompositionUpdate",
  "onSelect",
  "onBeforeInput",
  "onInput",
]);

const config: StorybookConfig = {
  stories: ["../src/components/react/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-themes",
    "@storybook/addon-links",
    "@vueless/storybook-dark-mode",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) =>
        !prop.name.startsWith("aria-") && !excludedProps.has(prop.name),
    },
  },
};

export default config;
