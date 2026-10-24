import type { ReactNode } from 'react';
import type { PlantInstance } from '../../types';
import { IdentityAvatar } from '../IdentityAvatar';
import { PlantStack, plantNamesLine } from './PlantStack';

type HandoffCardProps = {
  person: { name: string; initials?: string };
  /** Right side of the top row, e.g. "just now" or "Since Oct 23". */
  when: string;
  title: string;
  plants: PlantInstance[];
  /** Footer actions; `compact` puts a single small action at the right. */
  actions: ReactNode;
  compact?: boolean;
  /** Plants are listed right below as cards, so skip the stack. */
  hidePlants?: boolean;
  as?: 'article' | 'li';
  className?: string;
};

/**
 * One card for every handoff — incoming requests and your own handoffs:
 * who · when, one headline, the plants as a photo stack, then actions.
 */
export function HandoffCard({ person, when, title, plants, actions, compact = false, hidePlants = false, as = 'article', className = '' }: HandoffCardProps) {
  const Tag = as;
  return (
    <Tag className={`handoff-request ${className}`.trim()}>
      <header className="handoff-request__who">
        <IdentityAvatar name={person.name} initials={person.initials} />
        <span className="handoff-request__name">{person.name}</span>
        <span className="handoff-request__when">{when}</span>
      </header>
      <p className="handoff-request__title">{title}</p>
      {hidePlants ? null : (
        <div className="handoff-request__plants">
          <PlantStack plants={plants} />
          <span className="handoff-request__names">{plantNamesLine(plants)}</span>
        </div>
      )}
      <div className={compact ? 'handoff-request__actions handoff-request__actions--compact' : 'handoff-request__actions'}>
        {actions}
      </div>
    </Tag>
  );
}
