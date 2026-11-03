import React from "react";
import "./Radio.css";

/**
 * Radio — matches the "Radio" component set in Figma (node 103:4322).
 *
 * Figma property                 ->  code prop
 * Property 1=Default             ->  checked = false
 * Property 1=Selected (dot)      ->  checked = true
 * Property 1=Disabled            ->  disabled = true, checked = false
 * Property 1=Fill Disabled       ->  disabled = true, checked = true
 * (no Hover / Focus in Figma)    ->  real browser :focus-visible ring
 * (code only) label              ->  label, read by screen readers only (no text in Figma)
 * (code only) name / value       ->  passed to the native radio so groups work
 * Works controlled (checked + onChange) or on its own (defaultChecked).
 */
export function Radio({ checked, defaultChecked, disabled = false, label = "Radio", name, value, onChange, ...rest }) {
  return (
    <label className={`poc-radio${disabled ? " is-disabled" : ""}`}>
      <input
        type="radio"
        className="poc-radio__input"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={label}
        onChange={onChange}
        {...rest}
      />
      <span className="poc-radio__circle" aria-hidden="true">
        <span className="poc-radio__dot" />
      </span>
    </label>
  );
}

export default Radio;
