# Instructions for AI working in this repo

This repo is a practice design system. Figma is the source of truth.

## Where things are

- `tokens.json`: design tokens pushed from Figma by Tokens Studio. Never edit by hand.
- `src/styles/tokens.css` and `design-system.md`: generated from `tokens.json` and the component code. Never edit by hand.
- `figma/variables.json`: Figma variable ID to CSS variable name.
- `figma/components/<Name>.json` and `.png`: snapshot of each published Figma component (made by `scripts/fetch-figma-components.mjs`).
- `src/components/<Name>/`: one folder per component.

## How to build a component from Figma

Each component folder has exactly these files. Copy the pattern of `src/components/Input/`.

1. `<Name>.jsx`
   - First line: `import React from "react";` (Storybook needs it).
   - Named export and default export.
   - A comment at the top mapping every Figma property to a prop.
   - Figma VARIANT property -> a prop with lowercase values (`Type=Primary` -> `variant="primary"` or `type="primary"`).
   - Figma TEXT property -> a string prop. Figma BOOLEAN property -> a boolean prop.
   - Figma states Hover / Focus / Pressed / Filled -> real CSS states (`:hover`, `:focus`), not props.
   - Disabled and Error -> boolean props.
   - Accessible HTML: real `<button>`, `<input>`, `<label htmlFor>`, `aria-*`.
2. `<Name>.css`
   - Class prefix `poc-<name>`.
   - Every colour, spacing and radius is `var(--token)`. Look up the token from `boundVariables` ids in `figma/variables.json`.
   - If Figma uses a raw value with no variable, use `var(--suggested-token-name, <raw value>)` and list it under "Design gaps" in the PR description.
   - Font sizes, weights and line heights may be raw values (no type tokens yet).
3. `<Name>.stories.jsx`
   - First line: `import React from "react";`
   - `title: "Components/<Name>"`, argTypes with controls for every prop.
   - One story per meaningful variant, plus an "AllStates" grid when there are several variants.
4. Add `export { <Name> } from "./components/<Name>/<Name>";` to `src/index.js`.
5. Add a row for the component to the table in `README.md`.

## Rules

- Do not change components that already match Figma.
- Do not edit `tokens.json`, `src/styles/tokens.css`, `design-system.md`, workflows or `package.json`.
- Keep changes small and readable. No new npm packages.
