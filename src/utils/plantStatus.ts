import { getCheckStatus, isCheckNeeded } from './checkSchedule';
import type {
  CareEvent,
  Plant,
  PlantWithActivity,
  PresentationState,
} from '../types';

function daysBetween(earlier: Date, later: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((later.getTime() - earlier.getTime()) / msPerDay);
}

export function getLastEventForPlant(
  plantId: string,
  events: CareEvent[],
): CareEvent | null {
  const plantEvents = events
    .filter((event) => event.plantId === plantId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return plantEvents[0] ?? null;
}

export function getEventsForPlant(
  plantId: string,
  events: CareEvent[],
): CareEvent[] {
  return events
    .filter((event) => event.plantId === plantId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}

/**
 * One care state for a canonical plant, independent of role or handoff:
 * "suggested" whenever its check is due today or overdue (date-based, from
 * the species rhythm and the last Checked / Watered record).
 */
export function getCarePresentationState(
  plantId: string,
  speciesId: string,
  events: CareEvent[],
  now: Date = new Date(),
): PresentationState {
  return isCheckNeeded(getCheckStatus(plantId, speciesId, events, now))
    ? 'suggested_check'
    : 'recently_checked';
}

export function enrichPlantsWithActivity(
  plantList: Plant[],
  events: CareEvent[],
  now: Date = new Date(),
): PlantWithActivity[] {
  return plantList.map((plant) => {
    const lastEvent = getLastEventForPlant(plant.id, events);
    const daysSinceLastEvent = lastEvent
      ? daysBetween(new Date(lastEvent.timestamp), now)
      : null;
    const checkStatus = getCheckStatus(plant.id, plant.speciesId, events, now);

    return {
      ...plant,
      checkStatus,
      presentationState: isCheckNeeded(checkStatus) ? 'suggested_check' : 'recently_checked',
      lastEvent,
      daysSinceLastEvent,
    };
  });
}

export function groupPlantsByPresentation(
  plantsWithActivity: PlantWithActivity[],
): {
  suggestedChecks: PlantWithActivity[];
  recentlyChecked: PlantWithActivity[];
} {
  const suggestedChecks = plantsWithActivity.filter(
    (plant) => plant.presentationState === 'suggested_check',
  );
  const recentlyChecked = plantsWithActivity.filter(
    (plant) => plant.presentationState === 'recently_checked',
  );

  return { suggestedChecks, recentlyChecked };
}
