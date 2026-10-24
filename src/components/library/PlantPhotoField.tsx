import { useId, useState } from 'react';
import { compressPlantPhoto } from '../../utils/photo';

type PlantPhotoFieldProps = {
  photoSrc: string;
  /** Species illustration shown when there is no photo yet. */
  fallbackSrc?: string;
  onChange: (photoSrc: string) => void;
};

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinejoin="round">
      <path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" />
      <circle cx="12" cy="13" r="3.3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7h14" />
      <path d="M9.5 7V5h5v2" />
      <path d="M7 7l.8 12h8.4L17 7" />
    </svg>
  );
}

/**
 * Instance photo for Add / Edit plant: one photo stage, no text buttons.
 * - No photo: the whole stage (species illustration + camera) opens the picker.
 * - Photo: icon buttons float on it — camera to retake, trash to remove.
 * On a phone the picker offers the camera directly.
 */
export function PlantPhotoField({ photoSrc, fallbackSrc, onChange }: PlantPhotoFieldProps) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="form-section" aria-label="Plant photo">
      <h3 className="form-section__title">
        Photo <span className="form-section__optional">Optional</span>
      </h3>
      <div className={`photo-stage${photoSrc ? ' has-photo' : ''}${busy ? ' is-busy' : ''}`}>
        <input
          id={inputId}
          className="photo-stage__input"
          type="file"
          accept="image/*"
          capture="environment"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            setBusy(true);
            setError(null);
            try {
              onChange(await compressPlantPhoto(file));
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : 'Could not use that image.');
            } finally {
              setBusy(false);
            }
          }}
        />

        {photoSrc ? (
          <>
            <img src={photoSrc} alt="Photo of this plant" className="photo-stage__img" />
            <div className="photo-stage__tools">
              <label htmlFor={inputId} className="photo-stage__tool" aria-label="Retake photo" title="Retake photo">
                <CameraIcon />
              </label>
              <button
                type="button"
                className="photo-stage__tool"
                aria-label="Remove photo"
                title="Remove photo"
                onClick={() => onChange('')}
              >
                <TrashIcon />
              </button>
            </div>
          </>
        ) : (
          <label htmlFor={inputId} className="photo-stage__empty" aria-label="Add a photo of this plant">
            {fallbackSrc ? <img src={fallbackSrc} alt="" className="photo-stage__fallback" /> : null}
            <span className="photo-stage__camera" aria-hidden="true">
              <CameraIcon />
            </span>
          </label>
        )}
        {busy ? <span className="photo-stage__busy" aria-live="polite">Processing…</span> : null}
      </div>
      {error ? <p className="form-section__error" role="alert">{error}</p> : null}
    </section>
  );
}
