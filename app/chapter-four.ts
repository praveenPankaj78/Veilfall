import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function pursuitOpening(state: GameState) {
  if (has(state, 'c3-target-ordan')) {
    return 'Your boots strike the first arch behind Ordan. He reaches for the fragment at his belt, but the dark coated thief drops between you and takes it first.';
  }
  if (has(state, 'c3-target-thief')) {
    return 'The mirrored coin the thief left in your hand flashes as you follow him out of Harrowfen. Ahead, its twin turns between his fingers while Ordan closes from the opposite arch.';
  }
  return 'Lysara’s guide rope snaps tight behind you as Mara, Brann, and three town guards cross from Harrowfen. The last careful knot holds, but Ordan is already several arches ahead.';
}

function savedBrann(state: GameState) {
  if (has(state, 'c4-saved-brann')) {
    return 'Brann is alive because you pulled him clear, though every breath makes his face tighten.';
  }
  if (has(state, 'c4-saved-guards')) {
    return 'Your rope line saved the Harrowfen guards. Mara dragged Brann out last, and his left arm now hangs useless at his side.';
  }
  if (has(state, 'c4-held-collapse')) {
    return 'Your Oath held the stone long enough for everyone to cross. It also left a hot crack along your palm that hurts whenever the bridge moves.';
  }
  return 'Rook found a hanging banner where you saw only open air. Everyone survived the swing, but Brann struck the wall hard and cannot stand without help.';
}

function rookKit(state: GameState) {
  if (has(state, 'c4-searched-rook')) {
    return 'You already know what Rook carries: black wax, silver wire, mirrored coins, flash salt, and a small reed that changes his voice.';
  }
  return 'As he moves, you glimpse a travelling performer’s tools inside his coat: black wax, silver wire, mirrored coins, flash salt, and a small voice reed.';
}

function openingPayoff(state: GameState) {
  if (has(state, 'c4-group-secured')) {
    return 'The guide rope you secured keeps the group together when the first stones tilt. That order gives Mara time to reach the two sliding guards.';
  }
  if (has(state, 'c4-fast-pursuit')) {
    return 'Your early leap placed you close to the Bell Arch. You reach the falling edge before Ordan’s nearest soldiers can block it.';
  }
  if (has(state, 'c4-harrowfen-held')) {
    return 'The road you anchored to Harrowfen stays behind the group when the other spans turn. The wounded still have a route back if someone can reach it.';
  }
  return 'Because you kept every group in sight, you see the soldiers reach the anchor ropes and shout a warning before the first cut.';
}

function fragmentTransfer(state: GameState) {
  if (has(state, 'c4-searched-rook')) {
    return 'During your search, you found the knot holding the real fragment beneath Rook’s coat. At the Map Arch, you cut that knot and take the iron into your own hand. Rook watches without pretending the arrest was forgotten.';
  }
  if (has(state, 'c4-route-bargain')) {
    return 'Rook draws the real fragment from beneath his coat and places it on the stone. “I wanted the map, not the iron,” he says. Giving it back is the first part of the bargain he chose to keep.';
  }
  return 'Rook draws the real fragment from beneath his coat and places it between you. He keeps two fingers on one edge until your hand closes over the other. Then he lets go. Neither of you calls that trust.';
}

function dispatchOpening(state: GameState) {
  if (has(state, 'c4-read-dispatch-early')) {
    return 'You reopen the royal dispatch you recovered while Rook treated Brann.';
  }
  if (has(state, 'c4-found-dispatch')) {
    return 'You break the seal on the dispatch recovered from Ordan’s satchel.';
  }
  return 'A surviving guard brings Ordan’s satchel from the last crossing. You break the seal on the royal dispatch inside.';
}

function routePayoff(state: GameState) {
  if (has(state, 'c4-snow-route')) {
    return 'The open snow gave you warning of the upper squad. You reach the Crown Span before its last crossbow team can take position.';
  }
  if (has(state, 'c4-storm-route')) {
    return 'The sea storm soaked the Crown crossbows behind you. Their strings will need time before they can fire again.';
  }
  return 'The brass wheels close behind your group. The soldiers following from the lower road must find another way around.';
}

function rookMapCopy(state: GameState) {
  if (has(state, 'c4-rook-full-copy')) {
    return 'the complete nine mark wax copy you allowed him to make';
  }
  return 'a thin wax scrap showing only the northern mark and two blurred roads';
}

export const chapterFourNodes: Record<string, StoryNode> = {
  'c4-bridge-start': {
    id: 'c4-bridge-start',
    kicker: 'Chapter Four',
    title: 'Thief at the Mileless Bridge',
    location: 'The Mileless Bridge',
    objective: 'Recover the World Nail fragment and keep your people alive.',
    threat: 'Immediate',
    art: 'mileless',
    lesson: {
      title: 'How to picture the bridge',
      body: 'The Mileless Bridge is the whole changing structure. An arch is a fixed piece of safe stone. A span connects two arches. A road is a distant place, such as the snowfield or sea cliff, temporarily joined to a span. The green thread marks which arch comes next.',
    },
    body: (state) => [
      pursuitOpening(state),
      'Broken arches cross beneath a dozen different skies. One span opens over a snowfield. Another hangs above a storming sea. A third ends inside a brass cavern. Green thread from Lysara’s glass seed runs back toward Harrowfen, showing you which fixed stone comes next.',
      'The thief lands on the next arch with the iron fragment. Ordan lands behind him. Crown soldiers appear above and raise crossbows. Your Crown. Your soldiers. They are shooting at you anyway.',
      'The fragment is one arch ahead. Behind you, Mara catches a stumbling guard while Brann pulls Lysara’s green thread tight. The bridge shudders, and a crossbow string clicks above.',
    ],
    choices: [
      {
        id: 'c4-secure-guide-rope',
        label: 'Secure Lysara’s guide rope and call everyone across.',
        detail: 'Spend Command to keep the full group together before the pursuit.',
        advantage: 'Clear commands should bring your companions onto the bridge in one protected line.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-group-secured'],
        result: 'Your voice cuts through the noise. Every hand closes on the green rope, and nobody is left alone on a changing road.',
        next: 'c4-chase',
      },
      {
        id: 'c4-leap-for-fragment',
        label: 'Leap to the lower arch and close the distance.',
        detail: 'Lose Health crossing a broken gap before Ordan can surround the thief.',
        advantage: 'The early leap should reach the fight before Crown reinforcements form a wall.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-fast-pursuit'],
        result: 'Your boots strike the lower arch hard enough to jar your wounded ribs, but Ordan’s nearest soldiers are now behind you.',
        next: 'c4-chase',
      },
      {
        id: 'c4-oath-harrowfen-rope',
        label: 'Feed Oathfire into the road back to Harrowfen.',
        detail: 'Spend Oathfire to stop the rear connection from closing.',
        advantage: 'Your Oath should keep a stable escape route behind the party.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-harrowfen-held'],
        result: 'Your promise enters the green thread like heat entering wire. Harrowfen stops drifting away.',
        next: 'c4-chase',
      },
      {
        id: 'c4-follow-carefully',
        label: 'Keep both groups in sight and move carefully.',
        detail: 'Preserve your strength, but surrender the early lead.',
        advantage: 'You spend no resource and see where every companion and enemy moves.',
        addFlags: ['c4-measured-start'],
        result: 'You refuse the bridge’s demand for panic. Your people stay visible, though Ordan gains several arches.',
        next: 'c4-chase',
      },
    ],
  },

  'c4-chase': {
    id: 'c4-chase',
    kicker: 'A bolt between enemies',
    title: 'The Man Carrying Your Enemy’s Prize',
    location: 'A Turning Arch',
    objective: 'Reach the thief before the Crown kills him or takes the fragment.',
    threat: 'Immediate',
    art: 'mileless',
    body: () => [
      'A crossbow bolt cuts toward the thief’s back. He bends to examine his boot at exactly the right moment, and the bolt strikes Ordan’s shoulder plate instead.',
      '“Terrible manners,” the thief calls up to the soldiers. “He was standing behind me.”',
      'You almost laugh before the next string clicks. The thief’s boot slips at the edge, the fragment swings over open sky, and Ordan reaches for both.',
    ],
    choices: [
      {
        id: 'c4-shield-rook',
        label: 'Take the next bolt on your shield.',
        detail: 'Lose Health to keep the thief and fragment on the bridge.',
        advantage: 'Taking the bolt should expose the hidden shooter and earn the thief’s attention.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-shielded-rook'],
        result: 'The bolt drives your shield into your chest. The thief’s grin disappears. For one honest second, he looks shocked that you protected him.',
        next: 'c4-corner',
      },
      {
        id: 'c4-command-low-volley',
        label: 'Order a low volley at the soldiers’ legs.',
        detail: 'Spend Command to stop the shooters without risking the fragment.',
        advantage: 'The low volley should drive the nearest Crown squad from its firing position.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-dropped-shooters'],
        result: 'Your archers strike stone and boots. Two soldiers fall flat, and the rest break formation to pull them clear.',
        next: 'c4-corner',
      },
      {
        id: 'c4-study-rook-wire',
        label: 'Follow the silver wire beside his sleeve.',
        detail: 'Spend Resolve ignoring the crossbows long enough to understand his trick.',
        advantage: 'Following the wire should reveal which mirrored coin hides the fragment.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-saw-mirror-trick'],
        result: 'The iron shape under his arm is a reflection caught on a turning coin. The real fragment is tied flat beneath his coat.',
        next: 'c4-corner',
      },
      {
        id: 'c4-track-both-men',
        label: 'Keep Ordan and the thief inside the same line of sight.',
        detail: 'Give up an early advantage to avoid being drawn into either man’s trap.',
        advantage: 'You preserve every resource and cannot be surprised by a simple switch.',
        addFlags: ['c4-watched-both'],
        result: 'You let neither man choose where you look. The thief notices and gives you an approving nod you did not ask for.',
        next: 'c4-corner',
      },
    ],
  },

  'c4-corner': {
    id: 'c4-corner',
    kicker: 'The thief has a name',
    title: 'Rook Sable',
    location: 'The Bell Arch',
    objective: 'Learn what Rook wants without losing the fragment.',
    threat: 'Rising',
    art: 'mileless',
    body: (state) => [
      'You corner the thief beneath a cracked bronze bell. He cannot be much older than twenty eight. Rain darkens his brown hair, and amusement sits easily in his sharp face even with a sword at his throat.',
      '“Rook Sable,” he says. “Thief when honesty is affordable. Travelling performer when it is not.”',
      'Beyond him, Lysara knots green thread around the fixed arches. The Bell Arch is beneath you. The Map Arch and final anchor wait ahead. The spans between them turn, but the green knots keep their order.',
      rookKit(state),
      'Rook says he does not want the fragment’s power. He wants the map hidden inside it. Ordan arrives on the arch below and orders his soldiers to bring both of you alive. Three crossbows lower from Rook’s chest to his legs.',
    ],
    choices: [
      {
        id: 'c4-search-rook',
        label: 'Bind one wrist and search his coat.',
        detail: 'Spend Command making the arrest clear while danger closes in.',
        advantage: 'The search should identify every visible tool Rook can use against you.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-searched-rook', 'c4-law-first'],
        result: 'Mara binds Rook’s wrist while you search the coat. He looks wounded when you find three false pockets and genuinely offended when you find the fourth.',
        next: 'c4-collapse',
      },
      {
        id: 'c4-offer-route-bargain',
        label: 'Offer him one safe road in return for the truth.',
        detail: 'Spend Resolve trusting a bargain made under crossbows.',
        advantage: 'The bargain should make Rook admit what he was paid to steal.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-route-bargain', 'c4-rook-hired-for-map'],
        result: 'Rook names no buyer, but the humour leaves his voice. Someone paid him for a map of every World Nail, not for the iron itself.',
        next: 'c4-collapse',
      },
      {
        id: 'c4-hear-rook-out',
        label: 'Block the exit and let him explain.',
        detail: 'Keep your resources, but leave his hands free while he speaks.',
        advantage: 'You learn his goal without promising or spending anything.',
        addFlags: ['c4-heard-rook', 'c4-rook-kept-hidden-tool'],
        result: 'Rook explains quickly. You believe the part about the map. You also see him hide something in his sleeve and decide not to pretend otherwise.',
        next: 'c4-collapse',
      },
    ],
  },

  'c4-collapse': {
    id: 'c4-collapse',
    kicker: 'The road breaks',
    title: 'No Ground Beneath the Bell',
    location: 'The Bell Arch',
    objective: 'Keep the collapsing bridge from taking your people.',
    threat: 'Critical',
    art: 'mileless',
    body: (state) => [
      'The Crown soldiers ignore Ordan’s order to take everyone alive. Instead of advancing, they cut three anchor ropes.',
      openingPayoff(state),
      'The Bell Arch drops. Brann catches a stone rail with one hand. Two Harrowfen guards slide toward open air. Mara has the guide rope around her waist, but the sudden weight pulls her across the wet stone. Far below, several roads turn like spokes inside a wheel.',
      'Your hand reaches for Brann. The two guards slide faster, and Mara’s boots lose another span of wet stone.',
      'Rook hooks one boot through the broken bell frame. “Captain,” he says, all humour gone, “choose quickly.”',
    ],
    choices: [
      {
        id: 'c4-save-brann',
        label: 'Drop beside Brann and pull him up yourself.',
        detail: 'Lose 2 Health rescuing your oldest guard before the arch turns.',
        advantage: 'Reaching Brann first should keep him from falling onto a lower road.',
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c4-saved-brann'],
        result: 'Stone tears your palms, but Brann’s wrist reaches yours. You haul him over the rail as the broken arch rolls beneath you.',
        next: 'c4-wounded',
      },
      {
        id: 'c4-save-guards',
        label: 'Command a human chain along Lysara’s rope.',
        detail: 'Spend 2 Command to rescue the guards and give Mara room to reach Brann.',
        advantage: 'The human chain should save the rear line, though Brann may suffer a serious injury.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c4-saved-guards'],
        result: 'Your order moves faster than fear. Hands close on coats and belts. Mara reaches Brann last and drags him clear with his arm bent badly.',
        next: 'c4-wounded',
      },
      {
        id: 'c4-hold-collapse',
        label: 'Promise that no one falls while you stand.',
        detail: 'Spend 2 Oathfire to hold the arch together long enough for everyone to cross.',
        advantage: 'The Oath should keep every companion alive and hold one span behind you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c4-held-collapse', 'c4-oath-no-one-falls'],
        result: 'Fire runs through every crack. The arch stops falling until the final guard crosses, then breaks the instant your promise is fulfilled.',
        next: 'c4-wounded',
      },
      {
        id: 'c4-use-hanging-banner',
        label: 'Follow Rook onto the hanging royal banner.',
        detail: 'Trust his strange escape, accept Brann’s hard landing, and consume Rook’s strongest wire.',
        advantage: 'Everyone survives without spending a stat, but Rook loses a tool he needs for later tricks.',
        addFlags: ['c4-followed-rook-banner', 'c4-brann-bruised', 'c4-rook-lost-long-wire'],
        result: 'Rook cuts one cord with his longest silver wire. The banner swings like a ship’s sail and catches the whole rope line. You strike the next wall alive, while the wire snaps and vanishes into open sky.',
        next: 'c4-wounded',
      },
    ],
  },

  'c4-wounded': {
    id: 'c4-wounded',
    kicker: 'A breath to count the living',
    title: 'Brann Cannot Walk Alone',
    location: 'A Roofed Causeway',
    objective: 'Protect the wounded without losing Ordan’s trail.',
    threat: 'Rising',
    art: 'mileless',
    body: (state) => [
      savedBrann(state),
      'The roofed causeway gives you one minute out of crossbow sight. Your hands check Brann’s breathing while your eyes measure the distance to Ordan’s satchel. Brann catches the movement and pushes weakly at your wrist.',
      'Rook kneels near Brann but does not touch him. For once he waits for permission. Ordan’s dropped satchel lies on a ledge across the causeway, close enough to reach if someone else handles the wounded.',
      'The real fragment remains tied flat beneath Rook’s coat. You have not recovered it, and you have not forgotten it.',
    ],
    choices: [
      {
        id: 'c4-carry-brann',
        label: 'Bind Brann’s injury and carry his weight.',
        detail: 'Lose Health taking the wounded man through the next span yourself.',
        advantage: 'Carrying Brann should keep him with the group and able to advise you.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-carried-brann', 'c4-found-dispatch'],
        result: 'Brann curses softly while you bind him, which reassures you more than silence would. His good arm settles across your shoulders while Lysara loops green thread around Ordan’s satchel and drags it within reach.',
        next: 'c4-three-spans',
      },
      {
        id: 'c4-send-mara-with-brann',
        label: 'Send Mara and one guard back with Brann.',
        detail: 'Lose Mara’s help for the next crossing so the wounded reach safety.',
        advantage: 'Brann and the injured guards return toward Harrowfen under protection.',
        addFlags: ['c4-mara-escorted-brann', 'c4-found-dispatch'],
        result: 'Mara dislikes leaving your side, but she understands the order. The departing guard hooks Ordan’s satchel from the ledge and passes it to you. Mara’s fingers close around yours once before she takes Brann back.',
        next: 'c4-three-spans',
      },
      {
        id: 'c4-let-rook-splint-brann',
        label: 'Let Rook make the splint while you search Ordan’s satchel.',
        detail: 'Give the thief access to your people and let him tear apart his disguise coat for the bandage.',
        advantage: 'Brann is stabilised and you find a royal dispatch, but Rook’s later disguise will be weaker.',
        addFlags: ['c4-rook-splinted-brann', 'c4-found-dispatch', 'c4-read-dispatch-early', 'c4-rook-tore-coat-lining'],
        result: 'Rook turns two scabbards and the blue lining of his coat into a firm splint. You break Ordan’s seal, but the next span turns before you can read beyond the royal heading. The damaged coat leaves Rook’s Crown disguise visibly incomplete.',
        next: 'c4-three-spans',
      },
    ],
  },

  'c4-three-spans': {
    id: 'c4-three-spans',
    kicker: 'Three roads, one quarry',
    title: 'Choose the Sky Above You',
    location: 'The Turning Junction',
    objective: 'Choose a span that can reach Ordan before his soldiers regroup.',
    threat: 'Uneasy',
    art: 'crossroads',
    body: (state) => [
      'The bridge divides around a stone wheel. Ordan’s blood marks all three exits because the roads keep exchanging pieces beneath him.',
      'One span crosses a white mountain under cold blue flame. One clings to a black sea cliff inside a thunderstorm. The last descends through huge brass wheels turning deep underground.',
      'Snow wind cuts your face from the first arch. Salt spray reaches you from the second. Beneath the third, brass teeth close hard enough to shake the junction.',
      has(state, 'c4-mara-escorted-brann')
        ? 'Lysara tightens the green thread and points to the next fixed arch. “Mara has Brann. We choose the road in front of us.”'
        : 'Mara sets one hand on her sword. “Pick a sky, Captain. Ordan is bleeding into all three.”',
    ],
    choices: [
      {
        id: 'c4-choose-snow',
        label: 'Take the mountain span.',
        detail: 'Face bitter cold and a narrow path where discipline matters.',
        advantage: 'The open snow makes ambushes easier to see.',
        addFlags: ['c4-snow-route'],
        result: 'You step into cutting wind. Snow covers the next arch, but every moving figure stands clear against the white.',
        next: 'c4-snow-span',
      },
      {
        id: 'c4-choose-storm',
        label: 'Take the sea cliff span.',
        detail: 'Face wind, waves, and unstable footing where courage matters.',
        advantage: 'The storm hides your group from the Crown crossbows.',
        addFlags: ['c4-storm-route'],
        result: 'Salt rain strikes your face. The storm takes sight from you and from every soldier trying to aim.',
        next: 'c4-storm-span',
      },
      {
        id: 'c4-choose-brass',
        label: 'Take the underground span.',
        detail: 'Enter a loud machine chamber with cover and unknown exits.',
        advantage: 'The great wheels can break pursuit if you read their rhythm.',
        addFlags: ['c4-brass-route'],
        result: 'Heat replaces rain. Brass teeth turn below the road, each one large enough to crush a wagon.',
        next: 'c4-brass-span',
      },
    ],
  },

  'c4-snow-span': {
    id: 'c4-snow-span',
    kicker: 'Blue flame',
    title: 'The Mountain Road',
    location: 'A Snowbound Span',
    objective: 'Cross before the mountain wind buries Ordan’s trail.',
    threat: 'Immediate',
    art: 'crossroads',
    body: (state) => [
      'Blue flames burn inside stone bowls along the mountain road, but they give no warmth. Your wet clothes begin to freeze. Ordan’s soldiers are visible on the ridge ahead, cutting steps into the only safe slope.',
      has(state, 'c4-mara-escorted-brann')
        ? 'One Harrowfen guard misses the rope on his first reach. Without Mara beside you, the empty place at your right feels colder than the wind.'
        : 'Brann misses the rope on his first reach. Mara presses close while you share the shelter of your shield. Her warmth reaches you through two wet coats, immediate and dangerously easy to notice.',
      'Rook studies the soldiers, then the blue fire. You can almost see an unreasonable plan forming behind his eyes.',
    ],
    choices: [
      {
        id: 'c4-snow-shield-line',
        label: 'Drive the shield line straight up the slope.',
        detail: 'Spend Command to cross before cold weakens the wounded.',
        advantage: 'The shield formation should reach the ridge intact and scatter the cutters.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-broke-snow-line'],
        result: 'Your shields climb as one dark wall. The soldiers abandon their tools before the formation reaches them.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-snow-use-blue-fire',
        label: 'Touch your Oath to the cold blue flame.',
        detail: 'Spend Oathfire to turn the bowls into warm guides through the snow.',
        advantage: 'Warm guide flames should prevent cold injuries and reveal how the fire answers Oaths.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-warmed-blue-fire'],
        result: 'The nearest flame turns gold beneath your hand. Warm light leaps from bowl to bowl and draws a safe line across the white.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-snow-follow-rook',
        label: 'Follow Rook across the buried rail.',
        detail: 'Trust a path only the thief claims to see.',
        advantage: 'You preserve resources and emerge above the soldiers, but the bypass leaves them free to follow.',
        addFlags: ['c4-used-rook-snow-path', 'c4-rook-shortcut-left-pursuit'],
        result: 'Rook tests each step with wire and finds a buried bronze rail. It brings you out above the soldiers, but does nothing to stop them following your tracks.',
        next: 'c4-stage-turn',
      },
    ],
  },

  'c4-storm-span': {
    id: 'c4-storm-span',
    kicker: 'The sea below',
    title: 'The Cliff That Moves',
    location: 'A Storm Coast Span',
    objective: 'Cross before the next wave tears the road from the cliff.',
    threat: 'Immediate',
    art: 'crossroads',
    body: (state) => [
      'The bridge narrows to wet black stone above a raging sea. Waves climb high enough to strike the underside and lift the whole span.',
      has(state, 'c4-mara-escorted-brann')
        ? 'You reach for Mara before remembering she is protecting Brann. The mistake leaves your hand closed around rain.'
        : 'Mara’s body fits tightly between you and the cliff while a wave passes. You feel her breath at your throat, then both of you step apart before the danger becomes an excuse.',
      'Ordan’s soldiers wait beyond the worst break. Rook looks down at the sea and says, “I have had bridges throw me out before. None were this enthusiastic.”',
    ],
    choices: [
      {
        id: 'c4-storm-take-wave',
        label: 'Anchor the rope around yourself and take the next wave.',
        detail: 'Lose Health so everyone else can cross in your shelter.',
        advantage: 'Holding the wave should let the group cross before the soldiers attack.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-anchored-storm-crossing'],
        result: 'The wave hits like a moving wall. Your knees strike stone, but the rope stays tight and every person reaches the far side.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-storm-oath-rope',
        label: 'Promise the guide rope will not break.',
        detail: 'Spend Oathfire making one reliable line through the storm.',
        advantage: 'The Oath should keep the rope intact when the road lifts.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-storm-rope-held'],
        result: 'Fire enters the soaked rope. It bends, stretches, and refuses to snap while the storm spends its strength.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-storm-use-rook-coins',
        label: 'Let Rook blind the soldiers with mirrored coins.',
        detail: 'Give him freedom to use his tools while you cross.',
        advantage: 'Lightning drives the ambush from cover, but destroys two of Rook’s three mirrored coins.',
        addFlags: ['c4-used-rook-storm-trick', 'c4-rook-shortcut-left-pursuit', 'c4-rook-lost-mirror-coins'],
        result: 'Rook spins three coins on silver wires. Lightning fills the mirrors and sends white flashes into the soldiers’ eyes. Two coins melt at the edges, and the blinded soldiers remain alive behind you.',
        next: 'c4-stage-turn',
      },
    ],
  },

  'c4-brass-span': {
    id: 'c4-brass-span',
    kicker: 'Teeth beneath the road',
    title: 'The Turning Machine',
    location: 'A Brass Wheel Chamber',
    objective: 'Cross the moving gears before they divide your party.',
    threat: 'Immediate',
    art: 'crossroads',
    body: (state) => [
      'Brass wheels lift sections of road and carry them through the cavern. The noise enters your bones. A wrong step would place a body between metal teeth.',
      'Count to seven. On the seventh beat, the teeth miss and one empty road plate passes safely between them.',
      has(state, 'c4-mara-escorted-brann')
        ? 'You count the missing beat Mara would normally call for you and force yourself to find the rhythm alone.'
        : 'Mara places your hand against the small of her back so you can move on the same beat. Warmth, muscle, then empty air as she jumps to the next plate.',
      'Rook watches the machine for three turns. His smile returns, which worries you more than the gears.',
    ],
    choices: [
      {
        id: 'c4-brass-command-rhythm',
        label: 'Call each movement like a marching drill.',
        detail: 'Spend Command to move the whole group on one rhythm.',
        advantage: 'A shared rhythm should keep the machine from separating anyone.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-commanded-gears'],
        result: 'You make a road out of timing. Every jump follows your count, and the last guard clears the teeth by a boot length.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-brass-jam-gear',
        label: 'Jam your shield into the nearest gear.',
        detail: 'Lose Health holding the machine still while the others cross.',
        advantage: 'Jamming the wheels should also cut off Ordan’s reinforcements.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-jammed-gears'],
        result: 'Metal screams against the shield. Pain climbs both arms, but the road stops long enough for your people to cross and the soldiers behind to vanish below.',
        next: 'c4-stage-turn',
      },
      {
        id: 'c4-brass-take-rook-shortcut',
        label: 'Take Rook’s route through the hollow wheel.',
        detail: 'Trust him to lead everyone inside the moving machine.',
        advantage: 'You preserve resources and emerge behind the Crown line, but the soldiers remain able to pursue.',
        addFlags: ['c4-used-rook-gear-path', 'c4-rook-shortcut-left-pursuit'],
        result: 'Rook opens a maintenance door no larger than a coffin lid. The wheel carries you behind the waiting soldiers, but you hear them enter the machine after you.',
        next: 'c4-stage-turn',
      },
    ],
  },

  'c4-stage-turn': {
    id: 'c4-stage-turn',
    kicker: 'Rook changes the chase',
    title: 'An Officer Who Does Not Exist',
    location: 'The Crown Span',
    objective: 'Use Rook’s deception without letting it control the mission.',
    threat: 'Rising',
    art: 'mileless',
    body: (state) => [
      routePayoff(state),
      'The Bell Arch and the road you chose are behind you. The Map Arch is the next fixed ground.',
      rookKit(state),
      has(state, 'c4-rook-tore-coat-lining')
        ? 'Rook reverses his damaged coat, but too much blue cloth is wrapped around Brann’s arm. The disguise will work only at a distance.'
        : 'Rook reverses his coat. The blue lining becomes a Crown officer’s jacket. Black wax changes the shape of his face, and the little reed gives him Ordan’s exact voice.',
      'Three soldiers turn toward Rook’s false voice. Then they wait for a signal he does not know. Your hand makes the western recall from Crown drills, and you tell him which bell stroke must follow.',
      '“West span,” he calls. “The captain has doubled back.” You give the bell signal. Half the squad obeys before Ordan shouts from below.',
      has(state, 'c4-mara-escorted-brann')
        ? 'Lysara watches Rook’s performance with narrowed eyes. “Useful,” she says. “Do not mistake that for trusted.”'
        : 'Mara stares at Rook, then checks the opened road instead of rewarding him with a reaction. He turns back to the soldiers.',
      'The deceived squad runs west and leaves the signal bell unguarded. Rook’s hand settles on its rope. “How attached are you to sensible orders?”',
    ],
    choices: [
      {
        id: 'c4-support-false-order',
        label: 'Make the false order look like your ambush.',
        detail: 'Spend Command moving your guards where the deceived soldiers expect danger.',
        advantage: 'The false ambush should divide the Crown force across two spans.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-backed-rook-performance'],
        result: 'Your guards appear for one breath, then vanish on your signal. The Crown soldiers chase the threat they think they saw.',
        next: 'c4-ordan',
      },
      {
        id: 'c4-use-signal-bell',
        label: 'Let Rook ring a full retreat on the Crown bell.',
        detail: 'Accept a bold lie that may make later orders harder to trust.',
        advantage: 'Most of the soldiers abandon the central bridge immediately.',
        addFlags: ['c4-rook-rang-retreat', 'c4-crown-orders-confused'],
        result: 'Rook rings the full retreat. Most soldiers obey the recognised signal, while the remaining officers waste precious time ordering them back.',
        next: 'c4-ordan',
      },
      {
        id: 'c4-limit-rook-trick',
        label: 'Take the open path and stop the trick there.',
        detail: 'Preserve the Crown signals for real emergencies, but leave more soldiers in the fight.',
        advantage: 'You gain the path without giving Rook control of the whole bridge.',
        addFlags: ['c4-limited-rook-performance'],
        result: 'You pull Rook away from the bell. He looks disappointed, but the opened path remains yours.',
        next: 'c4-ordan',
      },
    ],
  },

  'c4-ordan': {
    id: 'c4-ordan',
    kicker: 'The architect is abandoned',
    title: 'Ordan on the Lower Chain',
    location: 'The Central Break',
    objective: 'Decide what Ordan is worth while the bridge closes around him.',
    threat: 'Immediate',
    art: 'mileless',
    body: () => [
      'Ordan reaches the central break ahead of you. His own soldiers cut the chain he is crossing. He catches it with both hands and hangs above a road filled with red dust.',
      '“They were ordered to recover…” Ordan looks from the severed chain to the soldiers above. The certainty leaves his face. “No. They were ordered to erase the failure.”',
      'His boots scrape red dust from the lower road while your hand closes around the chain.',
    ],
    choices: [
      {
        id: 'c4-save-and-bind-ordan',
        label: 'Pull Ordan up and bind him for trial.',
        detail: 'Lose Health lifting an enemy while the bridge turns.',
        advantage: 'Saving Ordan should preserve the best living witness against the conspiracy.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-captured-ordan', 'c4-found-dispatch'],
        result: 'You drag Ordan onto stone and lock his wrists. A guard pulls his satchel from Lysara’s green line. Ordan stares at the chain, then at you. “After Bellweather, why?” he asks. The next span turns before you answer.',
        next: 'c4-nine-marks',
      },
      {
        id: 'c4-command-ordan-rescue',
        label: 'Order two guards to secure Ordan and his satchel.',
        detail: 'Spend Command keeping the prisoner and his evidence together.',
        advantage: 'The ordered rescue should preserve Ordan and recover his royal dispatch.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-captured-ordan', 'c4-found-dispatch'],
        result: 'The guards loop a rope around Ordan and lift him beside the satchel. His papers reach your hands before his anger finds words.',
        next: 'c4-nine-marks',
      },
      {
        id: 'c4-drop-ordan-to-ledge',
        label: 'Cut him onto the lower road and take his satchel.',
        detail: 'Keep your strength, but lose Ordan as a prisoner.',
        advantage: 'You gain his documents and remove him from the immediate fight.',
        addFlags: ['c4-ordan-lower-road', 'c4-found-dispatch'],
        result: 'You cut the chain when a stone ledge turns beneath him. Ordan drops hard but alive. His satchel remains hooked beside you as his road carries him away.',
        next: 'c4-nine-marks',
      },
    ],
  },

  'c4-nine-marks': {
    id: 'c4-nine-marks',
    kicker: 'The fragment opens',
    title: 'Nine Nails in One World',
    location: 'The Map Arch',
    objective: 'Read the map inside the fragment before the Crown takes it.',
    threat: 'Rising',
    art: 'nails',
    introducesStoryTerms: ['nine Nails', 'Dragonspine'],
    body: (state) => [
      fragmentTransfer(state),
      'The iron grows warm beside Lysara’s glass seed. Thin lines of light unfold from beneath your hand. They form a map of the known world with nine bright marks.',
      'Lysara lays two fingers beside the first mark. “This fragment belongs to the Nail of Distance. There are nine World Nails, and each keeps one law of the world stable. Bellweather and the Mileless Bridge used broken pieces of this Nail.”',
      'She points north. “Dragonspine guards another Nail. Its mark is active, so that is where the fragment is pulling us.”',
      'Your finger stops over Greyhaven. Lines from the map cross walls, farms, and villages that have never prepared for an army at their door.',
      'Rook asks how much harm one wax copy can do. Lysara meets his eyes. “It can move an army across a border before either side sees it coming.” His smile fades, but he keeps studying the marks.',
    ],
    choices: [
      {
        id: 'c4-lysara-read-map',
        label: 'Let Lysara join the marks with living thread.',
        detail: 'Spend Resolve holding the fragment while its roads pull against your memories.',
        advantage: 'Lysara should identify the next active mark and record all nine locations.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-lysara-mapped-nine', 'c4-fragment-recovered'],
        result: 'Green thread joins the lights. The northern mountain mark burns brightest, and Lysara copies every location into her treaty book.',
        next: 'c4-mara',
      },
      {
        id: 'c4-allow-rook-copy',
        label: 'Allow Rook one wax copy under your eyes.',
        detail: 'Trade information to learn who hired him for it.',
        advantage: 'You gain his buyer’s meeting place and a debt he openly accepts.',
        addFlags: ['c4-rook-full-copy', 'c4-rook-owes-caelan', 'c4-fragment-recovered'],
        result: 'Rook presses black wax beneath the lights. He names the price of his honesty: his buyer waits beyond the northern mountains. When he promises one favour, his free hand starts to cross two fingers behind his back, then falls open instead.',
        next: 'c4-mara',
      },
      {
        id: 'c4-oath-find-next-nail',
        label: 'Use your Oath to feel which mark threatens your people next.',
        detail: 'Spend Oathfire for a direct sense of the Crown’s next destination.',
        advantage: 'Your Oath should identify the northern mark without granting Rook a copy.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-sensed-northern-nail', 'c4-denied-rook-copy', 'c4-fragment-recovered'],
        result: 'One northern mark answers with cold blue fire. Behind you, Rook quietly folds a scrap of wax. Whatever he caught is incomplete, but not empty.',
        next: 'c4-mara',
      },
      {
        id: 'c4-memorise-map',
        label: 'Close the fragment and keep the nine marks in memory.',
        detail: 'Protect the map from both Rook and the Crown, but accept an imperfect record.',
        advantage: 'You preserve resources and remember the northern mark clearly enough to follow.',
        addFlags: ['c4-memorised-nine', 'c4-denied-rook-copy', 'c4-fragment-recovered'],
        result: 'You close your fist around the iron. Eight marks blur in memory, but the northern one remains: a crown of mountains around blue fire. Rook’s sleeve hides a partial wax impression made during the first flash.',
        next: 'c4-mara',
      },
    ],
  },

  'c4-mara': {
    id: 'c4-mara',
    kicker: 'One quiet arch',
    title: 'One Honest Minute',
    location: 'A Shelter Between Roads',
    objective: 'Choose where to spend one honest minute before the next attack.',
    threat: 'Uneasy',
    art: 'mileless',
    body: (state) => [
      has(state, 'c4-mara-escorted-brann')
        ? 'Mara returns along Lysara’s guide rope just before the rear span closes. “Brann is safe in Harrowfen,” she says. The breath you had been holding leaves hard enough to hurt.'
        : 'Mara checks the road behind you while Lysara wraps the nine-mark map in living thread. Both women carry rain on their coats and questions they have not asked in front of the others.',
      'Mara taps the pear knife at her belt, your old signal for fear hidden behind a plan. “The law says arrest Rook. Staying alive says listen to him. Which answer will you pretend is simple?”',
      'Across the shelter, Lysara finds one founder seal hidden beneath the northern mark. Her careful court mask slips when she sees it. Whatever she has recognised frightens her more than the Crown soldiers.',
      'Rook guards the entrance without making a joke. Steel strikes stone two arches away. Mara looks between you and Lysara. “One minute,” she says. “Decide what you need from us.”',
    ],
    choices: [
      {
        id: 'c4-tell-mara-law-bends',
        label: 'Tell Mara that law must bend when it stops protecting people.',
        detail: 'Answer her as the friend who has challenged your worst certainties for years.',
        advantage: 'Mara understands the rule that will guide your choice about Rook.',
        addFlags: ['c4-told-mara-law-bends'],
        result: 'Mara turns the pear knife once and returns it to her belt. “Good,” she says. “I was afraid I would have to teach you that while running.” Your shoulders touch as you return to the bridge, familiar and steady.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-promise-mara-truth',
        label: 'Give Mara terms for Rook and promise her honest answers.',
        detail: 'Spend Oathfire binding yourself to honesty without making it a romantic commitment.',
        advantage: 'The honesty Oath should deepen Mara’s trust and make later deception harder.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-oath-honest-with-mara'],
        result: '“Rook gets terms, not trust without limits,” you say. Gold light closes around the promise. Mara covers it with her palm. “Honesty,” she says. “I did not ask for ownership.”',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-kiss-mara-bridge',
        label: 'Tell Mara survival comes first and let her decide how close that brings you.',
        detail: 'Available when your shared trust and attraction have become unmistakable.',
        advantage: 'You and Mara enter the next fight certain of what stands between you.',
        requiresRelationships: { mara: { trust: 5, attraction: 4 } },
        addFlags: ['c4-kissed-mara'],
        result: '“We hear him out,” you say. Mara nods, catches the front of your coat, and gives you enough time to move away. You do not. Her mouth is warm despite the rain. She breaks the kiss at the next clash of steel and leaves her hand over your heart for one last beat.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-hear-lysara-private-risk',
        label: 'Ask Lysara what frightened her and promise not to ask her to soften the truth.',
        detail: 'Give the woman behind the treaty your full attention and make the reassurance part of your choice.',
        advantage: 'Lysara may trust you with a danger she has hidden from every court.',
        addFlags: ['c4-lysara-private-truth'],
        result: 'Lysara shows you an elven founder seal beneath the northern mark. Her mother’s house still uses it. “If this proof condemns my own blood, I will speak it,” she says. “I need to know whether you can stand beside me without asking me to soften it.” You answer that disagreement is not abandonment. For the first time, she lets you see how badly she needed that answer.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-name-lysara-personal',
        label: 'Tell Lysara you need the woman behind the treaty to survive this bridge.',
        detail: 'Available when mutual trust and attraction are already clear. Name personal interest without asking for a promise during danger.',
        advantage: 'Lysara enters the next fight knowing that your concern is personal and freely stated.',
        requiresRelationships: { lysara: { trust: 3, attraction: 2 } },
        addFlags: ['c4-lysara-interest-named'],
        result: '“Not the ambassador,” you say. “You.” Lysara steps close enough that her fingers rest against your jaw. “Then keep yourself alive too,” she says. The next clash of steel ends the moment before either of you turns it into more than you chose.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-keep-quiet-arch-platonic',
        label: 'Keep both bonds as friendship and say so plainly.',
        detail: 'Set a present boundary without treating friendship as rejection or a lesser relationship.',
        advantage: 'Both relationships gain an honest foundation that is complete rather than lesser.',
        addFlags: ['c4-platonic-mara', 'c4-platonic-lysara'],
        result: 'You name what each woman is to you and what she is not. Mara’s relief comes out as a rough laugh. Lysara offers her hand with courtly seriousness, then squeezes hard enough to ruin the ceremony. The three of you return to the bridge with nothing left deliberately unclear.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-return-to-duty',
        label: 'Take one quiet minute alone before answering anyone.',
        detail: 'Choose solitude without being punished for declining a relationship scene.',
        advantage: 'You preserve every resource and return with your judgement settled.',
        addFlags: ['c4-delayed-mara-answer'],
        result: 'You ask for one minute and receive it. When you return, Mara asks only for your decision about Rook. Lysara passes you the wrapped fragment. Neither treats solitude as a debt.',
        next: 'c4-soldiers',
      },
    ],
  },

  'c4-soldiers': {
    id: 'c4-soldiers',
    kicker: 'The Crown closes both ends',
    title: 'A Bridge Full of Crossbows',
    location: 'The Map Arch',
    objective: 'Keep the fragment out of Crown hands.',
    threat: 'Critical',
    art: 'mileless',
    body: (state) => [
      has(state, 'c4-captured-ordan')
        ? 'Crown soldiers enter from both ends of the Map Arch. Their captain orders you to surrender the fragment under royal authority. Your hand begins the old salute, then stops when his rear line aims at bound Ordan.'
        : 'Crown soldiers enter from both ends of the Map Arch. Their captain orders you to surrender the fragment under royal authority. Your hand begins the old salute, then stops when you see the rear line aiming past you at every witness.',
      has(state, 'c4-captured-ordan')
        ? 'Ordan calls out that the soldiers abandoned him. Their captain raises a crossbow at him without answering.'
        : 'The soldiers do not ask where Ordan went. Their silence confirms that recovering him was never part of their command.',
      has(state, 'c4-rook-shortcut-left-pursuit')
        ? 'The soldiers you bypassed on Rook’s shortcut now arrive behind the rear line. Saving your strength has made this fight larger.'
        : 'The route behind you remains blocked, so the captain must fight with the soldiers already on this arch.',
      'Rook turns one mirrored coin across his knuckles. Mara sets her shield. Lysara tightens the green guide rope as the Crown captain raises his hand for the volley.',
    ],
    choices: [
      {
        id: 'c4-break-crown-line',
        label: 'Lead a shield charge through the thinner line.',
        detail: 'Lose Health breaking a path before the crossbows fire together.',
        advantage: 'The shield charge should reach the final anchor before the Crown surrounds it.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c4-broke-crown-line'],
        result: 'You hit the first shield with your whole weight. Pain answers from old wounds, but the line opens and your people pour through.',
        next: 'c4-theatre-plan',
      },
      {
        id: 'c4-command-crossfire',
        label: 'Split your guards and create crossing fields of fire.',
        detail: 'Spend Command forcing both Crown lines behind cover.',
        advantage: 'Crossing fire should buy time to reach the anchor without close combat.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-pinned-crown-lines'],
        result: 'Bolts strike stone from both sides. The Crown soldiers cannot advance without showing their backs to one of your groups.',
        next: 'c4-theatre-plan',
      },
      {
        id: 'c4-feign-surrender',
        label: 'Let Rook place a false fragment at your feet.',
        detail: 'Risk a deception made from his mirrored coin and black wax.',
        advantage: 'The Crown captain advances alone to claim the false prize.',
        addFlags: ['c4-false-fragment-worked'],
        result: 'Rook’s wax catches the fragment’s reflection and looks like iron. The captain steps inside Mara’s reach before he sees the trick.',
        next: 'c4-theatre-plan',
      },
    ],
  },

  'c4-theatre-plan': {
    id: 'c4-theatre-plan',
    kicker: 'The impossible option',
    title: 'One Lie, Three Roads',
    location: 'The Span Before the Final Anchor',
    objective: 'Choose one false scene for the bridge to repeat.',
    threat: 'Immediate',
    art: 'mileless',
    body: (state) => [
      'Rook hangs one small mirrored curtain on the next arch. One silver wire moves it. His single voice reed can give the figure behind it one false voice.',
      'The bridge copies reflections onto nearby spans. Rook only has to stage one clear lie here. The bridge will repeat that same scene in three places while your real group runs for the final anchor.',
      has(state, 'c4-rook-lost-long-wire')
        ? 'The banner rescue snapped his strongest wire. One guard must pull the curtain by hand, leaving that side of the escape less protected.'
        : 'Rook fixes the wire to his boot so the false figure will move when he runs.',
      has(state, 'c4-rook-rang-retreat')
        ? 'The soldiers have already obeyed one false retreat. A second familiar voice will pull their attention before they question it.'
        : 'The real captain is still shouting orders. One simple false scene can draw both Crown lines away from the same opening.',
      'Rook points to the final anchor. “You make one lie convincing. The bridge makes it look impossible.” Mara studies the curtain. “I hate that I can see this working,” she says.',
      'Rook offers you the loose end of his wire. “Captain, which lie are your soldiers about to make true?”',
    ],
    choices: [
      {
        id: 'c4-stage-caelan-arrest',
        label: 'Let Rook stage your public arrest.',
        detail: 'Spend Resolve trusting him with a blade at your back before both armies.',
        advantage: 'The staged arrest should make the Crown lower its crossbows and expose a route.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-staged-arrest'],
        result: 'Behind the curtain, Rook binds you with a knot that opens at one pull and announces your arrest in a royal voice. The bridge repeats the same false arrest across three empty spans. Crown crossbows turn away from your real escape.',
        next: 'c4-anchor',
      },
      {
        id: 'c4-stage-ordan-return',
        label: 'Send a false Ordan across the empty span.',
        detail: 'Spend Command timing your group’s movement with the deception.',
        advantage: 'The false Ordan should draw both Crown lines away from the anchor.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-staged-ordan'],
        result: 'Rook stages one false Ordan behind the curtain. The bridge copies that running figure across three empty spans. Your people move while every crossbow turns toward the same lie in three places.',
        next: 'c4-anchor',
      },
      {
        id: 'c4-flash-salt-curtain',
        label: 'Use the flash salt and run behind the theatre curtain.',
        detail: 'Take the simplest part of Rook’s plan and leave the rest to chance.',
        advantage: 'Your party reaches the anchor without spending a resource.',
        addFlags: ['c4-used-flash-curtain'],
        result: 'White fire fills the curtain. The bridge repeats your fleeing shadows on three empty spans while the real group runs straight toward the anchor.',
        next: 'c4-anchor',
      },
    ],
  },

  'c4-anchor': {
    id: 'c4-anchor',
    kicker: 'One road must remain',
    title: 'Hold the Way Home',
    location: 'The Final Anchor',
    objective: 'Keep one path stable until every survivor crosses.',
    threat: 'Critical',
    art: 'mileless',
    body: (state) => [
      'The last anchor is a waist high ring of black iron. Roads tear away from it one by one. The fragment jerks inside your fist each time an arch opens, pulling your knuckles toward every road at once.',
      'Rook moves ahead, finding footholds where stone has not arrived yet. Lysara feeds green thread through his path. The black ring kicks inside your grip each time another road tears free.',
      has(state, 'c4-oath-no-one-falls')
        ? 'The promise you made during the collapse still burns across your palm. When you push it toward the ring, the hot crack climbs another finger width.'
        : 'A broken buckle on the ring matches one from the patrol you reached too late. Your hand closes over it before the memory can finish.',
      'Rook looks back. “How long can you hold it?”',
    ],
    choices: [
      {
        id: 'c4-oath-hold-one-road',
        label: 'Promise this road remains until the last survivor crosses.',
        detail: 'Spend 2 Oathfire to make the path obey your word.',
        advantage: 'The Oath should keep the stone stable until every survivor crosses.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c4-oath-held-final-road'],
        result: 'Your fire enters the anchor. The road stops turning. It remains until the final foot leaves it, then vanishes behind you like a promise released.',
        next: 'c4-duty',
      },
      {
        id: 'c4-hold-anchor-by-hand',
        label: 'Lock your arms through the iron ring and hold.',
        detail: 'Lose 2 Health taking the bridge’s movement through your body.',
        advantage: 'Holding the ring should keep the road open while preserving Oathfire.',
        changes: { health: -2 },
        requires: { health: 3 },
        addFlags: ['c4-held-anchor-by-strength'],
        result: 'The ring tries to pull your shoulders apart. You hold until Mara tears your hands free after the last survivor crosses.',
        next: 'c4-duty',
      },
      {
        id: 'c4-command-anchor-relay',
        label: 'Rotate every able fighter through the anchor.',
        detail: 'Spend 2 Command sharing the strain without losing the rhythm.',
        advantage: 'The relay should hold the road without one person bearing the full injury.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c4-shared-anchor'],
        result: 'You call each change before the last arms fail. Guard, envoy, thief, and captain hold the same iron ring in turn.',
        next: 'c4-duty',
      },
      {
        id: 'c4-abandon-gear',
        label: 'Drop shields and packs to jam the anchor.',
        detail: 'Sacrifice equipment and evidence to keep the only road open.',
        advantage: 'Everyone escapes without spending a stat, but some proof against the Crown is lost.',
        addFlags: ['c4-lost-gear-and-proof'],
        result: 'Steel, packs, and copies of Ordan’s forged orders vanish into the anchor’s teeth. You keep the royal dispatch inside your coat. The wreckage holds long enough for the survivors to cross.',
        next: 'c4-duty',
      },
    ],
  },

  'c4-duty': {
    id: 'c4-duty',
    kicker: 'The Crown’s next destination',
    title: 'A Royal Order in Ordan’s Hand',
    location: 'The Last Stable Arch',
    objective: 'Choose what to do with Rook before the bridge separates you.',
    threat: 'Rising',
    art: 'nails',
    introducesStoryTerms: ['Regent Malrec'],
    body: (state) => [
      dispatchOpening(state),
      'The order is real. Regent Malrec Vale rules Asterra while the young Queen is ill. He commands you to carry the fragment north to Dragonspine. The bright northern mark on the map points to the same place.',
      'The command may be protection or a trap. The Crown captain tried to kill Ordan after he failed, so Lysara checks the wax twice before giving it back.',
      'The royal seal bends in your left hand. The real fragment pulls north from your right.',
      has(state, 'c4-rook-full-copy')
        ? 'Rook has the complete nine mark map you allowed him to make. He waits beside an opening road, his promised debt sitting uneasily behind his smile.'
        : 'Rook flicks a thin wax scrap into his palm. It shows only the northern mark and two blurred roads. Refusing the full copy has limited what he can sell or follow.',
      'Rook studies two roads as they pull apart. The northern arch leads you toward Dragonspine. A lower arch sinks into the Underways, where he believes he can follow his buyer’s trail.',
      '“You take the real iron north,” Rook says. “I follow my buyer below. If we both survive, we meet again with different answers.” For once, the offer arrives without a joke.',
      'The opening road narrows behind Rook. He extends both hands, wrists together, and waits to learn whether they will hold a cuff, a bargain, or your trust.',
    ],
    choices: [
      {
        id: 'c4-arrest-rook',
        label: 'Arrest Rook before he takes the Underways.',
        detail: 'Keep the law visible, even if a thief will treat chains as a suggestion.',
        advantage: 'Rook becomes a named fugitive if he escapes, and the Underways trail becomes part of your case.',
        changes: { wayfire: 2 },
        addFlags: ['c4-rook-arrested'],
        result: 'You close an iron cuff around Rook’s wrist. He thanks you for choosing the lock he practised on in Harrowfen.',
        next: 'c4-ending-arrest',
      },
      {
        id: 'c4-bargain-with-rook',
        label: 'Bargain for his buyer’s name and roadcraft.',
        detail: 'Let him travel unchained under terms both of you understand.',
        advantage: 'Rook agrees to follow the buyer through the Underways and send you one honest warning.',
        changes: { wayfire: 2 },
        addFlags: ['c4-rook-bargain'],
        result: 'You offer protection until the buyer is exposed. Rook promises a safe exit now and one honest warning from the Underways if he finds a route that can carry it.',
        next: 'c4-ending-bargain',
      },
      {
        id: 'c4-trust-rook',
        label: 'Trust Rook to lead the survivors out, then let him go.',
        detail: 'Place lives above custody and accept that he will choose his own road.',
        advantage: 'Rook reveals a safe exit for everyone and owes you a personal debt.',
        changes: { wayfire: 2 },
        addFlags: ['c4-rook-trusted', 'c4-rook-owes-caelan'],
        result: 'You give Rook the front of the line. Surprise empties his face before the grin returns. “That,” he says softly, “was reckless. I approve.”',
        next: 'c4-ending-trust',
      },
    ],
  },

  'c4-ending-arrest': {
    id: 'c4-ending-arrest',
    kicker: 'Chapter Four complete',
    title: 'The Empty Cuff',
    location: 'The North Road',
    objective: 'Carry the fragment to Dragonspine and learn why the Regent wants its Nail.',
    threat: 'Rising',
    art: 'nails',
    final: true,
    nextChapter: 'c5-north-road',
    body: (state) => [
      'Rook leads you through two false walls and a road hidden behind falling water. At the final stable arch, you reach for him and find the cuff that held his wrist locked around a bridge chain instead.',
      `Across the widening gap, Rook holds ${rookMapCopy(state)} to the light. His wrist is bare. “Escaped custody,” he calls. “Not the investigation.”`,
      'Then he drops through the lower arch toward the Underways. He leaves his mirrored coin at your feet, scratched with the first safe turn toward Dragonspine.',
      'You keep the real fragment. Mara takes the marked coin. Ahead, blue fire burns above the northern mountains, and the Regent’s order feels heavier than the iron in your hand.',
    ],
    choices: [],
  },

  'c4-ending-bargain': {
    id: 'c4-ending-bargain',
    kicker: 'Chapter Four complete',
    title: 'A Thief’s Honest Warning',
    location: 'The Dividing Roads',
    objective: 'Reach Dragonspine while Rook follows the buyer through the Underways.',
    threat: 'Rising',
    art: 'nails',
    final: true,
    nextChapter: 'c5-north-road',
    body: (state) => [
      'Rook guides every survivor through the hidden exit, then gives you the buyer’s meeting phrase and the first honest warning required by your bargain.',
      'Rook looks at the northern road instead of you. The missing smile holds your attention.',
      '“Royal watchers are waiting before the first mountain pass,” he says. “Do not light a fire until the blue glass is behind you.”',
      `He gives Mara a mirrored coin scratched with the first safe turn north. Then he steps onto the lower road toward the Underways with ${rookMapCopy(state)} hidden inside his coat.`,
      'You keep the real fragment and turn toward Dragonspine. Rook follows the money below the world. Your bargain now binds two separate journeys to the same unknown enemy.',
    ],
    choices: [],
  },

  'c4-ending-trust': {
    id: 'c4-ending-trust',
    kicker: 'Chapter Four complete',
    title: 'The Road Rook Leaves Behind',
    location: 'The Dividing Roads',
    objective: 'Take the fragment to Dragonspine and decide whether the royal order is a trap.',
    threat: 'Rising',
    art: 'nails',
    final: true,
    nextChapter: 'c5-north-road',
    body: (state) => [
      has(state, 'c4-captured-ordan')
        ? 'Rook finds a safe road for the wounded, bound Ordan, and every surviving guard.'
        : 'Rook finds a safe road for the wounded and every surviving guard. Ordan is already gone on the lower road.',
      'Your shoulders loosen when the last person reaches firm ground. Rook notices, gives no joke, and steps onto a separate arch before your hand can find the cuff at your belt.',
      `He tosses you a silver wire tied into a small knot. “Pull that when the sensible options become fatal.” Then he hides ${rookMapCopy(state)} in his coat. Your trust has not made him obedient, but it has clearly unsettled him.`,
      'The lower arch closes behind Rook and carries him toward the Underways. You keep the real fragment. Mara joins you on the north road as Dragonspine rises beyond the clouds, crowned in cold blue fire.',
    ],
    choices: [],
  },
};
