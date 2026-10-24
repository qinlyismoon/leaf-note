import type { CareEvent } from '../types';
import { SEED_INSTANCE_IDS } from '../data/plants';
import { DEFAULT_USER_ID } from '../data/users';
import { getRemovedSeedIds } from './plantInstances';

const STORAGE_KEY = 'leafnote-care-events-v3';
const LEGACY_KEY = 'leafnote-care-events-v2';

type StoredData = {
  careEvents: CareEvent[];
};

function isCareEvent(value: unknown): value is CareEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const event = value as Partial<CareEvent>;
  return (
    typeof event.id === 'string' &&
    typeof event.plantId === 'string' &&
    typeof event.type === 'string' &&
    typeof event.timestamp === 'string'
  );
}

function migrateLegacyEvents(raw: unknown): CareEvent[] {
  if (!raw || typeof raw !== 'object') {
    return [];
  }
  const parsed = raw as { careEvents?: unknown };
  if (!Array.isArray(parsed.careEvents)) {
    return [];
  }
  return parsed.careEvents.filter(isCareEvent).map((event) => ({
    ...event,
    actorUserId:
      typeof (event as CareEvent).actorUserId === 'string'
        ? (event as CareEvent).actorUserId
        : DEFAULT_USER_ID,
  }));
}

function readAllEvents(): CareEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredData;
      if (!Array.isArray(parsed.careEvents)) {
        return [];
      }
      return parsed.careEvents.filter(isCareEvent).map((event) => ({
        ...event,
        actorUserId: event.actorUserId || DEFAULT_USER_ID,
      }));
    }

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateLegacyEvents(JSON.parse(legacy));
      writeStorage({ careEvents: migrated });
      return migrated;
    }

    return [];
  } catch {
    return [];
  }
}

function writeStorage(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function activeSeedEvents(events: CareEvent[]): CareEvent[] {
  const removed = new Set(getRemovedSeedIds());
  return events.filter(
    (event) =>
      !SEED_INSTANCE_IDS.has(event.plantId) || !removed.has(event.plantId),
  );
}

export function loadCareEvents(): CareEvent[] {
  return activeSeedEvents(readAllEvents());
}

export function saveCareEvents(events: CareEvent[]): void {
  writeStorage({ careEvents: events });
}

export function addCareEvent(event: CareEvent): CareEvent[] {
  const events = readAllEvents();
  const updated = [event, ...events];
  saveCareEvents(updated);
  return loadCareEvents();
}

export function addPhotoToCareEvent(eventId: string, photoDataUrl: string): CareEvent[] {
  const updated = readAllEvents().map((event) =>
    event.id === eventId ? { ...event, photoDataUrl } : event,
  );
  saveCareEvents(updated);
  return loadCareEvents();
}

export function removeCareEventsForPlant(plantId: string): CareEvent[] {
  const updated = readAllEvents().filter((event) => event.plantId !== plantId);
  saveCareEvents(updated);
  return loadCareEvents();
}

/**
 * Illustrative seed events for first-time prototype use.
 * Fictional timestamps — mock prototype content, not research data.
 */
/**
 * Older mock history so the activity calendar shows a realistic rhythm:
 * [days ago, outcome]. Mock prototype content, not participant data.
 */
const SEED_HISTORY: Record<string, [number, CareEvent['type']][]> = {
  'succulent-desk': [[15, 'checked'], [19, 'checked'], [24, 'watered'], [28, 'checked'], [33, 'not_sure'], [37, 'watered'], [45, 'checked'], [51, 'watered']],
  'succulent-shelf': [[5, 'checked'], [12, 'checked'], [16, 'watered'], [22, 'checked'], [27, 'watered'], [34, 'checked'], [40, 'watered']],
  'pothos-living-room': [[20, 'checked'], [27, 'watered'], [34, 'checked'], [41, 'watered'], [48, 'checked']],
  'monstera-window': [[16, 'checked'], [23, 'watered'], [30, 'checked'], [37, 'watered'], [44, 'checked']],
  'snake-plant-hallway': [[17, 'checked'], [38, 'checked'], [45, 'watered']],
};

/** A plausible daytime moment `days` ago (morning or early evening). */
function seedTime(now: number, days: number): string {
  const date = new Date(now - days * 24 * 60 * 60 * 1000);
  date.setHours(days % 3 === 0 ? 18 : 8 + (days % 3), (days * 13) % 60, 0, 0);
  return date.toISOString();
}

export function getSeedCareEvents(): CareEvent[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const history: CareEvent[] = Object.entries(SEED_HISTORY).flatMap(([plantId, entries]) =>
    entries.map(([days, type]) => ({
      id: `seed-h-${plantId}-${days}`,
      plantId,
      type,
      actorUserId: DEFAULT_USER_ID,
      timestamp: seedTime(now, days),
    })),
  );

  const recent: CareEvent[] = [
    {
      id: 'seed-1',
      plantId: 'succulent-desk',
      type: 'checked',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 4 * day).toISOString(),
    },
    {
      id: 'seed-2',
      plantId: 'succulent-desk',
      type: 'watered',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 11 * day).toISOString(),
    },
    {
      id: 'seed-3',
      plantId: 'succulent-shelf',
      type: 'checked',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'seed-4',
      plantId: 'succulent-shelf',
      type: 'watered',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 8 * day).toISOString(),
    },
    // Pothos: weekly check, last done 9 days ago — starts Overdue.
    // (Desk Echeveria, checked 4 days ago on a 4-day rhythm, starts Check today.)
    {
      id: 'seed-5',
      plantId: 'pothos-living-room',
      type: 'checked',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 9 * day).toISOString(),
    },
    {
      id: 'seed-6',
      plantId: 'pothos-living-room',
      type: 'watered',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 13 * day).toISOString(),
    },
    // Monstera: watered recently.
    {
      id: 'seed-7',
      plantId: 'monstera-window',
      type: 'watered',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'seed-8',
      plantId: 'monstera-window',
      type: 'checked',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 9 * day).toISOString(),
    },
    // Snake plant: checked, soil still dry enough — no water for weeks.
    {
      id: 'seed-9',
      plantId: 'snake-plant-hallway',
      type: 'checked',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 3 * day).toISOString(),
    },
    {
      id: 'seed-10',
      plantId: 'snake-plant-hallway',
      type: 'watered',
      actorUserId: DEFAULT_USER_ID,
      timestamp: new Date(now - 24 * day).toISOString(),
    },
  ];

  // Recent seed events use the same daytime clock as the history.
  return [
    ...recent.map((event) => ({
      ...event,
      timestamp: seedTime(now, Math.round((now - new Date(event.timestamp).getTime()) / day)),
    })),
    ...history,
  ];
}

/**
 * Browsers that already saved care events get seed history they are missing:
 * recent seed events only for seed plants with no events at all, and the
 * older `seed-h-*` history whenever its id is absent. Never duplicates an id.
 */
function backfillSeedEvents(): void {
  const events = readAllEvents();
  const knownIds = new Set(events.map((event) => event.id));
  const plantsWithEvents = new Set(events.map((event) => event.plantId));
  const missing = getSeedCareEvents().filter(
    (event) =>
      !knownIds.has(event.id) &&
      (event.id.startsWith('seed-h-') || !plantsWithEvents.has(event.plantId)),
  );
  // Older builds stored recent seed events at the moment of first load (often
  // past midnight); move those to the same daytime clock as the history.
  const now = Date.now();
  let retimed = false;
  const normalized = events.map((event) => {
    const hour = new Date(event.timestamp).getHours();
    if (!/^seed-\d+$/.test(event.id) || (hour >= 7 && hour <= 21)) return event;
    retimed = true;
    const days = Math.max(0, Math.round((now - new Date(event.timestamp).getTime()) / (24 * 60 * 60 * 1000)));
    return { ...event, timestamp: seedTime(now, days) };
  });
  if (missing.length > 0 || retimed) {
    saveCareEvents([...normalized, ...missing]);
  }
}

export function initializeCareEventsIfEmpty(): CareEvent[] {
  const existing = loadCareEvents();
  if (
    existing.length > 0 ||
    localStorage.getItem(STORAGE_KEY) !== null ||
    localStorage.getItem(LEGACY_KEY) !== null
  ) {
    backfillSeedEvents();
    return loadCareEvents();
  }

  const seed = getSeedCareEvents();
  saveCareEvents(seed);
  return loadCareEvents();
}
