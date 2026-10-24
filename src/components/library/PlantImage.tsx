import { useEffect, useState } from 'react';

type PlantImageProps = {
  variant?: 'contained' | 'carePortrait' | 'shelf';
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

/**
 * Species illustration with contain fit and graceful fallback.
 * Fallback renders only after image error — never beside a loaded image.
 */
export function PlantImage({
  variant = 'contained',
  src,
  alt,
  className = '',
  fallbackClassName = '',
}: PlantImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <span className={`plant-image plant-image--${variant} ${className}`.trim()}>
      {failed || !src ? (
        <span
          className={`plant-image__fallback ${fallbackClassName}`.trim()}
          aria-hidden="true"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="plant-image__img"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
