import type { PlantWithActivity } from '../types';
import { PlantCard } from './PlantCard';

type PlantListProps = {
  suggestedChecks: PlantWithActivity[];
  recentlyChecked: PlantWithActivity[];
  onSelectPlant: (plantId: string) => void;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

function PlantSection({
  title,
  plants,
  onSelectPlant,
}: {
  title: string;
  plants: PlantWithActivity[];
  onSelectPlant: (plantId: string) => void;
}) {
  if (plants.length === 0) {
    return null;
  }

  const headingId = `section-${slugify(title)}`;

  return (
    <section className="plant-section" aria-labelledby={headingId}>
      <div className="plant-section__header">
        <h2 id={headingId} className="plant-section__title">
          {title}
        </h2>
      </div>
      <ul className="plant-list">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onSelect={onSelectPlant} />
        ))}
      </ul>
    </section>
  );
}

export function PlantList({
  suggestedChecks,
  recentlyChecked,
  onSelectPlant,
}: PlantListProps) {
  const empty =
    suggestedChecks.length === 0 && recentlyChecked.length === 0;

  return (
    <div className="plant-list-view">
      {empty ? (
        <p className="empty-state">No plants in this care context yet.</p>
      ) : (
        <>
          <PlantSection
            title="Suggested checks"
            plants={suggestedChecks}
            onSelectPlant={onSelectPlant}
          />
          <PlantSection
            title="Recently checked"
            plants={recentlyChecked}
            onSelectPlant={onSelectPlant}
          />
        </>
      )}
    </div>
  );
}
