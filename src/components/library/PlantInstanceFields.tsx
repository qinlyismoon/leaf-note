import type { ReactNode } from 'react';
import { IDENTIFICATION_LABEL_MAX } from '../../types';
import { countLabelUnits, truncateLabelUnits } from '../../utils/labelUnits';
import { Selectable } from '../Selectable';
import { PLANT_LOCATIONS, findLocation } from '../../data/locations';
import { LocationIcon } from './LocationIcon';

type PlantInstanceFieldsProps = {
  location: string;
  onLocationChange: (value: string) => void;
  hasTray: boolean | null;
  onHasTrayChange: (value: boolean) => void;
  trayError?: string | null;
  /** Unique name for the tray radio group when multiple sheets may exist. */
  trayGroupName: string;
  label: string;
  onLabelChange: (value: string) => void;
  /** Rows shown first in the Details group (e.g. read-only species in Edit). */
  leadingRows?: ReactNode;
};

/**
 * Shared Add Plant / Edit Plant instance fields: location picked from icon
 * tags (not typed), then Tray / Label as an inset grouped list. Tray is a pot
 * setup, not a location, so it stays a separate Yes/No row.
 */
export function PlantInstanceFields({
  location,
  onLocationChange,
  hasTray,
  onHasTrayChange,
  trayError = null,
  trayGroupName,
  label,
  onLabelChange,
  leadingRows,
}: PlantInstanceFieldsProps) {
  const count = countLabelUnits(label);
  const errorId = `${trayGroupName}-error`;
  const trayLabelId = `${trayGroupName}-label`;

  const current = findLocation(location)?.label ?? location.trim();
  const customLocation =
    current !== '' && !PLANT_LOCATIONS.some((loc) => loc.label === current) ? current : null;

  return (
    <>
    <section className="form-section" aria-labelledby={`${trayGroupName}-label-title`}>
      <h3 id={`${trayGroupName}-label-title`} className="form-section__title">
        Label <span className="form-section__optional">Optional</span>
      </h3>
      <div className="form-group">
        <label className="form-row form-row--solo">
          <input
            aria-labelledby={`${trayGroupName}-label-title`}
            type="text"
            className="form-row__input"
            value={label}
            placeholder="e.g. Red tips"
            autoComplete="off"
            onChange={(event) => {
              onLabelChange(truncateLabelUnits(event.target.value, IDENTIFICATION_LABEL_MAX));
            }}
          />
          <span className="form-row__counter" aria-live="polite">
            {count}/{IDENTIFICATION_LABEL_MAX}
          </span>
        </label>
      </div>
    </section>

    <section className="form-section" aria-labelledby={`${trayGroupName}-location`}>
      <h3 id={`${trayGroupName}-location`} className="form-section__title">
        Where it lives <span className="form-section__optional">Optional</span>
      </h3>
      <div className="location-picker" role="group" aria-labelledby={`${trayGroupName}-location`}>
        {[...PLANT_LOCATIONS.map((loc) => loc.label), ...(customLocation ? [customLocation] : [])].map(
          (option) => {
            const active = option === current;
            return (
              <button
                key={option}
                type="button"
                className={`location-picker__tag${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onLocationChange(active ? '' : option)}
              >
                <LocationIcon location={option} />
                <span>{option}</span>
              </button>
            );
          },
        )}
      </div>
    </section>

    <section className="form-section" aria-labelledby={`${trayGroupName}-details`}>
      <h3 id={`${trayGroupName}-details`} className="form-section__title">Pot</h3>
      <div className="form-group">
        {leadingRows}

        <div className="form-row">
          <span className="form-row__label" id={trayLabelId}>Tray</span>
          <div
            className={`segmented${trayError ? ' has-error' : ''}`}
            role="radiogroup"
            aria-labelledby={trayLabelId}
            aria-describedby={trayError ? errorId : undefined}
          >
            {[false, true].map((value) => (
              <Selectable
                key={String(value)}
                className="segmented__option"
                name={trayGroupName}
                value={value ? 'yes' : 'no'}
                checked={hasTray === value}
                onChange={() => onHasTrayChange(value)}
              >
                {value ? 'Yes' : 'No'}
              </Selectable>
            ))}
          </div>
        </div>

      </div>
      {trayError ? (
        <p id={errorId} className="form-section__error" role="alert">
          {trayError}
        </p>
      ) : null}
    </section>
    </>
  );
}
