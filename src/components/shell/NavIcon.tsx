import type { AppTab } from '../../types';

/**
 * Tab icons drawn on one 24px grid with one rule set:
 * - inactive: 1.7px outline, no fill;
 * - active: every closed shape is filled with ink, and inner details
 *   (drop highlight, pot rim, the gap between two people) are knocked out
 *   in the highlight color. No icon mixes outline and solid in one state.
 */
export function NavIcon({ tab, active }: { tab: AppTab; active: boolean }) {
  const ink = 'currentColor';
  const knock = 'var(--nav-knockout, #fff)';
  const shape = {
    fill: active ? ink : 'none',
    stroke: ink,
    strokeWidth: 1.7,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };
  const detail = {
    fill: 'none',
    stroke: active ? knock : ink,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  let content;
  switch (tab) {
    case 'care':
      content = (
        <>
          <path {...shape} d="M12 3.4S5.9 10.2 5.9 14.4A6.1 6.1 0 0 0 12 20.5a6.1 6.1 0 0 0 6.1-6.1C18.1 10.2 12 3.4 12 3.4Z" />
          <path {...detail} d="M9.2 14.5a2.9 2.9 0 0 0 2.5 2.8" />
        </>
      );
      break;
    case 'shared':
      content = (
        <>
          <circle {...shape} cx="16.6" cy="8.2" r="2.4" />
          <path {...shape} d="M15.4 13.3c2.7.1 4.6 2.1 5 5.3h-3.6c-.2-2-1-3.8-2.3-4.8.3-.3.6-.4.9-.5Z" />
          <circle {...shape} cx="9.3" cy="8.6" r="3" stroke={active ? knock : ink} strokeWidth={active ? 2.2 : 1.7} />
          <path {...shape} d="M3.6 19.6c.6-3.5 2.9-5.7 5.7-5.7s5.1 2.2 5.7 5.7Z" stroke={active ? knock : ink} strokeWidth={active ? 2.2 : 1.7} />
          {active ? (
            <>
              <circle cx="9.3" cy="8.6" r="2.15" fill={ink} />
              <path d="M4.7 18.75c.65-2.8 2.5-4.0 4.6-4.0s3.95 1.2 4.6 4.0Z" fill={ink} />
            </>
          ) : null}
        </>
      );
      break;
    case 'library':
      content = (
        <>
          <path {...shape} d="M12 9.6C12 6.9 10 5 6.9 5c0 2.9 2 4.6 5.1 4.6Z" />
          <path {...shape} d="M12 9.6c0-2.3 1.7-4.2 4.7-4.2 0 2.6-1.8 4.2-4.7 4.2Z" />
          <path {...detail} stroke={ink} d="M12 9.6v3.6" />
          <path {...shape} d="M6.9 13.2h10.2l-1.2 6.4a1 1 0 0 1-1 .8H9.1a1 1 0 0 1-1-.8l-1.2-6.4Z" />
          <path {...detail} d="M8.5 15.7h7" />
        </>
      );
      break;
    default:
      content = (
        <>
          <circle {...shape} cx="12" cy="8.2" r="3.5" />
          <path {...shape} d="M5.2 19.7c.8-3.6 3.5-5.8 6.8-5.8s6 2.2 6.8 5.8Z" />
        </>
      );
  }

  return (
    <svg viewBox="0 0 24 24" className={`nav-icon${active ? ' is-active' : ''}`} aria-hidden="true">
      {content}
    </svg>
  );
}
