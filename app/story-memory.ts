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
  'c4-corner',
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

const vaorKnownNodes = new Set([
  'c5-memory-wall',
  'c5-mara-burns',
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
  'c5-heart-memory',
  'c5-grave-collapse',
  'c5-ember-choice',
  'c5-ending-free',
  'c5-ending-force',
  'c5-ending-pact',
]);

export function knownTruths(game: GameState) {
  const truths: string[] = [];

  if (game.chapter === 1) {
    truths.push('Caelan is leading Ambassador Lysara and a Warden escort toward Bellweather Inn.');
    if (pageKnownNodes.has(game.nodeId)) {
      truths.push('The route page inside Caelan’s sealed case names the low road, although he remembers sealing an order for the ridge.');
    }
    if (game.flags.includes('tested-case')) {
      truths.push('The case lock and wax show no sign of ordinary tampering.');
    }
    if (ambushKnownNodes.has(game.nodeId)) {
      truths.push('An organised force attacked the escort on the route Caelan chose.');
    }
    if (game.flags.includes('confirmed-advance-orders')) {
      truths.push('The attackers received plans for every possible route before Caelan made his decision.');
    }
    if (game.flags.includes('found-shard-salt')) {
      truths.push('The ambush arrows carried fresh salt from the distant Shard Coast.');
    }
    return truths;
  }

  truths.push('The sealed route page did not match Caelan’s memory, and the attackers prepared for every route before he chose one.');

  if (game.chapter >= 3) {
    truths.push('Ordan’s soldiers belong to Asterra, the same kingdom Caelan serves. They are a covert royal detachment under his sealed orders, not a foreign army or the Queen’s whole force.');
  }

  if (game.chapter === 2 && [
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
    truths.push('Orivane willingly gave her heart to power the Concord, but mortal rulers hid that a stable world would prevent many possible lives from ever beginning.');
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
  if (game.flags.includes('mara-read-order')) consequences.push('Because you trusted Mara with the changed order, she helped prove the page was physically altered.');
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
  if (game.flags.includes('c4-oath-honest-with-mara')) consequences.push('Because you promised honesty to Mara, duty can no longer be your excuse for silence with her.');
  if (game.flags.includes('c4-kissed-mara')) consequences.push('Because you kissed Mara on the bridge, neither of you can call the attraction unspoken again.');
  if (game.flags.includes('c4-lost-gear-and-proof')) consequences.push('Because you sacrificed gear and documents at the final anchor, everyone escaped but some proof against the Crown was lost.');
  if (game.flags.includes('c4-rook-arrested')) consequences.push('Because you arrested Rook, he travels north as a named fugitive even after escaping the cuff.');
  if (game.flags.includes('c4-rook-bargain')) consequences.push('Because you bargained with Rook, he will guide you toward his buyer in Dragonspine.');
  if (game.flags.includes('c4-rook-trusted')) consequences.push('Because you trusted Rook with the survivors, he showed you a safe road and accepted a personal debt.');
  if (game.flags.includes('c5-has-extraction-order')) consequences.push('Because you recovered the Regent’s extraction order, you can prove the Crown intended to cut an ember from a living dragon.');
  if (game.flags.includes('c5-rook-diverted-patrol')) consequences.push('Because you trusted Rook with a stolen seal, the returning royal patrol chased an embarrassing false emergency.');
  if (game.flags.includes('c5-seed-scorched-river')) consequences.push('Because Lysara used her living seed to divert the cold fire, her treaty magic is weakened.');
  if (game.flags.includes('c5-admitted-future-with-mara')) consequences.push('Because you told Mara you want a life that includes her, your future together is no longer hidden behind duty.');
  if (game.flags.includes('c5-kissed-mara')) consequences.push('Because you and Mara named what you wanted before kissing, the mountain changed your relationship by mutual choice.');
  if (game.flags.includes('c5-oath-carry-vaor-grief')) consequences.push('Because you promised to hear Vaor’s grief, part of the dragon’s pain now travels through your Oathfire.');
  if (game.flags.includes('c5-royal-witnesses-turned')) consequences.push('Because you turned Hale’s soldiers with evidence, royal witnesses carry the truth away from Dragonspine.');
  if (game.flags.includes('c5-rook-copied-first-memory')) consequences.push('Because Rook copied Orivane’s memory, the buried proof can survive even if the mountain glass is destroyed.');
  if (game.flags.includes('c5-freed-vaor')) consequences.push('Because you freed Vaor, an ancient dragon travels as a willing but independent ally.');
  if (game.flags.includes('c5-took-ember-by-force')) consequences.push('Because you took the ember by force, its power obeys you while Vaor follows as an enemy.');
  if (game.flags.includes('c5-vaor-pact')) consequences.push('Because you made a pact with Vaor, his voice, grief, and fire now travel inside you.');
  return consequences.length ? consequences : ['Your first lasting consequence has not been written yet.'];
}
