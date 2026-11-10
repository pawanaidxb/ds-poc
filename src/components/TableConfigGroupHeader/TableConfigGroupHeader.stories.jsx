import React from "react";
import { TableConfigGroupHeader } from "./TableConfigGroupHeader";

export default {
  title: "Table/Configuration group header",
  component: TableConfigGroupHeader,
  argTypes: {
    groupName: { control: "text" },
    columnCount: { control: "number" },
    editing: { control: "boolean" },
    expanded: { control: "boolean" },
    showDragHandle: { control: "boolean" },
    showDisclosure: { control: "boolean" },
    showActions: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
};

export const Default = { args: { groupName: "Account details", columnCount: 3 } };
export const Editing = { args: { groupName: "", columnCount: 0, editing: true } };
export const Ungrouped = { args: { groupName: "Ungrouped", columnCount: 0, showDragHandle: false, showDisclosure: false, showActions: false } };
