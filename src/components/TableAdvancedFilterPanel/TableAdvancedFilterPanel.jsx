import React from "react";
import { XIcon } from "../TableIcons/TableIcons";
import { TableFilterLogic } from "../TableFilterLogic/TableFilterLogic";
import { TableFilterRule } from "../TableFilterRule/TableFilterRule";
import { Button } from "../Button/Button";
import "./TableAdvancedFilterPanel.css";

/**
 * TableAdvancedFilterPanel — matches "Table / Advanced filter panel" in Figma.
 * State=Default/Disabled -> disabled
 * rules: [{ id, kind: "text"|"number", field, operator, value }]
 */
export function TableAdvancedFilterPanel({ rules = [], match = "AND", matchCount, summary, disabled = false,
  onMatchChange, onRuleChange, onRuleRemove, onAddRule, onApply, onClear, onClose }) {
  return (
    <aside className={`poc-tafp${disabled ? " is-disabled" : ""}`} aria-label="Custom filters">
      <div className="poc-tafp__head">
        <h3 className="poc-tafp__title">Custom filters</h3>
        <button type="button" className="poc-tafp__x" onClick={onClose} aria-label="Close custom filters"><XIcon size={16} /></button>
      </div>
      <p className="poc-tafp__desc">Build a precise view of your accounts. All conditions are applied to this table.</p>
      <div className="poc-tafp__match">
        <span>Match</span><TableFilterLogic value={match} onChange={onMatchChange} /><span>conditions</span>
      </div>
      {rules.map((r) => (
        <TableFilterRule key={r.id} {...r} disabled={disabled}
          onChange={(next) => onRuleChange && onRuleChange(r.id, next)} onRemove={() => onRuleRemove && onRuleRemove(r.id)} />
      ))}
      <div><Button variant="secondary" disabled={disabled} onClick={onAddRule}>+ Add condition</Button></div>
      {matchCount != null && (
        <div className="poc-tafp__summary" aria-live="polite">
          <strong>{matchCount} accounts match</strong>
          {summary && <span>{summary}</span>}
        </div>
      )}
      <div className="poc-tafp__actions">
        <Button variant="primary" disabled={disabled} onClick={onApply}>Apply filters</Button>
        <Button variant="secondary" disabled={disabled} onClick={onClear}>Clear all</Button>
      </div>
    </aside>
  );
}

export default TableAdvancedFilterPanel;
