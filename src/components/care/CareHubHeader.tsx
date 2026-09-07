import type { CareContext } from '../../types';
import { CareSegmentControl } from '../shell/CareSegmentControl';

type CareHubHeaderProps = {
  context: CareContext;
  personalBadge: number;
  sharedBadge: number;
  onContextChange: (context: CareContext) => void;
};

export function CareHubHeader({
  context,
  personalBadge,
  sharedBadge,
  onContextChange,
}: CareHubHeaderProps) {
  return (
    <header className="care-hub-header">
      <h1 className="page-header__title">Care</h1>
      <CareSegmentControl
        active={context}
        personalBadge={personalBadge}
        sharedBadge={sharedBadge}
        onChange={onContextChange}
      />
    </header>
  );
}
