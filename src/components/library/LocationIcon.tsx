import { findLocation, type PlantLocationId } from '../../data/locations';

/** Line icons for location tags — same 24px / 1.7 stroke family as NavIcon. */
const PATHS: Record<PlantLocationId | 'other', string[]> = {
  desk: ['M3 8.5h18', 'M5 8.5V19', 'M19 8.5V19', 'M12.5 8.5v5.5H19', 'M15 11.25h1.5'],
  shelf: ['M4 3.5v17', 'M20 3.5v17', 'M4 9.5h16', 'M4 15.5h16', 'M7.5 9.5V6', 'M10 9.5V6.5', 'M14 15.5l1.5-3.5'],
  'living-room': [
    'M5.5 11V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3',
    'M3 13a2 2 0 0 1 4 0v1.5h10V13a2 2 0 0 1 4 0v4.5H3z',
    'M5 17.5V20',
    'M19 17.5V20',
  ],
  window: ['M5 3.5h14v17H5z', 'M12 3.5v17', 'M5 12h14'],
  bedroom: ['M3 19V6', 'M3 14.5h18V19', 'M3 11.5h6.5v3', 'M9.5 11h8a3.5 3.5 0 0 1 3.5 3.5'],
  kitchen: ['M5 10h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z', 'M3 10h2', 'M19 10h2', 'M9 5.5v2', 'M12 4.5v3', 'M15 5.5v2'],
  bathroom: ['M3 12h18v1.5a5.5 5.5 0 0 1-5.5 5.5h-7A5.5 5.5 0 0 1 3 13.5z', 'M6 12V6.5a2 2 0 0 1 4 0', 'M7 19l-1 2', 'M17 19l1 2'],
  hallway: ['M6.5 20.5V4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16', 'M4 20.5h16', 'M14.5 12.5h.01'],
  balcony: ['M3 10h18', 'M3 20h18', 'M5.5 10v10', 'M10 10v10', 'M14 10v10', 'M18.5 10v10', 'M8 10V7.5a4 4 0 0 1 8 0V10'],
  other: ['M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z', 'M12 12.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z'],
};

type LocationIconProps = {
  /** A preset id, or any stored location text (matched to a preset). */
  location: string | undefined;
  className?: string;
};

export function LocationIcon({ location, className = '' }: LocationIconProps) {
  const preset = (PATHS as Record<string, string[]>)[location ?? '']
    ? (location as PlantLocationId)
    : findLocation(location)?.id;
  const paths = PATHS[preset ?? 'other'];
  return (
    <svg
      className={`location-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
