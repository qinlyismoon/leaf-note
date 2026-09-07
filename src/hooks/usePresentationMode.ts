import { useEffect, useState } from 'react';

const QUERY = '(min-width: 768px)';

/**
 * Desktop presentation canvas vs real-mobile full bleed.
 * Driven by viewport width — not by product role.
 */
export function usePresentationMode(): boolean {
  const [isPresentation, setIsPresentation] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setIsPresentation(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isPresentation;
}
