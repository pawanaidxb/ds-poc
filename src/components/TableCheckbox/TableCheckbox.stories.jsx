import React, { useState } from "react";
import { TableCheckbox } from "./TableCheckbox";

export default {
  title: "Table/Checkbox",
  component: TableCheckbox,
  argTypes: { checked: { control: "boolean" }, indeterminate: { control: "boolean" }, disabled: { control: "boolean" } },
};

export const Unchecked = { args: { checked: false } };
export const Checked = { args: { checked: true } };
export const Indeterminate = { args: { indeterminate: true } };
export const Disabled = { args: { disabled: true } };
export const Interactive = {
  render: () => { const [on, setOn] = useState(false); return <TableCheckbox checked={on} onChange={(e) => setOn(e.target.checked)} />; },
};
