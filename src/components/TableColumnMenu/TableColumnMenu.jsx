import React from "react";
import { XIcon } from "../TableIcons/TableIcons";
import "./TableColumnMenu.css";

/**
 * TableColumnMenu — matches "Table / Column menu" in Figma (the popover shell).
 * Kind=Column filter / Column visibility / Column width -> the content you pass in
 * (see the stories for each kind, built from Input, TableMenuOption and Button).
 */
export function TableColumnMenu({ title = "Filter by role", note, onClose, children, footer, ...rest }) {
  return (
    <div className="poc-tcmenu" role="dialog" aria-label={title} {...rest}>
      <div className="poc-tcmenu__head">
        <span className="poc-tcmenu__title">{title}</span>
        <button type="button" className="poc-tcmenu__x" onClick={onClose} aria-label="Close"><XIcon size={14} /></button>
      </div>
      {note && <p className="poc-tcmenu__note">{note}</p>}
      <div className="poc-tcmenu__body">{children}</div>
      {footer && <><hr className="poc-tcmenu__divider" /><div className="poc-tcmenu__foot">{footer}</div></>}
    </div>
  );
}

export default TableColumnMenu;
