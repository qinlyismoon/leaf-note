import type { CareEventType, RelationshipUpdate } from '../types';

const STORAGE_KEY = 'leafnote-relationship-updates-v1';

type StoredData = {
  updates: RelationshipUpdate[];
};

function isUpdate(value: unknown): value is RelationshipUpdate {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Partial<RelationshipUpdate>;
  return (
    typeof item.id === 'string' &&
    typeof item.kind === 'string' &&
    typeof item.recipientUserId === 'string' &&
    typeof item.actorUserId === 'string' &&
    typeof item.message === 'string' &&
    typeof item.createdAt === 'string' &&
    (item.readAt === null || typeof item.readAt === 'string')
  );
}

function readAll(): RelationshipUpdate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredData;
    if (!Array.isArray(parsed.updates)) {
      return [];
    }
    return parsed.updates.filter(isUpdate);
  } catch {
    return [];
  }
}

function writeAll(updates: RelationshipUpdate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ updates }));
}

export function loadRelationshipUpdates(): RelationshipUpdate[] {
  return readAll();
}

export function getUpdatesForUser(
  userId: string,
  updates: RelationshipUpdate[] = readAll(),
): RelationshipUpdate[] {
  return updates
    .filter((item) => item.recipientUserId === userId || (
      item.kind === 'care_activity' && item.actorUserId === userId
        && (item.reactionUserId || item.replies?.length)
    ))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function toggleUpdateReaction(updateId: string, userId: string): RelationshipUpdate[] {
  const next = readAll().map((item) => item.id !== updateId ? item : (
    item.reactionUserId === userId
      ? { ...item, reactionUserId: undefined, reactionAt: undefined }
      : { ...item, reactionUserId: userId, reactionAt: new Date().toISOString() }
  ));
  writeAll(next);
  return next;
}

export function addUpdateReply(updateId: string, userId: string, text: string): RelationshipUpdate[] {
  const trimmed = text.trim();
  if (!trimmed) return readAll();
  const reply = { id: crypto.randomUUID(), userId, text: trimmed, createdAt: new Date().toISOString() };
  const next = readAll().map((item) => item.id !== updateId ? item
    : { ...item, replies: [...(item.replies ?? []), reply] });
  writeAll(next);
  return next;
}

export function markUpdateRead(updateId: string): RelationshipUpdate[] {
  const now = new Date().toISOString();
  const next = readAll().map((item) => item.id === updateId && !item.readAt ? { ...item, readAt: now } : item);
  writeAll(next);
  return next;
}

export function formatCareReminderMessage(input: { ownerName: string; plantName: string }): string {
  return `${input.ownerName} asked you to check ${input.plantName}`;
}

export function countUnreadUpdates(
  userId: string,
  updates: RelationshipUpdate[] = readAll(),
): number {
  return getUpdatesForUser(userId, updates).filter((item) => !item.readAt)
    .length;
}

export function addRelationshipUpdate(
  input: Omit<RelationshipUpdate, 'id' | 'createdAt' | 'readAt'> & {
    id?: string;
    createdAt?: string;
    readAt?: string | null;
  },
): RelationshipUpdate[] {
  const update: RelationshipUpdate = {
    id: input.id ?? crypto.randomUUID(),
    kind: input.kind,
    recipientUserId: input.recipientUserId,
    actorUserId: input.actorUserId,
    handoffId: input.handoffId,
    careEventId: input.careEventId,
    plantId: input.plantId,
    plantIds: input.plantIds,
    message: input.message,
    createdAt: input.createdAt ?? new Date().toISOString(),
    readAt: input.readAt ?? null,
    reactionUserId: input.reactionUserId,
    reactionAt: input.reactionAt,
  };
  const next = [update, ...readAll()];
  writeAll(next);
  return next;
}

/** Mark currently listed inbox items as read when the inbox opens. */
export function markUpdatesReadForUser(userId: string): RelationshipUpdate[] {
  const now = new Date().toISOString();
  const next = readAll().map((item) =>
    item.recipientUserId === userId && !item.readAt
      ? { ...item, readAt: now }
      : item,
  );
  writeAll(next);
  return next;
}

export function removeUpdatesForPlant(plantId: string): RelationshipUpdate[] {
  const next = readAll().filter(
    (item) =>
      item.plantId !== plantId &&
      !(item.plantIds && item.plantIds.includes(plantId)),
  );
  writeAll(next);
  return next;
}

export function formatCareActivityMessage(input: {
  caregiverName: string;
  plantName: string;
  type: CareEventType;
}): string {
  const { caregiverName, plantName, type } = input;
  if (type === 'checked') {
    return `${caregiverName} checked ${plantName} — no water needed`;
  }
  if (type === 'watered') {
    return `${caregiverName} watered ${plantName}`;
  }
  return `${caregiverName} recorded not sure for ${plantName}`;
}

export function formatHandoffRequestMessage(input: {
  ownerName: string;
  plantCount: number;
}): string {
  const noun = input.plantCount === 1 ? 'plant' : 'plants';
  return `${input.ownerName} invited you to care for ${input.plantCount} ${noun}`;
}

/** Preserve invitation history while clearing an obsolete request's unread state. */
export function resolveHandoffUpdates(handoffId: string): void {
  const now = new Date().toISOString();
  writeAll(readAll().map(item => item.handoffId === handoffId && !item.readAt
    ? { ...item, readAt: now } : item));
}
