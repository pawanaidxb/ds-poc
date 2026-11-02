import React from "react";
import { Checkbox } from "./Checkbox";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export const Default = { args: { checked: false } };
export const Filled = { args: { checked: true } };
export const Disabled = { args: { checked: true, disabled: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "center" }}>
      <Checkbox label="Default" />
      <Checkbox label="Filled" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled filled" disabled defaultChecked />
    </div>
  ),
};
