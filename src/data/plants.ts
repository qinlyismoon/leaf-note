import type { Plant } from '../types';

/**
 * Desk and Shelf are composite prototype scenarios informed by separate
 * exploratory sources. They do not represent one participant, one handoff
 * event, or complete botanical care guidance.
 *
 * Source status is recorded per content group for developers. It is not shown
 * in the caregiver interface.
 */

export const plants: Plant[] = [
  {
    id: 'succulent-desk',
    name: 'Desk succulent',
    plantType: 'Succulent',
    location: 'Desk',
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
    presentationState: 'suggested_check',
  },
  {
    id: 'succulent-shelf',
    name: 'Shelf succulent',
    plantType: 'Succulent',
    location: 'Shelf',
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
    presentationState: 'recently_checked',
  },
];
