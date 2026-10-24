import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

/**
 * Shared full-width form action button.
 * Primary = dark fill; Secondary = quiet cream; Destructive = restrained terracotta.
 */
export function Button({
  variant = 'primary',
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={['ui-button', 'type-button', `ui-button--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
