import React from "react";
import "./Button.css";

/**
 * Button — matches the "Button" component in Figma.
 * Figma property "Type" (Primary / Secondary)  ->  prop "variant"
 * Figma property "Type" = Disabled             ->  prop "disabled" (true)
 * Figma property "Label" (text)                ->  prop "children"
 * Hover -> real browser state, no prop needed
 */
export function Button({ variant = "primary", disabled = false, children = "Button", ...rest }) {
  return (
    <button className={`poc-button poc-button--${variant}`} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
