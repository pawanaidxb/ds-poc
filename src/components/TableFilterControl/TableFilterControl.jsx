import React from "react";
import { ChevronDownIcon } from "../TableIcons/TableIcons";
import "./TableFilterControl.css";

/**
 * TableFilterControl — matches "Table / Filter control" in Figma.
 * Kind=Field/Operator -> kind (sets the accessible label)
 * Value (text) -> value · State=Focus -> CSS :focus · State=Disabled -> disabled
 * options: array of strings or { value, label }
 */
export function TableFilterControl({ kind = "field", value, options = [], placeholder = "Select a value", disabled = false, onChange, ...rest }) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <span className={`poc-tfctl${disabled ? " is-disabled" : ""}`}>
      <select className="poc-tfctl__select" value={value ?? ""} disabled={disabled} onChange={onChange}
        aria-label={kind === "operator" ? "Condition" : "Column"} {...rest}>
        {value == null && <option value="" disabled>{placeholder}</option>}
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDownIcon className="poc-tfctl__chev" />
    </span>
  );
}

export default TableFilterControl;
