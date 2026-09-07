export type CareEventType = 'checked' | 'watered' | 'not_sure';

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
 */
export type PresentationState = 'suggested_check' | 'recently_checked';

export type Plant = {
  id: string;
  name: string;
  plantType: string;
  location: string;
  identification: SourcedText[];
  suggestedCheckRhythm: SourcedText;
  whyCheck: SourcedText;
  whatToObserve: SourcedText[];
  whenMayNeedWater: SourcedText[];
  howToWater: SourcedText[];
  whenToStop: SourcedText[];
  potDrainageLocation: SourcedText[];
  /** Mock list grouping only — not a watering schedule rule */
  presentationState: PresentationState;
};

export type CareEvent = {
  id: string;
  plantId: string;
  type: CareEventType;
  timestamp: string;
};

export type PlantWithActivity = Plant & {
  lastEvent: CareEvent | null;
  daysSinceLastEvent: number | null;
};

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
