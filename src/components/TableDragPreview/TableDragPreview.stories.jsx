import React from "react";
import { TableDragPreview } from "./TableDragPreview";
import { TableRow } from "../TableRow/TableRow";
import { TableCell } from "../TableCell/TableCell";
import { TableSelectionCell } from "../TableSelectionCell/TableSelectionCell";
import { TableHeaderCell } from "../TableHeaderCell/TableHeaderCell";

export default { title: "Table/Drag preview", component: TableDragPreview, parameters: { layout: "padded" } };
export const Row = {
  render: () => (
    <TableDragPreview kind="row" width={760}>
      <TableRow dragging>
        <TableSelectionCell />
        <TableCell kind="emphasis" dragging width={220}>Meridian Health</TableCell>
        <TableCell dragging width={160}>Asia Pacific</TableCell>
        <TableCell kind="status" dragging width={110}>Active</TableCell>
        <TableCell dragging width={180}>Sofia Patel</TableCell>
      </TableRow>
    </TableDragPreview>
  ),
};
export const Column = {
  render: () => (
    <TableDragPreview kind="column" width={200}>
      <thead><tr><TableHeaderCell title="Workspace" dragging /></tr></thead>
      <tbody>{["North America", "Europe", "Asia Pacific", "North America"].map((v, i) => <tr key={i}><TableCell dragging>{v}</TableCell></tr>)}</tbody>
    </TableDragPreview>
  ),
};
