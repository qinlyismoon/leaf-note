import type { ReactNode } from 'react';
import type { AppTab } from '../../types';

type BottomNavProps = {
  activeTab: AppTab;
  careBadge: number;
  onChange: (tab: AppTab) => void;
};

const TABS: {
  id: AppTab;
  label: string;
  icon: (active: boolean) => ReactNode;
}[] = [
  {
    id: 'care',
    label: 'Care',
    icon: (active) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="bottom-nav__svg">
        <path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Library',
    icon: (active) => (
      <i
        className={`bottom-nav__ri ${active ? 'ri-plant-fill' : 'ri-plant-line'}`}
        aria-hidden="true"
      />
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="bottom-nav__svg">
        <circle
          cx="12"
          cy="8"
          r="3.2"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M5.5 19c1.6-3 4-4.5 6.5-4.5S16.9 16 18.5 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function BottomNav({ activeTab, careBadge, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__glass">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const showBadge = tab.id === 'care' && careBadge > 0;

          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav__item${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              aria-label={
                showBadge
                  ? `${tab.label}, ${careBadge} suggested checks`
                  : tab.label
              }
              onClick={() => onChange(tab.id)}
            >
              <span className="bottom-nav__icon-wrap">
                {tab.icon(active)}
                {showBadge && (
                  <span className="bottom-nav__badge" aria-hidden="true">
                    {careBadge > 9 ? '9+' : careBadge}
                  </span>
                )}
              </span>
              <span className="bottom-nav__label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
