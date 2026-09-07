import type { CareEvent } from '../types';
import { plants } from '../data/plants';

const STORAGE_KEY = 'leafnote-care-events-v2';

type StoredData = {
  careEvents: CareEvent[];
};

const plantIds = new Set(plants.map((plant) => plant.id));

function readStorage(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { careEvents: [] };
    }
    const parsed = JSON.parse(raw) as StoredData;
    if (!Array.isArray(parsed.careEvents)) {
      return { careEvents: [] };
    }
    return {
      careEvents: parsed.careEvents.filter((event) =>
        plantIds.has(event.plantId),
      ),
    };
  } catch {
    return { careEvents: [] };
  }
}

function writeStorage(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadCareEvents(): CareEvent[] {
  return readStorage().careEvents;
}

export function saveCareEvents(events: CareEvent[]): void {
  writeStorage({ careEvents: events });
}

export function addCareEvent(event: CareEvent): CareEvent[] {
  const events = loadCareEvents();
  const updated = [event, ...events];
  saveCareEvents(updated);
  return updated;
}

/**
 * Illustrative seed events for first-time prototype use.
 * Fictional timestamps — mock prototype content, not research data.
 * They support recent-activity display only; they do not claim botanical need.
 */
export function getSeedCareEvents(): CareEvent[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      id: 'seed-1',
      plantId: 'succulent-desk',
      type: 'checked',
      timestamp: new Date(now - 4 * day).toISOString(),
    },
    {
      id: 'seed-2',
      plantId: 'succulent-desk',
      type: 'watered',
      timestamp: new Date(now - 11 * day).toISOString(),
    },
    {
      id: 'seed-3',
      plantId: 'succulent-shelf',
      type: 'checked',
      timestamp: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'seed-4',
      plantId: 'succulent-shelf',
      type: 'watered',
      timestamp: new Date(now - 8 * day).toISOString(),
    },
  ];
}

export function initializeCareEventsIfEmpty(): CareEvent[] {
  const existing = loadCareEvents();
  if (existing.length > 0) {
    return existing;
  }
  const seed = getSeedCareEvents();
  saveCareEvents(seed);
  return seed;
}
