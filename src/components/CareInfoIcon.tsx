/**
 * Care Info glyph: one magnifying glass with a water droplet in the lens.
 * Stroke matches Back / Close / Edit (1.8, round caps and joins).
 */
export function CareInfoIcon() {
  return (
    <svg
      className="icon-button__glyph"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
    >
      <circle
        cx="10.2"
        cy="10.15"
        r="7.1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15.55 15.5 20.35 20.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.2 7.05c0 0-3.2 2.75-3.2 3.35a3.2 3.2 0 1 0 6.4 0c0-.6-3.2-3.35-3.2-3.35Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
