import React from "react";
import { GripVerticalIcon, GripHorizontalIcon } from "../TableIcons/TableIcons";
import "./TableDragHandle.css";

/**
 * TableDragHandle — matches "Table / Drag handle" in Figma.
 * Axis=Row/Column -> axis="row" | "column"
 * State=Hover -> CSS :hover · State=Dragging -> dragging · State=Disabled -> disabled
 */
export function TableDragHandle({ axis = "row", dragging = false, disabled = false, label, ...rest }) {
  return (
    <button type="button" className={`poc-tdrag poc-tdrag--${axis}${dragging ? " is-dragging" : ""}`}
      disabled={disabled} aria-label={label || (axis === "row" ? "Drag row" : "Drag column")} {...rest}>
      {axis === "row" ? <GripVerticalIcon /> : <GripHorizontalIcon />}
    </button>
  );
}

export default TableDragHandle;
