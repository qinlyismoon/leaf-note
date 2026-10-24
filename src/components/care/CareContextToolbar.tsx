import type { CareContext } from '../../types';
import { CarePageButton } from './CarePageButton';

type CareContextToolbarProps = {
  context: CareContext;
  hasUnreadUpdates: boolean;
  onHandOff: () => void;
  onOpenUpdates: () => void;
};

/**
 * Content header under Personal/Shared segment.
 * Personal: Your plants + icon-only Hand off. Shared: title + Updates.
 */
export function CareContextToolbar({
  context,
  hasUnreadUpdates,
  onHandOff,
  onOpenUpdates,
}: CareContextToolbarProps) {
  if (context === 'personal') {
    return (
      <div className="care-context-toolbar">
        <h2 className="type-field-label care-context-toolbar__title">
          Your plants
        </h2>
        <CarePageButton ariaLabel="Hand off plants" onClick={onHandOff}>
          <i className="ri-share-forward-line" aria-hidden="true" />
        </CarePageButton>
      </div>
    );
  }

  return (
    <div className="care-context-toolbar">
      <h2 className="type-field-label care-context-toolbar__title">
        Shared plants
      </h2>
      <span className="care-context-toolbar__updates-wrap">
        <CarePageButton ariaLabel="Open updates" onClick={onOpenUpdates}>
          <i className="ri-mail-line" aria-hidden="true" />
        </CarePageButton>
        {hasUnreadUpdates ? (
          <span
            className="care-context-toolbar__unread"
            aria-label="Unread updates"
          />
        ) : null}
      </span>
    </div>
  );
}
