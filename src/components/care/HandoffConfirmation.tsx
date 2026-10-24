import { ConfirmationAlert } from '../ConfirmationAlert';

export function HandoffConfirmation({ kind, onKeep, onConfirm }: {
  kind: 'cancel' | 'end'; onKeep: () => void; onConfirm: () => void;
}) {
  const cancel = kind === 'cancel';
  return <ConfirmationAlert
    title={cancel ? 'Cancel this request?' : 'End this handoff?'}
    message={cancel
      ? 'The recipient will no longer be able to accept. These plants will be available for a new handoff.'
      : 'Temporary care ends and these plants return to your care. Their care history will be kept.'}
    cancelLabel={cancel ? 'Keep request' : 'Keep handoff'}
    confirmLabel={cancel ? 'Cancel request' : 'End handoff'}
    destructive
    onCancel={onKeep}
    onConfirm={onConfirm}
  />;
}
