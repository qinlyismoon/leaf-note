import type { PrototypeUser } from '../types';

/**
 * Seeded prototype users for local Handoff simulation.
 * Emails are matched locally only — no outbound delivery.
 */
export const PROTOTYPE_USERS: PrototypeUser[] = [
  {
    id: 'user-maya',
    displayName: 'Maya',
    email: 'maya@leafnote.local',
    initials: 'MY',
  },
  {
    id: 'user-jordan',
    displayName: 'Jordan',
    email: 'jordan@leafnote.local',
    initials: 'JD',
  },
];

export const DEFAULT_USER_ID = 'user-maya';

export function getPrototypeUser(userId: string): PrototypeUser | undefined {
  return PROTOTYPE_USERS.find((user) => user.id === userId);
}

export function findUserByEmail(email: string): PrototypeUser | undefined {
  const normalized = normalizeEmail(email);
  return PROTOTYPE_USERS.find((user) => user.email === normalized);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmailFormat(email: string): boolean {
  const value = email.trim();
  // Basic prototype validation — not full RFC compliance.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
