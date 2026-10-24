import type { CSSProperties } from 'react';
import { PlantLabel } from './PlantLabel';
import { plantCue } from '../utils/plantCue';
import type { CareEvent, CarePlantCardVariant, PlantWithActivity } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';
import { getSpecies } from '../data/species';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { checkStatusLabel } from '../utils/checkSchedule';
import { PlantImage } from './library/PlantImage';
import { IdentityAvatar } from './IdentityAvatar';
import { TimeIcon } from './TimeIcon';

type CarePlantCardProps = {
  plant: PlantWithActivity;
  variant: CarePlantCardVariant;
  caregiverName?: string;
  pending?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (plantId: string) => void;
  /** Position in its list, for the entrance stagger. */
  staggerIndex?: number;
  /** Handoff on this plant: owner + caregiver avatars, bottom-right. */
  handoffPair?: HandoffPair;
};

export type HandoffPair = {
  status: 'pending' | 'accepted';
  owner: { name: string; initials?: string };
  caregiver: { name: string; initials?: string };
};

/** Owner avatar overlapped by the caregiver's — dashed and empty while pending. */
function HandoffAvatars({ pair }: { pair: HandoffPair }) {
  const pending = pair.status === 'pending';
  return (
    <span className={`handoff-pair${pending ? ' is-pending' : ''}`}
      title={pending ? `Waiting for ${pair.caregiver.name}` : `${pair.caregiver.name} is caring for it`}>
      <IdentityAvatar name={pair.owner.name} initials={pair.owner.initials} className="handoff-pair__avatar" />
      {pending
        ? <span className="handoff-pair__avatar handoff-pair__avatar--waiting" aria-hidden="true" />
        : <IdentityAvatar name={pair.caregiver.name} initials={pair.caregiver.initials} className="handoff-pair__avatar handoff-pair__avatar--caregiver" />}
    </span>
  );
}


function speciesNameOf(plant: PlantWithActivity): string {
  return getSpecies(plant.speciesId)?.nameEn ?? plant.name;
}

function lastOutcomeLine(event: CareEvent | null): string {
  if (!event) {
    return 'No care recorded yet';
  }
  return `${CARE_EVENT_HISTORY_LABELS[event.type]} · ${formatRelativeTime(event.timestamp)}`;
}

function cueOf(plant: PlantWithActivity): string {
  return plantCue(plant);
}

/**
 * Shared Care plant card. Variants change surface and permission, not layout.
 */
export function CarePlantCard({
  plant,
  variant,
  pending = false,
  selected = false,
  disabled = false,
  onSelect,
  staggerIndex = 0,
  handoffPair,
}: CarePlantCardProps) {
  const species = getSpecies(plant.speciesId);
  const speciesName = speciesNameOf(plant);
  const cue = cueOf(plant);
  const imageSrc = species?.imageSrc ?? '';
  const label = plant.identificationLabel?.trim();
  const handedOff = variant === 'handed_off_owner';
  const meta = lastOutcomeLine(plant.lastEvent);
  const secondary = cue.split('. ')[0].replace(/\.$/, '');
  const relationship = handoffPair
    ? handoffPair.status === 'pending'
      ? `Handoff to ${handoffPair.caregiver.name} pending`
      : `In ${handoffPair.caregiver.name}'s care`
    : pending ? 'Pending handoff' : null;

  const statusLabel = plant.checkStatus ? checkStatusLabel(plant.checkStatus) : null;
  const aria = [speciesName, label, secondary, meta, relationship].filter(Boolean).join('. ');
  const className = [
    'care-plant-card',
    `care-plant-card--${variant}`,
    selected ? 'is-selected' : '',
    disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {plant.photoSrc ? (
        <img src={plant.photoSrc} alt="" className="plant-photo-thumb" />
      ) : (
        <PlantImage src={imageSrc} alt="" variant="carePortrait" />
      )}
      <span className="care-plant-card__copy">
        <span className="care-plant-card__name">{speciesName}</span>
        {statusLabel && !handedOff ? (
          <span className={`care-plant-card__status care-plant-card__status--${plant.checkStatus.kind}`}>
            {statusLabel}
          </span>
        ) : null}
        {label ? (
          <PlantLabel label={label} />
        ) : null}
        {secondary ? (
          <span className="care-plant-card__cue">{secondary}</span>
        ) : null}
        <span className="care-plant-card__meta">
          <TimeIcon />
          {meta}
        </span>
        {relationship && !handoffPair ? <span className="care-relationship-status">{relationship}</span> : null}
      </span>
      {handoffPair ? <HandoffAvatars pair={handoffPair} /> : null}
    </>
  );

  if (handedOff || !onSelect) {
    return (
      <li className="stagger-item" style={{ '--i': staggerIndex } as CSSProperties}>
        <div className={className} aria-label={aria}>
          {body}
        </div>
      </li>
    );
  }

  return (
    <li className="stagger-item" style={{ '--i': staggerIndex } as CSSProperties}>
      <button
        type="button"
        className={className}
        onClick={() => onSelect(plant.id)}
        aria-label={`Open ${aria}`}
        aria-pressed={selected || undefined}
        disabled={disabled}
      >
        {body}
      </button>
    </li>
  );
}
