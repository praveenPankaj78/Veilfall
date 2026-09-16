import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

const destroyedOathFlags = [
  'c9-destroyed-red-moot-authority-oath',
  'c9-destroyed-crown-restitution-oath',
  'c9-destroyed-clan-refusal-oath',
  'c9-destroyed-honest-command-limit-oath',
  'c9-destroyed-unsea-investigation-oath',
  'c8-released-crown-oath',
  'c8-burned-lesser-oath',
];

function expedition(state: GameState) {
  const members = ['Vexa'];
  if (has(state, 'c9-roster-futureless'))
    members.push('Ansel and two Futureless witnesses');
  if (has(state, 'c9-roster-pell'))
    members.push('Pell and his small shield escort');
  else if (has(state, 'c9-roster-wardens'))
    members.push('the mixed wardens and Moot fighters');
  if (has(state, 'c9-roster-crown'))
    members.push('Teren and six Crown volunteers');
  if (has(state, 'c9-mara-crossed-black-gate')) members.push('Mara');
  if (has(state, 'c9-lysara-crossed-black-gate')) members.push('Lysara');
  return members.join(', ');
}

function rosterPosition(state: GameState) {
  if (has(state, 'c9-roster-futureless'))
    return 'Ansel and two Futureless witnesses carry their own names and promise copies. Nobody else may answer for them.';
  if (has(state, 'c9-roster-pell'))
    return 'Pell carries the complete lock map on his uninjured arm. His small shield escort matches his careful pace.';
  if (has(state, 'c9-roster-crown'))
    return 'Teren and six Crown volunteers walk as seven individual choices. No order from the army crossed with them.';
  return 'The mixed wardens and Moot fighters repeat the command limits each accepted at the Gate. Korran remains in Edrath.';
}

function partnerPosition(state: GameState) {
  if (has(state, 'c9-mara-crossed-black-gate'))
    return 'Mara scouts within a shouted answer of the group. She crossed by choice, not because your relationship pulled her through.';
  if (has(state, 'c9-lysara-crossed-black-gate'))
    return 'Lysara walks beside the witness case as an independent envoy. No treaty or relationship term owns her step.';
  if (has(state, 'c9-mara-remained-at-gate'))
    return 'Mara remains at the mortal Gate with the return signal. Her absence is a chosen duty, not a broken relationship.';
  if (has(state, 'c9-lysara-remained-at-gate'))
    return 'Lysara remains in Edrath guarding the evidence. She cannot speak or act on this road.';
  return 'No mortal partner crossed. Ilyra and Rook remain on their own roads, and Korran remains with the Red Moot.';
}

function fragmentCustody(state: GameState) {
  if (has(state, 'c9-route-bargain')) {
    if (has(state, 'c9-cut-true-name-clause'))
      return 'The bargained fragment rests in your open shield case. True-name precision ended after alignment, but the exact return promise still binds you.';
    return 'The bargained fragment rests in your open shield case. Vexa can locate its bearer until neutral return, but her precision reaches nothing else.';
  }
  if (has(state, 'c9-route-theft'))
    return 'The admitted stolen fragment stays visible at your belt. Black cloth makes it burn, so concealment is not a safe option.';
  return 'The surrendered fragment travels inside the public evidence frame. The house’s own attack-material rule keeps that chain visible.';
}

function warningPreparation(state: GameState) {
  if (has(state, 'c9-learned-desire-offer-danger'))
    return 'Before anyone speaks, you teach the pause Vexa warned you about: name the object, read every term, and answer only after a second breath.';
  return 'No one prepared a pause before crossing. The first ordinary want reaches the road before Vexa can explain what the ash will do.';
}

function waterSpeaker(state: GameState) {
  if (has(state, 'c9-roster-futureless')) return 'One Futureless witness';
  if (has(state, 'c9-roster-pell')) return 'One shield escort';
  if (has(state, 'c9-roster-crown')) return 'A Crown volunteer';
  return 'One Moot fighter';
}

function privateAlarm(state: GameState) {
  if (has(state, 'c9-roster-futureless'))
    return 'A cry for help comes from Ansel’s witness line.';
  if (has(state, 'c9-roster-pell'))
    return 'A cry for help comes from Pell’s mapped loop.';
  if (has(state, 'c9-roster-crown'))
    return 'A cry for help comes from Teren’s rear pair.';
  return 'A cry for help comes from the mixed company’s last reply.';
}

function mortalHandoff(state: GameState) {
  if (has(state, 'c8-sacrificed-first-fort'))
    return 'First Fort is gone. No mortal anchor holds the rear road, so the sixth stone starts turning one step early.';
  if (has(state, 'c8-accepted-ash-compact'))
    return 'The Compact fire accepted at the Gate burns white along the rear edge. One Sableglass mark cannot cross it.';
  return 'The united wardens repeat their living call through the Gate seam. The answer keeps one rear stone level.';
}

function armyHandoff(state: GameState) {
  if (has(state, 'c7-gained-full-army'))
    return 'The full Crown March stayed outside under divided commanders. Its supply line reaches the Gate, but no army order reaches this company.';
  if (has(state, 'c7-gained-chosen-company'))
    return 'Your chosen company holds the mortal return line. Their exact signal identifies the real road behind you.';
  return 'No formal army protects the return. The dangerous name you earned makes distant road guards hesitate before testing the group.';
}

function proofHandoff(state: GameState) {
  if (has(state, 'c9-mortal-cell-proved-original'))
    return 'The original Gate ledger lets the Free Ledger match Sableglass cuts to the same physical page.';
  if (has(state, 'c9-mortal-cell-proved-authenticated-copy'))
    return 'The authenticated copy keeps its seal. Its witness threads fail to match an altered route offered by the Free Ledger.';
  if (has(state, 'c9-mortal-cell-proved-living-bark'))
    return 'The living bark curls away from a false Sableglass date and stays flat beside the true opening record.';
  if (has(state, 'c9-mortal-cell-proved-witnesses'))
    return 'The crossing witnesses compare road marks with the openings they saw and reject one false route.';
  if (has(state, 'c9-mortal-cell-proved-forgery-tool'))
    return 'The captured forgery tool leaves the same cut inside a false faction route.';
  if (has(state, 'c9-mortal-cell-proved-new-kit'))
    return 'The destroyed records do not return. The captured assassin kit provides the only mortal route test.';
  if (has(state, 'c8-preserved-original-ledgers'))
    return 'Original Gate ledgers let the Free Ledger match Sableglass cuts to the same physical pages.';
  if (has(state, 'c8-living-copy-of-openings'))
    return 'The living bark curls away from a false Sableglass date and stays flat beside the true opening record.';
  if (has(state, 'c8-many-witnessed-openings'))
    return 'The crossing witnesses compare the road marks with the openings they saw and reject one false route.';
  if (has(state, 'c8-gate-forgery-exposed'))
    return 'The exposed forgery pattern reveals a copied stroke in the faction’s route claim.';
  if (has(state, 'c8-lost-duplicate-records'))
    return 'The destroyed records cannot return. Only the assassin kit and public attack chain can test the route claim.';
  return 'Separate proof copies expose one altered route when the witnesses compare their recorded marks.';
}

function sableglassHandoff(state: GameState) {
  if (
    hasAny(state, [
      'c9-sableglass-proved-by-glove',
      'c9-sableglass-proved-by-source',
    ])
  )
    return 'The collector source proof names the Sableglass checkpoint clerk, who leaves before the company arrives.';
  if (
    hasAny(state, [
      'c9-sableglass-proved-by-ring',
      'c9-sableglass-proved-by-broken-chain',
    ])
  )
    return 'The captured ring and broken chain expose the house method, but no living collector identifies the clerk.';
  if (
    hasAny(state, [
      'c9-sableglass-proved-by-refusal',
      'c9-sableglass-proved-by-freed-names',
    ])
  )
    return 'Freed names and recorded refusal prove the attack purpose. The Free Ledger still has to test the clerk’s identity.';
  return 'The public attack chain proves Sableglass involvement while leaving its roadside collector unnamed.';
}

function partnerOffer(state: GameState, privacy: boolean) {
  if (has(state, 'c9-mara-crossed-black-gate'))
    return privacy
      ? 'Mara receives a sealed offer and reports safe refusal. She keeps its private reason until the shelter.'
      : 'Mara is offered a quiet home if you promise never to choose another traveller over her. You cannot honestly give that promise.';
  if (has(state, 'c9-lysara-crossed-black-gate'))
    return privacy
      ? 'Lysara receives a sealed offer and reports safe refusal. She keeps its private reason until the shelter.'
      : 'Lysara is offered sole control of the Gate if you promise to place Thornweald above every other people. You cannot honestly give that promise.';
  return 'No mortal partner offer appears. Vexa already faced and refused the offer built from her own fear.';
}

function resourcePressure(state: GameState) {
  const notes: string[] = [];
  if (state.stats.health <= 2)
    notes.push('Your wounded shoulder cannot hold a turning stone safely.');
  if (state.stats.resolve <= 1)
    notes.push(
      'The copied voices reach you before your tired focus can sort them.',
    );
  if (state.stats.medicine <= 0)
    notes.push('No Medicine remains for a collapse injury.');
  if (hasAny(state, ['c7-lost-gate-supplies', 'c7-supplies-depleted']))
    notes.push('The lost Gate supplies leave no spare rope or bridge spike.');
  return notes.length
    ? notes
    : [
        'Health, focus, Medicine, and crossing supplies remain ready for one hard rescue.',
      ];
}

function waterResult(state: GameState) {
  if (has(state, 'c10-water-bargain-ended'))
    return 'The empty cup sits on its marked stone. The road took one carried cup and added no later price.';
  if (has(state, 'c10-water-offer-refused'))
    return 'The refused cup has fallen back into loose ash. Silence and desire bound nobody.';
  return 'The water offer still waits without owning an answer.';
}

function routeCustodyResult(state: GameState) {
  if (has(state, 'c10-bargain-custody-used'))
    return 'Vexa’s narrow precision found the fragment across one false fork and touched no other mind, body, or promise.';
  if (has(state, 'c10-theft-custody-used'))
    return 'You named the theft at the toll. The road lost its false ownership claim, while Vexa kept the political debt open.';
  if (has(state, 'c10-exposure-custody-used'))
    return 'The public Sableglass case forced the toll mark to release the evidence frame without payment.';
  return fragmentCustody(state);
}

function rosterOffer(state: GameState) {
  if (has(state, 'c9-roster-futureless'))
    return 'Ash forms a child’s red mitten before Ansel. It offers to restore his promise to stay for his daughter if you guarantee every sold promise will return unchanged.';
  if (has(state, 'c9-roster-pell'))
    return 'Ash forms a painless silver glove before Pell. The offer will heal his hand if you promise the lock map to one devil house forever.';
  if (has(state, 'c9-roster-crown'))
    return 'Seven white discharge papers appear before Teren. They promise every volunteer a safe return if you accept blame for any person who dies.';
  return 'Ash forms open road tokens before the mixed fighters. The offer promises that every clan may leave safely if you command them without limits until Vathis.';
}

function destroyedOathPressure(state: GameState) {
  if (has(state, 'c9-destroyed-red-moot-authority-oath'))
    return 'The road offers you command over Moot fighters without the Red Moot. Korran’s lost magical protection cannot reject it for them.';
  if (has(state, 'c9-destroyed-crown-restitution-oath'))
    return 'The road offers a royal hearing. Your destroyed Oath to bring hidden victims before the Queen can no longer guarantee it.';
  if (has(state, 'c9-destroyed-clan-refusal-oath'))
    return 'The road offers private exits beyond the Moot’s authority. Your destroyed refusal Oath no longer protects that choice.';
  if (has(state, 'c9-destroyed-honest-command-limit-oath'))
    return 'The road offers obedience without questions. You must state every command limit aloud because your old guarantee is gone.';
  if (has(state, 'c9-destroyed-unsea-investigation-oath'))
    return 'The road offers an ancestor answer in Korran’s voice. The investigation Oath that could test the voice is gone.';
  if (has(state, 'c8-released-crown-oath'))
    return 'A Crown badge appears and asks for obedience. The released service Oath stays released, so the badge has no old promise to seize.';
  if (has(state, 'c8-burned-lesser-oath'))
    return 'A Warden whistle appears in the ash. The burned patrol duty does not return, and the whistle cannot pull you from the company.';
  return 'Only duties still within their original terms remain active. The road can price those duties, but it cannot change their wording.';
}

function survivingOaths(state: GameState) {
  const duties: string[] = [];
  if (has(state, 'oath-bring-them-home'))
    duties.push('bring the original escort home alive');
  if (has(state, 'c2-oath-repair-road'))
    duties.push('repair the damaged King’s Road');
  if (has(state, 'c5-oath-carry-vaor-grief'))
    duties.push('hear Vaor’s grief without turning away');
  if (
    has(state, 'c6-oath-recognised-red-moot') &&
    !has(state, 'c9-destroyed-red-moot-authority-oath')
  )
    duties.push('recognise the Red Moot’s living authority');
  if (
    has(state, 'c6-oath-crown-restitution') &&
    !hasAny(state, [
      'c8-released-crown-oath',
      'c9-destroyed-crown-restitution-oath',
    ])
  )
    duties.push('bring hidden Concord victims before the Queen');
  if (
    has(state, 'c6-oath-defends-refusal') &&
    !has(state, 'c9-destroyed-clan-refusal-oath')
  )
    duties.push('defend each clan’s right to refuse Crown control');
  if (
    has(state, 'c6-oath-honest-limit') &&
    !has(state, 'c9-destroyed-honest-command-limit-oath')
  )
    duties.push('claim only the command the Moot granted');
  if (
    has(state, 'c6-oath-investigate-unsea') &&
    !has(state, 'c9-destroyed-unsea-investigation-oath')
  )
    duties.push('test which ancestor voices are conscious');
  if (has(state, 'c7-oath-living-command'))
    duties.push('deny lawful rank to dead officers');
  if (has(state, 'c9-return-promise-owned'))
    duties.push('return the Gate fragment after Malrec’s inside opening stops');
  return duties.length
    ? `Your surviving duties are to ${duties.join('; ')}.`
    : 'No surviving Oath can answer this offer for you.';
}

function vexaStanding(state: GameState) {
  if (has(state, 'c9-vexa-permanent-hostility'))
    return 'Vexa walks beyond sword reach and reports only threats required by the public truce.';
  if (has(state, 'c9-shared-private-night'))
    return 'Vexa speaks her offer before you ask. Last night created trust and knowledge, not fresh consent or obedience.';
  if (has(state, 'c9-vexa-guarded-trust'))
    return 'Vexa’s patrol map marks a black listening post beneath the next arch.';
  if (has(state, 'c9-vexa-adversarial-respect'))
    return 'Vexa names the next trap because her witnessed threat promise requires it. She offers no personal trust.';
  if (has(state, 'c9-vexa-attraction-acknowledged'))
    return 'Attraction remains between you. Vexa states that the feeling accepts no road offer and grants no private access.';
  if (has(state, 'c9-refused-private-connection'))
    return 'Vexa keeps every exchange public and honours the boundary without withholding a route warning.';
  return 'Vexa keeps the measured distance of a foreign guide whose political goal still differs from yours.';
}

function methodResult(state: GameState) {
  if (has(state, 'c10-offer-method-shared'))
    return 'Every offer is spoken into one public ledger. The company moves together, while private wants now have witnesses.';
  if (has(state, 'c10-offer-method-private'))
    return 'Opaque seals protect each private answer. The company knows who is safe, but not what danger each person refused.';
  if (has(state, 'c10-offer-method-oath'))
    return 'Every consenting traveller’s offer circles your shield as a separate ash band. Any person may call their own band back.';
  return 'The company has not chosen how to handle the private offers.';
}

function vaorPosition(state: GameState) {
  if (has(state, 'c9-vaor-gift-proof-guard'))
    return 'Vaor’s willing ember warms only when an acceptance is real. It stays cold beside the false bell.';
  if (has(state, 'c9-vaor-pact-proof-carried'))
    return 'You ask through the pact before using the ember. Vaor agrees only to expose erased truth and protect living people.';
  if (has(state, 'c9-vaor-collateral-released'))
    return 'Vaor’s restored outer flame marks one honest exit condition, then returns beyond the Gate.';
  if (
    hasAny(state, ['c9-stolen-ember-not-used', 'c9-forced-collateral-broken'])
  )
    return 'The stolen ember stays sheathed. Vaor refuses road service, and no flame answers the false bell.';
  return 'No dragonfire answers. The expedition must test the bell through witnesses and stated terms.';
}

function roadDanger(state: GameState) {
  if (has(state, 'c10-listening-ash-broken'))
    return 'Broken listening marks fall behind the company. The road ahead stays solid beneath coordinated feet.';
  if (has(state, 'c10-private-false-alarm-contained'))
    return 'The false alarm stole time but no private seal. One offer bridge now folds faster beneath the rear guard.';
  if (has(state, 'c10-oath-traveller-withdrew'))
    return 'One traveller reclaimed their offer from your shield. The lighter Oath holds, but the loose ash follows that person again.';
  return 'Sableglass listening ash still moves beneath the road and compares every answer it heard.';
}

function factionProof(state: GameState) {
  if (has(state, 'c10-free-ledger-proved-by-shared-record'))
    return 'The roadside devils cut every Sableglass listening mark out of the public ledger without changing a traveller’s words.';
  if (has(state, 'c10-free-ledger-proved-by-private-seals'))
    return 'The roadside devils repair the emergency path while leaving every opaque offer seal closed.';
  if (has(state, 'c10-free-ledger-proved-by-oath-exit'))
    return 'The roadside devils help one traveller withdraw from your Oath, proving they value separate choice over collected power.';
  return 'The roadside devils have not yet proved which law they protect.';
}

function limitsConversation(state: GameState) {
  if (has(state, 'c9-mara-crossed-black-gate'))
    return [
      'Mara sits where both shelter doors remain visible. “I will not promise to wait safely behind while you carry every danger,” she says.',
      'You answer with the limit she deserves. “I will not promise to choose your life over every traveller in my care.” Mara’s jaw tightens, then she nods. “Good. Love me without making other lives disposable.”',
    ];
  if (has(state, 'c9-lysara-crossed-black-gate'))
    return [
      'Lysara leaves her treaty ribbon outside the shelter. “I will not promise obedience to a Crown future,” she says.',
      'You set down the fragment before answering. “I will not promise the Gate to Thornweald alone.” Lysara studies your open hand. “Then we can choose each other without pretending our peoples became one.”',
    ];
  if (!has(state, 'c9-vexa-permanent-hostility'))
    return [
      'Vexa keeps the shelter curtain open. “I will not place you above the survival of the Ash Compact,” she says.',
      'You keep your hand away from hers. “I will not call every bargain between us safe.” Vexa gives one sharp nod. “A useful limit survives desire.”',
    ];
  if (has(state, 'c9-roster-futureless'))
    return [
      'Ansel keeps his ledger between you. “I will not promise that harmed people will follow your command because you protected us once,” he says.',
      'You answer, “I will not promise that command can replace each person’s choice.” He closes the ledger without offering a hand.',
    ];
  if (has(state, 'c9-roster-pell'))
    return [
      'Pell braces his injured hand. “I will not promise to keep walking when the map says the road is wrong,” he says.',
      'You answer, “I will not order your wound to become courage.” He marks a safe stopping place on the map.',
    ];
  if (has(state, 'c9-roster-wardens'))
    return [
      'The lead warden keeps the Moot fighters inside the agreed command line. “We will not promise obedience after the road ends,” she says.',
      'You answer, “I will not turn shared danger into permanent command.” Each fighter repeats the stopping point in their own words.',
    ];
  return [
    'Teren speaks for himself while every volunteer listens. “I will not promise obedience without a stated end,” he says.',
    'You answer, “I will not promise that leadership removes anyone’s right to leave.” The volunteers repeat the limit in their own words.',
  ];
}

function privateRest(state: GameState) {
  if (!hasAny(state, ['c10-rest-with-mara', 'c10-rest-with-lysara'])) return [];
  if (has(state, 'c10-rest-with-mara')) {
    return [
      'Mara asks again after both doors open. You each name what you want and what remains off limits. She pulls you close by the shirt, then waits for your answer before the kiss deepens. You unfasten travel leathers and tend each other’s bruises without turning care into duty. Later, beneath one blanket, she admits the offer promised a quiet house if she abandoned everyone else. Your shared limit makes that false future lose its hold.',
    ];
  }
  return [
    'Lysara asks again with her treaty ribbon and every magical object outside. You both name what you want, what remains off limits, and that either may leave. Her living silk loosens only after your answer. You undress each other slowly, stopping whenever a touch becomes a question. Later, warm beneath the shelter cloth, she admits the offer promised her sole control of the Gate if she left you sleeping. Your shared limit makes that promise useless.',
  ];
}

function endingForMethod(state: GameState) {
  if (has(state, 'c10-offer-method-shared')) return 'c10-ending-shared';
  if (has(state, 'c10-offer-method-private')) return 'c10-ending-private';
  return 'c10-ending-oath';
}

function finalAlliance(state: GameState) {
  if (has(state, 'c10-free-ledger-guide-accepted'))
    return 'The Free Ledger guides you for one price: carry its sealed petition to a public Vathis hearing before giving it to any ruling faction.';
  return 'The Free Ledger remains willing to guide you for its stated petition hearing. You refused, so the company uses the slower public road and owes nothing.';
}

export const chapterTenNodes: Record<string, StoryNode> = {
  'c10-ash-road': {
    id: 'c10-ash-road',
    kicker: 'Chapter Ten',
    title: 'The Ash Road',
    location: 'Inside the Black Gate',
    objective:
      'Bring the exact voluntary expedition to Vathis without letting an automatic offer bind anyone.',
    threat: 'Unknown',
    art: 'ashroadoffer',
    introducesStoryTerms: ['Ash Road', 'Vathis'],
    body: (state) => [
      'A pale road hangs over a red depth. Loose ash streams along its edges toward black towers shaped like open hands.',
      'Vexa points to the distant towers. “Vathis,” she says. “The Ash Road reaches its public gate if the road does not purchase you first.”',
      fragmentCustody(state),
      `You count the expedition aloud: ${expedition(state)}.`,
      rosterPosition(state),
      partnerPosition(state),
      'How do you place the company for its first mile?',
    ],
    choices: [
      {
        id: 'c10-futureless-front-record',
        label: 'Put Ansel and the Futureless at the front record line.',
        detail:
          'Let the people whose promises were sold record every new offer in their own hands.',
        advantage:
          'Create an independent acceptance record before the road can confuse silence with agreement.',
        showIfAllFlags: ['c9-roster-futureless'],
        addFlags: ['c10-futureless-record-line'],
        result:
          'Ansel gives each witness a separate slate. Three hands record the empty road before anyone speaks a want.',
        next: 'c10-water-offer',
      },
      {
        id: 'c10-pell-maps-offer-bridges',
        label: 'Let Pell mark every bridge that returns to this road.',
        detail:
          'Keep his injured hand out of the shield line while using the complete lock map.',
        advantage:
          'Identify one safe exit before any offer asks the company to leave the road.',
        showIfAllFlags: ['c9-roster-pell'],
        addFlags: ['c10-pell-safe-exit-mapped'],
        result:
          'Pell straps the map flat and marks a loop beneath the first arch. His escort closes around his injured side.',
        next: 'c10-water-offer',
      },
      {
        id: 'c10-mixed-company-call-answer',
        label: 'Set a living call and answer for every movement order.',
        detail:
          'Use only the command limits accepted by the mixed wardens and Moot fighters.',
        advantage:
          'Stop copied voices from moving the company without individual replies.',
        showIfAllFlags: ['c9-roster-wardens'],
        hideIfAnyFlags: ['c9-roster-pell'],
        addFlags: ['c10-mixed-call-answer'],
        result:
          'Every fighter chooses a reply and the moment it ends. The road receives no single command it can copy.',
        next: 'c10-water-offer',
      },
      {
        id: 'c10-crown-volunteer-pairs',
        label: 'Pair Teren’s six volunteers by freely chosen watch.',
        detail:
          'Coordinate seven individuals without importing authority over the Crown March.',
        advantage:
          'No private road message can reach one volunteer without a second witness.',
        showIfAllFlags: ['c9-roster-crown'],
        addFlags: ['c10-crown-volunteer-pairs'],
        result:
          'Teren removes his badge again. The six volunteers choose pairs and repeat that no army order crossed the Gate.',
        next: 'c10-water-offer',
      },
    ],
  },

  'c10-water-offer': {
    id: 'c10-water-offer',
    kicker: 'A want becomes an object',
    title: 'The Cup in the Ash',
    location: 'First Mile of the Ash Road',
    objective:
      'Pause the first offer long enough to learn what does and does not accept it.',
    threat: 'Uneasy',
    art: 'ashroadoffer',
    lesson: {
      title: 'Wanting creates an offer, not a bargain',
      body: 'The road may answer a desire with written terms. Silence accepts nothing. A clear yes or the exact accepting action begins the bargain only after its benefit, price, duration, and exit are visible.',
    },
    body: (state) => [
      warningPreparation(state),
      has(state, 'c9-learned-desire-offer-danger')
        ? `${waterSpeaker(state)} says he wants water. Everyone uses the prepared pause. Ash rises without touching him and folds into a clay cup.`
        : `${waterSpeaker(state)} says he wants water. Ash jumps toward his palm. Vexa knocks it onto the road before his fingers close.`,
      'Marks brighten along the rim. The cup offers clean water now. Its price is carrying the empty cup to the third black stone. The bargain ends when the cup returns to that stone.',
      'The cup waits. One market bell rings. Nobody has accepted anything.',
      'How do you prove the waiting offer owns no answer?',
    ],
    choices: [
      {
        id: 'c10-use-prepared-pause',
        label: 'Use the prepared pause and have every traveller remain silent.',
        detail:
          'Apply Vexa’s warning at the Gate before anyone touches the cup.',
        advantage:
          'Prove silence is safe while the whole company learns the same response.',
        showIfAllFlags: ['c9-learned-desire-offer-danger'],
        addFlags: ['c10-prepared-offer-pause'],
        result:
          'Two breaths pass. The cup stays on the road, the second bell remains silent, and no mark appears on any traveller.',
        next: 'c10-water-terms',
      },
      {
        id: 'c10-vexa-demonstrates-silence',
        label: 'Ask Vexa to demonstrate silence with both hands open.',
        detail:
          'Keep the cup untouched while the local guide shows the limit in public.',
        advantage:
          'Learn the rule without binding a traveller, though the company loses time at the first arch.',
        addFlags: ['c10-silence-demonstrated', 'c10-first-arch-delay'],
        result:
          'Vexa kneels beside the cup and says nothing. Ash circles her hands, then falls away. The cup still waits. Nobody has said yes.',
        next: 'c10-water-terms',
      },
      {
        id: 'c10-futureless-test-refusal',
        label: 'Let Ansel state a plain refusal for the record.',
        detail:
          'Use the Futureless witness line to test a spoken no before any bargain.',
        advantage:
          'Prove that a clear refusal dismisses an offer without a hidden price.',
        showIfAllFlags: ['c10-futureless-record-line'],
        addFlags: ['c10-refusal-demonstrated'],
        result:
          'Ansel says, “No.” The water drains through the clay and returns a breath later. His three witness slates remain blank.',
        next: 'c10-water-terms',
      },
    ],
  },

  'c10-water-terms': {
    id: 'c10-water-terms',
    kicker: 'Every term before the answer',
    title: 'One Cup, One Small Price',
    location: 'First Black Stone',
    objective:
      'Test a reversible bargain or refuse it after all terms are visible.',
    threat: 'Low',
    art: 'ashroadoffer',
    body: () => [
      'Vexa turns the cup with one finger but does not lift it. Four marks face the company.',
      'The benefit is one cup of clean water now. The price is carrying the empty cup. The duration ends at the third black stone. Returning the cup there is the exit.',
      'A fifth mark shows acceptance: say, “I accept this cup,” and lift it with the right hand. Drinking, wanting, watching, fear, and silence are not acceptance.',
      'The road cannot add a price after the bargain ends. Which test do you choose?',
    ],
    choices: [
      {
        id: 'c10-accept-water-test',
        label: 'Accept the cup with the exact words and action.',
        detail:
          'Take the water and carry the empty cup only to the stated third stone.',
        advantage:
          'Prove a small bargain can bind and end without hidden expansion.',
        addFlags: ['c10-water-offer-accepted'],
        result:
          'You state the exact acceptance and lift the cup with your right hand. The second bell rings, and clean water fills the clay.',
        next: 'c10-water-exit',
      },
      {
        id: 'c10-refuse-water-test',
        label: 'State a clear refusal and leave the cup untouched.',
        detail: 'Learn the road without accepting even a reversible price.',
        advantage:
          'Prove a complete offer can be refused after every term is understood.',
        addFlags: ['c10-water-offer-refused'],
        result:
          'You say no. The cup holds its shape for one breath, then falls into loose ash without marking your hand.',
        next: 'c10-water-exit',
      },
    ],
  },

  'c10-water-exit': {
    id: 'c10-water-exit',
    kicker: 'A bargain ends where it said',
    title: 'The Third Black Stone',
    location: 'Third Black Stone',
    objective: 'Show the reversible bargain ending without a widened price.',
    threat: 'Uneasy',
    art: 'ashroadoffer',
    body: (state) => [
      has(state, 'c10-water-offer-accepted')
        ? 'The empty cup grows warm as the third black stone comes level with your boot. No other object or person answers it.'
        : 'The third black stone passes beneath your boot. The refused cup does not follow, and no delayed price appears.',
      'Vexa points to one unlit line beneath the exit mark. “A completed bargain may be remembered. It may not be widened.”',
      'The fragment, attraction, fear, and every true name remain outside the cup’s terms.',
      'How do you close the test before the road offers something dangerous?',
    ],
    choices: [
      {
        id: 'c10-return-empty-cup',
        label: 'Return the empty cup to the third stone.',
        detail: 'Perform the stated exit and watch every acceptance mark end.',
        advantage:
          'Gain a witnessed example that later offers cannot rewrite after completion.',
        showIfAllFlags: ['c10-water-offer-accepted'],
        addFlags: ['c10-water-bargain-ended'],
        result:
          'The cup touches the stone and breaks into cool ash. Your hand mark goes dark, and the road adds nothing.',
        next: 'c10-fragment-custody',
      },
      {
        id: 'c10-record-clean-refusal',
        label: 'Record that refusal created no debt or mark.',
        detail: 'Use the untouched third stone as the physical proof.',
        advantage:
          'Give every traveller a tested refusal they can repeat under pressure.',
        showIfAllFlags: ['c10-water-offer-refused'],
        addFlags: ['c10-clean-refusal-recorded'],
        result:
          'The group’s chosen witness checks the stone. It holds no name, mark, or delayed price.',
        next: 'c10-fragment-custody',
      },
    ],
  },

  'c10-fragment-custody': {
    id: 'c10-fragment-custody',
    kicker: 'The old price meets the new road',
    title: 'The Toll That Claims the Fragment',
    location: 'First Offer Bridge',
    objective:
      'Cross the toll without changing the fragment’s recorded custody.',
    threat: 'Rising',
    art: 'ashroadoffer',
    body: (state) => [
      waterResult(state),
      fragmentCustody(state),
      'A white hand rises from the bridge and offers safe passage in exchange for ownership of anything hidden from the road.',
      'You cannot give the fragment away, hide an admitted theft, or let true-name precision widen beyond its witnessed purpose.',
      'Which holding on the fragment defeats the toll?',
    ],
    choices: [
      {
        id: 'c10-use-bargain-custody',
        label: 'Let the witnessed fragment agreement identify only its bearer.',
        detail:
          'Use surviving precision or the visible neutral case without changing the return promise.',
        advantage:
          'Find the real bridge while granting no access to thoughts, desires, or companions.',
        showIfAllFlags: ['c9-route-bargain'],
        addFlags: ['c10-bargain-custody-used'],
        result:
          'The fragment points to one solid bridge. Vexa’s precision stops at the case, and the toll hand closes on empty air.',
        next: 'c10-roster-offer',
      },
      {
        id: 'c10-name-theft-at-toll',
        label: 'Hold the stolen fragment in view and name the theft again.',
        detail:
          'Preserve the admitted political debt while denying that hidden property exists.',
        advantage:
          'Remove the toll’s ownership claim without accepting a new bargain.',
        showIfAllFlags: ['c9-route-theft'],
        addFlags: ['c10-theft-custody-used'],
        result:
          'You raise the hot fragment and call it stolen. The white hand cannot claim a hidden object and sinks through the bridge.',
        next: 'c10-roster-offer',
      },
      {
        id: 'c10-use-public-exposure-custody',
        label: 'Send the evidence frame through under the house’s own attack-material rule.',
        detail:
          'Use the public surrender record without granting the toll a new ownership claim.',
        advantage:
          'Force the bridge to recognise the fragment as exposed attack evidence.',
        showIfAllFlags: ['c9-route-exposure'],
        addFlags: ['c10-exposure-custody-used'],
        result:
          'The public chain brightens. The toll hand releases the frame because Sableglass law already surrendered its claim.',
        next: 'c10-roster-offer',
      },
    ],
  },

  'c10-roster-offer': {
    id: 'c10-roster-offer',
    kicker: 'A price built for one traveller',
    title: 'What You Cannot Promise Them',
    location: 'First Offer Bridge',
    objective:
      'Keep this company from accepting an impossible promise.',
    threat: 'Immediate',
    art: 'privateoffers',
    body: (state) => [
      routeCustodyResult(state),
      rosterOffer(state),
      'The benefit is clear and the price is visible. The price still asks you to guarantee a life, future, body, command, or freedom that belongs to someone else.',
      'Which protection does the recorded expedition use?',
    ],
    choices: [
      {
        id: 'c10-futureless-record-impossible-price',
        label: 'Let all three Futureless record the impossible guarantee.',
        detail:
          'Use independent witnesses instead of asking Ansel to trust your refusal alone.',
        advantage:
          'Preserve public proof that no one can promise every stolen future back unchanged.',
        showIfAllFlags: ['c9-roster-futureless'],
        addFlags: ['c10-roster-offer-answered-futureless'],
        result:
          'Three slates record the same price. Ansel refuses for himself, and the red mitten loses one finger of ash.',
        next: 'c10-old-oath-price',
      },
      {
        id: 'c10-pell-maps-offer-exit',
        label: 'Use Pell’s map to locate the offer’s real exit.',
        detail:
          'Keep Pell out of the running fight while his escort holds the map flat.',
        advantage:
          'Reach the safe return loop without promising his map or injured hand.',
        showIfAllFlags: ['c9-roster-pell'],
        addFlags: ['c10-roster-offer-answered-pell'],
        result:
          'Pell marks the loop with his good hand. The silver glove follows the ink, reaches its own exit, and falls apart.',
        next: 'c10-old-oath-price',
      },
      {
        id: 'c10-mixed-fighters-answer-individually',
        label: 'Have every mixed fighter repeat their own command limit.',
        detail:
          'Use the exact consent recorded at the Gate without borrowing Korran’s absent authority.',
        advantage:
          'Break the offer into personal choices that no unlimited command can collect.',
        showIfAllFlags: ['c9-roster-wardens'],
        hideIfAnyFlags: ['c9-roster-pell'],
        addFlags: ['c10-roster-offer-answered-mixed'],
        result:
          'Each fighter names the order they accepted and the moment it ends. The open road tokens split and return to ash.',
        next: 'c10-old-oath-price',
      },
      {
        id: 'c10-crown-volunteers-refuse-safe-return',
        label: 'Let Teren and all six volunteers refuse as individuals.',
        detail:
          'Keep Caelan from accepting blame or safety on behalf of seven adults.',
        advantage:
          'Preserve individual command and expose any copied reply among the seven.',
        showIfAllFlags: ['c9-roster-crown'],
        addFlags: ['c10-roster-offer-answered-crown'],
        result:
          'Seven refusals sound in seven voices. One false eighth answer echoes from below the bridge and reveals the listening ash.',
        next: 'c10-old-oath-price',
      },
      {
        id: 'c10-let-roster-keep-offer-private',
        label:
          'Let each targeted traveller keep the offer unread by the group.',
        detail:
          'Protect privacy while accepting that one listening mark may follow an unseen answer.',
        advantage:
          'Nobody must expose the desire used against them before choosing a later method.',
        addFlags: [
          'c10-roster-offer-kept-private',
          'c10-listening-mark-following',
        ],
        result:
          'Each traveller closes their own offer. The ash objects fade, but one black mark slips beneath the road unseen.',
        next: 'c10-old-oath-price',
      },
    ],
  },

  'c10-old-oath-price': {
    id: 'c10-old-oath-price',
    kicker: 'Old duties have visible prices',
    title: 'The Promise the Road Remembers',
    location: 'Ash Road Listening Arch',
    objective:
      'Use or protect surviving Oaths without restoring a destroyed one.',
    threat: 'Rising',
    art: 'privateoffers',
    body: (state) => [
      destroyedOathPressure(state),
      survivingOaths(state),
      'Each surviving promise appears as a warm line on your shield. Beside it, the road writes the person or community harmed by a breach.',
      'The Harrowfen pursuit and Mileless Bridge duties ended with those dangers. A completed Oath cannot become power or payment again. A destroyed or released Oath leaves only a cold scar.',
      'What do you expose to keep the road from imitating your duties?',
    ],
    choices: [
      {
        id: 'c10-speak-surviving-oath-limits',
        label: 'Speak every surviving Oath with its current limit.',
        detail:
          'Expose your duties to the company so the road cannot widen them in secret.',
        advantage:
          'Make copied promises visibly fail, while giving up privacy about every active duty.',
        addFlags: ['c10-surviving-oaths-public'],
        result:
          'Warm lines rise from the shield one at a time. Each stops at its spoken limit, while two copied lines crack beyond them.',
        next: 'c10-vexa-offer',
      },
      {
        id: 'c10-name-destroyed-oath-loss',
        label:
          'Name the exact protection already lost before the road sells it back.',
        detail:
          'Acknowledge the harmed person or community without treating the destroyed Oath as fuel.',
        advantage:
          'Prevent one false restoration from becoming an accepted replacement.',
        showIfAnyFlags: destroyedOathFlags,
        addFlags: ['c10-destroyed-oath-loss-faced'],
        result:
          'The cold scar stays cold. The road’s imitation loses its voice when the company hears who already paid for that loss.',
        next: 'c10-vexa-offer',
      },
      {
        id: 'c10-keep-oaths-private',
        label:
          'Keep the surviving Oaths private and answer only the present offer.',
        detail:
          'Protect old duties from public inspection while leaving copied wording harder to detect.',
        advantage: 'Preserve privacy for people named inside earlier promises.',
        addFlags: ['c10-surviving-oaths-private', 'c10-copy-risk-active'],
        result:
          'You cover the warm lines. The road loses their names, while one copied promise keeps moving beneath the shield rim.',
        next: 'c10-vexa-offer',
      },
    ],
  },

  'c10-vexa-offer': {
    id: 'c10-vexa-offer',
    kicker: 'The guide receives her own price',
    title: 'A Realm Kept Separate',
    location: 'Ash Road Listening Arch',
    objective: 'Respond when the road prices Vexa’s fear of realm merger.',
    threat: 'Uneasy',
    art: 'privateoffers',
    body: (state) => [
      vexaStanding(state),
      'Ash forms a clear wall around Vexa. It offers permanent safety for the Ash Compact if she gives the road every private border between devil minds.',
      'The price would save her faction by destroying the law that keeps its members separate people. It is the same ruin Malrec’s merger would cause.',
      'Vexa’s true-name knowledge, attraction, fear, and history with you accept nothing. Her hand stays open beside the wall.',
      'Vexa asks, “Will you witness my answer without making it yours?”',
    ],
    choices: [
      {
        id: 'c10-let-vexa-speak-offer-first',
        label: 'Let Vexa state and refuse her own offer before you act.',
        detail: 'Trust her to protect the boundary that defines her people.',
        advantage:
          'Gain her complete reading of the listening wall without taking her choice.',
        hideIfAnyFlags: ['c9-vexa-permanent-hostility'],
        addFlags: ['c10-vexa-refused-own-offer'],
        result:
          'Vexa reads every mark, says no, and walks through the wall. It breaks around the shape of one person who chose herself.',
        next: 'c10-defining-method',
      },
      {
        id: 'c10-hold-public-truce-line',
        label: 'Hold the armed public line while Vexa refuses alone.',
        detail:
          'Keep faith with the hostile truce without asking for trust or private access.',
        advantage: 'Block Sableglass ash from striking during her refusal.',
        showIfAllFlags: ['c9-vexa-permanent-hostility'],
        addFlags: ['c10-vexa-hostile-truce-held'],
        result:
          'You turn your shield toward the road and your face away from her answer. Vexa refuses, then reports the next danger in exact truce language.',
        next: 'c10-defining-method',
      },
      {
        id: 'c10-record-vexa-boundary-publicly',
        label:
          'Ask whether Vexa wants her refusal entered in the public record.',
        detail:
          'Offer a witness without treating attention, attraction, or earlier intimacy as permission.',
        advantage:
          'Create proof that an anti-merger devil chose individual limits over faction safety.',
        hideIfAnyFlags: ['c9-vexa-permanent-hostility'],
        addFlags: ['c10-vexa-boundary-witnessed'],
        result:
          'Vexa says yes to the record and no to the wall. An expedition witness writes both answers separately.',
        next: 'c10-defining-method',
      },
    ],
  },

  'c10-defining-method': {
    id: 'c10-defining-method',
    kicker: 'One freedom, three protections',
    title: 'How the Company Answers',
    location: 'Ash Road Split',
    objective:
      'Choose how the expedition will handle every remaining private offer.',
    threat: 'Rising',
    art: 'privateoffers',
    body: (state) => [
      'Three paths appear only after the company sees Vexa refuse. None asks the road to choose for another person.',
      has(state, 'c10-roster-offer-kept-private')
        ? 'The first offers remain private. One hidden listening mark makes coordination harder, but opening those offers is still each traveller’s choice.'
        : 'The first offer left enough public evidence to identify how Sableglass listens across the road.',
      'Shared offers would expose painful wants and make secret changes easy to catch. Private seals would protect each person and weaken the common picture.',
      'A new Oath could carry temptations only after every named traveller hears its scope, breach, end, and personal right to withdraw.',
      'Which freedom will guide the company to Vathis?',
    ],
    choices: [
      {
        id: 'c10-choose-shared-offers',
        label: 'Keep the company together by sharing every offer.',
        detail:
          'Make each benefit and price public before anyone answers. Private desires will be exposed.',
        advantage:
          'Catch secret substitutions and coordinate one protection for the whole company.',
        addFlags: ['c10-offer-method-shared'],
        result:
          'Every traveller chooses a place in one circle. Blank pages wait for offers, prices, refusals, and accepted terms.',
        next: 'c10-shared-offers',
      },
      {
        id: 'c10-choose-private-offers',
        label: 'Let each person negotiate behind a private seal.',
        detail:
          'Report safety and acceptance status only. Full terms remain with the person who received them.',
        advantage:
          'Protect each person’s own terms from both the company and the road.',
        addFlags: ['c10-offer-method-private'],
        result:
          'Vexa raises separate ash screens with two open exits each. Every traveller chooses a witness outside hearing range.',
        next: 'c10-private-offers',
      },
      {
        id: 'c10-propose-burden-oath',
        label:
          'Propose the exact Oath that carries only consenting temptations.',
        detail:
          'Each traveller may agree, refuse, or withdraw. A breach returns every carried offer to Caelan at once.',
        advantage:
          'Keep the company moving together while offers remain separate and visible on your shield.',
        addFlags: ['c10-offer-method-oath-proposed'],
        result:
          'You speak the full scope, duration, success, breach, and exit. No ash band moves until every traveller answers for themselves.',
        next: 'c10-oath-consent',
      },
    ],
  },

  'c10-shared-offers': {
    id: 'c10-shared-offers',
    kicker: 'Coordination costs privacy',
    title: 'Every Price Spoken',
    location: 'Shared Circle on the Ash Road',
    objective:
      'Expose the offers without letting public pain become public ownership.',
    threat: 'Immediate',
    art: 'privateoffers',
    body: (state) => [
      rosterOffer(state),
      partnerOffer(state, false),
      partnerPosition(state),
      'Each traveller speaks only their own benefit and price. Nobody explains the desire for them.',
      'The common ledger catches two Sableglass words hidden beneath different offers. Sharing buys a clean warning, but the company now knows where each person hurts.',
      'How do you limit that exposure?',
    ],
    choices: [
      {
        id: 'c10-share-terms-not-reasons',
        label: 'Record each term while leaving the reason private.',
        detail:
          'Share enough for protection without demanding why an offer hurts.',
        advantage:
          'Break the Sableglass substitution and limit the lasting privacy cost.',
        addFlags: [
          'c10-offer-method-shared',
          'c10-shared-terms-only',
          'c10-listening-ash-broken',
        ],
        result:
          'The ledger holds benefits and prices, never motives. Matching Sableglass words blacken and peel from every page.',
        next: 'c10-listening-ash',
      },
      {
        id: 'c10-share-complete-offers',
        label: 'Record every offered image and reason with permission.',
        detail:
          'Gain the strongest shared warning while exposing painful private desires inside the company.',
        advantage:
          'Reveal every listening mark and prevent a second hidden offer before Vathis.',
        addFlags: [
          'c10-offer-method-shared',
          'c10-shared-complete-offers',
          'c10-listening-ash-broken',
          'c10-private-desires-exposed',
        ],
        result:
          'Each person gives permission before a full entry. The last hidden mark crawls into view and cracks, while several eyes avoid one another.',
        next: 'c10-listening-ash',
      },
    ],
  },

  'c10-private-offers': {
    id: 'c10-private-offers',
    kicker: 'Privacy costs a common picture',
    title: 'Seals Kept Closed',
    location: 'Private Alcoves beside the Ash Road',
    objective:
      'Protect private choices while creating one safe coordination signal.',
    threat: 'Immediate',
    art: 'privateoffers',
    body: (state) => [
      'Opaque ash screens rise with two open exits each. A traveller reports only safe, refused, or accepted.',
      has(state, 'c10-prepared-offer-pause')
        ? 'The prepared pause gives everyone time to test the same emergency phrase without opening a seal.'
        : 'The first-arch delay leaves less time to test an emergency phrase before the road begins to split.',
      privateAlarm(state),
      partnerOffer(state, true),
      'Nobody can compare the hidden terms.',
      'How do you protect privacy and answer the possible emergency?',
    ],
    choices: [
      {
        id: 'c10-use-prepared-private-signal',
        label: 'Use the prepared pause phrase without opening any seal.',
        detail:
          'Match the exact words taught before the first offer and ignore copied urgency.',
        advantage:
          'Identify the false alarm while preserving every private bargain.',
        showIfAllFlags: ['c10-prepared-offer-pause'],
        addFlags: [
          'c10-offer-method-private',
          'c10-private-seals-kept',
          'c10-private-false-alarm-contained',
        ],
        result:
          'The real company repeats the pause phrase. The unmatched cry breaks into Sableglass ash without opening a single seal.',
        next: 'c10-listening-ash',
      },
      {
        id: 'c10-rally-private-groups',
        label:
          'Spend 1 Command to reunite the private groups at the road line.',
        detail:
          'Spend 1 Command. Keep every seal closed while surrendering distance gained toward Vathis.',
        advantage:
          'Bring the complete expedition together before the false path closes.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: [
          'c10-offer-method-private',
          'c10-private-seals-kept',
          'c10-private-false-alarm-contained',
          'c10-private-route-delay',
        ],
        result:
          'You call only positions and exits. Every group returns with its seal closed before the false path folds away.',
        next: 'c10-listening-ash',
      },
      {
        id: 'c10-let-private-groups-return-slowly',
        label: 'Let each private group return by its own tested exit.',
        detail:
          'Spend no resource and preserve privacy while the road gains time to move one bridge.',
        advantage:
          'Keep every person and seal under their own control at the cost of a harder crossing.',
        addFlags: [
          'c10-offer-method-private',
          'c10-private-seals-kept',
          'c10-private-false-alarm-contained',
          'c10-offer-bridge-accelerated',
        ],
        result:
          'Each group returns through its chosen exit. No seal opens, but the rear bridge begins folding twice as fast.',
        next: 'c10-listening-ash',
      },
    ],
  },

  'c10-oath-consent': {
    id: 'c10-oath-consent',
    kicker: 'Permission before power',
    title: 'Every Name Answers',
    location: 'Ash Road Split',
    objective:
      'Bind no traveller who has not said yes to the burden Oath.',
    threat: 'Rising',
    art: 'privateoffers',
    lesson: {
      title: 'The burden never owns the traveller',
      body: 'The Oath carries only offers from people who say yes. Each person may refuse or withdraw without leaving the company. Caelan may not accept or hide an offer for anyone else.',
    },
    body: (state) => [
      'You repeat the Oath. It names each consenting traveller, the Ash Road, Vathis entry, individual withdrawal, and the breach that returns every offer to you.',
      rosterPosition(state),
      partnerPosition(state),
      partnerOffer(state, true),
      vaorPosition(state),
      'Each person must answer separately. One refusal removes only that person from the Oath and changes no place in the company.',
      'Do you accept every answer and bind only the people who say yes?',
    ],
    choices: [
      {
        id: 'c10-bind-consenting-offers',
        label: 'Accept each separate answer and bind only consenting offers.',
        detail:
          'Carry the named temptations until Vathis or individual withdrawal. Never answer for another person.',
        advantage:
          'Move the company together while every carried offer remains separate and visible.',
        changes: { oathfire: 1 },
        addFlags: [
          'c10-offer-method-oath',
          'c10-burden-oath-active',
          'c10-burden-oath-explicit-consent',
        ],
        result:
          'Each yes draws one ash band around your shield. Each no stays with its speaker. No band touches a person who refused.',
        next: 'c10-listening-ash',
      },
      {
        id: 'c10-withdraw-oath-proposal',
        label: 'Withdraw the proposal before any Oath binds.',
        detail:
          'Treat hesitation as no and return to protected private negotiation.',
        advantage:
          'Keep every traveller’s own yes without creating a partial or pressured Oath.',
        addFlags: [
          'c10-offer-method-private',
          'c10-burden-oath-withdrawn',
          'c10-private-seals-kept',
        ],
        result:
          'You close your hand before Oathfire rises. The proposed words own nothing, and Vexa raises private screens with open exits.',
        next: 'c10-listening-ash',
      },
    ],
  },

  'c10-listening-ash': {
    id: 'c10-listening-ash',
    kicker: 'Sableglass compares the answers',
    title: 'The Road Beneath the Road',
    location: 'Ash Road Split',
    objective:
      'Stop listening ash from turning the chosen freedom into a trap.',
    threat: 'Immediate',
    art: 'privateoffers',
    body: (state) => [
      methodResult(state),
      vaorPosition(state),
      'Black ash rises under the pale stones. It carries a six-finger Sableglass mark and repeats accepted words without their limits.',
      'The copied offer tries to send half the company toward a false Vathis gate. Which part of your chosen method stops it?',
    ],
    choices: [
      {
        id: 'c10-shared-ledger-breaks-copy',
        label: 'Read the shared limits together until the copied words break.',
        detail:
          'Use the public coordination already purchased with private exposure.',
        advantage:
          'Destroy the listening ash before it can divide the company.',
        showIfAllFlags: ['c10-offer-method-shared'],
        addFlags: ['c10-listening-ash-broken'],
        result:
          'Every voice reaches the limit at the same word. The false offer cannot copy the boundary and breaks across the road.',
        next: 'c10-road-danger',
      },
      {
        id: 'c10-private-status-check',
        label: 'Use only the private safety signal and keep every seal closed.',
        detail:
          'Accept one slower bridge while refusing to expose confidential terms.',
        advantage:
          'Bring every person onto the real road without surrendering privacy.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c10-private-false-alarm-contained'],
        result:
          'Safe, refused, or accepted returns from every group. The false gate lacks the signal and folds into the red depth.',
        next: 'c10-road-danger',
      },
      {
        id: 'c10-spend-oathfire-on-carried-offers',
        label: 'Spend 1 Oathfire to hold every copied offer on the shield.',
        detail:
          'Spend 1 Oathfire. Use the consensual burden while keeping each temptation separate and visible.',
        advantage:
          'Stop the false gate without returning pressure to any consenting traveller.',
        showIfAllFlags: ['c10-offer-method-oath'],
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c10-oath-copy-contained'],
        result:
          'Oathfire fixes every ash band to its named place. The copied offer strikes the shield and loses all borrowed voices.',
        next: 'c10-road-danger',
      },
      {
        id: 'c10-let-one-traveller-withdraw',
        label: 'Let one traveller withdraw and take back only their offer.',
        detail:
          'Spend no Oathfire. Keep the company together while reducing the burden’s protection.',
        advantage:
          'Prove the exit condition works and break the copied group claim.',
        showIfAllFlags: ['c10-offer-method-oath'],
        addFlags: ['c10-oath-traveller-withdrew'],
        result:
          'One traveller speaks their name and calls back one ash band. The group-shaped copy tears because the Oath never owned everyone.',
        next: 'c10-road-danger',
      },
    ],
  },

  'c10-road-danger': {
    id: 'c10-road-danger',
    kicker: 'The bridge folds under the rear guard',
    title: 'Six Steps of Falling Stone',
    location: 'Broken Offer Bridge',
    objective: 'Bring this company off the collapsing bridge.',
    threat: 'Critical',
    art: 'privateoffers',
    body: (state) => [
      roadDanger(state),
      mortalHandoff(state),
      armyHandoff(state),
      ...resourcePressure(state),
      'Six pale stones tilt toward the red depth. The rear traveller has six steps before the last stone turns vertical.',
      rosterPosition(state),
      'A black-robed devil on the far side cuts Sableglass marks from the landing instead of attacking. The stranger leaves one clear rope tied to solid stone.',
      'How do you get the rear guard across?',
    ],
    choices: [
      {
        id: 'c10-use-contained-oath-crossing',
        label: 'Use the contained offer bands as six fixed handholds.',
        detail:
          'Spend no further Oathfire after paying to contain the copied offers.',
        advantage:
          'Move the entire exact roster across before the sixth stone turns.',
        showIfAllFlags: ['c10-oath-copy-contained'],
        addFlags: ['c10-exact-roster-crossed-bridge', 'c10-road-danger-ended'],
        result:
          'Six ash bands hold six clear positions. Every traveller crosses before the last stone turns vertical.',
        next: 'c10-free-ledger',
      },
      {
        id: 'c10-use-roster-crossing-drill',
        label:
          'Use the expedition’s prepared call, map, record, or watch pairs.',
        detail:
          'Save the whole company through the exact formation chosen at the Gate and first mile.',
        advantage:
          'Bring every recorded traveller across while preserving Caelan’s Health.',
        showIfAnyFlags: [
          'c10-futureless-record-line',
          'c10-pell-safe-exit-mapped',
          'c10-mixed-call-answer',
          'c10-crown-volunteer-pairs',
        ],
        addFlags: ['c10-exact-roster-crossed-bridge', 'c10-road-danger-ended'],
        result:
          'The prepared signal moves person by person. The final boot leaves the sixth stone before it turns into the depth.',
        next: 'c10-free-ledger',
      },
      {
        id: 'c10-hold-folding-stone',
        label: 'Hold the sixth stone while the rear guard crosses.',
        detail:
          'Spend 1 Health to keep the bridge level long enough for people and proof.',
        advantage:
          'Save every traveller and preserve the stranger’s rope for the road ahead.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: [
          'c10-exact-roster-crossed-bridge',
          'c10-free-ledger-rope-saved',
          'c10-road-danger-ended',
        ],
        result:
          'Your shoulder locks beneath the turning stone. Every traveller crosses, and the stranger’s rope remains tied when you roll clear.',
        next: 'c10-free-ledger',
      },
    ],
  },

  'c10-free-ledger': {
    id: 'c10-free-ledger',
    kicker: 'Devils cut a devil trap',
    title: 'The People of the Open Page',
    location: 'Free Ledger Road Shelter',
    objective:
      'Learn why roadside devils oppose Sableglass and Malrec’s merger.',
    threat: 'Uneasy',
    art: 'vathisapproach',
    introducesStoryTerms: ['Free Ledger'],
    body: (state) => [
      'The black-robed stranger presses an empty page against the road. Each Sableglass mark sticks to the page, then burns without touching a traveller’s offer.',
      'Three more devils step from the shelter. Each wears a separate name mark and keeps one hand uncovered. The first calls them the Free Ledger only after every listening mark is gone.',
      '“Malrec promises one world,” she says. “One world makes every desire common property. We would lose the borders that let one devil refuse another.”',
      methodResult(state),
      proofHandoff(state),
      sableglassHandoff(state),
      'How does the company test that this faction protects separate choice?',
    ],
    choices: [
      {
        id: 'c10-test-free-ledger-with-shared-record',
        label: 'Let the Free Ledger remove marks from the shared record only.',
        detail:
          'Keep every traveller’s words unchanged while testing the public method.',
        advantage:
          'Prove the faction can oppose Sableglass without rewriting a spoken offer.',
        showIfAllFlags: ['c10-offer-method-shared'],
        addFlags: ['c10-free-ledger-proved-by-shared-record'],
        result:
          'The devils cut black marks from the page margins. Every traveller’s chosen words remain in the same hand and order.',
        next: 'c10-limits',
      },
      {
        id: 'c10-test-free-ledger-with-private-seals',
        label: 'Ask the Free Ledger to repair the road without opening a seal.',
        detail:
          'Make protected privacy the test of its opposition to Sableglass.',
        advantage:
          'Keep every private offer confidential while restoring a safe company path.',
        showIfAllFlags: ['c10-offer-method-private'],
        addFlags: ['c10-free-ledger-proved-by-private-seals'],
        result:
          'The devils rebuild the pale edge around each group. No opaque seal opens, changes hands, or gains a new mark.',
        next: 'c10-limits',
      },
      {
        id: 'c10-test-free-ledger-with-oath-exit',
        label: 'Ask the Free Ledger to witness one voluntary Oath withdrawal.',
        detail:
          'Test whether the faction protects a traveller leaving shared magical protection.',
        advantage:
          'Prove it values individual exit over the power of Caelan’s burden Oath.',
        showIfAllFlags: ['c10-offer-method-oath'],
        addFlags: ['c10-free-ledger-proved-by-oath-exit'],
        result:
          'One traveller calls back their ash band. The Free Ledger records the exit and refuses to sell the abandoned protection back.',
        next: 'c10-limits',
      },
    ],
  },

  'c10-limits': {
    id: 'c10-limits',
    kicker: 'Promises love cannot require',
    title: 'Two Open Shelter Doors',
    location: 'Free Ledger Road Shelter',
    objective: 'State what neither person will promise before the final road.',
    threat: 'Low',
    art: 'vathisapproach',
    body: (state) => [
      factionProof(state),
      'The last road danger has passed. Every offer object stays outside beneath separate guards, and both shelter doors remain open.',
      ...limitsConversation(state),
      'The road waits beyond the shelter, ready to use any promise spoken too widely. How do you answer the limits?',
    ],
    choices: [
      {
        id: 'c10-respect-mutual-limits',
        label: 'Accept both limits without asking for proof of devotion.',
        detail:
          'Keep care, duty, and political loyalty separate where each person set them.',
        advantage:
          'Weaken the matching private temptation before the final Vathis offer.',
        addFlags: ['c10-limits-respected'],
        result:
          'You repeat both limits without changing a word. The matching offer outside loses its bright edge and falls flat.',
        next: 'c10-rest-choice',
      },
      {
        id: 'c10-keep-limits-to-command',
        label: 'Keep the agreement to public command and separate rest.',
        detail:
          'Respect every refusal without opening a private or romantic promise.',
        advantage:
          'Create a complete platonic boundary that no later offer can call unfinished.',
        addFlags: ['c10-limits-public-only'],
        result:
          'The limits enter the company record without a private vow. Both shelter doors stay open, and nobody follows you inside.',
        next: 'c10-rest-choice',
      },
    ],
  },

  'c10-rest-choice': {
    id: 'c10-rest-choice',
    kicker: 'A new answer after every old one',
    title: 'Rest Without a Price',
    location: 'Free Ledger Road Shelter',
    objective:
      'Choose intimacy, conversation, or separate rest after all pressure ends.',
    threat: 'Low',
    art: 'vathisapproach',
    body: (state) => [
      'The company has crossed the broken bridge. No bargain is being negotiated, no offer object remains inside, and either shelter door opens with one hand.',
      has(state, 'c9-mara-crossed-black-gate')
        ? 'Mara asks whether you want closeness, conversation, or separate sleep. Earlier intimacy and present commitment answer nothing for tonight.'
        : has(state, 'c9-lysara-crossed-black-gate')
          ? 'Lysara asks whether you want closeness, conversation, or separate sleep. Her crossing and your relationship answer nothing for tonight.'
          : 'No committed partner who crossed asks for intimacy. Conversation and separate rest remain complete choices.',
      'What do you choose before the final march?',
    ],
    choices: [
      {
        id: 'c10-rest-with-mara',
        label: 'Choose renewed intimacy with Mara after stating limits again.',
        detail:
          'Both adults answer freely with open exits, no active offer, and no conflicting commitment.',
        advantage:
          'Learn the quiet-house temptation and deepen trust without changing the route.',
        showIfAllFlags: [
          'c9-mara-crossed-black-gate',
          'c10-limits-respected',
          'c10-road-danger-ended',
        ],
        showIfRelationshipIntents: { mara: ['committed'] },
        addFlags: ['c10-rest-with-mara', 'c10-partner-temptation-known'],
        result:
          'You both restate the limits and choose closeness. The doors remain unlocked, and either answer may still stop the scene.',
        next: 'c10-guide-bargain',
      },
      {
        id: 'c10-rest-with-lysara',
        label:
          'Choose renewed intimacy with Lysara after stating limits again.',
        detail:
          'Both adults answer freely with open exits, no active offer, and no conflicting commitment.',
        advantage:
          'Learn the sole-control temptation and deepen trust without changing the route.',
        showIfAllFlags: [
          'c9-lysara-crossed-black-gate',
          'c10-limits-respected',
          'c10-road-danger-ended',
        ],
        showIfRelationshipIntents: { lysara: ['committed'] },
        addFlags: ['c10-rest-with-lysara', 'c10-partner-temptation-known'],
        result:
          'You both restate the limits and choose closeness. Every treaty ribbon and magical object remains outside.',
        next: 'c10-guide-bargain',
      },
      {
        id: 'c10-share-shelter-conversation',
        label: 'Share the shelter for conversation only.',
        detail:
          'Keep the stated limits and ask what offer remains most dangerous.',
        advantage:
          'Learn one temptation without creating physical or romantic consent.',
        showIfAllFlags: ['c9-no-mortal-partner-crossed'],
        hideIfAnyFlags: ['c9-vexa-permanent-hostility'],
        addFlags: ['c10-shelter-conversation', 'c10-partner-temptation-known'],
        result:
          'You share water and words. No touch or promise is assumed, and the most dangerous offer gains a plain name.',
        next: 'c10-guide-bargain',
      },
      {
        id: 'c10-rest-apart',
        label: 'Rest apart and keep the shelter boundary public.',
        detail:
          'End the quiet scene without intimacy, private disclosure, or relationship penalty.',
        advantage:
          'Keep a rested watch and preserve every personal boundary before Vathis.',
        addFlags: ['c10-rested-apart'],
        result:
          'You take the outer watch. The other shelter remains private, and morning changes no relationship by assumption.',
        next: 'c10-guide-bargain',
      },
    ],
  },

  'c10-guide-bargain': {
    id: 'c10-guide-bargain',
    kicker: 'A faction offers a measured road',
    title: 'The Petition Price',
    location: 'Final Rise before Vathis',
    objective: 'Accept or refuse the Free Ledger’s complete guide bargain.',
    threat: 'Rising',
    art: 'vathisapproach',
    body: (state) => [
      ...privateRest(state),
      factionProof(state),
      'At sunrise, the Free Ledger places a sealed petition beside a marked path. Its guide will pass one faction checkpoint and identify the engine district from outside.',
      'The price is one public Vathis hearing for the petition’s named signers before you give it to any ruling faction. The bargain lasts until that hearing.',
      'Caelan and one expedition witness must press separate marks to accept. Either side may withdraw before the city gate. Withdrawal closes the guide path and leaves no hearing owed.',
      'The terms grant no service, loyalty, true-name access, intimacy, or fragment custody. What answer do you give?',
    ],
    choices: [
      {
        id: 'c10-accept-free-ledger-guide',
        label: 'Accept the guide and exact public-hearing price.',
        detail:
          'Carry the sealed petition and hear its named signers before giving it to any Vathis ruler.',
        advantage:
          'Pass one faction checkpoint and identify Malrec’s engine district from outside.',
        addFlags: [
          'c10-free-ledger-offered-help',
          'c10-free-ledger-guide-accepted',
          'c10-free-ledger-petition-owed',
          'c10-reached-vathis',
        ],
        result:
          'You and one expedition witness press separate marks. The petition stays sealed, and one pale path opens toward Vathis.',
        next: endingForMethod,
      },
      {
        id: 'c10-refuse-free-ledger-guide',
        label: 'Refuse the guide and take the slower public road.',
        detail:
          'Carry no petition duty while preserving the faction’s complete offer for the record.',
        advantage: 'Reach Vathis owing no new hearing, service, or access.',
        addFlags: [
          'c10-free-ledger-offered-help',
          'c10-free-ledger-guide-refused',
          'c10-reached-vathis',
        ],
        result:
          'You say no before either mark touches the page. The guide path closes, and the company takes the longer public rise.',
        next: endingForMethod,
      },
    ],
  },

  'c10-ending-shared': {
    id: 'c10-ending-shared',
    kicker: 'Chapter Ten complete',
    title: 'Every Price Spoken',
    location: 'Public Gate of Vathis',
    objective: 'Find which Vathis faction controls Malrec’s engine.',
    threat: 'Unknown',
    art: 'vathisapproach',
    final: true,
    nextChapter: 'c11-vathis-gate',
    body: (state) => [
      'Vathis rises in stacked black towers, each shaped like an open hand around a different flame.',
      'Your shared ledger carries every offer term and refusal. The company can compare any new price, but its painful desires are no longer private within the expedition.',
      fragmentCustody(state),
      `The surviving expedition reaches the gate together: ${expedition(state)}.`,
      finalAlliance(state),
      'Three faction banners hang above the engine district, and all three claim legal control. Which faction controls Vathis and Malrec’s engine?',
    ],
    choices: [],
  },

  'c10-ending-private': {
    id: 'c10-ending-private',
    kicker: 'Chapter Ten complete',
    title: 'Seals Kept Closed',
    location: 'Public Gate of Vathis',
    objective: 'Find which Vathis faction controls Malrec’s engine.',
    threat: 'Unknown',
    art: 'vathisapproach',
    final: true,
    nextChapter: 'c11-vathis-gate',
    body: (state) => [
      'Vathis rises in stacked black towers, each shaped like an open hand around a different flame.',
      'Every private offer seal remains with its owner. The company knows its tested safety signal, while one unshared risk may still wait behind a closed page.',
      fragmentCustody(state),
      `The surviving expedition reaches the gate together: ${expedition(state)}.`,
      finalAlliance(state),
      'Three faction banners hang above the engine district, and all three claim legal control. Which faction controls Vathis and Malrec’s engine?',
    ],
    choices: [],
  },

  'c10-ending-oath': {
    id: 'c10-ending-oath',
    kicker: 'Chapter Ten complete',
    title: 'The Burden Freely Given',
    location: 'Public Gate of Vathis',
    objective: 'Find which Vathis faction controls Malrec’s engine.',
    threat: 'Unknown',
    art: 'vathisapproach',
    final: true,
    nextChapter: 'c11-vathis-gate',
    body: (state) => [
      'Vathis rises in stacked black towers, each shaped like an open hand around a different flame.',
      has(state, 'c10-burden-oath-active')
        ? 'The last ash bands fall from your shield as the named duration ends. Each traveller keeps their choices, while the strain and any withdrawal remain part of your history.'
        : 'You withdrew the burden proposal before it bound. The private seals reach Vathis intact, and no hesitation became consent.',
      fragmentCustody(state),
      `The surviving expedition reaches the gate together: ${expedition(state)}.`,
      finalAlliance(state),
      'Three faction banners hang above the engine district, and all three claim legal control. Which faction controls Vathis and Malrec’s engine?',
    ],
    choices: [],
  },
};
