import { useEffect, useState } from 'react';
import type { PlantSpecies } from '../../types';
import { Button } from '../Button';
import { CloseButton } from '../CloseButton';
import { PlantImage } from './PlantImage';
import { PlantInstanceFields } from './PlantInstanceFields';
import { PlantPhotoField } from './PlantPhotoField';
import { RemovePlantConfirm } from './RemovePlantConfirm';
import { Selectable } from '../Selectable';

type PlantSheetMode = 'add' | 'edit';

type PlantInstanceSheetProps = {
  mode: PlantSheetMode;
  open: boolean;
  species: PlantSpecies | null;
  speciesOptions?: PlantSpecies[];
  selectedSpeciesId?: string;
  onSelectSpecies?: (speciesId: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  hasTray: boolean | null;
  onHasTrayChange: (value: boolean) => void;
  trayError?: string | null;
  label: string;
  onLabelChange: (value: string) => void;
  photoSrc: string;
  onPhotoChange: (photoSrc: string) => void;
  onClose: () => void;
  onSave: () => void;
  onRemovePlant?: () => void;
  title: string;
  saveLabel: string;
  closeAriaLabel: string;
};

/**
 * Bottom sheet for Add Plant and Edit Plant information.
 * Order: (Add: Species) → Photo → Label → Where it lives → Pot; Edit shows the
 * species under the title (it can't change) and ends with a separate Remove card.
 */
export function PlantInstanceSheet({
  mode,
  open,
  species,
  speciesOptions = [],
  selectedSpeciesId,
  onSelectSpecies,
  location,
  onLocationChange,
  hasTray,
  onHasTrayChange,
  trayError = null,
  label,
  onLabelChange,
  photoSrc,
  onPhotoChange,
  onClose,
  onSave,
  onRemovePlant,
  title,
  saveLabel,
  closeAriaLabel,
}: PlantInstanceSheetProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmRemove(false);
      return;
    }

    const scroll = document.querySelector(
      '.app-frame__scroll',
    ) as HTMLElement | null;
    if (!scroll) {
      return;
    }

    const previous = scroll.style.overflow;
    scroll.style.overflow = 'hidden';
    return () => {
      scroll.style.overflow = previous;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const canAttemptSave = mode === 'edit' || Boolean(selectedSpeciesId);
  const speciesName = species?.nameEn ?? 'This plant';

  return (
    <>
      <div className="sheet-root" role="presentation">
        <button
          type="button"
          className="sheet-backdrop"
          aria-label="Dismiss"
          onClick={onClose}
        />
        <div
          className="sheet-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
        >
          <header className="sheet-panel__header">
            <div className="sheet-panel__heading">
              <h2 id="sheet-title" className="type-display-title">
                {title}
              </h2>
              {mode === 'edit' && species ? (
                <p className="sheet-panel__subtitle type-plant-name">{species.nameEn}</p>
              ) : null}
            </div>
            <CloseButton ariaLabel={closeAriaLabel} onClick={onClose} />
          </header>

          <div className="sheet-panel__body">
            {mode === 'add' ? (
              <div className="sheet-species">
                <h3 className="form-section__title">Species</h3>
                <div
                  className="sheet-species__list"
                  role="radiogroup"
                  aria-label="Species"
                >
                  {speciesOptions.map((option) => {
                    const selected = option.id === selectedSpeciesId;
                    return (
                      <Selectable
                        key={option.id}
                        className="sheet-species__item"
                        name="add-species"
                        value={option.id}
                        checked={selected}
                        onChange={() => onSelectSpecies?.(option.id)}
                      >
                        <span className="sheet-species__thumb-wrap">
                          <PlantImage
                            src={option.imageSrc}
                            alt=""
                            className="sheet-species__thumb"
                          />
                        </span>
                        <span className="type-content-identity type-content-identity--card type-plant-name sheet-species__en">
                          {option.nameEn}
                        </span>
                      </Selectable>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <PlantPhotoField
              photoSrc={photoSrc}
              fallbackSrc={species?.imageSrc}
              onChange={onPhotoChange}
            />

            <PlantInstanceFields
              location={location}
              onLocationChange={onLocationChange}
              hasTray={hasTray}
              onHasTrayChange={onHasTrayChange}
              trayError={trayError}
              trayGroupName={mode === 'add' ? 'has-tray-add' : 'has-tray-edit'}
              label={label}
              onLabelChange={onLabelChange}
            />

            {mode === 'edit' && onRemovePlant ? (
              <section className="form-section sheet-danger" aria-label="Remove">
                <button
                  type="button"
                  className="sheet-danger__row"
                  onClick={() => setConfirmRemove(true)}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 7h14" />
                    <path d="M9.5 7V5h5v2" />
                    <path d="M7 7l.8 12h8.4L17 7" />
                    <path d="M10.5 10.5v5" />
                    <path d="M13.5 10.5v5" />
                  </svg>
                  Remove plant
                </button>
              </section>
            ) : null}
          </div>

          <div className="sheet-actions">
            <Button
              variant="primary"
              disabled={!canAttemptSave}
              onClick={onSave}
            >
              {saveLabel}
            </Button>
          </div>
        </div>
      </div>

      <RemovePlantConfirm
        open={confirmRemove}
        speciesName={speciesName}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          setConfirmRemove(false);
          onRemovePlant?.();
        }}
      />
    </>
  );
}
