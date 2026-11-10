// Loads the design tokens into every story and adds a Light / Dark switch
// to the Storybook toolbar. Dark mode uses the "Dark" mode from Figma.
// The Brand switch uses the modes of the Figma "Brand" collection.
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
    brand: {
      description: "Brand from the Figma Brand collection",
      defaultValue: "brand-a",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "brand-a", title: "Brand A" },
          { value: "brand-b", title: "Brand B" },
          { value: "brand-c", title: "Brand C" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.setAttribute("data-brand", context.globals.brand || "brand-a");
      return Story();
    },
  ],
};
export default preview;
