import React from "react";
import { ChevronDownIcon } from "../TableIcons/TableIcons";
import "./TableGroupRow.css";

/**
 * TableGroupRow — matches "Table / Group row" in Figma.
 * Group, Count, Seats total, ARR total (text) -> group, count, seatsTotal, arrTotal
 * State=Expanded/Collapsed -> expanded, onToggle · colSpan -> number of table columns
 */
export function TableGroupRow({ group = "North America", count = "4 accounts", seatsTotal = "264 seats", arrTotal = "$126,720 ARR", expanded = true, onToggle, colSpan = 1 }) {
  return (
    <tr className="poc-tgrow">
      <td colSpan={colSpan}>
        <button type="button" className="poc-tgrow__inner" aria-expanded={expanded} onClick={onToggle}>
          <ChevronDownIcon className={`poc-tgrow__chev${expanded ? "" : " is-collapsed"}`} />
          <span className="poc-tgrow__name">{group}</span>
          <span className="poc-tgrow__count">{count}</span>
          <span className="poc-tgrow__totals">
            <span className="poc-tgrow__seats">{seatsTotal}</span>
            <span className="poc-tgrow__arr">{arrTotal}</span>
          </span>
        </button>
      </td>
    </tr>
  );
}

export default TableGroupRow;
