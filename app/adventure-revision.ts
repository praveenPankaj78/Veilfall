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
      state.flags.includes('treaty-safe')
        ? 'Mara supports Joren while Brann leads the horses. Lysara carries the sealed treaty chest. Tivik has found one dose of medicine, but the rest of your supplies are soaked.'
        : 'Mara supports Joren while Brann leads the horses. Lysara carries the cracked treaty chest against her body. Tivik has found one dose of medicine, but the rest of your supplies are soaked.',
      'A pale beast moves through the water behind you. Its back is ridged like a crocodile, but its long front legs reach for the road stones. It smells the blood of your wounded.',
      'An older woman opens the inn door and raises a crossbow. “Captain Vey, get them inside. The Crown men who attacked you are coming back.”',
    ],
  },
  'c2-threshold': {
    title: 'Maelin Bellweather',
    location: 'Bellweather Inn, Common Room',
    objective: 'Secure the inn and learn how Maelin knew you were coming.',
    threat: 'Rising',
    body: (state) => [
      'The woman bars the door behind you. Her name is Maelin Bellweather. She has run this inn for thirty years and looks strong enough to throw out anyone who doubts it.',
      state.flags.includes('c2-faced-creature')
        ? 'The mire hound remains in the flooded yard, fixed on the blood running down your shield. Your choice drew it away from every stretcher.'
        : state.flags.includes('c2-ordered-entry')
          ? 'The final guard crosses the threshold inside the shield wall. Not one wounded traveller was separated in the water.'
          : state.flags.includes('c2-oath-found-child')
            ? 'Your Oath led Mara to Nilo before the mire hound could follow the smell of his reopened wound.'
            : 'The mire hound circles outside. It had enough time in the yard to learn the smell of your wounded.',
      'The common room has been turned into a sick ward. A dead Warden lies beneath a grey sheet near the stairs.',
      state.flags.includes('captured-attacker')
        ? 'Brann brings your wounded prisoner inside and ties him beside the pantry. The man finally gives his name as Sable when he sees the body under the sheet.'
        : 'Beside the pantry, a wounded attacker is tied to a post. Maelin found him crawling from the cellar at dawn. He gives his name as Sable and carries the same sealed orders as the road attackers.',
      'A lamp burns above one untouched place setting. Maelin says it belongs to her husband, Dain, who stepped through the stable door during Ordan’s first road test three weeks ago and never returned. She lights it every night in case he finds his way home.',
      'You did not write the warning she is holding. Outside, a hunting horn sounds once in the rain. The attackers are close enough to watch the windows.',
      '“His name was Jory,” Maelin says. “He arrived three days ago with an arrow in his back and a warning in your handwriting. He said royal soldiers would attack this place after you arrived.”',
    ],
  },
  'c2-triage': {
    title: 'Three Beds, One Bottle',
    location: 'Bellweather Inn, Common Room',
    objective: 'Stabilise the wounded before the attack begins.',
    body: (state) => [
      state.flags.includes('captured-attacker')
        ? 'Maelin points to three patients. Nilo’s injured leg has gone cold below the knee. Lysara’s burned hand has begun to swell. Sable, the attacker you captured, is shaking with fever.'
        : 'Maelin points to three patients. Nilo’s injured leg has gone cold below the knee. Lysara’s burned hand has begun to swell. Sable, the attacker Maelin found below the inn, is shaking with fever.',
      state.stats.health <= 2
        ? 'Maelin sees the way you favour one side and presses two fingers against the blood beneath your coat. “You can command another fight,” she says. “You cannot survive one.”'
        : 'Maelin checks the cuts beneath your coat and decides they can wait until the three patients are stable.',
      state.flags.includes('c2-organised-care')
        ? 'The helpers repeat the tasks you gave them. For once, the room answers danger with clear reports instead of shouting.'
        : 'People move between the beds without a plan until Mara begins assigning clean cloth and water.',
      'The sealed medicine can save only one of them from the worst danger. Water, clean cloth, and steady hands must help the others.',
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
      'Tivik holds up the small glass bottle. It can close a deep wound, stop an infection, or save a badly burned hand. It cannot do all three.',
      'Nilo will live with ordinary care, but the damage may cost him his leg. Lysara may lose her hand, the living magic inside it, and her ability to complete the border treaty.',
      state.flags.includes('captured-attacker')
        ? 'Sable’s fever will kill him without the dose. His testimony may be the only proof strong enough to keep the Crown from executing you for the attack.'
        : 'Sable’s fever will kill him without the dose. He may be the only witness who can identify the person who ordered the attack.',
      state.flags.includes('c2-compressed-wound')
        ? 'The pressure bandage you and Mara tied has bought Nilo time. Mara trusts you to make the choice with the danger clearly understood.'
        : 'Mara keeps both hands over Nilo’s bandage. Every fresh stain makes the choice more urgent.',
      'Mara keeps pressure on Nilo’s wound. Lysara hides her shaking hand. Sable watches you through the fever. All three understand what the bottle means.',
    ],
  },
  'c2-eleven-years': {
    title: 'The Innkeeper Who Waits',
    location: 'Bellweather Inn, Hearth',
    objective: 'Understand Jory’s warning before the attackers return.',
    lesson: {
      title: 'What the damaged road did',
      body: 'The buried iron pin keeps nearby roads connected to the places they belong. Someone loosened it, pulling a distant shortcut beside the inn. It changed distance, not time. The pin’s old locks respond to a Warden captain’s authority and Thornweald living magic.',
    },
    body: () => [
      'Maelin gives you Jory’s warning. The handwriting resembles yours, but the words do not sound like you. The order tells Maelin to shelter your party and open the cellar at midnight.',
      'Jory rode here through a shortcut that should begin two days east. The road moved because someone loosened an ancient iron pin under the inn. The pin normally keeps road ends in their proper places.',
      'Dain vanished during the first test. Since then, Maelin has kept his room prepared and watched every road that touches her door. Jory’s arrival proved the same people were returning for a larger attempt.',
      'The pin’s stone lock needs two kinds of authority: a royal Warden captain and Thornweald’s living treaty magic. Ordan did not drive your escort here by chance. He brought both keys to the inn and wounded your people so you would carry them inside.',
      'Maelin lays Jory’s broken arrow on the table. A silver crown is stamped into its head. “Help me close that road,” she says, looking at Dain’s lamp. “Then find the man who opened it.”',
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
      'Mara leans close while you angle the page toward the lamp. Her damp hair brushes your cheek. “He planned for us before you chose a road,” she says. “He needed the captain and ambassador to arrive, not one exact route.”',
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
    body: (state) => [
      state.flags.includes('captured-attacker')
        ? 'Sable sits tied to a flour post. Fever beads on his face, but fear wakes him when you place Jory’s arrow on the table.'
        : 'The wounded man gives his name as Sable. Maelin tied him to the flour post after he crawled from the cellar. Fear wakes him when you place Jory’s arrow on the table.',
      'He names Ordan Vale, a royal courier with silver gloves. Ordan paid Sable’s company to wound the escort, drive you to Bellweather, and pull the iron pin free during the confusion.',
      '“He needed the captain’s road seal and the elf’s living seed under the same roof,” Sable says. “Once both crossed the old stones, his tools could move the pin. He said the road would open a door for the Crown.”',
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
      'The attraction between you has survived years of bad roads and worse timing. It does not remove the danger outside. It gives both of you a reason to survive it.',
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
    body: (state) => [
      'Crossbow bolts punch through the shutters. Brann’s guards brace tables against the front door while Maelin fires through a gap with calm, practised aim.',
      state.flags.includes('c2-held-door')
        ? 'The wounded are already behind Brann’s secured wall. The mire hound limps through the pantry breach with a burned foreleg, weakened by the fight you chose at the door.'
        : state.flags.includes('c2-oath-anchored')
          ? 'The inn shifts, but every living person remains a warm point in your awareness. You call two lost guards back before the moving hall can take them.'
          : state.flags.includes('c2-rope-line')
            ? 'The wounded remain tied behind a disciplined shield line. The mire hound reaches the pantry, but it cannot reach the beds.'
            : 'The mire hound tears through the pantry wall. It is pale, long limbed, and blind except for a strip of red eyes along its neck. Lysara throws green fire across its path, but the spell cannot hold it for long.',
      'A royal soldier shouts for his men to ignore the people and find the cellar. That order tells you exactly what matters.',
      'You can command the whole room, expose Ordan’s written orders, protect the wounded line, or block the cellar with your own body.',
    ],
  },
  'c2-descend': {
    title: 'Who Goes Below',
    location: 'Bellweather Inn, Broken Cellar Door',
    objective: 'Choose one companion and reach the iron pin before Ordan’s soldiers.',
    body: (state) => [
      'Brann can hold the common room. You must go below. The rope found earlier is jerking through the broken arch as men in the tunnel pull at the buried iron.',
      state.flags.includes('c2-no-fight')
        ? 'The shield wall remains intact behind you. Brann has enough guards to hold the wounded line until you return.'
        : state.flags.includes('c2-shielded-descent')
          ? 'You forced a path without losing anyone in the pantry. Brann seals the gap behind you and keeps the attackers above.'
          : state.flags.includes('c2-left-supplies')
            ? 'The barricade bought a head start, although the soldiers will reach the medical supplies when it falls.'
            : 'Fighting continues above. Every person you take below leaves Brann with one less defender.',
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
      state.flags.includes('c2-tracked-stone')
        ? 'The chalk marks you made earlier remain on the proper Eastmere stones. The false beach road has no marks, giving the group one safe line forward.'
        : state.flags.includes('c2-compared-memories')
          ? 'Jory’s route and your map agree on one narrow turn. You recognise it before the moonlit beach can pull you away from the true tunnel.'
          : 'The joined roads look equally solid, so each step must be tested before the group follows.',
      'The mire hound drops into the tunnel behind you. Ahead, three soldiers drag a chain attached to a black iron spike as tall as your arm.',
    ],
  },
  'c2-road-pin': {
    title: 'The Iron That Holds the Roads',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Learn how to secure the pin while your companion holds the enemy back.',
    lesson: {
      title: 'The road pin',
      body: 'The iron pin is an ancient anchor. When it sits firmly in its stone socket, roads stay connected to the correct places. Its old locks opened when Caelan’s road authority and Lysara’s living treaty magic entered the inn. Ordan lured both there so his soldiers could pull it free.',
    },
    body: (state) => [
      'The black pin leans halfway out of a round stone socket. Lines cut into the floor point toward Greyhaven, Harrowfen, the western sea, and lands you do not know.',
      state.flags.includes('c2-trusted-below')
        ? 'Your companion’s chosen path avoided the falling western arch. You reach the chamber before the next enemy pull and keep the whole group on its feet.'
        : 'Loose stones fall behind you. The slower approach leaves the enemy chain tight before you reach the socket.',
      'Each pull on the enemy chain moves the pin another finger width. When it shifts, the beach beside you becomes a mountain pass for a breath, then returns. Distance is breaking around the chamber.',
      'Two fresh lines glow around the socket. One answers your Warden seal. The other answers the green light in Lysara’s injured hand. Ordan needed both of you here before his tools could move the iron.',
      'A crown has been scratched into the pin. Beneath it are Ordan’s initials and a fresh map line pointing east toward Harrowfen.',
      'The pin does not need to be understood in every detail. It needs to be driven home before the tunnel tears apart.',
    ],
  },
  'c2-remove-pin': {
    title: 'Drive It Home',
    location: 'Bellweather Road Tunnel, Pin Chamber',
    objective: 'Reseat the road pin before the tunnel collapses.',
    body: () => [
      'The soldiers pull from the far side while you push. The iron is cold enough to numb your palms. Stone splits above your head and the mire hound charges through the falling dust.',
      'You can use command to time everyone’s effort, strength to force the pin down, a new Oath to bind your promise to the road, or a wagon axle as a hammer. Each method solves the same urgent problem at a different cost.',
      'The last strike will decide whether Bellweather remains connected to Eastmere or becomes a doorway for every army that learns the trick.',
    ],
  },
  'c2-last-testimony': {
    title: 'Proof in the Broken Stone',
    location: 'Bellweather Road Tunnel, After the Siege',
    objective: 'Choose the proof you will carry into Harrowfen.',
    threat: 'Rising',
    body: (state) => [
      'The pin slams into its socket. The beach, mountain, and distant rain vanish. Only the proper Eastmere tunnel remains.',
      'A corner of the socket has broken away. The fragment hums when you face east. Ordan escaped with the missing map page, but he left his orders, his crown mark, and proof that he used you and Lysara to unlock the pin.',
      state.flags.includes('c2-saved-nilo')
        ? 'Nilo keeps his leg, but Lysara’s hand remains bound and Sable may not survive the road to Harrowfen.'
        : state.flags.includes('c2-saved-lysara')
          ? 'Lysara can move every finger again. Tivik says Nilo’s damaged leg may still be saved after a long recovery, while Sable burns with fever.'
          : 'Sable is clear enough to testify. Lysara’s hand remains bound, and Tivik warns Nilo that saving his life may still cost the injured leg.',
      state.flags.includes('c2-felt-road-lives')
        ? 'The lives tied to the pin still press against your Oath. Carrying the iron would help you follow that danger, but testimony may protect the people already caught inside it.'
        : 'The iron, the witnesses, and the public promise each prove a different part of what happened here.',
      'Above, the surviving attackers flee. Harrowfen should be several days away, yet Maelin can see its canal lights beyond the next hill. The broken fragment is still pulling that one road close.',
      'You must decide which proof matters most when the Crown calls you a traitor: Jory’s warning and Sable’s testimony, the iron fragment itself, or an Oath sworn before every survivor.',
    ],
  },
  'c2-ending-testimony': {
    title: 'The Witness Road',
    location: 'Eastmere Road, Outside Bellweather',
    objective: 'Reach Harrowfen with witnesses to Ordan’s attack.',
    body: (state) => [
      state.flags.includes('c2-saved-attacker')
        ? 'You leave Bellweather with Jory’s false warning, Ordan’s supply record, and Sable awake enough to name him. The proof is plain enough for any guard to understand.'
        : 'You leave Bellweather with Jory’s false warning and Ordan’s supply record. Sable fades in and out of fever, so Mara guards every breath he may still use to testify.',
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
    body: (state) => [
      'Harrowfen should be three days east of Bellweather. You reach it after one mile because the fragment in your pack pulls toward something inside the town.',
      'The city rises from black canals on timber walks and stone islands. Rope bridges join tall houses painted blue, red, and gold. Market boats crowd the water below the gate.',
      'Royal archers aim down at you. Ordan Vale stands on the wall in silver gloves. He holds the real route authority you signed in Greyhaven beside a royal warrant accusing you of using that mission to attack Bellweather and steal Crown iron.',
      state.flags.includes('c2-chose-testimony')
        ? state.flags.includes('c2-saved-attacker')
          ? 'Sable forces himself upright in the wagon and names Ordan before the entire wall. A hidden archer fires at him. Mara knocks the bolt aside, turning his testimony into immediate danger.'
          : 'Sable tries to name Ordan, but fever steals his voice. Mara raises Jory’s warning and the supply ledger instead. A hidden archer fires at the papers, proving someone on the wall fears them.'
        : state.flags.includes('c2-chose-pin')
          ? 'You unwrap the iron fragment. It pulls toward the east market so hard that its chains ring. The guards see proof of the danger, but several recoil from you for bringing the weapon inside bow range.'
          : state.flags.includes('c2-oath-expose-crown')
            ? 'You repeat your Bellweather Oath before the wall. Fire turns beneath your armour and pulls toward Ordan. He remains calm, but the royal warrant trembles in his hand.'
            : 'You keep your people still while Ordan reads the charges. Your discipline earns attention, but it does not clear your name.',
      'Behind you, Crown riders appear on the shortened road. You have little time to convince the gate captain before they trap your wounded in the open.',
    ],
  },
  'c3-gate': {
    title: 'A Crime Signed in Your Name',
    location: 'West Gate, Harrowfen',
    objective: 'Earn limited entry without surrendering your wounded to Ordan.',
    body: (state) => [
      'Gate Captain Elene comes through the small door with twelve guards. The route authority is genuine. You signed it. Ordan has attached witness statements claiming a captain in your red cloak robbed the archive, struck two residents, and used correct Warden commands.',
      state.flags.includes('treaty-damaged')
        ? 'He also displays the damaged treaty pages and calls them proof that you sacrificed peace to seize the road weapon. The damage came from your attempt to save lives, but frightened citizens cannot see that choice from a piece of torn paper.'
        : 'The treaty chest remains sealed, which weakens one charge. Ordan answers by naming the people hurt during the ambush and claiming your Oathfire caused the broken road.',
      'Elene does not trust Ordan, but she cannot ignore real signatures, wounded citizens, and a man who knew your commands. She will admit six people under guard if you accept a condition that costs you authority, safety, or privacy.',
      'The Crown riders behind you begin to charge. This choice gets people through the gate. It will not clear your name.',
    ],
  },
  'c3-triage': {
    title: 'Three Leads, One Fugitive',
    location: 'Harrowfen, West Canal',
    objective: 'Choose the fastest way to find Ordan.',
    body: () => [
      'Elene lets your wounded into a healing house under guard. Your weapons remain watched, your name remains accused, and Ordan leaves the wall before you can reach him.',
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
    body: (state) => [
      'Sable is awake when a quarrel breaks the window above his bed. Mara pulls him to the floor as two plain coated soldiers force the back door.',
      state.flags.includes('c2-saved-attacker')
        ? 'The medicine kept his mind clear enough to name both intruders as Ordan’s personal guards.'
        : 'His fever is worsening. He can identify one intruder before his strength fails, which makes the next few breaths important.',
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
      'A brass plate shows the Mileless Bridge, an ancient crossing hidden behind Harrowfen’s east market. Varris sold Ordan the opening word and two brass keys. One key vanished from Ordan’s coat before he left the shop.',
      'Varris remembers the thief: a young man in a dark coat who asked whether the bridge reached places that did not want visitors. He paid for a copied route with a purse Varris had not yet noticed was missing.',
      '“He paid in royal silver,” Varris says. “Then he threatened to cut out my tongue.” A knife moves behind the curtain. Ordan left someone to make that threat real.',
    ],
  },
  'c3-bill': {
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
            ? 'You reach Lantern Bridge with Sable’s identification and one of Ordan’s guards in chains. A dark coated stranger diverted the last crossbow bolt, then stole a brass key from the prisoner.'
            : state.flags.includes('c3-secured-healer')
              ? 'You reach Lantern Bridge with every patient alive. Sable cannot name the guard who escaped, but Healer Iven testifies that Ordan watched the attack from across the canal.'
              : 'You reach Lantern Bridge after the canal cordon trapped one intruder. The prisoner carries Ordan’s silver and a brass bridge key, though Sable was too weak to identify him.'
          : state.flags.includes('c3-unmasked-varris')
            ? 'You reach Lantern Bridge with Varris, Ordan’s written murder order, and the killer you disarmed. The evidence makes the broker willing to accuse Ordan in public.'
            : state.flags.includes('c3-tested-door')
              ? 'You reach Lantern Bridge with Varris and the true brass map you forced him to reveal. The map proves where Ordan intends to escape.'
              : 'You reach Lantern Bridge with Varris, the true bridge map, and proof that Ordan ordered the broker killed. The dark coated thief who took Ordan’s missing key is somewhere ahead.',
      'Ordan waits on the raised centre span with town guards and civilians watching from both banks. He does not deny Bellweather. He argues that independent roads let smugglers, foreign armies, and border lords escape the king’s protection.',
      'Elene hears him, but Ordan’s soldiers still control the bridge winch. Smoke is already rising from the old watch house behind him.',
      '“Your treaty delays one war,” he says. “A Crown road ends every border war before it begins. You command people for their safety, Captain. You bind them with promises. I am only willing to finish what men like you begin.”',
      'He admits why he needed the escort. Your road authority and Lysara’s living seed unlocked the Bellweather pin. He forged Jory’s warning and the Harrowfen evidence, but not the sealed order that changed inside your case. “That was waiting for me,” he says. “Someone above my office wanted you on this road.”',
    ],
  },
  'c3-evidence': {
    title: 'Fire at the Watch House',
    location: 'Harrowfen, Old Watch Lane',
    objective: 'Reach Ordan’s safe room before his men destroy the evidence.',
    body: () => [
      'Ordan drops from Lantern Bridge onto a waiting boat and reaches Old Watch Lane before the guards can lower the span. A boy in a courier coat stumbles from the lane with blood on his sleeve.',
      'Smoke rolls from the watch house roof. Ordan’s men have set the building on fire and barred the lower door to destroy the records behind his argument.',
      'The courier boy carries a satchel of orders. People are trapped in the rooms above him. Ordan is escaping across the roofs. You can save only one advantage before the flames spread.',
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
        : 'Mara rests her shoulder against yours. Lysara keeps her eyes on the map. Both wait for you to choose which danger comes first.',
      state.stats.health <= 2
        ? 'Mara’s hand closes around your wrist when your balance shifts. Lysara looks from the blood on your sleeve to the burning market. Neither woman says retreat. Both understand that another direct charge may be your last.'
        : 'Smoke stings your lungs, but the brief pause steadies your legs before the market fight.',
      'Mara wants guards at the healing house. Lysara wants to reach the east market before Ordan opens the bridge. Supporting either woman will protect something important and leave something else exposed. A larger plan will demand more from your tired guards.',
      'Mara looks down at the streets. “People first.” Lysara’s hand stays on the map. “And the cause of this, before it creates more wounded.”',
    ],
  },
  'c3-market-memory': {
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
      'High above them, the dark coated thief swings from a dye merchant’s rope. He catches a falling child with one arm, sets her on a balcony, and removes a silver key from an Ordan guard with the other. As he swings past Mara’s shield, you see a fine wire slip beneath the fragment’s leather strap. Then he follows Ordan across the roofs.',
      'The fragment tears through its wrapping. For a few seconds, one market street connects to a snowy mountain pass. Cold wind and snow burst between the stalls. The road returns when Mara slams the fragment under a shield.',
      'Now the danger is clear. If Ordan joins this fragment to the larger piece near the bridge, he can pull an army road into Harrowfen.',
    ],
  },
  'c3-pin-test': {
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
      'He is an ordinary man, frightened and ambitious, using your uniform to make every crime look like your order.',
      'Ordan circles toward the well while everyone watches the two captains. You can confront Renn alone, trust Mara to expose the cloak’s hidden mark, or use your Oath to make a promise only the real captain would keep.',
    ],
  },
  'c3-duplicate': {
    title: 'A Warden Bought by Silver',
    location: 'Harrowfen East Market',
    objective: 'Defeat Renn and learn Ordan’s final plan.',
    body: () => [
      'His orders say the Mileless Bridge leads to many borders. With the joined iron pieces, Ordan could move soldiers across the world without crossing the lands between them.',
      'Elene’s guards have already turned on Ordan’s soldiers. The town bells begin to declare the royal warrant false. Your name is not clean everywhere, but here the people have seen what kind of captain you chose to be.',
      'Renn’s courage breaks when the town guards recognise your old cloak. He draws anyway. “Ordan promised the Wardens would command every road in the kingdom,” he says.',
    ],
  },
  'c3-courier': {
    title: 'Silver Gloves at the Well',
    location: 'Harrowfen East Market',
    objective: 'Stop Ordan escaping with the iron fragment.',
    body: (state) => [
      'Ordan holds the fragment in one silver glove and a small bridge key in the other. He is lean, clean shaven, and calm enough to look harmless until he smiles.',
      state.flags.includes('c3-double-disarmed')
        ? 'Renn never sent his warning. Only two bridge guards reach Ordan before Harrowfen’s soldiers close the market behind them.'
        : state.flags.includes('c3-bridge-warning')
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
      'If you stop to save the healing house, people live but Ordan gains distance. If you chase at once, he has less time to prepare the bridge. If you accept a new Oath, you may hold the damaged crossing long enough to do both.',
      'This is the cost of pursuit. The enemy chooses where to cause pain. You choose what your victory is allowed to sacrifice.',
    ],
  },
  'c3-pursuit': {
    title: 'The Hidden Road East',
    location: 'Harrowfen, East Arch',
    objective: 'Prepare for the Mileless Bridge and follow Ordan.',
    body: (state) => [
      'Beyond the arch, an ancient bridge curves into mist. Its first span hangs over Harrowfen’s canal. Farther spans appear beneath unfamiliar skies, each touching a distant border.',
      'The bridge does not create other times or other people. It joins faraway places. Ordan can use the fragment to choose which border touches the next arch.',
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
    body: (state) => [
      'Lysara names the iron at last. “World Nail,” she says. “Old stories say it fixed distance in place when the world was young. These road pins are broken pieces of it.”',
      state.flags.includes('c3-oath-trail')
        ? 'Your Oath leads the group across the correct spans without delay. You reach Ordan before the hidden soldiers can finish forming ranks.'
        : 'The moving spans cost precious time. The first rank of hidden soldiers is already crossing when you reach Ordan.',
      'Ordan presses your fragment against a larger shard set into the bridge. An arch opens onto ranks of Crown soldiers. You strike his arm while Lysara pulls the pieces apart with living thread. The army road closes. Harrowfen is safe from invasion, and Ordan’s immediate plan has failed.',
      'The dark coated thief drops from the arch above and pulls the wire he planted in the market. The fragment leaps from Ordan’s belt into his sleeve. “Good news,” he says. “Your road works. Bad news, I need it.” He is quick, young, and smiling as if the end of the world is a private joke.',
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
      'Ahead, the dark coated thief pulls a wire you did not see him plant. The fragment jumps from Ordan’s belt into his hand, and he bows before running toward the broken centre. The courier and his soldiers chase him. You now have allies behind you and two dangerous men ahead.',
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
    result: 'Your Oath draws you toward Nilo. The wound in his leg has reopened beneath the wagon blanket.',
  },
  'c2-guard-rear': {
    result: 'The mire hound keeps its distance while it learns your scent. One claw cuts a red line into the final road stone.',
  },
  'c2-carry-first': {
    result: 'You carry Nilo directly to Maelin’s fire and hold his wound closed. The deepest bleeding slows before the others enter.',
  },
  'c2-search-threshold': {
    result: 'The common room is clear. You find Jory’s covered body, Sable tied near the pantry, and fresh scratches on the cellar door.',
  },
  'c2-medicine-lysara': {
    label: 'Give the medicine to Lysara.',
    detail: 'Spend 1 Medicine. Save her hand, living magic, and ability to complete the treaty.',
    result: 'The green lines withdraw from Lysara’s arm. She closes her fingers around yours and says, “I know what this cost.”',
  },
  'c2-medicine-nilo': {
    label: 'Give the medicine to Nilo.',
    detail: 'Spend 1 Medicine. Save his injured leg from permanent damage.',
    result: 'Warmth returns below Nilo’s knee. Tivik grips the boy’s hand and finally says that the leg can be saved.',
  },
  'c2-medicine-attacker': {
    label: 'Give the medicine to Sable.',
    detail: 'Spend 1 Medicine. Preserve the witness who may keep the Crown from condemning you.',
    result: 'Sable’s breathing steadies. “Get me before a town guard,” he says, “and I will name the man in silver gloves.”',
  },
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
    changes: { resolve: -1 },
    requires: { resolve: 1 },
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
    detail: 'Spend 1 Health to slow their pull on the road pin.',
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
    detail: 'Spend 1 Health. Push through the pantry fight without defeating every attacker.',
    result: 'Shields strike armour. Your group reaches the cellar stairs while Brann holds the line behind you.',
  },
  'c2-hold-door': {
    label: 'Hold the broken pantry against the mire hound.',
    detail: 'Spend 2 Health and keep the beast away from the wounded.',
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
    changes: { command: -1 },
    requires: { command: 1 },
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
    detail: 'Spend 3 Health. Succeed now and accept a lasting injury.',
    result: 'You drive the iron home. Pain tears across your back, but the distant roads vanish from the tunnel.',
  },
  'c2-oath-pull': {
    label: 'Bind your Oath to the road and command it to hold.',
    detail: 'Spend 2 Resolve. Gain 3 Oathfire and bind your promise to the repaired road.',
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
    detail: 'Requires Mara trust 5. Risk embarrassment to prove the trap.',
    requiresRelationships: { mara: { trust: 5 } },
    result: 'Mara finds a practice forgery sewn into your cloak lining. Ordan planted his own proof.',
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
    detail: 'Requires Lysara trust 4. Use her living magic to save the proof.',
    result: 'Green threads lift the scorched writing before it crumbles. Ordan’s name remains readable.',
  },
  'c3-show-nilo-memory': {
    label: 'Put yourself between Sable and the crossbow.',
    detail: 'Spend 1 Resolve. Keep the witness alive while Mara fights the intruders.',
    changes: { resolve: -1 },
    requires: { resolve: 1 },
    addFlags: ['c3-sable-identified-guard'],
    result: 'The next bolt strikes your shield. Sable sees Ordan’s guard clearly and gives you his name.',
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
    result: 'Ordan calls choice a luxury of peaceful times. Several town guards hear the threat hidden inside his answer.',
  },
  'c3-ask-town-memory': {
    label: 'Make Ordan answer to the people he endangered.',
    detail: 'Gain 1 Command by putting Harrowfen’s voices before a debate between officers.',
    result: 'Maelin’s journal and Harrowfen’s wounded are read aloud. Ordan defends the future while the crowd sees who paid for his plan today.',
  },
  'c3-let-iron-point': {
    label: 'Demand to know why Ordan needed you and Lysara.',
    detail: 'Force him to explain the trap in front of Elene and the town.',
    result: 'Ordan admits that your road authority and Lysara’s living seed opened the two locks beneath Bellweather.',
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
    detail: 'Accept the colder duty and strengthen Lysara’s trust and attraction.',
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
