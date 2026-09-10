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
  if (has(state, 'c8-deployed-full-march')) {
    return 'The Crown March occupies all eight outer yards. The forts are no longer empty, but divided officers now stand close to every lock.';
  }
  if (has(state, 'c8-deployed-volunteers')) {
    return 'Volunteers hold the three strongest approaches while empty towers remain between them. Every defender chose a post, and every gap is visible.';
  }
  return 'Small teams place lamps and warning cords instead of pretending they can hold every wall. You will hear an attack early, but stopping it will depend on speed.';
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
    return 'Seven signal fires answer the eighth. The defence belongs to mortal hands, and no hidden contract stands inside it.';
  }
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'White fire joins the forts in a clean circle. It holds because you granted one devil faction an open road for a peaceful embassy.';
  }
  return 'First Fort falls inward exactly as planned. Its stone and stored fire run through buried channels into the other seven. The ring survives with a permanent gap.';
}

function oathCost(state: GameState) {
  if (has(state, 'c8-surrendered-homecoming')) {
    return 'You kept every active Oath by giving up the private hope that life could return to what it was before the changed order. Home may exist ahead of you. It no longer exists behind you.';
  }
  if (has(state, 'c8-released-crown-oath')) {
    return 'You released your oldest promise of service to Asterra. The backlash still shakes your hands, but Malrec and the throne can no longer claim that Oath as a chain.';
  }
  if (has(state, 'c8-burned-lesser-oath')) {
    return 'One lesser promise is ash inside Vaor’s ember. The greater Oaths survived, and something beyond the Gate now knows that your duties can burn.';
  }
  return `${endangeredCompanion(state)} carries one strand of your Oath through a fresh black mark on the palm. You kept your future, but the Gate can now feel someone you love or trust.`;
}

export const chapterEightNodes: Record<string, StoryNode> = {
  'c8-gate-ring': {
    id: 'c8-gate-ring',
    kicker: 'Chapter Eight',
    title: 'Eight Empty Forts',
    location: 'The Black Gate Fortress Ring',
    objective: 'Reach the only occupied fort before the Gate opens. | Learn why the other seven were abandoned',
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
      'The Gate knocks again. The sound passes through your boots and closes around your heart. Every Oath you carry answers with a separate line of heat.',
      'A small figure runs from Fourth Fort. Halfway across the open ground, the snow behind him erupts in a straight red line. He is a boy in a Warden coat, and something beneath the ice is following his footsteps toward you.',
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
    title: 'The Boy Who Cannot Promise',
    location: 'The Ground Between Forts',
    objective: 'Keep the runner alive long enough to understand his warning. | The next knock is close',
    threat: 'Immediate',
    art: 'blackgate',
    introducesStoryTerms: ['Futureless'],
    body: () => [
      'The boy is older than he looked from the ridge, perhaps seventeen. A brass plate on his coat names him Pell. He grips your wrist and tries to speak.',
      '“Fourth Fort still has eighty soldiers. Captain Ansel sent me because the others cannot leave. They made bargains during the old openings.”',
      'He swallows blood. “They are not possessed. They know their names. They can choose most things. But each of them sold one promise they would make in the future.”',
      'Pell gives an example because your face demands one. A father sold the promise he would make when his daughter returned from war. He can love her. He can protect her. But when she asks whether he will stay, the words will not come. The bargain owns that future promise before he can speak it.',
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
        label: 'Promise that Pell will see the Gate close tonight.',
        detail: 'Gain 2 Oathfire by accepting a new duty that fails if Pell dies or the Gate stays open.',
        advantage: 'The Oath steadies his failing heart and gives you power for the defence.',
        changes: { oathfire: 2 },
        addFlags: ['c8-oath-pell-sees-gate-close', 'c8-pell-survived'],
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
    objective: 'Place your available force before entering Fourth Fort. | Do not pretend you have soldiers you lack',
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
        id: 'c8-deploy-crown-march',
        label: 'Place the Crown March across all eight forts under paired officers.',
        detail: 'Use the numbers you accepted and pair every royal officer with a volunteer witness.',
        advantage: 'Every fort is staffed, while divided authority makes a hidden takeover harder.',
        requiresFlags: ['c7-gained-full-army'],
        addFlags: ['c8-deployed-full-march'],
        result: 'The army divides into eight columns. No officer receives a lock alone. It slows the deployment, but every command now has a second pair of eyes.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-deploy-chosen-company',
        label: 'Concentrate the chosen company in three forts and leave clear warning lines between them.',
        detail: 'Accept five empty forts instead of stretching volunteers until every post becomes weak.',
        advantage: 'Three strong positions can rescue each other and no defender stands alone.',
        requiresFlags: ['c7-gained-chosen-company'],
        addFlags: ['c8-deployed-volunteers'],
        result: 'Your company takes the western, northern, and southern approaches. Lamps and bell wire mark the empty ground between them.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-deploy-small-teams',
        label: 'Build warning posts and keep your small force mobile.',
        detail: 'You cannot hold the ring, so you prepare to reach whichever wall breaks first.',
        advantage: 'Your few fighters stay together and can answer one crisis with full strength.',
        requiresFlags: ['c7-gained-dangerous-reputation'],
        addFlags: ['c8-deployed-mobile-teams'],
        result: 'You leave no false garrisons. Bells, lamps, and marked snow will tell you where the danger begins. Every fighter stays within one hard ride.',
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
      'Ansel sold the words he meant to speak when his daughter came home: I will never leave you again. Another soldier sold the promise to guard this fort if every other post fell. That missing promise is why seven forts stand empty.',
      'You feel anger arrive before judgment. These people did not trade the kingdom for comfort. They were abandoned during secret openings and paid whatever kept someone alive.',
      'A black mark moves across one contract. It is counting down to sunset.',
    ],
    choices: [
      {
        id: 'c8-list-every-sold-promise',
        label: 'Record every sold promise before deciding whom to trust.',
        detail: 'Spend precious time building an exact list of what the bargains can and cannot touch.',
        advantage: 'No later command will accidentally depend on a promise already owned.',
        addFlags: ['c8-complete-futureless-ledger'],
        result: 'You listen to all eighty accounts. The list is painful, specific, and useful. Fear becomes a set of known limits instead of a shadow over every face.',
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
      'That is why the forts are empty. The Crown did not lose them in one attack. It slowly removed witnesses, delayed supplies, and left the remaining wardens desperate enough to bargain for survival.',
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
    kicker: 'The yearly opening begins early',
    title: 'When the Wall Breathes',
    location: 'Fourth Fort Inner Yard',
    objective: 'Save the yard before the first opening breath reaches the powder room.',
    threat: 'Critical',
    art: 'futureless',
    body: () => [
      'The Gate inhales.',
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
        detail: 'Risk both dangers on people the Crown called compromised.',
        advantage: 'The Futureless prove they can protect the fort without promises or borrowed authority.',
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
      body: 'The beings beyond the Black Gate are commonly called devils. They have rival houses, laws, and political factions. The Ash Compact is one faction that opposes a forced invasion because tearing the Gate open would damage both worlds. Their help is contractual, never free, and their exact words matter.',
    },
    body: () => [
      'A white ember appears on the far side of the red crack. It gives no heat. A woman’s voice speaks through it in careful Asterra trade speech.',
      '“The hand pushing your Gate does not belong to the Ash Compact. We prefer a door with witnesses to a wound with armies.”',
      'The speaker offers enough white fire to join the eight fort locks for one night. In return, the Compact wants safe passage for a peaceful embassy after the Gate is stable. No hidden travellers. No weapons raised first. Every term spoken in public.',
      'Ansel stares at the ember. Some of his soldiers bargained with other devil houses because no mortal help came. Their fear is not foolish. Neither is the chance before you.',
      'You notice that the voice asks to be heard, not trusted. The ember waits, then asks one question. “Will Caelan Vey hear our terms before deciding whether our existence is a crime?”',
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
        advantage: 'Prove that the Compact’s offer contains no unspoken clause, while revealing one of your Oaths to them.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c8-tested-ash-terms'],
        result: 'Gold fire closes around the white ember. No hidden clause appears. The voice beyond the Gate learns the shape of one promise you carry and thanks you for the introduction.',
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
    body: () => [
      'The fort map shows one simple defence. Each signal basket feeds heat into a buried iron chain. When all eight links glow, the ring holds the Black Gate shut.',
      'Seven baskets are cold. Two fuel stores are flooded. One chain section lies beneath open ground already splitting with red heat.',
      'Lysara can wake dead roots beneath the chain. Ansel knows the old furnace route. Mara can lead a repair line across exposed snow. You can protect only one method from the Gate’s next breath.',
      'Your attention keeps returning to the exposed chain section. The opening horn sounds. Sunset touches the top of the black wall.',
    ],
    choices: [
      {
        id: 'c8-root-lift-chain',
        label: 'Use Lysara’s living seed to lift the broken chain from below.',
        detail: 'Weaken the seed’s future treaty magic to repair the safest underground route.',
        advantage: 'Restore the chain without exposing soldiers on the open ground.',
        addFlags: ['c8-chain-lifted-by-seed'],
        result: 'Green roots rise beneath the iron and carry it across the flooded gap. The seed dims, but the chain closes link by link.',
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
        detail: 'Place the central repair in Futureless hands without an Oath or royal command.',
        advantage: 'Preserve every magical resource and restore the wardens’ ownership of their fort.',
        addFlags: ['c8-ansel-restored-chain'],
        result: 'Ansel takes twenty soldiers into the smoke passage. They return black with soot and carrying the missing chain pin between them. They needed tools, not redemption.',
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
    body: () => [
      'The Gate opens at sunset.',
      'First comes a red line. Then the two halves move apart by the width of one hand. Through the gap, you see a city of black towers beneath an orange sky. A hot wind carries voices speaking in several languages.',
      'The yearly opening lasts one hour. It has happened seventeen times. Every earlier year, the gap widened. Tonight someone beneath the Gate is pulling on the stolen future promises to force it farther.',
      'The eight signal fires answer, but the defence lacks one thing: people or power at every link. You can unite the remaining wardens, accept the Ash Compact’s white fire, or destroy one fort so its stored strength feeds the other seven.',
      'You know each path can hold the Gate tonight. The choice decides what is spent and who owns the defence afterward.',
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
        detail: 'Place the defence in the hands of the captain who survived all seventeen openings.',
        advantage: 'Use local knowledge no outside commander possesses and restore Ansel’s public honour.',
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
      'Eight white embers wait beyond the crack. The Compact repeats its price: one peaceful embassy may cross after the Gate is stable, speak under safe conduct, and return unharmed if it keeps the same terms.',
      'It asks whether mortal names may be written into the contract. Names would make enforcement easier. They would also give the Compact a lasting hold on everyone listed.',
      'You can keep the agreement public and broad, spend your strength cutting every mortal name from it, or place Vaor’s ember as temporary collateral until the embassy returns. The voice asks, “What may stand as surety?”',
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
        advantage: 'Create a precise enforceable agreement that binds offices and actions, never individual souls.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-compact-binds-actions'],
        result: 'The letters crawl toward the people behind you. You force each line back to a place, action, or hour. When the contract closes, it knows no mortal name.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-ember-collateral',
        label: 'Offer Vaor’s ember as collateral until the embassy returns.',
        detail: 'Risk the dragon’s anger and let the Compact touch the ember’s outer flame.',
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
      'First Fort holds wounded soldiers, furnace fuel, and the only complete set of Crown opening reports copied before Ansel hid his own. The foundation can carry people or records before it falls, not both without help.',
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
    objective: 'Stop a rival devil house from taking the Futureless contracts. | Keep the defence intact',
    threat: 'Critical',
    art: 'futureless',
    body: (state) => [
      routeOutcome(state),
      'A long arm enters through the gap. It wears six brass rings and a black glove stitched with the names of Fourth Fort’s soldiers. No army follows. The collector needs only to touch the contracts and pull every sold promise into the Gate at once.',
      'Ansel tries to burn the papers. The black ink crawls away from the flame and toward the reaching fingers.',
      'You feel the collector searching through every promise around you. It pauses at your Oaths as if recognising a scent. Then it changes direction and reaches for your chest.',
      'The Ash Compact’s white fire holds the gap but cannot strike without breaking its public terms. This defence is still yours to finish.',
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
        label: 'Let Ansel use the one right written into every contract: refusal of a second price.',
        detail: 'Trust a narrow legal protection while the collector is close enough to kill him.',
        advantage: 'Repel the claim without spending your strength and prove the Futureless never owed more than the named promise.',
        addFlags: ['c8-ansel-refused-second-price'],
        result: 'Ansel steps between the hand and the papers. “One promise. No second price.” The brass rings crack. The collector jerks backward, beaten by words it wrote itself.',
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
      body: 'The Gate is pulling on every binding promise Caelan still carries: protect the escort, expose the Crown plot, honour any pact with Vaor, defend the steppe alliance, and keep Pell alive if that Oath was made. He cannot keep all of them in their old form without surrendering something personal, releasing one duty, burning a lesser promise, or sharing one burden with a willing companion.',
    },
    body: (state) => [
      routeOutcome(state),
      'The red gap stops widening. Then the Gate changes its attack.',
      'Every Oath inside you pulls in a different direction. Greyhaven drags west. Vaor’s ember burns north. The steppe alliance holds behind you. Pell’s life, if you bound it, beats from Fourth Fort. The people at the threshold need you here.',
      'The trap becomes physical inside you. The Gate does not need to break your promises. It can make each one demand you at the same moment until choice becomes impossible.',
      'To keep every major duty alive, you must give up the hope that your old life will return unchanged. Or you can release one old duty, burn a lesser promise, or let a willing companion carry part of the danger.',
    ],
    choices: [
      {
        id: 'c8-surrender-homecoming',
        label: 'Keep every Oath and surrender the hope of returning to your former life.',
        detail: 'Give up the private future in which this ends and everything becomes as it was.',
        advantage: 'All active duties remain intact and the Gate loses the contradiction it was pulling apart.',
        addFlags: ['c8-surrendered-homecoming'],
        result: 'You let the old picture of home burn: the same rooms, the same uniform, the same person you were before the road changed. The grief is real. So is the freedom that follows it.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-release-crown-oath',
        label: 'Release your oldest Oath of service to Asterra.',
        detail: 'Spend 2 Resolve surviving the backlash and become oath broken in the eyes of Crown law.',
        advantage: 'Keep your chosen future and every promise made freely during this journey.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-released-crown-oath'],
        result: 'You say the release clearly. The silver tree on your old badge splits. Pain crosses your chest, but the Crown can no longer pull your duty against the people before you.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-burn-lesser-oath',
        label: 'Burn one lesser promise inside Vaor’s ember.',
        detail: 'Spend 2 Oathfire destroying a duty that once mattered but no longer decides the world.',
        advantage: 'Preserve your personal future and the great Oaths protecting people now.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-burned-lesser-oath'],
        result: 'You choose one promise that has already done its work and feed it to the ember. The fire takes it. The Gate closes one finger width, satisfied by a loss it did not choose.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-burden',
        label: 'Let a willing companion carry one Oath beside you.',
        detail: 'A willing companion takes part of the burden and receives a mark the Gate may find again.',
        advantage: 'Keep every promise and the personal future you named, at the cost of exposing someone you trust.',
        addFlags: ['c8-shared-oath-burden'],
        result: 'A hand closes around yours. One strand of gold fire crosses into another palm. The Gate releases you, but a black mark remains where the promise entered.',
        next: 'c8-embassy-terms',
      },
    ],
  },

  'c8-embassy-terms': {
    id: 'c8-embassy-terms',
    kicker: 'The first open crossing',
    title: 'Vexa Ash',
    location: 'The Black Gate Threshold',
    objective: 'Decide how the first public devil embassy enters Edrath. | Final choice',
    threat: 'Immediate',
    art: 'embassy',
    introducesStoryTerms: ['Vexa Ash'],
    body: (state) => [
      routeOutcome(state),
      oathCost(state),
      'The hour ends. The Gate should close. Instead, it remains open by the width of one person.',
      'A woman steps to the far side carrying a white ember lantern. Swept black horns rise through dark hair. Her armour is deep red, cut for ceremony rather than battle, and every weapon behind her has been sealed inside a brass case.',
      '“Vexa Ash,” she says. “Voice of the Ash Compact. We request the safe conduct offered, refused, or made possible by your defence. We will cross only under terms spoken here.”',
      'Ansel’s soldiers raise bows. Your own ranks wait for an order. Vexa looks past every crown, ambassador, dragon, and captain until her gaze finds you.',
      '“I came to speak with Caelan Vey. Someone in my world has been buying his future since before he wrote his first Oath.”',
    ],
    choices: [
      {
        id: 'c8-receive-vexa-publicly',
        label: 'Receive Vexa and her embassy before every witness.',
        detail: 'Allow the crossing under visible safe conduct with both armies watching.',
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
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-held-at-threshold'],
        result: 'You approach alone until one step separates snow from ash. Vexa accepts the boundary and opens a sealed case filled with contracts bearing your name.',
        next: 'c8-ending-threshold',
      },
      {
        id: 'c8-give-ansel-first-question',
        label: 'Let Ansel ask the first question on behalf of the Futureless.',
        detail: 'Delay your own answer and place the harmed wardens at the centre of the meeting.',
        advantage: 'The embassy must face the people already used by devil bargains before negotiating with rulers.',
        changes: { wayfire: 2 },
        addFlags: ['c8-ansel-spoke-first'],
        result: 'Ansel lowers his crossbow and asks which house bought his daughter’s future promise. Vexa’s expression changes. “The same house that bought Captain Vey’s,” she says.',
        next: 'c8-ending-witness',
      },
    ],
  },

  'c8-ending-embassy': {
    id: 'c8-ending-embassy',
    kicker: 'Chapter Eight complete',
    title: 'The Door Kept Open',
    location: 'Fourth Fort Embassy Hall',
    objective: 'Learn who bought Caelan’s unwritten future. | Path recorded',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      'For the first time in Asterra’s recorded history, a devil embassy sits at a mortal table under open safe conduct. Soldiers keep their weapons. The envoys keep theirs sealed. Nobody mistakes peace for trust.',
      'You feel the room waiting for you to mistake survival for safety. You do not.',
      routeOutcome(state),
      oathCost(state),
      'Vexa places seventeen contracts beside the Crown ledgers. The seals belong to different rulers, different devil houses, and one hand that appears on both sides of the Gate.',
      'She turns the final page toward you. The contract is older than your first command and carries your full name.',
      'The line naming its price is still blank.',
    ],
    choices: [],
  },

  'c8-ending-threshold': {
    id: 'c8-ending-threshold',
    kicker: 'Chapter Eight complete',
    title: 'One Step Between Worlds',
    location: 'The Black Gate Threshold',
    objective: 'Learn who bought Caelan’s unwritten future. | Path recorded',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      'Snow gathers behind your boots. Warm ash gathers beyond Vexa’s. The boundary between worlds remains one step wide because you chose to keep it visible.',
      'Your attention stays on her sealed cases. A peaceful object can still carry a dangerous truth.',
      routeOutcome(state),
      oathCost(state),
      'Vexa opens the first brass case without crossing. Inside are copies of bargains made during seventeen hidden Gate openings and one contract prepared long before them.',
      'Your name is written at its top. No promise appears beneath it yet.',
      '“That is why they changed your road,” Vexa says. “They needed to learn what you would choose before they chose what to take.”',
    ],
    choices: [],
  },

  'c8-ending-witness': {
    id: 'c8-ending-witness',
    kicker: 'Chapter Eight complete',
    title: 'The Promise Not Yet Sold',
    location: 'Fourth Fort Gate Yard',
    objective: 'Learn who bought Caelan’s unwritten future. | Path recorded',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    body: (state) => [
      'Ansel stands between two worlds and asks the question rulers avoided for seventeen years. Vexa answers him before she answers you. The house that bought the wardens’ future promises also paid mortal officials to hide every opening.',
      'You watch his shoulders settle as the answer gives his anger a name.',
      routeOutcome(state),
      oathCost(state),
      'Only after the Futureless have heard the truth does Vexa place a separate contract in your hands.',
      'It carries your full name, written before you became an Oathwarden. The price remains blank.',
      'Somewhere beyond the Gate, something is still waiting to learn which future will hurt you most to lose.',
    ],
    choices: [],
  },
};
