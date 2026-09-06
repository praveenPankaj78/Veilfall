import type { Choice, StoryNode } from './game-data';

type NodeUpdate = Omit<Partial<StoryNode>, 'id' | 'choices'>;

export const adventureNodeUpdates: Record<string, NodeUpdate> = {
  'c2-arrival': {
    title: 'The Inn That Waited',
    location: 'Bellweather Inn, Eastmere Road',
    objective: 'Get the wounded inside before the creature in the flood reaches them.',
    body: (state) => [
      state.flags.includes('chose-silver-road')
        ? 'The hidden road rises from the flood beneath your boots. Bellweather Inn stands ahead on a low hill, its windows bright through the rain.'
        : 'The path from Rainwatch Hill ends at Bellweather Inn. A flooded ditch surrounds the yard, and warm light spills through the open door.',
      'Mara supports Joren while Brann leads the horses. Lysara carries the cracked treaty chest. Tivik has found one sealed dose of medicine, but the rest of your supplies are soaked.',
      'A pale beast moves through the water behind you. Its back is ridged like a crocodile, but its long front legs reach for the road stones. It smells the blood of your wounded.',
      'An older woman opens the inn door and raises a crossbow. “Captain Vey, get them inside. The Crown men who attacked you are coming back.”',
    ],
  },
  'c2-threshold': {
    title: 'Maelin Bellweather',
    location: 'Bellweather Inn, Common Room',
    objective: 'Secure the inn and learn how Maelin knew you were coming.',
    threat: 'Rising',
    body: () => [
      'The woman bars the door behind you. Her name is Maelin Bellweather. She has run this inn for thirty years and looks strong enough to throw out anyone who doubts it.',
      'The common room has been turned into a sick ward. Three empty beds wait beside the fire. A dead Warden lies beneath a grey sheet near the stairs.',
      '“His name was Jory,” Maelin says. “He arrived three days ago with an arrow in his back and a warning in your handwriting. He said royal soldiers would attack this place after you arrived.”',
      'You did not write the warning. Outside, a hunting horn sounds once in the rain. The attackers are close enough to watch the windows.',
    ],
  },
  'c2-triage': {
    title: 'Three Beds, One Bottle',
    location: 'Bellweather Inn, Common Room',
    objective: 'Stabilise the wounded before the attack begins.',
    body: () => [
      'Maelin points to three people who may not survive the night. Nilo, the hidden boy from the wagon, is bleeding into his blanket. Lysara’s burned hand has begun to swell. Sable, your captured attacker, is shivering from an infected blade wound.',
      'The sealed medicine can save only one of them from the worst danger. Water, clean cloth, and steady hands must help the others.',
      'Mara removes her wet cloak and kneels beside Nilo. Her shirt clings to the strong curve of her shoulders, but her hands remain gentle as she presses cloth to the wound. “Choose quickly,” she says. “I can keep him breathing, not heal him.”',
      'A shutter jumps in its frame. Something outside has tested the wall.',
    ],
  },
  'c2-medicine': {
    title: 'The Last Clear Dose',
    location: 'Bellweather Inn, Makeshift Ward',
    objective: 'Decide who receives the only strong medicine.',
    body: () => [
      'Tivik holds up the small glass bottle. It can close a deep wound, stop an infection, or save a badly burned hand. It cannot do all three.',
      'Nilo is a child who may die before dawn. Lysara carries the only surviving treaty proof and needs both hands to use her living magic. Sable knows who paid for the ambush, but he is still your prisoner.',
      'There is no hidden correct answer. Whoever receives the dose will be safer later. The other two will remember what you decided.',
    ],
  },
  'c2-eleven-years': {
    title: 'The Warning That Arrived First',
    location: 'Bellweather Inn, Hearth',
    objective: 'Understand Jory’s warning before the attackers return.',
    lesson: {
      title: 'What the damaged road did',
      body: 'The buried iron pin keeps nearby roads connected to the places they belong. Someone loosened it. That pulled a distant shortcut beside the inn, allowing Jory to arrive before you. It changed distance, not time.',
    },
    body: () => [
      'Maelin gives you Jory’s warning. The handwriting copies yours well, but the words do not sound like you. The order tells Maelin to shelter your party and open the cellar at midnight.',
      'Jory rode here through a shortcut that should begin two days east. The road moved because someone loosened an ancient iron pin under the inn. The pin normally keeps road ends in their proper places.',
      'The trick is strange, but simple enough to use as a weapon. The attackers changed the road, sent Jory ahead with a false message, and now expect Maelin to open the cellar for them.',
      'Maelin lays Jory’s broken arrow on the table. A silver crown is stamped into its head. “Believe the dead man or do not,” she says. “But decide before the next horn.”',
    ],
  },
  'c2-investigate': {
    title: 'Three Ways to Find the Attackers',
    location: 'Bellweather Inn',
    objective: 'Find how the enemy plans to enter before nightfall.',
    body: () => [
      'Brann can hold the doors for a short time. That gives you one chance to investigate.',
      'Maelin’s guest ledger may reveal who prepared the attack. The cellar may show how the road pin was loosened. Sable may identify the officer who paid him.',
      'You cannot search every lead before dark. Your choice will decide what advantage you carry into the siege.',
    ],
  },
  'c2-ledger': {
    title: 'Names Written Before Blood',
    location: 'Bellweather Inn, Upper Hall',
    objective: 'Use the guest ledger to identify the enemy plan.',
    body: () => [
      'The ledger shows six royal couriers stayed here during the last month. Five bought meals. Ordan Vale bought lamp oil, rope, butcher hooks, and every room facing the yard.',
      'A stable note says Ordan travelled with men wearing plain coats over royal armour. One page has been cut away, but the pressure of the missing writing remains on the sheet beneath it.',
      'Mara leans close while you angle the page toward the lamp. Her damp hair brushes your cheek. “He planned the room before he knew our route,” she says. “Someone inside the Wardens gave it to him.”',
      'Below you, the pale beast strikes the back wall hard enough to shake dust from the beams.',
    ],
  },
  'c2-cellar': {
    title: 'Sabotage Beneath the Floor',
    location: 'Bellweather Inn, Cellar Steps',
    objective: 'Inspect the old road tunnel without letting the enemy inside.',
    body: () => [
      'The cellar smells of wet earth and split ale. Behind the barrels, fresh tool marks lead to a stone arch sealed with an iron bracket.',
      'Cold air moves through the crack. For one heartbeat you hear gulls, although the nearest sea lies many days west. The loose pin has pulled the end of a coastal road against this tunnel.',
      'Boot prints cross the mud beneath the arch. The attackers already used the shifted road to reach the inn unseen. A rope tied to the bracket runs deeper underground.',
      'Someone above knocks over a chair. You have seconds to mark what matters before returning to the common room.',
    ],
  },
  'c2-attacker': {
    title: 'The Man Who Took Crown Silver',
    location: 'Bellweather Inn, Pantry',
    objective: 'Make Sable reveal who ordered the ambush.',
    body: () => [
      'Sable sits tied to a flour post. Fever beads on his face, but fear wakes him when you place Jory’s arrow on the table.',
      'He names Ordan Vale, a royal courier with silver gloves. Ordan paid Sable’s company to wound the escort, drive you to Bellweather, and pull the iron pin free during the confusion.',
      '“He did not want your treaty,” Sable says. “He wanted whatever is buried under this inn. He said the road would open a door for the Crown.”',
      'A second horn answers the first. Sable looks toward the shutter. “That means they are in the yard.”',
    ],
  },
  'c2-night-watch': {
    title: 'One Quiet Minute',
    location: 'Bellweather Inn, Upper Landing',
    objective: 'Prepare yourself and Mara before the siege begins.',
    threat: 'Immediate',
    body: (state) => [
      'You find Mara fastening leather around her forearm. Firelight warms her brown skin and catches on the rain still shining at her throat. She looks tired, dangerous, and very close.',
      state.relationships.mara.trust >= 5
        ? '“You keep carrying everyone as if the road will forgive you for dropping yourself,” she says. Her fingers close around your wrist. “Tell me what you are afraid of before we walk back downstairs.”'
        : '“We have one minute before Brann calls us,” she says. “Use it to breathe, make a plan, or say whatever you keep refusing to say.”',
      'The attraction between you has survived years of bad roads and worse timing. It does not remove the danger outside. It gives both of you a reason to survive it.',
      'A crossbow string snaps in the yard. Your quiet minute is ending.',
    ],
  },
  'c2-bell': {
    title: 'The Bell Rings Twice',
    location: 'Bellweather Inn, Common Room',
    objective: 'Read the enemy signal and put everyone in position.',
    body: () => [
      'The inn bell rings once. Maelin is nowhere near its rope. A moment later it rings again, the signal Sable described for a two sided attack.',
      'Royal soldiers rush the front yard under dark cloaks. At the back wall, the pale mire hound climbs from the flooded ditch and drives its claws into the timber.',
      'The enemy wants you looking at the soldiers while the beast breaks open the cellar route. If they reach the iron pin, every road around the inn may be torn loose.',
    ],
  },
  'c2-common-room-crisis': {
    title: 'Hold the Inn',
    location: 'Bellweather Inn, Common Room',
    objective: 'Protect the wounded and stop the attackers reaching the cellar.',
    body: () => [
      'Crossbow bolts punch through the shutters. Brann’s guards brace tables against the front door while Maelin fires through a gap with calm, practised aim.',
      'The mire hound tears through the pantry wall. It is pale, long limbed, and blind except for a strip of red eyes along its neck. Lysara throws green fire across its path, but the spell cannot hold it for long.',
      'A royal soldier shouts for his men to ignore the people and find the cellar. That order tells you exactly what matters.',
      'You can command the whole room, expose Ordan’s written orders, protect the wounded line, or block the cellar with your own body.',
    ],
  },
  'c2-descend': {
    title: 'Who Goes Below',
    location: 'Bellweather Inn, Broken Cellar Door',
    objective: 'Choose one companion and reach the iron pin before Ordan’s soldiers.',
    body: () => [
      'Brann can hold the common room. You must go below. The rope found earlier is jerking through the broken arch as men in the tunnel pull at the buried iron.',
      'Mara can fight and track in darkness. Lysara can sense the strange road magic. Maelin knows every support beam beneath the inn.',
      'You may take only one. The others must keep the wounded alive while the roof shakes above them.',
    ],
  },
  'c2-folded-cellar': {
    title: 'The Road Under the Inn',
    location: 'Bellweather Road Tunnel',
    objective: 'Cross the damaged tunnel before the enemy frees the pin.',
    body: (state) => [
      'The cellar arch opens into an old stone road beneath the inn. One side ends at a rain soaked field. The other touches a moonlit beach. The loose pin has dragged both road ends close, like ropes pulled through one ring.',
      state.flags.includes('c2-took-mara')
        ? 'Mara finds two soldiers hiding behind a broken cart and drops the first before he can shout. “The pin is ahead,” she says. “So is the rest of them.”'
        : state.flags.includes('c2-took-lysara')
          ? 'Lysara ties green thread to the wall. “This is not another time,” she says. “Only two distant places forced together. Follow the thread and we can return.”'
          : 'Maelin strikes the wall with her lamp hook. “That beam carries the inn,” she says. “Break it and we bury everyone. Step where I step.”',
      'The mire hound drops into the tunnel behind you. Ahead, three soldiers drag a chain attached to a black iron spike as tall as your arm.',
    ],
  },
  'c2-road-pin': {
    title: 'The Iron That Holds the Roads',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Learn how to secure the pin while your companion holds the enemy back.',
    lesson: {
      title: 'The road pin',
      body: 'The iron pin is an ancient anchor. When it sits firmly in its stone socket, roads stay connected to the correct places. Ordan loosened it so distant routes would meet under the inn. Drive it back into the socket to restore the road.',
    },
    body: () => [
      'The black pin leans halfway out of a round stone socket. Lines cut into the floor point toward Greyhaven, Harrowfen, the western sea, and lands you do not know.',
      'Each pull on the enemy chain moves the pin another finger width. When it shifts, the beach beside you becomes a mountain pass for a breath, then returns. Distance is breaking around the chamber.',
      'A crown has been scratched into the iron. Beneath it are Ordan’s initials and a fresh map line pointing east toward Harrowfen.',
      'The pin does not need to be understood in every detail. It needs to be driven home before the tunnel tears apart.',
    ],
  },
  'c2-remove-pin': {
    title: 'Drive It Home',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Reseat the road pin before the tunnel collapses.',
    body: () => [
      'The soldiers pull from the far side while you push. The iron is cold enough to numb your palms. Stone splits above your head and the mire hound charges through the falling dust.',
      'You can use command to time everyone’s effort, strength to force the pin down, Oathfire to bind your promise to the road, or a wagon axle as a hammer. Each method solves the same urgent problem at a different cost.',
      'The last strike will decide whether Bellweather remains connected to Eastmere or becomes a doorway for every army that learns the trick.',
    ],
  },
  'c2-last-testimony': {
    title: 'Proof in the Broken Stone',
    location: 'Bellweather Road Tunnel, After the Siege',
    objective: 'Choose the proof you will carry into Harrowfen.',
    threat: 'Rising',
    body: () => [
      'The pin slams into its socket. The beach, mountain, and distant rain vanish. Only the proper Eastmere tunnel remains.',
      'A corner of the socket has broken away. The fragment hums when you face east. Ordan escaped with the missing map page, but he left his orders, his crown mark, and the wounded men he hired.',
      'Above, the surviving attackers flee. Harrowfen should be several days away, yet Maelin can see its canal lights beyond the next hill. The broken fragment is still pulling that one road close.',
      'You must decide which proof matters most when the Crown calls you a traitor: Jory’s warning and Sable’s testimony, the iron fragment itself, or an Oath sworn before every survivor.',
    ],
  },
  'c2-ending-testimony': {
    title: 'The Witness Road',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Reach Harrowfen with witnesses to Ordan’s attack.',
    body: () => [
      'You leave Bellweather with Jory’s false warning, Ordan’s supply record, and at least one living witness. The proof is plain enough for any guard to understand.',
      'Behind you, Maelin boards the broken wall while Brann protects the wounded. Ahead, Harrowfen’s towers rise beyond a field that should lead to three more days of road.',
      'The fragment in your pack pulls toward the town. At the eastern gate, royal archers turn their bows toward you. A silver gloved courier stands behind them.',
    ],
  },
  'c2-ending-pin': {
    title: 'Iron for the Crown',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Carry the broken road pin fragment safely into Harrowfen.',
    body: () => [
      'The iron fragment is heavy in your pack and warm whenever you face east. Lysara wraps it in living cloth, but its pull still shortens the road to Harrowfen.',
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
      'Every survivor hears the same clear purpose: reach Harrowfen, find Ordan Vale, and show the town what he did.',
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
    body: () => [
      'Harrowfen should be three days east of Bellweather. You reach it after one mile because the fragment in your pack pulls toward something inside the town.',
      'The city rises from black canals on timber walks and stone islands. Rope bridges join tall houses painted blue, red, and gold. Market boats crowd the water below the gate.',
      'Royal archers aim down at you. Ordan Vale stands on the wall in silver gloves and reads an order bearing the king’s seal. It names you as the traitor who attacked Bellweather.',
      'Behind you, Crown riders appear on the shortened road. You have little time to convince the gate captain before they trap your wounded in the open.',
    ],
  },
  'c3-gate': {
    title: 'A Crime Signed in Your Name',
    location: 'West Gate, Harrowfen',
    objective: 'Expose Ordan’s forgery and get the wounded through the gate.',
    body: () => [
      'Gate Captain Elene lowers Ordan’s order in a basket. The seal looks real. Your signature looks almost real. One private Warden mark is wrong: the forger drew the road hook facing east instead of home.',
      'Mara searches your cloak and finds the matching practice sheet planted inside its lining. Ordan prepared both the accusation and the evidence.',
      'The Crown riders behind you begin to charge. Elene has enough doubt to open the small gate for a few people, not the whole escort.',
    ],
  },
  'c3-triage': {
    title: 'Three Leads, One Fugitive',
    location: 'Harrowfen, West Canal',
    objective: 'Choose the fastest way to find Ordan.',
    body: () => [
      'Elene lets your wounded into a healing house under guard. Ordan leaves the wall before you can reach him and disappears into Harrowfen.',
      'The town archive holds the orders he filed. The healing house shelters a witness his soldiers may try to kill. A road broker named Varris sold him a route to the hidden Mileless Bridge.',
      'Every lead matters, but Ordan is already moving. Choose the one that best matches what you need: written proof, a living witness, or his escape route.',
    ],
  },
  'c3-archive': {
    title: 'The Map Ordan Wanted',
    location: 'Harrowfen Archive',
    objective: 'Recover the records Ordan tried to steal.',
    body: () => [
      'The archive is built above the canal on black oak posts. Inside, a clerk is feeding route records into a stove while a masked soldier watches the door.',
      'Ordan requested maps of the Mileless Bridge, the east gate winch, and the oldest road marker in the market. Those three locations form a straight escape line across town.',
      'The soldier reaches for another page. If he burns it, Ordan can still run, but you will lose the proof that royal money funded the attack.',
    ],
  },
  'c3-healer': {
    title: 'The Witness in the Healing House',
    location: 'Harrowfen Healing House',
    objective: 'Keep Sable alive long enough to identify Ordan.',
    body: () => [
      'Sable is awake when a quarrel breaks the window above his bed. Mara pulls him to the floor as two plain coated soldiers force the back door.',
      'Healer Iven shouts for you to protect the children in the next room. Sable shouts that the man outside is Ordan’s personal guard. Both claims matter, and the attackers know you cannot stand in two doorways.',
      'Across the canal, a silver gloved figure watches from a blue balcony. Ordan wants to see whether his witness dies.',
    ],
  },
  'c3-broker': {
    title: 'The Seller of Secret Roads',
    location: 'Varris Road House, Harrowfen',
    objective: 'Learn where Ordan plans to escape.',
    body: () => [
      'Varris sells smuggler paths from a shop hung with painted doors. Most are ordinary maps disguised as fortune telling. One is not.',
      'A brass plate shows the Mileless Bridge, an ancient crossing hidden behind Harrowfen’s east market. Varris sold Ordan the opening word and a coil of green guide rope.',
      '“He paid in royal silver,” Varris says. “Then he threatened to cut out my tongue.” A knife moves behind the curtain. Ordan left someone to make that threat real.',
    ],
  },
  'c3-bill': {
    title: 'The Forgery Breaks',
    location: 'Harrowfen, Lantern Bridge',
    objective: 'Turn your chosen lead into proof the town guard will accept.',
    body: () => [
      'Your lead brings you back to the forged order. Lysara holds it beside Jory’s warning. Both were written with the same rare blue black ink sold only to royal couriers.',
      'Mara finds a second mistake. The false signature uses the formal version of her name. You have called her Mara in every field order for nine years.',
      'Gate Captain Elene finally lowers her sword. “Bring me Ordan alive,” she says. “If he reaches the east market, he can open a bridge my guards cannot follow.”',
    ],
  },
  'c3-evidence': {
    title: 'Fire at the Watch House',
    location: 'Harrowfen, Old Watch Lane',
    objective: 'Reach Ordan’s safe room before his men destroy the evidence.',
    body: () => [
      'A boy in a courier coat stumbles from Old Watch Lane with blood on his sleeve. He saw Ordan enter the abandoned watch house carrying the iron tools used at Bellweather.',
      'Before he can say more, smoke rolls from the roof. Ordan’s men have set the building on fire and barred the lower door.',
      'The courier boy carries a satchel of orders. People are trapped in the rooms above him. Ordan is escaping across the roofs. You can save only one advantage before the flames spread.',
    ],
  },
  'c3-watch-house': {
    title: 'Orders in the Smoke',
    location: 'Harrowfen, Burning Watch House',
    objective: 'Recover Ordan’s plan and escape the fire.',
    body: () => [
      'The safe room is real wood, real smoke, and real danger. Inside, hooks, chains, and route maps cover a table. Ordan planned to steal your fragment, seize Harrowfen’s east gate, and open the Mileless Bridge for hidden Crown soldiers.',
      'One order also names a corrupt Warden officer called Captain Renn. Renn carries one of your spare red cloaks and has been told to commit the attack in your name.',
      'The ceiling cracks. You have time to take the courier list, free a bound town scout, or destroy the bridge opening word before jumping to the canal walk.',
    ],
  },
  'c3-divided-loyalty': {
    title: 'What Comes First',
    location: 'Harrowfen, Bathhouse Roof',
    objective: 'Choose how your group will protect the town and continue the hunt.',
    body: (state) => [
      'For a few minutes, the bathhouse roof gives you distance from the smoke. Below, Mara watches the wounded streets. Lysara studies Ordan’s route map.',
      state.relationships.mara.attraction >= 4
        ? 'Mara steps close enough that her hip touches yours. Smoke has darkened her cheek, and a tear in her shirt reveals the firm line above her ribs. Her eyes stay on your face. “When this is over,” she says, “I want one night where neither of us has to listen for a horn.”'
        : 'Mara rests her shoulder against yours. “People first,” she says. Lysara answers, “And the cause of this, before it creates more wounded.”',
      'Their priorities are different, not foolish. Mara wants guards at the healing house. Lysara wants to reach the east market before Ordan opens the bridge. A clear plan can respect one, the other, or both at greater cost.',
    ],
  },
  'c3-market-memory': {
    title: 'Battle in the Canal Market',
    location: 'Harrowfen East Market',
    objective: 'Protect the market and stop Ordan reaching the bridge marker.',
    body: () => [
      'Ordan’s hidden soldiers attack among fruit boats and hanging lanterns. They cut two rope bridges, overturn a fish cart, and drive civilians toward the canal.',
      'At the centre of the market, Captain Renn wears your red cloak and shouts orders in your name. Town guards hesitate because they cannot tell which captain is the traitor.',
      'The fragment tears through its wrapping. For a few seconds, one market street connects to a snowy mountain pass. Cold wind and snow burst between the stalls. The road returns when Mara slams the fragment under a shield.',
      'Now the danger is clear. If Ordan joins this fragment to the larger piece near the bridge, he can pull an army road into Harrowfen.',
    ],
  },
  'c3-pin-test': {
    title: 'The False Captain',
    location: 'Harrowfen East Market',
    objective: 'Expose Renn before Ordan steals the fragment.',
    body: () => [
      'Captain Renn faces you across the market in your spare red cloak. He knows Warden commands, carries a copied seal, and has already ordered two town guards to arrest Mara.',
      'He is an ordinary man, frightened and ambitious, using your uniform to make every crime look like your order.',
      'Ordan circles toward the well while everyone watches the two captains. You can confront Renn alone, trust Mara to expose the cloak’s hidden mark, or use your Oath to make a promise only the real captain would keep.',
    ],
  },
  'c3-duplicate': {
    title: 'A Warden Bought by Silver',
    location: 'Harrowfen East Market',
    objective: 'Defeat Renn and learn Ordan’s final plan.',
    body: () => [
      'Renn’s courage breaks when the town guards recognise your old cloak. He draws anyway. “Ordan promised the Wardens would command every road in the kingdom,” he says.',
      'His orders say the Mileless Bridge leads to many borders. With the joined iron pieces, Ordan could move soldiers across the world without crossing the lands between them.',
      'Behind Renn, Ordan reaches the well and cuts the fragment free from Mara’s shield straps. You have one breath to end this fight and pursue him.',
    ],
  },
  'c3-courier': {
    title: 'Silver Gloves at the Well',
    location: 'Harrowfen East Market',
    objective: 'Stop Ordan escaping with the iron fragment.',
    body: () => [
      'Ordan holds the fragment in one silver glove and a small bridge key in the other. He is lean, clean shaven, and calm enough to look harmless until he smiles.',
      '“The king cannot protect roads he does not control,” he says. “I am giving him every road at once.” Then he throws a fire flask into the market ropes.',
      'The first bridge burns. The second collapses under fleeing people. Ordan runs for the east arch while his last soldiers cover him.',
    ],
  },
  'c3-collapse': {
    title: 'The Burning Bridges',
    location: 'Harrowfen East Canal',
    objective: 'Choose what you refuse to lose during the pursuit.',
    body: () => [
      'Burning rope falls into the canal. A bridge strikes the healing house balcony and traps patients above the water. Ordan reaches the final market arch with the fragment.',
      'If you stop to save the healing house, people live but Ordan gains distance. If you chase at once, he has less time to prepare the bridge. If you spend Oathfire, you may hold the damaged crossing long enough to do both.',
      'This is the cost of pursuit. The enemy chooses where to cause pain. You choose what your victory is allowed to sacrifice.',
    ],
  },
  'c3-pursuit': {
    title: 'The Hidden Road East',
    location: 'Harrowfen, East Arch',
    objective: 'Prepare for the Mileless Bridge and follow Ordan.',
    body: () => [
      'Beyond the arch, an ancient bridge curves into mist. Its first span hangs over Harrowfen’s canal. Farther spans appear beneath unfamiliar skies, each touching a distant border.',
      'The bridge does not create other times or other people. It joins faraway places. Ordan can use the fragment to choose which border touches the next arch.',
      'Mara offers speed and a blade at your side. Lysara offers guide rope and a safer path for everyone behind you. Your Oath can follow the promise you made at Bellweather.',
    ],
  },
  'c3-world-nail': {
    title: 'The World Nail',
    location: 'The Mileless Bridge',
    objective: 'Understand the threat, then choose your target.',
    lesson: {
      title: 'The World Nail',
      body: 'Road pins are pieces of a greater ancient anchor called the World Nail. It keeps distant places apart. Joined fragments can briefly connect chosen roads. Ordan wants that power for an army.',
    },
    body: () => [
      'Lysara names the iron at last. “World Nail,” she says. “Old stories say it fixed distance in place when the world was young. These road pins are broken pieces of it.”',
      'Ordan reaches a larger iron shard set into the bridge. If he joins your fragment to it, he can connect the next arch to any road his maps have marked. A Crown army could step from its barracks into any kingdom.',
      'A dark coated thief drops from the arch above and steals the fragment from Ordan’s belt. He is quick, young, and smiling as if the end of the world is a private joke.',
      'Ordan draws his sword. The thief runs toward the broken centre. Behind you, Harrowfen’s guide rope begins to slip. You must choose what matters now.',
    ],
  },
  'c3-ending-courier': {
    title: 'The Courier’s Last Road',
    location: 'The Mileless Bridge',
    objective: 'Catch Ordan before he reaches his hidden soldiers.',
    body: (state) => [
      'You cross the first arch and close on Ordan. He understands that you chose the man who planned the attacks over the thief carrying the fragment.',
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
      state.flags.includes('c3-bridge-warning')
        ? 'Renn’s warning returns to you: this thief opposes Ordan, but wants the iron for a reason of his own.'
        : '“Captain,” the thief calls, “I stole it from the villain. That usually earns applause.”',
      'Ordan orders his soldiers to fire. The thief throws the fragment over the gap, forcing you to choose between catching him and catching the iron as the stone breaks beneath both of you.',
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
      'Ahead, the dark coated thief takes the fragment from Ordan. The courier and his soldiers chase him toward the broken centre. You now have allies behind you and two dangerous men ahead.',
    ],
  },
};

export const adventureChoiceUpdates: Record<string, Partial<Choice>> = {
  'c2-ledger-route': {
    label: 'Read the guest ledger with Maelin.',
    detail: 'Look for visitors who prepared the inn before the attack.',
    result: 'The ledger points to Ordan’s unusual purchases and the rooms he reserved around the yard.',
  },
  'c2-question-name': {
    label: 'Ask who warned Maelin about you.',
    detail: 'Get the facts before trusting the message.',
    result: 'Maelin shows you Jory’s false warning and the royal arrow that killed him.',
  },
  'c2-believe-maelin': {
    label: 'Accept Maelin’s account and study Jory’s warning.',
    detail: 'Trust the innkeeper and focus on the forgery.',
    result: 'Maelin gives you the false order. Its handwriting copies yours, but its language does not.',
  },
  'c2-compare-memories': {
    label: 'Compare Jory’s route with your own map.',
    detail: 'Spend 1 Resolve to understand how he arrived first.',
    result: 'You prove the loosened pin pulled a distant shortcut beside Bellweather. No time was lost or gained.',
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
    detail: 'Requires Mara trust 4. Work close together to recover the cut writing.',
    result: 'Mara reads enough of the pressure marks to find Ordan’s note about the cellar entrance.',
  },
  'c2-study-cloak-version': {
    label: 'Study the stable note about plain cloaks.',
    detail: 'Learn how royal soldiers plan to hide among travellers.',
    result: 'You learn the attackers wear dark travel coats over royal armour and use the bell as their signal.',
  },
  'c2-mark-moving-stone': {
    label: 'Mark the proper Eastmere stones.',
    detail: 'Prepare a safe route through the damaged tunnel.',
    result: 'Your chalk marks separate the true tunnel from the distant road pulled beside it.',
  },
  'c2-break-bracket': {
    label: 'Cut the enemy rope from the iron bracket.',
    detail: 'Spend 1 Stamina to slow their pull on the road pin.',
    result: 'The rope snaps. The attackers must reach the pin chamber and attach another chain.',
  },
  'c2-follow-footsteps': {
    label: 'Follow the fresh boot prints.',
    detail: 'Learn where the attackers entered, but move closer to danger.',
    result: 'The prints lead from the shifted coastal road to a concealed break in the pantry wall.',
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
    detail: 'Spend 1 Stamina. Push through the pantry fight without defeating every attacker.',
    result: 'Shields strike armour. Your group reaches the cellar stairs while Brann holds the line behind you.',
  },
  'c2-hold-door': {
    label: 'Hold the broken pantry against the mire hound.',
    detail: 'Spend 2 Stamina and keep the beast away from the wounded.',
    result: 'You drive the mire hound back with shield and fire while Brann secures the room.',
  },
  'c2-give-maelin-key': {
    label: 'Give Maelin the cellar key and trust her plan.',
    detail: 'Let the innkeeper use her knowledge of the building.',
    result: 'Maelin opens a narrow service stair, giving you a route below that avoids the pantry fight.',
  },
  'c2-block-versions': {
    label: 'Block the cellar stairs with tables and iron hooks.',
    detail: 'Spend 1 Command. Delay the soldiers while you prepare to descend.',
    result: 'The barrier will not hold forever, but it buys enough time to choose a companion.',
  },
  'c2-take-maelin': {
    label: 'Take Maelin through the tunnel beneath her inn.',
    detail: 'Bring the person who knows its supports, locks, and hidden stairs.',
    result: 'Maelin grips her axe and lamp. “About time,” she says, and leads the way down.',
  },
  'c2-use-rope-path': {
    label: 'Follow the enemy chain toward the pin.',
    detail: 'Take the fastest path and risk meeting their strongest fighters.',
    result: 'The chain leads directly to the pin chamber and two soldiers waiting in ambush.',
  },
  'c2-use-pin-key': {
    label: 'Use Maelin’s iron cellar key on the old side gate.',
    detail: 'Take a safer route that costs precious time.',
    result: 'The old key opens a maintenance path around the ambush, but the pin shifts again while you cross.',
  },
  'c2-follow-companion': {
    label: 'Trust your companion to choose the path.',
    detail: 'Give up control and gain the advantage of their speciality.',
    result: 'Your companion finds a route that suits their skill and brings you within sight of the pin.',
  },
  'c2-command-pull': {
    label: 'Command everyone to drive the pin down together.',
    detail: 'Spend 2 Command. Time the strike between the enemy pulls.',
    result: 'Your order brings guards, prisoner, and innkeeper into one effort. The pin drops into its socket.',
  },
  'c2-strength-pull': {
    label: 'Force the pin into place with your own strength.',
    detail: 'Spend 3 Stamina. Succeed now and accept a lasting injury.',
    result: 'You drive the iron home. Pain tears across your back, but the distant roads vanish from the tunnel.',
  },
  'c2-oath-pull': {
    label: 'Bind your Oath to the road and command it to hold.',
    detail: 'Spend 2 Oathfire. Repair the road through the promise you carry.',
    result: 'Oathfire runs through the carved road lines. The iron answers your promise and locks into place.',
  },
  'c2-wagon-break': {
    label: 'Use a wagon axle as a hammer.',
    detail: 'Break valuable equipment to save your strength.',
    result: 'The axle shatters on the final blow. The pin seats firmly, but a corner of its stone socket breaks away.',
  },
  'c2-carry-testimony': {
    label: 'Carry Jory’s warning and the living testimony.',
    detail: 'Choose evidence ordinary guards can understand.',
    result: 'You leave with a clear account of Ordan’s attack and people willing to repeat it.',
  },
  'c2-carry-pin': {
    label: 'Carry the broken iron fragment.',
    detail: 'Choose physical proof of the road weapon.',
    result: 'Lysara wraps the fragment. It pulls east toward Harrowfen as soon as you step outside.',
  },
  'c3-test-signature': {
    label: 'Show Elene the wrong Warden mark.',
    detail: 'Use your training to expose the forged signature.',
    result: 'Elene sees the road hook faces the wrong way and begins to doubt Ordan’s order.',
  },
  'c3-give-command-word': {
    label: 'Give the private Warden command word.',
    detail: 'Spend 1 Command to prove your authority before the riders arrive.',
    result: 'The gate guards recognise the command. Elene opens the small door for your wounded.',
  },
  'c3-let-mara-search-you': {
    label: 'Let Mara search you for planted evidence.',
    detail: 'Requires Mara trust 5. Risk embarrassment to prove the trap.',
    result: 'Mara finds a practice forgery sewn into your cloak lining. Ordan planted his own proof.',
  },
  'c3-catch-archive-spy': {
    label: 'Catch the masked soldier before he reaches the stove.',
    detail: 'Spend 1 Stamina. Preserve a witness and the last page.',
    result: 'You drag the soldier away from the fire and save Ordan’s signed request.',
  },
  'c3-copy-bridge-entry': {
    label: 'Copy the Mileless Bridge route.',
    detail: 'Let the soldier escape while securing the pursuit map.',
    result: 'You lose the masked man, but Lysara copies the route through the east market.',
  },
  'c3-ask-lysara-what-she-sees': {
    label: 'Ask Lysara to preserve the burned page.',
    detail: 'Requires Lysara trust 4. Use her living magic to save the proof.',
    result: 'Green threads lift the scorched writing before it crumbles. Ordan’s name remains readable.',
  },
  'c3-show-nilo-memory': {
    label: 'Put yourself between Sable and the crossbow.',
    detail: 'Spend 1 Resolve. Keep the witness alive while Mara fights the intruders.',
    result: 'The next bolt strikes your shield. Sable sees Ordan’s guard clearly and gives you his name.',
  },
  'c3-mark-false-door': {
    label: 'Demand the real bridge map.',
    detail: 'Spend 1 Command. Refuse Varris’s tricks and make him choose a side.',
    result: 'Varris removes a painted panel and reveals the true brass map of the Mileless Bridge.',
  },
  'c3-offer-the-wrapping': {
    label: 'Offer a look at the fragment’s wrapping.',
    detail: 'Trade information without surrendering the iron.',
    result: 'Varris recognises the road dust and admits Ordan bought the bridge opening word.',
  },
  'c3-seize-mask': {
    label: 'Seize the killer behind the curtain.',
    detail: 'Spend 1 Stamina. Protect Varris and take Ordan’s written threat.',
    result: 'You disarm Ordan’s man and recover a note ordering Varris killed after the sale.',
  },
  'c3-anchor-bill': {
    label: 'Match the rare ink on both forged orders.',
    detail: 'Use physical evidence to connect Ordan to Bellweather.',
    result: 'Elene confirms that only royal couriers receive the blue black ink used on both pages.',
  },
  'c3-ask-town-memory': {
    label: 'Ask witnesses who bought the ink.',
    detail: 'Use Empathy to gather ordinary testimony from the market.',
    result: 'Three merchants remember Ordan buying extra ink and practice parchment under a false name.',
  },
  'c3-let-iron-point': {
    label: 'Let the fragment pull toward its larger piece.',
    detail: 'Spend 1 Resolve and follow the strange iron toward the east market.',
    result: 'The fragment turns in your palm and points along Ordan’s escape route.',
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
    result: 'You destroy the written word. Ordan will need Varris or another key to open the bridge.',
  },
  'c3-command-market': {
    label: 'Take command of the town guards.',
    detail: 'Spend 2 Command. Separate civilians from Ordan’s disguised soldiers.',
    result: 'Your orders clear the market centre and force Renn’s men to reveal their royal armour.',
  },
  'c3-carry-children': {
    label: 'Carry trapped children across the broken bridge.',
    detail: 'Spend 2 Stamina. Save lives while Ordan reaches the well.',
    result: 'You carry two children through smoke and falling rope. Their mother points out Ordan at the well.',
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
    detail: 'Requires Mara trust 5. Trust her knowledge of your equipment.',
    result: 'Mara cuts the cloak lining open and shows Elene the armourer’s mark from your missing spare.',
  },
  'c3-use-oath-sight': {
    label: 'Speak an Oath only the real captain will keep.',
    detail: 'Spend 1 Oathfire. Bind yourself publicly to protect Harrowfen.',
    result: 'Your Oath burns where everyone can see it. Renn cannot answer with anything but a drawn sword.',
  },
  'c3-talk-double-down': {
    label: 'Offer Renn a chance to surrender.',
    detail: 'Use Empathy to break Ordan’s hold on him.',
    result: 'Renn lowers his blade and warns that the thief on the bridge is Ordan’s rival, not his ally.',
  },
  'c3-disarm-double': {
    label: 'Disarm Renn before he can give another order.',
    detail: 'Spend 2 Stamina. End the false command quickly.',
    result: 'You break Renn’s copied guard and put him on the stones before Ordan reaches the well.',
  },
  'c3-ask-future-warning': {
    label: 'Demand Ordan’s final plan.',
    detail: 'Spend 1 Command. Force Renn to choose between truth and prison.',
    result: 'Renn reveals that Ordan plans to join the fragment with a larger shard on the Mileless Bridge.',
  },
  'c3-cut-glove': {
    label: 'Cut the fragment from Ordan’s silver glove.',
    detail: 'Spend 2 Stamina. Risk a close fight before he reaches the arch.',
    result: 'Your blade tears one glove, but Ordan drops a fire flask and keeps the fragment.',
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
    detail: 'Spend 1 Stamina. Leave the rescue to Elene’s guards.',
    result: 'You stay close enough to see Ordan use the bridge key at the east arch.',
  },
  'c3-oath-hold-harrowfen': {
    label: 'Swear that Harrowfen will not fall for your pursuit.',
    detail: 'Spend 2 Oathfire. Hold the damaged crossing while your allies rescue people.',
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
