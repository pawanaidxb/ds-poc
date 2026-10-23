import React from "react";
import { TableSelectionCell } from "./TableSelectionCell";

export default {
  title: "Table/Selection cell",
  component: TableSelectionCell,
  argTypes: { checked: { control: "boolean" }, indeterminate: { control: "boolean" }, disabled: { control: "boolean" }, showDragHandle: { control: "boolean" } },
  decorators: [(Story) => <table style={{ borderCollapse: "collapse" }}><tbody><tr><Story /></tr></tbody></table>],
};

export const Unchecked = { args: {} };
export const Checked = { args: { checked: true } };
export const Indeterminate = { args: { indeterminate: true } };
export const Disabled = { args: { disabled: true } };
export const WithoutDragHandle = { args: { showDragHandle: false } };
