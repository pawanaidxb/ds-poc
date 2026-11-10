import React, { useEffect, useMemo, useRef, useState } from "react";
import { TableToolbar } from "../TableToolbar/TableToolbar";
import { TableFilterChip } from "../TableFilterChip/TableFilterChip";
import { TableColumnGroup } from "../TableColumnGroup/TableColumnGroup";
import { TableHeaderCell } from "../TableHeaderCell/TableHeaderCell";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import { TableSelectionCell } from "../TableSelectionCell/TableSelectionCell";
import { TableCell } from "../TableCell/TableCell";
import { TableRow } from "../TableRow/TableRow";
import { TableGroupRow } from "../TableGroupRow/TableGroupRow";
import { TablePagination } from "../TablePagination/TablePagination";
import { TableBulkSelectionBar } from "../TableBulkSelectionBar/TableBulkSelectionBar";
import { TableColumnMenu } from "../TableColumnMenu/TableColumnMenu";
import { TableMenuOption } from "../TableMenuOption/TableMenuOption";
import { TableAdvancedFilterPanel } from "../TableAdvancedFilterPanel/TableAdvancedFilterPanel";
import { TableColumnConfigPanel } from "../TableColumnConfigPanel/TableColumnConfigPanel";
import { Dropdown } from "../Dropdown/Dropdown";
import { XIcon } from "../TableIcons/TableIcons";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { SAMPLE_ROWS, DEFAULT_COLUMNS, money } from "./sampleData";
import "./DataTable.css";

/**
 * DataTable — matches the "Data table" component set in Figma (15 states), built from the Table/* parts.
 * Figma state -> how to get it in code
 *   Default            -> no options
 *   Sorted             -> click a header's sort icon (or initialSort)
 *   Column filter      -> header filter icon or "Filters" (or initialColumnFilters)
 *   Column visibility  -> "Configure columns", untick a column (or initialHidden)
 *   Columns reordered  -> "Configure columns", drag columns, Apply (or initialOrder)
 *   Hidden columns shown -> tick them in "Configure columns" and Apply
 *   Hidden columns shown - default order -> the eye button: shows hidden columns for now, saved setup unchanged (or initialPeek)
 *   Group by dropdown  -> the "Group by" dropdown in the toolbar (or initialGroupBy)
 *   Column groups configuration -> "Configure columns" > Groups (or initialConfigView="groups")
 *   Column filter / Custom filters -> "Filters" opens the side panel: General filters / Custom filters tabs
 *   Custom filters     -> "Custom filters" panel (or initialRules)
 *   Column resize      -> drag a header's right edge; double-click it for the width menu
 *   Multi-select       -> row checkboxes (or initialSelected)
 *   Grouped            -> "Group by" (or initialGroupBy)
 *   Row dragging       -> drag a row's handle (when not sorted or grouped)
 *   Column dragging    -> drag a header's handle within its group
 */
export function DataTable({
  title = "Accounts",
  description = "Manage account access, ownership, and commercial details across your workspaces.",
  breadcrumb = "Workspace / Accounts",
  rows: initialRows = SAMPLE_ROWS,
  columns: initialColumns = DEFAULT_COLUMNS,
  noun = "accounts",
  initialSort = null,
  initialColumnFilters = {},
  initialHidden = [],
  initialOrder = null,
  initialConfigOpen = false,
  initialConfigView = "columns",
  initialPeek = false,
  initialFiltersOpen = false,
  initialGroupByOpen = false,
  initialRules = [],
  initialMatch = "AND",
  initialSelected = [],
  initialGroupBy = null,
  initialPageSize = 12,
}) {
  const colByKey = useMemo(() => Object.fromEntries(initialColumns.map((c) => [c.key, c])), [initialColumns]);
  const defaultOrder = initialColumns.map((c) => c.key);
  const [order, setOrder] = useState(initialOrder || defaultOrder);
  const [widths, setWidths] = useState(Object.fromEntries(initialColumns.map((c) => [c.key, c.width])));
  const [hidden, setHidden] = useState(new Set(initialHidden));
  const defaultGroupOf = Object.fromEntries(initialColumns.map((c) => [c.key, c.group || null]));
  const [groupOf, setGroupOf] = useState(defaultGroupOf);
  const [peek, setPeek] = useState(initialPeek);
  const [rowOrder, setRowOrder] = useState(initialRows.map((r) => r.id));
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(initialSort); // { key, dir }
  const [colFilters, setColFilters] = useState(initialColumnFilters); // { key: [values] }
  const [rules, setRules] = useState(initialRules);
  const [match, setMatch] = useState(initialMatch);
  const [draftRules, setDraftRules] = useState(initialRules);
  const [draftMatch, setDraftMatch] = useState(initialMatch);
  const [selected, setSelected] = useState(new Set(initialSelected));
  const [groupBy, setGroupBy] = useState(initialGroupBy);
  const [collapsed, setCollapsed] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [menu, setMenu] = useState(null); // { type: "filter"|"columns"|"width", key, left }
  const [draftFilter, setDraftFilter] = useState([]);
  const [panelOpen, setPanelOpen] = useState(initialFiltersOpen || initialRules.length > 0);
  const [filterTab, setFilterTab] = useState(initialRules.length > 0 ? "custom" : "general");
  const [checkKey, setCheckKey] = useState("role");
  const [draftCol, setDraftCol] = useState(initialColumnFilters);
  const [valueQuery, setValueQuery] = useState("");
  const [resizing, setResizing] = useState(null);
  const [dragRow, setDragRow] = useState(null);
  const [overRow, setOverRow] = useState(null);
  const [dragCol, setDragCol] = useState(null);
  const [configOpen, setConfigOpen] = useState(initialConfigOpen);
  const [configView, setConfigView] = useState(initialConfigView);
  const [draftOrder, setDraftOrder] = useState(initialOrder || defaultOrder);
  const [draftHidden, setDraftHidden] = useState(new Set(initialHidden));
  const [columnNote, setColumnNote] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const headerRefs = useRef({});
  const configRef = useRef(null);
  const [configHeight, setConfigHeight] = useState(0);
  const gridRef = useRef(null);

  const byId = useMemo(() => Object.fromEntries(initialRows.map((r) => [r.id, r])), [initialRows]);
  const visibleCols = order.filter((k) => peek || !hidden.has(k)).map((k) => colByKey[k]);
  const configuredCount = order.filter((k) => !hidden.has(k)).length;
  const show = (col, row) => (col.format ? col.format(row[col.key]) : row[col.key]);

  // ---------- filtering ----------
  const ruleMatches = (row, r) => {
    const col = initialColumns.find((c) => c.title === r.field) || {};
    const raw = row[col.key];
    if (r.value === "" || raw == null) return true;
    if (col.type === "number") {
      const v = Number(r.value), x = Number(raw);
      if (r.operator === "is greater than or equal to") return x >= v;
      if (r.operator === "is less than or equal to") return x <= v;
      return x === v;
    }
    const a = String(raw).toLowerCase(), b = String(r.value).toLowerCase();
    if (r.operator === "is not") return a !== b;
    if (r.operator === "contains") return a.includes(b);
    if (r.operator === "does not contain") return !a.includes(b);
    return a === b;
  };
  const applyFilters = (list, ruleList, m) => list.filter((row) => {
    if (search) {
      const q = search.toLowerCase();
      if (![row.account, row.owner, row.workspace].some((v) => String(v).toLowerCase().includes(q))) return false;
    }
    for (const [k, vals] of Object.entries(colFilters)) if (vals && vals.length && !vals.includes(String(row[k]))) return false;
    const active = ruleList.filter((r) => r.value !== "");
    if (active.length) {
      const res = active.map((r) => ruleMatches(row, r));
      if (m === "AND" ? !res.every(Boolean) : !res.some(Boolean)) return false;
    }
    return true;
  });

  const ordered = rowOrder.map((id) => byId[id]).filter(Boolean);
  const filtered = applyFilters(ordered, rules, match);
  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        const c = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
        return sort.dir === "asc" ? c : -c;
      })
    : filtered;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const firstShown = sorted.length ? (safePage - 1) * pageSize + 1 : 0;

  const activeFilterCount = Object.values(colFilters).filter((v) => v && v.length).length + rules.filter((r) => r.value !== "").length;
  const chips = [
    ...Object.entries(colFilters).filter(([, v]) => v && v.length).map(([k, v]) => ({ id: "c-" + k, label: `${colByKey[k].title} is ${v.join(" or ")}`, remove: () => { const n = { ...colFilters }; delete n[k]; setColFilters(n); } })),
    ...rules.filter((r) => r.value !== "").map((r) => ({ id: "r-" + r.id, label: `${r.field} ${r.operator === "is greater than or equal to" ? "≥" : r.operator === "is less than or equal to" ? "≤" : r.operator} ${r.value}`, remove: () => { const n = rules.filter((x) => x.id !== r.id); setRules(n); setDraftRules(n); } })),
  ];

  // ---------- selection ----------
  const pageIds = pageRows.map((r) => r.id);
  const pageSelected = pageIds.filter((id) => selected.has(id)).length;
  const toggleAll = () => {
    const n = new Set(selected);
    if (pageSelected === pageIds.length) pageIds.forEach((id) => n.delete(id)); else pageIds.forEach((id) => n.add(id));
    setSelected(n);
  };
  const toggleRow = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };

  // ---------- sort ----------
  const cycleSort = (key) => {
    if (!sort || sort.key !== key) setSort({ key, dir: "asc" });
    else if (sort.dir === "asc") setSort({ key, dir: "desc" });
    else setSort(null);
  };

  // ---------- menus ----------
  const openFilters = (tab, key) => {
    setDraftCol(colFilters); setDraftRules(rules); setDraftMatch(match); setValueQuery("");
    if (key) setCheckKey(key);
    setFilterTab(tab); setConfigOpen(false); setPanelOpen(true);
  };
  const openFilter = (key) => {
    const th = headerRefs.current[key];
    setDraftFilter(colFilters[key] || []);
    setMenu({ type: "filter", key, left: th ? th.offsetLeft : 0 });
  };
  const openWidth = (key) => { const th = headerRefs.current[key]; setMenu({ type: "width", key, left: th ? th.offsetLeft : 0 }); };
  const valuesFor = (key) => {
    const counts = {};
    ordered.forEach((r) => { const v = String(r[key]); counts[v] = (counts[v] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  };

  // ---------- resize ----------
  const startResize = (key) => (e) => {
    e.preventDefault();
    const startX = e.clientX, startW = widths[key];
    setResizing(key);
    const move = (ev) => setWidths((w) => ({ ...w, [key]: Math.max(80, Math.round(startW + ev.clientX - startX)) }));
    const up = () => { setResizing(null); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // ---------- drag rows / columns ----------
  const rowDragOn = !sort && !groupBy;
  const dropRow = (targetId) => {
    if (!dragRow || dragRow === targetId) return;
    const n = rowOrder.filter((id) => id !== dragRow);
    n.splice(n.indexOf(targetId), 0, dragRow);
    setRowOrder(n);
  };
  const dropCol = (targetKey) => {
    if (!dragCol || dragCol === targetKey || groupOf[dragCol] !== groupOf[targetKey]) return;
    const n = order.filter((k) => k !== dragCol);
    n.splice(n.indexOf(targetKey), 0, dragCol);
    setOrder(n);
  };

  // The configure panel floats over the table; make room when it is taller (Figma "Column groups configuration").
  useEffect(() => {
    if (!configOpen || !configRef.current || typeof ResizeObserver === "undefined") { setConfigHeight(0); return undefined; }
    const ro = new ResizeObserver(([e]) => setConfigHeight(e.target.offsetHeight));
    ro.observe(configRef.current);
    return () => ro.disconnect();
  }, [configOpen]);

  // ---------- configure columns ----------
  const sameOrder = (a, b) => a.length === b.length && a.every((k, i) => k === b[i]);
  const describeColumns = (prevOrder, prevHidden, nextOrder, nextHidden) => {
    const parts = [];
    const moved = nextOrder.find((k, i) => prevOrder.indexOf(k) !== i && prevOrder.indexOf(k) - i !== -1 && prevOrder.indexOf(k) - i !== 1)
      || nextOrder.find((k, i) => prevOrder.indexOf(k) > i);
    if (moved && !sameOrder(prevOrder, nextOrder)) parts.push(`${colByKey[moved].title} moved to position ${nextOrder.indexOf(moved) + 1}`);
    const nowHidden = nextOrder.filter((k) => nextHidden.has(k) && !prevHidden.has(k)).map((k) => colByKey[k].title);
    const restored = nextOrder.filter((k) => !nextHidden.has(k) && prevHidden.has(k)).map((k) => colByKey[k].title);
    if (nextHidden.size === 0 && restored.length) parts.unshift(`All ${nextOrder.length} columns visible`);
    if (restored.length) parts.push(`${restored.join(", ")} restored`);
    if (nowHidden.length) parts.push(`${nowHidden.join(", ")} hidden`);
    return parts.join(" · ") || null;
  };
  const applyColumns = (nextOrder, nextHidden, groupsChanged = false) => {
    const note = describeColumns(groupsChanged ? nextOrder : order, hidden, nextOrder, nextHidden);
    setColumnNote(groupsChanged ? ["Column groups updated", note].filter(Boolean).join(" · ") : note);
    setOrder(nextOrder);
    setHidden(nextHidden);
  };
  const groupsFrom = (ord, gOf) => {
    const list = [];
    ord.forEach((k) => {
      const name = gOf[k];
      if (!name) return;
      let g = list.find((x) => x.name === name);
      if (!g) { g = { id: `g-${name}`, name, keys: [] }; list.push(g); }
      g.keys.push(k);
    });
    return list;
  };
  const [draftGroups, setDraftGroups] = useState(() => groupsFrom(initialOrder || defaultOrder, defaultGroupOf));
  const openConfig = () => {
    setDraftOrder(order); setDraftHidden(new Set(hidden)); setDraftGroups(groupsFrom(order, groupOf));
    setMenu(null); setPanelOpen(false); setConfigOpen(!configOpen);
  };
  const applyConfig = () => {
    const groups = draftGroups.filter((g) => g.keys.length && (g.name || "").trim());
    const nextGroupOf = Object.fromEntries(order.map((k) => [k, null]));
    groups.forEach((g) => g.keys.forEach((k) => { nextGroupOf[k] = g.name.trim(); }));
    const grouped = new Set(groups.flatMap((g) => g.keys));
    const nextOrder = configView === "groups"
      ? [...groups.flatMap((g) => g.keys), ...draftOrder.filter((k) => !grouped.has(k))]
      : draftOrder;
    setGroupOf(nextGroupOf);
    setDraftGroups(groupsFrom(nextOrder, nextGroupOf));
    setPeek(false);
    const changed = order.some((k) => (groupOf[k] || null) !== (nextGroupOf[k] || null));
    applyColumns(nextOrder, new Set(draftHidden), changed);
  };
  const moveDraft = (fromKey, toKey) => {
    const n = draftOrder.filter((k) => k !== fromKey);
    const to = draftOrder.indexOf(toKey) > draftOrder.indexOf(fromKey) ? n.indexOf(toKey) + 1 : n.indexOf(toKey);
    n.splice(to, 0, fromKey);
    setDraftOrder(n);
  };
  const draftNote = (() => {
    const hiddenTitles = draftOrder.filter((k) => draftHidden.has(k)).map((k) => colByKey[k].title);
    if (sameOrder(draftOrder, defaultOrder)) return null;
    if (draftOrder[0] !== defaultOrder[0]) {
      const first = `${colByKey[draftOrder[0]].title} is now first.`;
      return hiddenTitles.length ? `${first} ${hiddenTitles.join(", ")} ${hiddenTitles.length > 1 ? "remain" : "remains"} hidden.` : first;
    }
    return null;
  })();

  // ---------- groups ----------
  const groupsInOrder = [];
  visibleCols.forEach((c) => {
    const last = groupsInOrder[groupsInOrder.length - 1];
    const name = groupOf[c.key] || "";
    if (last && last.name === name) last.span++; else groupsInOrder.push({ name, span: 1 });
  });
  const grouped = groupBy
    ? Object.entries(pageRows.reduce((acc, r) => ((acc[r[groupBy]] = acc[r[groupBy]] || []).push(r), acc), {}))
    : [[null, pageRows]];
  const sum = (list, k) => list.reduce((s, r) => s + (Number(r[k]) || 0), 0);
  const colCount = visibleCols.length + 1;

  const renderRow = (row) => {
    const isSel = selected.has(row.id);
    return (
      <TableRow key={row.id} selected={isSel} dragging={dragRow === row.id} dropTarget={overRow === row.id && dragRow && dragRow !== row.id}
        onDragOver={(e) => { if (dragRow) { e.preventDefault(); setOverRow(row.id); } }}
        onDrop={(e) => { e.preventDefault(); dropRow(row.id); setDragRow(null); setOverRow(null); }}>
        <TableSelectionCell checked={isSel} label={`Select ${row.account}`} onChange={() => toggleRow(row.id)} showDragHandle
          dragHandleProps={{ draggable: rowDragOn, disabled: !rowDragOn, label: `Drag ${row.account}`, dragging: dragRow === row.id,
            onDragStart: (e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", row.id); setDragRow(row.id); },
            onDragEnd: () => { setDragRow(null); setOverRow(null); } }} />
        {visibleCols.map((c) => <TableCell key={c.key} kind={c.kind} selected={isSel} dragging={dragCol === c.key}>{show(c, row)}</TableCell>)}
      </TableRow>
    );
  };

  const rulesForPanel = draftRules.map((r) => ({ ...r, kind: (initialColumns.find((c) => c.title === r.field) || {}).type === "number" ? "number" : "text" }));
  const previewCount = applyFilters(ordered, draftRules, draftMatch).length;

  return (
    <section className="poc-dt" aria-label={title}>
      <header className="poc-dt__heading">
        <div>
          <h2 className="poc-dt__title">{title}</h2>
          <p className="poc-dt__desc">{description}</p>
        </div>
        <span className="poc-dt__crumb">{breadcrumb} · {initialRows.length} {noun}</span>
      </header>

      <TableToolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} filterCount={activeFilterCount} filtersOpen={panelOpen}
        visibleColumns={configuredCount} totalColumns={order.length} peek={peek}
        onTogglePeek={() => setPeek(!peek)}
        groupBy={groupBy} onGroupByChange={(v) => { setGroupBy(v); setCollapsed(new Set()); }}
        configureOpen={configOpen} onConfigureColumns={openConfig} defaultGroupByOpen={initialGroupByOpen}
        onFilters={() => { if (panelOpen) setPanelOpen(false); else openFilters(filterTab); }} />

      <div className="poc-dt__context">
        {selected.size > 0 ? (
          <TableBulkSelectionBar count={selected.size} noun={noun} onClear={() => setSelected(new Set())} />
        ) : (
          chips.length ? (
            <span className="poc-dt__chips">
              {chips.map((c) => <TableFilterChip key={c.id} onRemove={c.remove}>{c.label}</TableFilterChip>)}
              <span className="poc-dt__view">{rules.some((r) => r.value !== "") ? (match === "AND" ? "Match all conditions" : "Match any condition") : `${sorted.length} of ${initialRows.length} ${noun}`}</span>
            </span>
          ) : peek ? (
            <span className="poc-dt__view poc-dt__view--columns" role="status">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6h12M6 6v7.5" /></svg>
              Temporarily showing hidden columns · Saved configuration unchanged
            </span>
          ) : columnNote ? (
            <span className="poc-dt__view poc-dt__view--columns" role="status">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6h12M6 6v7.5" /></svg>
              {columnNote}
            </span>
          ) : (
            <span className="poc-dt__view poc-dt__view--columns">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 6h12M6 6v7.5" /></svg>
              All {noun} <span aria-hidden="true">/</span> No filters applied
            </span>
          )
        )}
        <span className="poc-dt__pinned">Headers pinned</span>
      </div>

      <div className="poc-dt__body">
        <div className="poc-dt__grid" ref={gridRef} style={configHeight ? { minHeight: configHeight - 50 } : undefined}>
          <div className="poc-dt__scroll">
            <table className="poc-dt__table" style={{ width: 44 + visibleCols.reduce((s, c) => s + widths[c.key], 0) }}>
              <colgroup>
                <col style={{ width: 44 }} />
                {visibleCols.map((c) => <col key={c.key} style={{ width: widths[c.key] }} />)}
              </colgroup>
              <thead>
                <tr className="poc-dt__groups">
                  <th className="poc-dt__groupspacer" aria-hidden="true" />
                  {groupsInOrder.map((g, i) => <TableColumnGroup key={g.name + i} title={g.name} colSpan={g.span} dragging={dragCol && (groupOf[dragCol] || "") === g.name} />)}
                </tr>
                <tr className="poc-dt__headers">
                  <th className="poc-dt__selectall" scope="col">
                    <span className="poc-dt__selectall-inner">
                      <TableCheckbox checked={pageIds.length > 0 && pageSelected === pageIds.length} indeterminate={pageSelected > 0 && pageSelected < pageIds.length}
                        label="Select all rows on this page" onChange={toggleAll} />
                    </span>
                  </th>
                  {visibleCols.map((c) => (
                    <TableHeaderCell key={c.key} ref={(el) => { headerRefs.current[c.key] = el; }} title={c.title} align={c.align || "left"}
                      sort={sort && sort.key === c.key ? sort.dir : "none"} onSort={() => cycleSort(c.key)}
                      filtered={!!(colFilters[c.key] && colFilters[c.key].length) || rules.some((r) => r.value !== "" && r.field === c.title)}
                      onFilter={() => openFilters("general", c.key)}
                      resizing={resizing === c.key} onResizeStart={startResize(c.key)}
                      dragging={dragCol === c.key} dropTarget={overCol === c.key && dragCol && dragCol !== c.key && groupOf[dragCol] === groupOf[c.key]}
                      dragHandleProps={{ draggable: true, label: `Drag ${c.title} column`,
                        onDragStart: (e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.key); setDragCol(c.key); },
                        onDragEnd: () => { setDragCol(null); setOverCol(null); } }}
                      onDragOver={(e) => { if (dragCol) { e.preventDefault(); setOverCol(c.key); } }}
                      onDrop={(e) => { e.preventDefault(); dropCol(c.key); setDragCol(null); setOverCol(null); }}
                      onDoubleClick={(e) => { if (e.target.classList.contains("poc-thead__resizer")) openWidth(c.key); }}
                      data-col={c.key} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr><td colSpan={colCount} className="poc-dt__empty">No {noun} match these filters. <button type="button" onClick={() => { setColFilters({}); setRules([]); setDraftRules([]); setSearch(""); }}>Clear filters</button></td></tr>
                )}
                {grouped.map(([name, list]) => (
                  <React.Fragment key={name || "all"}>
                    {groupBy && (
                      <TableGroupRow colSpan={colCount} group={name} count={`${list.length} ${noun}`} seatsTotal={`${sum(list, "seats")} seats`} arrTotal={`${money(sum(list, "arr"))} ARR`}
                        expanded={!collapsed.has(name)} onToggle={() => { const n = new Set(collapsed); n.has(name) ? n.delete(name) : n.add(name); setCollapsed(n); }} />
                    )}
                    {(!groupBy || !collapsed.has(name)) && list.map(renderRow)}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={colCount} className="poc-dt__totals">
                    <span className="poc-dt__totals-label">{activeFilterCount ? "Filtered total" : "Page total"} · {pageRows.length} {noun}</span>
                    <span className="poc-dt__totals-nums"><span>{sum(pageRows, "seats")} seats</span><strong>{money(sum(pageRows, "arr"))} ARR</strong></span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {menu && menu.type === "width" && (
            <div className="poc-dt__popover" style={{ left: menu.left }}>
              <TableColumnMenu title={`${colByKey[menu.key].title} column`} note={`Width · ${widths[menu.key]} px`} onClose={() => setMenu(null)}
                footer={<span>Drag the header edge to resize.</span>}>
                <Input size="small" width="100%" showLabel={false} showHelper={false} label="Column width in pixels" type="number"
                  value={widths[menu.key]} onChange={(e) => setWidths({ ...widths, [menu.key]: Math.max(80, Number(e.target.value) || 80) })} />
                <TableMenuOption kind="action" label="Increase width" detail="+ 24 px" onSelect={() => setWidths({ ...widths, [menu.key]: widths[menu.key] + 24 })} />
                <TableMenuOption kind="action" label="Decrease width" detail="− 24 px" onSelect={() => setWidths({ ...widths, [menu.key]: Math.max(80, widths[menu.key] - 24) })} />
                <TableMenuOption kind="action" label="Auto-fit to content" showDetail={false} onSelect={() => setWidths({ ...widths, [menu.key]: colByKey[menu.key].width })} />
              </TableColumnMenu>
            </div>
          )}
          {configOpen && (
            <div className="poc-dt__config" ref={configRef}>
              <TableColumnConfigPanel
                columns={draftOrder.map((k) => ({ key: k, title: colByKey[k].title, visible: !draftHidden.has(k) }))}
                defaultOrder={sameOrder(draftOrder, defaultOrder)}
                note={draftHidden.size ? draftNote : null}
                view={configView} onViewChange={setConfigView}
                groups={draftGroups} onGroupsChange={setDraftGroups}
                onToggle={(k) => { const n = new Set(draftHidden); n.has(k) ? n.delete(k) : n.add(k); setDraftHidden(n); }}
                onMove={moveDraft}
                onReset={() => { setDraftOrder(defaultOrder); setDraftGroups(groupsFrom(defaultOrder, defaultGroupOf)); }}
                onApply={applyConfig}
                onClose={() => setConfigOpen(false)} />
            </div>
          )}
        </div>

        {panelOpen && (
          <aside className="poc-dt__filters" aria-label="Filters">
            <div className="poc-dt__filters-head">
              <h3 className="poc-dt__filters-title">Filters</h3>
              <button type="button" className="poc-dt__filters-x" onClick={() => setPanelOpen(false)} aria-label="Close filters"><XIcon size={14} /></button>
            </div>
            <div className="poc-dt__filters-tabs" role="tablist" aria-label="Filter type">
              <Button role="tab" aria-selected={filterTab === "general"} variant={filterTab === "general" ? "primary" : "secondary"} onClick={() => setFilterTab("general")}>General filters</Button>
              <Button role="tab" aria-selected={filterTab === "custom"} variant={filterTab === "custom" ? "primary" : "secondary"} onClick={() => setFilterTab("custom")}>Custom filters</Button>
            </div>
            {filterTab === "general" ? (
              <div className="poc-dt__general">
                {["status", "workspace"].filter((k) => colByKey[k] && k !== checkKey).map((k) => (
                  <Dropdown key={k} label={colByKey[k].title} showHelper={false} width="100%" noun={colByKey[k].title.toLowerCase()}
                    placeholder={k === "status" ? "All statuses" : "All workspaces"} searchPlaceholder={`Search ${colByKey[k].title.toLowerCase()}…`}
                    options={[{ value: "__all", label: k === "status" ? "All statuses" : "All workspaces" }, ...valuesFor(k).map(([v]) => ({ value: v, label: v }))]}
                    value={(draftCol[k] && draftCol[k][0]) || "__all"}
                    onChange={(v) => { const n = { ...draftCol }; if (!v || v === "__all") delete n[k]; else n[k] = [v]; setDraftCol(n); }} />
                ))}
                {(() => {
                  const vals = valuesFor(checkKey).filter(([v]) => !valueQuery || v.toLowerCase().includes(valueQuery.toLowerCase()));
                  const chosen = draftCol[checkKey] || [];
                  const all = vals.length > 0 && vals.every(([v]) => chosen.includes(v));
                  const col = colByKey[checkKey];
                  const label = (v) => (col.format ? col.format(col.type === "number" ? Number(v) : v) : v);
                  return (
                    <div className="poc-dt__checklist" role="group" aria-label={col.title}>
                      <span className="poc-dt__filters-label">{col.title}</span>
                      <Input size="small" width="100%" showLabel={false} showHelper={false} label={`Search ${col.title.toLowerCase()} values`} placeholder="Search values…"
                        value={valueQuery} onChange={(e) => setValueQuery(e.target.value)} />
                      <TableMenuOption label="Select all" detail={String(ordered.length)} selected={all}
                        onSelect={() => setDraftCol({ ...draftCol, [checkKey]: all ? [] : vals.map(([v]) => v) })} />
                      {vals.map(([v, n]) => (
                        <TableMenuOption key={v} label={label(v)} detail={String(n)} selected={chosen.includes(v)}
                          onSelect={() => setDraftCol({ ...draftCol, [checkKey]: chosen.includes(v) ? chosen.filter((x) => x !== v) : [...chosen, v] })} />
                      ))}
                    </div>
                  );
                })()}
                <hr className="poc-dt__filters-divider" />
                <div className="poc-dt__filters-actions">
                  <Button variant="secondary" onClick={() => setDraftCol({})}>Reset</Button>
                  <Button variant="primary" onClick={() => { const n = Object.fromEntries(Object.entries(draftCol).filter(([, v]) => v && v.length)); setColFilters(n); setPage(1); }}>Apply</Button>
                </div>
              </div>
            ) : (
              <TableAdvancedFilterPanel showHeader={false} rules={rulesForPanel} match={draftMatch} onMatchChange={setDraftMatch} matchCount={previewCount}
                summary={draftRules.filter((r) => r.value !== "").map((r) => `${r.field} ${r.operator} ${r.value}`).join(` ${draftMatch} `) || "No conditions yet"}
                onRuleChange={(id, next) => setDraftRules(draftRules.map((r) => (r.id === id ? { ...r, ...next } : r)))}
                onRuleRemove={(id) => setDraftRules(draftRules.filter((r) => r.id !== id))}
                onAddRule={() => setDraftRules([...draftRules, { id: Date.now(), field: "Status", operator: "is", value: "" }])}
                onApply={() => { setRules(draftRules); setMatch(draftMatch); setPage(1); }}
                onClear={() => { setDraftRules([]); setRules([]); }} />
            )}
          </aside>
        )}
      </div>

      <footer className="poc-dt__footer">
        <span className="poc-dt__showing">Showing {firstShown}–{firstShown ? firstShown + pageRows.length - 1 : 0} of {sorted.length} {noun}{sorted.length < initialRows.length ? ` · filtered from ${initialRows.length}` : ""}</span>
        <TablePagination page={safePage} pageCount={pageCount} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      </footer>
    </section>
  );
}

export default DataTable;
