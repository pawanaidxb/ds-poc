import React, { useState } from "react";
import { XIcon } from "../TableIcons/TableIcons";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { DropdownList } from "../DropdownList/DropdownList";
import { TableColumnConfigItem } from "../TableColumnConfigItem/TableColumnConfigItem";
import { TableConfigGroupHeader } from "../TableConfigGroupHeader/TableConfigGroupHeader";
import "./TableColumnConfigPanel.css";

/**
 * TableColumnConfigPanel — matches "Table / Column configuration panel" in Figma (122:4746).
 * Mode=Configure / Reordered / All visible -> view="columns" (defaultOrder, and every column visible or not)
 * Mode=Column groups -> view="groups"
 * Mode=New group     -> view="groups" with a group that has draft: true (name field, "Add columns")
 * Mode=Ungrouped     -> view="groups" with no groups (every column under "Ungrouped")
 * "Columns" / "Groups" tabs -> view + onViewChange
 *
 * columns: [{ key, title, visible }] in the order shown.
 * groups:  [{ id, name, keys: [...], draft }] in the order shown. Columns in no group are "Ungrouped".
 * Columns view: drag (or Alt + Arrow keys) -> onMove(fromKey, toKey) · tick -> onToggle(key)
 * Groups view: every change -> onGroupsChange(nextGroups) (drag columns between groups, drag groups,
 *   Add group, Add columns, Ungroup, Ungroup all, rename / cancel a new group)
 * Reset order -> onReset · Apply columns -> onApply (disabled while a new group has no columns)
 */
export function TableColumnConfigPanel({
  columns = [],
  defaultOrder = true,
  note,
  view = "columns",
  onViewChange,
  groups = [],
  onGroupsChange,
  onToggle,
  onMove,
  onReset,
  onApply,
  onClose,
  ...rest
}) {
  const [query, setQuery] = useState("");
  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);
  const [dragGroup, setDragGroup] = useState(null);
  const [collapsed, setCollapsed] = useState(new Set());
  const [picking, setPicking] = useState(null);
  const [pickQuery, setPickQuery] = useState("");

  const byKey = Object.fromEntries(columns.map((c) => [c.key, c]));
  const visibleCount = columns.filter((c) => c.visible).length;
  const hiddenCount = columns.length - visibleCount;
  const matches = (c) => !query || c.title.toLowerCase().includes(query.toLowerCase());
  const shown = columns.filter(matches);
  const realGroups = groups.filter((g) => !g.draft);
  const draft = groups.find((g) => g.draft);
  const grouped = new Set(groups.flatMap((g) => g.keys));
  const ungrouped = columns.filter((c) => !grouped.has(c.key)).map((c) => c.key);
  const draftEmpty = !!draft && draft.keys.length === 0;

  const footNote = view === "groups"
    ? (draftEmpty ? "Add columns before applying the new group." : "Grouping never changes the visibility checkboxes.")
    : (note || (hiddenCount === 0 ? "All columns are shown in the table." : "Hidden columns keep their position when shown again."));
  const help = view === "groups"
    ? (draft ? ["Name the new group, then add columns.", "Your saved column settings remain unchanged."] : ["Drag columns between groups.", "Ungrouping keeps their order and visibility."])
    : ["Drag columns to set their order.", "Check a column to show it; uncheck it to hide it."];

  const moveBy = (key, step) => {
    const i = columns.findIndex((c) => c.key === key);
    const target = columns[i + step];
    if (target && onMove) onMove(key, target.key);
  };

  // ---------- groups ----------
  const change = (next) => onGroupsChange && onGroupsChange(next);
  const without = (list, key) => list.map((g) => ({ ...g, keys: g.keys.filter((k) => k !== key) }));
  const moveToGroup = (key, groupId, beforeKey) => {
    const next = without(groups, key).map((g) => {
      if (g.id !== groupId) return g;
      const keys = [...g.keys];
      const at = beforeKey ? keys.indexOf(beforeKey) : -1;
      keys.splice(at < 0 ? keys.length : at, 0, key);
      return { ...g, keys };
    });
    change(next);
  };
  const moveGroup = (fromId, toId) => {
    if (fromId === toId) return;
    const n = groups.filter((g) => g.id !== fromId);
    const at = n.findIndex((g) => g.id === toId);
    n.splice(groups.findIndex((g) => g.id === toId) > groups.findIndex((g) => g.id === fromId) ? at + 1 : at, 0, groups.find((g) => g.id === fromId));
    change(n);
  };
  const ungroup = (id) => change(groups.filter((g) => g.id !== id));
  const addGroup = () => change([...groups, { id: `group-${Date.now()}`, name: "", keys: [], draft: true }]);
  const pickToggle = (groupId, key) => {
    const g = groups.find((x) => x.id === groupId);
    if (g.keys.includes(key)) change(groups.map((x) => (x.id === groupId ? { ...x, keys: x.keys.filter((k) => k !== key) } : x)));
    else moveToGroup(key, groupId);
  };

  const itemFor = (key, groupId) => {
    const c = byKey[key];
    if (!c || !matches(c)) return null;
    return (
      <TableColumnConfigItem key={key} size="compact" columnName={c.title} visible={c.visible}
        dragging={dragKey === key} dropTarget={overKey === key && dragKey && dragKey !== key}
        onToggle={() => onToggle && onToggle(key)}
        onDragOver={(e) => { if (dragKey) { e.preventDefault(); e.stopPropagation(); setOverKey(key); } }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (dragKey && dragKey !== key) moveToGroup(dragKey, groupId, key); setDragKey(null); setOverKey(null); }}
        dragHandleProps={{
          draggable: true,
          onDragStart: (e) => { e.stopPropagation(); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", key); setDragKey(key); },
          onDragEnd: () => { setDragKey(null); setOverKey(null); },
        }} />
    );
  };
  const dropOnGroup = (groupId) => ({
    onDragOver: (e) => { if (dragKey || dragGroup) e.preventDefault(); },
    onDrop: (e) => {
      e.preventDefault();
      if (dragKey) moveToGroup(dragKey, groupId);
      if (dragGroup && groupId) moveGroup(dragGroup, groupId);
      setDragKey(null); setOverKey(null); setDragGroup(null);
    },
  });

  return (
    <aside className="poc-tccp" aria-label="Configure columns" {...rest}>
      <div className="poc-tccp__head">
        <h3 className="poc-tccp__title">Configure columns</h3>
        <button type="button" className="poc-tccp__x" onClick={onClose} aria-label="Close"><XIcon size={14} /></button>
      </div>
      <p className="poc-tccp__help">{help[0]}<br />{help[1]}</p>
      <div className="poc-tccp__summary" aria-live="polite">
        <span>{visibleCount} visible · {hiddenCount} hidden</span>
        <span className="poc-tccp__order">{defaultOrder ? "Default order" : "Custom order"}</span>
      </div>
      <Input size="small" width="100%" showLabel={false} showHelper={false} label="Find a column" placeholder="Find a column…"
        value={query} onChange={(e) => setQuery(e.target.value)} />

      {onViewChange && (
        <div className="poc-tccp__view">
          <div className="poc-tccp__tabs" role="tablist" aria-label="Columns or groups">
            <Button role="tab" aria-selected={view === "columns"} variant={view === "columns" ? "primary" : "secondary"} onClick={() => onViewChange("columns")}>Columns</Button>
            <Button role="tab" aria-selected={view === "groups"} variant={view === "groups" ? "primary" : "secondary"} onClick={() => onViewChange("groups")}>Groups</Button>
          </div>
          <span className="poc-tccp__count">{realGroups.length} {realGroups.length === 1 ? "group" : "groups"}{draft ? " · 1 draft" : ""}</span>
        </div>
      )}

      {view === "columns" && (
        <>
          <p className="poc-tccp__listhead">COLUMNS</p>
          <ul className="poc-tccp__list">
            {shown.map((c) => (
              <TableColumnConfigItem key={c.key} columnName={c.title} visible={c.visible}
                dragging={dragKey === c.key} dropTarget={overKey === c.key && dragKey && dragKey !== c.key}
                onToggle={() => onToggle && onToggle(c.key)}
                onMoveUp={() => moveBy(c.key, -1)} onMoveDown={() => moveBy(c.key, 1)}
                onDragOver={(e) => { if (dragKey) { e.preventDefault(); setOverKey(c.key); } }}
                onDrop={(e) => { e.preventDefault(); if (dragKey && dragKey !== c.key && onMove) onMove(dragKey, c.key); setDragKey(null); setOverKey(null); }}
                dragHandleProps={{
                  draggable: true,
                  onDragStart: (e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.key); setDragKey(c.key); },
                  onDragEnd: () => { setDragKey(null); setOverKey(null); },
                }} />
            ))}
            {shown.length === 0 && <li className="poc-tccp__empty">No column matches “{query}”.</li>}
          </ul>
        </>
      )}

      {view === "groups" && (
        <>
          <div className="poc-tccp__groupactions">
            <Button variant="secondary" onClick={addGroup} disabled={!!draft}>Add group</Button>
            <Button variant="secondary" onClick={() => change([])} disabled={groups.length === 0}>Ungroup all</Button>
          </div>
          <p className="poc-tccp__listhead">{groups.length ? "COLUMN GROUPS" : "UNGROUPED COLUMNS"}</p>
          <div className="poc-tccp__groups">
            {groups.map((g) => {
              const open = !collapsed.has(g.id);
              return (
                <section key={g.id} className={`poc-tccp__group${dragGroup === g.id ? " is-dragging" : ""}`} aria-label={g.name || "New group"} {...dropOnGroup(g.id)}>
                  <TableConfigGroupHeader groupName={g.name} columnCount={g.keys.length} editing={!!g.draft} expanded={open}
                    onToggle={() => { const n = new Set(collapsed); n.has(g.id) ? n.delete(g.id) : n.add(g.id); setCollapsed(n); }}
                    onAddColumns={() => { setPicking(picking === g.id ? null : g.id); setPickQuery(""); }}
                    onUngroup={() => ungroup(g.id)}
                    onNameChange={(name) => change(groups.map((x) => (x.id === g.id ? { ...x, name } : x)))}
                    onCancel={() => ungroup(g.id)}
                    dragHandleProps={{
                      draggable: true,
                      onDragStart: (e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", g.id); setDragGroup(g.id); },
                      onDragEnd: () => setDragGroup(null),
                    }} />
                  {open && (
                    <ul className="poc-tccp__grouplist">
                      {g.keys.map((k) => itemFor(k, g.id))}
                      {g.draft && g.keys.length === 0 && (
                        <li className="poc-tccp__draft">
                          <span>Choose columns for your new group.</span>
                          <Button variant="primary" onClick={() => { setPicking(g.id); setPickQuery(""); }}>Add columns</Button>
                        </li>
                      )}
                      {g.draft && g.keys.length > 0 && (
                        <li className="poc-tccp__draft"><Button variant="secondary" onClick={() => { setPicking(picking === g.id ? null : g.id); setPickQuery(""); }}>Add columns</Button></li>
                      )}
                    </ul>
                  )}
                  {picking === g.id && (
                    <div className="poc-tccp__picker">
                      <DropdownList selection="multiple" options={columns.map((c) => ({ value: c.key, label: c.title }))} selected={g.keys}
                        query={pickQuery} onQueryChange={setPickQuery} onToggle={(k) => pickToggle(g.id, k)}
                        onClear={() => change(groups.map((x) => (x.id === g.id ? { ...x, keys: [] } : x)))}
                        searchPlaceholder="Search columns…" noun="column" />
                      <Button variant="primary" onClick={() => setPicking(null)}>Done</Button>
                    </div>
                  )}
                </section>
              );
            })}
            <section className="poc-tccp__group" aria-label="Ungrouped" {...dropOnGroup(null)}>
              <TableConfigGroupHeader groupName="Ungrouped" columnCount={ungrouped.length} showDragHandle={false} showDisclosure={false} showActions={false} />
              <ul className="poc-tccp__grouplist">
                {ungrouped.map((k) => itemFor(k, null))}
                {ungrouped.length === 0 && <li className="poc-tccp__hint">Drag columns here to remove them from a group.</li>}
              </ul>
            </section>
          </div>
        </>
      )}

      <p className="poc-tccp__note">{footNote}</p>
      <div className="poc-tccp__actions">
        <Button variant="secondary" onClick={onReset}>Reset order</Button>
        <Button variant="primary" onClick={onApply} disabled={visibleCount === 0 || draftEmpty}>Apply columns</Button>
      </div>
    </aside>
  );
}

export default TableColumnConfigPanel;
