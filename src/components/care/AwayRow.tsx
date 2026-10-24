import type { PlantInstance } from '../../types';
import { IdentityAvatar } from '../IdentityAvatar';
import { PlantStack } from './PlantStack';

type AwayRowProps = {
  caregiver: { name: string; initials?: string };
  plants: PlantInstance[];
  onOpen: () => void;
};

/**
 * Care page footer for plants someone else is looking after: they leave the
 * to-do list, and this one row says where they went (Shared → Your handoffs).
 */
export function AwayRow({ caregiver, plants, onOpen }: AwayRowProps) {
  const count = plants.length;
  return (
    <button type="button" className="away-row" onClick={onOpen}>
      <PlantStack plants={plants} />
      <span className="away-row__text">
        {count} {count === 1 ? 'plant' : 'plants'} with {caregiver.name}
      </span>
      <IdentityAvatar name={caregiver.name} initials={caregiver.initials} className="away-row__avatar" />
      <svg className="away-row__chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
    </button>
  );
}
