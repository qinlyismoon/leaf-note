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
 * Portfolio case-study links pass `?user=maya|jordan`, optional `?embed=1`,
 * and `?reset=1` to start from the demo's opening state. Apply once before React mounts so the first paint is correct.
 */
export function applyEmbedQueryOnBoot(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  // `?reset=1` (the portfolio's "Try the prototype" link): start every
  // visit from the demo's opening state, then drop the flag so a reload
  // keeps whatever the visitor has done since.
  if (params.get('reset') === '1') {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('leafnote-'))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      // Storage unavailable: nothing to clear.
    }
    params.delete('reset');
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }
  const userId = resolveUserParam(params.get('user'));
  if (userId) {
    setCurrentUserId(userId);
  }
  if (params.get('embed') === '1') {
    document.documentElement.dataset.embed = '1';
  }
}
