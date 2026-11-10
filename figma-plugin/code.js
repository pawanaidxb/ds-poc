// "Send to code" — sends the selected components to GitHub, which starts the AI build.
// The build writes the code to the test branch, builds the preview Storybook
// and opens the "Preview: test" pull request.

figma.showUI(__html__, { width: 340, height: 460, themeColors: true });

// The component (set) a node belongs to, by the name the build uses.
async function componentName(node) {
  let n = node;
  if (n.type === "INSTANCE") n = await n.getMainComponentAsync();
  while (n && n.type !== "COMPONENT_SET" && n.type !== "COMPONENT") n = n.parent;
  if (!n) return null;
  if (n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET") n = n.parent;
  return n.name;
}

async function selectionNames() {
  const names = new Set();
  for (const node of figma.currentPage.selection) {
    const name = await componentName(node);
    if (name) names.add(name);
    // A frame that holds component sets (for example "Button") counts too.
    if (!name && "findAll" in node) {
      for (const c of node.findAll((x) => x.type === "COMPONENT_SET" || (x.type === "COMPONENT" && x.parent.type !== "COMPONENT_SET"))) names.add(c.name);
    }
  }
  return [...names];
}

async function sendSelection() {
  figma.ui.postMessage({ type: "selection", names: await selectionNames() });
}

figma.on("selectionchange", sendSelection);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "ready") {
    const settings = (await figma.clientStorage.getAsync("settings")) || {};
    figma.ui.postMessage({ type: "settings", settings });
    await sendSelection();
  }
  if (msg.type === "save-settings") {
    await figma.clientStorage.setAsync("settings", msg.settings);
  }
  if (msg.type === "notify") {
    figma.notify(msg.text, { error: !!msg.error });
  }
};
