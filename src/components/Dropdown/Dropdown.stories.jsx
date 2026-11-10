import React from "react";
import { Dropdown } from "./Dropdown";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  argTypes: {
    selection: { control: "inline-radio", options: ["single", "multiple"] },
    label: { control: "text" },
    helperText: { control: "text" },
    showHelper: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    disabled: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
};

export const Default = { args: { selection: "single" } };
export const Selected = { args: { selection: "single", defaultValue: "design" } };
export const Open = { args: { selection: "single", defaultValue: "design", defaultOpen: true } };
export const ErrorState = { name: "Error", args: { selection: "single", error: true } };
export const Disabled = { args: { selection: "single", disabled: true } };
export const MultipleSelected = { args: { selection: "multiple", defaultValue: ["design", "engineering"] } };
export const MultipleOpen = { args: { selection: "multiple", defaultValue: ["design", "engineering"], defaultOpen: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 320px)", gap: "var(--spacing-lg)", alignItems: "start" }}>
      {["single", "multiple"].map((s) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <Dropdown selection={s} />
          <Dropdown selection={s} defaultValue={s === "single" ? "design" : ["design", "engineering"]} />
          <Dropdown selection={s} error />
          <Dropdown selection={s} disabled />
        </div>
      ))}
    </div>
  ),
};
