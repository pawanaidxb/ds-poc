import React from "react";
import { TableColumnConfigItem } from "./TableColumnConfigItem";

export default {
  title: "Table/Column configuration item",
  component: TableColumnConfigItem,
  argTypes: {
    columnName: { control: "text" },
    visible: { control: "boolean" },
    dragging: { control: "boolean" },
  },
  decorators: [(Story) => <ul style={{ width: 420, margin: 0, padding: 0 }}><Story /></ul>],
};

export const Visible = { args: { columnName: "Account", visible: true } };
export const Hidden = { args: { columnName: "Account", visible: false } };
export const Dragging = { args: { columnName: "Account", visible: true, dragging: true } };

export const AllStates = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", width: 420 }}>
      <TableColumnConfigItem columnName="Visible" visible />
      <TableColumnConfigItem columnName="Hidden" visible={false} />
      <TableColumnConfigItem columnName="Dragging" visible dragging />
      <p style={{ fontSize: 12, margin: 0 }}>Focus: press Tab to move into an item.</p>
    </div>
  ),
  decorators: [(Story) => <ul style={{ margin: 0, padding: 0 }}><Story /></ul>],
};
