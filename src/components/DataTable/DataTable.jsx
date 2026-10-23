import React, { useMemo, useRef, useState } from "react";
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
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { SAMPLE_ROWS, DEFAULT_COLUMNS, money } from "./sampleData";
import "./DataTable.css";

/**
 * DataTable — matches the "Data table" component set in Figma (10 states), built from the Table/* parts.
 * Figma state -> how to get it in code
 *   Default            -> no options
 *   Sorted             -> click a header's sort icon (or initialSort)
 *   Column filter      -> header filter icon or "Filters" (or initialColumnFilters)
 *   Column visibility  -> "Columns" (or initialHidden)
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
  initialRules = [],
  initialMatch = "AND",
  initialSelected = [],
  initialGroupBy = null,
  initialPageSize = 12,
}) {
  const colByKey = useMemo(() => Object.fromEntries(initialColumns.map((c) => [c.key, c])), [initialColumns]);
  const [order, setOrder] = useState(initialColumns.map((c) => c.key));
  const [widths, setWidths] = useState(Object.fromEntries(initialColumns.map((c) => [c.key, c.width])));
  const [hidden, setHidden] = useState(new Set(initialHidden));
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
  const [panelOpen, setPanelOpen] = useState(initialRules.length > 0);
  const [resizing, setResizing] = useState(null);
  const [dragRow, setDragRow] = useState(null);
  const [overRow, setOverRow] = useState(null);
  const [dragCol, setDragCol] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const headerRefs = useRef({});
  const gridRef = useRef(null);

  const byId = useMemo(() => Object.fromEntries(initialRows.map((r) => [r.id, r])), [initialRows]);
  const visibleCols = order.filter((k) => !hidden.has(k)).map((k) => colByKey[k]);
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
    if (!dragCol || dragCol === targetKey || colByKey[dragCol].group !== colByKey[targetKey].group) return;
    const n = order.filter((k) => k !== dragCol);
    n.splice(n.indexOf(targetKey), 0, dragCol);
    setOrder(n);
  };

  // ---------- groups ----------
  const groupsInOrder = [];
  visibleCols.forEach((c) => {
    const last = groupsInOrder[groupsInOrder.length - 1];
    if (last && last.name === c.group) last.span++; else groupsInOrder.push({ name: c.group, span: 1 });
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

      <TableToolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} filterCount={activeFilterCount}
        groupBy={groupBy ? colByKey[groupBy].title : null} visibleColumns={visibleCols.length} totalColumns={order.length}
        onFilters={() => (menu && menu.type === "filter" ? setMenu(null) : openFilter("status"))}
        onCustomFilters={() => { setDraftRules(rules); setDraftMatch(match); setPanelOpen(!panelOpen); }}
        onGroupBy={() => { const opts = [null, "workspace", "owner", "status"]; setGroupBy(opts[(opts.indexOf(groupBy) + 1) % opts.length]); setCollapsed(new Set()); }}
        onColumns={() => setMenu(menu && menu.type === "columns" ? null : { type: "columns" })}>
        {chips.map((c) => <TableFilterChip key={c.id} onRemove={c.remove}>{c.label}</TableFilterChip>)}
      </TableToolbar>

      <div className="poc-dt__context">
        {selected.size > 0 ? (
          <TableBulkSelectionBar count={selected.size} noun={noun} onClear={() => setSelected(new Set())} />
        ) : (
          <span className="poc-dt__view">All {noun} <span aria-hidden="true">/</span> {activeFilterCount ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied` : "No filters applied"}</span>
        )}
        <span className="poc-dt__pinned">Headers pinned</span>
      </div>

      <div className="poc-dt__body">
        <div className="poc-dt__grid" ref={gridRef}>
          <div className="poc-dt__scroll">
            <table className="poc-dt__table" style={{ width: 44 + visibleCols.reduce((s, c) => s + widths[c.key], 0) }}>
              <colgroup>
                <col style={{ width: 44 }} />
                {visibleCols.map((c) => <col key={c.key} style={{ width: widths[c.key] }} />)}
              </colgroup>
              <thead>
                <tr className="poc-dt__groups">
                  <th className="poc-dt__groupspacer" aria-hidden="true" />
                  {groupsInOrder.map((g, i) => <TableColumnGroup key={g.name + i} title={g.name} colSpan={g.span} dragging={dragCol && colByKey[dragCol].group === g.name} />)}
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
                      onFilter={() => (menu && menu.key === c.key && menu.type === "filter" ? setMenu(null) : openFilter(c.key))}
                      resizing={resizing === c.key} onResizeStart={startResize(c.key)}
                      dragging={dragCol === c.key} dropTarget={overCol === c.key && dragCol && dragCol !== c.key && colByKey[dragCol].group === c.group}
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
                    <span className="poc-dt__totals-label">Page total · {pageRows.length} {noun}</span>
                    <span className="poc-dt__totals-nums"><span>{sum(pageRows, "seats")} seats</span><strong>{money(sum(pageRows, "arr"))} ARR</strong></span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {menu && menu.type === "filter" && (
            <div className="poc-dt__popover" style={{ left: Math.min(menu.left, 9999) }}>
              <TableColumnMenu title={`Filter by ${colByKey[menu.key].title.toLowerCase()}`} onClose={() => setMenu(null)}
                footer={<>
                  <Button variant="secondary" onClick={() => setDraftFilter([])}>Reset</Button>
                  <Button variant="primary" onClick={() => { setColFilters({ ...colFilters, [menu.key]: draftFilter }); setPage(1); setMenu(null); }}>Apply</Button>
                </>}>
                {(() => {
                  const vals = valuesFor(menu.key);
                  const all = draftFilter.length === vals.length;
                  return (
                    <>
                      <TableMenuOption label="Select all" detail={String(ordered.length)} selected={all} onSelect={() => setDraftFilter(all ? [] : vals.map(([v]) => v))} />
                      {vals.map(([v, n]) => (
                        <TableMenuOption key={v} label={colByKey[menu.key].format ? colByKey[menu.key].format(colByKey[menu.key].type === "number" ? Number(v) : v) : v} detail={String(n)}
                          selected={draftFilter.includes(v)} onSelect={() => setDraftFilter(draftFilter.includes(v) ? draftFilter.filter((x) => x !== v) : [...draftFilter, v])} />
                      ))}
                    </>
                  );
                })()}
              </TableColumnMenu>
            </div>
          )}

          {menu && menu.type === "columns" && (
            <div className="poc-dt__popover poc-dt__popover--right">
              <TableColumnMenu title="Show columns" note={`${visibleCols.length} of ${order.length} data columns shown`} onClose={() => setMenu(null)}
                footer={<Button variant="secondary" onClick={() => setHidden(new Set())}>Restore defaults</Button>}>
                {order.map((k) => (
                  <TableMenuOption key={k} label={colByKey[k].title} showDetail={false} selected={!hidden.has(k)} disabled={k === "account"}
                    onSelect={() => { const n = new Set(hidden); n.has(k) ? n.delete(k) : n.add(k); setHidden(n); }} />
                ))}
              </TableColumnMenu>
            </div>
          )}

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
        </div>

        {panelOpen && (
          <TableAdvancedFilterPanel rules={rulesForPanel} match={draftMatch} onMatchChange={setDraftMatch} matchCount={previewCount}
            summary={draftRules.filter((r) => r.value !== "").map((r) => `${r.field} ${r.operator} ${r.value}`).join(` ${draftMatch} `) || "No conditions yet"}
            onRuleChange={(id, next) => setDraftRules(draftRules.map((r) => (r.id === id ? { ...r, ...next } : r)))}
            onRuleRemove={(id) => setDraftRules(draftRules.filter((r) => r.id !== id))}
            onAddRule={() => setDraftRules([...draftRules, { id: Date.now(), field: "Status", operator: "is", value: "" }])}
            onApply={() => { setRules(draftRules); setMatch(draftMatch); setPage(1); }}
            onClear={() => { setDraftRules([]); setRules([]); }}
            onClose={() => setPanelOpen(false)} />
        )}
      </div>

      <footer className="poc-dt__footer">
        <span className="poc-dt__showing">Showing {firstShown}–{firstShown ? firstShown + pageRows.length - 1 : 0} of {sorted.length} {noun}</span>
        <TablePagination page={safePage} pageCount={pageCount} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      </footer>
    </section>
  );
}

export default DataTable;
