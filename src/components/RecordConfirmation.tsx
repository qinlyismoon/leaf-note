import { useRef } from 'react';
import type { CareEvent } from '../types';
import { CARE_EVENT_LABELS } from '../types';
import {
  formatEventDate,
  formatRelativeTime,
} from '../utils/formatRelativeTime';
import { Button } from './Button';

type RecordConfirmationProps = {
  event: CareEvent;
  isSharedCare?: boolean;
  onAddPhoto?: (eventId: string, photoDataUrl: string) => void;
  onDone?: () => void;
};

export function RecordConfirmation({ event, isSharedCare = false, onAddPhoto, onDone }: RecordConfirmationProps) {
  const isNotSure = event.type === 'not_sure';
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="record-confirmation"
      role="status"
      aria-live="polite"
    >
      <p className="record-confirmation__outcome">
        Recorded: <strong>{CARE_EVENT_LABELS[event.type]}</strong>
      </p>
      <p className="record-confirmation__meta">
        {formatRelativeTime(event.timestamp)} · {formatEventDate(event.timestamp)}
      </p>
      {isNotSure && !isSharedCare && (
        <p className="record-confirmation__guidance">
          You can check again later, or ask the owner if you need help deciding.
        </p>
      )}
      {isSharedCare && onAddPhoto ? (
        <div className={`record-confirmation__photo${isNotSure ? ' record-confirmation__photo--prominent' : ''}`}>
          {event.photoDataUrl ? <img src={event.photoDataUrl} alt="Care update" /> : null}
          <input ref={inputRef} className="visually-hidden" type="file" accept="image/*"
            onChange={(changeEvent) => {
              const file = changeEvent.currentTarget.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => typeof reader.result === 'string' && onAddPhoto(event.id, reader.result);
              reader.readAsDataURL(file);
            }} />
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            {event.photoDataUrl ? 'Replace photo' : 'Add photo for owner'}
          </Button>
          {isNotSure && !event.photoDataUrl ? <p className="type-meta">A photo may help the owner understand what you see.</p> : null}
        </div>
      ) : null}
      {onDone ? <Button className="record-confirmation__done" onClick={onDone}>Done</Button> : null}
    </div>
  );
}
