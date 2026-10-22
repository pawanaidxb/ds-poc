import "./Button.css";

/**
 * Button — matches the "Button" component in Figma.
 * Figma property "Type" (Primary / Secondary)  ->  prop "variant"
 * Figma property "Label" (text)                ->  prop "children"
 */
export function Button({ variant = "primary", disabled = false, children = "Button", ...rest }) {
  return (
    <button className={`poc-button poc-button--${variant}`} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
