import React from "react";
import "./TableFilterLogic.css";

/**
 * TableFilterLogic — matches "Table / Filter logic" in Figma.
 * Match=AND/OR -> value ("AND" | "OR"), onChange(newValue)
 */
export function TableFilterLogic({ value = "AND", onChange }) {
  return (
    <span className="poc-tlogic" role="radiogroup" aria-label="Match conditions">
      {["AND", "OR"].map((op) => (
        <button key={op} type="button" role="radio" aria-checked={value === op}
          className={`poc-tlogic__opt${value === op ? " is-on" : ""}`} onClick={() => onChange && onChange(op)}>
          {op}
        </button>
      ))}
    </span>
  );
}

export default TableFilterLogic;
