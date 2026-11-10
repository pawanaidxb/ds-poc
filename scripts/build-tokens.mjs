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
  const names = [...order.filter((k) => k in raw), ...setKeys.filter((k) => !order.includes(k))];
  sets = names.map((k) => ({ name: k, tree: raw[k] }));
} else {
  sets = [{ name: "tokens", tree: raw }];
}
const isDark = (name) => /(^|\/|\s)dark(\s?mode)?$/i.test(name.trim());
// Brand sets come from the Figma "Brand" collection: "Brand/Brand A", "Brand/Brand B", ...
// The first brand is the default (:root). Each other brand gets [data-brand="brand-b"].
const isBrand = (name) => /^brand\//i.test(name.trim());
const brandSlug = (name) => name.trim().replace(/^brand\//i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
const brands = []; // [{ name, slug, toks }]
for (const s of sets) {
  if (isBrand(s.name)) brands.push({ name: s.name.replace(/^brand\//i, ""), slug: brandSlug(s.name), toks: flatten(s.tree) });
  else Object.assign(isDark(s.name) ? dark : light, flatten(s.tree));
}
const brandKeys = new Set(brands.flatMap((b) => Object.keys(b.toks)));
const all = { ...(brands[0]?.toks || {}), ...light, ...dark };
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
    if (brandKeys.has(ref) && !(ref in CTX && CTX.__brand)) return `var(${cssName(ref)})`;
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
    .filter(([n]) => !n.startsWith("__"))
    .flatMap(([n, t]) => toCss(n, t))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n") +
  `\n}\n`;

let css = `/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n\n`;
css += block(":root", light, light);
brands.forEach((b, i) => {
  const ctx = { ...b.toks, __brand: true };
  css += `\n/* Brand: ${b.name} */\n` + block(i === 0 ? ":root" : `[data-brand="${b.slug}"]`, b.toks, ctx);
});
// Colours that point at a brand token are repeated on [data-brand], so a brand set on
// any element (not only <html>) re-resolves them for that part of the page.
const refsBrand = (t) => typeof t.value === "string" && [...t.value.matchAll(/\{([^}]+)\}/g)].some((m) => brandKeys.has(m[1]));
const pick = (toks) => Object.fromEntries(Object.entries(toks).filter(([, t]) => refsBrand(t)));
if (brands.length && Object.keys(pick(light)).length) css += `\n` + block(`[data-brand]`, pick(light), light);
const darkSel = brands.length ? `[data-theme="dark"],\n[data-theme="dark"] [data-brand]` : `[data-theme="dark"]`;
if (Object.keys(dark).length) css += `\n` + block(darkSel, dark, all);
fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
fs.writeFileSync(CSS_OUT, css);

// 5. Write design-system.md
const groups = {};
for (const n of Object.keys(all)) if (!brandKeys.has(n)) (groups[n.split(".")[0]] ||= []).push(n);
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
if (brands.length) {
  md += `## Brands\n\n`;
  md += `Set \`data-brand\` on the page to switch brand: ${brands.map((b, i) => "`" + b.slug + "`" + (i === 0 ? " (default)" : "")).join(", ")}. Light / Dark still uses \`data-theme\`.\n\n`;
  md += `| Token | CSS variable | ${brands.map((b) => b.name).join(" | ")} |\n| --- | --- | ${brands.map(() => "---").join(" | ")} |\n`;
  for (const n of brandKeys) {
    const cells = brands.map((b) => (b.toks[n] ? ((CTX = { ...b.toks, __brand: true }), toCss(n, b.toks[n])).map(([, v]) => v).join(" / ") : ""));
    md += `| \`${n}\` | \`${cssName(n)}\` | ${cells.join(" | ")} |\n`;
  }
  md += `\n`;
}
fs.writeFileSync(MD_OUT, md);

console.log(`Done: ${Object.keys(all).length} tokens -> src/styles/tokens.css and design-system.md`);
