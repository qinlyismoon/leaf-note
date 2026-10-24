import type { ReactNode } from 'react';

type CarePageButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
};

/** Warm page-entry control reserved for Care Handoff and Updates. */
export function CarePageButton({ ariaLabel, onClick, children }: CarePageButtonProps) {
  return (
    <button
      type="button"
      className="care-page-button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
