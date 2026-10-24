import type { ReactNode } from 'react';

type CareSectionProps = {
  title: string;
  children: ReactNode;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function CareSection({ title, children }: CareSectionProps) {
  const headingId = slugify(title);

  return (
    <section className="care-section" aria-labelledby={headingId}>
      <h2 id={headingId} className="type-eyebrow care-section__title">
        {title}
      </h2>
      <div className="care-section__body">{children}</div>
    </section>
  );
}
