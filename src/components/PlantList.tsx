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
  intro,
  plants,
  onSelectPlant,
}: {
  title: string;
  intro: string;
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
        <p className="plant-section__intro">{intro}</p>
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
  return (
    <div className="plant-list-view">
      <header className="page-header">
        <p className="page-header__eyebrow">Temporary care</p>
        <h1 className="page-header__title">Leafnote</h1>
        <p className="page-header__lede">
          Plants in your care. Check the cues before deciding whether to water.
        </p>
      </header>

      <PlantSection
        title="Suggested checks"
        intro="Look at these plants when you can. Checking does not mean watering."
        plants={suggestedChecks}
        onSelectPlant={onSelectPlant}
      />

      <PlantSection
        title="Recently checked"
        intro="A check or watering was recorded recently. Still use the cues if you look again."
        plants={recentlyChecked}
        onSelectPlant={onSelectPlant}
      />
    </div>
  );
}
