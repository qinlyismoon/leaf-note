import type { CareEvent, CareEventType, Plant } from '../types';
import { getSpecies } from '../data/species';
import { plantCue } from '../utils/plantCue';
import { BackButton } from './BackButton';
import { CareHistory, type HistoryActor } from './CareHistory';
import { checkIntervalDays } from '../utils/checkSchedule';
import { LEAF_KIND_BY_SPECIES } from './StepArt';
import { GuidedCareCheck } from './GuidedCareCheck';
import { DelegatedCareCard } from './care/DelegatedCareCard';

type PlantDetailProps = {
  plant: Plant;
  events: CareEvent[];
  lastRecorded: CareEvent | null;
  canRecord?: boolean;
  isSharedCare?: boolean;
  /** Whether this plant is currently a Suggested check in its Care list. */
  suggested?: boolean;
  /** Status chip text when a check is needed ("Overdue" / "Check today"). */
  statusLabel?: string | null;
  /** Set when the plant is in someone else's care and you are the owner. */
  delegatedCaregiver?: { name: string; initials?: string };
  /** Reminder you sent today about this plant, if any. */
  remindedAt?: string | null;
  onRemind?: () => void;
  onBack: () => void;
  backLabel?: string;
  onRecord: (type: CareEventType) => void;
  onAddPhoto?: (eventId: string, photoDataUrl: string) => void;
  /** Owner's display name (for the caregiver's photo prompt). */
  ownerName?: string;
  /** Name of whoever recorded it, or null when it was the current user. */
  resolveActor: (actorUserId: string) => HistoryActor | null;
};

export function PlantDetail({
  plant,
  events,
  lastRecorded,
  canRecord = true,
  isSharedCare = false,
  suggested = true,
  statusLabel,
  delegatedCaregiver,
  remindedAt,
  onRemind,
  onBack,
  backLabel = 'Back to Care',
  onRecord,
  onAddPhoto,
  ownerName,
  resolveActor,
}: PlantDetailProps) {
  const ownerDelegated = !canRecord && Boolean(delegatedCaregiver && onRemind);
  const speciesName = getSpecies(plant.speciesId)?.nameEn ?? plant.name;
  const metadata = plant.identificationLabel?.trim() || plant.location?.trim() || 'Care check';
  const latestEvent = events[0];
  const daysSince = latestEvent
    ? Math.max(0, Math.floor((Date.now() - new Date(latestEvent.timestamp).getTime()) / 86400000))
    : null;
  // Headline = what to do now; history and pot setup are supporting context.
  const action = plantCue(plant).split('. ')[0].replace(/\.$/, '') || 'Check the leaves and soil';
  const lastChecked = daysSince === null
    ? 'No check recorded yet'
    : daysSince === 0 ? 'Last checked today'
    : daysSince === 1 ? 'Last checked yesterday'
    : `Last checked ${daysSince} days ago`;
  // Pot-specific watering advice lives in the check steps, not on the card.
  const context = lastChecked;
  const tone: 'overdue' | 'today' | 'anytime' = !suggested ? 'anytime'
    : statusLabel === 'Overdue' ? 'overdue' : 'today';

  return (
    <article className={`plant-detail screen screen--detail${plant.photoSrc ? ' detail-layered' : ''}`}>
      {plant.photoSrc ? (
        <>
          <header className="detail-bar">
            <BackButton ariaLabel={backLabel} onClick={onBack} />
          </header>
          <figure className="detail-hero has-photo">
            <img src={plant.photoSrc} alt={`Photo of this ${speciesName}`} className="library-detail__photo" />
          </figure>
        </>
      ) : null}
      <div className={plant.photoSrc ? 'detail-sheet' : undefined}>
      <header className="plant-detail__header">
        {plant.photoSrc ? null : <BackButton ariaLabel={backLabel} onClick={onBack} />}
        <p className="type-eyebrow plant-detail__eyebrow">
          {metadata || 'Care check'}
        </p>
        <h1 className="type-display-title type-display-title--page type-plant-name plant-detail__title">
          {speciesName}
        </h1>
      </header>

      {ownerDelegated ? <DelegatedCareCard caregiver={delegatedCaregiver!}
        statusLabel={suggested ? statusLabel : null} remindedAt={remindedAt} onRemind={onRemind!} /> : <GuidedCareCheck intro={{
          label: suggested ? statusLabel ?? 'Suggested check' : 'Check anytime',
          suggested,
          tone,
          reason: action,
          context,
        }} speciesSteps={plant.speciesId === 'echeveria' ? undefined : {
          observe: plant.whatToObserve.map((item) => item.text),
          mayNeedWater: plant.whenMayNeedWater.map((item) => item.text),
          howToWater: plant.howToWater.map((item) => item.text),
          whenToStop: plant.whenToStop.map((item) => item.text),
        }} intervalDays={checkIntervalDays(plant.speciesId)} hasTray={plant.hasTray} illustrationSrc={getSpecies(plant.speciesId)?.imageSrc}
        leafKind={LEAF_KIND_BY_SPECIES[plant.speciesId]} canRecord={canRecord}
        isSharedCare={isSharedCare} completed={Boolean(lastRecorded)} onRecord={onRecord}
        recorded={canRecord ? lastRecorded : null} ownerName={ownerName}
        onAddPhoto={onAddPhoto} onDone={onBack} />}

      <CareHistory events={events} intervalDays={checkIntervalDays(plant.speciesId)} resolveActor={resolveActor} />
      </div>
    </article>
  );
}
