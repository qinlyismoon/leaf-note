import type { CSSProperties } from 'react';
import type { PlantInstance } from '../../types';
import { getSpecies } from '../../data/species';
import { LocationIcon } from './LocationIcon';

type LibraryGridProps = {
  instances: PlantInstance[];
  onOpen: (instanceId: string) => void;
};

/**
 * Two-column photo grid. Each card shows the plant's own photo (or the
 * species illustration when there is none), a location tag, the common name
 * and the user's own label (what tells two plants of one species apart). One action per card: open it (Edit and care live on the
 * detail page). An odd last card spans the full width.
 */
export function LibraryGrid({ instances, onOpen }: LibraryGridProps) {
  if (instances.length === 0) {
    return <p className="empty-state">No plants here yet.</p>;
  }

  const lastIsWide = instances.length % 2 === 1;

  return (
      <ul className="library-grid" aria-label="Your plants">
        {instances.map((instance, index) => {
          const species = getSpecies(instance.speciesId);
          const name = species?.nameEn ?? instance.name;
          const rawLabel = instance.identificationLabel?.trim();
          const label =
            rawLabel && rawLabel.toLowerCase() !== instance.location?.toLowerCase() ? rawLabel : undefined;
          const photo = instance.photoSrc;
          const illustration = species?.imageSrc;
          const wide = lastIsWide && index === instances.length - 1;
          const describe = [name, label, instance.location].filter(Boolean).join(', ');
          return (
            <li
              key={instance.id}
              className={`library-card stagger-item${wide ? ' library-card--wide' : ''}`}
              style={{ '--i': index } as CSSProperties}
            >
              <button
                type="button"
                className="library-card__open"
                onClick={() => onOpen(instance.id)}
                aria-label={`Open ${describe}`}
              >
                <span className={`library-card__media${photo ? ' has-photo' : ' is-illustration'}`}>
                  {photo || illustration ? (
                    <img src={photo ?? illustration} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </span>
                <span className="library-card__info">
                  <span className="library-card__name">{name}</span>
                  {label ? <span className="library-card__label">{label}</span> : null}
                </span>
              </button>

              {instance.location ? (
                <span className="library-card__place">
                  <LocationIcon location={instance.location} />
                  {instance.location}
                </span>
              ) : null}

            </li>
          );
        })}
      </ul>
  );
}
