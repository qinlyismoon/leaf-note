import type { HandoffPair } from './CarePlantCard';
import { SectionTitle } from './SectionTitle';
import type {
  CarePlantCardVariant,
  PlantWithActivity,
} from '../types';
import { CarePlantCard } from './CarePlantCard';

type PlantListProps = {
  suggestedChecks: PlantWithActivity[];
  recentlyChecked: PlantWithActivity[];
  emptyMessage?: string;
  hideEmpty?: boolean;
  getVariant: (plantId: string) => CarePlantCardVariant;
  getCaregiverName?: (plantId: string) => string | undefined;
  isPending?: (plantId: string) => boolean;
  getHandoffPair?: (plantId: string) => HandoffPair | undefined;
  onSelectPlant: (plantId: string) => void;
  /** Count badge on "Suggested checks" — only where the checks are yours to do. */
  showCounts?: boolean;
  /** Prefix for heading ids when several lists share a page. */
  idPrefix?: string;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

function PlantSection({
  title,
  tone,
  plants,
  getVariant,
  getCaregiverName,
  isPending,
  getHandoffPair,
  onSelectPlant,
  showCount,
  idPrefix,
}: {
  showCount: boolean;
  idPrefix: string;
  title: string;
  tone: 'suggested' | 'recent';
  plants: PlantWithActivity[];
  getVariant: (plantId: string) => CarePlantCardVariant;
  getCaregiverName?: (plantId: string) => string | undefined;
  isPending?: (plantId: string) => boolean;
  getHandoffPair?: (plantId: string) => HandoffPair | undefined;
  onSelectPlant: (plantId: string) => void;
}) {
  if (plants.length === 0) {
    return null;
  }

  const headingId = `${idPrefix}section-${slugify(title)}`;

  return (
    <section
      className={`plant-section plant-section--${tone}`}
      aria-labelledby={headingId}
    >
      <SectionTitle id={headingId} title={title} count={showCount && tone === 'suggested' ? plants.length : 0} />
      <ul className="plant-list">
        {plants.map((plant, index) => {
          const variant = getVariant(plant.id);
          return (
            <CarePlantCard
              staggerIndex={index}
              key={plant.id}
              plant={plant}
              variant={variant}
              caregiverName={getCaregiverName?.(plant.id)}
              pending={isPending?.(plant.id) ?? false}
              handoffPair={getHandoffPair?.(plant.id)}
              onSelect={
                variant === 'handed_off_owner' ? undefined : onSelectPlant
              }
            />
          );
        })}
      </ul>
    </section>
  );
}

export function PlantList({
  suggestedChecks,
  recentlyChecked,
  emptyMessage = 'No plants in this care context yet.',
  hideEmpty = false,
  getVariant,
  getCaregiverName,
  isPending,
  getHandoffPair,
  onSelectPlant,
  showCounts = true,
  idPrefix = '',
}: PlantListProps) {
  const empty =
    suggestedChecks.length === 0 && recentlyChecked.length === 0;

  if (empty && hideEmpty) {
    return null;
  }

  return (
    <div className="plant-list-view">
      {empty ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <>
          <PlantSection
            title="Suggested checks"
            tone="suggested"
            plants={suggestedChecks}
            getVariant={getVariant}
            getCaregiverName={getCaregiverName}
            isPending={isPending}
            getHandoffPair={getHandoffPair}
            onSelectPlant={onSelectPlant}
            showCount={showCounts}
            idPrefix={idPrefix}
          />
          <PlantSection
            title="Not due yet"
            tone="recent"
            plants={recentlyChecked}
            getVariant={getVariant}
            getCaregiverName={getCaregiverName}
            isPending={isPending}
            getHandoffPair={getHandoffPair}
            onSelectPlant={onSelectPlant}
            showCount={showCounts}
            idPrefix={idPrefix}
          />
        </>
      )}
    </div>
  );
}
