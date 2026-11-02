import React, { useState } from "react";
import "./Checkbox.css";

/**
 * Checkbox — matches the "Checkbox" component set in Figma (node 80:4312).
 * Figma property "Property 1" (Default / Filled) -> checked (false / true)
 * Hover / Focus -> real browser states, no prop needed
 * No text in Figma -> label is read by screen readers only
 * Works controlled (checked + onChange) or on its own (defaultChecked)
 */
export function Checkbox({ checked, defaultChecked = false, disabled = false, label = "Checkbox", onChange, ...rest }) {
  const [own, setOwn] = useState(defaultChecked);
  const isOn = checked ?? own;
  const handle = (e) => {
    if (checked === undefined) setOwn(e.target.checked);
    if (onChange) onChange(e);
  };
  return (
    <label className={`poc-checkbox${isOn ? " poc-checkbox--filled" : ""}${disabled ? " is-disabled" : ""}`}>
      <input type="checkbox" className="poc-checkbox__input" checked={isOn} disabled={disabled}
        aria-label={label} onChange={handle} {...rest} />
      <span className="poc-checkbox__box" aria-hidden="true" />
    </label>
  );
}

export default Checkbox;
