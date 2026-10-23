import React from "react";
import "./TableRow.css";

/**
 * TableRow — matches "Table / Row" in Figma.
 * State=Default/Hover/Focus -> CSS states (:hover, :focus-visible)
 * State=Selected -> selected · Dragging -> dragging · Drop target -> dropTarget · Disabled -> disabled
 * Layout=Standard/Hidden column/Compact/Resized -> set by the columns you render (see DataTable)
 * Children: TableSelectionCell and TableCell elements.
 */
export function TableRow({ selected = false, dragging = false, dropTarget = false, disabled = false, children, ...rest }) {
  const cls = ["poc-trow", selected && "is-selected", dragging && "is-dragging", dropTarget && "is-drop-target", disabled && "is-disabled"].filter(Boolean).join(" ");
  return (
    <tr className={cls} aria-selected={selected || undefined} aria-disabled={disabled || undefined} {...rest}>
      {children}
    </tr>
  );
}

export default TableRow;
