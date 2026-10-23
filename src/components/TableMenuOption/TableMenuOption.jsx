import React from "react";
import { TableCheckbox } from "../TableCheckbox/TableCheckbox";
import "./TableMenuOption.css";

/**
 * TableMenuOption — matches "Table / Menu option" in Figma.
 * Kind=Checkbox/Action -> kind · Label -> label · Detail -> detail · Show detail -> showDetail
 * State=Selected -> selected (checkbox kind) · Focus -> CSS :focus-visible · Disabled -> disabled
 */
export function TableMenuOption({ kind = "checkbox", label = "Option", detail = "12", showDetail = true, selected = false, disabled = false, onSelect }) {
  const cls = ["poc-tmopt", `poc-tmopt--${kind}`, selected && "is-selected", disabled && "is-disabled"].filter(Boolean).join(" ");
  if (kind === "checkbox") {
    return (
      <label className={cls}>
        <TableCheckbox checked={selected} disabled={disabled} label={label} onChange={() => onSelect && onSelect(!selected)} />
        <span className="poc-tmopt__label">{label}</span>
        {showDetail && <span className="poc-tmopt__detail">{detail}</span>}
      </label>
    );
  }
  return (
    <button type="button" className={cls} disabled={disabled} onClick={onSelect}>
      <span className="poc-tmopt__label">{label}</span>
      {showDetail && <span className="poc-tmopt__detail">{detail}</span>}
    </button>
  );
}

export default TableMenuOption;
