import type { CSSProperties } from 'react';

export type SegmentTab<T extends string> = { id: T; label: string; count?: number };

type SegmentTabsProps<T extends string> = {
  tabs: SegmentTab<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
};

/**
 * Second level under a page title: a segmented switch with a sliding thumb.
 * Counts use the same badge as section titles and the tab bar.
 */
export function SegmentTabs<T extends string>({ tabs, active, onChange, label }: SegmentTabsProps<T>) {
  const index = Math.max(0, tabs.findIndex((tab) => tab.id === active));
  return (
    <div className="segment-tabs" role="tablist" aria-label={label}
      style={{ '--count': tabs.length, '--index': index } as CSSProperties}>
      <span className="segment-tabs__thumb" aria-hidden="true" />
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={tab.id === active}
          className={`segment-tabs__tab${tab.id === active ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}>
          <span>{tab.label}</span>
          {tab.count ? <span className="count-badge" aria-label={`${tab.count} new`}>{tab.count > 9 ? '9+' : tab.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
