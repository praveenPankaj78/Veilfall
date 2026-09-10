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
    truths.push('I am leading Ambassador Lysara and a Warden escort toward Bellweather Inn.');
    if (pageKnownNodes.has(game.nodeId)) {
      truths.push('The route page inside my sealed case names the low road, although I remember sealing an order for the ridge.');
    }
    if (game.flags.includes('tested-case')) {
      truths.push('I found no sign of ordinary tampering on the case lock or wax.');
    }
    if (ambushKnownNodes.has(game.nodeId)) {
      truths.push('An organised force attacked us on the route I chose.');
    }
    if (game.flags.includes('confirmed-advance-orders')) {
      truths.push('The attackers received plans for every possible route before I made my decision.');
    }
    if (game.flags.includes('found-shard-salt')) {
      truths.push('I found fresh salt from the distant Shard Coast inside an ambush arrow.');
    }
    return truths;
  }

  if (game.chapter === 2) {
    truths.push('The sealed route page did not match my memory, and the attackers prepared for every route before I chose one.');

    if ([
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
    ].includes(game.nodeId)) {
      truths.push('A damaged road beneath Bellweather is pulling distant entrances beside the inn. It changes distance, not time.');
    }
    if (game.nodeId === 'c2-ledger' || game.flags.includes('c2-ledger-route')) {
      truths.push('Maelin’s records connect Ordan to supplies and disguised royal soldiers prepared around the inn.');
    }
    if (game.nodeId === 'c2-cellar' || game.flags.includes('c2-cellar-route')) {
      truths.push('I found the shifted coastal road and the hidden cellar entrance used by the attackers.');
    }
    if (game.nodeId === 'c2-attacker' || game.flags.includes('c2-attacker-route')) {
      truths.push('Garran identifies Ordan as the officer who paid for the attack and ordered us driven to Bellweather.');
    }
    if (pinRevealNodes.has(game.nodeId)) {
      truths.push('Ordan lured Lysara and me to Bellweather because my road authority and her living magic could unlock the road pin.');
    }
    if (game.nodeId === 'c2-road-pin' || game.nodeId === 'c2-remove-pin') {
      truths.push('The road pin normally keeps every road end in its proper place. I must drive it back into its socket.');
    } else if ([
      'c2-last-testimony',
      'c2-ending-testimony',
      'c2-ending-pin',
      'c2-ending-oath',
    ].includes(game.nodeId)) {
      truths.push('I drove the road pin back into place, but a broken piece still pulls toward Harrowfen.');
    } else if (game.flags.includes('c2-found-road-pin-term')) {
      truths.push('The enemy records call the buried iron beneath Bellweather a road pin.');
    }
    return truths;
  }

  if (game.chapter === 3) {
    truths.push('The sealed route page did not match my memory, and the attackers prepared for every route before I chose one.');
    truths.push('Ordan’s soldiers belong to Asterra, the kingdom I serve. They follow his covert royal orders, not the Queen’s public command.');
    truths.push('Ordan lured Lysara and me to Bellweather so our authority and living magic would unlock the road pin. I drove it back into place, but a fragment pulled us to Harrowfen.');
    if (courierRevealNodes.has(game.nodeId) || game.completedChapters.includes(3)) {
      truths.push('Ordan arranged the Bellweather attack, forged the later evidence against me, and paid Captain Renn to commit crimes in my cloak.');
    }
    if (game.flags.includes('c3-target-ordan')
      || game.flags.includes('c3-target-thief')
      || game.flags.includes('c3-secured-return')) {
      truths.push('The iron is part of a World Nail that normally keeps distance stable across Edrath.');
    }
    return truths;
  }

  if (game.chapter === 4) {
    truths.push('Ordan used a covert Asterra detachment to open Bellweather, frame me in Harrowfen, and place a secret royal force on the Mileless Bridge.');
    truths.push('The iron fragment comes from a World Nail that normally keeps distance stable across Edrath.');
    if (rookKnownNodes.has(game.nodeId)) {
      truths.push('Rook Sable stole the fragment to copy the map hidden inside it, not to control the iron itself.');
    }
    if (nineNailsKnownNodes.has(game.nodeId)) {
      truths.push('The fragment belongs to the Nail of Distance and maps all nine World Nails. Bellweather and the Mileless Bridge used broken pieces of the same Nail.');
    }
    if (game.nodeId === 'c4-ending-arrest'
      || game.nodeId === 'c4-ending-bargain'
      || game.nodeId === 'c4-ending-trust') {
      truths.push('A genuine order from Regent Malrec commands me to carry the fragment to Dragonspine, where another Nail is active.');
    }
    return truths;
  }

  if (game.chapter === 5) {
    truths.push('Ordan used a covert Asterra detachment to open Bellweather, frame me in Harrowfen, and place a secret royal force on the Mileless Bridge.');
    truths.push('Rook stole the Distance fragment to copy the map hidden inside it. That map marks all nine World Nails.');
    truths.push('A genuine order from Regent Malrec sent me to Dragonspine, where another Nail is active. His own private soldiers are already here.');

    if (game.nodeId !== 'c5-north-road') {
      truths.push('Cold fire from the damaged fire Nail steals warmth and follows living heat. My Health cannot recover while it burns nearby.');
    }
    if (vaorKnownNodes.has(game.nodeId)) {
      truths.push('Vaor was imprisoned beneath memory glass a century ago. Regent Malrec’s force reopened the grave two nights ago, clamped him again, and now intends to cut out his living ember.');
    }
    if (['c5-vaor-wakes', 'c5-vaor-test', 'c5-crown-assault', 'c5-heart-memory', 'c5-grave-collapse', 'c5-ember-choice', 'c5-ending-free', 'c5-ending-force', 'c5-ending-pact'].includes(game.nodeId)) {
      truths.push('The glass plates around Vaor preserve events he truly lived. They are memories, not alternate timelines.');
    }
    if (orivaneKnownNodes.has(game.nodeId)) {
      truths.push('Orivane willingly gave her living heart to create the Concord, but the rulers hid that living people would be cut away from Edrath.');
    }
    if (game.flags.includes('c5-freed-vaor')) {
      truths.push('I freed Vaor and carry an ember he gave willingly. He is an independent ally, not my weapon.');
    }
    if (game.flags.includes('c5-took-ember-by-force')) {
      truths.push('I took Vaor’s ember by force. Its power obeys me, and the freed dragon follows as my enemy.');
    }
    if (game.flags.includes('c5-vaor-pact')) {
      truths.push('I carry Vaor’s ember and voice through a pact with a clear shared end condition.');
    }
    return truths;
  }

  if (game.chapter === 6) {
    truths.push('The old rulers hid that creating the Concord cut living people and histories away from Edrath.');
    if (game.flags.includes('c5-freed-vaor')) {
      truths.push('I carry an ember Vaor gave willingly. The freed dragon remains an independent ally.');
    } else if (game.flags.includes('c5-took-ember-by-force')) {
      truths.push('I took Vaor’s ember by force. It obeys me, and the freed dragon follows as an enemy.');
    } else if (game.flags.includes('c5-vaor-pact')) {
      truths.push('I carry Vaor’s ember and voice through a pact with a clear shared end condition.');
    }
    truths.push('Kharad Vey is a moving orc town whose seasonal leaders answer to living clan decisions, not inherited Crown rule.');

    if (game.nodeId !== 'c6-steppe-road'
      && game.nodeId !== 'c6-running-gate'
      && game.nodeId !== 'c6-broken-axle'
      && game.nodeId !== 'c6-first-duty'
      && !['c6-herd-duty', 'c6-forge-duty', 'c6-shrine-duty'].includes(game.nodeId)) {
      truths.push('An ancestor storm is using honoured dead voices to accuse me and issue commands to the living.');
    }
    if (game.nodeId === 'c6-korran-terms'
      || game.nodeId === 'c6-ilyra-entry'
      || game.nodeId === 'c6-storm-trace'
      || game.nodeId === 'c6-impossible-memory'
      || game.nodeId === 'c6-red-moot'
      || game.nodeId === 'c6-service-case'
      || game.nodeId === 'c6-trial-case'
      || game.nodeId === 'c6-oath-case'
      || game.nodeId === 'c6-ancestor-coup'
      || game.nodeId === 'c6-final-alliance'
      || game.nodeId.startsWith('c6-ending-')) {
      truths.push('The Black Gate is opening beyond the steppe, while its nearest watch forts have gone dark.');
    }
    if (game.nodeId === 'c6-impossible-memory'
      || game.nodeId === 'c6-red-moot'
      || game.nodeId === 'c6-service-case'
      || game.nodeId === 'c6-trial-case'
      || game.nodeId === 'c6-oath-case'
      || game.nodeId === 'c6-ancestor-coup'
      || game.nodeId === 'c6-final-alliance'
      || game.nodeId.startsWith('c6-ending-')) {
      truths.push('The ancestor storm receives knowledge after the people it resembles have died. The Unsea may be its source, but the test did not prove that every voice is conscious or genuine.');
    }
    if (game.nodeId === 'c6-final-alliance' || game.nodeId.startsWith('c6-ending-')) {
      truths.push('The storm tried to replace the living Moot with one command. We broke that command without silencing every ancestor voice.');
    }
    return truths;
  }

  if (game.chapter === 7) {
    truths.push('The Crown March belongs to Asterra. Its soldiers serve the Queen, but Regent Malrec has lawful command while she is ill. Most believe his charges against me are true.');
    if (game.flags.includes('c7-lio-prisoner')
      || game.flags.includes('c7-lio-returned')
      || game.flags.includes('c7-lio-joined')
      || game.flags.includes('c7-lio-under-guard')
      || !['c7-red-horizon', 'c7-break-town-line', 'c7-first-riders'].includes(game.nodeId)) {
      truths.push('The Red Wind Hunt follows commands spoken in the voice of Marshal Evren, an Asterra officer who died nineteen years ago.');
    }

    if (game.flags.includes('c7-copied-gate-diversion')
      || game.flags.includes('c7-copied-false-charges')
      || game.flags.includes('c7-taught-dead-command-test')
      || game.flags.includes('c7-lio-carries-orders')
      || game.flags.includes('c7-rook-has-orders')
      || !['c7-red-horizon', 'c7-break-town-line', 'c7-first-riders', 'c7-captured-soldier'].includes(game.nodeId)) {
      truths.push('Malrec moved the Crown March away from four Black Gate forts three weeks before I took Vaor’s ember. His promised replacements never arrived.');
      truths.push('Malrec’s written order moved the living army. A separate dead command is keeping it in the west. The two powers are cooperating, but they are not the same enemy.');
    }
    if (game.flags.includes('c7-traced-hidden-sender')) {
      truths.push('Ilyra traced the dead command to a hidden will beyond the Black Gate. It now knows more about us because of the method I chose.');
    }
    if (game.flags.includes('c7-gained-full-army')) {
      truths.push('I turned the Crown March east under my command. A full army now follows me toward the Black Gate fort ring.');
    }
    if (game.flags.includes('c7-gained-chosen-company')) {
      truths.push('I took only the Crown soldiers who volunteered with open eyes. Teren leads the rest toward the Gate under his own command.');
    }
    if (game.flags.includes('c7-gained-dangerous-reputation')) {
      truths.push('I refused formal command. Teren leads the army toward the Gate on a separate road while my existing companions ride ahead.');
    }
    return truths;
  }

  if (game.chapter === 8) {
    truths.push('Eight forts surround the Black Gate. Their signal fires feed one buried chain, and all eight normally work together to keep the Gate shut.');

    if (game.nodeId !== 'c8-gate-ring') {
      truths.push('Fourth Fort holds the only remaining old garrison. Its soldiers are called the Futureless because each sold one specific promise they would make later. They can still think, choose, refuse, and protect people.');
    }
    if (!['c8-gate-ring', 'c8-first-knock', 'c8-force-deployment', 'c8-occupied-fort', 'c8-futureless-reveal'].includes(game.nodeId)) {
      truths.push('The Crown hid seventeen yearly Gate openings and slowly removed witnesses, supplies, and three failing garrisons. Three weeks ago, Malrec pulled the field army from four more forts and sent no replacements, leaving only Fourth Fort occupied.');
    }
    if (game.nodeId === 'c8-ash-offer'
      || game.nodeId === 'c8-mara-watch'
      || game.nodeId === 'c8-lysara-watch'
      || game.nodeId === 'c8-quiet-watch'
      || game.nodeId === 'c8-chain-plan'
      || game.nodeId === 'c8-opening'
      || game.nodeId === 'c8-wardens-route'
      || game.nodeId === 'c8-compact-route'
      || game.nodeId === 'c8-sacrifice-route'
      || game.nodeId === 'c8-oath-ledger'
      || game.nodeId === 'c8-embassy-terms'
      || game.nodeId.startsWith('c8-ending-')) {
      truths.push('The Ash Compact is one devil faction, not the whole realm beyond the Gate. It opposes a forced invasion and offers white fire in exchange for a public peaceful embassy.');
    }
    if (game.flags.includes('c8-united-wardens')) {
      truths.push('I kept the Gate defence in mortal hands by uniting independent keepers across the eight forts.');
    }
    if (game.flags.includes('c8-accepted-ash-compact')) {
      truths.push('I accepted the Ash Compact’s white fire under public terms and granted safe passage to one peaceful embassy.');
    }
    if (game.flags.includes('c8-sacrificed-first-fort')) {
      truths.push('I sacrificed First Fort so its foundation and stored fire could strengthen the other seven.');
    }
    if (game.nodeId === 'c8-embassy-terms' || game.nodeId.startsWith('c8-ending-')) {
      truths.push('Vexa Ash leads the first open devil embassy and carries an unfinished claim prepared against my future before my first Oath. It has no price or agreement and owns nothing yet.');
    }
    return truths;
  }

  truths.push('The sealed route page did not match Caelan’s memory, and the attackers prepared for every route before he chose one.');

  if (game.chapter >= 3) {
    truths.push('Ordan’s soldiers belong to Asterra, the same kingdom Caelan serves. They are a covert royal detachment under his sealed orders, not a foreign army or the Queen’s whole force.');
  }

  if (game.nodeId === 'c2-ledger' || game.flags.includes('c2-ledger-route')) {
    truths.push('Maelin’s records connect Ordan to supplies and disguised royal soldiers prepared around the inn.');
  }
  if (game.nodeId === 'c2-cellar' || game.flags.includes('c2-cellar-route')) {
    truths.push('The attackers used a displaced coastal road and a hidden cellar entrance to reach Bellweather.');
  }
  if (game.nodeId === 'c2-attacker' || game.flags.includes('c2-attacker-route')) {
    truths.push('Garran identifies Ordan as the officer who paid for the attack and ordered the escort driven to Bellweather.');
  }
  if (game.chapter >= 3 || pinRevealNodes.has(game.nodeId)) {
    truths.push('Ordan lured Caelan and Lysara to Bellweather because their road authority and living magic could unlock the road pin.');
  }
  if (game.chapter >= 3
    || game.flags.includes('c2-found-road-pin-term')
    || ['c2-road-pin', 'c2-remove-pin', 'c2-last-testimony'].includes(game.nodeId)) {
    truths.push('A damaged road pin pulled distant road ends beside Bellweather Inn until Caelan drove it back into place.');
  }
  if (courierRevealNodes.has(game.nodeId) || game.completedChapters.includes(3)) {
    truths.push('Royal courier Ordan Vale arranged the Bellweather attack, forged Caelan’s later orders, and hired a Warden to impersonate him.');
  }
  if (game.nodeId === 'c3-world-nail'
    || game.flags.includes('c3-target-ordan')
    || game.flags.includes('c3-target-thief')
    || game.flags.includes('c3-secured-return')) {
    truths.push('The iron is part of a World Nail that normally keeps distance stable across Edrath.');
  }
  if (rookKnownNodes.has(game.nodeId) || game.chapter >= 5) {
    truths.push('Rook Sable stole the fragment to copy the map hidden inside it, not to control the iron itself.');
  }
  if (nineNailsKnownNodes.has(game.nodeId) || game.chapter >= 5) {
    truths.push('The fragment belongs to the Nail of Distance and maps all nine World Nails. Bellweather and the Mileless Bridge used broken pieces of the same Nail.');
  }
  if (game.nodeId === 'c4-duty'
    || game.nodeId === 'c4-ending-arrest'
    || game.nodeId === 'c4-ending-bargain'
    || game.nodeId === 'c4-ending-trust'
    || game.chapter >= 5) {
    truths.push('A genuine order from Regent Malrec Vale commands that the fragment be carried to Dragonspine, where the next Nail is active.');
  }
  if (game.chapter === 5) {
    truths.push('Cold fire from the damaged fire Nail steals warmth, follows living heat, and prevents Health from recovering while it burns nearby.');
  }
  if (vaorKnownNodes.has(game.nodeId)) {
    truths.push('Vaor is an ancient living dragon imprisoned beneath glass plates that preserve events from his own life.');
  }
  if (orivaneKnownNodes.has(game.nodeId)) {
    truths.push('Orivane willingly gave her heart to create the Concord, but rulers hid that some forming histories already held living people who would be cut away from Edrath.');
  }
  if (game.flags.includes('c5-freed-vaor')) {
    truths.push('Vaor is free, and Caelan carries an ember the dragon gave willingly.');
  }
  if (game.flags.includes('c5-took-ember-by-force')) {
    truths.push('Caelan took Vaor’s ember by force and left the freed dragon as an enemy.');
  }
  if (game.flags.includes('c5-vaor-pact')) {
    truths.push('Caelan carries Vaor’s ember and voice through a pact with a clear shared end condition.');
  }
  return truths;
}

export function majorConsequences(game: GameState) {
  const consequences: string[] = [];
  if (game.flags.includes('checked-people')) consequences.push('Because you inspected your people, a feverish guard avoided the hardest part of the march.');
  if (game.flags.includes('checked-horses')) consequences.push('Because you checked the harness, the escort avoided a planned equipment failure.');
  if (game.flags.includes('mara-read-order')) consequences.push('Because you trusted Mara with the changed order, she found fresh sea salt trapped beneath its unbroken wax.');
  if (game.flags.includes('low-route')) consequences.push('Because you took the low road, the escort crossed the flooded fields and faced the collapse of Willow Bridge.');
  if (game.flags.includes('ridge-route')) consequences.push('Because you trusted Mara’s ridge, the escort gained height but faced the ambush exposed to the storm.');
  if (game.flags.includes('inspection-route')) consequences.push('Because you delayed for an inspection, the escort found sabotage before entering either road.');
  if (game.flags.includes('saved-family')) consequences.push('Because you rescued the roadside family, the farmer and two children reached the escort before the ambush.');
  if (game.flags.includes('captured-attacker')) consequences.push('Because you captured an attacker, the Crown plot gained a living witness.');
  if (game.flags.includes('treaty-damaged')) consequences.push('Because the treaty wagon was damaged, peace now depends more heavily on Lysara’s second proof.');
  if (game.flags.includes('chose-silver-road')) consequences.push('Because you followed the silver road beneath the water, the escort continued directly toward Bellweather.');
  if (game.flags.includes('chose-high-ground')) consequences.push('Because you chose high ground, the survivors gained a defensible camp and a clear view of the folded road.');
  if (game.flags.includes('oath-bring-them-home')) consequences.push('Because you swore to bring everyone home, that duty now carries magical power and a binding cost.');
  if (game.flags.includes('c2-saved-nilo')) consequences.push('Because you used the medicine on Nilo, his injured leg can recover.');
  if (game.flags.includes('c2-saved-lysara')) consequences.push('Because you treated Lysara, her hand, living magic, and treaty work remain safe.');
  if (game.flags.includes('c2-saved-attacker')) consequences.push('Because you treated Garran, he can testify publicly that Ordan hired the attackers.');
  if (game.flags.includes('c2-ledger-route')) consequences.push('Because you read Maelin’s ledger, you connected Ordan to the supplies used in the siege.');
  if (game.flags.includes('c2-cellar-route')) consequences.push('Because you inspected the cellar, you found the enemy rope and the shifted coastal road before the siege.');
  if (game.flags.includes('c2-attacker-route')) consequences.push('Because you questioned Garran, you connected the road pin to sealed Crown orders.');
  if (game.flags.includes('c2-pin-broken')) consequences.push('Because the road pin broke, part of its power remains beneath Bellweather Inn.');
  if (game.flags.includes('c2-chose-testimony')) consequences.push('Because you carried testimony to Harrowfen, Garran or Jory’s papers challenged Ordan before the gate.');
  if (game.flags.includes('c2-chose-pin')) consequences.push('Because you carried the iron as your main proof, its pull exposed the danger beneath Harrowfen.');
  if (game.flags.includes('c2-oath-expose-crown')) consequences.push('Because you swore publicly against the Crown plot, Elene could test your promise at Harrowfen’s gate.');
  if (game.flags.includes('c2-kissed-mara')) consequences.push('Because you and Mara chose to kiss, your attraction is no longer unspoken.');
  if (game.flags.includes('c2-mara-friendship')) consequences.push('Because you chose Mara as family and friend, that bond no longer waits for a romantic answer.');
  if (game.flags.includes('c3-saved-healing-house')) consequences.push('Because you stayed behind, Harrowfen’s wounded escaped the burning healing house.');
  if (game.flags.includes('c3-kept-close')) consequences.push('Because you continued the chase, Ordan reached the bridge with less time to hide his trail.');
  if (game.flags.includes('c3-bridge-warning')) consequences.push('Because you questioned Renn, you know the unknown thief opposes Ordan but wants the iron for himself.');
  if (game.flags.includes('c3-routed-ordan-plan')) consequences.push('Because you forced Renn to reveal Ordan’s plan, you know where the fragment must be joined to the larger shard.');
  if (game.flags.includes('c3-route-archive')) consequences.push('Because you searched the archive, Lysara copied Ordan’s route to the Mileless Bridge.');
  if (game.flags.includes('c3-route-healer')) consequences.push('Because you put the wounded first, Garran survived to identify Ordan’s personal guard.');
  if (game.flags.includes('c3-route-broker')) consequences.push('Because you tested the road broker, you learned how Ordan planned to open the Mileless Bridge.');
  if (game.flags.includes('c3-priority-people')) consequences.push('Because you chose immediate lives first, Mara knows exactly where your duty begins.');
  if (game.flags.includes('c3-priority-cause')) consequences.push('Because you chose the wider danger first, Lysara trusts you to face difficult truths.');
  if (game.flags.includes('c3-balanced-plan')) consequences.push('Because you joined protection and investigation, Mara and Lysara were ready when Harrowfen changed.');
  if (game.flags.includes('c3-target-ordan')) consequences.push('Because you targeted Ordan, the Crown courier must face you before reaching the thief.');
  if (game.flags.includes('c3-target-thief')) consequences.push('Because you targeted the thief, you reach for the fragment as the bridge breaks.');
  if (game.flags.includes('c3-secured-return')) consequences.push('Because you secured the first arch, your companions still have a path back to Harrowfen.');
  if (game.flags.includes('c4-saved-brann')) consequences.push('Because you pulled Brann from the collapsing arch, he remains beside the escort despite your injuries.');
  if (game.flags.includes('c4-held-collapse')) consequences.push('Because your Oath held the Bell Arch together, every companion crossed before it broke.');
  if (game.flags.includes('c4-followed-rook-banner')) consequences.push('Because you trusted Rook’s hanging banner, everyone survived the first collapse without spending your strength.');
  if (game.flags.includes('c4-captured-ordan')) consequences.push('Because you rescued Ordan for trial, the Crown conspiracy still has a living witness.');
  if (game.flags.includes('c4-ordan-lower-road')) consequences.push('Because you dropped Ordan onto a lower road, you kept his dispatch but lost the prisoner.');
  if (game.flags.includes('c4-rook-full-copy')) consequences.push('Because you allowed Rook to copy the map, he named his buyer’s meeting place and accepted a debt to you.');
  if (game.flags.includes('c4-fragment-recovered')) consequences.push('Because you recovered the real fragment from Rook, the Nail map and its power remain in your hands.');
  if (game.flags.includes('c4-oath-honest-with-mara')) consequences.push('Because you promised honesty to Mara, duty can no longer be your excuse for silence with her.');
  if (game.flags.includes('c4-kissed-mara')) consequences.push('Because you kissed Mara on the bridge, neither of you can call the attraction unspoken again.');
  if (game.flags.includes('c4-lysara-private-truth')) consequences.push('Because you gave Lysara the quiet minute, she revealed that her own family may share the buried guilt.');
  if (game.flags.includes('c4-lysara-interest-named')) consequences.push('Because you named your concern for Lysara as personal, neither of you has to hide that interest behind the treaty.');
  if (game.flags.includes('c4-platonic-mara') && game.flags.includes('c4-platonic-lysara')) consequences.push('Because you chose friendship with Mara and Lysara, neither woman is left waiting for a romance you do not want.');
  if (game.flags.includes('c4-lost-gear-and-proof')) consequences.push('Because you sacrificed gear and documents at the final anchor, everyone escaped but some proof against the Crown was lost.');
  if (game.flags.includes('c4-rook-arrested')) consequences.push('Because you arrested Rook, he entered the Underways as a named fugitive after escaping the cuff.');
  if (game.flags.includes('c4-rook-bargain')) consequences.push('Because you bargained with Rook, he is following his buyer’s trail through the Underways while you travel north.');
  if (game.flags.includes('c4-rook-trusted')) consequences.push('Because you trusted Rook with the survivors, he showed you a safe northern turn before taking his own road into the Underways.');
  if (game.flags.includes('c5-has-extraction-order')) consequences.push('Because you recovered the Regent’s extraction order, you can prove the Crown intended to cut an ember from a living dragon.');
  if (game.flags.includes('c5-diverted-patrol-with-seal') || game.flags.includes('c5-rook-diverted-patrol')) consequences.push('Because you used Hale’s seal, the returning royal patrol followed a false cold fire warning and lost your trail.');
  if (game.flags.includes('c5-seed-scorched-river')) consequences.push('Because Lysara used her living seed to divert the cold fire, her treaty magic is weakened.');
  if (game.flags.includes('c5-admitted-future-with-mara')) consequences.push('Because you told Mara you want a life that includes her, your future together is no longer hidden behind duty.');
  if (game.flags.includes('c5-kissed-mara')) consequences.push('Because you and Mara named what you wanted before kissing, the mountain changed your relationship by mutual choice.');
  if (game.flags.includes('c5-mara-friendship')) consequences.push('Because you chose friendship with Mara, your oldest bond has a clear future without romantic expectation.');
  if (game.flags.includes('c5-admitted-future-with-lysara')) consequences.push('Because you chose to know Lysara beyond the treaty, your attraction is no longer hidden behind diplomatic duty.');
  if (game.flags.includes('c5-kissed-lysara')) consequences.push('Because you and Lysara named what you wanted before kissing, the mountain changed your relationship by mutual choice.');
  if (game.flags.includes('c5-lysara-friendship')) consequences.push('Because you chose friendship with Lysara, political trust can deepen without romantic expectation.');
  if (game.flags.includes('c5-protected-lysara-choice')) consequences.push('Because you protected Lysara’s right to choose, she knows neither treaty nor attraction gives you a claim over her.');
  if (game.flags.includes('c5-oath-carry-vaor-grief')) consequences.push('Because you promised to hear Vaor’s grief, part of the dragon’s pain now travels through your Oathfire.');
  if (game.flags.includes('c5-royal-witnesses-turned')) consequences.push('Because you turned Hale’s soldiers with evidence, royal witnesses carry the truth away from Dragonspine.');
  if (game.flags.includes('c5-memory-copied-to-map-wax') || game.flags.includes('c5-rook-copied-first-memory')) consequences.push('Because you copied Orivane’s memory into map wax, the buried proof can survive even if the mountain glass is destroyed.');
  if (game.flags.includes('c5-freed-vaor')) consequences.push('Because you freed Vaor, an ancient dragon travels as a willing but independent ally.');
  if (game.flags.includes('c5-kingdoms-fear-vaor')) consequences.push('Because Vaor escaped in full view of the royal camp, warning horns now carry your part in releasing him across the border kingdoms.');
  if (game.flags.includes('c5-took-ember-by-force')) consequences.push('Because you took the ember by force, its power obeys you while Vaor follows as an enemy.');
  if (game.flags.includes('c5-vaor-pact')) consequences.push('Because you made a pact with Vaor, his voice, grief, and fire now travel inside you.');
  if (game.flags.includes('c6-saved-lift-siblings')) consequences.push('Because you saved the western lift handlers, Kharad Vey judged your actions before your Crown badge.');
  if (game.flags.includes('c6-herd-service-complete')) consequences.push('Because you served beside the herders, their clan carried your actions into the Red Moot.');
  if (game.flags.includes('c6-forge-service-complete')) consequences.push('Because you served in the brake forge, the wheelwrights saw whether you listened before using power.');
  if (game.flags.includes('c6-shrine-service-complete')) consequences.push('Because you protected the shrine children, the town saw you place living choice above a beloved dead voice.');
  if (game.flags.includes('c6-admitted-concord-crime')) consequences.push('Because you admitted the Concord’s hidden victims publicly, the storm could not use that truth as its private weapon.');
  if (game.flags.includes('c6-declared-willing-ember')) consequences.push('Because you told Kharad Vey that Vaor freely gave the ember, the town judged the gift instead of the storm’s accusation.');
  if (game.flags.includes('c6-admitted-ember-theft')) consequences.push('Because you admitted taking Vaor’s ember against his will, Kharad Vey knows the truth even though it has not forgiven the act.');
  if (game.flags.includes('c6-declared-pact-ember')) consequences.push('Because you revealed Vaor’s willing pact, the town knows the second presence inside you is an ally with his own will.');
  if (game.flags.includes('c6-named-ilyra-manipulation')) consequences.push('Because you named Ilyra’s public pressure, she now negotiates with you more openly.');
  if (game.flags.includes('c6-ilyra-interest-acknowledged')) consequences.push('Because you separated honest attraction from political need, mutual interest with Ilyra has begun without becoming a promise.');
  if (game.flags.includes('c6-oath-investigate-unsea')) consequences.push('Because you swore to investigate the ancestor voices, the steppe’s lost families now travel inside your duty.');
  if (game.flags.includes('c6-oath-recognised-red-moot')) consequences.push('Because your Oath recognises the Red Moot, future command cannot quietly turn its alliance into obedience.');
  if (game.flags.includes('c6-oath-crown-restitution')) consequences.push('Because you promised that the Crown would answer those it harmed, returning to Greyhaven may place your Oath against the throne.');
  if (game.flags.includes('c6-preserved-ancestor-voices')) consequences.push('Because you broke the controlling command without silencing every voice, the town may still learn which ancestors are truly conscious.');
  if (game.flags.includes('c6-red-moot-war')) consequences.push('Because you asked Kharad Vey for war, the entire wheel town is moving toward the Black Gate.');
  if (game.flags.includes('c6-red-moot-alliance')) consequences.push('Because you asked for a guarded alliance, Korran leads volunteer riders beside your cause under the Moot’s authority.');
  if (game.flags.includes('c6-red-moot-neutral')) consequences.push('Because you accepted neutrality, Kharad Vey remains protected while its guides and witnesses support your road.');
  if (game.flags.includes('c7-lio-joined')) consequences.push('Because you let Lio choose openly, a Crown lieutenant stood beside you against the dead command.');
  if (game.flags.includes('c7-lio-prisoner')) consequences.push('Because you kept Lio as a lawful prisoner, his testimony remains evidence rather than forced allegiance.');
  if (game.flags.includes('c7-lio-returned')) consequences.push('Because you released Lio, doubt travelled through the Crown ranks from inside the army.');
  if (game.flags.includes('c7-lio-under-guard')) consequences.push('Because Lio offered evidence without joining you, he remains a protected witness under guard.');
  if (game.flags.includes('c7-copied-gate-diversion')) consequences.push('Because you preserved Malrec’s Gate order, the army saw that he emptied the forts before accusing you.');
  if (game.flags.includes('c7-traced-hidden-sender')) consequences.push('Because you traced the dead command, you know a separate power beyond the Black Gate is helping keep Asterra’s army west.');
  if (game.flags.includes('c7-mara-chosen-future')) consequences.push('Because you promised Mara a shared future as an equal, danger no longer leaves her waiting outside your plans.');
  if (game.flags.includes('c7-mara-romance-ended')) consequences.push('Because you ended the romance honestly, Mara remains your Warden without carrying a false promise.');
  if (game.flags.includes('c7-lysara-chosen-future')) consequences.push('Because you chose partnership with Lysara, your bond now allows two loyalties and honest disagreement.');
  if (game.flags.includes('c7-lysara-romance-ended')) consequences.push('Because you ended the romance honestly, Lysara remains your ally without an unspoken personal claim.');
  if (game.flags.includes('c7-ilyra-bond-deepened')) consequences.push('Because you and Ilyra chose desire without ownership or leverage, your attraction has become an openly explored bond.');
  if (game.flags.includes('c7-ilyra-friendship-chosen')) consequences.push('Because you set a clear boundary with Ilyra, your alliance continues without romantic expectation.');
  if (game.flags.includes('c7-chose-salt-trap')) consequences.push('Because you chose the Salt Basin trap, the Crown March remembers your restraint and its own defeat.');
  if (game.flags.includes('c7-chose-order-exposure')) consequences.push('Because you exposed Malrec’s orders rank by rank, soldiers turned through their own judgment.');
  if (game.flags.includes('c7-chose-steppe-duel')) consequences.push('Because you accepted steppe law, one public duel ended a battle between two armies.');
  if (game.flags.includes('c7-saved-many')) consequences.push('Because you used Command to save the broken company, your trapped companion survived with a lasting injury.');
  if (game.flags.includes('c7-saved-one')) consequences.push('Because you personally saved one companion, the broken company suffered losses in the final red storm.');
  if (game.flags.includes('c7-saved-both-burned-proof')) consequences.push('Because you burned Malrec’s original orders to shelter everyone, lives were saved but the strongest legal proof became ash.');
  if (game.flags.includes('c7-saved-many-with-lio')) consequences.push('Because Lio crossed the falling signal frame, both groups survived while he became a named deserter behind enemy lines.');
  if (game.flags.includes('c7-saved-many-with-teren')) consequences.push('Because Teren crossed the falling signal frame, both groups survived while his injured shoulder forced the army to share command.');
  if (game.flags.includes('c7-gained-full-army')) consequences.push('Because you accepted the Crown March, a full divided army now follows you toward the Black Gate.');
  if (game.flags.includes('c7-gained-chosen-company')) consequences.push('Because you asked for volunteers, a smaller company follows by choice rather than inherited rank.');
  if (game.flags.includes('c7-gained-dangerous-reputation')) consequences.push('Because you refused formal allies, your reputation now travels ahead of your small group.');
  if (game.flags.includes('c8-pell-survived')) consequences.push('Because you saved Pell, the escaped Warden identified the safe people and locks inside Fourth Fort.');
  if (game.flags.includes('c8-oath-pell-sees-opening-contained')) consequences.push('Because you promised Pell would see the invasion stopped, the fulfilled Oath returned when the hostile opening was contained.');
  if (game.flags.includes('c8-pell-died-for-map')) consequences.push('Because you preserved your resources, Pell spent his last breath drawing the complete safe lock route.');
  if (game.flags.includes('c8-deployed-all-forts') || game.flags.includes('c8-deployed-full-march')) consequences.push('Because you spread your force across all eight forts, the whole ring is watched but its smaller posts may be overwhelmed alone.');
  if (game.flags.includes('c8-deployed-strongpoints') || game.flags.includes('c8-deployed-volunteers')) consequences.push('Because you concentrated defenders at the strongest forts, those positions can support one another while several walls remain empty.');
  if (game.flags.includes('c8-deployed-mobile-force') || game.flags.includes('c8-deployed-mobile-teams')) consequences.push('Because you kept the main force mobile, it can answer one breaking wall together while most forts begin empty.');
  if (game.flags.includes('c8-preserved-original-ledgers')) consequences.push('Because you carried the opening ledgers through falling stone, seventeen years of original Crown proof survived.');
  if (game.flags.includes('c8-living-copy-of-openings')) consequences.push('Because Lysara copied the hidden opening dates, foreign courts can test the truth even though the Crown paper burned.');
  if (game.flags.includes('c8-many-witnessed-openings')) consequences.push('Because you called divided witnesses into the record room, no single stolen document can erase the hidden openings again.');
  if (game.flags.includes('c8-mara-knows-home-desire')) consequences.push('Because you told Mara what home means to you without making an Oath, she knows what future the Gate may threaten.');
  if (game.flags.includes('c8-lysara-knows-road-desire')) consequences.push('Because you named a road with Lysara beyond both kingdoms, she knows what future the Gate may threaten.');
  if (game.flags.includes('c8-living-seed-spent')) consequences.push('Because Lysara’s weakened seed saved Pell and then lifted the buried chain, its treaty magic is now dormant.');
  if (game.flags.includes('c8-united-wardens')) consequences.push('Because you united the wardens, the Black Gate remains under mortal control without a new contract or permanent gap.');
  if (game.flags.includes('c8-accepted-ash-compact')) consequences.push('Because you accepted the Ash Compact, white fire held every weak link and a peaceful embassy gained safe passage.');
  if (game.flags.includes('c8-sacrificed-first-fort')) consequences.push('Because you sacrificed First Fort, the other seven held while the fortress ring gained a permanent gap.');
  if (game.flags.includes('c8-surrendered-homecoming')) consequences.push('Because you surrendered the hope of returning unchanged, every active Oath survived the Gate’s test.');
  if (game.flags.includes('c8-released-crown-oath')) consequences.push('Because you released your Crown Oath, Asterra can no longer use that promise to command you.');
  if (game.flags.includes('c8-burned-lesser-oath')) consequences.push('Because you burned the promise tied to your Warden whistle, you may still answer calls by choice but no magic can drag you toward every call at once.');
  if (game.flags.includes('c8-shared-oath-mara')) consequences.push('Because Mara freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find her.');
  if (game.flags.includes('c8-shared-oath-lysara')) consequences.push('Because Lysara freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find her.');
  if (game.flags.includes('c8-shared-oath-korran')) consequences.push('Because Korran freely shared your Oath burden, every promise survived while the Gate gained a mark it may use to find him.');
  if (game.flags.includes('c8-shared-oath-burden')
    && !game.flags.some((flag) => ['c8-shared-oath-mara', 'c8-shared-oath-lysara', 'c8-shared-oath-korran'].includes(flag))) {
    consequences.push('Because a willing companion shared your burden, every promise survived while the Gate gained a mark it may find again.');
  }
  if (game.flags.includes('c8-vexa-entered-publicly')) consequences.push('Because you received Vexa publicly, the first devil embassy entered under the eyes of every force.');
  if (game.flags.includes('c8-vexa-received-outer-fort')) consequences.push('Because you honoured the Compact inside an isolated outer fort, the embassy entered as promised without reaching the wounded or lock rooms.');
  if (game.flags.includes('c8-vexa-held-at-threshold')) consequences.push('Because you held Vexa at the threshold, diplomacy began with one visible step between the two worlds.');
  if (game.flags.includes('c8-ansel-spoke-first-after-entry')) consequences.push('Because you honoured the Compact before Ansel spoke, the embassy entered and then answered the Futureless before rulers.');
  else if (game.flags.includes('c8-ansel-spoke-first')) consequences.push('Because Ansel asked the first question, Vexa remained outside while the embassy answered the Futureless before rulers.');
  return consequences.length ? consequences : ['Your first lasting consequence has not been written yet.'];
}
