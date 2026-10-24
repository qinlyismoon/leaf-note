import type { ReactElement } from 'react';

/**
 * Illustrated avatars for the two demo people, so they're told apart at a
 * glance (not only by initials). Original flat drawings; anyone else falls
 * back to initials.
 */
export function MayaArt() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="avatar-art">
      <rect width="40" height="40" fill="#f4d8c4" />
      <circle cx="20" cy="9" r="4.6" fill="#3b2a22" />
      <path d="M8 40c1-8 6-12 12-12s11 4 12 12z" fill="#2f5a3c" />
      <path d="M17 26h6v4h-6z" fill="#e2ad8c" />
      <ellipse cx="20" cy="19" rx="7.2" ry="8" fill="#e8b897" />
      <path d="M12.6 19c-.6-6 2.8-10 7.4-10s8 4 7.4 10c-1.6-3.4-4-5.4-7.4-5.6-3.4.2-5.8 2.2-7.4 5.6z" fill="#3b2a22" />
      <circle cx="17.2" cy="20" r="0.9" fill="#3b2a22" />
      <circle cx="22.8" cy="20" r="0.9" fill="#3b2a22" />
      <path d="M18 23.6c1.2.9 2.8.9 4 0" stroke="#b56e57" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <circle cx="15.6" cy="22.2" r="1.2" fill="#f0a08c" opacity="0.45" />
      <circle cx="24.4" cy="22.2" r="1.2" fill="#f0a08c" opacity="0.45" />
    </svg>
  );
}

export function JordanArt() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="avatar-art">
      <rect width="40" height="40" fill="#d5e4ee" />
      <path d="M8 40c1-8 6-12 12-12s11 4 12 12z" fill="#c9a24a" />
      <path d="M16.5 32l3.5 3 3.5-3" stroke="#fff" strokeOpacity="0.6" strokeWidth="1" fill="none" />
      <path d="M17 26h6v4h-6z" fill="#b57c55" />
      <ellipse cx="20" cy="19.5" rx="7" ry="7.8" fill="#c48a60" />
      <g fill="#2a2522">
        <circle cx="14" cy="15" r="2.6" /><circle cx="17" cy="12" r="2.8" /><circle cx="20.5" cy="11" r="2.9" />
        <circle cx="24" cy="12.2" r="2.7" /><circle cx="26.4" cy="15.2" r="2.4" /><circle cx="13" cy="18" r="1.8" />
        <circle cx="27" cy="18" r="1.8" />
      </g>
      <circle cx="17.2" cy="20.4" r="0.9" fill="#2a2522" />
      <circle cx="22.8" cy="20.4" r="0.9" fill="#2a2522" />
      <path d="M17.8 23.8c1.3 1 3.1 1 4.4 0" stroke="#7d4a32" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Drawn avatar for a demo person (by name or initials), or null. */
export function avatarArtFor(name: string, initials?: string): ReactElement | null {
  const key = `${name.trim().toLowerCase()}|${(initials ?? '').trim().toUpperCase()}`;
  if (key.startsWith('maya|') || key.endsWith('|MY')) return <MayaArt />;
  if (key.startsWith('jordan|') || key.endsWith('|JD')) return <JordanArt />;
  return null;
}
