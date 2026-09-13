import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

const entryFlags = [
  'c8-vexa-entered-publicly',
  'c8-vexa-held-at-threshold',
  'c8-vexa-received-outer-fort',
  'c8-ansel-spoke-first',
  'c8-ansel-spoke-first-after-entry',
];

const defenceFlags = [
  'c8-united-wardens',
  'c8-accepted-ash-compact',
  'c8-sacrificed-first-fort',
  'c8-depleted-mortal-defense',
  'c7-gained-full-army',
  'c7-gained-chosen-company',
  'c7-gained-dangerous-reputation',
];

const evidenceFlags = [
  'c8-preserved-original-ledgers',
  'c8-living-copy-of-openings',
  'c8-many-witnessed-openings',
  'c8-first-fort-became-witness',
  'c8-linked-malrec-to-gate-record',
  'c8-gate-forgery-exposed',
  'c8-saved-pell-packet',
  'c8-lost-duplicate-records',
  'c8-severed-collector-hand',
  'c8-captured-collector-glove',
  'c8-freed-futureless-names',
  'c8-ansel-refused-second-price',
  'c8-cut-collector-source-line',
];

const oathPriceFlags = [
  'c8-surrendered-homecoming',
  'c8-released-crown-oath',
  'c8-burned-lesser-oath',
  'c8-shared-oath-mara',
  'c8-shared-oath-lysara',
  'c8-shared-oath-korran',
];

const vaorFlags = [
  'c5-freed-vaor',
  'c5-took-ember-by-force',
  'c5-vaor-pact',
  'c8-ember-held-as-collateral',
];

function entryPosition(state: GameState) {
  if (has(state, 'c8-vexa-entered-publicly')) {
    return 'Vexa begins inside Fourth Fort under public guard. You lead the witnessed move to neutral Second Fort. Nobody asks her to cross the Gate again.';
  }
  if (has(state, 'c8-vexa-held-at-threshold')) {
    return 'Vexa remains outside the fortress ring. Her brass cases rest beyond the threshold until you decide whether she may enter neutral Second Fort.';
  }
  if (has(state, 'c8-ansel-spoke-first-after-entry')) {
    return 'Vexa already stands inside Second Fort. Ansel questioned her there before any Crown official spoke, and his people still hold the closest witness rail.';
  }
  if (has(state, 'c8-vexa-received-outer-fort')) {
    return 'Vexa begins inside isolated Second Fort. Locked inner doors keep her envoys away from the wounded people and every working lock room.';
  }
  return 'Vexa remains outside with Ansel between her and the Crown. The Futureless have heard her answer, but no new entry permission exists.';
}

function futurelessPriority(state: GameState) {
  if (has(state, 'c8-ansel-spoke-first-after-entry')) {
    return 'Ansel points to the place where Vexa answered him after entering Second Fort. Crown clerks cannot move the meeting until the Futureless record that answer.';
  }
  if (has(state, 'c8-ansel-spoke-first')) {
    return 'Ansel repeats Vexa’s disclosure before the Crown can redirect it. The rival house bought his daughter’s future promise and paid mortal officials to hide the openings.';
  }
  return 'Ansel waits at the witness rail with his surviving ledger. Crown officials want the unfinished claim heard first. He wants the sold promises named first.';
}

function defencePosition(state: GameState) {
  if (has(state, 'c8-united-wardens')) {
    return 'Eight mortal captains control the doors through spoken replies. Their unity can seal one attack lane, but it leaves no devil fire reinforcing the embassy wall.';
  }
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'White Compact fire marks the neutral floor. It blocks hidden contract magic, but Vaor’s outer flame may still be held as collateral.';
  }
  return 'First Fort is gone. Its surviving keepers know every service tunnel, while the permanent gap gives mortal attackers a route under the witness gallery.';
}

function forcePosition(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'The full Crown March can hold the public doors. Its divided loyalties make any private order dangerous.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your chosen company can guard one room well. It cannot cover the public hall, the Gate wall, and the lower passage together.';
  }
  return 'No formal army answers you. Wardens, Moot fighters, and volunteers will act only after hearing the reason for each order.';
}

function evidencePosition(state: GameState) {
  if (has(state, 'c8-preserved-original-ledgers')) {
    return 'Pell sets the original fort ledgers under glass. Their old ink and matched cuts can prove which mortal hand opened the Gate.';
  }
  if (has(state, 'c8-saved-pell-packet')) {
    return 'Pell sets the sealed duplicate packet under glass. Its witness threads can authenticate a copy without pretending the original survived.';
  }
  if (has(state, 'c8-linked-malrec-to-gate-record')) {
    return 'Malrec’s order has already been joined to the Gate record. Its seal, witness trail, and opening dates can be tested against the assassins’ target strip.';
  }
  if (has(state, 'c8-living-copy-of-openings')) {
    return 'Living bark tightens around each copied opening when the named place is spoken. It can expose a false entry without recreating the burned paper.';
  }
  if (
    hasAny(state, [
      'c8-many-witnessed-openings',
      'c8-first-fort-became-witness',
    ])
  ) {
    return 'Surviving keepers stand in date order along the rail. No single record can be stolen, but frightened witnesses can be divided.';
  }
  if (has(state, 'c8-gate-forgery-exposed')) {
    return 'The proved forgery survives beside honest copies. It can identify the false seal, but it cannot become an original record.';
  }
  return 'The duplicate records burned with First Fort. Only scars, remembered dates, and whatever the attackers carry can prove the alliance now.';
}

function oathPrice(state: GameState) {
  if (has(state, 'c8-surrendered-homecoming')) {
    return 'Your father’s key is gone. The Gate cannot offer the unchanged home you already surrendered.';
  }
  if (has(state, 'c8-released-crown-oath')) {
    return 'The split Crown badge records a released service Oath. Crown law calls it breach, and no later bargain can restore it.';
  }
  if (has(state, 'c8-burned-lesser-oath')) {
    return 'The old Warden whistle is ash. You may answer a call by choice, but magic can never force that duty back into you.';
  }
  if (has(state, 'c8-shared-oath-mara')) {
    return 'A black mark remains in Mara’s palm. One shared Oath keeps her close to your danger, and the Gate can still find her through it.';
  }
  if (has(state, 'c8-shared-oath-lysara')) {
    return 'A black mark remains in Lysara’s palm. One shared Oath links her to your danger, even while she works behind the witness rail.';
  }
  return 'A black mark remains in Korran’s palm. The shared Oath exposes his community’s chosen commander whenever the Gate searches for you.';
}

function injuryPressure(state: GameState) {
  const lines: string[] = [];
  if (state.stats.health <= 3)
    lines.push('Your ribs lock whenever you raise the shield.');
  if (has(state, 'c7-ally-lasting-injury'))
    lines.push('One trusted ally cannot hold a running fight.');
  if (has(state, 'c7-lost-gate-supplies'))
    lines.push('The medical chest has only bandages and boiled water.');
  if (has(state, 'c8-depleted-mortal-defense'))
    lines.push('Exhausted keepers cannot survive another long defence.');
  return lines.length
    ? lines.join(' ')
    : 'The defenders are tired, but the wounded are stable and the reserve chest remains sealed.';
}

function vaorPosition(state: GameState) {
  if (
    has(state, 'c8-ember-held-as-collateral') &&
    has(state, 'c5-took-ember-by-force')
  ) {
    return 'Vaor’s outer flame remains trapped under Compact collateral imposed without his consent. His anger closes every easy use of dragonfire.';
  }
  if (
    has(state, 'c8-ember-held-as-collateral') &&
    !has(state, 'c5-took-ember-by-force')
  ) {
    return 'Vaor agreed to hold his outer flame as collateral until the embassy leaves. He will help only within that exact limit.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'The stolen ember recoils from your hand. Vaor will not turn it into a weapon for this negotiation.';
  }
  if (has(state, 'c5-vaor-pact')) {
    return 'Vaor speaks through the ember as an equal party. The pact allows protection of living people and exposure of erased truth.';
  }
  return 'Vaor’s gift warms when you protect a freely chosen promise. It cools when anyone tries to own a speaker.';
}

function privateScene(state: GameState) {
  if (!has(state, 'c9-shared-private-night')) return [];
  if (
    state.contentPreference.intimacy === 'detailed' &&
    state.contentPreference.adultConfirmed
  ) {
    return [
      'After both doors unlock, Vexa asks again without contract words. You both name what you want, what is off limits, and that either may stop. Her hands are warm against your bare shoulders. You unfasten each other’s armor slowly, checking each answer before moving closer. The hard edge in her voice softens when you kiss her. Nothing magical enters the room. No true name is spoken. Later, skin against skin beneath an ordinary wool blanket, she tells you why a complete merger terrifies her. In the Cinder Deep, desire becomes an offer before thought can refuse it. She wants the Gate controlled because freedom needs a pause.',
    ];
  }
  return [
    'After both doors unlock, Vexa asks again without contract words. You both name what you want, what is off limits, and that either may stop. Armor and titles are set aside. The lamp goes dark by mutual choice. Later, beneath an ordinary wool blanket, she explains her fear. In the Cinder Deep, desire becomes an offer before thought can refuse it. She wants the Gate controlled because freedom needs a pause.',
  ];
}

function intimacyEligible(state: GameState) {
  const isAttached = (intent: GameState['relationships']['mara']['intent']) =>
    intent === 'committed' || intent === 'exploring';
  return (
    state.relationships.vexa.intent === 'interested' &&
    !isAttached(state.relationships.mara.intent) &&
    !isAttached(state.relationships.lysara.intent) &&
    !isAttached(state.relationships.ilyra.intent) &&
    has(state, 'c9-attacks-stopped') &&
    !has(state, 'c9-vexa-permanent-hostility')
  );
}

function endingForRoute(state: GameState) {
  if (has(state, 'c9-route-bargain')) return 'c9-ending-bargain';
  if (has(state, 'c9-route-theft')) return 'c9-ending-theft';
  return 'c9-ending-exposure';
}

function crossingRoster(state: GameState) {
  const allies = ['Vexa'];
  if (has(state, 'c9-roster-futureless'))
    allies.push('Ansel and two Futureless witnesses');
  if (has(state, 'c9-roster-pell')) allies.push('Pell with the lock map');
  if (has(state, 'c9-roster-wardens'))
    allies.push('a mixed company of wardens and Moot fighters');
  if (has(state, 'c9-roster-crown'))
    allies.push('Teren and six Crown volunteers');
  return `You cross with ${allies.join(', ')}. Every traveller speaks consent before stepping through.`;
}

function embassyTransition(state: GameState) {
  if (has(state, 'c9-ansel-kept-first-hearing'))
    return 'Ansel completed the first hearing while Vexa remained beyond the marked threshold.';
  if (has(state, 'c9-vexa-moved-fourth-to-second'))
    return 'The witnessed Fourth Fort guard now holds the Second Fort public gallery.';
  if (has(state, 'c9-vexa-entered-second-explicitly'))
    return 'Vexa sits inside Second Fort under the new public-corridor permission.';
  if (has(state, 'c9-vexa-remains-outside'))
    return 'Vexa remains beyond the marked threshold and speaks through the barred corridor.';
  if (has(state, 'c9-vexa-isolation-preserved'))
    return 'Vexa remains inside isolated Second Fort, with every private passage still closed.';
  return 'Ansel’s first hearing still controls the threshold before Crown procedure begins.';
}

function recordControl(state: GameState) {
  if (has(state, 'c9-futureless-record-first'))
    return 'Ansel keeps the controlling witness copy beside the name beads.';
  if (has(state, 'c9-pell-matched-openings'))
    return 'Pell’s matched route map stays open beside the demonstration.';
  if (has(state, 'c9-split-public-record'))
    return 'The two speaking bells keep Crown and Futureless records independent during the test.';
  return 'The name demonstration begins before any record controls the room.';
}

function nameTestResult(state: GameState) {
  if (has(state, 'c9-true-name-limit-tested'))
    return 'Your own three-breath test proves that accepted precision can end on time.';
  if (has(state, 'c9-ansel-verified-name-limit'))
    return 'Ansel’s independent test proves the rule without exposing your self-name.';
  if (has(state, 'c9-name-vessel-destruction-proved'))
    return 'The crushed bead proves that destroying the named vessel ends stored precision.';
  return 'The safe name test has not chosen its witness yet.';
}

function preparedDefence(state: GameState) {
  const lines: string[] = [];
  if (has(state, 'c9-public-door-locked'))
    lines.push('paired wardens hold the public door');
  if (has(state, 'c9-gate-wall-sealed'))
    lines.push('white fire marks one Gate breach');
  if (has(state, 'c9-lower-passage-warned'))
    lines.push('First Fort survivors watch the lower passage');
  if (has(state, 'c9-army-gallery-pairs'))
    lines.push('mixed pairs hold the galleries');
  if (has(state, 'c9-fragment-shield-ring'))
    lines.push('the chosen company surrounds the case');
  if (has(state, 'c9-voluntary-witness-guard'))
    lines.push('volunteers guard the witness rail');
  return `Your prepared defence is visible: ${lines.join(', ')}.`;
}

function mortalAttackResult(state: GameState) {
  if (has(state, 'c9-mortal-assassin-captured'))
    return 'A living assassin and his intact order wait under mixed guard.';
  if (has(state, 'c9-fragment-survived-mortal-attack'))
    return 'The chosen company kept the fragment case intact, but one witness needs bandaging.';
  if (has(state, 'c9-witnesses-survived-mortal-attack'))
    return 'Ansel and the living witnesses survived the handbow volley and can still testify.';
  return 'The mortal attack has not yet produced a protected witness or captured order.';
}

function devilAttackResult(state: GameState) {
  if (has(state, 'c9-sableglass-breach-closed'))
    return 'The closed breach left every marked glass link on the neutral floor.';
  if (has(state, 'c9-vexa-survived-devil-attack'))
    return 'Vexa stands as a living witness with one marked link in her hand.';
  if (has(state, 'c9-fragment-survived-devil-attack'))
    return 'The fragment stayed fixed to neutral ground while Vexa defended herself.';
  if (has(state, 'c9-sableglass-chain-captured'))
    return 'The captured Sableglass chain remains whole enough to test each target knot.';
  return 'The devil attack has not yet left a secured witness object.';
}

function mortalProofResult(state: GameState) {
  if (has(state, 'c9-mortal-cell-proved-original'))
    return 'The original ledger cut now contains Malrec’s target strip.';
  if (has(state, 'c9-mortal-cell-proved-authenticated-copy'))
    return 'Pell’s sealed duplicate and its witness threads authenticate Malrec’s target strip.';
  if (has(state, 'c9-mortal-cell-proved-joined-record'))
    return 'The joined Gate record and Malrec order match the assassins’ opening dates and target hand.';
  if (has(state, 'c9-mortal-cell-proved-living-bark'))
    return 'Living bark holds three matched opening dates without claiming to be original paper.';
  if (has(state, 'c9-mortal-cell-proved-witnesses'))
    return 'Independent witnesses and the target strip identify the same service route.';
  if (has(state, 'c9-mortal-cell-proved-forgery-tool'))
    return 'The broken lower branch links both false Crown stamps to one workshop.';
  if (has(state, 'c9-mortal-cell-proved-captured-order'))
    return 'The prisoner’s intact order names Malrec’s clerk, targets, and payment.';
  if (has(state, 'c9-mortal-cell-proved-new-kit'))
    return 'New smoke wax, tunnel chalk, and target strips rebuild the mortal route after the old records burned.';
  return 'The mortal evidence has not yet been joined into a public route.';
}

function devilProofResult(state: GameState) {
  if (has(state, 'c9-sableglass-proved-by-glove'))
    return 'The collector glove and attack chain now form one Sableglass tool.';
  if (has(state, 'c9-sableglass-proved-by-source'))
    return 'The cracked source seal completes the attack chain’s house mark.';
  if (has(state, 'c9-sableglass-proved-by-ring'))
    return 'The collector ring fits the six-finger chain seal.';
  if (has(state, 'c9-sableglass-proved-by-freed-names'))
    return 'The freed names stripped hidden ink from the Sableglass chain.';
  if (has(state, 'c9-sableglass-proved-by-refusal'))
    return 'Ansel’s exact refusal forced the chain to display its owner.';
  if (has(state, 'c9-sableglass-proved-by-attack-chain'))
    return 'The intact chain records Vexa and the fragment as Sableglass targets.';
  if (has(state, 'c9-sableglass-proved-by-broken-chain'))
    return 'Vexa’s public identification and the fitted broken links establish Sableglass control.';
  return 'The devil evidence has not yet named its controlling house in public.';
}

function securedRevelation(state: GameState) {
  if (has(state, 'c9-vaor-gift-proof-guard'))
    return 'Vaor’s gift keeps honest copies warm and altered copies cold.';
  if (has(state, 'c9-vaor-pact-proof-carried'))
    return 'Vaor’s pact carried the joined proof through every public fort flame.';
  if (has(state, 'c9-stolen-ember-not-used'))
    return 'The stolen ember stayed covered while independent hands signed the proof.';
  if (has(state, 'c9-vaor-collateral-released'))
    return 'Vaor’s approved collateral ended before he marked the record willingly.';
  if (has(state, 'c9-forced-collateral-broken'))
    return 'The forced collateral ended without buying another use of Vaor.';
  if (has(state, 'c9-malrec-cinder-alliance-proved'))
    return 'The joined proof now names Malrec’s Cinder Deep allies and their Worldroot plan.';
  return 'The joined revelation still needs an independent way to survive the room.';
}

function clauseResult(state: GameState) {
  if (has(state, 'c9-cut-true-name-clause'))
    return 'The access clause is cut after alignment, and the named destroyed Oath stays gone.';
  if (has(state, 'c9-kept-true-name-clause'))
    return 'The narrow access clause remains tied to the fragment’s return and nothing else.';
  if (has(state, 'c9-no-clause-to-cut'))
    return 'No accepted bargain exists, so every surviving Oath remains untouched.';
  return 'The clause decision has not yet fixed the fate of any active Oath.';
}

function vexaStandingResult(state: GameState) {
  if (has(state, 'c9-vexa-guarded-trust'))
    return 'Vexa’s private patrol map rests beside the public route plan.';
  if (has(state, 'c9-vexa-adversarial-respect'))
    return 'The mutual threat-warning promise is witnessed, while personal trust remains withheld.';
  if (has(state, 'c9-vexa-attraction-acknowledged'))
    return 'Attraction is acknowledged only after danger, payment, and magic have been separated.';
  if (has(state, 'c9-vexa-permanent-hostility'))
    return 'Permanent hostility closes every private meeting and leaves only armed diplomacy.';
  return 'No lasting personal or political standing has been named yet.';
}

function privateChoiceResult(state: GameState) {
  if (has(state, 'c9-shared-private-night'))
    return 'Mutual intimacy revealed why Vexa believes freedom requires time between desire and offer.';
  if (has(state, 'c9-private-conversation-only'))
    return 'Conversation revealed the same danger while preserving the chosen physical boundary.';
  if (has(state, 'c9-refused-private-connection'))
    return 'The private opening ended cleanly, with no change to price, proof, or route.';
  return 'The private conversation has not yet chosen intimacy, words, or departure.';
}

function recoveredFragmentResult(state: GameState) {
  if (has(state, 'c9-fragment-recovered-bargain'))
    return 'The fragment answers one freely disclosed self-name and carries the exact return promise.';
  if (has(state, 'c9-fragment-recovered-theft'))
    return 'The fragment is stolen, publicly named, and free of any accepted bargain.';
  if (has(state, 'c9-fragment-recovered-exposure'))
    return 'The exposed Sableglass chain surrendered the fragment under public witness law.';
  return 'The chosen recovery route has not yet placed the fragment in your hand.';
}

const routeFlags = ['c9-route-bargain', 'c9-route-theft', 'c9-route-exposure'];

export const chapterNineNodes: Record<string, StoryNode> = {
  'c9-embassy-watch': {
    id: 'c9-embassy-watch',
    kicker: 'Chapter Nine',
    title: 'The Price of a Name',
    location: 'The Black Gate Fortress Ring',
    objective:
      'Place the embassy under clear neutral rules without changing Vexa’s recorded position.',
    threat: 'Uneasy',
    art: 'cinderembassy',
    introducesStoryTerms: ['Cinder Deep'],
    activeConsequences: { complications: entryFlags },
    lesson: {
      title: 'Neutral ground has a physical boundary',
      body: 'Second Fort has one public corridor, one Gate door, and locked passages to every wounded ward and lock room. Crossing either marked line requires a new spoken permission.',
    },
    body: (state) => [
      entryPosition(state),
      'Your attention stays on the white cords, the open exits, and every person close enough to be trapped.',
      'This is the first Cinder Deep embassy, a public mission from the realm beyond the Black Gate.',
      'Second Fort becomes neutral ground when mortal and Compact witnesses fasten one white cord across each private door. The cord breaks if anyone crosses without permission.',
      'The unfinished claim lies closed beneath clear glass. It bears the ordinary name Caelan Vey, but its price and consent lines remain blank. Vexa watches you, not the paper.',
      'Where does the negotiation begin?',
    ],
    choices: [
      {
        id: 'c9-move-public-embassy',
        label:
          'Escort the public embassy from Fourth Fort to neutral Second Fort.',
        detail:
          'Keep every witness and sealed case in view during the recorded move.',
        advantage:
          'Vexa reaches the neutral table without repeating her Gate crossing.',
        showIfAllFlags: ['c8-vexa-entered-publicly'],
        addFlags: ['c9-vexa-moved-fourth-to-second'],
        result:
          'The same public guard closes around the embassy. Vexa walks from Fourth Fort to Second Fort while every sealed case stays visible.',
        next: 'c9-futureless-answer',
      },
      {
        id: 'c9-admit-threshold-embassy',
        label: 'Invite Vexa from the threshold into neutral Second Fort.',
        detail:
          'Grant one new entry for negotiation, witnessed and limited to the public corridor.',
        advantage:
          'Gain a secure table while making the new crossing explicit.',
        showIfAllFlags: ['c8-vexa-held-at-threshold'],
        addFlags: ['c9-vexa-entered-second-explicitly'],
        result:
          'You speak the new permission and its limits. Vexa crosses once, enters Second Fort, and stops before the white cord.',
        next: 'c9-futureless-answer',
      },
      {
        id: 'c9-keep-threshold-witness-room',
        label: 'Keep Vexa outside and open the barred witness corridor.',
        detail:
          'Negotiate across a physical boundary with equal sight and no entry.',
        advantage:
          'Preserve the threshold while giving both sides a public table.',
        showIfAllFlags: ['c8-vexa-held-at-threshold'],
        addFlags: ['c9-vexa-remains-outside'],
        result:
          'Wardens open the barred corridor. Vexa takes the outer chair beyond the line, and the mortal witnesses take the inner gallery.',
        next: 'c9-futureless-answer',
      },
      {
        id: 'c9-keep-isolated-embassy',
        label: 'Keep Vexa inside Second Fort under the existing isolation.',
        detail:
          'Open the public gallery while every inner door stays corded and locked.',
        advantage:
          'Begin without giving the embassy access to wounded people or lock rooms.',
        showIfAnyFlags: [
          'c8-vexa-received-outer-fort',
          'c8-ansel-spoke-first-after-entry',
        ],
        addFlags: ['c9-vexa-isolation-preserved'],
        result:
          'The public gallery opens. Vexa remains inside Second Fort, and the white cords keep every private passage closed.',
        next: 'c9-futureless-answer',
      },
      {
        id: 'c9-ansel-controls-threshold',
        label: 'Let Ansel keep the threshold while Vexa remains outside.',
        detail:
          'Preserve his first hearing before creating any new entry permission.',
        advantage:
          'The Futureless finish recording Vexa’s disclosure before Crown officials speak.',
        showIfAllFlags: ['c8-ansel-spoke-first'],
        hideIfAnyFlags: ['c8-ansel-spoke-first-after-entry'],
        addFlags: ['c9-vexa-remains-outside', 'c9-ansel-kept-first-hearing'],
        result:
          'Ansel bars the Crown rail. Vexa remains outside, and his people finish recording her answer before the negotiation moves.',
        next: 'c9-futureless-answer',
      },
    ],
  },

  'c9-futureless-answer': {
    id: 'c9-futureless-answer',
    kicker: 'Who speaks first',
    title: 'The People Already Priced',
    location: 'Second Fort Witness Gallery',
    objective:
      'Set the first testimony before the Crown can narrow the hearing.',
    threat: 'Uneasy',
    art: 'cinderembassy',
    introducesStoryTerms: ['House Sableglass'],
    activeConsequences: {
      complications: [
        'c9-vexa-moved-fourth-to-second',
        'c9-vexa-entered-second-explicitly',
        'c9-vexa-remains-outside',
        'c9-vexa-isolation-preserved',
        'c9-ansel-kept-first-hearing',
      ],
      reactions: ['c8-ansel-spoke-first', 'c8-ansel-spoke-first-after-entry'],
    },
    body: (state) => [
      futurelessPriority(state),
      embassyTransition(state),
      'Your eyes stay on the clerk’s hand and Ansel’s loaded crossbow.',
      has(state, 'c8-pell-survived')
        ? 'Pell rests a bandaged hand on the lock map. He can match each sold promise to a hidden opening.'
        : 'Pell’s place is empty. Ansel carries the packet Pell saved before dying, but nobody can answer questions about the full lock map.',
      'Vexa presses a contract seal shaped like six joined fingers into soft wax. “House Sableglass,” she says. “They bought the promises. Mortal officers gave them hours, names, and doors.”',
      'Whose record controls the first hour?',
    ],
    choices: [
      {
        id: 'c9-let-futureless-record-first',
        label: 'Give Ansel and the Futureless the first complete record.',
        detail:
          'Delay the Crown claim hearing until every sold promise has a named bearer.',
        advantage:
          'Ansel becomes a willing proof witness during the negotiation.',
        addFlags: ['c9-futureless-record-first'],
        result:
          'Ansel calls each living bearer before the speaking bell moves. Vexa answers their questions in the order the promises were sold.',
        next: 'c9-name-demonstration',
      },
      {
        id: 'c9-pell-maps-first-hour',
        label: 'Let Pell match Vexa’s dates to the surviving lock map.',
        detail:
          'Use his wounded expertise before pain ends his work for the day.',
        advantage:
          'Create a route map that later separates mortal access from devil entry.',
        showIfAllFlags: ['c8-pell-survived', 'c8-complete-lock-map'],
        addFlags: ['c9-pell-matched-openings'],
        result:
          'Pell pins each date beside a service route. Three openings begin inside mortal walls before any devil crosses.',
        next: 'c9-name-demonstration',
      },
      {
        id: 'c9-split-speaking-bell',
        label: 'Give one speaking bell to Ansel and one to the Crown.',
        detail:
          'Keep both records moving, though either side can interrupt the other.',
        advantage:
          'Prevent Crown control while preserving official signatures.',
        addFlags: ['c9-split-public-record'],
        result:
          'Two bells sound in turn. The Crown gains signatures, while Ansel keeps every harmed person inside the official record.',
        next: 'c9-name-demonstration',
      },
    ],
  },

  'c9-name-demonstration': {
    id: 'c9-name-demonstration',
    kicker: 'A rule shown safely',
    title: 'The Name That Points Back',
    location: 'Second Fort Neutral Table',
    objective:
      'Test true-name precision without granting ownership or making a bargain.',
    threat: 'Low',
    art: 'cinderembassy',
    introducesStoryTerms: ['true name'],
    activeConsequences: {
      reactions: [
        'c9-futureless-record-first',
        'c9-pell-matched-openings',
        'c9-split-public-record',
      ],
    },
    lesson: {
      title: 'A true name gives precision, not ownership',
      body: 'A true name is a private answer a person chooses for who they are. When freely disclosed for a named use, it lets magic find that exact person. It grants no wider control.',
    },
    body: (state) => [
      'Your training looks for the point where a test becomes a weapon. Vexa keeps both hands open and the exits clear.',
      recordControl(state),
      'Vexa places two plain brass beads on the table. Ansel writes Caelan Vey on paper and moves it between them. Neither bead reacts. An ordinary name can label a claim, but it cannot make the claim true.',
      'Vexa touches one bead and freely speaks a private sentence she chose for herself. The bead turns toward her for three breaths, then stops when the stated test ends. She remains free to move, refuse, and leave.',
      'A prepared claim owns nothing. An offer waits for consent. An accepted bargain binds only the terms spoken. An owned promise has already been paid for. A freely disclosed true name gives exact access only for its stated time and purpose.',
      'How do you verify the limit?',
    ],
    choices: [
      {
        id: 'c9-test-name-with-own-bead',
        label: 'Give a harmless self-name for three breaths.',
        detail: 'Let one bead point to you, then require it to stop in public.',
        advantage:
          'Personally prove that named access ends when the stated test ends.',
        addFlags: ['c9-true-name-limit-tested'],
        result:
          'You speak a private answer for three breaths. The bead points to you, then falls still while every witness watches.',
        next: 'c9-prepare-room',
      },
      {
        id: 'c9-have-ansel-test-name-bead',
        label: 'Ask Ansel to run the test with his own chosen answer.',
        detail:
          'Keep your true name private while a harmed witness controls the limit.',
        advantage:
          'Prove consent and ending conditions through an independent witness.',
        addFlags: ['c9-ansel-verified-name-limit'],
        result:
          'Ansel states one use and three breaths. The bead finds him, stops on time, and never reaches the promises in his ledger.',
        next: 'c9-prepare-room',
      },
      {
        id: 'c9-break-name-bead-after-test',
        label: 'Let Vexa repeat her test, then crush the bead.',
        detail:
          'Verify that the stored precision ends when its named vessel is destroyed.',
        advantage:
          'Learn a physical way to end true-name access before any critical choice.',
        addFlags: ['c9-name-vessel-destruction-proved'],
        result:
          'The bead turns toward Vexa. You crush it after three breaths, and every fragment goes dark without pulling at her.',
        next: 'c9-prepare-room',
      },
    ],
  },

  'c9-prepare-room': {
    id: 'c9-prepare-room',
    kicker: 'The room is part of the defence',
    title: 'Three Doors to Guard',
    location: 'Second Fort Embassy Chamber',
    objective: 'Prepare one strong defence before Vexa reveals the fragment.',
    threat: 'Rising',
    art: 'cinderembassy',
    activeConsequences: {
      complications: defenceFlags,
      reactions: [
        'c9-true-name-limit-tested',
        'c9-ansel-verified-name-limit',
        'c9-name-vessel-destruction-proved',
      ],
    },
    body: (state) => [
      defencePosition(state),
      forcePosition(state),
      injuryPressure(state),
      'Your attention moves between the people, the fragment case, and the doors that can turn into traps.',
      nameTestResult(state),
      'The public door, the Gate wall, and the lower service passage cannot all receive your strongest guard. Which lane gets it?',
    ],
    choices: [
      {
        id: 'c9-wardens-lock-public-door',
        label: 'Put the united wardens on the public door.',
        detail: 'Use their living call and answer to stop false Crown orders.',
        advantage: 'The mortal assassins lose their clean public entrance.',
        showIfAllFlags: ['c8-united-wardens'],
        addFlags: ['c9-public-door-locked'],
        result:
          'Eight captains pair at the public door. No command opens it unless a living keeper answers from both sides.',
        next: 'c9-defining-route',
      },
      {
        id: 'c9-compact-seals-gate-wall',
        label: 'Put Compact white fire across the Gate wall.',
        detail:
          'Use the paid embassy protection against hidden devil crossings.',
        advantage:
          'The rival house must attack visibly through one marked point.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        addFlags: ['c9-gate-wall-sealed'],
        result:
          'Vexa lays one white line across the Gate wall. Hidden crossings fail, leaving a single visible breach point.',
        next: 'c9-defining-route',
      },
      {
        id: 'c9-first-fort-survivors-hold-passage',
        label: 'Give the lower passage to First Fort’s survivors.',
        detail: 'Use the route knowledge bought by the fort’s destruction.',
        advantage:
          'The mortal tunnel team is seen before it reaches the chamber.',
        showIfAllFlags: ['c8-sacrificed-first-fort'],
        addFlags: ['c9-lower-passage-warned'],
        result:
          'First Fort’s keepers mark every turn with chalk. A hidden courier cannot move below the hall without crossing their sight line.',
        next: 'c9-defining-route',
      },
      {
        id: 'c9-full-army-holds-galleries',
        label: 'Divide the Crown March into witnessed gallery pairs.',
        detail:
          'Spend 1 Command preventing divided loyalties from becoming private access.',
        advantage:
          'The full army covers all galleries while no lone officer controls a door.',
        changes: { command: -1 },
        requires: { command: 1 },
        showIfAllFlags: ['c7-gained-full-army'],
        addFlags: ['c9-army-gallery-pairs'],
        result:
          'Every Crown soldier stands beside a warden or Moot fighter. The galleries fill without giving one faction private control.',
        next: 'c9-defining-route',
      },
      {
        id: 'c9-company-guards-fragment-case',
        label: 'Put the chosen company around the fragment case.',
        detail:
          'Leave two attack lanes thin so the small force can protect one object well.',
        advantage:
          'The missing Gate Nail piece begins the attack behind a loyal shield ring.',
        showIfAllFlags: ['c7-gained-chosen-company'],
        addFlags: ['c9-fragment-shield-ring'],
        result:
          'Your chosen company forms a tight ring around the empty case. They cannot guard the doors, but nobody reaches the table unseen.',
        next: 'c9-defining-route',
      },
      {
        id: 'c9-volunteers-guard-witnesses',
        label: 'Explain the danger and let volunteers guard the witnesses.',
        detail:
          'No formal army obeys you. Each defender must choose the risk after hearing it.',
        advantage:
          'Gain a willing witness guard without pretending your reputation is command.',
        showIfAllFlags: ['c7-gained-dangerous-reputation'],
        addFlags: ['c9-voluntary-witness-guard'],
        result:
          'You name both threats and every exit. Wardens and Moot fighters choose positions around the witness rail.',
        next: 'c9-defining-route',
      },
    ],
  },

  'c9-defining-route': {
    id: 'c9-defining-route',
    kicker: 'The missing half',
    title: 'Vexa’s Exact Offer',
    location: 'Second Fort Neutral Table',
    objective: 'Choose how to recover the missing half of the Black Gate Nail.',
    threat: 'Rising',
    art: 'cinderembassy',
    activeConsequences: {
      complications: [
        'c9-public-door-locked',
        'c9-gate-wall-sealed',
        'c9-lower-passage-warned',
        'c9-army-gallery-pairs',
        'c9-fragment-shield-ring',
        'c9-voluntary-witness-guard',
      ],
    },
    body: (state) => [
      'Vexa opens a black case. Half of the Black Gate Nail rests inside, short as a finger and bright along one broken edge. The piece can close or release promises made through this Gate.',
      'Her offer has two prices. First, you freely disclose a true name so the fragment can align only to you. That access lasts until the fragment returns to neutral custody after Malrec’s inside opening is stopped.',
      'Second, you promise: “I will return the Black Gate fragment to neutral custody after Malrec’s inside opening is stopped, unless every living Gate keeper freely agrees to different custody.” No intimacy, service, obedience, or hidden payment belongs to the offer.',
      oathPrice(state),
      'Your hand stays off the fragment while the offer still waits for consent.',
      preparedDefence(state),
      'Do you bargain, prepare to steal during the expected attack, or prove Vexa’s rival house serves Malrec?',
    ],
    choices: [
      {
        id: 'c9-choose-bargain-route',
        label: 'Accept the offer as spoken and prepare the bounded bargain.',
        detail:
          'Give one true name for one use and make the exact return promise.',
        advantage:
          'Vexa must place the fragment in your hand before either price takes effect.',
        showIfAnyFlags: [
          'c9-true-name-limit-tested',
          'c9-ansel-verified-name-limit',
          'c9-name-vessel-destruction-proved',
        ],
        addFlags: ['c9-route-bargain'],
        result:
          'You repeat every term. Vexa places the fragment on the neutral cloth, awaiting your final consent and no other payment.',
        next: 'c9-mortal-attack',
      },
      {
        id: 'c9-choose-theft-route',
        label:
          'Refuse the offer and prepare to take the fragment during the attack.',
        detail:
          'Keep your true name private and accept that Vexa will treat the taking as a political wound.',
        advantage:
          'No promise binds you, and the prepared shield ring marks the fastest path to the case.',
        addFlags: ['c9-route-theft'],
        result:
          'You say no. The offer ends without binding either side. Your attention moves to the case hinges and the nearest clear exit.',
        next: 'c9-mortal-attack',
      },
      {
        id: 'c9-choose-exposure-route',
        label: 'Refuse the price and put House Sableglass on trial.',
        detail:
          'Recover the fragment through public proof instead of consent or theft.',
        advantage:
          'A complete case can force the rival house to surrender the piece under its own witness law.',
        addFlags: ['c9-route-exposure'],
        result:
          'You say no to the offer and open the evidence rail. Vexa allows it because Sableglass threatens her Compact as well as Edrath.',
        next: 'c9-mortal-attack',
      },
    ],
  },

  'c9-mortal-attack': {
    id: 'c9-mortal-attack',
    kicker: 'The first attack has mortal hands',
    title: 'Grey Coats at the Public Door',
    location: 'Second Fort Embassy Chamber',
    objective: 'Stop Malrec’s mortal assassins before they kill the witnesses.',
    threat: 'Critical',
    art: 'twosidedattack',
    body: (state) => [
      'You watch the weapons before the uniforms. The first attackers breathe mortal smoke and move like trained Crown couriers.',
      has(state, 'c9-lower-passage-warned')
        ? 'The lower warning arrives before the tunnel team. First Fort’s survivors close that attack lane.'
        : 'No lower warning arrives. Boots below the hall create a second mortal attack lane.',
      'A grey-coated courier breaks a wax capsule against the public door. Bitter smoke kills the nearest lamp. Three human shooters raise compact handbows from the Crown gallery.',
      'Their bolts aim at Ansel, Pell’s map, and the mortal evidence. They ignore Vexa and the fragment. A silver tree stamped inside each bow links the weapons to Malrec’s private stores.',
      has(state, 'c9-public-door-locked')
        ? 'The paired wardens keep six more grey coats outside. The paid defence has cut the mortal force in half.'
        : has(state, 'c9-lower-passage-warned')
          ? 'Chalk scrapes below. First Fort’s survivors catch the tunnel team before it reaches the witness stairs.'
          : 'More boots strike the lower passage. The thin lane gives the shooters a second angle.',
      'Who receives your first protection?',
    ],
    choices: [
      {
        id: 'c9-shield-ansel-and-witnesses',
        label: 'Cover Ansel and the witness rail with your body and shield.',
        detail:
          'Lose 1 Health if the public door was not locked by united wardens.',
        advantage:
          'Every living witness survives to identify the mortal weapons.',
        changes: { health: -1 },
        requires: { health: 1 },
        hideIfAnyFlags: ['c9-public-door-locked'],
        addFlags: ['c9-witnesses-survived-mortal-attack'],
        result:
          'You cross the bolt lane behind your shield. Ansel and every witness reach stone cover before the second volley.',
        next: 'c9-devil-attack',
      },
      {
        id: 'c9-shield-ansel-with-locked-door',
        label: 'Use the locked public door to move every witness behind cover.',
        detail: 'The united wardens already removed the second firing line.',
        advantage: 'Save every witness without taking another wound.',
        showIfAllFlags: ['c9-public-door-locked'],
        addFlags: ['c9-witnesses-survived-mortal-attack'],
        result:
          'The paired wardens hold the door while you clear the gallery. Every witness reaches cover before the three shooters reload.',
        next: 'c9-devil-attack',
      },
      {
        id: 'c9-command-gallery-pairs',
        label: 'Order the witnessed gallery pairs to close on the shooters.',
        detail: 'Spend the full army formation prepared before the offer.',
        advantage: 'Capture a mortal assassin with his orders intact.',
        showIfAllFlags: ['c9-army-gallery-pairs'],
        addFlags: ['c9-mortal-assassin-captured'],
        result:
          'Mixed pairs close from both stairs. One shooter drops his bow and survives with Malrec’s folded order inside his coat.',
        next: 'c9-devil-attack',
      },
      {
        id: 'c9-company-secures-fragment',
        label:
          'Keep the chosen company around the fragment and pull the table into cover.',
        detail:
          'Spend 1 Resolve while the company protects the central object and the witness rail takes one bolt.',
        advantage:
          'The mortal assassins cannot destroy or seize the Gate Nail piece.',
        showIfAllFlags: ['c9-fragment-shield-ring'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c9-fragment-survived-mortal-attack'],
        result:
          'Your company lifts the table as one shield. The fragment stays inside its case, while Ansel drags a wounded witness to cover.',
        next: 'c9-devil-attack',
      },
    ],
  },

  'c9-devil-attack': {
    id: 'c9-devil-attack',
    kicker: 'The second attack crosses the Gate wall',
    title: 'Glass Chains from Sableglass',
    location: 'Second Fort Embassy Chamber',
    objective:
      'Stop the rival devil house from killing Vexa and reclaiming the fragment.',
    threat: 'Critical',
    art: 'twosidedattack',
    activeConsequences: {
      complications: [
        'c9-witnesses-survived-mortal-attack',
        'c9-mortal-assassin-captured',
        'c9-fragment-survived-mortal-attack',
        'c9-gate-wall-sealed',
      ],
    },
    body: (state) => [
      'Your shield hand turns toward the new breach before the first glass link clears the wall.',
      mortalAttackResult(state),
      'A masked horned attacker presses a red mirror shard through the Gate wall. Glass chains follow it, each link carrying the same six-finger house seal found on the old collector.',
      'These attackers aim at Vexa, her Compact seal, and the fragment. They ignore the mortal witnesses. Their objective is to kill a rival diplomat and erase proof that Sableglass sold access to Malrec.',
      has(state, 'c9-gate-wall-sealed')
        ? 'Compact white fire forces every chain through one bright breach. The paid seal gives you one clear target.'
        : 'Chains enter through three cracks at once. Vexa can close two, leaving the third to you.',
      'What do you keep from their reach?',
    ],
    choices: [
      {
        id: 'c9-break-sableglass-breach',
        label: 'Break the single breach marked by Compact fire.',
        detail:
          'Use the paid wall seal to stop every devil chain at one point.',
        advantage: 'Save Vexa, the Compact seal, and the fragment together.',
        showIfAllFlags: ['c9-gate-wall-sealed'],
        addFlags: ['c9-sableglass-breach-closed'],
        result:
          'Your blade breaks the red mirror. Every chain falls through the same white line, leaving its house marks unburned.',
        next: 'c9-mortal-proof',
      },
      {
        id: 'c9-protect-vexa-from-chains',
        label: 'Cut the chains reaching for Vexa.',
        detail:
          'Lose 1 Health crossing the glass line while the fragment case remains exposed.',
        advantage:
          'Keep the only living devil diplomat able to testify against Sableglass.',
        changes: { health: -1 },
        requires: { health: 1 },
        hideIfAnyFlags: ['c9-gate-wall-sealed'],
        addFlags: ['c9-vexa-survived-devil-attack'],
        result:
          'Glass cuts your gauntlet as you sever the chains. Vexa stays on her feet and catches one marked link for evidence.',
        next: 'c9-mortal-proof',
      },
      {
        id: 'c9-protect-fragment-from-chains',
        label: 'Lock the fragment case under your Oathfire.',
        detail: 'Spend 1 Oathfire while Vexa must defend herself.',
        advantage:
          'Keep the Gate Nail piece on neutral ground through both attacks.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c9-fragment-survived-devil-attack'],
        result:
          'Gold fire fixes the case to the neutral table. Vexa burns two chains and takes a cut while the fragment remains still.',
        next: 'c9-mortal-proof',
      },
      {
        id: 'c9-volunteers-pull-witness-cord',
        label:
          'Have the volunteer guard pull the witness cord across the chains.',
        detail:
          'Use freely chosen hands to deny a house claim based on ownership.',
        advantage:
          'Protect the witnesses and preserve a complete chain as proof.',
        showIfAllFlags: ['c9-voluntary-witness-guard'],
        addFlags: ['c9-sableglass-chain-captured'],
        result:
          'The volunteers pull together. The chain crosses a line held by living choices, loses its force, and coils intact on the floor.',
        next: 'c9-mortal-proof',
      },
    ],
  },

  'c9-mortal-proof': {
    id: 'c9-mortal-proof',
    kicker: 'Follow the human method',
    title: 'Malrec’s Private Stores',
    location: 'Second Fort Mortal Gallery',
    objective:
      'Prove the mortal assassins received their method and target list from Malrec.',
    threat: 'Immediate',
    art: 'twosidedattack',
    activeConsequences: {
      complications: evidenceFlags,
      reactions: [
        'c9-sableglass-breach-closed',
        'c9-vexa-survived-devil-attack',
        'c9-fragment-survived-devil-attack',
        'c9-sableglass-chain-captured',
      ],
    },
    body: (state) => [
      evidencePosition(state),
      'Your attention stays on objects that another witness can test without trusting your rank.',
      devilAttackResult(state),
      'The captured bows contain silver-tree springs made for Malrec’s private guard. A target strip names Ansel, Pell, the evidence case, and nobody from the Compact.',
      'The mortal method is smoke, hidden access, and human weapons. Their objective was to erase proof of seventeen openings before Crown and Futureless witnesses could join it.',
      'Which surviving proof makes the link public?',
    ],
    choices: [
      {
        id: 'c9-match-original-ledger-cuts',
        label: 'Match the original ledger cuts to Malrec’s target strip.',
        detail:
          'Use the untouched paper edge and old ink as the controlling evidence.',
        advantage: 'Prove the same mortal office prepared both records.',
        showIfAllFlags: ['c8-preserved-original-ledgers'],
        addFlags: ['c9-mortal-cell-proved-original'],
        result:
          'Pell fits the target strip into a cut page. Fiber, ink, and hand match Malrec’s hidden fort ledger before every witness.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-authenticate-pell-packet',
        label: 'Authenticate the target strip with Pell’s sealed duplicate.',
        detail:
          'Use the packet’s witness threads while keeping copy and original distinct.',
        advantage:
          'Prove the target list came through the same mortal record chain.',
        showIfAllFlags: ['c8-saved-pell-packet'],
        addFlags: ['c9-mortal-cell-proved-authenticated-copy'],
        result:
          'Pell breaks the packet seal before both delegations. Each witness thread matches the target strip’s paper, ink batch, and clerk knot.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-test-joined-malrec-record',
        label: 'Test Malrec’s joined Gate record against the target strip.',
        detail: 'Use the proof chain already built at Fourth Fort.',
        advantage:
          'Expose matching opening dates and the same clerk hand without paying a new cost.',
        showIfAllFlags: ['c8-linked-malrec-to-gate-record'],
        addFlags: ['c9-mortal-cell-proved-joined-record'],
        result:
          'The joined record names the same openings in the same hand. The new target strip completes Malrec’s route from order to assassination.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-test-target-strip-on-living-bark',
        label: 'Press the target strip against the living bark copy.',
        detail:
          'Use the copy’s earned physical reaction without calling it an original.',
        advantage: 'Make the three matching hidden openings tighten into view.',
        showIfAllFlags: ['c8-living-copy-of-openings'],
        addFlags: ['c9-mortal-cell-proved-living-bark'],
        result:
          'The bark closes around three dates on the strip. Its living grain proves the match without pretending burned paper survived.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-witnesses-identify-mortal-route',
        label:
          'Let the opening witnesses identify the smoke route and target list.',
        detail:
          'Use many independent memories so no stolen page can erase the case.',
        advantage: 'Build public proof that survives the loss of the records.',
        showIfAnyFlags: [
          'c8-many-witnessed-openings',
          'c8-first-fort-became-witness',
        ],
        addFlags: ['c9-mortal-cell-proved-witnesses'],
        result:
          'Witness after witness names the same service route. The target strip lists that route in Malrec’s clerk hand.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-use-forgery-against-seal',
        label: 'Compare the exposed forgery with the bow’s silver-tree stamp.',
        detail:
          'Use a known false seal to identify the tool that made both marks.',
        advantage:
          'Trace the assassins to the same Crown workshop that forged the Gate record.',
        showIfAllFlags: ['c8-gate-forgery-exposed'],
        addFlags: ['c9-mortal-cell-proved-forgery-tool'],
        result:
          'Both false trees carry the same broken lower branch. The workshop flaw links the assassin bows to Malrec’s forged records.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-question-captured-mortal',
        label: 'Read the captured assassin’s intact order aloud.',
        detail: 'Use the prisoner and paper taken during the attack.',
        advantage:
          'Name Malrec’s mortal cell even when every earlier record was destroyed.',
        showIfAllFlags: ['c9-mortal-assassin-captured'],
        addFlags: ['c9-mortal-cell-proved-captured-order'],
        result:
          'The order names the witnesses, payment, and lower passage. The prisoner confirms Malrec’s clerk gave it to him that morning.',
        next: 'c9-devil-proof',
      },
      {
        id: 'c9-rebuild-proof-from-assassin-kit',
        label: 'Rebuild the route from the attackers’ smoke and tools.',
        detail: 'Spend 1 Resolve doing without the destroyed fort records.',
        advantage: 'Create new proof from objects that arrived in this attack.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        showIfAllFlags: ['c8-lost-duplicate-records'],
        addFlags: ['c9-mortal-cell-proved-new-kit'],
        result:
          'The smoke wax fits Malrec’s private capsule mold. Tunnel chalk and target strips rebuild the route from new evidence only.',
        next: 'c9-devil-proof',
      },
    ],
  },

  'c9-devil-proof': {
    id: 'c9-devil-proof',
    kicker: 'Follow the devil method',
    title: 'The Six-Finger Seal',
    location: 'Second Fort Gate Wall',
    objective:
      'Prove House Sableglass supplied contract access and attacked the Compact.',
    threat: 'Immediate',
    art: 'twosidedattack',
    activeConsequences: {
      reactions: [
        'c9-mortal-cell-proved-original',
        'c9-mortal-cell-proved-authenticated-copy',
        'c9-mortal-cell-proved-joined-record',
        'c9-mortal-cell-proved-living-bark',
        'c9-mortal-cell-proved-witnesses',
        'c9-mortal-cell-proved-forgery-tool',
        'c9-mortal-cell-proved-captured-order',
        'c9-mortal-cell-proved-new-kit',
      ],
      complications: [
        'c8-severed-collector-hand',
        'c8-captured-collector-glove',
        'c8-freed-futureless-names',
        'c8-ansel-refused-second-price',
        'c8-cut-collector-source-line',
      ],
    },
    body: (state) => [
      'Your eyes follow each chain link from its target knot back to the seal pressed into the glass.',
      mortalProofResult(state),
      'Vexa lays a glass chain beside the fragment case. Its six-finger seal belongs to House Sableglass, a rival devil house that trades in promises already taken from others.',
      has(state, 'c8-captured-collector-glove')
        ? 'Mara sets the captured collector glove beside it. Thread and chain carry the same seal, joining last night’s collector to today’s attackers.'
        : has(state, 'c8-cut-collector-source-line')
          ? 'The cracked seal left by the severed source line fits the chain mark exactly.'
          : has(state, 'c8-severed-collector-hand')
            ? 'The brass ring left by the severed collector hand carries the same six-finger mark.'
            : 'Ansel’s freely restored names darken the chain wherever Sableglass once claimed them.',
      'Their method is a mirror breach and contract chains. Their objective was to kill Vexa, recover the fragment, and erase their trade with Malrec.',
      'Which proof do you put beyond both houses’ control?',
    ],
    choices: [
      {
        id: 'c9-join-collector-glove-chain',
        label:
          'Lock the collector glove and chain together under witness glass.',
        detail:
          'Use the captured object from the earlier crossing as the exact match.',
        advantage:
          'Prove Sableglass controlled both the collector and the assassins.',
        showIfAllFlags: ['c8-captured-collector-glove'],
        addFlags: ['c9-sableglass-proved-by-glove'],
        result:
          'The glove seam closes around the chain link. Matching seal, thread, and contract ink make one visible Sableglass tool.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-match-cracked-source-seal',
        label: 'Fit the cracked source seal into the glass chain mark.',
        detail:
          'Use the earlier source-line victory to identify the rival house.',
        advantage:
          'Prove the same house powered the collector and today’s breach.',
        showIfAllFlags: ['c8-cut-collector-source-line'],
        addFlags: ['c9-sableglass-proved-by-source'],
        result:
          'The cracked seal completes the chain mark. Vexa names Sableglass before mortal and Compact witnesses together.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-match-severed-ring',
        label: 'Match the collector’s brass ring to the chain seal.',
        detail: 'Use the object left when you severed the reaching hand.',
        advantage:
          'Connect the prior collection attempt to this rival-house attack.',
        showIfAllFlags: ['c8-severed-collector-hand'],
        addFlags: ['c9-sableglass-proved-by-ring'],
        result:
          'The ring’s six fingers settle into the chain seal. Ansel records one house behind both attacks.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-let-freed-names-reject-chain',
        label: 'Let the Futureless reject the chain one name at a time.',
        detail: 'Use living bearers whose names were freed from the collector.',
        advantage:
          'Make Sableglass ownership fail publicly without another magical cost.',
        showIfAllFlags: ['c8-freed-futureless-names'],
        addFlags: ['c9-sableglass-proved-by-freed-names'],
        result:
          'Each living bearer says no. The chain sheds black ink until the hidden Sableglass seal becomes visible beneath it.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-ansel-refuses-chain-price',
        label: 'Ask Ansel to repeat the refusal that broke the collector.',
        detail: 'Use his earned knowledge of the exact contract limit.',
        advantage:
          'Force the chain to display the house that demanded an unlawful second price.',
        showIfAllFlags: ['c8-ansel-refused-second-price'],
        addFlags: ['c9-sableglass-proved-by-refusal'],
        result:
          'Ansel names the paid promise and refuses another price. The chain cracks around a Sableglass seal it can no longer hide.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-preserve-attacker-chain',
        label: 'Seal the captured attack chain as new evidence.',
        detail:
          'Use the object taken today when no collector evidence survived.',
        advantage:
          'Prove the rival house through method, target, and Vexa’s public identification.',
        showIfAllFlags: ['c9-sableglass-chain-captured'],
        addFlags: ['c9-sableglass-proved-by-attack-chain'],
        result:
          'The intact chain goes under neutral glass. Its target knots name Vexa and the fragment beside the Sableglass seal.',
        next: 'c9-joined-crisis',
      },
      {
        id: 'c9-use-vexa-broken-chain-testimony',
        label: 'Join Vexa’s testimony to the marked chain pieces.',
        detail:
          'Use the rival diplomat’s public identification and the attackers’ visible method.',
        advantage:
          'Prove Sableglass involvement even when no earlier collector object survived.',
        addFlags: ['c9-sableglass-proved-by-broken-chain'],
        result:
          'Vexa identifies the seal and names its house custodian. Mortal witnesses fit the broken links into one Sableglass chain.',
        next: 'c9-joined-crisis',
      },
    ],
  },

  'c9-joined-crisis': {
    id: 'c9-joined-crisis',
    kicker: 'Two enemies, one alliance',
    title: 'The Promise Road to Worldroot',
    location: 'Second Fort Neutral Table',
    objective:
      'Join the mortal order and Sableglass contract without merging the two attacks.',
    threat: 'Immediate',
    art: 'twosidedattack',
    activeConsequences: {
      complications: vaorFlags,
      reactions: [
        'c9-sableglass-proved-by-glove',
        'c9-sableglass-proved-by-source',
        'c9-sableglass-proved-by-ring',
        'c9-sableglass-proved-by-freed-names',
        'c9-sableglass-proved-by-refusal',
        'c9-sableglass-proved-by-attack-chain',
        'c9-sableglass-proved-by-broken-chain',
      ],
    },
    body: (state) => [
      'Your first thought is to copy the joined proof into hands that do not answer the same ruler.',
      devilProofResult(state),
      'The mortal target strip and devil chain share one list of opening times. Malrec supplied the doors. Sableglass supplied promises that could open them from inside the Cinder Deep.',
      'A second line names Worldroot. Malrec plans to release thousands of owned promises at once. The broken duties would strike Worldroot like pulled roots, weakening the barrier between realms.',
      vaorPosition(state),
      'How do you secure this revelation before another hand can erase it?',
    ],
    choices: [
      {
        id: 'c9-vaor-gift-guards-proof',
        label: 'Ask Vaor’s freely given ember to warm only honest copies.',
        detail: 'Use the gift as a test, not a weapon or payment.',
        advantage:
          'Every altered copy cools at once, protecting the Worldroot warning.',
        showIfAllFlags: ['c5-freed-vaor'],
        addFlags: [
          'c9-malrec-cinder-alliance-proved',
          'c9-vaor-gift-proof-guard',
        ],
        result:
          'Vaor agrees through the ember. Honest copies stay warm, while one clerk’s altered page turns cold in his hand.',
        next: 'c9-oath-clause',
      },
      {
        id: 'c9-vaor-pact-carries-proof',
        label: 'Invoke Vaor’s pact to expose what the Concord erased.',
        detail:
          'Use only the agreed duty to protect living people and reveal hidden truth.',
        advantage:
          'Vaor speaks the joined evidence into every public flame in the fort ring.',
        showIfAllFlags: ['c5-vaor-pact'],
        addFlags: [
          'c9-malrec-cinder-alliance-proved',
          'c9-vaor-pact-proof-carried',
        ],
        result:
          'Vaor accepts the exact use. Every public flame repeats the opening times and Malrec’s plan for Worldroot.',
        next: 'c9-oath-clause',
      },
      {
        id: 'c9-stolen-ember-kept-sheathed',
        label: 'Keep the stolen ember sheathed and use mortal witnesses.',
        detail:
          'Rely on the witnesses already protected instead of forcing Vaor again.',
        advantage:
          'Secure the revelation at low resources while gaining no dragonfire protection.',
        showIfAllFlags: ['c5-took-ember-by-force'],
        addFlags: [
          'c9-malrec-cinder-alliance-proved',
          'c9-stolen-ember-not-used',
        ],
        result:
          'You leave the ember covered. Ansel, Vexa, Teren, and three fort keepers sign the joined record in their own hands.',
        next: 'c9-oath-clause',
      },
      {
        id: 'c9-release-vaor-collateral-now',
        label:
          'Make the Compact release Vaor’s approved collateral before copying the proof.',
        detail:
          'End the exact embassy condition now that the attack has stopped.',
        advantage:
          'Restore Vaor’s outer flame and gain his willing witness mark.',
        showIfAllFlags: ['c8-ember-held-as-collateral', 'c5-freed-vaor'],
        addFlags: [
          'c9-malrec-cinder-alliance-proved',
          'c9-vaor-collateral-released',
        ],
        result:
          'Vexa releases the white ring. Vaor’s outer flame returns to him, then marks the honest joined record by choice.',
        next: 'c9-oath-clause',
      },
      {
        id: 'c9-break-forced-collateral',
        label:
          'Break the collateral forced onto Vaor before asking anything else.',
        detail:
          'Spend 1 Oathfire acknowledging the breach and ending its benefit.',
        advantage:
          'Stop the violation and gain no dragonfire advantage from it.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        showIfAllFlags: [
          'c8-ember-held-as-collateral',
          'c5-took-ember-by-force',
        ],
        addFlags: [
          'c9-malrec-cinder-alliance-proved',
          'c9-forced-collateral-broken',
        ],
        result:
          'You cut the white ring and name the earlier breach. Vaor takes back his flame. Mortal and devil witnesses preserve the proof without him.',
        next: 'c9-oath-clause',
      },
    ],
  },

  'c9-oath-clause': {
    id: 'c9-oath-clause',
    kicker: 'Exact wording becomes a weapon',
    title: 'One Clause, One Older Oath',
    location: 'Second Fort Neutral Table',
    objective:
      'Decide whether Oathfire cuts one bargain clause by destroying an active Oath.',
    threat: 'Rising',
    art: 'cinderembassy',
    activeConsequences: {
      complications: oathPriceFlags,
      reactions: [
        'c9-vaor-gift-proof-guard',
        'c9-vaor-pact-proof-carried',
        'c9-stolen-ember-not-used',
        'c9-vaor-collateral-released',
        'c9-forced-collateral-broken',
      ],
    },
    body: (state) => [
      oathPrice(state),
      'Your attention stays on the people who would carry each loss after the fire goes out.',
      securedRevelation(state),
      has(state, 'c9-route-bargain')
        ? 'Oathfire can cut the clause that lets true-name precision last until neutral custody. The return promise remains. Cutting that access requires destroying one active Oath forever.'
        : 'You refused the bargain, so no clause exists to cut. Oathfire cannot buy an advantage by pretending an unaccepted offer already binds you.',
      'Any offered Oath is named below with the person or community depending on it. A released or burned Oath does not return as payment.',
      'What survives this decision?',
    ],
    choices: [
      {
        id: 'c9-keep-bargain-clause',
        label: 'Keep the stated true-name clause and every active Oath.',
        detail:
          'Precision lasts until the fragment returns to neutral custody as agreed.',
        advantage: 'No earlier person or community loses a protection.',
        showIfAllFlags: ['c9-route-bargain'],
        addFlags: ['c9-kept-true-name-clause'],
        result:
          'You leave the clause untouched. Vexa’s precision remains narrow, witnessed, and tied to the fragment’s return.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-cut-clause-destroy-red-moot-authority',
        label: 'Destroy the Oath recognising the Red Moot’s living authority.',
        detail:
          'Spend 1 Oathfire and cut true-name access after alignment. Korran’s clans lose your magical guarantee of Red Moot command.',
        advantage:
          'Vexa can align the fragment once, then all true-name precision ends.',
        showIfAllFlags: ['c9-route-bargain', 'c6-oath-recognised-red-moot'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: [
          'c9-cut-true-name-clause',
          'c9-destroyed-red-moot-authority-oath',
        ],
        result:
          'Oathfire cuts the access clause and burns the exact Red Moot Oath. Korran feels the protection leave his marked hand.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-cut-clause-destroy-crown-restitution',
        label:
          'Destroy the Oath to bring the Concord’s hidden victims before the Queen.',
        detail:
          'Spend 1 Oathfire and cut true-name access after alignment. Hidden victims lose your magical promise of judgment or opposition.',
        advantage:
          'Vexa can align the fragment once, then all true-name precision ends.',
        showIfAllFlags: ['c9-route-bargain', 'c6-oath-crown-restitution'],
        hideIfAnyFlags: ['c8-released-crown-oath'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: [
          'c9-cut-true-name-clause',
          'c9-destroyed-crown-restitution-oath',
        ],
        result:
          'Oathfire cuts the access clause and burns the restitution Oath. Ansel hears you name the lasting loss before the witnesses.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-cut-clause-destroy-clan-refusal',
        label:
          'Destroy the Oath defending each clan’s right to refuse Crown control.',
        detail:
          'Spend 1 Oathfire and cut true-name access after alignment. The clans lose your magical defence of their freedom to leave.',
        advantage:
          'Vexa can align the fragment once, then all true-name precision ends.',
        showIfAllFlags: ['c9-route-bargain', 'c6-oath-defends-refusal'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c9-cut-true-name-clause', 'c9-destroyed-clan-refusal-oath'],
        result:
          'Oathfire cuts the access clause and burns the refusal Oath. The Moot fighters keep their choice, but your magic no longer guards it.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-cut-clause-destroy-honest-limit',
        label: 'Destroy the Oath limiting you to the command the Moot granted.',
        detail:
          'Spend 1 Oathfire and cut true-name access after alignment. Korran and the full army lose your magical promise to state and limit every order.',
        advantage:
          'Vexa can align the fragment once, then all true-name precision ends.',
        showIfAllFlags: ['c9-route-bargain', 'c6-oath-honest-limit'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: [
          'c9-cut-true-name-clause',
          'c9-destroyed-honest-command-limit-oath',
        ],
        result:
          'Oathfire cuts the access clause and burns the honest command limit. Korran withdraws Moot recognition, and Teren keeps the full army outside the Gate.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-cut-clause-destroy-unsea-investigation',
        label: 'Destroy the Oath to test which ancestor voices are conscious.',
        detail:
          'Spend 1 Oathfire and cut true-name access after alignment. The preserved voices lose you as their sworn investigator, and Korran must carry the duty home.',
        advantage:
          'Vexa can align the fragment once, then all true-name precision ends.',
        showIfAllFlags: ['c9-route-bargain', 'c6-oath-investigate-unsea'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: [
          'c9-cut-true-name-clause',
          'c9-destroyed-unsea-investigation-oath',
        ],
        result:
          'Oathfire cuts the access clause and burns the Unsea investigation Oath. Korran accepts the abandoned duty and refuses to call the loss settled.',
        next: 'c9-vexa-standing',
      },
      {
        id: 'c9-refusal-keeps-every-oath',
        label: 'Keep every active Oath because no bargain clause binds you.',
        detail:
          'Rely on the chosen theft or exposure route without inventing a magical payment.',
        advantage:
          'Preserve every earlier duty for the crossing and Worldroot.',
        hideIfAnyFlags: ['c9-route-bargain'],
        addFlags: ['c9-no-clause-to-cut'],
        result:
          'You spend nothing. The refused offer owns no promise, and every surviving Oath remains exactly where it was.',
        next: 'c9-vexa-standing',
      },
    ],
  },

  'c9-vexa-standing': {
    id: 'c9-vexa-standing',
    kicker: 'After the attack',
    title: 'What You Call Each Other Now',
    location: 'Second Fort Witness Gallery',
    objective:
      'Define Caelan and Vexa’s lasting personal and political relationship.',
    threat: 'Uneasy',
    art: 'cinderembassy',
    activeConsequences: {
      complications: routeFlags,
      reactions: [
        'c9-kept-true-name-clause',
        'c9-cut-true-name-clause',
        'c9-no-clause-to-cut',
        'c8-shared-oath-mara',
        'c8-shared-oath-lysara',
        'c8-shared-oath-korran',
      ],
    },
    body: (state) => [
      'You watch Vexa dismiss her own guards before deciding how close either of you may stand.',
      clauseResult(state),
      'The last attacker is bound, dead, or driven beyond the wall. Vexa dismisses her envoys and leaves both doors unlocked. The fragment remains under neutral guard.',
      has(state, 'c9-route-theft')
        ? 'She sees the route you prepared toward her case. “If you take it, call the act what it is. Precision begins with honest enemies.”'
        : has(state, 'c9-route-exposure')
          ? 'She studies the joined evidence. “You chose a law my rivals claim to respect. Make it expensive for them to lie.”'
          : 'She touches the neutral cloth beside the fragment. “I offered a narrow danger because the wider one ends both our realms.”',
      oathPrice(state),
      'What lasting place does Vexa have in your life and command?',
    ],
    choices: [
      {
        id: 'c9-name-guarded-trust',
        label: 'Offer guarded trust with public limits.',
        detail:
          'Treat Vexa as a dangerous ally whose stated boundaries have held.',
        advantage:
          'Gain her private map of Sableglass patrols for the crossing.',
        addFlags: ['c9-vexa-guarded-trust', 'c9-attacks-stopped'],
        result:
          'You name the limits and the trust. Vexa gives you a patrol map that she withheld from both assassins and her own envoys.',
        next: 'c9-private-choice',
      },
      {
        id: 'c9-name-adversarial-respect',
        label: 'Choose adversarial respect and independent aims.',
        detail: 'Acknowledge Vexa’s skill without granting trust or intimacy.',
        advantage:
          'Gain a witnessed promise that neither side will hide a threat to the Gate expedition.',
        addFlags: ['c9-vexa-adversarial-respect', 'c9-attacks-stopped'],
        result:
          'Vexa accepts the distance. You both promise to name any known threat to the expedition before using it against the other.',
        next: 'c9-private-choice',
      },
      {
        id: 'c9-name-attraction',
        label: 'Acknowledge attraction without making it a price.',
        detail:
          'Speak only after the offer is separate, the attack has ended, and both doors are open.',
        advantage:
          'Open a voluntary private conversation that either adult may leave.',
        forbidsRelationshipIntents: {
          mara: ['committed', 'exploring'],
          lysara: ['committed', 'exploring'],
          ilyra: ['committed', 'exploring'],
        },
        addFlags: ['c9-vexa-attraction-acknowledged', 'c9-attacks-stopped'],
        result:
          'You name the attraction and nothing owed. Vexa answers yes, then asks whether you want a private conversation after every magical object is locked away.',
        next: 'c9-private-choice',
      },
      {
        id: 'c9-name-permanent-hostility',
        label: 'Declare permanent hostility after the fragment is recovered.',
        detail:
          'End every private opening and treat future contact as armed diplomacy.',
        advantage:
          'Vexa gives up personal access and provides one final public route warning.',
        addFlags: ['c9-vexa-permanent-hostility', 'c9-attacks-stopped'],
        result:
          'You make the boundary permanent. Vexa gives the witness rail one route warning, then orders every future meeting held under arms.',
        next: 'c9-private-choice',
      },
    ],
  },

  'c9-private-choice': {
    id: 'c9-private-choice',
    kicker: 'No price and no locked door',
    title: 'A Conversation Either May Leave',
    location: 'Second Fort Unbound Guest Room',
    objective:
      'Choose whether any private connection continues after all bargaining ends.',
    threat: 'Low',
    art: 'cinderembassy',
    intimacyControls: intimacyEligible,
    activeConsequences: {
      reactions: [
        'c9-vexa-guarded-trust',
        'c9-vexa-adversarial-respect',
        'c9-vexa-attraction-acknowledged',
        'c9-vexa-permanent-hostility',
        'c9-attacks-stopped',
      ],
    },
    body: (state) => [
      'Your hand tests both door latches. Each opens without a key, guard, or spoken price.',
      vexaStandingResult(state),
      has(state, 'c9-attacks-stopped')
        ? 'The assassins are gone or restrained. No captor, active threat, or magical pressure remains in the room.'
        : 'The room cannot support a private choice until every active threat ends.',
      'The fragment, true-name beads, weapons, and contract papers stay under public guard. The guest room has two unlocked doors. No white fire, Oathfire, or true-name knowledge enters with you.',
      state.relationships.mara.intent === 'committed'
        ? 'Your commitment to Mara remains clear. Vexa does not ask for intimacy and offers only a final political conversation.'
        : state.relationships.lysara.intent === 'committed'
          ? 'Your commitment to Lysara remains clear. Vexa does not ask for intimacy and offers only a final political conversation.'
          : has(state, 'c9-vexa-attraction-acknowledged')
            ? 'Vexa asks once, as one free adult to another. Either of you may stop, leave, or choose only conversation. The answer changes no bargain term.'
            : 'Vexa offers one private political answer, then a clean departure. No personal access is expected.',
      'What do you choose?',
    ],
    choices: [
      {
        id: 'c9-share-private-night',
        label: 'Choose mutual intimacy after setting clear limits.',
        detail:
          'Both adults consent outside captivity, threat, magic, payment, and existing commitment. Either may stop and leave.',
        advantage:
          'Learn why Vexa fears a complete merger and deepen the tracked relationship.',
        showIfRelationshipIntents: { vexa: ['interested'] },
        requiresFlags: ['c9-attacks-stopped'],
        forbidsRelationshipIntents: {
          mara: ['committed', 'exploring'],
          lysara: ['committed', 'exploring'],
          ilyra: ['committed', 'exploring'],
        },
        addFlags: ['c9-shared-private-night', 'c9-learned-desire-offer-danger'],
        result:
          'You both state limits and agree that either may stop. Nothing is owed, and the doors remain unlocked.',
        next: 'c9-recover-fragment',
      },
      {
        id: 'c9-talk-with-vexa-only',
        label: 'Choose conversation without intimacy.',
        detail:
          'Keep the doors open and ask why Vexa fears the realms becoming one.',
        advantage:
          'Learn the Chapter Ten danger while preserving the chosen personal boundary.',
        hideIfAnyFlags: ['c9-vexa-permanent-hostility'],
        addFlags: [
          'c9-private-conversation-only',
          'c9-learned-desire-offer-danger',
        ],
        result:
          'Vexa accepts the boundary. She explains that desire becomes an offer too quickly in the Cinder Deep for thought to refuse.',
        next: 'c9-recover-fragment',
      },
      {
        id: 'c9-leave-vexa-private',
        label: 'Leave the room and keep every exchange public.',
        detail: 'End the private opening without insult or hidden consequence.',
        advantage:
          'Preserve a clear political boundary before the final recovery.',
        addFlags: ['c9-refused-private-connection'],
        result:
          'You decline and leave through the open door. Vexa accepts the answer without changing any price, proof, or route.',
        next: 'c9-recover-fragment',
      },
    ],
  },

  'c9-recover-fragment': {
    id: 'c9-recover-fragment',
    kicker: 'The price is paid or defeated',
    title: 'The Other Half of the Gate Nail',
    location: 'Second Fort Neutral Table',
    objective: 'Complete the chosen route and recover the fragment.',
    threat: 'Immediate',
    art: 'gatecrossing',
    activeConsequences: {
      complications: routeFlags,
      reactions: [
        'c9-shared-private-night',
        'c9-private-conversation-only',
        'c9-refused-private-connection',
        'c9-kept-true-name-clause',
        'c9-cut-true-name-clause',
      ],
    },
    body: (state) => [
      ...privateScene(state),
      'Your hand remains open until the chosen recovery law places the fragment there.',
      privateChoiceResult(state),
      has(state, 'c9-route-bargain')
        ? 'At the neutral table, Vexa puts the fragment into your open hand before payment. You may now consent, speak the self-name, and make the exact return promise.'
        : has(state, 'c9-route-theft')
          ? 'The attack left the case hinge cracked and the fragment under mortal guard. Taking it will save the Gate plan while creating a lasting debt between governments.'
          : 'The joined record reaches Sableglass through its surviving chain. Its own witness law requires surrender of property used in an undeclared attack.',
      'How do you finish the route?',
    ],
    choices: [
      {
        id: 'c9-complete-bargain',
        label:
          'Freely disclose the self-name and make the exact return promise.',
        detail:
          'Bind only alignment and return. The prepared claim still owns nothing else.',
        advantage:
          'Recover the fragment with Compact cooperation and a witnessed end condition.',
        showIfAllFlags: ['c9-route-bargain'],
        addFlags: [
          'c9-true-name-freely-disclosed',
          'c9-return-promise-owned',
          'c9-fragment-recovered-bargain',
        ],
        result:
          'You say yes, speak the private answer, and make the return promise. One white seam aligns the fragment to your hand.',
        next: 'c9-crossing-roster',
      },
      {
        id: 'c9-take-fragment-during-attack',
        label:
          'Take the fragment through the cracked hinge and name the theft publicly.',
        detail:
          'Keep your true name and make no promise. Accept permanent political damage with Vexa.',
        advantage:
          'Recover the fragment without magical access to your identity.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c9-fragment-recovered-theft', 'c9-theft-publicly-named'],
        result:
          'You lift the fragment and call the act theft before every witness. No bargain binds you. Vexa records the debt without pretending consent.',
        next: 'c9-crossing-roster',
      },
      {
        id: 'c9-compel-sableglass-surrender',
        label:
          'Invoke Sableglass witness law and compel surrender of the fragment.',
        detail:
          'Use the complete mortal and devil proof gathered through the public hearing.',
        advantage:
          'Recover the fragment as seized attack material under law both houses recognise.',
        showIfAllFlags: [
          'c9-route-exposure',
          'c9-malrec-cinder-alliance-proved',
        ],
        addFlags: [
          'c9-fragment-recovered-exposure',
          'c9-sableglass-publicly-exposed',
        ],
        result:
          'The chain releases the fragment onto neutral cloth. Vexa and Ansel witness Sableglass losing its claim under its own law.',
        next: 'c9-crossing-roster',
      },
    ],
  },

  'c9-crossing-roster': {
    id: 'c9-crossing-roster',
    kicker: 'Every traveller chooses',
    title: 'Who Crosses the Black Gate',
    location: 'The Black Gate Threshold',
    objective:
      'Form a route-accurate expedition and cross with the recovered fragment.',
    threat: 'Unknown',
    art: 'gatecrossing',
    activeConsequences: {
      complications: [
        'c9-fragment-recovered-bargain',
        'c9-fragment-recovered-theft',
        'c9-fragment-recovered-exposure',
        'c8-pell-survived',
        'c8-pell-died-for-map',
        'c8-complete-lock-map',
        'c7-gained-full-army',
        'c7-gained-chosen-company',
        'c7-gained-dangerous-reputation',
      ],
    },
    body: (state) => [
      'You count every volunteer twice: once when they state the risk, and once when they choose the threshold.',
      recoveredFragmentResult(state),
      'The recovered fragment opens a stable person-wide seam in the Black Gate. Beyond it, black bridges cross a red-lit depth. Vexa warns that every strong desire there can become an offer before thought catches it.',
      has(state, 'c8-pell-survived')
        ? 'Pell can carry the lock map, but his injured hand prevents fighting. Ansel can bring living testimony. Teren can bring Crown volunteers who choose service without command.'
        : 'Pell’s saved packet can travel with Ansel. Teren can bring Crown volunteers, while mixed wardens know how to challenge copied orders.',
      'Which voluntary group takes the first crossing?',
    ],
    choices: [
      {
        id: 'c9-take-futureless-expedition',
        label: 'Cross with Ansel and two Futureless witnesses.',
        detail:
          'Carry living proof into the realm where the promises were sold.',
        advantage:
          'Sableglass cannot call its victims absent when the first challenge begins.',
        addFlags: ['c9-roster-futureless', 'c9-crossed-black-gate'],
        result:
          'Ansel and two witnesses speak consent at the line. They cross beside you with their names and promises recorded in their own hands.',
        next: endingForRoute,
      },
      {
        id: 'c9-take-pell-and-lock-map',
        label:
          'Cross with Pell, his complete lock map, and a small shield escort.',
        detail:
          'Accept slower movement so the expedition can identify every inside opening.',
        advantage:
          'Begin Chapter Ten with the only complete map of mortal and devil Gate routes.',
        showIfAllFlags: ['c8-pell-survived', 'c8-complete-lock-map'],
        addFlags: [
          'c9-roster-pell',
          'c9-roster-wardens',
          'c9-crossed-black-gate',
        ],
        result:
          'Pell straps the map to his uninjured arm. A mixed shield escort matches his pace through the Gate.',
        next: endingForRoute,
      },
      {
        id: 'c9-take-mixed-warden-company',
        label: 'Cross with a mixed company of wardens and Moot fighters.',
        detail:
          'Leave the full army outside and take only people who consent to shared command.',
        advantage:
          'Gain a compact force whose loyalties have already survived copied orders.',
        showIfAnyFlags: [
          'c7-gained-chosen-company',
          'c7-gained-dangerous-reputation',
        ],
        hideIfAnyFlags: [
          'c9-destroyed-red-moot-authority-oath',
          'c9-destroyed-clan-refusal-oath',
          'c9-destroyed-honest-command-limit-oath',
        ],
        addFlags: ['c9-roster-wardens', 'c9-crossed-black-gate'],
        result:
          'Each fighter names the command they accept and the moment they may leave. The small company crosses as one chosen unit.',
        next: endingForRoute,
      },
      {
        id: 'c9-take-crown-volunteers',
        label: 'Cross with Teren and six Crown volunteers.',
        detail:
          'Leave the divided army at the forts while volunteers choose the inside mission individually.',
        advantage:
          'Carry official witnesses without importing divided army command.',
        showIfAllFlags: ['c7-gained-full-army'],
        addFlags: ['c9-roster-crown', 'c9-crossed-black-gate'],
        result:
          'Teren removes his marshal badge. Six soldiers choose the crossing without an order, then follow him through the seam.',
        next: endingForRoute,
      },
    ],
  },

  'c9-ending-bargain': {
    id: 'c9-ending-bargain',
    kicker: 'Chapter Nine complete',
    title: 'The Name Freely Given',
    location: 'Inside the Cinder Deep',
    objective:
      'Keep the return promise while stopping Malrec’s released promises from reaching Worldroot.',
    threat: 'Unknown',
    art: 'gatecrossing',
    final: true,
    body: (state) => [
      'Your fingers feel the white seam answer one exact identity and no wider command.',
      'The Black Gate closes to a narrow white seam behind you. The fragment answers your freely given self-name and nothing beyond its witnessed purpose.',
      has(state, 'c9-cut-true-name-clause')
        ? 'True-name access ended after alignment. The Oath you destroyed does not return, and the people who depended on it enter the next struggle without that protection.'
        : 'Vexa retains narrow precision until the fragment returns to neutral custody. She can find its bearer, but she cannot command your body, desire, or other promises.',
      crossingRoster(state),
      'Ahead, a market bell rings when one traveller looks at water. A cup appears with a price already attached. How can anyone remain free where desire automatically becomes an offer?',
    ],
    choices: [],
  },

  'c9-ending-theft': {
    id: 'c9-ending-theft',
    kicker: 'Chapter Nine complete',
    title: 'The Honest Theft',
    location: 'Inside the Cinder Deep',
    objective:
      'Carry the stolen fragment while stopping Malrec’s released promises from reaching Worldroot.',
    threat: 'Unknown',
    art: 'gatecrossing',
    final: true,
    body: (state) => [
      'Your hand keeps the stolen metal visible. Concealment would turn an admitted theft into another lie.',
      'The stolen fragment cuts a white seam through the Gate. No true name guides it, so you keep one gloved hand around the hot metal.',
      has(state, 'c9-vexa-permanent-hostility')
        ? 'Vexa crosses as a hostile guide under public truce. She will stop Sableglass and Malrec, then collect the political debt you named.'
        : 'Vexa crosses under a narrow truce. She respects that you named the theft, but the missing fragment remains a wound between your governments.',
      crossingRoster(state),
      'A market bell rings when one traveller looks at water. A cup appears with a price already attached. How can anyone remain free where desire automatically becomes an offer?',
    ],
    choices: [],
  },

  'c9-ending-exposure': {
    id: 'c9-ending-exposure',
    kicker: 'Chapter Nine complete',
    title: 'The House Named in Public',
    location: 'Inside the Cinder Deep',
    objective:
      'Use the public case against Sableglass while stopping Malrec’s released promises from reaching Worldroot.',
    threat: 'Unknown',
    art: 'gatecrossing',
    final: true,
    body: (state) => [
      'Your eyes stay on the separate proof bearers. No single death or theft can erase the case now.',
      'The surrendered fragment opens a clean white seam. Copies of the joined case travel with separate mortal, Futureless, and Compact witnesses.',
      'House Sableglass cannot erase the mortal weapons, devil chains, and matched opening times together. Malrec’s alliance inside the Cinder Deep is now a public fact.',
      crossingRoster(state),
      'A market bell rings when one traveller looks at water. A cup appears with a price already attached. How can anyone remain free where desire automatically becomes an offer?',
    ],
    choices: [],
  },
};
