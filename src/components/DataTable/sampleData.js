// Sample accounts taken from the Figma "Data table" component (DS POC).
export const SAMPLE_ROWS = [
  ["Linear Labs", "North America", "Active", "Olivia Chen", "Editor", 84, 40320, "2026-11-01"],
  ["Acme Corporation", "Europe", "Active", "James Wilson", "Viewer", 42, 20160, "2026-11-15"],
  ["Meridian Health", "Asia Pacific", "Active", "Sofia Patel", "Editor", 120, 57600, "2026-12-01"],
  ["Orbit Studio", "North America", "Active", "Noah Kim", "Viewer", 36, 17280, "2026-12-15"],
  ["Northstar Systems", "Europe", "Active", "Olivia Chen", "Editor", 64, 30720, "2026-11-01"],
  ["Forma Design", "Asia Pacific", "Active", "James Wilson", "Viewer", 28, 13440, "2026-11-15"],
  ["Atlas Financial", "North America", "Active", "Sofia Patel", "Editor", 96, 46080, "2026-12-01"],
  ["Vercel Works", "Europe", "Active", "Noah Kim", "Viewer", 52, 24960, "2026-12-15"],
  ["Notion Collective", "Asia Pacific", "Active", "Olivia Chen", "Editor", 24, 11520, "2026-11-01"],
  ["Fable Media", "North America", "Active", "James Wilson", "Viewer", 48, 23040, "2026-11-15"],
  ["Aperture Research", "Europe", "Trial", "Sofia Patel", "Editor", 12, 5760, "2026-12-01"],
  ["Cobalt Partners", "Asia Pacific", "Active", "Noah Kim", "Viewer", 8, 3840, "2026-12-15"],
  ["Mosaic Group", "Europe", "Trial", "Olivia Chen", "Editor", 18, 8640, "2026-11-01"],
  ["Evergreen Energy", "North America", "Paused", "Olivia Chen", "Editor", 16, 7680, "2026-11-01"],
  ["Juniper Digital", "Asia Pacific", "Active", "Sofia Patel", "Editor", 6, 2880, "2026-12-01"],
  ["Opal Commerce", "North America", "Paused", "Sofia Patel", "Editor", 12, 5760, "2026-12-01"],
  ["Quartz Logistics", "Asia Pacific", "Active", "Olivia Chen", "Editor", 16, 7680, "2026-11-01"],
  ["Summit Networks", "Europe", "Trial", "Sofia Patel", "Editor", 6, 2880, "2026-12-01"],
].map(([account, workspace, status, owner, role, seats, arr, renewal], i) => ({ id: `acc-${i + 1}`, account, workspace, status, owner, role, seats, arr, renewal }));

const money = (n) => "$" + n.toLocaleString("en-US");
const date = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

// Column setup from Figma: titles, widths (px), groups, cell kinds, alignment
export const DEFAULT_COLUMNS = [
  { key: "account", title: "Account", width: 418, group: "Account details", kind: "emphasis" },
  { key: "workspace", title: "Workspace", width: 200, group: "Account details", kind: "text", groupable: true },
  { key: "status", title: "Status", width: 110, group: "Account details", kind: "status", groupable: true },
  { key: "owner", title: "Owner", width: 220, group: "Ownership", kind: "text", groupable: true },
  { key: "role", title: "Role", width: 120, group: "Ownership", kind: "muted", groupable: true },
  { key: "seats", title: "Seats", width: 100, group: "Commercial", kind: "number", align: "right", type: "number" },
  { key: "arr", title: "ARR", width: 160, group: "Commercial", kind: "number", align: "right", type: "number", format: money },
  { key: "renewal", title: "Renewal date", width: 180, group: "Commercial", kind: "muted", format: date },
];

export { money };
