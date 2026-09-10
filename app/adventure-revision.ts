import type { Choice, StoryNode } from './game-data';

type NodeUpdate = Omit<Partial<StoryNode>, 'id' | 'choices'>;

export const adventureNodeUpdates: Record<string, NodeUpdate> = {
  'c2-arrival': {
    title: 'The Inn That Waited',
    location: 'Bellweather Inn, Eastmere Road',
    objective: 'Get the wounded inside before the creature in the flood reaches them.',
    lesson: {
      title: 'One dose remains',
      body: 'Medicine tracks the strong healing supplies carried by the group. Only one sealed dose survived the road. A later choice will show exactly who can receive it and what the dose can treat.',
    },
    introducesStoryTerms: ['mire hound'],
    body: (state) => [
      state.flags.includes('chose-silver-road')
        ? 'The hidden road rises from the flood beneath your boots. Bellweather Inn stands ahead on a low hill, its windows bright through the rain.'
        : state.flags.includes('chose-high-ground')
          ? 'The path from Rainwatch Hill descends to Bellweather Inn. A flooded ditch surrounds the yard, and warm light spills through the open door.'
          : 'Your Oath pulls toward each survivor as you lead the roped escort along the shallow road beneath the sea. The stones climb from the water beside Bellweather Inn.',
      state.flags.includes('treaty-safe')
        ? 'Mara supports Joren while Brann leads the horses. Lysara carries the sealed treaty chest with her injured hand bound against it. Tivik has found one dose of medicine, but the rest of your supplies are soaked.'
        : 'Mara supports Joren while Brann leads the horses. Lysara carries the cracked treaty chest with her injured hand bound against it. Tivik has found one dose of medicine, but the rest of your supplies are soaked.',
      'Your eyes move from the open door to Joren’s dragging foot, Nilo’s wagon, and the blood running from beneath Lysara’s sleeve. Sixteen strides of flooded yard might as well be a mile.',
      'A pale beast moves through the water behind you. Its back is ridged like a crocodile, but its long front legs reach for the road stones. It smells the blood of your wounded.',
      'An older woman opens the inn door and raises a crossbow at the pale beast. “Mire hound,” she says, giving the creature a name. “Captain Vey, get them inside. The Crown men who attacked you are coming back.”',
    ],
  },
  'c2-threshold': {
    title: 'Maelin Bellweather',
    location: 'Bellweather Inn, Front Step',
    objective: 'Choose how to bring the wounded through the unfamiliar doorway.',
    threat: 'Rising',
    body: (state) => [
      'The woman keeps the door open while your escort gathers beneath the narrow eaves. Her name is Maelin Bellweather. She has run this inn for thirty years and looks strong enough to throw out anyone who doubts it.',
      'Maelin spoke your name before seeing your badge. Your hand stays near your sword while rain runs cold between your shoulder blades.',
      state.flags.includes('c2-faced-creature')
        ? 'The mire hound remains in the flooded yard, fixed on the blood running down your shield. Your choice drew it away from every stretcher.'
        : state.flags.includes('c2-ordered-entry')
          ? 'The shield wall reaches the front step without losing a stretcher or leaving anyone alone in the water.'
          : state.flags.includes('c2-oath-found-child')
            ? 'Your Oath led Mara to Nilo before the mire hound could follow the smell of his reopened wound.'
            : state.flags.includes('c2-mara-led-entry')
              ? 'The mire hound snaps at the rain where Mara’s false trail leaves the flood. It searches the wrong side of the yard, buying Maelin time to keep the doorway open for the wounded.'
              : 'The mire hound circles beyond the eaves. It kept its distance while learning your scent and the sound of your shield.',
      state.flags.includes('captured-attacker')
        ? 'Brann guards your wounded prisoner beside the last wagon. The man is conscious enough to watch Maelin, and she looks as if she recognises him.'
        : 'Brann holds the last wagon at the step while Mara studies the dark common room beyond Maelin.',
      'A weak cough comes from beneath a wagon blanket. Nilo is pale, and blood has soaked through the cloth around his injured leg.',
      'Maelin follows your glance to Nilo. “A Warden called Jory said you would come,” she says. “He died waiting to tell you why.” A hunting horn sounds beyond the flooded yard before she can say more.',
    ],
  },
  'c2-triage': {
    title: 'Three Beds, One Bottle',
    location: 'Bellweather Inn, Common Room',
    objective: 'Stabilise the wounded before the attack begins.',
    body: (state) => [
      'Once the last traveller crosses the threshold, Maelin bars the door. The common room has already been cleared for the wounded. A dead Warden lies beneath a grey sheet near the stairs. This is Jory, the man who warned Maelin that you were coming.',
      state.flags.includes('captured-attacker')
        ? 'Brann ties your wounded prisoner beside the pantry. He gives his name as Garran when he sees Jory’s body. Nilo’s injured leg has gone cold below the knee, Lysara’s cut hand has begun to swell, and Garran is shaking with fever.'
        : 'A wounded attacker is already tied beside the pantry. Maelin found him crawling from the cellar at dawn. He gives his name as Garran and carries the same kind of sealed orders as the road attackers. Nilo’s injured leg has gone cold below the knee, Lysara’s cut hand has begun to swell, and Garran is shaking with fever.',
      'Joren lies near the hearth with the cut in his side cleaned and stitched. Maelin says the wound is painful but stable. He does not need the sealed medicine.',
      'The living magic belongs to Lysara’s glass seed. When it cracked beside the folded sea, a living shard cut her palm and carried green light into the wound. Her hand is how she guides the seed, so losing it would also cost her control of that magic.',
      state.stats.health <= 2
        ? 'Maelin sees the way you favour one side and presses two fingers against the blood beneath your coat. “You can command another fight,” she says. “You cannot survive one.”'
        : 'Maelin checks the cuts beneath your coat and decides they can wait until the three patients are stable.',
      'People move between the beds without a plan until Mara begins assigning clean cloth and water.',
      'The sealed medicine can save only one of them from the worst danger. Water, clean cloth, and steady hands must help the others.',
      'Your hand stops over each bed. Nilo may lose his leg, Lysara may lose her hand, and Garran may die before he can testify.',
      state.flags.includes('c2-carried-nilo')
        ? 'Because you carried Nilo directly to the fire, Maelin stopped the deepest bleeding early. He will survive without the bottle, although his leg remains in danger.'
        : 'Nilo lost more blood while the entrance was secured. He will live through the hour, but delaying treatment again may kill him.',
      'Mara removes her wet cloak and kneels beside Nilo. Her shirt clings to the strong curve of her shoulders, but her hands remain gentle as she presses cloth to the wound. “I can stop the bleeding,” she says. “Without the medicine, Tivik may have to take the leg.”',
      'A shutter jumps in its frame. Something outside has tested the wall.',
    ],
  },
  'c2-medicine': {
    title: 'The Last Clear Dose',
    location: 'Bellweather Inn, Makeshift Ward',
    objective: 'Decide who receives the only strong medicine.',
    body: (state) => [
      'Tivik places the small glass bottle in your palm. The liquid inside can close a deep wound, stop an infection, or draw dangerous magic out of injured flesh. There is enough for one patient.',
      state.flags.includes('c2-carried-nilo')
        ? 'Nilo’s bleeding has slowed because you carried him straight to the fire. He will live without the dose, but Tivik may still have to take the leg.'
        : 'Nilo’s bandage darkens again. He will live if the bleeding stays controlled, but the damage may still cost him the leg.',
      'Lysara tries to close her cut hand and cannot. Without the dose, she may lose the hand and her control of the living magic in the seed. That would also threaten the border treaty.',
      state.flags.includes('captured-attacker')
        ? 'Garran’s fever will kill him without the dose. His testimony may be the only proof strong enough to keep the Crown from executing you for the attack.'
        : 'Garran’s fever will kill him without the dose. He may be the only witness who can identify the person who ordered the attack.',
      state.flags.includes('c2-compressed-wound')
        ? 'Mara keeps one hand on the pressure bandage you tied together. Lysara hides her shaking fingers. Garran watches the bottle through the fever.'
        : state.flags.includes('c2-organised-care')
          ? 'The helpers give the clear reports you asked for. Nilo is still bleeding, Lysara cannot close her hand, and Garran’s fever is rising.'
          : 'Mara presses harder on Nilo’s bandage. Lysara hides her shaking fingers. Garran watches the bottle through the fever.',
      state.flags.includes('c2-lysara-led-care')
        ? 'Lysara has checked each wound herself. “Nilo’s leg, Garran’s life, my hand,” she says. “My title does not choose between them.”'
        : 'Lysara rests the cracked seed on her knee. “My hand guides the treaty magic,” she says. “That is a consequence, Captain, not an order.”',
      'Tivik pulls the cork loose and waits. “Name the patient, Captain.”',
    ],
  },
  'c2-eleven-years': {
    title: 'The Innkeeper Who Waits',
    location: 'Bellweather Inn, Hearth',
    objective: 'Understand Jory’s warning before the attackers return.',
    lesson: {
      title: 'Distance, not time',
      body: 'Something beneath Bellweather is pulling distant road ends beside the inn. The coast, fields, and inn still exist in the present. The damaged road briefly makes faraway places touch as if they were neighbouring rooms.',
    },
    body: (state) => [
      state.flags.includes('c2-demanded-answer')
        ? 'Jory’s warning is already in your hand. The writing resembles yours, but the words do not. It tells Maelin to shelter your party and open the cellar at midnight.'
        : 'Maelin gives you Jory’s warning. The writing resembles yours, but the words do not. It tells her to shelter your party and open the cellar at midnight.',
      'You set your map beside Jory’s warning. His shortcut begins two days east. The moonlit coast Maelin saw through her stable door lies many days west. Neither place came from another time. The damaged road pulled both entrances beside the inn.',
      'Three weeks ago, men in plain coats hammered iron hooks into the cellar floor. The stable door opened onto the moonlit coast for a few breaths, and Maelin’s husband stepped through before it closed. Those smaller tests moved one doorway briefly. They could not hold a whole road open.',
      'Since Dain vanished, Maelin has lit a lamp at his place every night and watched each strange road in case one brings him home.',
      'Jory died before he could explain what lies beneath the cellar or why the forged warning demanded your arrival. His message proves only that someone prepared the inn and expected your escort before you chose a route.',
      'Your eyes keep returning to Dain’s lamp. Maelin catches you looking and turns the wick higher, as if daring the road to claim that place forever.',
      'Maelin lays Jory’s broken arrow on the table. A silver crown is stamped into its head. “Help me stop whoever is coming,” she says, looking at Dain’s lamp. “Then we learn what they wanted from you.”',
    ],
  },
  'c2-investigate': {
    title: 'Three Ways to Find the Attackers',
    location: 'Bellweather Inn',
    objective: 'Find how the enemy plans to enter before nightfall.',
    body: (state) => [
      'Brann plants two tables against the front door. The wood jumps under the next blow, but the brace holds.',
      state.flags.includes('c2-tested-ledger')
        ? 'The ink and paper in Jory’s warning are real. The private Warden mark is not, giving you one forgery to compare with anything else you find.'
        : 'Jory’s false warning remains beside Maelin’s lamp. Its handwriting copies yours, but its source is still unknown.',
      'Maelin’s guest ledger may reveal who prepared the attack. The cellar may show what the enemy changed beneath the inn. Garran may identify the officer who paid him.',
      'You begin to order three search teams. Brann looks toward the wounded and the words die before they leave your mouth.',
      'A chain scrapes beneath the cellar. Garran coughs behind the pantry door. Maelin opens the ledger and pushes it toward you. “Pick one,” she says.',
    ],
  },
  'c2-ledger': {
    title: 'Names Written Before Blood',
    location: 'Bellweather Inn, Upper Hall',
    objective: 'Use the guest ledger to identify the enemy plan.',
    introducesStoryTerms: ['road pin'],
    body: () => [
      'The ledger shows six royal couriers stayed here during the last month. Five bought meals. Ordan Vale bought lamp oil, rope, butcher hooks, and every room facing the yard.',
      'A stable note says Ordan travelled with men wearing plain coats over royal armour. Your fingers flatten the page cut from the ledger; the pressure of its missing words remains on the sheet beneath it.',
      'Two words remain deep enough to read: road pin. The note calls it an iron anchor beneath the inn and lists a crew to pull it at midnight.',
      'Mara leans close while you angle the page toward the lamp. Her damp hair brushes your cheek. Her nail rests beneath the words route authority and green seed.',
      '“Route authority means your signed road order and Warden seal together,” Mara says. “He needed the captain and ambassador, not one exact route.”',
      'Below you, the pale beast strikes the back wall hard enough to shake dust from the beams.',
    ],
  },
  'c2-cellar': {
    title: 'Sabotage Beneath the Floor',
    location: 'Bellweather Inn, Cellar Steps',
    objective: 'Inspect the old road tunnel without letting the enemy inside.',
    introducesStoryTerms: ['road pin'],
    body: () => [
      'The cellar smells of wet earth and split ale. Behind the barrels, fresh tool marks lead to a stone arch sealed with an iron bracket.',
      'Cold air moves through the crack. For one heartbeat you hear gulls, although the nearest sea lies many days west. Tivik points to words stamped into the bracket: ROAD PIN. He says it is the anchor holding this mile in place, though the buried iron lies deeper in the tunnel.',
      'Your boots remain on cellar stone while gull cries pass through the crack. You press a thumb to the wet arch and taste salt when you touch it to your tongue.',
      'Boot prints cross the mud beneath the arch. The attackers already used the shifted road to reach the inn unseen. A rope tied to the bracket runs deeper underground.',
      'Someone above knocks over a chair. You have seconds to mark what matters before returning to the common room.',
    ],
  },
  'c2-attacker': {
    title: 'The Man Who Took Crown Silver',
    location: 'Bellweather Inn, Pantry',
    objective: 'Make Garran reveal who ordered the ambush.',
    introducesStoryTerms: ['road pin'],
    body: (state) => [
      state.flags.includes('c2-saved-attacker')
        ? 'The medicine has broken Garran’s fever. He sits tied to a flour post and watches Jory’s arrow with clear, frightened eyes.'
        : state.flags.includes('captured-attacker')
          ? 'Garran sits tied to a flour post. Fever beads on his face, but fear wakes him when you place Jory’s arrow on the table.'
          : 'The wounded man gives his name as Garran. Maelin tied him to the flour post after he crawled from the cellar. Fear wakes him when you place Jory’s arrow on the table.',
      '“Who paid you?” you ask.',
      '“Ordan Vale.” A cough folds Garran over the rope. “Silver gloves. Crown courier.”',
      'Mara holds water to his mouth. He takes one swallow before you ask why the escort had to reach Bellweather.',
      '“Not kill you. Hurt people. Make you need the nearest shelter.” Garran drags in a thin breath. “His first crews used hooks to open one doorway for seconds. They could not move the whole road.”',
      'You feel anger press against your ribs. Ordan turned every wounded traveller outside into a tool for moving this road.',
      'You ask what changed when your escort entered.',
      '“Your route authority. Signed order and Warden seal. Then the living magic in the elf’s glass seed.” He looks at the floor. “Both crossed the old stones. The locks woke. His tools could move the pin.”',
      '“He called it a road pin,” Garran adds. “Said the iron anchor keeps this mile tied to the right roads.”',
      'A second horn answers the first. Garran flinches toward the shutter. “Two bell strokes. Front attack is cover. The real crew goes below.”',
    ],
  },
  'c2-night-watch': {
    title: 'One Quiet Minute',
    location: 'Bellweather Inn, Upper Landing',
    objective: 'Prepare yourself and Mara before the siege begins.',
    threat: 'Immediate',
    body: (state) => [
      'You find Mara fastening leather around her forearm. Firelight warms her brown skin and catches on the rain still shining at her throat. She looks tired, dangerous, and very close.',
      state.flags.includes('planned-evening')
        ? 'At noon she promised a bath, a fire, and an opinion about you without the cloak. Her gaze drops to the mud and blood covering it now. “Not the evening I planned,” she says.'
        : state.flags.includes('flirted-mara')
          ? 'Her gaze travels over your torn mail with the same slow challenge she gave you at Eastwatch. This time the smile stops before it reaches her eyes.'
          : 'She pulls the final knot with her teeth, then leaves her fingers around your wrist for one heartbeat longer than the bandage requires.',
      state.flags.includes('c2-found-cellar-note') || state.flags.includes('c2-heard-mara-version')
        ? 'Mara taps the copied pressure marks inside your coat. “Ordan knew the cellar mattered,” she says. “We make that useful before he does.”'
        : 'Mara asks what you found. You give her the shortest answer the evidence allows.',
      'A crossbow string snaps in the yard. Your quiet minute is ending.',
      state.relationships.mara.trust >= 5
        ? '“You keep carrying everyone as if the road will forgive you for dropping yourself,” she says. Her fingers close around your wrist. “Tell me what you are afraid of before we walk back downstairs.”'
        : '“We have one minute before Brann calls us,” she says. “Use it to breathe, make a plan, or say whatever you keep refusing to say.”',
    ],
  },
  'c2-bell': {
    title: 'The Bell Rings Twice',
    location: 'Bellweather Inn, Common Room',
    objective: 'Read the enemy signal and put everyone in position.',
    body: (state) => [
      'The inn bell rings once. Maelin is nowhere near its rope. A moment later it rings again.',
      state.flags.includes('c2-attacker-route')
        ? state.flags.includes('c2-ordan-countersign')
          ? 'A soldier shouts Ordan’s private countersign after the second bell. Because Garran gave it to you, Brann turns two guards toward the cellar before the hidden crew arrives.'
          : 'Garran’s warning becomes clear: the first ring begins the attack, and the second sends a hidden group toward the cellar.'
        : state.flags.includes('c2-knows-bell-signal') || state.flags.includes('c2-cloak-double')
          ? 'The two strokes match the signal in Ordan’s stable note. Because you found it early, Brann already has guards facing the cellar.'
          : state.flags.includes('c2-knows-midnight-pattern')
            ? 'The copied ledger warned you that the attack would begin at midnight. Brann already has the wounded behind the inner tables.'
          : 'Brann calls out movement at the front while Mara hears wood breaking behind the pantry. The two rings have opened two sides of the attack.',
      state.flags.includes('c2-captain-promise')
        ? 'Mara catches your eye across the room. “You promised we leave together,” she calls. “Give me the part you cannot carry.”'
        : state.flags.includes('c2-shared-fear')
          ? 'Mara moves before you can look toward every danger at once. “One person at a time,” she calls, returning your own fear as a plan.'
          : 'Mara reaches the pantry before the second echo fades.',
      'Royal soldiers rush the front yard under dark cloaks. One cloak catches on the fence and tears open. Asterra’s crown shines beneath it, and the formation turns with the same drill you use at Eastwatch. Ordan has brought soldiers from your own kingdom.',
      'At the back wall, the pale mire hound climbs from the flooded ditch and drives its claws into the timber.',
      'A soldier in the yard shouts for the others to ignore the wounded and reach the cellar. Your attention drops from the blades at the front door to the chain scraping beneath the floor.',
    ],
  },
  'c2-common-room-crisis': {
    title: 'Hold the Inn',
    location: 'Bellweather Inn, Common Room',
    objective: 'Protect the wounded and stop the attackers reaching the cellar.',
    body: (state) => [
      'Crossbow bolts punch through the shutters. Brann’s guards brace tables against the front door while Maelin fires through a gap with calm, practised aim.',
      state.flags.includes('c2-held-door')
        ? 'Smoke pours from the pantry where you drove the mire hound back. It limps through a new split in the wall, its burned foreleg folding under each step.'
        : state.flags.includes('c2-oath-anchored')
          ? 'The inn shifts, but every living person remains a warm point in your awareness. You call two lost guards back before the moving hall can take them.'
          : state.flags.includes('c2-rope-line')
            ? 'The wounded remain behind a disciplined shield line. The mire hound reaches the pantry, but it cannot reach the beds.'
            : state.flags.includes('c2-found-pantry-entry') || state.flags.includes('c2-tracked-double')
              ? 'The mire hound strikes the pantry break you found earlier. Maelin’s braced shelves slow its long front legs, but its ridged body keeps forcing through. Its two low red eyes turn after the smell of blood.'
              : 'The mire hound tears through the pantry wall. Its pale, ridged body follows two long front legs through the gap. Two low red eyes turn after the smell of blood. Lysara throws green fire across its path, but the spell cannot hold it for long.',
      'The cellar chain jerks hard enough to lift a floorboard. Brann loses one table at the front door while the mire hound drives its head through the pantry gap.',
      'Mara catches the rising board with her boot. “I can clear the stairs,” she calls. Brann shouts your name from the failing barricade.',
    ],
  },
  'c2-descend': {
    title: 'Who Goes Below',
    location: 'Bellweather Inn, Broken Cellar Door',
    objective: 'Choose one companion and reach the buried iron before the Crown soldiers.',
    body: (state) => [
      state.flags.includes('c2-cellar-route')
        ? state.flags.includes('c2-has-pin-key')
          ? 'Brann can hold the common room. You must go below. The rope you cut has been replaced by an enemy chain that jerks through the broken arch.'
          : 'Brann can hold the common room. You must go below. The rope you found earlier is jerking through the broken arch as men in the tunnel pull at the buried iron.'
        : state.flags.includes('c2-ledger-route')
          ? 'Brann can hold the common room. You must go below. The rope listed among Ordan’s supplies now runs through the broken cellar arch and tightens around something buried in the road.'
          : 'Brann can hold the common room. You must go below. Garran’s warning leads you to the broken cellar arch, where an enemy chain is pulling at something buried in the road.',
      'Nilo cries out above you. Your hand tightens on the stair rail, but Brann meets your eyes and bars the way back with his shield.',
      state.flags.includes('c2-no-fight')
        ? 'The shield wall remains intact behind you. Brann has enough guards to hold the wounded line until you return.'
        : state.flags.includes('c2-shielded-descent')
          ? 'You forced a path without losing anyone in the pantry. Brann seals the gap behind you and keeps the attackers above.'
          : state.flags.includes('c2-united-versions')
            ? 'The hired blades who saw Ordan’s orders have lowered their weapons. Brann turns them toward the Crown soldiers and gains time to protect the wounded.'
            : state.flags.includes('c2-maelin-secret-path')
              ? 'Maelin’s service stair puts a stone wall between your group and the pantry fight. Brann can defend the wounded without guarding your descent.'
          : state.flags.includes('c2-left-supplies')
            ? 'The barricade bought a head start, although the soldiers will reach the medical supplies when it falls.'
            : 'Fighting continues above. Every person you take below leaves Brann with one less defender.',
      'Mara lights an arrow and watches the dark for movement. Lysara raises her glass seed; green light leaks between the bandages on her hand. Maelin tests the first step with the haft of her axe.',
      'Tivik ducks as plaster falls between all three women. “One companion,” he says. “Unless you want Brann defending the wounded by himself.”',
    ],
  },
  'c2-folded-cellar': {
    title: 'The Road Under the Inn',
    location: 'Bellweather Road Tunnel',
    objective: 'Cross the damaged tunnel before the enemy removes the buried iron.',
    body: (state) => [
      'The cellar arch opens into an old stone road beneath the inn. One side ends at a rain soaked field. The other touches a moonlit beach. Something below has dragged both road ends close, like ropes pulled through one ring.',
      state.flags.includes('c2-mara-below')
        ? 'Mara finds two soldiers hiding behind a broken cart and drops the first before he can shout. “The iron is ahead,” she says. “So is the rest of them.”'
        : state.flags.includes('c2-lysara-below')
          ? 'Lysara ties green thread to the wall. “This is not another time,” she says. “Only two distant places forced together. Follow the thread and we can return.”'
          : 'Maelin strikes the wall with her lamp hook. “That beam carries the inn,” she says. “Break it and we bury everyone. Step where I step.”',
      state.flags.includes('c2-tracked-stone')
        ? 'The chalk marks you made earlier remain on the proper Eastmere stones. The false beach road has no marks, giving the group one safe line forward.'
        : state.flags.includes('c2-compared-memories')
          ? 'Jory’s route and your map agree on one narrow turn. You recognise it before the moonlit beach can pull you away from the true tunnel.'
          : 'The joined roads look equally solid, so each step must be tested before the group follows.',
      state.flags.includes('c2-cellar-route')
        ? state.flags.includes('c2-has-pin-key')
          ? 'The mire hound drops into the tunnel behind you. Ahead, three soldiers drag the replacement chain attached to a black iron spike as tall as your arm.'
          : 'The mire hound drops into the tunnel behind you. Ahead, the rope you found is knotted to a chain. Three soldiers drag it from a black iron spike as tall as your arm.'
        : 'The mire hound drops into the tunnel behind you. Ahead, three soldiers drag a chain attached to a black iron spike as tall as your arm.',
      'The enemy chain bites into the spike and shifts it another finger width. The moonlit beach flashes white, then becomes a mountain ledge beneath your next step.',
    ],
  },
  'c2-road-pin': {
    title: 'The Iron That Holds the Roads',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Learn how to secure the pin while your companion holds the enemy back.',
    lesson: {
      title: 'The road pin',
      body: 'The iron pin is an ancient anchor. When it sits firmly in its stone socket, roads stay connected to the correct places. If it moves, distant road ends can be dragged together.',
    },
    body: (state) => [
      'The black pin leans halfway out of a round stone socket. Lines cut into the floor point toward Greyhaven, Harrowfen, the western sea, and lands you do not know.',
      state.flags.includes('c2-ledger-route')
        ? 'This is the road pin named in Ordan’s midnight note. The iron anchor is far larger than the two words made you imagine.'
        : state.flags.includes('c2-cellar-route')
          ? 'This is the road pin Tivik identified on the cellar bracket. Now you can see the buried anchor that bracket was meant to protect.'
          : state.flags.includes('c2-attacker-route')
            ? 'This is the road pin Garran warned you about. The black iron stands in front of you while soldiers drag it loose with a chain.'
            : 'Tivik calls the iron a road pin and explains that it anchors this mile to the roads around it.',
      state.flags.includes('c2-rope-path')
        ? state.flags.includes('c2-mara-below')
          ? 'The enemy chain gave you the fastest path. Two soldiers wait behind a broken cart. Mara keeps them off you, but a blade cuts her upper arm before her arrow drives them down.'
          : state.flags.includes('c2-lysara-below')
            ? 'The enemy chain gave you the fastest path. Two soldiers wait behind a broken cart. Lysara blocks them with green thread, but the strain opens the cut in her palm again.'
            : 'The enemy chain gave you the fastest path. Two soldiers wait behind a broken cart. Maelin holds them with her axe, but one blade cuts her shoulder before you reach the socket.'
        : state.flags.includes('c2-key-found-path')
          ? 'The iron latch opened a maintenance path around the ambush. No soldier reaches you, but the safer detour gives the enemy time for one more pull.'
          : state.flags.includes('c2-trusted-mara-path')
            ? 'Mara spots a boot edge behind the false wall and sends you around the ambush. Her arrow keeps the soldiers down while you reach the socket.'
            : state.flags.includes('c2-trusted-lysara-path')
              ? 'Lysara follows the green thread stored in her cracked seed. It bends around the false road and leads you to the socket before the mountain ledge falls.'
              : state.flags.includes('c2-trusted-maelin-path')
                ? 'Maelin reads the old support marks and finds the builders’ ledge. Her route keeps every foot on Bellweather stone while the false road drops away.'
                : 'Loose stones fall behind you. The slower approach leaves the enemy chain tight before you reach the socket.',
      'Each pull on the enemy chain moves the pin another finger width. When it shifts, the beach beside you becomes a mountain pass for a breath, then returns. Distance is breaking around the chamber.',
      state.flags.includes('c2-lysara-below')
        ? 'Two fresh lines glow around the socket. One answers your route authority, the signed order and Warden seal you carried inside. The other answers Lysara’s cracked seed beside you.'
        : 'Two fresh lines glow around the socket. One answers your route authority. The other stays green although Lysara is upstairs. Tivik says the old threshold stored her seed’s living magic when she crossed it.',
      'The first crews could tug the pin far enough to open one doorway for seconds. Once the two stored signatures woke its locks, Ordan’s chain could drag whole road ends together.',
      'Your route authority grows warm inside your coat. Ordan wounded your people because he trusted your duty to bring them through Bellweather’s door.',
      'A crown has been scratched into the pin. Beneath it are Ordan’s initials and a fresh map line pointing east toward Harrowfen.',
      'Across the chamber, a man in silver gloves tears a waxed map sheet from the wall. One soldier shouts, “Courier Vale, go.” Ordan disappears into the eastern service passage with the page.',
      'The enemy chain snaps tight again. Tivik wedges a hammer beneath the pin’s rim. “Questions after,” he says. “Drive it home.”',
    ],
  },
  'c2-remove-pin': {
    title: 'Drive It Home',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Reseat the road pin before the tunnel collapses.',
    body: (state) => [
      state.flags.includes('c2-mara-below')
        ? 'Mara’s arrows hold two soldiers behind the broken cart. When the mire hound lunges past them, she drives a burning shaft into the road before its long front legs.'
        : state.flags.includes('c2-lysara-below')
          ? 'Lysara stretches green thread across the arch. The mire hound follows the blood in her bandage and tangles its long front legs before it can reach you.'
          : 'Maelin strikes a cracked support with her axe. A beam falls between the mire hound and the socket, forcing its ridged body into the narrow side of the tunnel.',
      'Brann reaches the chamber with two guards. He left the remaining Wardens and the surrendered hired blades holding the wounded upstairs.',
      'They take the loose end of the enemy chain from a fallen soldier and hook it around the pin. Behind them, the rear supply wagon waits on Maelin’s old coach ramp.',
      'Tivik can knock the wagon’s axle free and use it as a hammer. If the axle breaks, the wagon and some supplies must remain at Bellweather.',
      state.flags.includes('c2-safe-removal')
        ? 'Because Tivik found the surviving locking tooth, he marks the eastern face. A strike there will guide the pin straight into its socket.'
        : 'No one knows which face will guide the pin cleanly. The chain can still pull it upright, but using the axle may also wreck the wagon.',
      'The soldiers haul from the far passage. Brann’s guards pull against them. The mire hound claws through the fallen beam as frost numbs your palms.',
    ],
  },
  'c2-last-testimony': {
    title: 'Proof in the Broken Stone',
    location: 'Bellweather Road Tunnel, After the Siege',
    objective: 'Choose the proof you will carry into Harrowfen.',
    threat: 'Rising',
    body: (state) => [
      'The effect is instant. The beach, mountain, and distant rain pull away. Two Crown soldiers tumble back onto the distant road they used, and the mire hound follows their blood scent through the closing gap. The last soldier on Bellweather stone drops his sword.',
      'Only the proper Eastmere tunnel remains. The main pin sits inside its socket, and a black sliver lies loose beside it. The sliver hums when you face east.',
      state.flags.includes('c2-command-repair')
        ? 'The timed pull left the pin whole and your people standing. Brann keeps the chain tight until Tivik confirms the socket is locked.'
        : state.flags.includes('c2-oath-repair-road')
          ? 'Your promise still burns through the road lines. The pin is seated, but the Oath now binds you to repair the damaged King’s Road.'
          : state.flags.includes('c2-caelan-injured')
            ? 'The pin is seated, but pain locks your back when you try to stand. Mara catches your arm before your knees reach the stone.'
            : 'The pin is seated and the chamber has stopped moving.',
      'You saw Ordan escape through the eastern passage with a waxed map page. He left his sealed orders, the crown cut into the pin, and the marks of both locks.',
      state.flags.includes('c2-proved-crown-tool')
        ? 'The damaged point in the crown mark matches Ordan’s seal. You wrap the marked rubbing with his orders so Harrowfen can compare them.'
        : state.flags.includes('c2-garran-named-quartermaster')
          ? 'Brann adds the name of the Warden quartermaster Garran exposed. The plot now reaches inside your own ranks.'
          : state.flags.includes('c2-crown-voice')
            ? 'Brann records Ordan’s private countersign beside Garran’s statement. A Crown court can test a detail the attackers should not know.'
            : 'Brann records the names and orders you can prove without adding guesses.',
      state.flags.includes('c2-offered-sable-safety')
        ? 'Your promise of protection still binds you. Garran will travel inside the guarded wagon, whether or not his fever lets him speak again.'
        : 'Garran travels as a guarded witness. No promise protects him beyond the law you can secure at Harrowfen.',
      state.flags.includes('c2-chain-ambush')
        ? state.flags.includes('c2-mara-below')
          ? 'Mara binds the shallow cut on her upper arm. She can still draw her bow, but the fastest path cost her blood.'
          : state.flags.includes('c2-lysara-below')
            ? 'Lysara wraps her palm again where the cut reopened. The fastest path put new blood through the old bandage.'
            : 'Maelin binds the shallow cut on her shoulder. The fastest path cost her blood, but her axe remains steady.'
        : 'Your companion reaches the quiet chamber without another wound.',
      state.flags.includes('c2-wagon-axle-lost') || state.flags.includes('c2-pin-broken')
        ? 'The broken axle lies beside the socket. The rear supply wagon cannot leave Bellweather, so Brann moves its food and blankets into the surviving carts.'
        : state.flags.includes('c2-wagon-lost')
          ? 'The supply wagon lies broken on the coach ramp. Brann saves what he can carry, but food, blankets, and spare rope must remain behind.'
          : 'The rear supply wagon remains intact on the coach ramp, ready to carry the wounded.',
      state.flags.includes('c2-left-supplies')
        ? 'After the last soldier surrenders, Brann tears down the table barrier. Most stores are safe, but boots crushed the remaining bandages and lamp oil.'
        : 'The stores that survived the flood remain with the escort.',
      state.flags.includes('c2-saved-nilo')
        ? 'Nilo keeps his leg, but Lysara’s hand remains bound and Garran may not survive the road to Harrowfen.'
        : state.flags.includes('c2-saved-lysara')
          ? 'Lysara can move every finger again. Tivik says Nilo’s damaged leg may still be saved after a long recovery, while Garran burns with fever.'
          : 'Garran is clear enough to testify. Lysara’s hand remains bound, and Tivik warns Nilo that saving his life may still cost the injured leg.',
      state.flags.includes('c2-felt-road-lives')
        ? 'The distant lives you felt through the pin still burn at the edge of your Oath. The iron pulls toward the next danger while Garran’s breath catches behind you.'
        : 'Maelin puts Jory’s warning in your left hand. Tivik wraps the iron sliver for your right. The survivors gather close enough to hear any Oath you choose to make.',
      state.flags.includes('c2-kept-crown-orders')
        ? 'You hand Brann the orders you kept inside your armour. He packs them with Jory’s warning while Mara adds every copied ledger page you recovered.'
        : 'Brann takes Garran’s sealed orders from the guarded evidence pouch and packs them with Jory’s warning. Mara adds every copied ledger page you recovered.',
      'Lysara secures the treaty chest, while Tivik ties the wrapped fragment inside your pack.',
      'Every piece of surviving evidence will travel to Harrowfen. Your next choice decides which proof the gate sees first.',
      'Above, the surviving attackers flee. Harrowfen should be several days away, yet Maelin can see its canal lights beyond the next hill. The broken fragment is still pulling that one road close.',
      'Brann looks from the papers to the wrapped iron, then to the waiting survivors. “Which one speaks first at a Crown gate?”',
    ],
  },
  'c2-ending-testimony': {
    title: 'The Witness Road',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Reach Harrowfen with witnesses to Ordan’s attack.',
    body: (state) => [
      state.flags.includes('c2-saved-attacker')
        ? 'You leave Bellweather with Jory’s false warning, Ordan’s supply record, and Garran awake enough to name him. The proof is plain enough for any guard to understand.'
        : 'You leave Bellweather with Jory’s false warning and Ordan’s supply record. Garran fades in and out of fever, so Mara guards every breath he may still use to testify.',
      'You put the papers inside your coat and keep Garran’s wagon in the centre of the column. The wrapped fragment remains tied inside your pack. Mara moves beside Garran’s exposed shoulder.',
      'Behind you, Maelin boards the broken wall while Brann protects the wounded. Ahead, Harrowfen’s towers rise beyond a field that should lead to three more days of road.',
      'Maelin leaves Dain’s lamp in the eastern window. She no longer waits beside it. She has given you his road journal and asked you to bring back an answer.',
      'The fragment in your pack pulls toward the town. At the eastern gate, royal archers turn their bows toward you. A silver gloved courier stands behind them.',
    ],
  },
  'c2-ending-pin': {
    title: 'Iron for the Crown',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Carry the broken road pin fragment safely into Harrowfen.',
    body: () => [
      'The iron fragment is heavy in your pack and warm whenever you face east. Lysara wraps it in living cloth, but its pull still shortens the road to Harrowfen.',
      'Each time you turn away from Harrowfen, the iron tugs against the pack straps and pulls your shoulders east.',
      'Mara checks the trees for Ordan’s scouts. “He wanted that piece,” she says. “He will not stop because we won one room beneath an inn.”',
      'Harrowfen appears after a single mile. Its gate closes, and royal archers raise bows above the canal wall.',
    ],
  },
  'c2-ending-oath': {
    title: 'A Promise Against the Crown',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Follow Ordan to Harrowfen and expose the Crown plot.',
    body: () => [
      'You swear that the Crown officer behind the attack will answer before the people he endangered. The promise settles into your chest as a steady flame.',
      'Brann repeats the promise first. Then Mara, Maelin, and the surviving Wardens take it up: reach Harrowfen, find Ordan Vale, and show the town what he did.',
      'Tivik ties the wrapped fragment inside your pack. Brann carries Jory’s warning and Garran’s sealed orders, while Lysara keeps the treaty chest close.',
      'Harrowfen waits only one mile east because the broken pin still pulls at its road. When the gate comes into view, Ordan is already on the wall, pointing at you and shouting the word traitor.',
    ],
  },
  'c3-arrival': {
    title: 'The Town at the Wrong Mile',
    location: 'West Gate, Harrowfen',
    objective: 'Enter Harrowfen before Ordan turns the town against you.',
    lesson: {
      title: 'Why Harrowfen is close',
      body: 'The broken iron fragment still pulls toward a larger piece hidden near Harrowfen. That shortens this one journey. The town has not moved through time, and there is only one version of it.',
    },
    body: (state) => [
      'Harrowfen rises after one mile. The chained fragment jerks toward its east market while your legs still ache from Bellweather.',
      state.flags.includes('c2-caelan-injured')
        ? 'The back injury from driving the pin home pulls tight with every step. You shorten your stride before anyone can mistake pain for hesitation.'
        : 'Your bruises have stiffened during the short march, but your balance holds when the fragment pulls again.',
      state.flags.includes('c2-wagon-lost')
        ? 'The wounded share the surviving blankets. Brann left spare food and rope at Bellweather when the supply wagon broke against the pin.'
        : state.flags.includes('c2-wagon-axle-lost') || state.flags.includes('c2-pin-broken')
          ? 'The rear wagon stayed at Bellweather, but Brann saved its food and blankets in the carts that remain.'
          : 'The supply wagon follows with the wounded and the evidence kept under guard.',
      'Each jerk pulls your road forward. That is why you reached a town that should still be many miles away.',
      'The city rises from black canals on timber walks and stone islands. Rope bridges join tall houses painted blue, red, and gold. Market boats crowd the water below the gate.',
      'Royal archers aim down at you. Ordan Vale stands on the wall in silver gloves. He holds the real route authority you signed in Greyhaven.',
      'Beside it is a royal warrant. It claims you used that mission to attack Bellweather and steal Crown iron.',
      state.flags.includes('c2-chose-testimony')
        ? state.flags.includes('c2-saved-attacker')
          ? 'Garran forces himself upright in the wagon and names Ordan before the entire wall. A hidden archer fires at him. Mara knocks the bolt aside, turning his testimony into immediate danger.'
          : 'Garran tries to name Ordan, but fever steals his voice. Mara raises Jory’s warning and the supply ledger instead. A hidden archer fires at the papers, proving someone on the wall fears them.'
        : state.flags.includes('c2-chose-pin')
          ? 'You unwrap the iron fragment. It pulls toward the east market so hard that its chains ring. The guards see proof of the danger, but several recoil from you for bringing the weapon inside bow range.'
          : state.flags.includes('c2-oath-expose-crown')
            ? 'You repeat your Bellweather Oath before the wall. Fire turns beneath your armour and pulls toward Ordan. He remains calm, but the royal warrant trembles in his hand.'
            : 'You keep your people still while Ordan reads the charges. Your discipline earns attention, but it does not clear your name.',
      'Behind you, Crown riders appear on the shortened road. Their lead horse breaks into a charge as the gate captain raises one hand above the winch.',
    ],
  },
  'c3-gate': {
    title: 'A Crime Signed in Your Name',
    location: 'West Gate, Harrowfen',
    objective: 'Earn limited entry without surrendering your wounded to Ordan.',
    body: (state) => [
      'Gate Captain Elene comes through the small door with twelve guards. The route authority is genuine. You signed it.',
      'Ordan has attached witness statements. They claim a captain in your red cloak robbed the archive, struck two residents, and used correct Warden commands.',
      'Your signature sits beneath his lies in the same hard strokes you have used on a hundred lawful orders. Your thumb covers the name, but the archers do not lower their bows.',
      state.flags.includes('treaty-damaged')
        ? 'He also displays the damaged treaty pages and calls them proof that you sacrificed peace to seize the road weapon. The damage came from your attempt to save lives, but frightened citizens cannot see that choice from a piece of torn paper.'
        : 'The treaty chest remains sealed, which weakens one charge. Ordan answers by naming the people hurt during the ambush and claiming your Oathfire caused the broken road.',
      'The lead rider gives the Third Road salute. You trained beside two of the badges behind him. They wear Asterra’s Crown, your own, yet they charge under Ordan’s private order while the young Queen lies ill. Elene touches the charter seal at her throat. Inside Harrowfen, even the Regent’s soldiers answer to her law.',
      'Elene does not trust Ordan, but she cannot ignore real signatures, wounded citizens, and a man who knew your commands. The service gate can take the wounded wagons and six armed escorts. No more.',
      'Hooves strike the shortened road behind you. Elene keeps her hand above the winch. “Give me one reason to spend Harrowfen lives on your word.”',
    ],
  },
  'c3-triage': {
    kicker: 'Three urgent leads',
    title: 'Three Leads, One Fugitive',
    location: 'Harrowfen, West Canal',
    objective: 'Choose the fastest way to find Ordan.',
    lesson: {
      title: 'Each lead gives different proof',
      body: 'The archive can provide written proof. The healing house holds a living witness. Varris knows Ordan’s escape route. Every lead can move the hunt forward, but each gives you a different advantage.',
    },
    introducesStoryTerms: ['Mileless Bridge'],
    body: () => [
      'Elene opens the service gate for the wounded wagons and six armed escorts. The remaining Wardens form a shield line outside. As the last wagon passes, she drops the iron gate between them and Ordan’s charging riders. The riders stop rather than attack a royal town gate, then spread along the outer canal to watch your people.',
      'Elene sends the wounded to a healing house under guard. Your weapons remain watched, your name remains accused, and Ordan leaves the wall before you can reach him. The closing gate shakes rain from your cloak. Your fingers find the cut seam where he planted his proof.',
      'The town archive holds the orders he filed. The healing house shelters Garran, the witness his soldiers may try to kill. Elene explains the third lead: one of her watchmen saw Ordan pay Varris, a road broker, for a route to the hidden Mileless Bridge.',
      'Elene points to three canal lanes. “Choose your door. I will hold the other two as long as I can.”',
    ],
  },
  'c3-archive': {
    kicker: 'Proof in the stove',
    title: 'The Map Ordan Wanted',
    location: 'Harrowfen Archive',
    objective: 'Recover the records Ordan tried to steal.',
    body: () => [
      'The archive is built above the canal on black oak posts. Inside, a clerk is feeding route records into a stove while a masked soldier watches the door.',
      'Your attention goes first to the open window, then the soldier’s sword hand, then the page curling in the heat. Proof can die here without spilling blood.',
      'Ordan requested maps of the Mileless Bridge, the east gate winch, and the oldest road marker in the market. Those three locations form a straight escape line across town.',
      'The soldier reaches for another page. Royal payment figures remain visible above his thumb. The paper browns as he moves it toward the stove.',
    ],
  },
  'c3-healer': {
    kicker: 'A witness under fire',
    title: 'The Witness in the Healing House',
    location: 'Harrowfen Healing House',
    objective: 'Keep Garran alive long enough to identify Ordan.',
    body: (state) => [
      'Garran is awake when a quarrel breaks the window above his bed. Mara pulls him to the floor as two plain coated soldiers force the back door.',
      state.flags.includes('c2-saved-attacker')
        ? 'The medicine kept his mind clear enough to name both intruders as Ordan’s personal guards.'
        : 'His fever is worsening. He can identify one intruder before his strength fails, which makes the next few breaths important.',
      'Healer Iven shouts for you to protect the children in the next room. Garran points at the other door and names Ordan’s personal guard. The attackers strike both doors together.',
      'For one heartbeat, wet timber becomes the two doors of the patrol you reached too late. Your sword hand locks. A child screams, and the healing house returns around you.',
      'Across the canal, a silver gloved figure watches from a blue balcony. Ordan wants to see whether his witness dies.',
    ],
  },
  'c3-broker': {
    kicker: 'A map with a price',
    title: 'The Seller of Secret Roads',
    location: 'Varris Road House, Harrowfen',
    objective: 'Learn where Ordan plans to escape.',
    body: () => [
      'Varris sells smuggler paths from a shop hung with painted doors. Most are ordinary maps disguised as fortune telling. One is not.',
      'A brass plate shows the Mileless Bridge, an ancient crossing hidden behind Harrowfen’s east market. Varris sold Ordan the opening word and two brass keys. One key vanished from Ordan’s coat before he left the shop.',
      'Varris smiles before you ask a question and never once looks directly at the iron in your pack. Your hand settles over the buckle while you let him keep talking.',
      'Varris remembers the thief: a young man in a dark coat who asked whether the bridge reached places that did not want visitors. He paid for a copied route with a purse Varris had not yet noticed was missing.',
      '“He paid in royal silver,” Varris says. “Then he threatened to cut out my tongue.” A knife moves behind the curtain. Ordan left someone to make that threat real.',
    ],
  },
  'c3-bill': {
    kicker: 'Ordan’s defence',
    title: 'The Man Behind the Warrant',
    location: 'Harrowfen, Lantern Bridge',
    objective: 'Make Ordan answer for Bellweather in front of Harrowfen.',
    body: (state) => [
      state.flags.includes('c3-route-archive')
        ? state.flags.includes('c3-caught-clerk')
          ? 'You reach Lantern Bridge with Ordan’s signed request, the last payment page, and the captured soldier who tried to burn them. A dark coated stranger has already cut one brass key from the evidence chain, but left the papers untouched.'
          : 'You reach Lantern Bridge with Ordan’s signed requests and royal payment record. A dark coated stranger has already cut one brass key from the evidence chain, but left the papers untouched.'
        : state.flags.includes('c3-route-healer')
          ? state.flags.includes('c3-sable-identified-guard')
            ? 'You reach Lantern Bridge with Garran’s identification and one of Ordan’s guards in chains. A dark coated stranger diverted the last crossbow bolt, then stole a brass key from the prisoner.'
            : state.flags.includes('c3-secured-healer')
              ? 'You reach Lantern Bridge with every patient alive. Garran cannot name the guard who escaped, but Healer Iven testifies that Ordan watched the attack from across the canal.'
              : 'You reach Lantern Bridge after Brann’s divided guard line trapped one intruder inside the healing house. The prisoner carries Ordan’s silver and a brass bridge key, though Garran was too weak to identify him.'
          : state.flags.includes('c3-unmasked-varris')
            ? 'You reach Lantern Bridge with Varris, Ordan’s written murder order, and the killer you disarmed. The evidence makes the broker willing to accuse Ordan in public.'
            : state.flags.includes('c3-tested-door')
              ? 'You reach Lantern Bridge with Varris and the true brass map you forced him to reveal. The map proves where Ordan intends to escape.'
              : 'You reach Lantern Bridge with Varris, the true bridge map, and proof that Ordan ordered the broker killed. The dark coated thief who took Ordan’s missing key is somewhere ahead.',
      'Ordan waits on the raised centre span with town guards and civilians watching from both banks. He argues that independent roads let smugglers, foreign armies, and border lords avoid Asterra’s defences.',
      state.flags.includes('c3-route-archive')
        ? 'Lysara reads Ordan’s signed route requests and royal payments aloud. The dates begin before your escort left Greyhaven. Ordan cannot dismiss his own signature, so he admits the papers and payments are his.'
        : state.flags.includes('c3-route-healer')
          ? 'Garran names Ordan as the man who paid for the Bellweather attack. The captured guard or Healer Iven confirms that Ordan watched the attempt to silence him. Ordan admits the men served under his sealed command.'
          : 'Varris holds up the brass bridge map and Ordan’s murder order. One proves Ordan bought the Mileless route. The other proves he meant to kill the seller. Ordan admits both orders came from his office.',
      'You place your signed route authority beside Lysara’s damaged glass seed where the crowd can see both. “He needed these beneath Bellweather,” you say. “He paid for the wounds that drove us there, then put Renn in my cloak to make the blood mine.”',
      'Elene hears the case against him, but Ordan’s soldiers still control the bridge winch. Smoke is already rising from the old watch house behind him.',
      '“One Crown road could reinforce every border before an invading army crosses it,” Ordan says. “You command people for their safety, Captain. You bind them with promises. I am willing to finish what men like you begin.”',
      'Your Oath scars tighten beneath your glove. You have ordered frightened people into danger and called it protection. Ordan notices the movement and smiles. He carries no matching scars.',
      'Only one part remains outside the evidence. Ordan forged the later papers, but he did not change the first order inside your sealed case. For the first time, his certainty slips. “That order came from above my office,” he says.',
    ],
  },
  'c3-evidence': {
    kicker: 'Ordan burns his trail',
    title: 'Fire at the Watch House',
    location: 'Harrowfen, Old Watch Lane',
    objective: 'Reach Ordan’s safe room before his men destroy the evidence.',
    body: (state) => [
      'Ordan drops from Lantern Bridge onto a waiting boat and reaches Old Watch Lane before the guards can lower the span. A boy in a courier coat stumbles from the lane with blood on his sleeve.',
      state.flags.includes('c3-challenged-crown-control')
        ? 'Elene’s guards seize the bridge winch after hearing the threat inside Ordan’s promise of safety. He escapes by boat, but loses control of the crossing.'
        : state.flags.includes('c3-centred-harrowfen-victims')
          ? 'Harrowfen’s residents block the royal soldiers from following Ordan. The people he dismissed as a necessary cost now buy you a clear path to the fire.'
          : 'Elene repeats Ordan’s confession and strips him of authority in Harrowfen. His own escort hesitates, forcing him to flee without the town guard.',
      'Smoke rolls from the watch house roof. Ordan’s men have set the building on fire and barred the lower door to destroy the records behind his argument.',
      'The courier boy falls against your knee, his satchel trapped beneath him. Above, fists strike a barred window. Across the roofline, Ordan clears the first gap.',
      'A burning beam drops between the boy and the stairs. Mara reaches for one end and shouts, “Caelan!”',
    ],
  },
  'c3-watch-house': {
    title: 'Orders in the Smoke',
    location: 'Harrowfen, Burning Watch House',
    objective: 'Recover Ordan’s plan and escape the fire.',
    body: (state) => [
      'The safe room is real wood, real smoke, and real danger. Inside, hooks, chains, and route maps cover a table. Ordan planned to steal your fragment, seize Harrowfen’s east gate, and open the Mileless Bridge for hidden Crown soldiers.',
      state.flags.includes('c3-reached-house-first')
        ? 'You arrived before the last route order burned. It names the east arch and orders six bridge guards to wait for Renn’s signal.'
        : state.flags.includes('c3-closed-roads')
          ? 'The gate horns sound through the smoke. With every ordinary road closed, Ordan must reach the east arch on foot.'
          : 'Fire has taken the final route order. You know Ordan is heading east, but not how many guards wait there.',
      'One order also names a corrupt Warden officer called Captain Renn. Renn carries one of your spare red cloaks and has been told to commit the attack in your name.',
      'You remember issuing that cloak to a young guard during a winter patrol. The thought of Renn wearing it turns the smoke bitter in your mouth.',
      'The ceiling cracks. The courier list curls beside the stove, a bound town scout kicks at his chair, and the bridge opening word glows red at the edge of the desk.',
    ],
  },
  'c3-divided-loyalty': {
    title: 'What Comes First',
    location: 'Harrowfen, Bathhouse Roof',
    objective: 'Choose how your group will protect the town and continue the hunt.',
    body: (state) => [
      'For a few minutes, the bathhouse roof gives you distance from the smoke. Below, Mara watches the wounded streets. Lysara studies Ordan’s route map.',
      state.relationships.mara.attraction >= 4
        ? 'Mara steps close enough that her hip touches yours. Smoke has darkened her cheek, and her breath is still quick from the fire. Her eyes stay on your face. “When this is over,” she says, “I want one night where neither of us has to listen for a horn.”'
        : 'Mara rests her shoulder against yours. Lysara keeps her eyes on the map. Both wait for you to choose which danger comes first.',
      state.stats.health <= 2
        ? 'Mara’s hand closes around your wrist when your balance shifts. Lysara looks from the blood on your sleeve to the burning market. Neither woman says retreat. Both understand that another direct charge may be your last.'
        : 'Smoke stings your lungs, but the brief pause steadies your legs before the market fight.',
      'Mara marks the healing house with one bloody finger. Lysara moves the same finger east along Ordan’s route. There are not enough guards to cover both marks without splitting the exhausted line.',
      'Mara looks down at the streets. “Garran will not survive another attack.” Lysara’s hand stays on the map. “If Ordan reaches that marker, this healing house could become the entrance to an army road.”',
    ],
  },
  'c3-market-memory': {
    kicker: 'Steel among the market boats',
    title: 'Battle in the Canal Market',
    location: 'Harrowfen East Market',
    objective: 'Protect the market and stop Ordan reaching the bridge marker.',
    body: (state) => [
      'Ordan’s hidden soldiers attack among fruit boats and hanging lanterns. They cut two rope bridges, overturn a fish cart, and drive civilians toward the canal.',
      state.flags.includes('c3-took-future-cloak')
        ? 'The scout you freed leads the wounded along a roof walk that avoids the first broken bridge.'
        : state.flags.includes('c3-balanced-plan')
          ? 'Mara’s guards move the wounded while Lysara keeps the iron covered. Your divided group reaches the market without surrendering either duty.'
          : 'The wounded enter the market behind you, forcing Mara and Lysara to divide their attention.',
      'At the centre of the market, Captain Renn wears your red cloak and shouts orders in your name. Town guards hesitate because they cannot tell which captain is the traitor.',
      'Renn gives your command to fire. Your sword clears half its sheath before a fruit seller stumbles between you. You shove the blade home and search for a path through the civilians.',
      'High above them, the dark coated thief swings from a dye merchant’s rope. He catches a falling child with one arm and sets her safely on a balcony. For one breath, saving her takes all his attention.',
      'Renn shouts your command again, pulling every town guard’s eyes toward the false cloak. The thief uses that moment to lift a silver key from one of Ordan’s guards.',
      'As he swings past Mara’s shield, you clearly see him hook a fine wire beneath the fragment’s leather strap. Only then does he follow Ordan across the roofs.',
      'The fragment tears through its wrapping. For a few seconds, one market street connects to a snowy mountain pass. Cold wind and snow burst between the stalls. The road returns when Mara slams the fragment under a shield.',
      'Lysara pins the wrapping beneath Mara’s shield. “Joined to the larger piece,” she calls, “that iron could pull an army road straight into Harrowfen.”',
    ],
  },
  'c3-pin-test': {
    kicker: 'Two captains, one cloak',
    title: 'The False Captain',
    location: 'Harrowfen East Market',
    objective: 'Expose Renn before Ordan steals the fragment.',
    body: (state) => [
      'Captain Renn faces you across the market in your spare red cloak. He knows Warden commands, carries a copied seal, and has already ordered two town guards to arrest Mara.',
      state.flags.includes('c3-saved-market-crowd')
        ? 'The main crowd is already clear, and Renn’s disguised soldiers stand exposed in royal armour.'
        : state.flags.includes('c3-saved-market-children')
          ? 'The children’s mother opens a narrow boat passage beside the well. Mara uses it to move your group behind Renn’s line.'
          : 'Civilians remain between the two captains, giving Renn cover and making every attack dangerous.',
      'Renn’s sword point shakes inside the guard position you were taught together. He is no monster, only a frightened Warden wearing ambition over fear.',
      'You have seen that same tremor before good soldiers made terrible choices. Renn sees recognition in your face and raises the blade higher.',
      'Behind him, Ordan circles toward the well. Mara’s eyes drop to the hidden mark inside Renn’s cloak while heat gathers beneath your Oath scars.',
    ],
  },
  'c3-duplicate': {
    kicker: 'A uniform bought with silver',
    title: 'A Warden Bought by Silver',
    location: 'Harrowfen East Market',
    objective: 'Defeat Renn and learn Ordan’s final plan.',
    body: (state) => [
      'His orders say the Mileless Bridge leads to many borders. With the joined iron pieces, Ordan could move soldiers across the world without crossing the lands between them.',
      state.flags.includes('c3-faced-double-alone')
        ? 'Renn meets your challenge between the market stalls. His copied stance is accurate, but he watches your sword instead of the civilians behind you. Elene notices the difference.'
        : state.flags.includes('c3-mara-flanked-double')
          ? 'Mara cuts open the cloak lining and holds up the armourer’s mark from your missing spare. Elene sees that Renn is wearing stolen proof, but he still has a sword and Ordan’s soldiers around him.'
          : 'Your public Oath burns across your armour. Renn cannot answer it with a promise of his own. He draws his sword before the town guards can close around him.',
      'Renn steps across the road to the well. Behind him, Ordan slips between two market boats while Harrowfen’s guards wait for one captain to lower his blade.',
      'Renn’s courage shakes, but his blade stays raised. “Ordan promised the Wardens would command every road in the kingdom,” he says.',
    ],
  },
  'c3-courier': {
    title: 'Silver Gloves at the Well',
    location: 'Harrowfen East Market',
    objective: 'Stop Ordan escaping with the iron fragment.',
    body: (state) => [
      state.flags.includes('c3-double-yielded')
        ? 'Renn drops his sword and names Ordan as the officer who paid him. He also warns that the dark coated thief is Ordan’s rival, not his ally.'
        : state.flags.includes('c3-double-disarmed')
          ? 'You put Renn on the stones before he can signal. Elene’s guards bind him and turn on the royal soldiers still following Ordan.'
          : 'Renn gives up Ordan’s bridge plan under pressure. Elene’s guards pull him away from the road before he can recover his command.',
      'Only after Renn is defeated do Harrowfen’s bells declare Ordan’s warrant false. Elene reopens the west service gate for your remaining Wardens and wagons. Ordan’s riders either surrender their weapons or withdraw along the canal. Your name is not clean everywhere, but this town has seen which captain protected it.',
      'Ordan holds the fragment in one silver glove and a small bridge key in the other. He is lean, clean shaven, and calm enough to look harmless until he smiles.',
      'A burned rope drops beside Ordan and crushes a fleeing soldier. His eyes measure the blocked path before they touch the body. The calm smile never moves.',
      state.flags.includes('c3-double-disarmed')
        ? 'Renn never sent his warning. Only two bridge guards reach Ordan before Harrowfen’s soldiers close the market behind them.'
        : state.flags.includes('c3-routed-ordan-plan')
          ? 'Renn’s confession tells you exactly where Ordan means to join the fragment to the larger shard.'
          : 'Six bridge guards answer Ordan’s hand signal from the eastern roofs.',
      '“Harrowfen chose one captain today,” he says. “When every road belongs to the Crown, towns will no longer get that choice.” Then he throws a fire flask into the market ropes.',
      'The first bridge burns. The second collapses under fleeing people. Ordan runs for the east arch while his last soldiers cover him.',
    ],
  },
  'c3-collapse': {
    title: 'The Burning Bridges',
    location: 'Harrowfen East Canal',
    objective: 'Choose what you refuse to lose during the pursuit.',
    body: (state) => [
      'Burning rope falls into the canal. A bridge strikes the healing house balcony and traps patients above the water. Ordan reaches the final market arch with the fragment.',
      state.flags.includes('c3-cut-silver-glove')
        ? 'The silver glove hangs open where your blade cut it. Ordan can still open a road, but he can no longer close it behind him.'
        : state.flags.includes('c3-broke-escape-road')
          ? 'The archers forced Ordan onto the narrow canal crossing. His remaining guards must follow one at a time.'
          : state.flags.includes('c3-marked-ordan')
            ? 'Blue dye shines through the smoke and keeps Ordan visible, although his undamaged glove still controls the fragment.'
            : 'Smoke hides Ordan whenever he crosses a roof, and his silver glove keeps the fragment steady.',
      'A patient reaches through the broken balcony rail. Ordan reaches the far roof. Between them, the last sound bridge begins to split.',
      'Mara runs toward the trapped patients. Elene points after Ordan. Heat gathers beneath your breastplate, waiting for words.',
    ],
  },
  'c3-pursuit': {
    title: 'The Hidden Road East',
    location: 'Harrowfen, East Arch',
    objective: 'Prepare for the Mileless Bridge and follow Ordan.',
    body: (state) => [
      'Beyond the arch, an ancient bridge curves into mist. Its first span hangs over Harrowfen’s canal. Farther spans appear beneath unfamiliar skies, each touching a distant border.',
      'Your first step stops at the sight of six skies sharing one curve of stone. Then a line of armoured figures crosses one distant arch, and your hand closes around your sword.',
      '“Only distance is changing,” Lysara says. “Ordan can choose which far border touches the next span.”',
      state.flags.includes('c3-burned-future-room')
        ? 'Because you burned the opening word, Ordan must stop at the arch and force a brass key into its lock. The delay lets your group reach the bridge before he can disappear.'
        : state.flags.includes('c3-kept-close')
          ? 'Because you stayed close, Ordan has only moments at the arch. His hurried route leaves the first span visible.'
          : state.flags.includes('c3-oath-hold-town')
            ? 'Your Oath holds Harrowfen behind you and burns toward the span Ordan touched. The town is safe while the pursuit remains tied to your promise.'
            : state.flags.includes('c3-saved-healing-house')
              ? 'The rescued patients are safe with Elene, but Ordan used the time to hide his first span among seven moving arches.'
        : state.flags.includes('c3-bridge-record')
          ? 'Lysara compares the bridge with the route she copied. Seven arches move, but the marked first span stays fixed long enough to cross.'
          : 'Ordan reaches the moving arches with enough time to hide which span he opened first.',
      'Mara steps onto the nearest span with her blade ready. Lysara knots green rope around the first post. The Oath beneath your armour pulls toward the path Ordan used.',
    ],
  },
  'c3-world-nail': {
    title: 'The World Nail',
    location: 'The Mileless Bridge',
    objective: 'Understand the threat, then choose your target.',
    introducesStoryTerms: ['World Nail'],
    lesson: {
      title: 'Joined road pins',
      body: 'Broken road pins can be fitted together. Joined fragments can briefly connect chosen roads, which is why Ordan can use them to move soldiers.',
    },
    body: (state) => [
      'Lysara names the iron at last. “World Nail,” she says. “Old stories say it fixed distance in place when the world was young. These road pins are broken pieces of it.”',
      state.flags.includes('c3-oath-trail')
        ? 'Your Oath leads the group across the correct spans without delay. You reach Ordan before the hidden soldiers can finish forming ranks.'
        : 'The moving spans cost precious time. The first rank of hidden soldiers is already crossing when you reach Ordan.',
      'Ordan presses your fragment against a larger shard set into the bridge. An arch opens onto ranks of Asterra’s royal soldiers waiting on a hidden road. They belong to your kingdom, but you do not know how many understand what Ordan intends to do with them.',
      'Asterra’s crowned shields fill the opening. Ordan points past Harrowfen toward a second arch showing a foreign border fort. “First rank forward,” he orders. You strike his arm while Lysara tears the iron pieces apart with living thread. The road closes before the first crowned shield reaches Harrowfen.',
      'The dark coated thief drops from the arch above. Ordan turns toward the sound, giving the stranger the one clear moment he needs.',
      'The thief pulls the wire you saw him plant in the market. The fragment leaps from Ordan’s belt into his sleeve. “Good news,” he says. “Your road works. Bad news, I need it.”',
      'Ordan draws his sword. The thief runs toward the broken centre with the fragment. Behind you, Harrowfen’s guide rope slips another handspan through its knot.',
    ],
  },
  'c3-ending-courier': {
    title: 'The Courier’s Last Road',
    location: 'The Mileless Bridge',
    objective: 'Catch Ordan before he reaches his hidden soldiers.',
    body: (state) => [
      'You cross the first arch and close on Ordan. His eyes flick once toward the fragment vanishing with the thief, then return to your blade. Your hand tightens around the rain slick hilt.',
      state.flags.includes('c3-pursuit-mara')
        ? 'Mara lands beside you with her blade ready. “He is yours,” she says. “I will keep his soldiers off your back.”'
        : 'Lysara’s green rope holds behind you, thin but visible across the mist.',
      'The thief disappears around the broken centre of the bridge. Ordan draws a royal blade and gives one final order. Soldiers step from an arch beneath a desert sun and surround you.',
    ],
  },
  'c3-ending-thief': {
    title: 'The Hand on the Fragment',
    location: 'The Mileless Bridge',
    objective: 'Stop the unknown thief escaping with the World Nail fragment.',
    body: (state) => [
      'You leave Ordan’s path and race across a narrow arch above a red desert. The thief glances back, surprised that you can keep up.',
      'Ordan’s shouted orders fade behind you. The iron flashes beneath the thief’s coat ahead, each stride carrying it closer to the broken centre.',
      state.flags.includes('c3-bridge-warning')
        ? 'Renn’s warning returns to you: this thief opposes Ordan, but wants the iron for a reason of his own.'
        : '“Captain,” the thief calls, “I stole it from the villain. That usually earns applause.”',
      'Ordan orders his soldiers to fire. The thief throws the fragment over the gap. You dive and catch it, then feel a smooth mirrored coin in your palm. The real iron flashes between his fingers. “That was the rehearsal,” he says as the stone breaks beneath both of you.',
    ],
  },
  'c3-ending-return': {
    title: 'A Rope Back to Harrowfen',
    location: 'The Mileless Bridge',
    objective: 'Keep the bridge connected to Harrowfen while the hunt continues.',
    body: (state) => [
      'Your spike holds the green rope to the first arch. The next spans cross distant skies, but the way back remains tied to Harrowfen.',
      state.flags.includes('c3-oath-hold-town')
        ? 'Your Oath burns with steady heat. The town is safe from the army road for now, and your promise gives every guard behind you courage.'
        : 'Mara tests the knot and nods. Lysara marks the arch so Elene’s guards can follow.',
      'Ahead, the dark coated thief already carries the fragment he pulled from Ordan with the wire you saw in the market. He runs toward the broken centre while Ordan and his soldiers chase him. The guide rope holds behind your hand, but the next arch is already turning away.',
    ],
  },
};

export const adventureChoiceUpdates: Record<string, Partial<Choice>> = {
  'question-prisoner': {
    detail: 'Use the captive you earned earlier to confirm how the ambush was prepared.',
    changes: { command: 1 },
    addFlags: ['confirmed-advance-orders', 'prisoner-described-three-plans'],
  },
  'turn-west': {
    detail: 'Preserve your remaining strength and seek Greyhaven’s walls, but turn away from the treaty mission.',
    changes: {},
  },
  'c2-oath-guided-entry': {
    result: 'Your Oath draws you toward Nilo beneath a wagon blanket. The wound in his leg has reopened.',
  },
  'c2-lead-water': {
    result: 'You keep your shield toward the water until the last horse reaches mud. Two low red eyes follow the blood running down the shield.',
  },
  'c2-guard-rear': {
    addFlags: [],
    result: 'The mire hound keeps its distance while it learns your scent. One claw cuts a red line into the final road stone.',
  },
  'c2-carry-first': {
    result: 'You carry Nilo directly to Maelin’s fire and hold his wound closed while Brann brings the final wagon through the doorway.',
  },
  'c2-search-threshold': {
    changes: { command: -1 },
    requires: { command: 1 },
    addFlags: ['c2-searched-inn'],
    result: 'Mara clears the doorway, traces fresh scratches on the cellar door, and stops beside a grey sheet near the stairs. “One body,” she says. “Warden cloak.” Only then does she signal Brann forward.',
  },
  'c2-medicine-lysara': {
    label: 'Give the medicine to Lysara.',
    detail: 'Spend 1 Medicine. Save her hand and her ability to guide the seed’s living magic.',
    result: 'The swelling leaves Lysara’s hand. Green light withdraws from the wound into the cracked seed, and she closes her fingers around yours. “I know what this cost.”',
  },
  'c2-medicine-nilo': {
    label: 'Give the medicine to Nilo.',
    detail: 'Spend 1 Medicine. Save his injured leg from permanent damage.',
    result: 'Warmth returns below Nilo’s knee. Tivik grips the boy’s hand and finally says that the leg can be saved.',
  },
  'c2-medicine-attacker': {
    label: 'Give the medicine to Garran.',
    detail: 'Spend 1 Medicine. Preserve the witness who may keep the Crown from condemning you.',
    result: 'Garran’s breathing steadies. “Get me before a town guard,” he says, “and I will name the man in silver gloves.”',
  },
  'c2-ledger-route': {
    label: 'Read the guest ledger with Maelin.',
    detail: 'Spend 1 Resolve. Secure written evidence of who prepared the inn before the attack.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    addFlags: ['c2-ledger-route'],
    result: 'The ledger points to Ordan’s unusual purchases and the rooms he reserved around the yard.',
  },
  'c2-cellar-route': {
    label: 'Inspect the shaking cellar with Tivik.',
    detail: 'Spend 1 Health. Search the most dangerous part of the building without earlier preparation.',
    changes: { health: -1 },
    requires: { health: 1 },
    hideIfAnyFlags: ['c2-searched-inn'],
    addFlags: ['c2-cellar-route'],
    result: 'A loose step rolls beneath your boot. You wrench your knee clear and spend precious strength bracing the moving stair for Tivik.',
  },
  'c2-cellar-route-prepared': {
    changes: {},
    requires: undefined,
    requiresFlags: ['c2-searched-inn'],
    showIfAllFlags: ['c2-searched-inn'],
    addFlags: ['c2-cellar-route'],
    result: 'The scratches lead to a loose step. Tivik braces it before either of you puts weight on the moving stone below.',
  },
  'c2-question-name': {
    label: 'Ask who warned Maelin about you.',
    detail: 'Get the facts before trusting the message. Gain 1 Resolve.',
    changes: { resolve: 1 },
    addFlags: ['c2-demanded-answer'],
    result: 'Maelin shows you Jory’s false warning and the royal arrow that killed him.',
  },
  'c2-believe-maelin': {
    label: 'Accept Maelin’s account and study Jory’s warning.',
    detail: 'Trust the innkeeper and focus on the forgery.',
    addFlags: ['c2-trusted-maelin'],
    result: 'Maelin gives you the false order. Its handwriting copies yours, but its language does not.',
  },
  'c2-compare-memories': {
    label: 'Compare Jory’s route with your own map.',
    detail: 'Spend 1 Resolve to understand how he arrived first.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    result: 'Your maps and the matching lightning strike settle one fact: nobody lost or gained time. A distant road was pulled beside Bellweather, and one narrow turn still matches the proper Eastmere route.',
  },
  'c2-test-book': {
    label: 'Test the warning against the Warden code.',
    detail: 'Use training to expose the forged order.',
    result: 'The warning uses the wrong private mark. Someone copied your hand without learning your habits.',
  },
  'c2-copy-pattern': {
    label: 'Copy Ordan’s purchases and travel dates.',
    detail: 'Take written proof, but spend time doing it carefully.',
    result: 'You preserve a record linking Ordan to rope, oil, hooks, and royal soldiers before the siege.',
  },
  'c2-ask-missing-mara': {
    label: 'Ask Mara to read the missing page marks.',
    detail: 'Spend 1 Resolve. Work close together to recover the cut writing before the attack.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    addFlags: ['c2-found-cellar-note', 'c2-found-road-pin-term'],
    result: 'Mara reads enough of the pressure marks to find Ordan’s note about the cellar entrance.',
  },
  'c2-study-cloak-version': {
    label: 'Study the stable note about plain cloaks.',
    detail: 'Learn how royal soldiers plan to hide among travellers. Gain 1 Resolve.',
    changes: { resolve: 1 },
    addFlags: ['c2-cloak-double', 'c2-knows-bell-signal', 'c2-found-road-pin-term'],
    result: 'You learn the attackers wear dark travel coats over royal armour and use the bell as their signal.',
  },
  'c2-mark-moving-stone': {
    label: 'Mark the proper Eastmere stones.',
    detail: 'Prepare a safe route through the damaged tunnel.',
    result: 'Your chalk marks separate the true tunnel from the distant road pulled beside it.',
  },
  'c2-break-bracket': {
    label: 'Cut the enemy rope from the iron bracket.',
    detail: 'Spend 1 Health to slow their pull on the road pin.',
    changes: { health: -1 },
    requires: { health: 1 },
    addFlags: ['c2-has-pin-key', 'c2-found-road-pin-term'],
    result: 'The rope snaps. You wrench the bracket’s iron latch free with it; the latch is shaped like a heavy key. The attackers must reach the pin chamber and attach another chain.',
  },
  'c2-follow-footsteps': {
    label: 'Follow the fresh boot prints.',
    detail: 'Spend 1 Resolve. Learn where the attackers entered while moving closer to danger.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    addFlags: ['c2-found-pantry-entry', 'c2-found-road-pin-term'],
    result: 'The prints lead from the shifted coastal road to a concealed break in the pantry wall.',
  },
  'c2-demand-employer': {
    label: 'Demand proof that Ordan gave the order.',
    detail: 'Spend 1 Resolve. Gain a detail only Ordan’s courier office could confirm.',
    changes: { resolve: -1, command: 1 },
    requires: { resolve: 1 },
    addFlags: ['c2-crown-voice', 'c2-ordan-countersign', 'c2-found-road-pin-term'],
    result: 'Garran repeats Ordan’s private countersign and describes the silver gloves that never left his hands. Brann writes down every word.',
  },
  'c2-offer-protection': {
    label: 'Offer Garran protection for the names of Ordan’s helpers.',
    detail: 'Make a normal promise and learn how deeply the plot reaches into the Wardens.',
    changes: {},
    addFlags: ['c2-offered-sable-safety', 'c2-garran-named-quartermaster', 'c2-found-road-pin-term'],
    result: 'Garran studies your face before naming a Warden quartermaster who supplied the dark cloaks. “Ordan has people inside your ranks,” he says.',
  },
  'c2-take-orders': {
    label: 'Take Ordan’s orders and let Garran rest.',
    detail: 'Preserve physical evidence instead of risking the witness for another answer.',
    result: 'You slide the sealed pages inside your armour. Garran closes his eyes, but his breathing stays steady.',
  },
  'c2-anchor-people': {
    label: 'Put every guard between the attackers and the wounded.',
    detail: 'Spend 1 Command to protect people while leaving fewer blades for the cellar.',
    result: 'The wounded remain behind a disciplined shield line, but soldiers reach the cellar stairs.',
  },
  'c2-order-no-fight': {
    label: 'Command every Warden to protect the wounded line.',
    detail: 'Spend 2 Command. Turn scattered defenders into one disciplined shield wall.',
    result: 'Your voice cuts through the battle. Brann forms the line while Mara clears the cellar door.',
  },
  'c2-show-orders': {
    label: 'Show Ordan’s orders and name the real target.',
    detail: 'Use the written evidence to turn frightened attackers against their employer.',
    result: 'The nearest hired blades recognise the Crown wax. Several lower their weapons rather than die for Ordan.',
  },
  'c2-protect-current-group': {
    label: 'Form a shield line and force a way to the cellar.',
    detail: 'Spend 1 Health. Push through the pantry fight without defeating every attacker.',
    result: 'Shields strike armour. Your group reaches the cellar stairs while Brann holds the line behind you.',
  },
  'c2-hold-door': {
    label: 'Hold the broken pantry against the mire hound.',
    detail: 'Spend 2 Health and keep the beast away from the wounded.',
    result: 'You drive the mire hound back with shield and fire while Brann secures the room.',
  },
  'c2-give-maelin-key': {
    label: 'Ask Maelin to open her hidden service stair.',
    detail: 'Use the trust you earned and let the innkeeper choose a path through her own building.',
    changes: {},
    requires: undefined,
    requiresFlags: ['c2-trusted-maelin'],
    addFlags: ['c2-maelin-secret-path'],
    result: 'Maelin opens a narrow service stair, giving you a route below that avoids the pantry fight.',
  },
  'c2-block-versions': {
    label: 'Block the cellar stairs with tables and iron hooks.',
    detail: 'Spend no stat. Delay the soldiers, but leave the medical stores on their side of the barrier.',
    changes: {},
    requires: undefined,
    advantage: 'The barrier should buy enough time to choose a companion without spending a resource.',
    addFlags: ['c2-left-supplies'],
    result: 'The barrier buys time to choose a companion. Food, blankets, and the remaining medical stores are trapped on the soldiers’ side.',
  },
  'c2-take-maelin': {
    label: 'Take Maelin through the tunnel beneath her inn.',
    detail: 'Bring the person who knows its supports, locks, and hidden stairs.',
    result: 'Maelin grips her axe and lamp. “About time,” she says, and leads the way down.',
  },
  'c2-use-rope-path': {
    label: 'Follow the enemy chain toward the pin.',
    detail: 'Take the fastest path. Reach the pin before the next pull, but your companion may be hurt in the waiting ambush.',
    changes: { command: 1 },
    requires: undefined,
    requiresFlags: undefined,
    addFlags: ['c2-rope-path', 'c2-chain-ambush'],
    result: 'The chain leads directly to the pin chamber. Two soldiers wait behind a broken cart, but you reach them before the next pull.',
  },
  'c2-use-pin-key': {
    label: 'Use the iron latch on the old maintenance gate.',
    detail: 'Take a safer route that costs precious time.',
    changes: { resolve: 1 },
    requires: undefined,
    requiresFlags: ['c2-has-pin-key'],
    addFlags: ['c2-key-found-path'],
    result: 'The latch fits the maintenance gate. You avoid the ambush, but the pin shifts again while you cross.',
  },
  'c2-follow-companion': {
    label: 'Trust Mara to read the ambush ahead.',
    detail: 'Spend 1 Resolve. Follow her eye for hidden movement when your own senses disagree.',
    advantage: 'Mara’s scouting should find a path around the waiting soldiers.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    requiresFlags: ['c2-mara-below'],
    showIfAllFlags: ['c2-mara-below'],
    addFlags: ['c2-trusted-mara-path'],
    result: 'Mara catches a boot edge behind a false wall. She draws the ambush toward her arrow while you cross on Bellweather stone.',
  },
  'c2-follow-lysara': {
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    requiresFlags: ['c2-lysara-below'],
    showIfAllFlags: ['c2-lysara-below'],
    addFlags: ['c2-trusted-lysara-path'],
    result: 'Lysara holds the cracked seed low. Its green thread bends around a road that looks solid and marks the stones that remain beneath your feet.',
  },
  'c2-follow-maelin-path': {
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    requiresFlags: ['c2-maelin-below'],
    showIfAllFlags: ['c2-maelin-below'],
    addFlags: ['c2-trusted-maelin-path'],
    result: 'Maelin finds old chisel marks beneath the plaster. She follows the builders’ ledge while the moonlit stones split below it.',
  },
  'c2-study-keyhole': {
    changes: { command: 1 },
    addFlags: ['c2-safe-removal'],
    result: 'Tivik finds one locking tooth still intact. A strike against the eastern face will guide the pin back into its socket instead of splitting the road.',
  },
  'c2-command-pull': {
    label: 'Command everyone to drive the pin down together.',
    detail: 'Spend 2 Command. Time the strike between the enemy pulls.',
    changes: { command: -2 },
    requires: { command: 2 },
    addFlags: ['c2-command-repair'],
    result: 'Your count reaches Brann, Tivik, the guards, and your chosen companion. They pull and strike together, and the pin drops into its socket.',
  },
  'c2-strength-pull': {
    label: 'Force the pin into place with your own strength.',
    detail: 'Spend 3 Health. Succeed now and accept a lasting injury.',
    changes: { health: -3, resolve: 1 },
    requires: { health: 3 },
    addFlags: ['c2-caelan-injured'],
    result: 'You drive the iron home. Pain tears across your back, but the distant roads vanish from the tunnel.',
  },
  'c2-oath-pull': {
    label: 'Bind your Oath to the road and command it to hold.',
    detail: 'Spend 2 Resolve. Gain 3 Oathfire and bind your promise to the repaired road.',
    changes: { resolve: -2, oathfire: 3 },
    requires: { resolve: 3 },
    addFlags: ['c2-oath-repair-road'],
    result: 'Oathfire runs through the carved road lines. The iron answers your promise and locks into place.',
  },
  'c2-wagon-break': {
    label: 'Use a wagon axle as a hammer.',
    detail: 'Spend no stat. Break the supply wagon’s axle and leave that wagon at Bellweather.',
    advantage: 'Tivik’s locking mark should let the axle seat the pin without risking Caelan or the treaty.',
    changes: {},
    requires: undefined,
    requiresFlags: ['c2-safe-removal'],
    showIfAllFlags: ['c2-safe-removal'],
    addFlags: ['c2-wagon-axle-lost'],
    result: 'You strike the eastern mark Tivik found. The axle shatters on the final blow, and the pin seats firmly inside its socket.',
  },
  'c2-wagon-sacrifice': {
    changes: {},
    requires: undefined,
    requiresFlags: undefined,
    hideIfAnyFlags: ['c2-safe-removal'],
    addFlags: ['c2-wagon-lost'],
    result: 'The supply wagon crashes down the coach ramp. Its frame drives the pin home, then breaks across the socket.',
  },
  'c2-carry-testimony': {
    label: 'Present Jory’s warning and Garran’s testimony first.',
    detail: 'Lead with evidence ordinary guards can understand. All other proof still travels with you.',
    changes: { wayfire: 7 },
    addFlags: ['c2-chose-testimony'],
    result: 'You place Jory’s warning above the other papers. Garran rides under guard, and the wrapped fragment remains tied inside your pack.',
  },
  'c2-carry-pin': {
    label: 'Present the broken iron fragment first.',
    detail: 'Lead with physical proof of the road weapon. All testimony and papers still travel with you.',
    changes: { wayfire: 7 },
    addFlags: ['c2-chose-pin'],
    result: 'Lysara checks the living cloth around the fragment. Brann packs every surviving paper beneath it, and the whole evidence bundle turns toward Harrowfen.',
  },
  'c2-swear-crown-truth': {
    changes: { resolve: -2, oathfire: 3, wayfire: 8 },
    requires: { resolve: 3 },
    addFlags: ['c2-oath-expose-crown'],
    result: 'The promise catches fire inside your chest. Tivik secures the fragment in your pack while Brann carries every surviving paper behind your public Oath.',
  },
  'c3-test-signature': {
    label: 'Accept responsibility for the escort, but deny Ordan’s crimes.',
    detail: 'Risk your reputation by separating your real decisions from the acts done in your cloak.',
    result: 'You name every casualty and every order you gave. Elene hears a captain accepting cost without confessing to Ordan’s crimes.',
  },
  'c3-give-command-word': {
    label: 'Submit to Elene’s command while she shelters the wounded.',
    detail: 'Requires 2 Command and spends 1. Give up authority now to protect your people.',
    result: 'You order your Wardens to obey Elene inside Harrowfen. She opens the small gate because surrendering command is harder to fake than claiming it.',
  },
  'c3-let-mara-search-you': {
    label: 'Let Mara search you for planted evidence.',
    detail: 'Available with deep Mara trust. Risk embarrassment to prove the trap.',
    requiresRelationships: { mara: { trust: 5 } },
    result: 'Mara finds a practice forgery sewn into your cloak lining. Ordan planted his own proof.',
  },
  'c3-focus-archive': {
    detail: 'Recover Ordan’s written route requests and proof of royal payment.',
    result: 'You leave Mara with the wounded and follow Lysara along the canal to Harrowfen’s archive.',
  },
  'c3-focus-road': {
    label: 'Question Varris about Ordan’s escape route.',
    detail: 'Find the hidden Mileless Bridge without surrendering the iron.',
    result: 'Tivik keeps the fragment wrapped while Varris leads you into a shop with six painted doors and no windows.',
  },
  'c3-catch-archive-spy': {
    label: 'Catch the masked soldier before he reaches the stove.',
    detail: 'Spend 1 Health. Preserve a witness and the last page.',
    result: 'You drag the soldier away from the fire and save Ordan’s signed request.',
  },
  'c3-copy-bridge-entry': {
    label: 'Copy the Mileless Bridge route.',
    detail: 'Let the soldier escape while securing the pursuit map.',
    result: 'You lose the masked man, but Lysara copies the route through the east market.',
  },
  'c3-ask-lysara-what-she-sees': {
    label: 'Ask Lysara to preserve the burned page.',
    detail: 'Available with established Lysara trust. Use her living magic to save the proof.',
    result: 'Green threads lift the scorched writing before it crumbles. Ordan’s name remains readable.',
  },
  'c3-show-nilo-memory': {
    label: 'Put yourself between Garran and the crossbow.',
    detail: 'Spend 1 Resolve. Keep the witness alive while Mara fights the intruders.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    addFlags: ['c3-sable-identified-guard'],
    result: 'The next bolt strikes your shield. Garran sees Ordan’s guard clearly and gives you his name.',
  },
  'c3-hold-healer-door': {
    label: 'Hold the back door while Iven moves the children.',
    detail: 'Spend 1 Health. Keep both rooms safe and gain 1 Command.',
    result: 'You brace the door against two soldiers while Iven moves the children behind a stone counter and Mara shields Garran. Every patient survives.',
  },
  'c3-command-canal-line': {
    label: 'Split the guards between the back door and the children’s room.',
    detail: 'Spend 1 Command. Protect both rooms and trap one of Ordan’s intruders.',
    result: 'Brann seals the back door while two guards cover the children. One intruder escapes, but the other is trapped between the two lines.',
  },
  'c3-mark-false-door': {
    label: 'Demand the real bridge map.',
    detail: 'Spend 1 Command. Refuse Varris’s tricks and make him choose a side.',
    changes: { command: -1 },
    requires: { command: 1 },
    result: 'Varris removes a painted panel and reveals the true brass map of the Mileless Bridge.',
  },
  'c3-offer-the-wrapping': {
    label: 'Offer a look at the fragment’s wrapping.',
    detail: 'Trade information without surrendering the iron.',
    result: 'Varris recognises the road dust and admits Ordan bought the bridge opening word.',
  },
  'c3-seize-mask': {
    label: 'Seize the killer behind the curtain.',
    detail: 'Spend 1 Health. Protect Varris and take Ordan’s written threat.',
    changes: { health: -1, command: 1 },
    requires: { health: 1 },
    result: 'You disarm Ordan’s man and recover a note ordering Varris killed after the sale.',
  },
  'c3-anchor-bill': {
    label: 'Challenge Ordan’s idea of protection.',
    detail: 'Ask who can refuse a safe road when the Crown owns every exit.',
    addFlags: ['c3-challenged-crown-control'],
    result: 'Ordan calls choice a luxury of peaceful times. Several town guards hear the threat hidden inside his answer.',
  },
  'c3-ask-town-memory': {
    label: 'Make Ordan answer to the people he endangered.',
    detail: 'Gain 1 Command by putting Harrowfen’s voices before a debate between officers.',
    addFlags: ['c3-centred-harrowfen-victims'],
    result: 'Maelin’s journal and Harrowfen’s wounded are read aloud. Ordan defends the future while the crowd sees who paid for his plan today.',
  },
  'c3-let-iron-point': {
    label: 'Use Ordan’s confession to strip him of command.',
    detail: 'Ask Elene whether a man who admits attacking Harrowfen still speaks for its Crown guard.',
    addFlags: ['c3-stripped-ordan-command'],
    result: 'Elene orders the town guard to leave Ordan’s command. He signals the watch house fire before they can seize him.',
  },
  'c3-save-grave-record': {
    label: 'Save the courier boy and his satchel.',
    detail: 'Protect a witness and the written orders while Ordan gains distance.',
    result: 'You pull the boy clear and recover a list of soldiers hidden inside Harrowfen.',
  },
  'c3-take-courier-list': {
    label: 'Take the list of Ordan’s soldiers.',
    detail: 'Choose evidence that can clear your name and expose the attack.',
    result: 'The list names every royal soldier placed in Harrowfen and the money paid to Captain Renn.',
  },
  'c3-free-future-cloak': {
    label: 'Free the bound town scout.',
    detail: 'Save a guide who knows the east market rooftops.',
    result: 'The scout leads you through a window and points out Ordan’s fastest route.',
  },
  'c3-destroy-future-room': {
    label: 'Burn the bridge opening word.',
    detail: 'Spend 1 Resolve to deny Ordan an easy escape before leaving the room.',
    changes: { resolve: -1, command: 1 },
    requires: { resolve: 1 },
    result: 'You destroy the written word. Ordan will need Varris or another key to open the bridge.',
  },
  'c3-stand-with-lysara': {
    detail: 'Accept the wider duty and earn respect without turning policy agreement into romance.',
  },
  'c3-command-market': {
    label: 'Take command of the town guards.',
    detail: 'Spend 2 Command. Separate civilians from Ordan’s disguised soldiers.',
    result: 'Your orders clear the market centre and force Renn’s men to reveal their royal armour.',
  },
  'c3-carry-children': {
    label: 'Carry trapped children across the broken bridge.',
    detail: 'Spend 2 Health. Save lives while Ordan reaches the well.',
    result: 'You carry two children through smoke and falling rope. Their mother opens a boat passage that reaches the well behind Renn’s line.',
  },
  'c3-rush-burning-house': {
    label: 'Run for the watch house before the last order burns.',
    detail: 'Spend 2 Health. Recover Ordan’s bridge order before the fire takes it.',
    result: 'You cross before the first beam falls and tear an east bridge order from the burning desk. It names six guards waiting for Renn’s signal.',
  },
  'c3-follow-tiviks-rule': {
    label: 'Cover the fragment and move away from the shifted street.',
    detail: 'Use Tivik’s simple rule: hide the iron, then trust the road under your feet.',
    result: 'The mountain street disappears when the fragment is covered. The true market stays beneath you.',
  },
  'c3-approach-double-alone': {
    label: 'Confront the false captain alone.',
    detail: 'Risk the duel to keep everyone else focused on Ordan.',
    result: 'Renn accepts your challenge. His copied stance reveals where his training falls short.',
  },
  'c3-send-real-mara': {
    label: 'Let Mara expose the cloak’s hidden mark.',
    detail: 'Available with deep Mara trust. Trust her knowledge of your equipment.',
    result: 'Mara cuts the cloak lining open and shows Elene the armourer’s mark from your missing spare.',
  },
  'c3-use-oath-sight': {
    label: 'Speak an Oath only the real captain will keep.',
    detail: 'Spend 1 Oathfire. Bind yourself publicly to protect Harrowfen.',
    result: 'Your Oath burns where everyone can see it. Renn cannot answer with anything but a drawn sword.',
  },
  'c3-talk-double-down': {
    label: 'Offer Renn a chance to surrender.',
    detail: 'Use honest insight to break Ordan’s hold on him.',
    changes: {},
    requires: {},
    result: 'Renn lowers his blade and warns that the thief on the bridge is Ordan’s rival, not his ally.',
  },
  'c3-disarm-double': {
    label: 'Disarm Renn before he can give another order.',
    detail: 'Spend 2 Health. End the false command quickly.',
    changes: { health: -2 },
    requires: { health: 2 },
    result: 'You break Renn’s copied guard and put him on the stones before he can warn Ordan’s bridge guards.',
  },
  'c3-ask-future-warning': {
    label: 'Demand Ordan’s final plan.',
    detail: 'Spend 1 Command. Force Renn to choose between truth and prison.',
    changes: { command: -1 },
    requires: { command: 1 },
    addFlags: ['c3-routed-ordan-plan'],
    result: 'Renn reveals that Ordan plans to join the fragment with a larger shard on the Mileless Bridge.',
  },
  'c3-cut-glove': {
    label: 'Cut the fragment from Ordan’s silver glove.',
    detail: 'Spend 2 Health. Risk a close fight before he reaches the arch.',
    result: 'Your blade tears the silver control threads inside Ordan’s glove. He keeps the fragment, but he can no longer close a road behind him.',
  },
  'c3-order-volley': {
    label: 'Order Elene’s archers to cut off his route.',
    detail: 'Spend 2 Command. Force Ordan toward a narrower bridge.',
    result: 'Arrows drive Ordan away from the rooftops and onto the exposed east canal crossing.',
  },
  'c3-mark-ordan': {
    label: 'Throw market dye across Ordan’s coat.',
    detail: 'Save your strength and make him easy to track through smoke.',
    result: 'Bright blue dye bursts across Ordan’s back. Every guard in the market can see where he runs.',
  },
  'c3-save-healing-house': {
    label: 'Stop and rescue the healing house patients.',
    detail: 'Lose ground in the chase so trapped people survive.',
    result: 'You hold the broken balcony while patients cross. Ordan reaches the east arch first.',
  },
  'c3-keep-courier-in-sight': {
    label: 'Keep Ordan in sight through the burning market.',
    detail: 'Spend 1 Health. Leave the rescue to Elene’s guards.',
    changes: { health: -1 },
    requires: { health: 1 },
    result: 'You stay close enough to see Ordan use the bridge key at the east arch.',
  },
  'c3-oath-hold-harrowfen': {
    label: 'Swear that Harrowfen will not fall for your pursuit.',
    detail: 'Spend 2 Resolve. Gain 3 Oathfire and accept a binding duty to Harrowfen.',
    result: 'Oathfire binds the bridge ropes long enough for the wounded to escape and for you to continue.',
  },
  'c3-prepare-fast-pursuit': {
    label: 'Take Mara and pursue Ordan at once.',
    detail: 'Choose speed and close combat over a safer return path.',
    result: 'Mara ties back her hair and follows you onto the first arch without hesitation.',
  },
  'c3-prepare-safe-pursuit': {
    label: 'Let Lysara secure a guide rope before you cross.',
    detail: 'Choose a safer route and give Ordan more time.',
    result: 'Lysara anchors green rope to Harrowfen, creating a path your allies can follow home.',
  },
  'c3-use-oath-trail': {
    label: 'Use your Oath to follow the danger you promised to end.',
    detail: 'Spend 1 Oathfire. Find Ordan’s path without slowing for a map.',
    result: 'Your Oath pulls toward the fragment like a compass needle toward north.',
  },
};

export const chapterTwoChoiceRevisionAudit = {
  retainedMechanics: {
    reason: 'The active wording changed, but the base destination, costs, requirements, visibility, flags, relationship effects, and advantage were checked and remain correct.',
    ids: [
      'c2-oath-guided-entry',
      'c2-lead-water',
      'c2-carry-first',
      'c2-medicine-lysara',
      'c2-medicine-nilo',
      'c2-medicine-attacker',
      'c2-test-book',
      'c2-copy-pattern',
      'c2-mark-moving-stone',
      'c2-take-orders',
      'c2-anchor-people',
      'c2-order-no-fight',
      'c2-show-orders',
      'c2-protect-current-group',
      'c2-hold-door',
      'c2-take-maelin',
    ],
  },
  explicitMechanics: {
    reason: 'The active meaning or availability changed, so the overlay states the affected costs, requirements, visibility, flags, advantage, or result explicitly.',
    ids: [
      'c2-search-threshold',
      'c2-guard-rear',
      'c2-ledger-route',
      'c2-cellar-route',
      'c2-cellar-route-prepared',
      'c2-question-name',
      'c2-believe-maelin',
      'c2-compare-memories',
      'c2-ask-missing-mara',
      'c2-study-cloak-version',
      'c2-break-bracket',
      'c2-follow-footsteps',
      'c2-demand-employer',
      'c2-offer-protection',
      'c2-give-maelin-key',
      'c2-block-versions',
      'c2-use-rope-path',
      'c2-use-pin-key',
      'c2-follow-companion',
      'c2-follow-lysara',
      'c2-follow-maelin-path',
      'c2-study-keyhole',
      'c2-command-pull',
      'c2-strength-pull',
      'c2-oath-pull',
      'c2-wagon-break',
      'c2-wagon-sacrifice',
      'c2-carry-testimony',
      'c2-carry-pin',
      'c2-swear-crown-truth',
    ],
  },
} as const;

export const reviewedUnchangedChoiceIds = [
  'c2-shield-arrival',
  'c2-trust-mara-entry',
  'c2-organise-care',
  'c2-work-beside-mara',
  'c2-let-lysara-lead-care',
  'c2-attacker-route',
  'c2-name-fear',
  'c2-kiss-mara',
  'c2-choose-mara-friendship',
  'c2-promise-as-captain',
  'c2-oath-anchor',
  'c2-follow-maelin',
  'c2-take-mara',
  'c2-take-lysara',
  'c2-read-crown-mark',
  'c2-feel-oath-pin',
  'c3-command-calm',
  'c3-shield-wounded',
  'c3-show-evidence',
  'c3-focus-wounded',
  'c3-order-streets-closed',
  'c3-stand-with-mara',
  'c3-name-the-real-plan',
  'c3-end-catch-courier',
  'c3-end-catch-thief',
  'c3-end-secure-return',
] as const;
