import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

const priorSeedDamageFlags = [
  'c5-stair-scorched-thread',
  'c5-seed-scorched-river',
  'c5-seed-strained-memory',
  'c5-lysara-reading-strain',
];

const warMeritFlags = [
  'c6-whole-herd-saved',
  'c6-saved-all-herders',
  'c6-saved-swinging-families',
  'c6-forge-service-complete',
  'c6-shrine-service-complete',
  'c6-trial-won-moot',
  'c6-oath-recognised-red-moot',
  'c6-oath-crown-restitution',
  'c6-oath-defends-refusal',
];

function seedWasDamagedBeforeSteppe(state: GameState) {
  return hasAny(state, priorSeedDamageFlags);
}

function craneTravellers(state: GameState) {
  return has(state, 'c5-royal-witnesses-turned')
    ? 'The crane delivered six travellers: you, Mara, Lysara, Sorin, and the two royal witnesses. Your best climbing line still holds the basket to the crane.'
    : 'The crane delivered four travellers: you, Mara, Lysara, and Sorin. Your best climbing line still holds the basket to the crane.';
}

function entryPreparation(state: GameState) {
  if (has(state, 'c6-reached-lift-first')) {
    return 'Reaching the lift first gave you time to catch its guide rope and place the slower travellers behind the safest post.';
  }
  if (has(state, 'c6-party-crossed-together')) {
    return 'The running line is still linked hand to wrist. Nobody stands alone when the lift tilts.';
  }
  if (has(state, 'c6-read-wheel-track')) {
    return 'The crushed grass showed you where the outer wheel leaves a firm channel. A falling platform could slide there instead of under the wheel.';
  }
  return 'Your best climbing line now holds the livestock basket to the crane. It brought every traveller aboard, but you cannot use it again in the next rescue.';
}

function vaorUseBoundary(state: GameState, purpose: string) {
  if (has(state, 'c5-freed-vaor')) {
    return `Vaor gave you this ember, but not command of it. If you call on his fire to ${purpose}, he will decide whether to answer.`;
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return `The stolen ember will obey if you use it to ${purpose}. Vaor pulls against the flame from beyond the storm, making control harder.`;
  }
  return `The pact allows either bearer to refuse the ember’s use. You ask Vaor about using it to ${purpose}. “For living people,” he answers. “Yes.”`;
}

function exactServiceRecord(state: GameState) {
  if (has(state, 'c6-whole-herd-saved')) {
    return 'All forty cattle and all three young riders returned because you used the herders’ own signals.';
  }
  if (has(state, 'c6-saved-all-herders') && has(state, 'c6-lost-part-herd')) {
    return 'All three young riders returned. Twelve cattle were lost when you cut the lead ropes to keep the children off breaking ground.';
  }
  if (has(state, 'c6-saved-herder')) {
    return 'You rode into the storm for one young herder. Korran brought the remaining riders and most of the herd home.';
  }
  if (has(state, 'c6-herd-route')) {
    return 'Living dragonfire turned the herd from the storm and showed that the false voices fear Vaor’s flame.';
  }
  if (has(state, 'c6-broke-ancestor-casting')) {
    return 'You broke the unsafe heirloom casting. The plain spare still holds beneath the town.';
  }
  if (has(state, 'c6-forge-families-safe')) {
    return 'You cleared every nearby home before Dema dropped the damaged channel and saved the brake.';
  }
  if (has(state, 'c6-dema-respect')) {
    return 'You held the hot brake wheel while Dema directed the repair. Her crew kept control of its own forge.';
  }
  if (has(state, 'c6-forge-route')) {
    return 'You used one narrow thread of ember fire only after Dema named the metal and the safe point to heat.';
  }
  if (has(state, 'c6-children-chose-living')) {
    return 'The shrine children broke the storm’s hold by naming living people waiting for them.';
  }
  if (has(state, 'c6-children-safe')) {
    return 'You carried the youngest children out while Asha held the red door.';
  }
  if (has(state, 'c6-heard-storm-accusation')) {
    return 'Your Oath drew the storm away from the children and made its charge against the Concord public.';
  }
  if (has(state, 'c6-shrine-route')) {
    return 'You opened the shrine door and let the children see that the loving voices had no bodies or safe road behind them.';
  }
  return 'The Moot has no completed local duty to present.';
}

function westernRepairAtStorm(state: GameState) {
  if (has(state, 'c6-held-western-axle')) {
    return 'Because you held the axle in the killing position, the repair crew saved its spare braces. They lock those braces beneath the twisting homes now.';
  }
  if (has(state, 'c6-oath-held-western-deck')) {
    return 'The Oath around the western homes catches the first violent twist. It keeps the roofs standing, but every new crack pulls against your ribs while the storm lasts.';
  }
  if (has(state, 'c6-followed-local-command')) {
    return 'Korran’s crew knows exactly which pins it fitted under his command. They hold the repair, but have no spare braces to protect the homes from a second turn.';
  }
  return '';
}

function evidenceAtMoot(state: GameState) {
  const facts: string[] = [];
  if (has(state, 'c5-has-extraction-order'))
    facts.push('Malrec’s signed extraction order');
  if (has(state, 'c5-royal-witnesses-turned'))
    facts.push('two royal witnesses');
  if (has(state, 'c5-memory-copied-to-map-wax'))
    facts.push('Orivane’s memory in black wax');
  if (has(state, 'c5-saved-memory-witnesses'))
    facts.push('three memory plates guarded by Sorin');
  if (has(state, 'c5-oath-held-memory-grave'))
    facts.push('six memory plates guarded by Sorin');
  if (has(state, 'c5-knows-orivane-renewal-wish'))
    facts.push('Orivane’s request that the living judge the Concord again');
  if (has(state, 'c5-memorised-founder-seals'))
    facts.push('the founder seals of every people who hid the cost');
  if (!facts.length)
    return 'You have memory and testimony, but no carried object can make the argument for you.';
  return `Your case can use ${facts.join(', ')}. The proof shows what rulers did. It does not replace service or give you authority over the clans.`;
}

function emberDisclosureStatus(state: GameState) {
  if (has(state, 'c6-concealed-ember-theft')) {
    return 'You refused to tell Korran that the ember was taken by force. The Moot knows you withheld the answer and will not risk fighters under it.';
  }
  if (has(state, 'c6-refused-ember-disclosure')) {
    return 'You chose not to explain the ember’s origin. Korran treats that as an unanswered danger, not proof that you lied.';
  }
  if (has(state, 'c6-delayed-ember-disclosure')) {
    return 'You answered the immediate storm first, then gave Korran the full account before the Moot. He remembers both the delay and the honesty.';
  }
  if (has(state, 'c6-declared-ember-origin')) {
    return 'You gave the town a public account of the ember when the storm first accused you.';
  }
  return 'You answered another urgent danger when the storm accused you. Korran has not treated that as concealment, and he gives you one clear chance to explain the ember now.';
}

function oathCaseBenefit(state: GameState) {
  if (has(state, 'c6-oath-crown-restitution')) {
    return 'Your restitution Oath gives the clans a binding claim against Crown denial. It will also pull against you whenever later orders protect Malrec’s secrecy.';
  }
  if (has(state, 'c6-oath-recognised-red-moot')) {
    return 'Your Oath leaves Kharad commanders under the Red Moot. You may ask for their help, but you cannot quietly turn it into your command.';
  }
  if (has(state, 'c6-oath-defends-refusal')) {
    return 'Your Oath protects the clans’ right to leave after the Gate is safe. Any later order that traps them in your cause risks breaking it.';
  }
  if (has(state, 'c6-oath-honest-limit')) {
    return 'Your limited Oath binds only your own conduct and testimony. It earns a smaller alliance because it promises nothing about Crown repair or future clan freedom.';
  }
  return '';
}

function ancestorCommandOutcome(state: GameState) {
  if (has(state, 'c6-sender-learned-ember')) {
    return 'Vaor’s fire burned only the shared order. The separate voices survived, but the hidden sender learned how the ember feels.';
  }
  if (has(state, 'c6-sender-heard-living-leaders')) {
    return 'The living vote drowned out the shared order. Individual voices remained, and the hidden sender heard the names of Kharad Vey’s chosen leaders.';
  }
  if (has(state, 'c6-oath-guards-steppe-shrines')) {
    return 'Your Oath removed the voices from the vote while allowing them to speak as witnesses. The promise now guards every Kharad shrine.';
  }
  if (has(state, 'c6-hidden-sender-marked')) {
    return 'Ilyra turned the shared order back toward its source. Some voices vanished with it, but the hidden sender exposed its direction beyond the Black Gate.';
  }
  return 'The Moot has not yet recorded how the shared ancestor command was broken.';
}

function ilyraRoadState(state: GameState) {
  if (has(state, 'c6-named-ilyra-manipulation')) {
    return 'Ilyra travels with the escort because the hidden thread remains her investigation. She remembers that you named her public pressure and states her next tests before using them.';
  }
  if (has(state, 'c6-ilyra-interest-acknowledged')) {
    return 'Ilyra travels with the escort because the hidden thread remains her investigation. The attraction is acknowledged, but it grants neither of you authority over the other.';
  }
  if (has(state, 'c6-refused-ilyra-pressure')) {
    return 'Ilyra travels with the escort because the hidden thread remains her investigation. She keeps the distance you asked for and offers evidence without using desire as pressure.';
  }
  return 'Ilyra travels under the Red Moot’s rules to continue her investigation. The alliance remains professional and under local authority.';
}

function emberArrival(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'The ember Vaor gave you warms at the sight of the open steppe. High above, a dark wing crosses the clouds. Riders below raise warning banners when they see him. The dragon promised to meet you here, not to obey you, and you feel the difference like space around a drawn sword.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'The ember you tore from Vaor pulls east beneath your breastplate. A roar rolls out of Dragonspine behind you. It is still far away. Your body does not believe that distance will last.';
  }
  return 'Vaor moves inside your thoughts when the red grass appears. “A city that refuses to stop,” he says. The ember answers his voice with a second beat beneath your ribs.';
}

function vaorAtStorm(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'A dragon shadow circles once above the red clouds. Vaor is here, but the storm turns every ancestor face toward him. If he descends now, panic may destroy what the wind cannot.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'The stolen ember leaps toward the storm. Vaor answers from somewhere behind the mountains, and the fire inside you strains toward his anger.';
  }
  return 'Vaor hears the voices through you. They speak over one another until his grief pushes against your own. “Some sound like memories,” he says. “Something else is speaking with them.”';
}

function relationshipBoundary(state: GameState) {
  const maraOpen =
    state.relationships.mara.intent === 'exploring' ||
    state.relationships.mara.intent === 'committed';
  const lysaraOpen =
    state.relationships.lysara.intent === 'exploring' ||
    state.relationships.lysara.intent === 'committed';

  if (maraOpen) {
    return 'Mara is close enough to hear. Ilyra notices the bond between you before her gaze returns to your face. Whatever else she is testing, she does not pretend that bond is absent.';
  }
  if (lysaraOpen) {
    return 'Lysara meets Ilyra’s measuring look without moving from your side. The witch notices the answer between you and adjusts her approach without insulting either of you by denying it.';
  }
  return 'Ilyra lets her attention pause on your mouth before returning to your eyes. You recognise the invitation she intends you to notice. What you feel about it remains yours to decide.';
}

function dragonThiefAccusation(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'Dragon thief is a lie. Vaor gave you the ember and remained free, but the crowd has no reason to know that yet.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'Dragon thief is the one part you cannot dismiss. You tore the ember from Vaor because you believed the Gate mattered more than his refusal.';
  }
  return 'Dragon thief is not the truth. Vaor chose a pact and shares the burden inside you, but the storm has turned that choice into an accusation.';
}

function lysaraSeedAtStorm(state: GameState) {
  if (seedWasDamagedBeforeSteppe(state)) {
    return 'Lysara drives her scorched seed into the deck. Only a few green threads remain. Mara braces her injured wrist while those threads bind the nearest boards.';
  }
  if (!has(state, 'c2-saved-lysara')) {
    return 'Lysara drives the glass seed into the deck with her good hand. Her untreated wrist cannot hold a precise line alone, so Sorin braces it while green threads bind the boards.';
  }
  return 'Lysara drives her glass seed into the deck. Green threads spread through the boards and keep them from splitting.';
}

function dragonspineHandoff(state: GameState) {
  const records: string[] = [];
  if (has(state, 'c5-has-extraction-order'))
    records.push('Malrec’s extraction order');
  if (has(state, 'c5-memory-copied-to-map-wax'))
    records.push('Orivane’s memory in black wax');
  if (has(state, 'c5-saved-memory-witnesses'))
    records.push('three memory plates');
  if (has(state, 'c5-oath-held-memory-grave'))
    records.push('six memory plates');
  if (has(state, 'c5-royal-witnesses-turned'))
    records.push('two royal witnesses');
  const proof = records.length
    ? `${records.join(', ')} came out with you.`
    : 'The buried truth came out mainly in the memories of the four survivors.';
  const lost = has(state, 'c5-lost-royal-camp-proof')
    ? ' Hale’s loose drill logs and copied camp records were lost, but carried items survived.'
    : '';
  return `Mara, Lysara, and Sorin escaped Dragonspine beside you. ${proof}${lost}`;
}

function stormTestFinding(state: GameState) {
  if (has(state, 'c6-unsea-thread-found')) {
    return 'For one breath, Ilyra’s thread drops through dark water beneath a sky full of doors. Salt returns on the thread. The vision suggests a hidden source, but it does not tell you whether the face in the storm is truly Korran’s mother.';
  }
  if (has(state, 'c6-korran-memory-test')) {
    return 'The voice knows the unfinished cradle, a memory Korran never shared. It may be his mother or a perfect copy of her memories. The answer proves depth, not identity.';
  }
  if (has(state, 'c6-tested-storm-fear')) {
    return 'Vaor brings his fire close without touching the face. It recoils before the heat changes. The reaction looks like fear, though you still cannot prove what felt it.';
  }
  if (has(state, 'c6-voice-knew-new-events')) {
    return 'Asha’s records show when every old story entered the shrine. The voice then repeats a detail you spoke only minutes ago. Something is feeding the storm new knowledge now.';
  }
  return 'The test record is incomplete. Ilyra refuses to assign the storm a source that the player did not establish.';
}

function mootSupport(state: GameState) {
  const respected = has(state, 'c6-korran-respect');
  const originDeclared = has(state, 'c6-declared-ember-origin');
  const strongLocalRecord = hasAny(state, warMeritFlags);
  const damage = [
    has(state, 'c6-west-lift-lost') ? 'the western lift was lost' : '',
    has(state, 'c6-lost-part-herd') ? 'twelve cattle were lost' : '',
    has(state, 'c6-seed-scorched-by-horn')
      ? 'Lysara’s seed was damaged further'
      : '',
  ].filter(Boolean);
  const damageLine = damage.length
    ? ` The clans also count the cost: ${damage.join(', ')}.`
    : '';
  if (has(state, 'c6-concealed-ember-theft')) {
    return `Korran says service earned you a road, but concealing Vaor’s theft bars any request for fighters.${damageLine}`;
  }
  if (
    respected &&
    originDeclared &&
    strongLocalRecord &&
    !has(state, 'c6-oath-honest-limit')
  ) {
    return `Korran names the full record: how you boarded, whose lives and work survived, the duty you completed, the proof you carried, and how you answered for the ember. The Moot will hear a request for war, alliance, or a road.${damageLine}`;
  }
  if (originDeclared) {
    return `The Moot accepts your account of the ember and the service you performed. Missing trust, local losses, or the narrow limit of your Oath keeps the whole town out of your command, but volunteers may still choose an alliance.${damageLine}`;
  }
  return `The Moot credits your service, but the ember’s origin remains unanswered. It will offer a safe road, not fighters asked to trust what you would not explain.${damageLine}`;
}

function mootQuestion(state: GameState) {
  const canAskWar =
    has(state, 'c6-korran-respect') &&
    has(state, 'c6-declared-ember-origin') &&
    hasAny(state, warMeritFlags) &&
    !has(state, 'c6-oath-honest-limit') &&
    !has(state, 'c6-concealed-ember-theft');
  if (canAskWar) {
    return 'Korran asks the final question. “Do you ask Kharad Vey for war, alliance, or only a road?”';
  }
  if (
    !has(state, 'c6-declared-ember-origin') ||
    has(state, 'c6-concealed-ember-theft')
  ) {
    return 'Korran gives the limit before you choose. “We can grant a road. We will not risk fighters while the fire in your chest remains unexplained.”';
  }
  return 'Korran asks the final question. “Do you ask for a guarded alliance, or only a road?”';
}

function proofCarried(state: GameState) {
  const proof: string[] = [];
  if (has(state, 'c5-has-extraction-order'))
    proof.push(
      'Malrec’s extraction order proves his private force meant to cut power from a living dragon',
    );
  if (has(state, 'c5-royal-witnesses-turned'))
    proof.push(
      'two royal soldiers can testify about Hale’s drill and the order behind it',
    );
  if (
    has(state, 'c5-memory-copied-to-map-wax') ||
    has(state, 'c5-rook-copied-first-memory')
  )
    proof.push('black wax carries Orivane’s buried memory');
  if (has(state, 'c5-saved-memory-witnesses'))
    proof.push('Sorin protects three memory plates');
  if (has(state, 'c5-oath-held-memory-grave'))
    proof.push('Sorin protects six memory plates');
  if (has(state, 'c5-knows-orivane-renewal-wish'))
    proof.push(
      'you can repeat Orivane’s final demand that living people judge the Concord again',
    );
  if (has(state, 'c5-memorised-founder-seals'))
    proof.push(
      'you can identify the human, elven, orc, goblin, and other seals used to bury the truth',
    );
  if (!proof.length) {
    return 'The truth of Orivane’s sacrifice survives mainly in your memory. You will have to earn belief before you can ask anyone to act on it.';
  }
  return `${proof.join('. ')}. The evidence can challenge Malrec and the old rulers. It cannot decide what the living clans should do now.`;
}

export const chapterSixNodes: Record<string, StoryNode> = {
  'c6-steppe-road': {
    id: 'c6-steppe-road',
    kicker: 'Chapter Six',
    title: 'The City on Wheels',
    location: 'The Western Ember Steppe',
    objective:
      'Reach Kharad Vey before the moving town passes beyond the storm line.',
    threat: 'Rising',
    art: 'kharad',
    introducesStoryTerms: ['Kharad Vey', 'Ember Steppe', 'ancestor storm'],
    lesson: {
      title: 'What is ahead',
      body: 'The red country is the Ember Steppe. Kharad Vey is a travelling orc town built on twelve wheeled platforms. An ancestor storm follows it, wearing the faces and voices of honoured dead.',
    },
    body: (state) => [
      'Black glass gives way to red grass and hot wind. Dragonspine is behind you. This red country is the Ember Steppe. Wheel tracks as wide as roads lead east.',
      'Kharad Vey rises over the grass, a travelling orc town built on twelve wooden platforms. Its wheels are taller than a gatehouse. Homes, forges, animal pens, and watchtowers move with them.',
      emberArrival(state),
      dragonspineHandoff(state),
      'A red cloud follows the town. Human, orc, and elven faces form inside it, speak, and vanish. A wounded orc rider points back. “Ancestor storm. It wears our honoured dead and calls the living into danger.”',
      'The town will cross a split in the ground within minutes. If you miss its western lift, your party will be trapped outside with the voices.',
      'Mara looks from the racing town to your tired party. “We can reach it. Getting invited aboard may be the difficult part.”',
    ],
    choices: [
      {
        id: 'c6-run-for-lift',
        label:
          'Run directly for the western lift before the city reaches the split.',
        detail:
          'Lose 1 Health pushing your wounded body across the open steppe.',
        advantage:
          'You should reach the lift first and have time to help the slower travellers aboard.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c6-reached-lift-first'],
        result:
          'Pain pulls at every mountain wound, but you reach the lift rope before it rises. You turn and pull the next traveller through the grass.',
        next: 'c6-running-gate',
      },
      {
        id: 'c6-command-steppe-line',
        label:
          'Form a running line and move at the pace of the slowest person.',
        detail:
          'Spend 1 Command keeping the scattered party together across broken ground.',
        advantage:
          'Nobody should be isolated when the ancestor storm reaches the road.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-party-crossed-together'],
        result:
          'Your count gives the run a rhythm. Strong hands support tired ones, and the entire party reaches the lift as one line.',
        next: 'c6-running-gate',
      },
      {
        id: 'c6-follow-red-grass-channel',
        label: 'Follow the flattened grass left by the city’s outer wheel.',
        detail:
          'Take a slower covered route that avoids the worst broken ground.',
        advantage:
          'The wheel track protects your supplies and shows how Kharad Vey approaches dangerous terrain.',
        addFlags: ['c6-read-wheel-track'],
        result:
          'You follow the deep wheel track where the grass has already been crushed. The route curves, but no one falls and every pack reaches the lift.',
        next: 'c6-running-gate',
      },
      {
        id: 'c6-hook-livestock-crane',
        label: 'Have Mara hook the passing livestock crane.',
        detail:
          'Sacrifice the best climbing line and accept an undignified entrance.',
        advantage:
          'The crane should pull the weakest travellers to the city without spending a stat.',
        addFlags: ['c6-spent-climbing-line-entry'],
        result:
          'Mara loops the best climbing line through the crane rope. The livestock basket collects your whole travelling party and rises beside a deeply offended goat. Mara gives the goat the safer corner. “It was here first.”',
        next: 'c6-running-gate',
      },
    ],
  },

  'c6-running-gate': {
    id: 'c6-running-gate',
    kicker: 'The gate will not stop for you',
    title: 'Board a Moving City',
    location: 'The Western Lift of Kharad Vey',
    objective: 'Get the party aboard without pulling the lift tower over.',
    threat: 'Immediate',
    art: 'kharad',
    body: (state) => [
      'The western lift hangs three body lengths above the grass. Orc handlers lower two rope loops while the city keeps moving. Before anyone can climb, the left anchor splits. The platform tilts toward a wheel large enough to crush it whole.',
      has(state, 'c6-spent-climbing-line-entry')
        ? craneTravellers(state)
        : entryPreparation(state),
      'A young handler catches the broken rope around his forearm. It lifts him from his feet. His older sister locks both hands around his belt and begins sliding after him.',
      'You look once at the rope, once at the turning wheel, and feel the ember tense beneath your armour.',
      vaorUseBoundary(state, 'free the safety hook'),
      'The gate captain points a hooked spear at you from above. “Save my people or save your entrance, stranger. You have time for one plan.”',
    ],
    choices: [
      {
        id: 'c6-use-first-rope-catch',
        label: 'Use the guide rope you secured before the lift rose.',
        detail: 'Spend the time gained by reaching the lift first.',
        advantage:
          'Catch both handlers and keep the western lift intact without another resource cost.',
        showIfAllFlags: ['c6-reached-lift-first'],
        addFlags: ['c6-preserved-west-lift'],
        result:
          'The guide rope is already in your hands. You loop it around both handlers and the sound anchor. The crew pulls them up before the platform reaches the wheel.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-use-running-line-counterweight',
        label: 'Turn the linked running line into a counterweight.',
        detail: 'Use the formation your party kept across the steppe.',
        advantage:
          'Nobody must reorganise under the wheel, so the handlers and lift rise together.',
        showIfAllFlags: ['c6-party-crossed-together'],
        addFlags: ['c6-preserved-west-lift'],
        result:
          'Every traveller is still linked. On your count, the whole line leans back. Both handlers rise and the platform levels before the wheel catches it.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-drop-lift-to-wheel-track',
        label: 'Guide the falling platform into the firm wheel track.',
        detail:
          'Use the safe channel you studied on the way in. The lift will be damaged, not destroyed.',
        advantage:
          'Both handlers survive and repair crews keep most of the western entrance.',
        showIfAllFlags: ['c6-read-wheel-track'],
        addFlags: ['c6-west-lift-damaged'],
        result:
          'You cut one side rope and kick the platform toward the crushed grass channel. It lands flat and slides clear of the wheel. Both handlers remain aboard. One rail breaks, but the tower and ropes survive.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-catch-handler-rope',
        label: 'Catch the handler and take the rope’s weight yourself.',
        detail:
          'Lose 1 Health stopping both siblings before the wheel reaches them.',
        advantage:
          'The handlers live, and the gate crew sees you risk yourself before asking for entry.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c6-preserved-west-lift'],
        result:
          'You wrap the rope around your shield arm and drop to one knee. The strain opens a mountain cut, but both siblings reach the ladder alive.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-command-counterweight',
        label: 'Order everyone into a counterweight line.',
        detail: 'Spend 1 Command turning strangers into one balanced pull.',
        advantage:
          'The platform and handlers should both rise without further damage to the lift.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-preserved-west-lift'],
        result:
          'Your party catches the loose line on your count. The platform levels, the handlers rise, and the gate crew answers your final pull without being asked.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-ember-burn-anchor',
        label: 'Ask Vaor to burn the jammed safety hook free.',
        detail:
          'Spend 1 Resolve controlling the fire after Vaor agrees to save the handlers.',
        advantage:
          'A precise burn should release the second platform and catch everyone below.',
        showIfAnyFlags: ['c5-freed-vaor'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-preserved-west-lift'],
        result:
          'You ask Vaor to save the handlers. He answers with one finger of red gold fire. You hold it to one link until the spare platform drops beneath them.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-force-stolen-ember-anchor',
        label: 'Force the stolen ember to burn the jammed safety hook free.',
        detail:
          'Spend 2 Resolve controlling the fire while Vaor resists your use of it.',
        advantage:
          'Release the second platform and save the handlers, while making the theft visible to the lift crew.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c6-preserved-west-lift'],
        result:
          'Vaor refuses. You force one finger of fire through the ember. It frees the hook and catches the handlers, but his roar tells the lift crew the flame was not freely given.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-share-pact-ember-anchor',
        label: 'Ask Vaor to share one precise burn through the pact.',
        detail:
          'Spend 1 Resolve after both bearers agree to save the falling handlers.',
        advantage:
          'Release the second platform without breaking either bearer’s right to refuse.',
        showIfAnyFlags: ['c5-vaor-pact'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-preserved-west-lift'],
        result:
          'You name the purpose. Vaor agrees. One narrow flame frees the hook, and the spare platform drops beneath the handlers.',
        next: 'c6-broken-axle',
      },
      {
        id: 'c6-cut-lift-free',
        label: 'Cut the damaged platform loose and turn it into a drag sled.',
        detail:
          'Sacrifice the western lift so nobody is pulled beneath the wheel.',
        advantage:
          'Everyone survives, but the town must repair an entrance it needs during the storm.',
        addFlags: ['c6-west-lift-lost'],
        result:
          'Your sword parts the last rope. The platform hits the grass and skids beside the wheel instead of beneath it. The handlers live. The gate captain stares at the ruined lift, then orders down a ladder.',
        next: 'c6-broken-axle',
      },
    ],
  },

  'c6-broken-axle': {
    id: 'c6-broken-axle',
    kicker: 'Safety must be earned at speed',
    title: 'The Wheel Beneath the Houses',
    location: 'Kharad Vey, Lower Western Deck',
    objective:
      'Stop a failing axle before it tears through the homes above it.',
    threat: 'Immediate',
    art: 'kharad',
    body: (state) => [
      'The moment your boots reach the lower deck, a crack runs through the city. A support beam punches up through a kitchen floor. The main western axle is shedding iron pins, and every turn drives it closer to the homes above.',
      has(state, 'c6-west-lift-lost')
        ? 'The lost lift has taken half the repair crew with it. Nobody blames you for saving the handlers, but the empty stations make the price visible.'
        : has(state, 'c6-west-lift-damaged')
          ? 'The lift’s broken rail keeps part of its crew behind. The tower still works, but the axle repair has fewer hands.'
          : has(state, 'c6-preserved-west-lift')
            ? 'The intact lift swings its whole crew directly onto the repair lines. Saving the entrance has bought the wheel the hands needed to reach every failing pin.'
            : 'No western-lift outcome was recorded, so Korran will not invent one.',
      'The gate captain removes her helmet. One tusk is capped in brass, and grey runs through her tied black hair. “Korran Red Wind,” she says, pointing toward a tall scarred orc bracing the steering beam. “He speaks for the town this season. If this wheel breaks, there will be no town left to convince.”',
      'Korran does not look at your badge. “You know how to command roads,” he calls. “Show me you can serve one.”',
    ],
    choices: [
      {
        id: 'c6-brace-axle-body',
        label: 'Climb beneath the deck and brace the axle by hand.',
        detail:
          'Lose 2 Health holding the beam while the repair crew replaces its pins.',
        advantage:
          'The dangerous position gives the crew enough time to save every home above.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c6-held-western-axle'],
        result:
          'The axle hammers your shoulder with every turn. You hold until fresh pins bite into the housing and the homes stop shaking apart.',
        next: 'c6-first-duty',
      },
      {
        id: 'c6-command-axle-crews',
        label: 'Split the repair into brace, pin, and evacuation crews.',
        detail:
          'Spend 2 Command learning the local signals and coordinating the deck.',
        advantage:
          'The town keeps moving while every threatened family reaches safety.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c6-learned-wheel-signals'],
        result:
          'You repeat each local signal before giving an order. Korran hears the effort. The braces land together, new pins enter cleanly, and the last family clears the deck before the axle settles.',
        next: 'c6-first-duty',
      },
      {
        id: 'c6-oath-hold-western-deck',
        label:
          'Promise that the western homes will stand through this crossing.',
        detail:
          'Spend 2 Oathfire binding your protection to a town that has not accepted you.',
        advantage:
          'The Oath should hold the damaged structure and prove your power protects people outside Crown rule.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c6-oath-held-western-deck', 'c6-broad-steppe-oath'],
        result:
          'Gold fire spreads through the beams. The weight of hundreds of strangers enters your promise. The axle turns, the houses hold, and every future crack pulls faintly behind your ribs.',
        next: 'c6-first-duty',
      },
      {
        id: 'c6-let-korran-lead-repair',
        label: 'Ask Korran where an unfamiliar pair of hands belongs.',
        detail:
          'Give local knowledge authority instead of taking control of the repair.',
        advantage:
          'You learn the work without spending a stat and avoid issuing a dangerous foreign order.',
        addFlags: ['c6-followed-local-command'],
        result:
          'Korran puts you on the hot pin line. You carry iron until your gloves smoke. The repair succeeds under his commands, and the nod he gives you afterward is small but real.',
        next: 'c6-first-duty',
      },
    ],
  },

  'c6-first-duty': {
    id: 'c6-first-duty',
    kicker: 'A hearing has a price',
    title: 'Choose How You Serve',
    location: 'Kharad Vey, Turning Market',
    objective:
      'Complete one local duty before asking the clans for an alliance.',
    threat: 'Uneasy',
    art: 'kharad',
    introducesStoryTerms: ['Red Moot', 'Black Gate'],
    lesson: {
      title: 'Authority in Kharad Vey',
      body: 'Leadership here is earned for one season. A visitor may speak at the Red Moot only after serving a duty chosen by the town. Command becomes useful after Caelan learns how the people work, not before.',
    },
    body: (state) => [
      'Kharad Vey’s market moves around you while the city rolls east. Bakers hook trays into swinging ovens. Children cross rope bridges without looking down. Every stall has a red cord that can pull its goods flat when the storm strikes.',
      proofCarried(state),
      'Korran washes axle grease from his forearms at a public basin. He is tall even among the other orcs, with old scars across one cheek and the patient voice of a man used to being challenged in front of everyone.',
      '“The Red Moot meets at sunset,” he says. “Three clans decide whether our town carries your ember toward the black stone you saw. We call it the Black Gate.”',
      'Korran points across the market. “You may ask them after one duty. The herds need bringing inside. The forge brakes are failing. The ancestor shrine is calling children by name.”',
    ],
    choices: [
      {
        id: 'c6-choose-herd-duty',
        label: 'Bring the steppe herd through the moving outer gate.',
        detail:
          'Choose a physical rescue where frightened animals and riders can be lost in the storm.',
        advantage:
          'The herders’ clan will judge you by who returns, not by your title.',
        addFlags: ['c6-herd-route'],
        result:
          'You take a hook pole and follow the herders onto the outer bridge. Red horned cattle run beside the moving town while the storm bends toward them.',
        next: 'c6-herd-duty',
      },
      {
        id: 'c6-choose-forge-duty',
        label: 'Repair the forge brakes before the next descent.',
        detail:
          'Choose a dangerous craft problem inside the hottest part of the town.',
        advantage:
          'The wheelwright clan will see whether you can listen before using the ember near their machines.',
        addFlags: ['c6-forge-route'],
        result:
          'You follow the wheelwrights below the market. The forge deck leans with every turn, and molten iron crawls toward a broken brake housing.',
        next: 'c6-forge-duty',
      },
      {
        id: 'c6-choose-shrine-duty',
        label: 'Protect the children at the ancestor shrine.',
        detail:
          'Choose the first direct contact with the voices inside the storm.',
        advantage:
          'The shrine keepers may reveal why the dead have begun calling to the living.',
        addFlags: ['c6-shrine-route'],
        result:
          'You climb toward the shrine deck. Small handprints cover the red door, and a dead woman’s voice is singing from the other side.',
        next: 'c6-shrine-duty',
      },
    ],
  },

  'c6-herd-duty': {
    id: 'c6-herd-duty',
    kicker: 'Red horns in red grass',
    title: 'The Herd Runs Beside You',
    location: 'Kharad Vey, Outer Herd Bridge',
    objective:
      'Bring forty cattle and three young riders inside before the ground splits.',
    threat: 'Immediate',
    art: 'kharad',
    body: (state) => [
      'The herd runs between the city and a crack opening across the steppe. Three young riders keep the cattle together, but the ancestor storm calls with the voices of their parents. One rider turns toward it.',
      'The danger is plain. The voice sounds loving. The ground beneath it is breaking open.',
      'The lead herder gives three sharp whistles as you ride out. One closes the herd, one turns it left, and one calls the young riders toward the city. You repeat them until she nods.',
      vaorUseBoundary(state, 'raise a low wall between the herd and the storm'),
      'Korran rides the inside edge and waits for your choice. This is his town, but he gave you the duty. He will not steal it back because the work became frightening.',
    ],
    choices: [
      {
        id: 'c6-ride-for-lost-herder',
        label: 'Ride into the storm’s edge and bring the young herder back.',
        detail:
          'Lose 1 Health crossing unstable ground while the herd continues without you.',
        advantage:
          'The child returns alive, and Korran can guide the remaining herd through the gate.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c6-saved-herder'],
        result:
          'Your horse nearly loses a leg in the widening crack. You catch the rider by his belt and turn him away from the voice wearing his mother’s love.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-command-herd-funnel',
        label:
          'Repeat the three whistle calls the lead herder just taught you.',
        detail:
          'Spend 1 Command using the local signals to funnel herd and children together.',
        advantage:
          'The whole herd should enter without leaving a rider alone with the voices.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-whole-herd-saved'],
        result:
          'You repeat the herders’ own whistle pattern. Cattle close around the young riders, and the living herd drowns the dead voices beneath hoofbeats.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-ember-wall-herd',
        label:
          'Ask Vaor for a low wall of fire between the herd and the storm.',
        detail:
          'Spend 1 Resolve keeping the agreed flame low enough not to panic the animals.',
        advantage:
          'The barrier blocks the voices and brings all forty cattle and every rider home.',
        showIfAnyFlags: ['c5-freed-vaor'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-whole-herd-saved'],
        result:
          'You ask Vaor to protect the riders. He agrees. Red gold flame runs through the grass without consuming it. The dead voices recoil, and the cattle carry every rider toward the city.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-force-stolen-ember-herd',
        label: 'Force the stolen ember into a low wall before the herd.',
        detail: 'Spend 2 Resolve holding the fire low while Vaor resists.',
        advantage:
          'Block the voices and save every rider, but show the herders that the dragon refused.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c6-whole-herd-saved'],
        result:
          'Vaor pulls against the stolen flame. You force it low across the grass. The voices recoil, every rider escapes, and the dragon’s anger follows them home.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-share-pact-ember-herd',
        label: 'Ask Vaor to share a low wall of fire through the pact.',
        detail:
          'Spend 1 Resolve after both bearers agree to protect the riders.',
        advantage:
          'Block the voices and save every rider without breaking the pact.',
        showIfAnyFlags: ['c5-vaor-pact'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-whole-herd-saved'],
        result:
          'You name the living riders at risk. Vaor agrees. The pact opens a low red wall, and the herd carries every child toward the city.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-cut-herd-loose',
        label: 'Cut the lead ropes and let the animals choose solid ground.',
        detail:
          'Risk losing part of the herd to save the riders from the widening crack.',
        advantage:
          'Every child survives, and the animals reveal a safe path the maps missed.',
        addFlags: ['c6-saved-all-herders', 'c6-lost-part-herd'],
        result:
          'The cattle scatter, then curve around ground too thin to trust. Twelve animals vanish into the grass, but all three riders follow the surviving herd home.',
        next: 'c6-ancestor-warning',
      },
    ],
  },

  'c6-forge-duty': {
    id: 'c6-forge-duty',
    kicker: 'Fire inside a wooden city',
    title: 'The Brake Forge',
    location: 'Kharad Vey, Lower Forge Deck',
    objective: 'Repair the brake before molten iron reaches the axle ropes.',
    threat: 'Immediate',
    art: 'kharad',
    body: (state) => [
      'The forge tilts farther than its chains should allow. Molten iron slides across a black stone channel toward ropes that steer the next wheel. Wheelwright Dema strikes the broken brake housing and curses the old casting inside it.',
      '“Wrong metal,” she says. “One of our honoured grandfathers insisted it would last another season.” Her crew waits for her order, not the grandfather’s reputation.',
      'Your ember leans toward the molten iron. Hunger moves through it. You can help, but every person on the deck is watching whether you understand the machine before touching it.',
      vaorUseBoundary(
        state,
        'soften the cracked casting without burning the forge',
      ),
    ],
    choices: [
      {
        id: 'c6-turn-forge-wheel',
        label: 'Take the brake wheel while Dema replaces the casting.',
        detail: 'Lose 1 Health holding hot iron against the city’s weight.',
        advantage:
          'Dema controls the repair while you absorb the danger her crew cannot.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c6-forge-service-complete', 'c6-dema-respect'],
        result:
          'The wheel burns through your gloves. You hold it at Dema’s count until the new casting locks and the molten iron stops short of the ropes.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-command-forge-evacuation',
        label: 'Move the crew and neighbouring homes before the next tilt.',
        detail: 'Spend 1 Command placing lives ahead of the machine.',
        advantage:
          'Nobody dies if the repair fails, and Dema gains room to work without panic.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-forge-service-complete', 'c6-forge-families-safe'],
        result:
          'Dema calls each local signal and you carry it across the deck with a captain’s voice. The homes empty in one clean line. She drops the damaged channel after the last child clears it and saves the brake from below.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-feed-ember-to-brake',
        label: 'Ask Vaor to soften only the cracked casting.',
        detail: 'Spend 1 Resolve holding the agreed flame inside one crack.',
        advantage:
          'The precise heat lets Dema reshape the metal instead of replacing it.',
        showIfAnyFlags: ['c5-freed-vaor'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-forge-service-complete'],
        result:
          'You ask Vaor for one narrow flame. He agrees after Dema names the safe point. You hold the heat inside one crack while she hammers the casting whole.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-force-stolen-ember-brake',
        label: 'Force the stolen ember to soften the cracked casting.',
        detail:
          'Spend 2 Resolve containing the fire while Vaor resists inside a crowded forge.',
        advantage:
          'Save the casting, but expose the stolen flame to Dema and her crew.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c6-forge-service-complete'],
        result:
          'Vaor refuses the forge. You force one narrow flame into the casting while Dema hammers. The brake holds, and every worker hears the dragon’s anger.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-share-pact-ember-brake',
        label: 'Ask Vaor to share one precise forge flame through the pact.',
        detail:
          'Spend 1 Resolve after Dema names the metal and both bearers agree.',
        advantage:
          'Save the casting without breaking local command or the pact’s refusal term.',
        showIfAnyFlags: ['c5-vaor-pact'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-forge-service-complete'],
        result:
          'Dema names the safe point. You ask Vaor, and he agrees. One narrow flame softens the crack while Dema hammers the casting whole.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-break-grandfather-casting',
        label: 'Destroy the honoured casting and use the plain spare.',
        detail:
          'Reject a prestigious heirloom that is endangering the living crew.',
        advantage:
          'The simple repair works and gives you a concrete lesson for the Red Moot.',
        addFlags: ['c6-forge-service-complete', 'c6-broke-ancestor-casting'],
        result:
          'Dema hands you the hammer. One blow breaks the famous casting. The plain spare fits perfectly. Nobody on the deck mourns the old name while the wheel slows safely.',
        next: 'c6-ancestor-warning',
      },
    ],
  },

  'c6-shrine-duty': {
    id: 'c6-shrine-duty',
    kicker: 'A loving voice at the wrong door',
    title: 'Children of the Red Shrine',
    location: 'Kharad Vey, Ancestor Deck',
    objective:
      'Bring the children away from voices asking them to enter the storm.',
    threat: 'Immediate',
    art: 'storm',
    body: () => [
      'Seven children sit before a door made from red hide. Each hears a different voice beyond it. A small girl reaches for the latch while tears run down her face. “My brother says he found our old home.”',
      'Shrine keeper Asha blocks the door with her body. “We honour the dead as witnesses,” she says. “They advise. They do not command. Whatever is outside has forgotten that law.”',
      'The voice changes. It becomes your father’s voice, dead twenty years, using the childhood name no soldier knows. Your hand moves toward the latch before you stop it. Asha catches your sleeve. “How do we bring them out, Captain?”',
    ],
    choices: [
      {
        id: 'c6-carry-children-from-shrine',
        label: 'Carry the youngest children out while Asha holds the door.',
        detail:
          'Lose 1 Health when the storm pulls the door through your injured shoulder.',
        advantage:
          'Every child leaves before the voice can learn what else they want to hear.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c6-shrine-service-complete', 'c6-children-safe'],
        result:
          'You carry two children and lead the rest by a rope. The door slams against your shoulder, but every living voice reaches the lower deck.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-name-living-shrine-voices',
        label: 'Make each child name one living person waiting outside.',
        detail:
          'Spend 1 Command giving the frightened children a shared answer to the dead.',
        advantage:
          'Their own voices should break the storm’s hold without denying their grief.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-shrine-service-complete', 'c6-children-chose-living'],
        result:
          'Each child names someone alive. Mother. Cousin. Teacher. Friend. The words become louder than the storm, and small hands release the latch.',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-oath-no-dead-command',
        label: 'Promise that no dead voice will command a child here.',
        detail: 'Spend 1 Oathfire drawing every false command toward yourself.',
        advantage:
          'The children can leave safely, and you will hear what the storm is truly accusing you of.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: [
          'c6-shrine-service-complete',
          'c6-heard-storm-accusation',
          'c6-broad-steppe-oath',
        ],
        result:
          'Gold fire seals the red door. The children hear silence. Hundreds of voices turn toward you. “You serve the power that stopped our families from ever being born.”',
        next: 'c6-ancestor-warning',
      },
      {
        id: 'c6-open-shrine-door-yourself',
        label:
          'Open the door alone and show the children what is calling them.',
        detail:
          'Face the storm without magical protection so fear cannot invent something worse.',
        advantage:
          'The children see that the loving voices have no bodies and cannot lead anyone home.',
        addFlags: ['c6-shrine-service-complete'],
        result:
          'You open the door. Red dust fills the frame. Faces appear, but there are no hands, no road, and no lost home. The oldest child closes the door herself.',
        next: 'c6-ancestor-warning',
      },
    ],
  },

  'c6-ancestor-warning': {
    id: 'c6-ancestor-warning',
    kicker: 'The storm chooses an accusation',
    title: 'The Families Who Never Lived',
    location: 'Kharad Vey, Upper Spine',
    objective:
      'Keep the town moving while the ancestor voices turn against you.',
    threat: 'Rising',
    art: 'storm',
    body: (state) => [
      'Your duty is complete. Before Korran can call the Red Moot, every ancestor banner on the upper spine turns toward you. The wind stops. Thousands of wheels keep moving in sudden silence.',
      vaorAtStorm(state),
      'A woman forms inside the red cloud. Her face is old, scarred, and familiar to half the people around you. Korran goes still. “My mother,” he says.',
      'The storm woman points at the ember in your chest. “Crown bearer. Dragon thief. Servant of the power that cut our families out of the world.”',
      dragonThiefAccusation(state),
      'People step away from you. In Dragonspine you learned that old rulers hid lives erased by the Concord. Nothing you saw there explains how this voice knows you carry the ember today.',
      'Korran keeps one hand on the steering rope. “What truth do you answer with?”',
    ],
    choices: [
      {
        id: 'c6-admit-rulers-lied',
        label: 'Admit publicly that the old rulers hid the Concord’s victims.',
        detail:
          'Give up the safety of an easier story before you know how the crowd will react.',
        advantage:
          'Korran and the town hear the truth from you before the storm can twist it.',
        addFlags: ['c6-admitted-concord-crime', 'c6-ember-disclosure-pending'],
        result:
          'You say what Orivane’s memory showed you. Anger moves through the crowd, but nobody can accuse you of hiding the same truth.',
        next: 'c6-storm-breach',
      },
      {
        id: 'c6-demand-storm-name-source',
        label: 'Ask the voice where it learned your new name.',
        detail:
          'Spend 1 Resolve resisting the pull of your father’s voice beneath hers.',
        advantage:
          'The answer may distinguish an old memory from something watching you now.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-ember-disclosure-pending'],
        result:
          'You ask who taught the dead to call you Ember Bearer. The woman smiles with Korran’s mother’s mouth. “The sea beneath every lost road.”',
        next: 'c6-storm-breach',
      },
      {
        id: 'c6-declare-given-ember',
        label: 'Tell them Vaor gave you the ember and remained free.',
        detail:
          'Let the town judge a willing gift instead of the storm’s accusation.',
        advantage:
          'Vaor’s shadow and Lysara’s witness support your account, though neither can force the crowd to trust you.',
        showIfAnyFlags: ['c5-freed-vaor'],
        addFlags: ['c6-declared-ember-origin', 'c6-voluntary-ember-disclosure'],
        result:
          'You name the choice exactly. Vaor gave the ember and kept his freedom. His shadow crosses the cloud as Lysara confirms what she saw. Some people lower their weapons. Others keep watching the dragon.',
        next: 'c6-storm-breach',
      },
      {
        id: 'c6-confess-stolen-ember',
        label: 'Admit that you tore the ember from Vaor against his will.',
        detail:
          'Expose the choice that may cost the town’s trust and give Vaor a claim against you.',
        advantage:
          'Korran hears the truth from you and can judge the danger without the storm controlling the story.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        addFlags: ['c6-declared-ember-origin', 'c6-voluntary-ember-disclosure'],
        result:
          'You admit the theft. Anger breaks across the deck. Korran does not forgive you, but he stops the first drawn spear. “He answered,” he says. “Now we judge the whole man, not the lie he could have told.”',
        next: 'c6-storm-breach',
      },
      {
        id: 'c6-declare-pact-ember',
        label:
          'Tell them Vaor chose a pact and now shares the burden with you.',
        detail:
          'Reveal that the second presence inside you is an ally with his own will.',
        advantage:
          'The ember’s second heartbeat and Lysara’s witness distinguish the pact from possession or theft.',
        showIfAnyFlags: ['c5-vaor-pact'],
        addFlags: ['c6-declared-ember-origin', 'c6-voluntary-ember-disclosure'],
        result:
          'You state the pact in full. You and Vaor carry the ember to the black stone gate, protect living people, and expose what the Concord erased. Either of you may refuse its use. The bond ends only when the gate is safe and both of you call the duty complete. Lysara confirms that two living wills chose the bond. At Vaor’s consent, the ember beats twice. The word thief loses its hold.',
        next: 'c6-storm-breach',
      },
      {
        id: 'c6-order-party-defensive-ring',
        label:
          'Place your companions around the ember and prepare for an attack.',
        detail:
          'Spend 1 Command protecting the party while the town decides whether you are an enemy.',
        advantage:
          'A disciplined defence prevents panic without threatening Kharad Vey’s civilians.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c6-ember-disclosure-pending'],
        result:
          '“The storm wants panic more than truth,” you tell Korran. Your people form a tight shield ring facing the cloud, not the crowd. Mara makes certain everyone notices the difference.',
        next: 'c6-storm-breach',
      },
    ],
  },

  'c6-storm-breach': {
    id: 'c6-storm-breach',
    kicker: 'The dead reach for the wheel',
    title: 'When the Ancestors Pull',
    location: 'Kharad Vey, High Steering Bridge',
    objective: 'Stop the storm from turning the city into the broken ground.',
    threat: 'Critical',
    art: 'storm',
    activeConsequences: {
      complications: [
        'c6-held-western-axle',
        'c6-oath-held-western-deck',
        'c6-followed-local-command',
      ],
    },
    body: (state) => [
      'The storm hits before the argument can continue. Red wind tears across the open decks. Ancestor faces descend over the steering bridge, and every helmsman hears a dead teacher ordering a different turn.',
      'The front wheels pull north. The rear wheels pull south. Houses twist between them. A family platform breaks one chain and swings out over the grass.',
      has(state, 'c6-learned-wheel-signals')
        ? 'You know the deck signals now. The living crews are waiting for one command they can share.'
        : 'You do not know every wheel signal, but you know what fear does to a line when orders conflict.',
      westernRepairAtStorm(state),
      has(state, 'c6-reached-lift-first')
        ? 'The people you helped aboard first are already on the inner deck, clear of the swinging platform.'
        : has(state, 'c6-party-crossed-together')
          ? 'Your party keeps the same hand to wrist line used on the steppe, so nobody is cut off by the first turn.'
          : has(state, 'c6-read-wheel-track')
            ? 'The wheel track you studied tells you which side of the city will stay on firm ground during the turn.'
            : 'The crane entry saved strength, but your best climbing line still hangs from the western basket.',
      'Korran reaches the main steering rope. Mara runs for the swinging platform.',
      lysaraSeedAtStorm(state),
      'Korran looks up at the false faces and shouts, “Which line do I hold?”',
    ],
    choices: [
      {
        id: 'c6-use-climbing-line-family',
        label:
          'Throw the preserved climbing line to Mara and the swinging family.',
        detail:
          'Use the rope you kept by entering through the lift instead of the livestock crane.',
        advantage:
          'Mara can pull every civilian home while you help Korran keep the city upright.',
        hideIfAnyFlags: ['c6-spent-climbing-line-entry'],
        addFlags: ['c6-saved-swinging-families'],
        result:
          'Mara catches the line and loops it through the platform rail. The family crawls back one person at a time while you put both hands on Korran’s steering rope.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-save-family-platform',
        label: 'Cross the loose chain and pull the family platform back.',
        detail:
          'Lose 2 Health rescuing the people while Korran holds the steering rope.',
        advantage:
          'Every trapped civilian survives, and Korran remains free to keep the city upright.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c6-saved-swinging-families'],
        result:
          'The platform drops under your weight. You cross the chain, tie three children to your belt, and pull until living hands drag the platform home.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-command-all-wheels',
        label: 'Call one living rhythm across every wheel deck.',
        detail:
          'Spend 2 Command overriding the conflicting dead voices with signals the crews know.',
        advantage:
          'The whole city turns together and avoids the broken ground without sacrificing a platform.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c6-saved-swinging-families'],
        result:
          'You call the rhythm Korran used at the axle. One deck answers, then twelve. The city turns away from the split, and the loose family platform swings back within Mara’s reach.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-oath-living-steer',
        label: 'Promise that only living hands will steer Kharad Vey tonight.',
        detail:
          'Spend 2 Oathfire binding your magic to the town’s right to govern itself.',
        advantage:
          'The Oath silences every command in the storm and gives the wheel crews control.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c6-oath-living-authority', 'c6-broad-steppe-oath'],
        result:
          'Gold fire circles every steering rope. Dead commands break against the promise. The living crews choose one turn, and Mara pulls the family platform home as the city follows it.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-carry-living-horn',
        label: 'Carry Korran’s living horn call across the banner ropes.',
        detail:
          'Let Lysara spread one true signal while you hold the main rope beside Korran.',
        advantage:
          'The living crews hear their commander above the dead, but the effort scorches more of Lysara’s seed.',
        showIfAllFlags: ['c2-saved-lysara'],
        hideIfAnyFlags: priorSeedDamageFlags,
        addFlags: ['c6-seed-scorched-by-horn'],
        result:
          'Lysara runs green thread through the banner ropes. Korran sounds one long call. Every deck follows it, and Mara pulls the family platform home while you and Korran haul the main rope.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-carry-living-horn-untreated',
        label:
          'Brace Lysara’s untreated wrist while she carries Korran’s horn call.',
        detail:
          'Spend 1 Resolve sharing the steering rope and keeping her injured hand steady.',
        advantage:
          'Every deck hears Korran, but the old Bellweather injury flares and will need rest.',
        hideIfAnyFlags: ['c2-saved-lysara', ...priorSeedDamageFlags],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: [
          'c6-seed-scorched-by-horn',
          'c6-lysara-hand-strained-by-horn',
        ],
        result:
          'Sorin binds Lysara’s wrist while you hold the steering rope against her shoulder. Her thread carries Korran’s call. Mara pulls the family platform home before the light snaps back into the seed.',
        next: 'c6-korran-terms',
      },
      {
        id: 'c6-carry-living-horn-damaged',
        label: 'Help Lysara spend the scorched seed’s last wide signal.',
        detail:
          'Spend 1 Resolve holding the line steady. The seed will retain only a short thread after this use.',
        advantage:
          'Every deck hears Korran now, but future living magic will have much less reach.',
        showIfAnyFlags: priorSeedDamageFlags,
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-seed-scorched-by-horn', 'c6-seed-critically-weakened'],
        result:
          'Sorin braces Lysara’s wrist while you hold the steering rope. The scorched seed carries Korran’s call across every deck. Mara pulls the family platform home, then most of the green light goes dark.',
        next: 'c6-korran-terms',
      },
    ],
  },

  'c6-korran-terms': {
    id: 'c6-korran-terms',
    kicker: 'The living speak after the dead',
    title: 'Korran’s Law',
    location: 'Kharad Vey, Wind Caller’s Deck',
    objective:
      'Understand what the clans need before asking them to approach the Black Gate.',
    threat: 'Rising',
    art: 'storm',
    body: (state) => [
      'Kharad Vey survives the turn. Damage crews run across the decks while the ancestor storm gathers for another strike. Korran brings you to a sheltered platform where three red cords mark the clans that will judge you.',
      exactServiceRecord(state),
      '“Eight forts once guarded the Black Gate,” he says. “The nearest fires have gone dark. Your Crown wants our road, our riders, and now the ember in your chest.”',
      'His eyes settle on your badge. “We may still help. Not because a dead treaty ordered us. Not because your Regent discovered fear. The Red Moot must know whether our people get a say in the world you are trying to save.”',
      emberDisclosureStatus(state),
      has(state, 'c6-oath-living-authority')
        ? 'The promise around the steering ropes still burns. You already gave the town part of an answer: the dead may witness, but the living decide.'
        : 'Some of your orders protected another person’s choice. Others replaced it. Korran is asking whether you still see the difference.',
      has(state, 'c6-declared-ember-origin')
        ? 'Korran folds his arms. “Tell me what you believe before you tell the Moot what you need.”'
        : 'Korran folds his arms. “First tell me how that ember became yours. Then tell me what right you claim over my people.”',
    ],
    choices: [
      {
        id: 'c6-say-crown-owes-restitution',
        label:
          'Say the Crown must tell the truth, return stolen land, and repay the people it harmed.',
        detail: 'Take a public position your own government may call treason.',
        advantage:
          'Korran hears that alliance will not require silence about the Concord’s victims.',
        showIfAllFlags: ['c6-declared-ember-origin'],
        addFlags: ['c6-korran-respect'],
        result:
          'You name the truth, the land taken, and the debt still unpaid. The words may cost your rank if you ever return to Greyhaven. Korran hears that an apology alone will not satisfy you.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-say-living-authority-first',
        label:
          'Say no old promise outranks the consent of people living under it.',
        detail:
          'Reject inherited authority as a complete answer, including your own Crown commission.',
        advantage:
          'The principle directly answers the fear driving the Red Moot.',
        showIfAllFlags: ['c6-declared-ember-origin'],
        addFlags: ['c6-korran-respect'],
        result:
          'You say the living must be allowed to renew, change, or refuse what the dead arranged. Korran’s shoulders ease by a fraction.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-say-gate-first',
        label:
          'Say survival at the Black Gate must come before settling old crimes.',
        detail:
          'Keep the immediate threat first even if the clans hear another request to wait for justice.',
        advantage:
          'The direct military argument may appeal to leaders who fear what is already opening.',
        showIfAllFlags: ['c6-declared-ember-origin'],
        result:
          'You say a future dispute requires people alive to have it. Korran accepts the logic without liking the familiar shape of the delay.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-ask-korran-his-price',
        label:
          'Ask what duty Korran would accept if your positions were reversed.',
        detail: 'Make him name his own standard before you offer yours.',
        advantage: 'His answer reveals what he will defend during the Moot.',
        showIfAllFlags: ['c6-declared-ember-origin'],
        result:
          'Korran answers without offence. “I would help close the Gate. I would refuse any victory that returned my people to someone else’s rule.”',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-disclose-gift-after-crisis',
        label:
          'Explain that Vaor gave the ember freely, then recognise the clans’ right to choose.',
        detail:
          'Give the full answer after dealing with the storm’s immediate danger first.',
        advantage:
          'Delayed honesty clears the accusation and gives Korran a direct political answer.',
        showIfAllFlags: ['c5-freed-vaor', 'c6-ember-disclosure-pending'],
        addFlags: [
          'c6-declared-ember-origin',
          'c6-delayed-ember-disclosure',
          'c6-korran-respect',
        ],
        result:
          'You explain that Vaor gave the ember and remained free. Then you say Kharad Vey must choose its own road. Korran marks the delay, hears the full answer, and accepts it.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-disclose-theft-after-crisis',
        label:
          'Admit that you took the ember by force, then recognise the clans’ right to choose.',
        detail:
          'Tell the truth after the urgent storm response. The theft will still damage your case.',
        advantage:
          'Korran can judge a confessed wrong instead of an unanswered accusation.',
        showIfAllFlags: [
          'c5-took-ember-by-force',
          'c6-ember-disclosure-pending',
        ],
        addFlags: [
          'c6-declared-ember-origin',
          'c6-delayed-ember-disclosure',
          'c6-korran-respect',
        ],
        result:
          'You say that Vaor refused and you took the ember anyway. Anger crosses Korran’s face. He also hears you place the clans’ choice above your need. “Truth does not repair theft,” he says. “It gives us something solid to judge.”',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-disclose-pact-after-crisis',
        label:
          'State Vaor’s pact terms, then recognise the clans’ right to choose.',
        detail:
          'Explain the shared duty, either bearer’s right to refuse, and how the pact ends.',
        advantage:
          'The Moot hears that the ember has two willing bearers and clear limits.',
        showIfAllFlags: ['c5-vaor-pact', 'c6-ember-disclosure-pending'],
        addFlags: [
          'c6-declared-ember-origin',
          'c6-delayed-ember-disclosure',
          'c6-korran-respect',
        ],
        result:
          'You state the shared duty, Vaor’s right to refuse any use, and the pact’s ending. Then you give Kharad Vey the same freedom. Vaor confirms the words with one second heartbeat.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-refuse-ember-account',
        label:
          'Refuse to explain the ember and ask only for help the Moot can safely offer.',
        detail:
          'Make the refusal explicit. Korran will not treat it as an accidental omission.',
        advantage:
          'You keep Vaor’s history private, but full military support will close to you.',
        showIfAnyFlags: ['c5-freed-vaor', 'c5-vaor-pact'],
        showIfAllFlags: ['c6-ember-disclosure-pending'],
        addFlags: ['c6-refused-ember-disclosure'],
        result:
          '“I will not explain the ember,” you say. “Then do not ask us to risk lives on it,” Korran answers. He leaves the road request open and closes the larger military question.',
        next: 'c6-ilyra-entry',
      },
      {
        id: 'c6-conceal-ember-theft',
        label: 'Refuse to say how you took the ember.',
        detail:
          'Deliberately conceal Vaor’s refusal. The Moot will offer a road but no fighters.',
        advantage: 'The theft stays out of your public testimony for now.',
        showIfAllFlags: [
          'c5-took-ember-by-force',
          'c6-ember-disclosure-pending',
        ],
        addFlags: ['c6-refused-ember-disclosure', 'c6-concealed-ember-theft'],
        result:
          'You decline to answer. Vaor’s distant roar makes the silence worse. Korran names the limit in front of the witnesses: Kharad Vey may give you a road, but no fighter will follow a concealed fire.',
        next: 'c6-ilyra-entry',
      },
    ],
  },

  'c6-ilyra-entry': {
    id: 'c6-ilyra-entry',
    kicker: 'A witch has already read the room',
    title: 'Ilyra Fen',
    location: 'Kharad Vey, Wind Caller’s Deck',
    objective:
      'Decide how much room to give the witch studying the ancestor storm.',
    threat: 'Uneasy',
    art: 'moot',
    introducesStoryTerms: ['Ilyra Fen', 'Threadread'],
    lesson: {
      title: 'Threadread',
      body: 'Ilyra can see emotional and magical connections as threads of light. This may reveal fear, desire, loyalty, or hidden pressure. It does not read exact thoughts, control anyone, or turn desire into consent.',
    },
    body: (state) => [
      '“A useful answer,” a woman says from the stairs. “Whichever part of it you meant.”',
      'Ilyra Fen steps onto the moving deck without reaching for a rail. She is a half elf with bronze skin and long dark auburn hair. Her wine red coat fits close, and her grey green eyes stay on you.',
      'One pale thread runs from her open hand to the ember beneath your armour. When you look down, she smiles. She meant you to notice it.',
      relationshipBoundary(state),
      'Korran says, “Ilyra is here because she knows why the dead have started shouting. Ilyra is not here because anyone invited her.”',
      '“No invitation,” she agrees. Her eyes move from your Crown badge to your wounded companions. She says Malrec’s name. The thread tightens when your hand closes at your side.',
      '“Your badge says duty. Your people say protection. That reaction says you no longer trust your Regent. I need the ember to test the storm. You need my evidence before the Moot.”',
      'She offers her hand. The gesture is elegant, open, and positioned so the entire deck will see whether you accept it.',
    ],
    choices: [
      {
        id: 'c6-name-ilyra-test',
        label:
          'Name the pressure behind her public offer before taking her hand.',
        detail:
          'Show Ilyra that beauty and urgency will not make you miss the public pressure behind her offer.',
        advantage:
          'She must negotiate openly, and Korran sees that neither of you controls the alliance alone.',
        addFlags: ['c6-named-ilyra-manipulation'],
        result:
          '“You want the Moot to see me choose your method before I know its cost,” you say. Ilyra’s mouth curves, not quite a smile. “Good. This may be less exhausting than I feared.” She names the test before you take her hand.',
        next: 'c6-storm-trace',
      },
      {
        id: 'c6-accept-ilyra-interest',
        label:
          'Take her hand and admit that both the alliance and the woman interest you.',
        detail:
          'Begin a slow mutual attraction only if no other relationship remains open.',
        advantage:
          'Honest desire removes one tool she might otherwise use indirectly and earns her respect.',
        forbidsRelationshipIntents: {
          mara: ['exploring', 'committed'],
          lysara: ['exploring', 'committed'],
        },
        addFlags: ['c6-ilyra-interest-acknowledged'],
        result:
          'You take her hand. “I want your evidence. I am also interested in you. Those are different choices.” Heat touches Ilyra’s composure for one brief breath. “Then we will keep both honest,” she says.',
        next: 'c6-storm-trace',
      },
      {
        id: 'c6-refuse-ilyra-pressure',
        label: 'Refuse the hand and ask for evidence without theatre.',
        detail:
          'Reject her first attempt to shape the room without rejecting her investigation.',
        advantage:
          'The boundary protects your position and shows Ilyra that pressure will have a visible cost.',
        addFlags: ['c6-refused-ilyra-pressure'],
        result:
          'You leave her hand between you. “Evidence first.” Ilyra lowers it without embarrassment. “A boundary stated in time is useful,” she says. “I dislike it. That is not the same as disrespecting it.”',
        next: 'c6-storm-trace',
      },
      {
        id: 'c6-keep-ilyra-professional',
        label: 'Accept the test only under Korran’s local authority.',
        detail:
          'Keep the relationship professional and place the experiment under rules the town controls.',
        advantage:
          'Korran can stop the test, and Ilyra gains access without owning its terms.',
        addFlags: ['c6-ilyra-professional-alliance'],
        result:
          'You accept the work only if Korran names the limits. Ilyra studies you for a moment, then agrees. “You make caution sound almost attractive,” she says. You let the word pass without mistaking it for a promise.',
        next: 'c6-storm-trace',
      },
    ],
  },

  'c6-storm-trace': {
    id: 'c6-storm-trace',
    kicker: 'Threads between the living and lost',
    title: 'What the Storm Is Made From',
    location: 'Kharad Vey, Open Root Garden',
    objective: 'Trace one ancestor voice without letting it enter the ember.',
    threat: 'Rising',
    art: 'moot',
    body: (state) => [
      'Ilyra chooses the town’s root garden because every plant there grew from seed carried by a living family. She draws a circle in the soil and asks Korran to name his mother aloud. A pale thread rises from his chest toward the storm.',
      '“Threadread shows connection,” she tells you. “Not truth. Grief can connect a man to a lie wearing the correct face.”',
      has(state, 'c6-named-ilyra-manipulation')
        ? 'She states every step before taking it. Being challenged has made her more exact, not quieter.'
        : has(state, 'c6-refused-ilyra-pressure')
          ? 'She does not touch you or the ember. The distance honours the boundary while making her concentration harder.'
          : 'She waits for your spoken permission before bringing the thread near the ember. Knowing what you want is not permission, and she makes the distinction visible.',
      vaorUseBoundary(
        state,
        'let Ilyra trace the storm through it for one breath',
      ),
      'Korran’s mother appears above the garden. She knows the lullaby he buried with her. Then she points to the pale burn beneath your breastplate, left by Dragonspine last week. Korran stares at her. “My mother died two winters ago.”',
      'Ilyra’s eyes sharpen. “That should be impossible. Choose what we test next.”',
    ],
    choices: [
      {
        id: 'c6-let-ilyra-thread-ember',
        label: 'Let Ilyra connect the ember to the voice for one breath.',
        detail:
          'Spend 1 Resolve holding your identity apart from Vaor and the storm.',
        advantage:
          'The direct test can show where the voice receives new memories.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        showIfAllFlags: ['c5-freed-vaor'],
        addFlags: ['c6-unsea-thread-found'],
        result:
          'You ask Vaor first. His shadow turns once above the garden, and the ember answers. You give Ilyra one breath. Cold salt fills your mouth as her thread drops through a place with no ground.',
        next: 'c6-impossible-memory',
      },
      {
        id: 'c6-force-stolen-ember-thread',
        label: 'Force the stolen ember to carry Ilyra’s thread for one breath.',
        detail:
          'Spend 2 Resolve controlling the fire while Vaor resists the use.',
        advantage:
          'The direct test can reveal the source, but Vaor’s anger becomes visible to the Moot.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        showIfAllFlags: ['c5-took-ember-by-force'],
        addFlags: ['c6-unsea-thread-found'],
        result:
          'The ember obeys, but Vaor pulls against it. Fire bites your ribs while Ilyra follows the thread downward. Cold salt fills your mouth, and Vaor’s roar shakes every branch above the garden.',
        next: 'c6-impossible-memory',
      },
      {
        id: 'c6-share-pact-ember-thread',
        label: 'Ask Vaor to share the pact ember with Ilyra for one breath.',
        detail:
          'Spend 1 Resolve keeping three living wills separate inside the same magical line.',
        advantage:
          'The direct test can reveal the source without breaking either bearer’s right to refuse.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        showIfAllFlags: ['c5-vaor-pact'],
        addFlags: ['c6-unsea-thread-found'],
        result:
          'You ask. Vaor agrees, and Ilyra waits for your answer too. Three separate choices meet for one breath. Cold salt fills your mouth as the thread drops through a place with no ground.',
        next: 'c6-impossible-memory',
      },
      {
        id: 'c6-test-korran-private-memory',
        label: 'Ask Korran for a private memory the storm cannot guess.',
        detail:
          'Risk the pain of a personal test instead of exposing the ember.',
        advantage:
          'A correct answer would prove the voice is more than a public imitation.',
        addFlags: ['c6-korran-memory-test'],
        result:
          'Korran asks where his mother hid after her final argument with him. The voice answers, “Under your unfinished cradle.” Korran closes his eyes. Nobody else knew the cradle existed.',
        next: 'c6-impossible-memory',
      },
      {
        id: 'c6-ask-vaor-hear-fear',
        label: 'Ask Vaor whether the voice can feel fear.',
        detail:
          'Use the dragon’s response if he is near or bound to the ember.',
        advantage:
          'Fear would suggest a present mind rather than an empty recording.',
        showIfAnyFlags: ['c5-vaor-pact'],
        addFlags: ['c6-tested-storm-fear'],
        result:
          'You bring Vaor’s living fire close to the voice without striking it. The ancestor face recoils before the heat changes. Whatever is inside the storm can anticipate harm.',
        next: 'c6-impossible-memory',
      },
      {
        id: 'c6-compare-living-records',
        label: 'Compare the voice with shrine records and living witnesses.',
        detail:
          'Choose slower evidence without exposing anyone’s mind or the ember.',
        advantage:
          'The method can separate copied history from knowledge acquired after death.',
        addFlags: ['c6-voice-knew-new-events'],
        result:
          'Asha brings the shrine rolls. The voice knows every written event, then repeats a detail you spoke in the garden minutes ago. It is receiving information now, not merely reciting an old life.',
        next: 'c6-impossible-memory',
      },
    ],
  },

  'c6-impossible-memory': {
    id: 'c6-impossible-memory',
    kicker: 'A dead voice learns something new',
    title: 'The Sea Beneath Lost Roads',
    location: 'Kharad Vey, Open Root Garden',
    objective:
      'Carry the discovery to the Red Moot without letting the storm decide what it means.',
    threat: 'Rising',
    art: 'moot',
    introducesStoryTerms: ['Unsea'],
    lesson: {
      title: 'The Unsea',
      body: 'Ilyra calls the hidden place beneath erased roads the Unsea. Old accounts say lost lives leave traces there. This storm can learn new facts. You still do not know whether its faces are truly the dead or only copies of them.',
    },
    body: (state) => [
      stormTestFinding(state),
      'Ilyra closes her hand around the thread before the test can pull farther. A line of blood reaches her upper lip. She wipes it away with one thumb and studies the red mark as part of the cost, not proof of success.',
      '“Old records call that hidden place the Unsea,” she says. “We do not know whether the dead truly live there. We know only this: after a person dies, this storm can still learn new things about our world.”',
      'Korran looks at the face of his mother above the garden. Hope hurts him more visibly than grief did. “Then she may be alive.”',
      '“Perhaps,” Ilyra says. “We have not proved it. Even if she is your mother, surviving somewhere else does not give her the right to rule you.”',
      has(state, 'c6-admitted-concord-crime')
        ? 'The crowd remembers that you admitted the old crime before understanding this proof. Their anger remains, but it has stopped looking only at you.'
        : 'The storm begins telling the crowd that you came to erase the voices again. You have one walk to the Moot to decide how much truth you will carry into it.',
      'Korran looks from the fading face of his mother to you. “What can you promise without turning hope into another lie?”',
    ],
    choices: [
      {
        id: 'c6-promise-investigate-voices',
        label: 'Promise to help discover which voices are truly conscious.',
        detail:
          'Spend 1 Oathfire taking responsibility beyond the Black Gate crisis.',
        advantage:
          'The clans gain a binding promise that their lost families will not be dismissed as tricks.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c6-oath-investigate-unsea', 'c6-broad-steppe-oath'],
        result:
          'Your Oath burns around the salt thread. You promise investigation, not reunion, and the careful limit makes Korran believe it.',
        next: 'c6-red-moot',
      },
      {
        id: 'c6-state-what-is-known',
        label: 'State only what the test proved and what remains unknown.',
        detail: 'Refuse both false comfort and easy dismissal.',
        advantage:
          'Ilyra will carry the same precise account before the Red Moot.',
        addFlags: ['c6-precise-unsea-truth'],
        result:
          'You list what everyone witnessed. The voice knew a new burn. Your chosen test added one more fact. Nothing yet proves that every face belongs to the dead person it resembles.',
        next: 'c6-red-moot',
      },
      {
        id: 'c6-comfort-korran-without-promise',
        label: 'Tell Korran you will not use uncertainty to deny his hope.',
        detail:
          'Offer human support without claiming knowledge you do not have.',
        advantage:
          'Korran enters the Moot hurt but not isolated, strengthening your personal alliance.',
        addFlags: ['c6-korran-respect'],
        result:
          'You stand beside him while his mother’s face watches from the cloud. You do not call her false. You do not call her real. Korran accepts the harder kindness.',
        next: 'c6-red-moot',
      },
      {
        id: 'c6-ask-ilyra-publicly-lead-proof',
        label: 'Ask Ilyra to present the evidence under her own name.',
        detail:
          'Give the witch credit and control over her discovery instead of using her as your expert.',
        advantage:
          'The Moot hears the finding from its investigator, and Ilyra becomes responsible for defending it.',
        addFlags: ['c6-ilyra-leads-evidence'],
        result:
          'Ilyra looks for a trap in the offer and finds none. “I will present the evidence,” she says. “You may explain why anyone should follow it into danger.”',
        next: 'c6-red-moot',
      },
    ],
  },

  'c6-red-moot': {
    id: 'c6-red-moot',
    kicker: 'Three clans, one moving floor',
    title: 'The Red Moot',
    location: 'Kharad Vey, Central Wheel Hall',
    objective:
      'Choose how to persuade the clans before their vote on your alliance.',
    threat: 'Rising',
    art: 'moot',
    body: (state) => [
      'The central hall has no throne. Three clan leaders stand around a floor map while the city moves beneath them. Herders hold the west. Wheelwrights hold the north. Shrine keepers hold the east. Families crowd every open gallery.',
      'Korran presents the service you completed. Nobody calls it payment. It earns you the right to be heard, not the right to win.',
      exactServiceRecord(state),
      evidenceAtMoot(state),
      has(state, 'c6-precise-unsea-truth')
        ? 'You give the Moot the exact limit you promised: the voices learn, but no test has proved that every face is the dead person it resembles.'
        : 'The test remains evidence about the storm’s behaviour, not permission to call every face a returned ancestor.',
      has(state, 'c6-ilyra-leads-evidence')
        ? 'Ilyra presents the Unsea evidence in her own name. She does not soften uncertainty or let the storm claim certainty either.'
        : 'Ilyra stands at the edge of the map. When someone mistakes possibility for proof, one lifted finger is enough to stop them.',
      'The Moot offers three lawful ways to support your request.',
      'You may use the work you completed for the clans as proof of your character. You may fight their seasonal champion under local law.',
      'Or you may make a public Oath to respect the clans’ decisions after the Gate is closed.',
      'The storm presses faces against the open sides of the hall. The floor turns beneath your boots. Every clan marker remains still while its leader waits for your argument.',
    ],
    choices: [
      {
        id: 'c6-choose-service-case',
        label: 'Build the case from the duty you completed among the clans.',
        detail:
          'Rely on witnessed actions and local relationships rather than rank or magic.',
        advantage:
          'Service creates the safest alliance and avoids binding a promise beyond what you know.',
        result:
          'You remove your Crown badge and place the tool from your chosen duty on the map. The hall quiets because everyone knows what that work cost.',
        next: 'c6-service-case',
      },
      {
        id: 'c6-choose-trial-case',
        label: 'Accept trial combat under steppe law.',
        detail:
          'Risk Health proving you will stand under the same law as any clan leader.',
        advantage:
          'Victory can win immediate military respect without speaking for the Crown’s future.',
        result:
          'You set sword and shield on the map. The herder champion Varka steps forward and names the rules: first blood, surrender, or removal from the moving ring.',
        next: 'c6-trial-case',
      },
      {
        id: 'c6-choose-oath-case',
        label: 'Offer a public Oath recognising the clans’ right to choose.',
        detail:
          'Risk Oathfire and your future standing with the Crown on a promise no Regent approved.',
        advantage:
          'A binding guarantee can win the broadest support if its terms protect choice rather than purchase it.',
        result:
          'You place your bare hand over the map. Gold light gathers beneath your scars. The hall waits to hear exactly what you will promise and what you will refuse to own.',
        next: 'c6-oath-case',
      },
    ],
  },

  'c6-service-case': {
    id: 'c6-service-case',
    kicker: 'A deed must answer a future question',
    title: 'What Your Hands Proved',
    location: 'Kharad Vey, Central Wheel Hall',
    objective:
      'Show what your local service proves about the alliance you are asking for.',
    threat: 'Immediate',
    art: 'moot',
    body: (state) => [
      exactServiceRecord(state),
      has(state, 'c6-herd-route')
        ? 'The three young riders stand behind you. If cattle were lost, the lead herder names the number before anyone praises the rescue.'
        : has(state, 'c6-forge-route')
          ? has(state, 'c6-broke-ancestor-casting')
            ? 'Dema places the broken heirloom casting beside the plain spare’s maker mark.'
            : 'Dema brings the repair record and names who controlled the forge, who was moved to safety, and whether dragonfire touched her machine.'
          : 'Asha brings the children from the shrine. They stand beside living relatives while the storm wears beloved faces outside.',
      'Clan leader Ugra asks the question that matters. “You served because you wanted our riders. What happens when helping us no longer serves your road?”',
    ],
    choices: [
      {
        id: 'c6-service-living-before-road',
        label:
          'Say the living people beside a road matter more than the power controlling it.',
        detail:
          'Turn your service into a rule the clans can use to judge your future actions.',
        advantage:
          'The answer joins Caelan’s protection instinct to the town’s demand that living people stay in control.',
        result:
          'You say a road exists for the people using it, not the ruler naming it. Ugra looks toward the families you helped and accepts that your actions fit the claim.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-service-name-debt',
        label: 'Name the debt as mutual and let Kharad Vey collect first.',
        detail:
          'Offer one future act of service before asking the city to approach the Gate.',
        advantage:
          'The limited debt earns guarded support without promising Crown authority you do not possess.',
        addFlags: ['c6-owes-kharad-service'],
        result:
          'You offer one duty chosen by the Moot after the Gate crisis. Ilyra makes you define its limits. The clans accept a debt that neither side can quietly expand.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-service-share-orivane-truth',
        label: 'Place Orivane’s hidden truth beside the work you completed.',
        detail:
          'Reveal painful evidence that several peoples’ rulers shared responsibility.',
        advantage:
          'The clans gain reason to approach the Gate as people who will help decide what comes after.',
        showIfAnyFlags: [
          'c5-has-extraction-order',
          'c5-royal-witnesses-turned',
          'c5-memory-copied-to-map-wax',
          'c5-saved-memory-witnesses',
          'c5-oath-held-memory-grave',
          'c5-knows-orivane-renewal-wish',
          'c5-memorised-founder-seals',
        ],
        addFlags: ['c6-shared-orivane-proof'],
        result:
          'Sorin places the carried proof beside the tool from your service. You describe the rulers around Orivane’s sacrifice and the truth they hid. The evidence proves the crime. Your work among the clans proves why they should hear you.',
        next: 'c6-ancestor-coup',
      },
    ],
  },

  'c6-trial-case': {
    id: 'c6-trial-case',
    kicker: 'The ring moves beneath both fighters',
    title: 'Varka’s Challenge',
    location: 'Kharad Vey, Moot Ring',
    objective:
      'Survive the trial without treating the clan champion as an enemy.',
    threat: 'Critical',
    art: 'moot',
    body: () => [
      'The combat ring is painted across two turning platforms. Every twelve breaths, a gap opens between them. Varka enters with a hooked axe and no armour over her scarred arms.',
      '“I am not Malrec,” she says. “Do not fight the Crown battle you wanted.”',
      'She attacks before the crowd finishes laughing. The hook catches your shield rim and pulls you toward the opening gap. The ember offers enough fire to end the trial quickly. Using it against her would answer the wrong question.',
    ],
    choices: [
      {
        id: 'c6-trial-take-first-blood',
        label:
          'Take the axe across your guard and mark Varka with the shield rim.',
        detail: 'Lose 2 Health winning first blood without using the ember.',
        advantage:
          'A clean lawful victory proves courage while leaving Varka able to fight at the Gate.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c6-trial-won-moot'],
        result:
          'The axe cuts through your shoulder plate. You stay inside its reach and touch the sharpened shield rim to Varka’s brow. One line of blood ends the trial.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-trial-command-ring',
        label: 'Read the wheel rhythm and force Varka to choose solid ground.',
        detail:
          'Spend 2 Command using what the city taught you about its moving decks.',
        advantage:
          'You win by learning local ground rather than overpowering its champion.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c6-trial-won-moot'],
        result:
          'You count the platform turns aloud. Varka realises one breath too late that each safe step narrows her path. She yields at the edge and laughs when the crowd sees how you learned it.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-trial-refuse-ember',
        label: 'Release shield and ember, then finish the trial hand to hand.',
        detail:
          'Spend 1 Resolve refusing the easier power while Varka keeps her axe.',
        advantage:
          'The risk proves that carrying a weapon does not mean using it to control every contest.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c6-trial-won-moot'],
        result:
          'You let the shield fall and close before the axe can turn. Varka hits the deck beneath you, then taps surrender against your wrist. The ember never leaves your chest.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-trial-save-varka',
        label:
          'Abandon the winning strike when the platform gap catches Varka’s leg.',
        detail:
          'Give up a clear victory to stop the moving ring from maiming her.',
        advantage:
          'Varka survives unhurt and may judge the rescue as stronger proof than first blood.',
        addFlags: ['c6-trial-won-moot'],
        result:
          'You throw away the strike and pull Varka free. She could claim the trial. Instead she raises your arm. “He understood the law before he won it,” she tells the Moot.',
        next: 'c6-ancestor-coup',
      },
    ],
  },

  'c6-oath-case': {
    id: 'c6-oath-case',
    kicker: 'A promise can protect or purchase',
    title: 'Terms the Crown Did Not Write',
    location: 'Kharad Vey, Central Wheel Hall',
    objective:
      'Make a promise that protects the clans without claiming their future.',
    threat: 'Critical',
    art: 'moot',
    body: (state) => [
      'Gold Oathfire spreads across the floor map. It reaches every clan marker and stops there, waiting for exact words.',
      'Lysara watches with a diplomat’s stillness. Mara watches your breathing. Both know a broad promise could give you the power needed at the Gate and destroy you later if a monarch refuses its terms.',
      has(state, 'c6-broad-steppe-oath')
        ? 'The earlier steppe promise already carries the weight of strangers. Adding every future alliance will make each broken term hurt you personally.'
        : 'You have protected roads and people before. This promise would bind a political future you do not control.',
      'Ilyra steps close enough for only you to hear. “Do not promise them obedience from someone else. Promise what you will do when obedience fails.”',
    ],
    choices: [
      {
        id: 'c6-oath-recognise-moot',
        label:
          'Promise to recognise the Red Moot’s authority in every alliance you lead.',
        detail:
          'Spend 2 Oathfire binding your future command to the clans’ living decisions.',
        advantage:
          'The narrow promise protects sovereignty without pretending you control the whole Crown.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c6-oath-recognised-red-moot', 'c6-broad-steppe-oath'],
        result:
          'You bind every alliance you personally lead. Kharad commanders will continue to answer to the Red Moot, even when they fight beside you. Gold fire settles around the clan markers without covering them.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-oath-crown-restitution',
        label:
          'Promise to force the Crown to answer those harmed by the Concord.',
        detail:
          'Spend 3 Oathfire making a larger promise that may turn your kingdom against you.',
        advantage:
          'The broad Oath can win full support and gain power whenever you confront Crown denial.',
        changes: { oathfire: -3, resolve: 1 },
        requires: { oathfire: 3 },
        addFlags: ['c6-oath-crown-restitution', 'c6-broad-steppe-oath'],
        result:
          'You promise to bring the hidden crime before the Queen or stand against the throne that buries it. The Oath enters your bones. Korran hears both its strength and its danger.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-oath-defend-refusal',
        label:
          'Promise to defend the clans’ right to refuse you after the Gate is safe.',
        detail: 'Spend 1 Oathfire protecting a future answer you may dislike.',
        advantage:
          'The promise proves this alliance is not a disguised claim of ownership.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c6-oath-defends-refusal', 'c6-broad-steppe-oath'],
        result:
          'You promise that help today will not become obedience tomorrow. The Oath burns brightest around the word refuse.',
        next: 'c6-ancestor-coup',
      },
      {
        id: 'c6-limit-oath-to-self',
        label: 'Refuse to speak for the Crown and bind only your own conduct.',
        detail:
          'Accept a smaller alliance. Promise only to state your orders clearly and never claim authority the Moot did not grant.',
        advantage:
          'The honest limit avoids a future broken Oath, but it cannot earn the full town’s march.',
        addFlags: ['c6-oath-honest-limit'],
        result:
          'You bind only your own conduct. You will state every order clearly and claim no command the Moot did not grant. The smaller fire holds, and the clan markers remain untouched.',
        next: 'c6-ancestor-coup',
      },
    ],
  },

  'c6-ancestor-coup': {
    id: 'c6-ancestor-coup',
    kicker: 'The storm demands the final vote',
    title: 'Let the Dead Decide',
    location: 'Kharad Vey, Central Wheel Hall',
    objective: 'Stop the ancestor storm from replacing the living Moot.',
    threat: 'Critical',
    art: 'storm',
    body: (state) => [
      'Before the clans can vote, every fire in the hall turns red. Ancestor faces fill the open walls. Korran’s mother, Dema’s grandfather, and a hundred honoured dead speak with one voice.',
      '“We remember the world stolen from you. Give us the ember. Turn from the Gate. Let the dead restore what the living surrendered.”',
      'People kneel. Not all of them. Enough. Pale threads wrap around the clan markers and drag them toward the vote for retreat. No living leader touched them.',
      'Ilyra plants both hands on the table. Green white Threadread lines flare from her wrists. The effort shakes her composure and reveals the strain beneath it. “The voices share one command,” she says. “Break that command, and each voice must choose whether to remain.”',
      has(state, 'c6-ilyra-interest-acknowledged')
        ? 'Her eyes find yours through the light. The attraction between you is present and useless against the storm. Trust must come from what you do next.'
        : 'She does not ask you to trust her. She shows you the line carrying the command and leaves the choice in your hands.',
      vaorUseBoundary(
        state,
        'burn only the shared command and leave each separate voice intact',
      ),
      'The thread begins cutting into her palms. “I have exposed it,” she says. “How do you want it broken?”',
    ],
    choices: [
      {
        id: 'c6-cut-command-with-ember',
        label: 'Ask Vaor to burn the single command binding the voices.',
        detail: 'Lose 2 Health carrying his agreed fire through the storm.',
        advantage:
          'The command breaks while individual ancestor voices remain free to speak or leave.',
        showIfAnyFlags: ['c5-freed-vaor'],
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c6-preserved-ancestor-voices', 'c6-sender-learned-ember'],
        result:
          'You ask Vaor to protect the living vote. He agrees. Fire tears across your nerves and burns only the shared order. Separate voices remain, but the hidden sender learns Vaor’s flame.',
        next: 'c6-final-alliance',
      },
      {
        id: 'c6-force-stolen-ember-command',
        label: 'Force the stolen ember through the command binding the voices.',
        detail:
          'Lose 2 Health and spend 1 Resolve controlling the fire while Vaor resists.',
        advantage:
          'Break the shared command and preserve separate voices, while exposing the theft to the whole Moot.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { health: -2, resolve: -1 },
        requires: { health: 1, resolve: 1 },
        addFlags: ['c6-preserved-ancestor-voices', 'c6-sender-learned-ember'],
        result:
          'Vaor refuses. You force his fire through Ilyra’s thread. It burns the shared order and leaves the separate voices, but his roar fills the hall as the hidden sender learns the stolen flame.',
        next: 'c6-final-alliance',
      },
      {
        id: 'c6-share-pact-ember-command',
        label: 'Ask Vaor to share the fire that will break the command.',
        detail:
          'Lose 2 Health after both bearers agree to protect the living vote.',
        advantage:
          'Break the shared command and preserve separate voices without breaking the pact.',
        showIfAnyFlags: ['c5-vaor-pact'],
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c6-preserved-ancestor-voices', 'c6-sender-learned-ember'],
        result:
          'You name the living people losing their vote. Vaor agrees. The pact carries fire through Ilyra’s thread. It breaks the shared order and preserves the separate voices.',
        next: 'c6-final-alliance',
      },
      {
        id: 'c6-command-living-vote',
        label:
          'Call every living clan member to speak the name of their chosen leader.',
        detail:
          'Spend 2 Command making the living vote louder than the dead order.',
        advantage:
          'The public answer restores the Moot without destroying the ancestor voices.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: [
          'c6-preserved-ancestor-voices',
          'c6-sender-heard-living-leaders',
        ],
        result:
          'Names rise from every gallery. Korran. Ugra. Dema. Asha. The living vote drowns out the shared order. The separate voices remain, but the hidden sender hears which leaders the town chose.',
        next: 'c6-final-alliance',
      },
      {
        id: 'c6-oath-dead-witness-only',
        label: 'Promise that the dead may witness here but never rule.',
        detail:
          'Spend 2 Oathfire making one rule hold at every shrine: the dead may advise, but only the living may vote.',
        advantage:
          'The Oath keeps living people in control while honest ancestor voices remain able to advise.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: [
          'c6-preserved-ancestor-voices',
          'c6-oath-guards-steppe-shrines',
        ],
        result:
          'Gold fire passes through every ancestor shrine. The voices remain, but they can no longer move a vote or issue an order there. Korran’s mother looks at him without commanding him.',
        next: 'c6-final-alliance',
      },
      {
        id: 'c6-let-ilyra-turn-command',
        label: 'Let Ilyra turn the command back toward its hidden sender.',
        detail:
          'Trust her to redirect the magical order while you keep the ember beyond her control.',
        advantage:
          'The command leaves the town and reveals that someone beyond the Black Gate is listening.',
        addFlags: ['c6-hidden-sender-marked'],
        result:
          'You hold the ember shut and give Ilyra the exposed command. She turns it east. The voices still tied to that order vanish with it. The others remain. A distant answer beyond the Gate shakes the floor and reveals the sender’s direction.',
        next: 'c6-final-alliance',
      },
    ],
  },

  'c6-final-alliance': {
    id: 'c6-final-alliance',
    kicker: 'The Red Moot votes in its own voice',
    title: 'What Kharad Vey Will Risk',
    location: 'Kharad Vey, Central Wheel Hall',
    objective:
      'Ask for the form of support that matches the future you argued for.',
    threat: 'Rising',
    art: 'moot',
    body: (state) =>
      [
        'The red fires return to ordinary orange. Some ancestor faces remain in the clouds, speaking separately now. Others dissolve. Korran’s mother touches two fingers to her brow and disappears before he can decide whether to answer.',
        'The three clan markers rest where living hands placed them. Kharad Vey continues east. Ahead, the Black Gate opens another finger’s width, and a red pulse travels through the grass toward the city.',
        mootSupport(state),
        oathCaseBenefit(state),
        emberDisclosureStatus(state),
        mootQuestion(state),
      ].filter(Boolean),
    choices: [
      {
        id: 'c6-ask-red-war',
        label: 'Ask Kharad Vey to ride for war at the Black Gate.',
        detail:
          'Request riders, wheel engines, and the whole moving town against the opening Gate.',
        advantage:
          'The strongest military commitment can hold the Gate, but it places thousands of civilians in the coming campaign.',
        showIfAnyFlags: warMeritFlags,
        showIfAllFlags: ['c6-korran-respect', 'c6-declared-ember-origin'],
        hideIfAnyFlags: [
          'c6-oath-honest-limit',
          'c6-refused-ember-disclosure',
          'c6-concealed-ember-theft',
        ],
        changes: { wayfire: 2 },
        addFlags: ['c6-red-moot-war'],
        result:
          'You ask for war and name its danger without hiding civilians behind the word army. The three clans vote to turn every wheel toward the Black Gate.',
        next: 'c6-ending-war',
      },
      {
        id: 'c6-ask-guarded-alliance',
        label:
          'Ask for a guarded alliance led by the Red Moot’s own commanders.',
        detail:
          'Request an ember escort and volunteer riders while Kharad Vey keeps authority over its people.',
        advantage:
          'The alliance provides meaningful forces without making the town an extension of Caelan’s command.',
        showIfAllFlags: ['c6-declared-ember-origin'],
        hideIfAnyFlags: [
          'c6-refused-ember-disclosure',
          'c6-concealed-ember-theft',
        ],
        changes: { wayfire: 2 },
        addFlags: ['c6-red-moot-alliance'],
        result:
          'You ask the clans to choose their own commanders and the number they can risk. The vote grants an ember escort, wind callers, and riders under Korran’s seasonal authority.',
        next: 'c6-ending-alliance',
      },
      {
        id: 'c6-accept-neutral-road',
        label: 'Ask only for a safe road, witnesses, and the right to return.',
        detail:
          'Accept military neutrality rather than turn earned trust into pressure for troops.',
        advantage:
          'Kharad Vey remains protected while its guides and evidence strengthen Caelan’s cause.',
        changes: { wayfire: 2 },
        addFlags: ['c6-red-moot-neutral'],
        result:
          'You ask for no army. The Moot grants guides, public witnesses, supplies, and a safe road through the steppe. Neutrality becomes a boundary, not abandonment.',
        next: 'c6-ending-neutral',
      },
    ],
  },

  'c6-ending-war': {
    id: 'c6-ending-war',
    kicker: 'Chapter Six complete',
    title: 'Every Wheel Turns East',
    location: 'Kharad Vey, Eastern Steppe',
    objective:
      'Lead the wheel town toward the Black Gate before the Crown army catches it.',
    threat: 'Critical',
    art: 'storm',
    final: true,
    nextChapter: 'c7-red-horizon',
    body: (state) => [
      'War horns sound from all twelve platforms. Herds enter protected lanes. Forge decks lock their tools. Kharad Vey does not become your army. It becomes a nation moving beside your cause.',
      'Korran rides at the front under a banner chosen by the Moot. Ilyra remains long enough to mark the possible Unsea current beneath the ancestor storm.',
      'Korran keeps seasonal command because the whole town travels with him. Dema holds the western steering rope and may overrule any battlefield turn that risks the city without the Moot’s consent.',
      ilyraRoadState(state),
      ancestorCommandOutcome(state),
      has(state, 'c6-ilyra-interest-acknowledged')
        ? 'Her fingers brush yours when she passes the storm map back. “You kept politics and desire separate,” she says. “Keep doing that.” The contact is brief, intentional, and private despite the army forming around you.'
        : has(state, 'c6-named-ilyra-manipulation')
          ? 'When she returns the map, she says, “You saw what I was arranging and still judged the evidence fairly. I can work with that.”'
          : has(state, 'c6-refused-ilyra-pressure')
            ? 'She returns the map without stepping into your space. “Evidence without theatre,” she says. “As requested.” Respect, not attraction, gives the words their warmth.'
            : has(state, 'c6-ilyra-professional-alliance')
              ? 'She gives the finished map to Korran first, honouring the local rules you set. Only after he approves it does she place it in your hands.'
              : 'She returns the map with formal care. You have an investigator beside your cause, not a closeness either of you chose.',
      'A western scout returns the Crown army pin to the map. It is now one day behind. Dead commanders are speaking inside its storm, and the soldiers are moving faster than living orders allow.',
      has(state, 'c5-royal-witnesses-turned')
        ? 'The two royal witnesses ride with Sorin and the carried evidence. Their next job is to tell Crown soldiers what Malrec ordered at Dragonspine.'
        : 'Sorin rides with the carried evidence and prepares to explain what Malrec tried to take from Vaor.',
      'You won the help you came for. Your next battle will decide whether that help survives the road.',
    ],
    choices: [],
  },

  'c6-ending-alliance': {
    id: 'c6-ending-alliance',
    kicker: 'Chapter Six complete',
    title: 'An Alliance with Its Own Voice',
    location: 'Kharad Vey, Eastern Steppe',
    objective:
      'Carry the ember toward the Black Gate with Korran’s chosen escort.',
    threat: 'Critical',
    art: 'moot',
    final: true,
    nextChapter: 'c7-red-horizon',
    body: (state) => [
      'Kharad Vey continues on its own eastern line. Forty riders, six wind callers, and two moving shield engines leave under Korran’s command. They travel beside you, never behind.',
      'Before Korran leaves, the Red Moot gives Dema the seasonal steering cords. She commands the town until he returns or the clans call another vote.',
      ilyraRoadState(state),
      ancestorCommandOutcome(state),
      'Ilyra ties a glass charm around the storm map. “This will show which voice learns something new,” she says. She keeps hold of the cord until you meet her eyes and accept the responsibility with it.',
      has(state, 'c6-named-ilyra-manipulation')
        ? '“You are still arranging me,” you say. Her smile arrives slowly. “Yes. You are still noticing. That may be why this works.”'
        : has(state, 'c6-ilyra-interest-acknowledged')
          ? 'The warmth between you does not ask for a promise yet. It asks whether the next honest disagreement will make either of you step closer.'
          : 'She leaves the distance between you professional and exact. Respect remains, which may be more useful than charm on the road ahead.',
      'Korran’s western scouts find the Crown army on the horizon. Its banners move beneath an ancestor storm, and dead officers are calling commands the living soldiers obey.',
      has(state, 'c5-royal-witnesses-turned')
        ? 'Sorin and the two royal witnesses carry the Dragonspine proof beside the volunteers.'
        : 'Sorin keeps the Dragonspine proof dry inside a hide case beside the storm map.',
      'The Red Moot gave you an alliance. Now you must keep a pursuing army from turning it into a battlefield.',
    ],
    choices: [],
  },

  'c6-ending-neutral': {
    id: 'c6-ending-neutral',
    kicker: 'Chapter Six complete',
    title: 'A Road Freely Given',
    location: 'Kharad Vey, Eastern Steppe',
    objective:
      'Reach the Black Gate with guides before the pursuing Crown army overtakes you.',
    threat: 'Critical',
    art: 'kharad',
    final: true,
    nextChapter: 'c7-red-horizon',
    body: (state) => [
      'You asked only for a road, and the Moot accepts that limit. Kharad Vey keeps every wheel away from the Gate’s direct path. It gives you water, fresh armour straps, three guides, and witnesses willing to speak against Malrec.',
      'Before Korran leaves as a guide, the Red Moot gives Dema the seasonal steering cords. She commands the town until he returns or the clans call another vote.',
      'Korran names himself as one of the three guides, then grips your forearm. “You asked for what we could give without pretending fear made us yours. That is why you may return.”',
      ilyraRoadState(state),
      ancestorCommandOutcome(state),
      has(state, 'c6-refused-ilyra-pressure')
        ? 'Ilyra joins the guides at the edge of the platform. “You refused me and accepted their refusal,” she says. “Annoyingly consistent.” Respect warms the words more than affection does.'
        : has(state, 'c6-ilyra-interest-acknowledged')
          ? 'Ilyra steps close enough that her wine red coat brushes your hand. “Interest survives disagreement,” she says. “Let us see whether it survives a pursuing army.”'
          : 'Ilyra joins the road because the storm question remains open. She makes it clear that your cause and hers overlap. Neither belongs to the other.',
      'Mara points west. Crown banners have appeared beneath the red storm. The army is only one day away, and its soldiers are marching to commands spoken by their dead.',
      has(state, 'c5-royal-witnesses-turned')
        ? 'Sorin and the two royal witnesses take the evidence road with you. The remaining guides carry copies for the Moot.'
        : 'Sorin carries the surviving Dragonspine proof while the other guides take copies back to the town.',
      'Kharad Vey chose neutrality. Protecting that choice may require your largest battle yet.',
    ],
    choices: [],
  },
};
