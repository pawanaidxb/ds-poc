import React, { useState } from "react";
import { TableToolbar } from "./TableToolbar";
import { TableFilterChip } from "../TableFilterChip/TableFilterChip";

export default { title: "Table/Toolbar", component: TableToolbar, parameters: { layout: "fullscreen" } };
export const Default = { render: () => { const [q, setQ] = useState(""); return <TableToolbar search={q} onSearch={setQ} />; } };
export const ColumnFilter = { args: { filterCount: 1 }, render: (a) => <TableToolbar {...a}><TableFilterChip>Role is Editor</TableFilterChip></TableToolbar> };
export const CustomFilters = { args: { filterCount: 2 } };
export const ColumnVisibility = { args: { visibleColumns: 7, totalColumns: 8 } };
export const Grouped = { args: { groupBy: "Workspace" } };
