import React from "react";
import { TableCell } from "./TableCell";

export default {
  title: "Table/Cell",
  component: TableCell,
  argTypes: {
    kind: { control: "inline-radio", options: ["text", "number", "muted", "status", "emphasis"] },
    selected: { control: "boolean" }, dragging: { control: "boolean" }, disabled: { control: "boolean" },
    children: { control: "text" },
  },
  decorators: [(Story) => <table style={{ borderCollapse: "collapse", width: 220 }}><tbody><tr><Story /></tr></tbody></table>],
};

export const Text = { args: { kind: "text", children: "Northwind Traders" } };
export const Number = { args: { kind: "number", children: "1,240" } };
export const Muted = { args: { kind: "muted", children: "12 Mar 2027" } };
export const Status = { args: { kind: "status", children: "Active" } };
export const Emphasis = { args: { kind: "emphasis", children: "Acme Corporation" } };
export const Selected = { args: { kind: "text", selected: true, children: "Selected cell" } };
export const Dragging = { args: { kind: "text", dragging: true, children: "Dragging" } };
export const Disabled = { args: { kind: "text", disabled: true, children: "Disabled" } };

export const AllStates = {
  parameters: { layout: "padded" },
  decorators: [],
  render: () => {
    const kinds = ["text", "number", "muted", "status", "emphasis"];
    const states = [{ name: "Default" }, { name: "Selected", selected: true }, { name: "Dragging", dragging: true }, { name: "Disabled", disabled: true }];
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          {states.map((s) => (
            <tr key={s.name}>
              {kinds.map((k) => <TableCell key={k} kind={k} selected={s.selected} dragging={s.dragging} disabled={s.disabled} width={180} tabIndex={0}>{`${k} · ${s.name}`}</TableCell>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
