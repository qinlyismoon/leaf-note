import type { CareEventType } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';

export function formatRelativeTime(
  timestamp: string,
  now: Date = new Date(),
): string {
  const then = new Date(timestamp);
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / msPerDay);

  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    if (diffHours <= 0) {
      return 'just now';
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  if (diffDays === 1) {
    return '1 day ago';
  }

  return `${diffDays} days ago`;
}

export function formatEventDate(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLastEventSummary(
  type: CareEventType,
  timestamp: string,
): string {
  const label = CARE_EVENT_HISTORY_LABELS[type];
  return `${label} · ${formatRelativeTime(timestamp)}`;
}
