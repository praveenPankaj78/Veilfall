import type { GameState } from './game-data';

const pageKnownNodes = new Set([
  'sealed-case',
  'choose-road',
  'low-road',
  'ridge-road',
  'inspection-yard',
  'march-order',
  'road-conversation',
  'ambush-warning',
  'low-crisis',
  'ridge-crisis',
  'inspection-crisis',
  'aftermath',
  'evidence',
  'retreat',
  'folded-road',
  'ending-forward',
  'ending-height',
  'ending-oath',
]);

const ambushKnownNodes = new Set([
  'low-crisis',
  'ridge-crisis',
  'inspection-crisis',
  'aftermath',
  'evidence',
  'retreat',
  'folded-road',
  'ending-forward',
  'ending-height',
  'ending-oath',
]);

const pinRevealNodes = new Set([
  'c2-road-pin',
  'c2-remove-pin',
  'c2-last-testimony',
  'c2-ending-testimony',
  'c2-ending-pin',
  'c2-ending-oath',
]);

const courierRevealNodes = new Set([
  'c3-evidence',
  'c3-watch-house',
  'c3-divided-loyalty',
  'c3-market-memory',
  'c3-pin-test',
  'c3-duplicate',
  'c3-courier',
  'c3-collapse',
  'c3-pursuit',
  'c3-world-nail',
  'c3-ending-courier',
  'c3-ending-thief',
  'c3-ending-return',
]);

const chapterSevenAuthenticatedCopyFlags = [
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
];

const rennKnownNodes = new Set([
  'c3-divided-loyalty',
  'c3-market-memory',
  'c3-pin-test',
  'c3-duplicate',
  'c3-courier',
  'c3-collapse',
  'c3-pursuit',
  'c3-world-nail',
  'c3-ending-courier',
  'c3-ending-thief',
  'c3-ending-return',
]);

const rookKnownNodes = new Set([
  'c4-collapse',
  'c4-wounded',
  'c4-three-spans',
  'c4-snow-span',
  'c4-storm-span',
  'c4-brass-span',
  'c4-stage-turn',
  'c4-ordan',
  'c4-nine-marks',
  'c4-mara',
  'c4-soldiers',
  'c4-theatre-plan',
  'c4-anchor',
  'c4-duty',
  'c4-ending-arrest',
  'c4-ending-bargain',
  'c4-ending-trust',
]);

const nineNailsKnownNodes = new Set([
  'c4-mara',
  'c4-soldiers',
  'c4-theatre-plan',
  'c4-anchor',
  'c4-duty',
  'c4-ending-arrest',
  'c4-ending-bargain',
  'c4-ending-trust',
]);

const vaorKnownNodes = new Set([
  'c5-royal-camp',
  'c5-three-climbs',
  'c5-glass-stair',
  'c5-frozen-river',
  'c5-ash-tunnel',
  'c5-grave-mouth',
  'c5-memory-wall',
  'c5-mara-burns',
  'c5-lysara-burns',
  'c5-sorin-care',
  'c5-vaor-wakes',
  'c5-vaor-test',
  'c5-crown-assault',
  'c5-heart-memory',
  'c5-grave-collapse',
  'c5-ember-choice',
  'c5-ending-free',
  'c5-ending-force',
  'c5-ending-pact',
]);

const orivaneKnownNodes = new Set([
  'c5-grave-collapse',
  'c5-ember-choice',
  'c5-ending-free',
  'c5-ending-force',
  'c5-ending-pact',
]);

export function knownTruths(game: GameState) {
  const truths: string[] = [];

  if (game.chapter === 1) {
    truths.push(
      'I am leading Ambassador Lysara and a Warden escort toward Bellweather Inn.',
    );
    if (pageKnownNodes.has(game.nodeId)) {
      truths.push(
        'The route page inside my sealed case names the low road, although I remember sealing an order for the ridge.',
      );
    }
    if (game.flags.includes('tested-case')) {
      truths.push(
        'I found no sign of ordinary tampering on the case lock or wax.',
      );
    }
    if (ambushKnownNodes.has(game.nodeId)) {
      truths.push('An organised force attacked us on the route I chose.');
    }
    if (game.flags.includes('confirmed-advance-orders')) {
      truths.push(
        'The attackers received plans for every possible route before I made my decision.',
      );
    }
    return truths;
  }

  if (game.chapter === 2) {
    truths.push(
      'The sealed route page did not match my memory, and the attackers prepared for every route before I chose one.',
    );

    if (
      [
        'c2-eleven-years',
        'c2-investigate',
        'c2-ledger',
        'c2-cellar',
        'c2-attacker',
        'c2-night-watch',
        'c2-bell',
        'c2-common-room-crisis',
        'c2-descend',
        'c2-folded-cellar',
        'c2-road-pin',
        'c2-remove-pin',
        'c2-last-testimony',
        'c2-ending-testimony',
        'c2-ending-pin',
        'c2-ending-oath',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'A damaged road beneath Bellweather is pulling distant entrances beside the inn. It changes distance, not time.',
      );
    }
    if (game.nodeId === 'c2-ledger' || game.flags.includes('c2-ledger-route')) {
      truths.push(
        'Maelin’s records connect Ordan to supplies and disguised royal soldiers prepared around the inn.',
      );
    }
    if (game.nodeId === 'c2-cellar' || game.flags.includes('c2-cellar-route')) {
      truths.push(
        'I found the shifted coastal road and the hidden cellar entrance used by the attackers.',
      );
    }
    if (
      game.nodeId === 'c2-attacker' ||
      game.flags.includes('c2-attacker-route')
    ) {
      truths.push(
        'Garran identifies Ordan as the officer who paid for the attack and ordered us driven to Bellweather.',
      );
    }
    if (pinRevealNodes.has(game.nodeId)) {
      truths.push(
        'Ordan lured Lysara and me to Bellweather because my road authority and her living magic could unlock the road pin.',
      );
    }
    if (game.nodeId === 'c2-road-pin' || game.nodeId === 'c2-remove-pin') {
      truths.push(
        'The road pin normally keeps every road end in its proper place. I must drive it back into its socket.',
      );
    } else if (
      [
        'c2-last-testimony',
        'c2-ending-testimony',
        'c2-ending-pin',
        'c2-ending-oath',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'I drove the road pin back into place, but a broken piece still pulls toward Harrowfen.',
      );
    }
    return truths;
  }

  if (game.chapter === 3) {
    truths.push(
      'The sealed route page did not match my memory, and the attackers prepared for every route before I chose one.',
    );
    truths.push(
      'Ordan’s soldiers belong to Asterra, the kingdom I serve. They follow his covert royal orders, not the Queen’s public command.',
    );
    truths.push(
      'Ordan lured Lysara and me to Bellweather so our authority and living magic would unlock the road pin. I drove it back into place, but a fragment pulled us to Harrowfen.',
    );
    if (
      courierRevealNodes.has(game.nodeId) ||
      game.completedChapters.includes(3)
    ) {
      truths.push(
        'Ordan arranged the Bellweather attack, forged the later evidence against me, and sent a corrupt Warden to commit crimes in my cloak.',
      );
    }
    if (rennKnownNodes.has(game.nodeId) || game.completedChapters.includes(3)) {
      truths.push(
        game.flags.includes('c3-kept-courier-list')
          ? 'The orders name Captain Renn, and the soldier list records Ordan’s payment to him.'
          : 'The orders in Ordan’s safe room name Captain Renn as the Warden using my spare cloak.',
      );
    }
    if (game.flags.includes('c3-caught-clerk')) {
      truths.push(
        'I captured the archive burner and saved Ordan’s signed route request and its last payment page.',
      );
    } else if (game.flags.includes('c3-bridge-record')) {
      truths.push(
        'Lysara copied Ordan’s route request and its royal payment line before the archive burner escaped.',
      );
    } else if (game.flags.includes('c3-lysara-read-ink')) {
      truths.push(
        'Lysara’s living thread preserved Ordan’s signature and payment figures from the burned archive page.',
      );
    }
    if (game.flags.includes('c3-sable-identified-guard')) {
      truths.push(
        'Garran identified the guard Mara captured inside the healing house.',
      );
    } else if (game.flags.includes('c3-secured-healer')) {
      truths.push(
        'I kept every healing house patient safe while Garran and Iven connected the attackers to Ordan.',
      );
    } else if (game.flags.includes('c3-canal-defence')) {
      truths.push(
        'Brann’s divided guard line protected both rooms and trapped one of Ordan’s attackers.',
      );
    }
    if (game.flags.includes('c3-tested-door')) {
      truths.push('Varris revealed the true brass map of the Mileless Bridge.');
    } else if (game.flags.includes('c3-unmasked-varris')) {
      truths.push(
        'I captured Varris’s attacker with Ordan’s murder order and a brass bridge key.',
      );
    } else if (game.flags.includes('c3-varris-map')) {
      truths.push(
        'Varris gave me the bridge opening word, and his fleeing attacker dropped Ordan’s signed threat.',
      );
    }
    if (
      game.flags.includes('c3-target-ordan') ||
      game.flags.includes('c3-target-thief') ||
      game.flags.includes('c3-secured-return')
    ) {
      truths.push(
        'The iron is part of a World Nail that normally keeps distance stable across Edrath.',
      );
    }
    return truths;
  }

  if (game.chapter === 4) {
    truths.push(
      'Ordan used a covert Asterra detachment to open Bellweather, frame me in Harrowfen, and place a secret royal force on the Mileless Bridge.',
    );
    truths.push(
      'The iron fragment comes from a World Nail that normally keeps distance stable across Edrath.',
    );
    if (rookKnownNodes.has(game.nodeId)) {
      truths.push(
        'Rook Sable stole the fragment to copy the map hidden inside it, not to control the iron itself.',
      );
    }
    if (nineNailsKnownNodes.has(game.nodeId)) {
      truths.push(
        'The fragment belongs to the Nail of Distance and maps all nine World Nails. Bellweather and the Mileless Bridge used broken pieces of the same Nail.',
      );
    }
    if (
      game.nodeId === 'c4-ending-arrest' ||
      game.nodeId === 'c4-ending-bargain' ||
      game.nodeId === 'c4-ending-trust'
    ) {
      truths.push(
        'A genuine order from Regent Malrec commands me to carry the fragment to Dragonspine, where another Nail is active.',
      );
    }
    return truths;
  }

  if (game.chapter === 5) {
    truths.push(
      'Ordan used a covert Asterra detachment to open Bellweather, frame me in Harrowfen, and place a secret royal force on the Mileless Bridge.',
    );
    truths.push(
      'Rook stole the Distance fragment to copy the map hidden inside it. That map marks all nine World Nails.',
    );
    truths.push(
      'A genuine order from Regent Malrec sent me to Dragonspine, where another Nail is active. His own private soldiers are already here.',
    );

    if (game.nodeId !== 'c5-north-road') {
      truths.push(
        'Cold fire from the damaged fire Nail steals warmth and follows living heat. My Health cannot recover while it burns nearby.',
      );
    }
    if (vaorKnownNodes.has(game.nodeId)) {
      truths.push(
        'Vaor was imprisoned beneath memory glass a century ago. Regent Malrec’s force reopened the grave two nights ago, clamped him again, and now intends to cut out his living ember.',
      );
    }
    if (
      [
        'c5-vaor-wakes',
        'c5-vaor-test',
        'c5-crown-assault',
        'c5-heart-memory',
        'c5-grave-collapse',
        'c5-ember-choice',
        'c5-ending-free',
        'c5-ending-force',
        'c5-ending-pact',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'The glass plates around Vaor preserve events he truly lived. They are memories, not alternate timelines.',
      );
    }
    if (orivaneKnownNodes.has(game.nodeId)) {
      truths.push(
        'Orivane willingly gave her living heart to create the Concord, but the rulers hid that living people would be cut away from Edrath.',
      );
    }
    if (game.flags.includes('c5-freed-vaor')) {
      truths.push(
        'I freed Vaor and carry an ember he gave willingly. He is an independent ally, not my weapon.',
      );
    }
    if (game.flags.includes('c5-took-ember-by-force')) {
      truths.push(
        'I took Vaor’s ember by force. Its power obeys me, and the freed dragon follows as my enemy.',
      );
    }
    if (game.flags.includes('c5-vaor-pact')) {
      truths.push(
        'Vaor and I carry the ember to the black stone gate to protect living people and expose what the Concord erased. Either of us may refuse its use. The pact ends only when the gate is safe and we both say the duty is complete.',
      );
    }
    return truths;
  }

  if (game.chapter === 6) {
    truths.push(
      'The old rulers hid that creating the Concord cut living people and histories away from Edrath.',
    );
    if (game.flags.includes('c5-freed-vaor')) {
      truths.push(
        'I carry an ember Vaor gave willingly. The freed dragon remains an independent ally.',
      );
    } else if (game.flags.includes('c5-took-ember-by-force')) {
      truths.push(
        'I took Vaor’s ember by force. It obeys me, and the freed dragon follows as an enemy.',
      );
    } else if (game.flags.includes('c5-vaor-pact')) {
      truths.push(
        'Vaor and I share the ember under agreed terms. Either of us may refuse its use, and the bond ends only when the gate is safe and both of us call the duty complete.',
      );
    }
    truths.push(
      'Kharad Vey is a travelling orc town built on twelve wheeled platforms. An ancestor storm wearing dead faces follows it.',
    );

    if (
      !['c6-steppe-road', 'c6-running-gate', 'c6-broken-axle'].includes(
        game.nodeId,
      )
    ) {
      truths.push(
        'Kharad Vey’s seasonal leaders answer to living clan decisions, not inherited Crown rule.',
      );
    }

    if (
      ![
        'c6-steppe-road',
        'c6-running-gate',
        'c6-broken-axle',
        'c6-first-duty',
        'c6-herd-duty',
        'c6-forge-duty',
        'c6-shrine-duty',
        'c6-ancestor-warning',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'An ancestor storm is using honoured dead voices to accuse me and issue commands to the living.',
      );
    }
    if (
      ![
        'c6-steppe-road',
        'c6-running-gate',
        'c6-broken-axle',
        'c6-first-duty',
      ].includes(game.nodeId) &&
      ![
        'c6-ilyra-entry',
        'c6-storm-trace',
        'c6-impossible-memory',
        'c6-red-moot',
        'c6-service-case',
        'c6-trial-case',
        'c6-oath-case',
        'c6-ancestor-coup',
        'c6-final-alliance',
      ].includes(game.nodeId) &&
      !game.nodeId.startsWith('c6-ending-')
    ) {
      truths.push(
        'Korran calls the black stone from my vision the Black Gate.',
      );
    }
    if (
      game.nodeId === 'c6-ilyra-entry' ||
      game.nodeId === 'c6-storm-trace' ||
      game.nodeId === 'c6-impossible-memory' ||
      game.nodeId === 'c6-red-moot' ||
      game.nodeId === 'c6-service-case' ||
      game.nodeId === 'c6-trial-case' ||
      game.nodeId === 'c6-oath-case' ||
      game.nodeId === 'c6-ancestor-coup' ||
      game.nodeId === 'c6-final-alliance' ||
      game.nodeId.startsWith('c6-ending-')
    ) {
      truths.push(
        'The Black Gate is opening beyond the steppe, while its nearest watch forts have gone dark.',
      );
    }
    if (
      game.nodeId === 'c6-red-moot' ||
      game.nodeId === 'c6-service-case' ||
      game.nodeId === 'c6-trial-case' ||
      game.nodeId === 'c6-oath-case' ||
      game.nodeId === 'c6-ancestor-coup' ||
      game.nodeId === 'c6-final-alliance' ||
      game.nodeId.startsWith('c6-ending-')
    ) {
      truths.push(
        'The ancestor storm receives knowledge after the people it resembles have died. The Unsea may be its source, but the test did not prove that every voice is conscious or genuine.',
      );
    }
    if (
      game.nodeId === 'c6-final-alliance' ||
      game.nodeId.startsWith('c6-ending-')
    ) {
      if (game.flags.includes('c6-sender-learned-ember')) {
        truths.push(
          'Vaor’s ember burned the shared command. Separate ancestor voices survived, and the hidden sender learned the feel of the ember.',
        );
      } else if (game.flags.includes('c6-sender-heard-living-leaders')) {
        truths.push(
          'Kharad Vey’s living vote drowned out the shared command. Separate voices survived, and the hidden sender heard the chosen leaders’ names.',
        );
      } else if (game.flags.includes('c6-oath-guards-steppe-shrines')) {
        truths.push(
          'My Oath removed ancestor voices from the vote while preserving their right to speak as witnesses at the shrines.',
        );
      } else if (game.flags.includes('c6-hidden-sender-marked')) {
        truths.push(
          'Ilyra turned the shared command toward its hidden sender. Voices still tied to that order vanished, while the independent voices remained.',
        );
      }
    }
    if (game.flags.includes('c6-voluntary-ember-disclosure')) {
      truths.push('I answered for the ember when the storm first accused me.');
    } else if (game.flags.includes('c6-delayed-ember-disclosure')) {
      truths.push(
        'I answered another urgent danger first, then gave Korran the full account of the ember before the Moot.',
      );
    } else if (game.flags.includes('c6-concealed-ember-theft')) {
      truths.push(
        'I deliberately refused to tell Korran that I took Vaor’s ember by force. The Moot will not grant fighters under that concealment.',
      );
    } else if (game.flags.includes('c6-refused-ember-disclosure')) {
      truths.push(
        'I explicitly refused to explain the ember’s origin. Kharad Vey may grant a road, but not military support.',
      );
    }
    if (game.flags.includes('c6-oath-recognised-red-moot')) {
      truths.push(
        'I swore that Kharad forces in any alliance I lead will remain under the Red Moot’s commanders.',
      );
    }
    if (game.flags.includes('c6-oath-crown-restitution')) {
      truths.push(
        'I swore to bring the Concord’s hidden victims before the Queen or oppose a throne that buries them again.',
      );
    }
    if (game.flags.includes('c6-oath-defends-refusal')) {
      truths.push(
        'I swore to defend the clans’ right to leave my cause after the Black Gate is safe.',
      );
    }
    if (game.flags.includes('c6-oath-honest-limit')) {
      truths.push(
        'My Moot Oath binds only my conduct: I must state my orders and claim no command the Moot did not grant.',
      );
    }
    if (game.flags.includes('c6-oath-investigate-unsea')) {
      truths.push(
        'I swore to investigate which ancestor voices are conscious without promising that every face is truly the dead.',
      );
    }
    if (game.flags.includes('c6-seed-scorched-by-horn')) {
      truths.push(
        game.flags.includes('c6-seed-critically-weakened')
          ? 'Lysara spent the scorched seed’s last wide signal. Only a short living thread remains.'
          : 'Lysara’s seed carried Korran’s horn through the storm and lost more of its living thread.',
      );
    }
    return truths;
  }

  if (game.chapter === 7) {
    truths.push(
      'The Crown March belongs to Asterra. Its soldiers serve the Queen, but Regent Malrec has lawful command while she is ill. Most believe his charges against me are true.',
    );
    if (
      game.flags.includes('c7-lio-prisoner') ||
      game.flags.includes('c7-lio-returned') ||
      game.flags.includes('c7-lio-joined') ||
      game.flags.includes('c7-lio-under-guard') ||
      !['c7-red-horizon', 'c7-break-town-line', 'c7-first-riders'].includes(
        game.nodeId,
      )
    ) {
      truths.push(
        'The Red Wind Hunt follows commands spoken in the voice of Marshal Evren, an Asterra officer who died nineteen years ago.',
      );
      truths.push(
        'The storm can copy spoken facts after a short delay. It cannot answer a fresh challenge before a second living officer creates the reply.',
      );
    }

    if (
      game.flags.includes('c7-copied-gate-diversion') ||
      game.flags.includes('c7-recorded-hale-last-seen-alive') ||
      game.flags.includes('c7-taught-dead-command-test') ||
      game.flags.includes('c7-lio-carries-orders') ||
      game.flags.includes('c7-rook-has-orders') ||
      ![
        'c7-red-horizon',
        'c7-break-town-line',
        'c7-first-riders',
        'c7-captured-soldier',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'Malrec moved the Crown March away from four Black Gate forts three weeks before I took Vaor’s ember. His promised replacements never arrived.',
      );
      truths.push(
        'Malrec’s written order moved the living army. A separate dead command is keeping it in the west. The two powers are cooperating, but they are not the same enemy.',
      );
    }
    if (game.flags.includes('c7-shared-obedience-memory'))
      truths.push(
        'Ilyra traced the dead command beyond the Black Gate, but the hidden sender learned one private failure from me.',
      );
    else if (
      game.flags.includes('c7-forced-vaor-battle-use') ||
      game.flags.includes('c7-vaor-approved-battle-use')
    )
      truths.push(
        'Vaor’s ember traced the dead command beyond the Black Gate, and the hidden sender learned the ember and its bearer.',
      );
    else if (
      game.flags.includes('c7-lio-refused-dead-command') ||
      game.flags.includes('c7-lio-refused-inside-army')
    )
      truths.push(
        'Lio’s willing refusal traced the dead command beyond the Black Gate. The hidden sender learned his voice, but gained no magical weapon.',
      );
    else if (game.flags.includes('c7-command-demanded-proof'))
      truths.push(
        'Ilyra traced only the edge of the command beyond the Black Gate. Her countermark preserved the safe western approach without exposing a private memory.',
      );
    if (
      game.flags.includes('c7-saved-both-burned-proof') &&
      !chapterSevenAuthenticatedCopyFlags.some((flag) =>
        game.flags.includes(flag),
      )
    )
      truths.push(
        'Malrec’s original Gate order burned during the final rescue. Survivor testimony remains, but the sealed legal proof is gone.',
      );
    else if (game.flags.includes('c7-saved-both-burned-proof'))
      truths.push(
        'Malrec’s original Gate order burned during the final rescue, but authenticated copies and witnesses still carry its dates.',
      );
    else if (game.flags.includes('c7-original-orders-safe'))
      truths.push('Malrec’s original sealed Gate order remains in my coat.');
    if (game.flags.includes('c7-gained-full-army')) {
      truths.push(
        'I turned the Crown March east under my command. A full army now follows me toward the Black Gate fort ring.',
      );
    }
    if (game.flags.includes('c7-gained-chosen-company')) {
      truths.push(
        'I took only the Crown soldiers who volunteered with open eyes. Teren leads the rest toward the Gate under his own command.',
      );
    }
    if (game.flags.includes('c7-gained-dangerous-reputation')) {
      truths.push(
        'I refused formal command. Teren leads the army toward the Gate on a separate road while my existing companions ride ahead.',
      );
    }
    return truths;
  }

  if (game.chapter === 8) {
    truths.push(
      'Eight forts surround the Black Gate. Their signal fires feed one buried chain, and all eight normally work together to keep the Gate shut.',
    );

    if (!['c8-gate-ring', 'c8-first-knock'].includes(game.nodeId)) {
      truths.push(
        'Fourth Fort holds the only remaining old garrison. Its soldiers are called the Futureless because each sold one specific promise they would make later. They can still think, choose, refuse, and protect people.',
      );
    }
    if (
      ![
        'c8-gate-ring',
        'c8-first-knock',
        'c8-force-deployment',
        'c8-inherited-countermeasure',
        'c8-occupied-fort',
        'c8-futureless-reveal',
      ].includes(game.nodeId)
    ) {
      truths.push(
        'The Crown hid seventeen yearly Gate openings and slowly removed witnesses, supplies, and three failing garrisons. Three weeks ago, Malrec pulled the field army from four more forts and sent no replacements, leaving only Fourth Fort occupied.',
      );
    }
    if (
      game.nodeId === 'c8-ash-offer' ||
      game.nodeId === 'c8-mara-watch' ||
      game.nodeId === 'c8-lysara-watch' ||
      game.nodeId === 'c8-quiet-watch' ||
      game.nodeId === 'c8-chain-plan' ||
      game.nodeId === 'c8-opening' ||
      game.nodeId === 'c8-wardens-route' ||
      game.nodeId === 'c8-compact-route' ||
      game.nodeId === 'c8-sacrifice-route' ||
      game.nodeId === 'c8-oath-ledger' ||
      game.nodeId === 'c8-embassy-terms' ||
      game.nodeId.startsWith('c8-ending-')
    ) {
      truths.push(
        'The Ash Compact is one devil faction, not the whole realm beyond the Gate. It opposes a forced invasion and offers white fire in exchange for a public peaceful embassy.',
      );
    }
    if (game.flags.includes('c8-united-wardens')) {
      truths.push(
        'I kept the Gate defence in mortal hands by uniting independent keepers across the eight forts.',
      );
    }
    if (game.flags.includes('c8-accepted-ash-compact')) {
      truths.push(
        'I accepted the Ash Compact’s white fire under public terms and granted safe passage to one peaceful embassy.',
      );
    }
    if (game.flags.includes('c8-sacrificed-first-fort')) {
      truths.push(
        'I sacrificed First Fort so its foundation and stored fire could strengthen the other seven.',
      );
    }
    if (
      game.nodeId === 'c8-embassy-terms' ||
      game.nodeId.startsWith('c8-ending-')
    ) {
      truths.push(
        'Vexa Ash leads the first open devil embassy and carries an unfinished claim prepared against my future before my first Oath. It has no price or agreement and owns nothing yet.',
      );
    }
    return truths;
  }

  truths.push(
    'The sealed route page did not match Caelan’s memory, and the attackers prepared for every route before he chose one.',
  );

  if (game.chapter >= 3) {
    truths.push(
      'Ordan’s soldiers belong to Asterra, the same kingdom Caelan serves. They are a covert royal detachment under his sealed orders, not a foreign army or the Queen’s whole force.',
    );
  }

  if (game.nodeId === 'c2-ledger' || game.flags.includes('c2-ledger-route')) {
    truths.push(
      'Maelin’s records connect Ordan to supplies and disguised royal soldiers prepared around the inn.',
    );
  }
  if (game.nodeId === 'c2-cellar' || game.flags.includes('c2-cellar-route')) {
    truths.push(
      'The attackers used a displaced coastal road and a hidden cellar entrance to reach Bellweather.',
    );
  }
  if (
    game.nodeId === 'c2-attacker' ||
    game.flags.includes('c2-attacker-route')
  ) {
    truths.push(
      'Garran identifies Ordan as the officer who paid for the attack and ordered the escort driven to Bellweather.',
    );
  }
  if (game.chapter >= 3 || pinRevealNodes.has(game.nodeId)) {
    truths.push(
      'Ordan lured Caelan and Lysara to Bellweather because their road authority and living magic could unlock the road pin.',
    );
  }
  if (
    game.chapter >= 3 ||
    ['c2-road-pin', 'c2-remove-pin', 'c2-last-testimony'].includes(game.nodeId)
  ) {
    truths.push(
      'A damaged road pin pulled distant road ends beside Bellweather Inn until Caelan drove it back into place.',
    );
  }
  if (
    courierRevealNodes.has(game.nodeId) ||
    game.completedChapters.includes(3)
  ) {
    truths.push(
      'Royal courier Ordan Vale arranged the Bellweather attack, forged Caelan’s later orders, and sent a corrupt Warden to impersonate him.',
    );
  }
  if (rennKnownNodes.has(game.nodeId) || game.completedChapters.includes(3)) {
    truths.push('The Warden in Caelan’s spare cloak was Captain Renn.');
  }
  if (
    game.nodeId === 'c3-world-nail' ||
    game.flags.includes('c3-target-ordan') ||
    game.flags.includes('c3-target-thief') ||
    game.flags.includes('c3-secured-return')
  ) {
    truths.push(
      'The iron is part of a World Nail that normally keeps distance stable across Edrath.',
    );
  }
  if (rookKnownNodes.has(game.nodeId) || game.chapter >= 5) {
    truths.push(
      'Rook Sable stole the fragment to copy the map hidden inside it, not to control the iron itself.',
    );
  }
  if (nineNailsKnownNodes.has(game.nodeId) || game.chapter >= 5) {
    truths.push(
      'The fragment belongs to the Nail of Distance and maps all nine World Nails. Bellweather and the Mileless Bridge used broken pieces of the same Nail.',
    );
  }
  if (
    game.nodeId === 'c4-duty' ||
    game.nodeId === 'c4-ending-arrest' ||
    game.nodeId === 'c4-ending-bargain' ||
    game.nodeId === 'c4-ending-trust' ||
    game.chapter >= 5
  ) {
    truths.push(
      'A genuine order from Regent Malrec Vale commands that the fragment be carried to Dragonspine, where the next Nail is active.',
    );
  }
  if (game.chapter === 5) {
    truths.push(
      'Cold fire from the damaged fire Nail steals warmth, follows living heat, and prevents Health from recovering while it burns nearby.',
    );
  }
  if (vaorKnownNodes.has(game.nodeId)) {
    truths.push(
      'Vaor is an ancient living dragon imprisoned beneath glass plates that preserve events from his own life.',
    );
  }
  if (orivaneKnownNodes.has(game.nodeId)) {
    truths.push(
      'Orivane willingly gave her heart to create the Concord, but rulers hid that some forming histories already held living people who would be cut away from Edrath.',
    );
  }
  if (game.flags.includes('c5-freed-vaor')) {
    truths.push(
      'Vaor is free, and Caelan carries an ember the dragon gave willingly.',
    );
  }
  if (game.flags.includes('c5-took-ember-by-force')) {
    truths.push(
      'Caelan took Vaor’s ember by force and left the freed dragon as an enemy.',
    );
  }
  if (game.flags.includes('c5-vaor-pact')) {
    truths.push(
      'Caelan and Vaor share the ember until the black stone gate is safe and both declare their duty complete. Either bearer may refuse a use of the ember.',
    );
  }
  return truths;
}

export function majorConsequences(game: GameState) {
  const consequences: string[] = [];
  if (game.flags.includes('checked-people'))
    consequences.push(
      'Because you inspected your people, a feverish guard avoided the hardest part of the march.',
    );
  if (game.flags.includes('checked-horses'))
    consequences.push(
      'Because you checked the harness, the escort avoided a planned equipment failure.',
    );
  if (game.flags.includes('mara-read-order'))
    consequences.push(
      'Because you trusted Mara with the changed order, she found fresh sea salt trapped beneath its unbroken wax.',
    );
  if (game.flags.includes('low-route'))
    consequences.push(
      'Because you took the low road, the escort crossed the flooded fields and faced the collapse of Willow Bridge.',
    );
  if (game.flags.includes('ridge-route'))
    consequences.push(
      'Because you trusted Mara’s ridge, the escort gained height but faced the ambush exposed to the storm.',
    );
  if (game.flags.includes('inspection-route'))
    consequences.push(
      'Because you delayed for an inspection, the escort found sabotage before entering either road.',
    );
  if (game.flags.includes('saved-family'))
    consequences.push(
      'Because you rescued the roadside family, the farmer and two children reached the escort before the ambush.',
    );
  if (game.flags.includes('captured-attacker'))
    consequences.push(
      'Because you captured an attacker, the Crown plot gained a living witness.',
    );
  if (game.flags.includes('treaty-damaged'))
    consequences.push(
      'Because the treaty wagon was damaged, peace now depends more heavily on Lysara’s second proof.',
    );
  if (game.flags.includes('chose-silver-road'))
    consequences.push(
      'Because you followed the silver road beneath the water, the escort continued directly toward Bellweather.',
    );
  if (game.flags.includes('chose-high-ground'))
    consequences.push(
      'Because you chose high ground, the survivors gained a defensible camp and a clear view of the folded road.',
    );
  if (game.flags.includes('oath-bring-them-home'))
    consequences.push(
      'Because you swore to bring everyone home, that duty now carries magical power and a binding cost.',
    );
  if (game.flags.includes('c2-saved-nilo'))
    consequences.push(
      'Because you used the medicine on Nilo, his injured leg can recover.',
    );
  if (game.flags.includes('c2-saved-lysara'))
    consequences.push(
      'Because you treated Lysara, her hand and her control of the seed’s living magic remain safe.',
    );
  if (game.flags.includes('c2-saved-attacker'))
    consequences.push(
      'Because you treated Garran, he can testify publicly that Ordan hired the attackers.',
    );
  if (game.flags.includes('c2-ledger-route'))
    consequences.push(
      'Because you read Maelin’s ledger, you connected Ordan to the supplies used in the siege.',
    );
  if (game.flags.includes('c2-cellar-route'))
    consequences.push(
      'Because you inspected the cellar, you found the enemy rope and the shifted coastal road before the siege.',
    );
  if (game.flags.includes('c2-attacker-route'))
    consequences.push(
      'Because you questioned Garran, you connected the road pin to sealed Crown orders.',
    );
  if (game.flags.includes('c2-wagon-axle-lost'))
    consequences.push(
      "Because you used Tivik's locking mark, the broken wagon axle seated the pin without injuring you or damaging the treaty.",
    );
  if (game.flags.includes('c2-wagon-lost'))
    consequences.push(
      'Because you used the unmarked wagon method, the supply wagon and some of its cargo remained at Bellweather.',
    );
  if (
    game.flags.includes('c2-pin-broken') &&
    !game.flags.includes('c2-wagon-axle-lost') &&
    !game.flags.includes('c2-wagon-lost')
  ) {
    consequences.push(
      'Because you used the wagon method, the rear supply wagon remained at Bellweather after the road pin was seated.',
    );
  }
  if (game.flags.includes('c2-chose-testimony'))
    consequences.push(
      'Because you carried testimony to Harrowfen, Garran or Jory’s papers challenged Ordan before the gate.',
    );
  if (game.flags.includes('c2-chose-pin'))
    consequences.push(
      'Because you carried the iron as your main proof, its pull exposed the danger beneath Harrowfen.',
    );
  if (game.flags.includes('c2-oath-expose-crown'))
    consequences.push(
      'Because you swore publicly against the Crown plot, Elene could test your promise at Harrowfen’s gate.',
    );
  if (game.flags.includes('c3-saved-healing-house'))
    consequences.push(
      'Because you stayed behind, Harrowfen’s wounded escaped the burning healing house.',
    );
  if (game.flags.includes('c3-kept-close'))
    consequences.push(
      'Because you continued the chase, Ordan reached the bridge with less time to hide his trail.',
    );
  if (game.flags.includes('c3-bridge-warning'))
    consequences.push(
      'Because you questioned Renn, you know the unknown thief opposes Ordan but wants the iron for himself.',
    );
  if (game.flags.includes('c3-routed-ordan-plan'))
    consequences.push(
      'Because you forced Renn to reveal Ordan’s plan, you know where the fragment must be joined to the larger shard.',
    );
  if (game.flags.includes('c3-caught-clerk'))
    consequences.push(
      'Because you caught the archive burner, Ordan’s signed request, payment page, and a living prisoner reached Lantern Bridge.',
    );
  if (game.flags.includes('c3-bridge-record'))
    consequences.push(
      'Because you protected the papers first, Lysara copied Ordan’s route request and royal payment line before the archive burner escaped.',
    );
  if (game.flags.includes('c3-lysara-read-ink'))
    consequences.push(
      'Because you trusted Lysara’s living magic, Ordan’s signature and payment figures survived the archive fire.',
    );
  if (game.flags.includes('c3-sable-identified-guard'))
    consequences.push(
      'Because you shielded Garran, he identified the guard Mara captured in the healing house.',
    );
  if (game.flags.includes('c3-secured-healer'))
    consequences.push(
      'Because you held the healing house door, every patient survived and Iven witnessed Ordan watching the attack.',
    );
  if (game.flags.includes('c3-canal-defence'))
    consequences.push(
      'Because you divided the guard line, both threatened rooms stayed safe and one attacker was captured.',
    );
  if (game.flags.includes('c3-tested-door'))
    consequences.push(
      'Because you forced Varris past his tricks, he revealed the true brass map of the Mileless Bridge.',
    );
  if (game.flags.includes('c3-unmasked-varris'))
    consequences.push(
      'Because you seized Varris’s killer, you recovered Ordan’s murder order and a brass bridge key.',
    );
  if (game.flags.includes('c3-varris-map'))
    consequences.push(
      'Because you traded the iron wrapping, Varris gave you the bridge word and his attacker dropped Ordan’s signed threat.',
    );
  if (game.flags.includes('c3-saved-courier-boy'))
    consequences.push(
      'Because you stopped for the courier boy, he and his satchel survived the watch house fire.',
    );
  if (game.flags.includes('c3-priority-people'))
    consequences.push(
      'Because you chose immediate lives first, Mara knows exactly where your duty begins.',
    );
  if (game.flags.includes('c3-priority-cause'))
    consequences.push(
      'Because you chose the wider danger first, Lysara trusts you to face difficult truths.',
    );
  if (game.flags.includes('c3-balanced-plan'))
    consequences.push(
      'Because you joined protection and investigation, Mara and Lysara were ready when Harrowfen changed.',
    );
  if (game.flags.includes('c3-target-ordan'))
    consequences.push(
      'Because you targeted Ordan, the Crown courier must face you before reaching the thief.',
    );
  if (game.flags.includes('c3-target-thief'))
    consequences.push(
      'Because you targeted the thief, you reach for the fragment as the bridge breaks.',
    );
  if (game.flags.includes('c3-secured-return'))
    consequences.push(
      'Because you secured the first arch, your companions still have a path back to Harrowfen.',
    );
  if (game.flags.includes('c4-saved-brann'))
    consequences.push(
      'Because you reached Brann first, he survived the Bell Arch collapse with an injured knee.',
    );
  if (game.flags.includes('c4-saved-guards'))
    consequences.push(
      'Because you formed a human chain, both Harrowfen guards survived while Mara pulled the injured Brann clear.',
    );
  if (game.flags.includes('c4-held-collapse'))
    consequences.push(
      'Because your Oath held the Bell Arch together, Mara, Brann, and both Harrowfen guards crossed before it broke.',
    );
  if (game.flags.includes('c4-carried-brann'))
    consequences.push(
      'Because you carried Brann, he stayed with the group and gave you the bridge failure signal.',
    );
  if (game.flags.includes('c4-mara-escorted-brann'))
    consequences.push(
      'Because you sent Mara back, Brann reached Harrowfen safely while her temporary absence left one guard wounded.',
    );
  if (game.flags.includes('c4-captured-ordan'))
    consequences.push(
      'Because you rescued Ordan for trial, Mara returned him to Elene before the northward journey.',
    );
  if (game.flags.includes('c4-ordan-lower-road'))
    consequences.push(
      'Because you dropped Ordan onto a lower road, you kept his dispatch but lost the prisoner.',
    );
  if (game.flags.includes('c4-rook-full-copy'))
    consequences.push(
      'Because you allowed Rook to copy the map, he named his buyer’s meeting place and accepted a debt to you.',
    );
  if (game.flags.includes('c4-lysara-mapped-nine'))
    consequences.push(
      'Because Lysara recorded all nine marks, the full Nail map remains in her treaty book.',
    );
  if (game.flags.includes('c4-sensed-northern-nail'))
    consequences.push(
      'Because your Oath tested the map, you identified Dragonspine without giving Rook a full copy.',
    );
  if (game.flags.includes('c4-memorised-nine'))
    consequences.push(
      'Because you closed the fragment quickly, you protected the map but retained only a clear memory of its northern mark.',
    );
  if (game.flags.includes('c4-oath-honest-with-mara'))
    consequences.push(
      'Because you promised honesty to Mara, duty can no longer be your excuse for silence with her.',
    );
  if (game.flags.includes('c4-kissed-mara'))
    consequences.push(
      'Because you kissed Mara on the bridge, neither of you can call the attraction unspoken again.',
    );
  if (game.flags.includes('c4-lysara-private-truth'))
    consequences.push(
      'Because you gave Lysara the quiet minute, she revealed that her own family may share the buried guilt.',
    );
  if (game.flags.includes('c4-rook-arrested'))
    consequences.push(
      'Because you arrested Rook, he escaped the cuff, left a marked mirrored coin, and entered the Underways as a named fugitive.',
    );
  if (game.flags.includes('c4-rook-bargain'))
    consequences.push(
      'Because you bargained with Rook, he gave one spoken warning and a marked mirrored coin before following his buyer through the Underways.',
    );
  if (game.flags.includes('c4-rook-trusted'))
    consequences.push(
      'Because you trusted Rook, he left a silver knot around one wax route before choosing the Underways.',
    );
  if (game.flags.includes('c5-has-extraction-order'))
    consequences.push(
      'Because you recovered the Regent’s extraction order, you can prove the Crown intended to cut an ember from a living dragon.',
    );
  if (
    game.flags.includes('c5-diverted-patrol-with-seal') ||
    game.flags.includes('c5-rook-diverted-patrol')
  )
    consequences.push(
      'Because you used Hale’s seal, the returning royal patrol followed a false cold fire warning and lost your trail.',
    );
  if (game.flags.includes('c5-seed-scorched-river'))
    consequences.push(
      'Because Lysara used her living seed to divert the cold fire, her treaty magic is weakened.',
    );
  if (game.flags.includes('c5-admitted-future-with-lysara'))
    consequences.push(
      'Because you chose to know Lysara beyond the treaty, your attraction is no longer hidden behind diplomatic duty.',
    );
  if (game.flags.includes('c5-kissed-lysara'))
    consequences.push(
      'Because you and Lysara named what you wanted before kissing, the mountain changed your relationship by mutual choice.',
    );
  if (game.flags.includes('c5-protected-lysara-choice'))
    consequences.push(
      'Because you protected Lysara’s right to choose, she knows neither treaty nor attraction gives you a claim over her.',
    );
  if (game.flags.includes('c5-destroyed-royal-drill'))
    consequences.push(
      'Because you destroyed Hale’s extraction drill, the Crown cannot use that machine for another attempt.',
    );
  if (game.flags.includes('c5-royal-witnesses-turned'))
    consequences.push(
      'Because you turned Hale’s soldiers with evidence, four stayed to help the wounded and guard Hale while two carried testimony out of Dragonspine.',
    );
  if (
    game.flags.includes('c5-memory-copied-to-map-wax') ||
    game.flags.includes('c5-rook-copied-first-memory')
  )
    consequences.push(
      'Because you copied Orivane’s memory into map wax, the buried proof can survive even if the mountain glass is destroyed.',
    );
  if (game.flags.includes('c5-knows-orivane-renewal-wish'))
    consequences.push(
      'Because you stayed through Orivane’s final words, you can prove she wanted living people to judge the Concord again.',
    );
  if (game.flags.includes('c5-memorised-founder-seals'))
    consequences.push(
      'Because you memorised the founder seals, you can show that rulers from several peoples buried the Concord’s cost together.',
    );
  if (game.flags.includes('c5-saved-chosen-companion'))
    consequences.push(
      'Because you took the falling shelf, the person who treated your burn escaped unhurt and Sorin preserved the oldest memory plate.',
    );
  if (game.flags.includes('c5-saved-memory-witnesses'))
    consequences.push(
      'Because you led a moving shelter through the collapse, everyone escaped with three memory plates.',
    );
  if (game.flags.includes('c5-oath-held-memory-grave'))
    consequences.push(
      'Because your Oath held the gallery, everyone escaped and Sorin carried six memory plates out of the grave.',
    );
  if (
    game.flags.includes('c5-lost-royal-camp-proof') &&
    game.flags.includes('c5-has-extraction-order')
  )
    consequences.push(
      'Because you dropped the damaged gallery around Hale, his loose drill logs and copied camp records were lost. The extraction order already inside your coat survived.',
    );
  else if (game.flags.includes('c5-lost-royal-camp-proof'))
    consequences.push(
      'Because you dropped the damaged gallery around Hale, his loose drill logs and copied camp records were lost. Proof already inside a coat or pack survived.',
    );
  if (
    game.flags.includes('c5-seed-strained-memory') ||
    game.flags.includes('c5-lysara-reading-strain')
  )
    consequences.push(
      'Because Lysara used precision magic through strain, a crack remains in the glass seed and reduces its safe living thread.',
    );
  if (game.flags.includes('c5-repair-vaor-memory-duty'))
    consequences.push(
      'Because you destroyed one of Vaor’s memories, willing cooperation required a duty to preserve the memories that survived and tell the truth about the loss.',
    );
  if (game.flags.includes('c5-freed-vaor'))
    consequences.push(
      'Because you freed Vaor, an ancient dragon travels as a willing but independent ally.',
    );
  if (game.flags.includes('c5-took-ember-by-force'))
    consequences.push(
      'Because you took the ember by force, its power obeys you while Vaor follows as an enemy.',
    );
  if (game.flags.includes('c5-vaor-pact'))
    consequences.push(
      'Because you made a pact with Vaor, either bearer may refuse the ember’s use until the black stone gate is safe and both declare the shared duty complete.',
    );
  if (game.flags.includes('c6-forge-service-complete'))
    consequences.push(
      'Because you served in the brake forge, the wheelwrights saw whether you listened before using power.',
    );
  if (game.flags.includes('c6-shrine-service-complete'))
    consequences.push(
      'Because you protected the shrine children, the town saw you place living choice above a beloved dead voice.',
    );
  if (game.flags.includes('c6-admitted-concord-crime'))
    consequences.push(
      'Because you admitted the Concord’s hidden victims publicly, the storm could not use that truth as its private weapon.',
    );
  if (game.flags.includes('c6-delayed-ember-disclosure'))
    consequences.push(
      'Because you answered the immediate danger first and disclosed the ember later, Korran records a delay rather than a lie.',
    );
  if (game.flags.includes('c6-refused-ember-disclosure'))
    consequences.push(
      'Because you explicitly withheld the ember’s origin, the Red Moot will offer a road but no fighters.',
    );
  if (game.flags.includes('c6-concealed-ember-theft'))
    consequences.push(
      'Because you concealed Vaor’s refusal, Kharad Vey will not place lives under the stolen fire.',
    );
  if (game.flags.includes('c6-named-ilyra-manipulation'))
    consequences.push(
      'Because you named Ilyra’s public pressure, she now negotiates with you more openly.',
    );
  if (game.flags.includes('c6-ilyra-interest-acknowledged'))
    consequences.push(
      'Because you separated honest attraction from political need, mutual interest with Ilyra has begun without becoming a promise.',
    );
  if (game.flags.includes('c6-refused-ilyra-pressure'))
    consequences.push(
      'Because you refused Ilyra’s public pressure, she keeps the investigation useful without using flirtation to force agreement.',
    );
  if (game.flags.includes('c6-ilyra-professional-alliance'))
    consequences.push(
      'Because you placed Ilyra’s first test under local authority, the alliance remains professional and answerable to the Red Moot.',
    );
  if (game.flags.includes('c6-oath-investigate-unsea'))
    consequences.push(
      'Because you swore to investigate the ancestor voices, the steppe’s lost families now travel inside your duty.',
    );
  if (game.flags.includes('c6-oath-recognised-red-moot'))
    consequences.push(
      'Because your Oath recognises the Red Moot, future command cannot quietly turn its alliance into obedience.',
    );
  if (game.flags.includes('c6-oath-crown-restitution'))
    consequences.push(
      'Because you promised that the Crown would answer those it harmed, returning to Greyhaven may place your Oath against the throne.',
    );
  if (game.flags.includes('c6-oath-defends-refusal'))
    consequences.push(
      'Because you promised to defend the clans’ right to refuse, later command cannot trap them in your cause after the Gate is safe.',
    );
  if (game.flags.includes('c6-oath-honest-limit'))
    consequences.push(
      'Because you limited the Moot Oath to your own conduct, the promise is safer but cannot earn the whole town’s march.',
    );
  if (game.flags.includes('c6-seed-scorched-by-horn'))
    consequences.push(
      game.flags.includes('c6-seed-critically-weakened')
        ? 'Because Lysara carried Korran’s horn through an already damaged seed, only a short living thread remains for later magic.'
        : 'Because Lysara carried Korran’s horn through the storm, her living seed lost more of its future reach.',
    );
  if (game.flags.includes('c6-preserved-ancestor-voices'))
    consequences.push(
      'Because you broke the controlling command without silencing every voice, the town may still learn which ancestors are truly conscious.',
    );
  if (game.flags.includes('c6-red-moot-war'))
    consequences.push(
      'Because you asked Kharad Vey for war, the entire wheel town is moving toward the Black Gate.',
    );
  if (game.flags.includes('c6-red-moot-alliance'))
    consequences.push(
      'Because you asked for a guarded alliance, Korran leads volunteer riders beside your cause under the Moot’s authority.',
    );
  if (game.flags.includes('c6-red-moot-neutral'))
    consequences.push(
      'Because you accepted neutrality, Kharad Vey remains protected while its guides and witnesses support your road.',
    );
  if (game.flags.includes('c7-lio-joined'))
    consequences.push(
      'Because you let Lio choose openly, a Crown lieutenant stood beside you against the dead command.',
    );
  if (game.flags.includes('c7-lio-prisoner'))
    consequences.push(
      'Because you kept Lio as a lawful prisoner, his testimony remains evidence rather than forced allegiance.',
    );
  if (game.flags.includes('c7-lio-returned'))
    consequences.push(
      'Because you released Lio, doubt travelled through the Crown ranks from inside the army.',
    );
  if (game.flags.includes('c7-lio-under-guard'))
    consequences.push(
      'Because Lio offered evidence without joining you, he remains a protected witness under guard.',
    );
  if (game.flags.includes('c7-copied-gate-diversion'))
    consequences.push(
      'Because you preserved Malrec’s Gate order, the army saw that he emptied the forts before accusing you.',
    );
  if (game.flags.includes('c7-proof-rider-relay'))
    consequences.push(
      'Because five riders carried separate copies, no single capture can erase Malrec’s dated order.',
    );
  if (game.flags.includes('c7-orders-on-banners'))
    consequences.push(
      'Because the orders were copied onto banners, burning loose paper cannot hide the dates from the army.',
    );
  if (game.flags.includes('c7-front-rank-saw-original'))
    consequences.push(
      'Because only the front rank verified the original, most of the Crown March still relies on Teren’s judgment.',
    );
  if (game.flags.includes('c7-ally-lasting-injury'))
    consequences.push(
      'Because Command saved the broken company, the companion under the signal frame carries a lasting bone injury.',
    );
  if (game.flags.includes('c7-company-storm-losses'))
    consequences.push(
      'Because Caelan went to the trapped companion, the broken Crown company lost soldiers in the final red wall.',
    );
  if (game.flags.includes('c7-lost-gate-supplies'))
    consequences.push(
      'Because the supply wagon blocked the final charge, the fort road begins with less food and fewer arrows.',
    );
  if (game.flags.includes('c7-lost-fast-horses'))
    consequences.push(
      'Because the returning southern escort saved both groups, its exhausted horses could not continue to the Gate.',
    );
  if (
    game.flags.includes('c7-lio-named-deserter') ||
    game.flags.includes('c7-lio-stranded-after-rescue')
  )
    consequences.push(
      'Because Lio refused the dead command in public, Malrec’s law now calls him a deserter.',
    );
  if (game.flags.includes('c7-saved-many'))
    consequences.push(
      'Because you used Command to save the broken company, your trapped companion survived with a lasting injury.',
    );
  if (game.flags.includes('c7-saved-both-burned-proof'))
    consequences.push(
      'Because you burned Malrec’s original orders to shelter everyone, lives were saved but the strongest legal proof became ash.',
    );
  if (game.flags.includes('c7-saved-many-with-lio'))
    consequences.push(
      'Because Lio crossed the falling signal frame, both groups survived while he became a named deserter behind enemy lines.',
    );
  if (game.flags.includes('c7-saved-many-with-teren'))
    consequences.push(
      'Because Teren crossed the falling signal frame, both groups survived while his injured shoulder forced the army to share command.',
    );
  if (game.flags.includes('c7-gained-full-army'))
    consequences.push(
      'Because you accepted the Crown March, a full divided army now follows you toward the Black Gate.',
    );
  if (game.flags.includes('c7-gained-chosen-company'))
    consequences.push(
      'Because you asked for volunteers, a smaller company follows by choice rather than inherited rank.',
    );
  if (game.flags.includes('c7-gained-dangerous-reputation'))
    consequences.push(
      'Because you refused formal allies, your reputation now travels ahead of your small group.',
    );
  if (game.flags.includes('c8-pell-survived'))
    consequences.push(
      'Because you saved Pell, the escaped Warden identified the safe people and locks inside Fourth Fort.',
    );
  if (game.flags.includes('c8-oath-pell-sees-opening-contained'))
    consequences.push(
      game.nodeId === 'c8-embassy-terms' || game.nodeId.startsWith('c8-ending-')
        ? 'Because you personally kept the collector from following the bond to Pell, he saw the hostile opening contained and the Oath returned.'
        : 'Because you promised Pell would see the invasion stopped, the bond keeps him alive but lets a collector follow your Oath back to him. Ansel cannot face that claim for you.',
    );
  if (game.flags.includes('c8-pell-died-for-map'))
    consequences.push(
      'Because you preserved your resources, Pell spent his last breath drawing the complete safe lock route.',
    );
  if (game.flags.includes('c8-deployed-all-forts'))
    consequences.push(
      'Because you spread your force across all eight forts, the whole ring is watched but its smaller posts may be overwhelmed alone.',
    );
  if (game.flags.includes('c8-deployed-strongpoints'))
    consequences.push(
      'Because you concentrated defenders at the strongest forts, those positions can support one another while several walls remain empty.',
    );
  if (game.flags.includes('c8-deployed-mobile-force'))
    consequences.push(
      'Because you kept the main force mobile, it can answer one breaking wall together while most forts begin empty.',
    );
  if (game.flags.includes('c8-preserved-original-ledgers'))
    consequences.push(
      'Because you carried the opening ledgers through falling stone, seventeen years of original Crown proof survived.',
    );
  if (game.flags.includes('c8-living-copy-of-openings'))
    consequences.push(
      'Because Lysara copied the hidden opening dates, foreign courts can test the truth even though the Crown paper burned.',
    );
  if (game.flags.includes('c8-many-witnessed-openings'))
    consequences.push(
      'Because you called divided witnesses into the record room, no single stolen document can erase the hidden openings again.',
    );
  if (game.flags.includes('c8-linked-malrec-to-gate-record'))
    consequences.push(
      'Because you joined Malrec’s order to the hidden Gate reports, the evidence connects the final troop withdrawal to years of Crown concealment.',
    );
  if (game.flags.includes('c8-gate-forgery-exposed'))
    consequences.push(
      'Because you checked the fresh staffing ledger against Ansel’s duty board, Malrec’s prepared forgery failed in front of Crown officers.',
    );
  if (game.flags.includes('c8-saved-pell-packet'))
    consequences.push(
      'Because you carried Pell’s sealed packet from First Fort, a physical duplicate of the Crown reports survived while the fuel burned.',
    );
  if (game.flags.includes('c8-lost-duplicate-records'))
    consequences.push(
      'Because people left First Fort first, Pell’s sealed duplicate burned with the foundation.',
    );
  if (game.flags.includes('c8-depleted-mortal-defense'))
    consequences.push(
      'Because Chapter Seven supplies were lost, the mortal fort defence held without a reserve and left more keepers burned.',
    );
  if (game.flags.includes('c8-vaor-resisting-at-gate'))
    consequences.push(
      'Because Vaor’s stolen ember was forced again, the fort fires held while the dragon resisted inside every flame.',
    );
  if (game.flags.includes('c8-mara-knows-home-desire'))
    consequences.push(
      'Because you told Mara what home means to you without making an Oath, she knows what future the Gate may threaten.',
    );
  if (game.flags.includes('c8-lysara-knows-road-desire'))
    consequences.push(
      'Because you named a road with Lysara beyond both kingdoms, she knows what future the Gate may threaten.',
    );
  if (game.flags.includes('c8-living-seed-spent'))
    consequences.push(
      'Because Lysara’s weakened seed saved Pell and then lifted the buried chain, its treaty magic is now dormant.',
    );
  else if (game.flags.includes('c8-living-seed-weakened'))
    consequences.push(
      'Because the living seed lifted the chain, it can test only one new treaty line until it heals.',
    );
  if (game.flags.includes('c8-united-wardens'))
    consequences.push(
      'Because you united the wardens, the Black Gate remains under mortal control without a new contract or permanent gap.',
    );
  if (game.flags.includes('c8-accepted-ash-compact'))
    consequences.push(
      'Because you accepted the Ash Compact, white fire held every weak link and a peaceful embassy gained safe passage.',
    );
  if (game.flags.includes('c8-sacrificed-first-fort'))
    consequences.push(
      'Because you sacrificed First Fort, the other seven held while the fortress ring gained a permanent gap.',
    );
  if (game.flags.includes('c8-surrendered-homecoming'))
    consequences.push(
      'Because you surrendered the hope of returning unchanged, every active Oath survived the Gate’s test.',
    );
  if (game.flags.includes('c8-released-crown-oath'))
    consequences.push(
      'Because you released your Crown Oath, Asterra can no longer use that promise to command you.',
    );
  if (game.flags.includes('c8-burned-lesser-oath'))
    consequences.push(
      'Because you burned the promise tied to your Warden whistle, you may still answer calls by choice but no magic can drag you toward every call at once.',
    );
  if (game.flags.includes('c8-shared-oath-mara'))
    consequences.push(
      'Because Mara freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find her.',
    );
  if (game.flags.includes('c8-shared-oath-lysara'))
    consequences.push(
      'Because Lysara freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find her.',
    );
  if (game.flags.includes('c8-shared-oath-korran'))
    consequences.push(
      'Because Korran freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find him.',
    );
  if (game.flags.includes('c8-vexa-entered-publicly'))
    consequences.push(
      'Because you received Vexa publicly, the first devil embassy entered under the eyes of every force.',
    );
  if (game.flags.includes('c8-vexa-received-outer-fort'))
    consequences.push(
      'Because you honoured the Compact inside an isolated outer fort, the embassy entered as promised without reaching the wounded or lock rooms.',
    );
  if (game.flags.includes('c8-vexa-held-at-threshold'))
    consequences.push(
      'Because you held Vexa at the threshold, diplomacy began with one visible step between the two worlds.',
    );
  if (game.flags.includes('c8-ansel-spoke-first-after-entry'))
    consequences.push(
      'Because you honoured the Compact before Ansel spoke, the embassy entered and then answered the Futureless before rulers.',
    );
  else if (game.flags.includes('c8-ansel-spoke-first'))
    consequences.push(
      'Because Ansel asked the first question, Vexa remained outside while the embassy answered the Futureless before rulers.',
    );
  return consequences.length
    ? consequences
    : ['Your first lasting consequence has not been written yet.'];
}
