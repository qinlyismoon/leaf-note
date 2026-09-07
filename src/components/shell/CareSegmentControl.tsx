import type { CareContext } from '../../types';

type CareSegmentControlProps = {
  active: CareContext;
  personalBadge: number;
  sharedBadge: number;
  onChange: (context: CareContext) => void;
};

export function CareSegmentControl({
  active,
  personalBadge,
  sharedBadge,
  onChange,
}: CareSegmentControlProps) {
  return (
    <div
      className="care-segments"
      role="tablist"
      aria-label="Care context"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === 'personal'}
        className={`care-segments__tab${active === 'personal' ? ' is-active' : ''}`}
        onClick={() => onChange('personal')}
      >
        <span>Personal</span>
        {personalBadge > 0 && (
          <span className="care-segments__badge" aria-label={`${personalBadge} suggested checks`}>
            {personalBadge}
          </span>
        )}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'shared'}
        className={`care-segments__tab${active === 'shared' ? ' is-active' : ''}`}
        onClick={() => onChange('shared')}
      >
        <span>Shared</span>
        {sharedBadge > 0 && (
          <span className="care-segments__badge" aria-label={`${sharedBadge} suggested checks`}>
            {sharedBadge}
          </span>
        )}
      </button>
    </div>
  );
}
