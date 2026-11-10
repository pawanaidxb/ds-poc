import React from "react";
import { ChevronDownIcon } from "../TableIcons/TableIcons";
import { TableDragHandle } from "../TableDragHandle/TableDragHandle";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import "./TableConfigGroupHeader.css";

/**
 * TableConfigGroupHeader — matches "Table / Configuration group header" in Figma (134:7689).
 * Group name (text)       -> groupName
 * Column count (text)     -> columnCount
 * State=Default           -> name + count + "Add columns" / "Ungroup"
 * State=Editing           -> editing: a name field + "Cancel" (onNameChange, onCancel)
 * Show drag handle / disclosure / actions (booleans) -> showDragHandle, showDisclosure, showActions
 * Disclosure open/closed  -> expanded + onToggle
 */
export function TableConfigGroupHeader({
  groupName = "Account details", columnCount = 3, editing = false, expanded = true,
  showDragHandle = true, showDisclosure = true, showActions = true,
  onToggle, onAddColumns, onUngroup, onNameChange, onCancel, dragHandleProps = {}, ...rest
}) {
  return (
    <div className="poc-tcgh" {...rest}>
      {showDragHandle && <TableDragHandle axis="row" label={`Drag ${groupName || "group"}`} {...dragHandleProps} />}
      {showDisclosure && (
        <button type="button" className={`poc-tcgh__disclosure${expanded ? "" : " is-collapsed"}`} onClick={onToggle}
          aria-expanded={expanded} aria-label={`${expanded ? "Collapse" : "Expand"} ${groupName || "group"}`}>
          <ChevronDownIcon />
        </button>
      )}
      {editing ? (
        <>
          <span className="poc-tcgh__field">
            <Input size="small" width="100%" showLabel={false} showHelper={false} label="Group name" placeholder="New group"
              value={groupName} onChange={(e) => onNameChange && onNameChange(e.target.value)} autoFocus />
          </span>
          {showActions && <Button variant="secondary" onClick={onCancel}>Cancel</Button>}
        </>
      ) : (
        <>
          <span className="poc-tcgh__name">{groupName}</span>
          <span className="poc-tcgh__count">{columnCount}</span>
          {showActions && (
            <span className="poc-tcgh__actions">
              <Button variant="secondary" onClick={onAddColumns}>Add columns</Button>
              <Button variant="secondary" onClick={onUngroup}>Ungroup</Button>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default TableConfigGroupHeader;
