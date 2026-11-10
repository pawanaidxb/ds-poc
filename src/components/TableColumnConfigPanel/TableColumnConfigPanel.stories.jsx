import React, { useState } from "react";
import { TableColumnConfigPanel } from "./TableColumnConfigPanel";

const COLS = ["Account", "Workspace", "Status", "Owner", "Role", "Seats", "ARR", "Renewal date"];
const DEFAULT = COLS.map((t) => t.toLowerCase().replace(" ", "-"));

function Demo({ startOrder = DEFAULT, startHidden = [] }) {
  const [order, setOrder] = useState(startOrder);
  const [hidden, setHidden] = useState(new Set(startHidden));
  const title = (k) => COLS[DEFAULT.indexOf(k)];
  const move = (from, to) => {
    const n = order.filter((k) => k !== from);
    const at = order.indexOf(to) > order.indexOf(from) ? n.indexOf(to) + 1 : n.indexOf(to);
    n.splice(at, 0, from);
    setOrder(n);
  };
  return (
    <TableColumnConfigPanel
      columns={order.map((k) => ({ key: k, title: title(k), visible: !hidden.has(k) }))}
      defaultOrder={order.every((k, i) => k === DEFAULT[i])}
      onToggle={(k) => { const n = new Set(hidden); n.has(k) ? n.delete(k) : n.add(k); setHidden(n); }}
      onMove={move}
      onReset={() => setOrder(DEFAULT)} />
  );
}

export default {
  title: "Table/Column configuration panel",
  component: TableColumnConfigPanel,
};

export const Configure = { render: () => <Demo startHidden={["renewal-date"]} /> };
export const Reordered = { render: () => <Demo startOrder={["owner", "account", "workspace", "status", "role", "seats", "arr", "renewal-date"]} startHidden={["renewal-date"]} /> };
export const AllVisible = { render: () => <Demo startOrder={["owner", "account", "workspace", "status", "role", "seats", "arr", "renewal-date"]} /> };
