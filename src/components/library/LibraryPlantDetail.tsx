import type { CSSProperties } from 'react';
import type { PlantInstance } from '../../types';
import { getSpecies } from '../../data/species';
import { SPECIES_CARE } from '../../data/speciesCare';
import { BackButton } from '../BackButton';
import { EditButton } from '../EditButton';
import { LocationIcon } from './LocationIcon';
import { checkStatusLabel, nextCheckText, type CheckStatus } from '../../utils/checkSchedule';

export type LibraryCareSummary = {
  /** e.g. "Checked 6 days ago" */
  lastActivity: string;
  status: CheckStatus;
};

type LibraryPlantDetailProps = {
  instance: PlantInstance;
  careSummary?: LibraryCareSummary;
  onBack: () => void;
  onEditPlant: () => void;
  onViewCare: () => void;
};

/**
 * Pot icon. On a tray: pot standing in a solid saucer. No tray: the same pot,
 * the saucer only as a faint dashed line with a short slash through it.
 */
function PotIcon({ tray }: { tray: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="location-icon pot-icon">
      <path d="M5 3.5h14v3H5z" />
      <path d="M6.5 6.5l1.2 8.5h8.6l1.2-8.5" />
      {tray ? (
        <path d="M3 15v2c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2z" fill="currentColor" fillOpacity="0.18" />
      ) : (
        <>
          <path d="M3 19.5h18" strokeDasharray="1.5 2.5" strokeOpacity="0.55" />
          <path d="M8.5 22l7-4.5" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

/**
 * Library detail = the plant's profile. Only what matters: who it is (name +
 * the user's own label, same as the Library card), its setup (location · pot) in one line, the check status
 * (flagged only when a check is due or overdue), and how to read the plant.
 */
export function LibraryPlantDetail({
  instance,
  careSummary,
  onBack,
  onEditPlant,
  onViewCare,
}: LibraryPlantDetailProps) {
  const species = getSpecies(instance.speciesId);
  const speciesName = species?.nameEn ?? instance.name;
  const care = SPECIES_CARE[instance.speciesId];
  const rawLabel = instance.identificationLabel?.trim();
  // A label that just repeats the location adds nothing.
  const label = rawLabel && rawLabel.toLowerCase() !== instance.location?.toLowerCase() ? rawLabel : undefined;
  const status = careSummary?.status;
  const statusLabel = status ? checkStatusLabel(status) : null;
  const nextText = status ? nextCheckText(status) : null;

  return (
    <article className="library-detail detail-layered screen screen--detail">
      <header className="detail-bar">
        <BackButton ariaLabel="Back to Library" onClick={onBack} />
        <EditButton ariaLabel="Edit plant information" onClick={onEditPlant} />
      </header>

      <figure className={`detail-hero library-detail__hero${instance.photoSrc ? ' has-photo' : ''}`}>
        {instance.photoSrc ? (
          <img
            src={instance.photoSrc}
            alt={`Photo of this ${speciesName}`}
            className="library-detail__photo"
          />
        ) : (
          <>
            {species ? (
              <img src={species.imageSrc} alt="" className="library-detail__illustration" />
            ) : null}
            <button type="button" className="library-detail__add-photo" onClick={onEditPlant}>
              Add a photo
            </button>
          </>
        )}
      </figure>

      <div className="detail-sheet library-detail__sheet">
        <div className="library-detail__identity stagger-item" style={{ '--i': 0 } as CSSProperties}>
          <h1 className="library-detail__title">{speciesName}</h1>
          {label ? <p className="library-detail__sub">{label}</p> : null}
          <ul className="library-detail__chips" aria-label="Setup">
            {instance.location ? (
              <li className="library-detail__chip-fact">
                <LocationIcon location={instance.location} />{instance.location}
              </li>
            ) : null}
            <li className="library-detail__chip-fact">
              <PotIcon tray={instance.hasTray} />{instance.hasTray ? 'On a tray' : 'No tray'}
            </li>
          </ul>
        </div>

        {instance.careConfigured ? (
          <section
            className={`library-detail__status stagger-item is-${status?.kind ?? 'later'}`}
            style={{ '--i': 1 } as CSSProperties}
            aria-label="Care status"
          >
            <div className="library-detail__status-top">
              {statusLabel ? (
                <span className={`library-detail__chip is-${status!.kind}`}>{statusLabel}</span>
              ) : (
                <span className="library-detail__next">{nextText}</span>
              )}
              <span className="library-detail__status-meta">
                {careSummary?.lastActivity ?? 'No care recorded yet'}
              </span>
            </div>
            {statusLabel && care?.cue ? (
              <p className="library-detail__status-cue">{care.cue.replace(/\.$/, '')}</p>
            ) : null}
            <button
              type="button"
              className={`library-detail__status-action${statusLabel ? '' : ' is-quiet'}`}
              onClick={onViewCare}
            >
              {statusLabel ? 'Start check' : 'View care'}
            </button>
          </section>
        ) : (
          <button type="button" className="library-detail__status library-detail__status--off stagger-item"
            style={{ '--i': 1 } as CSSProperties} onClick={onViewCare}>
            <span className="library-detail__status-meta">Care checks aren’t set up for this plant.</span>
          </button>
        )}

        {care ? (
          <section className="library-detail__group stagger-item" style={{ '--i': 2 } as CSSProperties} aria-labelledby="ld-basics">
            <h2 id="ld-basics" className="library-detail__group-title">Care basics</h2>
            <dl className="care-basics">
              {([
                ['light', 'Light', 'ri-sun-line'],
                ['water', 'Water', 'ri-drop-line'],
                ['soil', 'Soil', 'ri-seedling-line'],
                ['environment', 'Environment', 'ri-temp-hot-line'],
              ] as const).map(([key, title, icon]) => (
                <div key={key} className="care-basics__row">
                  <dt><i className={icon} aria-hidden="true" />{title}</dt>
                  <dd>{care.basics[key]}</dd>
                </div>
              ))}
            </dl>
            <p className="care-basics__tip">
              <i className="ri-lightbulb-line" aria-hidden="true" />
              <span><strong>Good to know</strong> {care.basics.tip}</span>
            </p>
          </section>
        ) : null}
      </div>
    </article>
  );
}
