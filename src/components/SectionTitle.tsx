type SectionTitleProps = {
  id: string;
  title: string;
  /** "Needs attention" count; same badge as the tab bar. Hidden at 0. */
  count?: number;
};

/** The one section heading used on Care and Shared. */
export function SectionTitle({ id, title, count = 0 }: SectionTitleProps) {
  return (
    <div className="plant-section__header">
      <h2 id={id} className="plant-section__title">
        {title}
        {count > 0 ? (
          <span className="count-badge" aria-label={`${count} need attention`}>{count > 9 ? '9+' : count}</span>
        ) : null}
      </h2>
    </div>
  );
}
