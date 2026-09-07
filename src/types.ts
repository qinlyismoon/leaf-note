export type CareEventType = 'checked' | 'watered' | 'not_sure';

export type CareContext = 'personal' | 'shared';

export type AppTab = 'care' | 'library' | 'profile';

/**
 * Developer-facing provenance for sample copy.
 * Not shown in the caregiver UI.
 */
export type SourceStatus =
  | 'research_evidence'
  | 'owner_self_analysis'
  | 'provisional_interpretation'
  | 'mock_prototype_content';

export type SourcedText = {
  text: string;
  source: SourceStatus;
  note?: string;
};

/**
 * Explicit mock list presentation — not derived from a care schedule.
 * Stored per care context for Personal vs Shared.
 */
export type PresentationState = 'suggested_check' | 'recently_checked';

export type Plant = {
  id: string;
  name: string;
  plantType: string;
  speciesId: string;
  location: string;
  /** Short shelf label — max 5 visible chars when editable (Iteration 2+) */
  identificationLabel: string;
  identification: SourcedText[];
  suggestedCheckRhythm: SourcedText;
  whyCheck: SourcedText;
  whatToObserve: SourcedText[];
  whenMayNeedWater: SourcedText[];
  howToWater: SourcedText[];
  whenToStop: SourcedText[];
  potDrainageLocation: SourcedText[];
};

export type CareEvent = {
  id: string;
  plantId: string;
  type: CareEventType;
  timestamp: string;
};

export type PlantWithActivity = Plant & {
  presentationState: PresentationState;
  lastEvent: CareEvent | null;
  daysSinceLastEvent: number | null;
};

export type PresentationStore = Record<
  CareContext,
  Record<string, PresentationState>
>;

export const CARE_EVENT_LABELS: Record<CareEventType, string> = {
  checked: 'Checked — no water needed',
  watered: 'Watered',
  not_sure: 'Not sure',
};

export const CARE_EVENT_HISTORY_LABELS: Record<CareEventType, string> = {
  checked: 'Checked',
  watered: 'Watered',
  not_sure: 'Not sure',
};

export function textsOf(items: SourcedText[]): string[] {
  return items.map((item) => item.text);
}
