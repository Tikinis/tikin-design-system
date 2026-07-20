import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // Las stories viven junto a cada componente en @tikin/ui, no aqui. Asi el
  // componente, su test y su documentacion se mueven juntos, y el registry
  // puede excluir *.stories.tsx sin tocar nada mas.
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)", "../../../packages/ui/src/**/*.mdx"],

  // addon-essentials ya no existe: se disolvio en el core a partir de
  // Storybook 9 (su ultima version publicada es la 8.6).
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],

  framework: { name: "@storybook/react-vite", options: {} },

  typescript: {
    // Genera la tabla de props desde los tipos reales del componente.
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
