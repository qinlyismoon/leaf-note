/** Small check used as the non-color selected indicator. */
export function SelectionIndicator() {
  return (
    <svg
      className="selectable__indicator"
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path
        d="M2.4 6.3 5 8.8 9.6 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
