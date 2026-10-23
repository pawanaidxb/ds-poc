import React, { useState } from "react";
import { TableMenuOption } from "./TableMenuOption";

export default { title: "Table/Menu option", component: TableMenuOption, decorators: [(S) => <div style={{ width: 260 }}><S /></div>],
  argTypes: { kind: { control: "inline-radio", options: ["checkbox", "action"] }, selected: { control: "boolean" }, disabled: { control: "boolean" }, showDetail: { control: "boolean" } } };
export const Checkbox = { args: { label: "Editor", detail: "12" } };
export const Selected = { args: { label: "Editor", detail: "12", selected: true } };
export const Action = { args: { kind: "action", label: "Increase width", detail: "+ 24 px" } };
export const Disabled = { args: { label: "Viewer", detail: "12", disabled: true } };
export const Interactive = { render: () => { const [on, setOn] = useState(false); return <TableMenuOption label="Viewer" detail="12" selected={on} onSelect={setOn} />; } };
