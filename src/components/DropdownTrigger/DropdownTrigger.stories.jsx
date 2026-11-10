import React from "react";
import { DropdownTrigger } from "./DropdownTrigger";

export default {
  title: "Components/Dropdown/Trigger",
  component: DropdownTrigger,
  argTypes: {
    selection: { control: "inline-radio", options: ["single", "multiple"] },
    placeholder: { control: "text" },
    open: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const Default = { args: { selection: "single" } };
export const Selected = { args: { selection: "single", value: "Design" } };
export const Open = { args: { selection: "single", value: "Design", open: true } };
export const ErrorState = { name: "Error", args: { selection: "single", error: true } };
export const Disabled = { args: { selection: "single", disabled: true } };
export const MultipleSelected = { args: { selection: "multiple", value: ["Design", "Engineering"], placeholder: "Select teams" } };
