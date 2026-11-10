import React from "react";
import { DropdownList } from "./DropdownList";

const OPTIONS = ["Design", "Engineering", "Marketing", "Sales", "Customer success"].map((l) => ({ value: l.toLowerCase(), label: l }));

export default {
  title: "Components/Dropdown/List",
  component: DropdownList,
  argTypes: {
    selection: { control: "inline-radio", options: ["single", "multiple"] },
    query: { control: "text" },
  },
  args: { options: OPTIONS },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const SingleOptions = { args: { selection: "single", selected: ["design"] } };
export const MultipleOptions = { args: { selection: "multiple", selected: ["design", "engineering"] } };
export const SingleEmpty = { args: { selection: "single", selected: ["design"], query: "Legal" } };
export const MultipleEmpty = { args: { selection: "multiple", selected: ["design", "engineering"], query: "Legal" } };
