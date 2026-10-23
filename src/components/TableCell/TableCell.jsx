import React from "react";
import "./TableCell.css";

/**
 * TableCell — matches "Table / Cell" in Figma.
 * Kind=Text/Number/Muted/Status/Emphasis -> kind
 * Content (text) -> children
 * State=Hover -> CSS (row hover) · Selected -> selected · Focus -> CSS :focus-visible
 * State=Dragging -> dragging · Disabled -> disabled
 */
export function TableCell({ as: Tag = "td", kind = "text", selected = false, dragging = false, disabled = false, width, children = "Cell value", ...rest }) {
  const cls = ["poc-tcell", `poc-tcell--${kind}`, selected && "is-selected", dragging && "is-dragging", disabled && "is-disabled"].filter(Boolean).join(" ");
  return (
    <Tag className={cls} style={width ? { width } : undefined} aria-disabled={disabled || undefined} {...rest}>
      <span className="poc-tcell__content">{children}</span>
    </Tag>
  );
}

export default TableCell;
