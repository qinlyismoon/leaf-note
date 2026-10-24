import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { AppTab } from '../../types';
import { usePresentationMode } from '../../hooks/usePresentationMode';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';

type AppShellProps = {
  activeTab: AppTab;
  badges: Partial<Record<AppTab, number>>;
  dots?: Partial<Record<AppTab, boolean>>;
  onTabChange: (tab: AppTab) => void;
  children: ReactNode;
  hideNav?: boolean;
  /** How the current screen was reached; selects its entrance animation. */
  navDirection?: 'push' | 'pop' | 'tab' | 'none';
  /** A full-bleed photo is at the top: the status bar turns clear over it. */
  photoTop?: boolean;
  /** Changes whenever the visible screen changes; resets scroll to the top. */
  screenKey?: string;
};

/** Scroll distance at which the detail sheet reaches the pinned Back row
 *  (hero 25rem − sheet overlap − nav-strip height), so the strip frosts
 *  before any content can slide under the buttons. */
const PHOTO_SCROLL_THRESHOLD = 240;

export function AppShell({
  activeTab,
  badges,
  dots,
  onTabChange,
  children,
  hideNav = false,
  navDirection = 'none',
  photoTop = false,
  screenKey = '',
}: AppShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledPastPhoto, setScrolledPastPhoto] = useState(false);

  // A new screen always starts at the top.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrolledPastPhoto(false);
  }, [screenKey]);

  const isPresentation = usePresentationMode();
  const rootClass = isPresentation
    ? 'presentation-root is-presentation'
    : 'presentation-root is-mobile';

  return (
    <div className={rootClass} data-presentation={isPresentation ? 'desktop' : 'mobile'}>
      <div className={`phone-canvas${photoTop ? ' phone-canvas--photo-top' : ''}${photoTop && scrolledPastPhoto ? ' is-scrolled' : ''}`}>
        {isPresentation ? <StatusBar /> : null}
        <div className={`app-frame${hideNav ? ' app-frame--detail' : ''}`} data-nav={navDirection}>
          <div
            ref={scrollRef}
            className="app-frame__scroll"
            onScroll={(event) => {
              const scroller = event.currentTarget;
              // Frost once the content sheet reaches the pinned Back row,
              // whatever the hero height; fall back to a fixed distance.
              const sheet = scroller.querySelector('.detail-sheet');
              const bar = scroller.querySelector('.detail-bar');
              const past =
                sheet && bar
                  ? sheet.getBoundingClientRect().top <
                    bar.getBoundingClientRect().top + 60
                  : scroller.scrollTop > PHOTO_SCROLL_THRESHOLD;
              if (past !== scrolledPastPhoto) setScrolledPastPhoto(past);
            }}
          >
            {children}
          </div>
          {!hideNav && (
            <BottomNav
              activeTab={activeTab}
              badges={badges}
              dots={dots}
              onChange={onTabChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
