import React, { useState } from "react";
import { TableFilterControl } from "./TableFilterControl";

export default { title: "Table/Filter control", component: TableFilterControl, decorators: [(S) => <div style={{ width: 280 }}><S /></div>] };
export const Field = { render: () => { const [v, setV] = useState("Status"); return <TableFilterControl value={v} options={["Account", "Status", "Owner", "Seats"]} onChange={(e) => setV(e.target.value)} />; } };
export const Operator = { render: () => { const [v, setV] = useState("is"); return <TableFilterControl kind="operator" value={v} options={["is", "is not", "contains"]} onChange={(e) => setV(e.target.value)} />; } };
export const Placeholder = { args: { options: ["Account", "Status"] } };
export const Disabled = { args: { value: "Status", options: ["Status"], disabled: true } };
