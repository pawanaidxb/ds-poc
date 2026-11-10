import React, { useEffect, useId, useRef, useState } from "react";
import { DropdownTrigger } from "../DropdownTrigger/DropdownTrigger";
import { DropdownList } from "../DropdownList/DropdownList";
import "./Dropdown.css";

const DEFAULT_OPTIONS = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "success", label: "Customer success" },
];

/**
 * Dropdown — matches "Dropdown" in Figma (130:6713): label, trigger, list and helper text.
 * Label (text) -> label · Helper text (text) -> helperText · Show helper (boolean) -> showHelper
 * Selection=Single/Multiple -> selection = "single" | "multiple"
 * State=Default / Selected  -> no value / a value (value or defaultValue)
 * State=Open                -> click the trigger (or defaultOpen)
 * State=Error               -> error + errorMessage · State=Disabled -> disabled
 * options: [{ value, label, disabled }] · value: a value (single) or an array (multiple)
 * Works controlled (value + onChange) or on its own (defaultValue). Esc or a click outside closes it.
 */
export function Dropdown({
  label = "Team",
  helperText = "Set team access for this workspace.",
  showHelper = true,
  errorMessage = "Select a team to continue.",
  error = false,
  disabled = false,
  selection = "single",
  options = DEFAULT_OPTIONS,
  placeholder,
  searchPlaceholder = "Search teams…",
  noun = "team",
  nounPlural,
  value,
  defaultValue,
  onChange,
  defaultOpen = false,
  width = 320,
}) {
  const multiple = selection === "multiple";
  const [own, setOwn] = useState(defaultValue ?? (multiple ? [] : null));
  const current = value !== undefined ? value : own;
  const selected = multiple ? (current || []) : current != null ? [current] : [];
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const uid = useId();
  const labelId = `dd-${uid}-label`, listId = `dd-${uid}-list`, helpId = `dd-${uid}-help`;

  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const set = (next) => { if (value === undefined) setOwn(next); if (onChange) onChange(next); };
  const toggle = (v) => {
    if (multiple) set(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    else { set(v); setOpen(false); setQuery(""); if (triggerRef.current) triggerRef.current.focus(); }
  };
  const labelOf = (v) => (options.find((o) => o.value === v) || {}).label || v;
  const close = () => { setOpen(false); setQuery(""); if (triggerRef.current) triggerRef.current.focus(); };

  return (
    <div className="poc-dd" ref={rootRef} style={{ width }} onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); close(); } }}>
      {label && <span className="poc-dd__label" id={labelId}>{label}</span>}
      <DropdownTrigger ref={triggerRef} selection={selection} open={open} error={error} disabled={disabled}
        placeholder={placeholder || (multiple ? `Select ${nounPlural || noun + "s"}` : `Select a ${noun}`)}
        value={multiple ? selected.map(labelOf) : current != null ? labelOf(current) : null}
        onRemove={(lbl) => { const o = options.find((x) => x.label === lbl); set(selected.filter((x) => x !== (o ? o.value : lbl))); }}
        aria-labelledby={label ? labelId : undefined} aria-controls={open ? listId : undefined} aria-describedby={showHelper || error ? helpId : undefined}
        onClick={() => { if (!disabled) setOpen(!open); }}
        onKeyDown={(e) => { if (e.key === "ArrowDown" && !open) { e.preventDefault(); setOpen(true); } }} />
      {open && (
        <div className="poc-dd__popup">
          <DropdownList id={listId} options={options} selected={selected} selection={selection} query={query} onQueryChange={setQuery}
            onToggle={toggle} onClear={() => set(multiple ? [] : null)} searchPlaceholder={searchPlaceholder} noun={noun} nounPlural={nounPlural}
            aria-labelledby={label ? labelId : undefined} />
        </div>
      )}
      {(showHelper || error) && <span className={`poc-dd__help${error ? " is-error" : ""}`} id={helpId}>{error ? errorMessage : helperText}</span>}
    </div>
  );
}

export default Dropdown;
