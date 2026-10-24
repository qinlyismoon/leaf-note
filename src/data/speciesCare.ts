/**
 * Species-level baseline care guidance for the prototype.
 *
 * Source status: mock_prototype_content. Written from general houseplant
 * care conventions so every preset species has usable, cue-based copy in the
 * guided check. It is NOT research evidence, NOT drawn from interviews, and
 * NOT validated species advice. Instance-specific research-informed content
 * (Desk / Shelf Echeveria in plants.ts) takes precedence over this file.
 *
 * Voice follows the product principle: check observable cues first;
 * checking does not mean watering; no measured volumes.
 */
export type SpeciesCare = {
  /** Short plant-type line shown as metadata. */
  plantType: string;
  /** One-line cue shown on Care list cards. */
  cue: string;
  rhythm: string;
  /** Days between suggested checks (drives Overdue / Check today). */
  intervalDays: number;
  observe: string[];
  mayNeedWater: string[];
  /** General care notes for the plant profile (not the step-by-step check). */
  basics: { light: string; water: string; soil: string; environment: string; tip: string };
  /** Extra stop / after-watering cue specific to the species, if any. */
  afterWater?: string;
};

export const SPECIES_CARE: Record<string, SpeciesCare> = {
  pothos: {
    plantType: 'Trailing foliage plant',
    cue: 'Check for drooping leaves.',
    intervalDays: 7,
    basics: {
      light: "Bright, indirect light; copes with lower light.",
      water: "When the top few centimetres of soil are dry — roughly weekly.",
      soil: "Regular, well-draining potting mix.",
      environment: "18–29 °C (65–85 °F); normal home humidity is fine.",
      tip: "Trim long trailing stems to keep it full.",
    },
    rhythm: 'Suggested check: about once a week. Checking does not mean watering.',
    observe: [
      'Look for leaves drooping or curling inward.',
      'Press a finger into the top of the soil — dry or still damp?',
    ],
    mayNeedWater: [
      'Drooping leaves with dry top soil may mean it is time to water.',
      'Yellow leaves with damp soil usually mean it does not need more water.',
    ],
  },
  'golden-snake-plant': {
    plantType: 'Succulent-like foliage plant',
    cue: 'Check that the soil is fully dry.',
    intervalDays: 14,
    basics: {
      light: "Bright, indirect light is best; tolerates low light.",
      water: "Only once the soil is completely dry — every 2–3 weeks, less in winter.",
      soil: "Fast-draining cactus or succulent mix.",
      environment: "15–29 °C (60–85 °F); dry air is fine. Keep away from cold drafts.",
      tip: "Too much water is the most common problem.",
    },
    rhythm: 'Suggested check: every two to three weeks. Checking does not mean watering.',
    observe: [
      'Push a finger deep into the soil — is it dry most of the way down?',
      'Look at the leaves: wrinkled or curling, or firm and upright?',
    ],
    mayNeedWater: [
      'Water only once the soil has dried out completely.',
      'Soft or mushy leaf bases mean too much water — do not water.',
    ],
    afterWater: 'Let the soil dry out fully before the next watering.',
  },
  'zz-plant': {
    plantType: 'Drought-tolerant foliage plant',
    cue: 'Check for dry soil and wrinkled stems.',
    intervalDays: 14,
    basics: {
      light: "Medium to bright indirect light; tolerates low light.",
      water: "Once the soil has dried out fully — every 2–3 weeks.",
      soil: "Well-draining mix with some grit.",
      environment: "15–26 °C (60–80 °F); normal home humidity.",
      tip: "Its thick roots store water, so a missed watering is fine.",
    },
    rhythm: 'Suggested check: every two to three weeks. Checking does not mean watering.',
    observe: [
      'Push a finger deep into the soil — is it dry most of the way down?',
      'Look at the stems and leaves: wrinkled, or plump and glossy?',
    ],
    mayNeedWater: [
      'Water only once the soil has dried out completely.',
      'Yellowing stems with damp soil mean it does not need water.',
    ],
    afterWater: 'Let the soil dry out fully before the next watering.',
  },
  'spider-plant': {
    plantType: 'Foliage plant',
    cue: 'Check for limp or pale leaves.',
    intervalDays: 7,
    basics: {
      light: "Bright, indirect light.",
      water: "Keep lightly moist; water when the top of the soil is dry.",
      soil: "General potting mix.",
      environment: "13–27 °C (55–80 °F); likes a little humidity.",
      tip: "Brown tips often come from dry air or hard tap water.",
    },
    rhythm: 'Suggested check: about once a week. Checking does not mean watering.',
    observe: [
      'Feel the top of the soil — dry or still damp?',
      'Look for limp, pale leaves or new brown tips.',
    ],
    mayNeedWater: [
      'Limp leaves with dry top soil may mean it is time to water.',
      'If the soil is still damp, wait and check again later.',
    ],
  },
  'jade-plant': {
    plantType: 'Succulent',
    cue: 'Check for wrinkled leaves.',
    intervalDays: 14,
    basics: {
      light: "Bright light with some direct sun.",
      water: "Water deeply, then let the soil dry — about every 2 weeks.",
      soil: "Cactus or succulent mix.",
      environment: "15–24 °C (60–75 °F); protect from frost.",
      tip: "Wrinkled leaves mean thirst; soft, mushy leaves mean too much water.",
    },
    rhythm: 'Suggested check: about every two weeks. Checking does not mean watering.',
    observe: [
      'Gently squeeze a leaf — firm and plump, or soft and wrinkled?',
      'Push a finger into the soil — is it dry most of the way down?',
    ],
    mayNeedWater: [
      'Wrinkled leaves with dry soil may mean it is time to water.',
      'Firm, plump leaves mean it does not need water yet.',
    ],
    afterWater: 'Let the soil dry out fully before the next watering.',
  },
  monstera: {
    plantType: 'Large-leaf foliage plant',
    cue: 'Check the top few centimetres of soil.',
    intervalDays: 7,
    basics: {
      light: "Bright, indirect light; avoid harsh direct sun.",
      water: "When the top few centimetres are dry — about weekly.",
      soil: "Chunky, airy aroid mix.",
      environment: "18–29 °C (65–85 °F); prefers higher humidity.",
      tip: "Give it a moss pole or stake to climb as it grows.",
    },
    rhythm: 'Suggested check: about once a week. Checking does not mean watering.',
    observe: [
      'Push a finger a few centimetres into the soil — dry or damp?',
      'Look for leaves drooping or curling at the edges.',
    ],
    mayNeedWater: [
      'Water when the top few centimetres of soil feel dry.',
      'Yellow lower leaves with wet soil usually mean too much water.',
    ],
  },
  echeveria: {
    plantType: 'Succulent',
    cue: 'Check for soft leaves.',
    intervalDays: 4,
    basics: {
      light: "Lots of bright light, including some direct sun.",
      water: "Soak the soil, then let it dry out fully before the next watering.",
      soil: "Gritty cactus or succulent mix.",
      environment: "10–27 °C (50–80 °F); keep dry and away from frost.",
      tip: "Water the soil, not the rosette — water left in the centre can cause rot.",
    },
    rhythm: 'Suggested check: every few days. Checking does not mean watering.',
    observe: [
      'Gently feel the leaves — soft or firm?',
      'Look at the soil surface.',
    ],
    mayNeedWater: [
      'Soft leaves with dry soil may mean watering is appropriate.',
      'Do not water only because time has passed.',
    ],
    afterWater: 'Let the soil dry out fully before the next watering.',
  },
  'parlor-palm': {
    plantType: 'Indoor palm',
    cue: 'Check the soil and frond tips.',
    intervalDays: 7,
    basics: {
      light: "Medium to bright indirect light; tolerates low light.",
      water: "Keep lightly moist; water when the top of the soil dries.",
      soil: "Well-draining, peat-based potting mix.",
      environment: "18–27 °C (65–80 °F); likes some humidity.",
      tip: "Brown frond tips usually mean the air is too dry.",
    },
    rhythm: 'Suggested check: about once a week. Checking does not mean watering.',
    observe: [
      'Feel the top of the soil — dry or still damp?',
      'Look at the frond tips: green, or turning brown and dry?',
    ],
    mayNeedWater: [
      'Water when the top of the soil feels dry; keep it lightly moist, not soggy.',
      'If the soil is still wet, wait and check again later.',
    ],
  },
};
