import "./Card.css";

/**
 * Card — matches the "Card" component in Figma.
 * Figma property "Title" (text)        ->  prop "title"
 * Figma property "Description" (text)  ->  prop "description"
 */
export function Card({ title = "Card title", description = "Card description", children }) {
  return (
    <div className="poc-card">
      <h3 className="poc-card__title">{title}</h3>
      <p className="poc-card__text">{description}</p>
      {children && <div className="poc-card__actions">{children}</div>}
    </div>
  );
}

export default Card;
