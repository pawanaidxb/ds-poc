import React from "react";
import { CheckIcon } from "../TableIcons/TableIcons";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import "./DropdownOption.css";

/**
 * DropdownOption — matches "Dropdown / Option" in Figma (130:6230).
 * Label (text)              -> label
 * Selection=Single/Multiple -> selection = "single" | "multiple" (multiple shows a checkbox)
 * State=Selected            -> selected (single shows a tick on the right)
 * State=Disabled            -> disabled
 * State=Hover / Focus / Selected focus -> real browser states (:hover, :focus-visible)
 */
export function DropdownOption({ label = "Design", selection = "single", selected = false, disabled = false, onSelect, ...rest }) {
  const cls = ["poc-ddopt", selected && "is-selected", disabled && "is-disabled"].filter(Boolean).join(" ");
  const choose = () => { if (!disabled && onSelect) onSelect(); };
  return (
    <div className={cls} role="option" aria-selected={selected} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : 0}
      onClick={choose} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } }} {...rest}>
      {selection === "multiple" && (
        <span className="poc-ddopt__check" aria-hidden="true">
          <TableCheckbox checked={selected} disabled={disabled} tabIndex={-1} label={label} onChange={() => {}} />
        </span>
      )}
      <span className="poc-ddopt__label">{label}</span>
      {selection === "single" && selected && <span className="poc-ddopt__tick" aria-hidden="true"><CheckIcon /></span>}
    </div>
  );
}

export default DropdownOption;
