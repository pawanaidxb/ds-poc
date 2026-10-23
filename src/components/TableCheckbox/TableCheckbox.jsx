import React, { useEffect, useRef } from "react";
import { CheckIcon } from "../TableIcons/TableIcons";
import "./TableCheckbox.css";

/**
 * TableCheckbox — matches "Table / Checkbox" in Figma.
 * Figma State=Unchecked/Checked/Indeterminate/Disabled -> checked, indeterminate, disabled
 */
export function TableCheckbox({ checked = false, indeterminate = false, disabled = false, label = "Select row", onChange, ...rest }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";
  return (
    <label className={`poc-tcheck poc-tcheck--${state}${disabled ? " is-disabled" : ""}`}>
      <input ref={ref} type="checkbox" className="poc-tcheck__input" checked={checked} disabled={disabled}
        aria-label={label} aria-checked={indeterminate ? "mixed" : checked} onChange={onChange} {...rest} />
      <span className="poc-tcheck__box" aria-hidden="true">
        {state === "checked" && <CheckIcon />}
        {state === "indeterminate" && <span className="poc-tcheck__dash" />}
      </span>
    </label>
  );
}

export default TableCheckbox;
