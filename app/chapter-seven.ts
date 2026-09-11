import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

function supportOpening(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'All twelve platforms of Kharad Vey are turning east with you. Korran keeps seasonal command, and Dema controls the steering decks under Moot law. Homes, herds, and children move on the same wheels as the weapons.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'Kharad Vey moves on a safer southern line under Dema’s seasonal command. Korran rides beside you with forty volunteers, six wind callers, and two shield engines chosen by the Red Moot. Crown scouts are cutting south, so your smaller force turns back at Black Ridge.';
  }
  return 'Kharad Vey keeps the neutral road you requested and turns south under Dema’s seasonal command. Korran serves as one of your three guides. Crown scouts follow the wheel tracks, so you double back with the ember and draw the pursuit toward Black Ridge.';
}

function steppePromises(state: GameState) {
  const promises: string[] = [];
  if (has(state, 'c6-oath-recognised-red-moot')) promises.push('Kharad forces remain under commanders chosen by the Red Moot');
  if (has(state, 'c6-oath-crown-restitution')) promises.push('you must bring the hidden Crown crime into public judgment');
  if (has(state, 'c6-oath-defends-refusal')) promises.push('you must defend the clans’ right to leave after the Gate is safe');
  if (has(state, 'c6-oath-honest-limit')) promises.push('you may claim only the command the Moot granted you');
  if (has(state, 'c6-oath-investigate-unsea')) promises.push('you must keep investigating the ancestor voices without calling uncertain copies real people');
  if (has(state, 'c6-broad-steppe-oath') && !promises.length) promises.push('an earlier promise still binds you to protect Kharad Vey and its living choices');
  if (!promises.length) return 'No public steppe Oath directs this battle, but the Red Moot’s chosen support still sets the limits of your command.';
  return `Your active steppe duties are plain: ${promises.join('; ')}. Breaking one must be a visible choice, not an accidental order.`;
}

function ilyraArrival(state: GameState) {
  if (has(state, 'c6-named-ilyra-manipulation')) return 'Ilyra rides with the storm map and states each Threadread test before she begins. She remembers that you named her public pressure.';
  if (has(state, 'c6-ilyra-interest-acknowledged')) return 'Ilyra rides with the storm map. The attraction between you remains acknowledged and gives neither of you permission or command.';
  if (has(state, 'c6-refused-ilyra-pressure')) return 'Ilyra rides with the storm map and keeps the distance you requested. Her evidence arrives without flirtation used as pressure.';
  return 'Ilyra rides under the Red Moot’s rules with the storm map. The work remains professional and under local authority.';
}

function vaorBattleUse(state: GameState) {
  if (has(state, 'c5-freed-vaor')) return 'Vaor’s ember is a gift, not an order. When you call for fire, the dragon may answer or refuse.';
  if (has(state, 'c5-took-ember-by-force')) return 'The stolen ember obeys, but Vaor pulls against every use from beyond the storm.';
  return 'The pact lets either bearer refuse the ember. Vaor will answer uses that protect living people, not choices made only for speed or control.';
}

function emberPressure(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'Vaor circles beyond the storm. He can break the army’s formation, but the soldiers already believe you command a dragon. Calling him down may prove the lie they were given.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'Vaor’s roar follows from the west. The ember you took strains toward him whenever the storm flashes. You may soon face an army ahead and an angry dragon behind.';
  }
  return 'Vaor feels the army through the pact. “They march like people trying not to ask where the road ends,” he says inside your thoughts.';
}

function personalNode(state: GameState) {
  if (state.relationships.mara.intent === 'exploring'
    || state.relationships.mara.intent === 'committed') return 'c7-mara-future';
  if (state.relationships.lysara.intent === 'exploring'
    || state.relationships.lysara.intent === 'committed') return 'c7-lysara-future';
  if (state.relationships.ilyra.intent === 'interested'
    || state.relationships.ilyra.intent === 'exploring') return 'c7-ilyra-future';
  return 'c7-quiet-watch';
}

function endangeredAlly(state: GameState) {
  if (!has(state, 'c7-wounded-on-ridge')
    && (state.relationships.mara.intent === 'committed'
    || state.relationships.mara.intent === 'exploring')) return 'Mara';
  if (state.relationships.lysara.intent === 'committed'
    || state.relationships.lysara.intent === 'exploring') return 'Lysara';
  if (state.relationships.ilyra.intent === 'interested'
    || state.relationships.ilyra.intent === 'exploring') return 'Ilyra';
  return 'Korran';
}

function pursuitGround(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'Crown outriders race beside Kharad Vey’s western decks. Houses shake above the wheels while archers reach for the steering ropes.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'Crown outriders race across the grass toward Korran’s two shield engines. The volunteers lock the moving walls together, but cavalry are already circling the open ends.';
  }
  return 'Crown outriders race into the narrow road between two black ridges. Your small line cannot stop them by weight. The broken ground on either side is the only advantage you have.';
}

function localWarning(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'Korran points to the red loose axle flag above the western deck. Steppe law requires every rider to halt when that warning rises near a moving town. Using it falsely will stain his authority, but the cavalry is already closing on the steering ropes.';
  }
  return 'Korran shows you the narrow ground ahead. A sudden turn could trap the lead riders without killing them, but the people holding your line will have only moments to move.';
}

function orderCaseStatus(state: GameState) {
  if (has(state, 'c7-lio-returned')) {
    return 'Lio surrendered his order case before riding back to the Crown ranks. His absence costs you a witness here, but any copy sent after him can spread doubt from inside the army.';
  }
  if (has(state, 'c7-lio-prisoner')) {
    return 'Lio sits beside the map with his hands bound in front. He may testify about the papers he surrendered, but he has not joined your cause.';
  }
  if (has(state, 'c7-lio-joined')) {
    return 'Lio stands beside the map in his turned coat. By joining you openly, he can carry the papers as an officer and may be named a deserter for doing it.';
  }
  return 'Lio remains under guard after allowing Ilyra to inspect the pressure on his orders. He has offered evidence, not allegiance.';
}

function signalGround(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'A Crown retreat call sounds from Kharad Vey’s western signal mast. No living person is near its brass horn.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'A Crown retreat call sounds from a captured field horn beside Korran’s shield engines. No living person is holding it.';
  }
  return 'A Crown retreat call sounds from an abandoned signal frame on the ridge. No living person is near its brass horn.';
}

function signalDanger(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'Crown soldiers turn south as trained. Kharad Vey’s wheel crews hear the same notes as an evacuation order and turn north. Both roads lead into the white salt basin, where the ground is thin enough to swallow wheels and horses.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'Crown soldiers turn south as trained. Korran’s volunteers hear the same notes as an order to move their shield engines north. Both forces are being sent into the white salt basin.';
  }
  return 'Crown soldiers turn south as trained. The three guides hear the same notes as a call to abandon the ridge. Both groups are being sent into the white salt basin.';
}

function lioAtHorn(state: GameState) {
  if (has(state, 'c7-lio-returned')) {
    return 'Lio is somewhere inside the Crown ranks. The funeral flag in his surrendered order case could tell him when to answer Evren from within the army.';
  }
  if (has(state, 'c7-lio-joined')) {
    return 'Lio recognises the funeral call for a dead marshal. It can force trained soldiers into one minute of silence, but using it now will openly break him from the Crown.';
  }
  return 'Lio recognises the funeral call for a dead marshal, but he remains a prisoner or guarded witness. Mara can sound the ceremony from his instructions without pretending he joined your side.';
}

function saltWarning(state: GameState) {
  if (has(state, 'c7-korran-salt-warning')) {
    return 'Korran already showed you the darker seams that mark deep red brine beneath the white crust. You know where a horse can run and where one hard strike will open the ground.';
  }
  return 'Korran stops you before you ride onto the white ground. “Red brine lies beneath that crust,” he says. “Break it under a running horse and the rider disappears with it.”';
}

function fortHorizon() {
  return 'At sunrise, the Black Gate fort ring appears far ahead. Four forts were emptied by Malrec’s order. Three more signal fires have gone cold since then. A thin line of smoke rises from Fourth Fort beneath a banner hanging upside down.';
}

function redMootForces(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'The whole wheel town is within bow range. Thousands of civilians depend on every turn you order.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'Korran’s chosen company holds the rear while Kharad Vey remains several miles south.';
  }
  return 'Only the three guides and your original companions stand with you. Kharad Vey is neutral, but Crown riders are trying to reach it through your line.';
}

function finalBattleCost(state: GameState) {
  if (has(state, 'c7-ally-lasting-injury')) {
    return `${endangeredAlly(state)} survived the last red wall, but the signal frame broke bone. The injury will travel into every road ahead.`;
  }
  if (has(state, 'c7-company-storm-losses')) {
    return 'Teren writes the names lost in the final red wall. Saving one person did not make the soldiers beyond your reach matter less.';
  }
  if (has(state, 'c7-saved-both-burned-proof')) {
    return 'Every person survived the final storm. Malrec’s original orders did not. The army must carry witnessed truth where sealed proof once stood.';
  }
  if (has(state, 'c7-saved-many-with-teren')) {
    return 'Teren and his engineers saved the trapped companion while your command moved the company. His injured shoulder now forces the Crown March to share authority among several living officers.';
  }
  return 'Lio returns after sunset without his Crown badge or officer’s coat. He saved the trapped companion and the company, but the soldiers who released him recorded his name as a deserter.';
}

function relationshipRoad(state: GameState) {
  if (has(state, 'c7-mara-chosen-future')) {
    return 'Mara rides beside you, close enough that your knees touch when the road narrows. The future remains dangerous. It is no longer unspoken.';
  }
  if (has(state, 'c7-mara-duty-before-future')) {
    return 'Mara stays for the Black Gate, but she no longer lets duty answer personal questions for you. The future remains open only if your actions make room for her.';
  }
  if (has(state, 'c7-mara-romance-ended')) {
    return 'Mara remains your Warden through the Gate crisis. After that, she will choose her own road without waiting for a romance you could not promise.';
  }
  if (has(state, 'c7-mara-friendship-chosen')) {
    return 'Mara rides as your oldest friend and Warden. The sadness between you is honest enough to heal.';
  }
  if (has(state, 'c7-lysara-chosen-future')) {
    return 'Lysara rides with the living treaty across her saddle. Your two loyalties point toward the same Gate for now, and your promise is strong enough to allow what comes after.';
  }
  if (has(state, 'c7-lysara-duty-before-future')) {
    return 'Lysara keeps the mission first and the attraction named. Neither of you will use danger to claim more than the other freely offers.';
  }
  if (has(state, 'c7-lysara-romance-ended')) {
    return 'Lysara remains your political ally without carrying a personal promise you could not keep.';
  }
  if (has(state, 'c7-lysara-friendship-chosen')) {
    return 'Lysara rides as a trusted friend whose loyalty can survive disagreement between two kingdoms.';
  }
  if (has(state, 'c7-ilyra-bond-deepened')) {
    return 'Ilyra leaves before dawn to follow the hidden thread from another angle. The kiss between you was a beginning, not a claim, and she promises to return only if the road remains her choice.';
  }
  if (has(state, 'c7-ilyra-interest-kept')) {
    return 'Ilyra leaves before dawn with the attraction still open and the pace clearly chosen. She will send what she learns from the hidden thread.';
  }
  if (has(state, 'c7-ilyra-friendship-chosen') || has(state, 'c7-ilyra-leverage-refused')) {
    return 'Ilyra follows the hidden thread by another route. She respects the boundary between alliance and desire and promises to send what she learns.';
  }
  if (has(state, 'c6-named-ilyra-manipulation')) {
    return 'Ilyra leaves to trace the hidden command after stating the route and risk in public. She remembers that you named her pressure.';
  }
  if (has(state, 'c6-refused-ilyra-pressure')) {
    return 'Ilyra leaves to trace the hidden command at the distance you requested. The work continues without flirtation used as leverage.';
  }
  if (has(state, 'c6-ilyra-professional-alliance')) {
    return 'Ilyra leaves under the Red Moot’s authority and sends her evidence through Korran. The alliance remains professional.';
  }
  return 'Your companions take their places without pretending victory erased what the battle cost. Ilyra leaves to trace the hidden command from another road.';
}

function chapterSevenBattleRecord(state: GameState) {
  const record: string[] = [];
  if (has(state, 'c7-families-inside-wheels')) record.push('Families survive beneath the inner decks, but damaged axles must be repaired before Kharad Vey can travel safely again.');
  if (has(state, 'c7-alliance-shields-protected-wounded')) record.push('The alliance shield engines protected the wounded, leaving them damaged and unavailable for the first Gate assault.');
  if (has(state, 'c7-neutral-wounded-in-ridge')) record.push('The wounded remain safe in Black Ridge with two guides. A runner has gone back to bring them east after the army passes.');
  if (has(state, 'c7-families-sent-south')) record.push('The southern civilian column escapes the battlefield and carries living witnesses toward the next moving town.');
  if (has(state, 'c7-oath-shielded-town')) record.push('The broad shield Oath kept every protected traveller alive. Its weight remains among the duties the Black Gate can pull.');
  if (has(state, 'c7-drew-pursuit-from-town')) record.push('Drawing the pursuit away gave Kharad Vey enough distance to avoid the final storm wall.');
  if (hasAny(state, ['c7-spared-first-cavalry', 'c7-trapped-first-cavalry', 'c7-alliance-shield-feint', 'c7-neutral-ridge-feint', 'c7-scattered-first-cavalry', 'c7-korran-spent-signal-trust', 'c7-spent-supplies-on-decoys'])) {
    if (has(state, 'c7-spared-first-cavalry')) record.push('The first cavalry line remembers that you broke weapons instead of bodies. Those survivors speak against Malrec’s murder charge.');
    if (has(state, 'c7-trapped-first-cavalry')) record.push('The first cavalry group surrendered inside a closed lane and now travels east without weapons.');
    if (has(state, 'c7-alliance-shield-feint') || has(state, 'c7-neutral-ridge-feint')) record.push('The first cavalry surrendered inside a trap shaped by Kharad crews rather than your authority alone.');
    if (has(state, 'c7-scattered-first-cavalry')) record.push('Vaor’s harmless light scattered the first charge without burning a rider.');
    if (has(state, 'c7-korran-spent-signal-trust')) record.push('The false axle warning saved lives, but Korran must restore his signal’s credibility with the other moving towns.');
    if (has(state, 'c7-spent-supplies-on-decoys')) record.push('The decoys divided the cavalry. Your smaller force reaches the Gate with fewer spare packs and shields.');
  }
  if (hasAny(state, ['c7-lio-consented-threadread', 'c7-lio-prisoner-testimony', 'c7-lio-spreads-orders-inside-army', 'c7-lio-guarded-witness'])) {
    if (has(state, 'c7-lio-consented-threadread')) record.push('Lio chose Threadread and remains a willing witness to the command inside the army.');
    if (has(state, 'c7-lio-prisoner-testimony')) record.push('Lio’s testimony remains limited by the guard placed over him. It proves procedure, not loyalty to you.');
    if (has(state, 'c7-lio-spreads-orders-inside-army')) record.push('Lio carried the false orders back into the Crown ranks, where officers copied them before the storm fell.');
    if (has(state, 'c7-lio-guarded-witness')) record.push('Lio travels east under guard as a protected witness rather than a volunteer.');
  }
  if (hasAny(state, ['c7-proof-rider-relay', 'c7-oath-orders-reach-army', 'c7-signal-tube-paper-rain', 'c7-proof-public-early', 'c7-saved-family-wagon', 'c7-original-orders-safe'])) {
    if (has(state, 'c7-proof-rider-relay')) record.push('The rider relay carried copies through the army before the roads closed.');
    if (has(state, 'c7-oath-orders-reach-army')) record.push('Your Oath delivered the orders to every rank and remains bound to their public truth.');
    if (has(state, 'c7-signal-tube-paper-rain')) record.push('The signal tubes scattered proof across the field, but the original supply wagon was lost.');
    if (has(state, 'c7-proof-public-early')) record.push('Publishing the proof early made Malrec’s sealed dates common knowledge before the final fight.');
    if (has(state, 'c7-saved-family-wagon')) record.push('The trapped family and messengers survived the proof wagon attack.');
    if (has(state, 'c7-original-orders-safe')) record.push('The original Gate orders remain in your coat for public judgment.');
  }
  if (hasAny(state, ['c7-broke-dead-horn', 'c7-living-horns-won', 'c7-oath-silenced-dead-horn', 'c7-lio-called-funeral', 'c7-lio-named-deserter', 'c7-mara-called-evren-funeral', 'c7-lio-called-funeral-inside-army'])) {
    if (has(state, 'c7-broke-dead-horn')) record.push('You destroyed one dead command horn by hand, leaving its tower unable to repeat Evren’s order.');
    if (has(state, 'c7-living-horns-won')) record.push('Living horn calls drowned out the copied order and now guide the march east.');
    if (has(state, 'c7-oath-silenced-dead-horn')) record.push('Your Oath silenced the dead horn and taught nearby soldiers how to resist its rank.');
    if (has(state, 'c7-lio-called-funeral') || has(state, 'c7-mara-called-evren-funeral') || has(state, 'c7-lio-called-funeral-inside-army')) record.push('Evren’s funeral call broke the ancestor storm’s claim to speak as a living marshal.');
    if (has(state, 'c7-lio-named-deserter')) record.push('Lio’s public refusal saved soldiers and made him a named deserter under Malrec’s law.');
  }
  if (hasAny(state, ['c7-shared-obedience-memory', 'c7-forced-vaor-battle-use', 'c7-vaor-approved-battle-use', 'c7-lio-refused-dead-command', 'c7-lio-refused-inside-army', 'c7-command-demanded-proof'])) {
    if (has(state, 'c7-shared-obedience-memory')) record.push('The hidden sender learned one private failure when you used it to trace the command.');
    if (has(state, 'c7-forced-vaor-battle-use')) record.push('The trace was won by forcing Vaor’s stolen ember. His resistance remains with the fire.');
    if (has(state, 'c7-vaor-approved-battle-use')) record.push('Vaor approved the trace because it protected living people, keeping the pact intact.');
    if (has(state, 'c7-lio-refused-dead-command') || has(state, 'c7-lio-refused-inside-army')) record.push('Lio’s willing refusal exposed the eastern command route without giving the sender a magical weapon.');
    if (has(state, 'c7-command-demanded-proof')) record.push('You refused to let Ilyra spend another person’s risk. Her proof now includes the limits of her method.');
  }
  if (hasAny(state, ['c7-mara-can-stop-caelan', 'c7-three-fact-warning', 'c7-knows-private-command-test'])) {
    if (has(state, 'c7-mara-can-stop-caelan')) record.push('Mara still holds your permission to stop you if the dead command enters your voice.');
    if (has(state, 'c7-three-fact-warning')) record.push('Every scout carries Lysara’s three plain tests for a dead command.');
    if (has(state, 'c7-knows-private-command-test')) record.push('Every scout knows today’s password, so copied officers cannot quietly retake command.');
  }
  if (hasAny(state, ['c7-crown-restitution-oath-advanced', 'c7-teren-saw-gate-order', 'c7-invoked-queen-border-law', 'c7-teren-tested-dead-command', 'c7-offered-teren-custody'])) {
    if (has(state, 'c7-crown-restitution-oath-advanced')) record.push('Royal witnesses carry the Crown crime toward public judgment, advancing your Red Moot Oath.');
    if (has(state, 'c7-teren-saw-gate-order')) record.push('Teren carries a copy of the genuine order that emptied the Gate forts.');
    if (has(state, 'c7-invoked-queen-border-law')) record.push('Crown officers heard their own border law used against Malrec’s withdrawal.');
    if (has(state, 'c7-teren-tested-dead-command')) record.push('Teren heard the dead marshal fail today’s password in front of his guards.');
    if (has(state, 'c7-offered-teren-custody')) record.push('Your offer of custody remains on the royal record, tied to Teren returning soldiers to the Gate.');
  }
  if (hasAny(state, ['c7-mixed-shield-ring', 'c7-saved-teren-at-parley', 'c7-lio-used-private-answer', 'c7-caelan-used-password-test', 'c7-oath-living-command'])) {
    if (has(state, 'c7-mixed-shield-ring')) record.push('The mixed shield ring proved Crown and Kharad soldiers could protect one another before trusting one another.');
    if (has(state, 'c7-saved-teren-at-parley')) record.push('Teren survives because you took the arrow line, and his living counterorders reach the Gate.');
    if (has(state, 'c7-lio-used-private-answer') || has(state, 'c7-caelan-used-password-test')) record.push('Today’s password gave every surviving company a simple test for living command.');
    if (has(state, 'c7-oath-living-command')) record.push('The living rank Oath still protects every soldier who freely chose it from Evren’s copied authority.');
  }
  if (hasAny(state, ['c7-salt-trap-merciful', 'c7-saved-crown-cavalry', 'c7-living-signal-spent', 'c7-lost-gate-supplies', 'c7-oath-surrender-road'])) {
    if (has(state, 'c7-salt-trap-merciful')) record.push('The salt trap took horses and weapons rather than lives. The spared companies now help move the wounded east.');
    if (has(state, 'c7-saved-crown-cavalry')) record.push('The riders you pulled from the brine join the Gate road as witnesses to your restraint.');
    if (has(state, 'c7-living-signal-spent')) record.push('The living signal post saved both forces and was lost in the collapse.');
    if (has(state, 'c7-lost-gate-supplies')) record.push('The safe retreat held, but part of the Gate supply train sank beneath the salt.');
    if (has(state, 'c7-oath-surrender-road')) record.push('The surrender road remains visible to every soldier who lowers a weapon, keeping the retreat open without forced obedience.');
  }
  if (hasAny(state, ['c7-orders-reached-every-rank', 'c7-lio-carried-orders', 'c7-seals-proved-sequence', 'c7-lio-delivered-orders', 'c7-lio-exposed-orders-inside-army', 'c7-lio-testimony-reached-ranks'])) {
    if (has(state, 'c7-orders-reached-every-rank')) record.push('Every Crown rank received the dated orders, so no single officer can bury the sequence again.');
    if (has(state, 'c7-lio-carried-orders') || has(state, 'c7-lio-delivered-orders') || has(state, 'c7-lio-exposed-orders-inside-army')) record.push('Lio carried the evidence through the Crown ranks and now shares responsibility for its survival.');
    if (has(state, 'c7-seals-proved-sequence')) record.push('Your public Oath fixed the order of Malrec’s seals where both armies could witness it.');
    if (has(state, 'c7-lio-testimony-reached-ranks')) record.push('Lio’s narrow testimony reached the ranks without falsely presenting him as your ally.');
  }
  if (hasAny(state, ['c7-defeated-teren-mercifully', 'c7-won-by-terens-lesson', 'c7-duel-on-equal-ground', 'c7-teren-yielded-for-gate', 'c7-lio-stranded-after-rescue'])) {
    if (has(state, 'c7-defeated-teren-mercifully')) record.push('Teren’s public, merciful defeat gives the army a lawful reason to follow his new order.');
    if (has(state, 'c7-won-by-terens-lesson')) record.push('The officers saw you win through Crown training rather than hidden magic.');
    if (has(state, 'c7-duel-on-equal-ground')) record.push('The equal ground Oath kept Malrec and the dead marshal outside the duel.');
    if (has(state, 'c7-teren-yielded-for-gate')) record.push('Teren yielded to his duty at the Gate instead of to force.');
    if (has(state, 'c7-lio-stranded-after-rescue')) record.push('Lio saved your trapped companion and remains under uncertain Crown guard until Teren can reach him.');
  }
  return record;
}

export const chapterSevenNodes: Record<string, StoryNode> = {
  'c7-red-horizon': {
    id: 'c7-red-horizon',
    kicker: 'Chapter Seven',
    title: 'The Red Wind Hunt',
    location: 'The Open Ember Steppe',
    objective: 'Keep the Crown March away from Kharad Vey long enough to learn why it left the Black Gate.',
    threat: 'Critical',
    art: 'redwind',
    introducesStoryTerms: ['Crown March'],
    lesson: {
      title: 'Who is pursuing you',
      body: 'The force ahead is the Crown March, Asterra’s main field army. It belongs to Caelan’s own kingdom. Regent Malrec commands it while the Queen is ill. Most soldiers believe they are arresting a traitor and recovering a stolen weapon.',
    },
    body: (state) => [
      'The army reaches the western horizon at dawn. Dark blue banners rise above six thousand soldiers, supply wagons, and cavalry. They wear the silver tree of Asterra, the kingdom you still serve.',
      supportOpening(state),
      ilyraArrival(state),
      steppePromises(state),
      emberPressure(state),
      'You recognise the spacing of the cavalry lines from years of Crown drills. Knowing exactly how the charge will arrive does nothing to slow your pulse.',
      'A red storm moves over the army. Pale officers appear inside it, each wearing an older version of the Crown uniform. When one dead voice raises its hand, the living front line changes direction without waiting for a horn.',
      'Mara rides close enough to be heard over the wheels. “They think they are obeying legal orders. We need to survive them before we can prove which orders are lies.”',
      'Ahead, the steppe divides around a white salt basin and a line of black ridges. Behind, the first cavalry wave lowers its lances. Korran asks, “Where do you put the vulnerable people?”',
    ],
    choices: [
      {
        id: 'c7-hide-noncombatants-wheel-shadow',
        label: 'Move the families, children, and wounded beneath Kharad Vey’s inner decks.',
        detail: 'Use the city as cover while accepting that a broken axle could trap them.',
        advantage: 'The moving platforms block arrows and keep families close to their own rescue crews.',
        showIfAnyFlags: ['c6-red-moot-war'],
        addFlags: ['c7-families-inside-wheels'],
        result: 'Families move into the inner lanes while wheel crews hang layered hide between the axles. They gain cover, but every turn now carries lives beneath it.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-shelter-behind-shield-engines',
        label: 'Lock the two shield engines around the wounded and wind callers.',
        detail: 'Turn the alliance’s limited equipment into a shelter instead of using it in the first attack.',
        advantage: 'The vulnerable people gain mobile cover while Kharad Vey remains safely south.',
        showIfAnyFlags: ['c6-red-moot-alliance'],
        addFlags: ['c7-alliance-shields-protected-wounded'],
        result: 'Korran’s crews lock the two moving walls into a narrow shelter. The wounded disappear behind layered hide while the volunteers form outside it.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-shelter-wounded-black-ridge',
        label: 'Hide the wounded and two guides inside the split Black Ridge.',
        detail: 'Use stone cover while leaving only one guide beside your fighting line.',
        advantage: 'The small party leaves no vulnerable target on the open road, and the neutral town keeps moving south.',
        showIfAnyFlags: ['c6-red-moot-neutral'],
        addFlags: ['c7-neutral-wounded-in-ridge'],
        result: 'Mara finds a narrow break in the ridge and moves the wounded inside. Two guides stay with them. When you return to the road, your line is smaller but no helpless traveller remains in the charge.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-command-southern-evacuation',
        label: 'Send the vulnerable people south before the cavalry closes.',
        detail: 'Spend 1 Command separating vulnerable people from the battlefield.',
        advantage: 'The civilians gain distance from both armies and leave Caelan freer to move.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-families-sent-south'],
        result: 'Your signal joins Korran’s. Riders form a moving wall around the southern column and carry the slowest wagons out of the army’s direct path.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-oath-no-crown-arrow',
        label: 'Promise that no Crown arrow will reach the people under your protection.',
        detail: 'Spend 2 Oathfire tying your defence to every exposed traveller and platform.',
        advantage: 'The Oath gives broad protection and draws the army’s attention toward you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-shielded-town'],
        result: 'Gold light spreads around every person placed in your care. The first arrows curve toward your shield instead of the fleeing line. Each protected life adds another pull against your chest.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-turn-neutral-town-away',
        label: 'Ride into the open and draw the pursuit toward Vaor’s ember.',
        detail: 'Lose 1 Health forcing the cavalry to follow you instead of the vulnerable people or the wheel town.',
        advantage: 'Everyone behind you gains a clean path away while you become the army’s clear target.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c7-drew-pursuit-from-town'],
        result: 'You ask Vaor to help draw the hunt. The ember answers, and every royal tracking compass points toward you. The cavalry turns. Everyone behind your line gains distance while you become the centre of the hunt.',
        next: 'c7-break-town-line',
      },
    ],
  },

  'c7-break-town-line': {
    id: 'c7-break-town-line',
    kicker: 'The pursuit must stop here',
    title: 'Break the First Charge',
    location: 'The Western Running Line',
    objective: 'Slow the first cavalry wave without killing soldiers who may not know the truth.',
    threat: 'Immediate',
    art: 'redwind',
    body: (state) => [
      pursuitGround(state),
      'Their captain shouts that Caelan Vey is accused of murdering Commander Hale, stealing a royal weapon, and forcing Kharad Vey into rebellion.',
      'Your memory returns to Hale alive behind the control platform as Dragonspine began to collapse. You never found his body, and you do not know whether he escaped.',
      'The army was told you murdered him. You do carry Vaor’s ember, and the Red Moot did choose its own road after you arrived. Those true pieces make the false charge believable.',
      redMootForces(state),
      localWarning(state),
      vaorBattleUse(state),
    ],
    choices: [
      {
        id: 'c7-break-lances-not-riders',
        label: 'Ride into the charge and break lances instead of bodies.',
        detail: 'Lose 2 Health entering close combat while refusing lethal strikes.',
        advantage: 'The cavalry line breaks, and surviving soldiers see restraint their orders did not predict.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c7-spared-first-cavalry'],
        result: 'Your shield takes the first lance. The ember softens three more without touching the hands holding them. Horses scatter and the charge loses its shape.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-command-wheel-feint',
        label: 'Ask Korran to signal a false city turn and close the lane behind the cavalry.',
        detail: 'Spend 1 Command using the wheel signals learned in Kharad Vey.',
        advantage: 'The city traps the outriders without crushing them or exposing the inner decks.',
        showIfAnyFlags: ['c6-red-moot-war'],
        showIfAllFlags: ['c6-red-moot-war', 'c6-learned-wheel-signals'],
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-trapped-first-cavalry'],
        result: 'You give Korran the timing. He approves it and raises the signal. The outer wheels invite the riders through, then close the lane with hanging shields. Forty cavalry surrender inside a wooden corridor.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-command-shield-engine-feint',
        label: 'Open a gap between the shield engines, then close it behind the lead riders.',
        detail: 'Spend 1 Command timing two volunteer crews on unfamiliar machines.',
        advantage: 'The alliance traps the first cavalry group without bringing Kharad Vey back into the battle.',
        showIfAnyFlags: ['c6-red-moot-alliance'],
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-trapped-first-cavalry', 'c7-alliance-shield-feint'],
        result: 'Korran accepts your count and passes it to the volunteer crews. Twenty riders enter the gap before he closes the moving walls behind them. They surrender inside a corridor of hide and timber.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-command-ridge-feint',
        label: 'Draw the lead riders between the ridges and close the road behind them.',
        detail: 'Spend 1 Command turning a small party into two moving lines.',
        advantage: 'The narrow ground traps the outriders without requiring the neutral town to return.',
        showIfAnyFlags: ['c6-red-moot-neutral'],
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-trapped-first-cavalry', 'c7-neutral-ridge-feint'],
        result: 'You ask the three guides to shape the trap. They choose opposite ridges, then roll loose stone across the road together. The lead riders halt inside the narrow pass while the rest of the charge breaks around them.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-ember-frighten-horses',
        label: 'Raise a line of harmless ember light before the horses.',
        detail: 'Spend 1 Resolve controlling the flame while hooves strike around you.',
        advantage: 'The mounts turn from the light and carry their riders away without bloodshed.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c7-scattered-first-cavalry'],
        result: 'You call for a harmless wall. The ember answers. Red gold light rises without heat, and the horses wheel away. Their riders fight for control instead of reaching the city.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-raise-false-axle-warning',
        label: 'Ask Korran to spend Kharad Vey’s loose axle warning.',
        detail: 'Use steppe safety law to stop the charge, at the cost of Korran’s credibility with other moving towns.',
        advantage: 'Even enemy cavalry must halt before a marked axle danger.',
        showIfAnyFlags: ['c6-red-moot-war'],
        addFlags: ['c7-korran-spent-signal-trust'],
        result: 'Korran studies the riders, then raises the red flag himself. Every trained rider hauls back before an axle danger that does not exist. The charge tangles safely outside the ropes. “Useful lie,” he says as he lowers it. “Expensive one.”',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-spend-steppe-decoys',
        label: 'Drop spare packs and painted shields along two false escape roads.',
        detail: 'Sacrifice supplies to divide the cavalry before it reaches your smaller force.',
        advantage: 'The lead riders split without drawing Kharad Vey back toward danger.',
        showIfAnyFlags: ['c6-red-moot-alliance', 'c6-red-moot-neutral'],
        addFlags: ['c7-spent-supplies-on-decoys'],
        result: 'The painted shields catch the storm light like armed riders. Two cavalry groups chase them into empty grass while the true road stays open.',
        next: 'c7-first-riders',
      },
    ],
  },

  'c7-first-riders': {
    id: 'c7-first-riders',
    kicker: 'One soldier lowers his sword',
    title: 'The Man Who Heard Two Orders',
    location: 'The Halted Cavalry Line',
    objective: 'Question someone who can explain the army’s orders before the next wave arrives.',
    threat: 'Immediate',
    art: 'redwind',
    introducesStoryTerms: ['dead command'],
    body: () => [
      'A young Crown lieutenant remains among halted and riderless horses. He lowers his sword when Mara calls his academy name. “Lio Var,” she says. “You trained three years below me.”',
      'Lio looks from her to the dead officer in the storm. “Marshal Evren ordered us to take the wheel town alive. Marshal Evren has been dead for nineteen years. The signal pattern is his. I checked it twice.”',
      'He points toward Evren’s face. “We call that a dead command. It uses a dead officer’s voice to give orders without a living messenger.”',
      'The living army marshal, Teren Voss, is half a mile behind. Lio says Voss obeys Regent Malrec’s sealed orders, but the dead voice changes their timing whenever the storm thickens.',
      'Lio explains the army’s simplest safety rule. Written orders need paper and a living messenger. Spoken commands must include today’s password, changed every dawn. A dead memory may know yesterday’s word. It cannot know today’s.',
      'Your memory returns to the first sealed order you obeyed despite your doubts. The fear in Lio’s face is painfully familiar.',
      'A second cavalry horn sounds. Lio asks, “Are you arresting me, Captain, or asking me to betray my army?”',
    ],
    choices: [
      {
        id: 'c7-bind-lio-as-prisoner',
        label: 'Bind Lio under ordinary prisoner law.',
        detail: 'Keep him secure and promise food, treatment, and a hearing after the battle.',
        advantage: 'A protected prisoner can testify later without being forced to change sides now.',
        addFlags: ['c7-lio-prisoner', 'c7-lio-alive'],
        result: 'You state his rights and bind his hands in front. Lio gives you his order case because a lawful prisoner may surrender military papers.',
        next: 'c7-captured-soldier',
      },
      {
        id: 'c7-release-lio-with-question',
        label: 'Release Lio after asking him to compare the living and dead orders.',
        detail: 'Risk losing the witness so doubt can travel back through the Crown ranks.',
        advantage: 'Lio may weaken the army’s obedience from inside before the decisive battle.',
        addFlags: ['c7-lio-returned', 'c7-lio-alive'],
        result: 'You accept his surrendered order case, cut his reins free, and return his sword. “Read both orders before you obey either.” Lio rides west carrying the question you cannot send by arrow.',
        next: 'c7-captured-soldier',
      },
      {
        id: 'c7-ask-lio-join-now',
        label: 'Ask Lio to join your line and speak to the next company.',
        detail: 'Spend 1 Command asking a frightened officer to reject recognised authority in public.',
        advantage: 'His uniform and academy standing can make soldiers listen before they attack.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-lio-joined', 'c7-lio-alive'],
        result: 'Lio turns his cloak inside out and joins your line. His hands shake, but his first order to the approaching riders is clear: verify the seal before striking civilians.',
        next: 'c7-captured-soldier',
      },
      {
        id: 'c7-let-ilyra-read-order-thread',
        label: 'Let Ilyra trace the pressure attached to Lio’s orders.',
        detail: 'Use Threadread on the document with Lio’s informed permission.',
        advantage: 'The thread may reveal which order came from Malrec and which came through the storm.',
        addFlags: ['c7-lio-consented-threadread', 'c7-lio-under-guard', 'c7-lio-alive'],
        result: 'Lio gives permission and holds the order case himself. Ilyra finds two threads: black wax leading toward the Regent and red wind leading east toward the Gate.',
        next: 'c7-captured-soldier',
      },
    ],
  },

  'c7-captured-soldier': {
    id: 'c7-captured-soldier',
    kicker: 'The army believes a careful lie',
    title: 'Orders Signed in the Queen’s Name',
    location: 'The Field Map Station',
    objective: 'Separate the army’s genuine orders from the dead commands changing them.',
    threat: 'Rising',
    art: 'marshal',
    body: (state) => [
      orderCaseStatus(state),
      'Lio’s order case contains two official papers. The newer one bears the Regent’s genuine black wax. It orders your arrest for murdering Hale and stealing a royal ember.',
      'Your memory is exact: Hale was alive when the Dragonspine grave began to collapse. You never found a body. The army received a claim of murder, not proof of one.',
      'The older paper moved the Crown army away from four Black Gate forts three weeks ago for a false invasion exercise. Teren was promised replacement soldiers. None arrived.',
      has(state, 'c5-has-extraction-order')
        ? 'The extraction order you carried from Dragonspine completes the sequence. Malrec planned to cut out Vaor’s ember while the same soldiers who should guard the Gate marched west.'
        : has(state, 'c5-royal-witnesses-turned')
          ? 'The royal witnesses from Dragonspine can confirm that Malrec’s private force was already cutting into Vaor while the Gate forts lost their army.'
          : 'You lack Malrec’s extraction paper. The dates prove he emptied the Gate before the alleged crimes. They do not prove what happened to Hale or how you gained the ember.',
      'The date answers Malrec’s lie. He moved the army away from the Gate before the crimes named in your arrest order.',
      'Evren’s commands need a different test. They arrive without paper, a living messenger, or today’s password. Teren can answer that password. A dead memory cannot.',
      'Lysara places both papers side by side. “Use the date against Malrec. Use the password against Evren. Which proof do we prepare, and who carries it?”',
    ],
    choices: [
      {
        id: 'c7-copy-diversion-order',
        label: 'Copy the order that emptied the Black Gate forts.',
        detail: 'Prioritise proof that Malrec left the Gate undefended over clearing your personal name.',
        advantage: 'Every copy can show soldiers that their real duty lies east, not in this pursuit.',
        addFlags: ['c7-copied-gate-diversion', 'c7-knows-malrec-emptied-gate'],
        result: 'Lysara copies the fort names, dates, and genuine seal. The evidence proves Malrec redirected the army before your alleged crime occurred.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-copy-false-charges',
        label: 'Record what you actually saw happen to Hale.',
        detail: 'State that Hale was alive when the grave began to collapse and separate that fact from the army’s murder claim.',
        advantage: 'Soldiers who care about Hale may question the charge without being asked to trust your whole defence.',
        addFlags: ['c7-copied-false-charges', 'c7-knows-malrec-emptied-gate'],
        result: 'Mara writes only what you witnessed. Hale was alive when the collapse began. You do not claim he survived. The careful account exposes how much Malrec added afterward.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-mark-dead-command-difference',
        label: 'Teach the group how to recognise a dead command.',
        detail: 'Spend 1 Command training several messengers while the army closes.',
        advantage: 'Living units may reject storm orders that arrive without paper, wax, or today’s password.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-taught-dead-command-test', 'c7-knows-malrec-emptied-gate'],
        result: 'You teach three questions. Where is the written order? Where is the living messenger? What is today’s password? Riders carry the rule across your line.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-give-orders-to-lio',
        label: 'Give copies to Lio and make him sign as a living Crown officer.',
        detail: 'Use his real rank to carry the proof, exposing him as a deserter if the army rejects it.',
        advantage: 'Soldiers who distrust you may still read an order delivered under Lio’s true name.',
        showIfAnyFlags: ['c7-lio-joined'],
        addFlags: ['c7-lio-carries-orders', 'c7-knows-malrec-emptied-gate'],
        result: 'Lio signs every copy and adds his unit, rank, and today’s password. He returns the originals to your coat. “If they reject this, they reject me with it,” he says. The cost in his voice is clearer than ink.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-ask-lio-prisoner-testimony',
        label: 'Ask Lio to sign as the prisoner who surrendered the order case.',
        detail: 'Use his testimony without claiming he deserted or joined your cause.',
        advantage: 'His lawful prisoner status gives cautious officers a reason to examine the papers.',
        showIfAnyFlags: ['c7-lio-prisoner'],
        addFlags: ['c7-lio-prisoner-testimony', 'c7-knows-malrec-emptied-gate'],
        result: 'Lio signs only what he witnessed. The papers came from his case, their seals are genuine, and Evren’s voice brought no written order. He makes no claim about events he did not see.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-send-copies-after-lio',
        label: 'Send copies after Lio so he can raise the question inside the army.',
        detail: 'Trust the officer you released to carry doubt farther than your own messenger could.',
        advantage: 'The evidence can begin spreading through the Crown ranks before your next confrontation.',
        showIfAnyFlags: ['c7-lio-returned'],
        addFlags: ['c7-lio-spreads-orders-inside-army', 'c7-knows-malrec-emptied-gate'],
        result: 'A steppe rider catches Lio at the rear company and passes him the copies. He does not return. Instead, he rides from officer to officer inside the Crown line, asking who received the missing replacement force.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-use-lio-guarded-witness',
        label: 'Let Lio carry the copies under a white guard cord.',
        detail: 'Treat him as a protected witness without pretending he has joined either side.',
        advantage: 'His rank supports the evidence while the visible guard cord makes his status honest.',
        showIfAnyFlags: ['c7-lio-under-guard'],
        addFlags: ['c7-lio-guarded-witness', 'c7-knows-malrec-emptied-gate'],
        result: 'Lio signs the source of the papers, then accepts the white guard cord around his arm. He will speak where both sides can hear and return to the guard line afterward.',
        next: 'c7-sealed-orders',
      },
    ],
  },

  'c7-sealed-orders': {
    id: 'c7-sealed-orders',
    kicker: 'The reason the Gate stands empty',
    title: 'Malrec’s First Betrayal',
    location: 'The Eastern Running Road',
    objective: 'Keep the proof alive while the Crown army begins its full attack.',
    threat: 'Immediate',
    art: 'redwind',
    lesson: {
      title: 'What is now confirmed',
      body: 'Malrec’s dated paper sent the army away from four Black Gate forts before Caelan took the ember. Evren’s voice has no paper, living messenger, or current password. Malrec moved the army. The dead voice is keeping it west.',
    },
    body: () => [
      'The army’s first siege horns roll across the steppe. Infantry spreads between the ridges while cavalry races for every path east. Teren Voss is no longer trying to arrest one man. He is closing the road around everyone who can carry the proof.',
      'A black arrow strikes the field map table. Red dust climbs its shaft and shapes Marshal Evren’s dead face above the road. “Burn the stolen orders,” the voice commands. Crown archers turn toward the paper without receiving a living signal.',
      'Ilyra catches the red thread tied to the voice. It leads east, not west toward the army. Whatever speaks as Evren is connected to the opening Gate.',
      'Your fingers fold Malrec’s dated paper into your coat as you repeat today’s password once. One exposes the Regent’s lie. The other exposes Evren’s dead voice.',
      'Korran points toward a wagon caught between the running lines. Wounded people and two messengers are trapped inside. The proof is in your coat. The wagon will overturn in seconds. “Which reaches safety first?”',
    ],
    choices: [
      {
        id: 'c7-save-wagon-carry-proof',
        label: 'Carry the proof into the running lane and pull the wagon clear.',
        detail: 'Lose 1 Health protecting both people and evidence under direct fire.',
        advantage: 'The trapped people survive and the original orders remain in your possession.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c7-saved-family-wagon', 'c7-original-orders-safe'],
        result: 'You catch the wagon beam against your injured shoulder and force it over the track. Arrows follow the papers inside your coat. The wounded people and messengers reach cover with you.',
        next: 'c7-dead-horn',
      },
      {
        id: 'c7-command-proof-relay',
        label: 'Send copies through a rider relay while Korran saves the wagon.',
        detail: 'Spend 1 Command placing evidence beyond any single arrow or messenger.',
        advantage: 'The proof survives in several hands and the trapped wagon receives an experienced rescuer.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-proof-rider-relay', 'c7-saved-family-wagon'],
        result: 'Five riders take five copies on separate roads. Korran reaches the wagon, and no single capture can silence the order now.',
        next: 'c7-dead-horn',
      },
      {
        id: 'c7-oath-truth-reaches-army',
        label: 'Promise that Malrec’s order will reach the soldiers before sunset.',
        detail: 'Spend 2 Oathfire binding your power to public exposure during the battle.',
        advantage: 'The promise protects the evidence and strengthens every attempt to reveal it.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-orders-reach-army', 'c7-original-orders-safe'],
        result: 'Gold fire enters the ink. Every copied line becomes harder to burn while the duty settles across your shoulders.',
        next: 'c7-dead-horn',
      },
      {
        id: 'c7-fire-orders-from-signal-tubes',
        label: 'Launch copies from Korran’s signal canisters.',
        detail: 'Spend the prepared paper supply and reveal the evidence before the decisive moment.',
        advantage: 'Hundreds of soldiers see the order now, but Teren gains time to call it a forgery.',
        addFlags: ['c7-signal-tube-paper-rain', 'c7-proof-public-early'],
        result: 'Korran’s wind callers pack their portable canisters with copied orders and one handful of white flour to reveal the wind. Pages burst above the Crown line and drift through every rank. “The flour shows the safe angle,” Korran says. Mara watches the white cloud. “Of course it does.”',
        next: 'c7-dead-horn',
      },
    ],
  },

  'c7-dead-horn': {
    id: 'c7-dead-horn',
    kicker: 'A dead marshal takes the signal tower',
    title: 'The Horn That Nobody Blew',
    location: 'The Western Signal Rise',
    objective: 'Stop a dead command from sending both armies into the salt basin.',
    threat: 'Critical',
    art: 'redwind',
    body: (state) => [
      signalGround(state),
      'The red storm speaks through the empty horn in Marshal Evren’s voice.',
      signalDanger(state),
      has(state, 'c7-taught-dead-command-test')
        ? 'Your messengers shout the three questions. No paper. No living messenger. No password for today. Several Crown companies slow, but the horn is louder.'
        : 'The order sounds perfect. Without a simple test, frightened soldiers obey the pattern their bodies learned before their minds can object.',
      'Your training offers six ways to break a signal mast and only one that leaves the horn usable by living officers.',
      lioAtHorn(state),
      'Ilyra grips the red thread. “Or we cut Evren out of the horn now.”',
    ],
    choices: [
      {
        id: 'c7-climb-and-break-horn',
        label: 'Climb the mast and break the horn before the next call.',
        detail: 'Lose 2 Health crossing an exposed mast under Crown arrows.',
        advantage: 'The physical signal ends immediately and both forces regain time to choose their roads.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c7-broke-dead-horn'],
        result: 'You climb through red lightning and drive your shield edge through the brass horn. The false retreat dies halfway through its final note.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-command-counter-horns',
        label: 'Call today’s password from every smaller horn.',
        detail: 'Spend 2 Command making one verified signal louder than the dead marshal.',
        advantage: 'Both forces hear a current living order without destroying the signal horn.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-living-horns-won'],
        result: 'One horn answers, then twenty. Today’s password rolls across the field until living officers begin stopping their own lines.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-oath-dead-command-silent',
        label: 'Promise that no dead command will move a living soldier through this horn.',
        detail: 'Spend 2 Oathfire making the horn accept only breath from living lungs.',
        advantage: 'The horn remains usable by living officers while every storm voice loses it.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-silenced-dead-horn'],
        result: 'Gold fire seals the horn against breath with no living lungs. The next dead order becomes a dry rattle while living officers still pass through cleanly.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-lio-calls-ghost-funeral',
        label: 'Have Lio announce Marshal Evren’s overdue funeral.',
        detail: 'Use real Crown ceremony to interrupt the dead officer and openly mark Lio as a deserter.',
        advantage: 'The unexpected honour forces Evren and the trained soldiers to halt for the funeral call.',
        showIfAnyFlags: ['c7-lio-joined'],
        addFlags: ['c7-lio-called-funeral', 'c7-lio-named-deserter'],
        result: 'Lio drops black cloth over the horn and gives Evren’s exact funeral call. The storm stops speaking. Thousands of soldiers halt by reflex. “He has been dead nineteen years,” Lio says into the sudden quiet. “Let him finish.”',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-mara-calls-evren-funeral',
        label: 'Use Lio’s instructions and have Mara sound Evren’s funeral call.',
        detail: 'Keep Lio’s prisoner or witness status honest while using the military knowledge he offered.',
        advantage: 'The ceremony interrupts Evren without pretending Lio has joined your line.',
        showIfAnyFlags: ['c7-lio-prisoner', 'c7-lio-under-guard'],
        addFlags: ['c7-mara-called-evren-funeral'],
        result: 'Lio gives Mara the four notes. She covers the horn with black cloth and sounds Evren’s funeral. The storm voice stops. Thousands of soldiers halt because the ceremony belongs to them, not to your rebellion.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-signal-lio-inside-army',
        label: 'Raise Evren’s funeral flag for Lio inside the Crown ranks.',
        detail: 'Trust the officer you released to answer from the place he chose to return.',
        advantage: 'A living Crown voice can interrupt the storm from inside the pursuing army.',
        showIfAnyFlags: ['c7-lio-returned'],
        addFlags: ['c7-lio-called-funeral-inside-army'],
        result: 'The black flag rises. A moment later, Lio’s horn answers from inside the western ranks with Evren’s funeral call. The storm falls silent, and the soldiers around him lower their weapons for one startled minute.',
        next: 'c7-ilyra-command-thread',
      },
    ],
  },

  'c7-ilyra-command-thread': {
    id: 'c7-ilyra-command-thread',
    kicker: 'The storm points back to the Gate',
    title: 'A Command with Two Masters',
    location: 'The Black Ridge Overlook',
    objective: 'Trace the storm order without letting it take the ember.',
    threat: 'Rising',
    art: 'saltbattle',
    body: (state) => [
      'Ilyra pins the dead command to black stone with three glass charms. One thread runs west to the soldiers who obey it. A second runs east beneath the steppe toward the Black Gate.',
      '“Malrec sent the living army away,” she says. “This other will is keeping them occupied. They are cooperating without issuing the same orders.”',
      has(state, 'c6-hidden-sender-marked')
        ? 'The mark she placed during the Red Moot appears inside the eastern thread. It is the same hidden listener that answered when she turned the ancestor command away from Kharad Vey.'
        : 'The eastern thread carries a mark she has never seen. It feels like a hand holding the Gate open from the other side.',
      'To trace it farther, Ilyra needs a living memory of obedience, Vaor’s ember, or one order spoken back through the thread. Each route exposes someone to the hidden sender.',
      steppePromises(state),
      vaorBattleUse(state),
      'Your mind sorts the risks by habit, then stops. These are not pieces on a map. Each method exposes a person.',
      'She looks at you rather than choosing for you. “Whose risk do I spend?”',
    ],
    choices: [
      {
        id: 'c7-share-command-memory',
        label: 'Give Ilyra a memory of the first order you obeyed against your judgment.',
        detail: 'Spend 1 Resolve letting Threadread carry a private failure into the storm.',
        advantage: 'The memory follows the obedience thread without exposing another person.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c7-shared-obedience-memory', 'c7-traced-hidden-sender'],
        result: 'You give permission and remember the patrol you led into a flooded village because a superior insisted the bridge would hold. Ilyra carries the shame along the thread until something beyond the Gate notices it.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-open-vaor-ember-thread',
        label: 'Ask Vaor to open his ember to the eastern thread for one breath.',
        detail: 'Vaor may refuse the gift. If he agrees, the hidden power will learn who carries it.',
        advantage: 'Dragonfire can illuminate the full route used by the dead commands.',
        showIfAnyFlags: ['c5-freed-vaor'],
        addFlags: ['c7-sender-knows-ember-bearer', 'c7-traced-hidden-sender'],
        result: 'You ask. Vaor waits long enough to make the choice clear, then opens one breath of flame. A red map burns beneath the steppe. The hidden sender now knows your name and heartbeat.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-force-stolen-ember-thread',
        label: 'Force the stolen ember into the eastern thread.',
        detail: 'Spend 1 Resolve controlling Vaor’s resistance while exposing your exact location.',
        advantage: 'The stolen fire reveals the full route even though Vaor refuses to help.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c7-sender-knows-ember-bearer', 'c7-traced-hidden-sender', 'c7-forced-vaor-battle-use'],
        result: 'Vaor pulls against you. You force the ember into the thread until a red map burns beneath the steppe. The route is clear, but the dragon now knows you used his stolen fire again.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-share-pact-ember-thread',
        label: 'Ask Vaor to share the risk of opening the pact ember.',
        detail: 'Either bearer may refuse. Agreement reveals the route and both bearers to the hidden power.',
        advantage: 'The pact traces the full command road without breaking its terms.',
        showIfAnyFlags: ['c5-vaor-pact'],
        addFlags: ['c7-sender-knows-ember-bearer', 'c7-traced-hidden-sender', 'c7-vaor-approved-battle-use'],
        result: 'You name the risk. Vaor agrees because the hidden command threatens living people. The pact opens for one breath, and a red map burns beneath the steppe. The power beyond the Gate learns both your names.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-use-lio-living-order',
        label: 'Let Lio speak a willing refusal through the dead command.',
        detail: 'Use a soldier’s present choice to oppose the obedience expected from him.',
        advantage: 'The refusal exposes the command’s route without giving it a magical weapon.',
        showIfAnyFlags: ['c7-lio-prisoner', 'c7-lio-joined', 'c7-lio-under-guard'],
        addFlags: ['c7-lio-refused-dead-command', 'c7-traced-hidden-sender'],
        result: 'Lio chooses to speak his name, rank, and refusal from the place you gave him, whether beside your line or under guard. The thread tightens as if trying to correct him. Ilyra follows that pressure east to the fort ring.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-follow-lio-refusal-inside-army',
        label: 'Send the challenge to Lio and follow his refusal inside the Crown ranks.',
        detail: 'Use the officer’s chosen return to trace the command from within the army.',
        advantage: 'The hidden sender exposes its route when it tries to force Lio back into obedience.',
        showIfAnyFlags: ['c7-lio-returned'],
        addFlags: ['c7-lio-refused-inside-army', 'c7-traced-hidden-sender'],
        result: 'A living horn carries the challenge west. Lio answers from inside his company: name, rank, today’s password, refusal. The red thread snaps toward him, and Ilyra follows the pressure east to the fort ring.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-turn-command-on-itself',
        label: 'Help Ilyra make the order demand proof from its own sender.',
        detail: 'Spend 1 Oathfire adding an Oathwarden’s test to her manipulation.',
        advantage: 'The hidden power must reveal part of its authority or lose the dead command.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c7-command-demanded-proof', 'c7-traced-hidden-sender'],
        result: 'Ilyra turns the pressure while your Oath demands a source. The answer arrives as an image: four empty Black Gate forts and a red hand reaching through the opening.',
        next: (state) => personalNode(state),
      },
    ],
  },

  'c7-mara-future': {
    id: 'c7-mara-future',
    kicker: 'What waits after duty',
    title: 'The Question Mara Kept',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Answer Mara honestly before the army reaches the ridge.',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Mara finds you while the others water the horses. Red dust has settled along her jaw and in the loose hair at her neck. The old urge to brush it away returns, warm and familiar, but what you do with it remains your choice.',
      'She stands close enough that her shoulder touches yours. For one breath, the army beyond the ridge sounds very far away.',
      'You have shared danger, desire, and promises. None of that answers the question she has carried across the mountain. Mara waits for an honest answer.',
      '“I know what you are willing to die for,” she says. “I need to know what you are willing to live for.”',
    ],
    choices: [
      {
        id: 'c7-mara-commit-equal',
        label: 'Tell Mara you want a life with her as your equal, not as someone waiting behind your duty.',
        detail: 'Make a clear commitment without pretending the road ahead will be safe.',
        advantage: 'Mara enters the coming battle certain of her place beside you.',
        changes: { resolve: 1 },
        addFlags: ['c7-mara-chosen-future'],
        result: 'You tell her there may be no quiet house for a long time, but there can be a shared life. Mara searches your face, finds no escape hidden there, and kisses you once with fierce relief. “Then survive long enough to argue about the house,” she says.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-mara-duty-first',
        label: 'Admit that duty still comes first, and ask her to stay only if she can live with that truth.',
        detail: 'Protect her freedom to choose, even if her answer costs you closeness.',
        advantage: 'No comforting lie can become a wound between you later.',
        addFlags: ['c7-mara-duty-before-future'],
        result: 'The truth tightens her mouth. She does not leave. She takes your hand and places it over her heartbeat. “I can live with danger,” she says. “I will not live with being forgotten inside it.”',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-mara-end-romance',
        label: 'Tell her you cannot promise the future she deserves.',
        detail: 'End the romance cleanly before fear and distance do it cruelly.',
        advantage: 'Painful honesty preserves the trust needed to survive the battle.',
        changes: { resolve: 1 },
        addFlags: ['c7-mara-romance-ended'],
        result: 'Mara looks away toward the red horizon. Hurt crosses her face, but she does not make you carry her answer. “Then I remain your Warden,” she says. “And when this is over, I choose where I go.”',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-mara-choose-friendship',
        label: 'Ask whether the two of you can keep the friendship beneath the desire.',
        detail: 'Release the romantic claim while naming the bond that still matters.',
        advantage: 'Mara knows that her place in your life does not depend on romance.',
        addFlags: ['c7-mara-friendship-chosen'],
        result: 'She studies you for a long moment, then bumps your shoulder with hers. “You still owe me three breakfasts and one apology,” she says. “Friendship does not cancel debts.” The smile is small, real, and sad.',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-lysara-future': {
    id: 'c7-lysara-future',
    kicker: 'Two duties, one road',
    title: 'The Treaty Between Two People',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Decide what your bond with Lysara means when your nations demand different things.',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Lysara joins you beneath the ridge with the living treaty wrapped around her injured hand. The red wind presses her travelling coat against the clean lines of her body, then releases it. Her calm expression does not hide how carefully she is watching you.',
      '“Asterra may call you traitor,” she says. “Thornweald may call me compromised. Attraction is easy while both kingdoms are trying to kill us. Partnership begins when they stop.”',
      'The attraction between you remains, alongside your respect for the difficult purpose that existed before you met. Asking her to abandon it would change the person you care about.',
      'She offers her good hand. “What are we building, Caelan?”',
    ],
    choices: [
      {
        id: 'c7-lysara-commit-equal',
        label: 'Promise a partnership that allows disagreement, distance, and two loyalties.',
        detail: 'Commit without asking either of you to abandon a kingdom or a cause.',
        advantage: 'Lysara trusts that love will not become another form of command.',
        changes: { resolve: 1 },
        addFlags: ['c7-lysara-chosen-future'],
        result: 'You take her hand and promise no obedience, only truth and return. Lysara draws you close. Her kiss is warm, deliberate, and entirely her decision. “A difficult treaty,” she murmurs. “Those are the ones worth signing.”',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-lysara-mission-first',
        label: 'Say the Nails must come first until the world is safe enough for promises.',
        detail: 'Delay commitment without pretending the attraction is gone.',
        advantage: 'Both of you enter the battle with a clear priority.',
        addFlags: ['c7-lysara-duty-before-future'],
        result: 'Lysara nods, although disappointment softens her eyes. “Then do not use the danger to take what you will not name in daylight,” she says. You agree. The boundary feels clean rather than cold.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-lysara-end-romance',
        label: 'Tell her your alliance is real, but the romance cannot survive what comes next.',
        detail: 'End the romantic bond without weakening the shared mission.',
        advantage: 'The two of you can plan without an unspoken promise distorting every risk.',
        changes: { resolve: 1 },
        addFlags: ['c7-lysara-romance-ended'],
        result: 'Lysara closes her fingers around yours once, then lets go. “I would rather lose an honest possibility than live inside a false certainty,” she says. When she turns back to the map, she still makes room beside her for you.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-lysara-choose-friendship',
        label: 'Ask for friendship strong enough to survive political disagreement.',
        detail: 'Choose trust and affection without a romantic claim.',
        advantage: 'Lysara remains personally loyal without confusing that loyalty with desire.',
        addFlags: ['c7-lysara-friendship-chosen'],
        result: 'Lysara thinks before answering. “Friendship is enough,” she says. Her thumb brushes your knuckles before she releases you. “That does not make it easy to break.”',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-ilyra-future': {
    id: 'c7-ilyra-future',
    kicker: 'Desire without surrender',
    title: 'The Truth Ilyra Cannot Steal',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Decide whether your attraction to Ilyra can become something chosen and honest.',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Ilyra washes red dust from her throat with the last water in a silver cup. The attraction you acknowledged at the Moot is still there. The slow lift of one eyebrow shows that she remembers it too.',
      'She can pull longing through a room like wire. Yet she has not touched your thoughts since the Red Moot without asking. That restraint matters more than the beauty she uses so expertly.',
      '“After this battle, I follow the hidden thread east,” she says. “I will not stay because a good man wants me. I might return because he interests me.”',
      'Her fingers settle lightly against your chest. “Do you want me, Captain, or do you want to win against me?”',
    ],
    choices: [
      {
        id: 'c7-ilyra-deepen-bond',
        label: 'Tell Ilyra you want her without owning her, and ask to kiss her.',
        detail: 'Move from interest to an honest, chosen romance.',
        advantage: 'Ilyra learns that desire can serve neither debt nor manipulation.',
        changes: { resolve: 1 },
        addFlags: ['c7-ilyra-bond-deepened'],
        result: 'She says yes. The teasing leaves her face before your mouths meet. Her kiss begins like a test and deepens when you refuse to turn it into a contest. When she steps back, both of you are breathing harder. “That,” she says softly, “was almost inconveniently sincere.”',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-ilyra-slow-interest',
        label: 'Admit the desire, but ask for time to learn who she is beyond her games.',
        detail: 'Keep the possibility open without letting danger rush consent or trust.',
        advantage: 'Interest survives without becoming another tool either of you can use.',
        addFlags: ['c7-ilyra-interest-kept'],
        result: 'Ilyra smiles, but there is no mockery in it. “You may discover I am worse,” she says. “Or better. I have not decided which would frighten you more.” She removes her hand, leaving the choice alive.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-ilyra-platonic-alliance',
        label: 'Tell her attraction is not enough, but the alliance is worth protecting.',
        detail: 'Choose respect without offering romance.',
        advantage: 'Ilyra knows exactly where the boundary stands.',
        addFlags: ['c7-ilyra-friendship-chosen'],
        result: 'A flash of pride crosses her face, followed by respect. “A boundary spoken before it is tested,” she says. “Rare. Keep it.” She offers her forearm, and you take it as an ally.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-ilyra-refuse-manipulation',
        label: 'Tell her you will not pursue intimacy while either of you might use it for leverage.',
        detail: 'Protect consent and judgment without condemning her nature.',
        advantage: 'The coming battle begins with no hidden personal bargain.',
        changes: { command: 1 },
        addFlags: ['c7-ilyra-leverage-refused'],
        result: 'Ilyra’s pride stiffens, then settles. “Fair,” she says. “Charm can still be a weapon. I know that better than most.” She steps away before the answer can become punishment.',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-quiet-watch': {
    id: 'c7-quiet-watch',
    kicker: 'A leader is not alone',
    title: 'Four Breaths Before Battle',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Use the last quiet minute to prepare the people who will stand with you.',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'There is no room in your mind for romance tonight, but there is still room for people. Mara checks your bandage without asking. Lysara redraws the eastern thread in dust. Korran stands watch while pretending not to listen.',
      'Korran offers you a cup that smells like boiled boot leather. “Steppe tea,” he says. “The steppe denies involvement.”',
      'A short laugh escapes before you can stop it. The army is close. Fear is closer. You can still decide what your companions carry into the fight.',
      'Mara tightens your bandage and asks, “What do you need from us?”',
    ],
    choices: [
      {
        id: 'c7-reassure-mara',
        label: 'Tell Mara she may overrule you if the dead command enters your voice.',
        detail: 'Give a trusted friend authority to stop you.',
        advantage: 'The group has a clear safeguard against magical control.',
        addFlags: ['c7-mara-can-stop-caelan'],
        result: 'Mara grips your wrist. “I will try words first,” she says. Korran coughs into his tea. She does not promise what comes second.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-plan-with-lysara',
        label: 'Help Lysara reduce the eastern thread to three facts everyone can remember.',
        detail: 'Turn dangerous knowledge into a simple battlefield warning.',
        advantage: 'Even frightened soldiers can recognize the hidden command.',
        changes: { command: 1 },
        addFlags: ['c7-three-fact-warning'],
        result: 'Together you reduce it to three truths: living orders arrive on paper, dead orders repeat, and the eastern voice fears questions. Every scout learns the warning before the next horn.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-ask-korran-truth',
        label: 'Ask Korran what the Kharad need from you rather than deciding for them.',
        detail: 'Listen before commanding people whose land has become your battlefield.',
        advantage: 'Korran gives you the one terrain warning that can prevent a massacre.',
        addFlags: ['c7-korran-salt-warning'],
        result: '“Do not break the white crust beneath a running horse,” Korran says. “The red brine below is deeper than a man.” The warning changes the shape of every plan in your mind.',
        next: 'c7-marshal-parley',
      },
      {
        id: 'c7-ask-lio-about-private-answer',
        label: 'Drink Korran’s terrible tea and rehearse today’s password with every scout.',
        detail: 'Practise the simple test Lio taught before the army relies on Evren again.',
        advantage: 'Every scout becomes able to challenge an order that arrives without a living officer.',
        changes: { resolve: 1 },
        addFlags: ['c7-knows-private-command-test'],
        result: 'The tea is worse than promised. You call the challenge until every scout can answer with the words changed at dawn. A memory can repeat yesterday forever. It cannot know today.',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-marshal-parley': {
    id: 'c7-marshal-parley',
    kicker: 'The loyal enemy',
    title: 'Marshal Teren Voss',
    location: 'The Black Ridge Truce Stones',
    objective: 'Make the Crown marshal doubt Malrec before the storm takes his army.',
    threat: 'Immediate',
    art: 'marshal',
    introducesStoryTerms: ['Marshal Teren Voss'],
    body: (state) => [
      'Marshal Teren Voss rides beneath a white truce cloth with twelve guards. He is older than you remember from the academy, but his back is still straight and his grey eyes still make every excuse feel childish.',
      'He trained officers to obey the Crown, not the person wearing it. That is why seeing him beneath Malrec’s banner hurts.',
      has(state, 'c7-lio-joined')
        ? 'Lio stands beside you and removes his helmet. Teren recognizes his own lieutenant among the accused.'
        : 'Mara keeps one hand near her sword. Teren notices and gives her the smallest nod of respect.',
      'Korran plants a black spear beside the truce stone. He explains the open ground rule in one sentence: if both leaders later accept a duel, each may stake one order before the witnesses. Teren touches the spear and says, “I accept that law while we stand on this ground.”',
      'The certainty in his face hurts more than contempt would. He believes Malrec’s charges because every official seal tells him to.',
      '“Captain Vey,” Teren says. “Yield the ember and submit to royal judgment. I will protect your wounded. Resist, and I end this before the red storm kills more of my soldiers.”',
      has(state, 'c6-oath-crown-restitution')
        ? 'The Oath you made at the Red Moot heats beneath your armour. You promised to bring the hidden Crown crime into public judgment. Teren and twelve royal witnesses are close enough to hear it.'
        : 'Teren has brought twelve royal witnesses. If you can make them question Malrec, the truth may travel farther than this battlefield.',
    ],
    choices: [
      {
        id: 'c7-invoke-crown-restitution-oath',
        label: 'Fulfil your Red Moot promise by placing Malrec’s crime before royal witnesses.',
        detail: 'Use the exact Oath you made to seek public judgment for the hidden Crown crime.',
        advantage: 'Teren must answer evidence supported by both Crown law and the Red Moot’s public record.',
        requiresFlags: ['c6-oath-crown-restitution'],
        addFlags: ['c7-crown-restitution-oath-advanced'],
        result: 'You name the private force, the extraction order, and the witnesses Malrec tried to silence. Korran confirms the Oath made before the Moot. Teren orders two guards to copy the charge for royal judgment.',
        next: 'c7-dead-marshal-rises',
      },
      {
        id: 'c7-show-gate-diversion',
        label: 'Show Teren the sealed order that emptied the Black Gate forts.',
        detail: 'Use the genuine document to prove Malrec moved the army before naming you a traitor.',
        advantage: 'Teren must confront a military fact that does not depend on trusting you.',
        requiresFlags: ['c7-copied-gate-diversion'],
        addFlags: ['c7-teren-saw-gate-order'],
        result: 'Teren reads the date twice. His face does not change, but his thumb covers Malrec’s seal as if ashamed to display it. “The replacement companies never arrived,” he admits.',
        next: 'c7-dead-marshal-rises',
      },
      {
        id: 'c7-appeal-queen-law',
        label: 'Invoke the Queen’s law that forbids abandoning a sealed border fort.',
        detail: 'Spend 1 Command making the dispute about Teren’s duty rather than your innocence.',
        advantage: 'Every officer at the parley hears a lawful reason to question the Regent.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-invoked-queen-border-law'],
        result: 'You recite the border article Teren once made you memorize in rain. Three of his guards look toward him. He cannot call the law false without denying his own teaching.',
        next: 'c7-dead-marshal-rises',
      },
      {
        id: 'c7-demonstrate-dead-order',
        label: 'Ask Teren to make the dead voice give today’s password.',
        detail: 'Use the limit you uncovered to expose a commander speaking from old memory.',
        advantage: 'The army can hear the supernatural deception for itself.',
        addFlags: ['c7-teren-tested-dead-command'],
        result: 'Teren calls the challenge. The storm answers with last winter’s password. His guards exchange frightened looks. A loyal army has just heard proof that one commander is only a voice wearing old memories.',
        next: 'c7-dead-marshal-rises',
      },
      {
        id: 'c7-offer-custody',
        label: 'Offer to enter Teren’s custody after he returns one company to the Gate.',
        detail: 'Risk imprisonment to force immediate protection for the abandoned forts.',
        advantage: 'Teren sees that your priority is the kingdom, not escape.',
        addFlags: ['c7-offered-teren-custody'],
        result: 'The offer silences the ridge. Teren studies you with the expression he used when a cadet finally understood the lesson. Before he can answer, every horn in his army sounds at once.',
        next: 'c7-dead-marshal-rises',
      },
    ],
  },

  'c7-dead-marshal-rises': {
    id: 'c7-dead-marshal-rises',
    kicker: 'The army turns without its marshal',
    title: 'Evren Gives the Order',
    location: 'The Black Ridge Truce Stones',
    objective: 'Survive the storm’s first attack without turning loyal soldiers into enemies.',
    threat: 'Critical',
    art: 'marshal',
    body: () => [
      'Marshal Evren’s voice rolls from a thousand brass horns. He has been dead nineteen years, yet every old signal is perfect.',
      '“Teren Voss is compromised. Caelan Vey means to open the eastern Gate with the stolen ember. Hold every western road until loyal replacements secure the forts.”',
      'Teren shouts a countermand. Half his officers obey him. Half obey the voice they learned to fear as children. The Crown March folds against itself, cavalry turning across infantry while the ancestor storm fills the gaps with dead banners.',
      'An arrow strikes the truce stone beside your head. You can escape easily. Keeping both armies from killing each other is harder.',
      'Your instincts pull you toward cover. Your duty pulls you toward the people still obeying the wrong voice.',
    ],
    choices: [
      {
        id: 'c7-command-parley-ring',
        label: 'Take command of the trapped parley guards and form one mixed shield ring.',
        detail: 'Spend 1 Command making enemies protect one another until the first charge passes.',
        advantage: 'The living officers see cooperation work before anyone asks them to trust it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-mixed-shield-ring'],
        result: 'Your order cuts through two sets of uniforms. Kharad riders and Crown guards lock shields together. The charge breaks around them instead of through them.',
        next: 'c7-battlefield-setup',
      },
      {
        id: 'c7-guard-teren',
        label: 'Pull Teren from the arrow line and make him keep countermanding Evren.',
        detail: 'Lose 1 Health protecting the living marshal whom both sides need to hear.',
        advantage: 'Teren stays visible and prevents more companies from joining the dead command.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c7-saved-teren-at-parley'],
        result: 'You strike Teren from the saddle as arrows cross above you. One cuts your shoulder. He rises furious, alive, and bellows the lawful retreat signal until three companies turn back.',
        next: 'c7-battlefield-setup',
      },
      {
        id: 'c7-oath-living-rank',
        label: 'Swear that no dead officer holds lawful rank over a living soldier.',
        detail: 'Spend 2 Oathfire placing a clear rule inside the command storm.',
        advantage: 'Any soldier who chooses the Oath becomes harder for Evren to control.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-living-command'],
        result: 'Gold fire crosses the ridge from shield to shield. Evren keeps shouting, but hundreds of soldiers hear the difference between memory and duty.',
        next: 'c7-battlefield-setup',
      },
      {
        id: 'c7-lio-private-answer',
        label: 'Have Lio challenge both commanders with today’s password.',
        detail: 'Use living Crown procedure instead of another copied voice.',
        advantage: 'Teren can answer from the ridge. The dead marshal cannot.',
        addFlags: ['c7-lio-used-private-answer'],
        showIfAnyFlags: ['c7-lio-prisoner', 'c7-lio-joined', 'c7-lio-under-guard'],
        result: 'Lio sounds the challenge across both ridges. Evren repeats his last order. Teren gives today’s password, and company after company turns toward the living voice.',
        next: 'c7-battlefield-setup',
      },
      {
        id: 'c7-teren-password-challenge',
        label: 'Sound today’s password challenge to Teren and Evren.',
        detail: 'Use the test Lio taught even though he has returned to the Crown ranks.',
        advantage: 'Teren can answer in person while Evren exposes his old memory before both forces.',
        showIfAnyFlags: ['c7-lio-returned'],
        addFlags: ['c7-caelan-used-password-test'],
        result: 'You sound the challenge across both ridges. Evren repeats his last order. Teren gives today’s password, and company after company turns toward the living voice.',
        next: 'c7-battlefield-setup',
      },
    ],
  },

  'c7-battlefield-setup': {
    id: 'c7-battlefield-setup',
    kicker: 'Choose what the battlefield preserves',
    title: 'Before the Red Wind Closes',
    location: 'The Salt Basin Rim',
    objective: 'Prepare one advantage before you commit to the decisive plan.',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => [
      'You retreat to the Salt Basin with Teren and the people still willing to hear him. The white ground looks solid.',
      saltWarning(state),
      `${redMootForces(state)} The Crown March fills the western rim in disciplined rows, even while its officers fight over whose voice is real.`,
      'The wind will close the basin in minutes. You have time to prepare one thing properly: the wounded, the evidence, the ground, or a verified living signal post.',
      'Your attention moves across the four needs. Preparing one means trusting someone else with the other three.',
    ],
    choices: [
      {
        id: 'c7-evacuate-wounded-ridge',
        label: 'Send Mara and the wounded to the stone ridge above the brine.',
        detail: 'Give up experienced fighters to remove the most vulnerable people from the trap.',
        advantage: 'The final battle cannot reach the wounded unless the ridge itself falls.',
        addFlags: ['c7-wounded-on-ridge'],
        result: 'Mara hates leaving your side, but she understands the arithmetic. She takes the wounded uphill and turns the ridge into a small fortress.',
        next: 'c7-defining-choice',
      },
      {
        id: 'c7-copy-orders-every-banner',
        label: 'Spend the last calm minutes copying Malrec’s orders onto every spare banner.',
        detail: 'Sacrifice concealment to make the evidence impossible to burn in one place.',
        advantage: 'Every company can see the dates even if the original document is lost.',
        addFlags: ['c7-orders-on-banners'],
        result: 'Lysara and the available scribes turn seals, dates, and fort numbers into marks large enough to read through red dust. The truth becomes battlefield equipment.',
        next: 'c7-defining-choice',
      },
      {
        id: 'c7-mark-safe-salt-lanes',
        label: 'Ride with Korran and mark the three salt lanes that can bear cavalry.',
        detail: 'Risk being caught away from cover to learn exactly where the ground will hold.',
        advantage: 'You can break the basin crust without drowning soldiers who choose to retreat.',
        addFlags: ['c7-safe-salt-lanes-marked'],
        result: 'You and Korran plant red reeds along three narrow lanes. Everywhere else, one hard impact will open the brine.',
        next: 'c7-defining-choice',
      },
      {
        id: 'c7-build-living-signal-post',
        label: 'Build one verified signal post with Teren.',
        detail: 'Use Caelan’s military knowledge and Teren’s current password to challenge false orders.',
        advantage: 'The post can redirect one full company at the exact moment you choose.',
        addFlags: ['c7-living-signal-post-ready'],
        result: 'Teren sets the flag height while you correct the challenge sequence. The finished post looks ordinary. Its danger lies in asking a question the dead cannot answer.',
        next: 'c7-defining-choice',
      },
    ],
  },

  'c7-defining-choice': {
    id: 'c7-defining-choice',
    kicker: 'How the Red Wind Hunt ends',
    title: 'Three Ways to Break an Army',
    location: 'The Salt Basin Rim',
    objective: 'Choose the plan that will decide what the Crown March believes about you.',
    threat: 'Critical',
    art: 'saltbattle',
    body: () => [
      'The Crown March forms for one final advance. They are your kingdom’s soldiers. Some are frightened. Some hate you. Most believe obedience is the only wall between Asterra and chaos.',
      'Teren can challenge the dead command, but he cannot make the army trust you. That part belongs to your actions.',
      'You have three ways to stop the army. You can trap its advance without slaughtering it. You can show Malrec’s orders to every rank.',
      'Or you can make Teren follow the duel rule he accepted at the truce stones. Each victory will give the soldiers a different reason to stop.',
      'Your hand moves from the salt map to Malrec’s papers and then to your sword. Each plan uses a different part of your training.',
    ],
    choices: [
      {
        id: 'c7-choose-salt-trap',
        label: 'Lead the army into the Salt Basin trap, then leave them a safe path out.',
        detail: 'Win through terrain and restraint. Soldiers may respect the mercy, but fear the humiliation.',
        advantage: 'The army loses its ability to pursue without suffering a massacre.',
        addFlags: ['c7-chose-salt-trap'],
        result: 'You raise the Kharad red pennant. Riders race toward the white basin, drawing the Crown cavalry after them while your marked escape lanes remain hidden.',
        next: 'c7-salt-trap',
      },
      {
        id: 'c7-choose-order-exposure',
        label: 'Carry Malrec’s sealed orders through the ranks and make every company choose.',
        detail: 'Risk yourself and the evidence in exchange for a public political victory.',
        advantage: 'Soldiers who turn do so by their own judgment, not because you defeated them.',
        addFlags: ['c7-chose-order-exposure'],
        result: 'Lysara lifts the sealed order. A white truce banner rises beside it. You ride toward the army with proof visible and no shield covering your face.',
        next: 'c7-order-exposure',
      },
      {
        id: 'c7-choose-steppe-duel',
        label: 'Ask Teren to stake one living order on the duel rule he accepted.',
        detail: 'Place the outcome on personal combat and his public promise at the truce stones.',
        advantage: 'A witnessed duel can give every soldier one clear order without claiming permanent command of either force.',
        addFlags: ['c7-chose-steppe-duel'],
        result: 'Korran plants the same black spear between the armies. Teren removes his marshal’s cloak and walks into the circle. “One order,” he says. “Then every soldier decides what follows.”',
        next: 'c7-steppe-duel',
      },
    ],
  },

  'c7-salt-trap': {
    id: 'c7-salt-trap',
    kicker: 'Mercy shaped like a trap',
    title: 'The White Ground Breaks',
    location: 'The Salt Basin',
    objective: 'Stop the advance without drowning the soldiers caught inside it.',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => [
      'Crown cavalry pours onto the white crust. Beneath them, the salt groans like lake ice.',
      has(state, 'c7-safe-salt-lanes-marked')
        ? 'Your red reeds show exactly where the ground will hold. The safe lanes are narrow, but they exist.'
        : 'Korran points toward darker salt where the crust may hold. You must trust his eye while hundreds of horses close behind you.',
      'Breaking the whole crust would stop the army and drown the riders caught above the brine. A curved break would trap the army while leaving one firm road back.',
      'You feel every pursuing hoof through the crust. One early strike would turn restraint into slaughter.',
    ],
    choices: [
      {
        id: 'c7-command-merciful-trap',
        label: 'Command both armies through the safe lanes before breaking the centre.',
        detail: 'Spend 2 Command coordinating enemies who have no reason to trust one another.',
        advantage: 'The trap closes on weapons and horses rather than people.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-salt-trap-merciful'],
        result: 'Your timing holds. Kharad riders cross first, Crown soldiers follow the shouted lane markers, and the centre collapses only after the last trapped horse reaches firm ground.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-guard-brine-break',
        label: 'Ride beneath the lead company and cut their harnesses before the crust falls.',
        detail: 'Lose 2 Health saving the riders nearest the break by hand.',
        advantage: 'The rescued company sees that you risked your life for soldiers hunting you.',
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c7-saved-crown-cavalry'],
        result: 'You cut three riders free before red water swallows their saddles. A hoof strikes your side and turns the world white, but Crown hands pull you onto firm salt.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-oath-safe-retreat',
        label: 'Bind the marked retreat lane to anyone who lowers a weapon.',
        detail: 'Spend 2 Oathfire making surrender create a path across the failing ground.',
        advantage: 'Every soldier receives a visible, personal choice between Evren and safety.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-surrender-road'],
        result: 'Gold steps appear beneath every lowered weapon. Swords strike salt by the hundred. The dead marshal screams for obedience while the living walk away from him.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-living-signal-block',
        label: 'Use the living signal sequence to turn the lead company onto firm ground at the wrong angle.',
        detail: 'Lose the prepared signal post after one decisive command.',
        advantage: 'The company blocks the remaining advance and prevents the mass charge.',
        showIfAnyFlags: ['c7-living-signal-post-ready'],
        addFlags: ['c7-living-signal-spent', 'c7-crown-column-blocked'],
        result: 'Teren gives today’s password from the prepared post. One full company turns safely across the basin and jams the advance behind it. Evren cannot move through the confusion.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-sacrifice-supply-wagon-block',
        label: 'Roll your supply wagon across the firm lane and break its axle.',
        detail: 'Lose most of the food and spare arrows needed for the Gate journey.',
        advantage: 'The wreck blocks the mass charge while keeping the riders on solid ground.',
        hideIfAnyFlags: ['c7-living-signal-post-ready'],
        addFlags: ['c7-lost-gate-supplies', 'c7-crown-column-blocked'],
        result: 'You cut the axle as the wagon crosses the firm lane. It collapses between the lead horses and the army behind them. The charge ends without opening the brine, but the road east just became hungrier.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-order-exposure': {
    id: 'c7-order-exposure',
    kicker: 'Truth carried under arrows',
    title: 'Every Rank Must See',
    location: 'The Crown March Lines',
    objective: 'Make the army see Malrec’s real orders before the evidence or its bearers are destroyed.',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => [
      'You enter the first rank with Malrec’s seal held above your head. Soldiers lower spears, raise them again, and look toward officers receiving two different commands.',
      has(state, 'c7-orders-on-banners')
        ? 'Copies of the fort dates rise on Kharad banners behind you. Burning one page can no longer bury the truth.'
        : 'The original order in Lysara’s hand is the only proof the whole army might accept. Every archer can see it.',
      'The truth is simple: Malrec emptied the Gate forts before accusing you, and no replacement ever arrived. Reaching every rank alive is not simple.',
      'Your eyes keep finding young faces behind the spearheads. They look like Wardens on their first frightened march.',
    ],
    choices: [
      {
        id: 'c7-command-rank-by-rank',
        label: 'Use the army’s own call and reply to carry the dates rank by rank.',
        detail: 'Spend 2 Command turning military discipline against the false order.',
        advantage: 'The facts spread faster than officers can confiscate the pages.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-orders-reached-every-rank'],
        result: 'You call the first fort and date. One hundred voices repeat it. By the fourth fort, the entire basin is speaking Malrec’s betrayal aloud.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-guard-lio-through-lines',
        label: 'Guard Lio while he carries the original order to his fellow lieutenants.',
        detail: 'Lose 2 Health keeping the living witness and document together.',
        advantage: 'A trusted Crown officer delivers proof in his own voice.',
        showIfAnyFlags: ['c7-lio-joined'],
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c7-lio-carried-orders'],
        result: 'You take a spear cut meant for Lio and keep moving. At every company he names the missing replacements. Officers who would shoot you cannot shoot one of their own without showing what they serve.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-oath-seals-speak',
        label: 'Make Malrec’s two genuine seals answer which order came first.',
        detail: 'Spend 2 Oathfire forcing lawful documents to reveal their order of issue.',
        advantage: 'The seals prove that the Gate diversion began before the charges against you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-seals-proved-sequence'],
        result: 'Gold fire links the seals. The older order points east to the empty forts. The newer accusation points at you. Thousands see that Malrec prepared the danger before he named its criminal.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-lio-delivers-orders',
        label: 'Let Lio carry signed copies through the Crown ranks.',
        detail: 'Use his real uniform and name while you draw the archers toward yourself.',
        advantage: 'A living lieutenant reaches officers who would never accept a page from you.',
        showIfAnyFlags: ['c7-lio-joined'],
        addFlags: ['c7-lio-delivered-orders'],
        result: 'Lio walks into the ranks with his empty sword hand raised and his name written on every page. You keep the archers facing you while the evidence passes from officer to officer behind their shields.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-lio-spreads-proof-from-within',
        label: 'Signal Lio to release the copies already moving inside the Crown ranks.',
        detail: 'Trust the officer you released to reveal himself at the decisive moment.',
        advantage: 'The evidence appears behind the front line where your messengers could never reach.',
        showIfAnyFlags: ['c7-lio-returned'],
        addFlags: ['c7-lio-exposed-orders-inside-army'],
        result: 'Your white flag rises. Copies appear inside the second and fourth companies as Lio’s earlier questions become open accusation. Officers turn on their own signal fires and read the dates aloud.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-use-lio-witness-statement',
        label: 'Carry Lio’s signed witness statement while Lysara carries the order.',
        detail: 'Use his limited testimony without presenting him as a volunteer or deserter.',
        advantage: 'The army sees a genuine order and a lawful account of where it came from.',
        showIfAnyFlags: ['c7-lio-prisoner', 'c7-lio-under-guard'],
        addFlags: ['c7-lio-testimony-reached-ranks'],
        result: 'Lysara raises the order while you read Lio’s narrow statement. It does not declare you innocent. It confirms the seals, the dates, and the missing messenger behind Evren’s voice. That is enough to make the first officers lower their spears.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-steppe-duel': {
    id: 'c7-steppe-duel',
    kicker: 'One fight for two armies',
    title: 'The Law of Open Ground',
    location: 'The Salt Basin Circle',
    objective: 'Defeat Teren without turning a loyal marshal into a martyr.',
    threat: 'Critical',
    art: 'marshal',
    body: () => [
      'The rule Teren accepted is plain: each leader stakes one order before the witnesses. No magic forces obedience. Crown officers honour the result because their marshal gave his word in public. The loser keeps life and honour.',
      'Teren circles with a long sabre. He taught you to protect the hand before the heart and to distrust an opponent who looks tired. You are tired enough to be convincing.',
      '“If I win, you yield the ember,” he says.',
      '“If I win, every soldier chooses whether the dead still command the living.”',
      'Teren salutes. The red wind erases everything beyond the circle.',
      'Your training returns in the set of his shoulders. He taught you this stance, and he will expect the answer he taught with it.',
    ],
    choices: [
      {
        id: 'c7-outlast-teren',
        label: 'Take Teren’s cuts and outlast the stronger fighter.',
        detail: 'Lose 2 Health to learn his rhythm and win without a killing blow.',
        advantage: 'Teren survives and publicly yields under the law he accepted.',
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c7-defeated-teren-mercifully'],
        result: 'His sabre opens your arm and side. You let him believe the second cut slowed you, catch his wrist on the next pass, and put him on the salt with your blade at his throat. You offer your hand instead of death.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-command-terens-cadence',
        label: 'Use the academy cadence Teren taught you to force his familiar response.',
        detail: 'Spend 2 Command turning his own lesson into one decisive opening.',
        advantage: 'The watching officers recognize skill rather than magical coercion.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-won-by-terens-lesson'],
        result: 'You call the training count under your breath. Teren answers it without thinking. On the fourth beat, you change the cut and send his sabre spinning into the salt.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-oath-equal-ground',
        label: 'Swear that neither Malrec nor the dead marshal may touch the duel.',
        detail: 'Spend 2 Oathfire creating one circle where only your choices and Teren’s remain.',
        advantage: 'The army witnesses a victory free from hidden command or royal pressure.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-duel-on-equal-ground'],
        result: 'Gold fire closes the circle. Evren’s voice disappears. Teren looks suddenly older without it, but also free. You fight until his knee touches salt, and he yields by his own will.',
        next: 'c7-many-or-one',
      },
      {
        id: 'c7-make-teren-see-gate',
        label: 'Refuse the first opening and make Teren look east at the empty forts.',
        detail: 'Risk losing the duel to force the real battlefield back into his mind.',
        advantage: 'Teren lowers his weapon because of his duty, not because you overpower him.',
        addFlags: ['c7-teren-yielded-for-gate'],
        result: 'You let his blade stop at your throat. “Win,” you say, “and the whole army remains here while the Gate has no replacement force.” Teren follows your gaze east. Then he drops the sabre himself.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-many-or-one': {
    id: 'c7-many-or-one',
    kicker: 'Command or guard',
    title: 'The Last Dead Order',
    location: 'The Salt Basin',
    objective: 'Choose what Caelan’s strength protects when Evren tears open the battlefield.',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => {
      const ally = endangeredAlly(state);
      return [
        'Your plan works. The Crown advance stops. Living officers lower their weapons, and for one clear breath the battle is over.',
        has(state, 'c7-wounded-on-ridge')
          ? `Then Evren spends everything left in the storm. Mara and the wounded remain safe on the ridge you prepared. A wall of red wind crosses the basin below. One broken company stands in its path. ${ally} is trapped beneath a fallen signal frame on the opposite side.`
          : `Then Evren spends everything left in the storm. A wall of red wind crosses the basin. One broken company stands in its path. ${ally} is trapped beneath a fallen signal frame on the opposite side.`,
        'Command can move hundreds before the wall strikes. Your own hands can reach one person in time. Oathfire might protect both, but only by burning the original Gate orders that anchor the truth.',
      ];
    },
    choices: [
      {
        id: 'c7-save-many-command',
        label: 'Command the broken company to safety and trust your ally to endure.',
        detail: 'Spend 2 Command saving many soldiers. The trapped companion will survive with a lasting injury.',
        advantage: 'Hundreds escape the storm and remember whose order saved them.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-saved-many', 'c7-ally-lasting-injury'],
        result: 'You give the route, pace, and final turn. The company moves as one and clears the red wall. By the time you reach your companion, the signal frame has crushed bone, but not life.',
        next: 'c7-army-future',
      },
      {
        id: 'c7-save-one-health',
        label: 'Run through the red wind and lift the frame from your ally.',
        detail: 'Lose 2 Health saving one companion. The broken company suffers severe losses before Teren reaches it.',
        advantage: 'The person who trusted you does not become the price of a larger calculation.',
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c7-saved-one', 'c7-company-storm-losses'],
        result: 'The wind cuts exposed skin like hot sand. You reach the frame, lift until your wounded side tears open, and pull your companion free. Behind you, Teren saves part of the company, but not all of it.',
        next: 'c7-army-future',
      },
      {
        id: 'c7-burn-proof-for-both',
        label: 'Feed the original Gate orders into an Oath that shelters both groups.',
        detail: 'Spend 2 Oathfire and destroy the strongest legal evidence against Malrec.',
        advantage: 'Both the company and your trapped ally survive the final storm.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-saved-both-burned-proof'],
        result: 'Malrec’s seals burn gold in your hand. A shelter forms over the company and the fallen frame. Everyone lives, but the proof that could lawfully remove the Regent becomes ash.',
        next: 'c7-army-future',
      },
      {
        id: 'c7-lio-crosses-for-one',
        label: 'Hold the company together while Lio crosses the falling signal frame for your ally.',
        detail: 'Lio abandons his Crown badge and lands inside the enemy line after the rescue.',
        advantage: 'Many survive and your ally escapes, but Lio becomes a named deserter who may be captured.',
        showIfAnyFlags: ['c7-lio-joined'],
        addFlags: ['c7-lio-stranded-after-rescue', 'c7-saved-many-with-lio'],
        result: 'Your command opens a narrow path for the company. Lio cuts away his officer’s coat, crawls across the falling frame, and frees your companion. He lands on the wrong side of three hundred uncertain soldiers with both hands raised.',
        next: 'c7-army-future',
      },
      {
        id: 'c7-teren-sends-engineers',
        label: 'Hold the company together while Teren sends two engineers across the frame.',
        detail: 'Save both groups at the cost of Teren’s shoulder and the army’s clean command during the retreat.',
        advantage: 'Your ally and the company survive without placing Lio somewhere his earlier choice did not leave him.',
        hideIfAnyFlags: ['c7-lio-joined'],
        addFlags: ['c7-saved-many-with-teren', 'c7-teren-lasting-injury'],
        result: 'Your command opens a narrow path for the company. Teren and two engineers cross the falling frame and free your ally. The frame tears Teren’s shoulder before they land, leaving the army to finish the retreat under divided officers.',
        next: 'c7-army-future',
      },
    ],
  },

  'c7-army-future': {
    id: 'c7-army-future',
    kicker: 'Victory creates followers',
    title: 'Who Marches East',
    location: 'The Quiet Salt Basin',
    objective: 'Decide what kind of force will answer the danger at the Black Gate.',
    threat: 'Immediate',
    art: 'marshal',
    body: (state) => [
      'The ancestor storm collapses. For the first time all day, the voices in the wind belong to living people.',
      has(state, 'c7-saved-many') || has(state, 'c7-saved-many-with-lio') || has(state, 'c7-saved-many-with-teren')
        ? 'Soldiers gather around the people your command saved. Their gratitude is real, but so is their habit of waiting for another order.'
        : has(state, 'c7-saved-both-burned-proof')
          ? 'No bodies lie beneath the last red wall. Malrec’s orders are ash, so the soldiers must decide from what they witnessed rather than what a seal can prove.'
          : 'The companion you carried from the storm remains beside you. Across the basin, empty places in the Crown ranks show the cost of that rescue.',
      'Teren removes Malrec’s badge from his cloak and holds out the field standard. A full army could defend all eight forts. It would also bring divided loyalties into every fort.',
      'You may lead every willing rank. You may take only a smaller company that chooses the road freely.',
      'Or you may refuse formal followers and let your dangerous reputation reach the Gate before you do.',
      steppePromises(state),
      'Behind Teren, the soldiers wait to see whether you take the standard, ask for volunteers, or leave command in his hands.',
    ],
    choices: [
      {
        id: 'c7-take-full-army',
        label: 'Accept command of the Crown March and turn the full army east.',
        detail: 'Gain the strength to defend every fort, along with thousands trained to obey before questioning.',
        advantage: 'Caelan reaches the Black Gate with a full army and Teren’s authority.',
        changes: { wayfire: 2 },
        hideIfAnyFlags: ['c6-oath-honest-limit'],
        addFlags: ['c7-gained-full-army'],
        result: 'You accept Teren’s field standard and order the entire Crown March east. The answer rolls through the basin like thunder. It is enough power to save a kingdom or frighten one into war.',
        next: 'c7-ending-army',
      },
      {
        id: 'c7-take-chosen-company',
        label: 'Ask for volunteers and take only those who choose the Black Gate with open eyes.',
        detail: 'Leave most of the army under Teren while building a smaller force around consent and trust.',
        advantage: 'Caelan gains a disciplined company without inheriting the whole army’s divided loyalty.',
        changes: { wayfire: 2 },
        addFlags: ['c7-gained-chosen-company'],
        result: 'You ask once and make no speech. Soldiers step forward by tens, then hundreds. Kharad riders remain under their Moot commanders, and any clan may leave after the Gate is safe. Teren turns the remaining army east under his own command.',
        next: 'c7-ending-company',
      },
      {
        id: 'c7-take-no-formal-allies',
        label: 'Refuse command and make Teren lead the Crown March east himself.',
        detail: 'Travel fast with your existing companions while relying on reputation rather than formal allies.',
        advantage: 'The forts still receive soldiers, but no divided army enters them under your personal command.',
        changes: { wayfire: 2 },
        addFlags: ['c7-gained-dangerous-reputation'],
        result: 'You return Teren’s standard and order nothing. Teren chooses the Gate himself. His army turns east on a separate road while you ride ahead with the companions who already chose you. By sunset, the story of your refusal is moving faster than either force.',
        next: 'c7-ending-outlaw',
      },
    ],
  },

  'c7-ending-army': {
    id: 'c7-ending-army',
    kicker: 'Chapter Seven complete',
    title: 'The Army That Chose Again',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate fort ring before the hidden power strikes again.',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'The Crown March turns east beneath Caelan Vey’s command. Kharad scouts ride ahead. Asterra engineers follow. People who began the day as enemies now share water and watch the same red horizon.',
      steppePromises(state),
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      ...chapterSevenBattleRecord(state),
      fortHorizon(),
      'Then the Gate knocks from the other side.',
    ],
    choices: [],
  },

  'c7-ending-company': {
    id: 'c7-ending-company',
    kicker: 'Chapter Seven complete',
    title: 'The Company of Open Eyes',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate fort ring before the hidden power strikes again.',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'Your chosen company rides east without a royal banner. Every soldier stepped forward freely. That does not make them fearless. It makes their fear honest.',
      steppePromises(state),
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      ...chapterSevenBattleRecord(state),
      'Teren follows on a separate eastern road with the remaining army under his own command. Your volunteers will reach the forts first. His force will arrive later without belonging to you.',
      fortHorizon(),
      'Then something vast knocks from the other side.',
    ],
    choices: [],
  },

  'c7-ending-outlaw': {
    id: 'c7-ending-outlaw',
    kicker: 'Chapter Seven complete',
    title: 'The Name That Reached the Gate First',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate fort ring before the hidden power strikes again.',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'You ride east with the people who already chose you. No new banner follows your line. Behind and south, Teren leads the Crown March toward the Gate under his own command. Its soldiers carry the same story: Caelan Vey defeated the Regent’s hunt, spared its army, and refused to own it.',
      steppePromises(state),
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      ...chapterSevenBattleRecord(state),
      'Teren sends copies of Malrec’s orders toward Greyhaven while his living officers continue east. Your faster road reaches the fort ring first.',
      fortHorizon(),
      'Then the entire eastern wall shudders beneath one slow knock from the other side.',
    ],
    choices: [],
  },
};
