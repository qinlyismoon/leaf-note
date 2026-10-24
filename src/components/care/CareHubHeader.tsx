import type { ReactNode } from 'react';

type CareHubHeaderProps = {
  /** Page title; Care and Shared share this header. */
  title?: string;
  /** Optional page tool, top-right (Shared: Updates). */
  action?: ReactNode;
};

export function CareHubHeader({ title = 'Care', action }: CareHubHeaderProps) {
  return (
    <header className="care-hub-header">
      <h1 className="page-header__title">{title}</h1>
      {action}
    </header>
  );
}
