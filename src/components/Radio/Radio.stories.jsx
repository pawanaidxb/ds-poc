import React from "react";
import { Radio } from "./Radio";

export default {
  title: "Components/Radio",
  component: Radio,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
  },
};

export const Default = { args: { checked: false, readOnly: true } };
export const Checked = { args: { checked: true, readOnly: true } };
export const Disabled = { args: { checked: true, disabled: true, readOnly: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "center" }}>
      <Radio name="all-states" value="a" label="Default" />
      <Radio name="all-states" value="b" label="Checked" defaultChecked />
      <Radio name="all-states-disabled" value="c" label="Disabled" disabled />
      <Radio name="all-states-disabled" value="d" label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};
