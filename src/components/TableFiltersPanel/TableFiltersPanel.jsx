import React from "react";
import { XIcon } from "../TableIcons/TableIcons";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Dropdown } from "../Dropdown/Dropdown";
import { TableMenuOption } from "../TableMenuOption/TableMenuOption";
import { TableAdvancedFilterPanel } from "../TableAdvancedFilterPanel/TableAdvancedFilterPanel";
import "./TableFiltersPanel.css";

/**
 * TableFiltersPanel — matches "Table / Filters panel" in Figma (147:7711).
 * Tab=General filters -> tab="general": dropdown fields + a value checklist + Reset / Apply
 * Tab=Custom filters  -> tab="custom": the custom filter rules (TableAdvancedFilterPanel, without its own header)
 * Tabs -> tab + onTabChange · close (x) -> onClose
 *
 * General tab:
 *   fields: [{ key, label, placeholder, options: [{ value, label }], value, onChange }]  ("Status", "Workspace")
 *   checklist: { title, values: [{ value, label, count }], selected: [...], total, query, onQueryChange, onToggle(value), onToggleAll }
 *   onReset · onApply
 * Custom tab: custom = the props for TableAdvancedFilterPanel (rules, match, matchCount, summary, on... handlers)
 */
export function TableFiltersPanel({ tab = "general", onTabChange, onClose, fields = [], checklist, onReset, onApply, custom = {}, ...rest }) {
  const shown = checklist ? checklist.values.filter((v) => !checklist.query || String(v.label).toLowerCase().includes(checklist.query.toLowerCase())) : [];
  const allOn = shown.length > 0 && shown.every((v) => checklist.selected.includes(v.value));
  const someOn = !allOn && shown.some((v) => checklist.selected.includes(v.value));
  return (
    <aside className="poc-tfp" aria-label="Filters" {...rest}>
      <div className="poc-tfp__head">
        <h3 className="poc-tfp__title">Filters</h3>
        <button type="button" className="poc-tfp__x" onClick={onClose} aria-label="Close filters"><XIcon size={14} /></button>
      </div>
      <div className="poc-tfp__tabs" role="tablist" aria-label="Filter type">
        <Button role="tab" aria-selected={tab === "general"} variant={tab === "general" ? "primary" : "secondary"} onClick={() => onTabChange && onTabChange("general")}>General filters</Button>
        <Button role="tab" aria-selected={tab === "custom"} variant={tab === "custom" ? "primary" : "secondary"} onClick={() => onTabChange && onTabChange("custom")}>Custom filters</Button>
      </div>

      {tab === "general" ? (
        <div className="poc-tfp__general">
          {fields.length > 0 && (
            <div className="poc-tfp__fields">
              {fields.map((f) => (
                <Dropdown key={f.key} label={f.label} showHelper={false} width="100%" noun={f.label.toLowerCase()}
                  placeholder={f.placeholder} searchPlaceholder={`Search ${f.label.toLowerCase()}…`}
                  options={f.options} value={f.value} onChange={f.onChange} />
              ))}
            </div>
          )}
          {checklist && (
            <div className="poc-tfp__checklist" role="group" aria-label={checklist.title}>
              <span className="poc-tfp__label">{checklist.title}</span>
              <Input size="small" width="100%" showLabel={false} showHelper={false} label={`Search ${checklist.title.toLowerCase()} values`} placeholder="Search values…"
                value={checklist.query || ""} onChange={(e) => checklist.onQueryChange && checklist.onQueryChange(e.target.value)} />
              <TableMenuOption label="Select all" detail={String(checklist.total ?? shown.length)} selected={allOn} indeterminate={someOn} onSelect={() => checklist.onToggleAll && checklist.onToggleAll(!allOn, shown.map((v) => v.value))} />
              {shown.map((v) => (
                <TableMenuOption key={v.value} label={v.label} detail={String(v.count)} selected={checklist.selected.includes(v.value)}
                  onSelect={() => checklist.onToggle && checklist.onToggle(v.value)} />
              ))}
            </div>
          )}
          <hr className="poc-tfp__divider" />
          <div className="poc-tfp__actions">
            <Button variant="secondary" onClick={onReset}>Reset</Button>
            <Button variant="primary" onClick={onApply}>Apply</Button>
          </div>
        </div>
      ) : (
        <TableAdvancedFilterPanel showHeader={false} {...custom} />
      )}
    </aside>
  );
}

export default TableFiltersPanel;
