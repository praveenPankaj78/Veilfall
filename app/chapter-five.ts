import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function rookArrival(state: GameState) {
  if (has(state, 'c4-rook-arrested')) {
    return 'Rook walks twenty steps ahead with the empty iron cuff worn as a bracelet. You arrested him on the bridge. He escaped without leaving. Each flash of iron at his wrist tightens your jaw.';
  }
  if (has(state, 'c4-rook-bargain')) {
    return 'Rook keeps the bargain he made on the bridge. He guides you north, names each hidden turn, and supplies exactly one honest warning per day. Whenever his smile disappears, your hand finds your sword.';
  }
  return 'You trusted Rook to choose his own road. He left after the bridge, then deliberately rejoined your group during the three day climb because his buyer is also somewhere in Dragonspine. He appeared above the path with dry boots and a stolen Crown map. “I led you by removing several bad guides,” he says.';
}

function rookAtShelter(state: GameState) {
  if (has(state, 'c4-rook-arrested')) {
    return 'Rook waits beside the refuge door, still travelling north under your arrest even though the empty cuff now hangs from his wrist like jewellery.';
  }
  if (has(state, 'c4-rook-bargain')) {
    return 'Rook waits beside the refuge door. Your bargain keeps him with the group until you find the buyer who sent him north.';
  }
  return 'Rook is still with you after rejoining the group on the climb. You gave him freedom, and he is using it to follow his buyer toward the abandoned royal camp.';
}

function relationshipInterlude(state: GameState) {
  if (has(state, 'c5-chose-mara-care')) return 'c5-mara-burns';
  if (has(state, 'c5-chose-lysara-care')) return 'c5-lysara-burns';
  return 'c5-sorin-care';
}

function ordanCustody(state: GameState) {
  if (has(state, 'c4-captured-ordan')) {
    return 'Ordan did not come north. Elene took him into Harrowfen custody with Garran and the surviving documents. The choice left a living witness behind and kept a wounded prisoner out of a climb that would have killed him. It still sits badly beneath your ribs.';
  }
  if (has(state, 'c4-ordan-lower-road')) {
    return 'Ordan escaped onto a lower road, but the dispatch taken from him led you here. Every time you unfold it, the memory of his empty chain returns with it.';
  }
  return 'Ordan is gone, but the genuine royal dispatch from his coat led you here. His part in the pursuit is over. The authority above him is not.';
}

function routeMemory(state: GameState) {
  if (has(state, 'c4-snow-route')) {
    return 'The blue fire resembles the flame from the bridge’s mountain span. There it only filled the sky. Here, cold fingers reach through your armour for the warmth underneath.';
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
  return 'The dragon’s amber eye follows the iron in your fist. Heat prickles through your numb fingers as that gaze settles on them.';
}

export const chapterFiveNodes: Record<string, StoryNode> = {
  'c5-north-road': {
    id: 'c5-north-road',
    kicker: 'Chapter Five',
    title: 'The Dragon’s Cold Grave',
    location: 'The Glass Valleys of Dragonspine',
    objective: 'Reach the active fire Nail before the Regent’s soldiers cut into it.',
    threat: 'Rising',
    art: 'dragonspine',
    introducesStoryTerms: ['cold fire'],
    lesson: {
      title: 'Cold fire and Health',
      body: 'While cold fire burns nearby, rest can stop exhaustion from worsening, but Health cannot recover. Leaving its reach removes this restriction.',
    },
    body: (state) => [
      'The last Mileless stone turns under your boot and becomes Dragonspine’s lower road before dusk. That first night, no one dares light a fire. Mara shares her blanket without asking, and every boot against the glass sounds like someone following. By the third day, the mountains have swallowed the last green tree and any help that could arrive in time.',
      ordanCustody(state),
      rookArrival(state),
      'Now blue flame rises from cracks on both sides of the path. It bends against the wind and reaches toward your lantern.',
      routeMemory(state),
      'Mara covers the lantern. The blue fire ignores the darkness and bends toward your exposed hand. You press your palm to the black glass. It steals enough heat to make the nearest flame turn away. Old strips of keeper cloth lie frozen against the wall, cold enough to hide a body’s warmth for a few minutes.',
      'The road ahead narrows between two walls of glass, and the flames are already closing behind you. Mara asks, “How do we cross?”',
    ],
    choices: [
      {
        id: 'c5-cross-in-shadow',
        label: 'Wrap everyone in glass chilled cloth and crawl along the cold wall.',
        detail: 'Mask body heat for a slow crossing, but give the royal patrol more time to follow.',
        advantage: 'The party enters the valley without feeding the fire or spending a stat.',
        addFlags: ['c5-slow-shadow-crossing'],
        result: 'You wrap the group in cloth chilled by the black glass and keep every shoulder against the wall. The blue fire searches past your hidden warmth while a distant royal horn gains ground.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-command-lantern-relay',
        label: 'Send the lanterns ahead in a timed relay.',
        detail: 'Spend 1 Command making the fire chase moving heat instead of your people.',
        advantage: 'The relay should let the whole party cross quickly with its winter supplies intact.',
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
        advantage: 'The promise should shield every companion and reveal whether the fire can hear an Oath.',
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
        advantage: 'Holding the rear should keep the party moving and stop the fire marking another traveller.',
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
    body: () => [
      'A man pounds on the inside of a fallen glass slab. One leg is pinned beneath it. Blue fire moves across the clear surface toward the heat of his hands.',
      '“Sorin,” he gasps when he sees you. “I keep the old path to the dragon’s grave. Please. Get this off me before the fire reaches my hands.”',
      'Your burned fingers close around the edge of the slab. “The dragon’s grave,” Sorin gasps. Blue fire touches his knuckles, and the rest of the answer becomes a scream.',
    ],
    choices: [
      {
        id: 'c5-lift-glass-slab',
        label: 'Lift the slab while Mara pulls Sorin free.',
        detail: 'Lose 1 Health taking the glass weight through your injured body.',
        advantage: 'Reaching him directly should save Sorin with his maps and full ability to guide the climb.',
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
        advantage: 'A clean lift should free Sorin without injury and teach the group the rhythm of mountain rescue.',
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
        advantage: 'The fragment may draw the fire away and reveal the direction of the buried dragon.',
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
    introducesStoryTerms: ['Vaor'],
    body: (state) => [
      'Sorin leads you into a refuge cut entirely from glass. There is no hearth. A fire would call every blue flame in the valley, so the group shares blankets and eats cold grain.',
      'Your breathing settles, but the pale edges of your burns do not close. Outside, blue flame keeps circling the glass. Until you leave its reach, rest will not restore the Health it has taken.',
      has(state, 'c5-lost-winter-supplies')
        ? 'The sacrificed ration pack saved Sorin. It also leaves one blanket for every two people. Mara sits close enough that the heat of her thigh reaches yours through wet cloth, a practical kindness that neither of you mistakes for only that.'
        : 'Mara sits beside you beneath one blanket. Her shoulder presses against yours while she studies the pale burn around your glove.',
      rookAtShelter(state),
      'Once he can breathe without shaking, Sorin explains what he could not say beneath the glass. Vaor is an ancient dragon buried alive beside the fire Nail. A royal survey force opened his grave two nights ago. Several soldiers died when their commander tested the drill, and the survivors carried the machine higher.',
      'Sorin sketches three paths to the upper grave, then plants the charcoal point in the centre of the map. “We have time for one question,” he says. “Make it count.”',
    ],
    choices: [
      {
        id: 'c5-let-mara-check-burns',
        label: 'Ask Mara to take responsibility for the burn.',
        detail: 'Choose Mara for the personal check before the final descent. Romance is not assumed.',
        advantage: 'Mara learns which burn may fail during the final climb.',
        addFlags: ['c5-let-mara-check-burns', 'c5-chose-mara-care'],
        result: 'Mara unwraps your hand and marks the edge of the numb skin with ink. “If it crosses that line, you tell me,” she says. You promise without using magic.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-ask-lysara-read-nail',
        label: 'Ask Lysara to trace the Nail’s heat through your burn.',
        detail: 'Spend 1 Resolve and choose Lysara for the personal check before the final descent.',
        advantage: 'The reading may show whether the dragon and the fire Nail occupy the same chamber.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-lysara-linked-grave', 'c5-chose-lysara-care'],
        result: 'Green thread passes through the black iron and points upward. Lysara feels a heartbeat behind the fire mark. The Nail is not merely near a dragon. It is touching one.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-question-sorin-paths',
        label: 'Ask Sorin to treat the burn and explain the old paths.',
        detail: 'Choose professional care and learn the purpose of each route without entering a romance scene.',
        advantage: 'Sorin explains which danger belongs to each route before you commit.',
        addFlags: ['c5-knows-route-purposes', 'c5-chose-sorin-care'],
        result: 'Sorin dresses the pale edge of the burn while he talks. The stair was built for soldiers, the frozen river for dragon keepers, and the ash tunnel for carrying injured climbers down.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-send-rook-scouting',
        label: 'Let Rook scout the abandoned royal camp.',
        detail: 'Let Sorin handle the burn while Rook scouts Crown property. This keeps the later interlude professional.',
        advantage: 'He returns with the patrol schedule and one item he refuses to name yet.',
        addFlags: ['c5-rook-scouted-camp', 'c5-chose-sorin-care'],
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
      'Asterra’s crowned shield marks every coat. Your colours. Your kingdom. Your stomach tightens. But each dead soldier also wears Malrec’s split mountain seal, and the orders beside them name the Regent’s private command while the Queen lies ill.',
      'Sorin recognises the split mountain seal stamped into the drill. Commander Hale led this expedition. Rook checks the same mark against the secret code used by his buyer. The buyer was connected to this camp, but is not among the dead and has already moved east.',
      'A diagram beside the drill names its target: a living ember, a piece of Vaor’s own fire. The ember is not the fire Nail. Hale means to cut it out of the dragon and use it to control the damaged Nail.',
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
        advantage: 'A careful search should preserve direct proof that the Regent ordered an ember extracted from a living dragon.',
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
        advantage: 'The positions of the dead may show who opened the fire channel and abandoned them.',
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
        result: 'Rook seals an order warning that the camp latrine has become a strategic fire hazard. The patrol reads it twice and runs downhill carrying buckets. You look at the frozen soldiers until Rook’s smile fades. He follows without another joke.',
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
      'An arrow strikes the stair. Ice pops above the river. The drill knocks loose a stone inside the tunnel. Your body prepares for three different deaths. Sorin grips his map. “Which sound do we follow?”',
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
      'Rook shifts one boot. Six clear reflections shift with him while the glass gives everyone else only one. Your eyes move from the copies to his mirrored coat buttons. His answering grin is far too pleased.',
    ],
    choices: [
      {
        id: 'c5-stair-shield-command',
        label: 'Advance the shields on your count.',
        detail: 'Spend 1 Command crossing between volleys without losing formation.',
        advantage: 'The timing should bring the full group to the archers with its climbing gear intact.',
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
        advantage: 'The exposed climb may let you break the archer line before it can warn the commander.',
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
      'Lysara’s next breath clouds the ice. The crack crawls after it. She clamps a hand over her mouth, but another blue finger is already pressing through.',
    ],
    choices: [
      {
        id: 'c5-river-oath-decoy',
        label: 'Send your Oathfire ahead as a false heartbeat.',
        detail: 'Spend 1 Oathfire making the blue flame chase your promise through the ice.',
        advantage: 'The false heartbeat should draw the fire away and may reveal where it travels.',
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
        advantage: 'Moving slowly in darkness should keep light and panic from drawing the flame through the crack.',
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
      'A support beam splits. Sorin strikes four sharp notes against it, the old keeper signal for a collapse, then says the tunnel will hold for perhaps one minute. Rook watches his hand and listens to the rhythm.',
      'Six blows travel through the rock. A pause. Six more. Muffled voices count above you, unaware that every strike drops stone onto the people below. Rook raises one finger before the next count begins.',
    ],
    choices: [
      {
        id: 'c5-tunnel-brace',
        label: 'Hold the broken beam while everyone passes.',
        detail: 'Lose 1 Health taking the mountain’s weight through your shoulders.',
        advantage: 'Holding the beam should let every companion and all remaining evidence reach the grave entrance.',
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
        advantage: 'Two coordinated teams may open a second exit and trap the drill above it.',
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
      'Cold fire pours from all three passages and stretches into long jaws. Sorin flattens himself against the door. “Moving air gives it shape,” he says. “Still fire. Still kills.”',
      has(state, 'c5-fragment-found-grave')
        ? 'The fragment pulls toward a narrow socket in the door. The bright direction it showed below ends here, with the iron straining toward its match.'
        : 'Lysara finds a narrow socket in the door that matches the fragment. Using it may open the grave or wake whatever is inside.',
      'Mara raises her shield. Sorin braces both hands against the damaged ring while Lysara lifts the fragment. “Which part do we hold?” Mara asks.',
    ],
    choices: [
      {
        id: 'c5-oath-shelter-grave',
        label: 'Promise the fire will not cross your shield.',
        detail: 'Spend 2 Oathfire holding the flame back while Sorin repairs the ring.',
        advantage: 'The shield Oath should let everyone enter together and keep the grave door usable behind you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-oath-held-grave', 'c5-carried-dragon-grief'],
        result: 'Gold fire covers your shield. The blue jaws strike it and stop. With every impact, a dragon’s memory of someone he could not save presses through your arms.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-break-frozen-channel',
        label: 'Smash the ice channels feeding the fire.',
        detail: 'Lose 2 Health cutting off the flame at arm’s reach.',
        advantage: 'Breaking the channels should drain the cold fire before it can follow the party inside.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-broke-fire-channels'],
        result: 'You break the first channel with your sword and the second with your shoulder. The fire falls into the mountain as Mara drags you through the opening door.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-command-heat-decoys',
        label: 'Divide the lanterns and pull the fire apart.',
        detail: 'Spend 1 Command sending three teams along prepared retreat lines.',
        advantage: 'The decoys should divide the flame long enough for Sorin to open the door without damaging it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-split-coldfire'],
        result: 'Three warm lanterns run in three directions. The blue jaws divide after them, and Sorin turns the repaired ring.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-open-door-with-fragment',
        label: 'Drive the fragment into the door socket.',
        detail: 'Open the fastest path while announcing the fragment to the active Nail.',
        advantage: 'The party enters without spending a stat, but the Crown commander can follow the flare.',
        addFlags: ['c5-fragment-opened-grave', 'c5-crown-saw-flare'],
        result: 'Black iron enters clear glass. The whole mountain flashes blue, the door opens, and a royal horn answers from below.',
        next: relationshipInterlude,
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
      'Sorin lays his palm against one moving scene. “Dragons stored important memories in mountain glass so later generations could witness them,” he says. “Someone stacked Vaor’s own memories over his living body and ran cold fire through them. They made his life into the bars of his prison.”',
      'A deep voice moves through the floor. “My name is Vaor. If you have come for my ember, captain, at least look at what your Crown buried with me.”',
      'Your hand wants the sword when he says your Crown. Fresh drill scars cross the glass above his eye. The blade stays down.',
    ],
    choices: [
      {
        id: 'c5-touch-memory-plate',
        label: 'Touch the plate nearest Vaor’s voice.',
        detail: 'Spend 1 Resolve experiencing part of a dragon’s grief without protection.',
        advantage: 'Enduring the contact may reveal which memory the Crown feared enough to bury deepest.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-found-orivane-memory', 'c5-carried-dragon-grief'],
        result: 'The glass fills your mind with a red gold dragon standing inside a circle of mortal rulers. Vaor hides the scene behind pain before you can understand it fully.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-ask-memory-permission',
        label: 'Ask Vaor which memory you may approach.',
        detail: 'Give the prisoner control over what you learn first.',
        advantage: 'Vaor guides you along a safe path and remembers the courtesy.',
        addFlags: ['c5-asked-memory-permission', 'c5-vaor-respected'],
        result: 'Silence lasts long enough to feel like refusal. Then amber light appears beneath one row of plates, marking a path that does not cross Vaor’s private grief.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-break-memory-slab',
        label: 'Break one binding plate and clear a direct path.',
        detail: 'Lose 1 Health cutting through glass and destroy one of Vaor’s lived days.',
        advantage: 'Breaking a direct path should reach the dragon before the Crown enters the gallery.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-broke-memory-slab', 'c5-fast-to-vaor'],
        result: 'The plate breaks beneath your pommel. A summer day vanishes from the glass, and the dragon’s roar shakes dust from the ceiling.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-seed-read-memories',
        label: 'Let Lysara’s living seed find a path between the memories.',
        detail: 'Risk her weakened treaty magic against the cold bindings.',
        advantage: 'The seed separates public history from Vaor’s private memories without breaking either.',
        addFlags: ['c5-lysara-sorted-memories'],
        result: 'Green roots move between the plates. They touch battles and councils, but bend around love, grief, and the small private days that belong only to Vaor.',
        next: 'c5-vaor-wakes',
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
      has(state, 'c4-kissed-mara')
        ? 'Her thumb passes over the place where your pulse beats hardest, and the bridge returns in a flash: her mouth on yours, the road breaking beneath both of you. Desire is no longer the question. What happens after the road is.'
        : 'She tightens the bandage with her teeth, as she did after your first sparring cut behind the old forge. This time she does not release your hand when the knot is finished.',
      has(state, 'c4-oath-honest-with-mara')
        ? 'Gold warmth stirs beneath the promise not to hide behind duty. Mara’s fingers tighten around yours. “Do not give me a captain’s answer,” she says. “Tell me what you want if we leave this mountain.”'
        : 'Mara ties the cloth and keeps hold of your hand. “You keep telling me who must survive,” she says. “Tell me what you want if you are one of them.”',
      'A royal horn sounds deeper inside the grave. Mara does not release your hand. “Tell me now,” she says.',
    ],
    choices: [
      {
        id: 'c5-admit-future-with-mara',
        label: 'Tell Mara you want a life that includes her.',
        detail: 'Make an honest admission without turning it into another magical duty.',
        advantage: 'Mara knows your desire is a choice, not a reward you expect for surviving.',
        forbidsRelationshipIntents: { lysara: ['exploring', 'committed'] },
        addFlags: ['c5-admitted-future-with-mara'],
        result: 'You tell her you want ordinary mornings, arguments that can wait, and roads you choose together. Her smile is small, fierce, and more warming than the cloth.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-kiss-mara-after-truth',
        label: 'Tell Mara the future you want, then leave the last step to her.',
        detail: 'Available when shared trust and attraction have become unmistakable.',
        advantage: 'You and Mara enter the final danger with your relationship openly changed.',
        requiresRelationships: { mara: { trust: 5, attraction: 4 } },
        forbidsRelationshipIntents: { lysara: ['exploring', 'committed'] },
        addFlags: ['c5-admitted-future-with-mara', 'c5-kissed-mara'],
        result: 'You name the ordinary mornings and chosen roads you want with her. Mara searches your face, then smiles and pulls you close. Her mouth is warm and certain. When she parts from you, her hand remains at the back of your neck. “That was my answer,” she says.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-admit-fear-to-mara',
        label: 'Tell her you are afraid of surviving another failed promise.',
        detail: 'Show her the fear beneath your command instead of offering romance you cannot yet name.',
        advantage: 'Mara understands the wound that may control your choice about Vaor.',
        addFlags: ['c5-told-mara-survivor-fear'],
        result: 'The words leave you colder and lighter. Mara presses your bandaged hand between both of hers. “Then do not make his life into a promise about your guilt,” she says.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-choose-mara-friendship',
        label: 'Tell Mara you love her as family, not as a lover.',
        detail: 'Choose a lasting friendship without asking her to wait for romance later.',
        advantage: 'Your oldest bond gains a clear and honest shape.',
        addFlags: ['c5-mara-friendship'],
        result: 'Mara is silent long enough for the mountain to creak around you. Then she bumps her forehead against your shoulder, hard. “Family gets to drag you back from stupid deaths,” she says. “Remember that.” The old ease between you returns without becoming smaller.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-return-to-grave-duty',
        label: 'Thank her and return to the descent.',
        detail: 'Keep the feeling private until both of you are beyond the grave.',
        advantage: 'You make no promise under pressure and preserve every resource.',
        addFlags: ['c5-postponed-mara-answer'],
        result: 'Mara nods and pulls your glove over the bandage with careful hands. “After the mountain,” she says. It is permission to wait, not a demand for a different answer.',
        next: 'c5-memory-wall',
      },
    ],
  },

  'c5-lysara-burns': {
    id: 'c5-lysara-burns',
    kicker: 'Green light in a cold grave',
    title: 'What the Treaty Cannot Ask',
    location: 'A Shelter in the Memory Gallery',
    objective: 'Decide how much personal trust can survive the political truth ahead.',
    threat: 'Uneasy',
    art: 'vaor',
    body: (state) => [
      'Lysara loops green thread around your burned wrist and keeps walking. Each time the gallery floor shifts, the thread draws you around the dangerous plate before your numb hand can betray you. Care from her looks less like rest and more like refusing to let either of you fall behind.',
      has(state, 'c4-lysara-private-truth')
        ? 'The founder seal she showed you on the bridge returns inside three memories. Her mother’s house helped bury something here. Lysara sees the marks and does not slow down.'
        : 'Three memories carry the seal of Lysara’s mother’s house. Her breath catches once. Then the court mask returns, thin enough that you can see the fear beneath it.',
      '“If this grave condemns my family, I will speak against them,” she says. “If it condemns your Crown, I expect the same from you. Attraction is easy beside a fire. I need to know what survives disagreement.”',
      'The thread reaches the next broken span and pulls taut between you. Lysara holds your eyes across it. “So answer me as Caelan. Not as my guard.”',
    ],
    choices: [
      {
        id: 'c5-admit-future-with-lysara',
        label: 'Tell Lysara you want to know her beyond the treaty.',
        detail: 'Choose a personal future without claiming that she owes you one.',
        advantage: 'Lysara knows your interest belongs to Caelan, not merely to her diplomatic value.',
        forbidsRelationshipIntents: { mara: ['exploring', 'committed'] },
        addFlags: ['c5-admitted-future-with-lysara'],
        result: 'You tell her that the treaty may have placed her on your road, but it did not create what you feel. Her careful expression opens into a smile meant for no court.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-kiss-lysara-after-truth',
        label: 'Tell her the road is not the only future you want.',
        detail: 'If Lysara wants the same, let her close the distance on her own terms.',
        advantage: 'You and Lysara enter the grave knowing the desire is shared and freely chosen.',
        requiresRelationships: { lysara: { trust: 4, attraction: 3 } },
        forbidsRelationshipIntents: { mara: ['exploring', 'committed'] },
        addFlags: ['c5-admitted-future-with-lysara', 'c5-kissed-lysara'],
        result: '“I want to know the man who exists when nobody is calling him Captain,” Lysara says. The thread around your wrist draws you closer, slowly enough for either of you to stop it. Neither does. Her kiss is soft, deliberate, and entirely her answer.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-protect-lysara-choice',
        label: 'Promise to stand beside her truth even when you disagree.',
        detail: 'Choose political and personal respect without making a romantic promise.',
        advantage: 'Lysara may trust that disagreement will not become abandonment.',
        addFlags: ['c5-protected-lysara-choice'],
        result: '“Beside me is not the same as beneath my command,” Lysara says. You agree. The tension in the thread eases, and she leads you across without asking you to follow blindly.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-choose-lysara-friendship',
        label: 'Tell Lysara you want her trust and friendship, not romance.',
        detail: 'Give the bond a complete shape without treating friendship as a consolation.',
        advantage: 'Lysara gains an ally who has stated his limits as clearly as his loyalty.',
        addFlags: ['c5-lysara-friendship'],
        result: 'Lysara studies you as if testing for a polite lie. Then she unloops the thread and offers her bare hand. “Friendship between our positions may be the more dangerous choice,” she says. Her smile makes it clear she does not mean the lesser one.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-delay-lysara-answer',
        label: 'Tell her you cannot give an honest answer inside this crisis.',
        detail: 'Preserve the possibility without using danger to force certainty.',
        advantage: 'You make no promise under pressure and keep her trust intact.',
        addFlags: ['c5-postponed-lysara-answer'],
        result: 'Lysara nods once. “An honest delay is still honest.” She keeps the guide thread between you until the broken span is behind both of you.',
        next: 'c5-memory-wall',
      },
    ],
  },

  'c5-sorin-care': {
    id: 'c5-sorin-care',
    kicker: 'A wound treated without a promise',
    title: 'The Keeper’s Hands',
    location: 'A Workbench in the Memory Gallery',
    objective: 'Prepare the burn and choose how to use a quiet minute without romance.',
    threat: 'Uneasy',
    art: 'vaor',
    body: () => [
      'Sorin sits you at a keeper’s bench and works powdered glass into warm resin. Mara holds the lamp. Lysara steadies the fragment in a loop of green thread. Nobody turns the treatment into a question about whom you desire.',
      'The resin bites when Sorin presses it over the burn. Your hand begins to feel like your own again. “Pain means the cold has not taken it,” he says. “Useful news. Not pleasant news.”',
      'Rook lays four stolen spoons in a neat row and claims this is medical support. Mara moves one toward him without looking. He pockets all four.',
      'For once, the quiet belongs to you. Sorin ties the final knot. “Your minute, captain,” he says. “Use it.”',
    ],
    choices: [
      {
        id: 'c5-choose-both-friendship',
        label: 'Tell Mara and Lysara you value both of them as friends.',
        detail: 'Choose a full platonic path without leaving either relationship silently pending.',
        advantage: 'Both women receive an honest place in your life that does not depend on romance.',
        addFlags: ['c5-mara-friendship', 'c5-lysara-friendship'],
        result: 'You say it plainly. Mara hooks an arm around your shoulders. Lysara leans against the other side with careful dignity until Rook calls it a treaty formation and all three of you tell him to be quiet.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-use-quiet-for-names',
        label: 'Write the names of everyone still depending on you.',
        detail: 'Use the quiet to remember people without turning them into one burden.',
        advantage: 'The list may steady Caelan when Vaor tests why he protects the living.',
        addFlags: ['c5-wrote-living-names'],
        result: 'The names fill half a page. Mara adds one you missed. Lysara corrects the spelling of another. The burden becomes people again.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-ask-sorin-about-vaor',
        label: 'Ask Sorin what Vaor was like before the Crown came.',
        detail: 'Spend the minute learning about the prisoner as a person rather than a source of power.',
        advantage: 'Sorin may give you one memory that helps Vaor hear your first words.',
        addFlags: ['c5-knows-vaor-kindness'],
        result: 'Sorin remembers Vaor warming the nursery glass before winter births. “He knew every child by the sound of their feet,” he says. The dragon ahead becomes harder to reduce to a mission.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-let-rook-distract-pain',
        label: 'Ask Rook why a thief carries four matching spoons.',
        detail: 'Choose ordinary laughter before entering the oldest grief in the mountain.',
        advantage: 'The group may reach Vaor less frightened and more human.',
        addFlags: ['c5-rook-spoon-story'],
        result: 'Rook gives four incompatible answers. By the third, Sorin is laughing too hard to tie the bandage. The danger has not changed, but your breathing has.',
        next: 'c5-memory-wall',
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
      'Lysara studies the iron cage fixed beneath Vaor’s breastbone. “That broken cage is the fire Nail,” she says. “The warm light inside Vaor is his living ember. They are not the same thing.”',
      'The fragment in your hand belongs to the Nail of Distance, but all nine Nails were forged with the same outer lock. The fragment can open the fire Nail without being part of it. Removing Vaor’s ember would restore heat to the valleys for a time, but doing it by force could kill him.',
      'Rook looks from the dragon to the narrow lock beside Vaor’s claw. “I have stolen from kings, graves, and one very possessive goose,” he says. “This is the first lock that can eat me.”',
      'Vaor flexes the claw pinned beneath the nearest plate. A crack runs toward your boot. “Captain,” he says. “Will your first answer be a weapon?”',
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
        result: 'Rook kneels, studies the lock, then slides one of his established mirrored coins beneath its teeth. The lock bites the reflection instead of his hand. A hidden iron spike springs out of the floor. Vaor stares. “The goose was angrier,” Rook explains.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-free-vaor-claw',
        label: 'Break the plate pinning Vaor’s nearest claw.',
        detail: 'Lose 1 Health proving action before asking for trust.',
        advantage: 'Freeing the claw may let Vaor defend the chamber when the royal force arrives.',
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
        ? 'The pressure that entered through your Oathfire returns behind your eyes. It belongs to Vaor, and it has been pressing against every promise made near the Nail.'
        : 'The cold fire leans toward Vaor’s voice. His grief moves through it, pressing against every promise made near the Nail.',
      'Vaor asks, “Why should I help the people of those who chained me?” A polished answer rises to your tongue. The royal drill trembles through the glass, and you leave it unsaid.',
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
        advantage: 'The binding promise should return Oathfire and may earn Vaor’s trust with the buried memory.',
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
        advantage: 'Shared witness should leave the Crown unable to silence Vaor’s evidence with one death.',
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
      'Commander Hale enters with twelve royal soldiers and the portable drill. His authority comes from Regent Malrec, not from a new order spoken by the ill Queen. “Ordan wanted authority,” Hale says. “I want the world to survive long enough to condemn me.” Then he calls you a traitor and orders the fragment placed in the machine.',
      'Traitor still lands like a blow, even from Hale. Your answer rises, then the drill bites deeper and Vaor’s chains jerk tight. Reputation can wait. Stopping the drill comes first.',
      has(state, 'c5-has-extraction-order')
        ? 'You hold up the extraction order bearing his own seal. His soldiers see the line permitting Vaor’s death.'
        : has(state, 'c5-knows-commander-sacrifice')
          ? 'You name the soldiers he abandoned in the lower camp. Two people behind him glance at each other.'
          : 'His people look exhausted and afraid, but their crossbows remain level.',
      has(state, 'c5-crown-lost-trail') && !has(state, 'c5-crown-saw-flare')
        ? 'Hale arrived late because you hid your trail. Half his force is still searching the lower valley.'
        : 'The flare from the grave and the marked route brought his whole surviving force behind him.',
      'The drill begins to turn. Vaor’s chains tighten. Hale watches the machine instead of his soldiers, but his eyes keep returning to a narrow seam behind the control platform. Metal screams against the Nail.',
    ],
    choices: [
      {
        id: 'c5-break-royal-drill',
        label: 'Charge through the crossbows and break the drill.',
        detail: 'Lose 2 Health destroying the only machine that can cut out the ember quickly.',
        advantage: 'Breaking the drill should stop this extraction and deny the Crown the machine for another attempt.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-destroyed-royal-drill'],
        result: 'Two bolts strike armour before you reach the frame. Your sword enters the turning gears, and the drill tears itself apart around the blade. Hale retreats behind the control platform as Vaor opens the deepest memory.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-turn-hale-soldiers',
        label: 'Force Hale’s soldiers to face what he ordered.',
        detail: 'Spend 2 Command using the written order, the abandoned dead, or the killing drill against his authority.',
        advantage: 'The evidence may turn part of the royal force against Hale and leave witnesses alive.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c5-royal-witnesses-turned'],
        result: 'You name the dead below, the living prisoner, and the choice standing before each soldier. Four crossbows lower. Then six. They cover Mara while she cuts the drive belt. The drill stops, and Hale retreats behind the control platform.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-trust-rook-false-extraction',
        label: 'Help Rook stage the theft of a false ember.',
        detail: 'Spend 1 Resolve trusting his mirrored decoy while the real fragment remains in your hand.',
        advantage: 'The false ember may draw Hale’s strongest soldiers away and leave the drill exposed.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-rook-staged-ember-theft'],
        result: 'Lysara lights one of Rook’s mirrored coins. He appears to pluck a red ember from Vaor’s chest, bows, and runs. Hale sends eight soldiers after him. Mara cuts the exposed drive belt while they chase the decoy, stopping the drill and forcing Hale behind the control platform.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-free-claw-against-crown',
        label: 'Let Vaor strike through the loosening chains.',
        detail: 'Spend 2 Oathfire binding the dragon’s strike to the armed attackers only.',
        advantage: 'The Oath should let Vaor destroy the drill while sparing soldiers who surrender.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-vaor-broke-drill', 'c5-oath-limited-vaor'],
        result: 'Your Oath draws a gold boundary around every lowered weapon. Vaor tears one claw through the loosening glass and crushes the drill, stopping one finger from each person who surrenders. Hale throws himself behind the control platform while Vaor opens the deepest memory.',
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
    body: () => [
      'With the drill stopped and Hale forced behind the control platform, Vaor gains one brief opening. He opens the deepest plate, and you stand inside a memory that truly happened. A red gold dragon named Orivane prepares to give her living heart to create the Concord while unstable realms break roads, weather, and memory across Edrath.',
      'Orivane gives her living heart to create the Concord. Nobody forces her. Her fire separates the colliding realms and gives Edrath one stable shape.',
      'Then the hidden cost becomes painfully simple. The memory shows one village existing in two forming histories. In both, families are already awake and children are eating breakfast. When the Concord settles, one village remains. The other turns transparent in the middle of an ordinary morning and is cut away from Edrath while its people are still reaching for one another.',
      'The rulers knew that some forming histories already held living people. They told Orivane only that unstable possibilities would be closed. She sees the village during her final breath and demands that future generations judge the Concord again. The memory does not show where the cut away people went.',
      'Lysara’s voice shakes beside you. “Her choice was willing. Their silence still stole part of that choice.” At the edge of the memory, Rook stretches painted theatre cloth between two cracked shelves and anchors it with wire. Hale is still hidden behind the platform, and Rook is preparing for his return.',
      'The rulers seal the evidence inside Vaor’s grave. The final image holds on Orivane’s open eye. Vaor’s voice enters the memory beside you. “What will you remember when the mountain falls?”',
    ],
    choices: [
      {
        id: 'c5-honour-orivane-choice',
        label: 'Stay with Orivane’s choice until the memory ends.',
        detail: 'Spend 1 Resolve witnessing her death without looking away.',
        advantage: 'Staying to the end may preserve Orivane’s final demand beneath the rulers’ voices.',
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
        advantage: 'The seals may become evidence that several governments knowingly hid the Concord’s cost.',
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
      'Hale rises from behind the control platform beside the narrow seam he kept watching. He drives its hidden spike down. The grave answers by pulling every glass plate toward Vaor at once. He intends to bury the dragon, the witnesses, and himself before the truth leaves the mountain.',
      has(state, 'c5-rook-found-control-spike')
        ? 'Rook saw the spike earlier. His silver wire is already looped around its release, but someone must give him time to pull it.'
        : 'Rook sees the release only after the spike moves. His silver wire can reach it, but falling glass fills the space between.',
      has(state, 'c5-chose-lysara-care')
        ? 'Lysara disappears beneath the edge of one collapsing shelf. Mara catches the fragment against her shield while Sorin hugs the oldest memory plate to his chest.'
        : has(state, 'c5-chose-mara-care')
          ? 'Mara disappears beneath the edge of one collapsing shelf. Lysara catches the fragment in green thread while Sorin hugs the oldest memory plate to his chest.'
          : 'Sorin disappears beneath the edge of one collapsing shelf. Mara catches the fragment against her shield while Lysara holds the guide thread open.',
      has(state, 'c5-chose-lysara-care')
        ? 'Your first step is toward Lysara. Three more shelves tear loose above her. Mara plants her shield and shouts through the breaking glass, “Name the priority!”'
        : has(state, 'c5-chose-mara-care')
          ? 'Your first step is toward Mara. Three more shelves tear loose above her. Lysara has both hands in the guide thread and shouts, “Caelan, name the priority!”'
          : 'Your first step is toward Sorin, the keeper who gave you this climb and treated your hand without asking for anything back. Three more shelves tear loose. Mara shouts, “Name the priority!”',
    ],
    choices: [
      {
        id: 'c5-guard-mara-collapse',
        label: 'Take the falling shelf before it crushes your chosen companion.',
        detail: 'Lose 2 Health protecting the person whose care you accepted before the descent.',
        advantage: 'Taking the impact should keep that companion unhurt and the fragment or evidence secure.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-saved-mara-from-glass', 'c5-saved-chosen-companion'],
        result: 'You reach them before the shelf does. Glass breaks across your back. Mara and Lysara drag you clear while Sorin gathers the evidence that survived the impact.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-command-gallery-evacuation',
        label: 'Call a moving shelter through the falling gallery.',
        detail: 'Spend 2 Command placing every person where one shield can protect the next.',
        advantage: 'A moving shelter should bring the whole group out with several memory plates intact.',
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
        advantage: 'The Oath may hold every person and surviving record long enough to escape.',
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
        result: 'Rook pulls the wire you saw him anchor during the memory. Painted theatre cloth and loose glass fall around Hale like a collapsing ceiling, driving him away from the spike. Once everyone reaches Vaor, Rook starts to call it architecture. Your look makes him save the joke for later.',
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
    body: (state) => [
      'The fire Nail splits around Vaor’s chest. Warm red gold light appears beneath the cold blue chains. The valleys need that ember carried away before the broken Nail consumes it.',
      has(state, 'c5-vaor-stated-terms')
        ? 'Vaor has already named what each path costs him. He waits for you to prove that listening changed more than your words.'
        : 'Vaor explains the three paths plainly. Release brings his willing gift. Force takes the ember and leaves him alive but wounded. A pact lets the ember travel inside you with his voice.',
      has(state, 'c5-told-mara-survivor-fear')
        ? 'Mara’s warning stays with you. This cannot be a promise made only to punish yourself for older failures.'
        : has(state, 'c5-admitted-future-with-lysara') || has(state, 'c5-kissed-lysara') || has(state, 'c5-protected-lysara-choice')
          ? 'Lysara stands where you can see her. Whatever you decide, she will judge the truth of it rather than reward agreement.'
          : has(state, 'c5-chose-sorin-care')
            ? 'Mara and Lysara stand on either side of Sorin’s bench. Neither woman asks this choice to prove what you feel for her.'
            : 'Mara watches your face, not the fire. The most dangerous part of an Oath is how easily duty can hide desire or guilt.',
      'The Crown wanted a weapon. Vaor wants freedom. The world beyond the mountain needs heat. Vaor lowers his great head until one amber eye is level with you and waits for your decision.',
    ],
    choices: [
      {
        id: 'c5-free-vaor',
        label: 'Break the remaining chains and accept Vaor’s willing ember.',
        detail: 'Release an ancient dragon whose choices will no longer belong to you or the Crown, and whom kingdoms may treat as an invading power.',
        advantage: 'The ember enters without violence, but Vaor promises no obedience and may refuse future help.',
        changes: { wayfire: 2 },
        addFlags: ['c5-freed-vaor', 'c5-ember-willing'],
        result: 'You set the fragment into the outer ring and turn it away from Vaor. The chains open. He touches one claw to your chest and gives a small living flame by choice.',
        next: 'c5-ending-free',
      },
      {
        id: 'c5-take-ember-by-force',
        label: 'Cut the ember free and keep it under your command.',
        detail: 'Lose 2 Health taking the fastest power while Vaor resists you.',
        advantage: 'The fastest extraction should give you a controlled ember while denying Vaor any choice over it.',
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
        advantage: 'The pact should protect Vaor while carrying his knowledge and living fire inside you.',
        changes: { resolve: -2, wayfire: 2 },
        requires: { resolve: 1 },
        addFlags: ['c5-vaor-pact', 'c5-vaor-voice-within'],
        result: 'You state the end condition and Vaor accepts it. The cold chains release his wounds and settle around him as a protective glass shell he can break when he chooses. His ember crosses into your chest with a second heartbeat, and his next words come from inside your own breath.',
        next: 'c5-ending-pact',
      },
    ],
  },

  'c5-ending-free': {
    id: 'c5-ending-free',
    kicker: 'Chapter Five complete',
    title: 'A Dragon Above the Valleys',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Carry the willing ember to the moving orc town of Kharad Vey.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: () => [
      'Vaor breaks through the mountain roof. Cold blue fire reaches for him and recoils from the warm ember now burning inside your chest.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. The power warms your blood. When your attention slips, that warmth curls toward hunger.',
      'Vaor circles once above the glass valleys, free for the first time in a century. He does not swear obedience and may refuse your next request. He promises only to meet you at Kharad Vey, the moving orc town that crosses the eastern steppe.',
      'Then the ember shows you one final danger: a black stone gate standing open by the width of a hand. Red light moves behind it, and something on the other side has noticed the road leading from your heart.',
    ],
    choices: [],
  },

  'c5-ending-force': {
    id: 'c5-ending-force',
    kicker: 'Chapter Five complete',
    title: 'The Ember Taken',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Reach the moving orc town of Kharad Vey before Vaor or the Crown takes back the ember.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: () => [
      'Warm fire seals the worst of the grave behind you, but it cannot restore the Health the cold flame took. Every wound reminds you how the ember entered your body.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. The flame moves the instant you command it. Vaor’s answering roar follows from inside the mountain.',
      'Vaor tears free after you reach the eastern slope. His first roar breaks glass across three valleys. He turns east, following the fire you took.',
      'The ember shows you a black stone gate beginning to open. Beyond it, red light moves like breath. You need Kharad Vey, the moving orc town crossing the eastern steppe, and allies strong enough to survive both the gate and the dragon behind you.',
    ],
    choices: [],
  },

  'c5-ending-pact': {
    id: 'c5-ending-pact',
    kicker: 'Chapter Five complete',
    title: 'Two Voices, One Flame',
    location: 'The Eastern Face of Dragonspine',
    objective: 'Carry Vaor’s voice and ember to the moving orc town of Kharad Vey.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    body: (state) => [
      'You leave the grave with a second heartbeat beneath your armour. Vaor’s body rests by choice inside the protective glass shell. He is no longer chained, and he can break free when he is ready to face the sky.',
      'You are an ember bearer now: a living carrier for part of the fire Nail. Warm flame answers your breath. So does Vaor’s grief, vast enough to make the eastern sky look painfully small.',
      has(state, 'c5-admitted-future-with-lysara') || has(state, 'c5-kissed-lysara')
        ? 'Lysara asks you to repeat the last promise you made before the pact. You answer in your own voice. Vaor adds, inside your thoughts, that she is testing which memories remain yours. “Correct,” Lysara says aloud.'
        : has(state, 'c5-chose-sorin-care')
          ? 'Sorin asks whether your name still sounds like your own. You answer in your own voice. Vaor adds, inside your thoughts, that this keeper asks unusually sensible questions.'
          : 'Mara asks whether you can still hear her. You answer in your own voice. Vaor adds, inside your thoughts, that this is an excellent question to keep asking.',
      'The ember shows both of you a black stone gate opening by the width of a hand. Beyond Dragonspine, Kharad Vey moves across the red steppe. The travelling orc town is the nearest place strong enough to help you face what is coming through.',
    ],
    choices: [],
  },
};
