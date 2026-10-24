import { normalizeLocation } from '../data/locations';
import type { PlantInstance } from '../types';
import { SEED_INSTANCE_IDS, SEED_INSTANCES } from '../data/plants';
import { getSpecies } from '../data/species';
import { truncateLabelUnits } from '../utils/labelUnits';
import { IDENTIFICATION_LABEL_MAX } from '../types';

const STORAGE_KEY = 'leafnote-plant-instances-v1';

export type PlantInstanceFieldsInput = {
  location?: string;
  hasTray: boolean;
  identificationLabel?: string;
  /** Instance photo; empty string removes a user photo. */
  photoSrc?: string;
};

type SeedFieldOverrides = {
  location?: string;
  hasTray?: boolean;
  identificationLabel?: string;
  /** User-replaced photo for a seed plant ('' = use the seed photo). */
  photoSrc?: string;
};

type StoredData = {
  /** User-added instances only (not Desk/Shelf seeds). */
  userInstances: PlantInstance[];
  /** Field overrides for seed instances (location, tray, label). */
  seedOverrides: Record<string, SeedFieldOverrides>;
  /** Seed instances the user has removed (species presets remain). */
  removedSeedIds: string[];
};

/**
 * Earlier builds seeded Chinese identification labels. Browsers that saved an
 * edit of a seed plant kept those labels as overrides; the demo is English-only,
 * so known legacy labels are translated on read.
 */
const LEGACY_LABELS: Record<string, string> = {
  书桌: 'Desk',
  有托盘: 'Tray',
  托盘: 'Tray',
  客厅: 'Living room',
  窗边: 'Window',
  玄关: 'Hallway',
};

const CJK = /[\u3400-\u9fff]/;

function migrateLabel(label: string | undefined, fallback?: string): string | undefined {
  if (typeof label !== 'string') return label;
  const trimmed = label.trim();
  if (LEGACY_LABELS[trimmed]) return LEGACY_LABELS[trimmed];
  // Any other Chinese label on a seed plant falls back to the seed's English label.
  if (fallback !== undefined && CJK.test(trimmed)) return fallback;
  return label;
}

function emptyStore(): StoredData {
  return { userInstances: [], seedOverrides: {}, removedSeedIds: [] };
}

function isInstance(value: unknown): value is PlantInstance {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Partial<PlantInstance>;
  return (
    typeof item.id === 'string' &&
    typeof item.speciesId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.careConfigured === 'boolean'
  );
}

function normalizeInstance(value: PlantInstance): PlantInstance {
  const location =
    typeof value.location === 'string' ? normalizeLocation(value.location) ?? '' : '';
  const label =
    typeof value.identificationLabel === 'string'
      ? truncateLabelUnits(
          value.identificationLabel.trim(),
          IDENTIFICATION_LABEL_MAX,
        )
      : '';
  return {
    ...value,
    ownerId:
      typeof value.ownerId === 'string' && value.ownerId !== ''
        ? value.ownerId
        : 'user-maya',
    location: location === '' ? undefined : location,
    hasTray: Boolean(value.hasTray),
    identificationLabel: label === '' ? undefined : label,
    photoSrc:
      typeof value.photoSrc === 'string' && value.photoSrc !== ''
        ? value.photoSrc
        : undefined,
    careConfigured: Boolean(value.careConfigured),
  };
}

function normalizeFields(
  input: PlantInstanceFieldsInput,
): Pick<PlantInstance, 'location' | 'hasTray' | 'identificationLabel' | 'photoSrc'> {
  const location = normalizeLocation(input.location) ?? '';
  const label = input.identificationLabel
    ? truncateLabelUnits(
        input.identificationLabel.trim(),
        IDENTIFICATION_LABEL_MAX,
      )
    : '';
  return {
    location: location === '' ? undefined : location,
    hasTray: input.hasTray,
    identificationLabel: label === '' ? undefined : label,
    photoSrc: input.photoSrc ? input.photoSrc : undefined,
  };
}

function readStore(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore();
    }
    const parsed = JSON.parse(raw) as Partial<StoredData> & {
      /** Legacy label-only overrides — migrated on read. */
      seedLabelOverrides?: Record<string, string>;
    };
    const userInstances = Array.isArray(parsed.userInstances)
      ? parsed.userInstances
          .filter(
            (item) => isInstance(item) && !SEED_INSTANCE_IDS.has(item.id),
          )
          .map((item) =>
            normalizeInstance({
              ...item,
              identificationLabel: migrateLabel(item.identificationLabel),
            }),
          )
      : [];

    const seedOverrides: Record<string, SeedFieldOverrides> = {};
    if (parsed.seedOverrides && typeof parsed.seedOverrides === 'object') {
      for (const [id, value] of Object.entries(parsed.seedOverrides)) {
        if (!SEED_INSTANCE_IDS.has(id) || !value || typeof value !== 'object') {
          continue;
        }
        const next: SeedFieldOverrides = {};
        if (typeof value.location === 'string') {
          next.location = value.location;
        }
        if (typeof value.hasTray === 'boolean') {
          next.hasTray = value.hasTray;
        }
        if (typeof value.identificationLabel === 'string') {
          next.identificationLabel = migrateLabel(
            value.identificationLabel,
            SEED_INSTANCES.find((seed) => seed.id === id)?.identificationLabel ?? '',
          );
        }
        if (typeof value.photoSrc === 'string') {
          next.photoSrc = value.photoSrc;
        }
        seedOverrides[id] = next;
      }
    }

    // Backward-compatible migration from label-only overrides.
    if (
      parsed.seedLabelOverrides &&
      typeof parsed.seedLabelOverrides === 'object'
    ) {
      for (const [id, label] of Object.entries(parsed.seedLabelOverrides)) {
        if (!SEED_INSTANCE_IDS.has(id) || typeof label !== 'string') {
          continue;
        }
        seedOverrides[id] = {
          ...seedOverrides[id],
          identificationLabel: migrateLabel(
            label,
            SEED_INSTANCES.find((seed) => seed.id === id)?.identificationLabel ?? '',
          ),
        };
      }
    }

    return {
      userInstances,
      seedOverrides,
      removedSeedIds: Array.isArray(parsed.removedSeedIds)
        ? parsed.removedSeedIds.filter(
            (id): id is string =>
              typeof id === 'string' && SEED_INSTANCE_IDS.has(id),
          )
        : [],
    };
  } catch {
    return emptyStore();
  }
}

/** Thrown when local storage is full (photos are the large part). */
export class PlantStorageFullError extends Error {}

function writeStore(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new PlantStorageFullError('Local storage is full.');
    }
    throw error;
  }
}

function applySeedOverrides(
  seeds: PlantInstance[],
  overrides: Record<string, SeedFieldOverrides>,
): PlantInstance[] {
  return seeds.map((seed) => {
    const override = overrides[seed.id];
    if (!override) {
      return seed;
    }

    return normalizeInstance({
      ...seed,
      ...(override.location !== undefined
        ? { location: override.location }
        : {}),
      ...(override.hasTray !== undefined
        ? { hasTray: override.hasTray }
        : {}),
      ...(override.identificationLabel !== undefined
        ? {
            identificationLabel:
              override.identificationLabel === ''
                ? undefined
                : override.identificationLabel,
          }
        : {}),
      ...(override.photoSrc ? { photoSrc: override.photoSrc } : {}),
    });
  });
}

/** Merged Library instances: active seeds (with field overrides) + user-added. */
export function loadPlantInstances(): PlantInstance[] {
  const store = readStore();
  const removed = new Set(store.removedSeedIds);
  return [
    ...applySeedOverrides(SEED_INSTANCES, store.seedOverrides).filter(
      (seed) => !removed.has(seed.id),
    ),
    ...store.userInstances.map((instance) =>
      instance.careConfigured ? instance : { ...instance, careConfigured: true },
    ),
  ];
}

export function getRemovedSeedIds(): string[] {
  return readStore().removedSeedIds;
}

export function saveUserInstances(userInstances: PlantInstance[]): void {
  const store = readStore();
  writeStore({ ...store, userInstances });
}

export function updatePlantInstance(
  instanceId: string,
  input: PlantInstanceFieldsInput,
): PlantInstance[] {
  const fields = normalizeFields(input);
  const store = readStore();

  if (SEED_INSTANCE_IDS.has(instanceId)) {
    writeStore({
      ...store,
      seedOverrides: {
        ...store.seedOverrides,
        [instanceId]: {
          location: fields.location ?? '',
          hasTray: fields.hasTray,
          identificationLabel: fields.identificationLabel ?? '',
          // Only a photo different from the seed's own is stored.
          photoSrc:
            fields.photoSrc &&
            fields.photoSrc !== SEED_INSTANCES.find((seed) => seed.id === instanceId)?.photoSrc
              ? fields.photoSrc
              : '',
        },
      },
    });
    return loadPlantInstances();
  }

  const userInstances = store.userInstances.map((instance) =>
    instance.id === instanceId
      ? {
          ...instance,
          ...fields,
        }
      : instance,
  );
  writeStore({ ...store, userInstances });
  return loadPlantInstances();
}

export function addPlantInstance(input: {
  speciesId: string;
  location?: string;
  hasTray: boolean;
  identificationLabel?: string;
  photoSrc?: string;
  ownerId: string;
}): PlantInstance[] {
  const species = getSpecies(input.speciesId);
  if (!species) {
    return loadPlantInstances();
  }

  const fields = normalizeFields(input);
  const instance: PlantInstance = {
    id: crypto.randomUUID(),
    speciesId: species.id,
    name: species.nameEn,
    ownerId: input.ownerId,
    ...fields,
    careConfigured: true,
  };

  const store = readStore();
  const userInstances = [...store.userInstances, instance];
  writeStore({ ...store, userInstances });
  return loadPlantInstances();
}

/**
 * Remove one PlantInstance (never its PlantSpecies preset).
 * Caller should also clear care events and presentation for this id.
 */
export function removePlantInstance(instanceId: string): PlantInstance[] {
  const store = readStore();

  if (SEED_INSTANCE_IDS.has(instanceId)) {
    const removedSeedIds = Array.from(
      new Set([...store.removedSeedIds, instanceId]),
    );
    const seedOverrides = { ...store.seedOverrides };
    delete seedOverrides[instanceId];
    writeStore({
      ...store,
      removedSeedIds,
      seedOverrides,
    });
    return loadPlantInstances();
  }

  writeStore({
    ...store,
    userInstances: store.userInstances.filter(
      (instance) => instance.id !== instanceId,
    ),
  });
  return loadPlantInstances();
}
