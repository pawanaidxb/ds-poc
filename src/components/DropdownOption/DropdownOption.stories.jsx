import React from "react";
import { DropdownOption } from "./DropdownOption";

export default {
  title: "Components/Dropdown/Option",
  component: DropdownOption,
  argTypes: {
    selection: { control: "inline-radio", options: ["single", "multiple"] },
    label: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const Default = { args: { selection: "single" } };
export const Selected = { args: { selection: "single", selected: true } };
export const Disabled = { args: { selection: "single", disabled: true } };
export const MultipleSelected = { args: { selection: "multiple", selected: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 320px)", gap: "var(--spacing-md)" }}>
      {["single", "multiple"].map((s) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <DropdownOption selection={s} />
          <DropdownOption selection={s} selected />
          <DropdownOption selection={s} disabled />
          <p style={{ fontSize: 12, margin: 0 }}>Hover and Tab show the hover and focus states.</p>
        </div>
      ))}
    </div>
  ),
};
