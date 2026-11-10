import React from "react";
import { TableDragHandle } from "../TableDragHandle/TableDragHandle";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import "./TableColumnConfigItem.css";

/**
 * TableColumnConfigItem — matches "Table / Column configuration item" in Figma (122:4361).
 * Column name (text)  -> columnName
 * State=Visible       -> visible = true
 * State=Hidden        -> visible = false
 * State=Dragging      -> dragging
 * State=Focus         -> real browser focus (:focus-within), no prop
 * Keyboard: Alt + Arrow Up / Down moves the column (onMoveUp / onMoveDown), Space toggles the checkbox.
 */
export function TableColumnConfigItem({
  columnName = "Account",
  visible = true,
  dragging = false,
  dropTarget = false,
  onToggle,
  onMoveUp,
  onMoveDown,
  dragHandleProps = {},
  ...rest
}) {
  const onKeyDown = (e) => {
    if (!e.altKey) return;
    if (e.key === "ArrowUp" && onMoveUp) { e.preventDefault(); onMoveUp(); }
    if (e.key === "ArrowDown" && onMoveDown) { e.preventDefault(); onMoveDown(); }
  };
  const cls = ["poc-tcci", !visible && "is-hidden", dragging && "is-dragging", dropTarget && "is-drop-target"].filter(Boolean).join(" ");
  return (
    <li className={cls} onKeyDown={onKeyDown} {...rest}>
      <TableDragHandle axis="row" dragging={dragging} label={`Drag ${columnName}. Alt and arrow keys also move it.`} {...dragHandleProps} />
      <TableCheckbox checked={visible} label={`Show ${columnName}`} onChange={onToggle} />
      <span className="poc-tcci__name">{columnName}</span>
    </li>
  );
}

export default TableColumnConfigItem;
