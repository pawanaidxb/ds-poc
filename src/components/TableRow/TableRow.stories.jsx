import React from "react";
import { TableRow } from "./TableRow";
import { TableCell } from "../TableCell/TableCell";
import { TableSelectionCell } from "../TableSelectionCell/TableSelectionCell";

const cells = (selected) => (
  <>
    <TableSelectionCell checked={selected} />
    <TableCell kind="emphasis" selected={selected} width={240}>Acme Corporation</TableCell>
    <TableCell selected={selected} width={160}>Enterprise</TableCell>
    <TableCell kind="status" selected={selected} width={110}>Active</TableCell>
    <TableCell selected={selected} width={180}>Priya Raman</TableCell>
    <TableCell kind="muted" selected={selected} width={110}>Admin</TableCell>
    <TableCell kind="number" selected={selected} width={90}>240</TableCell>
    <TableCell kind="number" selected={selected} width={130}>$184,000</TableCell>
    <TableCell kind="muted" selected={selected} width={140}>12 Mar 2027</TableCell>
  </>
);
const wrap = (Story) => <table style={{ borderCollapse: "collapse" }}><tbody><Story /></tbody></table>;

export default {
  title: "Table/Row",
  component: TableRow,
  parameters: { layout: "padded" },
  argTypes: { selected: { control: "boolean" }, dragging: { control: "boolean" }, dropTarget: { control: "boolean" }, disabled: { control: "boolean" } },
  decorators: [wrap],
  render: (args) => <TableRow {...args}>{cells(args.selected)}</TableRow>,
};

export const Default = { args: {} };
export const Selected = { args: { selected: true } };
export const Dragging = { args: { dragging: true } };
export const DropTarget = { args: { dropTarget: true } };
export const Disabled = { args: { disabled: true } };
export const Focusable = { args: { tabIndex: 0 } };
