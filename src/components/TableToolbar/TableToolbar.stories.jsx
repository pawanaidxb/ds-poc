import React, { useState } from "react";
import { TableToolbar } from "./TableToolbar";

export default {
  title: "Table/Toolbar",
  component: TableToolbar,
  parameters: { layout: "fullscreen" },
  argTypes: {
    visibleColumns: { control: "number" },
    totalColumns: { control: "number" },
    peek: { control: "boolean" },
    filterCount: { control: "number" },
    configureOpen: { control: "boolean" },
    filtersOpen: { control: "boolean" },
  },
};

export const Default = { render: (a) => { const [q, setQ] = useState(""); const [g, setG] = useState(null); return <TableToolbar {...a} search={q} onSearch={setQ} groupBy={g} onGroupByChange={setG} />; } };
export const ColumnFilter = { args: { filterCount: 1 } };
export const CustomFilters = { args: { filterCount: 2 } };
export const ColumnVisibility = { args: { visibleColumns: 7, totalColumns: 8 } };
export const HiddenColumnsShown = { args: { visibleColumns: 7, totalColumns: 8, peek: true } };
export const Grouped = { args: { groupBy: "workspace" } };
export const GroupByDropdown = { args: { defaultGroupByOpen: true } };
