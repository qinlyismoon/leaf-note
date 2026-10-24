import { useState, useRef } from 'react';
import { SendHandoffAlert } from './SendHandoffAlert';
import { isValidEmailFormat } from '../../data/users';
import { getSpecies } from '../../data/species';
import type { HandoffEligibility } from '../../utils/handoffAccess';
import { BackButton } from '../BackButton';
import { Button } from '../Button';
import { PlantLabel } from '../PlantLabel';
import { Selectable } from '../Selectable';
import { PlantStack } from './PlantStack';
import { PlantImage } from '../library/PlantImage';

type Props = {
  currentUserEmail: string;
  eligibility: HandoffEligibility[];
  onBack: () => void;
  onSend: (input: { plantIds: string[]; caregiverEmail: string }) => string | null;
};

export function HandoffPage({ currentUserEmail, eligibility, onBack, onSend }: Props) {
  const [step, setStep] = useState<'select' | 'email'>('select');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendOpen, setSendOpen] = useState(false);
  const sending = useRef(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const available = eligibility.filter(item => item.selectable);
  const selected = available.filter(item => selectedIds.includes(item.plant.id)).map(item => item.plant);
  const allSelected = available.length > 0 && available.every(item => selectedIds.includes(item.plant.id));
  const someSelected = !allSelected && selectedIds.length > 0;
  const selectedNames = selected.map(plant => {
    const name = getSpecies(plant.speciesId)?.nameEn ?? plant.name;
    const label = plant.identificationLabel?.trim();
    return label ? `${name} (${label})` : name;
  }).join(', ');
  const remove = (id: string) => setSelectedIds(ids => ids.filter(value => value !== id));
  const back = () => { setError(null); if (step === 'select') onBack(); else setStep('select'); };
  return <div className="subpage screen screen--detail">
    <header className="subpage__header"><BackButton ariaLabel="Back" onClick={back} /><h1 className="page-header__title">Hand off</h1></header>
    <div className="subpage__body">
      {step === 'select' ? <>
        <section className="handoff-section" aria-labelledby="available-plants"><div className="handoff-section__head">
            <h2 id="available-plants" className="type-section-heading">Available plants</h2>
            {available.length > 1 ? (
              <button type="button" role="checkbox" className={`select-all${allSelected ? ' is-all' : someSelected ? ' is-some' : ''}`}
                aria-checked={allSelected ? true : someSelected ? 'mixed' : false}
                onClick={() => setSelectedIds(allSelected ? [] : available.map(item => item.plant.id))}>
                <span className="select-all__box" aria-hidden="true">
                  {allSelected ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg>
                    : someSelected ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M7 12h10" /></svg>
                    : null}
                </span>
                Select all
              </button>
            ) : null}
          </div>
          {available.length ? <><ul className="handoff-select-list">
            {available.map(({ plant }) => {
            const species = getSpecies(plant.speciesId);
            const checked = selectedIds.includes(plant.id);
            return <li key={plant.id}><Selectable type="checkbox" name="handoff-plants" value={plant.id} checked={checked}
              onChange={() => checked ? remove(plant.id) : setSelectedIds(ids => [...ids, plant.id])}
              className="selectable-care-card">
              {plant.photoSrc ? <img src={plant.photoSrc} alt="" className="plant-photo-thumb" />
                : <PlantImage src={species?.imageSrc ?? ''} alt="" variant="carePortrait" />}
              <span className="care-plant-card__copy"><span className="care-plant-card__name">{species?.nameEn ?? plant.name}</span>
                <PlantLabel label={plant.identificationLabel} /></span>
            </Selectable></li>;
          })}</ul><Button disabled={!selected.length} onClick={() => setStep('email')}>
            {selected.length ? `Continue with ${selected.length} ${selected.length === 1 ? 'plant' : 'plants'}` : 'Continue'}
          </Button></>
          : <p className="type-meta handoff-empty">No plants available for handoff.</p>}
        </section>
      </> : <>
        {/* Plants were just chosen: show a compact summary, not a second editor. */}
        <button type="button" className="handoff-summary" onClick={() => { setError(null); setStep('select'); }}
          aria-label={`${selected.length} ${selected.length === 1 ? 'plant' : 'plants'} selected: ${selectedNames}. Change selection`}>
          <PlantStack plants={selected} />
          <span className="handoff-summary__text">
            <span className="handoff-summary__count">{selected.length} {selected.length === 1 ? 'plant' : 'plants'}</span>
            <span className="handoff-summary__names">{selectedNames}</span>
          </span>
          <svg className="handoff-summary__chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
        <label className="sheet-field handoff-recipient"><span className="type-eyebrow">Caregiver email</span>
          <input type="email" className="type-control sheet-field__input" value={email} placeholder="e.g. jordan@leafnote.local" autoComplete="email" autoFocus
            onChange={e => { setEmail(e.target.value); setError(null); }} /></label>
        {error ? <p className="type-meta sheet-tray__error" role="alert">{error}</p> : null}
        <Button disabled={!selected.length} onClick={() => {
          if (!selected.length) return;
          if (!isValidEmailFormat(email)) { setError('Enter a valid email address.'); return; }
          if (email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase()) { setError('Choose a different email than your own.'); return; }
          setError(null); setSendOpen(true);
        }}>Send request</Button>
      </>}
    </div>
    {sendOpen ? <SendHandoffAlert email={email.trim()} count={selected.length}
      onCancel={() => setSendOpen(false)} onConfirm={() => {
        if (sending.current || !selected.length) return;
        sending.current = true;
        const message = onSend({ plantIds: selected.map(p => p.id), caregiverEmail: email.trim() });
        setSendOpen(false);
        if (message) { setError(message); sending.current = false; return; }
        onBack();
      }} /> : null}
  </div>;
}
