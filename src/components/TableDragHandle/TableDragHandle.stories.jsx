import React from "react";
import { TableDragHandle } from "./TableDragHandle";

export default {
  title: "Table/Drag handle",
  component: TableDragHandle,
  argTypes: { axis: { control: "inline-radio", options: ["row", "column"] }, dragging: { control: "boolean" }, disabled: { control: "boolean" } },
};

export const Row = { args: { axis: "row" } };
export const Column = { args: { axis: "column" } };
export const Dragging = { args: { axis: "row", dragging: true } };
export const Disabled = { args: { axis: "row", disabled: true } };
