import type { Handoff, PlantInstance, PrototypeUser } from '../../types';
import { Button } from '../Button';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { HandoffCard } from './HandoffCard';

type HandoffRequestCardProps = {
  handoff: Handoff;
  sender: PrototypeUser;
  plants: PlantInstance[];
  onAccept: (handoffId: string) => void;
  onDecline: (handoffId: string) => void;
};

/** Incoming handoff request (shared HandoffCard layout). */
export function HandoffRequestCard({ handoff, sender, plants, onAccept, onDecline }: HandoffRequestCardProps) {
  const count = handoff.plantIds.length;
  return (
    <HandoffCard
      person={{ name: sender.displayName, initials: sender.initials }}
      when={formatRelativeTime(handoff.createdAt)}
      title={`Asks you to care for ${count} ${count === 1 ? 'plant' : 'plants'}`}
      plants={plants}
      actions={<>
        <Button variant="secondary" onClick={() => onDecline(handoff.id)}>Decline</Button>
        <Button variant="primary" onClick={() => onAccept(handoff.id)}>Accept</Button>
      </>}
    />
  );
}
