import React from "react";
import { TableColumnGroup } from "./TableColumnGroup";

export default { title: "Table/Column group", component: TableColumnGroup,
  decorators: [(S) => <table style={{ borderCollapse: "collapse", width: 340 }}><thead><tr><S /></tr></thead></table>] };
export const Default = { args: { title: "Account details" } };
export const Dragging = { args: { title: "Account details", dragging: true } };
