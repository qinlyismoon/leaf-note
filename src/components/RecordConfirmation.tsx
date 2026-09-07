import type { CareEvent } from '../types';
import { CARE_EVENT_LABELS } from '../types';
import {
  formatEventDate,
  formatRelativeTime,
} from '../utils/formatRelativeTime';

type RecordConfirmationProps = {
  event: CareEvent;
};

export function RecordConfirmation({ event }: RecordConfirmationProps) {
  const isNotSure = event.type === 'not_sure';

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
      <p className="record-confirmation__note">
        Recent activity has been updated.
      </p>
      {isNotSure && (
        <p className="record-confirmation__guidance">
          You can check again later, or ask the owner if you need help deciding.
        </p>
      )}
    </div>
  );
}
