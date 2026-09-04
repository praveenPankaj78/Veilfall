export type StatKey = 'stamina' | 'resolve' | 'insight' | 'rapport' | 'cinders';

export type GameStats = Record<StatKey, number>;

export type GameState = {
  nodeId: string;
  stats: GameStats;
  flags: string[];
  history: string[];
};

export type Choice = {
  id: string;
  label: string;
  detail: string;
  next: string;
  changes?: Partial<GameStats>;
  addFlags?: string[];
  requires?: Partial<GameStats>;
  result: string;
};

export type StoryNode = {
  id: string;
  kicker: string;
  title: string;
  location: string;
  body: (state: GameState) => string[];
  choices: Choice[];
  final?: boolean;
};

export const initialState: GameState = {
  nodeId: 'morning',
  stats: { stamina: 5, resolve: 3, insight: 1, rapport: 1, cinders: 0 },
  flags: [],
  history: [],
};

export const statLabels: Record<StatKey, string> = {
  stamina: 'Stamina',
  resolve: 'Resolve',
  insight: 'Insight',
  rapport: 'Rapport',
  cinders: 'Cinders',
};

export const nodes: Record<string, StoryNode> = {
  morning: {
    id: 'morning',
    kicker: 'Chapter One',
    title: 'The Last Quiet Morning',
    location: 'Southwatch Barracks, Greyhaven',
    body: () => [
      'The rain stops a little before sunrise. Water ticks from the roof outside your window, slow and steady, while the barracks wakes below.',
      'Your name is Caelan Vey. You are thirty-one years old, captain of the King’s Road Guard, and the son of a blacksmith who still thinks officers wear too much polish. For twelve years you have kept royal roads safe. Most days, the work is mud, ledgers, and men pretending their boots do not hurt.',
      'Today you will escort King Aldren from Southwatch to the river blessing. It is a short ride through streets you know. Sergeant Brann has already placed hot tea beside your door. Someone has also left a red apple on top of your folded cloak.',
      'Only one person in Greyhaven does that.',
    ],
    choices: [
      {
        id: 'early-drill',
        label: 'Join the morning weapons drill.',
        detail: 'Spend Stamina now to settle your nerves and earn the recruits’ respect.',
        next: 'courtyard',
        changes: { stamina: -1, resolve: 1 },
        addFlags: ['early-drill'],
        result: 'The drill leaves your shoulders warm and your thoughts quiet.',
      },
      {
        id: 'check-tack',
        label: 'Inspect the escort horses yourself.',
        detail: 'A captain who checks small things is harder to surprise.',
        next: 'courtyard',
        changes: { insight: 1 },
        addFlags: ['checked-tack'],
        result: 'You replace one cracked buckle before it can become a broken neck.',
      },
      {
        id: 'breakfast-brann',
        label: 'Eat with Brann and the night watch.',
        detail: 'Goodwill is built before anyone needs a favor.',
        next: 'courtyard',
        changes: { rapport: 1 },
        addFlags: ['ate-with-watch'],
        result: 'You trade bad bread and worse jokes with people who trust you to bring them home.',
      },
    ],
  },
  courtyard: {
    id: 'courtyard',
    kicker: 'An ordinary beginning',
    title: 'Buckles and Breakfast Smoke',
    location: 'Southwatch Courtyard',
    body: (state) => [
      state.flags.includes('early-drill')
        ? 'Brann makes you work for the final touch. When you knock the practice blade from his hand, the recruits cheer for both of you.'
        : state.flags.includes('checked-tack')
          ? 'The grey gelding calms under your hand. Stable boy Petyr watches how you test each strap and copies the motion.'
          : 'Brann finishes the last of your tea and claims it went cold. The night watch laughs because everyone saw him warm it over the stove.',
      'The courtyard smells of horsehair, porridge, and rain on stone. Beyond the wall, Greyhaven’s seven hills catch the first pale light. Bakers open shutters. Port bells count incoming barges. Nothing about the city looks ready to become a legend.',
      'Mara Renn crosses the yard carrying your shoulder guard. She is a royal scout, an excellent shot, and the reason for the apple upstairs. You have known her since you were both barefoot children stealing nails from your father’s forge.',
      '“Hold still, Captain,” she says. “I would hate to lose you because you dressed yourself badly.”',
    ],
    choices: [
      {
        id: 'flirt-mara',
        label: '“Then inspect me properly after duty.”',
        detail: 'Flirt openly and let the old spark breathe.',
        next: 'armory',
        changes: { rapport: 1 },
        addFlags: ['flirted-mara'],
        result: 'Mara’s fingers pause on the strap. Her smile arrives slowly and stays.',
      },
      {
        id: 'ask-scouting',
        label: 'Ask what she saw on her dawn patrol.',
        detail: 'Keep the warmth, but put duty first.',
        next: 'armory',
        changes: { insight: 1 },
        addFlags: ['asked-patrol'],
        result: 'Mara gives you the useful details first. She always notices when you are truly listening.',
      },
      {
        id: 'admit-worry',
        label: 'Tell her the palace promotion worries you.',
        detail: 'Trust her with the part you hide from the guard.',
        next: 'armory',
        changes: { resolve: 1, rapport: 1 },
        addFlags: ['trusted-mara-personal'],
        result: 'She stops teasing. “Then decide what you want before the palace decides for you.”',
      },
    ],
  },
  armory: {
    id: 'armory',
    kicker: 'Someone worth returning to',
    title: 'The Red Half-Cloak',
    location: 'Southwatch Armory',
    body: (state) => [
      'Inside the armory, Mara sets the shoulder guard in place and pulls the leather strap snug. You feel the warmth of her knuckles through your shirt.',
      state.flags.includes('flirted-mara')
        ? '“After duty,” she says. “If the famous Captain Vey can survive a two-mile ride and one dull speech.”'
        : state.flags.includes('trusted-mara-personal')
          ? '“You do not owe the palace your whole life,” she says quietly. “Save an evening for someone who asks instead of orders.”'
          : 'She tells you the western roofs were clear at dawn, then adds that this is not permission to spend the whole ride staring upward.',
      'Your half-cloak is new, deep red wool with the king’s silver road pin at the collar. A captain’s cloak. Your old brown one still hangs on its peg, patched by your mother before she died.',
      'Mara holds one in each hand. “Which man am I riding beside today?”',
    ],
    choices: [
      {
        id: 'wear-red',
        label: 'Wear the captain’s red cloak.',
        detail: 'Be visible, accept command, and look the part.',
        next: 'south-gate',
        changes: { resolve: 1 },
        addFlags: ['red-cloak'],
        result: 'Mara fastens the silver pin and smooths the wool once across your chest.',
      },
      {
        id: 'wear-old',
        label: 'Wear the old brown cloak.',
        detail: 'Stay close to the man you were before the title.',
        next: 'south-gate',
        changes: { rapport: 1 },
        addFlags: ['brown-cloak'],
        result: 'Mara tucks the worn collar flat. “There you are,” she says.',
      },
      {
        id: 'ask-mara-choose',
        label: 'Let Mara choose for you.',
        detail: 'A small act of trust may say more than flirting.',
        next: 'south-gate',
        changes: { rapport: 1, insight: 1 },
        addFlags: ['mara-chose-cloak', 'red-cloak'],
        result: 'She chooses red. “The city needs to see who is keeping the road.”',
      },
    ],
  },
  'south-gate': {
    id: 'south-gate',
    kicker: 'The work you know',
    title: 'A King’s Short Road',
    location: 'The South Gate',
    body: (state) => [
      'By midmorning, the escort waits beneath the gatehouse. Twelve guards, four scouts, one royal carriage, and enough ceremony to turn a short ride into hard work.',
      state.flags.includes('red-cloak')
        ? 'Children by the rail point at your red cloak. You lift one hand and earn three solemn salutes.'
        : 'Your brown cloak draws no attention. A merchant mistakes you for a common road sergeant and asks where the captain has gone.',
      'King Aldren arrives without a crown. He is fifty-eight, broad in the middle, and kinder to horses than to ministers. He knows your name and your father’s. That simple habit has bought him more loyalty than most laws.',
      'Mara rides at your right. Her boot brushes yours as the horses shift. “Still time to fake a fever,” she murmurs.',
    ],
    choices: [
      {
        id: 'calm-horse',
        label: 'Help a young guard calm his frightened horse.',
        detail: 'Spend Stamina and keep the escort steady.',
        next: 'sealed-order',
        changes: { stamina: -1, rapport: 1 },
        addFlags: ['calmed-horse'],
        result: 'You take the reins until the animal settles. The young guard remembers that you noticed.',
      },
      {
        id: 'read-crowd',
        label: 'Study the crowd while everyone watches the king.',
        detail: 'Look for the person who does not fit the morning.',
        next: 'sealed-order',
        changes: { insight: 1 },
        addFlags: ['read-crowd'],
        result: 'Most faces hold honest curiosity. One palace messenger keeps looking at you instead of the king.',
      },
      {
        id: 'answer-mara',
        label: '“Only if you nurse me through it.”',
        detail: 'Give Mara a promise to collect after duty.',
        next: 'sealed-order',
        changes: { rapport: 1 },
        addFlags: ['promised-evening'],
        result: 'Her knee presses yours for one brief moment. “I charge by the hour.”',
      },
    ],
  },
  'sealed-order': {
    id: 'sealed-order',
    kicker: 'The first wrong thing',
    title: 'Your Name in Another Hand',
    location: 'The South Gate',
    body: (state) => [
      'The palace messenger reaches you before the gates open. He is young, out of breath, and holding a folded order sealed with dark red wax.',
      state.flags.includes('read-crowd')
        ? 'You noticed him early enough to see that he came from Riverteeth, not Crown Hill. Mud from the lower streets dries pale on his boots.'
        : 'He bows, apologizes for the delay, and says the order came directly from your office on Crown Hill.',
      'The message tells you to move the royal carriage away from King’s Road and take the narrow route through Riverteeth. The reason given is a broken water main.',
      'The seal is yours. The handwriting is yours. You did not write it.',
      'For a moment, the sounds of the gatehouse seem very far away. Mara reads your face before she reads the page.',
    ],
    choices: [
      {
        id: 'show-marshal',
        label: 'Show the false order to Marshal Hedd at once.',
        detail: 'Use the chain of command and put your reputation at risk.',
        next: 'route-council',
        changes: { resolve: 1 },
        addFlags: ['told-marshal'],
        result: 'Hedd studies the seal, then studies you. He believes the danger before he decides whether to believe the man.',
      },
      {
        id: 'question-messenger',
        label: 'Take the messenger aside and test his story.',
        detail: 'Keep the order quiet while you search for a crack in the delivery.',
        next: 'route-council',
        changes: { insight: 1 },
        addFlags: ['questioned-messenger'],
        result: 'The boy remembers a gloved clerk, your red cloak, and a voice that sounded exactly like yours.',
      },
      {
        id: 'trust-mara-order',
        label: 'Give the order to Mara and ask what she sees.',
        detail: 'Trust her fieldcraft and let her share the danger.',
        next: 'route-council',
        changes: { rapport: 1, insight: 1 },
        addFlags: ['trusted-mara-order'],
        result: 'Mara smells the wax and finds river salt pressed into its edge. “This was sealed below the third hill.”',
      },
    ],
  },
  'route-council': {
    id: 'route-council',
    kicker: 'A captain decides',
    title: 'Three Roads to the River',
    location: 'Inside the South Gate',
    body: (state) => [
      state.flags.includes('told-marshal')
        ? 'Marshal Hedd wants the escort delayed while he closes the district. The king refuses. Hundreds of people already wait by the river, and panic will spread faster than any assassin.'
        : state.flags.includes('questioned-messenger')
          ? 'The messenger swears the clerk looked like you. He is too frightened to be clever. You send him to Brann, then call Mara and Hedd around the route board.'
          : 'Mara lays the false order on the route board. Hedd’s mouth hardens when she tells him where the wax was sealed.',
      'The original King’s Road is broad and crowded. Riverteeth is narrow but easier to clear. A third option would send an empty carriage through Riverteeth while the king rides under a plain guard cloak.',
      'You have no proof of where the attack will come. You do know someone planned this carefully and expected you to obey your own name.',
    ],
    choices: [
      {
        id: 'take-riverteeth',
        label: 'Use Riverteeth and turn the false order into bait.',
        detail: 'Meet the threat where it expects you, with shields ready.',
        next: 'river-route',
        changes: { resolve: 1 },
        addFlags: ['river-route'],
        result: 'You move the shield line forward and order every window watched.',
      },
      {
        id: 'keep-kings-road',
        label: 'Keep to the original King’s Road.',
        detail: 'Choose open ground, crowds, and the route your guard prepared.',
        next: 'king-road',
        changes: { rapport: 1 },
        addFlags: ['king-road'],
        result: 'Hedd clears the broad road while Mara takes the roofs ahead.',
      },
      {
        id: 'send-decoy',
        label: 'Send an empty carriage through Riverteeth.',
        detail: 'Spend Insight and Stamina to prepare a convincing decoy.',
        next: 'decoy-route',
        changes: { insight: -3, stamina: -1 },
        requires: { insight: 3, stamina: 2 },
        addFlags: ['decoy-route'],
        result: 'You trade cloaks, split the guard, and give the false plan one final lie to swallow.',
      },
    ],
  },
  'river-route': {
    id: 'river-route',
    kicker: 'The cost of being expected',
    title: 'Arrows Over Riverteeth',
    location: 'Cooper’s Lane, Riverteeth',
    body: (state) => [
      'Riverteeth smells of tar, salt, and fresh-cut oak. Workers stand behind the guard ropes and watch the red carriage pass between leaning warehouses.',
      'Mara’s whistle cuts once from the roof. Danger left.',
      'A shutter opens. The first crossbow bolt strikes the carriage door where the king’s heart should be. Three more follow. Your guards lock shields, horses scream, and the quiet morning ends.',
      state.flags.includes('calmed-horse')
        ? 'The young guard keeps his frightened horse under control. The left side of your line holds because of the minute you gave him at the gate.'
        : 'A frightened horse tears free and opens a gap beside the carriage.',
      'You see the shooter running above. You also see a second bolt aimed through the gap, and Mara dropping from the roof with two attackers behind her.',
    ],
    choices: [
      {
        id: 'shield-king-river',
        label: 'Cover the king with your own shield.',
        detail: 'Spend Stamina and do the work your oath demands.',
        next: 'ending-duty',
        changes: { stamina: -2, resolve: 1, cinders: 3 },
        requires: { stamina: 2 },
        addFlags: ['shielded-king'],
        result: 'The bolt drives you to one knee, but the king remains standing behind you.',
      },
      {
        id: 'chase-shooter-river',
        label: 'Climb after the fleeing shooter.',
        detail: 'Spend Insight to cut off the only person who may know the plan.',
        next: 'ending-truth',
        changes: { insight: -2, resolve: -1, cinders: 4 },
        requires: { insight: 2 },
        addFlags: ['caught-attacker'],
        result: 'You leave the shield line to Brann and reach the roof before the shooter reaches the rope bridge.',
      },
      {
        id: 'help-mara-river',
        label: 'Turn toward Mara and hold the stair with her.',
        detail: 'Trust your guard with the king and protect the scout who found the trap.',
        next: 'ending-bond',
        changes: { rapport: 2, stamina: -1, cinders: 3 },
        addFlags: ['stood-with-mara'],
        result: 'You and Mara meet at the stair and fight back to back without needing to speak.',
      },
    ],
  },
  'king-road': {
    id: 'king-road',
    kicker: 'The danger changes roads',
    title: 'The Cart in Bellmarket',
    location: 'King’s Road, Bellmarket',
    body: (state) => [
      'King’s Road is wide enough for six wagons and crowded enough for sixty. Flower sellers call to the carriage. Children run beside the horses until guards wave them back.',
      state.flags.includes('red-cloak')
        ? 'Your red cloak makes you easy to find. It also keeps every nervous guard looking toward you for the next order.'
        : 'In the old brown cloak, you move beside the carriage without drawing the crowd’s eyes.',
      'A brewer’s cart rolls from an alley too fast. The driver jumps clear. Beneath the empty barrels, a clay firepot spits sparks toward the royal carriage.',
      'Mara is already moving. She points to a man slipping through the flower stalls, his hands stained with the same red wax as the false order.',
    ],
    choices: [
      {
        id: 'stop-cart',
        label: 'Put your shoulder into the cart and turn it.',
        detail: 'Spend Stamina to move the blast away from the crowd.',
        next: 'ending-duty',
        changes: { stamina: -2, rapport: 1, cinders: 3 },
        requires: { stamina: 2 },
        addFlags: ['stopped-cart'],
        result: 'The axle breaks against the curb. Fire washes the wall instead of the carriage.',
      },
      {
        id: 'take-wax-man',
        label: 'Send Brann to the cart and chase the wax-stained man.',
        detail: 'Trust your sergeant while you pursue the clearest answer.',
        next: 'ending-truth',
        changes: { resolve: -1, insight: 1, cinders: 4 },
        addFlags: ['caught-attacker'],
        result: 'Brann hears your order and does not hesitate. You follow the stained hands into the crowd.',
      },
      {
        id: 'follow-mara',
        label: 'Follow Mara’s signal and close the alley together.',
        detail: 'Use trust and practiced teamwork to trap the attacker.',
        next: 'ending-bond',
        changes: { rapport: 2, cinders: 3 },
        requires: { rapport: 3 },
        addFlags: ['stood-with-mara', 'caught-attacker'],
        result: 'Mara drives the attacker toward you. He stops when he sees how completely you understand her plan.',
      },
    ],
  },
  'decoy-route': {
    id: 'decoy-route',
    kicker: 'A careful trap',
    title: 'The Empty Carriage',
    location: 'The Rooftops Above Riverteeth',
    body: (state) => [
      'You watch from a cooper’s roof as the empty carriage enters the narrow lane. The king waits three streets away in a plain guard cloak, complaining cheerfully about the fit.',
      'Five attackers reveal themselves at once. Crossbows rise behind shutters. Two runners close the lane. Mara taps your wrist and points to their leader, a broad man holding the matching half of your forged seal.',
      state.flags.includes('trusted-mara-order')
        ? '“You trusted me with the first clue,” she whispers. “Trust me with the jump.”'
        : 'Mara measures the gap to the next roof. “Try not to make me carry you.”',
      'The leader realizes the carriage is empty and turns. For one startled moment, he looks directly at you. He knows your face.',
    ],
    choices: [
      {
        id: 'take-leader',
        label: 'Jump with Mara and take the leader alive.',
        detail: 'Spend Stamina. A living answer is worth the bruises.',
        next: 'ending-truth',
        changes: { stamina: -2, rapport: 1, cinders: 5 },
        requires: { stamina: 2 },
        addFlags: ['caught-leader', 'stood-with-mara'],
        result: 'You land hard, sweep his legs, and keep Mara’s knife away from his throat.',
      },
      {
        id: 'signal-guard',
        label: 'Signal the hidden guard and close every exit.',
        detail: 'Keep control of the whole field instead of chasing one man.',
        next: 'ending-duty',
        changes: { resolve: 1, cinders: 4 },
        addFlags: ['captured-cell'],
        result: 'Brann’s squads rise from three alleys. The trap closes cleanly.',
      },
      {
        id: 'let-mara-lead',
        label: 'Let Mara choose the moment.',
        detail: 'Give her command and follow without pride.',
        next: 'ending-bond',
        changes: { rapport: 2, cinders: 4 },
        addFlags: ['mara-led', 'caught-leader'],
        result: 'Mara waits one breath longer than you would. It is the breath that wins the fight.',
      },
    ],
  },
  'ending-duty': {
    id: 'ending-duty',
    kicker: 'Chapter complete',
    title: 'The Weight of the Cloak',
    location: 'Southwatch Gatehouse',
    final: true,
    body: (state) => [
      state.flags.includes('shielded-king')
        ? 'The surgeon cuts the bolt from your shield while King Aldren stands beside the table. He refuses to leave until he hears you are not dying.'
        : state.flags.includes('stopped-cart')
          ? 'Your shoulder is badly bruised, but the blast harmed no one. King Aldren visits the gatehouse himself and thanks every guard by name.'
          : 'The prisoners fill two cells. None carries a banner, a prayer token, or a foreign coin. They look like ordinary Greyhaven men.',
      'One wounded attacker asks to speak with you alone. He watches your face as if checking it against a memory.',
      '“You said the king would be unharmed,” he whispers. “You paid us yesterday, Captain Vey.”',
      'That is the whole problem. Someone with your face, voice, seal, and handwriting arranged the attack. By nightfall, the palace will want an answer from you.',
      'Mara waits outside the door with two cups of wine and your apple from this morning. “Whatever this is,” she says, “you do not meet it alone.”',
    ],
    choices: [],
  },
  'ending-truth': {
    id: 'ending-truth',
    kicker: 'Chapter complete',
    title: 'The Man Who Hired Them',
    location: 'Southwatch Gatehouse',
    final: true,
    body: (state) => [
      state.flags.includes('caught-leader')
        ? 'The attack leader sits across from you with both wrists tied. Mara leans against the only door. He glances at her once and decides lying would waste time.'
        : 'The wax-stained attacker wakes with Brann’s coat under his head and your knife on the table between you. He studies you carefully.',
      'You ask who planned the attack. He answers without drama.',
      '“You did. Yesterday, in the back room of the Blue Pike. You knew my name. You knew my daughter’s fever had broken. You sounded like a man trying not to be heard by himself.”',
      'He describes the scar under your chin, the bend in your left little finger, and the old burn on your wrist. Details a stranger should not know.',
      'Mara takes your hand and turns it palm up. Her thumb rests over the burn. “Start with yesterday,” she says. “Then we find the man who borrowed you.”',
    ],
    choices: [],
  },
  'ending-bond': {
    id: 'ending-bond',
    kicker: 'Chapter complete',
    title: 'After the Noise',
    location: 'The Southwatch Roof',
    final: true,
    body: (state) => [
      state.flags.includes('mara-led')
        ? 'Mara’s plan ends with every attacker alive and the king untouched. Marshal Hedd calls it flawless. She bows so deeply that only you see her grin.'
        : 'The last clash fades below. You and Mara sit against a warm chimney while Brann searches the lane. Your hands still shake from the fight.',
      'Mara finds a folded receipt inside the captured leader’s glove. It is from the Blue Pike, paid yesterday for a private room and six meals.',
      'The name at the bottom is Caelan Vey. The mark beside it is the little hooked line you always place beneath your signature.',
      state.flags.includes('promised-evening')
        ? '“You did promise me an evening,” Mara says. She laces her fingers through yours. “We may spend it proving you are not secretly an assassin.”'
        : 'Mara leans her shoulder into yours. “I know where you were yesterday,” she says. “That makes me your witness and your first suspect.”',
      'She kisses your bruised cheek, gentle and brief. Then she opens the receipt again. Curiosity has replaced fear in her eyes.',
    ],
    choices: [],
  },
};

export const nodeOrder = [
  'morning',
  'courtyard',
  'armory',
  'south-gate',
  'sealed-order',
  'route-council',
  'river-route',
  'king-road',
  'decoy-route',
  'ending-duty',
  'ending-truth',
  'ending-bond',
];

export function canChoose(choice: Choice, stats: GameStats) {
  if (!choice.requires) return true;
  return Object.entries(choice.requires).every(
    ([key, value]) => stats[key as StatKey] >= (value ?? 0),
  );
}

export function requirementText(choice: Choice) {
  if (!choice.requires) return '';
  return Object.entries(choice.requires)
    .map(([key, value]) => `${statLabels[key as StatKey]} ${value}`)
    .join(', ');
}
