import React from "react";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import { TableDragHandle } from "../TableDragHandle/TableDragHandle";
import "./TableSelectionCell.css";

/**
 * TableSelectionCell — matches "Table / Selection cell" in Figma.
 * State=Unchecked/Checked/Indeterminate/Disabled -> checked, indeterminate, disabled
 * Show drag handle (boolean) -> showDragHandle
 * Renders a <td>; use as="th" in a header row.
 */
export function TableSelectionCell({ as: Tag = "td", checked = false, indeterminate = false, disabled = false, showDragHandle = true, label, onChange, dragHandleProps }) {
  return (
    <Tag className="poc-tsel">
      <span className="poc-tsel__inner">
        {showDragHandle && <TableDragHandle axis="row" disabled={disabled} {...dragHandleProps} />}
        <TableCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} label={label} onChange={onChange} />
      </span>
    </Tag>
  );
}

export default TableSelectionCell;
