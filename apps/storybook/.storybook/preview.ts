import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

import "@tikin/tokens/fonts.css";
import "./tailwind.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // El fondo lo pone el tema via --tk-bg; el selector de fondos de Storybook
    // solo taparia el resultado real.
    backgrounds: { disable: true },
    a11y: {
      // Las violaciones fallan la story en vez de solo avisar: un sistema de
      // diseño que envia problemas de accesibilidad los multiplica por cada
      // producto que lo consume.
      test: "error",
    },
    options: {
      storySort: {
        order: ["Fundaciones", "Componentes", "*"],
      },
    },
  },

  decorators: [
    // Alterna la clase .dark, el mismo mecanismo que usa el documento.
    withThemeByClassName({
      themes: { Claro: "", Oscuro: "dark" },
      defaultTheme: "Claro",
    }),
  ],
};

export default preview;
