import React from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { DropdownOption } from "../DropdownOption/DropdownOption";
import "./DropdownList.css";

/**
 * DropdownList — matches "Dropdown / List" in Figma (130:6463).
 * Selection=Single/Multiple -> selection = "single" | "multiple"
 * Results=Options / Empty   -> options that match the search / none ("No teams found")
 * options: [{ value, label, disabled }] · selected: array of values
 * Search box -> query + onQueryChange · Clear -> onClear · picking -> onToggle(value)
 * noun / nounPlural -> "1 team selected" / "2 teams selected"
 * (code only) searchable / showSummary -> hide the search box or the summary row (e.g. the toolbar "Group by" list)
 */
export function DropdownList({
  options = [], selected = [], selection = "single", query = "", onQueryChange, onToggle, onClear,
  searchPlaceholder = "Search teams…", noun = "team", nounPlural, emptyTitle, emptyText = "Try a different search.", id,
  searchable = true, showSummary = true, ...rest
}) {
  const plural = nounPlural || `${noun}s`;
  const shown = query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const count = selected.length;
  return (
    <div className="poc-ddlist" {...rest}>
      {searchable && <Input size="small" width="100%" showLabel={false} showHelper={false} label={searchPlaceholder.replace("…", "")} placeholder={searchPlaceholder}
        value={query} onChange={(e) => onQueryChange && onQueryChange(e.target.value)} autoFocus />}
      {shown.length > 0 ? (
        <div className="poc-ddlist__options" role="listbox" id={id} aria-multiselectable={selection === "multiple" || undefined}>
          {shown.map((o) => (
            <DropdownOption key={o.value} label={o.label} selection={selection} selected={selected.includes(o.value)} disabled={o.disabled}
              onSelect={() => onToggle && onToggle(o.value)} />
          ))}
        </div>
      ) : (
        <div className="poc-ddlist__empty" role="status">
          <span className="poc-ddlist__empty-title">{emptyTitle || `No ${plural} found`}</span>
          <span className="poc-ddlist__empty-text">{emptyText}</span>
        </div>
      )}
      {showSummary && <div className="poc-ddlist__summary">
        <span>{count} {count === 1 ? noun : plural} selected</span>
        <Button variant="secondary" onClick={onClear} disabled={count === 0}>Clear</Button>
      </div>}
    </div>
  );
}

export default DropdownList;
