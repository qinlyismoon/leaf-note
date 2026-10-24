import type { ReactNode } from 'react';
import { SelectionIndicator } from './SelectionIndicator';

type SelectableProps = {
  type?: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

/** Native selection behavior; callers own geometry and typography. */
export function Selectable({
  type = 'radio', name, value, checked, onChange, disabled = false, className = '', children,
}: SelectableProps) {
  return (
    <label className={`selectable ${className}`}>
      <input
        className="selectable__input"
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {children}
      <SelectionIndicator />
    </label>
  );
}
