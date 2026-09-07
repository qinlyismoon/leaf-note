export function ProfilePlaceholder() {
  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <h1 className="page-header__title">Profile</h1>
      </header>

      <div className="profile-card">
        <div className="profile-card__avatar" aria-hidden="true">
          LN
        </div>
        <div className="profile-card__meta">
          <p className="profile-card__name">Leafnote explorer</p>
          <p className="profile-card__role">
            Personal care · Shared temporary care
          </p>
        </div>
      </div>

      <ul className="profile-rows" aria-label="Local settings">
        <li className="profile-rows__item">
          <span>Local data</span>
          <span className="profile-rows__muted">Stored on this device</span>
        </li>
      </ul>
    </div>
  );
}
