/**
 * Preset spots a plant can live. Location is picked from these tags (with an
 * icon each) rather than typed. A tray is NOT a location — it's a pot setup,
 * recorded separately as hasTray.
 */
export type PlantLocationId =
  | 'desk'
  | 'shelf'
  | 'living-room'
  | 'window'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'hallway'
  | 'balcony';

export type PlantLocation = { id: PlantLocationId; label: string };

export const PLANT_LOCATIONS: PlantLocation[] = [
  { id: 'desk', label: 'Desk' },
  { id: 'shelf', label: 'Shelf' },
  { id: 'living-room', label: 'Living room' },
  { id: 'window', label: 'Window' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'hallway', label: 'Hallway' },
  { id: 'balcony', label: 'Balcony' },
];

const ALIASES: Record<string, PlantLocationId> = {
  'by the window': 'window',
  windowsill: 'window',
  'window sill': 'window',
  bookshelf: 'shelf',
  lounge: 'living-room',
  livingroom: 'living-room',
  hall: 'hallway',
  entryway: 'hallway',
  bath: 'bathroom',
  'study desk': 'desk',
};

/** Matches stored free text (older entries) to a preset tag, if possible. */
export function findLocation(value: string | undefined): PlantLocation | undefined {
  const key = value?.trim().toLowerCase();
  if (!key) return undefined;
  const id = ALIASES[key];
  return PLANT_LOCATIONS.find((loc) => loc.id === id || loc.label.toLowerCase() === key);
}

/** Canonical label for a stored location (preset label, else trimmed text). */
export function normalizeLocation(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return findLocation(trimmed)?.label ?? trimmed;
}
