import { IconButton } from './IconButton';

type EditButtonProps = {
  ariaLabel: string;
  onClick: () => void;
};

/** Pencil icon — same circular IconButton system as Back/Close. */
export function EditButton({ ariaLabel, onClick }: EditButtonProps) {
  return (
    <IconButton
      ariaLabel={ariaLabel}
      onClick={onClick}
      className="edit-button"
    >
      <svg className="icon-button__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.2 5.8 18.2 9.8M5 19l1.2-4.4L16.6 4.2a1.7 1.7 0 0 1 2.4 0l.8.8a1.7 1.7 0 0 1 0 2.4L9.4 17.8 5 19Z"
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
