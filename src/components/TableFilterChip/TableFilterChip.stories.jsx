import React from "react";
import { TableFilterChip } from "./TableFilterChip";

export default { title: "Table/Filter chip", component: TableFilterChip, argTypes: { children: { control: "text" }, disabled: { control: "boolean" } } };
export const Active = { args: { children: "Status is Active" } };
export const Disabled = { args: { children: "Seats ≥ 20", disabled: true } };
