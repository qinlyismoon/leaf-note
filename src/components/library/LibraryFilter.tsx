import { LocationIcon } from './LocationIcon';

type LibraryFilterProps = {
  /** Location labels present in the collection, in display order. */
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export const FILTER_ALL = 'all';

/** Horizontal location tabs: All + every spot that has a plant. */
export function LibraryFilter({ options, value, onChange }: LibraryFilterProps) {
  return (
    <div className="library-filter" role="tablist" aria-label="Filter by location">
      {[FILTER_ALL, ...options].map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            className={`library-filter__tab${active ? ' is-active' : ''}`}
            onClick={() => onChange(option)}
          >
            {option === FILTER_ALL ? null : <LocationIcon location={option} />}
            {option === FILTER_ALL ? 'All' : option}
          </button>
        );
      })}
    </div>
  );
}
