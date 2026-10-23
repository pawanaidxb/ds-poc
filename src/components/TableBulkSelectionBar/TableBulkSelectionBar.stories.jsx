import React from "react";
import { TableBulkSelectionBar } from "./TableBulkSelectionBar";

export default { title: "Table/Bulk selection bar", component: TableBulkSelectionBar, argTypes: { count: { control: "number" }, disabled: { control: "boolean" } } };
export const Active = { args: { count: 3 } };
export const Disabled = { args: { count: 0, disabled: true } };
