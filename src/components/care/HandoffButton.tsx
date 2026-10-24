import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type HandoffButtonProps = {
  onClick: () => void;
};

/**
 * The one Hand off entry: a floating forest pill above the tab bar, bottom
 * right. Care and Shared both render it, so it sits in exactly the same spot
 * on either tab — and leaves the top-right corner for page tools (Updates).
 * Portaled into .app-frame so it floats outside the scroller.
 */
export function HandoffButton({ onClick }: HandoffButtonProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHost(document.querySelector('.app-frame') as HTMLElement | null);
  }, []);

  const button = (
    <button type="button" className="handoff-button" onClick={onClick}>
      <i className="ri-hand-heart-line" aria-hidden="true" />
      <span>Hand off</span>
    </button>
  );
  // Server render / tests: render inline.
  return host ? createPortal(button, host) : button;
}
