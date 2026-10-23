import React from "react";
import "./TableColumnGroup.css";

/**
 * TableColumnGroup — matches "Table / Column group" in Figma: a header that spans several columns.
 * Title -> title · State=Dragging -> dragging · colSpan -> how many columns it covers
 */
export function TableColumnGroup({ title = "ACCOUNT DETAILS", colSpan = 1, dragging = false, ...rest }) {
  return (
    <th className={`poc-tcgroup${dragging ? " is-dragging" : ""}`} colSpan={colSpan} scope="colgroup" {...rest}>{title}</th>
  );
}

export default TableColumnGroup;
