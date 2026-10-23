import React from "react";
import { XIcon } from "../TableIcons/TableIcons";
import "./TableFilterChip.css";

/**
 * TableFilterChip — matches "Table / Filter chip" in Figma.
 * Condition (text) -> children · State=Hover -> CSS · State=Disabled -> disabled
 */
export function TableFilterChip({ children = "Status is Active", disabled = false, onRemove }) {
  return (
    <span className={`poc-tchip${disabled ? " is-disabled" : ""}`}>
      <span className="poc-tchip__label">{children}</span>
      <button type="button" className="poc-tchip__x" onClick={onRemove} disabled={disabled} aria-label={`Remove filter: ${children}`}>
        <XIcon />
      </button>
    </span>
  );
}

export default TableFilterChip;
