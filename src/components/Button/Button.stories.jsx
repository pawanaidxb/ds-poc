import React from "react";
import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export const Primary = { args: { variant: "primary", children: "Book flight" } };
export const Secondary = { args: { variant: "secondary", children: "Cancel" } };
export const Disabled = { args: { variant: "primary", children: "Book flight", disabled: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "center" }}>
      <Button variant="primary">Book flight</Button>
      <Button variant="secondary">Book flight</Button>
      <Button variant="primary" disabled>Book flight</Button>
    </div>
  ),
};
