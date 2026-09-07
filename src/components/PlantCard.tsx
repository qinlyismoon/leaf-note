import type { PlantWithActivity } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';
import { formatRelativeTime } from '../utils/formatRelativeTime';

type PlantCardProps = {
  plant: PlantWithActivity;
  onSelect: (plantId: string) => void;
};

function getLastEventText(plant: PlantWithActivity): string {
  if (!plant.lastEvent) {
    return 'No care recorded yet';
  }

  const label = CARE_EVENT_HISTORY_LABELS[plant.lastEvent.type];
  return `${label} · ${formatRelativeTime(plant.lastEvent.timestamp)}`;
}

export function PlantCard({ plant, onSelect }: PlantCardProps) {
  const identification = plant.identification[0]?.text ?? '';

  return (
    <li>
      <button
        type="button"
        className="plant-card"
        onClick={() => onSelect(plant.id)}
        aria-label={`Open ${plant.name}. ${getLastEventText(plant)}`}
      >
        <span className="plant-card__eyebrow">{plant.location}</span>
        <span className="plant-card__name">{plant.name}</span>
        <span className="plant-card__id">{identification}</span>
        <span className="plant-card__meta">{getLastEventText(plant)}</span>
      </button>
    </li>
  );
}
