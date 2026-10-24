import { IconButton } from './IconButton';

type BackButtonProps = {
  ariaLabel: string;
  onClick: () => void;
};

/**
 * Shared icon-only back control for Care and Library detail screens.
 */
export function BackButton({ ariaLabel, onClick }: BackButtonProps) {
  return (
    <IconButton
      ariaLabel={ariaLabel}
      onClick={onClick}
      className="back-button"
    >
      <svg className="icon-button__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
}
