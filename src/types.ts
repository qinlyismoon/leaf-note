import type { CheckStatus } from './utils/checkSchedule';
export type CareEventType = 'checked' | 'watered' | 'not_sure';

export type CareContext = 'personal' | 'shared';

export type AppTab = 'care' | 'shared' | 'library' | 'profile';

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

/** Preset species template — name + visual asset. */
export type PlantSpecies = {
  id: string;
  nameEn: string;
  nameZh: string;
  imageSrc: string;
};

/**
 * Individual plant added or seeded for the user.
 * Identification labels belong to the instance, not the species.
 * Ownership does not move during Handoff.
 */
export type PlantInstance = {
  id: string;
  speciesId: string;
  name: string;
  /** Prototype user who owns this instance. */
  ownerId: string;
  location?: string;
  identificationLabel?: string;
  /** Pot/tray setup belongs to the instance, not the species. */
  hasTray: boolean;
  /**
   * Photo of this specific plant (asset URL or compressed JPEG data URL).
   * Distinguishes instances of the same species; species illustration is the fallback.
   */
  photoSrc?: string;
  /** When false, instance appears in Library only — not in Care checks. */
  careConfigured: boolean;
};

/** Care-instruction payload for configured instances only. */
export type PlantCareContent = {
  plantType: string;
  identification: SourcedText[];
  suggestedCheckRhythm: SourcedText;
  whyCheck: SourcedText;
  whatToObserve: SourcedText[];
  whenMayNeedWater: SourcedText[];
  howToWater: SourcedText[];
  whenToStop: SourcedText[];
  potDrainageLocation: SourcedText[];
};

/**
 * Care-configured plant used by the Care flow.
 * Same instance id as Library; not a duplicate.
 */
export type Plant = PlantInstance & PlantCareContent;

export type CareEvent = {
  id: string;
  plantId: string;
  type: CareEventType;
  timestamp: string;
  /** Who recorded this event (owner or caregiver). */
  actorUserId: string;
  /** Optional local prototype image attached after a care action. */
  photoDataUrl?: string;
};

/** Seeded prototype identity for local Handoff matching (no real auth). */
export type PrototypeUser = {
  id: string;
  displayName: string;
  /** Canonical lowercase email used for matching. */
  email: string;
  initials: string;
};

export type HandoffStatus = 'pending' | 'accepted' | 'declined' | 'ended' | 'cancelled';

export type Handoff = {
  id: string;
  ownerId: string;
  caregiverUserId: string;
  caregiverEmail: string;
  plantIds: string[];
  status: HandoffStatus;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
};

export type RelationshipUpdateKind = 'handoff_request' | 'care_activity' | 'care_reminder';

/** Event inbox item — not chat. Persisted in localStorage. */
export type RelationshipUpdate = {
  id: string;
  kind: RelationshipUpdateKind;
  recipientUserId: string;
  actorUserId: string;
  handoffId?: string;
  careEventId?: string;
  plantId?: string;
  plantIds?: string[];
  message: string;
  createdAt: string;
  readAt: string | null;
  reactionUserId?: string;
  reactionAt?: string;
  /** Short replies on a care activity, oldest first. */
  replies?: UpdateReply[];
};

export type UpdateReply = { id: string; userId: string; text: string; createdAt: string };

/** Visual variants of the shared Care plant card. */
export type CarePlantCardVariant =
  | 'actionable'
  | 'handed_off_owner'
  | 'shared_owner'
  | 'shared_caregiver';
export type OwnerHandoffPresentation =
  | { kind: 'pending'; caregiverEmail: string; handoffId: string }
  | {
      kind: 'accepted';
      caregiverEmail: string;
      handoffId: string;
    };

export type PlantWithActivity = Plant & {
  presentationState: PresentationState;
  /** Date-based check status (see utils/checkSchedule). */
  checkStatus: CheckStatus;
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

export const IDENTIFICATION_LABEL_MAX = 5; // counting units (words / CJK chars)
