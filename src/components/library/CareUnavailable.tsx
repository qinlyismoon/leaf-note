import { BackButton } from '../BackButton';

type CareUnavailableProps = {
  onBack: () => void;
};

/**
 * Honest empty state when a Library instance has no care configuration yet.
 */
export function CareUnavailable({ onBack }: CareUnavailableProps) {
  return (
    <article className="care-unavailable screen screen--detail" aria-labelledby="care-unavailable-title">
      <header className="care-unavailable__header">
        <BackButton ariaLabel="Back to plant" onClick={onBack} />
        <h1 id="care-unavailable-title" className="care-unavailable__title">
          Care
        </h1>
      </header>
      <p className="care-unavailable__message" role="status">
        Care guidance isn’t available for this plant yet.
      </p>
    </article>
  );
}
