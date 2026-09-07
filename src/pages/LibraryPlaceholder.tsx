import { plants } from '../data/plants';

export function LibraryPlaceholder() {
  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <h1 className="page-header__title">Library</h1>
      </header>

      <div className="library-preview" aria-label="Plant instances">
        <div className="library-preview__shelf">
          {plants.map((plant) => (
            <div key={plant.id} className="library-preview__pot">
              <span className="library-preview__silhouette" aria-hidden="true" />
              <span className="library-preview__name">{plant.name}</span>
              {plant.identificationLabel && (
                <span className="library-preview__label">
                  {plant.identificationLabel}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="library-preview__ledge" aria-hidden="true" />
      </div>
    </div>
  );
}
