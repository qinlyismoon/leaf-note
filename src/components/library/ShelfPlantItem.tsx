import { PlantLabel } from '../PlantLabel';
import type { PlantInstance } from '../../types';
import { getSpecies } from '../../data/species';
import { PlantImage } from './PlantImage';

type ShelfPlantItemProps = {
  instance: PlantInstance;
  onSelect: (instanceId: string) => void;
};

/**
 * Normalized shelf plant: name → optional label → fixed image stage.
 * Visual press feedback is image-only; the shared ledge stays outside.
 */
export function ShelfPlantItem({ instance, onSelect }: ShelfPlantItemProps) {
  const species = getSpecies(instance.speciesId);
  const speciesName = species?.nameEn ?? instance.name;
  const imageSrc = species?.imageSrc ?? '';
  const label = instance.identificationLabel?.trim();
  const imageAlt = label ? `${speciesName}, ${label}` : speciesName;

  return (
    <button
      type="button"
      className="shelf-plant"
      onClick={() => onSelect(instance.id)}
      aria-label={`Open ${speciesName}${label ? `, ${label}` : ''}`}
    >
      <span className="shelf-plant__meta">
        <span className="shelf-plant__name">{speciesName}</span>
        {label ? (
          <PlantLabel label={label} />
        ) : null}
      </span>

      <span className="shelf-plant__stage">
        {imageSrc ? (
          <PlantImage
            variant="shelf"
            src={imageSrc}
            alt={imageAlt}
            className="shelf-plant__image"
          />
        ) : (
          <span
            className="plant-image__fallback shelf-plant__fallback"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
