import {
  DEFAULT_USER_ID,
  PROTOTYPE_USERS,
  getPrototypeUser,
  normalizeEmail,
} from '../data/users';
import type { PrototypeUser } from '../types';

const STORAGE_KEY = 'leafnote-profile-v1';

type StoredProfile = {
  currentUserId: string;
  /** Optional email overrides keyed by user id (still must stay unique). */
  emailOverrides: Record<string, string>;
};

function emptyProfile(): StoredProfile {
  return { currentUserId: DEFAULT_USER_ID, emailOverrides: {} };
}

function readProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyProfile();
    }
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    const currentUserId =
      typeof parsed.currentUserId === 'string' &&
      getPrototypeUser(parsed.currentUserId)
        ? parsed.currentUserId
        : DEFAULT_USER_ID;
    const emailOverrides: Record<string, string> = {};
    if (parsed.emailOverrides && typeof parsed.emailOverrides === 'object') {
      for (const [id, email] of Object.entries(parsed.emailOverrides)) {
        if (typeof email === 'string' && getPrototypeUser(id)) {
          emailOverrides[id] = normalizeEmail(email);
        }
      }
    }
    return { currentUserId, emailOverrides };
  } catch {
    return emptyProfile();
  }
}

function writeProfile(profile: StoredProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** Effective prototype user including any saved email override. */
export function resolveUser(userId: string): PrototypeUser | undefined {
  const base = getPrototypeUser(userId);
  if (!base) {
    return undefined;
  }
  const override = readProfile().emailOverrides[userId];
  if (!override) {
    return base;
  }
  return { ...base, email: override };
}

export function loadCurrentUserId(): string {
  return readProfile().currentUserId;
}

export function setCurrentUserId(userId: string): string {
  if (!getPrototypeUser(userId)) {
    return loadCurrentUserId();
  }
  const profile = readProfile();
  writeProfile({ ...profile, currentUserId: userId });
  return userId;
}

export function loadCurrentUser(): PrototypeUser {
  const id = loadCurrentUserId();
  return resolveUser(id) ?? PROTOTYPE_USERS[0];
}

export function saveUserEmail(userId: string, email: string): PrototypeUser {
  const profile = readProfile();
  const normalized = normalizeEmail(email);
  writeProfile({
    ...profile,
    emailOverrides: {
      ...profile.emailOverrides,
      [userId]: normalized,
    },
  });
  return resolveUser(userId) ?? getPrototypeUser(userId)!;
}

export function listPrototypeUsers(): PrototypeUser[] {
  return PROTOTYPE_USERS.map(
    (user) => resolveUser(user.id) ?? user,
  );
}

export function findResolvedUserByEmail(
  email: string,
): PrototypeUser | undefined {
  const normalized = normalizeEmail(email);
  return listPrototypeUsers().find((user) => user.email === normalized);
}
