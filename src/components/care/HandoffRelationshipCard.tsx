import type { Handoff, PlantInstance, PrototypeUser } from '../../types';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { HandoffCard } from './HandoffCard';

/** One of your own handoffs (shared HandoffCard layout, compact action). */
export function HandoffRelationshipCard({ handoff, plants, user, onAction }: {
  handoff: Handoff; plants: PlantInstance[]; user?: PrototypeUser; onAction: () => void;
}) {
  const pending = handoff.status === 'pending';
  const name = user?.displayName ?? handoff.caregiverEmail;
  const count = plants.length;
  const since = new Date(handoff.acceptedAt ?? handoff.updatedAt)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <HandoffCard
      className={`handoff-relationship handoff-relationship--${pending ? 'pending' : 'in-care'}`}
      person={{ name, initials: user?.initials }}
      when={pending ? `Sent ${formatRelativeTime(handoff.createdAt)}` : `Since ${since}`}
      title={pending ? `Waiting for ${name} to accept` : `Caring for your ${count} ${count === 1 ? 'plant' : 'plants'}`}
      plants={plants}
      hidePlants={!pending}
      compact
      actions={
        <button type="button" className="handoff-request__small-action" onClick={onAction}>
          {pending ? 'Cancel request' : 'End handoff'}
        </button>
      }
    />
  );
}
