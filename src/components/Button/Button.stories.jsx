import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
  },
};

export const Primary = { args: { variant: "primary", children: "Book flight" } };
export const Secondary = { args: { variant: "secondary", children: "Cancel" } };
export const Disabled = { args: { variant: "primary", children: "Book flight", disabled: true } };
