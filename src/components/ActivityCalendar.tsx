import { useMemo, useState } from 'react';
import type { CareEvent, CareEventType } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const TYPE_ORDER: CareEventType[] = ['watered', 'checked', 'not_sure'];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type ActivityCalendarProps = {
  events: CareEvent[];
  /** Days between checks; enables Overdue / Next check marks. */
  intervalDays?: number;
  selectedDay: string | null;
  onSelectDay: (key: string | null) => void;
  today?: Date;
};

function addDays(time: number, days: number): number {
  const d = new Date(time);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days).getTime();
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Days a check was due but not done (overdue), and the next check day.
 * Each Checked / Watered record starts a new interval; Not sure doesn't.
 */
export type CheckScheduleDays = { overdue: Set<string>; next: string | null };

export function checkScheduleDays(events: CareEvent[], intervalDays: number, today: Date): CheckScheduleDays {
  const overdue = new Set<string>();
  let next: string | null = null;
  const resolves = [...new Set(events
    .filter((e) => e.type === 'checked' || e.type === 'watered')
    .map((e) => startOfDay(new Date(e.timestamp))))].sort((a, b) => a - b);
  const todayStart = startOfDay(today);
  resolves.forEach((start, index) => {
    const due = addDays(start, intervalDays);
    const isLast = index === resolves.length - 1;
    if (isLast && due > todayStart) {
      next = dayKey(new Date(due));
      return;
    }
    const end = isLast ? todayStart : resolves[index + 1];
    for (let t = due; t < end; t = addDays(t, 1)) overdue.add(dayKey(new Date(t)));
    // Due today or already overdue: the next check is today.
    if (isLast) next = dayKey(new Date(todayStart));
  });
  return { overdue, next };
}

/**
 * Month view of a plant's care, one marking language:
 * - filled circle = care recorded (watered blue / checked green / not sure amber)
 * - outlined circle = a scheduled check (missed: terracotta ring; next: dashed forest)
 * - today = a short forest bar under the number, layered on any of the above.
 * Tapping a day with activity filters the timeline below.
 */
export function ActivityCalendar({ events, intervalDays, selectedDay, onSelectDay, today = new Date() }: ActivityCalendarProps) {
  const latest = events.length
    ? new Date(Math.max(...events.map((event) => new Date(event.timestamp).getTime())))
    : today;
  const [month, setMonth] = useState(() => new Date(latest.getFullYear(), latest.getMonth(), 1));

  const byDay = useMemo(() => {
    const map = new Map<string, Set<CareEventType>>();
    for (const event of events) {
      const key = dayKey(new Date(event.timestamp));
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(event.type);
    }
    return map;
  }, [events]);

  const schedule = useMemo<CheckScheduleDays>(
    () => (intervalDays ? checkScheduleDays(events, intervalDays, today) : { overdue: new Set<string>(), next: null }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, intervalDays, dayKey(today)],
  );

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leading = new Date(year, monthIndex, 1).getDay();
  const todayKey = dayKey(today);
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  // Look ahead: at least next month, and as far as the next check day.
  const nextParts = schedule.next?.split('-').map(Number);
  const nextCheckMonth = nextParts ? new Date(nextParts[0], nextParts[1] - 1, 1) : null;
  const oneAhead = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const lastMonth = nextCheckMonth && nextCheckMonth > oneAhead ? nextCheckMonth : oneAhead;
  const canGoNext = new Date(year, monthIndex + 1, 1) <= lastMonth;
  // No browsing back past the month of the first record.
  const earliest = events.length
    ? new Date(Math.min(...events.map((event) => new Date(event.timestamp).getTime())))
    : today;
  const canGoPrev = new Date(year, monthIndex, 1) > new Date(earliest.getFullYear(), earliest.getMonth(), 1);

  const shift = (delta: number) => {
    setMonth(new Date(year, monthIndex + delta, 1));
    onSelectDay(null);
  };

  return (
    <div className="activity-calendar">
      <div className="activity-calendar__header">
        <span className="activity-calendar__month" aria-live="polite">{monthLabel}</span>
        <div className="activity-calendar__nav">
          <button type="button" className="activity-calendar__step" aria-label="Previous month" disabled={!canGoPrev} onClick={() => shift(-1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <button type="button" className="activity-calendar__step" aria-label="Next month" disabled={!canGoNext} onClick={() => shift(1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div className="activity-calendar__grid" role="grid" aria-label={`Care activity, ${monthLabel}`}>
        {WEEKDAYS.map((label, index) => (
          <span key={`w${index}`} className="activity-calendar__weekday" aria-hidden="true">{label}</span>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <span key={`e${index}`} aria-hidden="true" />;
          const key = `${year}-${monthIndex + 1}-${day}`;
          const types = byDay.get(key);
          const kinds = types ? TYPE_ORDER.filter((type) => types.has(type)) : [];
          const selected = selectedDay === key;
          const date = new Date(year, monthIndex, day);
          const isToday = key === todayKey;
          // A day with any record shows only its fill — never also a missed ring.
          const overdue = schedule.overdue.has(key) && !isToday && !kinds.length;
          const nextCheck = schedule.next === key;
          const label = `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${isToday ? ' (today)' : ''}${
            kinds.length ? `: ${kinds.map((type) => CARE_EVENT_HISTORY_LABELS[type]).join(', ')}` : ', no activity'}${
            overdue ? ', check was due' : ''}${nextCheck ? ', next check' : ''}`;
          return (
            <button
              key={key}
              type="button"
              className={[
                'activity-calendar__day',
                kinds.length ? 'has-activity' : '',
                kinds.length ? `is-${kinds[0]}` : '',
                selected ? 'is-selected' : '',
                isToday ? 'is-today' : '',
                overdue ? 'is-overdue' : '',
                nextCheck ? 'is-next' : '',
              ].filter(Boolean).join(' ')}
              aria-label={label}
              aria-pressed={selected}
              disabled={!kinds.length}
              onClick={() => onSelectDay(selected ? null : key)}
            >
              <span className="activity-calendar__num">{day}</span>
            </button>
          );
        })}
      </div>

      <div className="activity-calendar__legend" aria-hidden="true">
        {TYPE_ORDER.map((type) => (
          <span key={type}><span className={`activity-calendar__key activity-calendar__key--${type}`} />{CARE_EVENT_HISTORY_LABELS[type]}</span>
        ))}
        {intervalDays ? (
          <>
            <span><span className="activity-calendar__key activity-calendar__key--overdue" />Check missed</span>
            <span><span className="activity-calendar__key activity-calendar__key--next" />Next check</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
