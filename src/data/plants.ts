import type { Plant, PlantCareContent, PlantInstance } from '../types';
import { getSpecies } from './species';
import { SPECIES_CARE } from './speciesCare';
// Example instance photos (Unsplash License; sources in src/assets/photos/CREDITS.md).
import deskPhoto from '../assets/photos/echeveria-desk.jpg';
import trayPhoto from '../assets/photos/echeveria-tray.jpg';
import pothosPhoto from '../assets/photos/pothos-living-room.jpg';
import monsteraPhoto from '../assets/photos/monstera-window.jpg';
import snakePlantPhoto from '../assets/photos/snake-plant-hallway.jpg';

/**
 * Desk and Shelf are composite prototype scenarios informed by separate
 * exploratory sources. They do not represent one participant, one handoff
 * event, or complete botanical care guidance.
 *
 * Source status is recorded per content group for developers. It is not shown
 * in the caregiver interface.
 *
 * Species visual: both instances use the Echeveria asset as a
 * **prototype mapping** (not a botanical identification claim).
 *
 * These are canonical plant instances shared across Library, Personal Care,
 * and Shared Space.
 */

const DESK_CARE: PlantCareContent = {
  plantType: 'Succulent',
  identification: [
    {
      text: 'Small succulent on the desk. Soft leaves are the main cue that watering may be needed.',
      source: 'research_evidence',
      note: 'Soft-leaf cue from Interview 01; “desk” placement is mock.',
    },
  ],
  suggestedCheckRhythm: {
    text: 'Suggested check: every few days. Checking does not mean watering.',
    source: 'provisional_interpretation',
    note: '“Every few days” from Interview 01; “Suggested check” is product wording.',
  },
  whyCheck: {
    text: 'Suggested check — look at the leaves and soil before deciding. It has been several days since the last recorded check.',
    source: 'mock_prototype_content',
    note: 'Relative time phrasing uses seed timestamps; not a botanical schedule.',
  },
  whatToObserve: [
    {
      text: 'Gently feel the leaves — soft or firm?',
      source: 'research_evidence',
      note: 'Interview 01 soft-leaf monitoring.',
    },
    {
      text: 'Look at the soil surface.',
      source: 'research_evidence',
      note: 'Interview 02 soil appearance / moisture checks.',
    },
  ],
  whenMayNeedWater: [
    {
      text: 'Soft leaves may mean watering is appropriate.',
      source: 'research_evidence',
      note: 'Interview 01.',
    },
    {
      text: 'Do not water only because time has passed.',
      source: 'provisional_interpretation',
      note: 'Keeps cue-based framing; not a participant quotation.',
    },
  ],
  howToWater: [
    {
      text: 'Move the pot to a sink or basin before watering.',
      source: 'research_evidence',
      note: 'Interview 02 follow-up: plants without a tray may need to be moved.',
    },
    {
      text: 'Water several times until the soil is thoroughly wet.',
      source: 'research_evidence',
      note: 'Interview 01 succulent watering.',
    },
    {
      text: 'Do not measure a volume.',
      source: 'research_evidence',
      note: 'Interview 01 and Interview 02: no precise measurement.',
    },
  ],
  whenToStop: [
    {
      text: 'Stop when the soil looks fully soaked through.',
      source: 'research_evidence',
      note: 'Interview 02 soil saturation as a stopping cue.',
    },
    {
      text: 'There is no tray to collect runoff — watch water in the sink.',
      source: 'research_evidence',
      note: 'Interview 02: pots without trays require more judgment on runoff.',
    },
  ],
  potDrainageLocation: [
    {
      text: 'Drainage holes; no saucer or tray. Dry soil may let water run through before it is absorbed — water more than once if needed.',
      source: 'research_evidence',
      note: 'Interview 02 dry-soil runoff and no-tray uncertainty.',
    },
    {
      text: 'Normally kept on the desk. Water at the sink or basin, then return it.',
      source: 'mock_prototype_content',
      note: 'Desk location is mock; returning plants after watering is Interview 02.',
    },
  ],
};

const SHELF_CARE: PlantCareContent = {
  plantType: 'Succulent',
  identification: [
    {
      text: 'Small succulent on the shelf. Soft leaves are the main cue. This pot is set up differently from the desk plant — see pot notes.',
      source: 'mock_prototype_content',
      note: 'Soft-leaf cue is research-informed; “set up differently” is a constructed contrast.',
    },
  ],
  suggestedCheckRhythm: {
    text: 'Suggested check: every few days. Checking does not mean watering.',
    source: 'provisional_interpretation',
    note: 'Same rhythm wording as Desk; not a botanical requirement.',
  },
  whyCheck: {
    text: 'Suggested check — look at the leaves and soil before deciding. A check was recorded about a day ago.',
    source: 'mock_prototype_content',
    note: 'Uses seed timestamp for display only.',
  },
  whatToObserve: [
    {
      text: 'Gently feel the leaves — soft or firm?',
      source: 'research_evidence',
      note: 'Interview 01 soft-leaf monitoring.',
    },
    {
      text: 'Look at the soil surface.',
      source: 'research_evidence',
      note: 'Interview 02 soil appearance / moisture checks.',
    },
  ],
  whenMayNeedWater: [
    {
      text: 'Soft leaves may mean watering is appropriate.',
      source: 'research_evidence',
      note: 'Interview 01.',
    },
    {
      text: 'Do not water only because time has passed.',
      source: 'provisional_interpretation',
    },
  ],
  howToWater: [
    {
      text: 'Water several times until the soil is thoroughly wet.',
      source: 'research_evidence',
      note: 'Interview 01 succulent watering.',
    },
    {
      text: 'Do not measure a volume.',
      source: 'research_evidence',
    },
    {
      text: 'Whether you water in place depends on whether the tray can catch runoff — see pot notes.',
      source: 'mock_prototype_content',
      note: 'Tied to the constructed Shelf tray contrast.',
    },
  ],
  whenToStop: [
    {
      text: 'Stop when the soil looks thoroughly watered.',
      source: 'research_evidence',
      note: 'Interview 02 soil saturation.',
    },
    {
      text: 'Watch for water collecting in the tray — an observable runoff cue in this mock setup.',
      source: 'mock_prototype_content',
      note: 'Tray-as-stop-cue is informed by Interview 02 / self-analysis generally, but assigning it to Shelf is constructed. Not universal botanical guidance.',
    },
  ],
  potDrainageLocation: [
    {
      text: 'This prototype setup uses a saucer/tray under the pot. The tray can catch runoff and offer a visible cue when water collects.',
      source: 'mock_prototype_content',
      note: 'COMPLETE Shelf tray configuration = mock prototype content. General tray judgment appears in Interview 02 and owner self-analysis, but is not evidence that this participant’s shelf succulent had a tray.',
    },
    {
      text: 'Normally kept on the shelf. Return it to the same spot after watering.',
      source: 'mock_prototype_content',
      note: 'Shelf location is mock; returning plants is Interview 02.',
    },
  ],
};

/** Canonical seed instances — owned by Maya until handed off. */
export const SEED_INSTANCES: PlantInstance[] = [
  {
    id: 'succulent-desk',
    speciesId: 'echeveria',
    name: 'Desk succulent',
    ownerId: 'user-maya',
    location: 'Desk',
    identificationLabel: 'Blue rosette',
    hasTray: false,
    photoSrc: deskPhoto,
    careConfigured: true,
  },
  {
    id: 'succulent-shelf',
    speciesId: 'echeveria',
    name: 'Shelf succulent',
    ownerId: 'user-maya',
    location: 'Shelf',
    identificationLabel: 'Red tips',
    hasTray: true,
    photoSrc: trayPhoto,
    careConfigured: true,
  },
  // Three more mock seed plants so the prototype starts with a realistic small
  // collection. Species, rooms, labels and pot setups are mock prototype
  // content (not participant data); their care copy comes from speciesCare.ts.
  {
    id: 'pothos-living-room',
    speciesId: 'pothos',
    name: 'Living room pothos',
    ownerId: 'user-maya',
    location: 'Living room',
    identificationLabel: 'Marble leaves',
    hasTray: true,
    photoSrc: pothosPhoto,
    careConfigured: true,
  },
  {
    id: 'monstera-window',
    speciesId: 'monstera',
    name: 'Window monstera',
    ownerId: 'user-maya',
    location: 'Window',
    identificationLabel: 'Swiss cheese',
    hasTray: true,
    photoSrc: monsteraPhoto,
    careConfigured: true,
  },
  {
    id: 'snake-plant-hallway',
    speciesId: 'golden-snake-plant',
    name: 'Hallway snake plant',
    ownerId: 'user-maya',
    location: 'Hallway',
    identificationLabel: 'Yellow edges',
    hasTray: false,
    photoSrc: snakePlantPhoto,
    careConfigured: true,
  },
];

export const CARE_CONTENT_BY_ID: Record<string, PlantCareContent> = {
  'succulent-desk': DESK_CARE,
  'succulent-shelf': SHELF_CARE,
};

export const SEED_INSTANCE_IDS = new Set(SEED_INSTANCES.map((p) => p.id));

const SPECIES_NOTE =
  'General houseplant guidance written for the prototype (speciesCare.ts); not research evidence or validated species advice.';

/**
 * Baseline care for any instance without instance-specific content:
 * species guidance from speciesCare.ts, plus pot/tray steps from the
 * instance's own setup. Unknown species fall back to generic cue copy.
 */
function defaultCareContent(instance: PlantInstance): PlantCareContent {
  const speciesName = getSpecies(instance.speciesId)?.nameEn ?? 'Plant';
  const care = SPECIES_CARE[instance.speciesId];
  const mock = (text: string) => ({
    text,
    source: 'mock_prototype_content' as const,
    note: SPECIES_NOTE,
  });
  const location = instance.location?.trim();

  const howToWater = instance.hasTray
    ? [mock('Water slowly at the base of the plant, in place.'), mock('Watch the tray as you pour.')]
    : [mock('Move the pot to a sink or basin before watering.'), mock('Water slowly at the base of the plant.')];
  const whenToStop = [
    mock(instance.hasTray
      ? 'Stop when water starts to collect in the tray.'
      : 'Stop when water starts to run out of the drainage holes.'),
    ...(care?.afterWater ? [mock(care.afterWater)] : []),
  ];
  const potDrainageLocation = [
    mock(instance.hasTray
      ? 'This pot sits on a tray. Empty any water still standing in it after a while.'
      : 'No tray under this pot. Let excess water drain before returning it.'),
    ...(location
      ? [mock(`Normally kept: ${location}. Return it to the same spot after watering.`)]
      : []),
  ];

  if (!care) {
    return {
      plantType: speciesName,
      identification: [mock('Check the leaves and soil.')],
      suggestedCheckRhythm: mock('Check observable leaves and soil before deciding.'),
      whyCheck: mock('Look at the plant before deciding whether it needs water.'),
      whatToObserve: [mock('Look at the leaves and soil surface.'), mock('Notice changes in firmness, color, or moisture.')],
      whenMayNeedWater: [mock('Use visible and touch cues before deciding.'), mock('Do not water only because time has passed.')],
      howToWater,
      whenToStop,
      potDrainageLocation,
    };
  }

  return {
    plantType: care.plantType,
    identification: [mock(care.cue)],
    suggestedCheckRhythm: mock(care.rhythm),
    whyCheck: mock(`${care.cue.replace(/\.$/, '')} before deciding whether it needs water.`),
    whatToObserve: care.observe.map(mock),
    whenMayNeedWater: care.mayNeedWater.map(mock),
    howToWater,
    whenToStop,
    potDrainageLocation,
  };
}

/** Care-configured plants for the Care flow (ids preserved for localStorage). */
export function buildCarePlants(instances: PlantInstance[]): Plant[] {
  return instances
    .filter((instance) => instance.careConfigured)
    .map((instance) => ({
      ...instance,
      ...(CARE_CONTENT_BY_ID[instance.id] ?? defaultCareContent(instance)),
    }));
}

/** @deprecated Prefer buildCarePlants(instances) — kept for storage defaults. */
export const plants: Plant[] = buildCarePlants(SEED_INSTANCES);
