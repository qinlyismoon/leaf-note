/**
 * Small step illustrations for the guided check (original, flat style to
 * match the species art): a leaf close-up per plant type, and soil in a pot.
 */
export type LeafKind = 'succulent' | 'heart' | 'split' | 'sword' | 'oval' | 'frond';

export const LEAF_KIND_BY_SPECIES: Record<string, LeafKind> = {
  echeveria: 'succulent',
  'jade-plant': 'succulent',
  pothos: 'heart',
  monstera: 'split',
  'golden-snake-plant': 'sword',
  'spider-plant': 'sword',
  'zz-plant': 'oval',
  'parlor-palm': 'frond',
};

const LEAF = '#8fb08a';
const LEAF_DARK = '#5f8a5f';
const VEIN = '#e9f1e2';

export function LeafArt({ kind }: { kind: LeafKind }) {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" className="step-art">
      {kind === 'succulent' ? (
        <g>
          <path d="M32 8c9 8 14 19 12 31-2 10-7 16-12 17-5-1-10-7-12-17-2-12 3-23 12-31z" fill={LEAF} />
          <path d="M32 8c-4 10-5 26 0 48" stroke={LEAF_DARK} strokeWidth="1.6" fill="none" opacity="0.5" />
          <path d="M32 8c3 2 5 4 6 6" stroke="#d98b7a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <ellipse cx="37" cy="30" rx="3" ry="9" fill="#fff" opacity="0.25" />
        </g>
      ) : null}
      {kind === 'heart' ? (
        <g transform="rotate(180 32 32)">
          <path d="M32 56C18 44 9 34 11 22c1-7 7-11 13-9 4 1 7 4 8 8 1-4 4-7 8-8 6-2 12 2 13 9 2 12-7 22-21 34z" fill={LEAF} />
          <path d="M32 21v35M32 34l-10-8M32 42l-11-5M32 34l10-8M32 42l11-5" stroke={VEIN} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M20 18c-4 3-6 7-6 12" stroke="#f3e7a8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>
      ) : null}
      {kind === 'split' ? (
        <g>
          <path d="M32 56C14 50 6 36 9 22 12 10 22 6 32 6s20 4 23 16c3 14-5 28-23 34z" fill={LEAF_DARK} />
          <g stroke="#f2f6ee" strokeWidth="3.2" strokeLinecap="round">
            <path d="M10 26l12 4M9 36l13 0M14 46l11-5M54 26l-12 4M55 36l-13 0M50 46l-11-5" />
          </g>
          <ellipse cx="24" cy="22" rx="2.2" ry="3.2" fill="#f2f6ee" />
          <ellipse cx="40" cy="22" rx="2.2" ry="3.2" fill="#f2f6ee" />
          <path d="M32 8v48" stroke={VEIN} strokeWidth="1.6" fill="none" opacity="0.8" />
        </g>
      ) : null}
      {kind === 'sword' ? (
        <g>
          <path d="M24 58c-3-18-2-36 6-52 6 16 7 34 4 52z" fill={LEAF_DARK} />
          <path d="M26 58c-2-17-1-33 4-48" stroke="#e7d77a" strokeWidth="2.2" fill="none" />
          <path d="M36 58c2-14 6-26 14-36-1 13-4 25-8 36z" fill={LEAF} />
          <path d="M28 30l4-2M27 40l5-2M28 50l4-2" stroke="#a9c6a0" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ) : null}
      {kind === 'oval' ? (
        <g>
          <path d="M32 58V10" stroke={LEAF_DARK} strokeWidth="2.4" strokeLinecap="round" />
          {[14, 26, 38].map((y) => (
            <g key={y}>
              <path d={`M32 ${y + 4}c-12 0-16-6-14-12 8 0 14 4 14 12z`} fill="#4f7d52" />
              <path d={`M32 ${y + 4}c12 0 16-6 14-12-8 0-14 4-14 12z`} fill="#4f7d52" />
              <path d={`M22 ${y - 4}c3 1 6 3 8 6`} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.4" fill="none" />
            </g>
          ))}
        </g>
      ) : null}
      {kind === 'frond' ? (
        <g>
          <path d="M14 56C26 40 38 26 52 10" stroke={LEAF_DARK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = 18 + i * 6;
            const y = 51 - i * 7;
            return (
              <g key={i}>
                <path d={`M${x} ${y}c-8-2-12-7-13-12 6 1 11 5 13 12z`} fill={LEAF} />
                <path d={`M${x} ${y}c2-8 6-12 12-13-1 6-5 11-12 13z`} fill={LEAF} />
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}

export function SoilArt() {
  // Pot seen slightly from above: the soil surface (texture, crumbs) is the subject.
  const crumbs: [number, number, number, string][] = [
    [18, 27, 1.5, '#8a6247'], [24, 30, 1.1, '#4e3424'], [30, 26, 1.6, '#8a6247'], [36, 30, 1.2, '#4e3424'],
    [42, 27, 1.4, '#8a6247'], [47, 30, 1.1, '#4e3424'], [21, 33, 1.1, '#8a6247'], [27, 34, 1.3, '#a17656'],
    [34, 33.5, 1.0, '#8a6247'], [40, 34, 1.3, '#a17656'], [45, 33, 1.0, '#8a6247'], [15, 30, 1.0, '#a17656'],
    [32, 30, 1.0, '#a17656'], [38, 26, 0.9, '#4e3424'], [25, 26.5, 0.9, '#a17656'],
  ];
  return (
    <svg viewBox="5 14 54 46" width="64" height="64" aria-hidden="true" className="step-art">
      {/* pot body */}
      <path d="M9 30c0 4 1 8 3 22 .3 2 2 3.5 4 3.5h32c2 0 3.7-1.5 4-3.5 2-14 3-18 3-22z" fill="#d8906a" />
      <path d="M14 40c10 3 26 3 36 0" stroke="#c97d58" strokeWidth="1.4" fill="none" opacity="0.6" />
      {/* rim */}
      <ellipse cx="32" cy="30" rx="25" ry="11" fill="#e3a07c" />
      {/* soil surface */}
      <ellipse cx="32" cy="30" rx="21" ry="8.6" fill="#6f4c36" />
      <path d="M12 31c4 4 12 6.5 20 6.5s16-2.5 20-6.5" stroke="#5a3c2a" strokeWidth="1.2" fill="none" opacity="0.6" />
      <g>
        {crumbs.map(([cx, cy, r, fill]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />)}
      </g>
      <ellipse cx="26" cy="27" rx="6" ry="1.6" fill="#fff" opacity="0.08" />
    </svg>
  );
}
