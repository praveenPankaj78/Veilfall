export type StatKey = 'vitality' | 'resolve' | 'guile' | 'mercy' | 'cinders';

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
  nodeId: 'cell',
  stats: { vitality: 5, resolve: 3, guile: 1, mercy: 1, cinders: 0 },
  flags: [],
  history: [],
};

export const statLabels: Record<StatKey, string> = {
  vitality: 'Vitality',
  resolve: 'Resolve',
  guile: 'Guile',
  mercy: 'Mercy',
  cinders: 'Cinders',
};

export const nodes: Record<string, StoryNode> = {
  cell: {
    id: 'cell',
    kicker: 'Chapter One',
    title: 'The Bell Beneath the Rain',
    location: 'The Low Cells, Greyhaven',
    body: () => [
      'The first bell says the king is dead. The second says the city gates are shut. The third rings beneath your feet.',
      'Rainwater crawls across the floor of your cell. It is black with soot from the city above. By dawn, the Crown Guard will take you to Gallows Square for the murder of a man who is still alive.',
      'Your name is Maelin Vey. Three nights ago you commanded the king\'s shield. Tonight your sword is gone, your left eye is swollen, and someone has scratched four words into the wall beside you.',
      'DO NOT LET IT WAKE.',
      'The underground bell rings again. Dust falls. Your ankle chain pulls tight as something on the other side of the wall whispers your name.',
    ],
    choices: [
      {
        id: 'break-chain',
        label: 'Wrap the chain around your arm and pull.',
        detail: 'Trust the strength that survived the king\'s last battle.',
        next: 'corridor-force',
        changes: { vitality: -1, resolve: 1 },
        addFlags: ['broke-chain'],
        result: 'The iron bites to the bone, but the old wall gives before you do.',
      },
      {
        id: 'trick-gaoler',
        label: 'Call Gaoler Brann to the bars.',
        detail: 'A frightened man can be opened more easily than a lock.',
        next: 'corridor-brann',
        changes: { guile: 1 },
        addFlags: ['brann-lured'],
        result: 'You put panic into your voice and wait for his keys to come close.',
      },
      {
        id: 'answer-wall',
        label: 'Press your palm to the wet stone.',
        detail: 'Listen to the voice that should not know you.',
        next: 'corridor-voice',
        changes: { resolve: -1, cinders: 1 },
        addFlags: ['heard-voice'],
        result: 'The stone is warm. Something remembers the shape of your hand.',
      },
    ],
  },
  'corridor-force': {
    id: 'corridor-force',
    kicker: 'The prison shifts',
    title: 'Iron Gives Way',
    location: 'The Low Cells, Greyhaven',
    body: () => [
      'You brace one boot against the cot and pull until the room turns white. The chain does not break. The stone around its ring tears free instead.',
      'A crack races through the floor. Water bursts upward. Across the corridor, Gaoler Brann drops his lamp and falls beneath a loose gate. He sees the chain in your hands and mistakes it for a weapon.',
      'Behind him, every locked cell begins to sing with the same low note.',
    ],
    choices: [
      {
        id: 'save-brann-force',
        label: 'Lift the gate off Brann.',
        detail: 'He helped condemn you. He also has a daughter in the city.',
        next: 'brann-debt',
        changes: { vitality: -1, mercy: 1 },
        addFlags: ['saved-brann'],
        result: 'The gate scrapes your shoulder raw. Brann crawls free, shocked by the mercy.',
      },
      {
        id: 'take-keys-force',
        label: 'Take his keys and leave him pinned.',
        detail: 'The water is rising. Mercy has weight.',
        next: 'key-passage',
        changes: { guile: 1, mercy: -1 },
        addFlags: ['left-brann'],
        result: 'His fingers close on empty air as you take the ring from his belt.',
      },
    ],
  },
  'corridor-brann': {
    id: 'corridor-brann',
    kicker: 'A lie needs a pulse',
    title: 'The Gaoler Comes Close',
    location: 'The Low Cells, Greyhaven',
    body: () => [
      'You tell Brann that the wall is leaking blood. He curses and brings his lamp close enough to see for himself.',
      'When the buried bell rings, you seize his wrist through the bars. His face meets iron. The key ring drops inside your cell, but so does the lamp.',
      'Fire runs over the oil. Brann staggers back, coat burning. You can open your door now. You cannot pretend you did not see him.',
    ],
    choices: [
      {
        id: 'smother-fire',
        label: 'Use your blanket to smother the flames.',
        detail: 'Save the man before saving yourself.',
        next: 'brann-debt',
        changes: { mercy: 1 },
        addFlags: ['saved-brann', 'brann-knows-lie'],
        result: 'The blanket stinks of singed wool. Brann stares as if kindness is the sharper trick.',
      },
      {
        id: 'leave-fire',
        label: 'Unlock the cell and run.',
        detail: 'The fire will draw guards away from your path.',
        next: 'key-passage',
        changes: { guile: 1, mercy: -1 },
        addFlags: ['left-brann', 'started-fire'],
        result: 'You step over the lamp. Brann\'s shouting follows you into the dark.',
      },
    ],
  },
  'corridor-voice': {
    id: 'corridor-voice',
    kicker: 'A memory that is not yours',
    title: 'The Wall Opens Its Eye',
    location: 'The Low Cells, Greyhaven',
    body: () => [
      'The stone softens under your palm. For one breath you stand somewhere else, beneath a red sky, wearing a crown made from seven bent nails.',
      'A voice speaks from inside your own mouth. “Third hinge. Hold your breath.”',
      'You obey. The cell door swings inward without a key. In the corridor, Gaoler Brann lies beneath a fallen gate while black water climbs his chest. He saw the door open. Fear has made him silent.',
    ],
    choices: [
      {
        id: 'save-brann-voice',
        label: 'Free Brann and demand the truth.',
        detail: 'He recognized what opened your door.',
        next: 'brann-debt',
        changes: { vitality: -1, mercy: 1 },
        addFlags: ['saved-brann', 'brann-saw-mark'],
        result: 'You haul him above the water. He whispers a name the court erased from every map.',
      },
      {
        id: 'follow-whisper',
        label: 'Leave Brann and follow the warm stone.',
        detail: 'Whatever called you is moving deeper.',
        next: 'warm-passage',
        changes: { resolve: 1, cinders: 1, mercy: -1 },
        addFlags: ['left-brann', 'followed-voice'],
        result: 'The wall pulses once beneath your fingertips, like a beast pleased to be obeyed.',
      },
    ],
  },
  'brann-debt': {
    id: 'brann-debt',
    kicker: 'A debt in a drowning place',
    title: 'What the Gaoler Knows',
    location: 'The Turnkey Room',
    body: (state) => [
      'Brann leads you into the turnkey room and bars the door. His beard drips black water onto a ledger filled with the names of people who officially never came here.',
      state.flags.includes('brann-saw-mark')
        ? 'He will not look at your left hand. A red circle has appeared in your palm, crossed by seven fine cracks.'
        : 'He pours spirits over your torn skin, then drinks what remains. His hands shake against the cup.',
      '“The king ordered a prisoner moved below the foundations,” he says. “No name. No face. It wore your voice.”',
      'Brann offers you a sword taken from the evidence room. Your own sword, Thornwake, waits three floors above. The thing below is already calling with it.',
    ],
    choices: [
      {
        id: 'take-short-sword',
        label: 'Take the prison sword and go below.',
        detail: 'A poor blade is better than an empty hand.',
        next: 'flood-stair',
        changes: { vitality: 1 },
        addFlags: ['armed'],
        result: 'The blade is nicked and badly balanced. It still knows how to cut.',
      },
      {
        id: 'demand-ledger',
        label: 'Take the hidden ledger instead.',
        detail: 'Names can wound people a sword cannot reach.',
        next: 'flood-stair',
        changes: { guile: 1 },
        addFlags: ['took-ledger'],
        result: 'You wrap the ledger in oilcloth. One page bears the royal seal and tomorrow\'s date.',
      },
    ],
  },
  'key-passage': {
    id: 'key-passage',
    kicker: 'Every key has a cost',
    title: 'The Door With No Number',
    location: 'The Abandoned Ward',
    body: (state) => [
      'The largest key opens a passage absent from Brann\'s ring map. The air beyond smells of old pennies and winter apples.',
      state.flags.includes('started-fire')
        ? 'Smoke follows at your back. Somewhere behind it, Brann has stopped shouting.'
        : 'Behind you, Brann coughs as the water reaches his mouth. The sound becomes smaller with every step.',
      'Seven portraits line the passage. Each face has been scraped away. On the last frame, wet paint gathers into a picture of you standing here, looking at yourself.',
    ],
    choices: [
      {
        id: 'cut-painting',
        label: 'Cut the living canvas open.',
        detail: 'Strike before the picture can finish moving.',
        next: 'flood-stair',
        changes: { resolve: 1 },
        addFlags: ['cut-portrait'],
        result: 'Black paint spills like blood. A narrow stair waits behind the ruined frame.',
      },
      {
        id: 'study-painting',
        label: 'Let the portrait finish.',
        detail: 'Knowledge is rarely kind, but it is useful.',
        next: 'portrait-warning',
        changes: { cinders: 1 },
        addFlags: ['saw-portrait'],
        result: 'The painted version of you raises one finger to its lips.',
      },
    ],
  },
  'warm-passage': {
    id: 'warm-passage',
    kicker: 'Below the city map',
    title: 'The Red Seam',
    location: 'Inside the Old Foundation',
    body: () => [
      'You follow the warm seam until the prison stones give way to blocks larger than houses. Greyhaven was built over this place, not around it.',
      'A dead Crown Guard lies on the steps. He has your face. His uniform bears medals you never earned, and his right hand grips Thornwake, the sword taken from you at trial.',
      'When you touch the hilt, the corpse opens its eyes. “If you remember me,” it says, “we both become real.”',
    ],
    choices: [
      {
        id: 'take-thornwake',
        label: 'Take Thornwake and deny the corpse.',
        detail: 'Your sword has chosen you before. Make it choose again.',
        next: 'flood-stair',
        changes: { vitality: 1, resolve: -1 },
        addFlags: ['thornwake', 'denied-double'],
        result: 'The corpse smiles as you pull the blade free. “That is what you said last time.”',
      },
      {
        id: 'hear-double',
        label: 'Ask the corpse who killed the king.',
        detail: 'The answer may enter you with the memory.',
        next: 'portrait-warning',
        changes: { resolve: -1, cinders: 2 },
        addFlags: ['remembered-double'],
        result: 'A memory opens behind your eyes. You see your own hand holding the murder blade.',
      },
    ],
  },
  'portrait-warning': {
    id: 'portrait-warning',
    kicker: 'A future leaves a message',
    title: 'Seven Empty Thrones',
    location: 'The Unmade Gallery',
    body: (state) => [
      state.flags.includes('remembered-double')
        ? 'The corpse speaks in pictures. You stand over the king, but the room has no doors and the king has no shadow.'
        : 'The portrait finishes itself. Behind your painted body stand six strangers: a smiling thief, a glass-eyed mage, a pale surgeon, a scarred hunter, a horned undertaker, and a child with a god\'s shadow.',
      'A seventh figure sits on the throne. The paint refuses to show its face.',
      'Words form along the lower frame: ONE OF YOU OPENS THE VEIL. ONE OF YOU WEARS WHAT COMES THROUGH.',
    ],
    choices: [
      {
        id: 'burn-warning',
        label: 'Burn the warning from the world.',
        detail: 'Some futures grow stronger when witnessed.',
        next: 'flood-stair',
        changes: { resolve: 1 },
        addFlags: ['burned-warning'],
        result: 'The painted strangers scream without sound. One of them smiles at you through the flame.',
      },
      {
        id: 'keep-warning',
        label: 'Tear out the painted strangers and keep them.',
        detail: 'You may need to find them before the crown does.',
        next: 'flood-stair',
        changes: { guile: 1 },
        addFlags: ['kept-warning'],
        result: 'The wet strip curls around your wrist. Six heartbeats tap against your skin.',
      },
    ],
  },
  'flood-stair': {
    id: 'flood-stair',
    kicker: 'The buried bell rings',
    title: 'The Stair That Drinks Light',
    location: 'Beneath Greyhaven',
    body: (state) => [
      'The stair coils down through red stone. Each bell stroke kills a torch above you. By the seventh, only the mark in your palm gives light.',
      state.flags.includes('saved-brann')
        ? 'Brann grips your shoulder at the last landing. “The man you were accused of killing,” he whispers. “I saw him enter the palace an hour ago.”'
        : 'A body rolls down the steps and stops at your feet. It is Brann, old and grey, though you left him alive only minutes ago.',
      'At the bottom waits a round door sealed with seven sword points. Thornwake rests in the lowest hollow, though it may also be in your hand.',
    ],
    choices: [
      {
        id: 'open-by-force',
        label: 'Drive a blade into the empty hollow.',
        detail: 'Force the lock before the guards catch you.',
        next: 'threshold',
        changes: { vitality: -1, resolve: 1 },
        requires: { vitality: 3 },
        addFlags: ['forced-seal'],
        result: 'Stone screams against steel. The door turns one seventh of a circle.',
      },
      {
        id: 'open-by-mark',
        label: 'Place your marked palm on the seal.',
        detail: 'Spend one Cinder and let the buried thing recognize you.',
        next: 'threshold',
        changes: { cinders: -1 },
        requires: { cinders: 1 },
        addFlags: ['blood-seal'],
        result: 'The mark drinks the heat from your body. Locks begin opening inside the stone.',
      },
      {
        id: 'search-lock',
        label: 'Read the cuts around the sword points.',
        detail: 'A careful thief might find the lie inside the lock.',
        next: 'threshold',
        changes: { guile: -2, cinders: 1 },
        requires: { guile: 3 },
        addFlags: ['found-eighth-lock'],
        result: 'There are not seven locks. There are eight. The last one was built to keep something outside.',
      },
    ],
  },
  threshold: {
    id: 'threshold',
    kicker: 'No oath survives unchanged',
    title: 'The King in the Chain',
    location: 'The Hollow Vault',
    body: (state) => [
      'The door opens on a vault vast enough to hold a cathedral. A crown of black iron hangs above a pit, held by chains that vanish into the dark.',
      'The dead king kneels beneath it.',
      state.flags.includes('saved-brann')
        ? 'Brann makes the sign soldiers use before a hopeless charge. The king looks at him and remembers his name.'
        : 'He looks older than the body you guarded three nights ago. Fresh blood runs from a wound over his heart.',
      '“Maelin,” he says. “I did not imprison you for killing me. I imprisoned you because you failed.”',
      'A hand as large as a city gate closes around the far edge of the pit. It has too many knuckles. The crown chains begin to snap.',
    ],
    choices: [
      {
        id: 'protect-king',
        label: 'Stand between the king and the pit.',
        detail: 'Your oath was broken. It was never erased.',
        next: 'ending-oath',
        changes: { resolve: 1, mercy: 1, cinders: 3 },
        addFlags: ['renewed-oath'],
        result: 'You raise your weapon. For the first time tonight, the king looks ashamed.',
      },
      {
        id: 'take-crown',
        label: 'Climb the chain and seize the crown.',
        detail: 'Power belongs to whoever reaches it alive.',
        next: 'ending-crown',
        changes: { vitality: -1, guile: 1, cinders: 4 },
        addFlags: ['touched-crown'],
        result: 'The iron crown turns toward you like a flower finding the sun.',
      },
      {
        id: 'cut-chain',
        label: 'Cut the lowest chain.',
        detail: 'The king expects obedience. Give him surprise.',
        next: 'ending-veil',
        changes: { resolve: -1, cinders: 5 },
        addFlags: ['cut-chain'],
        result: 'Your blade falls. The oldest law in the kingdom breaks with one clean note.',
      },
    ],
  },
  'ending-oath': {
    id: 'ending-oath',
    kicker: 'Chapter complete',
    title: 'An Oath With Teeth',
    location: 'The Hollow Vault',
    final: true,
    body: (state) => [
      'The hand rises from the pit. You strike one finger, and the blow shudders through your bones. The thing laughs in seven voices.',
      state.flags.includes('saved-brann')
        ? 'Brann drags the king toward the door while you hold the narrow bridge. He calls you captain. You had forgotten how the word could hurt.'
        : 'The king crawls toward safety. Behind you, the dead gaoler begins to ring the bell with his own severed chain.',
      'A second fighter lands beside you. A slim man in a soaked green coat spins a stolen dagger through his fingers. You know him from the painted warning.',
      '“Rook Sable,” he says. “Thief. Occasional patriot. You are supposed to be dead.”',
      'Across the pit, six more chains snap at once. Something wearing your face opens its eyes below.',
    ],
    choices: [],
  },
  'ending-crown': {
    id: 'ending-crown',
    kicker: 'Chapter complete',
    title: 'The Crown Remembers',
    location: 'Above the Hollow Vault',
    final: true,
    body: () => [
      'The first chain cuts your palm. The second shows you the city from above. Every roof is gone. Every person stands in the rain, staring down at you through stone.',
      'You touch the crown.',
      'Greyhaven vanishes. You sit on a throne at the end of time while seven armies burn beneath a white sun. Six figures kneel before you. One refuses.',
      'He is a thin thief in a green coat. He drives a dagger into your heart and whispers, “This time, stay dead.”',
      'You wake above the pit with the crown mark around your brow. Far overhead, someone in the living city screams your name before you have met him.',
    ],
    choices: [],
  },
  'ending-veil': {
    id: 'ending-veil',
    kicker: 'Chapter complete',
    title: 'The Eighth Prisoner',
    location: 'The Hollow Vault',
    final: true,
    body: (state) => [
      'The chain parts. The crown drops one handspan, and the whole kingdom seems to inhale.',
      state.flags.includes('found-eighth-lock')
        ? 'The hidden eighth lock opens somewhere behind you. It was never part of the vault. It was inside your shadow.'
        : 'A narrow door appears in your shadow. It opens from the other side.',
      'A woman steps through. She has your scars, your voice, and the missing half of your childhood memories. She carries Thornwake across both hands like an offering.',
      '“I am the crime they cut out of you,” she says. “And I have already killed the king seven times.”',
      'The thing in the pit bows to her.',
    ],
    choices: [],
  },
};

export const nodeOrder = [
  'cell',
  'corridor-force',
  'corridor-brann',
  'corridor-voice',
  'brann-debt',
  'key-passage',
  'warm-passage',
  'portrait-warning',
  'flood-stair',
  'threshold',
  'ending-oath',
  'ending-crown',
  'ending-veil',
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
