import type {
  CareContext,
  CareEventType,
  PresentationState,
  PresentationStore,
} from '../types';
import { plants } from '../data/plants';

const STORAGE_KEY = 'leafnote-presentation-v1';

function defaultStore(): PresentationStore {
  return {
    personal: {
      'succulent-desk': 'suggested_check',
      'succulent-shelf': 'recently_checked',
    },
    shared: {
      'succulent-desk': 'suggested_check',
      'succulent-shelf': 'recently_checked',
    },
  };
}

function isPresentationState(value: unknown): value is PresentationState {
  return value === 'suggested_check' || value === 'recently_checked';
}

function normalizeStore(raw: unknown): PresentationStore {
  const defaults = defaultStore();
  if (!raw || typeof raw !== 'object') {
    return defaults;
  }

  const input = raw as Partial<PresentationStore>;
  const result = defaultStore();

  (['personal', 'shared'] as CareContext[]).forEach((context) => {
    const bucket = input[context];
    if (!bucket || typeof bucket !== 'object') {
      return;
    }
    plants.forEach((plant) => {
      const value = bucket[plant.id];
      if (isPresentationState(value)) {
        result[context][plant.id] = value;
      }
    });
  });

  return result;
}

export function loadPresentationStore(): PresentationStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = defaultStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return normalizeStore(JSON.parse(raw));
  } catch {
    return defaultStore();
  }
}

export function savePresentationStore(store: PresentationStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * Working hypothesis (DESIGN.md): Checked / Watered resolve the suggested
 * check; Not sure keeps it unresolved.
 */
export function applyRecordToPresentation(
  store: PresentationStore,
  context: CareContext,
  plantId: string,
  outcome: CareEventType,
): PresentationStore {
  const next: PresentationStore = {
    personal: { ...store.personal },
    shared: { ...store.shared },
  };

  if (outcome === 'checked' || outcome === 'watered') {
    next[context] = {
      ...next[context],
      [plantId]: 'recently_checked',
    };
  }
  // not_sure: leave presentation state unchanged

  savePresentationStore(next);
  return next;
}

export function countSuggestedChecks(
  store: PresentationStore,
  context: CareContext,
): number {
  return plants.filter(
    (plant) => store[context][plant.id] === 'suggested_check',
  ).length;
}

export function countAllSuggestedChecks(store: PresentationStore): number {
  return (
    countSuggestedChecks(store, 'personal') +
    countSuggestedChecks(store, 'shared')
  );
}
