import { ConfirmationAlert } from '../ConfirmationAlert';

export function SendHandoffAlert({ email, count, onCancel, onConfirm }: {
  email: string; count: number; onCancel: () => void; onConfirm: () => void;
}) {
  return <ConfirmationAlert
    title="Send handoff request?"
    message={<>Send {count} {count === 1 ? 'plant' : 'plants'} to<br /><strong>{email}</strong>?</>}
    cancelLabel="Cancel"
    confirmLabel="Confirm"
    onCancel={onCancel}
    onConfirm={onConfirm}
  />;
}
