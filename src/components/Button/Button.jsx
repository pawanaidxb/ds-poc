import React from "react";
import { ArrowRightIcon } from "../TableIcons/TableIcons";
import "./Button.css";

/**
 * Button — matches the "Button" component in Figma.
 * Figma property "Type" (Primary / Secondary)  ->  prop "variant"
 * Figma property "Type" = Disabled             ->  prop "disabled" (true)
 * Figma property "Layout"                      ->  prop "layout"
 *   Text only -> "text" · Left icon -> "left-icon" · Right icon -> "right-icon" · Icon only -> "icon-only"
 * Figma "Icon / Arrow right"                   ->  prop "icon" (any icon; the arrow is the default)
 * Figma property "Label" (text)                ->  prop "children"
 *   With layout="icon-only" the label is not shown but stays the button's accessible name (Figma note).
 * Hover -> real browser state, no prop needed
 */
export function Button({ variant = "primary", layout = "text", icon, disabled = false, children = "Button", ...rest }) {
  const glyph = layout === "text" ? null : (icon || <ArrowRightIcon />);
  const iconOnly = layout === "icon-only";
  return (
    <button className={`poc-button poc-button--${variant}${iconOnly ? " poc-button--icon-only" : ""}`} disabled={disabled}
      aria-label={iconOnly && typeof children === "string" ? children : undefined} {...rest}>
      {layout === "left-icon" && <span className="poc-button__icon">{glyph}</span>}
      {iconOnly ? <span className="poc-button__icon">{glyph}</span> : <span className="poc-button__label">{children}</span>}
      {layout === "right-icon" && <span className="poc-button__icon">{glyph}</span>}
    </button>
  );
}

export default Button;
