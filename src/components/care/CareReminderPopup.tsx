import { useEffect, useRef } from 'react';
import type { Plant } from '../../types';
import { getSpecies } from '../../data/species';
import { plantCue } from '../../utils/plantCue';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { Button } from '../Button';
import { IdentityAvatar } from '../IdentityAvatar';
import { PlantLabel } from '../PlantLabel';

type CareReminderPopupProps = {
  sender: { name: string; initials?: string };
  plant: Plant;
  sentAt: string;
  onLater: () => void;
  onCheck: () => void;
};

/** What the caregiver sees when the owner sends a reminder: who, which plant, one way in. */
export function CareReminderPopup({ sender, plant, sentAt, onLater, onCheck }: CareReminderPopupProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    // Focus the dialog itself, so no button opens with a focus ring.
    dialog?.focus();
    return () => dialog?.close();
  }, []);
  const species = getSpecies(plant.speciesId);
  const name = species?.nameEn ?? plant.name;
  const cue = plantCue(plant).split('. ')[0].replace(/\.$/, '');
  return (
    <dialog ref={ref} className="reminder-pop" aria-labelledby="reminder-pop-title" tabIndex={-1}
      onCancel={(event) => { event.preventDefault(); onLater(); }}>
      <div className="reminder-pop__from">
        <IdentityAvatar name={sender.name} initials={sender.initials} />
        <span className="reminder-pop__name">{sender.name}</span>
        <span className="reminder-pop__when">{formatRelativeTime(sentAt)}</span>
      </div>
      <h2 id="reminder-pop-title" className="reminder-pop__title">Can you check the {name}?</h2>
      <div className="reminder-pop__plant">
        <img src={plant.photoSrc ?? species?.imageSrc ?? ''} alt="" className="plant-photo-thumb" />
        <span className="reminder-pop__copy">
          <span className="care-plant-card__name">{name}</span>
          <PlantLabel label={plant.identificationLabel} />
          {cue ? <span className="care-plant-card__cue">{cue}</span> : null}
        </span>
      </div>
      <div className="reminder-pop__actions">
        <Button variant="secondary" onClick={onLater}>Later</Button>
        <Button onClick={onCheck}>Check now</Button>
      </div>
    </dialog>
  );
}
