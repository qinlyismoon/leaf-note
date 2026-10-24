import type { PlantInstance } from '../types';
import { getSpecies } from '../data/species';

export function SelectedPlantTags({ plants, onRemove, onAdd }: {
  plants: PlantInstance[];
  onRemove?: (id: string) => void;
  onAdd?: () => void;
}) {
  return <ul className="plant-tags" aria-label="Selected plants">{plants.map(plant => {
    const name = getSpecies(plant.speciesId)?.nameEn ?? plant.name;
    const duplicate = plants.filter(p => p.speciesId === plant.speciesId).length > 1;
    const label = duplicate ? plant.identificationLabel?.trim() : '';
    return <li key={plant.id}><PlantSelectionTag name={name} label={label}
      onRemove={onRemove ? () => onRemove(plant.id) : undefined} /></li>;
  })}{onAdd ? <li><button type="button" className="plant-selection-tag plant-selection-tag--add"
    aria-label="Add plants to handoff" onClick={onAdd}><span aria-hidden="true">+</span> Add plants</button></li> : null}</ul>;
}

export function PlantSelectionTag({ name, label, onRemove }: {
  name: string; label?: string; onRemove?: () => void;
}) {
  const title = label ? `${name} · ${label}` : name;
  return <span className="plant-selection-tag"><span>{title}</span>{onRemove ?
    <button type="button" className="plant-selection-tag__remove" aria-label={`Remove ${title} from selection`} onClick={onRemove}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    </button> : null}</span>;
}
