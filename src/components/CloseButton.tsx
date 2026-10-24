import { IconButton } from './IconButton';

type CloseButtonProps = {
  ariaLabel: string;
  onClick: () => void;
};

/**
 * Icon-only dismiss control (×). Distinct from BackButton’s chevron.
 */
export function CloseButton({ ariaLabel, onClick }: CloseButtonProps) {
  return (
    <IconButton
      ariaLabel={ariaLabel}
      onClick={onClick}
      className="close-button"
    >
      <svg className="icon-button__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 7l10 10M17 7 7 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </IconButton>
  );
}
