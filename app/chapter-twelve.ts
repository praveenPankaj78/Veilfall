import type { GameState, StoryNode } from './game-data';
import { finalePromiseNotes } from './promise-records';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

function innerCompany(state: GameState) {
  const people = ['Vexa'];
  if (has(state, 'c9-roster-futureless'))
    people.push('Ansel and two Futureless witnesses');
  if (has(state, 'c9-roster-pell'))
    people.push('wounded Pell and his shield escort');
  else if (has(state, 'c9-roster-wardens'))
    people.push('mixed wardens and Moot fighters');
  if (has(state, 'c9-roster-crown'))
    people.push('Teren and six Crown volunteers');
  if (has(state, 'c9-mara-crossed-black-gate')) people.push('Mara');
  if (has(state, 'c9-lysara-crossed-black-gate')) people.push('Lysara');
  return people.join(', ');
}

function routeSupport(state: GameState) {
  if (has(state, 'c11-route-revolt'))
    return 'Named Free Ledger refusers spread their own witness cords across the inner arch. They protect speakers, but they do not claim authority over anyone else.';
  if (has(state, 'c11-route-auction'))
    return 'Price Court dissenters raise the invasion right, a one-opening paper that still allows one Gate opening, one named force, and one bell. It delays every force not named at auction. It admits only the named force. It owns no person, fragment, voice, or part of Edrath.';
  return 'Ash Compact witnesses hold the damaged engine corridor beside this company. Their help still costs one witnessed crossing after this opening stops.';
}

function mortalFace(state: GameState) {
  const lines = ['Korran stands behind the mortal shield line'];
  if (has(state, 'c8-sacrificed-first-fort'))
    lines.push('First Fort is a smoking gap with no survivors inside it');
  else lines.push('First Fort answers with its surviving bell');
  if (has(state, 'c7-gained-full-army'))
    lines.push('The Crown force you earned holds its recorded posts');
  else if (has(state, 'c7-gained-chosen-company'))
    lines.push('The chosen Crown company holds its narrow sector');
  else lines.push('No formal Crown army fills the empty road');
  if (has(state, 'c9-mara-remained-at-gate'))
    lines.push('Mara waits at the mortal face');
  if (has(state, 'c9-lysara-remained-at-gate'))
    lines.push('Lysara waits beside the fortress locks');
  return `${lines.join('. ')}.`;
}

function fragmentPosition(state: GameState) {
  if (has(state, 'c9-route-bargain')) {
    if (has(state, 'c9-cut-true-name-clause'))
      return 'The fragment rests in its neutral case. Magic that can point to one person ended when its single pointing clause was cut. The return promise still waits.';
    return 'The fragment rests in its neutral case. Vexa may find its bearer only for the witnessed pointing and return. That pointing reaches nothing else.';
  }
  if (has(state, 'c9-route-theft'))
    return 'The admitted stolen fragment burns in public view. The Compact claim follows it, but no neutral return promise was created.';
  return 'The fragment remains inside its public evidence frame. House Sableglass lost private holding when its alliance with Malrec was exposed.';
}

function destroyedOathCost(state: GameState) {
  if (has(state, 'c9-destroyed-red-moot-authority-oath'))
    return 'The Red Moot authority Oath is destroyed. Moot fighters choose their own speaker, and you cannot nominate one for them.';
  if (has(state, 'c9-destroyed-crown-restitution-oath'))
    return 'The promise to bring the Concord’s hidden victims before the Queen is destroyed. Harmed communities must state their claim without your lost promise speaking for them.';
  if (has(state, 'c9-destroyed-clan-refusal-oath'))
    return 'The clan refusal Oath is destroyed. A joint passage law now needs an extra public refusal review.';
  if (has(state, 'c9-destroyed-honest-command-limit-oath'))
    return 'The honest command limit is destroyed. No mythic force can strengthen your authority, so each unit repeats its accepted limit aloud.';
  if (has(state, 'c9-destroyed-unsea-investigation-oath'))
    return 'The Unsea investigation Oath is destroyed. You may record the engine voice as unverified, but you cannot claim deeper knowledge.';
  if (has(state, 'c8-released-crown-oath'))
    return 'The Crown service Oath remains released. It offers no power and gives the Crown no ownership of your decision.';
  if (has(state, 'c8-burned-lesser-oath'))
    return 'The lesser patrol Oath remains ash. Its old duty cannot pull you away or strengthen the new law.';
  return 'Your surviving Oaths warm without offering themselves as currency. Each can support only the people named in its own words.';
}

function vaorAtGate(state: GameState) {
  if (has(state, 'c9-forced-collateral-broken'))
    return 'The forced holding of Vaor’s outer flame is broken. Vaor’s ember refuses the engine and leaves a hot scar where stolen authority failed.';
  if (has(state, 'c9-vaor-collateral-released'))
    return 'Vaor’s outer flame was freely released. It creates no new claim here, while any separate willing gift keeps only its recorded scope.';
  if (hasAny(state, ['c9-vaor-gift-proof-guard', 'c5-freed-vaor']))
    return 'Vaor’s willing ember brightens at one false engine pulse. Its gift permits a test, not command of Vaor or proof about Elian.';
  if (hasAny(state, ['c9-vaor-pact-proof-carried', 'c5-vaor-pact']))
    return 'Vaor’s pact ember waits for a direct request. He may answer or refuse this use under the pact.';
  if (hasAny(state, ['c9-stolen-ember-not-used', 'c5-took-ember-by-force']))
    return 'The stolen ember stays dark. Vaor refused this proof use, and need cannot turn theft into permission.';
  return 'No permitted dragon ember answers the engine. The public mechanical test remains complete.';
}

function injuryPressure(state: GameState) {
  const pressures: string[] = [];
  if (state.stats.health <= 2) pressures.push('Your injured leg shakes');
  if (state.stats.resolve <= 1)
    pressures.push('the engine voices crowd your attention');
  if (state.stats.medicine <= 0)
    pressures.push('the company has no Medicine left');
  if (hasAny(state, ['c7-wounded-on-ridge', 'c7-ally-lasting-injury']))
    pressures.push('the ridge injuries still limit the shield pace');
  if (has(state, 'c7-teren-lasting-injury'))
    pressures.push('Teren cannot hold a forward brace');
  if (
    hasAny(state, [
      'c7-lost-gate-supplies',
      'c7-spent-supplies-on-decoys',
      'c10-supplies-depleted',
    ])
  )
    pressures.push('the last sealed supplies are gone');
  if (pressures.length === 0)
    return 'The company has enough breath to choose its next position, though nobody is unhurt.';
  const pressure = pressures.join(', ');
  return `${pressure[0].toUpperCase()}${pressure.slice(1)}. The slower shield route remains open without spending your remaining strength.`;
}

function offerMethodAtGate(state: GameState) {
  if (has(state, 'c10-offer-method-shared'))
    return has(state, 'c10-private-desires-exposed')
      ? 'The shared offer ledger predicts each copied spark, while Sableglass can still aim at desires their owners exposed.'
      : 'The shared offer ledger compares every copied term and only the motives their owners allowed.';
  if (has(state, 'c10-offer-method-private'))
    return 'Private seals keep each desire closed. Their separate safety marks reveal the real sparks more slowly.';
  if (has(state, 'c10-burden-oath-withdrawn'))
    return 'The burden Oath was withdrawn before binding. It offers no group shield and leaves no accounting debt.';
  if (has(state, 'c10-offer-method-oath'))
    return has(state, 'c10-oath-traveller-withdrew')
      ? 'The ended burden bands preserve every private account except the traveller who withdrew, whose choice remains their own.'
      : 'The burden Oath ended at Vathis. Its separate private accounts identify who owns each returning temptation.';
  return 'An older expedition record names no offer method, so public observation supplies the slower safe route.';
}

function elianRecord(state: GameState) {
  if (has(state, 'c11-elian-public-opposition'))
    return 'The voice identifying herself as Elian repeats the public warning already heard in Vathis. “The left conduit copies his memory. Break its claim, not the person inside his memory.”';
  if (has(state, 'c11-elian-channel-protected'))
    return 'The protected engine channel carries the voice identifying herself as Elian. She names the left conduit and refuses to become anyone’s property or proof of death.';
    return 'The limited record opens once. A voice identifying herself as Elian names the left conduit, opposes Malrec’s merger, and makes no claim about what or where she is.';
}

function relationshipPresence(state: GameState) {
  if (
    ['committed', 'exploring', 'interested'].includes(
      state.relationships.mara.intent,
    ) &&
    hasAny(state, ['c9-mara-crossed-black-gate', 'c9-mara-remained-at-gate'])
  ) {
    return has(state, 'c9-mara-crossed-black-gate')
      ? 'Mara stands beside you on the inner face. Her answer is her own.'
      : 'Mara stands on the mortal face. The open Gate now lets you speak, but it does not move her across.';
  }
  if (
    ['committed', 'exploring', 'interested'].includes(
      state.relationships.lysara.intent,
    ) &&
    hasAny(state, [
      'c9-lysara-crossed-black-gate',
      'c9-lysara-remained-at-gate',
    ])
  ) {
    return has(state, 'c9-lysara-crossed-black-gate')
      ? 'Lysara stands beside you on the inner face. She keeps one hand on her own lock tools.'
      : 'Lysara is visible at the mortal locks. The breach carries speech, not automatic passage or consent.';
  }
  if (
    ['committed', 'exploring', 'interested'].includes(
      state.relationships.vexa.intent,
    ) &&
    !hasAny(state, [
      'c9-vexa-permanent-hostility',
      'c9-refused-private-connection',
    ])
  )
    return 'Vexa stands beside the inner seal. She offers no promise until you ask what future she freely wants.';
  if (
    hasAny(state, [
      'c9-vexa-permanent-hostility',
      'c9-refused-private-connection',
    ])
  )
    return 'Vexa keeps the exact political distance already agreed. No romantic choice appears in her silence.';
  if (
    ['committed', 'exploring', 'interested'].includes(
      state.relationships.ilyra.intent,
    )
  )
    return 'You remember Ilyra choosing her own road east. No message has arrived, and she cannot answer here. You may keep the possibility open or release your own hopes.';
  return 'No partner owns this hour. Friendship and a full single life remain complete futures.';
}

function vexaAtBoundary(state: GameState) {
  if (has(state, 'c9-vexa-permanent-hostility'))
    return 'Vexa names the fragment socket from beyond weapon reach. Permanent hostility permits this required threat warning and nothing private.';
  if (has(state, 'c9-refused-private-connection'))
    return 'Vexa keeps the refused private boundary and discusses only the public fragment terms.';
  if (has(state, 'c9-shared-private-night'))
    return 'Vexa meets your eyes, then addresses the witness line. Your private history changes her care, not the fragment price or consent.';
  if (has(state, 'c9-vexa-attraction-acknowledged'))
    return 'Vexa’s attraction remains acknowledged and does not decide who holds the fragment. She asks the public witnesses to check every term.';
  if (has(state, 'c9-vexa-guarded-trust'))
    return 'Vexa uses her guarded trust to hold the neutral case steady without claiming it.';
  if (has(state, 'c9-vexa-adversarial-respect'))
    return 'Vexa names the socket before using the fact against you, exactly as adversarial respect requires.';
  return 'Vexa keeps to the public witness line and claims no private access.';
}

function destinationResult(state: GameState) {
  if (has(state, 'c12-destination-road'))
    return has(state, 'c12-gatekeeper')
      ? 'You choose the boundary road. The Gate travels in you, so you may walk but never live wholly in either realm.'
      : 'You choose the road and the work of answering what this new border sends into the world.';
  if (has(state, 'c12-destination-fortress'))
    return has(state, 'c12-gate-broken')
      ? 'You choose to rebuild shelters and warning posts around the broken boundary without claiming ownership of it.'
      : 'You choose the fortress ring and the long work of rebuilding its authority under the new law.';
  if (has(state, 'c12-destination-threshold'))
    return has(state, 'c12-gate-broken')
      ? 'You choose to patrol the broken boundary where the threshold once stood.'
      : 'You choose the threshold and its daily watch.';
  if (has(state, 'c12-gate-sealed'))
    return 'You choose the Cinder Deep face before the seal closes and accept the separation that follows.';
  if (has(state, 'c12-gatekeeper'))
    return 'You travel the Cinder Deep edge of the living Gate, but the carried boundary prevents you from belonging wholly to that realm.';
  return 'You choose to disappear into the Cinder Deep under the exact crossing law you made.';
}

function relationshipResult(state: GameState) {
  if (has(state, 'c12-relationship-together'))
    return 'You choose a continued partnership. It grants no command, passage, or protection from the Gate law.';
  if (has(state, 'c12-relationship-distance'))
    return 'You leave the future open across distance without claiming a new answer or promising an impossible return.';
  if (has(state, 'c12-relationship-friendship'))
    return 'You choose friendship and preserve the other person’s limits.';
  if (has(state, 'c12-relationship-closed'))
    return 'You release your remaining romantic hopes. No earlier intimacy obliges anyone to begin again.';
  if (has(state, 'c12-relationship-political-truce'))
    return 'You and Vexa choose a public ceasefire with named limits. It creates no trust, intimacy, passage, or private access.';
  return 'You choose a full single life. It costs no strength and weakens no world outcome.';
}

function custodyResult(state: GameState) {
  if (has(state, 'c12-fragment-return-fulfilled'))
    return 'The neutral keepers receive the fragment. The owned return promise completes and releases its claim.';
  if (has(state, 'c12-fragment-custody-amended'))
    return 'Every required living keeper records a free yes. Who holds the fragment changes with the new Gate body, and nobody else gains a claim.';
  if (has(state, 'c12-fragment-return-breached'))
    return 'You keep the fragment against the owned return promise. A bright Oathscar crosses your palm, and Vexa records the breach.';
  if (has(state, 'c12-theft-restitution-submitted'))
    return 'You submit the admitted stolen fragment to witnesses. The theft claim ends without becoming a neutral promise.';
  if (has(state, 'c12-theft-claim-retained'))
    return 'You keep the fragment in public view. The Compact’s theft claim remains active after the battle.';
  if (has(state, 'c12-exposure-public-custody'))
    return 'The public witness circle keeps the exposed fragment. No house or hero owns it.';
  if (has(state, 'c12-legacy-fragment-public-custody'))
    return 'The fragment whose owner has not yet been recorded in public rests in public keeping. No invented bargain, theft, or exposure history is attached.';
  return 'Mortal and Cinder Deep keepers hold the exposed fragment together under the new law.';
}

function realmEnding(state: GameState) {
  if (has(state, 'c12-gate-sealed'))
    return 'The Black Gate is whole stone. No voice, army, offer, message, or promise crosses it. Devils remain known enemies beyond a border that cannot answer.';
  if (has(state, 'c12-gate-consent-passage'))
    return 'The passage opens for one named traveller after three free answers: the traveller’s, the mortal keepers’, and the Cinder Deep keepers’. Any one may withdraw before the step. Every stored promise waits for review. The joint bench has disputes waiting before its first day ends.';
  if (has(state, 'c12-gate-broken'))
    return 'No Gate owns the road. Every stored promise has returned to a living maker or entered Worldroot without a new owner. Allies and invading powers can both cross. People begin building shelters before they agree on a new law.';
  return 'The Gate lives in you. Every stored promise remains a distinct voice. You can open for one named willing person and refuse an army. You cannot silence the voices, give them away, or abandon the boundary. Devils remain distinct voices and possible neighbours, never a single obedient chorus.';
}

function companyEnding(state: GameState) {
  return `On the inner face: ${innerCompany(state)}. ${mortalFace(state)} Unknown fates remain unknown.`;
}

function dawnEnding(state: GameState) {
  if (has(state, 'c12-sunrise-barred'))
    return 'At dawn, one road of light stays barred. You see the change and do not yet know who will meet it.';
  if (has(state, 'c12-sunrise-mutual-road'))
    return 'At dawn, a narrow road appears only when separated witnesses name it together.';
  if (has(state, 'c12-sunrise-unstable-road'))
    return 'Dawn opens into a shaking road of light, faster than safety and wider than any one command.';
  return 'Dawn bends around your witnessed shape. You hear the change without knowing where its light will lead.';
}

function endingEpilogue(state: GameState) {
  const promiseNotes = finalePromiseNotes(state);
  return [
    `The realms. ${realmEnding(state)}`,
    `The company. ${companyEnding(state)}`,
    `Caelan and his promises. ${custodyResult(state)} ${destinationResult(state)} ${destroyedOathCost(state)}${promiseNotes ? ` ${promiseNotes}` : ''}`,
    `Relationships. ${relationshipResult(state)}`,
    `The first dawn. ${dawnEnding(state)}`,
  ];
}

function collisionResult(state: GameState) {
  if (has(state, 'c12-first-collision-divided'))
    return 'Both shield lines remain whole, so every faction reaches the law hearing with its own witnesses.';
  if (has(state, 'c12-caelan-took-first-collision'))
    return 'You carry the first collision injury, while every allied witness reaches the law hearing unharmed.';
  if (has(state, 'c12-inner-wounded-protected'))
    return 'The inner wounded reach the hearing, but the dark outer tower removes one mortal warning post.';
  if (has(state, 'c12-mortal-line-protected'))
    return 'The mortal warning line remains whole, while reopened inner injuries slow every crossing and evacuation.';
  return 'An older record names no first protection, so both lines arrive damaged and the slower hearing absorbs the loss.';
}

function warningResult(state: GameState) {
  if (has(state, 'c12-elian-warning-public'))
    return 'Both realms can challenge Malrec’s remote seal with the same limited public warning.';
  if (has(state, 'c12-elian-warning-channel-kept'))
    return 'The protected channel warns before the next engine pulse, but receives no vote over the law.';
  if (has(state, 'c12-elian-warning-verified-locally'))
    return 'The marked engine scar shows exactly where stored promises will release, without proving the speaker’s identity.';
  return 'No warning channel survives, so living witnesses must watch every conduit directly.';
}

function obligationResult(state: GameState) {
  const results: string[] = [];
  if (has(state, 'c12-free-ledger-renewal-held'))
    results.push(
      'Named refusers keep their own evidence and their own right to say no.',
    );
  if (has(state, 'c12-freedom-hearing-returned'))
    results.push('The completed victims’ hearing returns your freedom.');
  if (has(state, 'c12-oathscar-hearing'))
    results.push('The broken victims’ hearing leaves a throat scar.');
  if (has(state, 'c12-price-court-review-held'))
    results.push(
      'The completed Price Court review keeps every unnamed force delayed.',
    );
  if (has(state, 'c12-price-freedom-returned'))
    results.push('The review returns the exact freedom given at auction.');
  if (has(state, 'c12-oathscar-review'))
    results.push('The broken review releases every unnamed force.');
  if (has(state, 'c12-compact-passage-honoured'))
    results.push(
      'The single crossing for Vexa’s people keeps corridor cooperation.',
    );
  if (has(state, 'c12-oathscar-passage'))
    results.push('The refused crossing removes Compact shields.');
  if (has(state, 'c12-command-restriction-fulfilled'))
    results.push('Voluntary units keep their chosen command limits.');
  if (has(state, 'c12-oathscar-command'))
    results.push(
      'The command breach loses fighters outside your old authority.',
    );
  if (has(state, 'c12-door-freedom-returned'))
    results.push(
      'The completed ending condition returns your right to cross a posted door first.',
    );
  if (has(state, 'c12-oathscar-door-order'))
    results.push('Crossing first protects the wounded but leaves a door scar.');
  return results.length
    ? results.join(' ')
    : 'No old mythic limit owns the law circle.';
}

function lawSupport(state: GameState) {
  if (has(state, 'c12-law-support-red-moot'))
    return 'The Moot speaker adds authority chosen only by participating fighters.';
  if (has(state, 'c12-law-support-restitution'))
    return 'Crown-harmed communities gain a claim line they control themselves.';
  if (has(state, 'c12-law-support-refusal'))
    return 'Withdrawal appears before permission in every passage clause.';
  if (has(state, 'c12-law-support-command-limit'))
    return 'Every army stops at the authority it already accepted.';
  if (has(state, 'c12-law-support-homecoming'))
    return 'The homecoming lesson guides a witnessed route to each chosen side. The old escort Oath binds no new traveller.';
  if (has(state, 'c12-law-support-road-communities'))
    return 'Experience protecting roads and Harrowfen helps organise mortal evacuation. Present volunteers keep authority over the paths.';
  if (has(state, 'c12-law-support-no-one-falls'))
    return 'The bridge rescue taught you how to shield a vulnerable withdrawal. Its completed Oath supplies no new power.';
  if (has(state, 'c12-law-support-living-command'))
    return 'Living command, the Oath that lets a request reach only units who still freely answer, carries one defensive request.';
  if (has(state, 'c12-law-support-shared-oath'))
    return 'The exact person marked by the shared Oath accepts one survival load without becoming a source of general power.';
  if (has(state, 'c12-law-support-present-consent'))
    return 'Living speakers built the hearing without magical authority, so the final wording takes longer and belongs to no old Oath.';
    return 'An older record names no supporting Oath, so living speakers rebuild a free yes from the people standing here before the law can begin.';
}

const allRouteFlags = [
  'c11-route-revolt',
  'c11-route-auction',
  'c11-route-force',
];

export const chapterTwelveNodes: Record<string, StoryNode> = {
  'c12-inner-gate': {
    id: 'c12-inner-gate',
    kicker: 'Chapter Twelve · The Ember Oath',
    title: 'Two Skies in One Door',
    location: 'The Inner Face of the Black Gate',
    objective:
      'Stop the first collision without pretending both sides share one command.',
    threat: 'Critical',
    art: 'blackgatecollision',
    body: (state) => [
      `The inner arch splits from floor to crown. Through it, you see the fortress ring beneath a pale mortal sky. ${mortalFace(state)} You stand in the Cinder Deep with ${innerCompany(state)}.`,
      routeSupport(state),
      'Red sparks tear from the engine behind you and fly through the widening gap toward Worldroot. Which earned support should hold first contact?',
    ],
    choices: [
      {
        id: 'c12-open-refuser-witness-circle',
        label: 'Let each named refuser open the witness circle.',
        detail:
          'The circle protects speakers and evidence. It commands no nonparticipant.',
        advantage: 'Prevent the first coercive offer from crossing the breach.',
        showIfAllFlags: ['c11-route-revolt'],
        result:
          'The refusers set their own cords. A contract spark touches the circle, receives six separate refusals, and dies.',
        next: 'c12-first-collision',
      },
      {
        id: 'c12-enforce-registered-force-delay',
        label: 'Hold back every force the auction did not name.',
        detail:
          'The auction paper admits only the force named at sale. Every other force waits. It grants no ownership.',
        advantage: 'Hold Sableglass troops outside the breach for one hearing.',
        showIfAllFlags: ['c11-route-auction'],
        result:
          'The auction paper flashes over the arch. Sableglass troops the sale did not name freeze. The named force and individual people keep their lawful choices.',
        next: 'c12-first-collision',
      },
      {
        id: 'c12-set-compact-witness-line',
        label: 'Set the Ash Compact witnesses across the corridor.',
        detail:
          'Only this company holds the line. Civic damage raises the later crossing price.',
        advantage: 'Keep the engine corridor open for the fragment team.',
        showIfAllFlags: ['c11-route-force'],
        result:
          'Compact witnesses lock shields with the company. They leave a marked lane for one later crossing and nothing more.',
        next: 'c12-first-collision',
      },
      {
        id: 'c12-build-unallied-contact-line',
        label: 'Build a contact line from individual volunteers.',
        detail:
          'With no verified faction agreement, ask each person to choose a post.',
        advantage: 'Hold the breach through individual volunteers.',
        hideIfAnyFlags: allRouteFlags,
        result:
          'People name themselves and choose their posts. The improvised line bends, but it does not become your property.',
        next: 'c12-first-collision',
      },
    ],
  },

  'c12-first-collision': {
    id: 'c12-first-collision',
    kicker: 'The widening breach',
    title: 'Who Takes the First Blow',
    location: 'Between Both Gate Faces',
    objective: 'Choose where the first promise storm breaks.',
    threat: 'Critical',
    art: 'blackgatecollision',
    body: (state) => [
      `Your chosen line holds long enough for faces to become people instead of targets. ${injuryPressure(state)}`,
      `${offerMethodAtGate(state)} A knot of sparks turns toward the inner wounded while another races for the mortal line. Who takes the safer position?`,
    ],
    choices: [
      {
        id: 'c12-shield-inner-wounded',
        label: 'Turn the expedition shields over the wounded.',
        detail:
          'Protect the injured travellers who crossed with you. The mortal line absorbs more damage.',
        advantage: 'Preserve the injured expedition for the final hearing.',
        addFlags: ['c12-inner-wounded-protected'],
        result:
          'Shields close over the injured. The promise storm breaks on mortal stone and knocks one outer tower dark.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-shield-mortal-line',
        label: 'Drive the sparks into the empty inner floor.',
        detail:
          'Protect the mortal defenders. The inner company takes the strain.',
        advantage: 'Keep the fortress command line intact.',
        addFlags: ['c12-mortal-line-protected'],
        result:
          'The sparks miss the mortal shields and burst under your company. Everyone remains standing, but old injuries reopen.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-split-first-collision',
        label: 'Divide the storm between willing units.',
        detail:
          'Spend 1 Command. Spend 1 Oathfire. Each willing unit takes one named spark within accepted limits.',
        advantage: 'Prevent both the tower loss and the reopened injuries.',
        requires: { command: 1, oathfire: 1 },
        changes: { command: -1, oathfire: -1 },
        addFlags: ['c12-first-collision-divided'],
        result:
          'Named units answer one at a time. The storm divides into harmless threads and leaves both shield lines whole.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-take-first-collision-alone',
        label: 'Take both knots on your shield.',
        detail:
          'Spend 2 Health. Protect both lines. The impact may kill you when badly wounded.',
        advantage:
          'Keep every present ally and both fort lines free of the first collision.',
        changes: { health: -2 },
        addFlags: ['c12-caelan-took-first-collision'],
        result:
          'Both knots strike your shield. Everyone behind it stays clear while the force drives you to one knee.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-shared-offer-ledger-at-collision',
        label: 'Use the shared ledger to call the copied spark.',
        detail:
          'Protect the mortal line. Sableglass may aim the next strike at desires that owners exposed.',
        advantage: 'Keep the fortress warning posts intact.',
        showIfAllFlags: ['c10-offer-method-shared'],
        addFlags: ['c12-mortal-line-protected'],
        result:
          'The shared limits expose the copied spark. The mortal line stays whole while the inner company absorbs the slower strike.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-private-safety-seals-at-collision',
        label: 'Use only the private safety marks.',
        detail:
          'Keep every desire confidential. Protect the inner wounded while one mortal tower takes the late warning.',
        advantage: 'Preserve privacy and the wounded expedition.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c12-inner-wounded-protected'],
        result:
          'Each owner shows only a safe mark. The inner wounded move in time, while the last warning reaches the mortal tower late.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-ended-burden-accounts-at-collision',
        label: 'Match the sparks to the ended burden accounts.',
        detail:
          'Read only each owner’s returned band. A withdrawn traveller supplies no group proof.',
        advantage: 'Protect the inner wounded without reviving the ended Oath.',
        showIfAllFlags: ['c10-offer-method-oath'],
        hideIfAnyFlags: ['c10-burden-oath-withdrawn'],
        addFlags: ['c12-inner-wounded-protected'],
        result:
          'The closed bands identify the returning temptations without opening their contents. The wounded clear the inner strike.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-united-warden-signal',
        label: 'Follow the united wardens’ living signal.',
        detail:
          'Protect the mortal line through the defence kept in independent mortal hands.',
        advantage: 'Keep the fortress warning posts intact.',
        showIfAllFlags: ['c8-united-wardens'],
        addFlags: ['c12-mortal-line-protected'],
        result:
          'Independent fort bells answer in order. Their living signal turns the mortal spark into empty stone.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-compact-rear-seam',
        label: 'Let the accepted Ash Compact fire hold the rear seam.',
        detail:
          'Protect the inner wounded under the public embassy terms already accepted.',
        advantage: 'Preserve the injured expedition for the final hearing.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        addFlags: ['c12-inner-wounded-protected'],
        result:
          'White fire holds only the rear seam. The wounded clear the strike while the Compact gains no wider crossing.',
        next: 'c12-malrec-signal',
      },
      {
        id: 'c12-use-first-fort-foundation',
        label: 'Turn First Fort’s sacrificed foundation into a shield.',
        detail:
          'Protect the inner wounded. The destroyed fort and its lost community do not return.',
        advantage:
          'Preserve the injured expedition without spending a resource.',
        showIfAllFlags: ['c8-sacrificed-first-fort'],
        addFlags: ['c12-inner-wounded-protected'],
        result:
          'The empty foundation takes one final strike. No bell answers from the fort, and the wounded reach cover.',
        next: 'c12-malrec-signal',
      },
    ],
  },

  'c12-malrec-signal': {
    id: 'c12-malrec-signal',
    kicker: 'A voice through brass',
    title: 'The Man Who Is Not Here',
    location: 'The Engine Conduit',
    objective:
      'Answer Malrec without inventing his location or surrendering the decision.',
    threat: 'Critical',
    art: 'blackgatecollision',
    body: (state) => [
      `A Crown oath seal turns inside the engine. Malrec's voice comes through it, but his body is nowhere on either face. ${fragmentPosition(state)}`,
      `“Separation already took her,” Malrec says. “I will not let your fear make that loss sacred.” ${vaorAtGate(state)} His method is still tearing promises from people who never agreed. What do you answer?`,
    ],
    choices: [
      {
        id: 'c12-name-malrec-coercion',
        label: 'Name the people his opening is using without consent.',
        detail: 'Challenge the method through living witnesses.',
        advantage: 'Give the later hearing a clear record of coercion.',
        result:
          'You name the wounded, the refusers, and the people behind both shield lines. The engine cannot answer for any of them.',
        next: 'c12-stop-opening',
      },
      {
        id: 'c12-demand-engine-test',
        label: 'Demand one claim the engine can test in public.',
        detail: 'Keep Elian’s identity limited to what she claimed while testing the conduit.',
        advantage: 'Expose the engine’s copied-memory path.',
        result:
          'The engine repeats one memory in two different voices. Neither version proves who Elian is, but both reveal the same false conduit.',
        next: 'c12-stop-opening',
      },
      {
        id: 'c12-offer-malrec-witnessed-stop',
        label: 'Offer Malrec a witnessed stop and later hearing.',
        detail:
          'He may speak after the opening stops. He receives no control over the new law.',
        advantage: 'Slow his remote pressure for one exchange.',
        result:
          'Malrec stops one engine stroke to hear the terms. He refuses them, but the pause exposes the fragment socket.',
        next: 'c12-stop-opening',
      },
      {
        id: 'c12-use-vaor-willing-engine-test',
        label: 'Use Vaor’s willing ember to test the false pulse.',
        detail:
          'The gift permits this engine test and proves no identity or location.',
        advantage: 'Expose the fragment socket before Malrec’s next stroke.',
        showIfAnyFlags: ['c9-vaor-gift-proof-guard', 'c5-freed-vaor'],
        result:
          'The ember touches the false pulse and turns clear. The lie burns away from the fragment socket without naming the engine voice.',
        next: 'c12-stop-opening',
      },
      {
        id: 'c12-request-vaor-pact-engine-test',
        label: 'Ask Vaor to permit one pact test.',
        detail:
          'He keeps the right to refuse. The request spends no claim beyond the pact.',
        advantage:
          'If he agrees, expose the fragment socket without widening the pact.',
        showIfAnyFlags: ['c9-vaor-pact-proof-carried', 'c5-vaor-pact'],
        result:
          'Vaor answers with one hot breath through the pact. “This test. Nothing else.” The fragment socket clears.',
        next: 'c12-stop-opening',
      },
    ],
  },

  'c12-stop-opening': {
    id: 'c12-stop-opening',
    kicker: 'The Gate Nail fragment',
    title: 'Stop the Hand Inside',
    location: 'The Split Fragment Socket',
    objective: 'Stop Malrec’s opening through the fragment’s actual holding.',
    threat: 'Critical',
    art: 'blackgatecollision',
    body: (state) => [
      `The pause reveals a half circle in the engine floor. ${fragmentPosition(state)} The fragment fits that hollow, but each holding route permits a different action.`,
      `${vexaAtBoundary(state)} Stopping this engine stroke will not restore the old Gate. It only ends Malrec’s inside opening and makes any owned return promise due. How do you seat the fragment?`,
    ],
    choices: [
      {
        id: 'c12-align-neutral-fragment',
        label: 'Seat the neutral fragment under its witnessed purpose.',
        detail:
          'Stop this opening. The return promise becomes due immediately afterward.',
        advantage:
          'Preserve the exact bargain and its limited name-pointing.',
        showIfAllFlags: ['c9-route-bargain'],
        addFlags: ['c12-opening-stopped'],
        result:
          'The fragment turns once and stops. Vexa witnesses only its bearer, purpose, and return. The engine’s pulling hand opens.',
        next: 'c12-elian-conduit',
      },
      {
        id: 'c12-seat-admitted-stolen-fragment',
        label: 'Seat the admitted stolen fragment in public view.',
        detail: 'Stop this opening without pretending the Compact claim ended.',
        advantage: 'Keep the stolen fragment in sight so Sableglass cannot hide it and call it theirs.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c12-opening-stopped'],
        result:
          'You lock the visible fragment into the floor. Its theft mark stays bright while the engine’s pulling hand stops.',
        next: 'c12-elian-conduit',
      },
      {
        id: 'c12-seat-public-evidence-fragment',
        label: 'Seat the fragment inside its public evidence frame.',
        detail:
          'Stop this opening while every witness retains access to the proof.',
        advantage: 'Prevent any hero, court, or house from taking the fragment privately.',
        showIfAllFlags: ['c9-route-exposure'],
        addFlags: ['c12-opening-stopped'],
        result:
          'The whole evidence frame settles into the hollow. Its witness marks remain visible as the engine’s pulling hand stops.',
        next: 'c12-elian-conduit',
      },
      {
        id: 'c12-seat-legacy-fragment-publicly',
        label: 'Record the fragment publicly before seating it.',
        detail:
          'Let both sides witness holding when no earlier recovery record can be verified.',
        advantage: 'Stop the engine’s pull without pretending one person already owns the fragment.',
        hideIfAnyFlags: [
          'c9-route-bargain',
          'c9-route-theft',
          'c9-route-exposure',
        ],
        addFlags: ['c12-opening-stopped'],
        result:
          'Both faces witness the fragment before you seat it. No owner is recorded yet. The engine’s pulling hand stops.',
        next: 'c12-elian-conduit',
      },
    ],
  },

  'c12-elian-conduit': {
    id: 'c12-elian-conduit',
    kicker: 'A named warning',
    title: 'The Voice and the Left Conduit',
    location: 'The Stilled Engine',
    objective:
      'Use Elian’s warning without turning the voice into property or certainty.',
    threat: 'Immediate',
    art: 'blackgatecollision',
    body: (state) => [
      `${elianRecord(state)} The named conduit still pours stored promises through the breach. Malrec’s remote seal tries to close around her words.`,
      'The warning gives you an action, not an answer about her nature. You can preserve it with public witnesses, protect the channel, or test it against the engine scars. Which record should survive?',
    ],
    choices: [
      {
        id: 'c12-record-elian-warning-publicly',
        label: 'Repeat the warning through both witness lines.',
        detail:
          'Record only her claimed name, opposition, and testable conduit warning.',
        advantage: 'Make Malrec’s method public on both Gate faces.',
        addFlags: ['c12-elian-warning-public'],
        result:
          'Mortal and devil witnesses repeat the same narrow record. Nobody adds death, captivity, or singular identity to it.',
        next: 'c12-renewal-hearing',
      },
      {
        id: 'c12-protect-elian-warning-channel',
        label: 'Keep the warning channel open until the law is chosen.',
        detail:
          'The voice may warn of engine movement. It gains no vote over the Gate.',
        advantage: 'Receive one later warning before stored promises move.',
        addFlags: ['c12-elian-warning-channel-kept'],
        result:
          'Vexa cuts Malrec’s ownership ring away from the channel. The voice remains audible and owns no part of your choice.',
        next: 'c12-renewal-hearing',
      },
      {
        id: 'c12-test-elian-warning-against-scars',
        label: 'Match the warning to the engine scars.',
        detail: 'Verify the conduit without deciding who the speaker is.',
        advantage: 'Mark the exact promise-release path for the final law.',
        addFlags: ['c12-elian-warning-verified-locally'],
        result:
          'The left conduit bears the same split named in the warning. The physical match proves the danger and nothing deeper.',
        next: 'c12-renewal-hearing',
      },
    ],
  },

  'c12-renewal-hearing': {
    id: 'c12-renewal-hearing',
    kicker: 'Outstanding voices',
    title: 'The Refusers Speak for Themselves',
    location: 'The Inner Witness Circle',
    objective: 'Let the workers speak if that hearing was promised.',
    threat: 'Immediate',
    art: 'blackgatepassage',
    body: (state) => [
      has(state, 'c11-alliance-free-ledger-refusers')
        ? 'Sira tightens the witness cords. Oren refuses any Gate office. Pellan keeps the approved collar copies under his own hand. Each affected group may speak and refuse. None receives authority over a nonparticipant.'
        : 'No extra Free Ledger hearing is owed. Individuals may still speak at the final law hearing, but no guide petition claims their time.',
      'The promise storm circles above the arch instead of waiting politely. The hearing must change who can refuse the new law. What do you write on the witness slate?',
    ],
    choices: [
      {
        id: 'c12-hold-free-ledger-renewal',
        label: 'Let each affected group state its own yes or no.',
        detail:
          'Workers keep their evidence. Participants bind only themselves.',
        advantage: 'Earn named refuser support for the final consent record.',
        showIfAllFlags: ['c11-alliance-free-ledger-refusers'],
        addFlags: ['c12-free-ledger-renewal-held'],
        result:
          'Sira joins the hearing. Oren refuses. Pellan admits the copies without giving them away. Every answer stands without punishment.',
        next: 'c12-hidden-victims-hearing',
      },
      {
        id: 'c12-record-no-renewal-debt',
        label: 'Record that no extra Free Ledger hearing is owed.',
        detail:
          'Keep individual testimony without inventing a petition duty.',
        advantage:
          'Move to the next owed hearing without taking false authority.',
        hideIfAnyFlags: ['c11-alliance-free-ledger-refusers'],
        result:
          'The witness slate stays open to individuals and records no debt to a guide or faction.',
        next: 'c12-hidden-victims-hearing',
      },
    ],
  },

  'c12-hidden-victims-hearing': {
    id: 'c12-hidden-victims-hearing',
    kicker: 'Mythic freedom',
    title: 'The Hearing You Cannot Refuse',
    location: 'The Shared Threshold',
    objective: 'Hear these speakers, or continue if no hearing is owed.',
    threat: 'Rising',
    art: 'blackgatepassage',
    body: (state) => [
      has(state, 'c11-freedom-hearing-restricted')
        ? 'The mythic auction promise closes your throat when you try to move on. You gave up the right to refuse hidden victims’ hearing until it ends. Three concealed speakers now ask to be heard. Their testimony can improve the release map. Hearing it costs time. A deliberate breach saves time but leaves a visible Oathscar and loses their help. What do you do?'
        : 'No mythic promise removes your right to refuse this hearing. Three concealed speakers still offer relevant testimony about stored promises. You may hear them as a gift, not as a vow. Declining would not break a promise, because none is owed. What do you do?',
    ],
    choices: [
      {
        id: 'c12-complete-hidden-victims-hearing',
        label: 'Hold the hearing until every hidden victim finishes.',
        detail:
          'Complete the restriction and return the exact freedom to refuse later hearings.',
        advantage: 'Gain the victims’ safe promise-release map.',
        showIfAllFlags: ['c11-freedom-hearing-restricted'],
        addFlags: [
          'c12-hidden-victims-hearing-held',
          'c12-freedom-hearing-returned',
        ],
        result:
          'Each hidden speaker finishes. The pressure leaves your throat, and their map marks three living promise owners.',
        next: 'c12-price-court-review',
      },
      {
        id: 'c12-breach-hidden-victims-hearing',
        label: 'Break the hearing promise and move now.',
        detail:
          'Save time. Lose the release map and carry a named hearing Oathscar.',
        advantage:
          'Prevent the storm from striking the inner wounded during this delay.',
        showIfAllFlags: ['c11-freedom-hearing-restricted'],
        addFlags: ['c12-oathscar-hearing'],
        result:
          'Your voice tears free. A ring scar closes around your throat, and the hidden speakers take their map away.',
        next: 'c12-price-court-review',
      },
      {
        id: 'c12-hear-voluntary-victim-map',
        label: 'Hear the voluntary testimony.',
        detail:
          'No restriction binds you. The speakers keep their identities concealed.',
        advantage: 'Gain a safe promise-release map without creating a debt.',
        hideIfAnyFlags: ['c11-freedom-hearing-restricted'],
        addFlags: ['c12-hidden-victims-hearing-voluntary'],
        result:
          'The speakers mark three living promise owners, then close their own screen and leave the circle.',
        next: 'c12-price-court-review',
      },
    ],
  },

  'c12-price-court-review': {
    id: 'c12-price-court-review',
    kicker: 'A public review',
    title: 'The Deed’s Narrow Edge',
    location: 'The Price Court Marker',
    objective: 'Complete the owed review, or record that none is due.',
    threat: 'Rising',
    art: 'blackgatepassage',
    body: (state) => [
      has(state, 'c11-price-court-review-owed')
        ? 'The Price Court marker blocks the hearing path. Your auction bid promised one public review. The paper delays every force the sale did not name. It owns no realm, fragment, voice, or person. A completed review returns the freedom named by the auction promise. Breach opens the path faster but marks every later claim. How do you pass the marker?'
        : 'No Price Court review is owed. If the one-opening paper, the invasion right, is present, it admits only its named force. There is no review promise here to keep or break. How do you pass the marker?',
    ],
    choices: [
      {
        id: 'c12-complete-price-court-review',
        label: 'Read every limit aloud and accept public questions.',
        detail: 'Complete the review and recover the promised freedom.',
        advantage:
          'Keep every unnamed force delayed through the Gate decision.',
        showIfAllFlags: ['c11-price-court-review-owed'],
        addFlags: ['c12-price-court-review-held', 'c12-price-freedom-returned'],
        result:
          'The dissenters strike every false ownership claim. The review ends, your freedom returns, and every unnamed force remains delayed.',
        next: 'c12-compact-passage',
      },
      {
        id: 'c12-breach-price-court-review',
        label: 'Break the review promise and cross the marker.',
        detail:
          'Reach the law circle sooner. Release the delay on unnamed forces and take an Oathscar.',
        advantage: 'Protect one failing engine brace before it falls.',
        showIfAllFlags: ['c11-price-court-review-owed'],
        addFlags: ['c12-oathscar-review'],
        result:
          'The marker cracks beneath your boot. Unregistered forces move again, and a square scar burns into your ankle.',
        next: 'c12-compact-passage',
      },
      {
        id: 'c12-confirm-no-price-review',
        label: 'Record that no Price Court review is due.',
        detail: 'Take no benefit and create no debt.',
        advantage: 'Preserve a clean public record for the new law.',
        hideIfAnyFlags: ['c11-price-court-review-owed'],
        result:
          'The marker records no review debt and opens without taking a promise.',
        next: 'c12-compact-passage',
      },
    ],
  },

  'c12-compact-passage': {
    id: 'c12-compact-passage',
    kicker: 'One witnessed crossing',
    title: 'The Passage Already Priced',
    location: 'The Stilled Inner Opening',
    objective: 'Honour the Compact crossing only if that crossing was purchased.',
    threat: 'Rising',
    art: 'blackgatepassage',
    body: (state) => [
      has(state, 'c11-alliance-ash-compact-passage')
        ? 'Malrec’s inside opening has stopped. The Ash Compact’s price is now due: exactly one witnessed crossing. Civic damage makes its delegates demand that the traveller carry no weapon. The single crossing can carry one unarmed messenger to the mortal witness line. Refusing it preserves position but breaks the alliance. What do you allow?'
        : 'The Ash Compact holds no purchased crossing from Vathis. Nobody may turn its old help into permanent access. There is no Compact passage here to honour or refuse. What do you record?',
    ],
    choices: [
      {
        id: 'c12-honour-one-compact-passage',
        label: 'Honour one unarmed, witnessed crossing.',
        detail: 'One named messenger crosses. No second traveller follows.',
        advantage: 'Keep Compact cooperation during the final law.',
        showIfAllFlags: ['c11-alliance-ash-compact-passage'],
        addFlags: ['c12-compact-passage-honoured'],
        result:
          'One unarmed messenger crosses under two witness marks. The lane closes behind her, exactly as promised.',
        next: 'c12-command-restriction',
      },
      {
        id: 'c12-breach-compact-passage',
        label: 'Refuse the purchased crossing.',
        detail:
          'Keep every person on the present side. Lose Compact cooperation and take a passage Oathscar.',
        advantage: 'Preserve the mortal shield line from an unknown messenger.',
        showIfAllFlags: ['c11-alliance-ash-compact-passage'],
        addFlags: ['c12-oathscar-passage'],
        result:
          'The lane closes empty. Vexa records the breach, and Compact shields leave the engine corridor.',
        next: 'c12-command-restriction',
      },
      {
        id: 'c12-record-no-compact-passage',
        label: 'Record that no Compact crossing is owed.',
        detail:
          'Preserve present positions without inventing a reward or debt.',
        advantage: 'Move to the command line with holding clear.',
        hideIfAnyFlags: ['c11-alliance-ash-compact-passage'],
        result: 'Both witness lines record that no purchased crossing exists.',
        next: 'c12-command-restriction',
      },
    ],
  },

  'c12-command-restriction': {
    id: 'c12-command-restriction',
    kicker: 'A freedom given away',
    title: 'The Order You May Give',
    location: 'The Mortal Shield Line',
    objective: (state) =>
      has(state, 'c11-freedom-command-restricted')
        ? 'Obey or breach the exact mythic command restriction.'
        : 'Give one defensive order using only the people and authority actually present.',
    threat: 'Immediate',
    art: 'blackgatecollision',
    body: (state) => [
      has(state, 'c11-freedom-command-restricted')
        ? 'Your mythic promise removed the right to command beyond accepted limits until the Gate law changes. The restriction is still active. The present units must choose whether to hold.'
        : 'No mythic restriction blocks your command, but every company still keeps the limits it accepted before crossing.',
      destroyedOathCost(state),
      has(state, 'c11-freedom-command-restricted')
        ? 'A wide order would steady the line faster and violate the named limit. What do you say?'
        : 'A wide order would gather people who are not here. What do you say to the units actually present?',
    ],
    choices: [
      {
        id: 'c12-ask-units-to-hold-within-limits',
        label: 'Ask each unit to hold within its accepted limit.',
        detail: 'Fulfil the restriction through separate, voluntary answers.',
        advantage: 'Keep every willing unit without adding an Oathscar.',
        showIfAllFlags: ['c11-freedom-command-restricted'],
        addFlags: ['c12-command-restriction-fulfilled'],
        result:
          'Teren, the wardens, and the Moot fighters answer only where present. Each willing unit names its own boundary and holds.',
        next: 'c12-door-order',
      },
      {
        id: 'c12-breach-command-restriction',
        label: 'Give one order beyond the accepted limits.',
        detail:
          'Steady the whole line now. Take a command Oathscar and lose voluntary support.',
        advantage: 'Prevent the outer tower from falling during the order.',
        showIfAllFlags: ['c11-freedom-command-restricted'],
        addFlags: ['c12-oathscar-command'],
        result:
          'The line obeys for one breath. The tower stays up, then fighters outside your old authority step away from you.',
        next: 'c12-door-order',
      },
      {
        id: 'c12-give-limited-defensive-order',
        label: 'Give one defensive order inside every accepted limit.',
        detail: 'Use only the people and authority actually present.',
        advantage: 'Hold the shield line without creating a new promise.',
        hideIfAnyFlags: ['c11-freedom-command-restricted'],
        result:
          'Only present units answer. No absent army appears, and the shield line settles behind its own leaders.',
        next: 'c12-door-order',
      },
    ],
  },

  'c12-door-order': {
    id: 'c12-door-order',
    kicker: 'The last contracted threshold',
    title: 'Who Crosses First',
    location: 'The Stilled Engine Door',
    objective: (state) =>
      has(state, 'c11-freedom-door-order-restricted')
        ? 'Resolve the contracted-door order while it still binds you.'
        : 'Choose a crossing order for the wounded without a mythic first-crossing bar.',
    threat: 'Immediate',
    art: 'blackgatecollision',
    body: (state) => [
      has(state, 'c11-freedom-door-order-restricted')
        ? has(state, 'c12-opening-stopped')
          ? 'The contracted-door promise ended when the opening stopped. Its other ending condition was everyone reaching a chosen safe side. Either was enough. The dark mark cannot punish your crossing order now.'
          : 'The contracted-door promise bars you from crossing first until the opening stops or every willing traveller reaches a chosen safe side.'
        : 'No mythic promise fixes the crossing order. The wounded still need a clear lane to the law circle.',
      'The safe line lies six steps away. The wounded need shields while the last engine sparks fall. Who moves?',
    ],
    choices: [
      {
        id: 'c12-let-expedition-cross-safe-line-first',
        label: 'Hold the door while the expedition crosses first.',
        detail:
          'The opening has stopped, so following last is now a free choice.',
        advantage: 'Guard the rear while the wounded reach the law circle.',
        showIfAllFlags: ['c11-freedom-door-order-restricted'],
        addFlags: ['c12-door-freedom-returned'],
        result:
          'This company crosses the safe line. Your door mark is already dark. You follow last because you choose to guard the rear.',
        next: 'c12-oath-hearing',
      },
      {
        id: 'c12-breach-door-order',
        label: 'Cross first and take the engine strike yourself.',
        detail:
          'Save the wounded from the strike. Break the order promise and take an Oathscar.',
        advantage: 'Prevent one expedition injury during the crossing.',
        showIfAllFlags: ['c11-freedom-door-order-restricted'],
        hideIfAnyFlags: ['c12-opening-stopped'],
        addFlags: ['c12-oathscar-door-order'],
        result:
          'You cross first. The strike hits your shield instead of the wounded, and a door-shaped scar burns across your wrist.',
        next: 'c12-oath-hearing',
      },
      {
        id: 'c12-move-wounded-through-open-lane',
        label: 'Move the wounded through the open lane.',
        detail:
          'No order promise binds you. The wounded remain behind their shields.',
        advantage: 'Bring the whole expedition to the law circle.',
        showIfAllFlags: ['c12-opening-stopped'],
        result:
          'The shield escort sets the pace. Every present traveller reaches the circle, with the wounded leaning on willing shoulders.',
        next: 'c12-oath-hearing',
      },
    ],
  },

  'c12-oath-hearing': {
    id: 'c12-oath-hearing',
    kicker: 'Promises and scars',
    title: 'What the Old Words Can Still Do',
    location: 'The Law Circle',
    objective:
      'Choose one surviving source of authority without restoring a destroyed Oath.',
    threat: 'Immediate',
    art: 'blackgatepassage',
    activeConsequences: {
      complications: [
        'c12-oathscar-hearing',
        'c12-oathscar-review',
        'c12-oathscar-passage',
        'c12-oathscar-command',
        'c12-oathscar-door-order',
      ],
      reactions: [
        'c12-free-ledger-renewal-held',
        'c12-freedom-hearing-returned',
        'c12-price-court-review-held',
        'c12-price-freedom-returned',
        'c12-compact-passage-honoured',
        'c12-command-restriction-fulfilled',
        'c12-door-freedom-returned',
      ],
    },
    body: (state) => [
      destroyedOathCost(state),
      has(state, 'c10-offer-method-oath')
        ? 'The Ash Road burden Oath has ended. Its private accounts return to their owners and give you no authority over them.'
        : 'No burden Oath lets you carry another traveller’s will.',
      obligationResult(state),
      'Active promises may support only the people named in their own words. Scars create no power.',
      'The people standing here may still say yes for themselves. What should support the final hearing?',
    ],
    choices: [
      {
        id: 'c12-support-law-with-red-moot-authority',
        label: 'Ask the Red Moot delegates to name their own authority.',
        detail: 'Available only while the recognition Oath survives.',
        advantage: 'Give Moot participants a protected voice in the law.',
        showIfAllFlags: ['c6-oath-recognised-red-moot'],
        hideIfAnyFlags: ['c9-destroyed-red-moot-authority-oath'],
        addFlags: ['c12-law-support-red-moot'],
        result:
          'The Moot fighters choose a speaker without your nomination. Their authority reaches only those who selected them.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-restitution',
        label: 'Record the promise to bring hidden victims before the Queen.',
        detail:
          'Available only while that Oath survives. It cannot be sold or widened.',
        advantage: 'Reserve a public claim for Crown-harmed communities.',
        showIfAllFlags: ['c6-oath-crown-restitution'],
        hideIfAnyFlags: ['c9-destroyed-crown-restitution-oath'],
        addFlags: ['c12-law-support-restitution'],
        result:
          'Harmed communities receive their own claim line. The Oath does not make you their owner or speaker.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-refusal',
        label: 'Use the surviving refusal Oath to protect a clear no.',
        detail: 'Available only while the clan refusal Oath survives.',
        advantage: 'Strengthen withdrawal from controlled passage.',
        showIfAllFlags: ['c6-oath-defends-refusal'],
        hideIfAnyFlags: ['c9-destroyed-clan-refusal-oath'],
        addFlags: ['c12-law-support-refusal'],
        result:
          'The Oath warms only when someone says no. The law circle records withdrawal before it records permission.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-command-limit',
        label: 'Use the surviving command limit to restrain every army.',
        detail: 'Available only while the honest command limit survives.',
        advantage: 'Stop an army’s orders from counting as a civilian yes.',
        showIfAllFlags: ['c6-oath-honest-limit'],
        hideIfAnyFlags: ['c9-destroyed-honest-command-limit-oath'],
        addFlags: ['c12-law-support-command-limit'],
        result:
          'The command Oath stops at each accepted boundary. It restrains armies and grants no civilian vote.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-homecoming',
        label: 'Use the homecoming lesson to guide the company.',
        detail:
          'Mark a witnessed route to each chosen side. The old escort Oath binds no new traveller.',
        advantage: 'Give this company one protected regrouping.',
        showIfAllFlags: ['oath-bring-them-home'],
        addFlags: ['c12-law-support-homecoming'],
        result:
          'You mark a route to each freely chosen side and ask witnesses to guard it. Nobody is pulled across.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-road-communities',
        label: 'Ask the road communities to organise the mortal retreat.',
        detail:
          'Use the care learned on the road and at Harrowfen. Ask present volunteers to control the evacuation.',
        advantage: 'Open a stable civilian path behind the fortress shields.',
        showIfAnyFlags: ['c2-oath-repair-road', 'c3-oath-hold-town'],
        addFlags: ['c12-law-support-road-communities'],
        result:
          'Present mortal volunteers follow your rescue plan and mark a civilian path. They keep control of it.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-no-one-falls',
        label: 'Use the bridge rescue lesson for one evacuation.',
        detail:
          'The bridge Oath has ended. Repeat its shield placement with willing defenders; it supplies no new magic.',
        advantage:
          'Shield one vulnerable crossing or withdrawal from the promise storm.',
        showIfAllFlags: ['c4-oath-no-one-falls'],
        addFlags: ['c12-law-support-no-one-falls'],
        result:
          'You place willing defenders as you did at the bridge. Their shields cover one withdrawal. The wounded still limp, and anyone may refuse the route.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-living-command',
        label: 'Send one defensive request through living command, the Oath that reaches only units who still freely answer.',
        detail:
          'Living command lets a request reach only present units who still freely answer. Anyone may refuse.',
        advantage:
          'Coordinate one shield movement without summoning absent troops.',
        showIfAllFlags: ['c7-oath-living-command'],
        addFlags: ['c12-law-support-living-command'],
        result:
          'The request reaches present units. Each living commander answers for their own people, and no absent army appears.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-support-law-with-shared-oath',
        label: 'Ask Mara, Lysara, or Korran to carry one load.',
        detail:
          'Mara, Lysara, or Korran may help only when marked, present, able, and willing.',
        advantage: 'Share one survival burden without widening the Oath.',
        showIfAnyFlags: [
          'c8-shared-oath-mara',
          'c8-shared-oath-lysara',
          'c8-shared-oath-korran',
        ],
        addFlags: ['c12-law-support-shared-oath'],
        result:
          'The marked person answers only if physically able. One burden divides, while their authority and consent remain their own.',
        next: 'c12-four-laws',
      },
      {
        id: 'c12-build-law-from-present-consent',
        label: 'Build the hearing from the people standing here.',
        detail:
          'Costs no Oathfire. Each person says yes only for themselves. Every speaker must be heard separately. Anyone may stay silent.',
        advantage: 'Complete the law even when every earlier Oath is gone.',
        addFlags: ['c12-law-support-present-consent'],
        result:
          'The circle takes longer. Each person names what they may decide. A person who stays silent is not counted as having said yes.',
        next: 'c12-four-laws',
      },
    ],
  },

  'c12-four-laws': {
    id: 'c12-four-laws',
    kicker: 'The Ember Oath',
    title: 'Four Futures in Plain Words',
    location: 'Both Faces of the Black Gate',
    objective: 'Choose the law that replaces the failing Gate.',
    threat: 'Critical',
    art: 'blackgatepassage',
    lesson: {
      title: 'A law with limits, not a mood',
      body: 'Each law names who may cross, what happens to locked promises, and how long it lasts. You will choose Caelan’s road and his relationships after this.',
    },
    activeConsequences: {
      complications: [
        'c12-inner-wounded-protected',
        'c12-mortal-line-protected',
        'c12-caelan-took-first-collision',
      ],
      reactions: [
        'c12-first-collision-divided',
        'c12-law-support-red-moot',
        'c12-law-support-restitution',
        'c12-law-support-refusal',
        'c12-law-support-command-limit',
        'c12-law-support-homecoming',
        'c12-law-support-road-communities',
        'c12-law-support-no-one-falls',
        'c12-law-support-living-command',
        'c12-law-support-shared-oath',
        'c12-law-support-present-consent',
      ],
    },
    body: (state) => [
      'The old Gate cannot close around the fragment. Its law has split, and restoring the same words would let Malrec seize them again.',
      collisionResult(state),
      lawSupport(state),
      'Malrec drives his remote seal against the stopped engine one last time. You read every proposed law to both faces. Which law do you swear?',
    ],
    choices: [
      {
        id: 'c12-choose-sealed-gate',
        label: 'Seal the Cinder Deep.',
        detail:
          'After a last free choice of side, no person, army, promise, offer, or message may cross. Nobody can force another person to leave. Stored promises stay locked in the stone. They cannot be spent. Allies who stay behind become stranded. Caelan loses the right to cross after choosing a side. No ruler may reopen it until separately chosen delegates of both realms freely replace it. At sunrise, one road of light will stay barred.',
        advantage:
          'Stop all large and small crossings after the final closing.',
        addFlags: [
          'c12-gate-sealed',
          'c12-devils-sealed-enemies',
          'c12-promises-sealed',
          'c12-caelan-survived',
          'c12-sunrise-barred',
          'rook-luminous-approach-sealed',
        ],
        result:
          'The arch begins closing from both crowns. Every person chooses a side, and willing allies who stay behind become unreachable.',
        next: 'c12-law-consequence',
      },
      {
        id: 'c12-choose-consent-passage',
        label: 'Open a crossing only when both sides and the traveller say yes.',
        detail:
          'A named traveller and chosen keepers on both sides must record yes. Any signer may withdraw before crossing. Stored promises remain locked until public review returns them to their original living owners. Allies must wait for permission too. Caelan owes one year of public service. He may not cross unwitnessed during that year. Either realm may close passage. Both renew yearly. A public joint bench reviews disputes. At sunrise, a narrow road of light will open only when witnesses on both sides name it.',
        advantage:
          'Let the traveller and both sides refuse a crossing before it happens.',
        addFlags: [
          'c12-gate-consent-passage',
          'c12-devils-recognised-neighbours',
          'c12-promises-reviewed',
          'c12-caelan-survived',
          'c12-sunrise-mutual-road',
          'rook-luminous-approach-mutual',
        ],
        result:
          'The breach narrows to one person’s width. Separate mortal and devil marks appear, and neither can open it alone.',
        next: 'c12-law-consequence',
      },
      {
        id: 'c12-choose-broken-gate',
        label: 'Break the Gate.',
        detail:
          'The stone breaks now. No Gate or keeper owns crossing. People may refuse bargains. No central authority may close the road alone. Stored promises return to living makers or enter Worldroot without a new owner. They strike both shield lines, so weaker defences suffer more. Allies and invading armies can cross freely in both directions. Caelan keeps movement. He loses central power to stop invasion. The opening remains until people build another law. At sunrise, an unstable road of light will open.',
        advantage: 'End the Gate’s power to own crossing or stop armies.',
        addFlags: [
          'c12-gate-broken',
          'c12-devils-invading-powers',
          'c12-promises-released',
          'c12-caelan-survived',
          'c12-sunrise-unstable-road',
          'rook-luminous-approach-unstable',
        ],
        result:
          'The Gate stones burst outward. Every stored promise leaves as a separate light, and uncontrolled roads open in both directions.',
        next: 'c12-law-consequence',
      },
      {
        id: 'c12-choose-mortal-gatekeeper',
        label: 'Take the Gate into Caelan.',
        detail:
          'He may open a crossing for one named willing person or refuse armies. He uses public witnessed identity, not true-name access. The Gate and stored promises enter Caelan as separate voices. He cannot spend or erase those voices. Allies must ask too. Every traveller may refuse. He must hear individual requests. He cannot silence the voices. He cannot give the Gate away. He cannot abandon the boundary. He cannot live wholly in either realm. This lasts until death or a freely accepted new Gate law releases every voice. At sunrise, light will bend around him and answer witnessed identity.',
        advantage:
          'Let Caelan open for one willing person and refuse armies.',
        addFlags: [
          'c12-gatekeeper',
          'c12-devils-carried-voices',
          'c12-promises-carried',
          'c12-caelan-survived',
          'c12-caelan-transformed',
          'c12-sunrise-witnessed-identity',
          'rook-luminous-approach-carried-voices',
        ],
        result:
          'Black stone folds into ember lines beneath your skin. Distinct voices enter you, and none can be silenced or spent.',
        next: 'c12-law-consequence',
      },
    ],
  },

  'c12-law-consequence': {
    id: 'c12-law-consequence',
    kicker: 'The law takes hold',
    title: 'The Cost Arrives First',
    location: 'The Changed Boundary',
    objective: 'Keep the people harmed by the chosen law alive.',
    threat: 'Critical',
    art: 'blackgatecollision',
    activeConsequences: {
      complications: [],
      reactions: [
        'c12-elian-warning-public',
        'c12-elian-warning-channel-kept',
        'c12-elian-warning-verified-locally',
        'c12-hidden-victims-hearing-held',
        'c12-hidden-victims-hearing-voluntary',
      ],
    },
    body: (state) => {
      if (has(state, 'c12-gate-sealed'))
        return [
          'The gap contracts. People on both faces call names while there is still time.',
          warningResult(state),
          obligationResult(state),
          'Vexa and the company remain on the inner face. The mortal defenders remain outside. A hand-wide seam stays around you and the neutral case until holding and your own side are decided.',
          'How do you carry this law to the fragment keepers?',
        ];
      if (has(state, 'c12-gate-consent-passage'))
        return [
          'The passage narrows and waits. The first traveller refuses, so the opening stays still.',
          warningResult(state),
          obligationResult(state),
          has(state, 'c9-destroyed-clan-refusal-oath')
            ? 'The destroyed refusal Oath forces a second public review before renewal.'
            : 'Withdrawal remains the first line of every crossing.',
          'How do you carry this law to the fragment keepers?',
        ];
      if (has(state, 'c12-gate-broken'))
        return [
          'The Gate breaks. Promise lights strike both skies.',
          warningResult(state),
          obligationResult(state),
          hasAny(state, [
            'c12-hidden-victims-hearing-held',
            'c12-hidden-victims-hearing-voluntary',
          ])
            ? 'The victims’ map guides three lights safely home.'
            : 'Three unmarked lights tear through the shield lines.',
          'How do you carry this law to the fragment keepers?',
        ];
      return [
        'The arch leaves the stone and enters you.',
        warningResult(state),
        'Every stored promise remains a distinct voice that you cannot silence or spend.',
        obligationResult(state),
        'You open once for a named wounded traveller who freely asks. You refuse an army, and can never abandon this boundary.',
        'How do you carry this law to the fragment keepers?',
      ];
    },
    choices: [
      {
        id: 'c12-carry-law-to-custody',
        label: 'Bring the new law to the fragment keepers.',
        detail:
          'The inside opening has stopped. Who holds the fragment must now be resolved honestly.',
        advantage:
          'Bring the fragment before its keepers while every witness can still reach the case.',
        requiresFlags: ['c12-opening-stopped'],
        result:
          'Both witness lines repeat the new law while you lift the fragment from the stilled engine.',
        next: 'c12-fragment-custody',
      },
    ],
  },

  'c12-fragment-custody': {
    id: 'c12-fragment-custody',
    kicker: 'The promise comes due',
    title: 'Who Holds the Fragment Now',
    location: 'The Stilled Fragment Socket',
    objective: 'Settle who holds the fragment under its real route and promise.',
    threat: 'Rising',
    art: 'blackgatepassage',
    body: (state) => [
      fragmentPosition(state),
      'Malrec’s inside opening has stopped, so any return promise is due now. What do you do with the fragment in your hand?',
    ],
    choices: [
      {
        id: 'c12-fulfil-neutral-fragment-return',
        label: 'Return the fragment to the neutral keepers.',
        detail: 'Complete the paid-for return exactly and release its claim.',
        advantage: 'End the name-pointing magic when the keepers take the fragment.',
        showIfAllFlags: ['c9-route-bargain', 'c9-return-promise-owned'],
        addFlags: ['c12-fragment-return-fulfilled'],
        result:
          'The named keepers close their hands around the neutral case. The return promise releases you and nothing else.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-amend-neutral-fragment-custody',
        label: 'Ask every living keeper to say, freely, who should hold the fragment.',
        detail:
          'Each required keeper may refuse. If all agree, joint holding follows the chosen Gate body. Surviving name-pointing for return ends.',
        advantage:
          'Keep the fragment ready for repairs while every keeper can still say no.',
        showIfAllFlags: ['c9-route-bargain', 'c9-return-promise-owned'],
        showIfAnyFlags: [
          'c11-alliance-free-ledger-refusers',
          'c11-alliance-price-court-dissent',
          'c11-alliance-ash-compact-passage',
        ],
        addFlags: ['c12-fragment-custody-amended'],
        result:
          'Every required living keeper hears the whole change. Each records a free yes, the case changes hands, and name-pointing for return ends.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-breach-neutral-fragment-return',
        label: 'Keep the fragment and knowingly breach the return.',
        detail:
          'Gain sole holding. Take a permanent holding Oathscar and lose neutral trust. Any surviving return-only name-pointing continues.',
        advantage: 'Carry the fragment without waiting for any keeper.',
        showIfAllFlags: ['c9-route-bargain', 'c9-return-promise-owned'],
        addFlags: [
          'c12-fragment-return-breached',
          'c12-oathscar-fragment-custody',
        ],
        result:
          'You close your hand on the fragment. An Oathscar crosses your palm. Vexa names the breach and the surviving return-only precision before both faces.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-record-legacy-bargain-custody',
        label: 'Place the old bargain fragment in public neutral keeping.',
        detail:
          'No witnessed return term can be verified. Record present holding without claiming an earlier promise was kept or broken.',
        advantage: 'Settle holding publicly without inventing old terms.',
        showIfAllFlags: ['c9-route-bargain'],
        hideIfAnyFlags: ['c9-return-promise-owned'],
        addFlags: ['c12-legacy-fragment-public-custody'],
        result:
          'Both witness lines record the missing term and close the fragment in a public neutral case.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-submit-stolen-fragment-restitution',
        label: 'Hand the stolen fragment to witnesses and end the theft claim.',
        detail:
          'End the admitted theft claim without inventing a neutral return promise.',
        advantage: 'Let Compact and mortal witnesses hold the fragment together, not House Sableglass.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c12-theft-restitution-submitted'],
        result:
          'Compact and mortal witnesses receive the fragment together. The public theft mark goes dark.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-retain-public-theft-claim',
        label: 'Keep the fragment with the theft claim visible.',
        detail:
          'Retain immediate holding. The Compact claim follows you after the finale.',
        advantage: 'Keep the fragment ready for boundary repairs.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c12-theft-claim-retained'],
        result:
          'You hang the hot fragment in public view. Its theft mark remains bright and unresolved.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-place-exposed-fragment-publicly',
        label: 'Place the exposed fragment with the public witness circle.',
        detail: 'Workers and witnesses keep access to the evidence.',
        advantage:
          'Prevent any hero, court, or house from taking the fragment privately.',
        showIfAllFlags: ['c9-route-exposure'],
        addFlags: ['c12-exposure-public-custody'],
        result:
          'The evidence frame locks into a public stand. Its marks remain readable from both sides allowed by the new law.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-place-exposed-fragment-in-joint-custody',
        label: 'Place the exposed fragment in joint Gate keeping.',
        detail:
          'Separate mortal and devil keepers must witness every future use.',
        advantage:
          'Keep the fragment available while blocking private control.',
        showIfAllFlags: ['c9-route-exposure'],
        hideIfAnyFlags: ['c12-gate-sealed'],
        addFlags: ['c12-exposure-joint-custody'],
        result:
          'Two independent locks close around the evidence frame. Neither side can open it alone.',
        next: 'c12-personal-destination',
      },
      {
        id: 'c12-place-legacy-fragment-in-public-custody',
        label: 'Place the fragment in public keeping. No owner is recorded yet.',
        detail:
          'Let present witnesses settle holding where earlier records are missing.',
        advantage: 'End private possession without inventing past terms.',
        hideIfAnyFlags: [
          'c9-route-bargain',
          'c9-route-theft',
          'c9-route-exposure',
        ],
        addFlags: ['c12-legacy-fragment-public-custody'],
        result:
          'Both witness lines sign the public case. No missing history is replaced with a false promise.',
        next: 'c12-personal-destination',
      },
    ],
  },

  'c12-personal-destination': {
    id: 'c12-personal-destination',
    kicker: 'After the law',
    title: 'Where You Choose to Live',
    location: 'The Changed Black Gate',
    objective: 'Choose Caelan’s destination separately from the world outcome.',
    threat: 'Uneasy',
    art: 'blackgatepassage',
    body: (state) => [
      `${custodyResult(state)} The battle is ending, but the new law does not choose your home.`,
      has(state, 'c12-gatekeeper')
        ? 'The Gate now lives in you. Every destination keeps the permanent limits: no silence, no transfer, no abandoned boundary, and no life wholly inside one realm.'
        : 'You may choose the road, the fortress ring, the changed threshold, or the Cinder Deep. The chosen Gate law alters how each destination works. Where do you go?',
    ],
    choices: [
      {
        id: 'c12-choose-road-destination',
        label: 'Return to the road.',
        detail: 'Answer future breaches and needs without taking a throne.',
        advantage: 'Keep a travelling life under the exact Gate law.',
        addFlags: ['c12-destination-road'],
        result:
          'You choose the road. If the Gate lives in you, the boundary travels too, but you still refuse a throne.',
        next: 'c12-relationship-ending',
      },
      {
        id: 'c12-choose-fortress-destination',
        label: 'Rule or rebuild the fortress ring.',
        detail:
          'Build governance, shelters, or warnings without claiming ownership of the other realm.',
        advantage: 'Give the changed border a stable mortal response.',
        addFlags: ['c12-destination-fortress'],
        result:
          'You choose the fortress ring. Its next stones will answer the law you made instead of copying the old Gate.',
        next: 'c12-relationship-ending',
      },
      {
        id: 'c12-choose-threshold-destination',
        label: 'Remain within the changed threshold.',
        detail:
          'Watch the sealed chamber, joint passage, broken boundary, or living Gate.',
        advantage: 'Keep direct watch over the law’s most dangerous edge.',
        addFlags: ['c12-destination-threshold'],
        result:
          'You choose the threshold. The place changes with the law, but the daily watch remains your own decision.',
        next: 'c12-relationship-ending',
      },
      {
        id: 'c12-choose-cinder-deep-destination',
        label: 'Disappear into the Cinder Deep.',
        detail:
          'Accept sealing on that side, recorded passage, an open breach, or the keeper’s inner boundary.',
        advantage: 'Continue the work among Cinder Deep communities.',
        hideIfAnyFlags: ['c12-gatekeeper'],
        addFlags: ['c12-destination-cinder-deep'],
        result:
          'You choose the Cinder Deep. The new law states whether that choice is final, witnessed, open, or carried inside you.',
        next: 'c12-relationship-ending',
      },
      {
        id: 'c12-choose-living-gate-inner-road',
        label: 'Travel the Cinder Deep edge of the living Gate.',
        detail:
          'Remain near Cinder Deep communities without pretending the carried Gate lets you belong wholly to one realm.',
        advantage:
          'Continue the work on the inner road while keeping every keeper restriction.',
        showIfAllFlags: ['c12-gatekeeper'],
        addFlags: ['c12-destination-cinder-deep'],
        result:
          'You take the inner road. The voices and boundary travel with you, so disappearance can never become abandonment.',
        next: 'c12-relationship-ending',
      },
    ],
  },

  'c12-relationship-ending': {
    id: 'c12-relationship-ending',
    kicker: 'A separate promise',
    title: 'What You Ask of No One',
    location: 'The Quiet Edge of the Boundary',
    objective:
      'Choose the relationship ending without changing the Gate or battle.',
    threat: 'Low',
    art: 'blackgatepassage',
    body: (state) => [
      `${destinationResult(state)} ${relationshipPresence(state)}`,
      'The world decision is already made. Love cannot improve it, and separation cannot weaken it. Earlier intimacy supplies no answer now. You may continue together, accept distance, choose friendship, close the bond, or live fully single. What do you ask for?',
    ],
    choices: [
      {
        id: 'c12-continue-with-mara',
        label: 'Ask Mara to continue as an equal partner.',
        detail:
          'She keeps her right to leave, disagree, and choose her own side.',
        advantage:
          'Continue the established relationship without a new impossible promise.',
        showIfRelationshipIntents: {
          mara: ['committed', 'exploring', 'interested'],
        },
        showIfAnyFlags: [
          'c9-mara-crossed-black-gate',
          'c9-mara-remained-at-gate',
        ],
        hideIfAnyFlags: ['c12-gate-sealed'],
        addFlags: ['c12-relationship-together', 'c12-relationship-mara'],
        result:
          'Mara says yes to the life you can both name. She promises no obedience and no impossible return.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-mara-inside-seal',
        label: 'Remain with Mara on the sealed inner side.',
        detail:
          'Both of you stay in the Cinder Deep. Neither can promise contact with the mortal face.',
        advantage:
          'Continue the relationship without erasing the seal’s separation.',
        showIfRelationshipIntents: {
          mara: ['committed', 'exploring', 'interested'],
        },
        showIfAllFlags: [
          'c12-gate-sealed',
          'c12-destination-cinder-deep',
          'c9-mara-crossed-black-gate',
        ],
        addFlags: ['c12-relationship-together', 'c12-relationship-mara'],
        result:
          'Mara freely stays beside you on the inner road. The closed Gate grants neither of you a hidden way back.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-mara-outside-seal',
        label: 'Remain with Mara on the sealed mortal side.',
        detail:
          'You stay outside together. The expedition inside becomes unreachable.',
        advantage:
          'Continue the relationship without moving either of you through the closed Gate.',
        showIfRelationshipIntents: {
          mara: ['committed', 'exploring', 'interested'],
        },
        showIfAnyFlags: ['c12-destination-road', 'c12-destination-fortress'],
        showIfAllFlags: ['c12-gate-sealed', 'c9-mara-remained-at-gate'],
        addFlags: ['c12-relationship-together', 'c12-relationship-mara'],
        result:
          'Mara freely stays beside you outside the sealed stone. Neither of you calls the people inside an acceptable loss.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-lysara',
        label: 'Ask Lysara to continue as an equal partner.',
        detail: 'Her work, loyalties, and right to refuse remain her own.',
        advantage:
          'Continue the established relationship within honest limits.',
        showIfRelationshipIntents: {
          lysara: ['committed', 'exploring', 'interested'],
        },
        showIfAnyFlags: [
          'c9-lysara-crossed-black-gate',
          'c9-lysara-remained-at-gate',
        ],
        hideIfAnyFlags: ['c12-gate-sealed'],
        addFlags: ['c12-relationship-together', 'c12-relationship-lysara'],
        result:
          'Lysara names the duties she keeps and the promise she will not make. Then she chooses the shared road that remains.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-lysara-inside-seal',
        label: 'Remain with Lysara on the sealed inner side.',
        detail:
          'Both of you stay in the Cinder Deep with her duties and right to refuse intact.',
        advantage:
          'Continue the relationship without inventing a crossing after closure.',
        showIfRelationshipIntents: {
          lysara: ['committed', 'exploring', 'interested'],
        },
        showIfAllFlags: [
          'c12-gate-sealed',
          'c12-destination-cinder-deep',
          'c9-lysara-crossed-black-gate',
        ],
        addFlags: ['c12-relationship-together', 'c12-relationship-lysara'],
        result:
          'Lysara chooses the inner road beside you. Her own work continues, and the sealed Gate gives no secret path home.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-lysara-outside-seal',
        label: 'Remain with Lysara on the sealed mortal side.',
        detail:
          'You stay outside together while the inner expedition remains beyond reach.',
        advantage:
          'Continue the relationship within the physical limit of the seal.',
        showIfRelationshipIntents: {
          lysara: ['committed', 'exploring', 'interested'],
        },
        showIfAnyFlags: ['c12-destination-road', 'c12-destination-fortress'],
        showIfAllFlags: ['c12-gate-sealed', 'c9-lysara-remained-at-gate'],
        addFlags: ['c12-relationship-together', 'c12-relationship-lysara'],
        result:
          'Lysara stays beside the mortal locks she chose. Neither of you pretends the sealed expedition can answer.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-vexa',
        label: 'Ask Vexa for an equal partnership.',
        detail:
          'No true name, bargain, attraction, or old intimacy answers for her.',
        advantage:
          'Continue only if her established intent permits a free yes.',
        showIfRelationshipIntents: {
          vexa: ['committed', 'exploring', 'interested'],
        },
        hideIfAnyFlags: [
          'c12-gate-sealed',
          'c9-vexa-permanent-hostility',
          'c9-refused-private-connection',
        ],
        addFlags: ['c12-relationship-together', 'c12-relationship-vexa'],
        result:
          'Vexa considers the words without magic between you. “Equal, revisable, and ours,” she says. “Yes.”',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-continue-with-vexa-inside-seal',
        label: 'Remain with Vexa on the sealed inner side.',
        detail:
          'Both of you stay in the Cinder Deep. The choice creates no claim on her name or consent.',
        advantage:
          'Continue the relationship without hiding the mortal world’s loss.',
        showIfRelationshipIntents: {
          vexa: ['committed', 'exploring', 'interested'],
        },
        showIfAllFlags: ['c12-gate-sealed', 'c12-destination-cinder-deep'],
        hideIfAnyFlags: [
          'c9-vexa-permanent-hostility',
          'c9-refused-private-connection',
        ],
        addFlags: ['c12-relationship-together', 'c12-relationship-vexa'],
        result:
          'Vexa gives a fresh yes on the inner road. The sealed Gate grants no private exception and no authority over either of you.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-choose-honest-distance',
        label: 'Leave the future open across honest distance.',
        detail: 'Promise no reunion that the Gate law may prevent.',
        advantage: 'Preserve care without false certainty.',
        addFlags: ['c12-relationship-distance'],
        result:
          'You leave room for a future meeting without claiming passage or a return. Whatever care already exists remains freely given; nobody owes you a new answer.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-choose-enduring-friendship',
        label: 'Choose a future built around friendship.',
        detail:
          'Release your remaining romantic claims while preserving trust and independent futures.',
        advantage: 'Carry the relationship forward as chosen friendship.',
        addFlags: ['c12-relationship-friendship'],
        result:
          'You choose friendship without asking anyone to answer for an absent person. Your companions keep their own futures, and you release your remaining romantic claims.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-close-relationship-honestly',
        label: 'Release any remaining romantic hopes.',
        detail:
          'End your romantic claims without rewriting what happened or requiring another person’s permission.',
        advantage: 'Give both people a clear end and independent future.',
        addFlags: ['c12-relationship-closed'],
        result:
          'You release your hopes without blame or magic. Whatever you shared remains true, and no longer makes a romantic claim.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-choose-vexa-political-truce',
        label: 'Set a public ceasefire with Vexa, with named limits.',
        detail:
          'Keep diplomacy public. Create no trust, attraction, private access, or passage right.',
        advantage:
          'End the series with a workable boundary during hostility or refusal.',
        showIfAnyFlags: [
          'c9-vexa-permanent-hostility',
          'c9-refused-private-connection',
          'c10-vexa-hostile-truce-held',
        ],
        addFlags: ['c12-relationship-political-truce'],
        result:
          'Vexa accepts one public truce with named limits. She lowers no personal guard and grants no private access.',
        next: 'c12-changed-sunrise',
      },
      {
        id: 'c12-choose-fulfilled-single-life',
        label: 'Choose a full life without a partner.',
        detail:
          'A complete ending for platonic, ended, hostile, or unattached paths.',
        advantage: 'Keep every world outcome available without romance.',
        addFlags: ['c12-relationship-single'],
        result:
          'You choose your own life without treating solitude as failure or asking an absent person to answer.',
        next: 'c12-changed-sunrise',
      },
    ],
  },

  'c12-changed-sunrise': {
    id: 'c12-changed-sunrise',
    kicker: 'The first altered dawn',
    title: 'A Law Written in Light',
    location: 'The Changed Boundary',
    objective: 'Witness the changed sunrise and carry its exact future state.',
    threat: 'Low',
    art: 'blackgatecollision',
    body: (state) => [
      `${destinationResult(state)} ${relationshipResult(state)} ${custodyResult(state)}`,
      has(state, 'c12-sunrise-barred')
        ? 'Dawn rises with one dark band across it, like a road closed by a solid wall. You do not know where that lost light once led.'
        : has(state, 'c12-sunrise-mutual-road')
          ? 'A narrow road of dawn appears only when one mortal and one devil witness name it together. When either falls silent, the road fades.'
          : has(state, 'c12-sunrise-unstable-road')
            ? 'Dawn splits into an open, shaking road. Light spills through without a keeper, and distant shapes can already test its edge.'
            : 'Dawn bends around your silhouette. The voices inside you speak one witnessed name at a time, and the light answers without explaining why.',
      'The changed light proves that the Gate decision damaged the law of dawn. You do not know the road beyond that fact. Which dawn do you face?',
    ],
    choices: [
      {
        id: 'c12-face-barred-dawn',
        label: 'Face the barred dawn.',
        detail: 'One later approach into the light is sealed.',
        advantage:
          'Complete Caelan’s series with the sealed world state recorded.',
        showIfAllFlags: ['c12-gate-sealed'],
        addFlags: ['c12-series-complete'],
        result:
          'The dark band holds. You turn toward the life you chose while both realms learn the cost of silence.',
        next: 'c12-ending-sealed',
      },
      {
        id: 'c12-face-mutual-dawn',
        label: 'Face the dawn that requires two voices.',
        detail: 'One later approach into the light requires mutual permission.',
        advantage:
          'Complete Caelan’s series with the neighbour world state recorded.',
        showIfAllFlags: ['c12-gate-consent-passage'],
        addFlags: ['c12-series-complete'],
        result:
          'Two witnesses name the light, then let it close. You begin the first year of work without calling it peace already won.',
        next: 'c12-ending-consent-passage',
      },
      {
        id: 'c12-face-unstable-dawn',
        label: 'Face the unstable open dawn.',
        detail: 'One later approach into the light is open and dangerous.',
        advantage:
          'Complete Caelan’s series with the broken world state recorded.',
        showIfAllFlags: ['c12-gate-broken'],
        addFlags: ['c12-series-complete'],
        result:
          'The light shakes but does not close. You turn toward future resistance with no central lock to hide behind.',
        next: 'c12-ending-broken',
      },
      {
        id: 'c12-face-witnessed-dawn',
        label: 'Face the dawn that knows the carried voices.',
        detail:
          'One later approach into the light will depend on witnessed identity.',
        advantage:
          'Complete Caelan’s series with the keeper world state recorded.',
        showIfAllFlags: ['c12-gatekeeper'],
        addFlags: ['c12-series-complete'],
        result:
          'The light speaks through the voices you cannot silence. You keep walking at the boundary because the choice remains yours within its cost.',
        next: 'c12-ending-gatekeeper',
      },
    ],
  },

  'c12-ending-sealed': {
    id: 'c12-ending-sealed',
    kicker: 'Caelan’s finale · The sealed realms',
    title: 'A Door That Will Not Answer',
    location: 'The Sealed Black Gate',
    objective: 'Live with the separation you chose.',
    threat: 'Low',
    art: 'blackgatesealed',
    body: (state) => endingEpilogue(state),
    choices: [],
    final: true,
  },

  'c12-ending-consent-passage': {
    id: 'c12-ending-consent-passage',
    kicker: 'Caelan’s finale · Recognised neighbours',
    title: 'The Door That Asks Twice',
    location: 'The Mutual Black Gate',
    objective: 'Begin the hard work of shared permission.',
    threat: 'Low',
    art: 'blackgatepassage',
    body: (state) => endingEpilogue(state),
    choices: [],
    final: true,
  },

  'c12-ending-broken': {
    id: 'c12-ending-broken',
    kicker: 'Caelan’s finale · The open breach',
    title: 'No Lock Above the Road',
    location: 'The Broken Black Gate',
    objective: 'Meet an open future without central control.',
    threat: 'Uneasy',
    art: 'blackgatebroken',
    body: (state) => endingEpilogue(state),
    choices: [],
    final: true,
  },

  'c12-ending-gatekeeper': {
    id: 'c12-ending-gatekeeper',
    kicker: 'Caelan’s finale · The living boundary',
    title: 'Every Voice Keeps Its Name',
    location: 'Caelan’s Carried Gate',
    objective: 'Keep the boundary without owning the people who cross it.',
    threat: 'Uneasy',
    art: 'blackgatekeeper',
    body: (state) => endingEpilogue(state),
    choices: [],
    final: true,
  },
};
