import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import type { CareEvent, Handoff, PlantInstance, RelationshipUpdate } from '../../types';
import { getSpecies } from '../../data/species';
import { PlantStack } from './PlantStack';
import { BackButton } from '../BackButton';
import { IdentityAvatar } from '../IdentityAvatar';
import { SegmentTabs } from '../SegmentTabs';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

type UpdatesTab = 'activity' | 'handoffs';

type UpdatesPageProps = {
  updates: RelationshipUpdate[];
  careEvents: CareEvent[];
  currentUserId: string;
  handoffs: Handoff[];
  plantNameById: Record<string, string>;
  /** For photo stacks instead of listing plant names. */
  plantsById: Record<string, PlantInstance>;
  resolveUserName: (userId: string) => string;
  resolveUserInitials: (userId: string) => string;
  onBack: () => void;
  onMarkRead: () => void;
  onToggleReaction: (updateId: string) => void;
  onReply: (updateId: string, text: string) => void;
};

const HEART = 'M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.9 3.8 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.4 0 5.6 3.4 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d={HEART} />
    </svg>
  );
}

/**
 * Relationship inbox, split in two tabs: care activity (what happened to the
 * plants, with a heart and a short reply) and handoff events.
 */
export function UpdatesPage({
  updates,
  careEvents,
  currentUserId,
  handoffs,
  plantNameById,
  plantsById,
  resolveUserName,
  resolveUserInitials,
  onBack,
  onMarkRead,
  onToggleReaction,
  onReply,
}: UpdatesPageProps) {
  const requests = updates.filter((item) => item.kind === 'handoff_request');
  const activity = updates.filter((item) => item.kind === 'care_activity' || item.kind === 'care_reminder');
  // Unread counts as they were when the page opened (opening marks them read).
  const [unread] = useState(() => ({
    activity: activity.filter((item) => !item.readAt && item.recipientUserId === currentUserId).length,
    handoffs: requests.filter((item) => !item.readAt).length,
  }));
  const [tab, setTab] = useState<UpdatesTab>(() =>
    unread.handoffs > 0 && unread.activity === 0 ? 'handoffs' : activity.length || !requests.length ? 'activity' : 'handoffs');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [popped, setPopped] = useState<string | null>(null);
  useEffect(() => {
    onMarkRead();
  }, [onMarkRead]);

  const send = (event: FormEvent, updateId: string) => {
    event.preventDefault();
    const text = drafts[updateId]?.trim();
    if (!text) return;
    onReply(updateId, text);
    setDrafts((current) => ({ ...current, [updateId]: '' }));
  };

  const plantLine = (item: RelationshipUpdate) => {
    const plant = item.plantId ? plantsById[item.plantId] : undefined;
    const label = plant
      ? `${getSpecies(plant.speciesId)?.nameEn ?? plant.name}${plant.identificationLabel ? ` · ${plant.identificationLabel}` : ''}`
      : (item.plantId ? plantNameById[item.plantId] ?? '' : '');
    return (
      <div className="updates-list__plants">
        {plant ? <PlantStack plants={[plant]} /> : null}
        <span className="type-meta">{label ? `${label} · ` : ''}{formatRelativeTime(item.createdAt)}</span>
      </div>
    );
  };

  return (
    <div className="subpage screen screen--detail">
      <header className="subpage__header">
        <BackButton ariaLabel="Back" onClick={onBack} />
        <h1 className="page-header__title">Updates</h1>
      </header>

      <div className="subpage__body">
        <SegmentTabs<UpdatesTab>
          label="Updates"
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'activity', label: 'Activity', count: unread.activity },
            { id: 'handoffs', label: 'Handoffs', count: unread.handoffs },
          ]}
        />

        <div className="segment-panel" key={tab}>
          {tab === 'activity' ? (
            activity.length === 0 ? <p className="empty-state">No care activity yet.</p> : (
              <ul className="updates-list">
                {activity.map((item) => {
                  const event = careEvents.find((candidate) => candidate.id === item.careEventId);
                  const fromOther = item.actorUserId !== currentUserId && item.kind === 'care_activity';
                  const loved = item.reactionUserId === currentUserId;
                  return (
                    <li key={item.id} className={`updates-list__item updates-list__item--activity${item.kind === 'care_reminder' ? ' updates-list__item--reminder' : ''}`}>
                      <IdentityAvatar name={resolveUserName(item.actorUserId)} initials={resolveUserInitials(item.actorUserId)} />
                      <div className="updates-list__body">
                        <p className="type-field-label">{item.message}</p>
                        {plantLine(item)}
                        {event?.photoDataUrl ? (
                          <img className="update-photo" src={event.photoDataUrl} alt="Photo from caregiver" />
                        ) : null}
                        {!fromOther && item.reactionUserId ? (
                          <p className="update-loved">
                            <HeartIcon filled />
                            {resolveUserName(item.reactionUserId)} loved this
                          </p>
                        ) : null}
                        {item.replies?.length ? (
                          <ul className="update-replies">
                            {item.replies.map((reply) => {
                              const name = resolveUserName(reply.userId);
                              return (
                                <li key={reply.id} className={`update-reply${reply.userId === currentUserId ? ' is-mine' : ''}`}>
                                  <IdentityAvatar name={name} initials={resolveUserInitials(reply.userId)} className="update-reply__avatar" />
                                  <span className="update-reply__bubble">{reply.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                        {fromOther ? (
                          <form className="update-respond" onSubmit={(e) => send(e, item.id)}>
                            <button type="button"
                              className={`update-heart${loved ? ' is-on' : ''}${popped === item.id ? ' is-popping' : ''}`}
                              aria-label={loved ? 'Remove heart' : 'Send a heart'} aria-pressed={loved}
                              onClick={() => { onToggleReaction(item.id); setPopped(loved ? null : item.id); }}
                              onAnimationEnd={() => setPopped(null)}>
                              <HeartIcon filled={loved} />
                              <span className="update-heart__burst" aria-hidden="true">
                                {Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--a': `${i * 60}deg` } as CSSProperties} />)}
                              </span>
                            </button>
                            <label className="update-respond__field">
                              <span className="visually-hidden">Reply to {resolveUserName(item.actorUserId)}</span>
                              <input value={drafts[item.id] ?? ''} placeholder={`Reply to ${resolveUserName(item.actorUserId)}`}
                                enterKeyHint="send"
                                onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: e.target.value }))} />
                              <button type="submit" className="update-respond__send" aria-label="Send reply"
                                disabled={!drafts[item.id]?.trim()}>
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor"
                                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></svg>
                              </button>
                            </label>
                          </form>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          ) : requests.length === 0 ? <p className="empty-state">No handoff updates yet.</p> : (
            <ul className="updates-list">
              {requests.map((item) => {
                const handoff = handoffs.find((h) => h.id === item.handoffId);
                const name = resolveUserName(item.actorUserId);
                return (
                  <li key={item.id} className="updates-list__item">
                    <IdentityAvatar name={name} initials={resolveUserInitials(item.actorUserId)} />
                    <div className="updates-list__body">
                      <p className="type-field-label">{item.message}</p>
                      <div className="updates-list__plants">
                        <PlantStack plants={(item.plantIds ?? []).map((id) => plantsById[id]).filter(Boolean)} />
                        <span className="type-meta">
                          {handoff && handoff.status !== 'pending'
                            ? `${handoff.status.charAt(0).toUpperCase()}${handoff.status.slice(1)} · `
                            : ''}
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
