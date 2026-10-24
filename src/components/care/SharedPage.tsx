import { useState, type ReactNode } from 'react';
import type { Handoff, PlantInstance, PrototypeUser } from '../../types';
import { CareHubHeader } from './CareHubHeader';
import { HandoffButton } from './HandoffButton';
import { HandoffConfirmation } from './HandoffConfirmation';
import { HandoffRelationshipCard } from './HandoffRelationshipCard';
import { SegmentTabs } from '../SegmentTabs';

export type SharedTab = 'caring' | 'handoffs';

type SharedPageProps = {
  /** Incoming pending requests, already rendered as HandoffRequestCards. */
  requests: ReactNode[];
  /** Plants the current user is caring for on someone else's behalf. */
  caringList: ReactNode;
  ownerHandoffs: Handoff[];
  ownedInstances: PlantInstance[];
  resolveUser: (id: string) => PrototypeUser | undefined;
  unreadUpdates: number;
  onHandOff: () => void;
  onOpenUpdates: () => void;
  onEndHandoff: (id: string) => void;
  onCancelHandoff: (id: string) => void;
  tab: SharedTab;
  onTabChange: (tab: SharedTab) => void;
  /** Suggested checks on plants you care for (tab badge). */
  caringCount: number;
  /** The plants of an accepted handoff, grouped like Care (read-only for you). */
  renderHandoffPlants: (handoffId: string, plantIds: string[]) => ReactNode;
};

/**
 * Shared space: everything that involves another person.
 * Order follows urgency — requests waiting on me, plants I'm caring for,
 * plants I've handed off, then the update history.
 */
export function SharedPage({
  requests,
  caringList,
  ownerHandoffs,
  ownedInstances,
  resolveUser,
  unreadUpdates,
  onHandOff,
  onOpenUpdates,
  onEndHandoff,
  onCancelHandoff,
  tab,
  onTabChange,
  caringCount,
  renderHandoffPlants,
}: SharedPageProps) {
  const [confirmation, setConfirmation] = useState<
    { id: string; kind: 'cancel' | 'end' } | null
  >(null);

  return (
    <div className="shared-page screen screen--root has-handoff-fab">
      <CareHubHeader
        title="Shared"
        action={
          <button
            type="button"
            className="header-icon-button"
            onClick={onOpenUpdates}
            aria-label={unreadUpdates > 0 ? `Updates, ${unreadUpdates} unread` : 'Updates'}
          >
            <i className="ri-notification-3-line" aria-hidden="true" />
            {unreadUpdates > 0 ? (
              <span className="header-icon-button__badge" aria-hidden="true">
                {unreadUpdates > 9 ? '9+' : unreadUpdates}
              </span>
            ) : null}
          </button>
        }
      />

      <SegmentTabs<SharedTab>
        label="Shared"
        active={tab}
        onChange={onTabChange}
        tabs={[
          { id: 'caring', label: 'Caring for others', count: requests.length + caringCount },
          { id: 'handoffs', label: 'Your handoffs' },
        ]}
      />

      <div className="segment-panel" key={tab}>
        {tab === 'caring' ? (
          <>
            {requests.length > 0 ? <div className="handoff-request-list">{requests}</div> : null}
            {caringList}
          </>
        ) : ownerHandoffs.length > 0 ? (
          <ul className="handoff-relationships">
            {[...ownerHandoffs]
              .sort((a, b) => (a.status === b.status ? 0 : a.status === 'pending' ? -1 : 1))
              .map((h) => (
                <li key={h.id} className="handoff-group">
                  <HandoffRelationshipCard
                    handoff={h}
                    plants={ownedInstances.filter((p) => h.plantIds.includes(p.id))}
                    user={resolveUser(h.caregiverUserId)}
                    onAction={() =>
                      setConfirmation({ id: h.id, kind: h.status === 'pending' ? 'cancel' : 'end' })
                    }
                  />
                  {h.status === 'accepted' ? renderHandoffPlants(h.id, h.plantIds) : null}
                </li>
              ))}
          </ul>
        ) : (
          <p className="empty-state">No plants handed off.</p>
        )}
      </div>

      <HandoffButton onClick={onHandOff} />

      {confirmation ? (
        <HandoffConfirmation
          kind={confirmation.kind}
          onKeep={() => setConfirmation(null)}
          onConfirm={() => {
            if (confirmation.kind === 'cancel') onCancelHandoff(confirmation.id);
            else onEndHandoff(confirmation.id);
            setConfirmation(null);
          }}
        />
      ) : null}
    </div>
  );
}
