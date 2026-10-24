import type { PlantInstance } from '../../types';
import { ShelfPlantItem } from './ShelfPlantItem';

type ShelfRowProps = {
  instances: PlantInstance[];
  onSelect: (instanceId: string) => void;
};

/**
 * One visual shelf row: up to two plants sharing a full-width ledge.
 */
export function ShelfRow({ instances, onSelect }: ShelfRowProps) {
  return (
    <div className="shelf-row">
      <ul className="shelf-row__plants">
        {instances.map((instance) => (
          <li key={instance.id} className="shelf-row__item">
            <ShelfPlantItem instance={instance} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      <div className="shelf-row__ledge" aria-hidden="true" />
    </div>
  );
}
