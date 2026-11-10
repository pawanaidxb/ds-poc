import React from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import "./TableToolbar.css";

/**
 * TableToolbar — matches "Table / Toolbar" in Figma.
 * State=Default / Column filter / Custom filters -> filterCount (shows "Filters · n")
 * State=Column visibility -> visibleColumns + totalColumns ("7 of 8 columns")
 * "Show hidden columns" -> onShowHidden (disabled when nothing is hidden)
 * "Configure columns" -> onConfigureColumns (opens TableColumnConfigPanel)
 * State=Grouped -> groupBy ("Group by · Workspace")
 * Uses the real Input and Button components.
 */
export function TableToolbar({ search = "", onSearch, filterCount = 0, groupBy, visibleColumns, totalColumns,
  onFilters, onCustomFilters, onGroupBy, onShowHidden, onConfigureColumns, onColumns, children }) {
  const known = visibleColumns != null && totalColumns != null;
  const status = known ? `${visibleColumns} of ${totalColumns} columns` : "All columns visible";
  const noneHidden = !known || visibleColumns >= totalColumns;
  return (
    <div className="poc-ttool" role="toolbar" aria-label="Table controls">
      <div className="poc-ttool__group">
        <Input size="small" width={280} showLabel={false} showHelper={false} label="Search accounts" placeholder="Search accounts…"
          value={search} onChange={(e) => onSearch && onSearch(e.target.value)} />
        <Button variant="secondary" onClick={onFilters} aria-pressed={filterCount > 0}>{filterCount > 0 ? `Filters · ${filterCount}` : "Filters"}</Button>
        <Button variant="secondary" onClick={onCustomFilters}>Custom filters</Button>
        {children}
      </div>
      <div className="poc-ttool__group">
        <span className="poc-ttool__status">{status}</span>
        <Button variant="secondary" onClick={onGroupBy} aria-pressed={!!groupBy}>{groupBy ? `Group by · ${groupBy}` : "Group by"}</Button>
        <Button variant="secondary" onClick={onShowHidden} disabled={noneHidden}>Show hidden columns</Button>
        <Button variant="secondary" onClick={onConfigureColumns || onColumns}>Configure columns</Button>
      </div>
    </div>
  );
}

export default TableToolbar;
