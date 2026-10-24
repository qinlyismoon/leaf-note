import { Fragment, useState } from 'react';
import type { CareEvent } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { ActivityCalendar, dayKey } from './ActivityCalendar';
import { EVENT_ICON_PATHS } from '../utils/eventIcons';
import { IdentityAvatar } from './IdentityAvatar';

function dayAndMonth(timestamp: string): { day: string; month: string; time: string } {
  const date = new Date(timestamp);
  return {
    day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

const PREVIEW_COUNT = 5;

export type HistoryActor = { name: string; label: string; initials?: string };

type CareHistoryProps = {
  events: CareEvent[];
  /** Species check interval; lets the calendar mark overdue and next-check days. */
  intervalDays?: number;
  /** Who recorded it (avatar + label, "You" for the current user), or null to hide. */
  resolveActor: (actorUserId: string) => HistoryActor | null;
};

export function CareHistory({ events, intervalDays, resolveActor }: CareHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const orderedEvents = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const dayEvents = selectedDay
    ? orderedEvents.filter((event) => dayKey(new Date(event.timestamp)) === selectedDay)
    : orderedEvents;
  const visibleEvents = selectedDay || expanded ? dayEvents : dayEvents.slice(0, PREVIEW_COUNT);
  const monthOf = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const spansMonths = new Set(visibleEvents.map((event) => monthOf(event.timestamp))).size > 1;
  return (
    <section className="care-history" aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="care-history__title">
        Recent activity
      </h2>

      {events.length === 0 ? (
        <p className="care-history__empty">No care events recorded yet.</p>
      ) : (
        <>
        <ActivityCalendar events={events} intervalDays={intervalDays} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        {selectedDay ? (
          <div className="care-history__filter">
            <span>
              {new Date(visibleEvents[0]?.timestamp ?? Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              {' · '}{visibleEvents.length} {visibleEvents.length === 1 ? 'record' : 'records'}
            </span>
            <button type="button" className="care-history__clear" onClick={() => setSelectedDay(null)} aria-label="Clear day filter">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              Clear
            </button>
          </div>
        ) : null}
        <ol className="care-history__list">
          {visibleEvents.map((event, index) => {
            const when = dayAndMonth(event.timestamp);
            const actor = resolveActor(event.actorUserId);
            const month = monthOf(event.timestamp);
            const newMonth = spansMonths && (index === 0 || monthOf(visibleEvents[index - 1].timestamp) !== month);
            return (
              <Fragment key={event.id}>
              {newMonth ? <li key={`m-${month}`} className="care-history__month-label" aria-hidden="true">{month}</li> : null}
              <li className={`care-history__item care-history__item--${event.type}`}>
                <time className="care-history__date" dateTime={event.timestamp}>
                  <span className="care-history__day">{when.day}</span>
                  <span className="care-history__month">{when.month}</span>
                </time>
                <span className="care-history__track" aria-hidden="true">
                  <span className="care-history__node">
                    <svg className="care-history__icon" viewBox="0 0 24 24">
                      <path d={EVENT_ICON_PATHS[event.type]} />
                    </svg>
                  </span>
                </span>
                <span className="care-history__body">
                  <span className="care-history__headline">
                    <span className="care-history__type">
                      {CARE_EVENT_HISTORY_LABELS[event.type]}
                    </span>
                    <span className="care-history__time">
                      {formatRelativeTime(event.timestamp)} · {when.time}
                    </span>
                  </span>
                  {actor ? (
                    <span className="care-history__actor">
                      <IdentityAvatar name={actor.name} initials={actor.initials} className="care-history__avatar" />
                      {actor.label}
                    </span>
                  ) : null}
                  {event.photoDataUrl ? <span className="care-history__photo type-meta">Photo added</span> : null}
                </span>
              </li>
              </Fragment>
            );
          })}
        </ol>
        </>
      )}
      {!selectedDay && events.length > PREVIEW_COUNT ? (
        <button type="button" className="care-history__more" aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show fewer' : `Show all ${events.length} records`}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor"
            strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={expanded ? 'is-up' : undefined}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      ) : null}
    </section>
  );
}
