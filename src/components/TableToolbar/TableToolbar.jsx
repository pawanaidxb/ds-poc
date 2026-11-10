import React, { useEffect, useRef, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { DropdownTrigger } from "../DropdownTrigger/DropdownTrigger";
import { DropdownList } from "../DropdownList/DropdownList";
import { EyeIcon, ColumnsIcon } from "../TableIcons/TableIcons";
import "./TableToolbar.css";

const GROUP_OPTIONS = [
  { value: null, label: "None" },
  { value: "workspace", label: "Workspace" },
  { value: "status", label: "Status" },
  { value: "owner", label: "Owner" },
  { value: "role", label: "Role" },
];

/**
 * TableToolbar — matches "Table / Toolbar" as used in every "Data table" state in Figma.
 * Search accounts… -> search + onSearch
 * Column status    -> "All columns visible" / "7 of 8 columns" / "8 shown · 7 configured" (visibleColumns, totalColumns, peek)
 * Group by: None   -> a Dropdown (groupBy + groupByOptions + onGroupByChange). Figma state "Group by dropdown" = open.
 * Eye icon         -> show hidden columns for now (peek + onTogglePeek; disabled when nothing is hidden)
 * Columns icon     -> onConfigureColumns (configureOpen marks it pressed)
 * Filters · n      -> filterCount + onFilters (filtersOpen marks it pressed)
 */
export function TableToolbar({
  search = "", onSearch,
  visibleColumns, totalColumns, peek = false, onTogglePeek,
  groupBy = null, groupByOptions = GROUP_OPTIONS, onGroupByChange, defaultGroupByOpen = false,
  configureOpen = false, onConfigureColumns,
  filterCount = 0, filtersOpen = false, onFilters,
  children,
}) {
  const [open, setOpen] = useState(defaultGroupByOpen);
  const ref = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const known = visibleColumns != null && totalColumns != null;
  const hidden = known ? totalColumns - visibleColumns : 0;
  const status = !known ? "All columns visible"
    : peek ? `${totalColumns} shown · ${visibleColumns} configured`
    : hidden === 0 ? "All columns visible" : `${visibleColumns} of ${totalColumns} columns`;
  const current = groupByOptions.find((o) => o.value === groupBy) || groupByOptions[0];
  const opts = groupByOptions.map((o) => ({ value: o.value == null ? "__none" : o.value, label: o.label }));
  const pick = (v) => { setOpen(false); if (onGroupByChange) onGroupByChange(v === "__none" ? null : v); if (trigger.current) trigger.current.focus(); };

  return (
    <div className="poc-ttool" role="toolbar" aria-label="Table controls">
      <div className="poc-ttool__group">
        <Input size="small" width={280} showLabel={false} showHelper={false} label="Search accounts" placeholder="Search accounts…"
          value={search} onChange={(e) => onSearch && onSearch(e.target.value)} />
        {children}
      </div>
      <div className="poc-ttool__group">
        <span className="poc-ttool__status" aria-live="polite">{status}</span>
        <div className="poc-ttool__groupby" ref={ref} onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); } }}>
          <DropdownTrigger ref={trigger} selection="single" open={open} value={`Group by: ${current.label}`}
            aria-label={`Group by: ${current.label}`} onClick={() => setOpen(!open)} />
          {open && (
            <div className="poc-ttool__groupby-list">
              <DropdownList selection="single" searchable={false} showSummary={false} options={opts}
                selected={[groupBy == null ? "__none" : groupBy]} onToggle={pick} aria-label="Group by" />
            </div>
          )}
        </div>
        <button type="button" className={`poc-ttool__icon${peek ? " is-on" : ""}`} onClick={onTogglePeek} disabled={hidden === 0 && !peek}
          aria-pressed={peek} aria-label={peek ? "Hide the hidden columns again" : "Show hidden columns"}>
          <EyeIcon crossed={peek} />
        </button>
        <button type="button" className={`poc-ttool__icon${configureOpen ? " is-on" : ""}`} onClick={onConfigureColumns}
          aria-pressed={configureOpen} aria-label="Configure columns">
          <ColumnsIcon />
        </button>
        <Button variant="secondary" onClick={onFilters} aria-pressed={filtersOpen}>{filterCount > 0 ? `Filters · ${filterCount}` : "Filters"}</Button>
      </div>
    </div>
  );
}

export default TableToolbar;
