import React, { useState } from "react";
import { TableFiltersPanel } from "./TableFiltersPanel";

const STATUS = ["All statuses", "Active", "Paused", "Trial"].map((l, i) => ({ value: i ? l : "__all", label: l }));
const WORKSPACE = ["All workspaces", "Asia Pacific", "Europe", "North America"].map((l, i) => ({ value: i ? l : "__all", label: l }));
const ROLES = [{ value: "Editor", label: "Editor", count: 12 }, { value: "Viewer", label: "Viewer", count: 12 }];

function Demo({ startTab = "general" }) {
  const [tab, setTab] = useState(startTab);
  const [status, setStatus] = useState("__all");
  const [ws, setWs] = useState("__all");
  const [roles, setRoles] = useState(["Editor"]);
  const [q, setQ] = useState("");
  const [rules, setRules] = useState([
    { id: 1, kind: "text", field: "Status", operator: "is", value: "Active" },
    { id: 2, kind: "number", field: "Seats", operator: "is greater than or equal to", value: "20" },
  ]);
  const [match, setMatch] = useState("AND");
  return (
    <TableFiltersPanel tab={tab} onTabChange={setTab}
      fields={[
        { key: "status", label: "Status", placeholder: "All statuses", options: STATUS, value: status, onChange: setStatus },
        { key: "workspace", label: "Workspace", placeholder: "All workspaces", options: WORKSPACE, value: ws, onChange: setWs },
      ]}
      checklist={{ title: "Role", values: ROLES, selected: roles, total: 24, query: q, onQueryChange: setQ,
        onToggle: (v) => setRoles(roles.includes(v) ? roles.filter((x) => x !== v) : [...roles, v]),
        onToggleAll: (on, vals) => setRoles(on ? vals : []) }}
      onReset={() => { setStatus("__all"); setWs("__all"); setRoles([]); }}
      custom={{ rules, match, onMatchChange: setMatch, matchCount: 10, summary: "Status is Active AND Seats ≥ 20",
        onRuleChange: (id, next) => setRules(rules.map((r) => (r.id === id ? { ...r, ...next } : r))),
        onRuleRemove: (id) => setRules(rules.filter((r) => r.id !== id)),
        onAddRule: () => setRules([...rules, { id: Date.now(), kind: "text", field: "Status", operator: "is", value: "" }]),
        onClear: () => setRules([]) }} />
  );
}

export default {
  title: "Table/Filters panel",
  component: TableFiltersPanel,
  argTypes: { tab: { control: "inline-radio", options: ["general", "custom"] } },
};

// The panel fills its container's height. Drag the corner of the box to see the content scroll
// while the buttons stay fixed at the bottom.
const Box = ({ children, height = 560 }) => (
  <div style={{ height, width: 344, resize: "vertical", overflow: "hidden", border: "1px dashed var(--color-border)" }}>{children}</div>
);
export const GeneralFilters = { render: () => <Box><Demo startTab="general" /></Box> };
export const CustomFilters = { render: () => <Box><Demo startTab="custom" /></Box> };
export const ShortContainer = { name: "Short container (scrolls)", render: () => <Box height={360}><Demo startTab="custom" /></Box> };
