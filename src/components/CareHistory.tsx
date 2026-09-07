import type { CareEvent } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';
import {
  formatEventDate,
  formatRelativeTime,
} from '../utils/formatRelativeTime';

type CareHistoryProps = {
  events: CareEvent[];
};

export function CareHistory({ events }: CareHistoryProps) {
  return (
    <section className="care-history" aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="care-history__title">
        Recent activity
      </h2>

      {events.length === 0 ? (
        <p className="care-history__empty">No care events recorded yet.</p>
      ) : (
        <ol className="care-history__list">
          {events.map((event) => (
            <li key={event.id} className="care-history__item">
              <span className="care-history__type">
                {CARE_EVENT_HISTORY_LABELS[event.type]}
              </span>
              <span className="care-history__time">
                {formatRelativeTime(event.timestamp)}
              </span>
              <time className="care-history__date" dateTime={event.timestamp}>
                {formatEventDate(event.timestamp)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
