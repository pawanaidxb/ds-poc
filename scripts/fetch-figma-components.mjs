// Downloads every published component from the Figma library into figma/components/:
//   <Name>.json  -> the component's full structure (variants, properties, variable links)
//   <Name>.png   -> a picture of it, so the AI can compare its code with the design
// Needs: FIGMA_TOKEN and FIGMA_FILE_KEY. Optional ONLY="Badge,Input" to limit the list.
// Run: node scripts/fetch-figma-components.mjs

import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.FIGMA_TOKEN;
const FILE = process.env.FIGMA_FILE_KEY;
const ONLY = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!TOKEN || !FILE) throw new Error("FIGMA_TOKEN and FIGMA_FILE_KEY are required");

const OUT = path.join(process.cwd(), "figma/components");
fs.mkdirSync(OUT, { recursive: true });

async function api(p) {
  const r = await fetch(`https://api.figma.com/v1/${p}`, { headers: { "X-Figma-Token": TOKEN } });
  if (!r.ok) throw new Error(`Figma API ${r.status} on ${p}: ${await r.text()}`);
  return r.json();
}

// 1. Published components. Variants are grouped under their component set.
const { meta } = await api(`files/${FILE}/components`);
const groups = new Map(); // nodeId -> name
for (const c of meta.components || []) {
  const set = c.containing_frame?.containingComponentSet;
  if (set) groups.set(set.nodeId, set.name);
  else groups.set(c.node_id, c.name);
}
let targets = [...groups.entries()].filter(([, name]) => !name.startsWith(".") && !name.startsWith("_"));
if (ONLY.length) targets = targets.filter(([, name]) => ONLY.some((o) => o.toLowerCase() === name.toLowerCase()));
if (!targets.length) {
  console.log("No matching published components.");
  process.exit(0);
}

// 2. Full structure of each component (or component set)
const ids = targets.map(([id]) => id).join(",");
const { nodes } = await api(`files/${FILE}/nodes?ids=${encodeURIComponent(ids)}`);

// 3. A picture of each one
const { images } = await api(`images/${FILE}?ids=${encodeURIComponent(ids)}&format=png&scale=1`);

const safe = (n) => n.replace(/[^a-zA-Z0-9_-]+/g, "");
const index = [];
for (const [id, name] of targets) {
  const doc = nodes[id]?.document;
  if (!doc) continue;
  const file = safe(name) || safe(id);
  fs.writeFileSync(path.join(OUT, `${file}.json`), JSON.stringify(doc, null, 2));
  if (images?.[id]) {
    const img = await fetch(images[id]);
    if (img.ok) fs.writeFileSync(path.join(OUT, `${file}.png`), Buffer.from(await img.arrayBuffer()));
  }
  index.push({ name, nodeId: id, file: `figma/components/${file}.json` });
}
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify({ fileKey: FILE, components: index }, null, 2));
console.log(`Saved ${index.length} components: ${index.map((c) => c.name).join(", ")}`);
