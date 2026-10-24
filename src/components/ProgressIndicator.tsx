type ProgressIndicatorProps = {
  current: number;
  total: number;
};

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`progress-indicator__segment${index < current ? ' is-active' : ''}`} aria-hidden="true" />
      ))}
    </div>
  );
}
