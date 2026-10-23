import React from "react";
import "./TableDropIndicator.css";

/**
 * TableDropIndicator — matches "Table / Drop indicator" in Figma.
 * Axis=Row/Column -> axis · State=Active/Inactive -> active
 * Place it absolutely where the dragged row or column will land.
 */
export function TableDropIndicator({ axis = "row", active = true, style }) {
  return <span className={`poc-tdrop poc-tdrop--${axis}${active ? "" : " is-inactive"}`} style={style} aria-hidden="true" />;
}

export default TableDropIndicator;
