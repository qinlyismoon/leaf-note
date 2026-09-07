import type { PlantWithActivity } from '../types';
import { CARE_EVENT_HISTORY_LABELS } from '../types';
import { formatRelativeTime } from '../utils/formatRelativeTime';

type PlantCardProps = {
  plant: PlantWithActivity;
  onSelect: (plantId: string) => void;
};

/**
 * Compact list-card cues for scanning. Full sourced care copy stays on detail.
 * Composite Desk/Shelf scenarios are unchanged at the data-source level.
 */
const LIST_CUES: Record<string, string> = {
  'succulent-desk': 'Check for soft leaves.',
  'succulent-shelf': 'Check for soft leaves. This pot has a tray.',
};

function getLastEventText(plant: PlantWithActivity): string {
  if (!plant.lastEvent) {
    return 'No care recorded yet';
  }

  const label = CARE_EVENT_HISTORY_LABELS[plant.lastEvent.type];
  return `${label} · ${formatRelativeTime(plant.lastEvent.timestamp)}`;
}

export function PlantCard({ plant, onSelect }: PlantCardProps) {
  const cue = LIST_CUES[plant.id] ?? plant.identification[0]?.text ?? '';
  const lastEventText = getLastEventText(plant);

  return (
    <li>
      <button
        type="button"
        className="plant-card"
        onClick={() => onSelect(plant.id)}
        aria-label={`Open ${plant.name}. ${lastEventText}`}
      >
        <span className="plant-card__name">{plant.name}</span>
        {cue && <span className="plant-card__cue">{cue}</span>}
        <span className="plant-card__meta">{lastEventText}</span>
      </button>
    </li>
  );
}
