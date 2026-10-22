// Turns tokens.json (from Tokens Studio) into:
//   src/styles/tokens.css  -> CSS variables the components use
//   design-system.md       -> a readable list of every token
// Needs no install. Run with:  node scripts/build-tokens.mjs
// Do not hand-edit the two output files; they are overwritten.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, process.argv[2] || "tokens.json");
const CSS_OUT = path.join(ROOT, "src/styles/tokens.css");
const MD_OUT = path.join(ROOT, "design-system.md");

const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));

const isLeaf = (o) => o && typeof o === "object" && ("value" in o || "$value" in o);
const valOf = (o) => ("$value" in o ? o.$value : o.value);
const typeOf = (o) => o.$type || o.type || "";

// 1. Find the token sets. Tokens Studio single-file format has one key per set
//    plus "$themes" / "$metadata". A plain token file is treated as one set.
let sets;
const setKeys = Object.keys(raw).filter((k) => !k.startsWith("$"));
const looksLikeSets = "$metadata" in raw || "$themes" in raw;
if (looksLikeSets) {
  const order = raw.$metadata?.tokenSetOrder || setKeys;
  sets = order.filter((k) => k in raw).map((k) => ({ name: k, tree: raw[k] }));
} else {
  sets = [{ name: "tokens", tree: raw }];
}
const isDark = (name) => /(^|\/|\s)dark(\s?mode)?$/i.test(name.trim());

// 2. Flatten every set into "a.b.c" -> { value, type }
function flatten(tree, prefix = [], out = {}) {
  for (const [k, v] of Object.entries(tree || {})) {
    if (k.startsWith("$")) continue;
    const p = [...prefix, k];
    if (isLeaf(v)) out[p.join(".")] = { value: valOf(v), type: typeOf(v), description: v.description || v.$description || "" };
    else if (v && typeof v === "object") flatten(v, p, out);
  }
  return out;
}

const light = {};
const dark = {};
for (const s of sets) Object.assign(isDark(s.name) ? dark : light, flatten(s.tree));
const all = { ...light, ...dark };
let CTX = light; // which values references point to while writing a block

// 3. Helpers: CSS names, references, units
const cssName = (dotted) =>
  "--" +
  dotted
    .replace(/%/g, "pct")
    .replace(/[\s./]+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();

const PX_TYPES = new Set(["dimension", "spacing", "sizing", "borderradius", "borderwidth", "fontsizes", "lineheights", "letterspacing", "paragraphspacing"]);
const PX_NAMES = /(spacing|space|radius|size|width|height|gap|padding|margin|inset|offset)/i;

function withUnit(name, type, v) {
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s) && s !== "0" && (PX_TYPES.has(type.toLowerCase()) || PX_NAMES.test(name))) return s + "px";
  return s;
}

function resolve(value, seen = new Set()) {
  if (typeof value !== "string") return value;
  const whole = value.match(/^\{([^}]+)\}$/);
  if (whole) {
    const ref = whole[1];
    if (seen.has(ref) || !(ref in CTX)) return value;
    seen.add(ref);
    return resolve(CTX[ref].value, seen);
  }
  return value.replace(/\{([^}]+)\}/g, (m, ref) => (ref in CTX && !seen.has(ref) ? String(resolve(CTX[ref].value, new Set([...seen, ref]))) : m));
}

// Composite tokens (typography, shadows) become several variables or one string
function toCss(name, tok) {
  let v = resolve(tok.value);
  const lines = [];
  if (Array.isArray(v)) {
    v = v.map((sh) => (typeof sh === "object" ? shadow(sh) : sh)).join(", ");
    lines.push([cssName(name), v]);
  } else if (v && typeof v === "object") {
    if ("blur" in v || "spread" in v) lines.push([cssName(name), shadow(v)]);
    else for (const [k, sub] of Object.entries(v)) lines.push([cssName(name + "." + k), withUnit(k, k, resolve(sub))]);
  } else {
    lines.push([cssName(name), withUnit(name, tok.type, v)]);
  }
  return lines;
}
function shadow(s) {
  const px = (n) => (/^-?\d+(\.\d+)?$/.test(String(n)) && String(n) !== "0" ? n + "px" : n ?? 0);
  return `${s.type === "innerShadow" ? "inset " : ""}${px(s.x)} ${px(s.y)} ${px(s.blur)} ${px(s.spread)} ${resolve(s.color)}`;
}

// 4. Write tokens.css
const block = (sel, toks, ctx) =>
  ((CTX = ctx), `${sel} {\n`) +
  Object.entries(toks)
    .flatMap(([n, t]) => toCss(n, t))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n") +
  `\n}\n`;

let css = `/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n\n`;
css += block(":root", light, light);
if (Object.keys(dark).length) css += `\n` + block(`[data-theme="dark"]`, dark, all);
fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
fs.writeFileSync(CSS_OUT, css);

// 5. Write design-system.md
const groups = {};
for (const n of Object.keys(all)) (groups[n.split(".")[0]] ||= []).push(n);
const hasDark = Object.keys(dark).length > 0;
let md = `# Design system tokens\n\n`;
md += `Generated from \`tokens.json\`. Do not edit by hand. Change tokens in Figma and push.\n\n`;
md += `- Token sets: ${sets.map((s) => "`" + s.name + "`").join(", ")}\n`;
md += `- Total tokens: ${Object.keys(all).length}\n`;
md += `- Use in code: \`var(--name)\`, e.g. \`color: var(${cssName(Object.keys(all)[0] || "x")});\`\n\n`;
for (const [g, names] of Object.entries(groups)) {
  md += `## ${g}\n\n`;
  md += hasDark ? `| Token | CSS variable | Light | Dark | Type |\n| --- | --- | --- | --- | --- |\n` : `| Token | CSS variable | Value | Type |\n| --- | --- | --- | --- |\n`;
  for (const n of names) {
    const show = (t, ctx) => (t ? ((CTX = ctx), toCss(n, t)).map(([, v]) => v).join(" / ") : "");
    const cells = [`\`${n}\``, `\`${cssName(n)}\``, show(light[n], light)];
    if (hasDark) cells.push(show(dark[n], all));
    cells.push(all[n].type || "");
    md += `| ${cells.join(" | ")} |\n`;
  }
  md += `\n`;
}
fs.writeFileSync(MD_OUT, md);

console.log(`Done: ${Object.keys(all).length} tokens -> src/styles/tokens.css and design-system.md`);
