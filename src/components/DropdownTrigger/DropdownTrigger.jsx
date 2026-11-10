import React, { forwardRef } from "react";
import { ChevronDownIcon } from "../TableIcons/TableIcons";
import { TableFilterChip } from "../TableFilterChip/TableFilterChip";
import "./DropdownTrigger.css";

/**
 * DropdownTrigger — matches "Dropdown / Trigger" in Figma (130:6371).
 * Placeholder (text)        -> placeholder
 * Value (text)              -> value (single: a string · multiple: an array of labels, shown as chips)
 * Selection=Single/Multiple -> selection = "single" | "multiple"
 * State=Default / Selected  -> no value / a value
 * State=Open                -> open (2px primary border, caret flips)
 * State=Error               -> error · State=Disabled -> disabled
 * Removing a chip           -> onRemove(label)
 */
export const DropdownTrigger = forwardRef(function DropdownTrigger(
  { placeholder = "Select a team", value, selection = "single", open = false, error = false, disabled = false, onRemove, ...rest }, ref) {
  const values = selection === "multiple" ? (Array.isArray(value) ? value : []) : [];
  const hasValue = selection === "multiple" ? values.length > 0 : !!value;
  const cls = ["poc-ddtrig", hasValue && selection === "multiple" && "has-chips", open && "is-open", error && "is-error", disabled && "is-disabled"].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      <button ref={ref} type="button" className="poc-ddtrig__button" aria-haspopup="listbox" aria-expanded={open} aria-invalid={error || undefined}
        disabled={disabled} {...rest}>
        {!hasValue && <span className="poc-ddtrig__placeholder">{placeholder}</span>}
        {hasValue && selection === "single" && <span className="poc-ddtrig__value">{value}</span>}
        {hasValue && selection === "multiple" && <span className="poc-ddtrig__spacer" />}
        <span className="poc-ddtrig__caret" aria-hidden="true"><ChevronDownIcon /></span>
      </button>
      {hasValue && selection === "multiple" && (
        <span className="poc-ddtrig__chips">
          {values.map((v) => <TableFilterChip key={v} disabled={disabled} onRemove={() => onRemove && onRemove(v)}>{v}</TableFilterChip>)}
        </span>
      )}
    </div>
  );
});

export default DropdownTrigger;
