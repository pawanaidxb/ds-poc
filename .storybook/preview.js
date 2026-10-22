// Loads the design tokens into every story and adds a Light / Dark switch
// to the Storybook toolbar. Dark mode uses the "Dark" mode from Figma.
import "../src/styles/tokens.css";
import "../src/styles/base.css";

const preview = {
  parameters: { layout: "centered" },
  globalTypes: {
    theme: {
      description: "Colour mode from Figma",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      document.documentElement.setAttribute("data-theme", theme);
      return Story();
    },
  ],
};
export default preview;
