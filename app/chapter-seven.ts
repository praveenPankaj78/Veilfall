import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function supportOpening(state: GameState) {
  if (has(state, 'c6-red-moot-war')) {
    return 'All twelve platforms of Kharad Vey are turning east with you. Forge decks carry weapons, but homes, herds, and children move on the same wheels. Winning an army at the Red Moot also placed a city inside the battle.';
  }
  if (has(state, 'c6-red-moot-alliance')) {
    return 'Kharad Vey moves on a safer southern line. Korran rides beside you with forty volunteers, six wind callers, and two moving shield engines chosen by the Red Moot.';
  }
  return 'Kharad Vey keeps the neutral road you accepted. Three guides travel with you while the wheel town turns away from the Black Gate. The Crown army is following the town anyway.';
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
  if (state.relationships.mara.intent === 'committed'
    || state.relationships.mara.intent === 'exploring') return 'Mara';
  if (state.relationships.lysara.intent === 'committed'
    || state.relationships.lysara.intent === 'exploring') return 'Lysara';
  if (state.relationships.ilyra.intent === 'interested'
    || state.relationships.ilyra.intent === 'exploring') return 'Ilyra';
  return 'Korran';
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
  return 'Your companions take their places without pretending victory erased what the battle cost. Ilyra leaves to trace the hidden command from another road.';
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
    introducesStoryTerms: ['Crown March', 'dead command'],
    lesson: {
      title: 'Who is pursuing you',
      body: 'The Crown March is an army of Asterra, Caelan’s own kingdom. Regent Malrec commands it in the ill Queen’s name. Most soldiers believe they are arresting a traitor and recovering a stolen weapon. Dead command means a voice inside the ancestor storm is copying a dead officer and issuing orders that trained soldiers recognise.',
    },
    body: (state) => [
      'The Crown army reaches the western horizon at dawn. Dark blue banners rise above six thousand soldiers, supply wagons, and cavalry. These are not foreign invaders. They wear the silver tree of Asterra, the kingdom you still serve.',
      supportOpening(state),
      emberPressure(state),
      'A red storm moves over the army. Pale officers appear inside it, each wearing an older version of the Crown uniform. When one dead voice raises its hand, the living front line changes direction without waiting for a horn.',
      'Mara rides close enough to be heard over the wheels. “They think they are obeying legal orders. We need to survive them before we can prove which orders are lies.”',
      'Ahead, the steppe divides around a white salt basin and a line of black ridges. Behind, the first cavalry wave lowers its lances. Korran asks, “Where do you put the people who cannot fight?”',
    ],
    choices: [
      {
        id: 'c7-hide-noncombatants-wheel-shadow',
        label: 'Move the noncombatants into the shadow of Kharad Vey’s inner wheels.',
        detail: 'Use the city as cover while accepting that a broken axle could trap them.',
        advantage: 'The moving platforms block arrows and keep families close to their own rescue crews.',
        addFlags: ['c7-families-inside-wheels'],
        result: 'Families move into the inner lanes while wheel crews hang layered hide between the axles. They gain cover, but every turn now carries lives beneath it.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-command-southern-evacuation',
        label: 'Send a guarded evacuation south before the cavalry closes.',
        detail: 'Spend 1 Command separating vulnerable people from the battlefield.',
        advantage: 'The civilians gain distance from both armies and leave Caelan freer to manoeuvre.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-families-sent-south'],
        result: 'Your signal joins Korran’s. Riders form a moving wall around the southern column and carry the slowest wagons out of the army’s direct path.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-oath-no-crown-arrow',
        label: 'Promise that no Crown arrow will reach the living town while you stand.',
        detail: 'Spend 2 Oathfire tying your defence to every exposed platform.',
        advantage: 'The Oath gives broad protection and draws the army’s attention toward you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-shielded-town'],
        result: 'Gold light spreads along the outer rails. The first arrows curve toward your shield instead of the crowded decks. Their combined weight enters your promise.',
        next: 'c7-break-town-line',
      },
      {
        id: 'c7-turn-neutral-town-away',
        label: 'Put your party between the army and Kharad Vey’s neutral road.',
        detail: 'Lose 1 Health forcing the pursuit to follow your smaller target.',
        advantage: 'The wheel town gains a clean path away while the cavalry focuses on the ember.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c7-drew-pursuit-from-town'],
        result: 'You open the ember just enough to make every Crown glass point toward you. The cavalry turns. Kharad Vey gains distance while you become the centre of the hunt.',
        next: 'c7-break-town-line',
      },
    ],
  },

  'c7-break-town-line': {
    id: 'c7-break-town-line',
    kicker: 'The city and the army cannot share one road',
    title: 'Break the Pursuit Line',
    location: 'Kharad Vey, Western Running Deck',
    objective: 'Slow the first cavalry wave without killing soldiers who may not know the truth.',
    threat: 'Immediate',
    art: 'redwind',
    body: (state) => [
      'Crown outriders race beside the western decks. Their captain shouts that Caelan Vey is accused of murdering Commander Hale, stealing a royal weapon, and forcing Kharad Vey into rebellion.',
      'The accusations are built from real pieces. Hale died or vanished in Dragonspine. You carry the ember. The Red Moot chose its own road after you arrived. A frightened soldier can believe the shape without knowing who arranged it.',
      redMootForces(state),
      'Korran points to the red loose axle flag above the western deck. Steppe law requires every rider to halt when that warning rises near a moving town. Using it falsely will stain his authority, but the cavalry is already closing on the steering ropes.',
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
        label: 'Signal a false city turn and close the lane behind the cavalry.',
        detail: 'Spend 1 Command using the wheel signals learned in Kharad Vey.',
        advantage: 'The city traps the outriders without crushing them or exposing the inner decks.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-trapped-first-cavalry'],
        result: 'The outer wheels turn apart, invite the riders through, then close the lane with hanging shields. Forty cavalry surrender inside a wooden corridor.',
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
        result: 'Red gold light rises without heat. The horses refuse it and wheel away. Their riders fight for control instead of reaching the city.',
        next: 'c7-first-riders',
      },
      {
        id: 'c7-raise-false-axle-warning',
        label: 'Raise Kharad Vey’s loose axle warning.',
        detail: 'Use steppe safety law to stop the charge, at the cost of Korran’s credibility with other moving towns.',
        advantage: 'Even enemy cavalry must halt before a marked axle danger.',
        addFlags: ['c7-korran-spent-signal-trust'],
        result: 'The red flag rises. Every trained rider hauls back before an axle danger that does not exist. The charge tangles safely outside the steering ropes. Korran lowers the flag with a hard look. “Useful lie,” he says. “Expensive one.”',
        next: 'c7-first-riders',
      },
    ],
  },

  'c7-first-riders': {
    id: 'c7-first-riders',
    kicker: 'One soldier lowers his sword',
    title: 'The Man Who Heard Two Orders',
    location: 'The Running Deck Prison Line',
    objective: 'Question someone who can explain the army’s orders before the next wave arrives.',
    threat: 'Immediate',
    art: 'redwind',
    body: () => [
      'A young Crown lieutenant remains between the trapped horses. He lowers his sword when Mara calls his academy name. “Lio Var,” she says. “You trained three years below me.”',
      'Lio looks from her to the dead officer in the storm. “Marshal Evren ordered us to take the wheel town alive. Marshal Evren has been dead for nineteen years. Every signal still carries his private field mark.”',
      'The living army marshal, Teren Voss, is half a mile behind. Lio says Voss obeys Regent Malrec’s sealed orders, but the dead voice changes their timing whenever the storm thickens.',
      'You remember how it felt to receive your first order that pulled duty and conscience in opposite directions. You will not pretend Lio’s choice is easy.',
      'A second cavalry horn sounds. Lio asks, “Are you arresting me, Captain, or asking me to betray my army?”',
    ],
    choices: [
      {
        id: 'c7-bind-lio-as-prisoner',
        label: 'Bind Lio under ordinary prisoner law.',
        detail: 'Keep him secure and promise food, treatment, and a hearing after the battle.',
        advantage: 'A protected prisoner can testify later without being forced to change sides now.',
        addFlags: ['c7-lio-prisoner', 'c7-lio-alive'],
        result: 'You state his rights and bind his hands in front. Lio gives you his field packet because a lawful prisoner may surrender military papers.',
        next: 'c7-captured-soldier',
      },
      {
        id: 'c7-release-lio-with-question',
        label: 'Release Lio after asking him to compare the living and dead orders.',
        detail: 'Risk losing the witness so doubt can travel back through the Crown ranks.',
        advantage: 'Lio may weaken the army’s obedience from inside before the decisive battle.',
        addFlags: ['c7-lio-returned', 'c7-lio-alive'],
        result: 'You cut his reins free and return his sword. “Read both orders before you obey either.” Lio rides west carrying the question you cannot send by arrow.',
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
        result: 'Lio turns his cloak inside out and climbs onto the running deck. His hands shake, but his first order to the approaching riders is clear: verify the seal before striking civilians.',
        next: 'c7-captured-soldier',
      },
      {
        id: 'c7-let-ilyra-read-order-thread',
        label: 'Let Ilyra trace the pressure attached to Lio’s orders.',
        detail: 'Use Threadread on the document with Lio’s informed permission.',
        advantage: 'The thread may reveal which order came from Malrec and which came through the storm.',
        addFlags: ['c7-lio-consented-threadread', 'c7-lio-alive'],
        result: 'Lio gives permission and holds the packet himself. Ilyra finds two threads: black wax leading toward the Regent and red wind leading east toward the Gate.',
        next: 'c7-captured-soldier',
      },
    ],
  },

  'c7-captured-soldier': {
    id: 'c7-captured-soldier',
    kicker: 'The army believes a careful lie',
    title: 'Orders Signed in the Queen’s Name',
    location: 'Kharad Vey, Map Winch',
    objective: 'Separate the army’s genuine orders from the dead commands changing them.',
    threat: 'Rising',
    art: 'marshal',
    body: (state) => [
      'Lio’s field packet contains two sealed orders. The first carries the Regent’s genuine black wax and the authority he uses while the Queen is ill. It says Caelan murdered Hale and stole a royal ember. Most soldiers have no reason to know that accusation was prepared before Dragonspine.',
      'The second order is older. It moved the Crown March away from four Black Gate forts three weeks ago for a false invasion exercise. Marshal Teren was told another army would replace them. No replacement is named.',
      has(state, 'c5-has-extraction-order')
        ? 'The extraction order you carried from Dragonspine completes the sequence. Malrec planned to cut out Vaor’s ember while the same soldiers who should guard the Gate marched west.'
        : has(state, 'c5-royal-witnesses-turned')
          ? 'The royal witnesses from Dragonspine can confirm that Malrec’s private force was already cutting into Vaor while the Gate forts lost their army.'
          : 'You lack Malrec’s extraction paper, but the dates are enough. He emptied the Gate before anyone could call your ember theft an emergency.',
      'The dead commands are different. They contain Marshal Evren’s true field marks but no wax, paper, or living messenger. They arrive through the red storm and always push the army farther from the Gate.',
      'Your mind keeps returning to the dates. The order against you is an excuse. The abandoned forts are the plan.',
      'Lysara places both orders side by side. “Malrec moved the army. Something in the storm is making sure it stays here. Which truth do we carry into the fight first?”',
    ],
    choices: [
      {
        id: 'c7-copy-diversion-order',
        label: 'Copy the order that emptied the Black Gate forts.',
        detail: 'Prioritise proof of Malrec’s strategic betrayal over clearing your personal name.',
        advantage: 'Every copy can show soldiers that their real duty lies east, not in this pursuit.',
        addFlags: ['c7-copied-gate-diversion', 'c7-knows-malrec-emptied-gate'],
        result: 'Lysara copies the fort names, dates, and genuine seal. The evidence proves Malrec redirected the army before your alleged crime occurred.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-copy-false-charges',
        label: 'Copy the charges against you and mark each contradiction.',
        detail: 'Build the clearest case that the army is pursuing a manufactured traitor.',
        advantage: 'Clearing your name may make the soldiers willing to hear the larger Gate warning.',
        addFlags: ['c7-copied-false-charges', 'c7-knows-malrec-emptied-gate'],
        result: 'Mara adds Hale’s real actions and the dates from Dragonspine. The accusation now contradicts an order Malrec signed before the supposed murder.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-mark-dead-command-difference',
        label: 'Teach the group how to recognise a dead command.',
        detail: 'Spend 1 Command training several messengers while the army closes.',
        advantage: 'Living units may reject storm orders that arrive without paper, wax, or a current countersign.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c7-taught-dead-command-test', 'c7-knows-malrec-emptied-gate'],
        result: 'You reduce the test to three questions: where is the paper, where is the living messenger, and what is today’s countersign? Riders carry the rule across your line.',
        next: 'c7-sealed-orders',
      },
      {
        id: 'c7-give-orders-to-lio',
        label: 'Give copies to Lio and make him sign as a living Crown officer.',
        detail: 'Use his real rank to carry the proof, exposing him as a deserter if the army rejects it.',
        advantage: 'Soldiers who distrust you may still read an order delivered under Lio’s true name.',
        addFlags: ['c7-lio-carries-orders', 'c7-knows-malrec-emptied-gate'],
        result: 'Lio signs every copy and adds his unit, rank, and today’s countersign. He returns the originals to your coat. “If they reject this, they reject me with it,” he says. The cost in his voice is clearer than ink.',
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
      body: 'Regent Malrec deliberately moved this army away from four Black Gate forts three weeks before Caelan took the ember. The soldiers are Asterra’s forces, acting under the Regent’s legal authority while the Queen is ill. Most were falsely told replacement troops protected the Gate. The ancestor storm is now using dead officers to keep them chasing westward targets.',
    },
    body: () => [
      'The army’s first siege horns roll across the steppe. Infantry spreads between the ridges while cavalry races for every path east. Teren Voss is no longer trying to arrest one man. He is closing the road around everyone who can carry the proof.',
      'A black arrow strikes the map winch. Red dust climbs its shaft and shapes Marshal Evren’s dead face above the deck. “Burn the stolen orders,” the voice commands. Crown archers turn toward the paper without receiving a living signal.',
      'Ilyra catches the red thread tied to the voice. It leads east, not west toward the army. Whatever speaks as Evren is connected to the opening Gate.',
      'You know enough to resist both commands without confusing the frightened soldiers for the people using them.',
      'Korran points toward a family wagon caught between two wheel tracks. The proof is in your coat. The wagon will overturn in seconds. “Which reaches safety first?”',
    ],
    choices: [
      {
        id: 'c7-save-wagon-carry-proof',
        label: 'Carry the proof into the wheel lane and pull the wagon clear.',
        detail: 'Lose 1 Health protecting both people and evidence under direct fire.',
        advantage: 'The family survives and the original orders remain in your possession.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c7-saved-family-wagon', 'c7-original-orders-safe'],
        result: 'You catch the wagon beam against your injured shoulder and force it over the track. Arrows follow the papers inside your coat. The family reaches cover with you.',
        next: 'c7-dead-horn',
      },
      {
        id: 'c7-command-proof-relay',
        label: 'Send copies through a rider relay while Korran saves the wagon.',
        detail: 'Spend 1 Command placing evidence beyond any single arrow or messenger.',
        advantage: 'The proof survives in several hands and the family receives an experienced rescuer.',
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
        label: 'Fire copies from the city’s empty signal tubes.',
        detail: 'Spend the prepared paper supply and reveal the evidence before the decisive moment.',
        advantage: 'Hundreds of soldiers see the order now, but Teren gains time to call it a forgery.',
        addFlags: ['c7-signal-tube-paper-rain', 'c7-proof-public-early'],
        result: 'Korran’s signal crew packs the tubes with copied orders and one handful of white flour to reveal the wind. Pages burst above the Crown line and drift through every rank. “The flour shows the safe angle,” Korran says. Mara watches the white cloud. “Of course it does.”',
        next: 'c7-dead-horn',
      },
    ],
  },

  'c7-dead-horn': {
    id: 'c7-dead-horn',
    kicker: 'A dead marshal takes the signal tower',
    title: 'The Horn That Nobody Blew',
    location: 'Kharad Vey, Western Signal Mast',
    objective: 'Stop a dead command from sending both armies into the salt basin.',
    threat: 'Critical',
    art: 'redwind',
    body: (state) => [
      'A Crown retreat call sounds from Kharad Vey’s own signal mast. No living person is near the horn. The dead marshal has pushed his voice through its brass throat.',
      'Crown soldiers turn south as trained. Kharad Vey’s outer decks hear the same notes as an evacuation order and turn north. Both roads lead into the white salt basin, where the ground is thin enough to swallow wheels and horses.',
      has(state, 'c7-taught-dead-command-test')
        ? 'Your messengers shout the three questions. No paper. No living messenger. No countersign. Several Crown companies slow, but the horn is louder.'
        : 'The order sounds perfect. Without a simple test, frightened soldiers obey the pattern their bodies learned before their minds can object.',
      'Your training offers six ways to break a signal mast and only one that preserves the living chain of command.',
      'Lio recognises the funeral call for a dead marshal. It can force trained soldiers into one minute of silence, but using it now will expose his break from the Crown. Ilyra grips the red thread. “Or we cut the voice out of the horn now.”',
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
        label: 'Call the living countersign from every smaller horn.',
        detail: 'Spend 2 Command making one verified signal louder than the dead marshal.',
        advantage: 'Both forces hear a current living order without destroying the town’s signal mast.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c7-living-horns-won'],
        result: 'One horn answers, then twenty. Today’s countersign rolls across the field until living officers begin stopping their own lines.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-oath-dead-command-silent',
        label: 'Promise that no dead command will move a living soldier through this horn.',
        detail: 'Spend 2 Oathfire binding the steppe’s witness law to the battlefield.',
        advantage: 'The horn remains usable by living officers while every storm voice loses it.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c7-oath-silenced-dead-horn'],
        result: 'Gold fire seals the horn against breath with no living lungs. The next dead order becomes a dry rattle while Lio’s voice passes cleanly through.',
        next: 'c7-ilyra-command-thread',
      },
      {
        id: 'c7-lio-calls-ghost-funeral',
        label: 'Have Lio announce Marshal Evren’s overdue funeral.',
        detail: 'Use real Crown ceremony to interrupt the dead officer and openly mark Lio as a deserter.',
        advantage: 'The bizarre honour forces the ghost and trained soldiers to halt for the funeral call.',
        addFlags: ['c7-lio-called-funeral', 'c7-lio-named-deserter'],
        result: 'Lio drops black cloth over the mast and gives Evren’s exact funeral call. The ghost stops speaking. Thousands of soldiers halt by reflex. “He has been dead nineteen years,” Lio says into the sudden quiet. “Let him finish.”',
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
        label: 'Open Vaor’s ember to the eastern thread for one breath.',
        detail: 'Risk revealing the ember’s exact bearer to the power beyond the Gate.',
        advantage: 'Dragonfire can illuminate the full route used by the dead commands.',
        addFlags: ['c7-sender-knows-ember-bearer', 'c7-traced-hidden-sender'],
        result: 'The ember touches the thread. A red map burns beneath the steppe, linking the abandoned forts to something alive beyond the Gate. The hidden sender now knows your name and heartbeat.',
        next: (state) => personalNode(state),
      },
      {
        id: 'c7-use-lio-living-order',
        label: 'Let Lio speak a willing refusal through the dead command.',
        detail: 'Use a soldier’s present choice to oppose the obedience expected from him.',
        advantage: 'The refusal exposes the command’s route without giving it a magical weapon.',
        requiresFlags: ['c7-lio-alive'],
        addFlags: ['c7-lio-refused-dead-command', 'c7-traced-hidden-sender'],
        result: 'Lio speaks his name, rank, and refusal. The thread tightens as if trying to correct him. Ilyra follows that pressure east to the empty fort ring.',
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
    objective: 'Answer Mara before the army reaches the ridge. Be honest about the future you can offer. | One quiet minute before battle',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Mara finds you while the others water the horses. Red dust has settled along her jaw and in the loose hair at her neck. You want to brush it away. The simple wish hurts more than the cut beneath your ribs.',
      'She stands close enough that her shoulder touches yours. For one breath, the army beyond the ridge sounds very far away.',
      '“I know what you are willing to die for,” she says. “I need to know what you are willing to live for.”',
      'You have shared danger, desire, and promises. None of that answers the question she has carried across the mountain. Mara waits for an honest answer.',
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
    objective: 'Decide what your bond with Lysara means when your nations demand different things. | One quiet minute before battle',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Lysara joins you beneath the ridge with the living treaty wrapped around her injured hand. The red wind presses her travelling coat against the clean lines of her body, then releases it. Her calm expression does not hide how carefully she is watching you.',
      '“Asterra may call you traitor,” she says. “Veyr may call me compromised. Attraction is easy while both kingdoms are trying to kill us. Partnership begins when they stop.”',
      'You want her. You also respect the sharp, difficult purpose that existed before you met. If you ask her to choose you over that purpose, she will refuse. You are glad of it.',
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
        result: '“Friendship is not the lesser treaty,” Lysara says. Her thumb brushes your knuckles before she releases you. “It may be the harder one to break.”',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-ilyra-future': {
    id: 'c7-ilyra-future',
    kicker: 'Desire without surrender',
    title: 'The Truth Ilyra Cannot Steal',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Decide whether your attraction to Ilyra can become something chosen and honest. | One quiet minute before battle',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'Ilyra washes red dust from her throat with the last water in a silver cup. She knows you are watching. The slow lift of one eyebrow tells you she also knows exactly what the sight does to you.',
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
        result: 'Ilyra’s pride stiffens, then settles. “Fair,” she says. “I have used softer things than knives, and they cut longer.” She steps away before the answer can become punishment.',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-quiet-watch': {
    id: 'c7-quiet-watch',
    kicker: 'A leader is not alone',
    title: 'Four Breaths Before Battle',
    location: 'A Dry Hollow Below Black Ridge',
    objective: 'Use the last quiet minute to prepare the people who will stand with you. | One quiet minute before battle',
    threat: 'Rising',
    art: 'redwind',
    body: () => [
      'There is no room in your mind for romance tonight, but there is still room for people. Mara checks your bandage without asking. Lysara redraws the eastern thread in dust. Korran stands watch while pretending not to listen.',
      'Korran offers you a cup that smells like boiled boot leather. “Steppe tea,” he says. “The steppe denies involvement.”',
      'You almost laugh. The sound feels strange in your chest, then useful. The army is close. Fear is closer. You can still decide what your companions carry into the fight.',
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
        label: 'Drink Korran’s terrible tea and ask Lio what the dead cannot answer.',
        detail: 'Learn the limit of a remembered command before the army relies on it again.',
        advantage: 'Lio explains that every living commander carries a private answer changed each day.',
        changes: { resolve: 1 },
        addFlags: ['c7-knows-private-command-test'],
        result: 'The tea is worse than promised. Lio explains that a living officer must answer a challenge with words changed at dawn. A memory can repeat yesterday forever. It cannot know today.',
        next: 'c7-marshal-parley',
      },
    ],
  },

  'c7-marshal-parley': {
    id: 'c7-marshal-parley',
    kicker: 'The loyal enemy',
    title: 'Marshal Teren Voss',
    location: 'The Black Ridge Truce Stones',
    objective: 'Make the Crown marshal doubt Malrec before the dead command takes his army. | The Crown March reaches the ridge',
    threat: 'Immediate',
    art: 'marshal',
    introducesStoryTerms: ['Marshal Teren Voss'],
    body: (state) => [
      'Marshal Teren Voss rides beneath a white truce cloth with twelve guards. He is older than you remember from the academy, but his back is still straight and his grey eyes still make every excuse feel childish.',
      'He trained officers to obey the Crown, not the person wearing it. That is why seeing him beneath Malrec’s banner hurts.',
      has(state, 'c7-lio-joined')
        ? 'Lio stands beside you and removes his helmet. Teren recognizes his own lieutenant among the accused.'
        : 'Mara keeps one hand near her sword. Teren notices and gives her the smallest nod of respect.',
      '“Captain Vale,” Teren says. “Yield the stolen ember and submit to royal judgment. I will protect your wounded. Resist, and I end this before the red storm kills more of my soldiers.”',
      'He believes every word. That makes him harder to defeat and worth saving.',
    ],
    choices: [
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
        label: 'Ask Teren to order the dead voice to name today’s watchword.',
        detail: 'Use the limit you uncovered to expose a commander speaking from old memory.',
        advantage: 'The army can hear the supernatural deception for itself.',
        addFlags: ['c7-teren-tested-dead-command'],
        result: 'Teren calls the challenge. The storm answers with last winter’s word. His guards exchange frightened looks. A loyal army has just heard proof that one of its commanders is dead.',
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
    objective: 'Survive the dead marshal’s first attack without turning loyal soldiers into enemies. | The parley is broken',
    threat: 'Critical',
    art: 'marshal',
    body: () => [
      'Marshal Evren’s voice rolls from a thousand brass horns. He has been dead nineteen years, yet every old signal is perfect.',
      '“Teren Voss is compromised. Recover the ember. Hold the western army until the eastern gate opens.”',
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
        label: 'Have Lio challenge both commanders with today’s private answer.',
        detail: 'Use living Crown procedure instead of another copied voice.',
        advantage: 'Teren can answer from the ridge. The dead marshal cannot.',
        addFlags: ['c7-lio-used-private-answer'],
        result: 'Lio sounds the challenge across both ridges. Evren repeats his last order. Teren gives today’s private answer, and company after company turns toward the living voice.',
        next: 'c7-battlefield-setup',
      },
    ],
  },

  'c7-battlefield-setup': {
    id: 'c7-battlefield-setup',
    kicker: 'Choose what the battlefield preserves',
    title: 'Before the Red Wind Closes',
    location: 'The Salt Basin Rim',
    objective: 'Prepare one advantage before you commit to the decisive plan. | Both armies enter the basin',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => [
      'You retreat to the Salt Basin with Teren and the people still willing to hear him. The white ground looks solid. Korran’s warning stays in your mind: red brine waits beneath the crust.',
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
        result: 'Lysara and Lio turn seals, dates, and fort numbers into marks large enough to read through red dust. The truth becomes battlefield equipment.',
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
        label: 'Build one verified signal post with Lio.',
        detail: 'Use Caelan’s military knowledge and Lio’s current countersign to challenge false orders.',
        advantage: 'The post can redirect one full company at the exact moment you choose.',
        addFlags: ['c7-living-signal-post-ready'],
        result: 'Lio sets the flag height while you correct the challenge sequence. The finished post looks ordinary. Its danger lies in asking a question the dead cannot answer.',
        next: 'c7-defining-choice',
      },
    ],
  },

  'c7-defining-choice': {
    id: 'c7-defining-choice',
    kicker: 'How the Red Wind Hunt ends',
    title: 'Three Ways to Break an Army',
    location: 'The Salt Basin Rim',
    objective: 'Choose the plan that will decide what the Crown March believes about you. | The decisive choice',
    threat: 'Critical',
    art: 'saltbattle',
    body: () => [
      'The Crown March forms for one final advance. They are your kingdom’s soldiers. Some are frightened. Some hate you. Most believe obedience is the only wall between Asterra and chaos.',
      'Teren can challenge the dead command, but he cannot make the army trust you. That part belongs to your actions.',
      'You can trap the advance without slaughtering it, expose Malrec’s orders to every rank, or challenge Teren under the steppe law he accepted when he crossed Kharad ground. Each victory will create a different future.',
      'You know the army will remember not only whether you won, but how.',
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
        result: 'Lysara lifts the sealed order. Lio raises a white banner beside it. You ride toward the army with proof visible and no shield covering your face.',
        next: 'c7-order-exposure',
      },
      {
        id: 'c7-choose-steppe-duel',
        label: 'Invoke steppe law and face Teren for command of everyone standing in the basin.',
        detail: 'Place the outcome on personal combat and Teren’s willingness to honour local law.',
        advantage: 'A clear duel can end the battle before either army breaks formation.',
        addFlags: ['c7-chose-steppe-duel'],
        result: 'Korran plants a black spear between the armies. Teren removes his marshal’s cloak and walks into the circle. He understands that refusing would admit he came to rule land whose law he despises.',
        next: 'c7-steppe-duel',
      },
    ],
  },

  'c7-salt-trap': {
    id: 'c7-salt-trap',
    kicker: 'Mercy shaped like a trap',
    title: 'The White Ground Breaks',
    location: 'The Salt Basin',
    objective: 'Stop the advance without drowning the soldiers caught inside it. | Execute the chosen plan',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => [
      'Crown cavalry pours onto the white crust. Beneath them, the salt groans like lake ice.',
      has(state, 'c7-safe-salt-lanes-marked')
        ? 'Your red reeds show exactly where the ground will hold. The safe lanes are narrow, but they exist.'
        : 'Korran points toward darker salt where the crust may hold. You must trust his eye while hundreds of horses close behind you.',
      'The easy victory would be to break everything. The victory you can live with requires opening the brine in a curve, trapping the army while leaving one honest road back.',
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
        addFlags: ['c7-living-signal-spent', 'c7-crown-column-blocked'],
        result: 'Lio’s private answer completes your command. One full company turns safely across the basin and jams the advance behind it. The dead order cannot move through living confusion.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-order-exposure': {
    id: 'c7-order-exposure',
    kicker: 'Truth carried under arrows',
    title: 'Every Rank Must See',
    location: 'The Crown March Lines',
    objective: 'Make the army see Malrec’s real orders before the evidence or its bearers are destroyed. | Execute the chosen plan',
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
        addFlags: ['c7-lio-delivered-orders'],
        result: 'Lio walks into the ranks with his empty sword hand raised and his name written on every page. You keep the archers facing you while the evidence passes from officer to officer behind their shields.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-steppe-duel': {
    id: 'c7-steppe-duel',
    kicker: 'One fight for two armies',
    title: 'The Law of Open Ground',
    location: 'The Salt Basin Circle',
    objective: 'Defeat Teren without turning a loyal marshal into a martyr. | Execute the chosen plan',
    threat: 'Critical',
    art: 'marshal',
    body: () => [
      'Steppe law is plain: two leaders may fight for the right to give one order to everyone who witnesses the duel. The loser keeps life and honour if the winner permits it.',
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
        result: 'You let his blade stop at your throat. “Win,” you say, “and the whole army remains here while eight forts stand empty.” Teren follows your gaze east. Then he drops the sabre himself.',
        next: 'c7-many-or-one',
      },
    ],
  },

  'c7-many-or-one': {
    id: 'c7-many-or-one',
    kicker: 'Command or guard',
    title: 'The Last Dead Order',
    location: 'The Salt Basin',
    objective: 'Choose what Caelan’s strength protects when Evren tears open the battlefield. | No perfect rescue remains',
    threat: 'Critical',
    art: 'saltbattle',
    body: (state) => {
      const ally = endangeredAlly(state);
      return [
        'Your plan works. The Crown advance stops. Living officers lower their weapons, and for one clear breath the battle is over.',
        `Then Evren spends everything left in the storm. A wall of red wind crosses the basin. One broken company stands in its path. ${ally} is trapped beneath a fallen signal frame on the opposite side.`,
        'Command can move hundreds before the wall strikes. Your own hands can reach one person in time. Oathfire might protect both, but only by burning the original Gate orders that anchor the truth.',
        'You cannot preserve every life, every proof, and every promise. The choice is yours, and everyone can see it.',
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
        addFlags: ['c7-lio-stranded-after-rescue', 'c7-saved-many-with-lio'],
        result: 'Your command opens a narrow path for the company. Lio cuts away his officer’s coat, crawls across the falling frame, and frees your companion. He lands on the wrong side of three hundred uncertain soldiers with both hands raised.',
        next: 'c7-army-future',
      },
    ],
  },

  'c7-army-future': {
    id: 'c7-army-future',
    kicker: 'Victory creates followers',
    title: 'Who Marches East',
    location: 'The Quiet Salt Basin',
    objective: 'Decide what kind of force will answer the danger at the Black Gate. | Final choice',
    threat: 'Immediate',
    art: 'marshal',
    body: (state) => [
      'The ancestor storm collapses. For the first time all day, the voices in the wind belong to living people.',
      has(state, 'c7-saved-many') || has(state, 'c7-saved-many-with-lio')
        ? 'Soldiers gather around the people your command saved. Their gratitude is real, but so is their habit of waiting for another order.'
        : has(state, 'c7-saved-both-burned-proof')
          ? 'No bodies lie beneath the last red wall. Malrec’s orders are ash, so the soldiers must decide from what they witnessed rather than what a seal can prove.'
          : 'The companion you carried from the storm remains beside you. Across the basin, empty places in the Crown ranks show the cost of that rescue.',
      'Teren removes Malrec’s badge from his cloak. He offers you the Crown March, but no law makes the choice simple. A full army could defend eight empty forts. It could also bring its obedience and suspicion with it.',
      'You may lead every willing rank, take only a smaller company that chooses the road freely, or refuse formal followers and let your dangerous reputation reach the Gate before you do.',
      'You feel the weight of Teren’s standard before you touch it. Accepting power will be easier than teaching it to question you.',
    ],
    choices: [
      {
        id: 'c7-take-full-army',
        label: 'Accept command of the Crown March and turn the full army east.',
        detail: 'Gain the strength to defend every fort, along with thousands trained to obey before questioning.',
        advantage: 'Caelan reaches the Black Gate with a full army and Teren’s authority.',
        changes: { wayfire: 2 },
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
        result: 'You ask once and make no speech. Soldiers step forward by tens, then hundreds. Teren keeps the rest to protect the steppe road. Your smaller company turns east because each person decided to go.',
        next: 'c7-ending-company',
      },
      {
        id: 'c7-take-no-formal-allies',
        label: 'Refuse command and send the Crown March home with the truth.',
        detail: 'Travel fast with your existing companions while relying on reputation rather than formal allies.',
        advantage: 'No divided army can betray the Gate from inside your ranks.',
        changes: { wayfire: 2 },
        addFlags: ['c7-gained-dangerous-reputation'],
        result: 'You return Teren’s standard. The Crown March will carry word that you defeated it, spared it, and refused to own it. By sunset, that story is moving faster than any army.',
        next: 'c7-ending-outlaw',
      },
    ],
  },

  'c7-ending-army': {
    id: 'c7-ending-army',
    kicker: 'Chapter Seven complete',
    title: 'The Army That Chose Again',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate before the hidden power uses the empty forts. | Path recorded',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'The Crown March turns east beneath Caelan Vey’s command. Kharad scouts ride ahead. Asterra engineers follow. People who began the day as enemies now share water and watch the same red horizon.',
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      'At sunrise, the first Black Gate fort appears on the horizon. Its towers are empty. So are the next seven signal fires along the wall.',
      'Then the Gate knocks from the other side.',
    ],
    choices: [],
  },

  'c7-ending-company': {
    id: 'c7-ending-company',
    kicker: 'Chapter Seven complete',
    title: 'The Company of Open Eyes',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate before the hidden power uses the empty forts. | Path recorded',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'Your chosen company rides east without a royal banner. Every soldier stepped forward freely. That does not make them fearless. It makes their fear honest.',
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      'Teren takes the remaining army west to protect the steppe settlements and spread Malrec’s orders among the Crown ranks.',
      'At sunrise, the first Black Gate fort appears. Its towers are empty. Seven more cold signal fires mark the wall beyond it.',
      'Then something vast knocks from the other side.',
    ],
    choices: [],
  },

  'c7-ending-outlaw': {
    id: 'c7-ending-outlaw',
    kicker: 'Chapter Seven complete',
    title: 'The Name That Reached the Gate First',
    location: 'The Eastern Edge of the Ember Steppe',
    objective: 'Reach the Black Gate before the hidden power uses the empty forts. | Path recorded',
    threat: 'Immediate',
    art: 'redwind',
    final: true,
    nextChapter: 'c8-gate-ring',
    body: (state) => [
      'You ride east with the people who already chose you. No new banners follow. Behind you, thousands of Crown soldiers carry the same story home: Caelan Vey defeated the Regent’s hunt, spared its army, and refused its command.',
      emberPressure(state),
      relationshipRoad(state),
      finalBattleCost(state),
      'Teren rides west with Malrec’s original accusation and enough witnesses to break it in public, even if the strongest proof is gone.',
      'Your reputation reaches the Black Gate before sunset. The abandoned forts answer it with silence.',
      'Then the entire eastern wall shudders beneath one slow knock from the other side.',
    ],
    choices: [],
  },
};
