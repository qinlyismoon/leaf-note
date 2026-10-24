/** The one clock icon for any time line (last checked, next check). */
export function TimeIcon({ size = 12 }: { size?: number }) {
  return (
    <svg className="time-icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
