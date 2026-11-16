import { getPrototypeUser } from './data/users';
import { setCurrentUserId } from './storage/profile';

/** Map short names and full ids to a prototype user id. */
export function resolveUserParam(raw: string | null): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  const aliases: Record<string, string> = {
    maya: 'user-maya',
    jordan: 'user-jordan',
    'user-maya': 'user-maya',
    'user-jordan': 'user-jordan',
  };
  const id = aliases[key] ?? null;
  return id && getPrototypeUser(id) ? id : null;
}

/**
 * Portfolio case-study embeds pass `?user=maya|jordan` and optional
 * `?embed=1`. Apply once before React mounts so the first paint is correct.
 */
export function applyEmbedQueryOnBoot(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const userId = resolveUserParam(params.get('user'));
  if (userId) {
    setCurrentUserId(userId);
  }
  if (params.get('embed') === '1') {
    document.documentElement.dataset.embed = '1';
  }
}
