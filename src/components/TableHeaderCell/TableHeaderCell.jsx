import React from "react";
import { ChevronsUpDownIcon, SortArrowIcon, FilterIcon } from "../TableIcons/TableIcons";
import { TableDragHandle } from "../TableDragHandle/TableDragHandle";
import "./TableHeaderCell.css";

/**
 * TableHeaderCell — matches "Table / Header cell" in Figma.
 * Title (text) -> title
 * Align=Left/Right -> align
 * State=Ascending/Descending -> sort="asc" | "desc" (sort="none" shows the up/down chevrons)
 * State=Filtered -> filtered · Resizing -> resizing · Dragging -> dragging
 * State=Drop target -> dropTarget · Disabled -> disabled · Hover -> CSS :hover
 * Show sort / Show filter / Show drag handle (booleans) -> showSort, showFilter, showDragHandle
 */
export function TableHeaderCell({
  title = "Column", align = "left", sort = "none",
  showSort = true, showFilter = true, showDragHandle = true,
  filtered = false, resizing = false, dragging = false, dropTarget = false, disabled = false,
  width, onSort, onFilter, onResizeStart, dragHandleProps, ...rest
}) {
  const cls = ["poc-thead", `poc-thead--${align}`,
    filtered && "is-filtered", resizing && "is-resizing", dragging && "is-dragging",
    dropTarget && "is-drop-target", disabled && "is-disabled"].filter(Boolean).join(" ");
  const ariaSort = sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";
  return (
    <th className={cls} style={width ? { width } : undefined} aria-sort={ariaSort} scope="col" {...rest}>
      <span className="poc-thead__inner">
        <span className="poc-thead__title">{title}</span>
        {showSort && (
          <button type="button" className={`poc-thead__icon${sort !== "none" ? " is-active" : ""}`} disabled={disabled}
            onClick={onSort} aria-label={`Sort by ${title}`}>
            {sort === "none" ? <ChevronsUpDownIcon /> : <SortArrowIcon direction={sort} />}
          </button>
        )}
        {showFilter && (
          <button type="button" className="poc-thead__icon" disabled={disabled} onClick={onFilter} aria-label={`Filter ${title}`}>
            <FilterIcon />
          </button>
        )}
        {showDragHandle && <span className="poc-thead__drag"><TableDragHandle axis="column" disabled={disabled} {...dragHandleProps} /></span>}
      </span>
      {onResizeStart && <span className="poc-thead__resizer" onPointerDown={onResizeStart} aria-hidden="true" />}
    </th>
  );
}

export default TableHeaderCell;
