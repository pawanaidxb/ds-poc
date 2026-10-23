import React from "react";
import { XIcon } from "../TableIcons/TableIcons";
import { TableFilterControl } from "../TableFilterControl/TableFilterControl";
import { Input } from "../Input/Input";
import "./TableFilterRule.css";

const OPERATORS = {
  text: ["is", "is not", "contains", "does not contain"],
  number: ["is equal to", "is greater than or equal to", "is less than or equal to"],
};

/**
 * TableFilterRule — matches "Table / Filter rule" in Figma.
 * Kind=Text/Number -> kind · State=Disabled -> disabled
 * Built from TableFilterControl (field + operator) and Input (value).
 */
export function TableFilterRule({ kind = "text", field = "Status", fields = ["Account", "Workspace", "Status", "Owner", "Role", "Seats", "ARR"],
  operator, value = "", disabled = false, onChange, onRemove }) {
  const ops = OPERATORS[kind] || OPERATORS.text;
  const set = (patch) => onChange && onChange({ field, operator: operator ?? ops[0], value, ...patch });
  return (
    <div className={`poc-trule${disabled ? " is-disabled" : ""}`} role="group" aria-label={`Condition on ${field}`}>
      <div className="poc-trule__head">
        <span className="poc-trule__title">{field}</span>
        <button type="button" className="poc-trule__x" onClick={onRemove} disabled={disabled} aria-label={`Remove condition on ${field}`}><XIcon size={12} /></button>
      </div>
      <TableFilterControl value={field} options={fields} disabled={disabled} onChange={(e) => set({ field: e.target.value })} />
      <TableFilterControl kind="operator" value={operator ?? ops[0]} options={ops} disabled={disabled} onChange={(e) => set({ operator: e.target.value })} />
      <Input size="small" width="100%" showLabel={false} showHelper={false} label={`${field} value`} placeholder={kind === "number" ? "Enter a number" : "Enter a value"}
        type={kind === "number" ? "number" : "text"} value={value} disabled={disabled} onChange={(e) => set({ value: e.target.value })} />
    </div>
  );
}

export default TableFilterRule;
