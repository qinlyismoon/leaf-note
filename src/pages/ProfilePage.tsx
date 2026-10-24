import { IdentityAvatar } from '../components/IdentityAvatar';
import type { PrototypeUser } from '../types';

type ProfilePageProps = {
  currentUser: PrototypeUser;
  users: PrototypeUser[];
  onSwitchUser: (userId: string) => void;
};

/**
 * Profile identity for local Handoff matching. Prototype accounts are fixed:
 * the email is shown, not edited; tapping the identity card switches to the
 * next prototype account.
 */
export function ProfilePage({ currentUser, users, onSwitchUser }: ProfilePageProps) {
  const nextUser = users[(users.findIndex((user) => user.id === currentUser.id) + 1) % users.length];

  return (
    <div className="placeholder-page screen screen--root">
      <header className="placeholder-page__header">
        <h1 className="page-header__title">Profile</h1>
      </header>

      <button type="button" className="profile-card"
        aria-label={`Switch profile to ${nextUser?.displayName ?? 'another user'}`}
        onClick={() => nextUser && onSwitchUser(nextUser.id)}>
        <IdentityAvatar name={currentUser.displayName} initials={currentUser.initials} className="profile-card__avatar" />
        <span className="profile-card__name">{currentUser.displayName}</span>
        <span className="profile-card__hint">Tap to switch profile</span>
      </button>

      <section className="profile-email" aria-labelledby="profile-account-heading">
        <h2 id="profile-account-heading" className="profile-group__title">
          Account
        </h2>
        <div className="profile-group">
          <div className="profile-group__row">
            <span className="profile-group__label">Email</span>
            <span className="profile-group__value">{currentUser.email}</span>
          </div>
          <div className="profile-group__row">
            <span className="profile-group__label">Local data</span>
            <span className="profile-group__value profile-group__value--muted">Stored on this device</span>
          </div>
        </div>
      </section>
    </div>
  );
}
