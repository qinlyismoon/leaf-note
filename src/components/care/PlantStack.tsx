import type { PlantInstance } from '../../types';
import { getSpecies } from '../../data/species';

type PlantStackProps = {
  plants: Pick<PlantInstance, 'id' | 'speciesId' | 'photoSrc'>[];
  /** How many thumbnails to show before "+N". */
  max?: number;
};

/** Overlapping plant thumbnails (photo, or the species illustration). */
export function PlantStack({ plants, max = 3 }: PlantStackProps) {
  return (
    <span className="handoff-summary__thumbs plant-stack" aria-hidden="true">
      {plants.slice(0, max).map((plant) => plant.photoSrc
        ? <img key={plant.id} src={plant.photoSrc} alt="" />
        : <img key={plant.id} src={getSpecies(plant.speciesId)?.imageSrc ?? ''} alt="" className="is-illustration" />)}
      {plants.length > max ? <span className="handoff-summary__more">+{plants.length - max}</span> : null}
    </span>
  );
}

/** "Echeveria, Echeveria, Pothos" — species names, in order. */
export function plantNamesLine(plants: Pick<PlantInstance, 'speciesId' | 'name'>[]): string {
  return plants.map((plant) => getSpecies(plant.speciesId)?.nameEn ?? plant.name).join(', ');
}
