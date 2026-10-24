import { ConfirmationAlert } from '../ConfirmationAlert';

type RemovePlantConfirmProps = {
  open: boolean;
  speciesName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Compact confirmation for irreversible plant removal.
 * Cancel / backdrop dismiss never delete; only Confirm does.
 */
export function RemovePlantConfirm({
  open,
  speciesName,
  onCancel,
  onConfirm,
}: RemovePlantConfirmProps) {
  if (!open) {
    return null;
  }

  return <ConfirmationAlert
    title="Remove this plant?"
    message={<>{speciesName} will be removed from Library and Care. Its saved care activity will also be removed.</>}
    cancelLabel="Cancel"
    confirmLabel="Remove plant"
    destructive
    onCancel={onCancel}
    onConfirm={onConfirm}
  />;
}
