import type { PlantInstance } from '../../types';
import { ShelfRow } from './ShelfRow';

type LibraryShelfProps = {
  instances: PlantInstance[];
  onSelect: (instanceId: string) => void;
};

const PLANTS_PER_ROW = 2;

function chunkInstances(
  instances: PlantInstance[],
  size: number,
): PlantInstance[][] {
  const rows: PlantInstance[][] = [];
  for (let index = 0; index < instances.length; index += size) {
    rows.push(instances.slice(index, index + size));
  }
  return rows;
}

export function LibraryShelf({ instances, onSelect }: LibraryShelfProps) {
  if (instances.length === 0) {
    return <p className="empty-state">No plants on your shelf yet.</p>;
  }

  const rows = chunkInstances(instances, PLANTS_PER_ROW);

  return (
    <div className="library-shelf" aria-label="Plant shelf">
      {rows.map((row) => (
        <ShelfRow
          key={row.map((item) => item.id).join('-')}
          instances={row}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
