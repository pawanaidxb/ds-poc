import React from "react";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import { Button } from "../Button/Button";
import "./TableBulkSelectionBar.css";

/**
 * TableBulkSelectionBar — matches "Table / Bulk selection bar" in Figma.
 * State=Active/Disabled -> disabled · the count and actions are props
 */
export function TableBulkSelectionBar({ count = 3, noun = "accounts", disabled = false, actions = ["Assign owner", "Export selected"], onAction, onClear }) {
  return (
    <div className={`poc-tbulk${disabled ? " is-disabled" : ""}`} role="region" aria-label="Selected rows">
      <TableCheckbox indeterminate checked disabled={disabled} label="Clear selection" onChange={onClear} />
      <span className="poc-tbulk__count" aria-live="polite">{count} {noun} selected</span>
      {actions.map((a) => <Button key={a} variant="secondary" disabled={disabled} onClick={() => onAction && onAction(a)}>{a}</Button>)}
      <button type="button" className="poc-tbulk__clear" disabled={disabled} onClick={onClear}>Clear selection</button>
    </div>
  );
}

export default TableBulkSelectionBar;
