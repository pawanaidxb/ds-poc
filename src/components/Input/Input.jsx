import React, { useId } from "react";
import "./Input.css";

/**
 * Input — matches the "Input" component set in Figma (DS POC file).
 *
 * Figma property        ->  code prop
 * Size (Small/Medium/Large) -> size ("small" | "medium" | "large")
 * State=Error           ->  error (true) + errorMessage
 * State=Disabled        ->  disabled (true)
 * State=Default/Hover/Focus/Filled -> real browser states, no prop needed
 * Label (text)          ->  label
 * Input text (text)     ->  placeholder
 * Helper text (text)    ->  helperText
 * Show label (boolean)  ->  showLabel
 * Show helper (boolean) ->  showHelper
 * (code only) width     ->  width, e.g. 280 or "100%"
 */
export function Input({
  size = "small",
  label = "Work email",
  placeholder = "name@company.com",
  helperText = "Use your company email address.",
  errorMessage = "Enter a valid work email address.",
  showLabel = true,
  showHelper = true,
  error = false,
  disabled = false,
  id,
  width,
  ...rest
}) {
  const autoId = useId();
  const inputId = id || `input-${autoId}`;
  const helperId = `${inputId}-helper`;
  const message = error ? errorMessage : helperText;

  return (
    <div className={`poc-input poc-input--${size}${error ? " is-error" : ""}${disabled ? " is-disabled" : ""}`} style={width ? { width } : undefined}>
      {showLabel && (
        <label className="poc-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="poc-input__field"
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={showHelper ? helperId : undefined}
        {...rest}
      />
      {showHelper && (
        <p id={helperId} className="poc-input__helper">
          {message}
        </p>
      )}
    </div>
  );
}

export default Input;
