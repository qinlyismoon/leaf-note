import { Button } from '../Button';
import { IdentityAvatar } from '../IdentityAvatar';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

type DelegatedCareCardProps = {
  caregiver: { name: string; initials?: string };
  /** "Overdue" / "Check today" when a check is due; null otherwise. */
  statusLabel?: string | null;
  /** When you last reminded them about this plant today, if you did. */
  remindedAt?: string | null;
  onRemind: () => void;
};

/**
 * Owner's view of a plant in someone else's care: who has it, and one action —
 * a nudge. Ending the handoff lives with the handoff (Shared → Your handoffs).
 */
export function DelegatedCareCard({ caregiver, statusLabel, remindedAt, onRemind }: DelegatedCareCardProps) {
  const due = Boolean(statusLabel);
  return (
    <section className="delegated-care-card" aria-labelledby="delegated-care-title">
      <div className="delegated-care-card__who">
        <IdentityAvatar name={caregiver.name} initials={caregiver.initials} className="delegated-care-card__avatar" />
        <h2 id="delegated-care-title" className="delegated-care-card__title">In {caregiver.name}’s care</h2>
        {due ? (
          <span className={`care-plant-card__status care-plant-card__status--${statusLabel === 'Overdue' ? 'overdue' : 'today'}`}>
            {statusLabel}
          </span>
        ) : null}
      </div>
      {remindedAt ? (
        <p className="delegated-care-card__sent" role="status">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor"
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg>
          Reminder sent · {formatRelativeTime(remindedAt)}
        </p>
      ) : (
        <Button variant={due ? 'primary' : 'secondary'} className="delegated-care-card__remind" onClick={onRemind}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor"
            strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
          </svg>
          Remind {caregiver.name}
        </Button>
      )}
    </section>
  );
}
