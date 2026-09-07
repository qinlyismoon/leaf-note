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

export function enrichPlantsWithActivity(
  plantList: Plant[],
  events: CareEvent[],
  presentationByPlant: Record<string, PresentationState>,
  now: Date = new Date(),
): PlantWithActivity[] {
  return plantList.map((plant) => {
    const lastEvent = getLastEventForPlant(plant.id, events);
    const daysSinceLastEvent = lastEvent
      ? daysBetween(new Date(lastEvent.timestamp), now)
      : null;

    return {
      ...plant,
      presentationState:
        presentationByPlant[plant.id] ?? 'suggested_check',
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
