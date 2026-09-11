export const playableHeroes = {
  caelan: 'Caelan',
  rook: 'Rook',
  ilyra: 'Ilyra',
};

export const implementedChapterContracts = [
  {
    series: 'caelan',
    chapter: 1,
    entryNode: 'gate-yard',
    endingNodes: ['ending-forward', 'ending-height', 'ending-oath'],
    nextNode: 'c2-arrival',
    activeGuests: [],
    legacyOnlyHeroes: [],
  },
  {
    series: 'caelan',
    chapter: 2,
    entryNode: 'c2-arrival',
    endingNodes: ['c2-ending-testimony', 'c2-ending-pin', 'c2-ending-oath'],
    nextNode: 'c3-arrival',
    activeGuests: [],
    legacyOnlyHeroes: [],
  },
  {
    series: 'caelan',
    chapter: 3,
    entryNode: 'c3-arrival',
    endingNodes: ['c3-ending-courier', 'c3-ending-thief', 'c3-ending-return'],
    nextNode: 'c4-bridge-start',
    activeGuests: [],
    legacyOnlyHeroes: [],
  },
  {
    series: 'caelan',
    chapter: 4,
    entryNode: 'c4-bridge-start',
    endingNodes: ['c4-ending-arrest', 'c4-ending-bargain', 'c4-ending-trust'],
    nextNode: 'c5-north-road',
    activeGuests: ['rook'],
    legacyOnlyHeroes: [],
    introductions: { rook: 'c4-corner' },
  },
  {
    series: 'caelan',
    chapter: 5,
    entryNode: 'c5-north-road',
    endingNodes: ['c5-ending-free', 'c5-ending-force', 'c5-ending-pact'],
    nextNode: 'c6-steppe-road',
    activeGuests: [],
    legacyOnlyHeroes: ['rook'],
  },
  {
    series: 'caelan',
    chapter: 6,
    entryNode: 'c6-steppe-road',
    endingNodes: ['c6-ending-war', 'c6-ending-alliance', 'c6-ending-neutral'],
    nextNode: 'c7-red-horizon',
    activeGuests: ['ilyra'],
    legacyOnlyHeroes: ['rook'],
    introductions: { ilyra: 'c6-ilyra-entry' },
  },
  {
    series: 'caelan',
    chapter: 7,
    entryNode: 'c7-red-horizon',
    endingNodes: ['c7-ending-army', 'c7-ending-company', 'c7-ending-outlaw'],
    nextNode: 'c8-gate-ring',
    activeGuests: ['ilyra'],
    legacyOnlyHeroes: [],
  },
  {
    series: 'caelan',
    chapter: 8,
    entryNode: 'c8-gate-ring',
    endingNodes: ['c8-ending-embassy', 'c8-ending-threshold', 'c8-ending-witness'],
    nextNode: null,
    activeGuests: [],
    legacyOnlyHeroes: ['ilyra'],
  },
];

export const protectedPlotTransitions = [
  {
    id: 'mileless-route-split',
    endingNodes: ['c4-ending-arrest', 'c4-ending-bargain', 'c4-ending-trust'],
    requiredTerms: ['Underways', 'real fragment', 'Dragonspine'],
  },
  {
    id: 'dragonspine-to-steppe',
    endingNodes: ['c5-ending-free', 'c5-ending-force', 'c5-ending-pact'],
    requiredTerms: ['ember bearer', 'Kharad Vey', 'black stone gate'],
  },
  {
    id: 'steppe-to-crown-hunt',
    endingNodes: ['c6-ending-war', 'c6-ending-alliance', 'c6-ending-neutral'],
    requiredTerms: ['Black Gate', 'Crown'],
  },
  {
    id: 'crown-hunt-to-gate',
    endingNodes: ['c7-ending-army', 'c7-ending-company', 'c7-ending-outlaw'],
    requiredTerms: ['Black Gate', 'knock'],
  },
  {
    id: 'gate-to-first-embassy',
    endingNodes: ['c8-ending-embassy', 'c8-ending-threshold', 'c8-ending-witness'],
    requiredTerms: ['Vexa', 'contract', 'name'],
  },
];

export const documentedSeriesRoutes = {
  caelan: ['Greyhaven', "King's Road", 'Mileless Bridge', 'Dragonspine', 'Ember Steppe', 'Black Gate', 'Cinder Deep'],
  rook: ['Greyhaven', 'Mileless Bridge', 'Underways', 'Brassreach', 'Serekh', 'Unsea', 'Luminous Court'],
  ilyra: ['Shard Coast', 'Thornweald', 'Ember Steppe', 'Dragonspine', 'Serekh', 'Unsea', 'Worldroot'],
};

export const firstMeetingContracts = [
  { heroes: ['caelan', 'rook'], hostChapter: 4, introductionNode: 'c4-corner', place: 'Mileless Bridge' },
  { heroes: ['caelan', 'ilyra'], hostChapter: 6, introductionNode: 'c6-ilyra-entry', place: 'Ember Steppe' },
  { heroes: ['rook', 'ilyra'], hostChapter: null, introductionNode: null, place: 'Serekh' },
];

export const chapterFiveContinuityContract = {
  vaorOutcomes: ['c5-freed-vaor', 'c5-took-ember-by-force', 'c5-vaor-pact'],
  evidenceHandoffs: [
    'c5-has-extraction-order',
    'c5-royal-witnesses-turned',
    'c5-memory-copied-to-map-wax',
    'c5-saved-memory-witnesses',
    'c5-oath-held-memory-grave',
    'c5-lost-royal-camp-proof',
  ],
  lysaraTreatmentFlag: 'c2-saved-lysara',
  vaorMemoryViolationFlag: 'c5-broke-memory-slab',
  vaorRepairDutyFlag: 'c5-repair-vaor-memory-duty',
  pactDuties: ['protect living people', 'expose what the Concord erased'],
  pactEndTerms: ['gate is safe', 'both', 'duty is complete'],
};

export const chapterSixContinuityContract = {
  vaorOutcomes: ['c5-freed-vaor', 'c5-took-ember-by-force', 'c5-vaor-pact'],
  disclosureStates: {
    voluntary: 'c6-voluntary-ember-disclosure',
    delayed: 'c6-delayed-ember-disclosure',
    refused: 'c6-refused-ember-disclosure',
    concealedTheft: 'c6-concealed-ember-theft',
  },
  serviceMerits: [
    'c6-whole-herd-saved',
    'c6-saved-all-herders',
    'c6-forge-service-complete',
    'c6-shrine-service-complete',
    'c6-trial-won-moot',
    'c6-oath-recognised-red-moot',
    'c6-oath-crown-restitution',
    'c6-oath-defends-refusal',
  ],
  exactOaths: [
    'c6-oath-recognised-red-moot',
    'c6-oath-crown-restitution',
    'c6-oath-defends-refusal',
    'c6-oath-honest-limit',
    'c6-oath-investigate-unsea',
  ],
  ancestorCommandOutcomes: [
    'c6-broke-storm-command',
    'c6-living-vote-broke-storm',
    'c6-oath-dead-may-witness',
    'c6-ilyra-turned-storm-command',
  ],
  relationshipBoundaries: [
    'c6-named-ilyra-manipulation',
    'c6-ilyra-interest-acknowledged',
    'c6-refused-ilyra-pressure',
    'c6-ilyra-professional-alliance',
  ],
  supportOutcomes: ['c6-red-moot-war', 'c6-red-moot-alliance', 'c6-red-moot-neutral'],
  seedDamage: [
    'c5-stair-scorched-thread',
    'c5-seed-scorched-river',
    'c5-seed-strained-memory',
    'c5-lysara-reading-strain',
    'c6-seed-scorched-by-horn',
    'c6-seed-critically-weakened',
    'c6-lysara-hand-strained-by-horn',
  ],
};

export const terminalHistoryFlagReasons = {
  'c4-shielded-rook': 'Preserves Caelan taking a bolt for Rook for the later Rook perspective version of the bridge meeting.',
  'c4-watched-both': 'Preserves Caelan refusing both men control of his attention for the later crossover perspective.',
  'c4-law-first': 'Preserves Caelan beginning the relationship with Rook through an explicit arrest and search.',
  'c4-rook-kept-hidden-tool': 'Preserves the tool Rook concealed during his first explanation for his own playable bridge chapter.',
  'c4-rook-owes-caelan': 'Carries Rook’s personal debt into his independent Underways series after the implemented Caelan chapters end.',
  'c6-kharad-full-army': 'Save compatible alias for the war outcome. The playable handoff consumes c6-red-moot-war as the canonical support state.',
  'c6-kharad-escort': 'Save compatible alias for the guarded alliance outcome. The playable handoff consumes c6-red-moot-alliance as the canonical support state.',
  'c6-kharad-safe-road': 'Save compatible alias for the neutral road outcome. The playable handoff consumes c6-red-moot-neutral as the canonical support state.',
};
