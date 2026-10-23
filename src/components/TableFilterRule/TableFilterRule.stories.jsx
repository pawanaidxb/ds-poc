import React, { useState } from "react";
import { TableFilterRule } from "./TableFilterRule";

export default { title: "Table/Filter rule", component: TableFilterRule, decorators: [(S) => <div style={{ width: 304 }}><S /></div>] };
export const Text = { render: () => { const [r, setR] = useState({ field: "Status", operator: "is", value: "Active" }); return <TableFilterRule kind="text" {...r} onChange={setR} />; } };
export const Number = { render: () => { const [r, setR] = useState({ field: "Seats", operator: "is greater than or equal to", value: "20" }); return <TableFilterRule kind="number" {...r} onChange={setR} />; } };
export const Disabled = { args: { kind: "text", field: "Status", value: "Active", disabled: true } };
