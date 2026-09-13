import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function bridgeParting(state: GameState) {
  if (has(state, 'c4-rook-arrested')) {
    return 'Rook escaped your cuff at the final arch and took the lower road toward the Underways. He left a mirrored coin marked with one safe northern turn, four patrol lines, and the shape of a seal press. The empty place at your belt still tightens your jaw.';
  }
  if (has(state, 'c4-rook-bargain')) {
    return 'Rook took the Underways to follow his buyer’s trail. He spoke the warning required by your bargain: royal watchers held the first mountain pass, and no fire was safe before the blue glass. His marked coin carries the route, patrol lines, and seal press he showed Mara.';
  }
  if (has(state, 'c4-rook-trusted')) {
    return 'You trusted Rook to choose his own road. He chose the Underways while you turned north. The silver knot he left holds the black wax outline of one entrance to the royal camp. Trust did not make him obedient. It made his absence useful.';
  }
  return 'Rook’s Chapter Four departure route is not recorded.';
}

function partingTool(state: GameState) {
  if (has(state, 'c4-rook-arrested')) {
    return 'Mara sets the mirrored coin Rook abandoned beside Sorin’s charcoal map. One side shows the safe northern turn. Four short marks and a square seal cover the other.';
  }
  if (has(state, 'c4-rook-bargain')) {
    return 'Mara sets Rook’s marked coin beside Sorin’s charcoal map. Its four patrol lines and square seal match the warning he gave at the bridge.';
  }
  if (has(state, 'c4-rook-trusted')) {
    return 'Mara unties the silver knot Rook left at the bridge. The black wax inside still carries the hidden camp entrance he showed you before taking the Underways.';
  }
  return 'No Chapter Four parting tool is recorded.';
}

function rookMapMemory(state: GameState) {
  const caelanMap = has(state, 'c4-lysara-mapped-nine')
    ? 'Lysara’s treaty book holds all nine marks, so losing the fragment would not erase their locations.'
    : has(state, 'c4-sensed-northern-nail')
      ? 'Your Oath identified the northern fire mark without revealing the other eight locations to Rook.'
      : has(state, 'c4-memorised-nine')
        ? 'You remember the northern mark clearly, but the fragment remains your only complete record of the other eight.'
        : 'No Chapter Four map-record choice is recorded.';
  if (has(state, 'c4-rook-full-copy')) {
    return `Rook entered the Underways with the complete nine mark copy you allowed him to make. The real fragment remains in your pack. ${caelanMap}`;
  }
  return `Rook entered the Underways with only a thin wax scrap showing the northern mark and two blurred roads. The real fragment remains in your pack. ${caelanMap}`;
}

function relationshipInterlude(state: GameState) {
  if (has(state, 'c5-chose-mara-care')) return 'c5-mara-burns';
  if (has(state, 'c5-chose-lysara-care')) return 'c5-lysara-burns';
  return 'c5-sorin-care';
}

function ordanCustody(state: GameState) {
  if (has(state, 'c4-captured-ordan')) {
    return 'Ordan did not come north. At the dividing roads, Mara and one guard returned him to Elene with Garran, the witnesses, and the remaining satchel papers. You kept the royal dispatch. The living prisoner is now part of Harrowfen’s case against the Crown.';
  }
  if (has(state, 'c4-ordan-lower-road')) {
    return 'Ordan escaped onto a lower road, but the dispatch taken from him led you here. Every time you unfold it, the memory of his empty chain returns with it.';
  }
  return 'Ordan is gone, but the genuine royal dispatch from his coat led you here. His part in the pursuit is over. The authority above him is not.';
}

function routeMemory(state: GameState) {
  if (has(state, 'c4-snow-route')) {
    return 'The blue fire resembles the flames that burned in stone bowls on the bridge’s mountain road. Those flames stayed beside the path. These reach through your armour for the warmth underneath.';
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

function shelterWarmth(state: GameState) {
  if (!has(state, 'c5-lost-winter-supplies')) {
    return has(state, 'c5-lantern-relay')
      ? 'The lantern relay brought everyone across quickly enough to save the blankets and lamp oil. Mara sits beside you beneath one blanket and studies the pale burn around your glove.'
      : 'Mara sits beside you beneath one blanket. Her shoulder presses against yours while she studies the pale burn around your glove.';
  }
  const maraRomanceOpen =
    state.relationships.mara.attraction >= 3 &&
    state.relationships.mara.intent !== 'platonic' &&
    state.relationships.mara.intent !== 'ended';
  return maraRomanceOpen
    ? `The ${has(state, 'c5-lantern-relay') ? 'lantern relay preserved the ration pack long enough for you to trade it for Sorin’s life, but now' : 'sacrificed ration pack saved Sorin, but'} only one blanket remains for every two people. Mara sits close enough that the heat of her thigh reaches yours through wet cloth. The attraction between you makes the necessary closeness harder to ignore.`
    : `The ${has(state, 'c5-lantern-relay') ? 'lantern relay preserved the ration pack long enough for you to trade it for Sorin’s life, but now' : 'sacrificed ration pack saved Sorin, but'} only one blanket remains for every two people. Mara shares yours so neither of you loses more heat. She checks the numb line on your hand with the focus of an experienced guard.`;
}

function approachPayoff(state: GameState) {
  if (has(state, 'c5-stair-formation')) {
    return 'The shield formation reaches the grave with every rope and climbing hook intact.';
  }
  if (has(state, 'c5-silenced-archers')) {
    return 'No warning horn follows from the stair. Hale will not know which entrance you used.';
  }
  if (has(state, 'c5-stair-scorched-thread')) {
    return 'Three burned strands hang from Lysara’s seed. The false paths worked, but she has less living thread for the door.';
  }
  if (has(state, 'c5-river-oath-path')) {
    return 'The sealed keeper door revealed by your false heartbeat opens directly beside the grave ring.';
  }
  if (has(state, 'c5-river-dark-crossing')) {
    return 'The river kept your lights and footprints hidden. No royal scout follows you to the grave door.';
  }
  if (has(state, 'c5-seed-scorched-river')) {
    return 'Lysara’s seed is scorched from carrying your warmth. She has enough thread to find the lock, but not enough to hide the whole group again.';
  }
  if (has(state, 'c5-held-ash-beam')) {
    return 'Every companion and evidence pack made it through the tunnel while you held the beam.';
  }
  if (has(state, 'c5-trapped-drill-crew')) {
    return 'The buried drill is silent above you. Its crew will need time to dig out the smaller cutting frame.';
  }
  return 'Hale heard Sorin’s keeper warning. Royal boots answer somewhere above the tunnel.';
}

function lysaraHandCondition(state: GameState) {
  if (has(state, 'c2-saved-lysara')) {
    return 'The medicine at Bellweather saved Lysara’s hand. Her grip on the glass seed is steady, though the cold bindings can still damage its living threads.';
  }
  return 'Lysara’s injured hand never fully recovered after Bellweather. Sorin binds her wrist before she uses the glass seed, and you support her forearm when precise control matters.';
}

function relationshipMinute(state: GameState) {
  if (has(state, 'c5-fast-to-vaor')) {
    return 'The broken plate opened a direct path. Hale has not reached the gallery yet, so Sorin claims one minute for the burn before you move again.';
  }
  return 'Metal strikes the outer door. Sorin needs one minute to reset the moving plates ahead, and he uses the same minute to treat the burn. Nobody mistakes it for safety.';
}

function haleArrival(state: GameState) {
  if (has(state, 'c5-fast-to-vaor')) {
    return 'The direct path brought you here before Hale could brace the portable drill. He enters with its frame half assembled and leaves four soldiers behind to carry the missing supports.';
  }
  if (has(state, 'c5-crown-lost-trail') && !has(state, 'c5-crown-saw-flare')) {
    return 'Hale was already working above the abandoned camp, but you hid your trail. Half his soldiers are still searching the lower valley, so only six enter behind him.';
  }
  if (has(state, 'c5-crown-saw-flare')) {
    return 'Hale was already above the camp. The blue flare showed him exactly which grave door you opened, and his full force followed it here.';
  }
  if (has(state, 'c5-diverted-patrol-with-seal')) {
    return 'Your false order sent the returning patrol downhill. Hale enters with the smaller squad that stayed beside the drill.';
  }
  if (
    has(state, 'c5-silenced-archers') ||
    has(state, 'c5-river-dark-crossing')
  ) {
    return 'Your hidden approach denied Hale a warning. Several soldiers are still guarding the wrong entrance.';
  }
  if (has(state, 'c5-trapped-drill-crew')) {
    return 'Hale’s crew freed only the smaller cutting frame from the fallen tunnel. Ash grinds inside its gears, and four soldiers remain behind with the buried drill.';
  }
  if (has(state, 'c5-sorin-revealed-to-crown')) {
    return 'Sorin’s keeper warning told Hale which tunnel remained open. His full surviving force followed the signal.';
  }
  if (has(state, 'c5-slow-shadow-crossing')) {
    return 'Your slow first crossing gave the returning patrol time to join Hale. His full surviving force enters behind him.';
  }
  return 'Hale was already working above the abandoned camp. His surviving patrol followed your ordinary trail to the grave.';
}

function vaorLockClue(state: GameState) {
  if (has(state, 'c4-rook-arrested') || has(state, 'c4-rook-bargain')) {
    return 'A narrow lock beside Vaor’s claw opens and closes like iron teeth. The mirrored coin left at the bridge warms in Mara’s pocket. Its scratched edge matches the lock without risking a hand.';
  }
  return 'A narrow lock beside Vaor’s claw opens and closes like iron teeth. Rook’s silver knot holds map wax, not metal. It can preserve a road or a memory, but it cannot safely test those teeth.';
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

function vaorHistoryJudgment(state: GameState) {
  if (has(state, 'c5-broke-memory-slab')) {
    const repairs: string[] = [];
    if (has(state, 'c5-vaor-trusted-memory')) repairs.push('carried my grief');
    if (has(state, 'c5-defended-living-world'))
      repairs.push('defended living people without defending the lie');
    if (has(state, 'c5-shared-dragon-witness'))
      repairs.push('gave my truth four living witnesses');
    if (has(state, 'c5-knows-orivane-renewal-wish'))
      repairs.push('heard Orivane’s final demand');
    if (has(state, 'c5-lysara-sorted-memories'))
      repairs.push('kept my private days outside your search');
    if (
      has(state, 'c5-has-extraction-order') ||
      has(state, 'c5-royal-witnesses-turned')
    )
      repairs.push('carried proof against Malrec');
    return repairs.length
      ? `Vaor looks past you to the empty frame where his summer day once lived. “You broke what was mine. Afterward, you ${repairs.join(', and ')}. That does not restore the day. It gives you a way to ask forgiveness instead of pretending the harm vanished.”`
      : 'Vaor looks past you to the empty frame where his summer day once lived. “You destroyed part of my life for speed, then asked me for fire,” he says. “You may take it by force. A willing answer now requires repair.”';
  }
  const judgments: string[] = [];
  if (has(state, 'c5-asked-memory-permission'))
    judgments.push('You asked before entering my memories');
  if (has(state, 'c5-vaor-heard-first'))
    judgments.push('you lowered steel and heard me first');
  if (has(state, 'c5-vaor-trusted-memory'))
    judgments.push('you carried my grief without making it smaller');
  if (has(state, 'c5-defended-living-world'))
    judgments.push(
      'you defended living people without defending the rulers who lied',
    );
  if (has(state, 'c5-lysara-sorted-memories'))
    judgments.push('you let your envoy keep my private days untouched');
  if (has(state, 'c5-freed-vaor-claw'))
    judgments.push('you freed my claw before asking what it could do for you');
  if (has(state, 'c5-secured-warm-shelter'))
    judgments.push(
      'you first raised iron, then used that demand to secure shelter for your people',
    );
  if (has(state, 'c5-knows-orivane-renewal-wish'))
    judgments.push(
      'you stayed long enough to hear Orivane ask for a new judgment',
    );
  if (has(state, 'c5-memorised-founder-seals'))
    judgments.push(
      'you remembered that several peoples buried the truth together',
    );
  if (
    has(state, 'c5-has-extraction-order') ||
    has(state, 'c5-royal-witnesses-turned')
  )
    judgments.push('you carried proof that can make Malrec answer');
  if (has(state, 'c5-staged-reflected-ember'))
    judgments.push(
      'you used a decoy to stop the drill without feeding soldiers to it',
    );
  if (has(state, 'c5-vaor-broke-drill'))
    judgments.push(
      'you trusted my freed claw and bound its strike away from surrendering soldiers',
    );
  if (!judgments.length) {
    return 'Vaor studies the people and proof that survived the collapse. “I know what you did in this grave,” he says. “Choose, and let the choice name you.”';
  }
  return `Vaor counts the record without praise. “${judgments.join('; ')}. I will answer the person those acts reveal, not the badge you carry.”`;
}

function collapseInventory(state: GameState) {
  let people = 'Mara, Lysara, Sorin, and you reach Vaor’s shelter.';
  if (has(state, 'c5-saved-chosen-companion')) {
    const saved = has(state, 'c5-chose-lysara-care')
      ? 'Lysara'
      : has(state, 'c5-chose-mara-care')
        ? 'Mara'
        : 'Sorin';
    people = `${people} ${saved} is unhurt because you took the falling shelf. Sorin carries the oldest memory plate, and the fragment remains with the group.`;
  } else if (has(state, 'c5-saved-memory-witnesses')) {
    people = `${people} The moving shelter preserves three memory plates and keeps the fragment secure.`;
  } else if (has(state, 'c5-oath-held-memory-grave')) {
    people = `${people} Your Oath holds long enough for Sorin to choose six portable plates. The rest remain suspended until the last person is clear.`;
  } else if (has(state, 'c5-lost-royal-camp-proof')) {
    people = `${people} The fragment and every item already carried in a coat or pack survive. Hale’s loose drill logs and copied camp records break beneath the fallen gallery.`;
  }

  if (has(state, 'c5-royal-witnesses-turned')) {
    people +=
      ' Six soldiers lowered their crossbows. Four stay behind the gallery shields to free wounded comrades and guard Hale. Two leave with you as royal witnesses.';
  } else if (has(state, 'c5-trapped-hale-with-gallery')) {
    people +=
      ' Hale remains alive behind fallen glass while the surviving royal soldiers dig toward him.';
  }
  return people;
}

function evidenceLeavingDragonspine(state: GameState) {
  const evidence: string[] = [];
  if (has(state, 'c5-has-extraction-order'))
    evidence.push('Malrec’s extraction order remains inside your coat');
  if (has(state, 'c5-memory-copied-to-map-wax'))
    evidence.push('Orivane’s memory survives in black map wax');
  if (has(state, 'c5-saved-memory-witnesses'))
    evidence.push('three memory plates travel with Sorin');
  if (has(state, 'c5-oath-held-memory-grave'))
    evidence.push('six memory plates travel with Sorin');
  if (has(state, 'c5-knows-orivane-renewal-wish'))
    evidence.push(
      'you remember Orivane’s demand that the living judge the Concord again',
    );
  if (has(state, 'c5-memorised-founder-seals'))
    evidence.push(
      'you can name the peoples whose rulers sealed the truth together',
    );
  if (has(state, 'c5-lost-parting-route'))
    evidence.push(
      'the black wax no longer carries the hidden camp route you traded for memory proof',
    );
  if (!evidence.length)
    return 'The truth leaves mainly in four living memories. It will need witnesses who trust your account.';
  return `${evidence.join('; ')}. None of it is left beside Hale’s control platform.`;
}

const pactTerms =
  '“We carry the ember together to the black stone gate,” you say. “We use it to protect living people and expose what the Concord erased. Either of us may refuse a use of the ember. Your body remains yours. The pact ends when the gate is safe and both of us say our shared duty is complete. Then, at your word, your voice and ember leave me.” Vaor answers, “I accept. Neither bearer commands the other.”';

export const chapterFiveNodes: Record<string, StoryNode> = {
  'c5-north-road': {
    id: 'c5-north-road',
    kicker: 'Chapter Five',
    title: 'The Dragon’s Cold Grave',
    location: 'The Glass Valleys of Dragonspine',
    objective:
      'Reach the active fire Nail before the Regent’s soldiers cut into it.',
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
      bridgeParting(state),
      rookMapMemory(state),
      'Now blue flame rises from cracks on both sides of the path. It bends against the wind and reaches toward your lantern.',
      routeMemory(state),
      'Mara covers the lantern. The blue fire ignores the darkness and bends toward your exposed hand. You press your palm to the black glass. It steals enough heat to make the nearest flame turn away, leaving a pale numb line across two fingers. It is a shallow cold burn, painful but not a loss of Health. Old strips of keeper cloth lie frozen against the wall, cold enough to hide a body’s warmth for a few minutes.',
      'The road ahead narrows between two walls of glass, and the flames are already closing behind you. Mara asks, “How do we cross?”',
    ],
    choices: [
      {
        id: 'c5-cross-in-shadow',
        label:
          'Wrap everyone in glass chilled cloth and crawl along the cold wall.',
        detail:
          'Mask body heat for a slow crossing, but give the royal patrol more time to follow.',
        advantage:
          'The party enters the valley without feeding the fire or spending a stat.',
        addFlags: ['c5-slow-shadow-crossing'],
        result:
          'You wrap the group in cloth chilled by the black glass and keep every shoulder against the wall. The blue fire searches past your hidden warmth while a distant royal horn gains ground.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-command-lantern-relay',
        label: 'Send the lanterns ahead in a timed relay.',
        detail:
          'Spend 1 Command making the fire chase moving heat instead of your people.',
        advantage:
          'The relay should let the whole party cross quickly with its winter supplies intact.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-lantern-relay'],
        result:
          'Lanterns pass from hand to hand, always one turn ahead. The blue fire follows the warm metal while your people cross behind it.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-oath-draw-coldfire',
        label: 'Promise that no flame will touch anyone while you lead.',
        detail:
          'Spend 1 Oathfire drawing the cold fire toward your sworn protection.',
        advantage:
          'The promise should shield every companion and reveal whether the fire can hear an Oath.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c5-carried-first-grief'],
        result:
          'Your promise burns gold around the group. The blue flames avoid them and follow you instead. For one breath, grief that is not yours presses behind your eyes.',
        next: 'c5-coldfire-rescue',
      },
      {
        id: 'c5-guard-rear-crossing',
        label: 'Take the rear and break every flame that reaches the path.',
        detail:
          'Lose 1 Health keeping the cold fire away from the slower climbers.',
        advantage:
          'Holding the rear should keep the party moving and stop the fire marking another traveller.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-burned-at-rear'],
        result:
          'You crush each blue tongue under iron before it reaches the line. The cold burns through your boot, but nobody behind you is touched.',
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
    body: (state) => [
      'A man pounds on the inside of a fallen glass slab. One leg is pinned beneath it. Blue fire moves across the clear surface toward the heat of his hands.',
      '“Sorin,” he gasps when he sees you. “I keep the old path to the dragon’s grave. Please. Get this off me before the fire reaches my hands.”',
      has(state, 'c5-burned-at-rear')
        ? 'The deeper burn in your boot answers when your pale fingers close around the slab. “The dragon’s grave,” Sorin gasps. Blue fire touches his knuckles, and the rest of the answer becomes a scream.'
        : 'Your pale, cold burned fingers close around the slab. “The dragon’s grave,” Sorin gasps. Blue fire touches his knuckles, and the rest of the answer becomes a scream.',
    ],
    choices: [
      {
        id: 'c5-lift-glass-slab',
        label: 'Lift the slab while Mara pulls Sorin free.',
        detail:
          'Lose 1 Health taking the glass weight through your injured body.',
        advantage:
          'Reaching him directly should save Sorin with his maps and full ability to guide the climb.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-sorin-full-guide'],
        result:
          'The glass edge cuts through your glove as you lift. Mara drags Sorin clear with his map case still across his shoulders.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-command-slab-rope',
        label: 'Build a rope lift and call the pull together.',
        detail:
          'Spend 1 Command coordinating strength before the fire arrives.',
        advantage:
          'A clean lift should free Sorin without injury and teach the group the rhythm of mountain rescue.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-sorin-full-guide'],
        result:
          'Rope tightens around the glass. Your count turns six exhausted people into one clean pull, and Sorin rolls free before the flame reaches him.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-sacrifice-winter-pack',
        label: 'Throw the warm ration pack beyond the slab.',
        detail:
          'Sacrifice food and blankets so the fire follows a stronger source of heat.',
        advantage:
          'The party gains enough time to free Sorin without spending a stat.',
        addFlags: ['c5-lost-winter-supplies'],
        result:
          'The pack lands and splits. Stored warmth rises from blankets and bread. The blue fire turns, and you free Sorin while it consumes the supplies meant for the summit.',
        next: 'c5-glass-shelter',
      },
      {
        id: 'c5-feed-fragment-fire',
        label: 'Hold the fragment near the fire and draw it away.',
        detail:
          'Spend 1 Resolve letting the active Nail pull against the iron in your hand.',
        advantage:
          'The fragment may draw the fire away and reveal the direction of the buried dragon.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-fragment-found-grave'],
        result:
          'The fire leaves Sorin and circles the fragment. Pain points through your arm toward a bright mark high inside the mountain.',
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
      'Your shoulders loosen as your breathing settles, but the pale edges of your burns do not close. Outside, blue flame keeps circling the glass. Until you leave its reach, rest will not restore the Health it has taken.',
      shelterWarmth(state),
      partingTool(state),
      'Once he can breathe without shaking, Sorin explains what he could not say beneath the glass. Vaor is an ancient dragon imprisoned beside the fire Nail a century ago.',
      'Two nights ago, royal soldiers broke the outer seal and woke him. When Vaor resisted, they fixed new drill clamps around his prison. Several soldiers died. The survivors carried a smaller cutting frame higher into the mountain.',
      'Sorin sketches three paths to the upper grave, then plants the charcoal point in the centre of the map. “We have time to settle one thing before we move,” he says.',
    ],
    choices: [
      {
        id: 'c5-let-mara-check-burns',
        label: 'Ask Mara to take responsibility for the burn.',
        detail:
          'Choose Mara’s field care and let her judge whether your hand can still hold a weapon.',
        advantage: 'Mara learns which burn may fail during the final climb.',
        addFlags: ['c5-let-mara-check-burns', 'c5-chose-mara-care'],
        result:
          'Mara unwraps your hand and marks the edge of the numb skin with ink. “If it crosses that line, you tell me,” she says. You promise without using magic.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-ask-lysara-read-nail',
        label: 'Ask Lysara to trace the Nail’s heat through your burn.',
        detail:
          'Spend 1 Resolve and let Lysara trace the Nail while she checks the burn.',
        advantage:
          'The reading may show whether the dragon and the fire Nail occupy the same chamber.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        showIfAllFlags: ['c2-saved-lysara'],
        addFlags: ['c5-chose-lysara-care'],
        result:
          'Green thread passes through the black iron and points upward. Lysara feels a heartbeat behind the fire mark. The Nail is not merely near a dragon. It is touching one.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-ask-lysara-read-nail-strained',
        label: 'Support Lysara’s injured hand while she traces the Nail.',
        detail:
          'Spend 1 Resolve helping her control the seed. The strain may weaken its living threads later.',
        advantage:
          'The supported reading may reveal whether the dragon and the fire Nail share a chamber.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        hideIfAnyFlags: ['c2-saved-lysara'],
        addFlags: ['c5-chose-lysara-care', 'c5-lysara-reading-strain'],
        result:
          'You brace Lysara’s forearm while green thread passes through the black iron. The seed trembles, but it points upward to a heartbeat touching the Nail.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-question-sorin-paths',
        label: 'Ask Sorin to treat the burn and explain the old paths.',
        detail:
          'Keep the wound in a keeper’s hands and learn the purpose of each route.',
        advantage:
          'Sorin explains which danger belongs to each route before you commit.',
        addFlags: ['c5-knows-route-purposes', 'c5-chose-sorin-care'],
        result:
          'Sorin dresses the pale edge of the burn while he talks. The stair was built for soldiers, the frozen river for dragon keepers, and the ash tunnel for carrying injured climbers down.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-decode-parting-clue',
        label: 'Decode the marks on Rook’s mirrored coin.',
        detail:
          'Let Sorin handle the burn while you match the four lines and square to the royal camp.',
        advantage:
          'The clue reveals the patrol schedule and the location of the commander’s seal press.',
        showIfAnyFlags: ['c4-rook-arrested', 'c4-rook-bargain'],
        addFlags: ['c5-decoded-parting-clue', 'c5-chose-sorin-care'],
        result:
          'Sorin matches the four lines to the patrol’s return times and the square to a seal press inside the commander’s tent. Rook showed you both marks before he took the Underways.',
        next: 'c5-royal-camp',
      },
      {
        id: 'c5-decode-trust-knot',
        label: 'Open Rook’s silver knot over Sorin’s map.',
        detail:
          'Let Sorin handle the burn while you place the black wax outline against the camp paths.',
        advantage:
          'The wax should reveal an unguarded entrance, but it carries no patrol time or commander’s seal.',
        showIfAnyFlags: ['c4-rook-trusted'],
        addFlags: ['c5-decoded-trust-knot', 'c5-chose-sorin-care'],
        result:
          'The wax outline matches a narrow split behind the royal camp. It shows one hidden entrance and nothing more. The knot remains tied around the wax.',
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
      'Asterra’s crowned shield marks every coat. Your colours. Your kingdom. Your stomach tightens. Sorin points to Regent Malrec’s private seal on the drill. Malrec sent this private force. Commander Hale leads it in the mountain. The ill Queen gave neither order.',
      has(state, 'c5-decoded-parting-clue')
        ? 'The same square mark appeared in the clue you decoded at the refuge. Rook’s buyer knew this camp and has already moved east.'
        : has(state, 'c5-decoded-trust-knot')
          ? 'The black wax outline matches a split behind the camp. You entered through it unseen. Nothing here names Rook’s buyer.'
          : 'Nothing here names Rook’s buyer. That trail remains Rook’s to follow beneath the world.',
      'A diagram beside the drill names its target: a living ember, a piece of Vaor’s own fire. The ember is not the fire Nail. Hale means to cut it out of the dragon and use it to control the damaged Nail.',
      'A surviving patrol is climbing back toward camp. You hear boots on glass and estimate four minutes before they see you.',
      has(state, 'c5-decoded-parting-clue')
        ? 'The hidden mark leads Mara to the commander’s seal press beneath a false floorboard. The thief could not steal it from the Underways, but he showed you exactly where to look.'
        : has(state, 'c5-decoded-trust-knot')
          ? 'The hidden entrance opens behind the locked commander’s tent. You can search the dead or the drill before the patrol reaches the front of camp.'
          : 'The commander’s tent is locked, the dead may carry clues, and the drill still points toward the upper grave.',
    ],
    choices: [
      {
        id: 'c5-recover-regent-order',
        label: 'Open the command chest and take the written order.',
        detail:
          'Spend 1 Command organising a fast search without disturbing the camp’s warning lines.',
        advantage:
          'A careful search should preserve direct proof that the Regent ordered an ember extracted from a living dragon.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-has-extraction-order'],
        result:
          'Your people search in pairs and leave every wire untouched. The order names the prize: one living ember, removed even if the dragon does not survive.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-read-frozen-dead',
        label: 'Study where each soldier fell.',
        detail:
          'Spend 1 Resolve facing the last moments of people who wore your colours.',
        advantage:
          'The positions of the dead may show who opened the fire channel and abandoned them.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-knows-commander-sacrifice'],
        result:
          'Boot marks show the truth. The commander opened the channel to test the drill, then crossed the safety line alone. His soldiers died buying his result.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-use-command-seal',
        label: 'Use the commander’s seal to turn the patrol downhill.',
        detail:
          'Issue a false warning about a cold fire breach near the lower stores.',
        advantage:
          'The patrol marches toward a false emergency and cannot follow the next climb.',
        showIfAnyFlags: ['c5-decoded-parting-clue'],
        addFlags: ['c5-diverted-patrol-with-seal'],
        result:
          'You seal a warning that cold fire has reached the lower stores. The patrol reads the correct command mark, gathers suppression cloth, and runs downhill. The lie buys time, but using Hale’s seal creates evidence he may later turn against you.',
        next: 'c5-three-climbs',
      },
      {
        id: 'c5-leave-camp-clean',
        label: 'Leave before the patrol arrives.',
        detail: 'Take no proof and reveal nothing about your route.',
        advantage:
          'The Crown remains uncertain whether you survived the lower valley.',
        addFlags: ['c5-crown-lost-trail'],
        result:
          'You leave the camp exactly as you found it. The returning patrol reaches only cold tents and the silence of its own dead.',
        next: 'c5-three-climbs',
      },
    ],
  },

  'c5-three-climbs': {
    id: 'c5-three-climbs',
    kicker: 'Three ways into the grave',
    title: 'Choose What Hunts You',
    location: 'The Upper Valley Fork',
    objective:
      'Choose a route to Vaor’s grave before the royal commander reaches it.',
    threat: 'Immediate',
    art: 'dragonspine',
    body: (state) => [
      has(state, 'c5-knows-route-purposes')
        ? 'Sorin repeats what each path was made to protect. The stair favours a disciplined defence. The river hides dragon keepers. The ash tunnel once carried wounded people down.'
        : 'Sorin points out three routes. Each reaches the same high chamber, but none offers the same danger.',
      has(state, 'c5-sorin-full-guide')
        ? 'His undamaged map case shows the archers above the stair, a keeper hatch under the river, and the weak beam inside the ash tunnel.'
        : 'Part of Sorin’s map was lost during the rescue. He can name the routes, but the exact dangers remain unmarked.',
      'The glass stair is shortest and exposed to Crown archers. The frozen river runs beneath clear ice while blue fire moves above it. The ash tunnel is dark, narrow, and already shaking from the drill.',
      'An arrow strikes the stair. Ice pops above the river. The drill knocks loose a stone inside the tunnel. Your body prepares for three different deaths. Sorin grips his map. “Which sound do we follow?”',
    ],
    choices: [
      {
        id: 'c5-choose-glass-stair',
        label: 'Take the exposed glass stair.',
        detail: 'Face the royal archers on the fastest route.',
        advantage: 'You reach the grave quickly and can see every enemy ahead.',
        addFlags: [],
        result:
          'You turn onto the clear stair. High above, royal archers lower dark shapes against the snow.',
        next: 'c5-glass-stair',
      },
      {
        id: 'c5-choose-frozen-river',
        label: 'Follow the river beneath the ice.',
        detail: 'Trade enemy sight for thin ice and fire moving overhead.',
        advantage:
          'The Crown cannot target the party unless the river cover breaks.',
        addFlags: [],
        result:
          'Sorin opens a keeper’s hatch. You descend beneath the ice while blue flame follows your warmth across the ceiling.',
        next: 'c5-frozen-river',
      },
      {
        id: 'c5-choose-ash-tunnel',
        label: 'Enter the old ash tunnel.',
        detail:
          'Use the hidden route while the royal drill shakes loose stone above it.',
        advantage:
          'The party can approach the grave unseen and may cut behind the commander.',
        addFlags: [],
        result:
          'You enter single file. Warm ash lies under the snow, proving something deeper in the mountain still burns correctly.',
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
    body: (state) => [
      'The stair climbs through open air. Each step is transparent. Looking down shows the lower valley far beneath your boots.',
      'Six royal archers fire from a stone lip. The arrows are ordinary. The blue fire spreading across the steps behind you is not. Standing still will let it reach the wounded first.',
      lysaraHandCondition(state),
      'Lysara lifts her green thread between two glass posts. The stair repeats its reflection six times. Six empty paths now appear to climb toward the archers, but the living seed darkens wherever an arrow strikes.',
    ],
    choices: [
      {
        id: 'c5-stair-shield-command',
        label: 'Advance the shields on your count.',
        detail:
          'Spend 1 Command crossing between volleys without losing formation.',
        advantage:
          'The timing should bring the full group to the archers with its climbing gear intact.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-stair-formation'],
        result:
          'You count the bowstrings, not the arrows. The line moves during every draw and stops behind glass pillars during every release.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-stair-breakline',
        label: 'Climb the outside rail and hit the archers from below.',
        detail: 'Lose 1 Health taking the exposed route around their aim.',
        advantage:
          'The exposed climb may let you break the archer line before it can warn the commander.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-silenced-archers'],
        result:
          'Glass cuts your palm as you climb beneath the stair. You rise inside the archer line and end the fight before the warning horn is lifted.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-stair-thread-reflections',
        label: 'Send Lysara’s reflected thread paths up first.',
        detail:
          'Risk part of the living seed to make the archers fire at six empty climbs.',
        advantage:
          'The archers waste every ready arrow on six empty reflected paths.',
        addFlags: ['c5-stair-scorched-thread'],
        result:
          'Six green paths race up the glass. The archers empty their ready quivers into reflections while your group climbs the one dark route between them. Three strands of the living seed burn away.',
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
    body: (state) => [
      'The river tunnel is high enough to crouch in and no more. Clear ice forms its roof. Blue fire follows directly above, matching the movement of each warm body below.',
      'A crack opens over Lysara. The fire presses a narrow finger into it. If the roof breaks, the whole river will become a channel for flame.',
      lysaraHandCondition(state),
      'Lysara’s next breath clouds the ice. The crack crawls after it. She clamps a hand over her mouth, but another blue finger is already pressing through.',
    ],
    choices: [
      {
        id: 'c5-river-oath-decoy',
        label: 'Send your Oathfire ahead as a false heartbeat.',
        detail:
          'Spend 1 Oathfire making the blue flame chase your promise through the ice.',
        advantage:
          'The false heartbeat should draw the fire away and may reveal where it travels.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c5-river-oath-path', 'c5-carried-first-grief'],
        result:
          'Gold light races ahead under the roof. The blue flame follows it, tracing a sealed keeper’s door before your promise fades.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-river-hold-panic',
        label: 'Cool the party and lead them through darkness by touch.',
        detail:
          'Spend 1 Resolve wrapping warm skin, slowing every breath, and moving without light.',
        advantage:
          'Cold cloth and controlled breathing should hide body heat from the flame. Darkness hides the party only from royal scouts.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-river-dark-crossing'],
        result:
          'You wrap faces and hands in cloth cooled against the river wall. Each person takes one slow breath, then moves by touch. The flame searches above without finding enough warmth to enter. No royal scout sees your light.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-river-living-thread',
        label: 'Let Lysara’s green thread carry warmth behind you.',
        detail:
          'Risk the living seed by leaving a warm trail for the fire to consume.',
        advantage:
          'The party crosses without spending a stat, but Lysara’s treaty magic is weakened.',
        addFlags: ['c5-seed-scorched-river'],
        result:
          'Green light flows backward along the ice. The cold fire follows and consumes it strand by strand while the last traveller reaches the door.',
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
      'A support beam splits. Sorin strikes four sharp notes against it, the old keeper signal for a collapse, then says the tunnel will hold for perhaps one minute.',
      'Six blows travel through the rock. A pause. Six more. Muffled voices count above you, unaware that every strike drops stone onto the people below. Sorin cups his hands around his mouth. If he gives the keeper warning, the drill crew will know a living guide brought you here.',
    ],
    choices: [
      {
        id: 'c5-tunnel-brace',
        label: 'Hold the broken beam while everyone passes.',
        detail:
          'Lose 1 Health taking the mountain’s weight through your shoulders.',
        advantage:
          'Holding the beam should let every companion and all remaining evidence reach the grave entrance.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-held-ash-beam'],
        result:
          'Stone drives you to one knee. You keep the beam upright until Mara pulls you through behind the final pack.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-tunnel-command-dig',
        label: 'Split the group between bracing and digging.',
        detail:
          'Spend 1 Command keeping both teams in rhythm as the roof falls.',
        advantage:
          'Two coordinated teams may open a second exit and trap the drill above it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-trapped-drill-crew'],
        result:
          'One team holds while the other cuts. The new exit opens, and the collapsing old passage swallows the drill without taking its crew.',
        next: 'c5-grave-mouth',
      },
      {
        id: 'c5-tunnel-keeper-warning',
        label: 'Let Sorin give the keeper’s collapse warning.',
        detail:
          'Stop the drill without spending a stat, but reveal that a mountain keeper still lives.',
        advantage:
          'The crew withdraws the drill before the tunnel falls on your party.',
        addFlags: ['c5-sorin-revealed-to-crown'],
        result:
          'Sorin strikes four notes and calls the warning through the stone. The crew panics and hauls the drill backward. A royal voice above shouts Sorin’s name. The tunnel survives, but Hale now knows who guided you.',
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
      approachPayoff(state),
      'Cold fire pours from all three passages and stretches into long jaws. Sorin flattens himself against the door. “Moving air gives it shape,” he says. “Still fire. Still kills.”',
      has(state, 'c5-fragment-found-grave')
        ? 'The fragment pulls toward a narrow socket in the door. The bright direction it showed below ends here, with the iron straining toward its match.'
        : 'Lysara finds a narrow socket in the door that matches the fragment. Using it may open the grave or wake whatever is inside.',
      'Mara raises her shield. Sorin braces both hands against the damaged ring while Lysara lifts the fragment. “Do we hold the fire back, or open the door now?” Mara asks.',
    ],
    choices: [
      {
        id: 'c5-oath-shelter-grave',
        label: 'Promise the fire will not cross your shield.',
        detail:
          'Spend 2 Oathfire holding the flame back while Sorin repairs the ring.',
        advantage:
          'The shield Oath should let everyone enter together and keep the grave door usable behind you.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-oath-held-grave', 'c5-carried-dragon-grief'],
        result:
          'Gold fire covers your shield. The blue jaws strike it and stop. With every impact, a dragon’s memory of someone he could not save presses through your arms.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-break-frozen-channel',
        label: 'Smash the ice channels feeding the fire.',
        detail: 'Lose 2 Health cutting off the flame at arm’s reach.',
        advantage:
          'Breaking the channels should drain the cold fire before it can follow the party inside.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-broke-fire-channels'],
        result:
          'You break the first channel with your sword and the second with your shoulder. The fire falls into the mountain as Mara drags you through the opening door.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-command-heat-decoys',
        label: 'Divide the lanterns and pull the fire apart.',
        detail:
          'Spend 1 Command sending three teams along prepared retreat lines.',
        advantage:
          'The decoys should divide the flame long enough for Sorin to open the door without damaging it.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-split-coldfire'],
        result:
          'Three warm lanterns run in three directions. The blue jaws divide after them, and Sorin turns the repaired ring.',
        next: 'c5-memory-wall',
      },
      {
        id: 'c5-open-door-with-fragment',
        label: 'Drive the fragment into the door socket.',
        detail:
          'Open the fastest path while announcing the fragment to the active Nail.',
        advantage:
          'The party enters without spending a stat, but the Crown commander can follow the flare.',
        addFlags: ['c5-crown-saw-flare'],
        result:
          'Black iron enters clear glass. The whole mountain flashes blue, the door opens, and a royal horn answers from below.',
        next: 'c5-memory-wall',
      },
    ],
  },

  'c5-memory-wall': {
    id: 'c5-memory-wall',
    kicker: 'A grave made from lived days',
    title: 'The Dragon Beneath the Glass',
    location: 'The Memory Gallery',
    objective:
      'Reach the living dragon without destroying the proof around him.',
    threat: 'Rising',
    art: 'vaor',
    body: (state) => [
      'The gallery walls are built from thousands of clear plates. Inside each one, a small scene moves without sound. You see a young dragon learning to fly, a village sharing its first winter fire, and a woman resting her hand against a bronze scale.',
      'Sorin lays his palm against one moving scene. “Dragons stored important memories in mountain glass so later generations could witness them,” he says.',
      '“Each plate around Vaor holds part of his past. His jailers stacked the plates over his living body and sent cold fire through them. When he struggles, the plates tighten. His own memories have become his cage.”',
      lysaraHandCondition(state),
      has(state, 'c5-oath-held-grave')
        ? 'The door remains whole behind you. Your Oath releases only after the last companion enters, and the closed ring delays the soldiers below.'
        : has(state, 'c5-broke-fire-channels')
          ? 'The channels you smashed stay dark. No cold fire follows you into the gallery.'
          : has(state, 'c5-split-coldfire')
            ? 'Three blue glows still follow the lantern decoys outside. Their movement shows exactly how far the royal pursuit remains behind you.'
            : 'The socket you opened with the fragment is cooling behind you, but the blue flare has already marked this entrance.',
      'A deep voice moves through the floor. “My name is Vaor. If you have come for my ember, captain, at least look at what your Crown buried with me.”',
      'Your hand wants the sword when he says your Crown. Fresh drill scars cross the glass above his eye. The blade stays down.',
    ],
    choices: [
      {
        id: 'c5-touch-memory-plate',
        label: 'Touch the plate nearest Vaor’s voice.',
        detail:
          'Spend 1 Resolve experiencing part of a dragon’s grief without protection.',
        advantage:
          'Enduring the contact may reveal which memory the Crown feared enough to bury deepest.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-found-orivane-memory', 'c5-carried-dragon-grief'],
        result:
          'The glass fills your mind with a red gold dragon standing inside a circle of mortal rulers. Vaor hides the scene behind pain before you can understand it fully.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-ask-memory-permission',
        label: 'Ask Vaor which memory you may approach.',
        detail: 'Give the prisoner control over what you learn first.',
        advantage:
          'Vaor guides you along a safe path and remembers the courtesy.',
        addFlags: ['c5-asked-memory-permission'],
        result:
          'Silence lasts long enough to feel like refusal. Then amber light appears beneath one row of plates, marking a path that does not cross Vaor’s private grief.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-break-memory-slab',
        label: 'Break one binding plate and clear a direct path.',
        detail:
          'Lose 1 Health cutting through glass and destroy one of Vaor’s lived days.',
        advantage:
          'Breaking a direct path should reach the dragon before the Crown enters the gallery.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-broke-memory-slab', 'c5-fast-to-vaor'],
        result:
          'The plate breaks beneath your pommel. A summer day vanishes from the glass, but the direct opening puts one sealed door between your party and Hale’s unfinished drill.',
        next: relationshipInterlude,
      },
      {
        id: 'c5-seed-read-memories',
        label: 'Let Lysara’s living seed find a path between the memories.',
        detail:
          'Risk her treaty magic against the cold bindings. The seed may keep the memories whole but carry fresh damage onward.',
        advantage:
          'The seed separates public history from Vaor’s private memories without breaking either, preserving his trust and the proof.',
        addFlags: ['c5-lysara-sorted-memories', 'c5-seed-strained-memory'],
        result:
          'You support Lysara’s arm while green roots move between the plates. They touch battles and councils, then bend around Vaor’s private days. A hairline crack remains inside the seed.',
        next: relationshipInterlude,
      },
    ],
  },

  'c5-mara-burns': {
    id: 'c5-mara-burns',
    kicker: 'Warm hands in a cold grave',
    title: 'What You Want to Survive For',
    location: 'A Shelter in the Memory Gallery',
    objective: 'Let Mara treat the burn before you face Vaor.',
    threat: 'Uneasy',
    art: 'vaor',
    body: (state) => [
      maraBurnOpening(state),
      relationshipMinute(state),
      'She warms a strip of cloth against her own skin, then winds it around your palm. Her fingers are steady and close. A loose strand of dark hair brushes your wrist when she bends over the bandage. Pain makes every small touch sharper.',
      has(state, 'c4-kissed-mara') &&
      state.relationships.mara.intent !== 'platonic' &&
      state.relationships.mara.intent !== 'ended'
        ? 'Her thumb passes over the place where your pulse beats hardest, and the bridge returns in a flash: her mouth on yours, the road breaking beneath both of you. Desire is no longer the question. What happens after the road is.'
        : 'She tightens the bandage with her teeth, as she did after your first sparring cut behind the old forge. This time she does not release your hand when the knot is finished.',
      has(state, 'c4-oath-honest-with-mara')
        ? 'Gold warmth stirs beneath the promise not to hide behind duty. Mara’s fingers tighten around yours. “Do not give me a captain’s answer,” she says. “Tell me what you want if we leave this mountain.”'
        : 'Mara ties the cloth and keeps hold of your hand. “You keep telling me who must survive,” she says. “Tell me what you want if you are one of them.”',
      'Vaor’s voice waits deeper in the gallery. Mara finishes the knot and leaves your hand free. “We can leave the rest until after the mountain,” she says. “But if you know what you want, I am listening.”',
    ],
    choices: [
      {
        id: 'c5-admit-future-with-mara',
        label: 'Tell Mara you want a life that includes her.',
        detail:
          'Make an honest admission without turning it into another magical duty.',
        advantage:
          'Mara knows your desire is a choice, not a reward you expect for surviving.',
        forbidsRelationshipIntents: {
          mara: ['platonic', 'ended'],
          lysara: ['exploring', 'committed'],
        },
        result:
          'You tell her you want ordinary mornings, arguments that can wait, and roads you choose together. Her smile is small, fierce, and warmer than the cloth.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-kiss-mara-after-truth',
        label:
          'Tell Mara the future you want, then leave the last step to her.',
        detail:
          'Available when shared trust and attraction have become unmistakable.',
        advantage:
          'You and Mara enter the final danger with your relationship openly changed.',
        requiresRelationships: { mara: { trust: 5, attraction: 4 } },
        forbidsRelationshipIntents: {
          mara: ['platonic', 'ended'],
          lysara: ['exploring', 'committed'],
        },
        result:
          'You name the ordinary mornings and chosen roads you want with her. Mara searches your face, then smiles and pulls you close. Her mouth is warm and certain. When she parts from you, her hand remains at the back of your neck. “That was my answer,” she says.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-admit-fear-to-mara',
        label: 'Tell her you are afraid of surviving another failed promise.',
        detail:
          'Show her the fear beneath your command instead of offering romance you cannot yet name.',
        advantage:
          'Mara understands the wound that may control your choice about Vaor.',
        addFlags: ['c5-told-mara-survivor-fear'],
        result:
          'The words leave you colder and lighter. Mara presses your bandaged hand between both of hers. “Then do not make his life into a promise about your guilt,” she says.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-choose-mara-friendship',
        label: 'Tell Mara you love her as family, not as a lover.',
        detail:
          'Choose a lasting friendship without asking her to wait for romance later.',
        advantage: 'Your oldest bond gains a clear and honest shape.',
        forbidsRelationshipIntents: { mara: ['exploring', 'committed'] },
        result:
          'Mara is silent long enough for the mountain to creak around you. Then she bumps her forehead against your shoulder, hard. “Family gets to drag you back from stupid deaths,” she says. “Remember that.” The old ease between you returns without becoming smaller.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-return-to-grave-duty',
        label: 'Thank her and return to the descent.',
        detail:
          'Keep the feeling private until both of you are beyond the grave.',
        advantage:
          'You make no promise under pressure and preserve every resource.',
        result:
          'Mara nods and pulls your glove over the bandage with careful hands. “After the mountain,” she says. It is permission to wait, not a demand for a different answer.',
        next: 'c5-vaor-wakes',
      },
    ],
  },

  'c5-lysara-burns': {
    id: 'c5-lysara-burns',
    kicker: 'Green light in a cold grave',
    title: 'What the Treaty Cannot Ask',
    location: 'A Shelter in the Memory Gallery',
    objective:
      'Decide how much personal trust can survive the political truth ahead.',
    threat: 'Uneasy',
    art: 'vaor',
    body: (state) => [
      relationshipMinute(state),
      'Lysara loops green thread around your burned wrist and keeps walking. Each time the gallery floor shifts, the thread draws you around the dangerous plate before your numb hand can betray you. Care from her looks less like rest and more like refusing to let either of you fall behind.',
      has(state, 'c4-lysara-private-truth')
        ? 'The founder seal she showed you on the bridge returns inside three memories. Her mother’s house helped bury something here. Lysara sees the marks and does not slow down.'
        : 'Three memories carry the seal of Lysara’s mother’s house. Her breath catches once. Then the court mask returns, thin enough that you can see the fear beneath it.',
      state.relationships.lysara.attraction >= 2 &&
      state.relationships.lysara.intent !== 'platonic' &&
      state.relationships.lysara.intent !== 'ended'
        ? '“If this grave condemns my family, I will speak against them,” she says. “If it condemns your Crown, I expect the same from you. Wanting each other is the easy part. I need to know what survives disagreement.”'
        : '“If this grave condemns my family, I will speak against them,” she says. “If it condemns your Crown, I expect the same from you. Trust is easy while our duties agree. I need to know what survives disagreement.”',
      'The thread reaches the next broken span and pulls taut between you. Lysara holds your eyes across it. “So answer me as Caelan. Not as my guard.”',
    ],
    choices: [
      {
        id: 'c5-admit-future-with-lysara',
        label: 'Tell Lysara you want to know her beyond the treaty.',
        detail:
          'Choose a personal future without claiming that she owes you one.',
        advantage:
          'Lysara knows your interest belongs to Caelan, not merely to her diplomatic value.',
        forbidsRelationshipIntents: {
          mara: ['exploring', 'committed'],
          lysara: ['platonic', 'ended'],
        },
        addFlags: ['c5-admitted-future-with-lysara'],
        result:
          'You tell her that the treaty may have placed her on your road, but it did not create what you feel. Her careful expression opens into a smile meant for no court.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-kiss-lysara-after-truth',
        label: 'Tell her the road is not the only future you want.',
        detail:
          'If Lysara wants the same, let her close the distance on her own terms.',
        advantage:
          'You and Lysara enter the grave knowing the desire is shared and freely chosen.',
        requiresRelationships: { lysara: { trust: 4, attraction: 3 } },
        forbidsRelationshipIntents: {
          mara: ['exploring', 'committed'],
          lysara: ['platonic', 'ended'],
        },
        addFlags: ['c5-admitted-future-with-lysara'],
        result:
          '“I want to know the man who exists when nobody is calling him Captain,” Lysara says. The thread around your wrist draws you closer, slowly enough for either of you to stop it. Neither does. Her kiss is soft, deliberate, and entirely her answer.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-protect-lysara-choice',
        label: 'Promise to stand beside her truth even when you disagree.',
        detail:
          'Choose political and personal respect without making a romantic promise.',
        advantage:
          'Lysara may trust that disagreement will not become abandonment.',
        addFlags: ['c5-protected-lysara-choice'],
        result:
          '“Beside me is not the same as beneath my command,” Lysara says. You agree. The tension in the thread eases, and she leads you across without asking you to follow blindly.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-choose-lysara-friendship',
        label: 'Tell Lysara you want her trust and friendship, not romance.',
        detail:
          'Give the bond a complete shape without treating friendship as a consolation.',
        advantage:
          'Lysara gains an ally who has stated his limits as clearly as his loyalty.',
        forbidsRelationshipIntents: { lysara: ['exploring', 'committed'] },
        result:
          'Lysara studies you as if testing for a polite lie. Then she unloops the thread and offers her bare hand. “Friendship between our positions may be the more dangerous choice,” she says. Her smile makes it clear she does not mean the lesser one.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-delay-lysara-answer',
        label: 'Tell her you cannot give an honest answer inside this crisis.',
        detail:
          'Preserve the possibility without using danger to force certainty.',
        advantage:
          'You make no promise under pressure and keep her trust intact.',
        result:
          'Lysara nods once. “An honest delay is still honest.” She keeps the guide thread between you until the broken span is behind both of you.',
        next: 'c5-vaor-wakes',
      },
    ],
  },

  'c5-sorin-care': {
    id: 'c5-sorin-care',
    kicker: 'A wound treated without a promise',
    title: 'The Keeper’s Hands',
    location: 'A Workbench in the Memory Gallery',
    objective: 'Prepare the burn and choose how to use one quiet minute.',
    threat: 'Uneasy',
    art: 'vaor',
    body: (state) => [
      relationshipMinute(state),
      'Sorin sits you at a keeper’s bench and works powdered glass into warm resin. Mara holds the lamp. Lysara steadies the fragment in a loop of green thread. The ordinary work gives all three of you room to breathe.',
      'The resin bites when Sorin presses it over the burn. Your hand begins to feel like your own again. “Pain means the cold has not taken it,” he says. “Useful news. Not pleasant news.”',
      'Sorin lays four matching spoons in a neat row and insists each has a different medical purpose. Mara studies them. “All four are for stirring resin.” Sorin hides the fourth behind his wrist. “That one is for morale.”',
      'For once, the quiet belongs to you. Sorin ties the final knot. “Your minute, captain,” he says. “Use it.”',
    ],
    choices: [
      {
        id: 'c5-choose-both-friendship',
        label: 'Tell Mara and Lysara you value both of them as friends.',
        detail:
          'Choose a full platonic path without leaving either relationship silently pending.',
        advantage:
          'Both women receive an honest place in your life that does not depend on romance.',
        forbidsRelationshipIntents: {
          mara: ['exploring', 'committed'],
          lysara: ['exploring', 'committed'],
        },
        result:
          'You say it plainly. Mara hooks an arm around your shoulders. Lysara leans against the other side with careful dignity. Sorin calls it a stable treatment formation, and all three of you tell him to finish the bandage.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-use-quiet-for-names',
        label: 'Write the names of everyone still depending on you.',
        detail:
          'Use the quiet to remember people without turning them into one burden.',
        advantage:
          'The list may steady Caelan when Vaor tests why he protects the living.',
        addFlags: ['c5-wrote-living-names'],
        result:
          'The names fill half a page. Mara adds one you missed. Lysara corrects the spelling of another. The burden becomes people again.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-ask-sorin-about-vaor',
        label: 'Ask Sorin what Vaor was like before the Crown came.',
        detail:
          'Spend the minute learning about the prisoner as a person rather than a source of power.',
        advantage:
          'Sorin may give you one memory that helps Vaor hear your first words.',
        addFlags: ['c5-knows-vaor-kindness'],
        result:
          'Sorin remembers Vaor warming the nursery glass before winter births. “He knew every child by the sound of their feet,” he says. The dragon ahead becomes harder to reduce to a mission.',
        next: 'c5-vaor-wakes',
      },
      {
        id: 'c5-ask-sorin-about-spoons',
        label: 'Ask Sorin why a keeper needs four matching spoons.',
        detail:
          'Choose ordinary laughter before entering the oldest grief in the mountain.',
        advantage: 'The group may reach Vaor less frightened and more human.',
        addFlags: [],
        result:
          'Sorin gives four incompatible medical answers. By the third, Mara is smiling and Lysara has invented a fifth use with a perfectly straight face. The danger has not changed, but your breathing has.',
        next: 'c5-vaor-wakes',
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
      'Your fragment came from the Nail of Distance. It is not part of the fire Nail, but all nine Nails use the same kind of lock. That is why the fragment fits here.',
      'Removing Vaor’s living ember would warm the valleys for a time. Taking it by force could kill him.',
      vaorLockClue(state),
      'Vaor flexes the claw pinned beneath the nearest plate. A crack runs toward your boot. “Captain,” he says. “Will your first answer be a weapon?”',
    ],
    choices: [
      {
        id: 'c5-lower-weapon-vaor',
        label: 'Lower your weapon and offer to hear the evidence first.',
        detail: 'Treat Vaor as a witness rather than an obstacle.',
        advantage: 'He agrees to show the truth before demanding a decision.',
        addFlags: ['c5-vaor-heard-first'],
        result:
          'You place your sword on the glass. Vaor’s eye narrows, then the nearest memory plate begins to glow.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-guard-fragment-from-vaor',
        label:
          'Keep the fragment raised and demand safe passage for your party.',
        detail:
          'Lead with the lives under your protection before discussing the dragon’s claim.',
        advantage:
          'Vaor opens a warm shelter for your companions before the Crown arrives.',
        addFlags: ['c5-secured-warm-shelter'],
        result:
          'You name every person behind you and what the cold has cost them. Vaor exhales once. Warm amber light opens beneath an unbroken plate.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-test-lock-with-mirror',
        label: 'Test the lock with the thief’s mirrored coin.',
        detail:
          'Consume the parting tool to trigger the mechanism without risking a hand.',
        advantage:
          'The reflection reveals the Crown’s hidden control spike before Hale can use it.',
        showIfAnyFlags: ['c4-rook-arrested', 'c4-rook-bargain'],
        addFlags: ['c5-found-control-spike', 'c5-spent-parting-coin'],
        result:
          'You slide the mirrored coin beneath the teeth. The lock bites its own reflection, snaps the coin in half, and throws a hidden control spike from the floor. Vaor looks at the broken metal. “Your absent thief has irritating instincts,” he says.',
        next: 'c5-vaor-test',
      },
      {
        id: 'c5-free-vaor-claw',
        label: 'Break the plate pinning Vaor’s nearest claw.',
        detail: 'Lose 1 Health proving action before asking for trust.',
        advantage:
          'Freeing the claw may let Vaor defend the chamber when the royal force arrives.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c5-freed-vaor-claw'],
        result:
          'You drive your sword through the cold seam. Glass bursts across your armour, and Vaor slowly lifts one freed claw without striking you.',
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
      has(state, 'c5-wrote-living-names')
        ? 'The list inside your coat presses against your ribs. You do not have to answer for a vague world. You have names.'
        : has(state, 'c5-knows-vaor-kindness')
          ? 'Sorin’s story of Vaor warming the nursery glass keeps the prisoner in front of you from becoming only a dragon or a weapon.'
          : has(state, 'c5-vaor-heard-first')
            ? 'Your sword remains on the glass where you laid it. Vaor keeps one eye on the empty hand you chose to show him.'
            : has(state, 'c5-secured-warm-shelter')
              ? 'Your companions wait inside the warm shelter Vaor opened. He protected them before you answered him, and that act deserves an answer of its own.'
              : has(state, 'c5-found-control-spike')
                ? 'The broken mirrored coin lies beside the control spike it exposed. Vaor watches you study the Crown’s hidden weapon before making another demand of him.'
                : 'Vaor’s freed claw rests against the broken plate. He could have struck when you opened it. He did not.',
      'The memory changes. A century ago, rulers who feared Vaor’s evidence buried him beneath his own memory glass. Two nights ago, Regent Malrec watched through smoked glass while Hale’s survey force woke Vaor and added fresh clamps. Malrec ordered the dragon kept alive until he revealed where the first ember came from.',
      has(state, 'c5-carried-dragon-grief') ||
      has(state, 'c5-carried-first-grief')
        ? 'The pressure that entered through your Oathfire returns behind your eyes. It belongs to Vaor, and it has been pressing against every promise made near the Nail.'
        : 'The cold fire leans toward Vaor’s voice. His grief moves through it, pressing against every promise made near the Nail.',
      'Vaor asks, “Why should I help the people of those who chained me?” A polished answer rises to your tongue. The royal drill trembles through the glass, and you leave it unsaid.',
    ],
    choices: [
      {
        id: 'c5-answer-living-people',
        label:
          'Tell him the living did not choose the crime that built their world.',
        detail:
          'Defend present lives without defending the old rulers who hid the cost.',
        advantage:
          'Vaor challenges the claim now, then judges it against how you protect people during Hale’s attack.',
        addFlags: ['c5-defended-living-world'],
        result:
          'Vaor’s claw scrapes the glass. “My jailers also spoke of innocent people,” he says. “Show me the difference.” He leaves your claim open until Hale’s attack tests it.',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-oath-hear-dragon-grief',
        label: 'Promise to hear his grief without turning away.',
        detail:
          'Lose 1 Resolve accepting Vaor’s pain and gain 2 Oathfire from the binding promise.',
        advantage:
          'The binding promise should return Oathfire and may earn Vaor’s trust with the buried memory.',
        changes: { resolve: -1, oathfire: 2 },
        requires: { resolve: 1 },
        addFlags: ['c5-vaor-trusted-memory'],
        result:
          'The promise opens you. A century of cold, rage, and lonely waking enters your chest. Gold fire rises in answer, but none of the grief becomes smaller.',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-command-shared-witness',
        label: 'Ask every companion to witness the truth with you.',
        detail:
          'Spend 1 Command making the burden public instead of carrying it alone.',
        advantage:
          'Shared witness should leave the Crown unable to silence Vaor’s evidence with one death.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-shared-dragon-witness'],
        result:
          'Mara, Lysara, Sorin, and you each place a hand on the glass. Vaor’s memory enters four different minds and leaves four different voices able to tell it.',
        next: 'c5-crown-assault',
      },
      {
        id: 'c5-refuse-abstract-answer',
        label: 'Tell Vaor you will answer after seeing the hidden memory.',
        detail: 'Refuse to build a promise on evidence still withheld.',
        advantage:
          'You preserve every resource and force the next choice to rest on facts.',
        addFlags: ['c5-demanded-full-truth'],
        result:
          'Vaor’s breath clouds the glass. “Good,” he says. “I am tired of clean answers from armed men. Look first.”',
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
      'Commander Hale enters with royal soldiers and the portable drill. His authority comes from Regent Malrec, not from a new order spoken by the ill Queen. “If the cold fire leaves these mountains, the next winter kills three provinces,” he says. “Vaor’s ember can force the Nail shut before that happens. I know what it costs him. Let the world survive long enough to condemn me.” Then he calls you a traitor and orders the fragment placed in the machine.',
      'Traitor still lands like a blow, even from Hale. Your pulse kicks, then the drill bites deeper and Vaor’s chains jerk tight. Reputation can wait. Stopping the drill comes first.',
      has(state, 'c5-has-extraction-order')
        ? 'You hold up the extraction order bearing his own seal. His soldiers see the line permitting Vaor’s death.'
        : has(state, 'c5-knows-commander-sacrifice')
          ? 'You name the soldiers he abandoned in the lower camp. Two people behind him glance at each other.'
          : 'His people look exhausted and afraid, but their crossbows remain level.',
      haleArrival(state),
      'The drill begins to turn. Vaor’s chains tighten. Hale watches the machine instead of his soldiers, but his eyes keep returning to a narrow seam behind the control platform. Metal screams against the Nail.',
    ],
    choices: [
      {
        id: 'c5-break-royal-drill',
        label: 'Charge through the crossbows and break the drill.',
        detail:
          'Lose 2 Health destroying the only machine that can cut out the ember quickly.',
        advantage:
          'Breaking the drill should stop this extraction and deny the Crown the machine for another attempt.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-destroyed-royal-drill'],
        result:
          'Two bolts strike armour before you reach the frame. Your sword enters the turning gears, and the drill tears itself apart around the blade. Hale retreats behind the control platform as Vaor opens the deepest memory.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-turn-hale-soldiers',
        label: 'Force Hale’s soldiers to face what he ordered.',
        detail:
          'Spend 2 Command using the written order, the abandoned dead, or the killing drill against his authority.',
        advantage:
          'The evidence may turn part of the royal force against Hale and leave witnesses alive.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c5-royal-witnesses-turned'],
        result:
          'You name the dead below, Vaor in his chains, and the choice standing before each soldier. Six crossbows lower. Their owners cover Mara while she cuts the drive belt. The drill stops, and Hale retreats behind the control platform.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-stage-reflected-ember',
        label: 'Turn the broken mirrored coin into a false ember.',
        detail:
          'Spend 1 Resolve trusting Lysara’s light and the grave’s reflections while the real fragment remains in your hand.',
        advantage:
          'The false ember may draw Hale’s strongest soldiers away and leave the drill exposed.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        showIfAnyFlags: ['c5-spent-parting-coin'],
        addFlags: ['c5-staged-reflected-ember'],
        result:
          'Lysara lights the broken mirrored coin and sends its red reflection racing through the glass passages. Hale sends eight soldiers after the moving light. Mara cuts the exposed drive belt while they chase it, stopping the drill and forcing Hale behind the control platform.',
        next: 'c5-heart-memory',
      },
      {
        id: 'c5-free-claw-against-crown',
        label: 'Let Vaor strike through the loosening chains.',
        detail:
          'Spend 2 Oathfire binding the dragon’s strike to the armed attackers only.',
        advantage:
          'The Oath should let Vaor destroy the drill while sparing soldiers who surrender.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        showIfAnyFlags: ['c5-freed-vaor-claw'],
        addFlags: ['c5-vaor-broke-drill'],
        result:
          'Your Oath draws a gold boundary around every lowered weapon. Vaor tears his freed claw through the loosening glass and crushes the drill, stopping a finger’s width from each person who surrenders. Hale throws himself behind the control platform while Vaor opens the deepest memory.',
        next: 'c5-heart-memory',
      },
    ],
  },

  'c5-heart-memory': {
    id: 'c5-heart-memory',
    kicker: 'The sacrifice the Crown buried',
    title: 'Orivane’s Choice',
    location: 'The First Memory',
    objective:
      'Witness what created the Concord and understand its hidden cost.',
    threat: 'Rising',
    art: 'vaor',
    introducesStoryTerms: ['Orivane'],
    body: (state) => [
      'With the drill stopped and Hale forced behind the control platform, Vaor gains one brief opening. He opens the deepest plate, and you stand inside a memory that truly happened. A red gold dragon named Orivane willingly gives her living heart to create the Concord. Her fire separates colliding realms and gives Edrath one stable shape.',
      has(state, 'c5-demanded-full-truth')
        ? '“This is the fact you refused to answer without,” Vaor says. There is no approval in his voice, but there is respect.'
        : has(state, 'c5-shared-dragon-witness')
          ? 'The memory opens around Mara, Lysara, and Sorin as well. Whatever survives this chamber will have four witnesses.'
          : has(state, 'c5-found-orivane-memory')
            ? 'You recognise the red gold dragon from the painful fragment Vaor hid earlier. This time he allows the scene to continue.'
            : 'Vaor lets the memory open without forcing it through your mind. The restraint costs him; one chain cuts deeper as the image clears.',
      'Then the hidden cost becomes painfully simple. The memory shows two living versions of the same village. In both, families are awake and children are eating breakfast. The stable world can keep only one. The other village turns transparent in the middle of breakfast and is cut away while its people still reach for one another.',
      'Your breath catches on the ordinary things that vanish first: a wooden spoon, a half opened door, a child’s hand reaching across a table.',
      'The rulers knew both villages already held living people. They told Orivane only that empty possibilities would be closed. She sees the lost village during her final breath and demands that future generations judge the Concord again. The memory does not show where those people went.',
      'Lysara’s voice shakes beside you. “Her choice was willing. Their silence still stole part of that choice.” Hale remains hidden behind the control platform while the memory holds all of you still.',
      'The rulers seal the evidence inside Vaor’s grave. The final image holds on Orivane’s open eye. Vaor’s voice enters the memory beside you. “What will you remember when the mountain falls?”',
    ],
    choices: [
      {
        id: 'c5-honour-orivane-choice',
        label: 'Stay with Orivane’s choice until the memory ends.',
        detail: 'Spend 1 Resolve witnessing her death without looking away.',
        advantage:
          'Staying to the end may preserve Orivane’s final demand beneath the rulers’ voices.',
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c5-knows-orivane-renewal-wish'],
        result:
          'Orivane’s last words survive beneath the rulers’ voices. She asks the living world to judge her gift again when it has the wisdom to choose freely.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-study-rulers-concealment',
        label: 'Study the rulers who sealed the memory.',
        detail:
          'Spend 1 Command memorising faces, seals, and the order of their decisions.',
        advantage:
          'The seals may become evidence that several governments knowingly hid the Concord’s cost.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c5-memorised-founder-seals'],
        result:
          'You fix each seal in memory. Human, elven, orc, goblin, and other hands all closed the grave. No single people owns the crime or the truth.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-ask-vaor-his-future',
        label: 'Ask Vaor what life he wants now.',
        detail:
          'Bring the choice back to the living prisoner instead of debating only history.',
        advantage:
          'Vaor says plainly what freedom, force, and a pact would mean to him.',
        addFlags: ['c5-vaor-stated-terms'],
        result:
          'Vaor wants the sky, his memories, and the right to speak. He will give an ember freely for release, fight any attempt to take it, or share his voice through a pact that joins your pain to his.',
        next: 'c5-grave-collapse',
      },
      {
        id: 'c5-copy-proof-into-map-wax',
        label: 'Copy the memory into the blank side of the map wax.',
        detail:
          'Turn the thief’s parting clue into portable proof, destroying the hidden route written on its other side.',
        advantage:
          'The truth can survive the collapse even if every glass plate breaks.',
        showIfAnyFlags: ['c4-rook-trusted'],
        addFlags: ['c5-memory-copied-to-map-wax', 'c5-lost-parting-route'],
        result:
          'You press the black wax to the glass. Orivane’s final fire moves inside it when you lift it. The route on the other side is gone, traded for proof that may outlive the mountain.',
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
      has(state, 'c5-found-control-spike')
        ? 'You saw the spike earlier. Sorin has already shown Mara which gallery release can bury its mechanism without touching Vaor.'
        : 'Sorin sees the spike move and points to a red release beside the oldest shelf. Pulling it will drop the damaged gallery around the mechanism, but reaching it means crossing beneath falling glass.',
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
        label:
          'Take the falling shelf before it crushes the person who treated your hand.',
        detail:
          'Lose 2 Health protecting the person whose care you accepted before the descent.',
        advantage:
          'Taking the impact should keep that companion unhurt and the fragment or evidence secure.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c5-saved-chosen-companion'],
        result:
          'You reach the trapped figure before the shelf does. Glass breaks across your back. The other two pull both of you clear. The fragment and Sorin’s oldest memory plate remain secure with them.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-command-gallery-evacuation',
        label: 'Call a moving shelter through the falling gallery.',
        detail:
          'Spend 2 Command placing every person where one shield can protect the next.',
        advantage:
          'A moving shelter should bring the whole group out with several memory plates intact.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c5-saved-memory-witnesses'],
        result:
          'Each person protects the back ahead. The line moves as one body, carrying witnesses and three unbroken memories into Vaor’s shelter.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-oath-hold-memories',
        label: 'Promise the grave will remember until everyone is clear.',
        detail:
          'Spend 2 Oathfire holding the memory plates in place through Vaor’s grief.',
        advantage:
          'The Oath may hold every person and surviving record long enough to escape.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c5-oath-held-memory-grave', 'c5-carried-dragon-grief'],
        result:
          'Gold lines join the falling plates. They hang while every person escapes and Sorin selects six plates that the group can carry. Vaor’s grief enters the Oath, and your knees nearly fail under its age.',
        next: 'c5-ember-choice',
      },
      {
        id: 'c5-drop-damaged-gallery',
        label: 'Drop the damaged gallery around Hale.',
        detail:
          'Use Sorin’s emergency release and sacrifice Hale’s loose drill logs and copied camp records to stop the control spike.',
        advantage:
          'Everyone reaches Vaor, and Hale is trapped away from the Nail without spending a stat.',
        addFlags: ['c5-trapped-hale-with-gallery', 'c5-lost-royal-camp-proof'],
        result:
          'You strike the emergency release Sorin showed you. Glass falls around Hale and drives him away from the spike. Everyone reaches Vaor. Proof already inside a coat or pack survives, but loose drill logs and copied camp records shatter.',
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
      'The fire Nail splits around Vaor’s chest. Cold chains close around the warm red gold ember and drain it into the valleys. If the ember stays, the damaged Nail will consume it and spread cold fire beyond Dragonspine. Vaor cannot carry his own ember through the lock while any chain remains attached to him. Someone else must bear it out now.',
      collapseInventory(state),
      evidenceLeavingDragonspine(state),
      has(state, 'c5-vaor-stated-terms')
        ? 'Vaor has already named what each path costs him. He waits for you to prove that listening changed more than your words.'
        : 'Vaor explains the three paths plainly. Release brings his willing gift. Force takes the ember and leaves him alive but wounded. A pact lets the ember travel inside you with his voice.',
      vaorHistoryJudgment(state),
      has(state, 'c5-told-mara-survivor-fear')
        ? 'Mara’s warning stays with you. This cannot be a promise made only to punish yourself for older failures.'
        : has(state, 'c5-admitted-future-with-lysara') ||
            has(state, 'c5-kissed-lysara') ||
            has(state, 'c5-protected-lysara-choice')
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
        detail:
          'Release an ancient dragon whose choices will no longer belong to you or the Crown, and whom kingdoms may treat as an invading power.',
        advantage:
          'The ember enters without violence, but Vaor controls when it answers and frightened kingdoms will know you released him.',
        changes: { wayfire: 2 },
        hideIfAnyFlags: ['c5-broke-memory-slab'],
        addFlags: ['c5-freed-vaor'],
        result:
          'You set the fragment into the outer ring and turn it away from Vaor. The chains open. He touches one claw to your chest and gives a small living flame by choice. His first wingbeat shatters the royal signal tower, and warning horns carry the news down both sides of the mountain.',
        next: 'c5-ending-free',
      },
      {
        id: 'c5-free-vaor-after-repair',
        label:
          'Acknowledge the memory you destroyed, then ask Vaor to choose freedom.',
        detail:
          'Spend 1 Resolve accepting a duty to preserve his surviving memories without claiming that apology erases the harm.',
        advantage:
          'Vaor may still give the ember willingly, but he makes your repair duty part of the gift and keeps full control of his aid.',
        changes: { resolve: -1, wayfire: 2 },
        requires: { resolve: 1 },
        showIfAllFlags: ['c5-broke-memory-slab'],
        addFlags: ['c5-freed-vaor', 'c5-repair-vaor-memory-duty'],
        result:
          'You name the summer day you destroyed and promise to carry the surviving memories into living witness. Vaor does not forgive you. He accepts the repair duty, breaks his chains, and gives one ember by choice while keeping command of his own fire.',
        next: 'c5-ending-free',
      },
      {
        id: 'c5-take-ember-by-force',
        label: 'Cut the ember free and keep it under your command.',
        detail:
          'Lose 2 Health taking the fastest power while Vaor resists you.',
        advantage:
          'The fastest extraction should give you controlled fire immediately and cut an escape through the closing grave.',
        changes: { health: -2, wayfire: 2 },
        requires: { health: 1 },
        addFlags: ['c5-took-ember-by-force'],
        result:
          'You drive the fragment through the cold chain and tear the ember free. Fire enters your wounds and burns an escape through the closing grave. Vaor lives, but the sound he makes follows you out.',
        next: 'c5-ending-force',
      },
      {
        id: 'c5-pact-with-vaor',
        label: 'Make a pact and carry Vaor’s voice with the ember.',
        detail:
          'Spend 2 Resolve sharing thought, grief, and power until the duty is complete.',
        advantage:
          'The pact should protect Vaor while carrying his knowledge and living fire inside you.',
        changes: { resolve: -2, wayfire: 2 },
        requires: { resolve: 2 },
        hideIfAnyFlags: ['c5-broke-memory-slab'],
        addFlags: ['c5-vaor-pact'],
        result: `${pactTerms} The cold chains release Vaor’s wounds and settle around him as a protective glass shell he can break when he chooses. His ember crosses into your chest with a second heartbeat.`,
        next: 'c5-ending-pact',
      },
      {
        id: 'c5-pact-with-vaor-after-repair',
        label:
          'Bind a stricter pact that includes repair for the memory you destroyed.',
        detail:
          'Spend 3 Resolve sharing the ember, Vaor’s grief, and a duty to preserve his surviving memories.',
        advantage:
          'Vaor may accept shared power after the violation, but he gains the right to refuse its use and hold you to the repair duty.',
        changes: { resolve: -3, wayfire: 2 },
        requires: { resolve: 3 },
        showIfAllFlags: ['c5-broke-memory-slab'],
        addFlags: ['c5-vaor-pact', 'c5-repair-vaor-memory-duty'],
        result: `${pactTerms} You add a duty to preserve Vaor’s surviving memories and tell the truth about the day you destroyed. He accepts without forgiving the loss. The chains become a shell he can break, and his ember enters with a second heartbeat.`,
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
    nextChapter: 'c6-steppe-road',
    introducesStoryTerms: ['Kharad Vey'],
    body: (state) => [
      'Vaor breaks through the mountain roof. Cold blue fire reaches for him and recoils from the warm ember now burning inside your chest.',
      'You are an ember bearer now. Vaor’s living fire warms your blood, separate from the damaged Nail left in the mountain. The ember answers by choice, not command.',
      has(state, 'c5-repair-vaor-memory-duty')
        ? 'Vaor has not forgiven the day you broke. He gives the ember because you accepted a duty to preserve what remains, and he warns that the gift ends if you treat his memories as tools again.'
        : 'The choices you made inside the grave allowed the gift to remain willing. Vaor keeps his memories, his body, and the right to refuse you.',
      collapseInventory(state),
      evidenceLeavingDragonspine(state),
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
    objective:
      'Reach the moving orc town of Kharad Vey before Vaor or the Crown takes back the ember.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    nextChapter: 'c6-steppe-road',
    introducesStoryTerms: ['Kharad Vey'],
    body: (state) => [
      'Warm fire seals the worst of the grave behind you, but it cannot restore the Health the cold flame took. Every wound reminds you how the ember entered your body.',
      'You are an ember bearer now. The living fire torn from Vaor moves the instant you command it, separate from the damaged Nail left in the mountain. Vaor’s answering roar follows from inside the mountain.',
      has(state, 'c5-asked-memory-permission') ||
      has(state, 'c5-vaor-heard-first') ||
      has(state, 'c5-vaor-trusted-memory')
        ? 'Vaor had begun to answer your restraint. Taking the ember after that trust makes his pursuit personal, not merely defensive.'
        : 'Nothing in the grave made this a gift. Vaor names the taking as theft before the mountain closes between you.',
      collapseInventory(state),
      evidenceLeavingDragonspine(state),
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
    objective:
      'Carry Vaor’s voice and ember to the moving orc town of Kharad Vey.',
    threat: 'Rising',
    art: 'ember',
    final: true,
    nextChapter: 'c6-steppe-road',
    introducesStoryTerms: ['Kharad Vey'],
    body: (state) => [
      'You leave the grave with a second heartbeat beneath your armour. Vaor’s body rests by choice inside the protective glass shell. He is no longer chained, and he can break free when he is ready to face the sky.',
      'You are an ember bearer now. Vaor’s living fire travels inside you, separate from the damaged Nail left in the mountain. Warm flame answers your breath. So does his grief, vast enough to make the eastern sky look painfully small.',
      'Your shared duty is to carry the ember to the black stone gate, protect living people, and expose what the Concord erased. Either bearer may refuse a use of the ember. The pact ends only when the gate is safe and both of you say the duty is complete. Vaor can then withdraw his voice and ember at his word.',
      has(state, 'c5-repair-vaor-memory-duty')
        ? 'The pact also binds you to preserve Vaor’s surviving memories and admit the day you destroyed. Shared power has not erased the wound between you.'
        : 'Vaor agreed aloud that neither bearer commands the other. His body and memories remain his own.',
      collapseInventory(state),
      evidenceLeavingDragonspine(state),
      has(state, 'c5-admitted-future-with-lysara') ||
      has(state, 'c5-kissed-lysara')
        ? 'Lysara asks you to repeat the last promise you made before the pact. You answer in your own voice. Vaor adds, inside your thoughts, that she is testing which memories remain yours. “Correct,” Lysara says aloud.'
        : has(state, 'c5-chose-sorin-care')
          ? 'Sorin asks whether your name still sounds like your own. You answer in your own voice. Vaor adds, inside your thoughts, that this keeper asks unusually sensible questions.'
          : 'Mara asks whether you can still hear her. You answer in your own voice. Vaor adds, inside your thoughts, that this is an excellent question to keep asking.',
      'The ember shows both of you a black stone gate opening by the width of a hand. Beyond Dragonspine, Kharad Vey moves across the red steppe. The travelling orc town is the nearest place strong enough to help you face what is coming through.',
    ],
    choices: [],
  },
};
