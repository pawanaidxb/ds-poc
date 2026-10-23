import React from "react";
import "./TableDragPreview.css";

/**
 * TableDragPreview — matches "Table / Drag preview" in Figma: the floating copy shown while dragging.
 * Kind=Row/Column -> kind · children: the row (a <tr>) or the column's header + cells
 */
export function TableDragPreview({ kind = "row", width, children, style }) {
  return (
    <div className={`poc-tdprev poc-tdprev--${kind}`} style={{ width, ...style }} aria-hidden="true">
      <table className="poc-tdprev__table">{kind === "row" ? <tbody>{children}</tbody> : children}</table>
    </div>
  );
}

export default TableDragPreview;
