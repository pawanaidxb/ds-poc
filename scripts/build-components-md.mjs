// Adds the components to design-system.md, so any AI tool (or person) has the whole design
// system in one file: how to use it, every token, and every component with its props,
// allowed values, Figma mapping and an example.
// Runs after scripts/build-tokens.mjs. Needs no install:  node scripts/build-components-md.mjs
// Reads only the code (src/components/*), so it always matches what is shipped.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MD = path.join(ROOT, "design-system.md");
const COMP_DIR = path.join(ROOT, "src/components");
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).name || "ds-poc";

// ---------- small parsers ----------
function matchBrace(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{" || ch === "(" || ch === "[") depth++;
    else if (ch === "}" || ch === ")" || ch === "]") { depth--; if (depth === 0) return i; }
    else if (ch === '"' || ch === "'" || ch === "`") { const q = ch; i++; while (i < src.length && src[i] !== q) { if (src[i] === "\\") i++; i++; } }
  }
  return -1;
}
function splitTop(s) {
  const parts = []; let depth = 0, cur = "", q = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { cur += ch; if (ch === "\\") { cur += s[++i]; continue; } if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { q = ch; cur += ch; continue; }
    if ("{([".includes(ch)) depth++;
    if ("})]".includes(ch)) depth--;
    if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}
function readProps(src, name) {
  const re = new RegExp(`(?:export function ${name}\\s*\\(|forwardRef\\(function ${name}\\s*\\()`);
  const m = re.exec(src);
  if (!m) return [];
  const open = src.indexOf("{", m.index + m[0].length - 1);
  if (open < 0 || src.slice(m.index + m[0].length, open).trim() !== "") return [];
  const close = matchBrace(src, open);
  return splitTop(src.slice(open + 1, close))
    .filter((p) => p && !p.startsWith("..."))
    .map((p) => {
      const [k, ...rest] = p.split("=");
      let key = k.trim(), def = rest.join("=").trim();
      const alias = key.match(/^(\w+)\s*:\s*\w+$/); // as: Tag
      if (alias) key = alias[1];
      return { name: key, def };
    });
}
function readDoc(src) {
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  if (!m) return { summary: "", lines: [] };
  const lines = m[1].split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trimEnd()).filter((l) => l.trim());
  return { summary: lines[0] || "", lines: lines.slice(1) };
}
function readStories(src) {
  const options = {};
  for (const m of src.matchAll(/(\w+):\s*\{\s*control:\s*"[\w-]+"\s*,\s*options:\s*\[([^\]]*)\]/g)) {
    options[m[1]] = m[2].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  const stories = [...src.matchAll(/export const (\w+)\s*=/g)].map((m) => m[1]);
  let example = null;
  const am = src.match(/export const \w+\s*=\s*\{\s*(?:name:\s*"[^"]*",\s*)?args:\s*(\{[^{}]*\})/);
  if (am) example = am[1];
  return { options, stories, example };
}
function argsToJsx(name, argsText) {
  if (!argsText) return `<${name} />`;
  const body = argsText.trim().slice(1, -1);
  let children = null; const attrs = [];
  for (const part of splitTop(body)) {
    const i = part.indexOf(":"); if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k === "children") { children = v.replace(/^["']|["']$/g, ""); continue; }
    if (v === "true") attrs.push(k);
    else if (/^["']/.test(v)) attrs.push(`${k}=${v.replace(/^'|'$/g, '"')}`);
    else attrs.push(`${k}={${v}}`);
  }
  const a = attrs.length ? " " + attrs.join(" ") : "";
  return children ? `<${name}${a}>${children}</${name}>` : `<${name}${a} />`;
}
const cssVars = (css) => [...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))];

// DataTable with your own data: column shape read from DEFAULT_COLUMNS in sampleData.js
function dataTableGuide() {
  const f = path.join(COMP_DIR, "DataTable/sampleData.js");
  if (!fs.existsSync(f)) return "";
  const src = fs.readFileSync(f, "utf8");
  const cols = (src.match(/DEFAULT_COLUMNS = \[([\s\S]*?)\];/) || [])[1] || "";
  const kinds = [...new Set([...cols.matchAll(/kind: "(\w+)"/g)].map((m) => m[1]))];
  const keys = [...new Set([...cols.matchAll(/(\w+):/g)].map((m) => m[1]))];
  let s = `Using DataTable with your own data:\n\n`;
  s += `- \`rows\`: an array of objects, each with a unique \`id\` plus one field per column \`key\`.\n`;
  s += `- \`columns\`: an array of objects. Fields: ${keys.map((k) => "`" + k + "`").join(", ")}.\n`;
  s += `- Column \`kind\` options: ${kinds.map((k) => "`" + k + "`").join(" · ")}. \`align\`: \`left\` · \`right\`. \`type: "number"\` sorts and filters as numbers. \`format\` is a function (value) => text. \`groupable: true\` allows Group by. \`group\` puts the column under a column group header.\n\n`;
  s += "```jsx\n";
  s += `const columns = [\n  { key: "name", title: "Name", width: 240, group: "Person", kind: "emphasis" },\n  { key: "team", title: "Team", width: 160, group: "Person", kind: "text", groupable: true },\n  { key: "status", title: "Status", width: 110, group: "Person", kind: "status", groupable: true },\n  { key: "hours", title: "Hours", width: 100, group: "Work", kind: "number", align: "right", type: "number" },\n];\nconst rows = [\n  { id: "p1", name: "Olivia Chen", team: "Design", status: "Active", hours: 32 },\n  { id: "p2", name: "James Wilson", team: "Research", status: "Paused", hours: 12 },\n];\n\n<DataTable title="People" description="Who is on each team and their hours this week." breadcrumb="Workspace / People" noun="people" rows={rows} columns={columns} />\n`;
  s += "```\n\n";
  return s;
}

// ---------- collect components ----------
const indexSrc = fs.readFileSync(path.join(ROOT, "src/index.js"), "utf8");
const exported = [...indexSrc.matchAll(/export \{ (\w+) \} from "\.\/components\/(\w+)\/\w+"/g)].map((m) => ({ name: m[1], dir: m[2] }));
const comps = exported.map(({ name, dir }) => {
  const base = path.join(COMP_DIR, dir, name);
  const src = fs.readFileSync(base + ".jsx", "utf8");
  const css = fs.existsSync(base + ".css") ? fs.readFileSync(base + ".css", "utf8") : "";
  const stories = fs.existsSync(base + ".stories.jsx") ? readStories(fs.readFileSync(base + ".stories.jsx", "utf8")) : { options: {}, stories: [], example: null };
  const doc = readDoc(src);
  const uses = [...new Set([...src.matchAll(/import \{ (\w+) \} from "\.\.\/(\w+)\//g)].map((m) => m[1]).filter((n) => !/Icon$/.test(n)))];
  return { name, dir, doc, props: readProps(src, name), stories, tokens: cssVars(css), uses };
});
const isTable = (c) => c.name.startsWith("Table") || c.name === "DataTable";

// ---------- write ----------
const tokensMd = fs.existsSync(MD) ? fs.readFileSync(MD, "utf8").split("<!-- components:start -->")[0] : "";
// Fresh output of build-tokens.mjs, or (if run twice) our own earlier output.
const tokenBody = tokensMd.includes("\n## Tokens\n")
  ? tokensMd.split("\n## Tokens\n")[1].trim()
  : tokensMd.replace(/^# .*\n+/, "").replace(/Generated from `tokens.json`.*\n+/, "").replace(/^## /gm, "### ").trim();
const tokenCount = (tokensMd.match(/Total tokens: (\d+)/) || [])[1] || "?";

let md = `# DS POC design system\n\n`;
md += `Generated from the code and \`tokens.json\` on every push. Do not edit by hand: change Figma or the components, then push.\n\n`;
md += `- ${tokenCount} tokens (Light and Dark) · ${comps.length} components · package \`${PKG}\`\n`;
md += `- Live examples: Storybook (Components and Table sections)\n\n`;
md += `## How to build UI with this design system (read first, AI tools included)\n\n`;
md += `1. **Use the components below.** Never rebuild a button, input, card or table from raw HTML when a component exists.\n`;
md += `2. **Import from the package:** \`import { Button, Input, DataTable } from "${PKG}";\` and load the tokens once: \`import "${PKG}/src/styles/tokens.css";\`.\n`;
md += `3. **Style only with tokens:** \`var(--token-name)\` from the Tokens section. No hex colours, no px values for colour, spacing or radius.\n`;
md += `4. **Use only the props and values listed** for each component. Values in the Options column are the only allowed ones.\n`;
md += `5. **States are built in:** hover, focus and filled come from the browser; use the props for selected, error, disabled.\n`;
md += `6. **Dark mode:** set \`data-theme="dark"\` on \`<html>\`. Never pick separate dark colours.\n`;
md += `7. **Fonts:** Button and Card use Urbanist; Input and all Table components use Inter.\n`;
md += `8. **Data screens:** use \`DataTable\` for lists of records; use the \`Table*\` parts only to build a table it cannot cover.\n\n`;
md += `## Tokens\n\n${tokenBody}\n\n`;
md += `<!-- components:start -->\n## Components\n\n`;
md += `| Component | Figma component | Group |\n| --- | --- | --- |\n`;
for (const c of comps) {
  const fig = (c.doc.summary.match(/matches (?:the )?"([^"]+)"/) || [])[1] || "—";
  md += `| [\`${c.name}\`](#${c.name.toLowerCase()}) | ${fig} | ${isTable(c) ? "Table" : "Core"} |\n`;
}
md += `\n`;
for (const group of [["Core components", comps.filter((c) => !isTable(c))], ["Table components", comps.filter(isTable)]]) {
  md += `### ${group[0]}\n\n`;
  for (const c of group[1]) {
    md += `#### ${c.name}\n\n`;
    if (c.doc.summary) { const s = c.doc.summary.replace(/^\w+ — /, ""); md += `${s[0].toUpperCase() + s.slice(1)}\n\n`; }
    md += `- Import: \`import { ${c.name} } from "${PKG}";\` (file \`src/components/${c.dir}/${c.name}.jsx\`)\n`;
    if (c.uses.length) md += `- Built from: ${c.uses.map((u) => "`" + u + "`").join(", ")}\n`;
    if (c.stories.stories.length) md += `- Storybook stories: ${c.stories.stories.join(", ")}\n`;
    if (c.tokens.length) md += `- Tokens used: ${c.tokens.map((t) => "`" + t + "`").join(" ")}\n`;
    md += `\n`;
    if (c.props.length) {
      md += `| Prop | Default | Options |\n| --- | --- | --- |\n`;
      for (const p of c.props) {
        const opts = c.stories.options[p.name] ? c.stories.options[p.name].map((o) => "`" + o + "`").join(" · ") : (/^(true|false)$/.test(p.def) ? "`true` · `false`" : p.name.startsWith("on") ? "function" : "");
        md += `| \`${p.name}\` | ${p.def ? "`" + p.def.replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, 60) + "`" : "—"} | ${opts} |\n`;
      }
      md += `\n`;
    }
    if (c.doc.lines.length) md += `Figma to code:\n\n${c.doc.lines.map((l) => "- " + l.trim()).join("\n")}\n\n`;
    md += "```jsx\n" + argsToJsx(c.name, c.stories.example) + "\n```\n\n";
    if (c.name === "DataTable") md += dataTableGuide();
  }
}
fs.writeFileSync(MD, md.replace(/\n{3,}/g, "\n\n"));
console.log(`design-system.md: ${tokenCount} tokens, ${comps.length} components`);
