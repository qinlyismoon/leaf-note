import { avatarArtFor } from './AvatarArt';
type IdentityAvatarProps = {
  name: string;
  initials?: string;
  className?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

/**
 * Circular identity avatar: an illustrated avatar for the demo people
 * (Maya, Jordan), initials for anyone else. No photos.
 */
export function IdentityAvatar({
  name,
  initials,
  className,
}: IdentityAvatarProps) {
  const label = (initials?.trim() || initialsFromName(name)).slice(0, 2);
  const art = avatarArtFor(name, initials);

  return (
    <span
      className={['identity-avatar', art ? 'has-art' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {art ?? label}
    </span>
  );
}
