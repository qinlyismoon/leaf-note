import type { Handoff, HandoffStatus } from '../types';

const STORAGE_KEY = 'leafnote-handoffs-v1';

type StoredData = {
  handoffs: Handoff[];
};

function isHandoff(value: unknown): value is Handoff {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Partial<Handoff>;
  return (
    typeof item.id === 'string' &&
    typeof item.ownerId === 'string' &&
    typeof item.caregiverUserId === 'string' &&
    typeof item.caregiverEmail === 'string' &&
    Array.isArray(item.plantIds) &&
    typeof item.status === 'string' &&
    typeof item.createdAt === 'string' &&
    typeof item.updatedAt === 'string'
  );
}

function readAll(): Handoff[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredData;
    if (!Array.isArray(parsed.handoffs)) {
      return [];
    }
    return parsed.handoffs.filter(isHandoff);
  } catch {
    return [];
  }
}

function writeAll(handoffs: Handoff[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ handoffs }));
}

export function loadHandoffs(): Handoff[] {
  return readAll();
}

export function saveHandoffs(handoffs: Handoff[]): void {
  writeAll(handoffs);
}

/** Plants already on a pending or accepted handoff. */
export function getBlockedPlantIds(handoffs: Handoff[] = readAll()): Set<string> {
  const blocked = new Set<string>();
  for (const handoff of handoffs) {
    if (handoff.status === 'pending' || handoff.status === 'accepted') {
      handoff.plantIds.forEach((id) => blocked.add(id));
    }
  }
  return blocked;
}

export function getActiveHandoffForPlant(
  plantId: string,
  handoffs: Handoff[] = readAll(),
): Handoff | undefined {
  return handoffs.find(
    (handoff) =>
      (handoff.status === 'pending' || handoff.status === 'accepted') &&
      handoff.plantIds.includes(plantId),
  );
}

export function createHandoff(input: {
  ownerId: string;
  caregiverUserId: string;
  caregiverEmail: string;
  plantIds: string[];
}): Handoff {
  const now = new Date().toISOString();
  const handoff: Handoff = {
    id: crypto.randomUUID(),
    ownerId: input.ownerId,
    caregiverUserId: input.caregiverUserId,
    caregiverEmail: input.caregiverEmail,
    plantIds: [...input.plantIds],
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  writeAll([handoff, ...readAll()]);
  return handoff;
}

function setStatus(handoffId: string, status: HandoffStatus): Handoff | null {
  const handoffs = readAll();
  const index = handoffs.findIndex((item) => item.id === handoffId);
  if (index < 0) {
    return null;
  }
  const previous = handoffs[index];
  const expected = status === 'ended' ? 'accepted' : 'pending';
  if (previous.status !== expected) return null;
  const updated: Handoff = {
    ...handoffs[index],
    status,
    ...(status === 'accepted' ? { acceptedAt: new Date().toISOString() } : {}),
    updatedAt: new Date().toISOString(),
  };
  handoffs[index] = updated;
  writeAll(handoffs);
  return updated;
}

export function acceptHandoff(handoffId: string): Handoff | null {
  return setStatus(handoffId, 'accepted');
}

export function declineHandoff(handoffId: string): Handoff | null {
  return setStatus(handoffId, 'declined');
}

export function cancelHandoff(handoffId: string): Handoff | null {
  return setStatus(handoffId, 'cancelled');
}

export function endHandoff(handoffId: string): Handoff | null {
  return setStatus(handoffId, 'ended');
}

export function removeHandoffsForPlant(plantId: string): Handoff[] {
  const next = readAll()
    .map((handoff) => ({
      ...handoff,
      plantIds: handoff.plantIds.filter((id) => id !== plantId),
    }))
    .filter((handoff) => handoff.plantIds.length > 0);
  writeAll(next);
  return next;
}

export function getOwnerActiveHandoffs(
  ownerId: string,
  handoffs: Handoff[] = readAll(),
): Handoff[] {
  return handoffs.filter(
    (handoff) =>
      handoff.ownerId === ownerId &&
      (handoff.status === 'pending' || handoff.status === 'accepted'),
  );
}

export function getAcceptedSharedPlantIds(
  userId: string,
  handoffs: Handoff[] = readAll(),
): string[] {
  const ids: string[] = [];
  for (const handoff of handoffs) {
    if (handoff.status !== 'accepted') {
      continue;
    }
    if (handoff.caregiverUserId === userId || handoff.ownerId === userId) {
      ids.push(...handoff.plantIds);
    }
  }
  return Array.from(new Set(ids));
}

/** Pending incoming requests for the current caregiver. */
export function getIncomingPendingHandoffs(
  caregiverUserId: string,
  handoffs: Handoff[] = readAll(),
): Handoff[] {
  return handoffs
    .filter(
      (handoff) =>
        handoff.status === 'pending' &&
        handoff.caregiverUserId === caregiverUserId,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Plants the current user may act on in Shared (caregiver only). */
export function getSharedActionablePlantIds(
  userId: string,
  handoffs: Handoff[] = readAll(),
): string[] {
  const ids: string[] = [];
  for (const handoff of handoffs) {
    if (
      handoff.status === 'accepted' &&
      handoff.caregiverUserId === userId
    ) {
      ids.push(...handoff.plantIds);
    }
  }
  return Array.from(new Set(ids));
}
