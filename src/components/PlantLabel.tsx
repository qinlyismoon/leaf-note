type PlantLabelProps = { label?: string };

/** Non-interactive identity label shared across plant presentations. */
export function PlantLabel({ label }: PlantLabelProps) {
  const text = label?.trim();
  return text ? <span className="plant-label" title={text}>{text}</span> : null;
}
