import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function pursuitOpening(state: GameState) {
  if (has(state, 'c3-target-ordan')) {
    return 'You chose Ordan as your quarry in Harrowfen. That puts you close enough to see him reach for the fragment, but the dark coated thief reaches it first.';
  }
  if (has(state, 'c3-target-thief')) {
    return 'You followed the thief out of Harrowfen. The mirrored coin he left in the market flashes ahead of you now, turning in his fingers while Ordan closes from the other side.';
  }
  return 'You kept Harrowfen tied to the bridge before following. Mara, Lysara, Brann, and three town guards arrive together, but that careful escape has given Ordan a longer lead.';
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
    body: (state) => [
      pursuitOpening(state),
      'The Mileless Bridge is not one bridge. Broken arches cross beneath a dozen different skies. One opens over a snowfield. Another hangs above a storming sea. A third ends inside a brass lit cavern. Green thread from Lysara’s glass seed runs back toward Harrowfen, showing you which stones still belong together.',
      'The thief lands on the next arch with the iron fragment. Ordan lands behind him. Crown soldiers appear above and raise crossbows. Your Crown. Your soldiers. They are shooting at you anyway.',
      'The fragment is one arch ahead. Behind you, Mara catches a stumbling guard while Brann pulls Lysara’s green thread tight. The bridge shudders, and a crossbow string clicks above.',
    ],
    choices: [
      {
        id: 'c4-secure-guide-rope',
        label: 'Secure Lysara’s guide rope and call everyone across.',
        detail: 'Spend Command to keep the full group together before the pursuit.',
        advantage: 'Your companions enter the bridge in one protected line.',
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
        advantage: 'You reach the fight before Crown reinforcements can form a wall.',
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
        advantage: 'The bridge keeps a stable escape route behind your party.',
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
      'The joke surprises a breath out of you before the next volley reminds you what failure costs. If the thief dies, the fragment may fall into a road no one can reach. If Ordan takes it, he can open another army path.',
    ],
    choices: [
      {
        id: 'c4-shield-rook',
        label: 'Take the next bolt on your shield.',
        detail: 'Lose Health to keep the thief and fragment on the bridge.',
        advantage: 'You expose the hidden shooter and earn the thief’s attention.',
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
        advantage: 'The nearest Crown squad loses its firing position.',
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
        advantage: 'You spot the mirrored coin hiding the real fragment’s position.',
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
      'Beyond him, Lysara’s thread marks four places that remain fixed while the spans between them change: this Bell Arch, the three way junction, the Map Arch, and the final anchor. The simple order gives the impossible bridge a shape you can hold in your mind.',
      rookKit(state),
      'Rook says he does not want the fragment’s power. He wants the map hidden inside it. Ordan arrives on the arch below and orders his soldiers to bring him both of you alive. That order troubles you more than a threat to kill.',
    ],
    choices: [
      {
        id: 'c4-search-rook',
        label: 'Bind one wrist and search his coat.',
        detail: 'Spend Command making the arrest clear while danger closes in.',
        advantage: 'You identify every visible tool Rook can use against you.',
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
        advantage: 'Rook admits he was paid to steal a copy of the hidden map.',
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
    body: () => [
      'The Crown soldiers ignore Ordan’s order to take everyone alive. Instead of advancing, they cut three anchor ropes.',
      'The Bell Arch drops. Brann catches a stone rail with one hand. Two Harrowfen guards slide toward open air. Mara has the guide rope around her waist, but the sudden weight pulls her across the wet stone. Far below, several roads turn like spokes inside a wheel.',
      'Your hand reaches for Brann. The two guards slide faster, and Mara’s boots lose another span of wet stone.',
      'Rook hooks one boot through the broken bell frame. “Captain,” he says, all humour gone, “choose quickly.”',
    ],
    choices: [
      {
        id: 'c4-save-brann',
        label: 'Drop beside Brann and pull him up yourself.',
        detail: 'Lose 2 Health rescuing your oldest guard before the arch turns.',
        advantage: 'Brann survives without falling onto a lower road.',
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
        advantage: 'The whole rear line survives, though Brann suffers a serious arm injury.',
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
        advantage: 'Every companion survives and one span remains stable behind you.',
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
      'The roofed causeway gives you one minute out of crossbow sight. Your hands check Brann’s breathing while your eyes measure the distance to Ordan’s satchel. Friend and evidence refuse to become separate problems.',
      'Rook kneels near Brann but does not touch him. For once he waits for permission. Ordan’s dropped satchel lies on a ledge across the causeway, close enough to reach if someone else handles the wounded.',
    ],
    choices: [
      {
        id: 'c4-carry-brann',
        label: 'Bind Brann’s injury and carry his weight.',
        detail: 'Lose Health taking the wounded man through the next span yourself.',
        advantage: 'Brann remains with you and can still advise the escort.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-carried-brann'],
        result: 'Brann curses softly while you bind him, which reassures you more than silence would. His good arm settles across your shoulders.',
        next: 'c4-three-spans',
      },
      {
        id: 'c4-send-mara-with-brann',
        label: 'Send Mara and one guard back with Brann.',
        detail: 'Lose Mara’s help for the next crossing so the wounded reach safety.',
        advantage: 'Brann and the injured guards return toward Harrowfen under protection.',
        addFlags: ['c4-mara-escorted-brann'],
        result: 'Mara dislikes leaving your side, but she understands the order. Her fingers close around yours once before she takes Brann back.',
        next: 'c4-three-spans',
      },
      {
        id: 'c4-let-rook-splint-brann',
        label: 'Let Rook make the splint while you search Ordan’s satchel.',
        detail: 'Give the thief access to your people and let him tear apart his disguise coat for the bandage.',
        advantage: 'Brann is stabilised and you find a royal dispatch, but Rook’s later disguise will be weaker.',
        addFlags: ['c4-rook-splinted-brann', 'c4-found-dispatch', 'c4-rook-tore-coat-lining'],
        result: 'Rook turns two scabbards and the blue lining of his coat into a firm splint. You recover a sealed dispatch, but the damage leaves his Crown disguise visibly incomplete.',
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
    body: () => [
      'The bridge divides around a stone wheel. Ordan’s blood marks all three exits because the roads keep exchanging pieces beneath him.',
      'One span crosses a white mountain under cold blue flame. One clings to a black sea cliff inside a thunderstorm. The last descends through huge brass wheels turning deep underground.',
      'Snow wind cuts your face from the first arch. Salt spray reaches you from the second. Beneath the third, brass teeth close hard enough to shake the junction.',
      'Mara sets one hand on her sword. “Pick a sky, Captain. Ordan is bleeding into all three.”',
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
      'You notice the cold slowing Brann and count how few minutes remain before hands become too numb to hold a rope.',
      has(state, 'c4-mara-escorted-brann')
        ? 'Without Mara beside you, the empty place at your right feels colder than the wind.'
        : 'Mara presses close while you share the shelter of your shield. Her warmth reaches you through two wet coats, immediate and dangerously easy to notice.',
      'Rook studies the soldiers, then the blue fire. You can almost see an unreasonable plan forming behind his eyes.',
    ],
    choices: [
      {
        id: 'c4-snow-shield-line',
        label: 'Drive the shield line straight up the slope.',
        detail: 'Spend Command to cross before cold weakens the wounded.',
        advantage: 'Your formation reaches the ridge intact and scatters the cutters.',
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
        advantage: 'Your people cross without cold injury and learn the flames answer promises.',
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
        advantage: 'The whole group passes the broken section before the soldiers attack.',
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
        advantage: 'The rope holds even when the road lifts beneath it.',
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
      'You notice a missing beat every seventh turn. It may be the only safe opening the machine gives you.',
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
        advantage: 'No one is separated when the machine turns.',
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
        advantage: 'The stopped wheels also cut off Ordan’s reinforcements.',
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
      rookKit(state),
      has(state, 'c4-rook-tore-coat-lining')
        ? 'Rook reverses his damaged coat, but too much blue cloth is wrapped around Brann’s arm. The disguise will work only at a distance.'
        : 'Rook reverses his coat. The blue lining becomes a Crown officer’s jacket. Black wax changes the shape of his face, and the little reed gives him Ordan’s exact voice.',
      'The voice can fool the soldiers, but Rook does not know their signals. You recognise the western recall from Crown drills and tell him which bell stroke must follow the order.',
      '“West span,” he calls. “The captain has doubled back.” You give the bell signal. Half the squad obeys before Ordan shouts from below. Even Mara stares. Rook bows to her and nearly steps off the bridge because he is watching her reaction.',
      'The trick has opened a path. It has also put Rook close enough to the soldiers’ signal bell to create a much larger lie.',
    ],
    choices: [
      {
        id: 'c4-support-false-order',
        label: 'Make the false order look like your ambush.',
        detail: 'Spend Command moving your guards where the deceived soldiers expect danger.',
        advantage: 'The Crown force divides and loses control of two spans.',
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
        result: 'Rook rings the retreat, then adds the signal for unpaid wages. The second signal is apparently his own invention, but it sends several soldiers away faster.',
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
      'Shock strips the certainty from his face. “They were ordered to recover me.”',
      'The truth reaches you before it reaches him. Whoever gave Ordan the sealed order never meant to leave a witness who knew how Bellweather was opened. You still want him judged in Harrowfen. You also remember every person hurt by his plan.',
    ],
    choices: [
      {
        id: 'c4-save-and-bind-ordan',
        label: 'Pull Ordan up and bind him for trial.',
        detail: 'Lose Health lifting an enemy while the bridge turns.',
        advantage: 'You keep the best living witness against the Crown conspiracy.',
        changes: { health: -1 },
        requires: { health: 2 },
        addFlags: ['c4-captured-ordan'],
        result: 'You drag Ordan onto stone and lock his wrists. He cannot understand why you saved him, which tells you exactly how different his idea of duty is from yours.',
        next: 'c4-nine-marks',
      },
      {
        id: 'c4-command-ordan-rescue',
        label: 'Order two guards to secure Ordan and his satchel.',
        detail: 'Spend Command keeping the prisoner and his evidence together.',
        advantage: 'Ordan survives, and you recover the royal dispatch if you missed it earlier.',
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
    lesson: {
      title: 'The nine Nails',
      body: 'There are nine World Nails. This fragment belongs to the Nail of Distance. Bellweather and the Mileless Bridge used broken pieces of that Nail. Dragonspine is the northern mountain realm protecting a different Nail.',
    },
    body: () => [
      'The World Nail fragment grows warm beside Lysara’s glass seed. Thin lines of light unfold from the iron and hang in the air. They form a map of the known world with nine bright marks driven through it.',
      '“This fragment belongs to the Nail of Distance,” Lysara says. “That Nail is one of nine anchors holding the world’s laws in place. Bellweather and this bridge held broken pieces of it. Dragonspine guards another Nail.”',
      'One mark rests on Greyhaven. Another burns beneath the border treaty route. If each can become an army road overnight, no wall, harvest convoy, or distant village remains distant enough to be safe.',
      'Rook asks how much harm one wax copy can do. Lysara does not look away from him. “Enough to move an army between countries before either border sees it.” His smile fades, but his eyes keep following the marks.',
    ],
    choices: [
      {
        id: 'c4-lysara-read-map',
        label: 'Let Lysara join the marks with living thread.',
        detail: 'Spend Resolve holding the fragment while its roads pull against your memories.',
        advantage: 'Lysara identifies the next active mark and records all nine locations.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-lysara-mapped-nine'],
        result: 'Green thread joins the lights. The northern mountain mark burns brightest, and Lysara copies every location into her treaty book.',
        next: 'c4-mara',
      },
      {
        id: 'c4-allow-rook-copy',
        label: 'Allow Rook one wax copy under your eyes.',
        detail: 'Trade information to learn who hired him for it.',
        advantage: 'You gain his buyer’s meeting place and a debt he openly accepts.',
        addFlags: ['c4-rook-full-copy', 'c4-rook-owes-caelan'],
        result: 'Rook presses black wax beneath the lights. He names the price of his honesty: his buyer waits beyond the northern mountains. Then he promises you one favour and looks annoyed that he means it.',
        next: 'c4-mara',
      },
      {
        id: 'c4-oath-find-next-nail',
        label: 'Use your Oath to feel which mark threatens your people next.',
        detail: 'Spend Oathfire for a direct sense of the Crown’s next destination.',
        advantage: 'You identify the northern mark without giving Rook permission to copy the map.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-sensed-northern-nail', 'c4-denied-rook-copy'],
        result: 'One northern mark answers with cold blue fire. Behind you, Rook quietly folds a scrap of wax. Whatever he caught is incomplete, but not empty.',
        next: 'c4-mara',
      },
      {
        id: 'c4-memorise-map',
        label: 'Close the fragment and keep the nine marks in memory.',
        detail: 'Protect the map from both Rook and the Crown, but accept an imperfect record.',
        advantage: 'You preserve resources and remember the northern mark clearly enough to follow.',
        addFlags: ['c4-memorised-nine', 'c4-denied-rook-copy'],
        result: 'You close your fist around the iron. Eight marks blur in memory, but the northern one remains: a crown of mountains around blue fire. Rook’s sleeve hides a partial wax impression made during the first flash.',
        next: 'c4-mara',
      },
    ],
  },

  'c4-mara': {
    id: 'c4-mara',
    kicker: 'What duty permits',
    title: 'One Quiet Arch',
    location: 'A Shelter Between Roads',
    objective: 'Decide how much of yourself Mara can see before the next attack.',
    threat: 'Uneasy',
    art: 'mileless',
    body: (state) => [
      has(state, 'c4-mara-escorted-brann')
        ? 'Mara returns along Lysara’s guide rope just before the rear span closes. Brann is safe in Harrowfen. Relief loosens something in your chest that command had kept tight.'
        : 'Mara draws you into a stone shelter barely wide enough for two people. Her wet hair rests against her cheek, and the rise and fall of her breathing is close enough to feel through your coat.',
      'She looks past you toward Rook. “The law says arrest him. Staying alive says listen to him. Which answer will you pretend is simple?”',
      'Mara still holds the pear knife she carried out of Greyhaven. Her thumb taps its handle once, the old signal she used whenever she caught you hiding fear behind a plan.',
      'Steel on stone announces the next battle outside. Mara says, “I need your answer.”',
    ],
    choices: [
      {
        id: 'c4-tell-mara-law-bends',
        label: 'Tell her law must bend when it stops protecting people.',
        detail: 'Share the belief that may put you against the Crown itself.',
        advantage: 'Mara understands the rule that will guide your choice about Rook.',
        addFlags: ['c4-told-mara-law-bends'],
        result: 'Mara studies you, then rests her forehead against yours. “Good,” she whispers. “I was afraid I would have to teach you that while running.”',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-promise-mara-truth',
        label: 'Tell her Rook deserves terms, then promise not to hide behind duty with her.',
        detail: 'Spend Oathfire answering the immediate question and binding yourself to private honesty.',
        advantage: 'You deepen her trust and make future deception between you harder.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c4-oath-honest-with-mara'],
        result: '“Rook gets terms, not trust without limits,” you say. The promise that follows warms the small space between your bodies. Mara touches the new light in your palm, and you feel how much the oath frightens and moves her.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-kiss-mara-bridge',
        label: 'Say survival comes before rigid law, then kiss her if she agrees.',
        detail: 'Answer her question, then act on the attraction you have both been carrying.',
        advantage: 'You and Mara enter the next fight certain of what stands between you.',
        requiresRelationships: { mara: { trust: 5, attraction: 4 } },
        addFlags: ['c4-kissed-mara'],
        result: '“We hear him out,” you say. Mara nods before you pull her close. Her mouth is warm despite the rain, firm at first, then softer when your hand settles at her waist. The kiss ends because steel rings outside, not because either of you wants it to.',
        next: 'c4-soldiers',
      },
      {
        id: 'c4-return-to-duty',
        label: 'Tell her you will hear Rook out, but delay the personal answer.',
        detail: 'Answer the question about Rook without making a private promise during a crisis.',
        advantage: 'You preserve every resource and avoid offering words you may not keep.',
        addFlags: ['c4-delayed-mara-answer'],
        result: 'Mara accepts the answer, though disappointment passes across her face. She checks your armour with careful hands before stepping back into danger.',
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
      'Crown soldiers enter from both ends of the Map Arch. Their captain orders you to surrender the fragment under royal authority. The words would once have stopped you. After Ordan, they only make you look for the trap inside the order.',
      'You suspect the captain wants you alive only until the fragment is safely in his hand.',
      has(state, 'c4-captured-ordan')
        ? 'Ordan calls out that the soldiers abandoned him. Their captain raises a crossbow at him without answering.'
        : 'The soldiers do not ask where Ordan went. Their silence confirms that recovering him was never part of their command.',
      has(state, 'c4-rook-shortcut-left-pursuit')
        ? 'The soldiers you bypassed on Rook’s shortcut now arrive behind the rear line. Saving your strength has made this fight larger.'
        : 'The route behind you remains blocked, so the captain must fight with the soldiers already on this arch.',
      'Rook turns one mirrored coin across his knuckles. Mara sets her shield. Lysara holds the green guide rope and waits for your decision.',
    ],
    choices: [
      {
        id: 'c4-break-crown-line',
        label: 'Lead a shield charge through the thinner line.',
        detail: 'Lose Health breaking a path before the crossbows fire together.',
        advantage: 'Your party reaches the final anchor before the Crown can surround it.',
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
        advantage: 'You gain time to reach the anchor without close combat.',
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
    title: 'Rook’s Travelling War',
    location: 'The Final Anchor',
    objective: 'Turn Rook’s performance into a real escape.',
    threat: 'Immediate',
    art: 'mileless',
    body: (state) => [
      'The Mileless Bridge repeats reflections across neighbouring spans. Rook angles the mirrored lining of his hand sized curtain toward one disguised figure. The bridge throws that reflection onto three arches while his voice reeds send a different order through each copy.',
      has(state, 'c4-rook-lost-long-wire')
        ? 'The silver wire lost at the Bell Arch leaves one false captain moving badly. You place two guards where the weak reflection would expose the escape.'
        : 'Rook runs silver wire through the curtain so each reflected captain turns at a different moment.',
      has(state, 'c4-rook-rang-retreat')
        ? 'Soldiers who already obeyed one false retreat now hear Ordan order them to arrest their own captain. Confusion spreads faster than any blade.'
        : 'One false captain orders an advance. Another orders an arrest. The real captain shouts himself hoarse trying to prove he is real.',
      'Rook points to the final anchor. “You hold one road open. I make everyone believe we escaped by the other six.” It is absurd. You can also see exactly why it might work.',
      'Ordan prepared for every sensible defence. He did not prepare for a travelling theatre guided by a captain who knows Crown signals.',
    ],
    choices: [
      {
        id: 'c4-stage-caelan-arrest',
        label: 'Let Rook stage your public arrest.',
        detail: 'Spend Resolve trusting him with a blade at your back before both armies.',
        advantage: 'The Crown lines lower their crossbows and open a route to the anchor.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c4-staged-arrest'],
        result: 'Rook binds you with a knot that falls open at one pull and announces your arrest in a perfect royal voice. Even Lysara looks offended before she sees the hidden loop.',
        next: 'c4-anchor',
      },
      {
        id: 'c4-stage-ordan-return',
        label: 'Send a false Ordan across the empty span.',
        detail: 'Spend Command timing your group’s movement with the deception.',
        advantage: 'Both Crown lines chase the officer they were ordered to silence.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c4-staged-ordan'],
        result: 'A coat, a voice reed, and a mirrored coin send Ordan running across an empty bridge. Your people move while every crossbow turns toward the lie.',
        next: 'c4-anchor',
      },
      {
        id: 'c4-flash-salt-curtain',
        label: 'Use the flash salt and run behind the theatre curtain.',
        detail: 'Take the simplest part of Rook’s plan and leave the rest to chance.',
        advantage: 'Your party reaches the anchor without spending a resource.',
        addFlags: ['c4-used-flash-curtain'],
        result: 'White fire fills the arch. Rook snaps the tiny curtain open, and its mirrored lining throws your shadows in six directions while the real group runs straight ahead.',
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
      'The last anchor is a waist high ring of black iron. Roads tear away from it one by one. You can feel the fragment answering inside your fist, eager to open all of them at once.',
      'Rook moves ahead, finding footholds where stone has not arrived yet. Lysara feeds green thread through his path. Your part is less clever and more dangerous: hold one road in place while everyone crosses it.',
      has(state, 'c4-oath-no-one-falls')
        ? 'The promise you made during the collapse still burns. You can extend it, but you know the cost will enter your body.'
        : 'You think of the patrol you once reached too late. The old failure does not choose for you, but it stands close.',
      'Rook looks back. “How long can you hold it?”',
    ],
    choices: [
      {
        id: 'c4-oath-hold-one-road',
        label: 'Promise this road remains until the last survivor crosses.',
        detail: 'Spend 2 Oathfire to make the path obey your word.',
        advantage: 'Every survivor and prisoner crosses on stable stone.',
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
        advantage: 'The road stays open and your remaining Oathfire is preserved.',
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
        advantage: 'The group holds the road together and no one bears the full injury.',
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
        result: 'Steel, packs, and sealed papers vanish into the anchor’s teeth. The wreckage holds long enough for the survivors to cross.',
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
    introducesStoryTerms: ['Dragonspine', 'Regent Malrec'],
    lesson: {
      title: 'Dragonspine and the Regent',
      body: 'Dragonspine is the northern mountain realm around the next active World Nail. Regent Malrec Vale rules Asterra while the young Queen is ill.',
    },
    body: (state) => [
      has(state, 'c4-found-dispatch')
        ? 'You break the dispatch recovered from Ordan’s satchel.'
        : 'Lysara finds a royal dispatch sewn beneath the lining of Ordan’s satchel while the final arch steadies.',
      'The order is real. Regent Malrec Vale, ruler of Asterra while the young Queen is ill, commands that the fragment be carried to Dragonspine. The name belongs to the northern mountain realm around the bright mark on the hidden map.',
      'The Regent ordered Ordan to deliver the fragment, yet his soldiers were willing to kill Ordan after he failed. You cannot tell whether the royal command is a warning, a trap, or both.',
      'The royal seal feels heavier than its wax should allow. The fragment pulls north in your other hand, toward the same place the Regent commands you to carry it.',
      has(state, 'c4-rook-full-copy')
        ? 'Rook has the complete nine mark map you allowed him to make. He waits beside an opening road, his promised debt sitting uneasily behind his smile.'
        : 'Rook flicks a thin wax scrap into his palm. It shows only the northern mark and two blurred roads. Refusing the full copy has limited what he can sell or follow.',
      '“I want the buyer who knew your sealed route,” Rook says. “Keep me alive until I reach them, and give me my freedom afterward. In return, I get you through roads your Wardens cannot see.” For once, the offer arrives without a joke.',
      'The opening road narrows behind Rook. He extends both hands, wrists together, and waits to learn whether they will hold a cuff, a bargain, or your trust.',
    ],
    choices: [
      {
        id: 'c4-arrest-rook',
        label: 'Arrest Rook and take him toward Dragonspine.',
        detail: 'Keep the law visible, even if a thief will treat chains as a suggestion.',
        advantage: 'Rook becomes a named prisoner and your claim to his map copy is lawful.',
        changes: { wayfire: 2 },
        addFlags: ['c4-rook-arrested'],
        result: 'You close an iron cuff around Rook’s wrist. He thanks you for choosing the lock he practised on in Harrowfen.',
        next: 'c4-ending-arrest',
      },
      {
        id: 'c4-bargain-with-rook',
        label: 'Bargain for his buyer’s name and roadcraft.',
        detail: 'Let him travel unchained under terms both of you understand.',
        advantage: 'Rook agrees to guide you to Dragonspine and expose the buyer at the meeting.',
        changes: { wayfire: 2 },
        addFlags: ['c4-rook-bargain'],
        result: 'You offer protection until the buyer is exposed. Rook offers directions, one honest warning per day, and no promise about your pockets.',
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
      'Rook leads you through two false walls and a road hidden behind falling water. By the final turn, he has slipped his hand free. The unopened cuff now hangs from his own wrist like a bracelet, but he remains on your north road, twenty steps ahead.',
      '“Escaped custody,” he says. “Not the investigation.”',
      `He holds ${rookMapCopy(state)} to the light. “We can argue about the arrest in the mountains.”`,
      'You keep the real fragment. Mara keeps Rook’s mirrored coin. Ahead, blue fire burns above Dragonspine, and the Regent’s order feels heavier than the iron in your hand.',
    ],
    choices: [],
  },

  'c4-ending-bargain': {
    id: 'c4-ending-bargain',
    kicker: 'Chapter Four complete',
    title: 'A Thief’s Honest Warning',
    location: 'The North Road',
    objective: 'Reach Dragonspine before Rook’s buyer claims the next World Nail.',
    threat: 'Rising',
    art: 'nails',
    final: true,
    nextChapter: 'c5-north-road',
    body: (state) => [
      'Rook guides every survivor through the hidden exit, then gives you the buyer’s meeting phrase and the first honest warning required by your bargain.',
      'You believe the warning because admitting it seems to cost him more than the bargain did.',
      '“The person paying me knew your sealed route before Ordan did,” he says. “They also expect you to obey the Regent and carry the fragment north.”',
      `He steps onto a road running beside yours, close enough to follow and far enough to escape. You keep the real fragment. Rook keeps ${rookMapCopy(state)}, which points toward Dragonspine, where cold blue fire waits above the mountains.`,
    ],
    choices: [],
  },

  'c4-ending-trust': {
    id: 'c4-ending-trust',
    kicker: 'Chapter Four complete',
    title: 'The Road Rook Leaves Behind',
    location: 'The North Road',
    objective: 'Take the fragment to Dragonspine and decide whether the royal order is a trap.',
    threat: 'Rising',
    art: 'nails',
    final: true,
    nextChapter: 'c5-north-road',
    body: (state) => [
      'Rook finds a safe road for the wounded, the prisoner, and every surviving guard. Only when the last person reaches firm ground does he step onto a separate arch.',
      'You feel relief before suspicion, and that order tells you why trusting him mattered.',
      `He tosses you a silver wire tied into a small knot. “Pull that when the sensible options become fatal.” Then he hides ${rookMapCopy(state)} in his coat. Your trust has not made him obedient, but it has clearly unsettled him.`,
      'You keep the real fragment. Mara joins you on the north road as Dragonspine rises beyond the clouds, crowned in cold blue fire. Somewhere ahead, Rook is taking a less sensible route to the same answer.',
    ],
    choices: [],
  },
};
