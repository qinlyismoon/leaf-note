import type {
  CareContext,
  CareEventType,
  PresentationState,
  PresentationStore,
} from '../types';
import { SEED_INSTANCES } from '../data/plants';
import { getRemovedSeedIds } from './plantInstances';

const STORAGE_KEY = 'leafnote-presentation-v1';

function defaultCareIds(): string[] {
  const removed = new Set(getRemovedSeedIds());
  return SEED_INSTANCES.filter(
    (plant) => plant.careConfigured && !removed.has(plant.id),
  ).map((plant) => plant.id);
}

/**
 * Personal owns seed Care plants. Shared starts empty until an incoming
 * handoff is accepted (presentation keys for shared plants appear on accept).
 */
function defaultStore(): PresentationStore {
  const ids = defaultCareIds();
  const personal: Record<string, PresentationState> = {};
  const shared: Record<string, PresentationState> = {};

  // Starting states for seed plants: two need a look, three were seen recently.
  const SEED_STATES: Record<string, PresentationState> = {
    'succulent-desk': 'suggested_check',
    'pothos-living-room': 'suggested_check',
    'succulent-shelf': 'recently_checked',
    'monstera-window': 'recently_checked',
    'snake-plant-hallway': 'recently_checked',
  };
  ids.forEach((id) => {
    personal[id] = SEED_STATES[id] ?? 'suggested_check';
  });

  return { personal, shared };
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
  const result: PresentationStore = {
    personal: { ...defaults.personal },
    shared: {},
  };

  (['personal', 'shared'] as CareContext[]).forEach((context) => {
    const bucket = input[context];
    if (!bucket || typeof bucket !== 'object') {
      return;
    }
    for (const [plantId, value] of Object.entries(bucket)) {
      if (isPresentationState(value)) {
        result[context][plantId] = value;
      }
    }
  });

  // Ensure personal defaults exist for active seeds missing from storage.
  defaultCareIds().forEach((id) => {
    if (!result.personal[id]) {
      result.personal[id] = defaults.personal[id] ?? 'suggested_check';
    }
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
  _context: CareContext,
  plantId: string,
  outcome: CareEventType,
): PresentationStore {
  const next: PresentationStore = {
    personal: { ...store.personal },
    shared: { ...store.shared },
  };

  if (outcome === 'checked' || outcome === 'watered') {
    next.personal[plantId] = 'recently_checked';
    next.shared[plantId] = 'recently_checked';
  }

  savePresentationStore(next);
  return next;
}

export function removePlantPresentation(
  plantId: string,
): PresentationStore {
  const store = loadPresentationStore();
  const next: PresentationStore = {
    personal: { ...store.personal },
    shared: { ...store.shared },
  };
  delete next.personal[plantId];
  delete next.shared[plantId];
  savePresentationStore(next);
  return next;
}

export function countSuggestedChecks(
  store: PresentationStore,
  context: CareContext,
  activePlantIds: string[],
): number {
  return activePlantIds.filter(
    (plantId) => store[context][plantId] !== 'recently_checked',
  ).length;
}

export function countAllSuggestedChecks(
  store: PresentationStore,
  personalPlantIds: string[],
  sharedPlantIds: string[],
): number {
  return (
    countSuggestedChecks(store, 'personal', personalPlantIds) +
    countSuggestedChecks(store, 'shared', sharedPlantIds)
  );
}
