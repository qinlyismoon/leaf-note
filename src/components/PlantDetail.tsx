import type { CareEvent, CareEventType, Plant } from '../types';
import { CARE_EVENT_LABELS, textsOf } from '../types';
import { CareHistory } from './CareHistory';
import { CareSection } from './CareSection';
import { RecordConfirmation } from './RecordConfirmation';

type PlantDetailProps = {
  plant: Plant;
  events: CareEvent[];
  lastRecorded: CareEvent | null;
  onBack: () => void;
  onRecord: (type: CareEventType) => void;
};

const OUTCOME_TYPES: CareEventType[] = ['checked', 'watered', 'not_sure'];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="care-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function PlantDetail({
  plant,
  events,
  lastRecorded,
  onBack,
  onRecord,
}: PlantDetailProps) {
  return (
    <article className="plant-detail">
      <header className="plant-detail__header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to plants
        </button>
        <p className="plant-detail__eyebrow">
          {plant.plantType} · {plant.location}
        </p>
        <h1 className="plant-detail__title">{plant.name}</h1>
        <p className="plant-detail__identification">
          {textsOf(plant.identification).join(' ')}
        </p>
      </header>

      <div className="why-check" role="note">
        <p className="why-check__label">Suggested check</p>
        <p className="why-check__text">{plant.whyCheck.text}</p>
        <p className="why-check__rhythm">{plant.suggestedCheckRhythm.text}</p>
      </div>

      <div className="plant-detail__instructions">
        <CareSection title="What to observe">
          <BulletList items={textsOf(plant.whatToObserve)} />
        </CareSection>

        <CareSection title="When it may need water">
          <BulletList items={textsOf(plant.whenMayNeedWater)} />
        </CareSection>

        <CareSection title="How to water">
          <BulletList items={textsOf(plant.howToWater)} />
        </CareSection>

        <CareSection title="When to stop">
          <BulletList items={textsOf(plant.whenToStop)} />
        </CareSection>

        <CareSection title="Pot, drainage & location">
          <BulletList items={textsOf(plant.potDrainageLocation)} />
        </CareSection>
      </div>

      <section
        className="record-outcome"
        aria-labelledby="record-outcome-heading"
      >
        <h2 id="record-outcome-heading" className="record-outcome__title">
          Record your judgment
        </h2>
        <p className="record-outcome__lede">
          After checking the plant, choose what happened. Checking does not
          always mean watering.
        </p>
        <div
          className="record-outcome__buttons"
          role="group"
          aria-label="Care outcome"
        >
          {OUTCOME_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`outcome-button outcome-button--${type}`}
              onClick={() => onRecord(type)}
            >
              {CARE_EVENT_LABELS[type]}
            </button>
          ))}
        </div>
      </section>

      {lastRecorded && <RecordConfirmation event={lastRecorded} />}

      <CareHistory events={events} />
    </article>
  );
}
