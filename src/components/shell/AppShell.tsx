import type { ReactNode } from 'react';
import type { AppTab } from '../../types';
import { usePresentationMode } from '../../hooks/usePresentationMode';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';

type AppShellProps = {
  activeTab: AppTab;
  careBadge: number;
  onTabChange: (tab: AppTab) => void;
  children: ReactNode;
  hideNav?: boolean;
};

export function AppShell({
  activeTab,
  careBadge,
  onTabChange,
  children,
  hideNav = false,
}: AppShellProps) {
  const isPresentation = usePresentationMode();
  const rootClass = isPresentation
    ? 'presentation-root is-presentation'
    : 'presentation-root is-mobile';

  return (
    <div className={rootClass} data-presentation={isPresentation ? 'desktop' : 'mobile'}>
      <div className="phone-canvas">
        {isPresentation ? <StatusBar /> : null}
        <div className={`app-frame${hideNav ? ' app-frame--detail' : ''}`}>
          <div className="app-frame__scroll">{children}</div>
          {!hideNav && (
            <BottomNav
              activeTab={activeTab}
              careBadge={careBadge}
              onChange={onTabChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
