import React from "react";
import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    layout: { control: "inline-radio", options: ["text", "left-icon", "right-icon", "icon-only"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export const Primary = { args: { variant: "primary", children: "Book flight" } };
export const Secondary = { args: { variant: "secondary", children: "Cancel" } };
export const Disabled = { args: { variant: "primary", children: "Book flight", disabled: true } };

export const LeftIcon = { args: { variant: "primary", layout: "left-icon", children: "Book flight" } };
export const RightIcon = { args: { variant: "primary", layout: "right-icon", children: "Book flight" } };
export const IconOnly = { args: { variant: "primary", layout: "icon-only", children: "Book flight" } };

const LAYOUTS = ["text", "left-icon", "right-icon", "icon-only"];
export const AllStates = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: "var(--spacing-lg)", alignItems: "center" }}>
      {LAYOUTS.map((l) => (
        <React.Fragment key={l}>
          <Button variant="primary" layout={l}>Book flight</Button>
          <Button variant="secondary" layout={l}>Book flight</Button>
          <Button variant="primary" layout={l} disabled>Book flight</Button>
        </React.Fragment>
      ))}
    </div>
  ),
};
