import { useEffect } from 'react';

type ToastProps = {
  message: string;
  open: boolean;
  onDismiss: () => void;
  durationMs?: number;
};

/** Brief, restrained status toast for Library feedback. */
export function Toast({
  message,
  open,
  onDismiss,
  durationMs = 2200,
}: ToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, onDismiss, durationMs]);

  if (!open) {
    return null;
  }

  return (
    <div className="app-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
