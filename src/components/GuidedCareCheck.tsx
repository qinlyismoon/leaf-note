import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { CareEvent, CareEventType } from '../types';
import { CARE_EVENT_LABELS } from '../types';
import { compressPlantPhoto } from '../utils/photo';
import { formatEventDate, formatRelativeTime } from '../utils/formatRelativeTime';
import { EVENT_ICON_PATHS } from '../utils/eventIcons';
import { Button } from './Button';
import { TimeIcon } from './TimeIcon';
import { LeafArt, SoilArt, type LeafKind } from './StepArt';

/** Plant-specific copy. When given, the check uses it and omits the
 * Echeveria illustrations (they would misrepresent other species). */
export type GuidedStepCopy = {
  observe: string[];
  mayNeedWater: string[];
  howToWater: string[];
  whenToStop: string[];
};

/** Why this plant is worth a look, shown on the start card. */
export type CheckIntro = {
  label: string;
  /** Rendered in the accent color when the check is suggested. */
  suggested: boolean;
  /** Chip color: Overdue (terracotta), Check today (leaf), anytime (neutral). */
  tone?: 'overdue' | 'today' | 'anytime';
  reason: string;
  context: string;
};

type GuidedCareCheckProps = {
  intro: CheckIntro;
  speciesSteps?: GuidedStepCopy;
  /** Days until the next check after a "no water" result. */
  intervalDays?: number;
  /** Species illustration shown beside each step (plant + message). */
  illustrationSrc?: string;
  /** Leaf close-up style for the leaves question. */
  leafKind?: LeafKind;
  /** Hides tray-only watering steps when the pot has no tray. */
  hasTray?: boolean;
  canRecord: boolean;
  isSharedCare: boolean;
  completed: boolean;
  onRecord: (type: CareEventType) => void;
  /** The record just saved: the card turns into its "done" state. */
  recorded?: CareEvent | null;
  /** Owner's name, for the caregiver's photo prompt. */
  ownerName?: string;
  onAddPhoto?: (eventId: string, photoDataUrl: string) => void;
  onDone?: () => void;
};

type Leaves = 'thirsty' | 'fine' | 'unsure';
type Soil = 'dry' | 'damp' | 'unsure';
type Phase = 'intro' | 'leaves' | 'soil' | 'result';
/** open/close: start unfolds top-down (and folds back); forward/back: steps slide sideways. */
type Motion = 'forward' | 'back' | 'open' | 'close';
type Verdict = 'water' | 'wait-damp' | 'wait-firm' | 'unsure';

const ECHEVERIA_COPY: GuidedStepCopy = {
  observe: ['Gently feel a few lower leaves — soft or firm?', 'Look at the soil surface — dry or still damp?'],
  mayNeedWater: [],
  howToWater: ['Move the pot to a sink or basin.', 'Water the soil slowly until it is evenly wet — not into the rosette.'],
  whenToStop: ['Stop when water drains from the bottom.', 'Empty any water left in the tray after a few minutes.'],
};

function verdictOf(leaves: Leaves, soil: Soil): Verdict {
  if (leaves === 'unsure' || soil === 'unsure') return 'unsure';
  if (soil === 'damp') return 'wait-damp';
  if (leaves === 'fine') return 'wait-firm';
  return 'water';
}

function EventIcon({ type }: { type: CareEventType }) {
  return (
    <svg className="outcome__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={EVENT_ICON_PATHS[type]} />
    </svg>
  );
}

/**
 * Cross-fades between panels while the height eases to fit the new one:
 * the old panel fades out in place (absolutely positioned), the new one
 * rises in a beat later, and the container height glides — no snap.
 */
function PanelTransition({ panelKey, dir, children }: { panelKey: string; dir: Motion; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const last = useRef<{ key: string; node: ReactNode }>({ key: panelKey, node: children });
  const [leaving, setLeaving] = useState<{ key: string; node: ReactNode } | null>(null);

  if (last.current.key !== panelKey) {
    // Render-phase handoff: remember the outgoing panel exactly once.
    const outgoing = last.current;
    last.current = { key: panelKey, node: children };
    if (!leaving || leaving.key !== outgoing.key) setLeaving(outgoing);
  } else {
    last.current.node = children;
  }

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => setLeaving(null), 260);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  useLayoutEffect(() => {
    const node = inner.current;
    if (!node) return;
    if (node.offsetHeight !== height) setHeight(node.offsetHeight);
    node.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', () => setHeight(node.offsetHeight), { once: true });
    });
  });
  useLayoutEffect(() => {
    const node = inner.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="guided-check__viewport" style={{ height }}>
      {leaving ? (
        <div key={`out-${leaving.key}`} className={`guided-check__panel is-leaving is-${dir}`} aria-hidden="true" inert>
          {leaving.node}
        </div>
      ) : null}
      <div ref={inner} className="guided-check__measure">
        <div key={panelKey} className={`guided-check__panel is-entering is-${dir}`}>{children}</div>
      </div>
    </div>
  );
}

function CheckChoice({ selected, picked, onClick, children }: {
  selected: boolean; picked: boolean; onClick: () => void; children: ReactNode;
}) {
  return (
    <button type="button" className={`check-choice${selected ? ' is-selected' : ''}${picked ? ' is-picked' : ''}`}
      aria-pressed={selected} onClick={onClick}>
      <span>{children}</span>
      <span className="check-choice__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg>
      </span>
    </button>
  );
}

/** Plant + message: small plant illustration beside the step's question. */
function StepHead({ art, title, hint }: { art?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="step-head">
      {art ? <span className="step-head__art">{art}</span> : null}
      <div>
        <h2 className="step-head__title">{title}</h2>
        {hint ? <p className="guided-check__hint">{hint}</p> : null}
      </div>
    </div>
  );
}

/**
 * Interactive check: answer two quick questions (leaves, soil); the card
 * then says what to do. If it's time to water, a short checklist walks you
 * through it. Outcome buttons use the care colors (watered blue, checked
 * green, not sure amber) shared with the calendar.
 */
export function GuidedCareCheck({
  intro, speciesSteps, intervalDays, illustrationSrc, leafKind = 'succulent', hasTray = true, canRecord,
  recorded, ownerName, onAddPhoto, onDone, isSharedCare, completed, onRecord,
}: GuidedCareCheckProps) {
  const copy = speciesSteps ?? ECHEVERIA_COPY;
  const [phase, setPhase] = useState<Phase>('intro');
  const [dir, setDir] = useState<Motion>('forward');
  const [leaves, setLeaves] = useState<Leaves | null>(null);
  const [soil, setSoil] = useState<Soil | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  const verdict = leaves && soil ? verdictOf(leaves, soil) : null;
  const waterSteps = [...copy.howToWater, ...copy.whenToStop].filter((line) => hasTray || !/tray/i.test(line));
  const order: Phase[] = ['leaves', 'soil', 'result'];
  const position = order.indexOf(phase);

  const go = (next: Phase, direction: Motion = 'forward') => {
    setDir(direction);
    setPhase(next);
  };
  const back = () => {
    if (phase === 'leaves') go('intro', 'close');
    else if (phase === 'soil') go('leaves', 'back');
    else if (phase === 'result') go('soil', 'back');
  };

  // Keep the card where it is; only scroll if its top hides behind the
  // pinned Back row, or the actions fall below the screen.
  const firstRender = useRef(true);
  const prevPhase = useRef<Phase>('intro');
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return undefined; }
    const card = sectionRef.current;
    const scroller = card?.closest('.app-frame__scroll') as HTMLElement | null;
    if (!card || !scroller) return undefined;
    const starting = phase === 'leaves' && prevPhase.current === 'intro';
    const timer = window.setTimeout(() => {
      const view = scroller.getBoundingClientRect();
      const backButton = scroller.querySelector('.detail-bar .back-button');
      const safeTop = (backButton ? backButton.getBoundingClientRect().bottom : view.top) + 12;
      const rect = card.getBoundingClientRect();
      // On Start, glide the card up once (alongside its height easing) so the
      // questions sit below the Back row; later steps never move the page.
      const delta = rect.top < safeTop || starting ? rect.top - safeTop : 0;
      if (delta !== 0) scroller.scrollBy({ top: delta, behavior: 'smooth' });
    }, 30);
    prevPhase.current = phase;
    return () => window.clearTimeout(timer);
  }, [phase]);

  const record = (type: CareEventType) => {
    if (!canRecord || completed) return;
    onRecord(type);
  };

  // Tap → the choice confirms visibly (fill + check pop), then the card moves on.
  const advancing = useRef(false);
  const [justPicked, setJustPicked] = useState<string | null>(null);
  const pick = (id: string, apply: () => void, next: Phase) => {
    if (advancing.current) return;
    advancing.current = true;
    apply();
    setJustPicked(id);
    window.setTimeout(() => {
      advancing.current = false;
      setJustPicked(null);
      go(next);
    }, 320);
  };

  // One screen, one action: the answers decide the outcome; the single
  // button says exactly what will be saved. To change it, go back a step.
  const saveButton = (type: CareEventType, label: string) => (
    <div className="guided-check__outcomes">
      {!canRecord ? <p className="guided-check__readonly type-meta">The current caregiver records this result.</p> : null}
      <button type="button" className={`outcome outcome--${type} outcome--primary`}
        disabled={!canRecord || completed} onClick={() => record(type)}>
        <EventIcon type={type} />{label}
      </button>
    </div>
  );

  let panel: ReactNode;
  if (phase === 'intro') {
    panel = (
      <div className="guided-check__intro">
        <span className={`status-chip status-chip--${intro.tone ?? (intro.suggested ? 'today' : 'anytime')}`}>{intro.label}</span>
        <h2 id="guided-check-start" className="type-content-identity">{intro.reason}</h2>
        <p className="type-meta time-line"><TimeIcon />{intro.context}</p>
        <Button onClick={() => go('leaves', 'open')}>Start check</Button>
      </div>
    );
  } else if (phase === 'leaves') {
    panel = (
      <div className="guided-check__q">
        <StepHead art={<LeafArt kind={leafKind} />} title="How do the leaves feel?" hint={copy.observe[0]} />
        <div className="check-choices">
          <CheckChoice picked={justPicked === 'l-thirsty'} selected={leaves === 'thirsty'} onClick={() => pick('l-thirsty', () => setLeaves('thirsty'), 'soil')}>Soft, wrinkled or drooping</CheckChoice>
          <CheckChoice picked={justPicked === 'l-fine'} selected={leaves === 'fine'} onClick={() => pick('l-fine', () => setLeaves('fine'), 'soil')}>Firm and normal</CheckChoice>
          <CheckChoice picked={justPicked === 'l-unsure'} selected={leaves === 'unsure'} onClick={() => pick('l-unsure', () => setLeaves('unsure'), 'soil')}>Not sure</CheckChoice>
        </div>
      </div>
    );
  } else if (phase === 'soil') {
    panel = (
      <div className="guided-check__q">
        <StepHead art={<SoilArt />} title="How does the soil feel?" hint={copy.observe[1] ?? 'Press a finger into the top of the soil.'} />
        <div className="check-choices">
          <CheckChoice picked={justPicked === 's-dry'} selected={soil === 'dry'} onClick={() => pick('s-dry', () => { setSoil('dry'); setDone(new Set()); }, 'result')}>Dry</CheckChoice>
          <CheckChoice picked={justPicked === 's-damp'} selected={soil === 'damp'} onClick={() => pick('s-damp', () => setSoil('damp'), 'result')}>Still damp</CheckChoice>
          <CheckChoice picked={justPicked === 's-unsure'} selected={soil === 'unsure'} onClick={() => pick('s-unsure', () => setSoil('unsure'), 'result')}>Not sure</CheckChoice>
        </div>
      </div>
    );
  } else if (verdict === 'water') {
    // Time to water: the how-to sits right here, then one action.
    panel = (
      <div className="guided-check__q">
        <StepHead art={illustrationSrc ? <img src={illustrationSrc} alt="" /> : undefined}
          title="Time to water" hint="Soft leaves, dry soil." />
        <ul className="water-steps">
          {waterSteps.map((line, index) => {
            const ticked = done.has(index);
            return (
              <li key={line}>
                <button type="button" className={`water-step${ticked ? ' is-done' : ''}`} aria-pressed={ticked}
                  onClick={() => setDone((current) => {
                    const next = new Set(current);
                    if (next.has(index)) next.delete(index); else next.add(index);
                    return next;
                  })}>
                  <span className="water-step__box" aria-hidden="true">
                    {ticked ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg> : index + 1}
                  </span>
                  <span>{line}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {saveButton('watered', 'I watered it')}
      </div>
    );
  } else if (verdict) {
    const result = {
      'wait-damp': { title: 'No water needed', body: 'Soil is still damp.' },
      'wait-firm': { title: 'Not yet', body: 'Leaves are still firm.' },
      unsure: { title: 'Look again tomorrow', body: '' },
    }[verdict];
    const unsure = verdict === 'unsure';
    panel = (
      <div className={`verdict-layout verdict-layout--${unsure ? 'not_sure' : 'checked'}`}>
        {illustrationSrc ? <div className="verdict-layout__art"><img src={illustrationSrc} alt="" /></div> : null}
        <div className="verdict-layout__body">
          <h2 className="verdict-layout__title">{result.title}</h2>
          {result.body ? <p className="verdict-layout__text">{result.body}</p> : null}
          {!unsure ? <p className="verdict__next time-line"><TimeIcon />Next check in {intervalDays ?? 'a few'} days</p> : null}
          {unsure ? saveButton('not_sure', 'Save as not sure') : saveButton('checked', 'Save check')}
        </div>
      </div>
    );
  }

  // Saved: the same card becomes the "done" state (no separate card below).
  const isDone = Boolean(recorded);
  if (recorded) {
    const photo = recorded.photoDataUrl;
    panel = (
      <div className="check-done">
        <div className="check-done__head">
          <span className={`check-done__mark check-done__mark--${recorded.type}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg>
          </span>
          <div>
            <h2 className="check-done__title">{CARE_EVENT_LABELS[recorded.type]}</h2>
            <p className="type-meta time-line"><TimeIcon />{formatRelativeTime(recorded.timestamp)} · {formatEventDate(recorded.timestamp)}</p>
          </div>
        </div>
        {isSharedCare && onAddPhoto ? (
          <label className={`photo-drop${photo ? ' has-photo' : ''}`}>
            <input className="visually-hidden" type="file" accept="image/*" capture="environment"
              onChange={async (event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = '';
                if (!file) return;
                try { onAddPhoto(recorded.id, await compressPlantPhoto(file)); } catch { /* keep the record */ }
              }} />
            {photo ? (
              <>
                <img src={photo} alt={`Photo for ${ownerName ?? 'the owner'}`} />
                <span className="photo-drop__retake" aria-label="Retake photo">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" /><circle cx="12" cy="13" r="3.3" /></svg>
                </span>
              </>
            ) : (
              <>
                <span className="photo-drop__camera" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10H4z" /><circle cx="12" cy="13" r="3.3" /></svg>
                </span>
                <span className="photo-drop__title">Take a photo for {ownerName ?? 'the owner'}</span>
              </>
            )}
          </label>
        ) : null}
        {onDone ? <Button onClick={onDone}>Done</Button> : null}
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`guided-check${phase === 'intro' ? ' guided-check--start' : ' is-started'}`}
      aria-labelledby={phase === 'intro' ? 'guided-check-start' : undefined}
      aria-live="polite"
    >
      {phase !== 'intro' && !isDone ? (
        <div className="guided-check__bar">
          <button type="button" className="guided-check__back" aria-label="Previous question" onClick={back}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <div className="progress-indicator" style={{ gridTemplateColumns: `repeat(${order.length}, 1fr)` } as CSSProperties}
            aria-label={`Step ${position + 1} of ${order.length}`}>
            {order.map((item, index) => (
              <span key={item} className={`progress-indicator__segment${index <= position ? ' is-active' : ''}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      ) : null}
      <PanelTransition panelKey={isDone ? 'done' : phase} dir={isDone ? 'open' : dir}>{panel}</PanelTransition>
    </section>
  );
}
