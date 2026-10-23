import React, { useState } from "react";
import { TableAdvancedFilterPanel } from "./TableAdvancedFilterPanel";

export default { title: "Table/Advanced filter panel", component: TableAdvancedFilterPanel, parameters: { layout: "padded" } };
export const Default = {
  render: () => {
    const [match, setMatch] = useState("AND");
    const [rules, setRules] = useState([
      { id: 1, kind: "text", field: "Status", operator: "is", value: "Active" },
      { id: 2, kind: "number", field: "Seats", operator: "is greater than or equal to", value: "20" },
    ]);
    return (
      <TableAdvancedFilterPanel rules={rules} match={match} onMatchChange={setMatch} matchCount={10}
        summary={rules.map((r) => `${r.field} ${r.operator} ${r.value}`).join(` ${match} `)}
        onRuleChange={(id, next) => setRules(rules.map((r) => (r.id === id ? { ...r, ...next } : r)))}
        onRuleRemove={(id) => setRules(rules.filter((r) => r.id !== id))}
        onAddRule={() => setRules([...rules, { id: Date.now(), kind: "text", field: "Owner", operator: "is", value: "" }])}
        onClear={() => setRules([])} />
    );
  },
};
export const Disabled = { args: { disabled: true, rules: [{ id: 1, kind: "text", field: "Status", value: "Active" }], matchCount: 10 } };
