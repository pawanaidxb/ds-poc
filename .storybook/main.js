/** Storybook setup. You do not need to change this file. */
const config = {
  stories: ["../src/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: { name: "@storybook/react-vite", options: {} },
};
export default config;
