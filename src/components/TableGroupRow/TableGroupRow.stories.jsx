import React, { useState } from "react";
import { TableGroupRow } from "./TableGroupRow";

export default { title: "Table/Group row", component: TableGroupRow, parameters: { layout: "padded" },
  decorators: [(S) => <table style={{ borderCollapse: "collapse", width: 900 }}><tbody><S /></tbody></table>] };
export const Expanded = { args: { expanded: true } };
export const Collapsed = { args: { expanded: false, group: "Europe", count: "3 accounts", seatsTotal: "188 seats", arrTotal: "$92,400 ARR" } };
export const Interactive = { render: () => { const [open, setOpen] = useState(true); return <TableGroupRow expanded={open} onToggle={() => setOpen(!open)} />; } };
