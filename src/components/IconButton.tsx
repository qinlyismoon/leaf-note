import type { ReactNode } from 'react';

type IconButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * White circular utility control (Back, Close, Edit, View Care).
 * Care Handoff/Updates entrances use the separate CarePageButton.
 */
export function IconButton({
  ariaLabel,
  onClick,
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={['icon-button', className].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
