import type { CarePlantCardVariant, Handoff, Plant } from '../types';
import {
  getActiveHandoffForPlant,
  getBlockedPlantIds,
} from '../storage/handoffs';

export function filterPersonalCarePlants(
  plants: Plant[],
  currentUserId: string,
): Plant[] {
  return plants.filter((plant) => plant.ownerId === currentUserId);
}

export function filterSharedCarePlants(
  plants: Plant[],
  sharedPlantIds: string[],
): Plant[] {
  const allowed = new Set(sharedPlantIds);
  return plants.filter((plant) => allowed.has(plant.id));
}

/** Personal badge plant ids — exclude accepted handoffs. */
export function personalBadgePlantIds(
  plants: Plant[],
  currentUserId: string,
  handoffs: Handoff[],
): string[] {
  return filterPersonalCarePlants(plants, currentUserId)
    .filter((plant) => {
      const active = getActiveHandoffForPlant(plant.id, handoffs);
      return !active || active.status !== 'accepted';
    })
    .map((plant) => plant.id);
}

export function getCarePlantCardVariant(
  plant: Plant,
  careContext: 'personal' | 'shared',
  currentUserId: string,
  handoffs: Handoff[],
): CarePlantCardVariant {
  const active = getActiveHandoffForPlant(plant.id, handoffs);

  if (careContext === 'personal') {
    if (active?.status === 'accepted') {
      return 'handed_off_owner';
    }
    return 'actionable';
  }

  if (active?.status === 'accepted' && active.caregiverUserId === currentUserId) {
    return 'shared_caregiver';
  }
  return 'shared_owner';
}

export function canRecordCare(
  plant: Plant,
  careContext: 'personal' | 'shared',
  currentUserId: string,
  handoffs: Handoff[],
): boolean {
  const variant = getCarePlantCardVariant(
    plant,
    careContext,
    currentUserId,
    handoffs,
  );
  return variant === 'actionable' || variant === 'shared_caregiver';
}

export type HandoffEligibility = {
  plant: Plant;
  selectable: boolean;
  reason?: string;
};

export function listHandoffEligibility(
  plants: Plant[],
  currentUserId: string,
  handoffs: Handoff[],
): HandoffEligibility[] {
  const blocked = getBlockedPlantIds(handoffs);
  return plants
    .filter((plant) => plant.ownerId === currentUserId)
    .map((plant) => {
      if (!plant.careConfigured) {
        return {
          plant,
          selectable: false,
          reason: 'Care not configured',
        };
      }
      if (blocked.has(plant.id)) {
        const active = getActiveHandoffForPlant(plant.id, handoffs);
        return {
          plant,
          selectable: false,
          reason:
            active?.status === 'accepted'
              ? 'Already handed off'
              : 'Pending handoff',
        };
      }
      return { plant, selectable: true };
    });
}
