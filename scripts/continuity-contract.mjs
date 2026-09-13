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
    endingNodes: [
      'c8-ending-embassy',
      'c8-ending-threshold',
      'c8-ending-witness',
    ],
    nextNode: 'c9-embassy-watch',
    activeGuests: [],
    legacyOnlyHeroes: ['ilyra'],
  },
  {
    series: 'caelan',
    chapter: 9,
    entryNode: 'c9-embassy-watch',
    endingNodes: ['c9-ending-bargain', 'c9-ending-theft', 'c9-ending-exposure'],
    nextNode: 'c10-ash-road',
    activeGuests: [],
    legacyOnlyHeroes: ['rook', 'ilyra'],
  },
  {
    series: 'caelan',
    chapter: 10,
    entryNode: 'c10-ash-road',
    endingNodes: ['c10-ending-shared', 'c10-ending-private', 'c10-ending-oath'],
    nextNode: 'c11-vathis-gate',
    activeGuests: [],
    legacyOnlyHeroes: ['rook', 'ilyra'],
  },
  {
    series: 'caelan',
    chapter: 11,
    entryNode: 'c11-vathis-gate',
    endingNodes: [
      'c11-ending-revolt',
      'c11-ending-auction',
      'c11-ending-force',
    ],
    nextNode: null,
    activeGuests: [],
    legacyOnlyHeroes: ['rook', 'ilyra'],
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
    endingNodes: [
      'c8-ending-embassy',
      'c8-ending-threshold',
      'c8-ending-witness',
    ],
    requiredTerms: ['Vexa', 'contract', 'name'],
  },
  {
    id: 'embassy-to-cinder-deep',
    endingNodes: ['c9-ending-bargain', 'c9-ending-theft', 'c9-ending-exposure'],
    requiredTerms: ['fragment', 'Malrec', 'Worldroot', 'offer'],
  },
  {
    id: 'ash-road-to-vathis',
    endingNodes: ['c10-ending-shared', 'c10-ending-private', 'c10-ending-oath'],
    requiredTerms: ['Vathis', 'fragment', 'Free Ledger', 'engine'],
  },
  {
    id: 'vathis-to-inner-gate',
    endingNodes: [
      'c11-ending-revolt',
      'c11-ending-auction',
      'c11-ending-force',
    ],
    requiredTerms: ['Elian', 'inner Black Gate', 'new promise'],
  },
];

export const documentedSeriesRoutes = {
  caelan: [
    'Greyhaven',
    "King's Road",
    'Mileless Bridge',
    'Dragonspine',
    'Ember Steppe',
    'Black Gate',
    'Cinder Deep',
  ],
  rook: [
    'Greyhaven',
    'Mileless Bridge',
    'Underways',
    'Brassreach',
    'Serekh',
    'Unsea',
    'Luminous Court',
  ],
  ilyra: [
    'Shard Coast',
    'Thornweald',
    'Ember Steppe',
    'Dragonspine',
    'Serekh',
    'Unsea',
    'Worldroot',
  ],
};

export const firstMeetingContracts = [
  {
    heroes: ['caelan', 'rook'],
    hostChapter: 4,
    introductionNode: 'c4-corner',
    place: 'Mileless Bridge',
  },
  {
    heroes: ['caelan', 'ilyra'],
    hostChapter: 6,
    introductionNode: 'c6-ilyra-entry',
    place: 'Ember Steppe',
  },
  {
    heroes: ['rook', 'ilyra'],
    hostChapter: null,
    introductionNode: null,
    place: 'Serekh',
  },
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
    'c6-sender-learned-ember',
    'c6-sender-heard-living-leaders',
    'c6-oath-guards-steppe-shrines',
    'c6-hidden-sender-marked',
  ],
  relationshipBoundaries: [
    'c6-named-ilyra-manipulation',
    'c6-ilyra-interest-acknowledged',
    'c6-refused-ilyra-pressure',
    'c6-ilyra-professional-alliance',
  ],
  supportOutcomes: [
    'c6-red-moot-war',
    'c6-red-moot-alliance',
    'c6-red-moot-neutral',
  ],
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

export const chapterSevenContinuityContract = {
  authenticationRule: {
    acquisition: 'The storm can copy spoken facts after a short delay.',
    limit:
      'It cannot answer a fresh challenge before a second living officer creates the reply.',
  },
  lioLocations: {
    prisoner: 'c7-lio-prisoner',
    returned: 'c7-lio-returned',
    joined: 'c7-lio-joined',
    guardedWitness: 'c7-lio-under-guard',
  },
  proofStates: {
    original: 'c7-original-orders-safe',
    publicCopies: [
      'c7-proof-rider-relay',
      'c7-oath-orders-reach-army',
      'c7-signal-tube-paper-rain',
      'c7-orders-on-banners',
      'c7-orders-reached-every-rank',
      'c7-seals-proved-sequence',
      'c7-lio-carried-orders',
      'c7-lio-delivered-orders',
      'c7-lio-exposed-orders-inside-army',
      'c7-lio-testimony-reached-ranks',
    ],
    burnedOriginal: 'c7-saved-both-burned-proof',
  },
  vaorUses: {
    approved: [
      'c7-vaor-approved-pursuit-use',
      'c7-vaor-approved-cavalry-use',
      'c7-vaor-approved-battle-use',
    ],
    forced: [
      'c7-forced-vaor-pursuit-use',
      'c7-forced-vaor-cavalry-use',
      'c7-forced-vaor-battle-use',
    ],
  },
  hiddenSenderExposures: [
    'c7-shared-obedience-memory',
    'c7-forced-vaor-battle-use',
    'c7-vaor-approved-battle-use',
    'c7-lio-refused-dead-command',
    'c7-lio-refused-inside-army',
    'c7-command-demanded-proof',
  ],
  finalForces: [
    'c7-gained-full-army',
    'c7-gained-chosen-company',
    'c7-gained-dangerous-reputation',
  ],
  fullArmyEligibilityFlag: 'c7-earned-full-army-offer',
  handoffCosts: [
    'c7-ally-lasting-injury',
    'c7-company-storm-losses',
    'c7-lost-gate-supplies',
    'c7-spent-supplies-on-decoys',
    'c7-lost-fast-horses',
    'c7-korran-spent-signal-trust',
  ],
};

export const activeConsequenceContracts = {
  'mara-returns': {
    complications: ['checked-horses'],
  },
  'choose-road': {
    complications: [
      'checked-route',
      'declared-change',
      'mara-read-order',
      'tested-case',
    ],
  },
  wheelwright: {
    complications: ['checked-treaty'],
  },
  'c2-night-watch': {
    complications: ['flirted-mara', 'planned-evening', 'c2-found-cellar-note'],
  },
  'envoy-arrives': {
    complications: ['steady-axle', 'found-file-mark'],
  },
  'ridge-road': {
    complications: ['split-cargo'],
  },
  'march-order': {
    complications: ['fast-column', 'read-water'],
  },
  'ridge-crisis': {
    complications: ['took-tower', 'tight-column', 'false-signal'],
  },
  evidence: {
    complications: ['wounded-stable', 'secure-perimeter', 'mara-tended'],
  },
  'inspection-crisis': {
    complications: ['rough-formation', 'ready-for-riders'],
  },
  'ambush-warning': {
    complications: ['guarding-wagon', 'forced-march', 'watched-trees'],
  },
  'road-conversation': {
    complications: ['mara-ahead', 'oath-safe-arrival'],
  },
  'low-crisis': {
    complications: ['shielded-opening', 'ordered-walls', 'felt-mortal-blow'],
  },
  'c3-gate': {
    complications: [
      'treaty-damaged',
      'c3-calm-entry',
      'c3-shielded-wounded',
      'c3-showed-iron',
    ],
  },
  aftermath: {
    complications: ['treaty-safe', 'saved-mara', 'mara-hurt'],
  },
  'folded-road': {
    complications: [
      'guard-wounded',
      'turned-west',
      'pressed-east',
      'scouted-rise',
    ],
  },
  retreat: {
    complications: ['confirmed-advance-orders'],
  },
  'c2-arrival': {
    complications: ['chose-silver-road', 'chose-high-ground'],
  },
  'c2-threshold': {
    complications: [
      'c2-ordered-entry',
      'c2-faced-creature',
      'c2-mara-led-entry',
      'c2-oath-found-child',
    ],
  },
  'c2-triage': {
    complications: ['c2-carried-nilo'],
  },
  'c2-eleven-years': {
    complications: ['c2-demanded-answer'],
  },
  'c2-medicine': {
    complications: [
      'c2-organised-care',
      'c2-compressed-wound',
      'c2-lysara-led-care',
    ],
  },
  'c2-last-testimony': {
    complications: [
      'c2-saved-nilo',
      'c2-crown-voice',
      'c2-offered-sable-safety',
      'c2-garran-named-quartermaster',
      'c2-chain-ambush',
      'c2-proved-crown-tool',
      'c2-felt-road-lives',
      'c2-command-repair',
      'c2-caelan-injured',
      'c2-oath-repair-road',
      'c2-wagon-axle-lost',
      'c2-wagon-lost',
    ],
  },
  'c2-attacker': {
    complications: ['c2-saved-attacker'],
  },
  'c2-folded-cellar': {
    complications: ['c2-compared-memories', 'c2-tracked-stone'],
  },
  'c2-investigate': {
    complications: ['c2-tested-ledger'],
  },
  'c2-descend': {
    complications: [
      'c2-ledger-route',
      'c2-cellar-route',
      'c2-no-fight',
      'c2-united-versions',
      'c2-shielded-descent',
      'c2-maelin-secret-path',
      'c2-left-supplies',
    ],
  },
  'c2-bell': {
    complications: [
      'c2-attacker-route',
      'c2-knows-midnight-pattern',
      'c2-knows-bell-signal',
      'c2-shared-fear',
      'c2-captain-promise',
    ],
  },
  'c2-common-room-crisis': {
    complications: [
      'c2-found-pantry-entry',
      'c2-rope-line',
      'c2-held-door',
      'c2-oath-anchored',
    ],
  },
  'c2-road-pin': {
    complications: [
      'c2-rope-path',
      'c2-key-found-path',
      'c2-trusted-mara-path',
      'c2-trusted-lysara-path',
      'c2-trusted-maelin-path',
    ],
  },
  'c3-arrival': {
    complications: [
      'c2-chose-testimony',
      'c2-chose-pin',
      'c2-oath-expose-crown',
    ],
  },
  'c3-triage': {
    complications: ['c3-tested-signature', 'c3-proved-command'],
  },
  'c3-bill': {
    complications: [
      'c3-route-archive',
      'c3-route-healer',
      'c3-caught-clerk',
      'c3-tested-door',
      'c3-unmasked-varris',
    ],
  },
  'c3-pursuit': {
    complications: [
      'c3-bridge-record',
      'c3-burned-future-room',
      'c3-saved-healing-house',
      'c3-kept-close',
      'c3-oath-hold-town',
    ],
  },
  'c3-evidence': {
    complications: [
      'c3-challenged-crown-control',
      'c3-centred-harrowfen-victims',
      'c3-stripped-ordan-command',
    ],
  },
  'c3-watch-house': {
    complications: [
      'c3-saved-courier-boy',
      'c3-reached-house-first',
      'c3-closed-roads',
    ],
  },
  'c3-market-memory': {
    complications: ['c3-took-future-cloak', 'c3-balanced-plan'],
  },
  'c3-pin-test': {
    complications: [
      'c3-saved-market-crowd',
      'c3-saved-market-children',
      'c3-stilled-fragment',
    ],
  },
  'c3-duplicate': {
    complications: [
      'c3-faced-double-alone',
      'c3-mara-flanked-double',
      'c3-saw-false-oath',
    ],
  },
  'c3-courier': {
    complications: [
      'c3-double-yielded',
      'c3-double-disarmed',
      'c3-routed-ordan-plan',
    ],
  },
  'c3-collapse': {
    complications: [
      'c3-cut-silver-glove',
      'c3-broke-escape-road',
      'c3-marked-ordan',
    ],
  },
  'c3-world-nail': {
    complications: ['c3-pursuit-mara', 'c3-oath-trail'],
  },
  'c4-bridge-start': {
    complications: ['c3-target-ordan', 'c3-target-thief'],
  },
  'c4-collapse': {
    complications: [
      'c4-group-secured',
      'c4-harrowfen-held',
      'c4-measured-start',
    ],
  },
  'c4-corner': {
    complications: ['c4-dropped-shooters', 'c4-saw-mirror-trick'],
  },
  'c4-wounded': {
    complications: [
      'c4-searched-rook',
      'c4-saved-brann',
      'c4-saved-guards',
      'c4-held-collapse',
    ],
  },
  'c4-nine-marks': {
    complications: ['c4-route-bargain', 'c4-heard-rook'],
  },
  'c4-anchor': {
    complications: [
      'c4-oath-no-one-falls',
      'c4-staged-arrest',
      'c4-staged-ordan',
    ],
  },
  'c4-theatre-plan': {
    complications: [
      'c4-rook-lost-long-wire',
      'c4-rook-rang-retreat',
      'c4-broke-crown-line',
      'c4-pinned-crown-lines',
      'c4-false-fragment-alerted-anchor',
    ],
  },
  'c4-duty': {
    complications: [
      'c4-found-dispatch',
      'c4-read-dispatch-early',
      'c4-rook-full-copy',
      'c4-oath-held-final-road',
      'c4-held-anchor-by-strength',
      'c4-shared-anchor',
    ],
  },
  'c4-three-spans': {
    complications: ['c4-mara-escorted-brann'],
  },
  'c4-stage-turn': {
    complications: [
      'c4-mara-absence-cost',
      'c4-rook-tore-coat-lining',
      'c4-broke-snow-line',
      'c4-warmed-blue-fire',
      'c4-anchored-storm-crossing',
      'c4-storm-rope-held',
      'c4-commanded-gears',
      'c4-jammed-gears',
    ],
  },
  'c5-north-road': {
    complications: [
      'c4-snow-route',
      'c4-storm-route',
      'c4-brass-route',
      'c4-ordan-lower-road',
      'c4-lysara-mapped-nine',
      'c4-sensed-northern-nail',
      'c4-memorised-nine',
    ],
  },
  'c4-soldiers': {
    complications: [
      'c4-rook-shortcut-left-pursuit',
      'c4-backed-rook-performance',
      'c4-crown-orders-confused',
      'c4-limited-rook-performance',
      'c4-officers-found-real-arch',
      'c4-captured-ordan',
      'c4-ordan-owes-life',
      'c4-ordan-secured-by-guards',
    ],
  },
  'c5-mara-burns': {
    complications: [
      'c4-oath-honest-with-mara',
      'c4-kissed-mara',
      'c5-let-mara-check-burns',
      'c5-fast-to-vaor',
    ],
  },
  'c5-lysara-burns': {
    complications: ['c4-lysara-private-truth'],
  },
  'c5-crown-assault': {
    complications: [
      'c5-slow-shadow-crossing',
      'c5-knows-commander-sacrifice',
      'c5-diverted-patrol-with-seal',
      'c5-crown-lost-trail',
      'c5-sorin-revealed-to-crown',
      'c5-crown-saw-flare',
    ],
  },
  'c5-glass-shelter': {
    complications: ['c5-lantern-relay', 'c5-lost-winter-supplies'],
  },
  'c5-vaor-test': {
    complications: [
      'c5-carried-first-grief',
      'c5-carried-dragon-grief',
      'c5-wrote-living-names',
      'c5-knows-vaor-kindness',
      'c5-vaor-heard-first',
      'c5-secured-warm-shelter',
      'c5-found-control-spike',
    ],
  },
  'c5-coldfire-rescue': {
    complications: ['c5-burned-at-rear'],
  },
  'c5-three-climbs': {
    complications: ['c5-sorin-full-guide', 'c5-knows-route-purposes'],
  },
  'c5-grave-mouth': {
    complications: [
      'c5-fragment-found-grave',
      'c5-stair-formation',
      'c5-silenced-archers',
      'c5-river-oath-path',
      'c5-river-dark-crossing',
      'c5-held-ash-beam',
      'c5-trapped-drill-crew',
    ],
  },
  'c5-ember-choice': {
    complications: [
      'c5-chose-sorin-care',
      'c5-lysara-sorted-memories',
      'c5-told-mara-survivor-fear',
      'c5-admitted-future-with-lysara',
      'c5-protected-lysara-choice',
      'c5-defended-living-world',
      'c5-vaor-trusted-memory',
      'c5-staged-reflected-ember',
      'c5-vaor-broke-drill',
      'c5-vaor-stated-terms',
      'c5-lost-parting-route',
      'c5-saved-chosen-companion',
      'c5-trapped-hale-with-gallery',
      'c5-lost-royal-camp-proof',
    ],
  },
  'c5-royal-camp': {
    complications: ['c5-decoded-trust-knot'],
  },
  'c5-memory-wall': {
    complications: [
      'c5-oath-held-grave',
      'c5-broke-fire-channels',
      'c5-split-coldfire',
    ],
  },
  'c5-heart-memory': {
    complications: [
      'c5-found-orivane-memory',
      'c5-shared-dragon-witness',
      'c5-demanded-full-truth',
    ],
  },
  'c5-vaor-wakes': {
    complications: ['c5-asked-memory-permission'],
  },
  'c6-broken-axle': {
    complications: [
      'c6-preserved-west-lift',
      'c6-west-lift-damaged',
      'c6-west-lift-lost',
    ],
  },
  'c6-oath-case': {
    complications: ['c6-broad-steppe-oath'],
  },
  'c6-korran-terms': {
    complications: [
      'c6-herd-route',
      'c6-forge-route',
      'c6-shrine-route',
      'c6-saved-herder',
      'c6-dema-respect',
      'c6-forge-families-safe',
      'c6-broke-ancestor-casting',
      'c6-children-safe',
      'c6-children-chose-living',
      'c6-heard-storm-accusation',
      'c6-oath-living-authority',
    ],
  },
  'c6-impossible-memory': {
    complications: [
      'c6-admitted-concord-crime',
      'c6-unsea-thread-found',
      'c6-korran-memory-test',
      'c6-tested-storm-fear',
      'c6-voice-knew-new-events',
    ],
  },
  'c7-red-horizon': {
    complications: ['c6-oath-investigate-unsea'],
  },
  'c6-red-moot': {
    complications: ['c6-ilyra-leads-evidence', 'c6-precise-unsea-truth'],
  },
  'c6-final-alliance': {
    complications: ['c6-lost-part-herd'],
  },
  'c8-force-deployment': {
    complications: ['c7-families-inside-wheels'],
  },
  'c7-army-future': {
    complications: [
      'c7-spared-first-cavalry',
      'c7-trapped-first-cavalry',
      'c7-scattered-first-cavalry',
      'c7-saved-family-wagon',
      'c7-broke-dead-horn',
      'c7-living-horns-won',
      'c7-oath-silenced-dead-horn',
      'c7-lio-called-funeral',
      'c7-mara-called-evren-funeral',
      'c7-lio-called-funeral-inside-army',
      'c7-invoked-queen-border-law',
      'c7-teren-tested-dead-command',
      'c7-mixed-shield-ring',
      'c7-saved-teren-at-parley',
      'c7-oath-living-command',
      'c7-lio-used-private-answer',
      'c7-caelan-used-password-test',
      'c7-salt-trap-merciful',
      'c7-saved-crown-cavalry',
      'c7-oath-surrender-road',
      'c7-defeated-teren-mercifully',
      'c7-won-by-terens-lesson',
      'c7-duel-on-equal-ground',
      'c7-teren-yielded-for-gate',
      'c7-saved-many',
      'c7-saved-both-burned-proof',
      'c7-saved-many-with-southern-escort',
      'c7-saved-many-under-shield-oath',
      'c7-saved-many-with-lio',
      'c7-saved-many-with-teren',
    ],
  },
  'c7-dead-horn': {
    complications: ['c7-taught-dead-command-test'],
  },
  'c7-battlefield-setup': {
    complications: ['c7-korran-salt-warning'],
  },
  'c7-many-or-one': {
    complications: ['c7-wounded-on-ridge'],
  },
};

export const terminalHistoryFlagReasons = {
  'oath-bring-them-home':
    'The first playable return toward Greyhaven must keep every surviving Chapter One escort member on a route to a safe hearth or force Caelan to resolve a visible Oath breach before he can spend its remaining power.',
  'c4-shielded-rook':
    'Rook’s first playable recollection of the bridge meeting must react to Caelan taking the bolt before Rook chooses whether to trust or exploit him.',
  'c4-watched-both':
    'Rook’s first playable recollection of the bridge standoff must preserve that Caelan watched both suspects and cannot describe himself as overlooked.',
  'c4-law-first':
    'Rook’s first playable recollection of Caelan must begin from the explicit arrest and search, changing his opening trust response before any later cooperation.',
  'c4-rook-kept-hidden-tool':
    'Rook’s first playable bridge scene must place the concealed tool in his inventory and offer the action it enables; no other route may invent it.',
  'c4-rook-owes-caelan':
    'The first playable request Caelan makes of Rook in the Underways series must present this debt as a bounded reason to help or refuse, never as automatic obedience.',
  'c4-denied-rook-copy':
    'Rook’s first playable Underways map choice must offer only the blurred-wax route and withhold every action requiring the complete nine-mark copy.',
  'c4-rook-lost-mirror-coins':
    'Rook’s first playable Underways inventory check must leave exactly one mirrored coin and remove any option that spends two or three.',
  'c5-destroyed-royal-drill':
    'The first later Crown extraction attempt at Dragonspine must identify a newly built machine and cannot reuse Hale’s destroyed portable drill.',
  'c5-repair-vaor-memory-duty':
    'The first later scene that asks Vaor for memory, testimony, or power must require Caelan to preserve a surviving memory and disclose the destroyed summer day before Vaor can cooperate.',
  'c6-preserved-ancestor-voices':
    'The first playable Unsea investigation must distinguish the preserved independent voices from copies still bound to the hidden command and let the player test whether any voice is conscious.',
  'c6-owes-kharad-service':
    'The first post-Gate request made of Kharad Vey must let the Red Moot choose one bounded act of service for Caelan before any Crown command can claim that debt.',
  'c6-shared-orivane-proof':
    'The first Crown hearing about the Concord must allow an independent Kharad custodian to authenticate the Orivane proof copied into the Moot archive.',
  'c7-recorded-hale-last-seen-alive':
    'The first Crown hearing about Hale must admit this as Caelan’s limited eyewitness account: Hale was alive when the grave collapsed, and the record proves neither death nor survival.',
  'c8-linked-malrec-to-gate-record':
    'The first playable Crown hearing about the Gate withdrawals must offer the joined Malrec evidence chain as admissible proof and must withhold that option when the chain was never established.',
  'c8-vexa-entered-publicly':
    'Chapter Nine must begin with Vexa inside Fourth Fort under public guard and may not replay or revoke the witnessed crossing.',
  'c8-vexa-held-at-threshold':
    'Chapter Nine must keep Vexa outside the fortress ring until Caelan makes a new explicit entry decision.',
  'c8-vexa-received-outer-fort':
    'Chapter Nine must begin with Vexa inside isolated Second Fort and keep her away from wounded people and lock rooms unless the player changes that limit.',
  'c8-ansel-spoke-first':
    'Chapter Nine must let the Futureless answer Vexa’s first disclosure before Crown rulers redirect the meeting.',
  'c8-ansel-spoke-first-after-entry':
    'Chapter Nine must preserve that the Compact embassy entered Second Fort before Ansel received the first question.',
  'c9-route-bargain':
    'Chapter Ten must begin with the fragment under the accepted return promise and keep Vexa’s precise access at the chosen clause limit.',
  'c9-route-theft':
    'Chapter Ten must treat the fragment as an admitted theft and preserve the resulting Compact political debt.',
  'c9-route-exposure':
    'Chapter Ten must admit the public Sableglass case as the legal source of the recovered fragment.',
  'c9-malrec-cinder-alliance-proved':
    'Chapter Ten must begin with Malrec’s Sableglass alliance and released-promise plan known to every proof bearer who crossed.',
  'c9-vaor-gift-proof-guard':
    'Chapter Ten proof copies must retain Vaor’s willing heat test and reject altered copies by cooling.',
  'c9-vaor-pact-proof-carried':
    'Chapter Ten must preserve that Vaor willingly carried the proof under the pact duty to expose erased truth.',
  'c9-stolen-ember-not-used':
    'Chapter Ten must not credit the stolen ember with guarding the embassy proof and must preserve Vaor’s refusal.',
  'c9-vaor-collateral-released':
    'Chapter Ten must restore Vaor’s outer flame because his approved collateral ended before the crossing.',
  'c9-forced-collateral-broken':
    'Chapter Ten must preserve the acknowledged collateral breach and may not treat Vaor’s recovered flame as willing aid.',
  'c9-destroyed-red-moot-authority-oath':
    'Chapter Ten must remove the magical guarantee that Kharad fighters answer only commanders chosen by the Red Moot and make Korran react to the loss.',
  'c9-destroyed-crown-restitution-oath':
    'Chapter Ten must withhold every action requiring the Oath to bring hidden Concord victims before the Queen and preserve Ansel’s reaction.',
  'c9-destroyed-clan-refusal-oath':
    'Chapter Ten must remove Caelan’s magical defence of the clans’ right to leave after the Gate is safe and preserve Moot distrust.',
  'c9-destroyed-honest-command-limit-oath':
    'Chapter Ten must withhold Moot and full-army command options and preserve that Korran and Teren refused to cross under unbounded command.',
  'c9-destroyed-unsea-investigation-oath':
    'Chapter Ten must preserve that Korran carries the abandoned duty to test the preserved ancestor voices and that Caelan cannot invoke it as his Oath.',
  'c9-vexa-guarded-trust':
    'Chapter Ten must provide Vexa’s Sableglass patrol map while keeping public limits on her access to Caelan and the expedition.',
  'c9-vexa-adversarial-respect':
    'Chapter Ten must keep personal trust withheld while enforcing the mutual duty to disclose known expedition threats.',
  'c9-vexa-attraction-acknowledged':
    'Chapter Ten must preserve acknowledged attraction without treating it as payment, consent, or permission for intimacy.',
  'c9-vexa-permanent-hostility':
    'Chapter Ten must restrict Vexa contact to armed public diplomacy and withhold every guarded-trust or intimacy action.',
  'c9-shared-private-night':
    'Chapter Ten must preserve the explored Vexa relationship and the identical political and information state from fade or detailed prose.',
  'c9-private-conversation-only':
    'Chapter Ten must preserve the physical boundary while retaining Vexa’s warning about desires becoming offers.',
  'c9-refused-private-connection':
    'Chapter Ten must keep the private refusal intact and may not infer later romantic consent from political cooperation.',
  'c9-learned-desire-offer-danger':
    'Chapter Ten must let Caelan prepare a consent pause before the first automatic desire offer and withhold that preparation otherwise.',
  'c9-true-name-freely-disclosed':
    'Chapter Ten may use true-name precision only for the witnessed fragment alignment purpose and never as ownership or consent.',
  'c9-return-promise-owned':
    'Chapter Ten must display and enforce the exact neutral-custody return promise after Malrec’s inside opening is stopped.',
  'c9-theft-publicly-named':
    'Chapter Ten must keep the stolen fragment visible and admitted, preventing any clean-custody or hidden-taking claim.',
  'c9-sableglass-publicly-exposed':
    'Chapter Ten must allow the public Sableglass evidence to challenge its house agents and prevent the house from denying the embassy attack.',
  'c9-mara-crossed-black-gate':
    'Chapter Ten may place Mara on the Ash Road as Caelan’s scout and partner; the first private offer must respect her refusal to promise safety or an unchanged return.',
  'c9-mara-remained-at-gate':
    'Chapter Ten must keep Mara physically at the mortal Black Gate and may use only her established return signal as a legacy.',
  'c9-lysara-crossed-black-gate':
    'Chapter Ten may place Lysara on the Ash Road as an independent envoy and partner; no treaty, proof duty, or bargain may be treated as consent to accompany Caelan.',
  'c9-lysara-remained-at-gate':
    'Chapter Ten must keep Lysara physically at the mortal Black Gate as custodian of the evidence and may use only that custody as a legacy.',
  'c9-no-mortal-partner-crossed':
    'Chapter Ten must not place Mara, Lysara, or Ilyra on the Ash Road; any partner scene is limited to Vexa when her recorded relationship allows it.',
  'c9-roster-futureless':
    'Chapter Ten must place Ansel and two Futureless witnesses physically inside the Cinder Deep and use their living testimony.',
  'c9-roster-pell':
    'Chapter Ten must place wounded Pell and the complete lock map inside the Cinder Deep while preventing him from taking a running fight.',
  'c9-roster-wardens':
    'Chapter Ten must provide the mixed warden and Moot shield company under individually accepted shared command.',
  'c9-roster-crown':
    'Chapter Ten must place Teren and six Crown volunteers inside the Cinder Deep without importing command over the full divided army.',
  'c9-crossed-black-gate':
    'Chapter Ten begins after the selected voluntary expedition physically crosses the Black Gate with the recovered fragment.',
  'c10-bargain-custody-used':
    'Chapter Eleven actively consumes this state: the leased-door alignment keeps the neutral return promise and its true-name scope intact.',
  'c10-burden-oath-active':
    'Chapter Eleven must preserve that the burden Oath ended at Vathis, keep every traveller’s individual withdrawal history, and require Caelan to give each consenting person a private accounting.',
  'c10-burden-oath-explicit-consent':
    'Chapter Eleven actively consumes this state: the public hearing and private-account scene verify each traveller’s consent and separate account.',
  'c10-burden-oath-withdrawn':
    'Chapter Eleven actively consumes this state: the hearing and method scenes treat the blank proposal as unowned and keep the private seals closed.',
  'c10-clean-refusal-recorded':
    'Chapter Eleven actively consumes this state: the slower public entry uses the recorded refusal to dismiss each stair offer without accepting it.',
  'c10-copy-risk-active':
    'Chapter Eleven actively consumes this state: the contract street presents the copied-route danger and makes the selected Chapter Ten method answer it.',
  'c10-crown-volunteer-pairs':
    'Chapter Eleven actively consumes this state: the force route gives Teren and exactly six volunteers seven separate breach posts.',
  'c10-destroyed-oath-loss-faced':
    'Chapter Eleven actively consumes this state: the Oath-price scenes remove each destroyed protection before any mythic option is offered.',
  'c10-exact-roster-crossed-bridge':
    'Chapter Eleven actively consumes this state: the gate, force formation, and inner Gate render only the expedition recorded as crossing.',
  'c10-exposure-custody-used':
    'Chapter Eleven actively consumes this state: the leased door admits the public evidence frame without transferring the fragment.',
  'c10-first-arch-delay':
    'Chapter Eleven actively consumes this state: the public-gate investigation loses the first auction timing advantage while preserving a complete path.',
  'c10-free-ledger-guide-accepted':
    'Chapter Eleven must let the Free Ledger guide the expedition through one faction checkpoint and identify the engine district from outside.',
  'c10-free-ledger-guide-refused':
    'Chapter Eleven must begin on the slower public road, grant no checkpoint passage, and impose no petition hearing duty.',
  'c10-free-ledger-offered-help':
    'Chapter Eleven actively consumes this state: the public gate either delivers the guide’s checkpoint help or preserves the complete refused route.',
  'c10-free-ledger-petition-owed':
    'Chapter Eleven must require a public hearing for the sealed Free Ledger petition before Caelan gives it to any ruling Vathis faction.',
  'c10-free-ledger-proved-by-oath-exit':
    'Chapter Eleven actively consumes this state: the petition hearing accepts the ended burden bands as separate proof with private accounting.',
  'c10-free-ledger-proved-by-private-seals':
    'Chapter Eleven actively consumes this state: the petition hearing accepts sealed edges while withholding every private desire.',
  'c10-free-ledger-proved-by-shared-record':
    'Chapter Eleven actively consumes this state: the petition hearing uses the shared record to expose a changed Sableglass exit clause.',
  'c10-free-ledger-rope-saved':
    'Chapter Eleven actively consumes this state: the revolt crisis offers the saved rope as an exclusive rescue of families and the engine tunnel.',
  'c10-futureless-record-line':
    'Chapter Eleven actively consumes this state: the Futureless force formation cancels one copied guard order through three independently owned records.',
  'c10-limits-public-only':
    'Chapter Eleven must preserve the complete platonic boundary and withhold any choice that treats the shelter conversation as romantic consent.',
  'c10-limits-respected':
    'Chapter Eleven must weaken the matching partner temptation because both people’s refused promises were repeated without alteration.',
  'c10-listening-ash-broken':
    'Chapter Eleven actively consumes this state: the defining-route scene withholds Sableglass’s early route closure when the listening ash was broken.',
  'c10-listening-mark-following':
    'Chapter Eleven actively consumes this state: the contract street lets the following mark buy a false turn before the expedition acts.',
  'c10-mixed-call-answer':
    'Chapter Eleven actively consumes this state: the force formation requires every mixed warden and Moot fighter to repeat accepted command limits.',
  'c10-oath-copy-contained':
    'Chapter Eleven actively consumes this state: the method-accounting scene uses closed burden bands without giving the Court ownership of a traveller.',
  'c10-oath-traveller-withdrew':
    'Chapter Eleven actively consumes this state: the accounting scene removes the withdrawn traveller’s testimony from the group claim.',
  'c10-offer-bridge-accelerated':
    'Chapter Eleven actively consumes this state: the public-gate approach preserves the gained timing advantage before the first auction bell.',
  'c10-offer-method-oath':
    'Chapter Eleven must carry the completed consensual burden Oath, each personal exit, and its owed private accounting without treating the Oath as ownership.',
  'c10-offer-method-oath-proposed':
    'Chapter Eleven actively consumes this state: the Vathis accounting scenes distinguish the proposed burden wording from an accepted Oath.',
  'c10-offer-method-private':
    'Chapter Eleven must keep offer seals with their owners and retain the unresolved coordination risk without exposing their private terms.',
  'c10-offer-method-shared':
    'Chapter Eleven must use the shared ledger to detect changed offers while preserving whether motives were withheld or exposed by permission.',
  'c10-partner-temptation-known':
    'Chapter Eleven actively consumes this state: the illusion street uses the recorded closest relationship as its temptation source without creating consent.',
  'c10-pell-safe-exit-mapped':
    'Chapter Eleven actively consumes this state: the force route gives wounded Pell a mapped retreat that keeps him behind his escort.',
  'c10-prepared-offer-pause':
    'Chapter Eleven actively consumes this state: the contract street pauses the whole expedition until its accepting stone and exit are visible.',
  'c10-private-desires-exposed':
    'Chapter Eleven actively consumes this state: the accounting scene makes Sableglass know only motives that owners chose to reveal.',
  'c10-private-false-alarm-contained':
    'Chapter Eleven actively consumes this state: the private-seal street contains an ownerless safe signal without opening another person’s terms.',
  'c10-private-route-delay':
    'Chapter Eleven actively consumes this state: the private crossing reaches the reverse bell later and preserves a concrete coordination risk.',
  'c10-private-seals-kept':
    'Chapter Eleven actively consumes this state: the street and auction proof keep every opaque seal with its original owner.',
  'c10-reached-vathis':
    'Chapter Eleven begins at Vathis with the exact surviving expedition, fragment custody, known contract risk, and clear objective to locate Malrec’s engine.',
  'c10-refusal-demonstrated':
    'Chapter Eleven actively consumes this state: the slower stair route uses the demonstrated no to collapse an offer without acceptance.',
  'c10-rest-with-lysara':
    'Chapter Eleven must preserve Lysara’s renewed consent, sole-control temptation, and refusal to promise obedience to a Crown future without implying new consent.',
  'c10-rest-with-mara':
    'Chapter Eleven must preserve Mara’s renewed consent, quiet-home temptation, and refusal to promise safety behind Caelan without implying new consent.',
  'c10-rested-apart':
    'Chapter Eleven actively consumes this state: the illusion route offers a complete non-romantic refusal and does not infer a partner.',
  'c10-road-danger-ended':
    'Chapter Eleven actively consumes this state: the Vathis gate opens after the Ash Road danger ends and begins a new civic objective.',
  'c10-roster-offer-answered-crown':
    'Chapter Eleven actively consumes this state: Teren and six volunteers use separate witness marks rather than Crown army authority.',
  'c10-roster-offer-answered-futureless':
    'Chapter Eleven actively consumes this state: Ansel and two witnesses join three independently owned records in Vathis.',
  'c10-roster-offer-answered-mixed':
    'Chapter Eleven actively consumes this state: the mixed company moves only under each fighter’s accepted command limit.',
  'c10-roster-offer-answered-pell':
    'Chapter Eleven actively consumes this state: Pell’s lock map opens a safe service route while his injury limits his pace.',
  'c10-roster-offer-kept-private':
    'Chapter Eleven actively consumes this state: the private route preserves each companion’s seal and withholds their confidential offer.',
  'c10-shared-complete-offers':
    'Chapter Eleven actively consumes this state: the shared ledger compares full terms at both ends of the expiring street.',
  'c10-shared-terms-only':
    'Chapter Eleven actively consumes this state: the shared ledger challenges changed terms without exposing motives that owners withheld.',
  'c10-shelter-conversation':
    'Chapter Eleven actively consumes this state: the illusion uses the established limits conversation to separate a wanted future from its dishonest price.',
  'c10-silence-demonstrated':
    'Chapter Eleven actively consumes this state: the street and door keep silent travellers unbound until a clear accepting act occurs.',
  'c10-surviving-oaths-private':
    'Chapter Eleven actively consumes this state: the accounting scene keeps surviving Oaths outside the Court inventory and names them only to their dependants.',
  'c10-surviving-oaths-public':
    'Chapter Eleven actively consumes this state: the public Oath record determines which mythic freedom transfers are visible and available.',
  'c10-theft-custody-used':
    'Chapter Eleven actively consumes this state: the leased door uses the admitted theft to reject Sableglass ownership while preserving the Compact debt.',
  'c10-vexa-boundary-witnessed':
    'Chapter Eleven actively consumes this state: Vexa’s gate and illusion dialogue respects the recorded public boundary and creates no private access.',
  'c10-vexa-hostile-truce-held':
    'Chapter Eleven actively consumes this state: hostile Vexa supplies only required threat warnings and remains outside weapon reach.',
  'c10-vexa-refused-own-offer':
    'Chapter Eleven actively consumes this state: Vexa identifies city pressure while retaining her own refusal and independent objective.',
  'c10-water-bargain-ended':
    'Chapter Eleven actively consumes this state: the slow stair reads the dark exit mark and prevents the completed cup bargain from restarting.',
  'c10-water-offer-accepted':
    'Chapter Eleven actively consumes this state: Vathis treats the completed cup as a past bargain with no widening ownership.',
  'c10-water-offer-refused':
    'Chapter Eleven actively consumes this state: Vathis uses the clean refusal as proof that an offer can end without binding.',
  'c11-platonic-limit-held':
    'Chapter Twelve must keep the selected relationship platonic and may not turn the rejected illusion, a memory, or earlier intimacy into renewed consent.',
  'c11-price-court-review-owed':
    'Chapter Twelve must hold one public Price Court review of the replacement Gate law and remove this restriction when that named review ends.',
  'c11-revolt-collar-proof':
    'Chapter Twelve must admit Pellan’s three approved collar copies as worker-owned proof when the replacement Gate law defines who may refuse.',
  'c11-freedom-command-restricted':
    'Chapter Twelve must prevent Caelan from ordering Moot fighters beyond their accepted command until the replacement Gate law is settled.',
  'c11-revolt-refusal-record':
    'Chapter Twelve must let Sira, Oren, and Pellan present or withhold their approved refusal record during the replacement-law hearing.',
  'c11-freedom-hearing-restricted':
    'Chapter Twelve must require Caelan to attend the named hidden victims’ hearing before this transferred freedom returns.',
  'c11-independent-engine-audit':
    'Chapter Twelve must let the free Price Court seat authenticate the purchased engine access limits without transferring fragment custody.',
  'c11-freedom-door-order-restricted':
    'Chapter Twelve must keep Caelan behind the last willing traveller at contracted doors until the opening stops or everyone reaches a freely chosen safe side.',
  'c11-vathis-civic-damage':
    'Chapter Twelve must make the broken public sidewall raise the Ash Compact cooperation price or reduce civic access during the Gate crisis.',
  'c11-vaor-engine-response-tested':
    'Chapter Twelve may treat Vaor’s permitted ember as proof of a real engine response, but never as proof of the speaker’s identity or location.',
  'c11-elian-voice-heard':
    'Chapter Twelve must preserve only that a voice naming herself Elian spoke through the engine and opposed Malrec’s merger method.',
  'c11-elian-record-bounded':
    'Chapter Twelve must offer the bounded witness record as evidence while withholding claims about death, singular identity, body, prison, or location.',
  'c11-elian-public-opposition':
    'Chapter Twelve must let the chosen Vathis ally cite the public opposition to merger without treating the voice as owned faction evidence.',
  'c11-elian-channel-protected':
    'Chapter Twelve must keep the engine voice outside auction ownership unless a new voluntary agreement is made after the channel was closed.',
  'c11-inner-gate-opening':
    'Chapter Twelve begins at the inner face while the Black Gate is opening and must ask what new promise can replace its failing law.',
  'c11-alliance-free-ledger-refusers':
    'Chapter Twelve must give the named refusers a protected public place and require one renewal hearing where affected groups may refuse.',
  'c11-alliance-price-court-dissent':
    'Chapter Twelve must let the free Price Court seat delay unregistered invasion forces in exchange for public review of the replacement law.',
  'c11-alliance-ash-compact-passage':
    'Chapter Twelve must let the Ash Compact hold the engine corridor for the exact price of one witnessed passage after Malrec’s opening stops.',
};
