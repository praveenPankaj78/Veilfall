import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

function expedition(state: GameState) {
  const members = ['Vexa'];
  if (has(state, 'c9-roster-futureless'))
    members.push('Ansel and two Futureless witnesses');
  if (has(state, 'c9-roster-pell'))
    members.push('wounded Pell and his shield escort');
  else if (has(state, 'c9-roster-wardens'))
    members.push('the mixed wardens and Moot fighters');
  if (has(state, 'c9-roster-crown'))
    members.push('Teren and six Crown volunteers');
  if (has(state, 'c9-mara-crossed-black-gate')) members.push('Mara');
  if (has(state, 'c9-lysara-crossed-black-gate')) members.push('Lysara');
  return members.join(', ');
}

function gateGuide(state: GameState) {
  if (has(state, 'c10-free-ledger-guide-accepted'))
    return 'The Free Ledger guide presses its paid mark to the first seal. One Sableglass checkpoint opens without asking for another price.';
  return 'No guide mark answers the first seal. The company must buy each public street in order, but no petition or hearing is owed.';
}

function fragmentState(state: GameState) {
  if (has(state, 'c9-route-bargain')) {
    if (has(state, 'c9-cut-true-name-clause'))
      return 'The fragment rests in its open neutral case. True-name precision ended after alignment. The return promise remains active and cannot be sold.';
    return 'The fragment rests in its open neutral case. Vexa may locate its bearer for alignment only until the stated return. That precision reaches nothing else.';
  }
  if (has(state, 'c9-route-theft'))
    return 'The admitted stolen fragment hangs in view at your belt. Its heat prevents concealment, and the Compact debt remains open.';
  return 'The fragment sits in the public evidence frame. House Sableglass surrendered it under witness law, so the chain may support a damages claim.';
}

function methodAtGate(state: GameState) {
  if (has(state, 'c10-offer-method-shared'))
    return 'The shared ledger lies open. Its terms can expose a changed price, while any motives shared by permission remain known inside the expedition.';
  if (has(state, 'c10-offer-method-private'))
    return 'Each private seal remains with its owner. The city may test the seal edge, but nobody may open another person’s terms.';
  if (has(state, 'c10-burden-oath-withdrawn'))
    return 'The burden proposal was withdrawn before it bound. Private seals remain, and no accounting debt exists.';
  return 'The burden Oath ended at Vathis. Every person kept an exit. You still owe each consenting traveller a private account of what touched their offer.';
}

function engineLead(state: GameState) {
  if (has(state, 'c10-free-ledger-guide-accepted'))
    return 'The guide points beyond the checkpoint. Three civic seals control the streets and auction. A black glass lease beneath them names House Sableglass as the engine district’s current key holder.';
  if (has(state, 'c9-vexa-guarded-trust'))
    return 'Vexa’s private patrol map marks the same black glass lease at two service doors. Her help names a route, not ownership of you or the fragment.';
  if (hasAny(state, ['c9-sableglass-publicly-exposed', 'c9-route-exposure']))
    return 'The public evidence frame warms beside one of three civic seals. A matching black glass lease runs from that seal toward the engine spire.';
  return 'A clerk buys one street with a pale token. The paving turns beneath his feet, revealing three civic seals and one black glass lease leading toward the engine spire.';
}

function streetMethod(state: GameState) {
  if (has(state, 'c10-offer-method-shared'))
    return 'The street offers ten minutes of passage for one copied route. The shared ledger shows that Sableglass changed “copied” to “owned” after the first bell.';
  if (has(state, 'c10-offer-method-private'))
    return 'The street offers ten minutes of passage. Each private seal shows the same exit mark, but one false door reports a safe signal without an owner.';
  if (has(state, 'c10-offer-method-oath'))
    return 'The street offers ten minutes of passage. Old ash bands point toward the people whose offers you carried, then stop at Vathis where the Oath ended.';
  return 'The street offers ten minutes of passage for one public token. The benefit, price, duration, accepting step, and exit appear on separate stones.';
}

function destroyedOath(state: GameState) {
  if (has(state, 'c9-destroyed-red-moot-authority-oath'))
    return 'The Red Moot authority Oath is gone. The city offers no magical shield for the Moot fighters’ right to choose their commanders.';
  if (has(state, 'c9-destroyed-crown-restitution-oath'))
    return 'The Crown restitution Oath is gone. Ansel cannot claim its promised hearing as auction value or protection.';
  if (has(state, 'c9-destroyed-clan-refusal-oath'))
    return 'The clan refusal Oath is gone. A contracted door can no longer be forced to honour that lost protection.';
  if (has(state, 'c9-destroyed-honest-command-limit-oath'))
    return 'The honest command limit is gone. Every fighter repeats the authority they accepted before any order moves them.';
  if (has(state, 'c9-destroyed-unsea-investigation-oath'))
    return 'The investigation Oath is gone. Korran carries that work in Edrath, and you cannot use it to identify any engine voice.';
  if (has(state, 'c8-released-crown-oath'))
    return 'The Crown service Oath remains released. The Price Court cannot list it as your property or duty.';
  if (has(state, 'c8-burned-lesser-oath'))
    return 'The Warden patrol Oath remains ash. No city bell can restore it or pull you away from the expedition.';
  return 'The surviving Oaths warm along your shield. None may be sold unless its own terms allow transfer.';
}

function weatherPressure(state: GameState) {
  if (has(state, 'c8-sacrificed-first-fort'))
    return 'With First Fort gone, no mortal anchor steadies the rear seam. The ash rain begins one bell early.';
  if (has(state, 'c8-accepted-ash-compact'))
    return 'White Compact fire holds the rear seam long enough for the group to read the shelter terms.';
  return 'The united wardens send one living signal through the rear seam. It keeps the rain from erasing the exit mark.';
}

function accountingPressure(state: GameState) {
  if (has(state, 'c10-offer-method-shared')) {
    if (has(state, 'c10-private-desires-exposed'))
      return 'The shared ledger catches changed terms, but Sableglass already knows the painful desires each owner chose to reveal.';
    return 'The shared ledger contains complete terms and only the motives each owner allowed. It can challenge substitutions without widening disclosure.';
  }
  if (has(state, 'c10-offer-method-private'))
    return 'Every owner still holds an opaque seal. The sealed edges prove no completed bargain widened, while one hidden coordination risk remains.';
  if (has(state, 'c10-burden-oath-withdrawn'))
    return 'No burden Oath bound. The proposal owns no answer, and every private seal remains with its original holder.';
  if (has(state, 'c10-oath-traveller-withdrew'))
    return 'One traveller withdrew before Vathis. That person’s empty band proves the exit worked, but their testimony cannot support a group claim.';
  return 'The burden Oath ended at Vathis. Its closed bands still record what touched each offer, and each owner must hear that record alone.';
}

function illusionSource(state: GameState) {
  if (
    state.relationships.mara.intent === 'committed' &&
    hasAny(state, ['c9-mara-crossed-black-gate', 'c9-mara-remained-at-gate'])
  ) {
    const place = has(state, 'c9-mara-crossed-black-gate')
      ? 'The real Mara stands behind you and draws her knife.'
      : 'The real Mara remains at the mortal Gate and cannot speak here.';
    return [
      'Ash builds a roadside inn with a dry roof and two familiar cups. An image wearing Mara’s face opens the door.',
      'It offers a quiet home with Mara if you abandon the engine and everyone outside that home. The image asks for one clear step across its threshold.',
      `${place} The image has her memory and none of her present consent or knowledge.`,
    ];
  }
  if (
    state.relationships.lysara.intent === 'committed' &&
    hasAny(state, [
      'c9-lysara-crossed-black-gate',
      'c9-lysara-remained-at-gate',
    ])
  ) {
    const place = has(state, 'c9-lysara-crossed-black-gate')
      ? 'The real Lysara stands outside the false silk and cuts one living thread free.'
      : 'The real Lysara remains at the mortal Gate and cannot answer here.';
    return [
      'Living silk appears across a green road beyond both kingdoms. An image wearing Lysara’s face holds out an open hand.',
      'It offers a shared road if you place Thornweald above every other people and leave the engine untouched. The price lasts forever.',
      `${place} The image carries no new treaty, promise, consent, or knowledge from her.`,
    ];
  }
  if (
    !has(state, 'c9-vexa-permanent-hostility') &&
    !has(state, 'c9-refused-private-connection') &&
    hasAny(state, [
      'c9-shared-private-night',
      'c9-vexa-attraction-acknowledged',
    ])
  )
    return [
      'A quiet house appears between two open Gates. An image wearing Vexa’s face closes the public shutters and leaves one private lamp.',
      'It offers a life where neither realm owns you. The price is abandoning the witness line before the engine auction.',
      'The real Vexa stays beside the expedition. “It knows what I fear,” she says. “It does not know what I choose.”',
    ];
  return [
    'The street becomes the yard of your father’s inn. Every traveller stands inside, healed and ready to go home.',
    'The offer gives you release from every remaining duty if you leave the engine to Vathis. The accepting act is laying your shield by the door.',
    'The figures repeat old memories. None carries a living person’s present choice or new knowledge.',
  ];
}

function illusionReaction(state: GameState) {
  if (has(state, 'c11-affirmed-mara-future')) {
    if (has(state, 'c9-mara-crossed-black-gate'))
      return 'Mara knocks her shoulder against yours. “Want the inn,” she says. “Just do not lock me inside your wanting.”';
    return 'The false inn breaks. The real Mara remains beyond the Gate, and your wish creates no answer for her.';
  }
  if (has(state, 'c11-affirmed-lysara-future')) {
    if (has(state, 'c9-lysara-crossed-black-gate'))
      return 'Lysara gathers the false silk. “A shared road cannot begin with one people owning the map,” she says.';
    return 'The green road breaks. The real Lysara remains beyond the Gate, and no image may accept a future for her.';
  }
  if (has(state, 'c11-affirmed-vexa-future'))
    return 'Vexa leaves the false shutters open. “I might want that house,” she says. “I will not purchase it with everyone outside.”';
  if (has(state, 'c11-affirmed-duty-free-future'))
    return 'The false inn empties. You can want every survivor home without pretending one abandoned duty will make it true.';
  if (has(state, 'c11-illusion-source-captured'))
    return 'The broken image leaves one Sableglass listening bead. It can prove who built the trap.';
  return 'The illusion folds into ash after your refusal. It gains no relationship, promise, consent, or route.';
}

function obligationInventory(state: GameState) {
  const items: string[] = [];
  if (has(state, 'c11-petition-hearing-held'))
    items.push(
      'The named Free Ledger signers own a hearing credit. Their fresh marks make it transferable.',
    );
  if (hasAny(state, ['c9-route-exposure', 'c9-sableglass-publicly-exposed']))
    items.push(
      'The expedition evidence chain holds a public Sableglass damages claim. That claim may legally transfer once.',
    );
  if (!has(state, 'c9-vexa-permanent-hostility'))
    items.push(
      'The Ash Compact may offer one public surety if Vexa chooses to post it.',
    );
  items.push(
    'The people who testify own an independent witness bond. Each person controls their own mark.',
  );
  items.push(
    'You may offer one limited Price Court appearance duty. It transfers only after your clear acceptance.',
  );
  return items;
}

function excludedInventory(state: GameState) {
  const exact = has(state, 'c9-return-promise-owned')
    ? ' The neutral fragment return promise forbids transfer and stays outside the sale.'
    : '';
  return `Affection, intimacy, another person’s promise, true-name access, Vaor’s permission, and every untransferable Oath are not currency.${exact}`;
}

function rosterProof(state: GameState) {
  if (has(state, 'c9-roster-futureless'))
    return 'Ansel and both Futureless witnesses can join three independent sold-promise records into one challenge without giving Caelan ownership.';
  if (has(state, 'c9-roster-pell'))
    return 'Pell’s complete lock map proves which engine doors Sableglass leased before the auction. His escort carries the page while he keeps his injured pace.';
  if (has(state, 'c9-roster-crown'))
    return 'Teren and six volunteers can place seven separate witness marks. No Crown army authority enters their bond.';
  return 'The mixed wardens and Moot fighters can witness passage under their individually accepted command limits.';
}

function vaorProof(state: GameState) {
  if (has(state, 'c9-vaor-gift-proof-guard'))
    return 'Vaor’s willing ember warms beside the real engine response and stays cold beside a copied voice.';
  if (has(state, 'c9-vaor-pact-proof-carried'))
    return 'You ask through Vaor’s pact. He permits one test that exposes erased truth and protects living people.';
  if (has(state, 'c9-vaor-collateral-released'))
    return 'Vaor’s released collateral is no longer yours to call. His restored flame remains beyond the Gate.';
  if (
    hasAny(state, ['c9-stolen-ember-not-used', 'c9-forced-collateral-broken'])
  )
    return 'The stolen ember stays sheathed. Vaor refused this service, so no dragonfire verifies the engine.';
  return 'No dragonfire answers. The expedition must rely on the route phrase and living witnesses.';
}

function routeEvidence(state: GameState) {
  if (has(state, 'c11-route-revolt'))
    return 'Sira, Oren, and Pellan press three different refusal marks into the worker witness line. Their engine phrase opens a channel no owner can speak through alone.';
  if (has(state, 'c11-route-auction'))
    return 'The purchased access deed contains an audit phrase. It opens the engine only while every bid asset and future restriction remains visible.';
  return 'The captured Sableglass relay carries the engine route phrase. The fragment aligns its broken teeth with the relay without changing custody.';
}

function gatePressure(state: GameState) {
  if (has(state, 'c8-sacrificed-first-fort'))
    return 'The missing First Fort leaves no rear anchor. The inner Gate opens another handspan before the expedition can form.';
  if (has(state, 'c8-accepted-ash-compact'))
    return 'Ash Compact white fire catches one failing hinge. It buys a single breath under the original public agreement.';
  return 'The united wardens’ living signal reaches the inner face. One hinge holds while the other begins to turn.';
}

function routeCost(state: GameState) {
  if (has(state, 'c11-route-revolt'))
    return has(state, 'c11-revolt-square-mythic')
      ? 'The refusal square holds, while your Red Moot command freedom remains restricted until the Gate law changes.'
      : 'The refusers hold their own square. Broken public streets and the chosen rescue cost remain behind them.';
  if (has(state, 'c11-route-auction'))
    return has(state, 'c11-auction-victims-mythic')
      ? 'Your lawful invasion right holds, and you cannot refuse the named victims’ Price Court hearing.'
      : 'The lawful invasion right holds under the exact obligation placed in the winning bid.';
  return has(state, 'c11-force-retreat-mythic')
    ? 'The corridor remains open behind every willing traveller, and you cannot cross the next contract door before the last of them.'
    : 'The expedition holds a damaged corridor with the physical and political cost chosen during the march.';
}

function entryConsequence(state: GameState) {
  if (has(state, 'c11-public-entry-slower'))
    return 'The slower public route creates no hearing debt. Moving towers hide one lease renewal, so you trace it from the public seals.';
  if (has(state, 'c11-guide-checkpoint-delivered'))
    return 'The paid checkpoint route leaves the first auction bell ahead of you. The promised petition still must be heard before it can become faction property.';
  if (has(state, 'c11-auction-time-lost'))
    return 'The unpriced climb preserved every contract boundary, but the first auction notice is already posted.';
  return 'The slower public route creates no hearing debt. Moving towers hide one lease renewal, so you trace it from the public seals.';
}

function weatherConsequence(state: GameState) {
  if (has(state, 'c11-shelter-all-crossed-dry'))
    return 'Every injury and record reaches the next street dry. Bring Them Home releases your lead boot after the last traveller crosses.';
  if (has(state, 'c11-rain-route-exposed'))
    return 'Wet ash marks the route and clothing. The expedition arrives early enough to contest the second bell.';
  if (has(state, 'c11-auction-time-lost'))
    return 'The ordinary roof protects every injury and record, but Sableglass gains the second auction bell.';
  return 'Wet ash marks the route and clothing. The expedition arrives early enough to contest the second bell.';
}

function revoltPreparation(state: GameState) {
  if (has(state, 'c11-revolt-families-moved'))
    return 'Oren’s families are beyond the cancellable shelters. Sableglass used the delay to add guards at the engine stair.';
  if (has(state, 'c11-worker-shelters-at-risk'))
    return 'The first work line is free and joins by choice. Their families remain under roofs Sableglass can cancel.';
  if (has(state, 'c11-revolt-collar-proof'))
    return 'Pellan’s copied collar clauses survive in three hands. The warned engine guard closes one public stair.';
  return 'The workers hold separate positions while Sableglass begins closing the square.';
}

function revoltProtection(state: GameState) {
  if (has(state, 'c11-revolt-square-mythic'))
    return 'The mythic refusal square rejects copied commands. Your own authority remains bound to the Moot fighters’ accepted limits.';
  if (has(state, 'c11-revolt-futureless-shield'))
    return 'Three Futureless records break the shared collar claim. The square stays intact without giving you command of it.';
  if (has(state, 'c11-public-street-damaged'))
    return 'Individual refusal marks hold the square, while broken public paving narrows the rescue lane.';
  return 'The square remains open, but no earlier shield prevents the shelter stones from rising.';
}

function revoltRescueConsequence(state: GameState) {
  if (has(state, 'c11-revolt-worker-injured'))
    return 'The engine tunnel is secure, but one worker reaches its wheel with a crushed hand and needs Medicine.';
  if (has(state, 'c11-revolt-families-saved'))
    return 'The shelter line reaches safety before the three workers turn the engine wheels.';
  return 'The refusers reach the engine wheels with the square still unsettled behind them.';
}

function auctionHolderConsequence(state: GameState) {
  if (has(state, 'c11-invasion-right-caelan'))
    return 'The narrow deed stays in your hand. Its one named force and one bell limit every step toward the engine.';
  if (has(state, 'c11-invasion-right-free-seat'))
    return 'The free Court seat carries the deed in public view while you keep fragment custody.';
  return 'The deed remains on the public stand until a legal holder is named.';
}

function auctionBidConsequence(state: GameState) {
  if (has(state, 'c11-auction-hearing-credit-bid'))
    return 'The signers’ hearing credit defeats the first work-hour block. Its public renewal hearing remains attached.';
  if (has(state, 'c11-auction-damages-claim-bid'))
    return 'The Sableglass damages claim cancels one house bid and remains public evidence.';
  if (has(state, 'c11-auction-compact-surety-bid'))
    return 'Vexa’s public surety holds one round. The Compact will demand one witnessed passage after the Gate is safe.';
  if (has(state, 'c11-auction-roster-witness-bid'))
    return 'Independent expedition marks defeat a bundled Sableglass claim. Each witness still owns their mark.';
  if (has(state, 'c11-auction-appearance-duty-bid'))
    return 'Your appearance duty holds one round and creates a later public review that you cannot assign away.';
  return 'The first scale remains level while the Court waits for a lawful bid.';
}

function auctionCounterConsequence(state: GameState) {
  if (has(state, 'c11-auction-victims-mythic'))
    return 'The hidden victims’ names remain fixed on the scale. The invasion deed carries your duty to attend their hearing.';
  if (has(state, 'c11-auction-fraud-countered'))
    return 'The captured illusion bead voids Sableglass’s hidden threshold and preserves every term of the first bid.';
  if (has(state, 'c11-auction-method-countered'))
    return 'The Chapter Ten records separate every owner. Sableglass loses the collected block and cannot rebundle it.';
  if (has(state, 'c11-auction-review-counterbid'))
    return 'The narrow review defeats the final house bid. Your right to refuse that one public session is already bound.';
  return 'The free seat holds the sale open until every remaining term is visible.';
}

function forceFormationConsequence(state: GameState) {
  if (has(state, 'c11-force-formation-futureless'))
    return 'Ansel and the two witnesses expose copied orders before the front line obeys them.';
  if (has(state, 'c11-force-formation-pell'))
    return 'Pell’s escort moves at his injured pace through the mapped service turn. Sableglass cannot close both locks together.';
  if (has(state, 'c11-force-formation-crown'))
    return 'Teren and six volunteers hold seven chosen posts. No Crown March command enters the corridor.';
  if (has(state, 'c11-force-formation-mixed'))
    return 'Wardens and Moot fighters repeat their accepted limits before each movement. Copied orders cannot widen command.';
  return 'The expedition reaches the barricade without an established formation advantage.';
}

function forceRetreatConsequence(state: GameState) {
  if (has(state, 'c11-force-retreat-mythic'))
    return 'The mythic retreat keeps the door open for every willing traveller. You remain physically last until all reach the inner Gate.';
  if (has(state, 'c11-force-command-retreat'))
    return 'The ordered rotation beats the reinforcements to the relay and leaves the public wall intact.';
  if (has(state, 'c11-force-sidewall-broken'))
    return 'The broken sidewall keeps the retreat open. Vathis records the civic damage against future cooperation.';
  if (has(state, 'c11-force-ordinary-retreat'))
    return 'Pell’s mapped retreat saves the company, but reinforced guards reach the relay first.';
  return 'The retreat remains open, but no recorded method has yet changed the relay guard.';
}

function earnedQuestionConsequence(state: GameState) {
  if (has(state, 'c11-elian-gate-chain-tested'))
    return 'The left chain tightens exactly when named. The voice can reach the engine, though that proves no identity or location.';
  if (has(state, 'c11-elian-motive-tested'))
    return 'The voice answers why merger threatens separate choice before she names Malrec’s hope.';
  if (has(state, 'c11-elian-question-earned'))
    return 'The witnessed channel carries your request for a name and Malrec’s purpose.';
  return 'The engine voice waits behind a witnessed channel.';
}

function elianRecordConsequence(state: GameState) {
  if (has(state, 'c11-elian-channel-protected'))
    return 'The engine channel is closed before any faction can buy it. The living witnesses still carry the bounded warning.';
  if (has(state, 'c11-elian-public-opposition'))
    return 'The public witness line carries the voice’s opposition. It proves no body, death, prison, or singular identity.';
  if (has(state, 'c11-elian-record-bounded'))
    return 'The bounded record carries only the name, Malrec’s belief, and the voice’s refusal of merger.';
  return 'The living witnesses carry the voice’s warning toward the inner Gate.';
}

function vexaAuctionPosture(state: GameState) {
  if (has(state, 'c9-vexa-permanent-hostility'))
    return 'Vexa remains beyond sword reach. Her armed public truce requires threat warnings and nothing more.';
  if (has(state, 'c9-refused-private-connection'))
    return 'Vexa keeps the refused private boundary. She identifies one Sableglass bidder in public and asks for no personal answer.';
  if (has(state, 'c9-vexa-guarded-trust'))
    return 'Vexa lays her patrol map beside the Sableglass seats. Guarded trust makes the service routes readable without granting private access.';
  if (has(state, 'c9-vexa-adversarial-respect'))
    return 'Vexa checks every route term twice and expects you to do the same. Adversarial respect buys warning, not trust.';
  if (
    hasAny(state, [
      'c9-shared-private-night',
      'c9-vexa-attraction-acknowledged',
    ])
  )
    return 'Vexa meets your eyes, then points to the Sableglass seats. Private history changes her warning, never the price or consent.';
  return 'Vexa watches the Sableglass seats. “Whichever road you choose,” she says, “they will price the freedom you use.”';
}

export const chapterElevenNodes: Record<string, StoryNode> = {
  'c11-vathis-gate': {
    id: 'c11-vathis-gate',
    kicker: 'Chapter Eleven',
    title: 'City of Every Price',
    location: 'Vathis Public Gate',
    objective: 'Identify who controls access to Malrec’s engine.',
    threat: 'Rising',
    art: 'vathisstreets',
    introducesStoryTerms: ['Price Court'],
    body: (state) => [
      'Three metal seals hang above the public gate. Two are trapped inside black glass. The third turns freely above a narrow clerk’s bench.',
      'A street waits behind the gate as a wall of upright stones. A devil places a pale token into the bench. The stones lower beneath her feet, and one bell rings.',
      'Vexa taps the three seals. “The Price Court,” she says. “It sells public use of the city.”',
      gateGuide(state),
      `You count the people who reached the city: ${expedition(state)}. No one else steps from the Black Gate.`,
      'How do you enter without giving the gate a new claim?',
    ],
    choices: [
      {
        id: 'c11-use-promised-ledger-checkpoint',
        label: 'Use the Free Ledger’s promised checkpoint passage.',
        detail:
          'Take the paid advantage and carry the sealed petition directly to its public hearing.',
        advantage:
          'Pass the Sableglass checkpoint and identify the engine district before the first auction bell.',
        showIfAllFlags: ['c10-free-ledger-guide-accepted'],
        addFlags: ['c11-guide-checkpoint-delivered'],
        result:
          'The guide mark opens both black glass seals. A pale route points straight toward the white engine spire.',
        next: 'c11-petition-hearing',
      },
      {
        id: 'c11-take-slower-public-entry',
        label: 'Buy the slower public entry one street at a time.',
        detail: 'Use no guide benefit and accept no petition or hearing duty.',
        advantage:
          'Enter Vathis without creating a faction debt or exposing a private seal.',
        showIfAllFlags: ['c10-free-ledger-guide-refused'],
        addFlags: ['c11-public-entry-slower'],
        result:
          'You leave the guide lane untouched. The first public stone lowers, while the engine spire vanishes behind two moving towers.',
        next: 'c11-slow-street',
      },
      {
        id: 'c11-use-uncontracted-entry',
        label: 'Take the uncontracted stair beside the gate.',
        detail:
          'Use the safe fallback for an older save with no stored guide answer.',
        advantage:
          'Enter without inventing a checkpoint benefit or hearing obligation.',
        hideIfAnyFlags: [
          'c10-free-ledger-guide-accepted',
          'c10-free-ledger-guide-refused',
        ],
        addFlags: ['c11-public-entry-slower'],
        result:
          'You take the narrow stair. It costs time and height, but no unseen contract follows.',
        next: 'c11-slow-street',
      },
    ],
  },

  'c11-petition-hearing': {
    id: 'c11-petition-hearing',
    kicker: 'A promised hearing before delivery',
    title: 'The Open Bench',
    location: 'Vathis Public Gate',
    objective:
      'Hear the Free Ledger petition before any ruling faction receives it.',
    threat: 'Uneasy',
    art: 'vathisstreets',
    body: (state) => [
      'The guide places the sealed petition on the free metal seat. It does not hand the page to the Price Court or Vexa.',
      methodAtGate(state),
      'Sira, Oren, and Pellan name themselves as signers. Sira wants sold service promises opened now. Oren wants families moved first. Pellan fears losing the shelter tied to his collar.',
      'The hearing must keep all three voices separate. Which Chapter Ten record protects that hearing?',
    ],
    choices: [
      {
        id: 'c11-hear-petition-with-shared-ledger',
        label: 'Compare the petition with the shared offer ledger.',
        detail:
          'Use only terms and motives each owner already allowed into the record.',
        advantage:
          'Expose changed Sableglass clauses and earn a transferable hearing credit for the signers.',
        showIfAllFlags: ['c10-offer-method-shared'],
        addFlags: ['c11-petition-hearing-held'],
        result:
          'The public terms match three collars. A changed Sableglass exit clause blackens under the signers’ separate marks.',
        next: 'c11-engine-control',
      },
      {
        id: 'c11-hear-petition-behind-private-seals',
        label: 'Let each signer testify behind their own closed seal.',
        detail:
          'Protect private desires while recording only the collar terms they choose to challenge.',
        advantage:
          'Earn a sealed hearing credit without giving the Court access to private offers.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c11-petition-hearing-held'],
        result:
          'Three sealed edges touch the petition. The Court receives the challenged terms and none of the desires behind them.',
        next: 'c11-engine-control',
      },
      {
        id: 'c11-give-burden-accounts-before-hearing',
        label: 'Give every burden-Oath participant a private account first.',
        detail:
          'Complete the owed accounting before using any person’s testimony in public.',
        advantage:
          'Release clean witness marks while preserving each withdrawal and private choice.',
        showIfAllFlags: ['c10-offer-method-oath', 'c10-burden-oath-active'],
        addFlags: ['c11-burden-accounts-complete', 'c11-petition-hearing-held'],
        result:
          'You meet each person beyond hearing range. Only those who return and mark the page become witnesses.',
        next: 'c11-engine-control',
      },
      {
        id: 'c11-record-withdrawn-burden-at-hearing',
        label: 'Record that the proposed burden Oath never bound.',
        detail:
          'Hold the petition hearing without inventing an accounting debt.',
        advantage:
          'Prove that an unaccepted promise owns nothing and earn ordinary public standing.',
        showIfAllFlags: ['c10-burden-oath-withdrawn'],
        addFlags: ['c11-petition-hearing-held'],
        result:
          'The blank Oath line stays blank. The signers speak for themselves, and the free seat accepts their standing.',
        next: 'c11-engine-control',
      },
    ],
  },

  'c11-slow-street': {
    id: 'c11-slow-street',
    kicker: 'No guide and no debt',
    title: 'The Long Public Stair',
    location: 'Outer Vathis',
    objective:
      'Cross the public approach without claiming the refused guide benefit.',
    threat: 'Rising',
    art: 'vathisstreets',
    body: (state) => [
      'The stair turns around three towers. Each landing asks for one tested act instead of a faction mark.',
      has(state, 'c10-water-bargain-ended')
        ? 'Your completed cup mark opens the first landing, then goes dark exactly where its old bargain ended.'
        : has(state, 'c10-water-offer-refused')
          ? 'Your recorded water refusal opens a path that asks for no carried cup.'
          : 'No small bargain mark answers. The company must climb the outer maintenance steps.',
      'The engine spire disappears whenever the stair turns. Which proof keeps the company on a complete route?',
    ],
    choices: [
      {
        id: 'c11-use-completed-water-example',
        label: 'Show the completed water bargain at each landing.',
        detail:
          'Prove that an old completed price cannot widen into city access.',
        advantage: 'Cross the long stair without adding a new duty.',
        showIfAllFlags: ['c10-water-bargain-ended'],
        addFlags: ['c11-public-entry-slower'],
        result:
          'Each landing reads the dark exit mark and lowers. None can restart the cup price.',
        next: 'c11-engine-control',
      },
      {
        id: 'c11-use-recorded-clean-refusal',
        label: 'Repeat the tested refusal at every landing.',
        detail:
          'Use Chapter Ten’s physical proof that a clear no creates no debt.',
        advantage: 'Keep the public route open without accepting a new offer.',
        showIfAnyFlags: [
          'c10-clean-refusal-recorded',
          'c10-refusal-demonstrated',
        ],
        addFlags: ['c11-public-entry-slower'],
        result:
          'Each offer falls back into its stone after your no. The maintenance edge remains solid.',
        next: 'c11-engine-control',
      },
      {
        id: 'c11-climb-unpriced-maintenance-edge',
        label: 'Climb the unpriced maintenance edge in single file.',
        detail:
          'Spend no resource, accept no offer, and arrive after the first auction notice is posted.',
        advantage:
          'Preserve every contract boundary and keep a complete route into Vathis.',
        addFlags: ['c11-public-entry-slower', 'c11-auction-time-lost'],
        result:
          'Hands and boots find the rough outer edge. The company reaches the top as a bronze auction bell begins to swing.',
        next: 'c11-engine-control',
      },
    ],
  },

  'c11-engine-control': {
    id: 'c11-engine-control',
    kicker: 'Three civic seals and one house lease',
    title: 'Who Holds the Engine Key',
    location: 'Price Court Approach',
    objective:
      'Prove which faction controls engine access before the auction begins.',
    threat: 'Rising',
    art: 'vathisstreets',
    introducesStoryTerms: ['invasion right'],
    activeConsequences: {
      complications: ['c11-public-entry-slower', 'c11-auction-time-lost'],
      reactions: ['c11-guide-checkpoint-delivered'],
    },
    lesson: {
      title: 'The Price Court and the engine lease',
      body: 'The Price Court controls Vathis’s public contracts and auction. House Sableglass currently holds the separate lease that opens Malrec’s engine district.',
    },
    body: (state) => [
      entryConsequence(state),
      engineLead(state),
      'A red notice climbs the clerk’s bench. The Price Court will auction one invasion right at the third bell. House Sableglass has registered Malrec’s engine lease as its route.',
      'The right permits one Gate opening, one named force, and one bell inside Edrath. It grants no ownership of mortal names, bodies, or land.',
      'The carry-over question has an answer. The Court runs the city and sale. Sableglass controls access to the engine. How do you place that answer beyond denial?',
    ],
    choices: [
      {
        id: 'c11-record-engine-lease-with-guide',
        label: 'Have the Free Ledger guide mark the lease in public.',
        detail:
          'Use the promised outside identification before the petition enters Court custody.',
        advantage:
          'Create an independent engine-access record and preserve the hearing order.',
        showIfAllFlags: ['c11-guide-checkpoint-delivered'],
        addFlags: ['c11-engine-control-proved'],
        result:
          'The guide marks the Sableglass lease from outside its line. The free Court seal repeats the record aloud.',
        next: 'c11-street-expiry',
      },
      {
        id: 'c11-match-vexa-patrol-map-to-lease',
        label: 'Match Vexa’s guarded patrol map to both leased doors.',
        detail: 'Use her private route help within its public limits.',
        advantage:
          'Identify a service entrance and the clerk who renews the lease.',
        showIfAllFlags: ['c9-vexa-guarded-trust'],
        addFlags: ['c11-engine-control-proved'],
        result:
          'Two black map cuts meet the lease line. A named Sableglass clerk leaves the renewal bench before you can reach him.',
        next: 'c11-street-expiry',
      },
      {
        id: 'c11-match-public-evidence-to-lease',
        label: 'Set the public Sableglass evidence beneath the lease.',
        detail:
          'Join the embassy attack chain to the house controlling engine access.',
        advantage: 'Create a transferable damages challenge for the auction.',
        showIfAnyFlags: ['c9-route-exposure', 'c9-sableglass-publicly-exposed'],
        addFlags: ['c11-engine-control-proved'],
        result:
          'The lease and attack seal heat together. The Court records one damages claim against Sableglass control.',
        next: 'c11-street-expiry',
      },
      {
        id: 'c11-read-public-lease-chain',
        label: 'Read the public lease chain from seal to engine spire.',
        detail:
          'Use the complete slower investigation available to every expedition.',
        advantage: 'Prove control without faction help or private access.',
        addFlags: ['c11-engine-control-proved'],
        result:
          'You follow each stamped renewal. The final black glass line ends at the engine district’s locked gate.',
        next: 'c11-street-expiry',
      },
    ],
  },

  'c11-street-expiry': {
    id: 'c11-street-expiry',
    kicker: 'A city street can expire',
    title: 'Ten Minutes of Ground',
    location: 'Contract Street',
    objective: 'Cross one purchased street before its exact price expires.',
    threat: 'Immediate',
    art: 'vathisstreets',
    body: (state) => [
      streetMethod(state),
      has(state, 'c10-prepared-offer-pause')
        ? 'The expedition uses the prepared pause. Nobody steps until the accepting stone and exit are both visible.'
        : 'Vexa plants her heel before the first boot moves. “Read the exit before you buy the ground,” she says.',
      has(state, 'c10-listening-mark-following')
        ? 'A black listening mark reaches the street first and purchases a false turn in the company’s name.'
        : 'No hidden listening mark reaches the accepting stone before you.',
      'One reverse bell will end the price and raise the stones back into a wall. Which Chapter Ten method guides the crossing?',
    ],
    choices: [
      {
        id: 'c11-cross-by-shared-price-check',
        label: 'Read the shared terms at the first and last stone.',
        detail:
          'Use public coordination to catch any word changed during the crossing.',
        advantage:
          'Keep the true street level and expose a Sableglass substitution.',
        showIfAllFlags: ['c10-offer-method-shared'],
        requiresFlags: ['c11-engine-control-proved'],
        addFlags: [],
        result:
          'The group speaks the same exit term twice. The false word cracks, and the true paving stays flat until the last boot crosses.',
        next: 'c11-contract-door',
      },
      {
        id: 'c11-cross-by-private-owner-signals',
        label: 'Let each seal owner answer from a separate marked lane.',
        detail:
          'Protect confidentiality while accepting a slower response to a false safe door.',
        advantage:
          'Cross without opening any private offer or surrendering its owner’s choice.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c11-false-door-risk'],
        result:
          'Every owner marks their own lane. One ownerless safe signal fades, while the final pair crosses just before the reverse bell.',
        next: 'c11-contract-door',
      },
      {
        id: 'c11-cross-by-ended-burden-record',
        label: 'Use the ended burden bands as separate timing marks.',
        detail:
          'Treat each old band as a record, never as ownership of its traveller.',
        advantage:
          'Move together while preserving every individual exit and withdrawal.',
        showIfAllFlags: ['c10-offer-method-oath'],
        addFlags: [],
        result:
          'Each traveller calls their old position. The closed bands mark time without pulling a single person.',
        next: 'c11-contract-door',
      },
      {
        id: 'c11-cross-by-public-token',
        label: 'Buy ten minutes with one public passage token.',
        detail:
          'Use the ordinary fallback without exposing records or creating a later debt.',
        advantage: 'Keep a complete route across the expiring street.',
        addFlags: [],
        result:
          'You press the token and name ten minutes. The reverse bell rings only after the last traveller leaves the stone.',
        next: 'c11-contract-door',
      },
    ],
  },

  'c11-contract-door': {
    id: 'c11-contract-door',
    kicker: 'A door asks what may cross',
    title: 'The Leased Door',
    location: 'Middle Vathis',
    objective: 'Open one city door without changing fragment custody.',
    threat: 'Rising',
    art: 'vathisstreets',
    activeConsequences: { complications: ['c11-false-door-risk'] },
    body: (state) => [
      has(state, 'c11-false-door-risk')
        ? 'The ownerless safe signal returns on the first door. Its hinge points away from every registered exit, so you leave it shut.'
        : 'Every visible hinge names an owner and a public exit before the door makes an offer.',
      fragmentState(state),
      'The door opens for property named in the Sableglass engine lease. It offers to name the fragment as house property if its bearer steps through first.',
      'The offer is visible and unaccepted. It cannot turn custody, theft, evidence, or true-name precision into ownership. Which fact opens another way?',
    ],
    choices: [
      {
        id: 'c11-align-fragment-under-limited-precision',
        label: 'Use true-name precision only to align the fragment case.',
        detail:
          'Let Vexa locate its bearer for the witnessed purpose and nothing else.',
        advantage:
          'Open the real service door without giving Sableglass ownership or wider access.',
        showIfAllFlags: ['c9-route-bargain', 'c9-true-name-freely-disclosed'],
        hideIfAnyFlags: ['c9-cut-true-name-clause'],
        addFlags: ['c11-fragment-door-open'],
        result:
          'Vexa names the case position and stops. The fragment aligns with a narrow hinge, while every other door stays blind.',
        next: 'c11-weather-contract',
      },
      {
        id: 'c11-use-neutral-case-without-precision',
        label: 'Set the neutral case against the unowned hinge.',
        detail:
          'Use the cut precision limit while keeping the return promise unchanged.',
        advantage:
          'Open a slower door without restoring destroyed Oath terms or true-name access.',
        showIfAllFlags: ['c9-route-bargain', 'c9-cut-true-name-clause'],
        addFlags: ['c11-fragment-door-open'],
        result:
          'The neutral case finds the hinge after three tries. No name answers, and the return promise remains exactly as sworn.',
        next: 'c11-weather-contract',
      },
      {
        id: 'c11-open-door-with-admitted-theft',
        label: 'Name the visible fragment as admitted stolen property.',
        detail:
          'Preserve the Compact debt and deny the house a clean ownership transfer.',
        advantage:
          'Make the lease reject its own false property claim and open the evidence passage.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c11-fragment-door-open'],
        result:
          'The hot fragment burns the word “house” from the offer. The evidence passage opens, while Vexa keeps the theft debt on record.',
        next: 'c11-weather-contract',
      },
      {
        id: 'c11-open-door-with-public-custody',
        label: 'Present the surrendered fragment as public attack evidence.',
        detail: 'Use its exact witness chain without selling or hiding it.',
        advantage:
          'Compel the leased door to admit the evidence and strengthen the Sableglass challenge.',
        showIfAllFlags: ['c9-route-exposure'],
        addFlags: ['c11-fragment-door-open'],
        result:
          'The evidence frame touches the seal. The door admits the case and stamps another public challenge against Sableglass.',
        next: 'c11-weather-contract',
      },
    ],
  },

  'c11-weather-contract': {
    id: 'c11-weather-contract',
    kicker: 'Mythic fire transfers a freedom',
    title: 'The Rain That Belongs to a Roof',
    location: 'Purchased Weather Court',
    objective:
      'Cross owned weather after seeing how mythic Oathfire changes freedom.',
    threat: 'Immediate',
    art: 'vathisstreets',
    lesson: {
      title: 'Mythic Oathfire gives an active promise one named freedom',
      body: 'The promise controls that freedom until the stated duration ends. The cost, advantage, success, and breach must appear before Caelan chooses.',
    },
    body: (state) => [
      weatherPressure(state),
      'A roof lowers over the street and dry stones appear beneath it. The offer grants shelter until the rain stops. Its price is leaving only through the far arch.',
      'Oathfire burns white around one existing promise. At mythic strength it could give that promise your right to leave before the last expedition member. The transfer would end with the rain.',
      'How do you cross the weather contract?',
    ],
    choices: [
      {
        id: 'c11-test-mythic-shelter-transfer',
        label: 'Spend 1 Oathfire and transfer the right to leave first.',
        detail:
          'Spend 1 Oathfire. Recipient: Bring Them Home. Freedom lost: leave before the last expedition member. Duration: the rain. Success: all exit. Breach: leave first. No later restriction.',
        advantage:
          'Keep the whole expedition dry and stop the rain from separating the rear guard.',
        showIfAllFlags: ['oath-bring-them-home'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c11-shelter-all-crossed-dry'],
        result:
          'White fire joins the shelter to Bring Them Home. Your lead boot will not lift until the last traveller reaches the far arch.',
        next: 'c11-method-accounting',
      },
      {
        id: 'c11-accept-ordinary-weather-shelter',
        label: 'Accept the ordinary roof and wait for every stated exit mark.',
        detail:
          'Gain dry passage, pay with time, and leave through the far arch before the rain ends.',
        advantage:
          'Protect injuries and evidence from the owned rain without transferring freedom.',
        requiresFlags: ['c11-fragment-door-open'],
        addFlags: ['c11-auction-time-lost'],
        result:
          'You state the acceptance and enter through the marked side. The company stays dry, but the second auction bell begins before the far arch opens.',
        next: 'c11-method-accounting',
      },
      {
        id: 'c11-refuse-owned-weather',
        label: 'Refuse the roof and cross the ash rain in close order.',
        detail:
          'Spend no Oathfire and accept no contract. Wet ash will mark clothing and reveal the route.',
        advantage:
          'Preserve every active promise and reach the next street before the second bell.',
        addFlags: ['c11-rain-route-exposed'],
        result:
          'The roof rises after your no. Wet ash stripes every coat, but the expedition reaches the far wall before the second bell.',
        next: 'c11-method-accounting',
      },
    ],
  },

  'c11-method-accounting': {
    id: 'c11-method-accounting',
    kicker: 'Old offer records meet city law',
    title: 'What Each Record Can Prove',
    location: 'Price Court Outer Hall',
    objective: 'Prepare the Chapter Ten method for active use inside Vathis.',
    threat: 'Rising',
    art: 'vathisauction',
    activeConsequences: {
      complications: ['c11-auction-time-lost', 'c11-rain-route-exposed'],
      reactions: ['c11-shelter-all-crossed-dry'],
    },
    body: (state) => [
      weatherConsequence(state),
      accountingPressure(state),
      destroyedOath(state),
      'A Court clerk asks to collect every record as one asset. The request is only an offer. It cannot own a group answer or restore a lost Oath.',
      'How do you prepare the records for the coming shortcut?',
    ],
    choices: [
      {
        id: 'c11-register-shared-terms-not-people',
        label: 'Register shared terms without transferring their speakers.',
        detail:
          'Keep each person’s words and permissions attached to that person.',
        advantage:
          'Gain public comparison proof for revolt or auction while blocking a group ownership claim.',
        showIfAllFlags: ['c10-offer-method-shared'],
        addFlags: ['c11-shared-method-active-proof'],
        result:
          'The clerk stamps each line separately. The ledger can compare prices, but no page becomes a deed to a person.',
        next: 'c11-illusion-street',
      },
      {
        id: 'c11-register-private-seal-edges',
        label: 'Register only the unbroken edges of the private seals.',
        detail:
          'Prove continuity without exposing a benefit, price, motive, or answer.',
        advantage:
          'Gain confidential auction standing and a protected door signal.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c11-private-method-active-proof'],
        result:
          'Each owner presses only the seal edge. The Court records an unchanged boundary and learns nothing inside.',
        next: 'c11-illusion-street',
      },
      {
        id: 'c11-complete-burden-private-accounting',
        label: 'Finish every private account before using the closed bands.',
        detail:
          'Let each former participant approve, correct, or withhold their own record.',
        advantage:
          'Gain willing witness proof without treating the ended burden Oath as transferable property.',
        showIfAllFlags: ['c10-offer-method-oath', 'c10-burden-oath-active'],
        addFlags: [
          'c11-burden-accounts-complete',
          'c11-burden-method-active-proof',
        ],
        result:
          'Every account ends with its owner’s answer. One withdrawn band stays blank, and no clerk may fill it.',
        next: 'c11-illusion-street',
      },
      {
        id: 'c11-protect-withdrawn-proposal-seals',
        label:
          'Keep the withdrawn proposal and all private seals outside the Court.',
        detail: 'Use no unaccepted Oath as proof or currency.',
        advantage:
          'Preserve complete privacy and force the Court to judge only public evidence.',
        showIfAllFlags: ['c10-burden-oath-withdrawn'],
        addFlags: ['c11-private-method-active-proof'],
        result:
          'You close the blank proposal. The Court receives no claim to an Oath that never existed.',
        next: 'c11-illusion-street',
      },
    ],
  },

  'c11-illusion-street': {
    id: 'c11-illusion-street',
    kicker: 'A true desire offers a dishonest price',
    title: 'The Private Life for Sale',
    location: 'Mirror Street',
    objective: 'Reject the illusion without denying the future it copied.',
    threat: 'Immediate',
    art: 'vathisstreets',
    body: (state) => [
      ...illusionSource(state),
      has(state, 'c10-limits-respected')
        ? 'The exact limits spoken on the Ash Road remain unchanged. The image asks for the promise your real partner already refused.'
        : has(state, 'c10-limits-public-only')
          ? 'The public boundary remains complete. The image cannot call friendship or command unfinished romance.'
          : 'No new answer can come from a memory, image, attraction, or old intimacy.',
      'The image holds out one hand. “Will you accept?” it asks before the false threshold closes.',
    ],
    choices: [
      {
        id: 'c11-affirm-mara-future-refuse-price',
        label:
          'Say you want the life with Mara and refuse abandonment as its price.',
        detail:
          'Use her real boundary and crossing history without asking the image to answer for her.',
        advantage:
          'Break the matching temptation while preserving the desire and the relationship.',
        showIfAnyFlags: [
          'c9-mara-crossed-black-gate',
          'c9-mara-remained-at-gate',
        ],
        showIfRelationshipIntents: { mara: ['committed'] },
        addFlags: ['c11-affirmed-mara-future', 'c11-illusion-refused'],
        result:
          '“I want that home,” you say. “I will not buy it by abandoning everyone outside.” The false door opens onto bare stone.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-affirm-lysara-future-refuse-price',
        label:
          'Say you want the road with Lysara and refuse exclusive duty as its price.',
        detail:
          'Use her real political limit without letting the image make a treaty or answer.',
        advantage:
          'Break the matching temptation while preserving the desire and both people’s independence.',
        showIfAnyFlags: [
          'c9-lysara-crossed-black-gate',
          'c9-lysara-remained-at-gate',
        ],
        showIfRelationshipIntents: { lysara: ['committed'] },
        addFlags: ['c11-affirmed-lysara-future', 'c11-illusion-refused'],
        result:
          '“I want a road with her,” you say. “I will not build it by placing every other life beneath us.” The green distance tears.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-affirm-vexa-future-refuse-price',
        label:
          'Say you want the private house and keep the public witness line.',
        detail:
          'Acknowledge attraction or history without turning either into consent or payment.',
        advantage:
          'Break Vexa’s matching temptation and preserve the exact public limits between you.',
        showIfAnyFlags: [
          'c9-shared-private-night',
          'c9-vexa-attraction-acknowledged',
        ],
        hideIfAnyFlags: [
          'c9-mara-crossed-black-gate',
          'c9-lysara-crossed-black-gate',
          'c9-mara-remained-at-gate',
          'c9-lysara-remained-at-gate',
          'c9-vexa-permanent-hostility',
          'c9-refused-private-connection',
        ],
        addFlags: ['c11-affirmed-vexa-future', 'c11-illusion-refused'],
        result:
          '“The house is worth wanting,” you say. “The closed witness line is not.” The false shutters swing open and vanish.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-affirm-safe-return-refuse-price',
        label: 'Admit you want everyone safe and refuse to abandon the engine.',
        detail:
          'Keep the non-romantic path complete without creating a promise for any image.',
        advantage:
          'Break the duty-free temptation while preserving every real person’s choice.',
        hideIfAnyFlags: [
          'c9-mara-crossed-black-gate',
          'c9-lysara-crossed-black-gate',
          'c9-mara-remained-at-gate',
          'c9-lysara-remained-at-gate',
          'c9-shared-private-night',
          'c9-vexa-attraction-acknowledged',
        ],
        addFlags: ['c11-affirmed-duty-free-future', 'c11-illusion-refused'],
        result:
          '“I want them safe,” you say. “Leaving this engine to open the Gate will not make them safe.” The inn yard empties.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-use-public-only-limit-on-illusion',
        label: 'Repeat the complete public and platonic boundary.',
        detail:
          'Refuse romance, ownership, and private access without paying Resolve.',
        advantage:
          'Break the illusion through the exact Chapter Ten limit and preserve a complete platonic path.',
        showIfAllFlags: ['c10-limits-public-only'],
        addFlags: ['c11-platonic-limit-held', 'c11-illusion-refused'],
        result:
          'You repeat the public limit without adding a promise. The false private door has no unfinished answer to collect.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-break-illusion-and-capture-source',
        label: 'Spend 1 Resolve to break the image and catch its source bead.',
        detail:
          'Spend 1 Resolve. Resist the copied future without debating it while the threshold closes.',
        advantage:
          'Gain direct Sableglass proof that can strengthen the revolt or void the auction counterbid.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c11-illusion-refused', 'c11-illusion-source-captured'],
        result:
          'You drive your shield through the false door. The image bursts, leaving a black Sableglass listening bead in the rim.',
        next: 'c11-obligation-inventory',
      },
      {
        id: 'c11-state-plain-illusion-refusal',
        label: 'State a plain refusal and step away from the accepting mark.',
        detail:
          'Spend no resource and grant the image no argument, denial, or relationship answer.',
        advantage:
          'Leave the false future unaccepted through the rule every route learned.',
        addFlags: ['c11-illusion-refused'],
        result:
          'You say no and step sideways. The accepting threshold closes on empty ground.',
        next: 'c11-obligation-inventory',
      },
    ],
  },

  'c11-obligation-inventory': {
    id: 'c11-obligation-inventory',
    kicker: 'Only owned duties can enter a bid',
    title: 'The Invasion Right',
    location: 'Price Court Auction Hall',
    objective:
      'Inventory legal assets and liabilities before choosing a route to the engine.',
    threat: 'Rising',
    art: 'vathisauction',
    activeConsequences: {
      complications: ['c11-burden-accounts-complete'],
      reactions: [
        'c11-affirmed-mara-future',
        'c11-affirmed-lysara-future',
        'c11-affirmed-vexa-future',
        'c11-affirmed-duty-free-future',
      ],
    },
    body: (state) => [
      illusionReaction(state),
      has(state, 'c11-burden-accounts-complete')
        ? 'Every consenting traveller has received a private account. The Court may inspect the closed edges, but no private desire enters its inventory.'
        : 'No unfinished burden accounting enters the auction inventory.',
      'A brass model of the Black Gate turns above the auction floor. Its notice allows one opening, one registered force, and one Vathis bell inside Edrath.',
      ...obligationInventory(state),
      excludedInventory(state),
      'Which lawful asset do you place in your inventory before deciding how to reach the engine?',
    ],
    choices: [
      {
        id: 'c11-inventory-free-ledger-hearing-credit',
        label: 'List the signers’ transferable Free Ledger hearing credit.',
        detail:
          'Owner: the named signers. Transfer: only with their fresh marks. Future cost: one public renewal hearing.',
        advantage:
          'Create a strong lawful bid and public standing for a revolt.',
        showIfAllFlags: ['c11-petition-hearing-held'],
        addFlags: ['c11-bid-asset-hearing-credit'],
        result:
          'Sira, Oren, and Pellan choose whether to mark the inventory. Their separate marks create one transferable hearing credit.',
        next: 'c11-defining-route',
      },
      {
        id: 'c11-inventory-sableglass-damages-claim',
        label: 'List the public Sableglass damages claim.',
        detail:
          'Owner: the expedition evidence chain. Transfer: legal under the public exposure ruling. Future cost: surrender the claim after one use.',
        advantage:
          'Challenge Sableglass’s engine lease and strengthen the auction bid.',
        showIfAnyFlags: [
          'c11-sableglass-damages-claim',
          'c9-route-exposure',
          'c9-sableglass-publicly-exposed',
        ],
        addFlags: ['c11-bid-asset-damages-claim'],
        result:
          'The public evidence frame stamps one claim. The fragment remains evidence and does not enter the bid.',
        next: 'c11-defining-route',
      },
      {
        id: 'c11-inventory-compact-surety',
        label: 'Ask Vexa to list one Ash Compact public surety.',
        detail:
          'Owner: the Compact. Transfer: one witnessed Gate passage only. Future cost: the Compact receives a public seat at the replacement-law hearing.',
        advantage:
          'Gain a strong bid or one protected force warning without selling personal trust.',
        hideIfAnyFlags: ['c9-vexa-permanent-hostility', 'c9-route-theft'],
        addFlags: ['c11-bid-asset-compact-surety'],
        result:
          'Vexa chooses to place a white public seal on the inventory. It grants no private access and changes no relationship answer.',
        next: 'c11-defining-route',
      },
      {
        id: 'c11-inventory-roster-witness-bond',
        label: 'Let the exact expedition build an independent witness bond.',
        detail:
          'Owner: each participating witness. Transfer: testimony only, never command or personal promises. Future cost: witnesses may withdraw their own marks.',
        advantage: 'Create a lawful proof asset available to every roster.',
        addFlags: ['c11-bid-asset-roster-witness'],
        result:
          'Each willing expedition witness places a separate mark in the Court inventory and keeps the right to withdraw it.',
        next: 'c11-defining-route',
      },
      {
        id: 'c11-inventory-caelan-appearance-duty',
        label: 'List your own limited Price Court appearance duty.',
        detail:
          'Owner: Caelan. Transfer: yes after clear acceptance. Future cost: you cannot refuse one Chapter Twelve review of the replacement Gate law.',
        advantage:
          'Create a complete lawful bid even when no faction proof survived.',
        addFlags: [
          'c11-bid-asset-appearance-duty',
          'c11-price-court-review-owed',
        ],
        result:
          'You state one review, one public bench, and no wider service. The Court records the duty without touching any other Oath.',
        next: 'c11-defining-route',
      },
    ],
  },

  'c11-defining-route': {
    id: 'c11-defining-route',
    kicker: 'The third bell begins',
    title: 'Three Ways to the Engine',
    location: 'Price Court Auction Hall',
    objective: 'Choose how the expedition will reach Malrec’s engine.',
    threat: 'Immediate',
    art: 'vathisauction',
    body: (state) => [
      rosterProof(state),
      has(state, 'c10-listening-ash-broken')
        ? 'No listening ash changes the route labels before the bell.'
        : 'A Sableglass listening line knows which door the expedition used and begins closing that approach.',
      vexaAuctionPosture(state),
      'Do you make room for collective refusal, win the sale lawfully, or take the engine corridor by force?',
    ],
    choices: [
      {
        id: 'c11-start-debt-bound-revolt',
        label:
          'Organise protection for debt-bound devils who choose to refuse.',
        detail:
          'Gain people, disruption, and public legitimacy while risking casualties and unstable streets.',
        advantage:
          'Open worker service tunnels and challenge the engine lease through collective witness.',
        requiresFlags: ['c11-engine-control-proved', 'c11-illusion-refused'],
        addFlags: ['c11-route-revolt'],
        result:
          'You place your shield beside the petition, not above it. Sira, Oren, and Pellan begin asking workers for separate answers.',
        next: 'c11-revolt-voices',
      },
      {
        id: 'c11-enter-invasion-auction',
        label: 'Enter the auction using only inventoried legal obligations.',
        detail:
          'Gain lawful engine access and civic stability while accepting a visible future restriction.',
        advantage:
          'Deny Sableglass the invasion right without damaging the public streets.',
        addFlags: ['c11-route-auction'],
        result:
          'The free Court seat opens a bidder’s line. Every listed asset keeps its owner and transfer mark.',
        next: 'c11-auction-bid',
      },
      {
        id: 'c11-march-to-engine-by-force',
        label: 'March the exact expedition through the leased district.',
        detail:
          'Gain speed and direct access while risking wounds, resources, and future devil cooperation.',
        advantage:
          'Reach the engine corridor before the auction can register Malrec’s invasion force.',
        addFlags: ['c11-route-force'],
        result:
          'You turn from the auction floor. Only the people who crossed the Black Gate form behind your shield.',
        next: 'c11-force-formation',
      },
    ],
  },

  'c11-revolt-voices': {
    id: 'c11-revolt-voices',
    kicker: 'A revolt begins with separate answers',
    title: 'Three Collars, Three Plans',
    location: 'Debt Workers’ Square',
    objective: 'Protect the workers’ right to choose how refusal begins.',
    threat: 'Immediate',
    art: 'vathisauction',
    body: () => [
      'Sira pulls her service collar open far enough to show the exit line hidden against her skin. She wants every collar opened now.',
      'Oren blocks the nearest tunnel. His family sleeps in a shelter that Sableglass can cancel. Pellan wants the Court record preserved before any bell breaks.',
      'Nobody asks you to command the square. They ask what your shield can protect while they decide. Which plan do you support?',
    ],
    choices: [
      {
        id: 'c11-move-worker-families-first',
        label: 'Protect Oren’s family route before the first refusal.',
        detail:
          'Give Sableglass time to reinforce the engine while moving dependants beyond cancelled shelter.',
        advantage:
          'Prevent the revolt from trapping worker families under expiring roofs.',
        addFlags: ['c11-revolt-families-moved'],
        result:
          'Oren leads families through a service tunnel. Sira waits by choice, striking sparks from her open collar.',
        next: 'c11-revolt-oathfire',
      },
      {
        id: 'c11-open-volunteer-collars-now',
        label: 'Shield the workers who choose to open their collars now.',
        detail:
          'Gain surprise and numbers while shelter contracts remain exposed.',
        advantage:
          'Break the first Sableglass work line before guards can close the square.',
        addFlags: ['c11-worker-shelters-at-risk'],
        result:
          'Sira asks each worker once. Those who say yes open their own exit lines behind your shield. Others step back untouched.',
        next: 'c11-revolt-oathfire',
      },
      {
        id: 'c11-record-collar-fraud-before-refusal',
        label: 'Give Pellan one minute to record the hidden exit clauses.',
        detail:
          'Preserve proof while the engine guard receives one warning bell.',
        advantage:
          'Make the revolt’s legal cause survive even if Sableglass retakes the square.',
        addFlags: ['c11-revolt-collar-proof'],
        result:
          'Pellan copies three exit lines in three hands. The first guard bell rings as the pages leave the square.',
        next: 'c11-revolt-oathfire',
      },
      {
        id: 'c11-give-illusion-bead-to-refusers',
        label: 'Give the captured Sableglass illusion bead to Pellan.',
        detail:
          'Let the workers own proof that Sableglass built a hidden accepting threshold from private desires.',
        advantage:
          'Preserve the revolt’s legal cause without waiting through the guard bell.',
        showIfAllFlags: ['c11-illusion-source-captured'],
        addFlags: ['c11-revolt-collar-proof'],
        result:
          'Pellan seals the bead beside three collar clauses. The refusers carry the proof, and no house guard gets warning time.',
        next: 'c11-revolt-oathfire',
      },
    ],
  },

  'c11-revolt-oathfire': {
    id: 'c11-revolt-oathfire',
    kicker: 'Freedom moves into a surviving promise',
    title: 'The Refusal Square',
    location: 'Debt Workers’ Square',
    objective:
      'Hold space for individual refusal while Sableglass closes the streets.',
    threat: 'Critical',
    art: 'vathisauction',
    activeConsequences: {
      complications: [
        'c11-revolt-families-moved',
        'c11-worker-shelters-at-risk',
      ],
      reactions: ['c11-revolt-collar-proof'],
    },
    body: (state) => [
      revoltPreparation(state),
      destroyedOath(state),
      'Black glass lines race around the square. Any order spoken across them will become one command over every marked worker.',
      'A mythic use can protect the square only through the surviving Red Moot authority Oath. The ordinary path keeps every answer individual and slower.',
      'How do you stop the city from collecting the refusers as one army?',
    ],
    choices: [
      {
        id: 'c11-mythic-red-moot-refusal-square',
        label: 'Spend 2 Oathfire and surrender command beyond accepted limits.',
        detail:
          'Spend 2 Oathfire. Recipient: Red Moot authority Oath. Freedom lost: order beyond accepted command. Duration: until Gate law changes. Success: separate refusals. Breach: unaccepted order. Carries forward.',
        advantage:
          'Create an exclusive protected square that Sableglass cannot collect or command.',
        showIfAllFlags: ['c6-oath-recognised-red-moot'],
        hideIfAnyFlags: ['c9-destroyed-red-moot-authority-oath'],
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: [
          'c11-revolt-square-mythic',
          'c11-freedom-command-restricted',
        ],
        result:
          'White fire fixes every accepted limit around the square. Your voice cannot cross one step beyond those answers.',
        next: 'c11-revolt-crisis',
      },
      {
        id: 'c11-build-individual-refusal-line',
        label: 'Build a shield lane for one refusal at a time.',
        detail:
          'Spend no Oathfire. The slower line leaves one public street exposed to collapse.',
        advantage:
          'Keep every worker’s answer individual without restoring a destroyed Oath.',
        addFlags: ['c11-public-street-damaged'],
        result:
          'One worker speaks, crosses, and clears the line before the next begins. The eastern street lifts into a broken wall behind them.',
        next: 'c11-revolt-crisis',
      },
      {
        id: 'c11-use-futureless-collar-witnesses',
        label: 'Let three Futureless records split the group claim.',
        detail:
          'Use earned living testimony instead of Oathfire. Each witness may withdraw their own mark.',
        advantage:
          'Keep the square open and preserve the eastern street through independent proof.',
        showIfAllFlags: ['c9-roster-futureless'],
        addFlags: ['c11-revolt-futureless-shield'],
        result:
          'Ansel and both witnesses hold separate pages at three corners. The collecting line cannot find one owner and breaks.',
        next: 'c11-revolt-crisis',
      },
    ],
  },

  'c11-revolt-crisis': {
    id: 'c11-revolt-crisis',
    kicker: 'The city cancels its shelter',
    title: 'Roofs Rise from the Square',
    location: 'Debt Workers’ Square',
    objective: 'Save the people endangered by Sableglass’s cancelled prices.',
    threat: 'Critical',
    art: 'vathisauction',
    activeConsequences: {
      complications: ['c11-public-street-damaged'],
      reactions: ['c11-revolt-square-mythic', 'c11-revolt-futureless-shield'],
    },
    body: (state) => [
      revoltProtection(state),
      has(state, 'c11-revolt-families-moved')
        ? 'The worker families are already beyond the roofs. Sableglass raises empty shelter stones and sends guards toward the engine.'
        : 'Sableglass cancels the worker shelters. Roof slabs rise while families and refusers crowd the open square.',
      has(state, 'c10-free-ledger-rope-saved')
        ? 'The rope saved on the Ash Road still reaches between two lifting roofs.'
        : 'No spare road rope remains between the lifting roofs.',
      'Sira leads willing refusers toward the engine tunnel. Oren turns back for the shelter line. Who receives your immediate protection?',
    ],
    choices: [
      {
        id: 'c11-protect-revolt-families-with-rope',
        label: 'Use the saved Free Ledger rope to lower the shelter slabs.',
        detail:
          'Apply the Chapter Ten rescue asset while Sira leads the willing refusers.',
        advantage:
          'Save the families and preserve the engine tunnel without spending Health.',
        showIfAllFlags: ['c10-free-ledger-rope-saved'],
        addFlags: [
          'c11-revolt-families-saved',
          'c11-revolt-engine-tunnel-open',
        ],
        result:
          'The rope catches both roof rings. Oren lowers the slabs while Sira keeps the service tunnel open.',
        next: 'c11-revolt-engine-phrase',
      },
      {
        id: 'c11-hold-revolt-roof-by-hand',
        label: 'Spend 1 Health to hold the rising roof while families leave.',
        detail:
          'Spend 1 Health. Take the physical weight and let the refusers protect the engine tunnel.',
        advantage:
          'Save the exposed families and keep the revolt route to the engine.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: [
          'c11-revolt-families-saved',
          'c11-revolt-engine-tunnel-open',
        ],
        result:
          'Stone grinds across your shield rim. The last child clears the roof before your knee hits the paving.',
        next: 'c11-revolt-engine-phrase',
      },
      {
        id: 'c11-secure-revolt-tunnel-first',
        label: 'Secure the engine tunnel while Oren leads the shelter rescue.',
        detail:
          'Spend no resource and trust named workers with their own people. One worker may be injured.',
        advantage:
          'Prevent Sableglass from sealing the route to Malrec’s engine.',
        addFlags: [
          'c11-revolt-engine-tunnel-open',
          'c11-revolt-worker-injured',
        ],
        result:
          'You block the tunnel wheel. Oren and Pellan lower the last roof, but falling stone cuts Sira’s arm.',
        next: 'c11-revolt-engine-phrase',
      },
    ],
  },

  'c11-revolt-engine-phrase': {
    id: 'c11-revolt-engine-phrase',
    kicker: 'Workers open their own witness line',
    title: 'The Service Tunnel Answer',
    location: 'Beneath the Engine District',
    objective: 'Earn the engine phrase through the refusers’ records.',
    threat: 'Rising',
    art: 'vathisengine',
    activeConsequences: {
      complications: ['c11-revolt-worker-injured'],
      reactions: ['c11-revolt-families-saved'],
    },
    body: (state) => [
      revoltRescueConsequence(state),
      'Three service wheels block the tunnel. Each wheel turns only when a current worker refuses the same owned task in their own words.',
      'Sira refuses to carry collected names. Oren refuses to release shelter debts through the engine. Pellan refuses to erase the records.',
      'Their answers reveal a phrase inside the turning wheels: “Let the claimed answer for itself.” Who speaks it to the engine door?',
    ],
    choices: [
      {
        id: 'c11-let-refusers-speak-engine-phrase',
        label: 'Let all three refusers speak the engine phrase together.',
        detail: 'Keep the route evidence with the people who earned it.',
        advantage:
          'Open Malrec’s witness channel and preserve collective legitimacy.',
        requiresFlags: ['c11-revolt-engine-tunnel-open'],
        addFlags: ['c11-revolt-engine-phrase-earned'],
        result:
          'Three voices speak without merging. The engine door opens because no single owner can replace them.',
        next: 'c11-engine-heart',
      },
      {
        id: 'c11-record-refusers-then-repeat-phrase',
        label:
          'Record each refusal, then repeat the phrase as their protector.',
        detail: 'Let each person approve the record before Caelan uses it.',
        advantage:
          'Open the channel while creating a durable proof copy for Chapter Twelve.',
        addFlags: [
          'c11-revolt-engine-phrase-earned',
          'c11-revolt-refusal-record',
        ],
        result:
          'Each worker marks the record. Your repetition opens the door without taking ownership of their answers.',
        next: 'c11-engine-heart',
      },
    ],
  },

  'c11-auction-bid': {
    id: 'c11-auction-bid',
    kicker: 'Every bid keeps an owner',
    title: 'The First Lawful Mark',
    location: 'Invasion Auction',
    objective:
      'Register the inventoried asset without transferring an illegal promise.',
    threat: 'Immediate',
    art: 'vathisauction',
    body: (state) => [
      ...obligationInventory(state),
      excludedInventory(state),
      'House Sableglass bids ten thousand released work hours and Malrec’s engine lease. The free Court seat asks for your first lawful mark.',
      'Which registered asset enters the sale?',
    ],
    choices: [
      {
        id: 'c11-bid-free-ledger-hearing-credit',
        label: 'Bid the signers’ marked hearing credit.',
        detail:
          'It transfers one public renewal hearing, not the signers, their collars, or their private offers.',
        advantage:
          'Outbid the first Sableglass work-hour block and keep the petition public.',
        showIfAllFlags: ['c11-bid-asset-hearing-credit'],
        addFlags: ['c11-auction-hearing-credit-bid'],
        result:
          'The signers’ marks outweigh a thousand collected hours because every owner is present and may withdraw.',
        next: 'c11-auction-counterbid',
      },
      {
        id: 'c11-bid-sableglass-damages-claim',
        label: 'Bid the public damages claim against Sableglass.',
        detail:
          'The claim may transfer once. The fragment and its custody remain outside the sale.',
        advantage:
          'Freeze the house engine lease during the final bidding round.',
        showIfAllFlags: ['c11-bid-asset-damages-claim'],
        addFlags: ['c11-auction-damages-claim-bid'],
        result:
          'The public claim crosses the floor. Both black Court seats freeze while the lease is challenged.',
        next: 'c11-auction-counterbid',
      },
      {
        id: 'c11-bid-compact-public-surety',
        label: 'Bid the Ash Compact’s one witnessed passage surety.',
        detail:
          'The Compact owns the surety. It transfers one public seat at the replacement-law hearing and nothing private.',
        advantage:
          'Match Sableglass’s engine route with recognised Cinder Deep standing.',
        showIfAllFlags: ['c11-bid-asset-compact-surety'],
        addFlags: ['c11-auction-compact-surety-bid'],
        result:
          'Vexa presses the white seal herself. It matches the engine lease without touching affection, trust, or fragment custody.',
        next: 'c11-auction-counterbid',
      },
      {
        id: 'c11-bid-roster-witness-bond',
        label: 'Bid the expedition’s separate witness marks.',
        detail:
          'Each witness owns and may withdraw one mark. No command, name, or private promise transfers.',
        advantage:
          'Challenge the collected work hours with living and reversible testimony.',
        showIfAllFlags: ['c11-bid-asset-roster-witness'],
        addFlags: ['c11-auction-roster-witness-bid'],
        result:
          'The free seat accepts only the separate expedition marks still freely offered by their owners.',
        next: 'c11-auction-counterbid',
      },
      {
        id: 'c11-bid-caelan-appearance-duty',
        label: 'Bid your one accepted Price Court review duty.',
        detail:
          'You own and may transfer it. You lose the right to refuse one Chapter Twelve review of the replacement Gate law.',
        advantage:
          'Meet the final legal threshold on a save with no stronger faction asset.',
        showIfAllFlags: ['c11-bid-asset-appearance-duty'],
        addFlags: ['c11-auction-appearance-duty-bid'],
        result:
          'The Court binds one future review and no wider service. Your other Oaths remain outside the sale.',
        next: 'c11-auction-counterbid',
      },
    ],
  },

  'c11-auction-counterbid': {
    id: 'c11-auction-counterbid',
    kicker: 'Malrec bids released promises',
    title: 'The Final Black Seat',
    location: 'Invasion Auction',
    objective:
      'Defeat Sableglass’s final bid without selling another person’s freedom.',
    threat: 'Critical',
    art: 'vathisauction',
    activeConsequences: {
      reactions: [
        'c11-auction-hearing-credit-bid',
        'c11-auction-damages-claim-bid',
        'c11-auction-compact-surety-bid',
        'c11-auction-roster-witness-bid',
        'c11-auction-appearance-duty-bid',
      ],
    },
    body: (state) => [
      destroyedOath(state),
      auctionBidConsequence(state),
      'Sableglass releases a column of owned promises into the auction scale. The black seats call them wealth. The free seat calls them people’s time.',
      'A surviving Crown restitution Oath could make the hidden victims’ claim impossible to erase. The ordinary path can win through prepared proof or a narrower future review.',
      'What defeats the final bid?',
    ],
    choices: [
      {
        id: 'c11-mythic-crown-victims-claim',
        label:
          'Spend 2 Oathfire and surrender the right to refuse their hearing.',
        detail:
          'Spend 2 Oathfire. Recipient: Crown restitution Oath. Freedom lost: refuse the victims’ hearing. Duration: through that hearing. Success: defeat released promises. Breach: refusal. Carries forward.',
        advantage:
          'Make the victims’ claim legally unerasable and win the invasion right without another asset.',
        showIfAllFlags: ['c6-oath-crown-restitution'],
        hideIfAnyFlags: [
          'c8-released-crown-oath',
          'c9-destroyed-crown-restitution-oath',
        ],
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: [
          'c11-auction-victims-mythic',
          'c11-freedom-hearing-restricted',
        ],
        result:
          'White fire fixes every hidden victim’s place on the scale. Your future refusal disappears until their hearing ends.',
        next: 'c11-auction-result',
      },
      {
        id: 'c11-use-captured-illusion-source-at-auction',
        label: 'Enter the captured Sableglass illusion bead as fraud proof.',
        detail:
          'Spend the source as public evidence and reveal no copied desire.',
        advantage:
          'Disqualify the released-promise counterbid and preserve the first asset’s future terms.',
        showIfAllFlags: ['c11-illusion-source-captured'],
        addFlags: ['c11-auction-fraud-countered'],
        result:
          'The bead opens under the free seat. Its hidden accepting threshold voids the Sableglass promise column.',
        next: 'c11-auction-result',
      },
      {
        id: 'c11-use-method-proof-at-auction',
        label: 'Use the Chapter Ten method proof to separate every owner.',
        detail:
          'Apply shared terms, private seal edges, or approved burden accounts without transferring the people.',
        advantage:
          'Reduce the released promises to separate disputed claims and win the narrow right.',
        showIfAnyFlags: [
          'c11-shared-method-active-proof',
          'c11-private-method-active-proof',
          'c11-burden-method-active-proof',
        ],
        addFlags: ['c11-auction-method-countered'],
        result:
          'The promise column splits into separate names. Contested claims leave the scale, and your lawful mark remains.',
        next: 'c11-auction-result',
      },
      {
        id: 'c11-accept-narrow-price-court-review',
        label:
          'Accept one narrow Price Court review of the replacement Gate law.',
        detail:
          'Freedom lost: refuse that one public review. Duration: until the review ends. This carries into Chapter Twelve. No other service transfers.',
        advantage:
          'Win the invasion right through a complete fallback while preserving all other Oaths and relationships.',
        addFlags: [
          'c11-price-court-review-owed',
          'c11-auction-review-counterbid',
        ],
        result:
          'You accept one review in public. The free seat rejects every wider phrase and tips the scale toward your bid.',
        next: 'c11-auction-result',
      },
    ],
  },

  'c11-auction-result': {
    id: 'c11-auction-result',
    kicker: 'The invasion right changes hands',
    title: 'One Gate Opening, One Named Force',
    location: 'Invasion Auction',
    objective:
      'Register a narrow invasion right that cannot widen after the sale.',
    threat: 'Rising',
    art: 'vathisauction',
    activeConsequences: {
      reactions: [
        'c11-auction-victims-mythic',
        'c11-auction-fraud-countered',
        'c11-auction-method-countered',
        'c11-auction-review-counterbid',
      ],
    },
    body: (state) => [
      auctionCounterConsequence(state),
      'The brass Gate model turns toward you. Sableglass loses the engine lease for one audit and one passage to the inner Gate.',
      'The deed names only the expedition already inside Vathis. It permits one opening and one bell in Edrath. It owns no names, bodies, land, affection, or future army.',
      'The Court offers two holders for the same narrow right. Who keeps the deed until the engine audit ends?',
    ],
    choices: [
      {
        id: 'c11-caelan-holds-invasion-right',
        label: 'Hold the invasion right under the registered limits.',
        detail:
          'Keep custody beside the fragment while accepting the recorded future restriction.',
        advantage:
          'Control the audit route directly and prevent a faction from widening the named force.',
        addFlags: ['c11-invasion-right-caelan', 'c11-invasion-right-won'],
        result:
          'The deed locks to your shield edge. Its force list stops after the last recorded expedition witness.',
        next: 'c11-auction-engine-phrase',
      },
      {
        id: 'c11-free-seat-holds-invasion-right',
        label:
          'Place the right with the Price Court’s free seat for the audit.',
        detail:
          'Keep Caelan from owning an invasion license while strengthening one dissenting civic judge.',
        advantage:
          'Gain a neutral audit escort and a public record Sableglass cannot erase.',
        addFlags: ['c11-invasion-right-free-seat', 'c11-invasion-right-won'],
        result:
          'The free seat seals the deed in clear glass. Its judge walks beside you and cannot add one soldier.',
        next: 'c11-auction-engine-phrase',
      },
    ],
  },

  'c11-auction-engine-phrase': {
    id: 'c11-auction-engine-phrase',
    kicker: 'A lawful audit opens one channel',
    title: 'The Phrase in the Deed',
    location: 'Engine Lease Door',
    objective:
      'Use the purchased audit phrase without widening the invasion right.',
    threat: 'Immediate',
    art: 'vathisengine',
    activeConsequences: {
      reactions: ['c11-invasion-right-caelan', 'c11-invasion-right-free-seat'],
    },
    body: (state) => [
      auctionHolderConsequence(state),
      'The lease door reads the deed once. A line hidden beneath the force list appears: “Let the restored answer for itself.”',
      'That phrase opens Malrec’s witnessed engine channel. It does not prove who or what will answer.',
      'How do you invoke the audit?',
    ],
    choices: [
      {
        id: 'c11-speak-auction-audit-phrase',
        label: 'Speak the audit phrase while every bid term remains visible.',
        detail:
          'Open the engine channel under the exact purchased access and no wider invasion claim.',
        advantage:
          'Reach Malrec’s engine with a public chain that earns the coming answer.',
        requiresFlags: ['c11-invasion-right-won'],
        addFlags: ['c11-auction-engine-phrase-earned'],
        result:
          'The deed stays open as you speak. The engine admits the exact expedition and no unlisted force.',
        next: 'c11-engine-heart',
      },
      {
        id: 'c11-let-free-seat-invoke-audit',
        label: 'Let the free Court seat invoke its own recorded audit.',
        detail:
          'Keep the phrase under civic witness while Caelan guards the fragment.',
        advantage:
          'Open the channel and preserve an independent proof of every access term.',
        addFlags: [
          'c11-auction-engine-phrase-earned',
          'c11-independent-engine-audit',
        ],
        result:
          'The free judge speaks the phrase. The door copies every limit before it opens.',
        next: 'c11-engine-heart',
      },
    ],
  },

  'c11-force-formation': {
    id: 'c11-force-formation',
    kicker: 'Only the crossed expedition forms',
    title: 'The Leased District Line',
    location: 'Sableglass Engine District',
    objective: 'Form the exact expedition for a direct march.',
    threat: 'Immediate',
    art: 'vathisstreets',
    body: (state) => [
      `The force behind you is ${expedition(state)}. No full army, absent clan leader, dragon, or distant partner enters the street.`,
      has(state, 'c9-vexa-permanent-hostility')
        ? 'Vexa stays beyond sword reach. “The west door will bite after two strikes,” she says, paying only the warning required by the truce.'
        : 'Vexa points to the lease bells. “Break one, and every paid guard loses the copied order for a breath.”',
      'How does this exact company approach the first contracted barricade?',
    ],
    choices: [
      {
        id: 'c11-force-futureless-witness-line',
        label: 'Put Ansel and both witnesses behind the first shield.',
        detail:
          'Use living records to cancel copied guard orders without making the Futureless charge.',
        advantage: 'Remove one paid guard line and preserve independent proof.',
        showIfAllFlags: ['c9-roster-futureless'],
        addFlags: ['c11-force-formation-futureless'],
        result:
          'Three pages show three owners. The copied order loses its group claim, and one guard line steps aside.',
        next: 'c11-force-oathfire',
      },
      {
        id: 'c11-force-pell-service-route',
        label: 'Use Pell’s map while his escort holds his injured pace.',
        detail:
          'Open a service lane without asking Pell to run or fight at the front.',
        advantage: 'Bypass the first barricade and preserve a mapped retreat.',
        showIfAllFlags: ['c9-roster-pell'],
        addFlags: ['c11-force-formation-pell', 'c11-force-retreat-mapped'],
        result:
          'Pell marks the service hinge with his good hand. His escort opens the lane and keeps him behind both shields.',
        next: 'c11-force-oathfire',
      },
      {
        id: 'c11-force-mixed-call-line',
        label: 'Move the mixed company through individual call and answer.',
        detail:
          'Use only the command limits accepted by each warden and Moot fighter.',
        advantage:
          'Cross the copied-order street without granting unlimited command.',
        showIfAllFlags: ['c9-roster-wardens'],
        hideIfAnyFlags: ['c9-roster-pell'],
        addFlags: ['c11-force-formation-mixed'],
        result:
          'Each fighter answers before moving. The city cannot turn one command into ownership of the line.',
        next: 'c11-force-oathfire',
      },
      {
        id: 'c11-force-seven-volunteer-marks',
        label: 'Let Teren and all six volunteers choose separate breach posts.',
        detail:
          'Treat seven people as seven decisions and import no Crown March authority.',
        advantage:
          'Break two lease bells at once while preserving individual command.',
        showIfAllFlags: ['c9-roster-crown'],
        addFlags: ['c11-force-formation-crown'],
        result:
          'Teren removes his badge. Seven hands choose seven posts, and two lease bells crack together.',
        next: 'c11-force-oathfire',
      },
    ],
  },

  'c11-force-oathfire': {
    id: 'c11-force-oathfire',
    kicker: 'A retreat must remain voluntary',
    title: 'The Door Behind the Line',
    location: 'Sableglass Engine District',
    objective: 'Keep a retreat route while the contracted barricade closes.',
    threat: 'Critical',
    art: 'vathisengine',
    activeConsequences: {
      reactions: [
        'c11-force-formation-futureless',
        'c11-force-formation-pell',
        'c11-force-formation-mixed',
        'c11-force-formation-crown',
      ],
    },
    body: (state) => [
      forceFormationConsequence(state),
      destroyedOath(state),
      has(state, 'c11-rain-route-exposed')
        ? 'Wet ash marks the company’s route. Sableglass closes the rear door first.'
        : 'The rear door begins closing after the last purchased weather mark fades.',
      'A mythic act can bind your place in the retreat only through the surviving clan-refusal Oath. An ordinary formation can still reach the engine at another cost.',
      'How do you keep the expedition from becoming trapped property?',
    ],
    choices: [
      {
        id: 'c11-mythic-clan-refusal-retreat',
        label: 'Spend 2 Oathfire and surrender the right to cross first.',
        detail:
          'Spend 2 Oathfire. Recipient: clan-refusal Oath. Freedom lost: cross a contract door first. Duration: opening stopped or all reach a chosen safe side. Breach: cross early. Carries forward.',
        advantage:
          'Keep an exclusive retreat door open for every consenting traveller.',
        showIfAllFlags: ['c6-oath-defends-refusal'],
        hideIfAnyFlags: ['c9-destroyed-clan-refusal-oath'],
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: [
          'c11-force-retreat-mythic',
          'c11-freedom-door-order-restricted',
        ],
        result:
          'White fire fixes your boot behind the last willing traveller. The retreat door stops closing, and the order lasts while the Gate opens.',
        next: 'c11-force-breach',
      },
      {
        id: 'c11-use-mapped-force-retreat',
        label: 'Use Pell’s mapped service retreat.',
        detail:
          'Keep Pell behind the shields and follow the complete lock route at his pace.',
        advantage:
          'Preserve every traveller and avoid Oathfire, though Sableglass reaches the engine first.',
        showIfAllFlags: ['c11-force-retreat-mapped'],
        addFlags: ['c11-force-ordinary-retreat'],
        result:
          'Pell points with his good hand. The company backs through the service turn before the main door closes.',
        next: 'c11-force-breach',
      },
      {
        id: 'c11-spend-command-on-force-retreat',
        label: 'Spend 1 Command to rotate each accepted formation through.',
        detail:
          'Spend 1 Command. Use only recorded limits and preserve Health for the engine breach.',
        advantage:
          'Keep the whole expedition together and reach the engine before reinforcement.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c11-force-command-retreat'],
        result:
          'Each person confirms the next position. The rear line clears, turns, and closes before the door bites.',
        next: 'c11-force-breach',
      },
      {
        id: 'c11-break-sidewall-for-retreat',
        label: 'Break the unpaid sidewall and accept civic damage.',
        detail:
          'Spend no resource. The force route stays complete while future devil cooperation becomes harder.',
        advantage:
          'Keep a physical retreat open without restoring a destroyed Oath.',
        addFlags: ['c11-force-sidewall-broken', 'c11-vathis-civic-damage'],
        result:
          'Your shield cracks the unpaid mortar. A narrow retreat opens as contract stones fall into the street.',
        next: 'c11-force-breach',
      },
    ],
  },

  'c11-force-breach': {
    id: 'c11-force-breach',
    kicker: 'Custody becomes a weapon or limit',
    title: 'The Engine Relay',
    location: 'Malrec’s Outer Engine Corridor',
    objective:
      'Capture the Sableglass route relay without changing fragment custody.',
    threat: 'Critical',
    art: 'vathisengine',
    activeConsequences: {
      complications: ['c11-force-sidewall-broken'],
      reactions: [
        'c11-force-retreat-mythic',
        'c11-force-command-retreat',
        'c11-force-ordinary-retreat',
      ],
    },
    body: (state) => [
      forceRetreatConsequence(state),
      fragmentState(state),
      'A black glass relay turns copied guard orders into doors. Its metal teeth match the broken edge of the Gate Nail fragment.',
      has(state, 'c9-vexa-permanent-hostility')
        ? 'Vexa names the relay’s second strike under the truce, then stays outside your weapon reach.'
        : 'Vexa cuts the lease wire but leaves the fragment in your custody.',
      'How do you take the route phrase from the relay?',
    ],
    choices: [
      {
        id: 'c11-force-align-bargained-fragment',
        label: 'Align the neutral case without releasing the return promise.',
        detail:
          'Use the fragment only for the witnessed Gate purpose and keep it untransferable.',
        advantage:
          'Capture the relay phrase without damaging the fragment or widening true-name scope.',
        showIfAllFlags: ['c9-route-bargain'],
        addFlags: ['c11-force-engine-phrase-earned'],
        result:
          'The case meets the relay. Its route phrase burns into the shield rim, while the return promise stays unchanged.',
        next: 'c11-force-engine-phrase',
      },
      {
        id: 'c11-force-burn-relay-with-stolen-fragment',
        label: 'Press the admitted stolen fragment into the relay teeth.',
        detail:
          'Use its visible heat while preserving the theft debt and Vexa’s refusal.',
        advantage:
          'Break the relay before guards return and capture its route phrase.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c11-force-engine-phrase-earned'],
        result:
          'The hot edge melts the copied order. The route phrase remains on the relay frame, and the theft stays publicly named.',
        next: 'c11-force-engine-phrase',
      },
      {
        id: 'c11-force-compel-relay-as-public-evidence',
        label: 'Join the relay to the public Sableglass evidence frame.',
        detail:
          'Keep the fragment in its surrender chain and add the engine attack route.',
        advantage:
          'Capture the phrase and a lasting proof source without spending a resource.',
        showIfAllFlags: ['c9-route-exposure'],
        addFlags: ['c11-force-engine-phrase-earned'],
        result:
          'The frame locks around the relay. Its route phrase and Sableglass seal enter the same public chain.',
        next: 'c11-force-engine-phrase',
      },
    ],
  },

  'c11-force-engine-phrase': {
    id: 'c11-force-engine-phrase',
    kicker: 'A captured route opens a witnessed channel',
    title: 'The Relay’s Last Order',
    location: 'Malrec’s Engine Corridor',
    objective: 'Open the engine channel before Sableglass recovers the relay.',
    threat: 'Immediate',
    art: 'vathisengine',
    body: (state) => [
      'The captured phrase reads, “Let the claimed answer for itself.” The relay can send it once before the black glass cools.',
      vaorProof(state),
      'The phrase can earn an answer. It cannot prove the speaker’s identity, body, death, or location. Who witnesses the sending?',
    ],
    choices: [
      {
        id: 'c11-send-relay-phrase-with-expedition-witness',
        label: 'Send the phrase under an expedition witness mark.',
        detail:
          'Use the exact crossed roster and preserve the relay as route evidence.',
        advantage:
          'Open Malrec’s engine channel with one independent living record.',
        requiresFlags: ['c11-force-engine-phrase-earned'],
        addFlags: ['c11-force-channel-witnessed'],
        result:
          'A willing witness marks the relay. The phrase enters the engine, and the black glass answers with a white pulse.',
        next: 'c11-engine-heart',
      },
      {
        id: 'c11-send-relay-phrase-through-vaor-test',
        label: 'Use Vaor’s permitted ember to test the answering pulse.',
        detail:
          'Use only willing gift or pact permission. The ember tests a real response, not the speaker’s identity.',
        advantage: 'Open the channel and reject one copied Sableglass voice.',
        showIfAnyFlags: [
          'c9-vaor-gift-proof-guard',
          'c9-vaor-pact-proof-carried',
        ],
        addFlags: [
          'c11-force-channel-witnessed',
          'c11-vaor-engine-response-tested',
        ],
        result:
          'The ember warms at the white pulse and stays cold when a Sableglass copy speaks beside it.',
        next: 'c11-engine-heart',
      },
    ],
  },

  'c11-engine-heart': {
    id: 'c11-engine-heart',
    kicker: 'The earned channel opens',
    title: 'A Voice through White Fire',
    location: 'Malrec’s Engine',
    objective: 'Open the witnessed channel earned by the chosen route.',
    threat: 'Unknown',
    art: 'vathisengine',
    body: (state) => [
      routeEvidence(state),
      'The engine is a wheel of white fire around an empty chair. Contract chains run from it toward the inner Black Gate.',
      vaorProof(state),
      'The route phrase enters the wheel. A woman’s voice forms inside the turning fire. “What do you need to know?” she asks.',
    ],
    choices: [
      {
        id: 'c11-ask-engine-voice-identity',
        label:
          'Ask the voice to identify herself and state what Malrec believes.',
        detail:
          'Seek the central answer without claiming the engine can prove identity.',
        advantage:
          'Hear the speaker’s bounded warning under a living witness record.',
        showIfAnyFlags: [
          'c11-revolt-engine-phrase-earned',
          'c11-auction-engine-phrase-earned',
          'c11-force-channel-witnessed',
        ],
        addFlags: ['c11-elian-question-earned'],
        result:
          'You ask for a name and Malrec’s purpose. The white wheel slows enough for the voice to answer.',
        next: 'c11-elian-answer',
      },
      {
        id: 'c11-ask-engine-voice-opposition',
        label: 'Ask why the speaker opposes Malrec’s merger.',
        detail:
          'Test motive before accepting any claim about identity or location.',
        advantage:
          'Hear the bounded warning and preserve uncertainty about the speaker.',
        addFlags: ['c11-elian-question-earned', 'c11-elian-motive-tested'],
        result:
          'You ask what the merger would do to her and everyone else. The engine carries the question into white fire.',
        next: 'c11-elian-answer',
      },
      {
        id: 'c11-ask-engine-voice-for-verifiable-limit',
        label: 'Ask for one warning the engine can test now.',
        detail: 'Demand a physical result before trusting the wider story.',
        advantage:
          'Hear the warning and learn which Gate chain will move first.',
        addFlags: ['c11-elian-question-earned', 'c11-elian-gate-chain-tested'],
        result:
          'The voice names the left Gate chain. It tightens one breath later, proving access to the engine without proving who speaks.',
        next: 'c11-elian-answer',
      },
    ],
  },

  'c11-elian-answer': {
    id: 'c11-elian-answer',
    kicker: 'Malrec’s reason',
    title: 'The Daughter He Remembers',
    location: 'Malrec’s Engine',
    objective:
      'Answer the warning without claiming more than the channel proves.',
    threat: 'Critical',
    art: 'vathisengine',
    introducesStoryTerms: ['Elian'],
    activeConsequences: {
      reactions: [
        'c11-elian-question-earned',
        'c11-elian-motive-tested',
        'c11-elian-gate-chain-tested',
      ],
    },
    body: (state) => [
      earnedQuestionConsequence(state),
      '“My name is Elian,” the voice says. “Malrec remembers me as his daughter. He believes joining the worlds can restore me.”',
      'The empty chair remains empty. The engine shows no body, grave, prison, or proof that this is the only speaker who could use that name.',
      '“Do not let my father merge the worlds to do it,” Elian says. “He would replace every separate answer with the one he needs.”',
      'The chains jerk toward the inner Black Gate. How do you preserve the warning?',
    ],
    choices: [
      {
        id: 'c11-record-elian-bounded-claims',
        label: 'Record only the name, Malrec’s belief, and her opposition.',
        detail:
          'Claim no death, singular identity, physical prison, or objective proof beyond the heard voice.',
        advantage:
          'Create the strongest honest evidence for the next Gate decision.',
        addFlags: ['c11-elian-voice-heard', 'c11-elian-record-bounded'],
        result:
          'The witness record holds four facts and no guess: name, remembered daughter, restoration belief, and refusal of merger.',
        next: 'c11-inner-gate',
      },
      {
        id: 'c11-ask-elian-to-repeat-opposition-publicly',
        label:
          'Ask Elian to repeat only her opposition through the public channel.',
        detail:
          'Strengthen political proof while keeping every deeper identity claim open.',
        advantage:
          'Give the chosen Vathis allies a direct reason to oppose the engine opening.',
        addFlags: ['c11-elian-voice-heard', 'c11-elian-public-opposition'],
        result:
          'The voice repeats the refusal through the witness line. Nobody receives proof of where or what she is.',
        next: 'c11-inner-gate',
      },
      {
        id: 'c11-protect-elian-channel-from-ownership',
        label: 'Close the channel before any faction can claim the voice.',
        detail:
          'Preserve her warning and deny the Court, Compact, or Sableglass a new ownership contract.',
        advantage:
          'Keep Elian’s answer from becoming auction property in Chapter Twelve.',
        addFlags: ['c11-elian-voice-heard', 'c11-elian-channel-protected'],
        result:
          'You pull the route phrase from the wheel. The voice ends without a sale mark, while its warning remains in the living record.',
        next: 'c11-inner-gate',
      },
    ],
  },

  'c11-inner-gate': {
    id: 'c11-inner-gate',
    kicker: 'The old law begins to fail',
    title: 'The Gate Opens Inward',
    location: 'Inner Face of the Black Gate',
    objective:
      'Reach the opening Gate with the route, people, and costs intact.',
    threat: 'Critical',
    art: 'vathisengine',
    activeConsequences: {
      reactions: [
        'c11-elian-record-bounded',
        'c11-elian-public-opposition',
        'c11-elian-channel-protected',
      ],
    },
    body: (state) => [
      elianRecordConsequence(state),
      gatePressure(state),
      routeCost(state),
      fragmentState(state),
      `The exact surviving expedition reaches the inner face: ${expedition(state)}.`,
      'The old promise in the Gate cracks. Black stone begins opening toward Edrath. What do you protect until a new promise can replace it?',
    ],
    choices: [
      {
        id: 'c11-hold-revolt-witness-circle',
        label: 'Hold the refusers’ witness circle at the opening Gate.',
        detail:
          'Carry the revolt’s people, injuries, damaged streets, and Free Ledger price into the next decision.',
        advantage:
          'Give separate devil voices a protected place in the replacement-law hearing.',
        showIfAllFlags: ['c11-route-revolt'],
        addFlags: [
          'c11-inner-gate-opening',
          'c11-alliance-free-ledger-refusers',
        ],
        result:
          'The refusers choose their places around the Gate. Their circle holds separate answers as the first black stone turns.',
        next: 'c11-ending-revolt',
      },
      {
        id: 'c11-lock-auction-deed-to-gate-limit',
        label: 'Lock the narrow invasion deed to its one named force.',
        detail:
          'Carry the lawful right, public review, and exact registered limits into Chapter Twelve.',
        advantage:
          'Delay any unregistered Sableglass invasion while the replacement promise is decided.',
        showIfAllFlags: ['c11-route-auction'],
        addFlags: [
          'c11-inner-gate-opening',
          'c11-alliance-price-court-dissent',
        ],
        result:
          'The deed admits the recorded expedition and rejects every unnamed force behind it. The Gate keeps opening.',
        next: 'c11-ending-auction',
      },
      {
        id: 'c11-hold-force-engine-corridor',
        label: 'Hold the damaged corridor with the exact expedition.',
        detail:
          'Carry physical losses, civic damage, truce limits, and Compact price into the next chapter.',
        advantage:
          'Keep Malrec’s engine workers from reaching the Gate controls first.',
        showIfAllFlags: ['c11-route-force'],
        addFlags: [
          'c11-inner-gate-opening',
          'c11-alliance-ash-compact-passage',
        ],
        result:
          'The expedition locks shields across the corridor. Vexa names one witnessed passage price, and no larger army appears.',
        next: 'c11-ending-force',
      },
    ],
  },

  'c11-ending-revolt': {
    id: 'c11-ending-revolt',
    kicker: 'Chapter Eleven complete',
    title: 'The Square That Refused',
    location: 'Inner Face of the Black Gate',
    objective:
      'Find a new promise that can replace the failing law of the Black Gate.',
    threat: 'Critical',
    art: 'vathisengine',
    final: true,
    body: (state) => [
      'Behind you, named workers hold the witness line they chose. The Free Ledger offers help for one public renewal hearing where every affected group may refuse.',
      'Elian’s bounded warning remains in the witness record: Malrec believes merger can restore the daughter he remembers.',
      routeCost(state),
      fragmentState(state),
      'Malrec’s engine drives another chain. The inner Black Gate opens toward Edrath, and the old law can no longer close it alone.',
      'What new promise can replace the failing law of the Black Gate?',
    ],
    choices: [],
  },

  'c11-ending-auction': {
    id: 'c11-ending-auction',
    kicker: 'Chapter Eleven complete',
    title: 'The Right Bought Narrow',
    location: 'Inner Face of the Black Gate',
    objective:
      'Find a new promise that can replace the failing law of the Black Gate.',
    threat: 'Critical',
    art: 'vathisengine',
    final: true,
    body: (state) => [
      'The invasion deed rejects every force outside its list. The Price Court’s free seat offers help for the right to review the replacement law in public.',
      'Elian’s bounded warning remains in the audit: Malrec believes merger can restore the daughter he remembers.',
      routeCost(state),
      fragmentState(state),
      'Malrec’s engine drives another chain. The inner Black Gate opens toward Edrath, and one purchased delay cannot repair its law.',
      'What new promise can replace the failing law of the Black Gate?',
    ],
    choices: [],
  },

  'c11-ending-force': {
    id: 'c11-ending-force',
    kicker: 'Chapter Eleven complete',
    title: 'The Corridor Taken',
    location: 'Inner Face of the Black Gate',
    objective:
      'Find a new promise that can replace the failing law of the Black Gate.',
    threat: 'Critical',
    art: 'vathisengine',
    final: true,
    body: (state) => [
      'The exact expedition holds the damaged engine corridor. The Ash Compact offers help for one witnessed passage after Malrec’s opening stops.',
      'Elian’s bounded warning remains in the captured relay record: Malrec believes merger can restore the daughter he remembers.',
      routeCost(state),
      fragmentState(state),
      'Malrec’s engine drives another chain. The inner Black Gate opens toward Edrath, and force cannot teach the stone what should replace its law.',
      'What new promise can replace the failing law of the Black Gate?',
    ],
    choices: [],
  },
};
