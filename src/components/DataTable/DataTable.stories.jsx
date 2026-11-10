import React from "react";
import { DataTable } from "./DataTable";

/**
 * One story per state of the Figma "Data table" component.
 * Every story is fully interactive: sort, filter, group, select, resize and drag.
 */
export default {
  title: "Table/Data table",
  component: DataTable,
  parameters: { layout: "padded" },
};

export const Default = { args: {} };
export const Sorted = { args: { initialSort: { key: "arr", dir: "desc" } } };
export const ColumnFilter = { args: { initialColumnFilters: { role: ["Editor"] }, initialFiltersOpen: true } };
export const ColumnVisibility = { args: { initialHidden: ["renewal"] } };
export const CustomFilters = {
  args: {
    initialRules: [
      { id: 1, field: "Status", operator: "is", value: "Active" },
      { id: 2, field: "Seats", operator: "is greater than or equal to", value: "20" },
    ],
  },
};
export const ColumnResize = { args: {}, parameters: { docs: { description: { story: "Drag the right edge of a header to resize; double-click the edge for the width menu." } } } };
export const MultiSelect = { args: { initialSelected: ["acc-2", "acc-3", "acc-5"] } };
export const Grouped = { args: { initialGroupBy: "workspace" } };
export const RowDragging = { args: {}, parameters: { docs: { description: { story: "Drag a row by its handle to reorder (turn off sorting and grouping first)." } } } };
export const ColumnsReordered = { args: { initialOrder: ["owner", "account", "workspace", "status", "role", "seats", "arr", "renewal"], initialHidden: ["renewal"], initialConfigOpen: true } };
export const HiddenColumnsShown = { args: { initialOrder: ["owner", "account", "workspace", "status", "role", "seats", "arr", "renewal"], initialConfigOpen: true } };
export const HiddenColumnsShownDefaultOrder = { name: "Hidden columns shown - default order", args: { initialHidden: ["renewal"], initialPeek: true, initialConfigOpen: true } };
export const GroupByDropdown = { args: { initialGroupByOpen: true } };
export const ColumnGroupsConfiguration = { args: { initialHidden: ["renewal"], initialConfigOpen: true, initialConfigView: "groups" } };
export const ColumnDragging = { args: {}, parameters: { docs: { description: { story: "Drag a header by its handle to reorder columns within the same group." } } } };
