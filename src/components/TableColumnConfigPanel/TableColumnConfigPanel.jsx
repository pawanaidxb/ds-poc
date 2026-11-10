import React, { useState } from "react";
import { XIcon } from "../TableIcons/TableIcons";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { TableColumnConfigItem } from "../TableColumnConfigItem/TableColumnConfigItem";
import "./TableColumnConfigPanel.css";

/**
 * TableColumnConfigPanel — matches "Table / Column configuration panel" in Figma (122:4746).
 * Mode=Configure    -> columns in their default order (defaultOrder = true)
 * Mode=Reordered    -> columns in a custom order (defaultOrder = false)
 * Mode=All visible  -> every column has visible = true
 * columns: [{ key, title, visible }] in the order shown.
 * Drag an item (or Alt + Arrow keys) -> onMove(fromKey, toKey). Tick -> onToggle(key).
 * "Find a column…" filters the list. Reset order -> onReset. Apply columns -> onApply.
 */
export function TableColumnConfigPanel({
  columns = [],
  defaultOrder = true,
  note,
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

  const visibleCount = columns.filter((c) => c.visible).length;
  const hiddenCount = columns.length - visibleCount;
  const shown = query ? columns.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())) : columns;
  const footNote = note || (hiddenCount === 0 ? "All columns are shown in the table." : "Hidden columns keep their position when shown again.");
  const moveBy = (key, step) => {
    const i = columns.findIndex((c) => c.key === key);
    const target = columns[i + step];
    if (target && onMove) onMove(key, target.key);
  };

  return (
    <aside className="poc-tccp" aria-label="Configure columns" {...rest}>
      <div className="poc-tccp__head">
        <h3 className="poc-tccp__title">Configure columns</h3>
        <button type="button" className="poc-tccp__x" onClick={onClose} aria-label="Close"><XIcon size={14} /></button>
      </div>
      <p className="poc-tccp__help">Drag columns to set their order.<br />Check a column to show it; uncheck it to hide it.</p>
      <div className="poc-tccp__summary" aria-live="polite">
        <span>{visibleCount} visible · {hiddenCount} hidden</span>
        <span className="poc-tccp__order">{defaultOrder ? "Default order" : "Custom order"}</span>
      </div>
      <Input size="small" width="100%" showLabel={false} showHelper={false} label="Find a column" placeholder="Find a column…"
        value={query} onChange={(e) => setQuery(e.target.value)} />
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
      <p className="poc-tccp__note">{footNote}</p>
      <div className="poc-tccp__actions">
        <Button variant="secondary" onClick={onReset}>Reset order</Button>
        <Button variant="primary" onClick={onApply} disabled={visibleCount === 0}>Apply columns</Button>
      </div>
    </aside>
  );
}

export default TableColumnConfigPanel;
