import type { CareEvent } from '../types';
import { SPECIES_CARE } from '../data/speciesCare';

/**
 * When a plant should next be checked, from its species rhythm and the last
 * Checked / Watered record (Not sure does not count — the question is still
 * open). Three states, shared by Care and Library:
 * - overdue: the check day passed at least one day ago
 * - today:   the check falls on today (or the plant has never been checked)
 * - later:   nothing to do yet
 */
export type CheckStatus =
  | { kind: 'overdue'; days: number }
  | { kind: 'today' }
  | { kind: 'later'; days: number };

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function checkIntervalDays(speciesId: string): number {
  return SPECIES_CARE[speciesId]?.intervalDays ?? 7;
}

export function getCheckStatus(
  plantId: string,
  speciesId: string,
  events: CareEvent[],
  now: Date = new Date(),
): CheckStatus {
  const last = events
    .filter((e) => e.plantId === plantId && (e.type === 'checked' || e.type === 'watered'))
    .reduce<CareEvent | null>(
      (latest, e) => (!latest || e.timestamp > latest.timestamp ? e : latest),
      null,
    );
  if (!last) return { kind: 'today' };
  const due = startOfDay(new Date(last.timestamp)) + checkIntervalDays(speciesId) * DAY;
  const diff = Math.round((due - startOfDay(now)) / DAY);
  if (diff < 0) return { kind: 'overdue', days: -diff };
  if (diff === 0) return { kind: 'today' };
  return { kind: 'later', days: diff };
}

export function isCheckNeeded(status: CheckStatus): boolean {
  return status.kind !== 'later';
}

/** Chip text, or null when there's nothing to flag. */
export function checkStatusLabel(status: CheckStatus): string | null {
  if (status.kind === 'overdue') return 'Overdue';
  if (status.kind === 'today') return 'Check today';
  return null;
}

/** Quiet line for plants that don't need anything yet. */
export function nextCheckText(status: CheckStatus): string | null {
  if (status.kind !== 'later') return null;
  return status.days === 1 ? 'Next check tomorrow' : `Next check in ${status.days} days`;
}
