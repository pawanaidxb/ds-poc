# DS POC design system

Generated from the code and `tokens.json` on every push. Do not edit by hand: change Figma or the components, then push.

- 22 tokens (Light and Dark) · 24 components · package `ds-poc`
- Live examples: Storybook (Components and Table sections)

## How to build UI with this design system (read first, AI tools included)

1. **Use the components below.** Never rebuild a button, input, card or table from raw HTML when a component exists.
2. **Import from the package:** `import { Button, Input, DataTable } from "ds-poc";` and load the tokens once: `import "ds-poc/src/styles/tokens.css";`.
3. **Style only with tokens:** `var(--token-name)` from the Tokens section. No hex colours, no px values for colour, spacing or radius.
4. **Use only the props and values listed** for each component. Values in the Options column are the only allowed ones.
5. **States are built in:** hover, focus and filled come from the browser; use the props for selected, error, disabled.
6. **Dark mode:** set `data-theme="dark"` on `<html>`. Never pick separate dark colours.
7. **Fonts:** Button and Card use Urbanist; Input and all Table components use Inter.
8. **Data screens:** use `DataTable` for lists of records; use the `Table*` parts only to build a table it cannot cover.

## Tokens

- Token sets: `POC Tokens/Light`, `POC Tokens/Dark`
- Total tokens: 22
- Use in code: `var(--name)`, e.g. `color: var(--color-primary);`

### color

| Token | CSS variable | Light | Dark | Type |
| --- | --- | --- | --- | --- |
| `color.primary` | `--color-primary` | #e60053 | #ff94bb | color |
| `color.primary-hover` | `--color-primary-hover` | #c90049 | #ff76a7 | color |
| `color.on-primary` | `--color-on-primary` | #ffffff | #000000 | color |
| `color.text` | `--color-text` | #171717 | #ebebeb | color |
| `color.text-muted` | `--color-text-muted` | #737373 | #c6c6c6 | color |
| `color.surface` | `--color-surface` | #ffffff | #000000 | color |
| `color.border` | `--color-border` | #e5e5e5 | #686868 | color |
| `color.danger` | `--color-danger` | #d32f2f | #bd2a2a | color |
| `color.icon` | `--color-icon` | #525866 | #a3a9b5 | color |
| `color.border-strong` | `--color-border-strong` | #b5bbc4 | #7a808c | color |
| `color.primary-subtle` | `--color-primary-subtle` | #fff0f5 | #3a0d1f | color |
| `color.surface-muted` | `--color-surface-muted` | #f8f9fb | #121212 | color |
| `color.surface-sunken` | `--color-surface-sunken` | #f3f4f6 | #1a1a1a | color |

### spacing

| Token | CSS variable | Light | Dark | Type |
| --- | --- | --- | --- | --- |
| `spacing.sm` | `--spacing-sm` | 8px | 8px | number |
| `spacing.md` | `--spacing-md` | 16px | 16px | number |
| `spacing.lg` | `--spacing-lg` | 24px | 24px | number |
| `spacing.xs` | `--spacing-xs` | 4px | 4px | number |
| `spacing.ms` | `--spacing-ms` | 12px | 12px | number |
| `spacing.ml` | `--spacing-ml` | 20px | 20px | number |

### radius

| Token | CSS variable | Light | Dark | Type |
| --- | --- | --- | --- | --- |
| `radius.sm` | `--radius-sm` | 4px | 4px | number |
| `radius.md` | `--radius-md` | 8px | 8px | number |
| `radius.xs` | `--radius-xs` | 3px | 3px | number |

<!-- components:start -->
## Components

| Component | Figma component | Group |
| --- | --- | --- |
| [`Button`](#button) | Button | Core |
| [`Card`](#card) | Card | Core |
| [`Input`](#input) | Input | Core |
| [`TableCheckbox`](#tablecheckbox) | Table / Checkbox | Table |
| [`TableDragHandle`](#tabledraghandle) | Table / Drag handle | Table |
| [`TableSelectionCell`](#tableselectioncell) | Table / Selection cell | Table |
| [`TableCell`](#tablecell) | Table / Cell | Table |
| [`TableHeaderCell`](#tableheadercell) | Table / Header cell | Table |
| [`TableRow`](#tablerow) | Table / Row | Table |
| [`TableFilterChip`](#tablefilterchip) | Table / Filter chip | Table |
| [`TableFilterControl`](#tablefiltercontrol) | Table / Filter control | Table |
| [`TableFilterLogic`](#tablefilterlogic) | Table / Filter logic | Table |
| [`TableFilterRule`](#tablefilterrule) | Table / Filter rule | Table |
| [`TableMenuOption`](#tablemenuoption) | Table / Menu option | Table |
| [`TableColumnMenu`](#tablecolumnmenu) | Table / Column menu | Table |
| [`TableColumnGroup`](#tablecolumngroup) | Table / Column group | Table |
| [`TableGroupRow`](#tablegrouprow) | Table / Group row | Table |
| [`TablePagination`](#tablepagination) | Table / Pagination | Table |
| [`TableToolbar`](#tabletoolbar) | Table / Toolbar | Table |
| [`TableBulkSelectionBar`](#tablebulkselectionbar) | Table / Bulk selection bar | Table |
| [`TableDropIndicator`](#tabledropindicator) | Table / Drop indicator | Table |
| [`TableDragPreview`](#tabledragpreview) | Table / Drag preview | Table |
| [`TableAdvancedFilterPanel`](#tableadvancedfilterpanel) | Table / Advanced filter panel | Table |
| [`DataTable`](#datatable) | Data table | Table |

### Core components

#### Button

Matches the "Button" component in Figma.

- Import: `import { Button } from "ds-poc";` (file `src/components/Button/Button.jsx`)
- Storybook stories: Primary, Secondary, Disabled
- Tokens used: `--spacing-sm` `--spacing-md` `--radius-md` `--color-primary` `--color-on-primary` `--color-primary-hover` `--color-surface` `--color-text` `--color-border`

| Prop | Default | Options |
| --- | --- | --- |
| `variant` | `"primary"` | `primary` · `secondary` |
| `disabled` | `false` | `true` · `false` |
| `children` | `"Button"` |  |

Figma to code:

- Figma property "Type" (Primary / Secondary)  ->  prop "variant"
- Figma property "Label" (text)                ->  prop "children"

```jsx
<Button variant="primary">Book flight</Button>
```

#### Card

Matches the "Card" component in Figma.

- Import: `import { Card } from "ds-poc";` (file `src/components/Card/Card.jsx`)
- Storybook stories: Default, WithActions
- Tokens used: `--spacing-lg` `--radius-md` `--color-border` `--color-surface` `--spacing-sm` `--color-text` `--color-text-muted` `--spacing-md`

| Prop | Default | Options |
| --- | --- | --- |
| `title` | `"Card title"` |  |
| `description` | `"Card description"` |  |
| `children` | — |  |

Figma to code:

- Figma property "Title" (text)        ->  prop "title"
- Figma property "Description" (text)  ->  prop "description"

```jsx
<Card title="Dubai to London" description="Departs 08:15, 1 stop" />
```

#### Input

Matches the "Input" component set in Figma (DS POC file).

- Import: `import { Input } from "ds-poc";` (file `src/components/Input/Input.jsx`)
- Storybook stories: Default, Filled, ErrorState, Disabled, AllSizes, AllStates
- Tokens used: `--spacing-sm` `--color-text` `--spacing-md` `--color-primary` `--color-surface` `--color-border` `--radius-md` `--color-text-muted` `--color-border-hover` `--color-danger` `--color-surface-disabled` `--color-text-disabled`

| Prop | Default | Options |
| --- | --- | --- |
| `size` | `"small"` | `small` · `medium` · `large` |
| `label` | `"Work email"` |  |
| `placeholder` | `"name@company.com"` |  |
| `helperText` | `"Use your company email address."` |  |
| `errorMessage` | `"Enter a valid work email address."` |  |
| `showLabel` | `true` | `true` · `false` |
| `showHelper` | `true` | `true` · `false` |
| `error` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `id` | — |  |
| `width` | — |  |

Figma to code:

- Figma property        ->  code prop
- Size (Small/Medium/Large) -> size ("small" | "medium" | "large")
- State=Error           ->  error (true) + errorMessage
- State=Disabled        ->  disabled (true)
- State=Default/Hover/Focus/Filled -> real browser states, no prop needed
- Label (text)          ->  label
- Input text (text)     ->  placeholder
- Helper text (text)    ->  helperText
- Show label (boolean)  ->  showLabel
- Show helper (boolean) ->  showHelper
- (code only) width     ->  width, e.g. 280 or "100%"

```jsx
<Input size="small" />
```

### Table components

#### TableCheckbox

Matches "Table / Checkbox" in Figma.

- Import: `import { TableCheckbox } from "ds-poc";` (file `src/components/TableCheckbox/TableCheckbox.jsx`)
- Storybook stories: Unchecked, Checked, Indeterminate, Disabled, Interactive
- Tokens used: `--color-surface` `--color-border-strong` `--radius-xs` `--color-on-primary` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `checked` | `false` | `true` · `false` |
| `indeterminate` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `label` | `"Select row"` |  |
| `onChange` | — | function |

Figma to code:

- Figma State=Unchecked/Checked/Indeterminate/Disabled -> checked, indeterminate, disabled

```jsx
<TableCheckbox checked={false} />
```

#### TableDragHandle

Matches "Table / Drag handle" in Figma.

- Import: `import { TableDragHandle } from "ds-poc";` (file `src/components/TableDragHandle/TableDragHandle.jsx`)
- Storybook stories: Row, Column, Dragging, Disabled
- Tokens used: `--color-text-muted` `--color-surface-muted` `--color-primary-subtle` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `axis` | `"row"` | `row` · `column` |
| `dragging` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `label` | — |  |

Figma to code:

- Axis=Row/Column -> axis="row" | "column"
- State=Hover -> CSS :hover · State=Dragging -> dragging · State=Disabled -> disabled

```jsx
<TableDragHandle axis="row" />
```

#### TableSelectionCell

Matches "Table / Selection cell" in Figma.

- Import: `import { TableSelectionCell } from "ds-poc";` (file `src/components/TableSelectionCell/TableSelectionCell.jsx`)
- Built from: `TableCheckbox`, `TableDragHandle`
- Storybook stories: Unchecked, Checked, Indeterminate, Disabled, WithoutDragHandle
- Tokens used: `--spacing-xs` `--spacing-2xs`

| Prop | Default | Options |
| --- | --- | --- |
| `as` | `"td"` |  |
| `checked` | `false` | `true` · `false` |
| `indeterminate` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `showDragHandle` | `true` | `true` · `false` |
| `label` | — |  |
| `onChange` | — | function |
| `dragHandleProps` | — |  |

Figma to code:

- State=Unchecked/Checked/Indeterminate/Disabled -> checked, indeterminate, disabled
- Show drag handle (boolean) -> showDragHandle
- Renders a <td>; use as="th" in a header row.

```jsx
<TableSelectionCell />
```

#### TableCell

Matches "Table / Cell" in Figma.

- Import: `import { TableCell } from "ds-poc";` (file `src/components/TableCell/TableCell.jsx`)
- Storybook stories: Text, Number, Muted, Status, Emphasis, Selected, Dragging, Disabled, AllStates
- Tokens used: `--spacing-ms` `--color-text` `--color-icon` `--color-surface-muted` `--color-primary-subtle` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `as` | `"td"` |  |
| `kind` | `"text"` | `text` · `number` · `muted` · `status` · `emphasis` |
| `selected` | `false` | `true` · `false` |
| `dragging` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `width` | — |  |
| `children` | `"Cell value"` |  |

Figma to code:

- Kind=Text/Number/Muted/Status/Emphasis -> kind
- Content (text) -> children
- State=Hover -> CSS (row hover) · Selected -> selected · Focus -> CSS :focus-visible
- State=Dragging -> dragging · Disabled -> disabled

```jsx
<TableCell kind="text">Northwind Traders</TableCell>
```

#### TableHeaderCell

Matches "Table / Header cell" in Figma.

- Import: `import { TableHeaderCell } from "ds-poc";` (file `src/components/TableHeaderCell/TableHeaderCell.jsx`)
- Built from: `TableDragHandle`
- Storybook stories: Default, Ascending, Descending, Filtered, Resizing, Dragging, DropTarget, Disabled, RightAligned, ClickToSort
- Tokens used: `--spacing-sm` `--color-border` `--color-surface` `--color-text` `--spacing-xs` `--color-text-muted` `--color-primary` `--color-surface-muted` `--color-primary-subtle`

| Prop | Default | Options |
| --- | --- | --- |
| `title` | `"Column"` |  |
| `align` | `"left"` | `left` · `right` |
| `sort` | `"none"` | `none` · `asc` · `desc` |
| `showSort` | `true` | `true` · `false` |
| `showFilter` | `true` | `true` · `false` |
| `showDragHandle` | `true` | `true` · `false` |
| `filtered` | `false` | `true` · `false` |
| `resizing` | `false` | `true` · `false` |
| `dragging` | `false` | `true` · `false` |
| `dropTarget` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `width` | — |  |
| `onSort` | — | function |
| `onFilter` | — | function |
| `onResizeStart` | — | function |
| `dragHandleProps` | — |  |

Figma to code:

- Title (text) -> title
- Align=Left/Right -> align
- State=Ascending/Descending -> sort="asc" | "desc" (sort="none" shows the up/down chevrons)
- State=Filtered -> filtered · Resizing -> resizing · Dragging -> dragging
- State=Drop target -> dropTarget · Disabled -> disabled · Hover -> CSS :hover
- Show sort / Show filter / Show drag handle (booleans) -> showSort, showFilter, showDragHandle

```jsx
<TableHeaderCell title="Account" />
```

#### TableRow

Matches "Table / Row" in Figma.

- Import: `import { TableRow } from "ds-poc";` (file `src/components/TableRow/TableRow.jsx`)
- Storybook stories: Default, Selected, Dragging, DropTarget, Disabled, Focusable
- Tokens used: `--color-surface` `--color-border` `--color-surface-muted` `--color-primary-subtle` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `selected` | `false` | `true` · `false` |
| `dragging` | `false` | `true` · `false` |
| `dropTarget` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `children` | — |  |

Figma to code:

- State=Default/Hover/Focus -> CSS states (:hover, :focus-visible)
- State=Selected -> selected · Dragging -> dragging · Drop target -> dropTarget · Disabled -> disabled
- Layout=Standard/Hidden column/Compact/Resized -> set by the columns you render (see DataTable)
- Children: TableSelectionCell and TableCell elements.

```jsx
<TableRow />
```

#### TableFilterChip

Matches "Table / Filter chip" in Figma.

- Import: `import { TableFilterChip } from "ds-poc";` (file `src/components/TableFilterChip/TableFilterChip.jsx`)
- Storybook stories: Active, Disabled
- Tokens used: `--spacing-sm` `--spacing-2xs` `--spacing-9` `--color-primary-subtle` `--color-primary-border` `--radius-sm` `--color-primary-hover` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `children` | `"Status is Active"` |  |
| `disabled` | `false` | `true` · `false` |
| `onRemove` | — | function |

Figma to code:

- Condition (text) -> children · State=Hover -> CSS · State=Disabled -> disabled

```jsx
<TableFilterChip>Status is Active</TableFilterChip>
```

#### TableFilterControl

Matches "Table / Filter control" in Figma.

- Import: `import { TableFilterControl } from "ds-poc";` (file `src/components/TableFilterControl/TableFilterControl.jsx`)
- Storybook stories: Field, Operator, Placeholder, Disabled
- Tokens used: `--spacing-10` `--color-surface` `--color-text` `--color-border` `--radius-sm` `--color-primary` `--color-text-muted`

| Prop | Default | Options |
| --- | --- | --- |
| `kind` | `"field"` |  |
| `value` | — |  |
| `options` | `[]` |  |
| `placeholder` | `"Select a value"` |  |
| `disabled` | `false` | `true` · `false` |
| `onChange` | — | function |

Figma to code:

- Kind=Field/Operator -> kind (sets the accessible label)
- Value (text) -> value · State=Focus -> CSS :focus · State=Disabled -> disabled
- options: array of strings or { value, label }

```jsx
<TableFilterControl options={["Account", "Status"]} />
```

#### TableFilterLogic

Matches "Table / Filter logic" in Figma.

- Import: `import { TableFilterLogic } from "ds-poc";` (file `src/components/TableFilterLogic/TableFilterLogic.jsx`)
- Storybook stories: And, Or, Interactive
- Tokens used: `--spacing-3` `--color-surface-sunken` `--radius-sm` `--spacing-2xs` `--spacing-ms` `--radius-xs` `--color-text-muted` `--color-surface` `--color-border` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `value` | `"AND"` |  |
| `onChange` | — | function |

Figma to code:

- Match=AND/OR -> value ("AND" | "OR"), onChange(newValue)

```jsx
<TableFilterLogic value="AND" />
```

#### TableFilterRule

Matches "Table / Filter rule" in Figma.

- Import: `import { TableFilterRule } from "ds-poc";` (file `src/components/TableFilterRule/TableFilterRule.jsx`)
- Built from: `TableFilterControl`, `Input`
- Storybook stories: Text, Number, Disabled
- Tokens used: `--spacing-10` `--spacing-ms` `--color-surface-muted` `--color-border` `--radius-md` `--color-text` `--color-text-muted` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `kind` | `"text"` |  |
| `field` | `"Status"` |  |
| `fields` | `["Account", "Workspace", "Status", "Owner", "Role", "Seats",` |  |
| `operator` | — |  |
| `value` | `""` |  |
| `disabled` | `false` | `true` · `false` |
| `onChange` | — | function |
| `onRemove` | — | function |

Figma to code:

- Kind=Text/Number -> kind · State=Disabled -> disabled
- Built from TableFilterControl (field + operator) and Input (value).

```jsx
<TableFilterRule kind="text" field="Status" value="Active" disabled />
```

#### TableMenuOption

Matches "Table / Menu option" in Figma.

- Import: `import { TableMenuOption } from "ds-poc";` (file `src/components/TableMenuOption/TableMenuOption.jsx`)
- Built from: `TableCheckbox`
- Storybook stories: Checkbox, Selected, Action, Disabled, Interactive
- Tokens used: `--spacing-10` `--spacing-sm` `--color-surface` `--radius-sm` `--color-text` `--color-text-muted` `--color-primary-subtle` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `kind` | `"checkbox"` | `checkbox` · `action` |
| `label` | `"Option"` |  |
| `detail` | `"12"` |  |
| `showDetail` | `true` | `true` · `false` |
| `selected` | `false` | `true` · `false` |
| `disabled` | `false` | `true` · `false` |
| `onSelect` | — | function |

Figma to code:

- Kind=Checkbox/Action -> kind · Label -> label · Detail -> detail · Show detail -> showDetail
- State=Selected -> selected (checkbox kind) · Focus -> CSS :focus-visible · Disabled -> disabled

```jsx
<TableMenuOption label="Editor" detail="12" />
```

#### TableColumnMenu

Matches "Table / Column menu" in Figma (the popover shell).

- Import: `import { TableColumnMenu } from "ds-poc";` (file `src/components/TableColumnMenu/TableColumnMenu.jsx`)
- Storybook stories: ColumnFilter, ColumnVisibility, ColumnWidth
- Tokens used: `--spacing-10` `--spacing-ms` `--color-surface` `--color-border` `--radius-md` `--shadow-popover` `--color-text` `--color-text-muted` `--spacing-xs` `--spacing-sm`

| Prop | Default | Options |
| --- | --- | --- |
| `title` | `"Filter by role"` |  |
| `note` | — |  |
| `onClose` | — | function |
| `children` | — |  |
| `footer` | — |  |

Figma to code:

- Kind=Column filter / Column visibility / Column width -> the content you pass in
- (see the stories for each kind, built from Input, TableMenuOption and Button).

```jsx
<TableColumnMenu />
```

#### TableColumnGroup

Matches "Table / Column group" in Figma: a header that spans several columns.

- Import: `import { TableColumnGroup } from "ds-poc";` (file `src/components/TableColumnGroup/TableColumnGroup.jsx`)
- Storybook stories: Default, Dragging
- Tokens used: `--spacing-ms` `--color-border` `--color-surface` `--color-icon` `--color-primary-subtle` `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `title` | `"ACCOUNT DETAILS"` |  |
| `colSpan` | `1` |  |
| `dragging` | `false` | `true` · `false` |

Figma to code:

- Title -> title · State=Dragging -> dragging · colSpan -> how many columns it covers

```jsx
<TableColumnGroup title="Account details" />
```

#### TableGroupRow

Matches "Table / Group row" in Figma.

- Import: `import { TableGroupRow } from "ds-poc";` (file `src/components/TableGroupRow/TableGroupRow.jsx`)
- Storybook stories: Expanded, Collapsed, Interactive
- Tokens used: `--color-surface-sunken` `--color-border` `--spacing-10` `--spacing-14` `--color-primary` `--color-text-muted` `--color-text` `--spacing-ml` `--color-icon`

| Prop | Default | Options |
| --- | --- | --- |
| `group` | `"North America"` |  |
| `count` | `"4 accounts"` |  |
| `seatsTotal` | `"264 seats"` |  |
| `arrTotal` | `"$126,720 ARR"` |  |
| `expanded` | `true` | `true` · `false` |
| `onToggle` | — | function |
| `colSpan` | `1` |  |

Figma to code:

- Group, Count, Seats total, ARR total (text) -> group, count, seatsTotal, arrTotal
- State=Expanded/Collapsed -> expanded, onToggle · colSpan -> number of table columns

```jsx
<TableGroupRow expanded />
```

#### TablePagination

Matches "Table / Pagination" in Figma.

- Import: `import { TablePagination } from "ds-poc";` (file `src/components/TablePagination/TablePagination.jsx`)
- Storybook stories: MultiplePages, SinglePage
- Tokens used: `--spacing-14` `--color-text-muted` `--spacing-md` `--color-surface` `--color-border` `--radius-md` `--color-text` `--color-primary` `--radius-sm` `--color-surface-muted`

| Prop | Default | Options |
| --- | --- | --- |
| `page` | `1` |  |
| `pageCount` | `2` |  |
| `pageSize` | `12` |  |
| `pageSizes` | `[12, 24, 48]` |  |
| `onPageChange` | — | function |
| `onPageSizeChange` | — | function |

Figma to code:

- State=Multiple pages/Single page -> derived from page and pageCount

```jsx
<TablePagination page={1} pageCount={1} />
```

#### TableToolbar

Matches "Table / Toolbar" in Figma.

- Import: `import { TableToolbar } from "ds-poc";` (file `src/components/TableToolbar/TableToolbar.jsx`)
- Built from: `Input`, `Button`
- Storybook stories: Default, ColumnFilter, CustomFilters, ColumnVisibility, Grouped
- Tokens used: `--spacing-sm` `--spacing-14` `--spacing-lg` `--color-surface-muted` `--color-border` `--color-text-muted` `--color-surface`

| Prop | Default | Options |
| --- | --- | --- |
| `search` | `""` |  |
| `onSearch` | — | function |
| `filterCount` | `0` |  |
| `groupBy` | — |  |
| `visibleColumns` | — |  |
| `totalColumns` | — |  |
| `onFilters` | — | function |
| `onCustomFilters` | — | function |
| `onGroupBy` | — | function |
| `onColumns` | — | function |
| `children` | — |  |

Figma to code:

- State=Default / Column filter / Custom filters -> filterCount (shows "Filters · n")
- State=Column visibility -> visibleColumns + totalColumns ("7 of 8 columns")
- State=Grouped -> groupBy ("Group by · Workspace")
- Uses the real Input and Button components.

```jsx
<TableToolbar filterCount={1} />
```

#### TableBulkSelectionBar

Matches "Table / Bulk selection bar" in Figma.

- Import: `import { TableBulkSelectionBar } from "ds-poc";` (file `src/components/TableBulkSelectionBar/TableBulkSelectionBar.jsx`)
- Built from: `TableCheckbox`, `Button`
- Storybook stories: Active, Disabled
- Tokens used: `--spacing-sm` `--color-primary` `--color-text-muted`

| Prop | Default | Options |
| --- | --- | --- |
| `count` | `3` |  |
| `noun` | `"accounts"` |  |
| `disabled` | `false` | `true` · `false` |
| `actions` | `["Assign owner", "Export selected"]` |  |
| `onAction` | — | function |
| `onClear` | — | function |

Figma to code:

- State=Active/Disabled -> disabled · the count and actions are props

```jsx
<TableBulkSelectionBar count={3} />
```

#### TableDropIndicator

Matches "Table / Drop indicator" in Figma.

- Import: `import { TableDropIndicator } from "ds-poc";` (file `src/components/TableDropIndicator/TableDropIndicator.jsx`)
- Storybook stories: RowActive, RowInactive, Column
- Tokens used: `--color-primary`

| Prop | Default | Options |
| --- | --- | --- |
| `axis` | `"row"` |  |
| `active` | `true` | `true` · `false` |
| `style` | — |  |

Figma to code:

- Axis=Row/Column -> axis · State=Active/Inactive -> active
- Place it absolutely where the dragged row or column will land.

```jsx
<TableDropIndicator />
```

#### TableDragPreview

Matches "Table / Drag preview" in Figma: the floating copy shown while dragging.

- Import: `import { TableDragPreview } from "ds-poc";` (file `src/components/TableDragPreview/TableDragPreview.jsx`)
- Storybook stories: Row, Column
- Tokens used: `--color-surface` `--color-primary` `--shadow-drag` `--color-primary-subtle`

| Prop | Default | Options |
| --- | --- | --- |
| `kind` | `"row"` |  |
| `width` | — |  |
| `children` | — |  |
| `style` | — |  |

Figma to code:

- Kind=Row/Column -> kind · children: the row (a <tr>) or the column's header + cells

```jsx
<TableDragPreview />
```

#### TableAdvancedFilterPanel

Matches "Table / Advanced filter panel" in Figma.

- Import: `import { TableAdvancedFilterPanel } from "ds-poc";` (file `src/components/TableAdvancedFilterPanel/TableAdvancedFilterPanel.jsx`)
- Built from: `TableFilterLogic`, `TableFilterRule`, `Button`
- Storybook stories: Default, Disabled
- Tokens used: `--spacing-ml` `--color-surface` `--color-border` `--color-text` `--color-text-muted` `--spacing-sm` `--spacing-2xs` `--spacing-ms` `--color-primary-subtle` `--radius-sm` `--color-primary-hover`

| Prop | Default | Options |
| --- | --- | --- |
| `rules` | `[]` |  |
| `match` | `"AND"` |  |
| `matchCount` | — |  |
| `summary` | — |  |
| `disabled` | `false` | `true` · `false` |
| `onMatchChange` | — | function |
| `onRuleChange` | — | function |
| `onRuleRemove` | — | function |
| `onAddRule` | — | function |
| `onApply` | — | function |
| `onClear` | — | function |
| `onClose` | — | function |

Figma to code:

- State=Default/Disabled -> disabled
- rules: [{ id, kind: "text"|"number", field, operator, value }]

```jsx
<TableAdvancedFilterPanel />
```

#### DataTable

Matches the "Data table" component set in Figma (10 states), built from the Table/* parts.

- Import: `import { DataTable } from "ds-poc";` (file `src/components/DataTable/DataTable.jsx`)
- Built from: `TableToolbar`, `TableFilterChip`, `TableColumnGroup`, `TableHeaderCell`, `TableCheckbox`, `TableSelectionCell`, `TableCell`, `TableRow`, `TableGroupRow`, `TablePagination`, `TableBulkSelectionBar`, `TableColumnMenu`, `TableMenuOption`, `TableAdvancedFilterPanel`, `Input`, `Button`
- Storybook stories: Default, Sorted, ColumnFilter, ColumnVisibility, CustomFilters, ColumnResize, MultiSelect, Grouped, RowDragging, ColumnDragging
- Tokens used: `--color-surface` `--color-text` `--color-border` `--radius-md` `--spacing-md` `--spacing-lg` `--spacing-ml` `--spacing-2xs` `--color-text-muted` `--radius-sm` `--color-surface-sunken` `--color-surface-muted` `--color-primary-subtle` `--spacing-xs` `--spacing-sm` `--color-primary` `--spacing-14` `--color-icon`

| Prop | Default | Options |
| --- | --- | --- |
| `title` | `"Accounts"` |  |
| `description` | `"Manage account access, ownership, and commercial details ac` |  |
| `breadcrumb` | `"Workspace / Accounts"` |  |
| `rows` | `SAMPLE_ROWS` |  |
| `columns` | `DEFAULT_COLUMNS` |  |
| `noun` | `"accounts"` |  |
| `initialSort` | `null` |  |
| `initialColumnFilters` | `{}` |  |
| `initialHidden` | `[]` |  |
| `initialRules` | `[]` |  |
| `initialMatch` | `"AND"` |  |
| `initialSelected` | `[]` |  |
| `initialGroupBy` | `null` |  |
| `initialPageSize` | `12` |  |

Figma to code:

- Figma state -> how to get it in code
- Default            -> no options
- Sorted             -> click a header's sort icon (or initialSort)
- Column filter      -> header filter icon or "Filters" (or initialColumnFilters)
- Column visibility  -> "Columns" (or initialHidden)
- Custom filters     -> "Custom filters" panel (or initialRules)
- Column resize      -> drag a header's right edge; double-click it for the width menu
- Multi-select       -> row checkboxes (or initialSelected)
- Grouped            -> "Group by" (or initialGroupBy)
- Row dragging       -> drag a row's handle (when not sorted or grouped)
- Column dragging    -> drag a header's handle within its group

```jsx
<DataTable />
```

Using DataTable with your own data:

- `rows`: an array of objects, each with a unique `id` plus one field per column `key`.
- `columns`: an array of objects. Fields: `key`, `title`, `width`, `group`, `kind`, `groupable`, `align`, `type`, `format`.
- Column `kind` options: `emphasis` · `text` · `status` · `muted` · `number`. `align`: `left` · `right`. `type: "number"` sorts and filters as numbers. `format` is a function (value) => text. `groupable: true` allows Group by. `group` puts the column under a column group header.

```jsx
const columns = [
  { key: "name", title: "Name", width: 240, group: "Person", kind: "emphasis" },
  { key: "team", title: "Team", width: 160, group: "Person", kind: "text", groupable: true },
  { key: "status", title: "Status", width: 110, group: "Person", kind: "status", groupable: true },
  { key: "hours", title: "Hours", width: 100, group: "Work", kind: "number", align: "right", type: "number" },
];
const rows = [
  { id: "p1", name: "Olivia Chen", team: "Design", status: "Active", hours: 32 },
  { id: "p2", name: "James Wilson", team: "Research", status: "Paused", hours: 12 },
];

<DataTable title="People" description="Who is on each team and their hours this week." breadcrumb="Workspace / People" noun="people" rows={rows} columns={columns} />
```

