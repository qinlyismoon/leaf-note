import type {
  CareEvent,
  Handoff,
  PlantInstance,
  PresentationStore,
  RelationshipUpdate,
} from '../types';
import { removeCareEventsForPlant } from './careEvents';
import { removeHandoffsForPlant, loadHandoffs } from './handoffs';
import { removePlantInstance } from './plantInstances';
import { removePlantPresentation } from './presentation';
import {
  loadRelationshipUpdates,
  removeUpdatesForPlant,
} from './relationshipUpdates';

export type RemovePlantResult = {
  instances: PlantInstance[];
  careEvents: CareEvent[];
  presentation: PresentationStore;
  handoffs: Handoff[];
  updates: RelationshipUpdate[];
};

/**
 * Single plant-removal operation: instance + care + presentation + handoff refs.
 * Does not mutate PlantSpecies presets.
 */
export function removePlantCascade(instanceId: string): RemovePlantResult {
  const instances = removePlantInstance(instanceId);
  const careEvents = removeCareEventsForPlant(instanceId);
  const presentation = removePlantPresentation(instanceId);
  const handoffs = removeHandoffsForPlant(instanceId);
  const updates = removeUpdatesForPlant(instanceId);
  return {
    instances,
    careEvents,
    presentation,
    handoffs: handoffs.length ? handoffs : loadHandoffs(),
    updates: updates.length ? updates : loadRelationshipUpdates(),
  };
}
