import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function rookArrival(state: GameState) {
  if (has(state, 'c4-rook-arrested')) {
    return 'Rook walks twenty steps ahead with the empty iron cuff worn as a bracelet. You arrested him on the bridge. He escaped without leaving, which feels like the most irritating compromise he could invent.';
  }
  if (has(state, 'c4-rook-bargain')) {
    return 'Rook keeps the bargain he made on the bridge. He guides you north, names each hidden turn, and supplies exactly one honest warning per day. You have started to dread the honest ones.';
  }
  return 'You trusted Rook to choose his own road. He vanished for most of the climb, then appeared above the path with dry boots and a stolen Crown map. “I led you by removing several bad guides,” he says.';
}

function ordanCustody(state: GameState) {
  if (has(state, 'c4-captured-ordan')) {
    return 'Ordan did not come north. Elene took him into Harrowfen custody with Garran and the surviving documents. You still feel the weight of leaving a living witness behind, but bringing a wounded prisoner into this mountain would have killed him.';
  }
  if (has(state, 'c4-ordan-lower-road')) {
    return 'Ordan escaped onto a lower road, but the dispatch taken from him led you here. You dislike depending on evidence stolen from a man you could not hold.';
  }
  return 'Ordan is gone, but the genuine royal dispatch from his coat led you here. His part in the pursuit is over. The authority above him is not.';
}

function routeMemory(state: GameState) {
  if (has(state, 'c4-snow-route')) {
    return 'The blue fire resembles the flame you crossed on the bridge’s mountain span. This time you can feel it reaching for the warmth beneath your armour.';
  }
  if (has(state, 'c4-storm-route')) {
    return 'You miss the storm span for one foolish moment. Water tried to throw you into the sea, but at least water did not study you before it moved.';
  }
  if (has(state, 'c4-brass-route')) {
    return 'The measured turning of the bridge’s brass chamber taught you to look for a pattern. The blue flames have one. Every tongue leans toward the warmest living body.';
  }
  return 'The blue flames move with a pattern you can read. Every tongue leans toward the warmest living body.';
}

function maraBurnOpening(state: GameState) {
  if (has(state, 'c5-let-mara-check-burns')) {
    return 'Mara made you promise to show her the next burn. In the shelter beside the memory wall, she removes your gauntlet before you can pretend the pain is minor.';
  }
  return 'Mara catches the stiffness in your hand and pulls you into a narrow shelter beside the memory wall. “Glove off,” she says. You consider arguing until you see her expression.';
}

function vaorResponse(state: GameState) {
  if (has(state, 'c5-asked-memory-permission')) {
    return 'The eye recognises you. “You asked before touching what was mine,” the dragon says. “That is a small courtesy. Small things have become rare.”';
  }
  if (has(state, 'c5-broke-memory-slab')) {
    return 'The eye fixes on the broken plate behind you. “You destroyed one of my days to reach me faster,” the dragon says. His anger is quiet enough to frighten you.';
  }
  return 'The dragon’s amber eye follows the iron in your fist. You feel his attention like heat returning to a numb hand.';
}

export const chapterFiveNodes: Record<string, StoryNode> = {
  'c5-north-road': {
    id: 'c5-north-road',
    kicker: 'Chapter Five',
    title: 'The Dragon’s Cold Grave',
    location: 'The Glass Valleys of Dragonspine',
    objective: 'Reach the active fire Nail before the Regent’s soldiers extract its ember.',
    threat: 'Rising',
    art: 'dragonspine',
    introducesStoryTerms: ['cold fire'],
    lesson: {
      title: 'Cold fire',
      body: 'The damaged fire Nail has created blue flame that steals heat instead of giving it. It follows warm bodies and ordinary fires. While it burns nearby, rest can stop exhaustion from worsening, but Health cannot recover.',
    },
    body: (state) => [
      'The Mileless Bridge left you at Dragonspine’s lower road. Three days of ordinary climbing followed. The mountains are black stone veined with clear glass, and each step takes you farther from any help that could arrive in time.',
      ordanCustody(state),
      rookArrival(state),
      'Now blue flame rises from cracks on both sides of the path. It bends against the wind and reaches toward your lantern. When Mara covers the lantern, every flame turns toward the heat of your bodies instead.',
      routeMemory(state),
      'You understand the immediate rule. Light is not attracting it. Warmth is. The road ahead narrows between two walls of glass, and the flames are already closing behind you. Mara asks, “How do we cross?”',
    ],
    choices: [
      {
        id: 'c5-cross-in-shadow',
        label: 'Extinguish the lanterns and crawl through the glass shadows.',
        detail: 'Move slowly and preserve every resource, but give the royal patrol more time to follow.',
        advantage: 'The party enters the valley without feeding the fire or spending a stat.',
        addFlags: ['c5-slow-shadow-crossing'],
        result: 'You put out every flame and lead the group between cold glass ridges. The blue fire searches behind you while a distant royal horn gains ground.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-command-lantern-relay',
        label: 'Send the lanterns ahead in a timed relay.',
        detail: 'Spend 1 Command making the fire chase moving heat instead of your people.',
        advantage: 'The whole party crosses quickly with its winter supplies intact.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-lantern-relay'],
        result: 'Lanterns pass from hand to hand, always one turn ahead. The blue fire follows the warm metal while your people cross behind it.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-oath-draw-coldfire',
        label: 'Promise that no flame will touch anyone while you lead.',
        detail: 'Spend 1 Oathfire drawing the cold fire toward your sworn protection.',
        advantage: 'Every companion crosses untouched, and you learn that the fire can hear an Oath.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c5-fire-heard-oath', 'c5-carried-first-grief'],
        result: 'Your promise burns gold around the group. The blue flames avoid them and follow you instead. For one breath, grief that is not yours presses behind your eyes.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-guard-rear-crossing',
        label: 'Take the rear and break every flame that reaches the path.',
        detail: 'Lose 1 Health keeping the cold fire away from the slower climbers.',
        advantage: 'The party crosses at full speed and the fire cannot mark another traveller.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-burned-at-rear'],
        result: 'You crush each blue tongue under iron before it reaches the line. The cold burns through your boot, but nobody behind you is touched.',
        next: 'c5-coldfire-rescue',
      },
    ],
  },

  'c5-coldfire-rescue': {
    id: 'c5-coldfire-rescue',
    kicker: 'A voice inside the glass',
    title: 'The Last Mountain Keeper',
    location: 'The Lower Glass Pass',
    objective: 'Rescue the trapped guide before the cold fire reaches him.',
    threat: 'Immediate',
    art: 'dragonspine',
    introducesStoryTerms: ['Vaor'],
    lesson: {
      title: 'The grave above',
      body: 'Vaor is an ancient dragon buried alive near the fire Nail. Sorin’s people once tended the paths to his grave, but the Crown closed them a century ago.',
    },
    body: () => [
      'A man pounds on the inside of a fallen glass slab. One leg is pinned beneath it. Blue fire moves across the clear surface toward the heat of his hands.',
      'He shouts that his name is Sorin and that he tends the old paths to Vaor’s grave. Vaor is an ancient dragon buried alive near the fire Nail. The Regent’s survey camp opened the grave two nights ago. Most of its soldiers are dead. The survivors took climbing gear and went higher.',
      'You want his knowledge, but the reason to move is simpler. He is alive, the fire is close, and he cannot free himself.',
    ],
    choices: [
      {
        id: 'c5-lift-glass-slab',
        label: 'Lift the slab while Mara pulls Sorin free.',
        detail: 'Lose 1 Health taking the glass weight through your injured body.',
        advantage: 'Sorin keeps his pack, maps, and full ability to guide the climb.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-sorin-full-guide', 'c5-lifted-glass'],
        result: 'The glass edge cuts through your glove as you lift. Mara drags Sorin clear with his map case still across his shoulders.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-command-slab-rope',
        label: 'Build a rope lift and call the pull together.',
        detail: 'Spend 1 Command coordinating strength before the fire arrives.',
        advantage: 'Sorin is freed without injury and the group learns the rhythm of mountain rescue.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-sorin-full-guide', 'c5-rope-lift'],
        result: 'Rope tightens around the glass. Your count turns six exhausted people into one clean pull, and Sorin rolls free before the flame reaches him.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-sacrifice-winter-pack',
        label: 'Throw the warm ration pack beyond the slab.',
        detail: 'Sacrifice food and blankets so the fire follows a stronger source of heat.',
        advantage: 'The party gains enough time to free Sorin without spending a stat.',
        addFlags: ['c5-sorin-saved', 'c5-lost-winter-supplies'],
        result: 'The pack lands and splits. Stored warmth rises from blankets and bread. The blue fire turns, and you free Sorin while it consumes the supplies meant for the summit.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-feed-fragment-fire',
        label: 'Hold the fragment near the fire and draw it away.',
        detail: 'Spend 1 Resolve letting the active Nail pull against the iron in your hand.',
        advantage: 'Sorin is saved, and the fragment reveals the direction of the buried dragon.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-sorin-saved', 'c5-fragment-found-grave'],
        result: 'The fire leaves Sorin and circles the fragment. Pain points through your arm toward a bright mark high inside the mountain.',
        next: 'c5-glass-shelter',
      },
    ],
  },

  'c5-glass-shelter': {
    id: 'c5-glass-shelter',
    kicker: 'One hour without warmth',
    title: 'The Shelter That Cannot Burn',
    location: 'Sorin’s Glass Refuge',
    objective: 'Prepare for the climb before the royal survivors find you.',
    threat: 'Uneasy',
    art: 'dragonspine',
    body: (state) => [
      'Sorin leads you into a refuge cut entirely from glass. There is no hearth. A fire would call every blue flame in the valley, so the group shares blankets and eats cold grain.',
      'Your breathing settles, but your burns do not close. The cold fire outside keeps pulling at every hurt body. You now understand what the rule means in practice: there will be no restored Health until you leave its reach.',
      has(state, 'c5-lost-winter-supplies')
        ? 'The sacrificed ration pack saved Sorin. It also leaves one blanket for every two people. Mara sits close enough that the heat of her thigh reaches yours through wet cloth, a practical kindness that neither of you mistakes for only that.'
        : 'Mara sits beside you beneath one blanket. Her shoulder presses against yours while she studies the pale burn around your glove.',
      'Sorin sketches three paths to the upper grave. Before you choose one, you have time to learn one useful thing. “What do you need first?” he asks.',
    ],
    choices: [
      {
        id: 'c5-let-mara-check-burns',
        label: 'Let Mara inspect the cold burns now.',
        detail: 'Give her the truth about your pain before it becomes a crisis.',
        advantage: 'Mara learns which burn may fail during the final climb.',
        addFlags: ['c5-let-mara-check-burns'],
        result: 'Mara unwraps your hand and marks the edge of the numb skin with ink. “If it crosses that line, you tell me,” she says. You promise without using magic.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-ask-lysara-read-nail',
        label: 'Ask Lysara to read the northern mark.',
        detail: 'Spend 1 Resolve holding the fragment steady while her living thread enters it.',
        advantage: 'You learn that the dragon and the fire Nail occupy the same chamber.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-lysara-linked-grave'],
        result: 'Green thread passes through the black iron and points upward. Lysara feels a heartbeat behind the fire mark. The Nail is not merely near a dragon. It is touching one.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-question-sorin-paths',
        label: 'Ask Sorin what each route was built to protect.',
        detail: 'Learn the purpose of the paths instead of only their speed.',
        advantage: 'Sorin explains which danger belongs to each route before you commit.',
        addFlags: ['c5-knows-route-purposes'],
        result: 'The stair was built for soldiers, the frozen river for dragon keepers, and the ash tunnel for carrying injured climbers down. Each is dangerous for a different reason.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-send-rook-scouting',
        label: 'Let Rook scout the abandoned royal camp.',
        detail: 'Trust him near evidence and unattended Crown property.',
        advantage: 'He returns with the patrol schedule and one item he refuses to name yet.',
        addFlags: ['c5-rook-scouted-camp'],
        result: 'Rook leaves through the only doorway you were watching and returns through the solid wall. He gives you a patrol schedule. The square shape inside his coat is apparently none of your business.',
        next: 'c5-royal-camp',
      },
    ],
  },

  'c5-royal-camp': {
    id: 'c5-royal-camp',
    kicker: 'Orders left among the dead',
    title: 'The Regent’s Survey Camp',
    location: 'The Broken Royal Camp',
    objective: 'Learn what the Regent’s force intended to take from the grave.',
    threat: 'Rising',
    art: 'dragonspine',
    body: (state) => [
      'The royal camp stands inside a ring of blue ash. Bedrolls are frozen to the ground. Three soldiers lie beside an iron drilling frame, their skin untouched and their bodies emptied of warmth.',
      'These soldiers served the same kingdom as you. They were not the Queen’s whole army. Their sealed orders place them under Regent Malrec’s private authority while the Queen remains ill.',
      'A surviving patrol is climbing back toward camp. You hear boots on glass and estimate four minutes before they see you.',
      has(state, 'c5-rook-scouted-camp')
        ? 'Rook quietly produces the square object from his coat. It is the commander’s seal press. “I was going to return it,” he says. “To someone surprised.”'
        : 'The commander’s tent is locked, the dead may carry clues, and the drill still points toward the upper grave.',
    ],
    choices: [
      {
        id: 'c5-recover-regent-order',
        label: 'Open the command chest and take the written order.',
        detail: 'Spend 1 Command organising a fast search without disturbing the camp’s warning lines.',
        advantage: 'You preserve direct proof that the Regent ordered an ember extracted from a living dragon.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-has-extraction-order'],
        result: 'Your people search in pairs and leave every wire untouched. The order names the prize: one living ember, removed even if the dragon does not survive.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-read-frozen-dead',
        label: 'Study where each soldier fell.',
        detail: 'Spend 1 Resolve facing the last moments of people who wore your colours.',
        advantage: 'You learn that their own commander opened the fire channel and abandoned them.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-knows-commander-sacrifice'],
        result: 'Boot marks show the truth. The commander opened the channel to test the drill, then crossed the safety line alone. His soldiers died buying his result.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-use-rook-seal-prank',
        label: 'Let Rook leave new orders for the returning patrol.',
        detail: 'Use his stolen seal to turn the patrol away, but let him choose the wording.',
        advantage: 'The patrol marches toward a false emergency and cannot follow the next climb.',
        addFlags: ['c5-rook-diverted-patrol'],
        result: 'Rook seals an order warning that the camp latrine has become a strategic fire hazard. The patrol reads it twice, argues about rank, and runs downhill carrying buckets.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-leave-camp-clean',
        label: 'Leave before the patrol arrives.',
        detail: 'Take no proof and reveal nothing about your route.',
        advantage: 'The Crown remains uncertain whether you survived the lower valley.',
        addFlags: ['c5-crown-lost-trail'],
        result: 'You leave the camp exactly as you found it. The returning patrol reaches only cold tents and the silence of its own dead.',
        next: 'c5-three-climbs',
      },
    ],
  },

  'c5-three-climbs': {
    id: 'c5-three-climbs',
    kicker: 'Three ways into the grave',
    title: 'Choose What Hunts You',
    location: 'The Upper Valley Fork',
    objective: 'Choose a route to Vaor’s grave before the royal commander reaches it.',
    threat: 'Immediate',
    art: 'dragonspine',
    body: (state) => [
      has(state, 'c5-knows-route-purposes')
        ? 'Sorin repeats what each path was made to protect. The stair favours a disciplined defence. The river hides dragon keepers. The ash tunnel once carried wounded people down.'
        : 'Sorin points out three routes. Each reaches the same high chamber, but none offers the same danger.',
      'The glass stair is shortest and exposed to Crown archers. The frozen river runs beneath clear ice while blue fire moves above it. The ash tunnel is dark, narrow, and already shaking from the drill.',
      'You cannot know which path is safest. You can decide which danger your group is best prepared to answer.',
    ],
    choices: [
      {
        id: 'c5-choose-glass-stair',
        label: 'Take the exposed glass stair.',
        detail: 'Face the royal archers on the fastest route.',
        advantage: 'You reach the grave quickly and can see every enemy ahead.',
        addFlags: ['c5-glass-stair-route'],
        result: 'You turn onto the clear stair. High above, royal archers lower dark shapes against the snow.',
        next: 'c5-glass-stair',
      },
      {
        id: 'c5-choose-frozen-river',
        label: 'Follow the river beneath the ice.',
        detail: 'Trade enemy sight for thin ice and fire moving overhead.',
        advantage: 'The Crown cannot target the party unless the river cover breaks.',
        addFlags: ['c5-frozen-river-route'],
        result: 'Sorin opens a keeper’s hatch. You descend beneath the ice while blue flame follows your warmth across the ceiling.',
        next: 'c5-frozen-river',
      },
      {
        id: 'c5-choose-ash-tunnel',
        label: 'Enter the old ash tunnel.',
        detail: 'Use the hidden route while the royal drill shakes loose stone above it.',
        advantage: 'The party can approach the grave unseen and may cut behind the commander.',
        addFlags: ['c5-ash-tunnel-route'],
        result: 'You enter single file. Warm ash lies under the snow, proving something deeper in the mountain still burns correctly.',
        next: 'c5-ash-tunnel',
      },
    ],
  },

  'c5-glass-stair': {
    id: 'c5-glass-stair',
    kicker: 'Every step in sight',
    title: 'Arrows on the Clear Stair',
    location: 'The Glass Stair',
    objective: 'Break the archer line without falling into the valley.',
    threat: 'Critical',
    art: 'dragonspine',
    body: () => [
      'The stair climbs through open air. Each step is transparent. Looking down shows the lower valley far beneath your boots.',
      'Six royal archers fire from a stone lip. The arrows are ordinary. The blue fire spreading across the steps behind you is not. Standing still will let it reach the wounded first.',
      'You notice that the glass throws six clear reflections of Rook and only one of everyone else. He notices you noticing and looks pleased.',
    ],
    choices: [
      {
        id: 'c5-stair-shield-command',
        label: 'Advance the shields on your count.',
        detail: 'Spend 1 Command crossing between volleys without losing formation.',
        advantage: 'The full group reaches the archers with its climbing gear intact.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-stair-formation'],
        result: 'You count the bowstrings, not the arrows. The line moves during every draw and stops behind glass pillars during every release.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-stair-breakline',
        label: 'Climb the outside rail and hit the archers from below.',
        detail: 'Lose 1 Health taking the exposed route around their aim.',
        advantage: 'You break the archer line before it can warn the commander.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-silenced-archers'],
        result: 'Glass cuts your palm as you climb beneath the stair. You rise inside the archer line and end the fight before the warning horn is lifted.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-stair-rook-reflections',
        label: 'Let Rook send his reflections up first.',
        detail: 'Trust a trick that exposes Rook’s position to anyone who understands his kit.',
        advantage: 'The archers waste every ready arrow on six convincing thieves.',
        addFlags: ['c5-rook-burned-mirror-trick'],
        result: 'Six Rooks sprint up six reflections. The real one stays beside you and waves politely while the archers empty their quivers into glass.',
        next: 'c5-grave-mouth',
      },
    ],
  },

  'c5-frozen-river': {
    id: 'c5-frozen-river',
    kicker: 'Fire above thin ice',
    title: 'The River That Hides Breath',
    location: 'The Keeper’s River',
    objective: 'Cross beneath the cold fire without breaking its ice ceiling.',
    threat: 'Critical',
    art: 'dragonspine',
    body: () => [
      'The river tunnel is high enough to crouch in and no more. Clear ice forms its roof. Blue fire follows directly above, matching the movement of each warm body below.',
      'A crack opens over Lysara. The fire presses a narrow finger into it. If the roof breaks, the whole river will become a channel for flame.',
      'You notice the crack following Lysara’s breath. You cannot fight through the ceiling. You need to change what the fire follows or move everyone before the crack widens.',
    ],
    choices: [
      {
        id: 'c5-river-oath-decoy',
        label: 'Send your Oathfire ahead as a false heartbeat.',
        detail: 'Spend 1 Oathfire making the blue flame chase your promise through the ice.',
        advantage: 'The party crosses safely and the fire reveals a hidden exit near the grave.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c5-river-oath-path', 'c5-carried-first-grief'],
        result: 'Gold light races ahead under the roof. The blue flame follows it, tracing a sealed keeper’s door before your promise fades.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-river-hold-panic',
        label: 'Lead everyone through darkness by touch.',
        detail: 'Spend 1 Resolve controlling fear while the fire waits overhead.',
        advantage: 'No light or sudden movement draws the flame through the crack.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-river-dark-crossing'],
        result: 'You put one hand on the ice and one on Mara’s shoulder. The line moves in darkness until Sorin touches the far door.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-river-living-thread',
        label: 'Let Lysara’s green thread carry warmth behind you.',
        detail: 'Risk the living seed by leaving a warm trail for the fire to consume.',
        advantage: 'The party crosses without spending a stat, but Lysara’s treaty magic is weakened.',
        addFlags: ['c5-seed-scorched-river'],
        result: 'Green light flows backward along the ice. The cold fire follows and consumes it strand by strand while the last traveller reaches the door.',
        next: 'c5-grave-mouth',
      },
    ],
  },

  'c5-ash-tunnel': {
    id: 'c5-ash-tunnel',
    kicker: 'The mountain shakes',
    title: 'Beneath the Royal Drill',
    location: 'The Ash Descent',
    objective: 'Cross the collapsing tunnel before the drill reaches it.',
    threat: 'Critical',
    art: 'dragonspine',
    body: () => [
      'The ash tunnel climbs beneath the royal drill. Each iron strike sends black dust from the ceiling. Warm air moves through cracks, but the next blow closes half the passage behind you.',
      'A support beam splits. Sorin says the tunnel will hold for perhaps one minute. Rook says it will hold for exactly as long as a man with a hammer believes it will.',
      'You hear the drill crew through the rock. You notice they strike in a steady rhythm. They do not know your party is below them.',
    ],
    choices: [
      {
        id: 'c5-tunnel-brace',
        label: 'Hold the broken beam while everyone passes.',
        detail: 'Lose 1 Health taking the mountain’s weight through your shoulders.',
        advantage: 'Every companion and all remaining evidence reach the grave entrance.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-held-ash-beam'],
        result: 'Stone drives you to one knee. You keep the beam upright until Mara pulls you through behind the final pack.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-tunnel-command-dig',
        label: 'Split the group between bracing and digging.',
        detail: 'Spend 1 Command keeping both teams in rhythm as the roof falls.',
        advantage: 'The party opens a second exit and traps the drill crew above it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-trapped-drill-crew'],
        result: 'One team holds while the other cuts. The new exit opens, and the collapsing old passage swallows the drill without taking its crew.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-tunnel-rook-knock',
        label: 'Let Rook answer the drill through the wall.',
        detail: 'Trust him to imitate the mountain keeper’s collapse signal.',
        advantage: 'The crew stops drilling, but Rook spends the voice reed that copied Sorin.',
        addFlags: ['c5-rook-spent-sorin-reed'],
        result: 'Rook taps four notes on the wall, then shouts in Sorin’s exact voice. Above you, the crew panics and hauls the drill backward. Sorin looks at Rook. “Never do that again.” Rook nods with no sincerity at all.',
        next: 'c5-grave-mouth',
      },
    ],
  },

  'c5-grave-mouth': {
    id: 'c5-grave-mouth',
    kicker: 'The flame learns your names',
    title: 'Jaws at the Grave Door',
    location: 'The Upper Grave Entrance',
    objective: 'Open the grave before the cold fire surrounds the party.',
    threat: 'Critical',
    art: 'dragonspine',
    body: (state) => [
      'The three routes meet before a round glass door. Sorin places his palm on it, but the door does not move. The royal drill has shifted its inner ring out of place.',
      'Cold fire pours from all three passages. It stretches into long jaws because the moving air gives it that shape. It is still flame, not an animal, but the difference will not matter if it closes around you.',
      has(state, 'c5-fragment-found-grave')
        ? 'The fragment pulls toward a narrow socket in the door. You found this direction below, and now you know where the iron belongs.'
        : 'Lysara finds a narrow socket in the door that matches the fragment. Using it may open the grave or wake whatever is inside.',
      'Your companions wait for the priority only you can set. Mara raises her shield and asks, “Which part do we hold?”',
    ],
    choices: [
      {
        id: 'c5-oath-shelter-grave',
        label: 'Promise the fire will not cross your shield.',
        detail: 'Spend 2 Oathfire holding the flame back while Sorin repairs the ring.',
        advantage: 'Everyone enters together, and the grave door remains usable behind you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-oath-held-grave', 'c5-carried-dragon-grief'],
        result: 'Gold fire covers your shield. The blue jaws strike it and stop. With every impact, you feel a dragon remembering someone he could not save.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-break-frozen-channel',
        label: 'Smash the ice channels feeding the fire.',
        detail: 'Lose 2 Health cutting off the flame at arm’s reach.',
        advantage: 'The cold fire drains away and cannot follow the party inside.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-broke-fire-channels'],
        result: 'You break the first channel with your sword and the second with your shoulder. The fire falls into the mountain as Mara drags you through the opening door.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-command-heat-decoys',
        label: 'Divide the lanterns and pull the fire apart.',
        detail: 'Spend 1 Command sending three teams along prepared retreat lines.',
        advantage: 'The flame separates long enough for Sorin to open the door without damaging it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-split-coldfire'],
        result: 'Three warm lanterns run in three directions. The blue jaws divide after them, and Sorin turns the repaired ring.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-open-door-with-fragment',
        label: 'Drive the fragment into the door socket.',
        detail: 'Open the fastest path while announcing the fragment to the active Nail.',
        advantage: 'The party enters without spending a stat, but the Crown commander can follow the flare.',
        addFlags: ['c5-fragment-opened-grave', 'c5-crown-saw-flare'],
        result: 'Black iron enters clear glass. The whole mountain flashes blue, the door opens, and a royal horn answers from below.',
        next: 'c5-memory-wall',
      },
    ],
  },

  'c5-memory-wall': {
    id: 'c5-memory-wall',
    kicker: 'A grave made from lived days',
    title: 'The Dragon Beneath the Glass',
    location: 'The Memory Gallery',
    objective: 'Reach the living dragon without destroying the proof around him.',
    threat: 'Rising',
    art: 'vaor',
    lesson: {
      title: 'Memory glass',
      body: 'The glass plates around Vaor hold recordings of events he truly lived. They are memories, not other timelines or copies of the people inside them.',
    },
    body: () => [
      'The gallery walls are built from thousands of clear plates. Inside each one, a small scene moves without sound. You see a young dragon learning to fly, a village sharing its first winter fire, and a woman resting her hand against a bronze scale.',
      'Sorin explains the simple truth. Dragons store important memories in mountain glass so later generations can witness them. Someone stacked Vaor’s own memories over his living body and ran cold fire through them. The memories became the bars of his prison.',
      'A deep voice moves through the floor. “My name is Vaor. If you have come for my ember, captain, at least look at what your Crown buried with me.”',
      'You feel anger at being judged by your uniform. You also see the royal drill marks and know his suspicion has earned its place.',
    ],
    choices: [
      {
        id: 'c5-touch-memory-plate',
        label: 'Touch the plate nearest Vaor’s voice.',
        detail: 'Spend 1 Resolve experiencing part of a dragon’s grief without protection.',
        advantage: 'You learn which memory the Crown feared enough to bury deepest.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-found-orivane-memory', 'c5-carried-dragon-grief'],
        result: 'The glass fills your mind with a red gold dragon standing inside a circle of mortal rulers. Vaor hides the scene behind pain before you can understand it fully.',
        next: 'c5-mara-burns',
      },
      {
        id: 'c5-ask-memory-permission',
        label: 'Ask Vaor which memory you may approach.',
        detail: 'Give the prisoner control over what you learn first.',
        advantage: 'Vaor guides you along a safe path and remembers the courtesy.',
        addFlags: ['c5-asked-memory-permission', 'c5-vaor-respected'],
        result: 'Silence lasts long enough to feel like refusal. Then amber light appears beneath one row of plates, marking a path that does not cross Vaor’s private grief.',
        next: 'c5-mara-burns',
      },
      {
        id: 'c5-break-memory-slab',
        label: 'Break one binding plate and clear a direct path.',
        detail: 'Lose 1 Health cutting through glass and destroy one of Vaor’s lived days.',
        advantage: 'You reach the dragon before the Crown can enter the gallery.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-broke-memory-slab', 'c5-fast-to-vaor'],
        result: 'The plate breaks beneath your pommel. A summer day vanishes from the glass, and the dragon’s roar shakes dust from the ceiling.',
        next: 'c5-mara-burns',
      },
      {
        id: 'c5-seed-read-memories',
        label: 'Let Lysara’s living seed find a path between the memories.',
        detail: 'Risk her weakened treaty magic against the cold bindings.',
        advantage: 'The seed separates public history from Vaor’s private memories without breaking either.',
        addFlags: ['c5-lysara-sorted-memories'],
        result: 'Green roots move between the plates. They touch battles and councils, but bend around love, grief, and the small private days that belong only to Vaor.',
        next: 'c5-mara-burns',
      },
    ],
  },

  'c5-mara-burns': {
    id: 'c5-mara-burns',
    kicker: 'Warm hands in a cold grave',
    title: 'What You Want to Survive For',
    location: 'A Shelter in the Memory Gallery',
    objective: 'Let Mara treat the burn before the final descent.',
    threat: 'Uneasy',
    art: 'vaor',
    body: (state) => [
      maraBurnOpening(state),
      'She warms a strip of cloth against her own skin, then winds it around your palm. Her fingers are steady and close. A loose strand of dark hair brushes your wrist when she bends over the bandage. Pain makes every small touch sharper.',
      has(state, 'c4-oath-honest-with-mara')
        ? 'Your promise not to hide behind duty warms between you. Mara feels it too. “Do not give me a captain’s answer,” she says. “Tell me what you want if we leave this mountain.”'
        : 'Mara ties the cloth and keeps hold of your hand. “You keep telling me who must survive,” she says. “Tell me what you want if you are one of them.”',
      'A royal horn sounds inside the grave. You have little time, but the answer matters because danger is no longer a reason to leave everything unsaid. Mara keeps hold of your hand. “Tell me now,” she says.',
    ],
    choices: [
      {
        id: 'c5-admit-future-with-mara',
        label: 'Tell Mara you want a life that includes her.',
        detail: 'Make an honest admission without turning it into another magical duty.',
        advantage: 'Mara knows your desire is a choice, not a reward you expect for surviving.',
        addFlags: ['c5-admitted-future-with-mara'],
        result: 'You tell her you want ordinary mornings, arguments that can wait, and roads you choose together. Her smile is small, fierce, and more warming than the cloth.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-kiss-mara-after-truth',
        label: 'Admit you want her, ask what she wants, and kiss her only after she answers.',
        detail: 'Let desire become clear through words and mutual choice.',
        advantage: 'You and Mara enter the final danger with your relationship openly changed.',
        requiresRelationships: { mara: { trust: 5, attraction: 4 } },
        addFlags: ['c5-admitted-future-with-mara', 'c5-kissed-mara'],
        result: 'You speak before you move. Mara answers by pulling you close. Her mouth is warm and certain, and the hand at the back of your neck holds you there until the next horn reminds both of you where you are.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-admit-fear-to-mara',
        label: 'Tell her you are afraid of surviving another failed promise.',
        detail: 'Show her the fear beneath your command instead of offering romance you cannot yet name.',
        advantage: 'Mara understands the wound that may control your choice about Vaor.',
        addFlags: ['c5-told-mara-survivor-fear'],
        result: 'The words leave you colder and lighter. Mara presses your bandaged hand between both of hers. “Then do not make his life into a promise about your guilt,” she says.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-return-to-grave-duty',
        label: 'Thank her and return to the descent.',
        detail: 'Keep the feeling private until both of you are beyond the grave.',
        advantage: 'You make no promise under pressure and preserve every resource.',
        addFlags: ['c5-postponed-mara-answer'],
        result: 'Mara accepts the choice without pretending it does not hurt. She tightens your glove over the bandage and takes position beside you.',
        next: 'c5-vaor-wakes',
      },
    ],
  },

  'c5-vaor-wakes': {
    id: 'c5-vaor-wakes',
    kicker: 'One eye opens beneath a century',
    title: 'Vaor Under Glass',
    location: 'The Heart of the Grave',
    objective: 'Reach the fire Nail and learn why Vaor guards it.',
    threat: 'Rising',
    art: 'vaor',
    body: (state) => [
      'The descent ends above a dragon larger than Bellweather Inn. Black bronze scales show between glass plates. Blue fire runs through the plates like chains. One amber eye opens and finds you.',
      vaorResponse(state),
      'The fire Nail is fixed beneath his breastbone. The fragment in your hand belongs to its outer ring. Removing the living ember would restore heat to the valleys for a time, but doing it by force could kill him.',
      'Rook looks from the dragon to the narrow lock beside Vaor’s claw. “I have stolen from kings, graves, and one very possessive goose,” he says. “This is the first lock that can eat me.”',
      'Vaor’s claw is pinned within reach. You must decide how the conversation begins.',
    ],
    choices: [
      {
        id: 'c5-lower-weapon-vaor',
        label: 'Lower your weapon and offer to hear the evidence first.',
        detail: 'Treat Vaor as a witness rather than an obstacle.',
        advantage: 'He agrees to show the truth before demanding a decision.',
        addFlags: ['c5-vaor-heard-first'],
        result: 'You place your sword on the glass. Vaor’s eye narrows, then the nearest memory plate begins to glow.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-guard-fragment-from-vaor',
        label: 'Keep the fragment raised and demand safe passage for your party.',
        detail: 'Lead with the lives under your protection before discussing the dragon’s claim.',
        advantage: 'Vaor opens a warm shelter for your companions before the Crown arrives.',
        addFlags: ['c5-secured-warm-shelter'],
        result: 'You name every person behind you and what the cold has cost them. Vaor exhales once. Warm amber light opens beneath an unbroken plate.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-let-rook-test-lock',
        label: 'Let Rook inspect the lock beside Vaor’s claw.',
        detail: 'Give the thief freedom to surprise both dragon and captain.',
        advantage: 'Rook finds the Crown’s control spike without touching the Nail.',
        addFlags: ['c5-rook-found-control-spike'],
        result: 'Rook kneels, studies the lock, then places the commander’s missing boot inside it. The lock bites down. A hidden iron spike springs out of the floor. Vaor stares. “The goose was angrier,” Rook explains.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-free-vaor-claw',
        label: 'Break the plate pinning Vaor’s nearest claw.',
        detail: 'Lose 1 Health proving action before asking for trust.',
        advantage: 'Vaor can defend the chamber when the royal force arrives.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-freed-vaor-claw'],
        result: 'You drive your sword through the cold seam. Glass bursts across your armour, and Vaor slowly lifts one freed claw without striking you.',
        next: 'c5-vaor-test',
      },
    ],
  },

  'c5-vaor-test': {
    id: 'c5-vaor-test',
    kicker: 'The dragon asks one question',
    title: 'Why Save This World?',
    location: 'The Heart of the Grave',
    objective: 'Answer Vaor without promising what you do not understand.',
    threat: 'Rising',
    art: 'vaor',
    body: (state) => [
      'Vaor shows you a memory of the valleys before the cold fire. Dragons carried glass between mountain villages. Human children slept beneath warm wings during storms.',
      'Then the memory changes. Royal workers bind Vaor while the Regent watches from behind a screen of smoked glass. Malrec orders the dragon kept alive until he reveals where the first ember came from.',
      has(state, 'c5-carried-dragon-grief') || has(state, 'c5-carried-first-grief')
        ? 'You recognise the grief that entered through your Oathfire. It belongs to Vaor, and it has been pressing against every promise made near the Nail.'
        : 'You realise the cold fire carries emotion as well as hunger. Vaor’s grief has been pressing against every promise made near the Nail.',
      'Vaor asks, “Why should I help you preserve a world that buried its price with me?” You know a noble answer will mean nothing unless it is true.',
    ],
    choices: [
      {
        id: 'c5-answer-living-people',
        label: 'Tell him the living did not choose the crime that built their world.',
        detail: 'Defend present lives without defending the old rulers who hid the cost.',
        advantage: 'Vaor accepts that protecting people and exposing the sacrifice can be the same duty.',
        addFlags: ['c5-defended-living-world'],
        result: 'Vaor studies the people behind you. “An answer that excuses nobody,” he says. “Keep it when the easier answers arrive.”',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-oath-hear-dragon-grief',
        label: 'Promise to hear his grief without turning away.',
        detail: 'Lose 1 Resolve accepting Vaor’s pain and gain 2 Oathfire from the binding promise.',
        advantage: 'You gain power for the coming assault and Vaor trusts you with the buried memory.',
        changes: { resolve: -1, oathfire: 2 },
        requires: { resolve: 1 },
        addFlags: ['c5-oath-carry-vaor-grief', 'c5-vaor-trusted-memory'],
        result: 'The promise opens you. A century of cold, rage, and lonely waking enters your chest. Gold fire rises in answer, but none of the grief becomes smaller.',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-command-shared-witness',
        label: 'Ask every companion to witness the truth with you.',
        detail: 'Spend 1 Command making the burden public instead of carrying it alone.',
        advantage: 'Vaor’s evidence gains several witnesses the Crown cannot silence with one death.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-shared-dragon-witness'],
        result: 'Mara, Lysara, Sorin, and Rook each place a hand on the glass. Vaor’s memory enters four different minds and leaves four different voices able to tell it.',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-refuse-abstract-answer',
        label: 'Tell Vaor you will answer after seeing the hidden memory.',
        detail: 'Refuse to build a promise on evidence still withheld.',
        advantage: 'You preserve every resource and force the next choice to rest on facts.',
        addFlags: ['c5-demanded-full-truth'],
        result: 'Vaor’s breath warms the glass. “Suspicion without cruelty,” he says. “I had forgotten the shape of it.”',
        next: 'c5-crown-assault',
      },
    ],
  },

  'c5-crown-assault': {
    id: 'c5-crown-assault',
    kicker: 'The extraction force arrives',
    title: 'Royal Steel in the Grave',
    location: 'The Heart of the Grave',
    objective: 'Stop the Regent’s commander from cutting out Vaor’s ember.',
    threat: 'Critical',
    art: 'vaor',
    body: (state) => [
      'Commander Hale enters with twelve royal soldiers and the portable drill. His authority comes from Regent Malrec, not from a new order spoken by the ill Queen. He calls you a traitor and orders the fragment placed in the machine.',
      has(state, 'c5-has-extraction-order')
        ? 'You hold up the extraction order bearing his own seal. His soldiers see the line permitting Vaor’s death.'
        : has(state, 'c5-knows-commander-sacrifice')
          ? 'You name the soldiers he abandoned in the lower camp. Two people behind him glance at each other.'
          : 'His people look exhausted and afraid, but their crossbows remain level.',
      has(state, 'c5-crown-lost-trail') && !has(state, 'c5-crown-saw-flare')
        ? 'Hale arrived late because you hid your trail. Half his force is still searching the lower valley.'
        : 'The flare from the grave and the marked route brought his whole surviving force behind him.',
      'The drill begins to turn. Vaor’s chains tighten. You notice Hale watching the machine instead of his soldiers. You have seconds to decide which part of the attack must fail first.',
    ],
    choices: [
      {
        id: 'c5-break-royal-drill',
        label: 'Charge through the crossbows and break the drill.',
        detail: 'Lose 2 Health destroying the only machine that can cut out the ember quickly.',
        advantage: 'The Crown loses its extraction weapon and cannot repeat the attempt elsewhere.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-destroyed-royal-drill'],
        result: 'Two bolts strike armour before you reach the frame. Your sword enters the turning gears, and the drill tears itself apart around the blade.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-turn-hale-soldiers',
        label: 'Command Hale’s soldiers to read what he ordered.',
        detail: 'Spend 2 Command using proof and their dead companions against his authority.',
        advantage: 'Part of the royal force turns on Hale and survives to carry the truth home.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c5-royal-witnesses-turned'],
        result: 'You name the dead, the order, and the choice standing before each soldier. Four crossbows lower. Then six. Hale finds himself surrounded by the people he expected to spend.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-trust-rook-false-extraction',
        label: 'Let Rook steal the ember in full view of everyone.',
        detail: 'Spend 1 Resolve trusting his staged theft while the real fragment remains in your hand.',
        advantage: 'Hale sends his strongest soldiers after a false ember and leaves the drill exposed.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-rook-staged-ember-theft'],
        result: 'Rook plucks a red light from Vaor’s chest, bows, and runs. Hale sends eight soldiers after him. Only when the thief passes through a glass wall do you notice Lysara’s seed shining inside a mirrored coin.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-free-claw-against-crown',
        label: 'Let Vaor strike through the loosening chains.',
        detail: 'Spend 2 Oathfire binding the dragon’s strike to the armed attackers only.',
        advantage: 'Vaor destroys the drill without harming the frightened soldiers who surrender.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-vaor-broke-drill', 'c5-oath-limited-vaor'],
        result: 'Your Oath draws a gold boundary around every lowered weapon. Vaor tears one claw through the loosening glass and crushes the drill, stopping one finger from each person who surrenders.',
        next: 'c5-heart-memory',
      },
    ],
  },

  'c5-heart-memory': {
    id: 'c5-heart-memory',
    kicker: 'The sacrifice the Crown buried',
    title: 'Orivane’s Choice',
    location: 'The First Memory',
    objective: 'Witness what created the Concord and understand its hidden cost.',
    threat: 'Rising',
    art: 'vaor',
    introducesStoryTerms: ['Orivane'],
    lesson: {
      title: 'Orivane',
      body: 'Orivane was the dragon who gave her living heart to power the Concord, the ancient boundary that stabilised Edrath. She chose the sacrifice freely. The rulers who accepted it hid part of the cost.',
    },
    body: () => [
      'Vaor opens the deepest plate. You stand inside a memory that truly happened. A red gold dragon named Orivane faces rulers from several peoples. Armies are dying outside. The unstable realms are breaking roads, weather, and memory across Edrath.',
      'Orivane chooses to give her heart. Nobody tricks or forces her. Her fire becomes the power that separates the realms and makes one stable world possible.',
      'Then Vaor shows the hidden cost in a way you can understand. When the Concord fixed one path for the world, many other futures could never be lived. Children who might have been born were never conceived. Towns that might have grown were never founded. Friendships, inventions, and whole family lines lost the chance to begin.',
      'These are not people murdered in front of you, and they are not ghosts waiting nearby. They are real possibilities the stable world prevented from becoming lives. Vaor believes a sacrifice made without knowing that full cost cannot remain just forever.',
      'The memory ends with mortal rulers sealing the evidence inside his grave. You must decide which part of the truth you carry into the choice ahead. Vaor asks, “What will you remember when the mountain falls?”',
    ],
    choices: [
      {
        id: 'c5-honour-orivane-choice',
        label: 'Stay with Orivane’s choice until the memory ends.',
        detail: 'Spend 1 Resolve witnessing her death without looking away.',
        advantage: 'You learn that she demanded the Concord be questioned again by future generations.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-knows-orivane-renewal-wish'],
        result: 'Orivane’s last words survive beneath the rulers’ voices. She asks the living world to judge her gift again when it has the wisdom to choose freely.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-study-rulers-concealment',
        label: 'Study the rulers who sealed the memory.',
        detail: 'Spend 1 Command memorising faces, seals, and the order of their decisions.',
        advantage: 'You gain evidence that several governments knowingly hid the Concord’s cost.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-memorised-founder-seals'],
        result: 'You fix each seal in memory. Human, elven, orc, goblin, and other hands all closed the grave. No single people owns the crime or the truth.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-ask-vaor-his-future',
        label: 'Ask Vaor what life he wants now.',
        detail: 'Bring the choice back to the living prisoner instead of debating only history.',
        advantage: 'Vaor says plainly what freedom, force, and a pact would mean to him.',
        addFlags: ['c5-vaor-stated-terms'],
        result: 'Vaor wants the sky, his memories, and the right to speak. He will give an ember freely for release, fight any attempt to take it, or share his voice through a pact that joins your pain to his.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-let-rook-copy-proof',
        label: 'Let Rook copy the memory into black wax.',
        detail: 'Create portable proof while accepting that a thief will own another copy.',
        advantage: 'The truth can survive the collapse even if every glass plate breaks.',
        addFlags: ['c5-rook-copied-first-memory'],
        result: 'Rook presses black wax to the glass. When he lifts it, Orivane’s final fire moves inside. For once, he has no joke ready.',
        next: 'c5-grave-collapse',
      },
    ],
  },

  'c5-grave-collapse': {
    id: 'c5-grave-collapse',
    kicker: 'Hale chooses the mountain over surrender',
    title: 'Every Memory Starts to Fall',
    location: 'The Heart of the Grave',
    objective: 'Keep the living and the evidence from being buried together.',
    threat: 'Critical',
    art: 'vaor',
    body: (state) => [
      'Commander Hale reaches the hidden control spike and drives it down. The grave answers by pulling every glass plate toward Vaor at once. He intends to bury the dragon, the witnesses, and himself before the truth leaves the mountain.',
      has(state, 'c5-rook-found-control-spike')
        ? 'Rook saw the spike earlier. His silver wire is already looped around its release, but someone must give him time to pull it.'
        : 'Rook sees the release only after the spike moves. His silver wire can reach it, but falling glass fills the space between.',
      'Mara is beneath one collapsing shelf. Sorin is trying to save the oldest memory plate. Vaor’s freed or trapped claw strains against the cold chains. You cannot personally hold every falling piece.',
      'You hate the choice because leadership does not make the losses less real. It only makes them yours to name. Mara shouts through the breaking glass, “Name the priority!”',
    ],
    choices: [
      {
        id: 'c5-guard-mara-collapse',
        label: 'Take the falling shelf meant for Mara.',
        detail: 'Lose 2 Health saving Mara while the others follow Sorin’s marked exit.',
        advantage: 'Mara survives unhurt and keeps the fragment secure during the collapse.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-saved-mara-from-glass'],
        result: 'You reach Mara before the shelf does. Glass breaks across your back, and she keeps one hand around the fragment while dragging you clear.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-command-gallery-evacuation',
        label: 'Call a moving shelter through the falling gallery.',
        detail: 'Spend 2 Command placing every person where one shield can protect the next.',
        advantage: 'The whole group escapes the first collapse with several memory plates intact.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c5-saved-memory-witnesses'],
        result: 'Each person protects the back ahead. The line moves as one body, carrying witnesses and three unbroken memories into Vaor’s shelter.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-oath-hold-memories',
        label: 'Promise the grave will remember until everyone is clear.',
        detail: 'Spend 2 Oathfire holding the memory plates in place through Vaor’s grief.',
        advantage: 'No person or surviving record is lost before the final choice.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-oath-held-memory-grave', 'c5-carried-dragon-grief'],
        result: 'Gold lines join the falling plates. Every memory hangs in the air while people run beneath them. Vaor’s grief enters the Oath, and your knees nearly fail under its age.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-rook-drop-false-ceiling',
        label: 'Let Rook collapse the false gallery around Hale.',
        detail: 'Use his prepared wire and sacrifice part of the Crown evidence to stop the control spike.',
        advantage: 'Everyone reaches Vaor, and Hale is trapped away from the Nail without spending a stat.',
        addFlags: ['c5-rook-trapped-hale', 'c5-lost-royal-camp-proof'],
        result: 'Rook pulls one wire. A painted glass ceiling falls where no true ceiling existed, driving Hale away from the spike. “Architecture,” Rook says, “is mostly confidence.”',
        next: 'c5-ember-choice',
      },
    ],
  },

  'c5-ember-choice': {
    id: 'c5-ember-choice',
    kicker: 'The fire needs a living bearer',
    title: 'Vaor’s Ember',
    location: 'The Breaking Heart Chamber',
    objective: 'Choose how the ember leaves Dragonspine.',
    threat: 'Critical',
    art: 'ember',
    lesson: {
      title: 'The choice before you',
      body: 'Freeing Vaor earns a willing ember but releases a powerful dragon. Taking it by force gives Caelan control and makes Vaor an enemy. A pact places Vaor’s voice and grief inside Caelan until both agree the duty is complete.',
    },
    body: (state) => [
      'The fire Nail splits around Vaor’s chest. Warm red gold light appears beneath the cold blue chains. The valleys need that ember carried away before the broken Nail consumes it.',
      has(state, 'c5-vaor-stated-terms')
        ? 'Vaor has already named what each path costs him. He waits for you to prove that listening changed more than your words.'
        : 'Vaor explains the three paths plainly. Release brings his willing gift. Force takes the ember and leaves him alive but wounded. A pact lets the ember travel inside you with his voice.',
      has(state, 'c5-told-mara-survivor-fear')
        ? 'Mara’s warning stays with you. This cannot be a promise made only to punish yourself for older failures.'
        : 'Mara watches your face, not the fire. She knows the most dangerous part of an Oath is how easily duty can hide desire or guilt.',
      'The Crown wanted a weapon. Vaor wants freedom. The world beyond the mountain needs heat. No option protects every claim, and none leaves you unchanged.',
    ],
    choices: [
      {
        id: 'c5-free-vaor',
        label: 'Break the remaining chains and accept Vaor’s willing ember.',
        detail: 'Release an ancient dragon whose choices will no longer belong to you or the Crown.',
        advantage: 'Vaor becomes a free ally, and the ember enters you without violence or a binding voice.',
        changes: { wayfire: 2 },
        addFlags: ['c5-freed-vaor', 'c5-ember-willing'],
        result: 'You set the fragment into the outer ring and turn it away from Vaor. The chains open. He touches one claw to your chest and gives a small living flame by choice.',
        next: 'c5-ending-free',
      },
      {
        id: 'c5-take-ember-by-force',
        label: 'Cut the ember free and keep it under your command.',
        detail: 'Lose 2 Health taking the fastest power while Vaor resists you.',
        advantage: 'You gain a strong controlled ember and prevent the dragon from deciding where it goes.',
        changes: { health: -2, wayfire: 2 },
        requires: { health: 1 },
        addFlags: ['c5-took-ember-by-force', 'c5-vaor-enmity'],
        result: 'You drive the fragment through the cold chain and tear the ember free. Fire enters your wounds. Vaor lives, but the sound he makes follows you out of the grave.',
        next: 'c5-ending-force',
      },
      {
        id: 'c5-pact-with-vaor',
        label: 'Make a pact and carry Vaor’s voice with the ember.',
        detail: 'Spend 2 Resolve sharing thought, grief, and power until the duty is complete.',
        advantage: 'Vaor remains protected while his knowledge and living fire travel inside you.',
        changes: { resolve: -2, wayfire: 2 },
        requires: { resolve: 1 },
        addFlags: ['c5-vaor-pact', 'c5-vaor-voice-within'],
        result: 'You state the end condition and Vaor accepts it. His ember crosses into your chest with a second heartbeat. When he speaks again, the voice comes from inside your own breath.',
        next: 'c5-ending-pact',
      },
    ],
  },

  'c5-ending-free': {
    id: 'c5-ending-free',
    kicker: 'Chapter Five complete',
    title: 'A Dragon Above the Valleys',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Carry the willing ember to Kharad Vey before the Black Gate opens wider.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: () => [
      'Vaor breaks through the mountain roof. Cold blue fire reaches for him and recoils from the warm ember now burning inside your chest.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. The power warms your blood, but you feel how easily it could become hunger if used without care.',
      'Vaor circles once above the glass valleys, free for the first time in a century. He does not swear obedience. He promises only to meet you where the eastern road reaches Kharad Vey.',
      'Then the ember shows you a distant vision. The Black Gate stands open by the width of a hand. Red light moves behind it, and something on the other side has noticed the road leading from your heart.',
    ],
    choices: [],
  },

  'c5-ending-force': {
    id: 'c5-ending-force',
    kicker: 'Chapter Five complete',
    title: 'The Ember Taken',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Reach Kharad Vey before Vaor or the Crown takes back the ember.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: () => [
      'Warm fire seals the worst of the grave behind you, but it cannot restore the Health the cold flame took. Every wound reminds you how the ember entered your body.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. The flame obeys quickly. That obedience feels useful and wrong in equal measure.',
      'Vaor tears free after you reach the eastern slope. His first roar breaks glass across three valleys. He turns east, following the fire you took.',
      'The ember shows you a distant vision. The Black Gate is beginning to open. You need the moving orc town of Kharad Vey, its road across the steppe, and allies strong enough to survive both the Gate and the dragon behind you.',
    ],
    choices: [],
  },

  'c5-ending-pact': {
    id: 'c5-ending-pact',
    kicker: 'Chapter Five complete',
    title: 'Two Voices, One Flame',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Carry Vaor’s voice and ember to Kharad Vey without losing your own judgment.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: () => [
      'You leave the grave with a second heartbeat beneath your armour. Vaor remains in the mountain while his voice travels inside the ember.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. Warm flame answers your breath. So does Vaor’s grief, vast enough to make the eastern sky look painfully small.',
      'Mara asks whether you can still hear her. You answer in your own voice. Vaor adds, inside your thoughts, that this is an excellent question to keep asking.',
      'The ember shows both of you the Black Gate opening by the width of a hand. Beyond Dragonspine, Kharad Vey moves across the red steppe. Reaching it is now the clearest road between the world and what is coming through that Gate.',
    ],
    choices: [],
  },
};
