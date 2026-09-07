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

const roadRevealNodes = new Set([
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

  if (game.chapter >= 3 || roadRevealNodes.has(game.nodeId)) {
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
  if (game.flags.includes('c2-saved-attacker')) consequences.push('Because you treated Sable, he can testify publicly that Ordan hired the attackers.');
  if (game.flags.includes('c2-ledger-route')) consequences.push('Because you read Maelin’s ledger, you connected Ordan to the supplies used in the siege.');
  if (game.flags.includes('c2-cellar-route')) consequences.push('Because you inspected the cellar, you found the enemy rope and the shifted coastal road before the siege.');
  if (game.flags.includes('c2-attacker-route')) consequences.push('Because you questioned Sable, you connected the road pin to sealed Crown orders.');
  if (game.flags.includes('c2-pin-broken')) consequences.push('Because the road pin broke, part of its power remains beneath Bellweather Inn.');
  if (game.flags.includes('c2-chose-testimony')) consequences.push('Because you carried testimony to Harrowfen, Sable or Jory’s papers challenged Ordan before the gate.');
  if (game.flags.includes('c2-chose-pin')) consequences.push('Because you carried the iron as your main proof, its pull exposed the danger beneath Harrowfen.');
  if (game.flags.includes('c2-oath-expose-crown')) consequences.push('Because you swore publicly against the Crown plot, Elene could test your promise at Harrowfen’s gate.');
  if (game.flags.includes('c2-kissed-mara')) consequences.push('Because you and Mara chose to kiss, your attraction is no longer unspoken.');
  if (game.flags.includes('c3-saved-healing-house')) consequences.push('Because you stayed behind, Harrowfen’s wounded escaped the burning healing house.');
  if (game.flags.includes('c3-kept-close')) consequences.push('Because you continued the chase, Ordan reached the bridge with less time to hide his trail.');
  if (game.flags.includes('c3-bridge-warning')) consequences.push('Because you questioned Renn, you know the unknown thief opposes Ordan but wants the iron for himself.');
  if (game.flags.includes('c3-route-archive')) consequences.push('Because you searched the archive, Lysara copied Ordan’s route to the Mileless Bridge.');
  if (game.flags.includes('c3-route-healer')) consequences.push('Because you put the wounded first, Sable survived to identify Ordan’s personal guard.');
  if (game.flags.includes('c3-route-broker')) consequences.push('Because you tested the road broker, you learned how Ordan planned to open the Mileless Bridge.');
  if (game.flags.includes('c3-priority-people')) consequences.push('Because you chose immediate lives first, Mara knows exactly where your duty begins.');
  if (game.flags.includes('c3-priority-cause')) consequences.push('Because you chose the wider danger first, Lysara trusts you to face difficult truths.');
  if (game.flags.includes('c3-balanced-plan')) consequences.push('Because you joined protection and investigation, Mara and Lysara were ready when Harrowfen changed.');
  if (game.flags.includes('c3-target-ordan')) consequences.push('Because you targeted Ordan, the Crown courier must face you before reaching the thief.');
  if (game.flags.includes('c3-target-thief')) consequences.push('Because you targeted the thief, you reach for the fragment as the bridge breaks.');
  if (game.flags.includes('c3-secured-return')) consequences.push('Because you secured the first arch, your companions still have a path back to Harrowfen.');
  return consequences.length ? consequences : ['Your first lasting consequence has not been written yet.'];
}
