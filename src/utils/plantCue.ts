import type { Plant } from '../types';

/** Instance-specific one-line cues for the research-informed seed plants. */
const INSTANCE_CUES: Record<string, string> = {
  'succulent-desk': 'Check for soft leaves.',
  'succulent-shelf': 'Check for soft leaves. This pot has a tray.',
};

/** The single observable cue to act on now (list card line, detail headline). */
export function plantCue(plant: Pick<Plant, 'id' | 'identification'>): string {
  return INSTANCE_CUES[plant.id] ?? plant.identification[0]?.text ?? '';
}
