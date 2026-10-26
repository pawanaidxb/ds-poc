# Design system POC

A small practice design system to test the Figma → GitHub → Storybook sync
and Figma Code Connect before using them on the real design system.

## What is in here

| File or folder | What it is |
| --- | --- |
| `tokens.json` | The design tokens. Tokens Studio overwrites this from Figma. |
| `src/styles/tokens.css` | Generated. CSS variables the components use. Do not edit. |
| `design-system.md` | Generated. Every token and every component (props, options, examples). Give this file to any AI tool to build UI with the system. Do not edit. |
| `src/components/Button/Button.jsx` | The Button component (matches Figma "Button"). |
| `src/components/Card/Card.jsx` | The Card component (matches Figma "Card"). |
| `src/components/Input/Input.jsx` | The Input component (matches Figma "Input"). |
| `src/components/Table*/` | Table building blocks (match Figma "Table / ..."): Checkbox, Drag handle, Selection cell, Cell, Header cell, Row, Filter chip, Filter control, Filter logic, Filter rule, Menu option, Column menu, Column group, Group row, Pagination, Toolbar, Bulk selection bar, Drop indicator, Drag preview, Advanced filter panel. |
| `src/components/DataTable/DataTable.jsx` | The full interactive Data table (matches Figma "Data table", all 10 states). |
| `scripts/build-tokens.mjs` | Turns `tokens.json` into the two generated files. |
| `.github/workflows/sync.yml` | The automation. Runs on every save to `main`. |
| `.storybook/` | Storybook setup. |

## How the sync works

1. Change a variable in Figma.
2. In Tokens Studio, import variables and click Push.
3. GitHub runs the automation (see the **Actions** tab).
4. About 3 minutes later `tokens.css`, `design-system.md` and Storybook are updated.

## Rules

- Change tokens only in Figma.
- Do not hand-edit `src/styles/tokens.css` or `design-system.md`.
- Components use `var(--token-name)`, never raw hex values.

## Automatic component code (Figma publish → pull request)

1. Publish the Figma library.
2. A relay (n8n) tells GitHub, and **Build components from Figma** runs (see the **Actions** tab).
3. It downloads the components into `figma/components/` and Claude writes or updates the code in `src/components/`.
4. A pull request appears. Check it in Storybook, then click **Merge**.
5. The sync automation publishes Storybook.

You can also start it by hand: **Actions** > **Build components from Figma** > **Run workflow**.
