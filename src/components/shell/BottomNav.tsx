import type { CSSProperties } from 'react';
import type { AppTab } from '../../types';
import { NavIcon } from './NavIcon';

type BottomNavProps = {
  activeTab: AppTab;
  /** Numeric badges: Care = own suggested checks; Shared = requests + shared checks. */
  badges: Partial<Record<AppTab, number>>;
  /** Dot when there is something new but nothing countable (unread updates). */
  dots?: Partial<Record<AppTab, boolean>>;
  onChange: (tab: AppTab) => void;
};

const BADGE_NOUN: Partial<Record<AppTab, string>> = {
  care: 'suggested checks',
  shared: 'need your attention',
};

const TABS: { id: AppTab; label: string }[] = [
  { id: 'care', label: 'Care' },
  { id: 'shared', label: 'Shared' },
  { id: 'library', label: 'Library' },
  { id: 'profile', label: 'Profile' },
];

export function BottomNav({ activeTab, badges, dots = {}, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__glass" style={{ '--tab-index': Math.max(0, TABS.findIndex((tab) => tab.id === activeTab)) } as CSSProperties}>
        <span className="bottom-nav__indicator" aria-hidden="true" />
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const count = badges[tab.id] ?? 0;
          const showBadge = count > 0;
          const showDot = !showBadge && Boolean(dots[tab.id]);

          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav__item${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              aria-label={
                showBadge
                  ? `${tab.label}, ${count} ${BADGE_NOUN[tab.id] ?? 'new'}`
                  : showDot
                    ? `${tab.label}, new updates`
                    : tab.label
              }
              onClick={() => onChange(tab.id)}
            >
              <span className="bottom-nav__icon-wrap">
                <NavIcon tab={tab.id} active={active} />
                {showBadge && (
                  <span key={count} className="bottom-nav__badge" aria-hidden="true">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
                {showDot && <span className="bottom-nav__dot" aria-hidden="true" />}
              </span>
              <span className="bottom-nav__label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
