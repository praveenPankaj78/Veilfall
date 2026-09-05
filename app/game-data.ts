export type StatKey =
  | 'stamina'
  | 'resolve'
  | 'command'
  | 'rapport'
  | 'oathfire'
  | 'wayfire';

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
  next: string | ((state: GameState) => string);
  changes?: Partial<GameStats>;
  addFlags?: string[];
  requires?: Partial<GameStats>;
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
  art?: 'departure' | 'folded';
  body: (state: GameState) => string[];
  choices: Choice[];
  final?: boolean;
};

export const initialState: GameState = {
  nodeId: 'gate-yard',
  stats: {
    stamina: 8,
    resolve: 6,
    command: 3,
    rapport: 1,
    oathfire: 0,
    wayfire: 0,
  },
  flags: [],
  history: [],
};

export const statLabels: Record<StatKey, string> = {
  stamina: 'Stamina',
  resolve: 'Resolve',
  command: 'Command',
  rapport: 'Rapport',
  oathfire: 'Oathfire',
  wayfire: 'Wayfire',
};

function routeDestination(state: GameState) {
  if (state.flags.includes('low-route')) return 'low-crisis';
  if (state.flags.includes('ridge-route')) return 'ridge-crisis';
  return 'inspection-crisis';
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => state.flags.includes(flag));
}

export const nodes: Record<string, StoryNode> = {
  'gate-yard': {
    id: 'gate-yard',
    kicker: 'Chapter One',
    title: 'The Road Before Rain',
    location: 'Eastwatch Gate, Greyhaven',
    objective: 'Prepare the escort before the eastern gate opens.',
    threat: 'Low',
    lesson: {
      title: 'Your strengths',
      body: 'Stamina powers hard physical actions. Resolve helps you face fear, pain, and doubt. Command shows how ready your guards are to follow difficult orders. Rapport measures trust and attraction. A choice will always show a known cost before you select it.',
    },
    introduces: ['stamina', 'resolve', 'command', 'rapport'],
    art: 'departure',
    body: () => [
      'Rain has turned Greyhaven’s stone walls almost black by the time you reach Eastwatch. Water pours from the gatehouse drains and gathers around the boots of twenty guards pretending not to be cold.',
      'Your name is Caelan Vey. You are thirty one, captain of the King’s Road Wardens, and responsible for every person leaving with the green treaty wagon. Your task sounds simple when spoken quickly: escort Ambassador Lysara to Bellweather Inn before night rain floods the low road.',
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
        result: 'You move one feverish guard to the rear wagon and give Brann a line that can still hold.',
      },
      {
        id: 'check-horses',
        label: 'Check the horses and harness yourself.',
        detail: 'Use some strength now so a broken harness cannot stop you later.',
        next: 'mara-returns',
        changes: { stamina: -1, resolve: 1 },
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
        changes: { rapport: 1 },
        addFlags: ['flirted-mara'],
        result: 'Mara’s gaze travels over your mail and returns to your eyes. “The horse is spoken for.”',
      },
      {
        id: 'ask-marker',
        label: 'Ask exactly how the mile marker was moved.',
        detail: 'Put her field knowledge before your assumptions.',
        next: 'wheelwright',
        changes: { command: 1, rapport: 1 },
        addFlags: ['trusted-mara-scouting'],
        result: 'She draws the disturbed stones in rainwater. The marks suggest one person did the work without a cart.',
      },
      {
        id: 'admit-unease',
        label: 'Tell her the road feels wrong this morning.',
        detail: 'Share your instinct instead of hiding behind rank.',
        next: 'wheelwright',
        changes: { resolve: 1, rapport: 1 },
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
        detail: 'Spend 1 Stamina to prove whether the damage was deliberate.',
        next: 'envoy-arrives',
        changes: { stamina: -1, command: 1 },
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
        changes: { rapport: 1 },
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
        changes: { rapport: 1 },
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
        changes: { rapport: 1 },
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
        detail: 'Spend 2 Stamina and arrive later with people who cannot fight.',
        next: 'march-order',
        changes: { stamina: -2, rapport: 1 },
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
        detail: 'Spend 2 Stamina to silence the watcher before the storm arrives.',
        next: 'march-order',
        changes: { stamina: -2, rapport: 1 },
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
        detail: 'Spend 2 Stamina and risk the escort forming without you.',
        next: 'march-order',
        changes: { stamina: -2 },
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
        detail: 'Spend 1 Stamina and place your body near the likely target.',
        next: 'road-conversation',
        changes: { stamina: -1 },
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
        changes: { rapport: 1 },
        addFlags: ['kept-seed-secret'],
        result: 'Lysara closes your fingers around the cool seed, then takes it back before your hands part.',
      },
      {
        id: 'tell-brann-seed',
        label: 'Tell Brann there is a second target.',
        detail: 'Spend trust with Lysara to make your formation honest.',
        next: 'ambush-warning',
        changes: { command: 1, rapport: -1 },
        addFlags: ['revealed-seed'],
        result: 'Brann changes the formation without asking questions. Lysara’s face becomes carefully unreadable.',
      },
      {
        id: 'ask-mara-future',
        label: 'Ask Mara what she planned for the evening.',
        detail: 'Take one personal moment while the road is briefly quiet.',
        next: 'ambush-warning',
        changes: { rapport: 1, resolve: 1 },
        requires: { rapport: 2 },
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
        detail: 'Spend 2 Stamina to absorb the first pressure yourself.',
        next: routeDestination,
        changes: { stamina: -2, resolve: 1 },
        requires: { stamina: 2 },
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
        detail: 'Requires 3 Rapport. Trust her view of the trap over your own.',
        next: routeDestination,
        changes: { rapport: 1 },
        requires: { rapport: 3 },
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
        changes: { stamina: -1, rapport: 1 },
        addFlags: ['saved-wounded', 'treaty-damaged', 'attacker-escaped'],
        result: 'You drag Joren and the children clear while pale treaty pages scatter into brown water.',
      },
      {
        id: 'save-treaty-low',
        label: 'Hold the wagon while Brann saves the trapped guard.',
        detail: 'Spend 2 Stamina and trust someone else with a life.',
        next: 'aftermath',
        changes: { stamina: -2, command: 1 },
        requires: { stamina: 2 },
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
        detail: 'Spend 2 Stamina and let the wagon strike the rocks.',
        next: 'aftermath',
        changes: { stamina: -2, rapport: 2 },
        requires: { stamina: 2 },
        addFlags: ['saved-wounded', 'saved-mara', 'treaty-damaged', 'attacker-escaped'],
        result: 'You lock one arm around the root and haul both of them up as the wagon breaks behind you.',
      },
      {
        id: 'hold-wagon-ridge',
        label: 'Brace the wagon and order Brann to the ledge.',
        detail: 'Spend 2 Stamina. Protect the treaty while trusting Brann with Mara.',
        next: 'aftermath',
        changes: { stamina: -2, command: 1 },
        requires: { stamina: 2 },
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
        detail: 'Spend 2 Stamina and break the ring before it closes.',
        next: 'aftermath',
        changes: { stamina: -2, resolve: 1 },
        requires: { stamina: 2 },
        addFlags: ['saved-wounded', 'treaty-safe', 'attacker-escaped'],
        result: 'Your shield takes a sword edge. The riders scatter, leaving blood and three empty saddles.',
      },
      {
        id: 'protect-lysara',
        label: 'Put the strongest guards around Lysara and the seed.',
        detail: 'Spend 1 Command and let the treaty wagon absorb the attack.',
        next: 'aftermath',
        changes: { command: -1, rapport: 1 },
        requires: { command: 1 },
        addFlags: ['seed-safe', 'treaty-damaged', 'guard-wounded'],
        result: 'Lysara survives inside a wall of shields. Axes open the wagon before the riders retreat.',
      },
      {
        id: 'take-leader',
        label: 'Trust Mara with the escort and take the leader alive.',
        detail: 'Requires 3 Rapport. Risk the mission for the person carrying answers.',
        next: 'aftermath',
        changes: { rapport: 1, resolve: -1 },
        requires: { rapport: 3 },
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
      'Joren is alive. Three guards cannot ride. One horse must be put down. Brann says the attackers who escaped went east, not back toward Greyhaven.',
      state.flags.includes('oath-safe-arrival')
        ? 'Your promise remains warm inside you. Shelter is no longer the mission written by a court. It is a debt carried in your own blood.'
        : 'The woods have gone quiet again. This time nobody mistakes quiet for safety.',
    ],
    choices: [
      {
        id: 'treat-wounded',
        label: 'Help bind wounds before asking questions.',
        detail: 'Spend 1 Stamina. Preserve lives while tracks fade in the rain.',
        next: 'evidence',
        changes: { stamina: -1, rapport: 1 },
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
        detail: 'Use trust to recover 1 Resolve while the guards form a defensive ring.',
        next: 'evidence',
        changes: { resolve: 1, rapport: 1 },
        requires: { rapport: 2 },
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
        changes: { rapport: 1 },
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
        changes: { stamina: -1, resolve: 1 },
        addFlags: ['pressed-east'],
        result: 'You put the strongest walkers around the stretchers and follow the road into hard rain.',
      },
      {
        id: 'climb-scout',
        label: 'Climb the next rise before committing the escort.',
        detail: 'Spend 2 Stamina to see the danger while everyone waits below.',
        next: 'folded-road',
        changes: { stamina: -2, command: 1 },
        requires: { stamina: 2 },
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
        detail: 'Spend 1 Stamina. Gain 5 Wayfire and risk giving the attackers time to return.',
        next: 'ending-height',
        changes: { stamina: -1, wayfire: 5 },
        requires: { stamina: 1 },
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
};

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
];

export function canChoose(choice: Choice, state: GameState) {
  const hasStats = !choice.requires || Object.entries(choice.requires).every(
    ([key, value]) => state.stats[key as StatKey] >= (value ?? 0),
  );
  const hasFlags = !choice.requiresFlags || choice.requiresFlags.every(
    (flag) => state.flags.includes(flag),
  );
  return hasStats && hasFlags;
}

export function resolveNext(choice: Choice, state: GameState) {
  return typeof choice.next === 'function' ? choice.next(state) : choice.next;
}

export function requirementText(choice: Choice) {
  const parts = Object.entries(choice.requires ?? {}).map(
    ([key, value]) => `${statLabels[key as StatKey]} ${value}`,
  );
  if (choice.requiresFlags?.includes('captured-attacker')) {
    parts.push('a captured attacker');
  }
  return parts.join(', ');
}
