import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function arrivingForce(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'The Crown March fills the eastern road behind you. Thousands answered your last order, but many still wear Regent Malrec’s badge beneath their cloaks. You have enough soldiers to fill every fort. You do not yet know whether you have enough trust.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your chosen company reaches the ridge in a narrow column. Every soldier volunteered, which gives you trust but not numbers. Teren’s remaining army follows on a separate road and will not arrive before the next knock. Eight forts wait below, and your company could barely fill two.';
  }
  return 'Only your old companions, the steppe guides, and a few stubborn survivors reach the ridge with you. Teren’s army is still a day behind on its own road. No banner follows your line, and a reputation cannot man eight walls.';
}

function terenCondition(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'Teren rides in the leading rank with his injured shoulder bound against his chest. Three officers now share his signals, so pain cannot silence the whole army. The arrangement is slower, but harder for one false voice to seize.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Teren’s injured shoulder has slowed the separate army behind you. Three officers share his signals now, so the Crown March can keep moving even when pain steals his voice.';
  }
  return 'Teren’s injured shoulder is one reason his army remains a day behind. He divided its signals among three officers before you rode ahead, making the march slower and harder for one false voice to control.';
}

function emberState(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'Vaor circles high above the cloud. The ember he gave you warms when the Gate knocks, and the dragon refuses to come lower. “Something below knows the taste of my fire,” he warns.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'The stolen ember pulls against your ribs. Vaor is somewhere behind the storm, angry enough to answer if you use it and proud enough to make you regret the call.';
  }
  return 'Vaor’s pact ember beats once beneath your breastbone. Through it, the dragon whispers, “That door is listening to every promise you carry.”';
}

function deploymentResult(state: GameState) {
  const fullArmy = has(state, 'c7-gained-full-army');
  const volunteers = has(state, 'c7-gained-chosen-company');

  if (has(state, 'c8-deployed-all-forts') || has(state, 'c8-deployed-full-march')) {
    if (fullArmy) {
      return 'The Crown March occupies all eight outer yards under paired officers. Every fort has defenders, but divided loyalties now stand close to every lock.';
    }
    if (volunteers) {
      return 'Your volunteers hold all eight outer yards in thin groups. Every fort has eyes on it, but none can survive a long attack alone.';
    }
    return 'Your small force watches all eight forts in pairs. The entire ring is visible, but a serious attack at any wall could overwhelm its two defenders.';
  }
  if (has(state, 'c8-deployed-strongpoints') || has(state, 'c8-deployed-volunteers')) {
    if (fullArmy) {
      return 'Most of the Crown March holds three strong forts while mounted reserves wait between them. Five forts remain lightly guarded, but every threatened wall can receive help.';
    }
    if (volunteers) {
      return 'Volunteers hold the three strongest approaches while empty towers remain between them. Every defender chose a post, and every gap is visible.';
    }
    return 'Your small force holds two strong forts and Fourth Fort’s road. Five walls remain empty, but the defenders can reach one another before a second horn.';
  }
  if (fullArmy) {
    return 'The Crown March waits in four mobile columns between the forts. Most walls begin empty, but thousands can answer whichever alarm sounds first.';
  }
  if (volunteers) {
    return 'Your chosen company stays together beneath the western wall. Lamps and warning cords cover the empty forts, and every fighter can answer the first alarm.';
  }
  return 'Small teams place lamps and warning cords instead of pretending they can hold every wall. You will hear an attack early, but stopping it will depend on speed.';
}

function inheritedForcePressure(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'The numbers solve one problem and create another. Teren catches two soldiers carrying Malrec’s private orders toward separate lock rooms. He arrests them, then warns that another loyalist may still be inside the ring. Every fort can be manned, but every keeper must be watched.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your volunteers can safely hold three fires. A mortal defence of all eight would require Ansel to split the Futureless across the remaining posts, leaving Fourth Fort with almost no reserve.';
  }
  return 'Your small force can safely hold two fires. A mortal defence of all eight would put wounded wardens, furnace workers, and riders on the other six. They may choose the risk, but some will be burned.';
}

function deploymentPressure(state: GameState) {
  if (has(state, 'c8-deployed-all-forts') || has(state, 'c8-deployed-full-march')) {
    return 'Because you spread the force, the first real attack may trap isolated pairs before help crosses the ring.';
  }
  if (has(state, 'c8-deployed-strongpoints') || has(state, 'c8-deployed-volunteers')) {
    return 'Because you held the strong forts, five empty walls now depend on warning lines and mounted reserves. A red fault may move faster than a horse.';
  }
  return 'Because you kept the force mobile, it can strike together. Most signal fires remain empty until the first alarm, leaving little time to place their keepers.';
}

function forceChoiceAtOpening(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'Teren can place soldiers at every fire, but his lock teams must watch for Malrec’s remaining loyalist while they face the Gate.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your volunteers can hold three fires. A fully mortal ring means sending the Futureless from Fourth Fort to hold the other five without reserves.';
  }
  return 'Your small force can hold two fires. A fully mortal ring means asking wounded wardens, furnace workers, and riders to face the opening heat at the other six.';
}

function pellOathOutcome(state: GameState) {
  if (!has(state, 'c8-oath-pell-sees-opening-contained')
    && !has(state, 'c8-oath-pell-sees-gate-close')) return [];
  return ['From Fourth Fort, Pell watches the last hostile hand withdraw and the opening shrink until no army can cross. Gold light leaves his chest and returns to yours. You promised containment, not silence, and the Oath knows the difference.'];
}

function personalWatch(state: GameState) {
  if (state.relationships.mara.intent === 'committed'
    || state.relationships.mara.intent === 'exploring') return 'c8-mara-watch';
  if (state.relationships.lysara.intent === 'committed'
    || state.relationships.lysara.intent === 'exploring') return 'c8-lysara-watch';
  return 'c8-quiet-watch';
}

function endangeredCompanion(state: GameState) {
  if (state.relationships.mara.intent === 'committed'
    || state.relationships.mara.intent === 'exploring') return 'Mara';
  if (state.relationships.lysara.intent === 'committed'
    || state.relationships.lysara.intent === 'exploring') return 'Lysara';
  return 'Korran';
}

function routeOutcome(state: GameState) {
  if (has(state, 'c8-united-wardens')) {
    if (has(state, 'c7-gained-full-army')) {
      return 'Eight mortal fires hold. Teren spends the hour moving between them, exposing the last saboteur before a lock can be reversed. Your army supplied enough hands, and its divided loyalty nearly supplied the enemy with one.';
    }
    if (has(state, 'c7-gained-chosen-company')) {
      return 'Volunteers hold three fires while the Futureless divide across the other five. The ring remains mortal, but Fourth Fort has no reserve and six wardens leave the locks with burned hands.';
    }
    return 'Your companions hold two fires. Wounded wardens, furnace workers, and steppe riders choose the other six. The ring remains mortal, but the infirmary fills with burns before the hour ends.';
  }
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'White fire joins the forts in a clean circle. It holds because you granted one peaceful embassy permission to enter and leave under public rules.';
  }
  return 'First Fort falls inward exactly as planned. Its stone and stored fire run through buried channels into the other seven. The ring survives with a permanent gap.';
}

function collectorBarrier(state: GameState) {
  if (has(state, 'c8-united-wardens')) {
    return 'Heat from eight mortal signal fires narrows the gap. Every keeper must remain at a separate post, so none can leave the chain to strike the reaching arm. This part is yours to finish.';
  }
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'The Ash Compact’s white fire holds the gap. Its public agreement allows it to support the locks, not attack a rival house. This part is yours to finish.';
  }
  return 'Heat stored beneath the fallen First Fort holds the gap. The broken stone can feed the chain, but it cannot stop a hand already through. This part is yours to finish.';
}

function vexaGreeting(state: GameState) {
  if (has(state, 'c8-accepted-ash-compact')) {
    return '“Vexa Ash,” she says. “Voice of the Ash Compact. You granted one peaceful embassy permission to enter and leave again. We will cross only under the words spoken before your witnesses.”';
  }
  if (has(state, 'c8-united-wardens')) {
    return '“Vexa Ash,” she says. “Voice of the Ash Compact. You refused our fire and held the Gate with mortal hands. You promised us no entry. We ask only to speak from this threshold unless you choose otherwise.”';
  }
  return '“Vexa Ash,” she says. “Voice of the Ash Compact. You refused our fire and broke one of your own forts to close the Gate. You promised us no entry. We ask only to speak from this threshold unless you choose otherwise.”';
}

function firstFortStaging(state: GameState) {
  if (has(state, 'c8-deployed-all-forts') || has(state, 'c8-deployed-full-march')) {
    return 'Before you leave the western road, Mara turns empty First Fort into an aid station for the wounded travelling between posts. Its dry lower room becomes the safest place for Pell’s sealed packet and the furnace fuel.';
  }
  if (has(state, 'c8-deployed-strongpoints') || has(state, 'c8-deployed-volunteers')) {
    return 'Before you leave the western road, Mara marks empty First Fort as the reserve aid station between the strong positions. Pell’s sealed packet and the furnace fuel go into its dry lower room.';
  }
  return 'Before you leave the western road, Mara makes empty First Fort a temporary aid station while your mobile force remains outside. Pell’s sealed packet and the furnace fuel go into its dry lower room.';
}

function seedCondition(state: GameState) {
  if (has(state, 'c8-seed-weakened-saving-pell')) {
    return 'Lysara opens her hand. The living seed saved Pell, and its light is now a thin green pulse. It can still lift the chain once, but doing so will spend what remains and leave her treaty magic dormant.';
  }
  return 'Lysara opens her hand. The living seed still carries enough strength to wake the dead roots beneath the chain, though the work will weaken its future treaty magic.';
}

function vexaMeetingStatus(state: GameState) {
  if (has(state, 'c8-vexa-received-outer-fort')) {
    return 'You honour the Compact before asking for more trust. Vexa and two sealed envoys cross into the empty Second Fort yard, where two gates and every witness remain between them and the wounded.';
  }
  if (has(state, 'c8-vexa-held-at-threshold')) {
    return 'Vexa remains beyond the threshold. She has permission to speak and return safely, but none to enter tonight.';
  }
  if (has(state, 'c8-ansel-spoke-first-after-entry')) {
    return 'The Compact embassy crosses under its public agreement, then stops inside the outer yard. Ansel stands before rulers and asks its first question.';
  }
  if (has(state, 'c8-ansel-spoke-first')) {
    return 'Vexa remains on the far side while Ansel asks the first question across the threshold. No decision about entry has been made.';
  }
  return 'Vexa and the sealed embassy cross under the eyes of every witness.';
}

function oathCost(state: GameState) {
  if (has(state, 'c8-surrendered-homecoming')) {
    return 'Your father’s old inn key is gone. You kept every active Oath by giving up the hope that life could return to what it was before the changed order. Home may exist ahead of you. It no longer exists behind you.';
  }
  if (has(state, 'c8-released-crown-oath')) {
    return 'You released your oldest promise of service to Asterra. The backlash still shakes your hands, but Malrec and the throne can no longer claim that Oath as a chain.';
  }
  if (has(state, 'c8-burned-lesser-oath')) {
    return 'The promise tied to your old Warden whistle is ash inside Vaor’s ember. You may still answer a call for help, but no magic can drag you toward every whistle at once.';
  }
  if (has(state, 'c8-shared-oath-mara')) {
    return 'Mara carries one strand of your Oath through a fresh black mark on her palm. You kept every promise, but the Gate can now find her through the burden you share.';
  }
  if (has(state, 'c8-shared-oath-lysara')) {
    return 'Lysara carries one strand of your Oath through a fresh black mark on her palm. You kept every promise, but the Gate can now find her through the burden you share.';
  }
  if (has(state, 'c8-shared-oath-korran')) {
    return 'Korran carries one strand of your Oath through a fresh black mark on his palm. You kept every promise, but the Gate can now find him through the burden you share.';
  }
  return `${endangeredCompanion(state)} carries one strand of your Oath through a fresh black mark on the palm. You kept your future, but the Gate can now feel someone you love or trust.`;
}

export const chapterEightNodes: Record<string, StoryNode> = {
  'c8-gate-ring': {
    id: 'c8-gate-ring',
    kicker: 'Chapter Eight',
    title: 'Eight Empty Forts',
    location: 'The Black Gate Fortress Ring',
    objective: 'Reach the only occupied fort before the Gate opens.',
    threat: 'Critical',
    art: 'blackgate',
    lesson: {
      title: 'The ground before you',
      body: 'Eight forts form a wide ring around the Black Gate. Each fort normally lights the next, so all eight must work together to keep the Gate shut. Seven signal fires are cold. The fourth fort has soldiers inside, but its banner is upside down, the old sign for a garrison that cannot safely receive orders.',
    },
    body: (state) => [
      'The Black Gate is not a door in a wall. It is a wall shaped like a door, taller than any tower in Greyhaven and carved from stone that swallows the morning light.',
      'Eight forts stand around it in a broad circle. You count seven cold signal baskets. Smoke rises only from Fourth Fort, where an Asterra banner hangs upside down.',
      arrivingForce(state),
      ...(has(state, 'c7-teren-lasting-injury')
        ? [terenCondition(state)]
        : []),
      emberState(state),
      'Ilyra left before dawn to follow the hidden command along another road. No message from her has reached the fort ring yet.',
      'The Gate knocks again. The sound passes through your boots and closes around your heart. Every Oath you carry answers with a separate line of heat. Beneath your armour, the key to your father’s roadside inn strikes softly against your old Warden whistle.',
      'A small figure runs from Fourth Fort with one hand pressed to a bleeding cut below his ribs. Halfway across the open ground, the snow behind him erupts in a straight red line. He is a boy in a Warden coat, and something beneath the ice is following his footsteps toward you.',
    ],
    choices: [
      {
        id: 'c8-ride-for-runner',
        label: 'Ride straight for the fleeing Warden.',
        detail: 'Lose 1 Health crossing the red fault before it opens beneath him.',
        advantage: 'Reach the only witness before the Gate’s heat catches him.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c8-saved-runner-personally'],
        result: 'Heat splits the skin above your boot, but you catch the boy by his coat and pull him across your saddle before the fault opens.',
        next: 'c8-first-knock',
      },
      {
        id: 'c8-command-runner-turn',
        label: 'Command him toward the buried drainage stones.',
        detail: 'Spend 1 Command giving a precise route across ground you have never crossed.',
        advantage: 'Save him without exposing anyone else to the fault.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c8-guided-runner'],
        result: 'Your voice reaches him before panic does. He turns at the third marker, and the red fault passes behind his heels instead of through him.',
        next: 'c8-first-knock',
      },
      {
        id: 'c8-send-korran-hook',
        label: 'Let Korran catch him with a steppe rescue hook.',
        detail: 'Trust a tool made for moving wagons, not people.',
        advantage: 'Save your strength and show the Gate wardens that another nation came to help.',
        addFlags: ['c8-korran-saved-runner'],
        result: 'Korran’s weighted line catches the boy around the waist. Three riders pull together, dragging him clear as the ice opens behind him.',
        next: 'c8-first-knock',
      },
    ],
  },

  'c8-first-knock': {
    id: 'c8-first-knock',
    kicker: 'A warning that bleeds',
    title: 'The Runner’s Last Warning',
    location: 'The Ground Between Forts',
    objective: 'Keep the runner alive long enough to understand his warning.',
    threat: 'Immediate',
    art: 'blackgate',
    introducesStoryTerms: ['Futureless'],
    body: () => [
      'The boy is older than he looked from the ridge, perhaps seventeen. A brass plate on his coat names him Pell. Beneath it, a flat oilskin packet bears Fourth Fort’s seal and the words First Fort copy. He grips your wrist and tries to speak.',
      '“Fourth Fort still has eighty soldiers. Captain Ansel sent me because the others cannot leave. They made bargains during the old openings.”',
      'He swallows blood. “They are not possessed. They know their names. They can choose most things. But each of them sold one promise they would make in the future.”',
      'Pell forces another breath. “One father sold the promise he meant to make when his daughter returned from war. He can love her. He can protect her. But when she asks whether he will stay, the words will not come. The bargain already owns them.”',
      '“We call them the Futureless,” Pell says. “Tonight the buyers are coming to collect something else.”',
      'A third knock bends every signal basket toward the Gate. Pell stops breathing after one last whisper. “Close it.”',
    ],
    choices: [
      {
        id: 'c8-medicine-for-pell',
        label: 'Use Medicine to open Pell’s airway.',
        detail: 'Spend 1 Medicine on the only person who escaped Fourth Fort.',
        advantage: 'Pell survives and can identify which soldiers still control the locks.',
        changes: { medicine: -1 },
        requires: { medicine: 1 },
        addFlags: ['c8-pell-survived'],
        result: 'You cut the tight collar, clear the blood, and hold him upright until breath returns. His first useful act is to draw four safe names in the snow.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-oath-hold-pell',
        label: 'Promise that Pell will see the invasion stopped tonight.',
        detail: 'Gain 2 Oathfire by accepting a duty that fails if Pell dies or the opening becomes an army road.',
        advantage: 'The Oath steadies his failing heart and gives you power for the defence.',
        changes: { oathfire: 2 },
        addFlags: ['c8-oath-pell-sees-opening-contained', 'c8-pell-survived'],
        result: 'Gold light passes from your hand into his chest. Pell gasps. The promise holds him, and its new weight settles beside every older duty.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-let-lysara-seed-pell',
        label: 'Ask Lysara to use the living seed on Pell’s lungs.',
        detail: 'The seed saves him but loses strength needed to read the Gate later.',
        advantage: 'Pell survives without using your limited Medicine or adding another Oath.',
        addFlags: ['c8-pell-survived', 'c8-seed-weakened-saving-pell'],
        result: 'Green threads spread beneath Pell’s skin and draw the blood from his lungs. Lysara closes her fist around a seed that now shines more weakly.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-take-pell-last-map',
        label: 'Let Pell spend his last breath marking the safe locks.',
        detail: 'Preserve every resource, but lose the witness who trusted you with the warning.',
        advantage: 'Gain the complete lock route before the next knock erases it.',
        addFlags: ['c8-pell-died-for-map', 'c8-complete-lock-map'],
        result: 'Pell draws the last line with a shaking finger. When it is complete, his hand falls still. You remember every mark because forgetting would make his death smaller.',
        next: 'c8-force-deployment',
      },
    ],
  },

  'c8-force-deployment': {
    id: 'c8-force-deployment',
    kicker: 'Power brought from the west',
    title: 'Who Holds the Empty Walls',
    location: 'The Western Signal Road',
    objective: 'Choose how your available force will guard the fort ring.',
    threat: 'Rising',
    art: 'blackgate',
    body: (state) => [
      'The fortress ring is simple when seen from above. Eight forts. Eight signal fires. One buried chain joining them around the Gate.',
      arrivingForce(state),
      'You cannot move people again once the yearly opening begins. Anyone outside a fort will face the heat without shelter. Anyone inside the wrong fort may be trapped with a broken lock.',
      'Mara waits for an honest order. Lysara studies the black wall. Korran’s riders watch the occupied fort instead of the Gate. Your instincts agree with them. Living people can be the harder danger.',
    ],
    choices: [
      {
        id: 'c8-deploy-all-forts',
        label: 'Spread your available force across all eight forts in paired teams.',
        detail: 'Cover every wall, even if a smaller force leaves each position dangerously thin.',
        advantage: 'No part of the ring will be unwatched when the opening begins.',
        addFlags: ['c8-deployed-all-forts'],
        result: 'Your available fighters divide into eight columns. Nobody receives a lock alone, and nobody pretends the smaller groups can hold without help.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-deploy-strongpoints',
        label: 'Concentrate defenders at the strongest forts and leave clear warning lines between them.',
        detail: 'Accept empty walls so the occupied positions can rescue one another.',
        advantage: 'The strongest approaches may hold longer without leaving isolated defenders behind.',
        addFlags: ['c8-deployed-strongpoints'],
        result: 'Defenders take the strongest approaches. Lamps and bell wire mark the empty ground, and mounted reserves wait where the roads meet.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-deploy-mobile-force',
        label: 'Build warning posts and keep most of your force mobile.',
        detail: 'Leave most walls empty so one strong group can answer the first serious attack.',
        advantage: 'Your fighters may reach one breaking wall together instead of being defeated in isolated groups.',
        addFlags: ['c8-deployed-mobile-force'],
        result: 'You leave no false garrisons. Bells, lamps, and marked snow will reveal where the danger begins. The main force waits within one hard ride of every approach.',
        next: 'c8-occupied-fort',
      },
    ],
  },

  'c8-occupied-fort': {
    id: 'c8-occupied-fort',
    kicker: 'The one fort that answered',
    title: 'Fourth Fort',
    location: 'Fourth Fort Gatehouse',
    objective: 'Enter without letting the Gate use your authority against the garrison.',
    threat: 'Immediate',
    art: 'futureless',
    body: (state) => [
      deploymentResult(state),
      firstFortStaging(state),
      'Fourth Fort opens one narrow viewing slot. Captain Ansel Greve looks through it. He is grey haired, unshaven, and holding a crossbow against his own gate lever.',
      '“Do not order us to open,” he says. “Some of us sold the future promise that we would obey the next true Warden who came from the west. If you command it, the bargain may decide what obedience means.”',
      'The warning strikes close. Your authority got people here. At this door, using it carelessly could give the enemy a key.',
      has(state, 'c8-pell-survived')
        ? 'Pell calls Ansel’s name from behind you. The captain’s crossbow lowers by one finger.'
        : 'Pell’s four safe names sit in your memory, but his voice is gone. You speak the first one through the slot.',
      'A hinge inside the wall begins turning by itself. You have seconds before the outer gate opens to everyone standing in the snow. Ansel shouts through the slot, “Choose your way in.”',
    ],
    choices: [
      {
        id: 'c8-enter-without-command',
        label: 'Ask Ansel what help he freely chooses to accept.',
        detail: 'Give up the speed of command and let him define the safe entrance.',
        advantage: 'Enter without activating the Futureless bargain tied to Warden authority.',
        addFlags: ['c8-ansel-chose-entry'],
        result: 'Ansel thinks, then orders his own people to lift a grain hatch. You crawl through one at a time while he jams the moving hinge from inside.',
        next: 'c8-futureless-reveal',
      },
      {
        id: 'c8-break-side-grate',
        label: 'Break through the side grate before the main gate opens.',
        detail: 'Lose 1 Health forcing frozen iron apart with your wounded shoulder.',
        advantage: 'Reach the gate lever without speaking any command the bargain can twist.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c8-broke-fourth-grate'],
        result: 'Old pain tears open beneath your armour. The grate gives first. You roll inside and drive your sword through the turning hinge.',
        next: 'c8-futureless-reveal',
      },
      {
        id: 'c8-oath-free-entry',
        label: 'Swear that no order spoken at this door will bind an unwilling defender.',
        detail: 'Spend 2 Oathfire to protect choice within the gatehouse.',
        advantage: 'Your people enter openly and the Futureless can hear you without the old bargain answering.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-free-command-zone'],
        result: 'Gold fire covers the threshold. The moving hinge stops. Ansel opens the door himself, and eighty frightened soldiers see you enter without owning their choice.',
        next: 'c8-futureless-reveal',
      },
    ],
  },

  'c8-futureless-reveal': {
    id: 'c8-futureless-reveal',
    kicker: 'A price paid before it was owed',
    title: 'The Promises Missing From Tomorrow',
    location: 'Fourth Fort Common Hall',
    objective: 'Learn what the garrison sold and which locks remain safe.',
    threat: 'Rising',
    art: 'futureless',
    body: () => [
      'Eighty soldiers stand in the common hall. Nothing marks them as monsters. They are tired people with clean weapons and untouched letters from home.',
      'Ansel lays three contracts on a table. They are written in plain mortal language. During earlier Gate openings, each soldier received food, heat, or one rescued life. In payment, a devil claimed a promise that soldier would make later.',
      'The bargain cannot force them to love, hate, march, or kill. It owns only the named promise. The cruelty lies in choosing the moment that promise will matter most.',
      'Changing the sentence will not free them. The contract owns the act and meaning of that one promise, no matter which words they try to use.',
      'Ansel taps the final line of each contract. “One named promise. Nothing more. The buyer cannot demand another payment because it dislikes the first.”',
      'Ansel sold the words he meant to speak when his daughter came home: I will never leave you again. Another soldier sold the promise to guard the western signal basket if every other post fell. He still wants to guard it tonight, but the bargain owns the words he would use to accept that duty.',
      'You feel anger arrive before judgment. These people did not trade the kingdom for comfort. They were abandoned during secret openings and paid whatever kept someone alive.',
      'A signal clock shows a little over two hours until sunset. A black mark moves across one contract, counting down with it.',
    ],
    choices: [
      {
        id: 'c8-list-every-sold-promise',
        label: 'Record every sold promise before deciding whom to trust.',
        detail: 'Spend precious time building an exact list of what the bargains can and cannot touch.',
        advantage: 'No later command will accidentally depend on a promise already owned.',
        addFlags: ['c8-complete-futureless-ledger'],
        result: 'Six clerks question small groups while you and Ansel check every line. In forty minutes, all eighty accounts become one painful, useful list. Fear becomes a set of known limits instead of a shadow over every face.',
        next: 'c8-hidden-record',
      },
      {
        id: 'c8-test-contract-with-oathfire',
        label: 'Touch one contract with Oathfire and learn how it answers.',
        detail: 'Spend 1 Oathfire testing the bargain without breaking it.',
        advantage: 'Discover that the contracts draw power from a chamber beneath the Gate.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c8-found-contract-source'],
        result: 'Gold fire touches black ink. A line of pain runs through your hand and down into the floor, pointing toward one buried chamber beneath the Gate.',
        next: 'c8-hidden-record',
      },
      {
        id: 'c8-give-ansel-choice-test',
        label: 'Ask Ansel to refuse a simple request in front of everyone.',
        detail: 'Risk insulting the captain to prove the difference between choice and the stolen promise.',
        advantage: 'The garrison sees that ordinary refusal still belongs to them.',
        addFlags: ['c8-futureless-choice-proven'],
        result: 'You ask Ansel to surrender his sword. “No,” he says at once. Nothing punishes him. A few soldiers laugh from relief, and the hall feels human again.',
        next: 'c8-hidden-record',
      },
    ],
  },

  'c8-hidden-record': {
    id: 'c8-hidden-record',
    kicker: 'The Crown knew',
    title: 'Seventeen Nights Erased',
    location: 'Fourth Fort Record Room',
    objective: 'Recover the hidden opening record before the Gate’s heat destroys it.',
    threat: 'Immediate',
    art: 'futureless',
    body: () => [
      'Ansel removes a brick behind the old duty board. Seventeen thin ledgers wait inside, one for each year he has commanded Fourth Fort.',
      'The Black Gate opened for one hour on the same winter night every year. At first it opened no wider than a finger. Last year, a person could have walked through sideways.',
      'Each report reached the Crown. Each reply ordered the wardens to call it a furnace fault, pay the dead families, and replace anyone who spoke publicly. Malrec’s seal appears on the newest orders, but the concealment began before he held power.',
      'For seventeen years, the Crown removed witnesses, delayed supplies, and quietly closed three failing garrisons. The remaining wardens became desperate enough to bargain for food, heat, and rescued lives.',
      'Then, three weeks ago, Malrec pulled the field army away from four more forts and sent no replacements. Years of neglect weakened the ring. His final order left only Fourth Fort occupied tonight.',
      'Ansel points to the empty cord beneath Pell’s brass plate. The sealed packet you sent to First Fort is his complete copy of these reports. He made it before sending Pell for help because heat was already staining these walls.',
      'Heat stains the far wall red. You remember every official who called these people unreliable. In less than a minute, the ledgers will burn from the inside.',
    ],
    choices: [
      {
        id: 'c8-carry-opening-ledgers',
        label: 'Take the original ledgers and run through the heating passage.',
        detail: 'Lose 2 Health carrying proof against the Crown through falling stone.',
        advantage: 'Preserve seventeen years of original names, dates, and sealed replies.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-preserved-original-ledgers'],
        result: 'The passage tears your cloak and opens your shoulder. You reach the yard with all seventeen ledgers pressed against your chest.',
        next: 'c8-breach',
      },
      {
        id: 'c8-lysara-copies-opening-proof',
        label: 'Let Lysara copy the dates into living treaty bark.',
        detail: 'Save the facts while the original ledgers burn.',
        advantage: 'The copy can survive heat and be tested by foreign courts, though Crown loyalists may dispute it.',
        addFlags: ['c8-living-copy-of-openings'],
        result: 'Green letters grow across a strip of pale bark. The final date appears as the hidden shelf catches fire. The facts survive without the royal paper.',
        next: 'c8-breach',
      },
      {
        id: 'c8-call-witnesses-to-record-room',
        label: 'Bring soldiers from both armies to witness the seals before they burn.',
        detail: 'Preserve no paper, but make the truth belong to many divided witnesses.',
        advantage: 'Malrec cannot silence the record by stealing one document or killing one courier.',
        addFlags: ['c8-many-witnessed-openings'],
        result: 'Asterra officers, volunteers, steppe riders, and Futureless wardens watch the seals blacken together. Twenty people leave knowing the same dates.',
        next: 'c8-breach',
      },
    ],
  },

  'c8-breach': {
    id: 'c8-breach',
    kicker: 'The Gate’s first breath',
    title: 'When the Wall Breathes',
    location: 'Fourth Fort Inner Yard',
    objective: 'Save the yard before the first opening breath reaches the powder room.',
    threat: 'Critical',
    art: 'futureless',
    body: (state) => [
      inheritedForcePressure(state),
      deploymentPressure(state),
      'More than an hour before the yearly opening, the Gate inhales.',
      'Air tears from the yard toward the black wall. Carts roll backward. Two soldiers lose their footing. A furnace red crack appears down the Gate’s centre, thin as a sword blade and bright enough to leave an afterimage.',
      'The opening is not a doorway yet. It is a wound drawing heat, air, and every active promise toward itself. The powder room door breaks from its hinges and begins sliding across the stones.',
      'Mara catches one falling soldier. Ansel reaches the other. A wagon carrying three wounded wardens rolls toward the crack while sparks race for the exposed powder barrels.',
      'Your body chooses the wagon before your mind finishes counting lives. You force the instinct back. You have time to stop the wagon or the sparks yourself. The other danger must belong to someone you trust.',
    ],
    choices: [
      {
        id: 'c8-stop-wagon-health',
        label: 'Put your body behind the wounded wagon and send Mara for the powder.',
        detail: 'Lose 2 Health stopping three wounded wardens from reaching the Gate.',
        advantage: 'Mara smothers the powder sparks while you save everyone on the wagon.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-saved-wounded-wagon'],
        result: 'The wheel crushes your boot against the drain lip. You hold until Ansel blocks it with a beam. Across the yard, Mara rolls the last burning barrel into snow.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-command-two-rescues',
        label: 'Split the yard into two rescue lines before panic chooses for them.',
        detail: 'Spend 2 Command making enemies and strangers move as one team.',
        advantage: 'Save the wagon and powder without adding another personal injury.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-yard-moved-as-one'],
        result: 'You give four names and two jobs. The yard answers. One line stops the wagon while the other buries the sparks beneath wet cloaks.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-oath-anchor-yard',
        label: 'Bind every loose object in the yard to the ground until the breath ends.',
        detail: 'Spend 2 Oathfire holding wood, iron, flame, and people in place.',
        advantage: 'Prevent both disasters and learn that the Gate pulls hardest on spoken promises.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-oath-anchored-yard'],
        result: 'Gold lines spread across the stones. The wagon stops. The sparks flatten. Your Oaths strain toward the crack more fiercely than anything made of iron.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-trust-futureless-yard',
        label: 'Let Ansel’s soldiers choose the rescues without your command.',
        detail: 'Use the refusal test you witnessed and risk both dangers on people the Crown called compromised.',
        advantage: 'The Futureless prove they can protect the fort without promises or borrowed authority.',
        showIfAllFlags: ['c8-futureless-choice-proven'],
        addFlags: ['c8-futureless-saved-yard'],
        result: 'Ansel shouts no oath and asks for no vow. His soldiers move anyway. They stop the wagon and bury the sparks because they choose to, not because anyone owns the words.',
        next: 'c8-ash-offer',
      },
    ],
  },

  'c8-ash-offer': {
    id: 'c8-ash-offer',
    kicker: 'A white light beyond the crack',
    title: 'The Offer From the Other Side',
    location: 'Fourth Fort Gate Platform',
    objective: 'Understand the offer before the opening becomes wide enough to enforce it.',
    threat: 'Critical',
    art: 'blackgate',
    introducesStoryTerms: ['Ash Compact'],
    lesson: {
      title: 'A faction, not a species',
      body: 'The Ash Compact is one organised group of devils, not everyone beyond the Gate. It says a rival group is forcing the opening. It offers white fire in return for permission to send one peaceful embassy. Its bargains follow the exact words spoken, so witnesses matter.',
    },
    body: () => [
      'A white ember appears on the far side of the red crack. It gives no heat. A woman’s voice speaks through it in careful Asterra trade speech.',
      '“The hand pushing your Gate does not belong to the Ash Compact. We prefer a door with witnesses to a wound with armies.”',
      'The speaker offers enough white fire to join the eight fort locks for one night. In return, the Compact wants permission for one peaceful embassy to enter and leave again after the Gate is stable. No hidden travellers. No weapons raised first. Every term spoken in public.',
      'Ansel keeps his crossbow trained on the ember. Two soldiers with black contract marks step closer to hear it. The others move back. Nobody lowers a weapon.',
      'The voice asks to be heard, not trusted. The ember waits, then asks one question. “Will Caelan Vey hear the terms before he decides?”',
    ],
    choices: [
      {
        id: 'c8-hear-ash-terms-publicly',
        label: 'Hear every term in the open yard with witnesses from each force.',
        detail: 'Give the Compact no privacy and promise nothing yet.',
        advantage: 'Learn the full offer without allowing either side to change its words later.',
        addFlags: ['c8-heard-public-ash-terms'],
        result: 'You bring the ember into the yard. Mortal scribes record each sentence. The Compact asks for speech, safe return, and one named envoy. It asks for no soul, blood, worship, or secret obedience.',
        next: personalWatch,
      },
      {
        id: 'c8-test-ash-terms-oathfire',
        label: 'Pass the offer through Oathfire before answering.',
        detail: 'Spend 1 Oathfire testing whether the spoken price hides another duty.',
        advantage: 'Prove that the wording hides no extra duty, while revealing one of your Oaths to them.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c8-tested-ash-terms'],
        result: 'Gold fire closes around the white ember. No extra duty appears. The voice beyond the Gate learns the shape of one promise you carry and thanks you for the introduction.',
        next: personalWatch,
      },
      {
        id: 'c8-refuse-until-mortal-plan',
        label: 'Refuse an answer until you know whether mortals can restore the forts alone.',
        detail: 'Delay the safest offer while preserving complete freedom for the next decision.',
        advantage: 'No contract can shape your defence before you understand your own options.',
        addFlags: ['c8-delayed-ash-answer'],
        result: 'The white ember dims but does not vanish. “A delayed answer is still yours,” the voice says. “That is more courtesy than some houses offer.”',
        next: personalWatch,
      },
    ],
  },

  'c8-mara-watch': {
    id: 'c8-mara-watch',
    kicker: 'One breath before sunset',
    title: 'What the Gate Can Hear',
    location: 'Fourth Fort West Tower',
    objective: 'Tell Mara what part of your future remains yours before the Gate tests it.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'Mara returns from the western signal line with snow in her hair and another soldier’s blood on one sleeve. She closes the tower door, checks that the latch holds, and lets her forehead rest against yours.',
      'For a moment, your body remembers warmth without armour between it and danger. Her hand settles at your waist, familiar and careful around the newest wound.',
      '“That Gate steals promises people have not made yet,” she says. “So tell me something without turning it into an Oath. What do you want when nobody needs Captain Vey?”',
      'The answer frightens you more than the crack outside. Duty has always let you postpone desire. The Gate may make postponement a price someone else can collect. Mara waits and says, “No Oath. Just the truth.”',
    ],
    choices: [
      {
        id: 'c8-mara-name-home',
        label: 'Tell Mara you want a home chosen together, then kiss her.',
        detail: 'Name desire without making it a binding promise.',
        advantage: 'Mara knows what you are protecting if the Gate later demands a personal price.',
        addFlags: ['c8-mara-knows-home-desire'],
        result: '“A door we choose,” you say. “A table that is ours. Work we can leave at night.” Her kiss is slow despite the horns outside, and it ends because both of you decide the moment must end.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-mara-share-command',
        label: 'Ask Mara to command the western forts as your equal.',
        detail: 'Answer her with present trust instead of a future promise.',
        advantage: 'The defence gains a second independent commander whom the Gate cannot control through you.',
        addFlags: ['c8-mara-western-commander'],
        result: '“I want you beside me without standing behind me,” you say. Mara takes the western command seal. Her smile is brief, proud, and entirely her own.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-mara-admit-fear-of-wanting',
        label: 'Admit that wanting a future gives the enemy something to threaten.',
        detail: 'Offer an honest fear without asking Mara to solve it.',
        advantage: 'She can recognise when duty is hiding panic during the coming test.',
        addFlags: ['c8-mara-knows-fear'],
        result: 'Mara does not call the fear foolish. She takes your hand and says, “Then we protect the wanting too. We do not bury it for them.”',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-lysara-watch': {
    id: 'c8-lysara-watch',
    kicker: 'One breath before sunset',
    title: 'A Future Without Treaty Ink',
    location: 'Fourth Fort Record Tower',
    objective: 'Tell Lysara what belongs to the two of you, not to the kingdoms you represent.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'Lysara meets you above the ruined ledgers. Red light touches the brown skin at her throat and turns the green seed in her palm almost black.',
      'She takes your hand first. Her thumb moves across the scar where Oathfire has burned you since Bellweather.',
      '“A treaty survives because everyone knows what it promises,” she says. “We have been less precise with ourselves. What do you want that is not useful to Asterra, my court, or this Gate?”',
      'You hear the opening horns below. There is no time for a perfect answer, only a true one. Lysara waits and says, “Answer as yourself.”',
    ],
    choices: [
      {
        id: 'c8-lysara-name-shared-road',
        label: 'Tell Lysara you want to choose a road together after the crisis, then kiss her.',
        detail: 'Name a mutual desire without turning it into duty.',
        advantage: 'Lysara knows the future you value if the Gate later tests it.',
        addFlags: ['c8-lysara-knows-road-desire'],
        result: '“Not your court. Not mine,” you say. “One road neither kingdom assigned.” She kisses you with one hand against your chest, then steps back before the horn can ask twice.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-lysara-share-lock-authority',
        label: 'Give Lysara equal authority over the living lock.',
        detail: 'Answer with power shared now instead of a promise about later.',
        advantage: 'The Gate cannot break the defence by removing either one of you alone.',
        addFlags: ['c8-lysara-equal-lockkeeper'],
        result: 'You press half the lock seal into her hand. “If I fall, you decide. If you disagree, you say it before everyone.” Lysara closes her fingers around equal power.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-lysara-admit-two-loyalties',
        label: 'Admit that you fear one day your kingdoms will demand opposite choices.',
        detail: 'Name the conflict without demanding that she choose you in advance.',
        advantage: 'Neither of you can mistake future disagreement for personal betrayal.',
        addFlags: ['c8-lysara-knows-loyalty-fear'],
        result: 'Lysara holds your gaze. “Then we argue as ourselves before we obey as symbols.” It is not comfort. It is something stronger and more usable.',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-quiet-watch': {
    id: 'c8-quiet-watch',
    kicker: 'One breath before sunset',
    title: 'The Want Beneath Duty',
    location: 'Fourth Fort West Tower',
    objective: 'Decide what private desire the Gate must not choose for you.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'You take one minute alone above the fortress ring. Mara commands the western wall. Lysara prepares the living lock. Korran checks the riders below. Their work continues without needing you at its centre.',
      'The sight should feel like relief. Instead, it exposes a question duty has hidden for years. If the world survives, what do you want your life to contain besides the next person who needs saving?',
      'The Gate knocks softly. Every Oath answers. Your fear circles one silent question: what do you want for yourself? The private wants beneath the duties may be the only things that still belong entirely to you.',
    ],
    choices: [
      {
        id: 'c8-want-road-home',
        label: 'Choose the hope of a home you are allowed to return to.',
        detail: 'Name the desire privately without binding another person to it.',
        advantage: 'You will recognise the true price if the Gate asks you to surrender home later.',
        addFlags: ['c8-named-home-desire'],
        result: 'The word home hurts more than expected. You let it hurt. Wanting rest does not make the people below less important.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-want-chosen-duty',
        label: 'Choose duties you can accept, refuse, and finish.',
        detail: 'Separate service from obedience before the Gate tests both.',
        advantage: 'You enter the opening knowing which old Oath no longer represents you.',
        addFlags: ['c8-named-chosen-duty'],
        result: 'You have spent years accepting every burden that reached your hands. For the first time, you allow refusal to exist beside honour.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-want-truth-after-war',
        label: 'Choose the Concord’s truth even if no kingdom rewards you.',
        detail: 'Choose curiosity as a personal desire, not another official mission.',
        advantage: 'Fear cannot reduce the coming Gate to a single battle you must merely win.',
        addFlags: ['c8-named-truth-desire'],
        result: 'The nine Nails, the lost histories, and the hidden openings are more than enemies. You want to understand what the world was built to forget.',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-chain-plan': {
    id: 'c8-chain-plan',
    kicker: 'Eight fires, one lock',
    title: 'The Buried Chain',
    location: 'Fourth Fort Map Floor',
    objective: 'Restore the physical link between the forts before deciding who will power it.',
    threat: 'Critical',
    art: 'futureless',
    body: (state) => [
      'The fort map shows one simple defence. Each signal basket feeds heat into a buried iron chain. When all eight links glow, the ring holds the Black Gate shut.',
      'Seven baskets are cold. Two fuel stores are flooded. One chain section lies beneath open ground already splitting with red heat.',
      seedCondition(state),
      'Ansel knows the old furnace route. Mara can lead a repair line across exposed snow. You can protect only one method from the Gate’s next breath.',
      'Your attention keeps returning to the exposed chain section. The opening horn sounds. Sunset touches the top of the black wall.',
    ],
    choices: [
      {
        id: 'c8-root-lift-chain',
        label: 'Use Lysara’s living seed to lift the broken chain from below.',
        detail: 'Weaken the seed’s future treaty magic to repair the safest underground route.',
        advantage: 'Restore the chain without exposing soldiers on the open ground.',
        hideIfAnyFlags: ['c8-seed-weakened-saving-pell'],
        addFlags: ['c8-chain-lifted-by-seed'],
        result: 'Green roots rise beneath the iron and carry it across the flooded gap. The seed dims, but the chain closes link by link.',
        next: 'c8-opening',
      },
      {
        id: 'c8-spend-weakened-seed-on-chain',
        label: 'Spend the living seed’s remaining strength to lift the chain.',
        detail: 'The seed already saved Pell. This second use will leave its treaty magic dormant.',
        advantage: 'Restore the chain without exposing soldiers on the open ground.',
        showIfAllFlags: ['c8-seed-weakened-saving-pell'],
        addFlags: ['c8-chain-lifted-by-seed', 'c8-living-seed-spent'],
        result: 'The weakened seed trembles in Lysara’s palm. Roots lift the iron into place, then every green thread goes dark. Pell breathes because of it, but the seed has no magic left for the next treaty.',
        next: 'c8-opening',
      },
      {
        id: 'c8-lead-chain-repair',
        label: 'Lead the repair line across the exposed ground.',
        detail: 'Lose 2 Health reaching the broken section before the red fault widens.',
        advantage: 'Preserve the seed and furnace fuel while restoring the shortest link.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-chain-repaired-by-hand'],
        result: 'Heat cuts through your greaves. You and Mara drag the iron into place while Korran’s riders hammer the joining pin from horseback.',
        next: 'c8-opening',
      },
      {
        id: 'c8-burn-vaor-ember-chain',
        label: 'Feed a breath of Vaor’s ember into the flooded furnaces.',
        detail: 'Spend 2 Resolve holding dragon fire inside a lock built to steal it.',
        advantage: 'Relight every furnace at once and preserve mortal fuel for the night.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-chain-lit-by-ember'],
        result: 'You open the ember for one breath. Fire runs through the flooded channels without going out. Vaor roars inside you as all eight baskets wake.',
        next: 'c8-opening',
      },
      {
        id: 'c8-use-ansel-furnace-route',
        label: 'Trust Ansel to reopen the old furnace route his soldiers maintained alone.',
        detail: 'Use the trust established when Ansel chose your safe entrance. One hidden furnace may still fail.',
        advantage: 'Preserve every magical resource and restore the wardens’ ownership of their fort.',
        showIfAllFlags: ['c8-ansel-chose-entry'],
        addFlags: ['c8-ansel-restored-chain', 'c8-lost-furnace-reserve'],
        result: 'Ansel takes twenty soldiers into the smoke passage. They return black with soot and carrying the missing chain pin. A buried furnace collapses behind them, destroying the reserve fuel, but they needed tools, not redemption.',
        next: 'c8-opening',
      },
    ],
  },

  'c8-opening': {
    id: 'c8-opening',
    kicker: 'The longest hour begins',
    title: 'A Door Wide Enough for One',
    location: 'The Black Gate Inner Ring',
    objective: 'Keep the yearly opening from becoming an invasion road.',
    threat: 'Critical',
    art: 'blackgate',
    body: (state) => [
      'The Gate opens at sunset.',
      'First comes a red line. Then the two halves move apart by the width of one hand. Through the gap, you see a city of black towers beneath an orange sky. A hot wind carries voices speaking in several languages.',
      'The yearly opening lasts one hour. It has happened seventeen times. Every earlier year, the gap widened. Tonight someone beneath the Gate is pulling on the stolen future promises to force it farther.',
      forceChoiceAtOpening(state),
      'The eight signal fires answer, but the defence lacks one thing: people or power at every link. You can unite the remaining wardens, accept the Ash Compact’s white fire, or destroy one fort so its stored strength feeds the other seven.',
      'Mortal keepers may fail if one frightened group breaks. White fire would strengthen every weak link, but the Compact would earn the embassy it requested. Breaking First Fort would give the chain enough heat and leave a permanent hole in Asterra’s defence.',
    ],
    choices: [
      {
        id: 'c8-choose-united-wardens',
        label: 'Unite the mortal wardens and let each fort choose its own keeper.',
        detail: 'Reject devil aid and refuse to destroy a fort. The defence will depend on frightened people holding every weak point.',
        advantage: 'Keep the Gate under mortal control without creating a new contract or permanent gap.',
        addFlags: ['c8-united-wardens'],
        result: 'You send one question around the ring: Who freely chooses a fire? Names return from Crown ranks, volunteers, steppe riders, and the Futureless.',
        next: 'c8-wardens-route',
      },
      {
        id: 'c8-choose-ash-compact',
        label: 'Accept the Ash Compact’s white fire under the public terms.',
        detail: 'Grant safe passage to one peaceful embassy after the Gate is stable.',
        advantage: 'Fill every weak link without sacrificing a fort or sending more people into the opening heat.',
        addFlags: ['c8-accepted-ash-compact'],
        result: 'You speak the public terms. The white ember divides into eight lights, each waiting outside a fort until its mortal keeper allows it across.',
        next: 'c8-compact-route',
      },
      {
        id: 'c8-choose-sacrificed-fort',
        label: 'Evacuate First Fort and break its foundation into the buried chain.',
        detail: 'Create one permanent gap in the ring so the other seven can hold tonight.',
        advantage: 'Concentrate the old defence without owing devils or relying on enough willing keepers.',
        addFlags: ['c8-sacrificed-first-fort'],
        result: 'The First Fort evacuation bell sounds. Engineers open the channels beneath its foundation. You have chosen the stone that will not survive.',
        next: 'c8-sacrifice-route',
      },
    ],
  },

  'c8-wardens-route': {
    id: 'c8-wardens-route',
    kicker: 'Mortal hands on every fire',
    title: 'Eight Keepers',
    location: 'The Fortress Ring',
    objective: 'Make eight independent groups act together without giving the Gate one command to steal.',
    threat: 'Critical',
    art: 'futureless',
    body: () => [
      'The Gate listens for one grand promise. You give it none. Each fort chooses a keeper and one practical task instead.',
      'Fourth Fort holds the weakest link. Ansel can carry it only if the Futureless are treated as wardens, not prisoners. The western officers will accept that if you place your authority behind him. The volunteers will accept it if Ansel can refuse you afterward.',
      'You feel eight groups waiting for coordination without surrendering choice. The red gap widens to the breadth of a face. A horn sounds from the city beyond.',
    ],
    choices: [
      {
        id: 'c8-command-eight-captains',
        label: 'Spend your authority coordinating eight captains while leaving each final order local.',
        detail: 'Spend 2 Command to create one plan without one controlling voice.',
        advantage: 'All eight forts act together and the Gate has no single command to twist.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-eight-local-captains'],
        result: 'You set timing, signals, and retreat points. Each captain chooses the people and words. The ring moves together without becoming one obedient body.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-lend-futureless-oathfire',
        label: 'Lend Ansel enough Oathfire to hold Fourth Fort without making a new promise.',
        detail: 'Spend 2 Oathfire giving strength without taking ownership of his choice.',
        advantage: 'The weakest fort holds and the Futureless stand as free defenders.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-ansel-borrowed-oathfire'],
        result: 'Gold fire enters Ansel’s hands without words. “Borrowed,” he says. “Returned at dawn.” He closes his own fist around it and takes the weakest fire.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-run-final-signal',
        label: 'Carry the final signal through the open heat yourself.',
        detail: 'Lose 2 Health crossing the inner ring while every fort waits on your lamp.',
        advantage: 'Keep authority out of the signal and prove the defence through a visible mortal act.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-carried-final-signal'],
        result: 'The hot wind strips skin from your knuckles. You raise the lamp at the centre. Eight fires answer because eight people choose to answer it.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-let-ansel-name-keepers',
        label: 'Let Ansel name the keepers and accept the risk of following him.',
        detail: 'Use the ledger or refusal test to place the defence in the hands of the captain who survived all seventeen openings.',
        advantage: 'Use local knowledge no outside commander possesses and restore Ansel’s public honour.',
        showIfAnyFlags: ['c8-complete-futureless-ledger', 'c8-futureless-choice-proven'],
        addFlags: ['c8-ansel-named-keepers'],
        result: 'Ansel names people by the promises they still own. The pattern makes sense only after he speaks it. Every selected keeper steps forward without being ordered.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-compact-route': {
    id: 'c8-compact-route',
    kicker: 'Help with exact edges',
    title: 'The White Fire Contract',
    location: 'The Black Gate Inner Ring',
    objective: 'Set the limit of the Compact’s aid before accepting its fire.',
    threat: 'Critical',
    art: 'futureless',
    body: () => [
      'Eight white embers wait beyond the crack. The Compact repeats its price: one peaceful embassy may enter after the Gate is stable, speak before witnesses, and leave unharmed if it keeps the same rules.',
      'It asks whether mortal names may be written into the agreement. Names make it easier to punish anyone who breaks the rules. They also give the Compact a lasting hold on every person listed.',
      'You can rely on public witnesses, spend your strength cutting every mortal name from the agreement, or let the Compact hold the outer flame of Vaor’s ember until the embassy leaves. The voice asks, “What guarantee do you offer?”',
    ],
    choices: [
      {
        id: 'c8-public-compact-no-names',
        label: 'Accept only the spoken public terms and refuse every written mortal name.',
        detail: 'The agreement will be harder to enforce against either side after tonight.',
        advantage: 'Gain the white fire without giving the Compact a private claim on any defender.',
        addFlags: ['c8-compact-public-only'],
        result: 'The Compact accepts witnesses in place of names. White fire enters each fort only after its keeper says yes.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-cut-names-with-resolve',
        label: 'Hold the contract in your mind and cut out every mortal name.',
        detail: 'Spend 2 Resolve resisting a document that rewrites itself while you read.',
        advantage: 'Create a clear agreement that can punish broken actions, never claim individual souls.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-compact-binds-actions'],
        result: 'The letters crawl toward the people behind you. You force each line back to a place, action, or hour. When the contract closes, it knows no mortal name.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-ember-collateral',
        label: 'Let the Compact hold Vaor’s outer flame until the embassy leaves.',
        detail: 'Risk the dragon’s anger and use part of his ember as the agreement’s guarantee.',
        advantage: 'Keep every mortal outside the contract while making betrayal costly to both sides.',
        addFlags: ['c8-ember-held-as-collateral'],
        result: 'The white fire circles Vaor’s ember without taking it. The dragon’s fury fills your bones, but the contract cannot reach any mortal defender.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-sacrifice-route': {
    id: 'c8-sacrifice-route',
    kicker: 'One wall for seven',
    title: 'The Fall of First Fort',
    location: 'First Fort Evacuation Road',
    objective: 'Choose what leaves First Fort before its foundation collapses.',
    threat: 'Critical',
    art: 'futureless',
    body: () => [
      'Mara’s temporary aid station still holds wounded soldiers in First Fort. Its dry lower room holds furnace fuel and the complete copy Ansel sent out with Pell’s warning. The narrow evacuation bridge can carry people or records before the foundation falls, not both without help.',
      'The Gate widens another finger. Red light enters the fort windows. Every heartbeat spent here gives the other side more road.',
      'You feel the lost fort through the stones before it falls. You chose the sacrifice. You still decide what the sacrifice means.',
    ],
    choices: [
      {
        id: 'c8-command-full-evacuation',
        label: 'Spend authority on a timed chain that carries wounded people and records together.',
        detail: 'Spend 2 Command coordinating a narrow evacuation with no room for panic.',
        advantage: 'Save every person and the duplicate Crown evidence before the fort falls.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-first-fort-fully-evacuated'],
        result: 'Stretchers move between shield teams while records travel inside empty fuel drums. The last soldier clears the bridge as the first foundation stone drops.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-carry-wounded-from-fort',
        label: 'Carry the last wounded wardens while the duplicate records burn.',
        detail: 'Lose 2 Health saving people after the formal evacuation ends.',
        advantage: 'No living person becomes part of the fort’s price.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-saved-first-fort-wounded', 'c8-lost-duplicate-records'],
        result: 'Stone falls behind each step. You carry the final warden across your shoulders. The copied reports catch fire in the empty record room.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-oath-memory-of-fort',
        label: 'Bind the fort’s records into its signal bell before the walls fall.',
        detail: 'Spend 2 Oathfire preserving proof as a memory any witness can hear.',
        advantage: 'Save the wounded and turn the lost fort into evidence that cannot be quietly stolen.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-first-fort-became-witness'],
        result: 'The bell rings once as the fort collapses. Every person in the ring hears seventeen opening dates and seventeen hidden Crown replies inside the note.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-save-people-abandon-proof',
        label: 'Evacuate every living person and leave all records behind.',
        detail: 'Give Malrec room to deny the past so nobody dies protecting paper.',
        advantage: 'Complete the fastest evacuation and close the ring before the Gate widens again.',
        addFlags: ['c8-first-fort-people-first', 'c8-lost-duplicate-records'],
        result: 'You do not ask anyone to die for a ledger. The last stretcher clears the bridge. First Fort folds into the buried chain with its records inside.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-collector-crossing': {
    id: 'c8-collector-crossing',
    kicker: 'The bargain comes to collect',
    title: 'One Arm Through the Gate',
    location: 'The Black Gate Inner Ring',
    objective: 'Stop a rival devil house from taking the Futureless contracts.',
    threat: 'Critical',
    art: 'futureless',
    body: (state) => [
      routeOutcome(state),
      'A long arm enters through the gap. It wears six brass rings and a black glove stitched with the names of Fourth Fort’s soldiers. No army follows. The collector needs only to touch the contracts and pull every sold promise into the Gate at once.',
      'Ansel tries to burn the papers. The black ink crawls away from the flame and toward the reaching fingers.',
      'You feel the collector searching through every promise around you. It pauses at your Oaths as if recognising a scent. Then it changes direction and reaches for your chest.',
      collectorBarrier(state),
    ],
    choices: [
      {
        id: 'c8-cut-collector-hand',
        label: 'Enter the furnace wind and cut the collector’s hand from the contracts.',
        detail: 'Lose 2 Health reaching the arm before it touches your Oaths.',
        advantage: 'Drive the collector back and keep every Futureless contract on the mortal side.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-severed-collector-hand'],
        result: 'The glove closes around the heat above your heart. Your sword reaches the wrist first. The severed hand becomes ash, leaving one brass ring in the snow.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-command-contract-shield',
        label: 'Build a moving shield line around Ansel and the contracts.',
        detail: 'Spend 2 Command coordinating soldiers whose names the collector can call aloud.',
        advantage: 'Protect the wardens while capturing the glove and its written list as evidence.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-captured-collector-glove'],
        result: 'Shields turn whenever the glove reaches. The collector calls names, but the soldiers answer one another instead. Mara pins the empty glove beneath her shield as the arm withdraws.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-oath-names-belong-to-living',
        label: 'Swear that no name in the yard belongs to a contract before it belongs to its living bearer.',
        detail: 'Spend 2 Oathfire forcing the collector to face every person as a choice, not property.',
        advantage: 'Break its hold on the Futureless names and preserve the contracts as proof.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-freed-futureless-names'],
        result: 'Gold fire removes each name from the black glove and returns it to the person who speaks it. The collector recoils from eighty separate choices.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-let-ansel-refuse-collection',
        label: 'Let Ansel refuse the collector’s demand for another payment.',
        detail: 'Use the complete ledger or refusal test to prove the limit while the collector is close enough to kill him.',
        advantage: 'Repel the claim without spending your strength and prove the Futureless never owed more than the named promise.',
        showIfAnyFlags: ['c8-complete-futureless-ledger', 'c8-futureless-choice-proven'],
        addFlags: ['c8-ansel-refused-second-price'],
        result: 'Ansel steps between the hand and the papers. “One named promise. Nothing more.” The brass rings crack. The collector jerks backward, beaten by the limit it wrote itself.',
        next: 'c8-oath-ledger',
      },
    ],
  },

  'c8-oath-ledger': {
    id: 'c8-oath-ledger',
    kicker: 'Every promise at once',
    title: 'What You Cannot Keep for Free',
    location: 'The Black Gate Threshold',
    objective: 'Keep the defence intact when the Gate pulls on every active Oath you carry.',
    threat: 'Critical',
    art: 'embassy',
    lesson: {
      title: 'The visible Oath ledger',
      body: 'The Gate is pulling every active Oath at once. Four physical choices can break that pull: the key to Caelan’s old home, his Crown badge, his Warden whistle, or the hand of the companion who steps forward. Each saves the defence by placing a different future at risk.',
    },
    body: (state) => [
      'The eight fires hold the gap at one person wide. Then the Gate changes its attack.',
      'Every Oath inside you pulls in a different direction. Greyhaven drags west. Vaor’s ember burns north. The steppe alliance holds behind you. Pell’s life, if you bound it, beats from Fourth Fort. The people at the threshold need you here.',
      'The trap becomes physical inside you. The Gate does not need to break your promises. It can make each one demand you at the same moment until choice becomes impossible.',
      'Your father’s old inn key hangs beneath your armour. It represents the hope that you can return and become the man who left. Your cracked Crown badge carries the Oath of service you swore to Asterra.',
      'Beside the badge hangs your Warden whistle. When you became captain, you promised to answer any Warden who sounded it. The promise once made you reliable. Here, the Gate can make every call sound at once.',
      `${endangeredCompanion(state)} steps close enough to share the burden if you ask. The choice now has a key, a badge, a whistle, and a person attached to it.`,
    ],
    choices: [
      {
        id: 'c8-surrender-homecoming',
        label: 'Place your father’s inn key in the Gate and surrender your old homecoming.',
        detail: 'Give up the private future in which this ends and your former life returns unchanged.',
        advantage: 'All active duties remain intact and the Gate can no longer pull them in opposite directions.',
        addFlags: ['c8-surrendered-homecoming'],
        result: 'You press the worn key into the red gap. It melts without heat. The old picture of home goes with it: the same rooms, the same uniform, the same person you were before the road changed. The grief is real. So is the freedom that follows it.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-release-crown-oath',
        label: 'Release your oldest Oath of service to Asterra.',
        detail: 'Spend 2 Resolve surviving the backlash. Crown law will call you an oathbreaker.',
        advantage: 'Keep your chosen future and every promise made freely during this journey.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-released-crown-oath'],
        result: 'You say the release clearly. The silver tree on your old badge splits. Pain crosses your chest, but the Crown can no longer pull your duty against the people before you.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-burn-lesser-oath',
        label: 'Burn the Warden promise tied to your old patrol whistle.',
        detail: 'Spend 2 Oathfire ending the duty to answer every Warden call, no matter who sounds it.',
        advantage: 'Preserve your personal future and the great Oaths protecting people now.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-burned-lesser-oath'],
        result: 'You place the brass whistle inside Vaor’s ember. It burns without sound. You may still answer any call you choose, but no magic can drag you toward all of them. The Gate closes one finger width around the freedom it failed to take.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-mara',
        label: 'Ask Mara to carry one Oath beside you.',
        detail: 'Mara freely takes part of the burden and receives a mark the Gate may find again.',
        advantage: 'Keep every promise and your personal future at the cost of exposing Mara to the Gate.',
        showIfRelationshipIntents: { mara: ['exploring', 'committed'] },
        addFlags: ['c8-shared-oath-burden', 'c8-shared-oath-mara'],
        result: 'You ask Mara by name. She says yes before taking your hand. One strand of gold fire crosses into her palm, where a black mark remains. The Gate releases you and learns how to find her.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-lysara',
        label: 'Ask Lysara to carry one Oath beside you.',
        detail: 'Lysara freely takes part of the burden and receives a mark the Gate may find again.',
        advantage: 'Keep every promise and your personal future at the cost of exposing Lysara to the Gate.',
        showIfRelationshipIntents: { lysara: ['exploring', 'committed'] },
        addFlags: ['c8-shared-oath-burden', 'c8-shared-oath-lysara'],
        result: 'You ask Lysara by name. She weighs the danger, then says yes and takes your hand. One strand of gold fire crosses into her palm, where a black mark remains. The Gate releases you and learns how to find her.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-korran',
        label: 'Ask Korran to carry one Oath beside you.',
        detail: 'Korran freely takes part of the burden and receives a mark the Gate may find again.',
        advantage: 'Keep every promise and your personal future at the cost of exposing Korran to the Gate.',
        showIfRelationshipIntents: {
          mara: ['unresolved', 'interested', 'platonic', 'ended'],
          lysara: ['unresolved', 'interested', 'platonic', 'ended'],
        },
        addFlags: ['c8-shared-oath-burden', 'c8-shared-oath-korran'],
        result: 'You ask Korran by name. He studies the Gate, then grips your hand by choice. One strand of gold fire crosses into his palm, where a black mark remains. The Gate releases you and learns how to find him.',
        next: 'c8-embassy-terms',
      },
    ],
  },

  'c8-embassy-terms': {
    id: 'c8-embassy-terms',
    kicker: 'The first open crossing',
    title: 'Vexa Ash',
    location: 'The Black Gate Threshold',
    objective: 'Decide whether the first public devil embassy enters Edrath.',
    threat: 'Immediate',
    art: 'embassy',
    introducesStoryTerms: ['Vexa Ash'],
    body: (state) => [
      'The hostile opening is contained. No army crossed, and the gap has narrowed to the width of one person.',
      ...pellOathOutcome(state),
      'A white ember holds that final space long enough for one envoy to request the promised meeting. It cannot widen the Gate again.',
      'A woman steps to the far side carrying a white ember lantern. Swept black horns rise through dark hair. Her armour is deep red, cut for ceremony rather than battle, and every weapon behind her has been sealed inside a brass case.',
      vexaGreeting(state),
      'Ansel’s soldiers raise bows. Your own ranks wait for an order. Vexa’s gaze passes over the bows and banners until it finds you.',
      '“I came to speak with Caelan Vey. Someone in my world prepared a claim on his future before he wrote his first Oath. It owns nothing yet. They intend to change that.”',
    ],
    choices: [
      {
        id: 'c8-receive-vexa-publicly',
        label: 'Receive Vexa and her embassy before every witness.',
        detail: 'Allow the crossing under a public agreement, with both armies watching and every weapon sealed.',
        advantage: 'Begin diplomacy without secrecy and force Vexa’s warning into the public record.',
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-entered-publicly'],
        result: 'You lower your sword first. Vexa crosses beneath the white lantern, and every witness sees exactly who welcomed her and what she carried.',
        next: 'c8-ending-embassy',
      },
      {
        id: 'c8-hear-vexa-at-threshold',
        label: 'Keep the embassy beyond the Gate and hear Vexa at the threshold.',
        detail: 'Grant speech and safe return, but no entry into the mortal fortress ring tonight.',
        advantage: 'Learn the warning while preserving a clear physical boundary until trust is tested.',
        hideIfAnyFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-held-at-threshold'],
        result: 'You approach alone until one step separates snow from ash. Vexa accepts the boundary and opens a sealed case filled with contracts bearing your name.',
        next: 'c8-ending-threshold',
      },
      {
        id: 'c8-receive-vexa-outer-fort',
        label: 'Honour the agreement inside an isolated outer fort.',
        detail: 'Allow the peaceful embassy to enter and leave, but receive it away from the wounded and the lock rooms.',
        advantage: 'Keep your exact promise while limiting what the envoys can reach or study.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-received-outer-fort'],
        result: 'You open a controlled road to empty Second Fort. Vexa and two sealed envoys cross beneath raised bows, then enter the isolated yard without protest.',
        next: 'c8-ending-threshold',
      },
      {
        id: 'c8-give-ansel-first-question',
        label: 'Let Ansel ask the first question on behalf of the Futureless.',
        detail: 'Keep Vexa outside for now and place the harmed wardens at the centre of the meeting.',
        advantage: 'The embassy must face the people already used by devil bargains before negotiating with rulers.',
        hideIfAnyFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-ansel-spoke-first'],
        result: 'Ansel lowers his crossbow and asks which house bought his daughter’s future promise. Vexa remains beyond the threshold. “The same house has prepared a claim for Captain Vey,” she says. “His is not complete yet.”',
        next: 'c8-ending-witness',
      },
      {
        id: 'c8-give-ansel-first-question-after-entry',
        label: 'Honour the entry agreement, then let Ansel ask the first question.',
        detail: 'Bring the sealed embassy into the outer yard and place the harmed wardens at the centre of the meeting.',
        advantage: 'Keep your exact promise while making the embassy answer the Futureless before negotiating with rulers.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-ansel-spoke-first', 'c8-ansel-spoke-first-after-entry'],
        result: 'Vexa and two sealed envoys cross into the outer yard. Ansel asks which house bought his daughter’s future promise. “The same house has prepared a claim for Captain Vey,” Vexa says. “His is not complete yet.”',
        next: 'c8-ending-witness',
      },
    ],
  },

  'c8-ending-embassy': {
    id: 'c8-ending-embassy',
    kicker: 'Chapter Eight complete',
    title: 'The Door Kept Open',
    location: 'Fourth Fort Embassy Hall',
    objective: 'Learn who prepared a claim on Caelan’s future.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      'For the first time in Asterra’s recorded history, a devil embassy sits at a mortal table under a public agreement. Soldiers keep their weapons. The envoys keep theirs sealed. Nobody mistakes peace for trust.',
      'You feel the room waiting for you to mistake survival for safety. You do not.',
      routeOutcome(state),
      oathCost(state),
      'Vexa places seventeen contracts beside the Crown ledgers. The seals belong to different rulers, different devil houses, and one hand that appears on both sides of the Gate.',
      'She turns the final page toward you. It is a prepared claim, older than your first command, carrying your full name but not your agreement.',
      'The price is blank. The page owns nothing yet. Someone has been studying your choices so they can offer the one bargain you may accept.',
    ],
    choices: [],
  },

  'c8-ending-threshold': {
    id: 'c8-ending-threshold',
    kicker: 'Chapter Eight complete',
    title: 'The Boundary You Chose',
    location: 'The Black Gate Outer Ring',
    objective: 'Learn who prepared a claim on Caelan’s future.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      vexaMeetingStatus(state),
      'Your attention stays on her sealed cases. A peaceful object can still carry a dangerous truth.',
      routeOutcome(state),
      oathCost(state),
      has(state, 'c8-vexa-received-outer-fort')
        ? 'Inside the isolated fort yard, Vexa opens the first brass case. It holds copies of bargains made during seventeen hidden Gate openings and one unfinished contract claim prepared long before them.'
        : 'Without crossing, Vexa opens the first brass case. It holds copies of bargains made during seventeen hidden Gate openings and one unfinished contract claim prepared long before them.',
      'Your name is written at its top, but no price or agreement appears beneath it. The claim owns nothing yet.',
      '“That is why they changed your road,” Vexa says. “They needed to learn what you would choose before they chose what to take.”',
    ],
    choices: [],
  },

  'c8-ending-witness': {
    id: 'c8-ending-witness',
    kicker: 'Chapter Eight complete',
    title: 'The Promise Not Yet Sold',
    location: 'Fourth Fort Gate Yard',
    objective: 'Learn who prepared a claim on Caelan’s future.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      vexaMeetingStatus(state),
      'Ansel stands between two worlds and asks the question rulers avoided for seventeen years. Vexa answers him before she answers you. The house that bought the wardens’ future promises also paid mortal officials to hide every opening.',
      'You watch his shoulders settle as the answer gives his anger a name.',
      routeOutcome(state),
      oathCost(state),
      'Only after the Futureless have heard the truth does Vexa place a separate contract draft in your hands.',
      'It carries your full name, written before you became an Oathwarden. The price and your agreement remain blank. It is a trap being prepared, not a bargain already made.',
      'Somewhere beyond the Gate, something is still waiting to learn which future will hurt you most to lose.',
    ],
    choices: [],
  },
};
