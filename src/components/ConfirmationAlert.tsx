import { useEffect, useId, useRef, type ReactNode } from 'react';

type ConfirmationAlertProps = {
  title: string;
  message: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Shared compact confirmation alert for consequential two-choice actions. */
export function ConfirmationAlert({
  title,
  message,
  cancelLabel,
  confirmLabel,
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmationAlertProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitted = useRef(false);
  const id = useId();
  const titleId = `${id}-title`;
  const messageId = `${id}-message`;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="system-alert"
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
        );
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = (index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
        event.preventDefault();
        buttons[next]?.focus();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="system-alert__body">
        <h2 id={titleId} className="type-field-label">{title}</h2>
        <div id={messageId} className="system-alert__message type-meta">{message}</div>
      </div>
      <div className="system-alert__actions">
        <button type="button" autoFocus onClick={onCancel}>{cancelLabel}</button>
        <button
          type="button"
          className={`system-alert__confirm${destructive ? ' system-alert__confirm--destructive' : ''}`}
          onClick={() => {
            if (submitted.current) return;
            submitted.current = true;
            onConfirm();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
