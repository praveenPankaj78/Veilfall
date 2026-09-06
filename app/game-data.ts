import { adventureChoiceUpdates, adventureNodeUpdates } from './adventure-revision';

export type StatKey =
  | 'health'
  | 'resolve'
  | 'command'
  | 'oathfire'
  | 'medicine'
  | 'wayfire';

export type GameStats = Record<StatKey, number>;

export type RelationshipKey = 'mara' | 'lysara';

export type RelationshipScore = {
  trust: number;
  attraction: number;
};

export type Relationships = Record<RelationshipKey, RelationshipScore>;

export type GameState = {
  nodeId: string;
  chapter: 1 | 2 | 3;
  chapterChoices: number;
  completedChapters: number[];
  stats: GameStats;
  relationships: Relationships;
  contentPreference: {
    intimacy: 'fade' | 'detailed';
    adultConfirmed: boolean;
  };
  flags: string[];
  history: string[];
  defeat: {
    title: string;
    body: string;
    choiceId: string;
  } | null;
};

export type Choice = {
  id: string;
  label: string;
  detail: string;
  next: string | ((state: GameState) => string);
  changes?: Partial<GameStats>;
  addFlags?: string[];
  requires?: Partial<GameStats>;
  requiresRelationships?: Partial<Record<RelationshipKey, Partial<RelationshipScore>>>;
  requiresFlags?: string[];
  result: string;
};

export type StoryNode = {
  id: string;
  kicker: string;
  title: string;
  location: string;
  objective: string;
  threat: 'Low' | 'Uneasy' | 'Rising' | 'Immediate' | 'Critical' | 'Unknown';
  lesson?: {
    title: string;
    body: string;
  };
  introduces?: StatKey[];
  art?: 'departure' | 'folded' | 'inn' | 'harrowfen';
  body: (state: GameState) => string[];
  choices: Choice[];
  final?: boolean;
  nextChapter?: string;
};

export const initialState: GameState = {
  nodeId: 'gate-yard',
  chapter: 1,
  chapterChoices: 0,
  completedChapters: [],
  stats: {
    health: 8,
    resolve: 6,
    command: 3,
    oathfire: 0,
    medicine: 0,
    wayfire: 0,
  },
  relationships: {
    mara: { trust: 2, attraction: 1 },
    lysara: { trust: 0, attraction: 0 },
  },
  contentPreference: {
    intimacy: 'fade',
    adultConfirmed: false,
  },
  flags: [],
  history: [],
  defeat: null,
};

export const statLabels: Record<StatKey, string> = {
  health: 'Health',
  resolve: 'Resolve',
  command: 'Command',
  oathfire: 'Oathfire',
  medicine: 'Medicine',
  wayfire: 'Wayfire',
};

export const relationshipLabels: Record<RelationshipKey, string> = {
  mara: 'Mara',
  lysara: 'Lysara',
};

const relationshipEffects: Record<string, Partial<Relationships>> = {
  'flirt-mara': { mara: { trust: 0, attraction: 1 } },
  'ask-marker': { mara: { trust: 1, attraction: 0 } },
  'admit-unease': { mara: { trust: 1, attraction: 1 } },
  'answer-lysara': { lysara: { trust: 0, attraction: 1 } },
  'trust-mara': { mara: { trust: 1, attraction: 0 } },
  'take-ridge': { mara: { trust: 1, attraction: 0 } },
  'take-tower': { mara: { trust: 1, attraction: 0 } },
  'protect-lysara-secret': { lysara: { trust: 1, attraction: 1 } },
  'tell-brann-seed': { lysara: { trust: -1, attraction: 0 } },
  'ask-mara-future': { mara: { trust: 1, attraction: 1 } },
  'trust-mara-opening': { mara: { trust: 1, attraction: 0 } },
  'save-mara-ridge': { mara: { trust: 2, attraction: 1 } },
  'protect-lysara': { lysara: { trust: 2, attraction: 0 } },
  'take-leader': { mara: { trust: 1, attraction: 0 } },
  'steady-mara': { mara: { trust: 1, attraction: 1 } },
  'test-salt': { lysara: { trust: 1, attraction: 0 } },
  'c2-trust-mara-entry': { mara: { trust: 1, attraction: 0 } },
  'c2-work-beside-mara': { mara: { trust: 1, attraction: 0 } },
  'c2-let-lysara-lead-care': { lysara: { trust: 1, attraction: 0 } },
  'c2-medicine-lysara': { lysara: { trust: 2, attraction: 0 } },
  'c2-ask-missing-mara': { mara: { trust: 1, attraction: 0 } },
  'c2-name-fear': { mara: { trust: 2, attraction: 1 } },
  'c2-kiss-mara': { mara: { trust: 1, attraction: 2 } },
  'c2-take-mara': { mara: { trust: 1, attraction: 0 } },
  'c2-take-lysara': { lysara: { trust: 1, attraction: 0 } },
  'c3-shield-wounded': { mara: { trust: 1, attraction: 0 } },
  'c3-let-mara-search-you': { mara: { trust: 1, attraction: 1 } },
  'c3-focus-archive': { lysara: { trust: 1, attraction: 0 } },
  'c3-focus-wounded': { mara: { trust: 1, attraction: 0 } },
  'c3-ask-lysara-what-she-sees': { lysara: { trust: 1, attraction: 1 } },
  'c3-stand-with-mara': { mara: { trust: 1, attraction: 1 } },
  'c3-stand-with-lysara': { lysara: { trust: 1, attraction: 1 } },
  'c3-name-the-real-plan': {
    mara: { trust: 1, attraction: 0 },
    lysara: { trust: 1, attraction: 0 },
  },
  'c3-send-real-mara': { mara: { trust: 1, attraction: 0 } },
  'c3-prepare-fast-pursuit': { mara: { trust: 1, attraction: 1 } },
  'c3-prepare-safe-pursuit': { lysara: { trust: 1, attraction: 1 } },
};

export function relationshipChanges(choice: Choice) {
  return relationshipEffects[choice.id] ?? {};
}

function routeDestination(state: GameState) {
  if (state.flags.includes('low-route')) return 'low-crisis';
  if (state.flags.includes('ridge-route')) return 'ridge-crisis';
  return 'inspection-crisis';
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => state.flags.includes(flag));
}

const originalNodes: Record<string, StoryNode> = {
  'gate-yard': {
    id: 'gate-yard',
    kicker: 'Chapter One',
    title: 'The Road Before Rain',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Prepare the escort before the eastern gate opens.',
    threat: 'Low',
    lesson: {
      title: 'Your strengths',
      body: 'Health shows how much injury and exhaustion you can survive. Resolve helps you face fear, pain, and doubt. Command shows how ready your guards are to follow difficult orders. Mara and Lysara each have separate Trust and Attraction scores. A choice always shows a known cost before you select it. Reaching zero Health means death.',
    },
    introduces: ['health', 'resolve', 'command'],
    art: 'departure',
    body: () => [
      'Rain has turned Greyhaven’s stone walls almost black by the time you reach Eastwatch. Water pours from the gatehouse drains and gathers around the boots of twenty guards pretending not to be cold.',
      'Your name is Caelan Vey. You are thirty one, captain of the King’s Road Wardens, and responsible for every person leaving with the green treaty wagon. Your task sounds simple when spoken quickly: escort Ambassador Lysara to Bellweather Inn before night rain floods the low road.',
      'Seven years ago, you promised a trapped patrol that you would return before moonrise. You returned late and carried two bodies home. Since then, you choose every promise as carefully as a road above a cliff.',
      'Beyond the raised iron gate, the King’s Road bends through wet hills and disappears under dark storm clouds. A raven watches from the mile stone. It has a narrow strip of red cloth tied around one leg.',
      'Sergeant Brann raises the departure ledger. “Gate opens in half an hour. What do you want checked first?”',
    ],
    choices: [
      {
        id: 'check-people',
        label: 'Walk the line and inspect your people.',
        detail: 'Learn who is tired, frightened, or hiding an injury.',
        next: 'mara-returns',
        changes: { command: 1 },
        addFlags: ['checked-people'],
        result: 'You move one feverish guard to the rear wagon. Joren takes his place, while twelve year old Nilo carries spare bandages to the wagon.',
      },
      {
        id: 'check-horses',
        label: 'Check the horses and harness yourself.',
        detail: 'Use some strength now so a broken harness cannot stop you later.',
        next: 'mara-returns',
        changes: { health: -1, resolve: 1 },
        addFlags: ['checked-horses'],
        result: 'You find a loose front harness strap and the sharp smell of strange oil on the lead mare’s bit.',
      },
      {
        id: 'check-route',
        label: 'Study the route and the weather marks.',
        detail: 'Prepare for a storm arriving earlier than promised.',
        next: 'mara-returns',
        changes: { resolve: 1 },
        addFlags: ['checked-route'],
        result: 'The low road should remain open until dusk, but the eastern clouds are moving against the wind.',
      },
      {
        id: 'check-treaty',
        label: 'Inspect the treaty wagon and its seals.',
        detail: 'Treat the cargo as a possible target before meeting the ambassador.',
        next: 'mara-returns',
        changes: { command: 1 },
        addFlags: ['checked-treaty'],
        result: 'The locks are intact. One wheel, however, carries a fresh scrape beside its iron pin.',
      },
    ],
  },

  'mara-returns': {
    id: 'mara-returns',
    kicker: 'A familiar face',
    title: 'Pear, Rain, and Bad News',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Learn what Mara saw beyond the walls.',
    threat: 'Uneasy',
    art: 'departure',
    body: (state) => [
      state.flags.includes('checked-horses')
        ? 'The lead mare keeps working her tongue against the strange oil. Before you can trace the smell, a grey horse trots through the gate from the eastern road.'
        : 'A grey horse trots through the gate from the eastern road, mist lifting from its flanks.',
      'Mara Renn swings down before the animal stops. Rain has darkened her hair and drawn her green riding coat close across her shoulders. She carries her bow, a stolen pear, and the annoyed look that usually means she has found trouble.',
      'You have known her since both of you were children stealing nails from your father’s forge. She knows your silences well enough to sort anger from fear, which is useful in a scout and dangerous in a friend.',
      '“The ridge is clear,” she says. “The low road has water over the stones already. Also, someone moved the third mile marker during the night. It points back at Greyhaven.” She bites the pear. “Still want the easy duty?”',
    ],
    choices: [
      {
        id: 'flirt-mara',
        label: '“I was promised pleasant company.”',
        detail: 'Let the old attraction show without dismissing her warning.',
        next: 'wheelwright',
        addFlags: ['flirted-mara'],
        result: 'Mara’s gaze travels over your mail and returns to your eyes. “The horse is spoken for.”',
      },
      {
        id: 'ask-marker',
        label: 'Ask exactly how the mile marker was moved.',
        detail: 'Put her field knowledge before your assumptions.',
        next: 'wheelwright',
        changes: { command: 1 },
        addFlags: ['trusted-mara-scouting'],
        result: 'She draws the disturbed stones in rainwater. The marks suggest one person did the work without a cart.',
      },
      {
        id: 'admit-unease',
        label: 'Tell her the road feels wrong this morning.',
        detail: 'Share your instinct instead of hiding behind rank.',
        next: 'wheelwright',
        changes: { resolve: 1 },
        addFlags: ['shared-unease'],
        result: 'Her teasing fades. “Then I will trust the part of you that noticed.”',
      },
    ],
  },

  wheelwright: {
    id: 'wheelwright',
    kicker: 'The work beneath ceremony',
    title: 'Tivik’s Hammer',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Settle a dispute over the treaty wagon.',
    threat: 'Uneasy',
    art: 'departure',
    body: (state) => [
      'A hammer rings beneath the treaty wagon. Tivik Brassthumb, the goblin wheelwright hired by the embassy, crawls out between two guards. He is compact, copper skinned, and furious enough to ignore the men towering over him.',
      '“I balanced this axle last night,” he says. “Someone added two lead chests after I left. Put them on wet ground and the rear pin will snap.”',
      'His twelve year old apprentice, Nilo, kneels beside a box of spare pins. Guard Joren holds the wagon frame above him and says, “Tell me when to lift, little master.” Nilo tries not to smile.',
      state.flags.includes('checked-treaty')
        ? 'You show him the fresh scrape. Tivik touches it once and smells his fingertip. “File mark. Someone tested how much iron remained.”'
        : 'The senior guard calls him nervous. Tivik raises the hammer and asks whether nervous people usually volunteer to stand beneath a loaded wagon.',
      'The gate clock sounds the quarter hour. Delay risks the storm. Leaving as planned risks the wheel failing where the road narrows.',
    ],
    choices: [
      {
        id: 'trust-tivik',
        label: 'Let Tivik rebalance the wagon.',
        detail: 'Lose a little time and trust the person who knows the axle.',
        next: 'envoy-arrives',
        changes: { command: 1 },
        addFlags: ['steady-axle'],
        result: 'Tivik moves the lead and replaces the scored pin. “Now it breaks only if someone truly earns it.”',
      },
      {
        id: 'lighten-wagon',
        label: 'Remove one lead chest and assign it to the guard cart.',
        detail: 'Keep the departure time, but divide what your people must protect.',
        next: 'envoy-arrives',
        changes: { resolve: 1 },
        addFlags: ['split-cargo'],
        result: 'The axle rises. So does the number of targets your formation must cover.',
      },
      {
        id: 'inspect-pin',
        label: 'Lift the rear frame while Tivik checks the pin.',
        detail: 'Spend 1 Health to prove whether the damage was deliberate.',
        next: 'envoy-arrives',
        changes: { health: -1, command: 1 },
        addFlags: ['found-file-mark', 'steady-axle'],
        result: 'Under the wagon’s weight, Tivik finds three deliberate file cuts. Someone wanted the pin to fail after departure.',
      },
    ],
  },

  'envoy-arrives': {
    id: 'envoy-arrives',
    kicker: 'The person in the wagon',
    title: 'Ambassador of Living Silk',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Meet Ambassador Lysara and confirm the mission.',
    threat: 'Uneasy',
    art: 'departure',
    body: (state) => [
      'Ambassador Lysara Quill arrives without any formal announcement. She is taller than you expected, with silver brown hair tied behind her neck and a coat of dark green silk that folds like leaves when she moves. The cloth tightens slightly with her pulse. It comes from Thornweald and is alive enough to dislike the cold.',
      'Her attention settles first on Tivik, then the wheel, then you. “Captain Vey. I was told you keep promises longer than kings keep treaties.”',
      state.flags.includes('found-file-mark')
        ? 'You show her the scored pin. She does not look surprised, which is more worrying than fear.'
        : state.flags.includes('steady-axle')
          ? 'She thanks Tivik in his own language before checking the repaired axle herself.'
          : 'She tests the wagon step with one boot and glances toward the heavy rear wheel.',
      'Inside the wagon rests a chest made from pale living wood. Its contents are meant to end a border quarrel before winter. If the chest fails to reach Bellweather, soldiers on both sides will assume the other kingdom refused peace.',
      'The route register carries the approval of Ordan Vale from the Royal Road Office. He is one of only six officials who knew the escort would leave today, although the final road was supposed to remain your choice.',
    ],
    choices: [
      {
        id: 'promise-duty',
        label: '“I will deliver you and the chest.”',
        detail: 'Offer professional certainty without creating a magical Oath.',
        next: 'sealed-case',
        changes: { resolve: 1 },
        addFlags: ['gave-word-to-lysara'],
        result: 'Lysara studies your face as if weighing the exact size of your promise. Then she nods.',
      },
      {
        id: 'ask-enemies',
        label: 'Ask who benefits if the treaty fails.',
        detail: 'Make the danger specific before offering reassurance.',
        next: 'sealed-case',
        changes: { command: 1 },
        addFlags: ['asked-enemies'],
        result: 'She names three border lords and one royal minister. None should know today’s route.',
      },
      {
        id: 'answer-lysara',
        label: '“Ride with me and judge the stories yourself.”',
        detail: 'Meet her challenge with warmth and confidence.',
        next: 'sealed-case',
        addFlags: ['intrigued-lysara'],
        result: 'One corner of her mouth lifts. Mara sees it and finds the far horizon suddenly interesting.',
      },
    ],
  },

  'sealed-case': {
    id: 'sealed-case',
    kicker: 'The first impossible detail',
    title: 'Your Handwriting',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Decide whether the route order can be trusted.',
    threat: 'Rising',
    art: 'departure',
    body: () => [
      'Brann brings the locked case that holds your orders as the iron gate begins to rise. The black wax around its lock is unbroken. You pressed your own ring into it after midnight.',
      'Inside, the route order says to take the low road. The ink has your narrow letters, your habit of crossing the final word twice, and the small brown stain where you spilled tea last night.',
      'You remember writing ridge road.',
      'Mara reads over your shoulder. Lysara watches both of you. Somewhere above, the raven with red cloth on its leg gives one harsh call and flies east.',
    ],
    choices: [
      {
        id: 'trust-memory',
        label: 'Tell everyone plainly that the order changed.',
        detail: 'Risk your reputation to make the danger visible.',
        next: 'choose-road',
        changes: { resolve: 1, command: 1 },
        addFlags: ['declared-change'],
        result: 'No one laughs. Brann’s hand closes around his sword belt while the gate continues to open.',
      },
      {
        id: 'trust-mara',
        label: 'Give Mara the page and ask what she sees.',
        detail: 'Let her confirm or challenge your memory.',
        next: 'choose-road',
        addFlags: ['mara-read-order'],
        result: 'She finds your ink, your paper, and one grain of pale salt pressed beneath the wax.',
      },
      {
        id: 'test-case',
        label: 'Inspect the case before announcing anything.',
        detail: 'Keep control while looking for an ordinary explanation.',
        next: 'choose-road',
        changes: { command: 1 },
        addFlags: ['tested-case'],
        result: 'The hinges, lock, wax, and leather are untouched. The impossible answer survives every ordinary test.',
      },
    ],
  },

  'choose-road': {
    id: 'choose-road',
    kicker: 'A captain chooses',
    title: 'Three Bad Roads',
    location: 'Outside Eastwatch Gate',
    objective: 'Choose a route before the storm closes both roads.',
    threat: 'Rising',
    art: 'departure',
    body: (state) => [
      state.flags.includes('declared-change')
        ? 'Your guards know the order changed. They also know the treaty dies if fear keeps it behind the walls.'
        : state.flags.includes('mara-read-order')
          ? 'Mara rubs the pale salt between finger and thumb. “Not road salt. Sea salt. Fresh enough to taste.”'
          : 'Every piece of the case says the low road order is real. Only your memory says otherwise.',
      state.flags.includes('checked-route')
        ? 'The weather marks you copied at dawn now matter. The low road will flood first, while lightning will reach the ridge before sunset.'
        : state.flags.includes('tested-case')
          ? 'Your inspection found no broken lock or replaced wax. Whatever changed the page defeated protections you know how to test.'
          : 'You must judge the routes with only Mara’s warning and the sky above you.',
      'The low road is faster, already flooding, and written on the altered page. The ridge is slower, exposed to lightning, and clear when Mara crossed it. A full inspection might uncover sabotage, but the delay could trap the escort outside both safe routes.',
      'Lysara rests one hand on the living wood chest. “My people can survive another winter. The soldiers gathering at our border may not allow them to.”',
      'The gate chains groan behind you. Once the heavy doors close for the storm, Greyhaven will not open them again before morning.',
    ],
    choices: [
      {
        id: 'take-low',
        label: 'Take the low road with shields ready.',
        detail: 'Follow the altered order, but deny the enemy an easy surprise.',
        next: 'low-road',
        changes: { resolve: 1 },
        addFlags: ['low-route'],
        result: 'You place archers beside the wagon and lead the escort down toward the flooded fields.',
      },
      {
        id: 'take-ridge',
        label: 'Trust Mara and take the ridge.',
        detail: 'Choose the route your scout saw, knowing the sky is turning dangerous.',
        next: 'ridge-road',
        addFlags: ['ridge-route'],
        result: 'Mara rides first. The line turns uphill while thunder walks behind the eastern peaks.',
      },
      {
        id: 'delay-inspect',
        label: 'Delay departure and inspect every wagon.',
        detail: 'Spend 1 Command to reduce hidden risk before leaving late.',
        next: 'inspection-yard',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['inspection-route'],
        result: 'You close the gate yard and search under every seat, chest, cloak, and tongue.',
      },
    ],
  },

  'low-road': {
    id: 'low-road',
    kicker: 'Water over stone',
    title: 'The Drowned Mile',
    location: 'The Low King’s Road',
    objective: 'Cross the floodplain before the river reaches the bridge.',
    threat: 'Immediate',
    body: (state) => [
      'The low road passes between flooded barley fields. Brown water curls over the wheel ruts and climbs with every minute. The treaty wagon moves steadily until the third mile marker appears ahead, its carved face pointing back toward Greyhaven.',
      state.flags.includes('steady-axle')
        ? 'Tivik’s new pin holds when the left wheel drops into a hidden rut.'
        : 'The rear wheel strikes the rut. The old pin bends with a sharp metallic screech.',
      'A farmer and two children stand on a stranded hay cart fifty paces from the road. Behind them, the river has broken through the willow bank. Reaching them will cost time you may not have.',
      'Mara looks at the water, then the empty ridge above. “No birds,” she says. “Someone frightened them off before we arrived.”',
    ],
    choices: [
      {
        id: 'rescue-family',
        label: 'Take a rope team to the stranded family.',
        detail: 'Spend 2 Health and arrive later with people who cannot fight.',
        next: 'march-order',
        changes: { health: -2 },
        addFlags: ['saved-family', 'late-arrival'],
        result: 'Cold water reaches your chest, but all three farmers reach the road alive.',
      },
      {
        id: 'push-low',
        label: 'Drive the escort toward the bridge.',
        detail: 'Spend 1 Command to outrun the rising river.',
        next: 'march-order',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['fast-column'],
        result: 'The guards struggle with the pace but obey. The bridge comes into view before the river covers its first stones.',
      },
      {
        id: 'read-flood',
        label: 'Climb the mile marker and study the flood before moving.',
        detail: 'Spend 1 Resolve to avoid the deepest ground and expose yourself above the road.',
        next: 'march-order',
        changes: { resolve: -1, command: 1 },
        addFlags: ['read-water'],
        result: 'From the mile marker, you see a safe curve through the field and a brief red flash on the ridge.',
      },
    ],
  },

  'ridge-road': {
    id: 'ridge-road',
    kicker: 'Nowhere to hide',
    title: 'The Watching Glass',
    location: 'Eastwatch Ridge',
    objective: 'Cross the exposed ridge before lightning reaches it.',
    threat: 'Immediate',
    body: (state) => [
      'The ridge road climbs above the rain. Greyhaven shrinks behind you while the eastern hills spread out below. The treaty wagon crawls beside a drop steep enough to smash it into firewood.',
      state.flags.includes('split-cargo')
        ? 'The divided lead chests keep both wagons lighter, but your guards must watch twice as much road.'
        : 'The heavy rear wheel cuts a deep line close to the ledge.',
      'Sunlight flashes from an abandoned shepherd tower ahead. Once, twice, then three times. Not lightning. A signal mirror.',
      'Mara reaches for her bow. Thunder answers from the western sky, closer than before.',
    ],
    choices: [
      {
        id: 'take-tower',
        label: 'Climb with Mara and take the tower.',
        detail: 'Spend 2 Health to silence the watcher before the storm arrives.',
        next: 'march-order',
        changes: { health: -2 },
        addFlags: ['took-tower'],
        result: 'You find a warm mirror, fresh boot prints, and a view of the escort exposed below.',
      },
      {
        id: 'shield-wagons',
        label: 'Keep the column tight and pass beneath the tower.',
        detail: 'Spend 1 Command to protect the mission instead of chasing a watcher.',
        next: 'march-order',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['tight-column'],
        result: 'Shields rise over the wagon. The unseen watcher lets you pass without revealing a face.',
      },
      {
        id: 'false-signal',
        label: 'Use your polished shield to answer the signal.',
        detail: 'Risk being seen to learn whether someone waits ahead.',
        next: 'march-order',
        changes: { resolve: -1, command: 1 },
        addFlags: ['false-signal'],
        result: 'A second red light answers from the valley beyond the ridge. Two groups are coordinating around you.',
      },
    ],
  },

  'inspection-yard': {
    id: 'inspection-yard',
    kicker: 'Danger at the rear',
    title: 'The Man Beneath the Wagon',
    location: 'Eastwatch Outer Yard',
    objective: 'Find the sabotage and leave before the gate closes.',
    threat: 'Immediate',
    body: (state) => [
      'The last wagon is barely outside when Brann finds a man beneath it. He wears a warden’s rain cape and holds a wedge cut to fit the brake housing. No one in your company knows him.',
      state.flags.includes('found-file-mark')
        ? 'The file in his sleeve carries the same iron dust you found on the treaty wagon.'
        : 'Tivik knocks a file from his sleeve and spits a curse in two languages.',
      'The stranger kicks Brann’s knee, rolls between the wheels, and runs for the closing gate. At the same moment, Mara whistles from the road. Riders are approaching fast from the east.',
      'You have enough time to secure the wagon, catch the saboteur, or put the escort into a fighting formation. Not all three.',
    ],
    choices: [
      {
        id: 'catch-saboteur',
        label: 'Run down the saboteur before he reaches the gate.',
        detail: 'Spend 2 Health and risk the escort forming without you.',
        next: 'march-order',
        changes: { health: -2 },
        addFlags: ['captured-saboteur', 'captured-attacker', 'rough-formation'],
        result: 'You catch him at the gate chain. Behind you, Brann forms the line one squad too slowly.',
      },
      {
        id: 'secure-wagon',
        label: 'Secure every brake and wheel before moving.',
        detail: 'Protect the treaty while the unknown man escapes into Greyhaven.',
        next: 'march-order',
        changes: { command: 1 },
        addFlags: ['steady-axle', 'saboteur-escaped'],
        result: 'Tivik clears the last wedge. The saboteur slips under the falling iron gate and disappears into Greyhaven.',
      },
      {
        id: 'form-road-line',
        label: 'Leave the saboteur to the gate watch and form the escort.',
        detail: 'Spend 1 Command to meet the riders as a unit.',
        next: 'march-order',
        changes: { command: -1, resolve: 1 },
        requires: { command: 1 },
        addFlags: ['ready-for-riders'],
        result: 'Your shields face east before the first rider crosses the far hill.',
      },
    ],
  },

  'march-order': {
    id: 'march-order',
    kicker: 'The road tightens',
    title: 'What You Place in Front',
    location: 'The King’s Road',
    objective: 'Choose what the escort protects as danger closes in.',
    threat: 'Rising',
    lesson: {
      title: 'Caelan’s Oath magic',
      body: 'Caelan is an Oathwarden. When he makes a serious promise aloud and accepts its duty, the promise becomes a magical Oath. Creating one costs Resolve and gives him Oathfire. He can spend Oathfire to protect people or perform an impossible act. The Oath stays active until he fulfils it. Breaking it causes lasting harm.',
    },
    introduces: ['oathfire'],
    body: (state) => [
      state.flags.includes('low-route')
        ? 'The floodplain falls behind, but muddy water follows the road in thin searching streams.'
        : state.flags.includes('ridge-route')
          ? 'The escort leaves the exposed ridge. Rain hides the signal tower, but someone may still be inside it.'
          : 'The riders keep their distance, never close enough for a clear banner and never far enough to forget.',
      'Bellweather Inn lies somewhere beyond the next wooded rise. If the old mile stones are right, you can reach its walls before full dark. If someone has moved those stones too, the road may be longer than your maps admit.',
      'Brann asks where you want the strongest guards. Mara watches the tree line. Lysara sits beside the pale chest with one hand inside her coat, holding something she has not shown you.',
    ],
    choices: [
      {
        id: 'guard-wagon',
        label: 'Ride beside the treaty wagon yourself.',
        detail: 'Spend 1 Health and place your body near the likely target.',
        next: 'road-conversation',
        changes: { health: -1 },
        addFlags: ['guarding-wagon'],
        result: 'You take the narrow space beside the wheel where an arrow must pass through you first.',
      },
      {
        id: 'command-speed',
        label: 'Put Brann at the rear and drive for Bellweather.',
        detail: 'Spend 1 Command to shorten the enemy’s remaining time.',
        next: 'road-conversation',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['forced-march'],
        result: 'The line lengthens its stride. Tired people save minutes now and may owe them later.',
      },
      {
        id: 'send-mara-ahead',
        label: 'Send Mara ahead to find the attackers.',
        detail: 'Trust her alone beyond your protection and gain warning if she returns.',
        next: 'road-conversation',
        changes: { command: 1 },
        addFlags: ['mara-ahead'],
        result: 'Mara touches two fingers to your wrist, then disappears between the wet trees.',
      },
      {
        id: 'swear-safe-arrival',
        label: 'Swear that every living traveller will reach shelter.',
        detail: 'Spend 1 Resolve. Gain 2 Oathfire and accept a binding duty.',
        next: 'road-conversation',
        changes: { resolve: -1, oathfire: 2 },
        requires: { resolve: 4 },
        addFlags: ['oath-safe-arrival'],
        result: 'Heat wakes inside your chest. The magic accepts your promise, and you can suddenly feel every life you must protect.',
      },
    ],
  },

  'road-conversation': {
    id: 'road-conversation',
    kicker: 'One quiet mile',
    title: 'Things Said Before Arrows',
    location: 'Alderwood Rise',
    objective: 'Use the brief calm without forgetting the threat.',
    threat: 'Uneasy',
    body: (state) => [
      state.flags.includes('mara-ahead')
        ? 'With Mara ranging ahead, the space beside you feels wrong. You keep looking toward each break in the trees and finding only rain.'
        : 'Mara rides close enough that your knees touch when the road narrows. Each accidental contact lasts a fraction longer than the road requires.',
      'Lysara leaves the wagon and rides on your other side. Up close, her living coat smells faintly of crushed leaves after lightning. “You have looked at every shadow except the one inside my sleeve,” she says.',
      'She shows you a seed of clear glass. It holds a curl of green light. “Proof that my queen agreed to peace. If the chest is lost, this may still stop a war. If our attackers know I carry it, they will stop aiming at the wagon.”',
      state.flags.includes('oath-safe-arrival')
        ? 'The Oathfire tightens at the thought of hidden attackers. The power feels useful. The duty feels larger.'
        : 'A branch snaps somewhere beyond the ditch. Brann hears it too. His hand never leaves his reins.',
    ],
    choices: [
      {
        id: 'protect-lysara-secret',
        label: 'Keep Lysara’s second proof hidden.',
        detail: 'Protect the person while accepting that she withheld a danger.',
        next: 'ambush-warning',
        addFlags: ['kept-seed-secret'],
        result: 'Lysara closes your fingers around the cool seed, then takes it back before your hands part.',
      },
      {
        id: 'tell-brann-seed',
        label: 'Tell Brann there is a second target.',
        detail: 'Spend trust with Lysara to make your formation honest.',
        next: 'ambush-warning',
        changes: { command: 1 },
        addFlags: ['revealed-seed'],
        result: 'Brann changes the formation without asking questions. Lysara’s face becomes carefully unreadable.',
      },
      {
        id: 'ask-mara-future',
        label: 'Ask Mara what she planned for the evening.',
        detail: 'Requires Mara trust 3. Take one personal moment while the road is briefly quiet.',
        next: 'ambush-warning',
        changes: { resolve: 1 },
        requiresRelationships: { mara: { trust: 3 } },
        addFlags: ['planned-evening'],
        result: '“A bath, a fire, and deciding whether you look better without the cloak,” she says. Then her eyes snap toward the trees.',
      },
      {
        id: 'watch-tree-line',
        label: 'Keep the conversation short and watch the trees.',
        detail: 'Gain tactical readiness at the cost of warmth.',
        next: 'ambush-warning',
        changes: { command: 1 },
        addFlags: ['watched-trees'],
        result: 'You see the first bow limb move before the string is drawn.',
      },
    ],
  },

  'ambush-warning': {
    id: 'ambush-warning',
    kicker: 'The trap closes',
    title: 'The First Black Arrow',
    location: 'The King’s Road',
    objective: 'Survive the opening strike and keep the escort moving.',
    threat: 'Critical',
    body: (state) => [
      state.flags.includes('mara-ahead')
        ? 'Mara’s warning whistle cuts through the rain. One note from ahead, two from the left. Archers and something moving on the road.'
        : state.flags.includes('watched-trees')
          ? 'You see the bow bend. Your warning leaves your mouth before the first black arrow reaches the road.'
          : 'The first black arrow passes through a guard’s shoulder and nails his cloak to the wagon. His scream is the signal for the rest.',
      'More strings snap. Horses rear. Someone ahead overturns a timber cart across the road while shapes rush from the ditch behind you.',
      state.flags.includes('oath-safe-arrival')
        ? 'Oathfire climbs your ribs like a second heartbeat. It can make one impossible action possible. It cannot tell you which action is right.'
        : 'Brann waits for your order while blood runs between his fingers around the trapped guard’s shoulder.',
      'You have one breath before the escort becomes a collection of frightened people instead of a unit.',
    ],
    choices: [
      {
        id: 'guard-opening',
        label: 'Take the exposed side with your shield.',
        detail: 'Spend 2 Health to absorb the first pressure yourself.',
        next: routeDestination,
        changes: { health: -2, resolve: 1 },
        requires: { health: 2 },
        addFlags: ['shielded-opening'],
        result: 'Two arrows strike your shield. The third cuts your thigh, shallow but hot.',
      },
      {
        id: 'command-opening',
        label: 'Turn the escort into two moving walls.',
        detail: 'Spend 2 Command to keep guards, wagon, and horses acting together.',
        next: routeDestination,
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['ordered-walls'],
        result: 'Your voice reaches people before fear does. Shields lock and the wagon keeps rolling.',
      },
      {
        id: 'trust-mara-opening',
        label: 'Follow Mara’s signal without looking for her.',
        detail: 'Requires Mara trust 3. Trust her view of the trap over your own.',
        next: routeDestination,
        requiresRelationships: { mara: { trust: 3 } },
        addFlags: ['trusted-mara-in-fight'],
        result: 'You move right as her arrow crosses left. A hidden attacker falls into the space you refused to occupy.',
      },
      {
        id: 'spend-oathfire-opening',
        label: 'Call on the promise holding every life to you.',
        detail: 'Spend 1 Oathfire to feel where the next mortal blow will land.',
        next: routeDestination,
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['felt-mortal-blow'],
        result: 'For one fierce instant, every endangered heartbeat pulls a bright thread through your chest.',
      },
    ],
  },

  'low-crisis': {
    id: 'low-crisis',
    kicker: 'Flood and iron',
    title: 'The Bridge Gives Way',
    location: 'Willow Bridge, Low Road',
    objective: 'Choose what survives the collapsing bridge.',
    threat: 'Critical',
    body: (state) => [
      'The escort reaches Willow Bridge under arrow fire. Floodwater strikes the supports hard enough to shake mud from the rails. Then a hidden charge breaks the centre span.',
      state.flags.includes('steady-axle')
        ? 'The treaty wagon’s repaired wheel holds at the edge of the gap.'
        : 'The scored rear pin snaps. The wagon turns sideways, trapping young Joren beneath the axle.',
      'Across the broken span, an attacker lowers his bow and runs. A leather dispatch case hangs from his shoulder. Mara has a clear shot, but two children from the rescued farm family are sliding toward the water.',
      'Lysara braces the treaty chest with both hands. “Captain. Choose.”',
    ],
    choices: [
      {
        id: 'save-people-low',
        label: 'Leave the chest and pull people from the water.',
        detail: 'Protect lives while treaty pages and the attacker may escape.',
        next: 'aftermath',
        changes: { health: -1 },
        addFlags: ['saved-wounded', 'treaty-damaged', 'attacker-escaped'],
        result: 'You drag Joren and the children clear while pale treaty pages scatter into brown water.',
      },
      {
        id: 'save-treaty-low',
        label: 'Hold the wagon while Brann saves the trapped guard.',
        detail: 'Spend 2 Health and trust someone else with a life.',
        next: 'aftermath',
        changes: { health: -2, command: 1 },
        requires: { health: 2 },
        addFlags: ['treaty-safe', 'guard-wounded', 'attacker-escaped'],
        result: 'Your boots slide to the bridge edge. Brann frees Joren before your strength gives out.',
      },
      {
        id: 'capture-low',
        label: 'Order Mara to take the runner alive.',
        detail: 'Spend 1 Command. Accept damage behind you for a living answer.',
        next: 'aftermath',
        changes: { command: -1, resolve: -1 },
        requires: { command: 1 },
        addFlags: ['captured-attacker', 'treaty-damaged', 'guard-wounded'],
        result: 'Mara crosses the flooded rail and brings the runner down. Behind you, wood splits and someone cries your name.',
      },
    ],
  },

  'ridge-crisis': {
    id: 'ridge-crisis',
    kicker: 'Stone from the sky',
    title: 'The Falling Ridge',
    location: 'Shepherd’s Cut, Ridge Road',
    objective: 'Choose what survives the rockfall.',
    threat: 'Critical',
    body: (state) => [
      'The attackers do not need to reach you. A horn sounds above, and the ridge begins to move. Cut ropes whip free from wooden support frames. Stones crash toward the road.',
      state.flags.includes('took-tower')
        ? 'Because you cleared the tower, one signal comes late. The first boulder misses the lead riders.'
        : state.flags.includes('false-signal')
          ? 'The valley group moves early, fooled by your answer, but the rockfall still catches the rear wagon.'
          : 'The rockfall strikes both ends of the formation at once.',
      'Mara hangs from a wet root below the ledge with a wounded guard gripping her wrist. The treaty wagon rolls backward toward them. Above, the signaler turns to flee with a dispatch case under one arm.',
      'Your next decision will leave something unguarded.',
    ],
    choices: [
      {
        id: 'save-mara-ridge',
        label: 'Go over the ledge for Mara and the guard.',
        detail: 'Spend 2 Health and let the wagon strike the rocks.',
        next: 'aftermath',
        changes: { health: -2 },
        requires: { health: 2 },
        addFlags: ['saved-wounded', 'saved-mara', 'treaty-damaged', 'attacker-escaped'],
        result: 'You lock one arm around the root and haul both of them up as the wagon breaks behind you.',
      },
      {
        id: 'hold-wagon-ridge',
        label: 'Brace the wagon and order Brann to the ledge.',
        detail: 'Spend 2 Health. Protect the treaty while trusting Brann with Mara.',
        next: 'aftermath',
        changes: { health: -2, command: 1 },
        requires: { health: 2 },
        addFlags: ['treaty-safe', 'saved-wounded', 'mara-hurt'],
        result: 'Your shoulder nearly leaves its socket. Brann reaches Mara, but the root tears her palm open before he does.',
      },
      {
        id: 'pursue-signaler',
        label: 'Send the guards to the wagon and pursue the signaler.',
        detail: 'Spend 1 Resolve to choose answers over direct protection.',
        next: 'aftermath',
        changes: { resolve: -1 },
        addFlags: ['captured-attacker', 'treaty-damaged', 'mara-hurt'],
        result: 'You catch him among the wooden frames. Below, the wagon hits stone and Mara screams once.',
      },
    ],
  },

  'inspection-crisis': {
    id: 'inspection-crisis',
    kicker: 'Steel on both sides',
    title: 'The Riders Without Banners',
    location: 'Eastwatch Orchard Road',
    objective: 'Break the mounted attack before the escort is surrounded.',
    threat: 'Critical',
    body: (state) => [
      'Twelve riders emerge from the rain wearing plain armour with no badges or banners. Four race for the lead horses. The rest split around the orchard walls and close on the treaty wagon.',
      state.flags.includes('ready-for-riders')
        ? 'Your line meets them square. The first rider falls before his sword clears leather.'
        : state.flags.includes('rough-formation')
          ? 'Brann’s hurried line bends. One rider reaches the rear wagon and drives a blade into Joren’s side.'
          : 'The repaired brakes hold when the lead horses panic, saving the wagon from crushing its own guards.',
      'Mara points out a broad rider carrying the twin of your sealed dispatch case. Lysara draws the glass seed from her coat, making herself the brighter target.',
      'The enemy wants the treaty, the seed, and any witness who can say which one they took.',
    ],
    choices: [
      {
        id: 'break-riders',
        label: 'Lead a direct charge through their centre.',
        detail: 'Spend 2 Health and break the ring before it closes.',
        next: 'aftermath',
        changes: { health: -2, resolve: 1 },
        requires: { health: 2 },
        addFlags: ['saved-wounded', 'treaty-safe', 'attacker-escaped'],
        result: 'Your shield takes a sword edge. The riders scatter, leaving blood and three empty saddles.',
      },
      {
        id: 'protect-lysara',
        label: 'Put the strongest guards around Lysara and the seed.',
        detail: 'Spend 1 Command and let the treaty wagon absorb the attack.',
        next: 'aftermath',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['seed-safe', 'treaty-damaged', 'guard-wounded'],
        result: 'Lysara survives inside a wall of shields. Axes open the wagon before the riders retreat.',
      },
      {
        id: 'take-leader',
        label: 'Trust Mara with the escort and take the leader alive.',
        detail: 'Requires Mara trust 4. Risk the mission for the person carrying answers.',
        next: 'aftermath',
        changes: { resolve: -1 },
        requiresRelationships: { mara: { trust: 4 } },
        addFlags: ['captured-attacker', 'treaty-damaged', 'guard-wounded'],
        result: 'Mara takes command without hesitation. You drag the leader from his saddle and keep him breathing.',
      },
      {
        id: 'oath-line',
        label: 'Spend Oathfire to hold the line where it should break.',
        detail: 'Spend 2 Oathfire. Your promise protects lives, not cargo.',
        next: 'aftermath',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['saved-wounded', 'oath-protected-line', 'treaty-damaged', 'attacker-escaped'],
        result: 'Your shield grows hot. For ten heartbeats, no rider can cross the line you named.',
      },
    ],
  },

  aftermath: {
    id: 'aftermath',
    kicker: 'The danger has not left',
    title: 'Counting the Living',
    location: 'The King’s Road After the Ambush',
    objective: 'Keep the wounded alive and prepare for another attack.',
    threat: 'Immediate',
    body: (state) => [
      state.flags.includes('treaty-safe')
        ? 'The pale treaty chest remains sealed beneath torn canvas.'
        : 'The treaty chest is cracked. Rain has reached several pages, turning careful borders into green rivers of ink.',
      state.flags.includes('mara-hurt')
        ? 'Mara binds her bleeding palm with her teeth and one hand. She refuses to sit until every attacker is accounted for.'
        : state.flags.includes('saved-mara')
          ? 'Mara stays close enough that her wet shoulder touches yours while both of you count the living.'
          : 'Mara moves among the guards, checking eyes, hands, and arrow wounds with quick calm touches.',
      state.stats.health <= 2
        ? 'When you straighten, pain closes around your ribs and your vision narrows. Mara catches your arm. “One more fight like that will kill you,” she says. The fear in her voice is quieter than the rain.'
        : 'Your muscles ache, but your breathing settles as the survivors form around the wagons.',
      'Joren is alive. Three guards cannot ride. One horse must be put down. Brann says the attackers who escaped went east, not back toward Greyhaven.',
      'Nilo sits beside the rear wheel, pressing both hands over a cut in his leg. He insists he can walk. Tivik quietly moves him onto the wagon before the boy can prove it.',
      state.flags.includes('oath-safe-arrival')
        ? 'Your promise remains warm inside you. Shelter is no longer the mission written by a court. It is a debt carried in your own blood.'
        : 'The woods have gone quiet again. This time nobody mistakes quiet for safety.',
    ],
    choices: [
      {
        id: 'treat-wounded',
        label: 'Help bind wounds before asking questions.',
        detail: 'Spend 1 Health. Preserve lives while tracks fade in the rain.',
        next: 'evidence',
        changes: { health: -1 },
        addFlags: ['wounded-stable'],
        result: 'You hold Joren still while Lysara closes the wound with sap that smells of pine smoke.',
      },
      {
        id: 'secure-ground',
        label: 'Set shields, watchers, and a retreat order.',
        detail: 'Spend 1 Command. Make the road defensible before investigating it.',
        next: 'evidence',
        changes: { command: -1, resolve: 1 },
        requires: { command: 1 },
        addFlags: ['secure-perimeter'],
        result: 'Brann builds a hard little island of shields, wagons, and people who know where to run.',
      },
      {
        id: 'steady-mara',
        label: 'Check Mara’s wounds and let her check yours.',
        detail: 'Requires Mara trust 3. Recover 1 Resolve while the guards form a defensive ring.',
        next: 'evidence',
        changes: { resolve: 1 },
        requiresRelationships: { mara: { trust: 3 } },
        addFlags: ['mara-tended'],
        result: 'Her fingers are careful at your thigh. “You are allowed to bleed,” she says. “You are not allowed to hide it.”',
      },
    ],
  },

  evidence: {
    id: 'evidence',
    kicker: 'An answer earned',
    title: 'The Order Before the Order',
    location: 'The King’s Road After the Ambush',
    objective: 'Prove how the attackers knew the chosen route.',
    threat: 'Rising',
    body: (state) => [
      state.flags.includes('captured-attacker') || state.flags.includes('captured-saboteur')
        ? 'Your prisoner sits against a wheel with wrists bound. He keeps looking at your face as if comparing it with someone he met before.'
        : 'The living attackers escaped. The dead left weapons, boot marks, and whatever they failed to burn.',
      state.flags.includes('secure-perimeter')
        ? 'The shield ring you ordered keeps the tree line back. Mara can search the saddles without another arrow reaching the wounded.'
        : state.flags.includes('wounded-stable')
          ? 'Because you treated Joren first, he is awake enough to remember that one attacker checked three different route cards.'
          : 'The wounded remain restless while you search, and every sound from the woods pulls a guard away from the evidence.',
      'Mara finds a small wax tube beneath a saddle flap. Lysara finds pale crystals packed into an arrowhead. Brann watches the tree line and reminds you that the escort is wounded, exposed, and still expected at Bellweather.',
      'You cannot learn everything before moving. You need one answer now: whether the ambush reacted to your choice or knew it beforehand.',
    ],
    choices: [
      {
        id: 'question-prisoner',
        label: 'Question the prisoner about his orders.',
        detail: 'Available because you captured someone who saw the plan.',
        next: 'retreat',
        changes: { resolve: -1, command: 1 },
        requiresFlags: ['captured-attacker'],
        addFlags: ['confirmed-advance-orders'],
        result: 'He received all three possible ambush plans before dawn, each bearing your signature.',
      },
      {
        id: 'open-wax-tube',
        label: 'Open the wax tube and compare the route marks.',
        detail: 'Use physical evidence that survives even without a prisoner.',
        next: 'retreat',
        changes: { command: 1 },
        addFlags: ['confirmed-advance-orders'],
        result: 'Inside are three route cards. Every one was sealed before your dispatch case left your room.',
      },
      {
        id: 'test-salt',
        label: 'Ask Lysara to examine the pale crystals.',
        detail: 'Trust unfamiliar knowledge and preserve the wax tube for later.',
        next: 'retreat',
        addFlags: ['found-shard-salt'],
        result: 'She tastes one grain. “Shard Coast sea salt. Wet this morning. That coast is five days by ship.”',
      },
    ],
  },

  retreat: {
    id: 'retreat',
    kicker: 'No safe direction',
    title: 'The Mile Behind You',
    location: 'The King’s Road at Dusk',
    objective: 'Move the wounded before the attackers return.',
    threat: 'Immediate',
    body: (state) => [
      state.flags.includes('confirmed-advance-orders')
        ? 'The proof is plain. The attackers had plans for every route before you chose one. Someone did not predict your decision. Someone prepared around it.'
        : 'The salt gives you a new impossibility, but not yet a hand to blame.',
      'Thunder closes over the road. Brann can make a stretcher for the wounded, but it will slow the wagon. Bellweather should be one mile east. Greyhaven should be several miles west behind locked storm gates.',
      'Mara wipes rain from her mouth. “They went east because they wanted us to turn back.” Lysara looks west. “Or because what waits behind us is worse.”',
      'The next attack could come in minutes. Standing still is the only choice certain to help your enemy.',
    ],
    choices: [
      {
        id: 'turn-west',
        label: 'Turn west toward Greyhaven.',
        detail: 'Seek walls and reinforcements, even if the storm gate is closed.',
        next: 'folded-road',
        changes: { command: -1 },
        addFlags: ['turned-west'],
        result: 'The escort turns. Every wounded step now leads toward the city that should be behind you.',
      },
      {
        id: 'press-bellweather',
        label: 'Press east toward Bellweather Inn.',
        detail: 'Pursue shelter and the original mission while attackers remain ahead.',
        next: 'folded-road',
        changes: { health: -1, resolve: 1 },
        addFlags: ['pressed-east'],
        result: 'You put the strongest walkers around the stretchers and follow the road into hard rain.',
      },
      {
        id: 'climb-scout',
        label: 'Climb the next rise before committing the escort.',
        detail: 'Spend 2 Health to see the danger while everyone waits below.',
        next: 'folded-road',
        changes: { health: -2, command: 1 },
        requires: { health: 2 },
        addFlags: ['scouted-rise'],
        result: 'You climb through thorn and rain until the road opens beneath you like a grey ribbon.',
      },
    ],
  },

  'folded-road': {
    id: 'folded-road',
    kicker: 'The larger danger',
    title: 'The Sea Where Home Should Be',
    location: 'The End of the King’s Road',
    objective: 'Choose how to lead the survivors through an impossible landscape.',
    threat: 'Unknown',
    lesson: {
      title: 'Chapter rewards',
      body: 'Wayfire is the currency earned when you finish chapters and make major choices. It will unlock later chapters and some optional scenes. Gaining Wayfire does not make one story choice morally better than another.',
    },
    introduces: ['wayfire'],
    art: 'folded',
    body: (state) => [
      state.flags.includes('scouted-rise')
        ? 'You see the sea before the others do. For several breaths, the sight makes no sense. Greyhaven cannot be in front of you.'
        : 'The trees end. So does the land.',
      'Dark seawater covers the King’s Road. The pale line painted down the middle of the road continues under the waves, giving you one clear path forward. Far across the water, Greyhaven stands on the opposite shore. You can see every tower in the storm light.',
      state.flags.includes('turned-west')
        ? 'You travelled west toward Greyhaven. The city is now ahead of you across miles of water.'
        : state.flags.includes('pressed-east')
          ? 'You travelled east toward Bellweather. Greyhaven waits ahead as if the whole road has been folded back upon itself.'
          : 'The view proves that neither east nor west means what it meant this morning.',
      hasAny(state, ['guard-wounded', 'mara-hurt'])
        ? 'Behind you, someone groans on a stretcher. Rainwater carries a thin stream of blood around your boots and into the impossible sea.'
        : 'Behind you, exhausted guards turn in a slow circle, searching the tree line for attackers who may no longer need a road to reach them.',
      'Mara comes to your side. Her shoulder rests against yours, warm despite the rain. “Which way is home now?”',
    ],
    choices: [
      {
        id: 'follow-silver-road',
        label: 'Follow the silver road beneath the water.',
        detail: 'Choose movement and seek the unknown shelter ahead. Gain 5 Wayfire.',
        next: 'ending-forward',
        changes: { wayfire: 5 },
        addFlags: ['chose-silver-road'],
        result: 'You order ropes tied between every traveller and step into water that should not exist.',
      },
      {
        id: 'take-high-ground',
        label: 'Move the survivors to high ground and study the fold.',
        detail: 'Spend 1 Health. Gain 1 Command and 5 Wayfire by preparing a defensible route.',
        next: 'ending-height',
        changes: { health: -1, command: 1, wayfire: 5 },
        requires: { health: 1 },
        addFlags: ['chose-high-ground'],
        result: 'You turn away from the impossible shore long enough to find a hill the wounded can defend.',
      },
      {
        id: 'swear-home-oath',
        label: 'Swear that every survivor will see a safe hearth again.',
        detail: 'Spend 2 Resolve. Gain 3 Oathfire, 6 Wayfire, and a binding duty.',
        next: 'ending-oath',
        changes: { resolve: -2, oathfire: 3, wayfire: 6 },
        requires: { resolve: 3 },
        addFlags: ['oath-bring-them-home'],
        result: 'Oath magic burns through your body. For one heartbeat, the road beneath the sea answers your promise.',
      },
    ],
  },

  'ending-forward': {
    id: 'ending-forward',
    kicker: 'Chapter One complete',
    title: 'Into the Wrong Sea',
    location: 'The Folded King’s Road',
    objective: 'Reach Bellweather Inn and learn what bent the road.',
    threat: 'Unknown',
    art: 'folded',
    final: true,
    nextChapter: 'c2-arrival',
    body: (state) => [
      'The water reaches your knees and stops rising. Beneath your boots, the stone road remains shallow enough to walk on. The sea is deep on both sides and shallow only where the King’s Road continues.',
      state.flags.includes('planned-evening')
        ? 'Mara takes the rope behind you. “About that bath,” she says. “I am beginning to lower my standards.”'
        : 'Mara takes the rope behind you and tests the knot at your waist. “If the road tries to steal you, it gets both of us.”',
      'Halfway to the first drowned mile stone, something large turns beneath the dark water. It keeps pace with the wounded.',
      'Ahead, where no island stood a moment ago, one window lights inside Bellweather Inn.',
    ],
    choices: [],
  },

  'ending-height': {
    id: 'ending-height',
    kicker: 'Chapter One complete',
    title: 'A Road Seen From Above',
    location: 'Rainwatch Hill',
    objective: 'Defend the survivors until the folded road can be understood.',
    threat: 'Rising',
    art: 'folded',
    final: true,
    nextChapter: 'c2-arrival',
    body: (state) => [
      'Rainwatch Hill gives you stone at your back and a view of the impossible shore. Brann sets a shield wall. Lysara tends the wounded while Mara counts arrows.',
      'From above, you see that the sea has not replaced the land. It fills a perfect bend in the road, like dark water poured into a crease in parchment.',
      state.flags.includes('found-shard-salt')
        ? 'The same pale salt found on the attackers glitters along the new tide line.'
        : 'Pale salt glitters along the new tide line, fresh as frost.',
      'A lantern moves inside Bellweather Inn on the far side. Then a second lantern answers from the woods behind your hill. You are no longer sure which one belongs to a friend.',
    ],
    choices: [],
  },

  'ending-oath': {
    id: 'ending-oath',
    kicker: 'Chapter One complete',
    title: 'The Promise Hears You',
    location: 'The End of the King’s Road',
    objective: 'Fulfil the Oath and bring every survivor to shelter.',
    threat: 'Critical',
    art: 'folded',
    final: true,
    nextChapter: 'c2-arrival',
    body: (state) => [
      'Your promise leaves your mouth as breath and returns as flame. It settles inside your chest, bright enough that Mara sees red light between the rings of your armour.',
      state.flags.includes('oath-safe-arrival')
        ? 'The earlier Oath folds into the new one. Every life you promised to shelter becomes a separate pull against your heart.'
        : 'One by one, the living travellers become points of warmth at the edge of your awareness.',
      'The silver line beneath the sea brightens. For a moment you feel a great iron shape buried somewhere below the road. Something has dragged it from the place where it belonged.',
      'Across the water, Bellweather Inn lights one window. A figure stands inside it wearing your red cloak.',
    ],
    choices: [],
  },

  'c2-arrival': {
    id: 'c2-arrival',
    kicker: 'Chapter Two',
    title: 'The Inn That Waited',
    location: 'The Folded King’s Road',
    objective: 'Reach Bellweather Inn before something follows you from the water.',
    threat: 'Immediate',
    art: 'inn',
    lesson: {
      title: 'One dose remains',
      body: 'Medicine tracks the strong healing supplies carried by the group. Only one sealed dose survived the road. A later choice will show exactly who can receive it and what the dose can treat.',
    },
    introduces: ['medicine'],
    body: (state) => [
      state.flags.includes('chose-silver-road')
        ? 'The road stays beneath your boots as dark water rises on both sides. Bellweather Inn stands ahead on a small island of mud and grass. Warm light fills its windows.'
        : state.flags.includes('chose-high-ground')
          ? 'The lantern behind Rainwatch Hill led you to a narrow path during the night. It ends at Bellweather Inn, where the same road enters the yard from two opposite directions.'
          : 'Your Oath leads you through the water. Each survivor feels like a warm point inside your chest. Bellweather Inn waits ahead, alone in the rain.',
      'Mara supports Joren while Brann guides the first wagon. Lysara holds the cracked treaty chest against her body. Tivik has found one sealed dose of strong medicine inside the damaged supply box. Everything else is soaked.',
      'Something large moves under the water behind the final horse. You see a ridged back, then a pale eye. It is following the wounded, but it has not attacked yet.',
      'The inn door opens. An older woman raises a lamp and calls your name before anyone has introduced you.',
    ],
    choices: [
      {
        id: 'c2-shield-arrival',
        label: 'Place shields around the wounded and move together.',
        detail: 'Spend 1 Command. Keep the group protected but moving slowly.',
        next: 'c2-threshold',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c2-ordered-entry'],
        result: 'The guards form a tight wall. The creature follows to the edge of the yard, then sinks out of sight.',
      },
      {
        id: 'c2-lead-water',
        label: 'Walk behind the others and face the creature yourself.',
        detail: 'Spend 1 Health. Make yourself the nearest target.',
        next: 'c2-threshold',
        changes: { health: -1, resolve: 1 },
        requires: { health: 1 },
        addFlags: ['c2-faced-creature'],
        result: 'You keep your shield toward the water until the last horse reaches mud. The pale eye watches only you.',
      },
      {
        id: 'c2-trust-mara-entry',
        label: 'Let Mara choose the safest path through the water.',
        detail: 'Requires Mara trust 4. Trust her judgment while you watch the wounded.',
        next: 'c2-threshold',
        requiresRelationships: { mara: { trust: 4 } },
        addFlags: ['c2-mara-led-entry'],
        result: 'Mara finds firm road stones beneath the water. Nobody falls, and the creature never gets close enough to strike.',
      },
      {
        id: 'c2-oath-guided-entry',
        label: 'Use your Oath to feel which survivor is in danger.',
        detail: 'Spend 1 Oathfire. Find the weakest point in the group before the creature does.',
        next: 'c2-threshold',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c2-oath-found-child'],
        result: 'One life burns colder than the rest. A boy hidden in the wagon is losing blood beneath a wool blanket.',
      },
      {
        id: 'c2-guard-rear',
        label: 'Guard the rear while Brann leads everyone to the inn.',
        detail: 'Save your remaining resources but give the creature time to study you.',
        next: 'c2-threshold',
        addFlags: ['c2-creature-studied-caelan'],
        result: 'The creature keeps its distance. Just before it sinks, its pale eye changes until it looks like your own.',
      },
    ],
  },

  'c2-threshold': {
    id: 'c2-threshold',
    kicker: 'Shelter with a locked door',
    title: 'Maelin Bellweather',
    location: 'Bellweather Inn Yard',
    objective: 'Get everyone inside without walking into another trap.',
    threat: 'Immediate',
    art: 'inn',
    body: (state) => [
      'The woman at the door is Maelin Bellweather, the innkeeper. She has grey hair, a steady lamp, and a wood axe within easy reach. “Captain Vey,” she says. “You are late.”',
      'The front room behind her is warm and empty. A fire burns. Bowls of stew wait on three tables, but no steam rises from them. The room smells of wet ash and food left out too long.',
      state.flags.includes('c2-oath-found-child')
        ? 'You pull back a blanket in the wagon. A twelve year old boy stares up at you. A broken arrow has cut deep into his leg. Maelin whispers his name before seeing his face. “Nilo.”'
        : 'A weak cough comes from the wagon. Under a blanket lies a twelve year old boy with a deep cut in his leg. Maelin whispers his name before seeing his face. “Nilo.”',
      'Mara looks through the doorway. “She knows you. She knows him. I would like to know how.”',
    ],
    choices: [
      {
        id: 'c2-search-threshold',
        label: 'Search the entrance before bringing everyone inside.',
        detail: 'Spend 1 Command. Check for hidden attackers and safe exits.',
        next: 'c2-triage',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c2-searched-inn'],
        result: 'The common room is empty. The back door opens onto the same yard as the front door.',
      },
      {
        id: 'c2-carry-first',
        label: 'Carry Nilo straight to the fire.',
        detail: 'Spend 1 Health. Treat the child before demanding answers.',
        next: 'c2-triage',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c2-carried-nilo'],
        result: 'Maelin clears a table before you reach it. She knows exactly where you are going to set him down.',
      },
      {
        id: 'c2-question-name',
        label: 'Ask Maelin how she knows your names.',
        detail: 'Keep everyone in the defended yard until she gives a clear answer.',
        next: 'c2-triage',
        changes: { resolve: 1 },
        addFlags: ['c2-demanded-answer'],
        result: 'Maelin grips the lamp. “You told me yesterday. I have been waiting eleven years for yesterday to happen again.”',
      },
    ],
  },

  'c2-triage': {
    id: 'c2-triage',
    kicker: 'The cost of shelter',
    title: 'Three Beds, One Bottle',
    location: 'Bellweather Inn Common Room',
    objective: 'Stabilise the wounded before the creature or the attackers return.',
    threat: 'Rising',
    art: 'inn',
    body: (state) => [
      'You bring everyone inside. Brann bars both doors. The windows show the same muddy yard from different angles, as if the inn is standing in two places at once.',
      'Lysara begins shaking beside the fire. The glass seed she carried has cracked and sent thin green lines beneath the skin of her hand. Nilo is pale from blood loss. A third patient lies near the pantry, an attacker in plain armour with an arrow through his side.',
      state.flags.includes('captured-attacker')
        ? 'You recognise the attacker as the prisoner taken on the road. Maelin insists he arrived here yesterday, alone and already wounded.'
        : 'You have never seen the attacker before. He carries the same kind of sealed order case used by the people who attacked you.',
      'The medicine can stop the danger to one patient. Clean cloth and ordinary care must be enough for the other two.',
    ],
    choices: [
      {
        id: 'c2-organise-care',
        label: 'Give every helper one patient and one clear task.',
        detail: 'Spend 1 Command. Reduce panic before choosing who gets the medicine.',
        next: 'c2-medicine',
        changes: { command: -1, resolve: 1 },
        requires: { command: 1 },
        addFlags: ['c2-organised-care'],
        result: 'Mara presses cloth to Nilo’s leg. Lysara explains the seed wound. Brann keeps the attacker breathing.',
      },
      {
        id: 'c2-work-beside-mara',
        label: 'Work beside Mara and stop Nilo’s bleeding.',
        detail: 'Spend 1 Health. Gain trust and a clearer view of the child’s injury.',
        next: 'c2-medicine',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c2-compressed-wound'],
        result: 'You hold pressure while Mara ties the bandage. Nilo stays awake, but the bleeding does not fully stop.',
      },
      {
        id: 'c2-let-lysara-lead-care',
        label: 'Let Lysara direct the treatment despite her pain.',
        detail: 'Trust her medical knowledge and save your strength.',
        next: 'c2-medicine',
        addFlags: ['c2-lysara-led-care'],
        result: 'Lysara gives calm instructions while green light spreads across her wrist. She understands every wound except her own.',
      },
    ],
  },

  'c2-medicine': {
    id: 'c2-medicine',
    kicker: 'A choice nobody can share',
    title: 'The Last Clear Dose',
    location: 'Bellweather Inn Common Room',
    objective: 'Choose who receives the only strong medicine.',
    threat: 'Critical',
    art: 'inn',
    body: () => [
      'Tivik sets the small blue bottle in your palm. There is enough for one person. Splitting it would make every dose too weak.',
      'Lysara may lose the hand touching the glass seed. Nilo may bleed to death before morning. The attacker may be the only person who knows who changed your orders and how the road was broken.',
      'Mara meets your eyes. “I will help whoever you choose. Just do not pretend this is not a choice.”',
    ],
    choices: [
      {
        id: 'c2-medicine-lysara',
        label: 'Give the medicine to Lysara.',
        detail: 'Spend 1 Medicine. Save her hand and protect the second proof of peace.',
        next: 'c2-eleven-years',
        changes: { medicine: -1 },
        requires: { medicine: 1 },
        addFlags: ['c2-saved-lysara'],
        result: 'The green lines withdraw from Lysara’s arm. She closes her fingers around yours and says, “I know what this cost.”',
      },
      {
        id: 'c2-medicine-nilo',
        label: 'Give the medicine to Nilo.',
        detail: 'Spend 1 Medicine. Stop the child’s bleeding before it is too late.',
        next: 'c2-eleven-years',
        changes: { medicine: -1, resolve: 1 },
        requires: { medicine: 1 },
        addFlags: ['c2-saved-nilo'],
        result: 'Warmth returns to Nilo’s face. Maelin sits beside him and presses both hands over her mouth.',
      },
      {
        id: 'c2-medicine-attacker',
        label: 'Give the medicine to the attacker.',
        detail: 'Spend 1 Medicine. Keep a dangerous witness alive long enough to answer questions.',
        next: 'c2-eleven-years',
        changes: { medicine: -1, command: 1 },
        requires: { medicine: 1 },
        addFlags: ['c2-saved-attacker'],
        result: 'The attacker’s breathing steadies. Brann looks angry, but he tightens the prisoner’s bandage exactly as you ordered.',
      },
    ],
  },

  'c2-eleven-years': {
    id: 'c2-eleven-years',
    kicker: 'The first answer',
    title: 'Yesterday Lasted Eleven Years',
    location: 'Bellweather Inn Common Room',
    objective: 'Learn what Maelin remembers without losing control of the inn.',
    threat: 'Uneasy',
    art: 'inn',
    body: (state) => [
      state.flags.includes('c2-saved-nilo')
        ? 'Maelin waits until Nilo’s breathing becomes steady. Then she places an old guest book beside the lamp.'
        : 'Maelin keeps looking toward the patients as she places an old guest book beside the lamp.',
      '“You all came yesterday,” she says. “You ate this stew. The boy asked for honey. At midnight, the bell rang and the road carried you away. I woke alone.”',
      'She opens the book. Eleven years of dates fill the pages after your names. Each page is written in the same careful hand. Every evening, Maelin prepared the rooms and waited for you to return.',
      'You remember leaving Greyhaven this morning. Mara remembers the same. Maelin is not claiming that you forgot eleven years. She says the inn lived those years without you.',
      'The simplest way to understand it is this: you and the inn followed different roads after midnight. Your road lasted one day. The inn’s road lasted eleven years. The broken magic has pushed those roads together again at this door.',
    ],
    choices: [
      {
        id: 'c2-believe-maelin',
        label: 'Tell Maelin you believe what happened to her.',
        detail: 'Build trust without claiming you understand the cause.',
        next: 'c2-investigate',
        addFlags: ['c2-believed-maelin', 'c2-trusted-maelin'],
        result: 'Her shoulders lower. “Good. I am tired of proving I was lonely.”',
      },
      {
        id: 'c2-compare-memories',
        label: 'Ask everyone to describe the last time they saw this inn.',
        detail: 'Spend 1 Command. Separate shared facts from fear and guesses.',
        next: 'c2-investigate',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c2-compared-memories'],
        result: 'The escort remembers passing an empty field. Maelin remembers waving from the door. Both memories include the same lightning strike.',
      },
      {
        id: 'c2-test-book',
        label: 'Check the guest book, ink, and paper for a trick.',
        detail: 'Look for ordinary proof before accepting an impossible answer.',
        next: 'c2-investigate',
        changes: { resolve: 1 },
        addFlags: ['c2-tested-ledger'],
        result: 'The ink ages from fresh black to faded brown across eleven years. The book is real.',
      },
    ],
  },

  'c2-investigate': {
    id: 'c2-investigate',
    kicker: 'One inn, three clues',
    title: 'Where the Lost Years Went',
    location: 'Bellweather Inn',
    objective: 'Find what is holding the inn inside the broken road.',
    threat: 'Rising',
    art: 'inn',
    body: (state) => [
      'Rain strikes every window at a different speed. The bell above the front door moves even though there is no wind inside.',
      state.flags.includes('c2-searched-inn')
        ? 'Your earlier search found that both outside doors open onto the same yard. The wrong shape begins under the building.'
        : 'Tivik walks the inner walls and returns to his starting point too soon. The common room is smaller inside than the outside walls allow.',
      'Maelin offers three places to begin. Her guest book records each return. The cellar shakes whenever the road changes. The wounded attacker carries orders protected by Crown wax.',
      'You have time to investigate one before someone must take the first night watch.',
    ],
    choices: [
      {
        id: 'c2-ledger-route',
        label: 'Read the guest book with Maelin.',
        detail: 'Follow eleven years of repeated arrivals and departures.',
        next: 'c2-ledger',
        changes: { resolve: -1 },
        addFlags: ['c2-ledger-route'],
        result: 'Maelin turns to the first page bearing your name. A line beneath it has been cut out with a knife.',
      },
      {
        id: 'c2-cellar-route',
        label: 'Inspect the shaking cellar with Tivik.',
        detail: 'Spend 1 Health. Search the most dangerous part of the building first.',
        next: 'c2-cellar',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c2-cellar-route'],
        result: 'The cellar steps tilt while you descend, then settle pointing in a different direction.',
      },
      {
        id: 'c2-attacker-route',
        label: 'Question the attacker about the Crown orders.',
        detail: 'Seek the person responsible before studying the magic.',
        next: 'c2-attacker',
        changes: { command: 1 },
        addFlags: ['c2-attacker-route'],
        result: 'The attacker opens his eyes when you place the sealed order case beside his face.',
      },
    ],
  },

  'c2-ledger': {
    id: 'c2-ledger',
    kicker: 'Ink remembers',
    title: 'Fifteen Arrivals',
    location: 'Bellweather Inn Taproom',
    objective: 'Find the pattern inside Maelin’s record.',
    threat: 'Rising',
    art: 'inn',
    body: () => [
      'The book records fifteen versions of your arrival. In some, Mara is missing. In others, the treaty wagon burns in the yard. One entry says you arrived alone and refused to remove your red cloak.',
      'Every visit ends at midnight. The front bell rings. The guests run toward the cellar. Then Maelin wakes the next morning with the rooms empty and another year beginning.',
      'These are not fifteen groups hiding somewhere in the inn. They are fifteen possible journeys touching the same room. Each journey left a memory in the book even though only one can remain when the road is repaired.',
      'The cut line on the first page is still readable where the pen pressed into the paper beneath it: They pulled the road pin too early.',
    ],
    choices: [
      {
        id: 'c2-copy-pattern',
        label: 'Copy the repeated times and cellar details.',
        detail: 'Preserve a clear record before the book changes again.',
        next: 'c2-night-watch',
        changes: { command: 1 },
        addFlags: ['c2-knows-midnight-pattern', 'c2-found-road-pin-term'],
        result: 'You mark midnight, the cellar, and the words road pin. The useful pattern fits on one page.',
      },
      {
        id: 'c2-ask-missing-mara',
        label: 'Ask Maelin what happened when Mara was missing.',
        detail: 'Risk a painful answer to learn what the changing road can alter.',
        next: 'c2-night-watch',
        changes: { resolve: -1 },
        addFlags: ['c2-heard-mara-version', 'c2-found-road-pin-term'],
        result: '“You searched for her until the bell rang,” Maelin says. “Then the road returned you without her.”',
      },
      {
        id: 'c2-study-cloak-version',
        label: 'Study the entry about the man wearing your cloak.',
        detail: 'Follow the clue that resembles the figure seen across the water.',
        next: 'c2-night-watch',
        changes: { resolve: 1 },
        addFlags: ['c2-cloak-double', 'c2-found-road-pin-term'],
        result: 'The man knew your name but had a deep burn across his face. Maelin never saw him remove the cloak.',
      },
    ],
  },

  'c2-cellar': {
    id: 'c2-cellar',
    kicker: 'Stone beneath timber',
    title: 'The Road Under the Floor',
    location: 'Bellweather Inn Cellar',
    objective: 'Learn why the cellar moves when the road changes.',
    threat: 'Immediate',
    art: 'inn',
    body: () => [
      'The cellar floor is not packed earth. It is the King’s Road, complete with pale stones marking its middle. The inn was built over it long ago.',
      'Tivik kneels beside a crack. Cold silver light shines below. Each time thunder sounds, the stones slide a finger’s width east or west. Shelves move with them, but the outer walls stay still.',
      'The stones are not sliding through the room like loose tiles. One moment a stone belongs near the front door. The next moment the broken road makes that same spot belong near the back door. The cellar stays still while the distance inside it changes.',
      'A long iron spike sits in a locked bracket on the wall. Its label reads: Road pin key. The key itself is gone.',
      'Footsteps cross the ceiling above you. Everyone else is in the common room.',
    ],
    choices: [
      {
        id: 'c2-mark-moving-stone',
        label: 'Mark one road stone and watch where it moves.',
        detail: 'Use a clear physical test before touching the iron bracket.',
        next: 'c2-night-watch',
        changes: { command: 1 },
        addFlags: ['c2-tracked-stone', 'c2-found-road-pin-term'],
        result: 'The marked stone moves toward the front door, then appears beside the back door without crossing the room.',
      },
      {
        id: 'c2-break-bracket',
        label: 'Pull the iron spike from its bracket.',
        detail: 'Spend 1 Health. Take a possible tool before the unseen footsteps reach the stairs.',
        next: 'c2-night-watch',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c2-has-pin-key', 'c2-found-road-pin-term'],
        result: 'The bracket breaks. The spike is heavy, warm, and shaped to fit something much larger.',
      },
      {
        id: 'c2-follow-footsteps',
        label: 'Follow the footsteps from below.',
        detail: 'Risk the moving cellar to learn who is walking in the empty rooms.',
        next: 'c2-night-watch',
        changes: { resolve: -1 },
        addFlags: ['c2-tracked-double', 'c2-found-road-pin-term'],
        result: 'The footsteps stop over your head. A man with your voice says, “Not this door. Not yet.”',
      },
    ],
  },

  'c2-attacker': {
    id: 'c2-attacker',
    kicker: 'The hired blade speaks',
    title: 'Orders Without a Name',
    location: 'Bellweather Inn Pantry',
    objective: 'Learn what the attacker was ordered to do at the inn.',
    threat: 'Rising',
    art: 'inn',
    body: (state) => [
      state.flags.includes('c2-saved-attacker')
        ? 'The medicine has cleared the attacker’s eyes. He gives his name as Sable Orr and asks whether the road has reached the sea yet.'
        : 'The attacker struggles to breathe. He gives his name as Sable Orr, but blood darkens the bandage around his side.',
      'Sable says his group was hired to force the escort into Bellweather Inn. They were told not to enter after midnight and not to touch the iron beneath the road.',
      'His order carries a Crown seal but no royal name. The final line reads: When the bell rings, remove the road pin and leave the witnesses inside.',
      'Before you can ask who wrote it, the bell above the front door rings once.',
    ],
    choices: [
      {
        id: 'c2-demand-employer',
        label: 'Demand the name of the person who hired him.',
        detail: 'Spend 1 Resolve. Push for a direct answer before his condition changes.',
        next: 'c2-night-watch',
        changes: { resolve: -1, command: 1 },
        addFlags: ['c2-crown-voice', 'c2-found-road-pin-term'],
        result: 'Sable never saw a face. He heard a calm man speaking from behind a royal screen in Greyhaven Palace.',
      },
      {
        id: 'c2-offer-protection',
        label: 'Offer Sable protection if he testifies.',
        detail: 'Make a normal promise, not a magical Oath. His answer will depend on whether he trusts you.',
        next: 'c2-night-watch',
        addFlags: ['c2-offered-sable-safety', 'c2-found-road-pin-term'],
        result: 'Sable studies you, then gives one warning. “The Crown has people inside your Wardens.”',
      },
      {
        id: 'c2-take-orders',
        label: 'Take the orders and let him rest.',
        detail: 'Preserve physical evidence instead of risking his life for another answer.',
        next: 'c2-night-watch',
        changes: { resolve: 1 },
        addFlags: ['c2-kept-crown-orders', 'c2-found-road-pin-term'],
        result: 'You place the sealed orders inside your armour. Sable closes his eyes but keeps breathing.',
      },
    ],
  },

  'c2-night-watch': {
    id: 'c2-night-watch',
    kicker: 'A quiet hour borrowed',
    title: 'What the Road Can Take',
    location: 'Bellweather Inn Upper Landing',
    objective: 'Share the watch with Mara while the others rest.',
    threat: 'Uneasy',
    art: 'inn',
    body: (state) => [
      'Mara sits beside an upper window with her bow across her knees. Outside, one road leads east under heavy rain. The next time lightning flashes, the same road leads west toward Greyhaven.',
      state.flags.includes('c2-heard-mara-version')
        ? 'You tell her about the version in Maelin’s book where Mara never reached the inn. Her usual smile does not return.'
        : 'You tell her enough about the night’s clues to make the danger clear. She listens without looking away from the yard.',
      '“I can face an arrow,” she says. “I hate this. A road can take a person, and the rest of us may remember a world where they were never beside us.”',
      'She turns toward you. Damp hair has come loose around her face, and the open neck of her riding coat shows the warm line of skin above her collarbone. Her strength is usually in motion. Sitting this close makes you notice the quieter things: the curve of her mouth when she is worried, the steady rise of her breath, and the scar near her thumb resting on the floor between you.',
      'Her hand is close enough to touch. She waits for an honest answer, not an order.',
    ],
    choices: [
      {
        id: 'c2-name-fear',
        label: 'Tell Mara you are afraid of failing everyone at once.',
        detail: 'Speak honestly and recover 1 Resolve through trust.',
        next: 'c2-bell',
        changes: { resolve: 1 },
        addFlags: ['c2-shared-fear'],
        result: 'Mara takes your hand. “Then stop carrying us as one weight. We are people. Let us carry you back.”',
      },
      {
        id: 'c2-kiss-mara',
        label: 'Touch her hand and ask if you may kiss her.',
        detail: 'Requires Mara trust 4 and attraction 3. Let desire become a clear choice for both of you.',
        next: 'c2-bell',
        changes: { resolve: 1 },
        requiresRelationships: { mara: { trust: 4, attraction: 3 } },
        addFlags: ['c2-kissed-mara'],
        result: 'Mara says yes and closes the last space herself. Her fingers settle against your jaw. Her mouth is warm, slow at first, then certain enough to make the cold landing disappear. The road changes outside, and she parts from you with her breath still touching your lips.',
      },
      {
        id: 'c2-promise-as-captain',
        label: 'Promise that you will not let the road separate the group.',
        detail: 'Offer steady leadership without creating a magical Oath.',
        next: 'c2-bell',
        changes: { command: 1 },
        addFlags: ['c2-captain-promise'],
        result: 'Mara nods, but leaves her hand where it is. “I asked what you fear, not what you plan to do.”',
      },
    ],
  },

  'c2-bell': {
    id: 'c2-bell',
    kicker: 'Midnight arrives',
    title: 'The Bell Rings Twice',
    location: 'Bellweather Inn',
    objective: 'Keep the inn from scattering the group across different roads.',
    threat: 'Critical',
    art: 'inn',
    body: (state) => [
      'The front bell rings. A second bell answers from the cellar. Every flame in the inn bends toward the floor.',
      state.flags.includes('c2-knows-midnight-pattern')
        ? 'You expected midnight, but knowing the time does not stop the walls from moving.'
        : 'The common room stretches. The wounded slide away from one another as the floor grows into a long road.',
      'Nothing is moving faster than your eyes can follow. The space between each person is simply becoming longer. A friend who stood two steps away is now twenty steps away, even though neither of you moved.',
      'The front door opens by itself. Outside stands another Bellweather Inn. Through its windows, you see another Caelan ordering another group of guards.',
      'Maelin shouts from the stairs. “The cellar first. That is where you always lose each other.”',
    ],
    choices: [
      {
        id: 'c2-anchor-people',
        label: 'Tie the wounded and guards together with wagon rope.',
        detail: 'Spend 1 Command. Keep everyone connected while the room changes.',
        next: 'c2-common-room-crisis',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c2-rope-line'],
        result: 'The floor stretches, but the rope keeps every person linked to the next.',
      },
      {
        id: 'c2-hold-door',
        label: 'Brace the front door before the other group enters.',
        detail: 'Spend 2 Health. Stop the two versions of the inn from meeting.',
        next: 'c2-common-room-crisis',
        changes: { health: -2 },
        requires: { health: 2 },
        addFlags: ['c2-held-door'],
        result: 'The door pushes back with your own strength. Through the gap, your other face looks directly at you.',
      },
      {
        id: 'c2-oath-anchor',
        label: 'Use your Oath to hold every promised life in this room.',
        detail: 'Spend 2 Oathfire. The Oath protects people, but not the building.',
        next: 'c2-common-room-crisis',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c2-oath-anchored'],
        result: 'Warm points of life fill your awareness. Walls move through darkness, but nobody disappears.',
      },
      {
        id: 'c2-follow-maelin',
        label: 'Trust Maelin and move everyone toward the cellar.',
        detail: 'Follow the one person who has survived this night before.',
        next: 'c2-common-room-crisis',
        addFlags: ['c2-trusted-maelin'],
        result: 'Maelin opens a door that was a cupboard one moment earlier. Stone steps wait behind it.',
      },
    ],
  },

  'c2-common-room-crisis': {
    id: 'c2-common-room-crisis',
    kicker: 'The inn opens',
    title: 'Guests From Other Nights',
    location: 'Bellweather Inn Common Room',
    objective: 'Protect the wounded while clearing a path to the cellar.',
    threat: 'Critical',
    art: 'inn',
    body: (state) => [
      state.flags.includes('c2-rope-line')
        ? 'The rope pulls tight as three doors open onto three different nights. The people tied together remain in the same room.'
        : state.flags.includes('c2-held-door')
          ? 'The front door cracks but holds. The second inn begins pushing through the walls instead.'
          : 'The walls pass through a moment of darkness. When the fire returns, the room is crowded.',
      'Other versions of the escort stand between you and the cellar. One has no Mara. One carries an unbroken treaty chest. One follows the burned man wearing your red cloak.',
      'They are as frightened as your people. Then the burned Caelan points at Maelin and says, “She keeps the road trapped. Take the key from her.”',
      'Your wounded cannot survive a fight against people who share your training and your face.',
    ],
    choices: [
      {
        id: 'c2-order-no-fight',
        label: 'Order every Warden to lower weapons.',
        detail: 'Spend 2 Command. Use the same commands all versions were trained to obey.',
        next: 'c2-descend',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c2-no-fight'],
        result: 'Your voice and the burned man’s voice collide. Enough guards hesitate for Mara to clear the cellar door.',
      },
      {
        id: 'c2-show-orders',
        label: 'Show the Crown orders and name the real enemy.',
        detail: 'Available if you preserved the attacker’s written orders.',
        next: 'c2-descend',
        changes: { resolve: 1 },
        requiresFlags: ['c2-kept-crown-orders'],
        addFlags: ['c2-united-versions'],
        result: 'The nearest guards recognise the Crown wax. They turn their weapons away from Maelin and toward the burned man.',
      },
      {
        id: 'c2-protect-current-group',
        label: 'Form a shield line and move your own group downstairs.',
        detail: 'Spend 1 Health. Avoid the other versions instead of defeating them.',
        next: 'c2-descend',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c2-shielded-descent'],
        result: 'Shields strike shields, but nobody swings a blade. Your group reaches the stairs together.',
      },
      {
        id: 'c2-give-maelin-key',
        label: 'Ask Maelin to open the hidden cellar path.',
        detail: 'Available because you trusted or believed her before the crisis.',
        next: 'c2-descend',
        requiresFlags: ['c2-trusted-maelin'],
        addFlags: ['c2-maelin-secret-path'],
        result: 'Maelin turns her lamp hook inside a wall crack. A narrow stair opens behind the fireplace.',
      },
      {
        id: 'c2-block-versions',
        label: 'Tip the heavy tables over and divide the room.',
        detail: 'Create a path without spending a resource, but leave supplies behind.',
        next: 'c2-descend',
        addFlags: ['c2-left-supplies'],
        result: 'The tables slow the other group. Your people reach the cellar, but food and blankets remain on the wrong side.',
      },
    ],
  },

  'c2-descend': {
    id: 'c2-descend',
    kicker: 'Below the waiting room',
    title: 'Who Goes Under the Road',
    location: 'Bellweather Inn Cellar Stairs',
    objective: 'Choose who will help you find the cause while Brann guards the wounded.',
    threat: 'Immediate',
    art: 'inn',
    body: (state) => [
      'Brann can hold the stair for a few minutes. Tivik must come because the iron mechanism below is built like a machine. You can take one more person without leaving the wounded unprotected.',
      state.flags.includes('c2-saved-lysara')
        ? 'Lysara can use both hands again. She says the green light under the floor feels like the living magic inside her glass seed.'
        : 'Lysara’s injured hand is wrapped against her chest, but she still offers to study the magic.',
      state.flags.includes('c2-saved-nilo')
        ? 'Nilo is awake enough to tell Maelin that he remembers the cellar from a dream he had last night.'
        : 'Mara checks Nilo’s weak pulse, then stands and reaches for her bow.',
      'The bell rings again. Dust falls from the ceiling. Time is running out.',
    ],
    choices: [
      {
        id: 'c2-take-mara',
        label: 'Take Mara and leave Lysara with the wounded.',
        detail: 'Bring the scout who notices movement and hidden paths.',
        next: 'c2-folded-cellar',
        addFlags: ['c2-mara-below'],
        result: 'Mara lights an arrow from the fire and follows you into the moving dark.',
      },
      {
        id: 'c2-take-lysara',
        label: 'Take Lysara and leave Mara in command upstairs.',
        detail: 'Bring the ambassador who understands living magic.',
        next: 'c2-folded-cellar',
        changes: { command: 1 },
        addFlags: ['c2-lysara-below'],
        result: 'Lysara ties back her injured hand and follows. Mara takes your place at the stair without complaint.',
      },
      {
        id: 'c2-take-maelin',
        label: 'Take Maelin through the place she has feared for eleven years.',
        detail: 'Bring the person who remembers every version of the inn.',
        next: 'c2-folded-cellar',
        changes: { resolve: 1 },
        addFlags: ['c2-maelin-below'],
        result: 'Maelin grips her axe and lamp. “About time,” she says, and leads the way down.',
      },
    ],
  },

  'c2-folded-cellar': {
    id: 'c2-folded-cellar',
    kicker: 'Distance breaks below',
    title: 'The Cellar With No End',
    location: 'Beneath Bellweather Inn',
    objective: 'Cross the folded cellar without losing the stair behind you.',
    threat: 'Immediate',
    art: 'inn',
    body: (state) => [
      'The steps end on the King’s Road. It runs through the cellar and continues into darkness in both directions. Shelves repeat beside it, each holding the same cracked jar and dead mouse.',
      state.flags.includes('c2-mara-below')
        ? 'Mara fires a burning arrow ahead. A moment later it passes behind you, still moving in the same direction.'
        : state.flags.includes('c2-lysara-below')
          ? 'Lysara’s glass seed turns green near one section of wall and dark near another. The brighter path is the one that leads away from the inn.'
          : 'Maelin counts doors under her breath. At the ninth door, she stops. “This is where the road took you every time.”',
      state.flags.includes('c2-mara-below')
        ? 'Mara’s arrow did not turn around. The cellar has bent the route into a loop. Going forward long enough brings the arrow back to the place it started, like walking around a ring.'
        : state.flags.includes('c2-lysara-below')
          ? 'The brighter path is not automatically the way back. It shows where the road is stretching. The dark path stays close to the inn and is safer for returning.'
          : 'The repeated doors are the same door reached through different lengths of road. Maelin counts them so you can tell when the route begins to repeat.',
      'Tivik points to a silver crack crossing the road. “The stones are not moving,” he says. “The distance between them is changing.”',
      'Behind you, the stair begins to fade. You need a way to mark one true path.',
    ],
    choices: [
      {
        id: 'c2-use-rope-path',
        label: 'Tie your rope to the stair and follow its pull.',
        detail: 'Use a physical connection to keep one route real.',
        next: 'c2-road-pin',
        changes: { command: 1 },
        addFlags: ['c2-rope-path'],
        result: 'The rope bends around empty air, revealing a turn your eyes cannot see.',
      },
      {
        id: 'c2-use-pin-key',
        label: 'Drag the iron key along the road stones.',
        detail: 'Available if you took the iron spike from the cellar wall.',
        next: 'c2-road-pin',
        changes: { resolve: 1 },
        requiresFlags: ['c2-has-pin-key'],
        addFlags: ['c2-key-found-path'],
        result: 'The iron pulls toward the silver crack. A hidden section of road becomes solid beneath your feet.',
      },
      {
        id: 'c2-follow-companion',
        label: 'Trust your companion’s reading of the cellar.',
        detail: 'Spend 1 Resolve. Follow a human judgment when your own senses disagree.',
        next: 'c2-road-pin',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c2-trusted-below'],
        result: 'You stop trying to force the cellar into a normal shape. Your companion leads you across the broken distance.',
      },
    ],
  },

  'c2-road-pin': {
    id: 'c2-road-pin',
    kicker: 'The cause beneath the inn',
    title: 'The Iron That Holds a Mile',
    location: 'The Buried King’s Road',
    objective: 'Understand the damaged road pin before touching it.',
    threat: 'Rising',
    art: 'inn',
    body: (state) => [
      'The hidden path ends at an iron spike taller than you are. It passes through the road and deep into the earth. Silver cracks spread from an empty keyhole near its top.',
      state.flags.includes('c2-found-road-pin-term')
        ? 'This is the road pin named in the book, bracket, and Crown order. Now you can see what the words mean.'
        : 'Tivik calls it a road pin because it holds each mile of road in the correct place.',
      'The pin is not fully removed. Someone turned it halfway and left it trapped. Each ring of the midnight bell shakes it looser, allowing Bellweather Inn to touch another year and another stretch of road.',
      'Tivik explains the result in plain terms. The pin normally tells this mile where it belongs. Half turned, it gives several answers at once. That is why the doors open onto different places and why Maelin remembers years that you never lived.',
      'A fresh Crown mark has been cut into the iron. Whoever damaged it had official tools and expected your escort to be inside when it failed.',
    ],
    choices: [
      {
        id: 'c2-study-keyhole',
        label: 'Let Tivik study the empty keyhole.',
        detail: 'Learn how to move the pin without breaking the road completely.',
        next: 'c2-remove-pin',
        changes: { command: 1 },
        addFlags: ['c2-safe-removal'],
        result: 'Tivik finds three locking teeth. Two are broken. The last can guide the pin out if everyone pulls together.',
      },
      {
        id: 'c2-read-crown-mark',
        label: 'Compare the Crown mark with the sealed orders.',
        detail: 'Connect the sabotage to a tool controlled by Greyhaven Palace.',
        next: 'c2-remove-pin',
        changes: { resolve: 1 },
        addFlags: ['c2-proved-crown-tool'],
        result: 'The cut and the wax seal use the same small crown with one damaged point. The evidence matches.',
      },
      {
        id: 'c2-feel-oath-pin',
        label: 'Touch the pin and ask your Oath what lives depend on it.',
        detail: 'Spend 1 Oathfire. Feel the human cost before choosing how to remove it.',
        next: 'c2-remove-pin',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c2-felt-road-lives'],
        result: 'Hundreds of travellers flare at the edge of your awareness. The broken road is threatening people far beyond the inn.',
      },
    ],
  },

  'c2-remove-pin': {
    id: 'c2-remove-pin',
    kicker: 'The inn begins to tear',
    title: 'Pull Before Midnight Ends',
    location: 'The Buried King’s Road',
    objective: 'Free the road pin before the inn chooses another year.',
    threat: 'Critical',
    art: 'inn',
    body: (state) => [
      'The bell above rings a third time. The silver cracks widen. Through them you see the inn burning, buried in snow, standing in summer, and lying as empty ruins.',
      'Each view is a possible place the inn could have reached while the pin was loose. They are not dreams. Only one will remain solid after you repair the road.',
      'Tivik loops a chain through the top of the road pin. The chain leads back toward the wagon team above. You can guide the pull, add your own strength, or use the treaty wagon as a weight.',
      state.flags.includes('c2-safe-removal')
        ? 'Because Tivik found the final locking tooth, one careful pull may remove the pin cleanly.'
        : 'The locking teeth grind inside the road. A bad pull could break the pin and leave part of it buried.',
      'The other Caelan steps through a silver crack behind you. The burn across his face shines red. “Leave it,” he says. “This is the only road that still reaches what we lost.”',
    ],
    choices: [
      {
        id: 'c2-command-pull',
        label: 'Call the timing and make the whole escort pull together.',
        detail: 'Spend 2 Command. Remove the pin through coordination instead of force.',
        next: 'c2-last-testimony',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c2-pin-whole'],
        result: 'Your count travels up the chain. The pin rises one hand at a time until it tears free in one piece.',
      },
      {
        id: 'c2-strength-pull',
        label: 'Join the chain and pull with everything left in you.',
        detail: 'Spend 3 Health. Free the pin before the burned man can stop you.',
        next: 'c2-last-testimony',
        changes: { health: -3, resolve: 1 },
        requires: { health: 3 },
        addFlags: ['c2-pin-whole', 'c2-caelan-injured'],
        result: 'Pain tears across your back. The pin comes free, and you fall with it across your legs.',
      },
      {
        id: 'c2-oath-pull',
        label: 'Swear that this road will carry the living home.',
        detail: 'Spend 2 Resolve. Gain 3 Oathfire and accept a binding duty to repair the road.',
        next: 'c2-last-testimony',
        changes: { resolve: -2, oathfire: 3 },
        requires: { resolve: 3 },
        addFlags: ['c2-oath-repair-road', 'c2-pin-whole'],
        result: 'Fire crosses the chain. Every living hand pulls at once, and the road pin rises toward your promise.',
      },
      {
        id: 'c2-wagon-break',
        label: 'Drop the treaty wagon through the silver crack.',
        detail: 'Sacrifice the wagon and break the pin free without spending a resource.',
        next: 'c2-last-testimony',
        addFlags: ['c2-pin-broken', 'treaty-damaged'],
        result: 'The wagon falls through the crack and yanks the chain tight. The pin snaps. Most of it comes free, but a black fragment remains below.',
      },
    ],
  },

  'c2-last-testimony': {
    id: 'c2-last-testimony',
    kicker: 'The road returns',
    title: 'A Crown in the Iron',
    location: 'Bellweather Inn at Dawn',
    objective: 'Choose what evidence and duty you will carry toward Harrowfen.',
    threat: 'Rising',
    art: 'inn',
    body: (state) => [
      'The road pin leaves the earth. Bellweather Inn slams back into one place and one morning. Windows break. The other guests disappear. The burned Caelan reaches for you, then fades with the silver light.',
      'Outside, the King’s Road runs east and west again. A market town stands on the eastern horizon. Maelin says Harrowfen should be three days away. The mile stone says it is one mile.',
      'The inn is fixed, but the loose iron still points the road toward the wrong destination. That is why Harrowfen is close enough to see. The danger has moved with the fragment instead of ending.',
      state.flags.includes('c2-saved-attacker')
        ? 'Sable walks into the yard with Brann supporting him. “I will testify,” he says. “The order came from the Crown, but the man behind the screen wore a Warden ring.”'
        : 'Sable is dying when Brann carries him into the yard. He grips your sleeve and forces out seven words: “Crown order. Warden ring. Road pin. Harrowfen.”',
      state.flags.includes('c2-pin-broken')
        ? 'Tivik holds the broken top of the road pin. The fragment left underground is already pulling at the eastern road.'
        : 'The full road pin lies in the mud. The damaged Crown mark is clear enough for any court to recognise.',
    ],
    choices: [
      {
        id: 'c2-carry-testimony',
        label: 'Take Sable and his testimony to Harrowfen.',
        detail: 'Protect the witness and gain 7 Wayfire. His survival depends on your earlier medicine choice.',
        next: 'c2-ending-testimony',
        changes: { wayfire: 7 },
        addFlags: ['c2-chose-testimony'],
        result: 'You place Sable on the safest wagon and order Brann to keep him under constant guard.',
      },
      {
        id: 'c2-carry-pin',
        label: 'Carry the road pin as proof and study its pull.',
        detail: 'Follow the magical evidence toward Harrowfen and gain 7 Wayfire.',
        next: 'c2-ending-pin',
        changes: { wayfire: 7 },
        addFlags: ['c2-chose-pin'],
        result: 'Tivik wraps the iron in chains. Even on the wagon, it points toward Harrowfen.',
      },
      {
        id: 'c2-swear-crown-truth',
        label: 'Swear to expose the Crown officer behind the attack.',
        detail: 'Spend 2 Resolve. Gain 3 Oathfire, 8 Wayfire, and a binding duty.',
        next: 'c2-ending-oath',
        changes: { resolve: -2, oathfire: 3, wayfire: 8 },
        requires: { resolve: 3 },
        addFlags: ['c2-oath-expose-crown'],
        result: 'The promise catches fire inside your chest. The Crown mark on the iron glows in answer.',
      },
    ],
  },

  'c2-ending-testimony': {
    id: 'c2-ending-testimony',
    kicker: 'Chapter Two complete',
    title: 'The Witness on the Wagon',
    location: 'The Eastern Road to Harrowfen',
    objective: 'Keep Sable alive and learn who inside the Wardens served the Crown plot.',
    threat: 'Rising',
    art: 'inn',
    final: true,
    nextChapter: 'c3-arrival',
    body: (state) => [
      state.flags.includes('c2-saved-attacker')
        ? 'Sable remains awake as Bellweather Inn shrinks behind you. He names two safe houses and one Warden officer who took payment from the Palace.'
        : 'Sable dies before the first mile marker. He leaves no full name, but the Warden ring clue changes the enemy you must search for.',
      state.flags.includes('c2-saved-nilo')
        ? 'Nilo rides beside Maelin and waves when he notices you looking back.'
        : 'Maelin stays beside Nilo’s stretcher. His breathing is weak but steady enough for the short road ahead.',
      'Harrowfen grows larger with every step. Then its eastern gate opens, and another version of your escort rides out to meet you.',
    ],
    choices: [],
  },

  'c2-ending-pin': {
    id: 'c2-ending-pin',
    kicker: 'Chapter Two complete',
    title: 'Iron That Points East',
    location: 'The Eastern Road to Harrowfen',
    objective: 'Reach Harrowfen and learn why the road pin is pulling toward it.',
    threat: 'Unknown',
    art: 'inn',
    final: true,
    nextChapter: 'c3-arrival',
    body: (state) => [
      state.flags.includes('c2-pin-broken')
        ? 'The broken road pin jumps inside its chains whenever the wagon turns away from Harrowfen. Something under the town is pulling at the missing half.'
        : 'The road pin turns inside its chains until its Crown mark faces Harrowfen. Tivik says iron should not know where a town is.',
      state.flags.includes('c2-kissed-mara')
        ? 'Mara rides beside you. Her hand brushes yours once, private and deliberate, before she points toward the eastern gate.'
        : 'Mara rides ahead and returns with a warning. Fresh wagon tracks leave Harrowfen, and they match your own wheels.',
      'The gate opens. Town guards raise a bill bearing your signature. It says your escort arrived three days ago.',
    ],
    choices: [],
  },

  'c2-ending-oath': {
    id: 'c2-ending-oath',
    kicker: 'Chapter Two complete',
    title: 'The Ring Inside the Crown',
    location: 'The Eastern Road to Harrowfen',
    objective: 'Find the false Warden and expose the Crown plot.',
    threat: 'Immediate',
    art: 'inn',
    final: true,
    nextChapter: 'c3-arrival',
    body: (state) => [
      'Your new Oath pulls east like a hot chain. Someone connected to the Crown plot is waiting in Harrowfen or has recently passed through it.',
      state.flags.includes('c2-oath-repair-road')
        ? 'The promise to repair the road pulls in the same direction. Two duties now agree, which makes their combined strength more dangerous.'
        : 'The freed road lies straight behind you, but each mile marker carries a fresh cut shaped like a Warden ring.',
      'An arrow strikes the wagon beside your hand. A note is tied below its head: Captain Vey, you already failed here three days from now.',
    ],
    choices: [],
  },

  'c3-arrival': {
    id: 'c3-arrival',
    kicker: 'Chapter Three',
    title: 'The Town at the Wrong Mile',
    location: 'West Gate, Harrowfen',
    objective: 'Enter Harrowfen without letting the false escort divide your people.',
    threat: 'Immediate',
    art: 'harrowfen',
    body: (state) => [
      'Harrowfen should be three days from Bellweather Inn. You reach its west gate before the morning mist has left your cloak.',
      'The town sits inside a ring of black reeds. Houses lean over narrow canals, and bright market awnings stretch between old stone towers. It would look welcoming if fifty archers were not aiming at you from the wall.',
      'A second escort waits outside the gate. The riders wear your green road cloaks. Their wagon carries the same split wheel as yours. At their front sits a man with your face, your sword, and dried blood across his mouth.',
      'Mara whispers, “Tell me you see him.” Before you can answer, the other Caelan raises two fingers in your private signal for danger behind. Then he and every rider around him fade into the mist.',
      state.flags.includes('c2-oath-expose-crown')
        ? 'The Oath inside your chest pulls toward the gatehouse hard enough to hurt. Someone tied to the Crown plot is close.'
        : 'A town guard lowers a speaking horn. “Captain Vey, you were ordered never to return. Put down your weapons.”',
    ],
    choices: [
      {
        id: 'c3-command-calm',
        label: 'Order your guards to lower their weapons.',
        detail: 'Show control before fear starts a fight. Gain 1 Command.',
        next: 'c3-gate',
        changes: { command: 1 },
        addFlags: ['c3-calm-entry'],
        result: 'Your order moves down the line. Twenty blades return to their sheaths before one frightened hand can begin a battle.',
      },
      {
        id: 'c3-shield-wounded',
        label: 'Place yourself between the archers and the wounded.',
        detail: 'Spend 1 Health to protect the wagons while Mara speaks for you.',
        next: 'c3-gate',
        requires: { health: 1 },
        changes: { health: -1 },
        addFlags: ['c3-shielded-wounded'],
        result: 'You stand in the open with empty hands raised. Mara names every injured traveller behind you until the archers begin to look ashamed.',
      },
      {
        id: 'c3-show-evidence',
        label: 'Hold up the Crown marked iron.',
        detail: 'Make the guards look at the strange evidence instead of your weapons.',
        next: 'c3-gate',
        addFlags: ['c3-showed-iron'],
        result: 'The iron turns in your grip and points through the closed gate. Several guards step back as if it has named them.',
      },
    ],
  },

  'c3-gate': {
    id: 'c3-gate',
    kicker: 'One mile from nowhere',
    title: 'A Debt Already Paid',
    location: 'West Gate, Harrowfen',
    objective: 'Prove that you are not the man who threatened Harrowfen.',
    threat: 'Rising',
    art: 'harrowfen',
    body: (state) => [
      'The gate opens only wide enough for one woman to step through. Warden Elene Marr is broad shouldered, grey haired, and carrying a crossbow with a silver bolt.',
      'She pushes a folded bill into your hand. It charges your escort for three nights of rooms, two broken doors, and the burial of a royal courier. At the bottom is your signature. The curve of every letter is yours.',
      '“You arrived three days ago,” Elene says. “You asked questions about an iron spike. Last night you robbed our archive and promised to burn the town if we followed.”',
      state.flags.includes('c2-saved-attacker')
        ? 'Sable lifts his head from the wagon. “I have met that courier,” he says weakly. “He gave us the order at Bellweather.”'
        : 'Brann points at a dark stain beside the gate. A body was dragged from there toward the old watch house.',
      'Behind you, one of the wounded cries out. Lysara says his fever is rising. The archers above draw their strings tighter.',
    ],
    choices: [
      {
        id: 'c3-test-signature',
        label: 'Sign your name again in front of Elene.',
        detail: 'Give her a simple fact she can compare for herself.',
        next: 'c3-triage',
        changes: { resolve: 1 },
        addFlags: ['c3-tested-signature'],
        result: 'The fresh signature matches the old one until Elene holds both near the iron. The older ink crawls toward it.',
      },
      {
        id: 'c3-give-command-word',
        label: 'Ask Brann for yesterday’s command word.',
        detail: 'Use a Warden check that an imitation should not know. Requires 2 Command.',
        next: 'c3-triage',
        requires: { command: 2 },
        changes: { command: -1 },
        addFlags: ['c3-proved-command'],
        result: 'Brann gives the challenge. You answer with the private reply. Elene admits the earlier Caelan knew a word that will not be chosen until tomorrow.',
      },
      {
        id: 'c3-let-mara-search-you',
        label: 'Let Mara hand Elene your weapons and papers.',
        detail: 'Accept a temporary loss of control and let Mara handle your weapons.',
        next: 'c3-triage',
        addFlags: ['c3-entered-unarmed'],
        result: 'Mara removes your sword with careful hands. “I expect this back,” she tells Elene. The warning earns the first small smile on the wall.',
      },
    ],
  },

  'c3-triage': {
    id: 'c3-triage',
    kicker: 'A town under suspicion',
    title: 'Three Urgent Roads',
    location: 'Reed Market, Harrowfen',
    objective: 'Choose what the escort needs before the false arrival strikes again.',
    threat: 'Rising',
    art: 'harrowfen',
    lesson: {
      title: 'Your focus changes what you learn',
      body: 'You can investigate the false escort, protect the wounded, or seek a safe road out. Every route reaches the same crisis, but it changes who trusts you and what proof you carry.',
    },
    body: () => [
      'Elene allows six of you inside. Harrowfen smells of wet rope, baked pears, and the dark water under its streets. Traders are packing their stalls even though the morning bell has not rung.',
      'The wounded need Harrowfen’s healer. The robbed archive may hold a record of the false escort. A masked road broker named Varris offers a third answer: a route to Greyhaven in exchange for one look at your iron fragment.',
      'Lysara wants the archive searched before more records vanish. Mara wants beds, locked doors, and guards around the injured. Both are right, and both are waiting for you to choose.',
    ],
    choices: [
      {
        id: 'c3-focus-archive',
        label: 'Search the archive with Lysara.',
        detail: 'Follow the false escort’s trail before it goes cold.',
        next: 'c3-archive',
        changes: { resolve: 1 },
        addFlags: ['c3-route-archive', 'c3-backed-lysara'],
        result: 'You give Mara command of the wagons and follow Lysara toward the old watch house.',
      },
      {
        id: 'c3-focus-wounded',
        label: 'Secure the healer with Mara.',
        detail: 'Protect the people already paying for your mission and support Mara’s priority.',
        next: 'c3-healer',
        addFlags: ['c3-route-healer', 'c3-backed-mara'],
        result: 'You send Lysara with Elene and help Mara push the first wagon through the frightened crowd.',
      },
      {
        id: 'c3-focus-road',
        label: 'Hear Varris’s offer without giving him the iron.',
        detail: 'Look for an escape route while keeping the evidence in your hands.',
        next: 'c3-broker',
        changes: { command: 1 },
        addFlags: ['c3-route-broker'],
        result: 'You make Tivik hold the wrapped iron while Varris leads you into a shop with six doors and no windows.',
      },
    ],
  },

  'c3-archive': {
    id: 'c3-archive',
    kicker: 'Investigation route',
    title: 'The Page That Remembers You',
    location: 'Old Watch Archive, Harrowfen',
    objective: 'Find what the false escort stole and why it needed your name.',
    threat: 'Uneasy',
    art: 'harrowfen',
    body: () => [
      'The archive door is broken inward. Shelves cover the round room from floor to roof, but only one ledger lies open. Its page records your arrival again and again in different ink.',
      'In one entry you came alone. In another, Mara was dead. In a third, Harrowfen had no west gate. Each entry ends with the same line: Captain Vey asked for the Mileless Bridge.',
      'Lysara leans close enough that her sleeve touches yours. “This is not a list of lies,” she says. “The paper believes every version happened.” A floorboard creaks behind the shelves.',
    ],
    choices: [
      {
        id: 'c3-catch-archive-spy',
        label: 'Circle the shelves and catch whoever is hiding.',
        detail: 'Spend 1 Health to move before the watcher escapes.',
        next: 'c3-bill',
        requires: { health: 1 },
        changes: { health: -1 },
        addFlags: ['c3-caught-clerk'],
        result: 'You catch a young clerk with a Crown seal in his pocket. He swears a royal courier paid him to leave the ledger open.',
      },
      {
        id: 'c3-copy-bridge-entry',
        label: 'Copy every entry about the Mileless Bridge.',
        detail: 'Preserve the clear clue before chasing anyone.',
        next: 'c3-bill',
        changes: { resolve: 1 },
        addFlags: ['c3-bridge-record'],
        result: 'Lysara copies seven locations for one bridge. None of them agree with Harrowfen’s current maps.',
      },
      {
        id: 'c3-ask-lysara-what-she-sees',
        label: 'Ask Lysara to read the living ink.',
        detail: 'Trust Lysara’s magic and let her read the dangerous ink.',
        next: 'c3-bill',
        addFlags: ['c3-lysara-read-ink'],
        result: 'Lysara touches the page. The ink forms the outline of a man carrying your sword but wearing a royal courier’s silver gloves.',
      },
    ],
  },

  'c3-healer': {
    id: 'c3-healer',
    kicker: 'Protection route',
    title: 'Beds Beside Black Water',
    location: 'Mother Senna’s Canal House, Harrowfen',
    objective: 'Make the wounded safe before the town turns against them.',
    threat: 'Immediate',
    art: 'harrowfen',
    body: (state) => [
      'Mother Senna’s healing house stands on stilts above a canal. She opens the door, sees Nilo, and drops a bowl. “I buried that boy yesterday,” she says.',
      state.flags.includes('c2-saved-nilo')
        ? 'Nilo stares at her. “I have never met you.” Senna touches his living face, then points to a fresh grave across the water.'
        : 'The weak boy on Maelin’s stretcher has the same face as the child in a charcoal death portrait hanging beside the door.',
      'Stones strike the roof. People outside believe your escort brought a sickness that copies the dead. Mara bars the door and looks to you for an order.',
    ],
    choices: [
      {
        id: 'c3-hold-healer-door',
        label: 'Hold the door while Senna treats the wounded.',
        detail: 'Spend 1 Health and refuse to answer fear with steel.',
        next: 'c3-bill',
        requires: { health: 1 },
        changes: { health: -1, command: 1 },
        addFlags: ['c3-secured-healer'],
        result: 'You take the stones on your shield until Elene’s guards clear the bridge. No wounded traveller is touched.',
      },
      {
        id: 'c3-show-nilo-memory',
        label: 'Ask Nilo to prove he is himself.',
        detail: 'Let a frightened boy answer in his own words.',
        next: 'c3-bill',
        addFlags: ['c3-nilo-spoke'],
        result: 'Nilo tells Senna how he earned the scar on his thumb. The dead copy had no scar. Senna opens every bed she has.',
      },
      {
        id: 'c3-command-canal-line',
        label: 'Place guards on both canal bridges.',
        detail: 'Spend 1 Command to create a safe treatment area.',
        next: 'c3-bill',
        requires: { command: 1 },
        changes: { command: -1 },
        addFlags: ['c3-canal-defence'],
        result: 'Brann forms a calm line and gives the crowd room to retreat. The shouting loses its courage when nobody pushes back.',
      },
    ],
  },

  'c3-broker': {
    id: 'c3-broker',
    kicker: 'Road route',
    title: 'The Shop of Six Doors',
    location: 'Varris’s Route House, Harrowfen',
    objective: 'Learn what the iron can buy without losing it.',
    threat: 'Rising',
    art: 'harrowfen',
    body: () => [
      'Each door in Varris’s shop opens onto a different street. One shows Greyhaven under summer sun. One shows a red desert. One opens above a black ocean with stars below it.',
      'Varris wears a smooth wooden mask. “The iron does not open roads,” he says. “It tells a road which answer is true. Let me place it on my table and I will send your wounded home.”',
      'Tivik tightens both hands around the wrapped fragment. Through the wall, you hear Varris whisper the same offer in your own voice.',
    ],
    choices: [
      {
        id: 'c3-mark-false-door',
        label: 'Use a drop of blood to mark the Greyhaven door.',
        detail: 'Spend 1 Health to test whether the view is physically real.',
        next: 'c3-bill',
        requires: { health: 1 },
        changes: { health: -1 },
        addFlags: ['c3-tested-door'],
        result: 'Your blood falls through the sunny doorway and lands behind you. The route is a loop wearing Greyhaven’s face.',
      },
      {
        id: 'c3-offer-the-wrapping',
        label: 'Give Varris the iron’s stained wrapping.',
        detail: 'Trade a trace of its power for his map while keeping the fragment.',
        next: 'c3-bill',
        changes: { resolve: 1 },
        addFlags: ['c3-varris-map'],
        result: 'Varris presses the cloth to a blank map. A bridge appears east of town, then slides away whenever the fragment moves.',
      },
      {
        id: 'c3-seize-mask',
        label: 'Pull off Varris’s mask when your voice speaks again.',
        detail: 'Act before the imitation finishes distracting you. Requires 2 Resolve.',
        next: 'c3-bill',
        requires: { resolve: 2 },
        changes: { resolve: -1, command: 1 },
        addFlags: ['c3-unmasked-varris'],
        result: 'The mask comes away. Varris has no mouth, only moving ink that shapes your signature across his skin. He points in terror toward the watch house.',
      },
    ],
  },

  'c3-bill': {
    id: 'c3-bill',
    kicker: 'One impossible fact',
    title: 'Ink Pulled by Iron',
    location: 'Reed Market, Harrowfen',
    objective: 'Discover why the old bill reacts to the road pin.',
    threat: 'Uneasy',
    art: 'harrowfen',
    body: (state) => [
      state.flags.includes('c3-route-archive')
        ? 'You return with proof that Harrowfen’s ledger remembers several arrivals.'
        : state.flags.includes('c3-route-healer')
          ? 'You return knowing that a second Nilo died here before the living boy arrived.'
          : 'You return with a map on which the same bridge refuses to stay in one place.',
      'Tivik sets the wrapped road pin on an empty stall. The false bill slides across the wood toward it. When he lifts the iron, the ink changes. The date moves forward one day, then back four.',
      'Lysara keeps her explanation short. “The fragment is forcing one possible journey to remain real. Harrowfen is remembering the travellers who used that journey.”',
      'Mara looks across the market. “Then somewhere in this town, a possible version of us is still walking.”',
    ],
    choices: [
      {
        id: 'c3-anchor-bill',
        label: 'Pin the bill down and move the iron around it.',
        detail: 'Test which direction makes the false date stable.',
        next: 'c3-evidence',
        changes: { resolve: 1 },
        addFlags: ['c3-found-east-pull'],
        result: 'The date stops moving only when the iron points east, toward the old watch house and the bridge beyond it.',
      },
      {
        id: 'c3-ask-town-memory',
        label: 'Ask witnesses for one detail they all remember.',
        detail: 'Use ordinary questions to find the solid fact. Gain 1 Command.',
        next: 'c3-evidence',
        changes: { command: 1 },
        addFlags: ['c3-witness-pattern'],
        result: 'Every witness remembers silver gloves. Faces and names change, but the false escort’s courier always wore them.',
      },
      {
        id: 'c3-let-iron-point',
        label: 'Unwrap the fragment and let it turn freely.',
        detail: 'Risk showing its power so you can follow it.',
        next: 'c3-evidence',
        addFlags: ['c3-iron-exposed'],
        result: 'The fragment spins once, cuts a line into the stall, and stops toward the old watch house. A royal seal shines in a high window.',
      },
    ],
  },

  'c3-evidence': {
    id: 'c3-evidence',
    kicker: 'A trail through memory',
    title: 'The Courier Who Died Twice',
    location: 'Burial Canal, Harrowfen',
    objective: 'Identify the royal courier before he learns you are following him.',
    threat: 'Rising',
    art: 'harrowfen',
    body: (state) => [
      'Elene leads you to the courier’s grave. The earth is wet and newly packed. His name board reads Ordan Vale, Royal Road Office.',
      state.flags.includes('c2-saved-attacker')
        ? 'Sable confirms the name. Ordan Vale gave the Bellweather attackers their orders from behind a screen.'
        : 'Inside the grave you find only a silver glove filled with black reeds. There is no body.',
      'A bell rings from the watch house. Across the canal, a living man in silver gloves watches you from an upper window. He smiles, closes the shutters, and sets the building on fire.',
    ],
    choices: [
      {
        id: 'c3-save-grave-record',
        label: 'Take the name board before the fire reaches it.',
        detail: 'Keep simple proof of Ordan Vale’s presence.',
        next: 'c3-watch-house',
        addFlags: ['c3-kept-name-board'],
        result: 'You pull the board free. The burial date changes in your hand, but Ordan’s name remains.',
      },
      {
        id: 'c3-rush-burning-house',
        label: 'Run for the watch house before Ordan escapes.',
        detail: 'Spend 2 Health to reach the fire first.',
        next: 'c3-watch-house',
        requires: { health: 2 },
        changes: { health: -2 },
        addFlags: ['c3-reached-house-first'],
        result: 'You cross the canal bridge before the first burning beam falls and see Ordan enter a room with no outer door.',
      },
      {
        id: 'c3-order-streets-closed',
        label: 'Have Elene close every road out of town.',
        detail: 'Spend 1 Command to trap the courier inside Harrowfen.',
        next: 'c3-watch-house',
        requires: { command: 1 },
        changes: { command: -1 },
        addFlags: ['c3-closed-roads'],
        result: 'Horns sound at each gate. Ordan cannot leave by an ordinary road, which tells you what kind of escape he needs.',
      },
    ],
  },

  'c3-watch-house': {
    id: 'c3-watch-house',
    kicker: 'The false arrival',
    title: 'A Room Built Tomorrow',
    location: 'Burning Watch House, Harrowfen',
    objective: 'Search Ordan’s hidden room before the fire destroys it.',
    threat: 'Immediate',
    art: 'harrowfen',
    body: () => [
      'Smoke presses down the stairwell. Behind the upper records room stands a new door in an old wall. The wood is cold and rain runs upward across it.',
      'Inside, tomorrow has already happened. A broken market bell lies on the floor. Your red cloak hangs from a peg, wet with blood you have not lost. Ordan’s desk holds a list of people the false escort frightened into leaving town.',
      'At the bottom of the list is one instruction: keep Captain Vey busy until the Nail fragment can be taken east.',
    ],
    choices: [
      {
        id: 'c3-take-courier-list',
        label: 'Take Ordan’s list and leave before the roof falls.',
        detail: 'Secure clear evidence without spending a resource.',
        next: 'c3-divided-loyalty',
        addFlags: ['c3-kept-courier-list'],
        result: 'You fold the list into your coat. The names stay fixed after you carry it away from the cold door.',
      },
      {
        id: 'c3-free-future-cloak',
        label: 'Pull your bloody cloak from the peg.',
        detail: 'Spend 1 Resolve to face a possible death and inspect it.',
        next: 'c3-divided-loyalty',
        requires: { resolve: 1 },
        changes: { resolve: -1 },
        addFlags: ['c3-took-future-cloak'],
        result: 'The blood is warm. A cut in the cloth matches no weapon you know, but a scrap of silver glove is caught inside it.',
      },
      {
        id: 'c3-destroy-future-room',
        label: 'Push the burning desk against the cold door.',
        detail: 'Spend 1 Health to stop this room from shaping the town again.',
        next: 'c3-divided-loyalty',
        requires: { health: 1 },
        changes: { health: -1, command: 1 },
        addFlags: ['c3-burned-future-room'],
        result: 'The cold door catches fire. Outside, three people suddenly remember that the false escort never entered their homes.',
      },
    ],
  },

  'c3-divided-loyalty': {
    id: 'c3-divided-loyalty',
    kicker: 'A breath before danger',
    title: 'What Comes First',
    location: 'Healer’s Roof, Harrowfen',
    objective: 'Settle the split in your group before Ordan makes his move.',
    threat: 'Rising',
    art: 'harrowfen',
    body: (state) => [
      'For a few minutes, rain quiets the town. Mara waits on the healer’s roof with her coat open at the throat and wet hair clinging to the strong line of her neck. Lysara checks the canal beside her. Rain beads on the living silk fitted around the envoy’s waist, and the cloth opens and closes like dark leaves with every measured breath. Both women are tired. Neither steps away when you join them.',
      state.flags.includes('c3-backed-mara')
        ? 'Lysara says your wounded are safe because you chose people before answers. She respects it, but warns that Ordan used the delay.'
        : state.flags.includes('c3-backed-lysara')
          ? 'Mara says the archive clue may save the town. She also reminds you that frightened people remember who stood beside their beds.'
          : 'Mara admits that seeking a road out was sensible. Lysara answers that sensible choices can still leave an enemy free.',
      'Their disagreement is not about pride. Mara fears losing people you can protect now. Lysara fears that saving one room will mean little if Ordan can rewrite the road beneath it.',
    ],
    choices: [
      {
        id: 'c3-stand-with-mara',
        label: 'Tell Mara that protecting lives comes first.',
        detail: 'Make your priority clear and strengthen Mara’s trust and attraction.',
        next: 'c3-market-memory',
        addFlags: ['c3-priority-people'],
        result: 'Mara’s shoulders loosen. She touches your wrist and says, “Then make sure you come back as one of them.”',
      },
      {
        id: 'c3-stand-with-lysara',
        label: 'Tell Lysara that finding the cause may save more lives.',
        detail: 'Accept the colder duty and gain 1 Resolve.',
        next: 'c3-market-memory',
        addFlags: ['c3-priority-cause'],
        result: 'Lysara studies you, then gives a small, warm smile. “Good. I was afraid your courage had made you simple.”',
      },
      {
        id: 'c3-name-the-real-plan',
        label: 'Give each woman part of the same plan.',
        detail: 'Requires 2 Command. Spend 1 Command so protection and investigation support each other.',
        next: 'c3-market-memory',
        requires: { command: 2 },
        changes: { command: -1 },
        addFlags: ['c3-balanced-plan'],
        result: 'Mara takes the wounded. Lysara watches the iron. Their hands meet over your map, and the argument becomes a plan.',
      },
    ],
  },

  'c3-market-memory': {
    id: 'c3-market-memory',
    kicker: 'The town remembers',
    title: 'Yesterday Walks into the Market',
    location: 'Reed Market, Harrowfen',
    objective: 'Keep the market calm when old versions of the town return.',
    threat: 'Critical',
    art: 'harrowfen',
    body: (state) => [
      state.flags.includes('c3-priority-people')
        ? state.flags.includes('c2-kissed-mara')
          ? 'Before you leave the roof, Mara catches the front of your coat and kisses you again. This one is not cautious. Her body is warm against your rain cold armour, and for several breaths neither of you belongs to the road. She lets go first. “That was for coming back,” she says. “The next one is for surviving.”'
          : 'Before you leave the roof, Mara catches the front of your coat. She draws close enough that her breath warms the rain on your mouth, but stops there. “Survive the next hour,” she says softly. “Then we can decide what this is.”'
        : state.flags.includes('c3-priority-cause')
          ? 'Lysara follows you from the roof. At the stair she straightens the edge of your red cloak, her fingers lingering against the bare skin at your throat. Her living sleeve curls around her wrist as her eyes hold yours. “Do not mistake agreement for obedience,” she says. The warmth in her voice makes the warning feel more intimate, not less.'
          : 'Mara and Lysara leave the roof on opposite stairs, each carrying the part of the plan you gave her. The brief peace between them feels earned rather than complete.',
      'At noon, every bell in Harrowfen rings at once. The canals empty upward into the sky. Market stalls change colour. Missing houses appear between standing ones and push stone walls aside.',
      'People walk out of those houses carrying meals cooked three days ago. Some meet older versions of themselves. Others find family members they buried years before. Joy turns to panic when the returned people begin fading at the edges.',
      'The iron fragment tears free of its chains and floats above Tivik’s hands. Each time it turns, another version of Harrowfen replaces part of the market.',
    ],
    choices: [
      {
        id: 'c3-command-market',
        label: 'Call everyone toward the fixed stone well.',
        detail: 'Spend 2 Command to give the crowd one place and one instruction.',
        next: 'c3-pin-test',
        requires: { command: 2 },
        changes: { command: -2 },
        addFlags: ['c3-saved-market-crowd'],
        result: 'Your guards repeat the order until frightened voices become one moving line. The old well remains in every version of the square.',
      },
      {
        id: 'c3-carry-children',
        label: 'Carry two trapped children across the changing street.',
        detail: 'Spend 2 Health to save them before their house vanishes.',
        next: 'c3-pin-test',
        requires: { health: 2 },
        changes: { health: -2 },
        addFlags: ['c3-saved-market-children'],
        result: 'The road becomes a canal under your final step. Mara catches your arm and pulls all three of you onto fixed stone.',
      },
      {
        id: 'c3-follow-tiviks-rule',
        label: 'Order everyone to stop moving the iron.',
        detail: 'Use what you learned and make the fragment hold one version in place.',
        next: 'c3-pin-test',
        changes: { resolve: 1 },
        addFlags: ['c3-stilled-fragment'],
        result: 'Tivik lowers the fragment onto the well. The market stops changing, though cries continue from streets trapped in other versions.',
      },
    ],
  },

  'c3-pin-test': {
    id: 'c3-pin-test',
    kicker: 'The answer in motion',
    title: 'One Version Held Still',
    location: 'Stone Well, Harrowfen',
    objective: 'Use the fragment carefully enough to understand its effect.',
    threat: 'Immediate',
    art: 'harrowfen',
    body: () => [
      'The fragment rests on the well. Around it, one market remains solid. Beyond a circle of ten steps, streets slide through different days.',
      'Tivik turns the iron a finger’s width. A safe stone bridge replaces a burning canal. He turns it back, and the canal returns. The effect is now clear: the iron fixes one possible distance and destination in place. When it moves, the road remembers other answers.',
      'Lysara points across the square. Your double stands beside the watch house, solid now. He is holding Mara with a knife at her throat. The real Mara is still beside you.',
    ],
    choices: [
      {
        id: 'c3-approach-double-alone',
        label: 'Approach your double alone.',
        detail: 'Keep both Maras in sight and risk only yourself.',
        next: 'c3-duplicate',
        changes: { resolve: 1 },
        addFlags: ['c3-faced-double-alone'],
        result: 'You cross the fixed circle with empty hands. Your double watches you with the hatred of a man who knows your next mistake.',
      },
      {
        id: 'c3-send-real-mara',
        label: 'Let the real Mara circle behind him.',
        detail: 'Trust Mara’s skill while your double still has a blade.',
        next: 'c3-duplicate',
        addFlags: ['c3-mara-flanked-double'],
        result: 'Mara vanishes into the moving streets. A moment later, her knife appears against your double’s back.',
      },
      {
        id: 'c3-use-oath-sight',
        label: 'Use Oathfire to find which person made a real promise.',
        detail: 'Spend 1 Oathfire. A true promise leaves heat that a copied memory cannot create.',
        next: 'c3-duplicate',
        requires: { oathfire: 1 },
        changes: { oathfire: -1 },
        addFlags: ['c3-saw-false-oath'],
        result: 'Fire traces the promise Mara made at Bellweather. The woman beside your double has no heat at all. She is a road memory, not your companion.',
      },
    ],
  },

  'c3-duplicate': {
    id: 'c3-duplicate',
    kicker: 'The man with your face',
    title: 'A Memory Given Orders',
    location: 'Shifting Market Edge, Harrowfen',
    objective: 'Learn who controls the false Caelan without losing Mara.',
    threat: 'Critical',
    art: 'harrowfen',
    body: (state) => [
      'Your double speaks in your voice. “Ordan showed me what happens if you keep going. Mara dies at the bridge. Lysara opens a door she cannot close. I am the version of you that learned to stop.”',
      state.flags.includes('c3-saw-false-oath')
        ? 'Oathfire shows no promise inside him. His fear is real, but it was copied from a possible future and given someone else’s purpose.'
        : 'He knows memories you have never lived, yet he repeats Ordan’s name like an order he cannot question.',
      'The false Mara drives her elbow back. Your double’s knife cuts her throat, but no blood falls. She breaks into rain. He stares at his empty hand, suddenly unsure what he is.',
    ],
    choices: [
      {
        id: 'c3-talk-double-down',
        label: 'Tell him fear does not get to choose for both of you.',
        detail: 'Spend 1 Resolve to face the future he remembers.',
        next: 'c3-courier',
        requires: { resolve: 1 },
        changes: { resolve: -1 },
        addFlags: ['c3-double-yielded'],
        result: 'Your double lowers the knife. “Then do better than I did,” he says before the rain takes him.',
      },
      {
        id: 'c3-disarm-double',
        label: 'Disarm him while he is confused.',
        detail: 'Spend 1 Health to end the threat quickly.',
        next: 'c3-courier',
        requires: { health: 1 },
        changes: { health: -1 },
        addFlags: ['c3-double-disarmed'],
        result: 'You strike the knife away. The double grips your sleeve and whispers that Ordan is already beside the well.',
      },
      {
        id: 'c3-ask-future-warning',
        label: 'Ask what waits at the bridge.',
        detail: 'Take one clear warning before the memory fades.',
        next: 'c3-courier',
        addFlags: ['c3-bridge-warning'],
        result: '“Do not trust the first end of the bridge,” he says. “And the thief is not working for Ordan.” Then his face becomes mist.',
      },
    ],
  },

  'c3-courier': {
    id: 'c3-courier',
    kicker: 'The theft',
    title: 'Silver Gloves at the Well',
    location: 'Stone Well, Harrowfen',
    objective: 'Stop Ordan Vale from taking the iron fragment.',
    threat: 'Critical',
    art: 'harrowfen',
    body: (state) => [
      'You turn toward the well. Ordan Vale is already there, alive and smiling in his silver gloves. He looks ordinary, which makes the bodies and burning streets around him feel worse.',
      '“Thank you for carrying it out of Bellweather,” he says. “A royal tool cannot be stolen until a loyal officer calls it evidence.”',
      state.flags.includes('c3-closed-roads')
        ? 'The ordinary gates are shut, so Ordan presses a brass token against the fragment and opens a narrow road straight through the market.'
        : 'He presses a brass token against the fragment. A narrow road opens through the crowd toward an ancient bridge standing beyond the eastern reeds.',
      'His glove closes around the iron. Harrowfen begins changing again.',
    ],
    choices: [
      {
        id: 'c3-cut-glove',
        label: 'Cut the silver glove from Ordan’s hand.',
        detail: 'Spend 2 Health to strike before the road opens fully.',
        next: 'c3-collapse',
        requires: { health: 2 },
        changes: { health: -2 },
        addFlags: ['c3-cut-silver-glove'],
        result: 'Your blade opens the glove and Ordan’s palm. He keeps the fragment, but his blood marks the route he uses to escape.',
      },
      {
        id: 'c3-order-volley',
        label: 'Order the archers to break the road around him.',
        detail: 'Spend 2 Command to control the shot through a crowded market.',
        next: 'c3-collapse',
        requires: { command: 2 },
        changes: { command: -2 },
        addFlags: ['c3-broke-escape-road'],
        result: 'Arrows strike in a clean ring. Ordan’s road cracks, forcing him to run across the unstable edge instead of vanishing at once.',
      },
      {
        id: 'c3-mark-ordan',
        label: 'Throw the changing bill onto Ordan’s back.',
        detail: 'Mark him with ink that is pulled toward the fragment.',
        next: 'c3-collapse',
        addFlags: ['c3-marked-ordan'],
        result: 'The bill wraps around Ordan’s coat. Its ink burns bright and draws a black line through every road he crosses.',
      },
    ],
  },

  'c3-collapse': {
    id: 'c3-collapse',
    kicker: 'A town coming apart',
    title: 'The Last Fixed Street',
    location: 'Reed Market, Harrowfen',
    objective: 'Save a path through town while keeping Ordan in sight.',
    threat: 'Critical',
    art: 'harrowfen',
    body: (state) => [
      'Ordan runs east with the fragment. Harrowfen tears into pieces behind him. One canal becomes a road of white bone. A tower falls upward. Half the healing house begins to fade with the wounded still inside.',
      state.flags.includes('c3-balanced-plan')
        ? 'Mara already has the wounded moving while Lysara marks a stable line with green light. The plan you gave them buys precious seconds.'
        : state.flags.includes('c3-priority-people')
          ? 'Mara has the wounded ready, but Lysara is trapped across a street that changes every breath.'
          : 'Lysara can see Ordan’s path, but Mara is carrying patients from the fading healing house alone.',
      'You can spend your remaining strength on the town, the chase, or a promise powerful enough to touch both.',
    ],
    choices: [
      {
        id: 'c3-save-healing-house',
        label: 'Hold the healing house in place while people escape.',
        detail: 'Spend 2 Health. Ordan gains distance, but the wounded survive.',
        next: 'c3-pursuit',
        requires: { health: 2 },
        changes: { health: -2 },
        addFlags: ['c3-saved-healing-house'],
        result: 'You brace a fading support post until Mara carries the last patient out. The building vanishes the moment you let go.',
      },
      {
        id: 'c3-keep-courier-in-sight',
        label: 'Lead a small group after Ordan now.',
        detail: 'Trust Elene to protect the town while you continue the chase.',
        next: 'c3-pursuit',
        addFlags: ['c3-kept-close'],
        result: 'Elene takes the square. You, Mara, and Lysara follow Ordan’s marked route before it can close.',
      },
      {
        id: 'c3-oath-hold-harrowfen',
        label: 'Swear that Harrowfen will not be erased today.',
        detail: 'Spend 2 Resolve. Gain 3 Oathfire, but this promise binds you until the town is stable.',
        next: 'c3-pursuit',
        requires: { resolve: 2 },
        changes: { resolve: -2, oathfire: 3 },
        addFlags: ['c3-oath-hold-town'],
        result: 'Fire fills the cracks between streets. Harrowfen stops fading, and your new promise burns whenever Ordan moves the fragment.',
      },
    ],
  },

  'c3-pursuit': {
    id: 'c3-pursuit',
    kicker: 'Beyond the eastern reeds',
    title: 'A Bridge Missing from Every Map',
    location: 'East Reeds, Harrowfen',
    objective: 'Choose what you carry into the pursuit.',
    threat: 'Rising',
    art: 'harrowfen',
    body: (state) => [
      'The last stable street ends among black reeds. Beyond them stands a ruined bridge with no river beneath it. Its broken arches cross clouds, desert, forest, and a field of stars at the same time.',
      state.flags.includes('c3-marked-ordan')
        ? 'The ink on Ordan’s coat leaves a line across the first arch.'
        : state.flags.includes('c3-cut-silver-glove')
          ? 'Drops of Ordan’s blood hang in the air above the first arch.'
          : 'Broken stones show where Ordan’s unstable route struck the bridge.',
      'A thin man in a dark coat waits under the first arch. He watches Ordan approach, smiles like a thief who has found an unlocked treasury, and disappears before you can see his face clearly.',
      'Lysara says the bridge is real, but not fixed to one place. Mara checks her blades. Behind you, Harrowfen is still wounded and full of people who now know your name twice.',
    ],
    choices: [
      {
        id: 'c3-prepare-fast-pursuit',
        label: 'Take Mara and begin the chase at once.',
        detail: 'Trust Elene with Harrowfen and keep Ordan close.',
        next: 'c3-world-nail',
        addFlags: ['c3-pursuit-mara'],
        result: 'Mara fastens your sword belt herself. “Try not to meet another you,” she says. “One is enough trouble.”',
      },
      {
        id: 'c3-prepare-safe-pursuit',
        label: 'Give Lysara one hour to make the first arch safe.',
        detail: 'Let the wounded rest and enter with a tested route.',
        next: 'c3-world-nail',
        changes: { resolve: 1 },
        addFlags: ['c3-pursuit-lysara'],
        result: 'Lysara grows a green thread across the stones. She warns that it will show a way back only once.',
      },
      {
        id: 'c3-use-oath-trail',
        label: 'Use Oathfire to mark Ordan’s direction.',
        detail: 'Spend 1 Oathfire. Your promise creates a trail across changing distance.',
        next: 'c3-world-nail',
        requires: { oathfire: 1 },
        changes: { oathfire: -1, command: 1 },
        addFlags: ['c3-oath-trail'],
        result: 'A red line burns across one arch, vanishes, and returns on another. The bridge cannot hide the direction Ordan took.',
      },
    ],
  },

  'c3-world-nail': {
    id: 'c3-world-nail',
    kicker: 'The name of the iron',
    title: 'A Nail Through the World',
    location: 'The Mileless Bridge',
    objective: 'Decide your first duty on the impossible bridge.',
    threat: 'Unknown',
    art: 'harrowfen',
    lesson: {
      title: 'World Nail',
      body: 'Lysara now names the iron you have already tested. A World Nail is an ancient anchor that keeps a road, border, or natural law in one stable form. Your fragment came from the Nail that fixes distance across Edrath.',
    },
    body: (state) => [
      'At the first broken arch, Lysara finally names the iron. “It is part of a World Nail. Old stories say the Nails hold the world’s rules in place. This one keeps distances from changing.”',
      'You have already seen the proof. Bellweather touched many years. Harrowfen stood one mile from an inn three days away. When the fragment moved, roads remembered other destinations.',
      state.flags.includes('c3-bridge-warning')
        ? 'Your double’s warning returns to you: do not trust the first end of the bridge, and the thief is not working for Ordan.'
        : 'On the far arch, the dark coated stranger appears behind Ordan. His hand is already reaching for the stolen fragment.',
      'Ordan steps into another sky. The stranger follows. The bridge begins to turn beneath your boots.',
    ],
    choices: [
      {
        id: 'c3-end-catch-courier',
        label: 'Cross for Ordan before he can hide the fragment.',
        detail: 'Make the royal courier your first target and gain 7 Wayfire.',
        next: 'c3-ending-courier',
        changes: { wayfire: 7 },
        addFlags: ['c3-target-ordan'],
        result: 'You step onto the turning bridge with Ordan’s trail fixed in your mind.',
      },
      {
        id: 'c3-end-catch-thief',
        label: 'Cut across the bridge toward the unknown thief.',
        detail: 'Risk losing Ordan to learn why a second enemy wants the fragment. Gain 7 Wayfire.',
        next: 'c3-ending-thief',
        changes: { wayfire: 7 },
        addFlags: ['c3-target-thief'],
        result: 'You change direction as the thief closes his hand around Ordan’s prize.',
      },
      {
        id: 'c3-end-secure-return',
        label: 'Secure a way back before pursuing either man.',
        detail: 'Protect your companions while both enemies gain distance. Gain 7 Wayfire.',
        next: 'c3-ending-return',
        changes: { wayfire: 7 },
        addFlags: ['c3-secured-return'],
        result: 'You drive a Warden spike into the first arch and tie your last rope to Harrowfen’s world.',
      },
    ],
  },

  'c3-ending-courier': {
    id: 'c3-ending-courier',
    kicker: 'Chapter Three complete',
    title: 'The Courier’s Last Road',
    location: 'The Mileless Bridge',
    objective: 'Catch Ordan and recover the stolen World Nail fragment.',
    threat: 'Immediate',
    art: 'harrowfen',
    final: true,
    body: (state) => [
      'You cross onto a bridge that passes through four skies. Ordan looks back and understands that you chose him over the easier mystery.',
      state.flags.includes('c3-pursuit-mara')
        ? 'Mara lands beside you with her blade ready. “He is yours,” she says. “I will handle the road.”'
        : 'Lysara’s green thread holds behind you, thin but visible across the turning stone.',
      'The dark coated thief reaches Ordan first. He steals the fragment from the courier’s belt, gives you an almost polite bow, and runs toward the broken centre of the bridge. Ordan draws a royal blade and blocks your path.',
    ],
    choices: [],
  },

  'c3-ending-thief': {
    id: 'c3-ending-thief',
    kicker: 'Chapter Three complete',
    title: 'The Hand Between Worlds',
    location: 'The Mileless Bridge',
    objective: 'Stop the unknown thief from escaping with the World Nail fragment.',
    threat: 'Critical',
    art: 'harrowfen',
    final: true,
    body: (state) => [
      'You leave Ordan’s marked road and cut across an arch hanging over a red desert. The stranger slips behind the courier and steals the iron fragment with two fingers.',
      state.flags.includes('c3-bridge-warning')
        ? 'He sees recognition in your face. “Good,” he says. “One of your impossible twins had a useful mouth.”'
        : 'He gives you a quick grin. “Captain, I am about to improve your terrible morning.”',
      'Ordan shouts for soldiers hidden on another version of the bridge. The thief throws the fragment into the air, and both of you reach for it as the arch breaks beneath your feet.',
    ],
    choices: [],
  },

  'c3-ending-return': {
    id: 'c3-ending-return',
    kicker: 'Chapter Three complete',
    title: 'A Rope to Harrowfen',
    location: 'The Mileless Bridge',
    objective: 'Keep the bridge connected to Harrowfen and recover the World Nail fragment.',
    threat: 'Rising',
    art: 'harrowfen',
    final: true,
    body: (state) => [
      'Your spike holds. The rope passes through three different skies, but its far end remains tied to Harrowfen. For the first time since Bellweather, you know there is a road behind you.',
      state.flags.includes('c3-oath-hold-town')
        ? 'Your Oath burns with steady heat. Harrowfen still exists, and the promise gives you a direction home.'
        : 'Mara tests the knot and nods. Lysara marks the first arch so Elene can find it if the town changes again.',
      'Ahead, the dark coated thief steals the fragment from Ordan. Royal soldiers emerge from a bridge that was empty a breath ago. The thief runs toward you with Ordan and six blades behind him.',
    ],
    choices: [],
  },
};

export const nodes = Object.fromEntries(
  Object.entries(originalNodes).map(([id, node]) => [
    id,
    {
      ...node,
      ...adventureNodeUpdates[id],
      choices: node.choices.map((choice) => ({
        ...choice,
        ...adventureChoiceUpdates[choice.id],
      })),
    },
  ]),
) as Record<string, StoryNode>;

export const nodeOrder = [
  'gate-yard',
  'mara-returns',
  'wheelwright',
  'envoy-arrives',
  'sealed-case',
  'choose-road',
  'low-road',
  'ridge-road',
  'inspection-yard',
  'march-order',
  'road-conversation',
  'ambush-warning',
  'low-crisis',
  'ridge-crisis',
  'inspection-crisis',
  'aftermath',
  'evidence',
  'retreat',
  'folded-road',
  'ending-forward',
  'ending-height',
  'ending-oath',
  'c2-arrival',
  'c2-threshold',
  'c2-triage',
  'c2-medicine',
  'c2-eleven-years',
  'c2-investigate',
  'c2-ledger',
  'c2-cellar',
  'c2-attacker',
  'c2-night-watch',
  'c2-bell',
  'c2-common-room-crisis',
  'c2-descend',
  'c2-folded-cellar',
  'c2-road-pin',
  'c2-remove-pin',
  'c2-last-testimony',
  'c2-ending-testimony',
  'c2-ending-pin',
  'c2-ending-oath',
  'c3-arrival',
  'c3-gate',
  'c3-triage',
  'c3-archive',
  'c3-healer',
  'c3-broker',
  'c3-bill',
  'c3-evidence',
  'c3-watch-house',
  'c3-divided-loyalty',
  'c3-market-memory',
  'c3-pin-test',
  'c3-duplicate',
  'c3-courier',
  'c3-collapse',
  'c3-pursuit',
  'c3-world-nail',
  'c3-ending-courier',
  'c3-ending-thief',
  'c3-ending-return',
];

export function canChoose(choice: Choice, state: GameState) {
  const hasStats = !choice.requires || Object.entries(choice.requires).every(
    ([key, value]) => state.stats[key as StatKey] >= (value ?? 0),
  );
  const hasRelationships = !choice.requiresRelationships
    || Object.entries(choice.requiresRelationships).every(([person, needs]) => {
      const score = state.relationships[person as RelationshipKey];
      return (!needs?.trust || score.trust >= needs.trust)
        && (!needs?.attraction || score.attraction >= needs.attraction);
    });
  const hasFlags = !choice.requiresFlags || choice.requiresFlags.every(
    (flag) => state.flags.includes(flag),
  );
  return hasStats && hasRelationships && hasFlags;
}

export function resolveNext(choice: Choice, state: GameState) {
  return typeof choice.next === 'function' ? choice.next(state) : choice.next;
}

export function requirementText(choice: Choice) {
  const parts = Object.entries(choice.requires ?? {}).map(
    ([key, value]) => `${statLabels[key as StatKey]} ${value}`,
  );
  for (const [person, needs] of Object.entries(choice.requiresRelationships ?? {})) {
    if (needs?.trust) parts.push(`${relationshipLabels[person as RelationshipKey]} trust ${needs.trust}`);
    if (needs?.attraction) parts.push(`${relationshipLabels[person as RelationshipKey]} attraction ${needs.attraction}`);
  }
  const flagLabels: Record<string, string> = {
    'captured-attacker': 'a captured attacker',
    'c2-kept-crown-orders': 'the preserved Crown orders',
    'c2-trusted-maelin': 'Maelin’s trust',
    'c2-has-pin-key': 'the iron road pin key',
  };
  for (const flag of choice.requiresFlags ?? []) {
    parts.push(flagLabels[flag] ?? 'an earlier story choice');
  }
  return parts.join(', ');
}
