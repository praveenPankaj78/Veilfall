import type { GameState, StoryNode } from './game-data';

function has(state: GameState, flag: string) {
  return state.flags.includes(flag);
}

function hasAny(state: GameState, flags: string[]) {
  return flags.some((flag) => has(state, flag));
}

const chapterSevenPublicProofFlags = [
  'c7-proof-rider-relay',
  'c7-oath-orders-reach-army',
  'c7-signal-tube-paper-rain',
  'c7-orders-on-banners',
  'c7-orders-reached-every-rank',
  'c7-seals-proved-sequence',
  'c7-lio-carried-orders',
  'c7-lio-delivered-orders',
  'c7-lio-exposed-orders-inside-army',
  'c7-lio-testimony-reached-ranks',
];

const chapterSevenDefenceLossFlags = [
  'c7-ally-lasting-injury',
  'c7-company-storm-losses',
  'c7-alliance-shields-protected-wounded',
  'c7-neutral-wounded-in-ridge',
  'c7-lost-gate-supplies',
  'c7-spent-supplies-on-decoys',
  'c7-lost-fast-horses',
  'c7-korran-spent-signal-trust',
  'c7-wagon-survivors-injured',
  'c7-wagon-messenger-injured',
];

const chapterSevenApprovedVaorUseFlags = [
  'c7-vaor-approved-pursuit-use',
  'c7-vaor-approved-cavalry-use',
  'c7-vaor-approved-battle-use',
];

const chapterSevenForcedVaorUseFlags = [
  'c7-forced-vaor-pursuit-use',
  'c7-forced-vaor-cavalry-use',
  'c7-forced-vaor-battle-use',
];

function chapterSevenInjuredAlly(state: GameState) {
  if (!has(state, 'c7-ally-lasting-injury')) return null;
  if (
    (state.relationships.mara.intent === 'committed' ||
      state.relationships.mara.intent === 'exploring') &&
    !has(state, 'c7-wounded-on-ridge')
  )
    return 'Mara';
  if (
    state.relationships.lysara.intent === 'committed' ||
    state.relationships.lysara.intent === 'exploring'
  )
    return 'Lysara';
  return 'Sorin';
}

function chapterSevenEnemyKnowledge(state: GameState) {
  if (has(state, 'c7-shared-obedience-memory')) {
    return 'The hidden sender stole the memory of one order you obeyed against your judgment. The Gate now repeats the voice from that failure whenever you reach for command.';
  }
  if (
    hasAny(state, ['c7-forced-vaor-battle-use', 'c7-vaor-approved-battle-use'])
  ) {
    return 'The hidden sender learned that Vaor is bound to the ember you carry. Red cracks bend toward your chest whenever the dragon speaks.';
  }
  if (
    hasAny(state, ['c7-lio-refused-dead-command', 'c7-lio-refused-inside-army'])
  ) {
    return 'Lio exposed the eastern thread without giving it a magical weapon. The sender learned his refusal and now copies his voice near Crown sentries.';
  }
  if (has(state, 'c7-command-demanded-proof')) {
    return 'Ilyra traced only the edge of the hidden command and kept your private memories out of its reach. Her last countermark points to the safest western approach.';
  }
  return 'The hidden sender lost its red storm, but you do not know what it learned before the thread broke.';
}

function hiddenSenderCounterAtFourthFort(state: GameState) {
  if (has(state, 'c8-used-paired-living-check'))
    return 'The false warning dies at each paired post, but face-to-face confirmation slows the western line. Fourth Fort’s outer hinge is unguarded when you arrive.';
  if (has(state, 'c8-refused-private-command-bait'))
    return 'The Gate repeats the voice from your private failure. Your prepared officers ignore it and wait for the fresh call and answer. The copied order dies without moving a lock.';
  if (has(state, 'c8-shielded-ember-bearer'))
    return 'A red fault turns toward the ember, but the marked shield line carries the heat into empty snow before it reaches your chest.';
  if (has(state, 'c8-lio-countered-copied-voice'))
    return 'Lio’s copied voice orders the western post open. Two living officers demand a fresh call and answer. The false Lio cannot create the reply in time.';
  if (has(state, 'c8-used-ilyra-countermark'))
    return 'Ilyra’s countermark darkens beside a buried red fault. Korran moves the column before the ground opens beneath it.';
  if (has(state, 'c8-mara-held-command-veto'))
    return 'The Gate copies your voice and orders the outer hinge opened. Mara uses the veto you gave her. The hinge stays shut until you answer in person.';
  if (has(state, 'c8-three-fact-warning-worked'))
    return 'A false officer gives the wrong fort, messenger, and written order. Lysara’s three checks expose him before anyone touches the hinge.';
  if (has(state, 'c8-private-command-test-worked'))
    return 'The western post demands the private command test. The copied officer answers an older reply, and the defenders close the road around him.';
  if (has(state, 'c8-preserved-signal-post-spent'))
    return 'The preserved living signal post gives one fresh call and answer across the ring. Every keeper ignores the copied reply that follows.';
  return 'No counterorder was recorded. The hidden sender reaches Fourth Fort’s outer hinge before the western line can answer.';
}

function chapterSevenArrivalCosts(state: GameState) {
  const costs: string[] = [];
  const injured = chapterSevenInjuredAlly(state);
  if (injured)
    costs.push(
      `${injured} reaches the ring with a lasting bone injury and cannot take the same physical risks as before.`,
    );
  if (has(state, 'c7-company-storm-losses'))
    costs.push(
      'The broken company arrives with empty saddles after the last red wall. Fewer soldiers are fit to hold isolated forts.',
    );
  if (has(state, 'c7-families-inside-wheels'))
    costs.push(
      'Kharad Vey carries its families east inside the wheel decks. The town must keep moving while its fighters guard the fort road.',
    );
  if (has(state, 'c7-alliance-shields-protected-wounded'))
    costs.push(
      'The two steppe shield engines were damaged protecting the wounded. They cannot cover the first Gate deployment.',
    );
  if (has(state, 'c7-neutral-wounded-in-ridge'))
    costs.push(
      'The wounded remain at Black Ridge with two guides. They are safe, but those guides and medicines did not reach the Gate.',
    );
  if (has(state, 'c7-lost-gate-supplies'))
    costs.push(
      'The supply wagon sank in the salt basin. The force has less food and fewer arrows for the fort ring.',
    );
  if (has(state, 'c7-spent-supplies-on-decoys'))
    costs.push(
      'The cavalry decoys cost spare shields and blankets. Any isolated post will face the cold with less protection.',
    );
  if (has(state, 'c7-lost-fast-horses'))
    costs.push(
      'The southern rescue spent the fastest horses. Messages between distant forts will travel more slowly.',
    );
  if (has(state, 'c7-korran-spent-signal-trust'))
    costs.push(
      'Korran’s false axle warning saved lives, but other steppe riders now wait for a second sign before trusting his red signal.',
    );
  if (has(state, 'c7-wagon-survivors-injured'))
    costs.push(
      'The proof wagon survivors reach the aid line with cuts and broken gear from the overturned wagon.',
    );
  if (has(state, 'c7-wagon-messenger-injured'))
    costs.push(
      'One proof messenger reaches the ring with a broken arm and cannot carry another signal tube.',
    );
  if (has(state, 'c7-proof-public-early'))
    costs.push(
      'Because the copies appeared early, Malrec’s loyalists had time to prepare a forgery claim before reaching the forts.',
    );
  if (has(state, 'c7-living-signal-spent'))
    costs.push(
      'The prepared living signal post was lost in the salt basin after its one decisive order.',
    );
  return costs;
}

function chapterSevenLioDeployment(state: GameState) {
  if (has(state, 'c7-lio-stranded-after-rescue'))
    return 'Lio reaches the deployment under Teren’s guard with no badge. He can identify a copied call, but Malrec can still arrest him as a deserter.';
  if (has(state, 'c7-lio-named-deserter'))
    return 'Lio rides under his own name after refusing Evren. He can teach the living reply, but cannot command a Crown post.';
  if (has(state, 'c7-lio-joined'))
    return 'Lio rides with your line and can create a living reply at the western posts.';
  if (has(state, 'c7-lio-verified-command-without-copies'))
    return 'Lio remains inside Teren’s army. He proved the living challenge but has no copy of Malrec’s order and cannot help your western posts.';
  if (has(state, 'c7-lio-returned'))
    return 'Lio remains inside Teren’s Crown March. Any countercall using him must travel through its officers.';
  if (has(state, 'c7-lio-prisoner'))
    return 'Lio reaches the ring as a prisoner and witness, not a volunteer who can be assigned a post.';
  if (has(state, 'c7-lio-under-guard'))
    return 'Lio reaches the ring under a white guard cord as a neutral witness to the copied command.';
  return 'Lio’s Chapter Seven location is not recorded.';
}

function arrivingForce(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'The Crown March fills the eastern road behind you. Thousands answered your last order, but many still wear Regent Malrec’s badge beneath their cloaks. You have enough soldiers to fill every fort. You do not yet know whether you have enough trust.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your chosen company reaches the ridge in a narrow column. Every soldier volunteered, which gives you trust but not numbers. Teren’s remaining army follows on a separate road and will not arrive before the next knock. Eight forts wait below, and your company could barely fill two.';
  }
  if (has(state, 'c7-gained-dangerous-reputation')) {
    return 'Only your old companions, the steppe guides, and a few stubborn survivors reach the ridge with you. Teren’s army is still a day behind on its own road. No banner follows your line, and a reputation cannot man eight walls.';
  }
  return 'No Chapter Seven force order reached the fort ring.';
}

function terenCondition(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'Teren rides in the leading rank with his injured shoulder bound against his chest. Three officers now share his signals, so pain cannot silence the whole army. The arrangement is slower, but harder for one false voice to seize.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Teren’s injured shoulder has slowed the separate army behind you. Three officers share his signals now, so the Crown March can keep moving even when pain steals his voice.';
  }
  if (has(state, 'c7-gained-dangerous-reputation')) {
    return 'Teren’s injured shoulder is one reason his army remains a day behind. He divided its signals among three officers before you rode ahead, making the march slower and harder for one false voice to control.';
  }
  return 'Teren’s position cannot be established without a Chapter Seven force state.';
}

function emberState(state: GameState) {
  if (has(state, 'c5-freed-vaor')) {
    return 'Vaor circles high above the cloud. The ember he gave you warms when the Gate knocks, and the dragon refuses to come lower. “Something below knows the taste of my fire,” he warns.';
  }
  if (has(state, 'c5-took-ember-by-force')) {
    return 'The stolen ember pulls against your ribs. Vaor is somewhere behind the storm, angry enough to answer if you use it and proud enough to make you regret the call.';
  }
  return 'Vaor’s pact ember beats once beneath your breastbone. Through it, the dragon whispers, “That door is listening to every promise you carry.”';
}

const inheritedSeedDamageFlags = [
  'c5-stair-scorched-thread',
  'c5-seed-scorched-river',
  'c5-seed-strained-memory',
  'c5-lysara-reading-strain',
  'c6-seed-scorched-by-horn',
  'c6-seed-critically-weakened',
  'c6-lysara-hand-strained-by-horn',
];

function seedWasDamaged(state: GameState) {
  return inheritedSeedDamageFlags.some((flag) => has(state, flag));
}

function steppeOathLedger(state: GameState) {
  const terms: string[] = [];
  if (has(state, 'c6-oath-recognised-red-moot'))
    terms.push('Kharad fighters answer commanders chosen by the Red Moot');
  if (has(state, 'c6-oath-crown-restitution'))
    terms.push('Malrec’s hidden crime must face public judgment');
  if (has(state, 'c6-oath-defends-refusal'))
    terms.push('the clans may leave after the Gate is safe');
  if (has(state, 'c6-oath-honest-limit'))
    terms.push('you may claim only the command the Moot granted');
  if (has(state, 'c6-oath-investigate-unsea'))
    terms.push(
      'you must investigate the ancestor voices without calling uncertain copies real people',
    );
  if (!terms.length)
    return 'The Red Moot gave support without placing a magical steppe promise on you.';
  return `The steppe Oaths remain exact: ${terms.join('; ')}.`;
}

function vaorGateUse(state: GameState) {
  if (has(state, 'c5-freed-vaor'))
    return 'Vaor gave the ember freely. You must ask before using his fire, and he may refuse.';
  if (has(state, 'c5-took-ember-by-force'))
    return 'The stolen ember will obey, but Vaor resists every use and remembers who forced it.';
  return 'The pact gives both bearers the right to refuse. You must name the purpose before Vaor can agree.';
}

function deploymentResult(state: GameState) {
  const fullArmy = has(state, 'c7-gained-full-army');
  const volunteers = has(state, 'c7-gained-chosen-company');

  if (has(state, 'c8-deployed-all-forts')) {
    if (fullArmy) {
      return 'The Crown March occupies all eight outer yards under paired officers. Every fort has defenders, but divided loyalties now stand close to every lock.';
    }
    if (volunteers) {
      return 'Your volunteers hold all eight outer yards in thin groups. Every fort has eyes on it, but none can survive a long attack alone.';
    }
    return 'Your small force watches all eight forts in pairs. The entire ring is visible, but a serious attack at any wall could overwhelm its two defenders.';
  }
  if (has(state, 'c8-deployed-strongpoints')) {
    if (fullArmy) {
      return 'Most of the Crown March holds three strong forts while mounted reserves wait between them. Five forts remain lightly guarded, but every threatened wall can receive help.';
    }
    if (volunteers) {
      return 'Volunteers hold the three strongest approaches while empty towers remain between them. Every defender chose a post, and every gap is visible.';
    }
    return 'Your small force holds two strong forts and Fourth Fort’s road. Five walls remain empty, but the defenders can reach one another before a second horn.';
  }
  if (has(state, 'c8-deployed-mobile-force')) {
    if (fullArmy) {
      return 'The Crown March waits in four mobile columns between the forts. Most walls begin empty, but thousands can answer whichever alarm sounds first.';
    }
    if (volunteers) {
      return 'Your chosen company stays together beneath the western wall. Lamps and warning cords cover the empty forts, and every fighter can answer the first alarm.';
    }
    if (has(state, 'c7-gained-dangerous-reputation')) {
      return 'Small teams place lamps and warning cords instead of pretending they can hold every wall. You will hear an attack early, but stopping it will depend on speed.';
    }
  }
  return 'No deployment order has been recorded for the fortress ring.';
}

function inheritedForcePressure(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'The numbers solve one problem and create another. Teren catches two soldiers carrying Malrec’s private orders toward separate lock rooms. He arrests them, then warns that another loyalist may still be inside the ring. Every fort can be manned, but every keeper must be watched.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your volunteers can safely hold three fires. A mortal defence of all eight would require Ansel to split the Futureless across the remaining posts, leaving Fourth Fort with almost no reserve.';
  }
  return 'Your small force can safely hold two fires. A mortal defence of all eight would put wounded wardens, furnace workers, and riders on the other six. They may choose the risk, but some will be burned.';
}

function deploymentPressure(state: GameState) {
  if (has(state, 'c8-deployed-all-forts')) {
    return 'The early breath traps the pair at Second Fort behind a red fault. Their warning reaches you, but no reserve can cross to them until the ground cools.';
  }
  if (has(state, 'c8-deployed-strongpoints')) {
    if (has(state, 'c7-lost-fast-horses')) {
      return 'The red fault cuts the foot relay to Fifth Fort. Without the fast horses lost in the southern rescue, its warning arrives only when the western basket starts to smoke.';
    }
    return 'The red fault cuts the warning line to Fifth Fort. A mounted reserve carries the alarm, but Fourth Fort loses that rider for the first defence.';
  }
  if (has(state, 'c8-deployed-mobile-force')) {
    return 'The mobile force reaches Fourth Fort together, but seven signal baskets remain without keepers. Any mortal defence must place them after the opening begins.';
  }
  return 'The Gate finds a ring with no recorded deployment order.';
}

function forceChoiceAtOpening(state: GameState) {
  if (has(state, 'c7-gained-full-army')) {
    return 'Teren can place soldiers at every fire, but his lock teams must watch for Malrec’s remaining loyalist while they face the Gate.';
  }
  if (has(state, 'c7-gained-chosen-company')) {
    return 'Your volunteers can hold three fires. A fully mortal ring means sending the Futureless from Fourth Fort to hold the other five without reserves.';
  }
  if (has(state, 'c7-gained-dangerous-reputation')) {
    return 'Your small force can hold two fires. A fully mortal ring means asking wounded wardens, furnace workers, and riders to face the opening heat at the other six.';
  }
  return 'No Chapter Seven force state defines who can hold the fires.';
}

function pellOathOutcome(state: GameState) {
  if (!has(state, 'c8-oath-pell-sees-opening-contained')) return [];
  return [
    'Pell watches the hostile hand withdraw and the opening shrink beyond an army’s width. The fulfilled Oath returns its fire to you.',
  ];
}

function personalWatch(state: GameState) {
  if (
    state.relationships.mara.intent === 'committed' ||
    state.relationships.mara.intent === 'exploring'
  )
    return 'c8-mara-watch';
  if (
    state.relationships.lysara.intent === 'committed' ||
    state.relationships.lysara.intent === 'exploring'
  )
    return 'c8-lysara-watch';
  return 'c8-quiet-watch';
}

function endangeredCompanion(state: GameState) {
  if (
    state.relationships.mara.intent === 'committed' ||
    state.relationships.mara.intent === 'exploring'
  )
    return 'Mara';
  if (
    state.relationships.lysara.intent === 'committed' ||
    state.relationships.lysara.intent === 'exploring'
  )
    return 'Lysara';
  return 'Korran';
}

function routeOutcome(state: GameState) {
  if (has(state, 'c8-united-wardens')) {
    if (has(state, 'c8-depleted-mortal-defense')) {
      return 'Eight mortal fires hold with no reserve behind them. The last blankets wrap burned keepers instead of sleeping soldiers, and the infirmary fills before the hour ends.';
    }
    if (has(state, 'c7-gained-full-army')) {
      return 'Eight mortal fires hold. Teren spends the hour moving between them, exposing the last saboteur before a lock can be reversed. Your army supplied enough hands, and its divided loyalty nearly supplied the enemy with one.';
    }
    if (has(state, 'c7-gained-chosen-company')) {
      return 'Volunteers hold three fires while the Futureless divide across the other five. The ring remains mortal, but Fourth Fort has no reserve and six wardens leave the locks with burned hands.';
    }
    return 'Your companions hold two fires. Wounded wardens, furnace workers, and steppe riders choose the other six. The ring remains mortal, but the infirmary fills with burns before the hour ends.';
  }
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'White fire joins the forts in a clean circle. It holds because you granted one peaceful embassy permission to enter and leave under public rules.';
  }
  if (has(state, 'c8-sacrificed-first-fort')) {
    return 'First Fort falls inward exactly as planned. Its stone and stored fire run through buried channels into the other seven. The ring survives with a permanent gap.';
  }
  return 'No final Gate defence has been recorded.';
}

function collectorBarrier(state: GameState) {
  if (has(state, 'c8-eight-local-captains'))
    return 'Eight local captains stagger their fires, so the collector cannot copy one signal to open the ring. The keepers must stay at their posts, leaving the reaching arm to you.';
  if (has(state, 'c8-ansel-borrowed-oathfire'))
    return 'Borrowed gold fire keeps Fourth Fort from answering the collector’s owned promises. Ansel cannot leave that flame before dawn, so the reaching arm is yours to stop.';
  if (has(state, 'c8-carried-final-signal'))
    return 'The wordless lamp signal keeps the collector from stealing a command, but the crossing burned your hands. Every keeper remains at a separate fire while you face the arm.';
  if (
    hasAny(state, [
      'c8-ansel-named-keepers',
      'c8-free-zone-coordinated-captains',
    ])
  )
    return 'Keepers chosen under local authority ignore the names on the glove. Their fires narrow the gap, but their posts leave the reaching arm to you.';
  if (has(state, 'c8-united-wardens')) {
    return 'Heat from eight mortal signal fires narrows the gap. Every keeper must remain at a separate post, so none can leave the chain to strike the reaching arm. This part is yours to finish.';
  }
  if (has(state, 'c8-compact-public-only'))
    return 'Public witnesses force the white fire to hold its spoken limit when the rival collector reaches through. The Compact can support the locks, not attack the arm.';
  if (has(state, 'c8-compact-binds-actions'))
    return 'The rewritten agreement punishes the collector’s attempt to seize a person, narrowing the gap. It still grants the Compact no right to attack a rival house.';
  if (has(state, 'c8-ember-held-as-collateral'))
    return 'Vaor’s outer flame anchors the white ring while the collector pulls against it. The Compact holds the lock, but its agreement grants no right to strike the rival arm.';
  if (has(state, 'c8-accepted-ash-compact')) {
    return 'The Ash Compact’s white fire holds the gap. Its public agreement allows it to support the locks, not attack a rival house. This part is yours to finish.';
  }
  if (has(state, 'c8-sacrificed-first-fort')) {
    return 'Heat stored beneath the fallen First Fort holds the gap. The broken stone can feed the chain, but it cannot stop a hand already through. This part is yours to finish.';
  }
  return 'No chosen defence holds the gap against the collector.';
}

function chainMethodPressure(state: GameState) {
  if (
    has(state, 'c8-pell-map-restored-chain') &&
    has(state, 'c8-lost-furnace-bypass')
  )
    return 'Pell’s furnace bypass carries the first surge, then cracks. The chain will hold tonight, but that route cannot answer another opening.';
  if (has(state, 'c8-chain-lifted-by-seed'))
    return 'Living roots keep the repaired link above the flood. The chain is steady, but Lysara’s seed has less strength for any treaty made tonight.';
  if (has(state, 'c8-chain-repaired-by-hand'))
    return 'The exposed joining pin holds. Heat from it has worsened your wounds, but no fuel or magic owns the repair.';
  if (has(state, 'c8-forced-vaor-gate-use'))
    return has(state, 'c8-vaor-resisting-at-gate')
      ? 'Stolen dragonfire lights the chain, but Vaor tears against every basket. The surges may burn a mortal keeper when his resistance peaks.'
      : 'Stolen dragonfire lights the chain. Vaor’s refusal makes each basket flare out of time, forcing the keepers to absorb the surges.';
  if (has(state, 'c8-vaor-approved-gate-use'))
    return 'Vaor’s agreed fire stays inside the named furnace channels. The chain gains heat without giving the dragon’s will to the Gate.';
  if (has(state, 'c8-chain-lit-by-ember'))
    return 'Vaor’s agreed gift lights the furnace channels. The ember remains his fire, and the Gate gains no claim on it.';
  if (
    has(state, 'c8-ansel-restored-chain') &&
    has(state, 'c8-lost-furnace-reserve')
  )
    return 'Ansel’s repaired furnace route holds, but the collapsed reserve leaves no fuel for a second opening.';
  return 'The buried chain has no recorded repair source.';
}

function yardPreparationAtOpening(state: GameState) {
  if (has(state, 'c8-saved-wounded-wagon'))
    return 'Medicine from the saved wagon puts three burned wardens back on sheltered lock duty before sunset.';
  if (has(state, 'c8-yard-moved-as-one'))
    return 'The two rescue lines remain together and volunteer for one weak signal basket without waiting for rank.';
  if (has(state, 'c8-oath-anchored-yard'))
    return 'The earlier anchoring Oath taught the Gate which promises pull hardest. The yard is intact, but the later attack on your Oaths will be more precise.';
  if (has(state, 'c8-futureless-saved-yard'))
    return 'The Futureless who saved the yard choose the weakest signal basket. Their action frees one outside team for the inner ring.';
  if (has(state, 'c8-broken-grate-saved-yard'))
    return 'The vented yard remains clear, but the open grate needs two guards against anything that reaches Fourth Fort.';
  return 'The yard survived without leaving a recorded reserve for the opening.';
}

function ashPreparationPressure(state: GameState) {
  if (has(state, 'c8-tested-ash-terms'))
    return 'Your Oath test already exposed the agreement’s edge. The Compact cannot add a hidden duty when the white fire crosses.';
  if (has(state, 'c8-heard-public-ash-terms'))
    return 'Scribes from the gathered forces repeat the exact offer. Any changed word will be audible before the white fire crosses.';
  if (has(state, 'c8-delayed-ash-answer'))
    return 'Because you delayed, the Compact keeps its offer unchanged but refuses to send white fire until every mortal defence is placed. Its help will arrive with no time for correction.';
  return 'The Compact offer reached this decision without a recorded hearing, test, or delay.';
}

function seedContractConstraint(state: GameState) {
  if (has(state, 'c8-living-seed-spent'))
    return 'Lysara’s seed is dormant. It cannot test new treaty writing, so witnesses and plain actions must carry every limit.';
  if (has(state, 'c8-living-seed-weakened'))
    return 'The dimmed seed can verify one altered line, not an entire agreement. Any broader guarantee must rely on witnesses.';
  return 'Lysara’s living seed can test the agreement, but using it here will reduce the treaty magic she carries onward.';
}

function vexaGreeting(state: GameState) {
  if (has(state, 'c8-accepted-ash-compact')) {
    return '“Vexa Ash,” she says. “Voice of the Ash Compact. You granted one peaceful embassy permission to enter and leave again. We will cross only under the words spoken before your witnesses.”';
  }
  if (has(state, 'c8-united-wardens')) {
    return '“Vexa Ash,” she says. “Voice of the Ash Compact. You refused our fire and held the Gate with mortal hands. You promised us no entry. We ask only to speak from this threshold unless you choose otherwise.”';
  }
  if (has(state, 'c8-sacrificed-first-fort')) {
    return '“Vexa Ash,” she says. “Voice of the Ash Compact. You refused our fire and broke one of your own forts to close the Gate. You promised us no entry. We ask only to speak from this threshold unless you choose otherwise.”';
  }
  return '“Vexa Ash,” she says. “Your defence route is not recorded, so I cannot claim a promise from it.”';
}

function firstFortStaging(state: GameState) {
  if (has(state, 'c8-deployed-all-forts')) {
    return 'Before you leave the western road, First Fort’s paired keepers open its dry lower room as an aid station. The wounded, Pell’s sealed packet, and the furnace fuel wait there under guard.';
  }
  if (has(state, 'c8-deployed-strongpoints')) {
    return 'Before you leave the western road, Mara marks empty First Fort as the reserve aid station between the strong positions. Pell’s sealed packet and the furnace fuel go into its dry lower room.';
  }
  if (has(state, 'c8-deployed-mobile-force')) {
    return 'Before you leave the western road, Mara makes empty First Fort a temporary aid station while your mobile force remains outside. Pell’s sealed packet and the furnace fuel go into its dry lower room.';
  }
  return 'First Fort has no staging order because no deployment plan was recorded.';
}

function seedCondition(state: GameState) {
  if (has(state, 'c8-seed-critically-weakened')) {
    return 'Lysara opens her injured hand. Saving Pell left one green pulse in the living seed. It can lift the chain only once, and the effort will end its treaty magic until it is healed.';
  }
  if (has(state, 'c8-seed-weakened-saving-pell')) {
    return 'Lysara opens her hand. The living seed saved Pell, and its light is now a thin green pulse. It can still lift the chain once, but doing so will spend what remains and leave her treaty magic dormant.';
  }
  if (has(state, 'c6-seed-critically-weakened')) {
    return 'Lysara opens her injured hand. The living seed has only one short green thread left from the ancestor horn. Lifting the chain will end its treaty magic until it is healed.';
  }
  if (has(state, 'c6-lysara-hand-strained-by-horn')) {
    return 'Lysara cannot close her injured fingers around the living seed. It can lift the chain only while Sorin braces her wrist, and the effort will leave its treaty magic dormant.';
  }
  if (seedWasDamaged(state)) {
    return 'Lysara opens her injured hand. Earlier work scorched the seed and reduced its reach. It can lift the chain once with help, but the effort will leave its treaty magic dormant.';
  }
  return 'Lysara opens her hand. The living seed still carries enough strength to wake the dead roots beneath the chain, though the work will weaken its future treaty magic.';
}

function vexaMeetingStatus(state: GameState) {
  if (has(state, 'c8-vexa-received-outer-fort')) {
    return 'You honour the Compact before asking for more trust. Vexa and two sealed envoys cross into the empty Second Fort yard, where two gates and every witness remain between them and the wounded.';
  }
  if (has(state, 'c8-vexa-held-at-threshold')) {
    return 'Vexa remains beyond the threshold. She has permission to speak and return safely, but none to enter tonight.';
  }
  if (has(state, 'c8-ansel-spoke-first-after-entry')) {
    return 'The Compact embassy crosses under its public agreement, then stops inside Second Fort’s isolated yard. Ansel stands before rulers and asks its first question.';
  }
  if (has(state, 'c8-ansel-spoke-first')) {
    return 'Vexa remains on the far side while Ansel asks the first question across the threshold. No decision about entry has been made.';
  }
  if (has(state, 'c8-vexa-entered-publicly')) {
    return 'Vexa and the sealed embassy cross under the eyes of every witness.';
  }
  return 'No embassy entry state has been recorded.';
}

function personalWatchConfrontation(state: GameState) {
  if (has(state, 'c8-mara-knows-home-desire')) {
    return 'The Gate shows Mara the old inn exactly as you described it, then puts flames behind every window. She catches the key before you can offer it blindly. “A home we choose is not that old building,” she says. “Choose with your eyes open.”';
  }
  if (has(state, 'c8-mara-western-commander')) {
    return 'The western whistle sounds in your own voice. Mara rejects it, sends the true signal under her own authority, and returns before the Gate can divide your commands. “I can carry command,” she says. “I will not carry an unasked promise.”';
  }
  if (has(state, 'c8-mara-knows-fear')) {
    return 'The Gate offers to make every danger miss Mara if you surrender the future you admitted wanting. She sees panic reach for duty and closes your hand around the unused key. “Name the cost before you call it protection,” she says.';
  }
  if (has(state, 'c8-lysara-knows-road-desire')) {
    return 'The Gate opens a false green road with Lysara waiting at its end. She cuts the image with the half seal you gave her. “A shared road requires both of us,” she says. “This one never asked me.”';
  }
  if (has(state, 'c8-lysara-equal-lockkeeper')) {
    return 'The living lock tries to answer only your pulse. Lysara presses her half seal into the chain and refuses the false order. The Gate must now defeat two independent decisions instead of removing one commander.';
  }
  if (has(state, 'c8-lysara-knows-loyalty-fear')) {
    return 'The Gate speaks in the Queen’s voice and orders Lysara to oppose you. She demands a living messenger and turns the copied command aside. “Disagreement is ours,” she says. “It does not belong to this wall.”';
  }
  if (has(state, 'c8-named-home-desire')) {
    return 'The Gate offers the unchanged inn you pictured. The clean windows and waiting key expose the lie: it can restore a building, not the person or life that left it.';
  }
  if (has(state, 'c8-named-chosen-duty')) {
    return 'The Gate makes every old whistle sound at once. Because you named chosen duty before the attack, you can separate a call you accept from obedience the wall demands.';
  }
  if (has(state, 'c8-named-truth-desire')) {
    return 'The Gate offers an answer to every hidden mystery if you step through alone. You named truth as a desire, and that makes the offer easier to recognise as bait.';
  }
  return 'The Gate reaches for a private future you never named and finds no clear shape to copy.';
}

function collectorConsequenceAtEmbassy(state: GameState) {
  if (has(state, 'c8-severed-collector-hand')) {
    return 'Vexa names the rival house from its severed glove’s brass ring. Ansel seals the ring as hostile evidence.';
  }
  if (has(state, 'c8-captured-collector-glove')) {
    return 'Vexa reads the captured glove’s stitched names without touching it. A rival house prepared the collection list inside the forts.';
  }
  if (has(state, 'c8-freed-futureless-names')) {
    return 'Vexa tests the blank contracts and confirms that your public Oath broke their ownership instead of hiding it.';
  }
  if (has(state, 'c8-ansel-refused-second-price')) {
    return 'Vexa addresses Ansel first. His refusal established that one sold promise permits no second payment.';
  }
  if (has(state, 'c8-cut-collector-source-line')) {
    return 'Vexa identifies the hostile house from the cracked source seal and marks it with a public accusation.';
  }
  return 'The collector withdrew without leaving a readable mark.';
}

function survivingCrownEvidence(state: GameState) {
  const parts: string[] = [];
  if (has(state, 'c8-preserved-original-ledgers')) {
    parts.push(
      'Ansel keeps the seventeen original Gate ledgers sealed in Fourth Fort.',
    );
  } else if (has(state, 'c8-living-copy-of-openings')) {
    parts.push(
      'Lysara carries the opening dates on living bark; the Crown originals burned.',
    );
  } else if (has(state, 'c8-many-witnessed-openings')) {
    parts.push(
      'Wardens and officers can repeat the opening dates and seals, but no Crown paper survived.',
    );
  } else if (has(state, 'c8-first-fort-became-witness')) {
    parts.push(
      'First Fort’s final bell preserves the opening dates as public magical testimony, not paper.',
    );
  } else {
    parts.push(
      'The hidden Crown ledgers burned without a surviving copy of their opening dates.',
    );
  }

  if (
    hasAny(state, ['c8-first-fort-fully-evacuated', 'c8-saved-pell-packet'])
  ) {
    parts.push(
      has(state, 'c8-preserved-original-ledgers')
        ? 'Pell’s sealed duplicate also survives outside First Fort as a separate physical copy.'
        : 'Pell’s sealed duplicate also survives outside the fallen First Fort; it is not an original Crown ledger.',
    );
  } else if (
    has(state, 'c8-lost-duplicate-records') &&
    !has(state, 'c8-preserved-original-ledgers')
  ) {
    parts.push('Pell’s sealed duplicate burned in First Fort.');
  }

  if (has(state, 'c8-linked-malrec-to-gate-record')) {
    if (
      has(state, 'c7-original-orders-safe') &&
      !has(state, 'c7-saved-both-burned-proof')
    ) {
      parts.push(
        'Lysara’s binding joins Malrec’s sealed original order to the first and last reports.',
      );
    } else if (hasAny(state, chapterSevenPublicProofFlags)) {
      parts.push(
        'Lysara’s binding joins an authenticated copy of Malrec’s order to the first and last reports; the sealed original is gone.',
      );
    } else {
      parts.push(
        'Living witnesses join Malrec’s dated order to the first and last reports; no original Crown page survived.',
      );
    }
  }
  if (has(state, 'c8-gate-forgery-exposed')) {
    parts.push(
      'Ansel’s duty board and Malrec’s false staffing ledger separately prove the attempted forgery.',
    );
  }
  parts.push('Vexa’s devil contracts remain a separate foreign source.');
  return parts.join(' ');
}

function pellMapEntry(state: GameState) {
  if (has(state, 'c8-pell-died-for-map')) {
    return 'Pell’s complete map marks a hatch below the hinge. It reaches the furnace stair without crossing the command-bound gatehouse.';
  }
  if (has(state, 'c8-pell-survived')) {
    return 'Pell can identify four safe lockkeepers, but he never finished the maintenance route on his packet.';
  }
  return 'No complete lock map reached you.';
}

function outerFlameStatus(state: GameState) {
  if (!has(state, 'c8-ember-held-as-collateral')) return [];
  if (has(state, 'c8-forced-vaor-contract-use')) {
    return [
      'You forced Vaor’s usable outer flame under the white ring. Dragonfire is unavailable, and a broken agreement will burn him when he rekindles it.',
    ];
  }
  if (has(state, 'c8-vaor-approved-contract-use')) {
    return [
      'Vaor willingly placed his usable outer flame under the white ring. Dragonfire is unavailable until the embassy leaves and releases it unharmed.',
    ];
  }
  return [
    'The white ring holds Vaor’s usable outer flame, not his mind. Dragonfire is unavailable, and breaking the agreement may burn him when he rekindles it.',
  ];
}

function evidenceReactionAtEmbassy(state: GameState) {
  if (has(state, 'c8-preserved-original-ledgers'))
    return 'Without touching the original Crown ledgers, Vexa finds her rival’s mark in three entries.';
  if (has(state, 'c8-linked-malrec-to-gate-record'))
    return 'Vexa confirms that one house paid for Malrec’s withdrawal and the later collection.';
  if (has(state, 'c8-living-copy-of-openings'))
    return 'Lysara’s living bark and Vexa’s sealed contract copy show the same date; neither becomes an original Crown record.';
  if (has(state, 'c8-many-witnessed-openings'))
    return 'Three witnesses give Vexa the same opening date recorded in her sealed copy.';
  if (has(state, 'c8-gate-forgery-exposed'))
    return 'Vexa’s contract names the real keepers, giving Malrec’s false roster a second independent test.';
  return 'Vexa has no surviving mortal Gate record to compare with her contracts.';
}

function oathPriceAtEmbassy(state: GameState) {
  if (has(state, 'c8-surrendered-homecoming'))
    return 'The claim reaches for your father’s inn, but you already surrendered the unchanged homecoming it would sell.';
  if (has(state, 'c8-released-crown-oath'))
    return 'The claim reaches your cracked Crown badge and finds the old service Oath broken.';
  if (has(state, 'c8-burned-lesser-oath'))
    return 'The claim calls through your Warden whistle, but that promise can no longer compel an answer.';
  if (has(state, 'c8-shared-oath-mara'))
    return 'Mara’s black palm mark warms. Keeping every Oath gave the claim another person to threaten.';
  if (has(state, 'c8-shared-oath-lysara'))
    return 'Lysara’s black palm mark warms. Keeping every Oath gave the claim another person to threaten.';
  if (has(state, 'c8-shared-oath-korran'))
    return 'Korran’s black palm mark warms. Keeping every Oath gave the claim another person to threaten.';
  return 'The draft finds no recorded price from the Gate’s Oath attack.';
}

function firstFortStatusAtEmbassy(state: GameState) {
  if (has(state, 'c8-first-fort-fully-evacuated'))
    return [
      'First Fort’s patients and sealed duplicate survived. Only its foundation paid for the route.',
    ];
  if (
    has(state, 'c8-saved-first-fort-wounded') &&
    has(state, 'c8-saved-pell-packet') &&
    has(state, 'c8-lost-fort-fuel')
  )
    return [
      'The last patient and Pell’s duplicate survived; the ring’s stored fuel did not.',
    ];
  if (has(state, 'c8-first-fort-became-witness'))
    return [
      'First Fort’s patients survived, and its final bell carries the lost records as magical testimony.',
    ];
  if (
    has(state, 'c8-first-fort-people-first') &&
    has(state, 'c8-lost-duplicate-records')
  )
    return [
      'Every patient survived. Pell’s duplicate and the fort fuel burned.',
    ];
  if (!has(state, 'c8-sacrificed-first-fort')) return [];
  return ['First Fort fell without a recorded evacuation outcome.'];
}

export const chapterEightNodes: Record<string, StoryNode> = {
  'c8-gate-ring': {
    id: 'c8-gate-ring',
    kicker: 'Chapter Eight',
    title: 'Seven Cold Fires',
    location: 'The Black Gate Fortress Ring',
    objective: 'Reach the only occupied fort before the Gate opens.',
    threat: 'Critical',
    art: 'blackgate',
    activeConsequences: {
      complications: [
        'c7-gained-full-army',
        'c7-gained-chosen-company',
        'c7-gained-dangerous-reputation',
        'c7-shared-obedience-memory',
        'c7-forced-vaor-battle-use',
        'c7-vaor-approved-battle-use',
        'c7-lio-refused-dead-command',
        'c7-lio-refused-inside-army',
        'c7-command-demanded-proof',
      ],
    },
    lesson: {
      title: 'The ground before you',
      body: 'Eight forts form a wide ring around the Black Gate. Each fort normally lights the next, so all eight must work together to keep the Gate shut. Seven signal fires are cold. The fourth fort has soldiers inside, but its banner is upside down, the old sign for a garrison that cannot safely receive orders.',
    },
    body: (state) => [
      'The Black Gate towers above eight forts. You notice smoke only above Fourth Fort. Its upside-down Asterra banner means the garrison cannot safely receive orders.',
      arrivingForce(state),
      chapterSevenEnemyKnowledge(state),
      emberState(state),
      'Ilyra took another road to trace the hidden command. No message has arrived.',
      'The Gate knocks. A young Warden runs from Fourth Fort with one hand pressed below his ribs. Snow erupts behind him in a straight red line. Something beneath the ice is following his steps toward you.',
    ],
    choices: [
      {
        id: 'c8-ride-for-runner',
        label: 'Ride straight for the fleeing Warden.',
        detail:
          'Lose 1 Health crossing the red fault before it opens beneath him.',
        advantage: 'Reach the only witness before the Gate’s heat catches him.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c8-saved-runner-personally'],
        result:
          'Heat splits the skin above your boot, but you catch the boy by his coat and pull him across your saddle before the fault opens.',
        next: 'c8-first-knock',
      },
      {
        id: 'c8-command-runner-turn',
        label: 'Command him toward the buried drainage stones.',
        detail:
          'Spend 1 Command giving a precise route across ground you have never crossed.',
        advantage: 'Save him without exposing anyone else to the fault.',
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c8-guided-runner'],
        result:
          'Your voice reaches him before panic does. He turns at the third marker, and the red fault passes behind his heels instead of through him.',
        next: 'c8-first-knock',
      },
      {
        id: 'c8-send-korran-hook',
        label: 'Let Korran catch him with a steppe rescue hook.',
        detail: 'Trust a tool made for moving wagons, not people.',
        advantage:
          'Save your strength and show the Gate wardens that another nation came to help.',
        addFlags: ['c8-korran-saved-runner'],
        result:
          'Korran’s weighted line catches the boy around the waist. Three riders pull together, dragging him clear as the ice opens behind him.',
        next: 'c8-first-knock',
      },
    ],
  },

  'c8-first-knock': {
    id: 'c8-first-knock',
    kicker: 'A warning that bleeds',
    title: 'The Runner’s Last Warning',
    location: 'The Ground Between Forts',
    objective: 'Keep the runner alive long enough to understand his warning.',
    threat: 'Immediate',
    art: 'blackgate',
    activeConsequences: {
      reactions: [
        'c8-saved-runner-personally',
        'c8-guided-runner',
        'c8-korran-saved-runner',
      ],
    },
    introducesStoryTerms: ['Futureless'],
    body: (state) => [
      'The runner is perhaps seventeen. His brass plate says Pell. An oilskin packet bears Fourth Fort’s seal and the words First Fort copy. Your hands hold him steady.',
      '“Fourth Fort still has eighty soldiers. Captain Ansel sent me because the others cannot leave. They made bargains during the old openings.”',
      'He swallows blood. “They are not possessed. They know their names. They can choose most things. But each of them sold one promise they would make in the future.”',
      'Pell forces another breath. “One father sold the promise to stay when his daughter returned from war. He can still love and protect her. The bargain owns only that future promise.”',
      '“We call them the Futureless,” Pell says. “Tonight the buyers are coming to collect something else.”',
      ...(has(state, 'c8-saved-runner-personally')
        ? [
            'The brass maintenance key you pulled from the fault with him is still clenched in his hand.',
          ]
        : has(state, 'c8-guided-runner')
          ? [
              'The drainage stones that saved him form a second route toward Fourth Fort, clear of the red fault.',
            ]
          : has(state, 'c8-korran-saved-runner')
            ? [
                'Korran’s rescue line lies across Pell’s coat. Fourth Fort’s viewing slot stays open after its wardens see who pulled him clear.',
              ]
            : ['Pell reached you without a recorded rescue.']),
      'A third knock bends every signal basket toward the Gate. Pell stops breathing after one last whisper. “Close it.”',
    ],
    choices: [
      {
        id: 'c8-medicine-for-pell',
        label: 'Use Medicine to open Pell’s airway.',
        detail: 'Spend 1 Medicine on the only person who escaped Fourth Fort.',
        advantage:
          'Pell survives and can identify which soldiers still control the locks.',
        changes: { medicine: -1 },
        requires: { medicine: 1 },
        addFlags: ['c8-pell-survived'],
        result:
          'You cut the tight collar, clear the blood, and hold him upright until breath returns. His first useful act is to draw four safe names in the snow.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-oath-hold-pell',
        label: 'Promise that Pell will see the invasion stopped tonight.',
        detail:
          'Gain 2 Oathfire. The Oath exposes Pell to anything that follows your promises, so Ansel cannot face the later collector for you.',
        advantage:
          'The Oath steadies Pell’s heart and gives you power, but you must personally repel any claim that follows the bond back to him.',
        changes: { oathfire: 2 },
        addFlags: ['c8-oath-pell-sees-opening-contained', 'c8-pell-survived'],
        result:
          'Gold light passes from your hand into his chest. Pell gasps. The promise holds him, and its new weight settles beside every older duty.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-let-lysara-seed-pell',
        label: 'Ask Lysara to use the living seed on Pell’s lungs.',
        detail:
          'The seed saves him but loses strength needed to read the Gate later.',
        advantage:
          'Pell survives without using your limited Medicine or adding another Oath.',
        hideIfAnyFlags: inheritedSeedDamageFlags,
        addFlags: ['c8-pell-survived', 'c8-seed-weakened-saving-pell'],
        result:
          'Green threads spread beneath Pell’s skin and draw the blood from his lungs. Lysara closes her fist around a seed that now shines more weakly.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-help-damaged-seed-save-pell',
        label: 'Help Lysara use the damaged seed on Pell’s lungs.',
        detail:
          'Spend 1 Resolve holding the weak threads steady. The seed will have almost no strength left for the Gate.',
        advantage:
          'Pell survives without Medicine, but later seed magic will need a final sacrifice.',
        showIfAnyFlags: inheritedSeedDamageFlags,
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: [
          'c8-pell-survived',
          'c8-seed-weakened-saving-pell',
          'c8-seed-critically-weakened',
        ],
        result:
          'You brace Lysara’s injured hand and hold the green threads steady. Blood clears from Pell’s lungs. The seed saves him, then fades to one weak pulse.',
        next: 'c8-force-deployment',
      },
      {
        id: 'c8-take-pell-last-map',
        label: 'Let Pell spend his last breath marking the safe locks.',
        detail:
          'Preserve every resource, but lose the witness who trusted you with the warning.',
        advantage:
          'Gain the complete lock route before the next knock erases it.',
        addFlags: ['c8-pell-died-for-map', 'c8-complete-lock-map'],
        result:
          'Pell draws the last line with a shaking finger. When it is complete, his hand falls still. You copy every mark onto the inside of your shield.',
        next: 'c8-force-deployment',
      },
    ],
  },

  'c8-force-deployment': {
    id: 'c8-force-deployment',
    kicker: 'Power brought from the west',
    title: 'Who Holds the Empty Walls',
    location: 'The Western Signal Road',
    objective: 'Choose how your available force will guard the fort ring.',
    threat: 'Rising',
    art: 'blackgate',
    activeConsequences: {
      complications: [
        'c7-gained-full-army',
        'c7-gained-chosen-company',
        'c7-gained-dangerous-reputation',
        'c7-teren-lasting-injury',
        ...chapterSevenDefenceLossFlags,
      ],
    },
    body: (state) => [
      'Your attention moves around the fortress ring. Eight forts. Eight signal fires. One buried chain joining them around the Gate.',
      arrivingForce(state),
      ...(has(state, 'c7-teren-lasting-injury') ? [terenCondition(state)] : []),
      ...chapterSevenArrivalCosts(state),
      'You cannot move people again once the yearly opening begins. Anyone outside a fort will face the heat without shelter. Anyone inside the wrong fort may be trapped with a broken lock.',
      'Mara waits for the deployment order. The hidden sender’s countermeasure comes next; it will not decide where these people stand.',
    ],
    choices: [
      {
        id: 'c8-deploy-all-forts',
        label:
          'Spread your available force across all eight forts in paired teams.',
        detail:
          'Cover every wall, even if a smaller force leaves each position dangerously thin.',
        advantage:
          'No part of the ring will be unwatched when the opening begins.',
        addFlags: ['c8-deployed-all-forts'],
        result:
          'Your available fighters divide into eight columns. Nobody receives a lock alone, and nobody pretends the smaller groups can hold without help.',
        next: 'c8-inherited-countermeasure',
      },
      {
        id: 'c8-deploy-strongpoints',
        label:
          'Concentrate defenders at the strongest forts and leave clear warning lines between them.',
        detail:
          'Accept empty walls so the occupied positions can rescue one another.',
        advantage:
          'The strongest approaches may hold longer without leaving isolated defenders behind.',
        addFlags: ['c8-deployed-strongpoints'],
        result:
          'Defenders take the strongest approaches. Lamps and bell wire mark the empty ground, and mounted reserves wait where the roads meet.',
        next: 'c8-inherited-countermeasure',
      },
      {
        id: 'c8-deploy-mobile-force',
        label: 'Build warning posts and keep most of your force mobile.',
        detail:
          'Leave most walls empty so one strong group can answer the first serious attack.',
        advantage:
          'Your fighters may reach one breaking wall together instead of being defeated in isolated groups.',
        addFlags: ['c8-deployed-mobile-force'],
        result:
          'You leave no false garrisons. Bells, lamps, and marked snow will reveal where the danger begins. The main force waits within one hard ride of every approach.',
        next: 'c8-inherited-countermeasure',
      },
    ],
  },

  'c8-inherited-countermeasure': {
    id: 'c8-inherited-countermeasure',
    kicker: 'What the hidden sender learned',
    title: 'The Counterorder',
    location: 'The Western Signal Road',
    objective: 'Choose how to stop the false command prepared for this force.',
    threat: 'Immediate',
    art: 'blackgate',
    activeConsequences: {
      complications: [
        'c8-deployed-all-forts',
        'c8-deployed-strongpoints',
        'c8-deployed-mobile-force',
        'c7-lio-stranded-after-rescue',
        'c7-lio-named-deserter',
        'c7-lio-joined',
        'c7-lio-verified-command-without-copies',
        'c7-lio-returned',
        'c7-lio-prisoner',
        'c7-lio-under-guard',
      ],
    },
    body: (state) => [
      deploymentResult(state),
      chapterSevenEnemyKnowledge(state),
      chapterSevenLioDeployment(state),
      'The posts are assigned. You recognise the next danger as a stolen voice or target. This counterorder can change how the force reaches Fourth Fort; it cannot move anyone to a different deployment.',
    ],
    choices: [
      {
        id: 'c8-use-paired-living-check',
        label: 'Require two living people to confirm every order face to face.',
        detail:
          'Use a slow rule that needs no inherited preparation. Fourth Fort’s outer hinge may be unwatched while each pair confirms the warning.',
        advantage:
          'Stop a copied command from moving a lock, at the cost of a slower approach.',
        addFlags: ['c8-used-paired-living-check'],
        result:
          'Each post forms a pair. No voice can move a lock until two living people meet and repeat the order in their own words.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-counter-private-command-bait',
        label:
          'Place living officers around you and wait for the stolen memory to speak.',
        detail:
          'Spend 1 Resolve hearing your old failure used as an order without obeying it.',
        advantage:
          'Expose the sender’s prepared command before it can open a fort.',
        showIfAnyFlags: ['c7-shared-obedience-memory'],
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c8-refused-private-command-bait'],
        result:
          'The old voice comes from beneath First Fort and orders the western lock opened. You let the memory finish. Then two living officers create a fresh reply, and every keeper hears the false order fail.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-shield-known-ember-bearer',
        label:
          'Build the deployment around the ember route the sender learned.',
        detail:
          'Spend 1 Command placing empty shield lanes where the Gate expects Vaor’s bearer to walk.',
        advantage:
          'Turn the enemy’s knowledge of the ember into a false target.',
        showIfAnyFlags: [
          'c7-forced-vaor-battle-use',
          'c7-vaor-approved-battle-use',
        ],
        changes: { command: -1 },
        requires: { command: 1 },
        addFlags: ['c8-shielded-ember-bearer'],
        result:
          'Korran lays shield cloth over three empty paths. The red faults follow the ember’s reflected heat into bare snow while your real column reaches Fourth Fort.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-use-lio-living-countercall',
        label: 'Warn every Crown post that the sender can copy Lio’s refusal.',
        detail:
          'Use a fresh call and answer before any order spoken in Lio’s voice is obeyed.',
        advantage:
          'Protect the Crown ranks without pretending Lio is beside you on every route.',
        showIfAnyFlags: [
          'c7-lio-refused-dead-command',
          'c7-lio-refused-inside-army',
        ],
        addFlags: ['c8-lio-countered-copied-voice'],
        result:
          'Riders carry the warning to Teren and every post between you. When Lio’s voice calls from an empty tower, no one moves until a living officer creates the reply.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-follow-ilyra-countermark',
        label:
          'Deploy along the safe western line marked in Ilyra’s last proof.',
        detail:
          'Use the limited trace she gained without giving the sender a private memory or magical target.',
        advantage:
          'Avoid the first buried fault and reach Fourth Fort with the force together.',
        showIfAnyFlags: ['c7-command-demanded-proof'],
        addFlags: ['c8-used-ilyra-countermark'],
        result:
          'The black countermark turns warm at each buried fault. Korran moves the column around all three before the hidden sender can open them.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-use-mara-command-veto',
        label: 'Give Mara the final word on any order spoken in your voice.',
        detail:
          'Use the permission established on the steppe before the Gate can turn your authority against the forts.',
        advantage:
          'A false Caelan cannot open a lock unless Mara accepts the command.',
        showIfAnyFlags: ['c7-mara-can-stop-caelan'],
        addFlags: ['c8-mara-held-command-veto'],
        result:
          'You repeat the permission in front of every western keeper. Mara may stop any order in your voice until you confirm it face to face.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-use-three-fact-warning',
        label: 'Give every post Lysara’s three checks for a dead command.',
        detail:
          'Require a correct fort, a living messenger, and a written order before any lock moves.',
        advantage:
          'Turn the warning prepared on the steppe into one shared defence around the ring.',
        showIfAnyFlags: ['c7-three-fact-warning'],
        addFlags: ['c8-three-fact-warning-worked'],
        result:
          'Each keeper repeats the three checks before taking a post. A copied uniform will no longer be enough to move a lock.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-use-private-command-test',
        label: 'Use the private command test rehearsed before the salt battle.',
        detail:
          'Let each pair of living officers create a reply only after the challenge is spoken.',
        advantage:
          'Expose a copied commander before it can take control of a fort.',
        showIfAnyFlags: ['c7-knows-private-command-test'],
        addFlags: ['c8-private-command-test-worked'],
        result:
          'Every post forms a pair. One officer calls. The other invents the reply at once. No dead memory can answer before the living choice exists.',
        next: 'c8-occupied-fort',
      },
      {
        id: 'c8-spend-preserved-signal-post',
        label:
          'Carry the unused living signal post into the centre of the fort ring.',
        detail:
          'Spend its one stored call now so all eight forts receive the same living order.',
        advantage:
          'Block the first copied command across the whole ring, then lose the prepared post.',
        showIfAllFlags: ['c7-living-signal-post-ready'],
        hideIfAnyFlags: ['c7-living-signal-spent'],
        addFlags: ['c8-preserved-signal-post-spent'],
        result:
          'Korran plants the post at the centre road. Its stored call reaches every fort. The answering officers create the reply together, and the copper reeds split after carrying it.',
        next: 'c8-occupied-fort',
      },
    ],
  },

  'c8-occupied-fort': {
    id: 'c8-occupied-fort',
    kicker: 'The one fort that answered',
    title: 'Fourth Fort',
    location: 'Fourth Fort Gatehouse',
    objective:
      'Enter without letting the Gate use your authority against the garrison.',
    threat: 'Immediate',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-deployed-all-forts',
        'c8-deployed-strongpoints',
        'c8-deployed-mobile-force',
        'c8-used-paired-living-check',
        'c8-refused-private-command-bait',
        'c8-shielded-ember-bearer',
        'c8-lio-countered-copied-voice',
        'c8-used-ilyra-countermark',
        'c8-mara-held-command-veto',
        'c8-three-fact-warning-worked',
        'c8-private-command-test-worked',
        'c8-preserved-signal-post-spent',
      ],
      reactions: ['c8-pell-survived', 'c8-pell-died-for-map'],
    },
    body: (state) => [
      firstFortStaging(state),
      hiddenSenderCounterAtFourthFort(state),
      'Captain Ansel Greve opens one viewing slot, holding a crossbow against his own gate lever.',
      '“Do not order us to open. Some sold the future promise to obey the next true Warden. Your command may let the bargain define obedience.”',
      'Your training says to command, but your authority could give this door to the enemy.',
      has(state, 'c8-pell-survived')
        ? 'Pell calls Ansel’s name from behind you. The captain’s crossbow lowers by one finger.'
        : 'Pell’s voice is gone. You show Ansel his shield-marked route.',
      pellMapEntry(state),
      'The hinge turns by itself. The outer gate will expose everyone in the snow. Ansel shouts, “Choose your way in.”',
    ],
    choices: [
      {
        id: 'c8-enter-by-pell-map',
        label:
          'Use Pell’s complete map to enter through the maintenance hatch.',
        detail:
          'Accept the route bought with Pell’s last breath and leave Ansel free to guard the main lever.',
        advantage:
          'Enter quickly and preserve the mapped furnace route for the buried chain repair.',
        showIfAllFlags: ['c8-complete-lock-map'],
        addFlags: ['c8-entered-by-pell-map'],
        result:
          'The maintenance mark opens a hatch beneath the wall. You enter below the turning hinge while Ansel keeps his crossbow on the main lever.',
        next: 'c8-futureless-reveal',
      },
      {
        id: 'c8-enter-without-command',
        label: 'Ask Ansel what help he freely chooses to accept.',
        detail:
          'Give up the speed of command and let him define the safe entrance.',
        advantage:
          'Enter without activating the Futureless bargain tied to Warden authority.',
        addFlags: ['c8-ansel-chose-entry'],
        result:
          'Ansel thinks, then orders his own people to lift a grain hatch. You crawl through one at a time while he jams the moving hinge from inside.',
        next: 'c8-futureless-reveal',
      },
      {
        id: 'c8-break-side-grate',
        label: 'Break through the side grate before the main gate opens.',
        detail:
          'Lose 1 Health forcing frozen iron apart with your wounded shoulder.',
        advantage:
          'Reach the gate lever without speaking any command the bargain can twist.',
        changes: { health: -1 },
        requires: { health: 1 },
        addFlags: ['c8-broke-fourth-grate'],
        result:
          'Old pain tears open beneath your armour. The grate gives first. You roll inside and drive your sword through the turning hinge.',
        next: 'c8-futureless-reveal',
      },
      {
        id: 'c8-oath-free-entry',
        label:
          'Swear that no order spoken at this door will bind an unwilling defender.',
        detail: 'Spend 2 Oathfire to protect choice within the gatehouse.',
        advantage:
          'Your people enter openly and the Futureless can hear you without the old bargain answering.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-free-command-zone'],
        result:
          'Gold fire covers the threshold. The moving hinge stops. Ansel opens the door himself, and eighty frightened soldiers see you enter without owning their choice.',
        next: 'c8-futureless-reveal',
      },
    ],
  },

  'c8-futureless-reveal': {
    id: 'c8-futureless-reveal',
    kicker: 'A price paid before it was owed',
    title: 'The Promises Missing From Tomorrow',
    location: 'Fourth Fort Common Hall',
    objective: 'Learn what the garrison sold and which locks remain safe.',
    threat: 'Rising',
    art: 'futureless',
    body: () => [
      'You notice no monsters among the eighty soldiers. They are tired people with clean weapons and untouched letters from home.',
      'Ansel lays three plain-language contracts on a table. During earlier openings, each soldier received food, heat, or one rescued life. A devil claimed one promise that soldier would make later.',
      'The bargain cannot force love, hate, marching, or killing. It owns the act and meaning of one named promise, even if its seller changes the words.',
      'Ansel taps the final line. “One named promise. Nothing more. A buyer cannot demand another payment because it dislikes the first.”',
      'He sold the promise to stay when his daughter came home. Another soldier sold the promise to guard the last signal basket. Both still choose ordinary duties; only those future acts belong to the contracts.',
      'The ledgers show people abandoned during secret openings, selling whatever kept someone alive. A black mark crosses one contract as the signal clock counts down two hours to sunset.',
    ],
    choices: [
      {
        id: 'c8-list-every-sold-promise',
        label: 'Record every sold promise before deciding whom to trust.',
        detail:
          'Spend precious time building an exact list of what the bargains can and cannot touch.',
        advantage:
          'No later command will accidentally depend on a promise already owned.',
        addFlags: ['c8-complete-futureless-ledger'],
        result:
          'Six clerks question small groups while you and Ansel check every line. In forty minutes, all eighty accounts become one painful, useful list. Fear becomes a set of known limits instead of a shadow over every face.',
        next: 'c8-hidden-record',
      },
      {
        id: 'c8-test-contract-with-oathfire',
        label: 'Touch one contract with Oathfire and learn how it answers.',
        detail: 'Spend 1 Oathfire testing the bargain without breaking it.',
        advantage:
          'Discover that the contracts draw power from a chamber beneath the Gate.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c8-found-contract-source'],
        result:
          'Gold fire touches black ink. A line of pain runs through your hand and down into the floor, pointing toward one buried chamber beneath the Gate.',
        next: 'c8-hidden-record',
      },
      {
        id: 'c8-give-ansel-choice-test',
        label: 'Ask Ansel to refuse a simple request in front of everyone.',
        detail:
          'Risk insulting the captain to prove the difference between choice and the stolen promise.',
        advantage:
          'The garrison sees that ordinary refusal still belongs to them.',
        addFlags: ['c8-futureless-choice-proven'],
        result:
          'You ask Ansel to surrender his sword. “No,” he says at once. Nothing punishes him. A few soldiers laugh from relief, and the hall feels human again.',
        next: 'c8-hidden-record',
      },
    ],
  },

  'c8-hidden-record': {
    id: 'c8-hidden-record',
    kicker: 'The Crown knew',
    title: 'Seventeen Nights Erased',
    location: 'Fourth Fort Record Room',
    objective:
      'Recover the hidden opening record before the Gate’s heat destroys it.',
    threat: 'Immediate',
    art: 'futureless',
    activeConsequences: {
      complications: ['c7-proof-public-early'],
      reactions: ['c7-front-rank-saw-original'],
    },
    body: (state) => [
      'Behind the duty board, Ansel finds seventeen yearly ledgers.',
      'The Gate opened for an hour on the same winter night each year. A finger-wide crack grew until a person could pass sideways last winter.',
      'Every report reached the Crown. Its replies called the openings furnace faults, paid dead families, and replaced public witnesses. Malrec sealed only the newest orders.',
      'Across seventeen years, the Crown removed witnesses, delayed supplies, and closed three failing garrisons. Wardens bargained for food, heat, and lives.',
      'Three weeks ago, Malrec pulled the field army from four more forts without replacements. His final order left only Fourth Fort occupied tonight.',
      'Your eyes match the fort names on Malrec’s order. The steppe paper and Gate reports form one plan.',
      ...(has(state, 'c7-front-rank-saw-original')
        ? [
            'Three front-rank officers recognise Malrec’s seal; the rest still rely on Teren’s judgment.',
          ]
        : []),
      'Pell’s sealed packet is a complete duplicate, stored with the wounded and fuel in First Fort.',
      'An iron hatch faces the occupied hall. Officers and wardens have less than a minute to see the heating ledgers.',
      ...(has(state, 'c7-proof-public-early')
        ? [
            'A loose ledger near the door carries a fresh seal and claims the forts were fully staffed. Malrec’s loyalists prepared the forgery after your copies appeared on the steppe.',
          ]
        : []),
    ],
    choices: [
      {
        id: 'c8-carry-opening-ledgers',
        label: 'Take the original ledgers and run through the heating passage.',
        detail:
          'Lose 2 Health carrying proof against the Crown through falling stone.',
        advantage:
          'Preserve seventeen years of original names, dates, and sealed replies.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-preserved-original-ledgers'],
        result:
          'The passage tears your cloak and opens your shoulder. You reach the yard with all seventeen ledgers pressed against your chest.',
        next: 'c8-breach',
      },
      {
        id: 'c8-lysara-copies-opening-proof',
        label: 'Let Lysara copy the dates into living treaty bark.',
        detail: 'Save the facts while the original ledgers burn.',
        advantage:
          'The copy can survive heat and be tested by foreign courts, though Crown loyalists may dispute it.',
        addFlags: ['c8-living-copy-of-openings'],
        result:
          'Green letters grow across a strip of pale bark. The final date appears as the hidden shelf catches fire. The facts survive without the royal paper.',
        next: 'c8-breach',
      },
      {
        id: 'c8-call-witnesses-to-record-room',
        label:
          'Open the viewing hatch and call nearby officers and wardens to the seals.',
        detail:
          'Preserve no paper, but let people from the gathered forces witness the record from the common hall.',
        advantage:
          'Malrec cannot silence the record by stealing one document or killing one courier.',
        addFlags: ['c8-many-witnessed-openings'],
        result:
          'Ansel tears the hatch wide. Crown officers or volunteers stand beside steppe witnesses and Futureless wardens as the seals blacken. Every present force leaves knowing the same dates.',
        next: 'c8-breach',
      },
      {
        id: 'c8-link-malrec-order-to-ledgers',
        label:
          'Join the surviving Malrec proof to the first and last hidden records.',
        detail:
          'Save the direct chain from years of concealment to the final troop withdrawal while the other Gate ledgers burn.',
        advantage:
          'The proof from the salt basin now establishes who emptied the forts and how long the Crown hid the openings.',
        showIfAnyFlags: [
          'c7-original-orders-safe',
          ...chapterSevenPublicProofFlags,
        ],
        addFlags: ['c8-linked-malrec-to-gate-record'],
        result:
          'Lysara binds the first and last hidden reports to the strongest surviving proof of Malrec’s order. Crown officers verify the source before the remaining ledgers burn. The record now shows a policy, not one isolated betrayal.',
        next: 'c8-breach',
      },
      {
        id: 'c8-expose-prepared-gate-forgery',
        label: 'Compare Malrec’s prepared forgery with the fort duty board.',
        detail:
          'Use the warning created when you published the first proof early. Save the roster conflict while most old ledgers burn.',
        advantage:
          'Destroy the loyalists’ planned answer before it can divide the Crown force inside the ring.',
        showIfAnyFlags: ['c7-proof-public-early'],
        addFlags: ['c8-gate-forgery-exposed'],
        result:
          'Ansel places the fresh ledger beside his nailed duty board. The names do not match the soldiers who actually served. Teren tears off the false seal in front of his officers.',
        next: 'c8-breach',
      },
    ],
  },

  'c8-breach': {
    id: 'c8-breach',
    kicker: 'The Gate’s first breath',
    title: 'When the Wall Breathes',
    location: 'Fourth Fort Inner Yard',
    objective:
      'Save the yard before the first opening breath reaches the powder room.',
    threat: 'Critical',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-deployed-all-forts',
        'c8-deployed-strongpoints',
        'c8-deployed-mobile-force',
        'c7-lost-fast-horses',
        'c7-ally-lasting-injury',
      ],
    },
    body: (state) => [
      inheritedForcePressure(state),
      deploymentPressure(state),
      ...(chapterSevenInjuredAlly(state)
        ? [
            `${chapterSevenInjuredAlly(state)} cannot brace the falling powder door with the lasting injury from the red wall. Ansel sends the only free pair of hands to hold it.`,
          ]
        : []),
      'More than an hour before the yearly opening, the Gate inhales.',
      'Air tears toward the black wall. A sword-thin red crack appears as the powder door breaks loose and carts roll backward.',
      'Your attention catches two dangers: a wagon carrying three wounded wardens rolls toward the crack while sparks race for the exposed powder barrels.',
      'Mara catches one falling soldier and Ansel reaches another. You can stop one danger yourself; someone you trust must take the other.',
    ],
    choices: [
      {
        id: 'c8-stop-wagon-health',
        label:
          'Put your body behind the wounded wagon and send Mara for the powder.',
        detail:
          'Lose 2 Health stopping three wounded wardens from reaching the Gate.',
        advantage:
          'Mara smothers the powder sparks while you save everyone on the wagon.',
        changes: { health: -2 },
        requires: { health: 1 },
        hideIfAnyFlags: ['c8-broke-fourth-grate'],
        addFlags: ['c8-saved-wounded-wagon'],
        result:
          'The wheel crushes your boot against the drain lip. You hold until Ansel blocks it with a beam. Across the yard, Mara rolls the last burning barrel into snow.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-vent-breath-through-grate',
        label:
          'Open the broken side grate and turn the Gate’s pull away from the wagon.',
        detail:
          'Use the escape route earned when you forced entry through the frozen iron.',
        advantage:
          'Vent the yard long enough for Ansel to stop the wagon while you bury the powder sparks.',
        showIfAllFlags: ['c8-broke-fourth-grate'],
        addFlags: ['c8-broken-grate-saved-yard'],
        result:
          'You kick the broken grate outward. The crosswind pulls the wagon against the drain instead of toward the Gate. Ansel blocks its wheels while you bury the last sparks.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-command-two-rescues',
        label:
          'Split the yard into two rescue lines before panic chooses for them.',
        detail:
          'Spend 2 Command making enemies and strangers move as one team.',
        advantage:
          'Save the wagon and powder without adding another personal injury.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-yard-moved-as-one'],
        result:
          'You give four names and two jobs. The yard answers. One line stops the wagon while the other buries the sparks beneath wet cloaks.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-oath-anchor-yard',
        label:
          'Bind every loose object in the yard to the ground until the breath ends.',
        detail:
          'Spend 2 Oathfire holding wood, iron, flame, and people in place.',
        advantage:
          'Prevent both disasters and learn that the Gate pulls hardest on spoken promises.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-oath-anchored-yard'],
        result:
          'Gold lines spread across the stones. The wagon stops. The sparks flatten. Your Oaths strain toward the crack more fiercely than anything made of iron.',
        next: 'c8-ash-offer',
      },
      {
        id: 'c8-trust-futureless-yard',
        label: 'Let Ansel’s soldiers choose the rescues without your command.',
        detail:
          'Use the refusal test you witnessed and risk both dangers on people the Crown called compromised.',
        advantage:
          'The Futureless prove they can protect the fort without promises or borrowed authority.',
        showIfAllFlags: ['c8-futureless-choice-proven'],
        addFlags: ['c8-futureless-saved-yard'],
        result:
          'Ansel shouts no oath and asks for no vow. His soldiers move anyway. They stop the wagon and bury the sparks because they choose to, not because anyone owns the words.',
        next: 'c8-ash-offer',
      },
    ],
  },

  'c8-ash-offer': {
    id: 'c8-ash-offer',
    kicker: 'A white light beyond the crack',
    title: 'The Offer From the Other Side',
    location: 'Fourth Fort Gate Platform',
    objective:
      'Understand the offer before the opening becomes wide enough to enforce it.',
    threat: 'Critical',
    art: 'blackgate',
    introducesStoryTerms: ['Ash Compact'],
    lesson: {
      title: 'A faction, not a species',
      body: 'The Ash Compact is one organised group of devils, not everyone beyond the Gate. It says a rival group is forcing the opening. It offers white fire in return for permission to send one peaceful embassy. Its bargains follow the exact words spoken, so witnesses matter.',
    },
    body: () => [
      'A white ember appears on the far side of the red crack. It gives no heat. A woman’s voice speaks through it in careful Asterra trade speech.',
      '“The hand pushing your Gate does not belong to the Ash Compact. We prefer a door with witnesses to a wound with armies.”',
      'The speaker offers enough white fire to join the eight fort locks for one night. In return, the Compact wants permission for one peaceful embassy to enter and leave again after the Gate is stable. No hidden travellers. No weapons raised first. Every term spoken in public.',
      'Ansel keeps his crossbow trained on the ember. Two soldiers with black contract marks step closer to hear it. The others move back. Nobody lowers a weapon.',
      'Your instincts reject the waiting ember, but the voice asks to be heard rather than trusted. “Will Caelan Vey hear the terms before he decides?”',
    ],
    choices: [
      {
        id: 'c8-hear-ash-terms-publicly',
        label:
          'Hear every term in the open yard with witnesses from each force.',
        detail: 'Give the Compact no privacy and promise nothing yet.',
        advantage:
          'Learn the full offer without allowing either side to change its words later.',
        addFlags: ['c8-heard-public-ash-terms'],
        result:
          'You bring the ember into the yard. Mortal scribes record each sentence. The Compact asks for speech, safe return, and one named envoy. It asks for no soul, blood, worship, or secret obedience.',
        next: personalWatch,
      },
      {
        id: 'c8-test-ash-terms-oathfire',
        label: 'Pass the offer through Oathfire before answering.',
        detail:
          'Spend 1 Oathfire testing whether the spoken price hides another duty.',
        advantage:
          'Prove that the wording hides no extra duty, while revealing one of your Oaths to them.',
        changes: { oathfire: -1 },
        requires: { oathfire: 1 },
        addFlags: ['c8-tested-ash-terms'],
        result:
          'Gold fire closes around the white ember. No extra duty appears. The voice beyond the Gate learns the shape of one promise you carry and thanks you for the introduction.',
        next: personalWatch,
      },
      {
        id: 'c8-refuse-until-mortal-plan',
        label:
          'Refuse an answer until you know whether mortals can restore the forts alone.',
        detail:
          'Delay the safest offer while preserving complete freedom for the next decision.',
        advantage:
          'No contract can shape your defence before you understand your own options.',
        addFlags: ['c8-delayed-ash-answer'],
        result:
          'The white ember dims but does not vanish. “A delayed answer is still yours,” the voice says. “That is more courtesy than some houses offer.”',
        next: personalWatch,
      },
    ],
  },

  'c8-mara-watch': {
    id: 'c8-mara-watch',
    kicker: 'One breath before sunset',
    title: 'What the Gate Can Hear',
    location: 'Fourth Fort West Tower',
    objective:
      'Tell Mara what part of your future remains yours before the Gate tests it.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'Mara returns from the western signal line with snow in her hair and another soldier’s blood on one sleeve. She closes the tower door, checks that the latch holds, and lets her forehead rest against yours.',
      'For a moment, your body remembers warmth without armour between it and danger. Her hand settles at your waist, familiar and careful around the newest wound.',
      '“That Gate steals promises people have not made yet,” she says. “So tell me something without turning it into an Oath. What do you want when nobody needs Captain Vey?”',
      'The answer frightens you more than the crack outside. Duty has always let you postpone desire. The Gate may make postponement a price someone else can collect. Mara waits and says, “No Oath. Just the truth.”',
    ],
    choices: [
      {
        id: 'c8-mara-name-home',
        label: 'Tell Mara you want a home chosen together, then kiss her.',
        detail: 'Name desire without making it a binding promise.',
        advantage:
          'Mara knows what you are protecting if the Gate later demands a personal price.',
        addFlags: ['c8-mara-knows-home-desire'],
        result:
          '“A door we choose,” you say. “A table that is ours. Work we can leave at night.” Her kiss is slow despite the horns outside, and it ends because both of you decide the moment must end.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-mara-share-command',
        label: 'Ask Mara to command the western forts as your equal.',
        detail: 'Answer her with present trust instead of a future promise.',
        advantage:
          'The defence gains a second independent commander whom the Gate cannot control through you.',
        addFlags: ['c8-mara-western-commander'],
        result:
          '“I want you beside me without standing behind me,” you say. Mara takes the western command seal. Her smile is brief, proud, and entirely her own.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-mara-admit-fear-of-wanting',
        label:
          'Admit that wanting a future gives the enemy something to threaten.',
        detail: 'Offer an honest fear without asking Mara to solve it.',
        advantage:
          'She can recognise when duty is hiding panic during the coming test.',
        addFlags: ['c8-mara-knows-fear'],
        result:
          'Mara does not call the fear foolish. She takes your hand and says, “Then we protect the wanting too. We do not bury it for them.”',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-lysara-watch': {
    id: 'c8-lysara-watch',
    kicker: 'One breath before sunset',
    title: 'A Future Without Treaty Ink',
    location: 'Fourth Fort Record Tower',
    objective:
      'Tell Lysara what belongs to the two of you, not to the kingdoms you represent.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'Lysara meets you above the ruined ledgers. Red light touches the brown skin at her throat and turns the green seed in her palm almost black.',
      'She takes your hand first. Her thumb moves across the scar where Oathfire has burned you since Bellweather.',
      '“A treaty survives because everyone knows what it promises,” she says. “We have been less precise with ourselves. What do you want that is not useful to Asterra, my court, or this Gate?”',
      'You hear the opening horns below. There is no time for a perfect answer, only a true one. Lysara waits and says, “Answer as yourself.”',
    ],
    choices: [
      {
        id: 'c8-lysara-name-shared-road',
        label:
          'Tell Lysara you want to choose a road together after the crisis, then kiss her.',
        detail: 'Name a mutual desire without turning it into duty.',
        advantage:
          'Lysara knows the future you value if the Gate later tests it.',
        addFlags: ['c8-lysara-knows-road-desire'],
        result:
          '“Not your court. Not mine,” you say. “One road neither kingdom assigned.” She kisses you with one hand against your chest, then steps back before the horn can ask twice.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-lysara-share-lock-authority',
        label: 'Give Lysara equal authority over the living lock.',
        detail:
          'Answer with power shared now instead of a promise about later.',
        advantage:
          'The Gate cannot break the defence by removing either one of you alone.',
        addFlags: ['c8-lysara-equal-lockkeeper'],
        result:
          'You press half the lock seal into her hand. “If I fall, you decide. If you disagree, you say it before everyone.” Lysara closes her fingers around equal power.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-lysara-admit-two-loyalties',
        label:
          'Admit that you fear one day your kingdoms will demand opposite choices.',
        detail:
          'Name the conflict without demanding that she choose you in advance.',
        advantage:
          'Neither of you can mistake future disagreement for personal betrayal.',
        addFlags: ['c8-lysara-knows-loyalty-fear'],
        result:
          'Lysara holds your gaze. “Then we argue as ourselves before we obey as symbols.” It is not comfort. It is something stronger and more usable.',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-quiet-watch': {
    id: 'c8-quiet-watch',
    kicker: 'One breath before sunset',
    title: 'The Want Beneath Duty',
    location: 'Fourth Fort West Tower',
    objective: 'Decide what private desire the Gate must not choose for you.',
    threat: 'Immediate',
    art: 'blackgate',
    body: () => [
      'The early pressure eases. One hour remains before sunset, and every repair team knows its post. You take one minute while the next horn is quiet.',
      'You take one minute alone above the fortress ring. Mara commands the western wall. Lysara prepares the living lock. Korran checks the riders below. Their work continues without needing you at its centre.',
      'The sight should feel like relief. Instead, it exposes a question duty has hidden for years. If the world survives, what do you want your life to contain besides the next person who needs saving?',
      'The Gate knocks softly. Every Oath answers. Your fear circles one silent question: what do you want for yourself? The private wants beneath the duties may be the only things that still belong entirely to you.',
    ],
    choices: [
      {
        id: 'c8-want-road-home',
        label: 'Choose the hope of a home you are allowed to return to.',
        detail:
          'Name the desire privately without binding another person to it.',
        advantage:
          'You will recognise the true price if the Gate asks you to surrender home later.',
        addFlags: ['c8-named-home-desire'],
        result:
          'The word home hurts more than expected. You let it hurt. Wanting rest does not make the people below less important.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-want-chosen-duty',
        label: 'Choose duties you can accept, refuse, and finish.',
        detail: 'Separate service from obedience before the Gate tests both.',
        advantage:
          'You enter the opening knowing which old Oath no longer represents you.',
        addFlags: ['c8-named-chosen-duty'],
        result:
          'You have spent years accepting every burden that reached your hands. For the first time, you allow refusal to exist beside honour.',
        next: 'c8-chain-plan',
      },
      {
        id: 'c8-want-truth-after-war',
        label: 'Choose the Concord’s truth even if no kingdom rewards you.',
        detail:
          'Choose curiosity as a personal desire, not another official mission.',
        advantage:
          'Fear cannot reduce the coming Gate to a single battle you must merely win.',
        addFlags: ['c8-named-truth-desire'],
        result:
          'The nine Nails, the lost histories, and the hidden openings are more than enemies. You want to understand what the world was built to forget.',
        next: 'c8-chain-plan',
      },
    ],
  },

  'c8-chain-plan': {
    id: 'c8-chain-plan',
    kicker: 'Eight fires, one lock',
    title: 'The Buried Chain',
    location: 'Fourth Fort Map Floor',
    objective:
      'Restore the physical link between the forts before deciding who will power it.',
    threat: 'Critical',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-seed-weakened-saving-pell',
        'c8-seed-critically-weakened',
        ...inheritedSeedDamageFlags,
      ],
    },
    body: (state) => [
      'The fort map shows one simple defence. Each signal basket feeds heat into a buried iron chain. When all eight links glow, the ring holds the Black Gate shut.',
      'Seven baskets are cold. Two fuel stores are flooded. One chain section lies beneath open ground already splitting with red heat.',
      seedCondition(state),
      vaorGateUse(state),
      'Ansel knows the old furnace route. Mara can lead a repair line across exposed snow. You can protect only one method from the Gate’s next breath.',
      'Your attention keeps returning to the exposed chain section. The opening horn sounds. Sunset touches the top of the black wall.',
    ],
    choices: [
      {
        id: 'c8-root-lift-chain',
        label: 'Use Lysara’s living seed to lift the broken chain from below.',
        detail:
          'Weaken the seed’s future treaty magic to repair the safest underground route.',
        advantage:
          'Restore the chain without exposing soldiers on the open ground.',
        hideIfAnyFlags: [
          'c8-seed-weakened-saving-pell',
          ...inheritedSeedDamageFlags,
        ],
        addFlags: ['c8-chain-lifted-by-seed', 'c8-living-seed-weakened'],
        result:
          'Green roots rise beneath the iron and carry it across the flooded gap. The seed dims, but the chain closes link by link.',
        next: 'c8-opening',
      },
      {
        id: 'c8-spend-weakened-seed-on-chain',
        label: 'Spend the living seed’s remaining strength to lift the chain.',
        detail:
          'Earlier magic weakened the seed. This final use will leave its treaty magic dormant.',
        advantage:
          'Restore the chain without exposing soldiers on the open ground.',
        showIfAnyFlags: [
          'c8-seed-weakened-saving-pell',
          ...inheritedSeedDamageFlags,
        ],
        addFlags: ['c8-chain-lifted-by-seed', 'c8-living-seed-spent'],
        result:
          'Sorin braces Lysara’s wrist while the weakened seed trembles in her palm. Roots lift the iron into place, then every green thread goes dark. The seed has no magic left for the next treaty.',
        next: 'c8-opening',
      },
      {
        id: 'c8-follow-pell-furnace-map',
        label: 'Follow Pell’s complete lock map to the intact furnace bypass.',
        detail:
          'Use the route preserved at the cost of Pell’s life. The bypass can carry only tonight’s fire.',
        advantage:
          'Restore the chain without another injury or magical cost, but lose the bypass after this opening.',
        showIfAllFlags: ['c8-entered-by-pell-map'],
        addFlags: ['c8-pell-map-restored-chain', 'c8-lost-furnace-bypass'],
        result:
          'Pell’s marks lead beneath the flooded stores to one dry bypass. Ansel drives the joining pin home. The old channel cracks after the chain lights, leaving no route for a second opening.',
        next: 'c8-opening',
      },
      {
        id: 'c8-lead-chain-repair',
        label: 'Lead the repair line across the exposed ground.',
        detail:
          'Lose 2 Health reaching the broken section before the red fault widens.',
        advantage:
          'Preserve the seed and furnace fuel while restoring the shortest link.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-chain-repaired-by-hand'],
        result:
          'Heat cuts through your greaves. You and Korran’s riders drag the iron into place and hammer the joining pin while Mara calls the safe steps from cover.',
        next: 'c8-opening',
      },
      {
        id: 'c8-burn-vaor-ember-chain',
        label:
          'Ask Vaor to feed one breath of his ember into the flooded furnaces.',
        detail:
          'Spend 2 Resolve holding the fire after Vaor chooses to answer.',
        advantage:
          'Relight every furnace at once and preserve mortal fuel for the night.',
        showIfAnyFlags: ['c5-freed-vaor'],
        hideIfAnyFlags: chapterSevenApprovedVaorUseFlags,
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-chain-lit-by-ember'],
        result:
          'You name the danger to the forts. Vaor agrees and opens one breath of fire. You hold it inside the flooded channels until all eight baskets wake.',
        next: 'c8-opening',
      },
      {
        id: 'c8-call-vaor-after-steppe-consent',
        label:
          'Ask Vaor to repeat the careful ember use that protected people on the steppe.',
        detail:
          'Spend 1 Resolve guiding a use whose limits both of you already tested.',
        advantage:
          'Relight every furnace with less strain because earlier consent built a working method.',
        showIfAllFlags: ['c5-freed-vaor'],
        showIfAnyFlags: chapterSevenApprovedVaorUseFlags,
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c8-chain-lit-by-ember', 'c8-vaor-approved-gate-use'],
        result:
          'You ask for the same narrow fire that protected living people on the steppe. Vaor agrees. The ember follows the tested limits and wakes all eight baskets without spreading into the fort rooms.',
        next: 'c8-opening',
      },
      {
        id: 'c8-force-stolen-ember-chain',
        label: 'Force the stolen ember into the flooded furnaces.',
        detail: 'Spend 3 Resolve controlling dragon fire while Vaor resists.',
        advantage:
          'Relight every furnace at once, but deepen Vaor’s anger and expose the theft to every witness.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        hideIfAnyFlags: chapterSevenForcedVaorUseFlags,
        changes: { resolve: -3 },
        requires: { resolve: 3 },
        addFlags: ['c8-chain-lit-by-ember', 'c8-forced-vaor-gate-use'],
        result:
          'Vaor refuses. You force the ember open anyway. Fire runs through the flooded channels while his resistance tears at your breath. All eight baskets wake, and every witness hears the dragon’s anger.',
        next: 'c8-opening',
      },
      {
        id: 'c8-force-ember-after-steppe-abuse',
        label:
          'Force the stolen ember again after Vaor resisted you on the steppe.',
        detail:
          'Spend 4 Resolve overcoming stronger resistance. The fire may damage the furnace channels after it wakes them.',
        advantage:
          'Relight every furnace, but enter the opening hour with Vaor actively fighting your control.',
        showIfAllFlags: ['c5-took-ember-by-force'],
        showIfAnyFlags: chapterSevenForcedVaorUseFlags,
        changes: { resolve: -4 },
        requires: { resolve: 4 },
        addFlags: [
          'c8-chain-lit-by-ember',
          'c8-forced-vaor-gate-use',
          'c8-vaor-resisting-at-gate',
        ],
        result:
          'Vaor recognises the pressure and tears back. You force the ember through the flooded channels. All eight baskets wake, but one furnace wall cracks and the dragon’s anger remains inside every flame.',
        next: 'c8-opening',
      },
      {
        id: 'c8-share-pact-ember-chain',
        label: 'Ask Vaor to share the furnace risk through the pact.',
        detail:
          'Spend 2 Resolve after both bearers agree to protect the fort ring.',
        advantage:
          'Relight every furnace without breaking either bearer’s right to refuse.',
        showIfAnyFlags: ['c5-vaor-pact'],
        hideIfAnyFlags: chapterSevenApprovedVaorUseFlags,
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-chain-lit-by-ember', 'c8-vaor-approved-gate-use'],
        result:
          'You name the purpose and the risk. Vaor agrees. The pact opens, and fire runs through the flooded channels until all eight baskets wake.',
        next: 'c8-opening',
      },
      {
        id: 'c8-share-tested-pact-ember-chain',
        label: 'Use the protective ember method Vaor accepted on the steppe.',
        detail:
          'Spend 1 Resolve after both bearers agree that the fort ring protects living people.',
        advantage:
          'Relight every furnace with less strain because the pact already tested this limit together.',
        showIfAllFlags: ['c5-vaor-pact'],
        showIfAnyFlags: chapterSevenApprovedVaorUseFlags,
        changes: { resolve: -1 },
        requires: { resolve: 1 },
        addFlags: ['c8-chain-lit-by-ember', 'c8-vaor-approved-gate-use'],
        result:
          'You name the same protective limit used on the steppe. Vaor agrees. The pact carries a narrow flame through the flooded channels and wakes every basket.',
        next: 'c8-opening',
      },
      {
        id: 'c8-use-ansel-furnace-route',
        label:
          'Trust Ansel to reopen the old furnace route his soldiers maintained alone.',
        detail:
          'Use the trust established when Ansel chose your safe entrance. One hidden furnace may still fail.',
        advantage:
          'Preserve every magical resource and restore the wardens’ ownership of their fort.',
        showIfAllFlags: ['c8-ansel-chose-entry'],
        addFlags: ['c8-ansel-restored-chain', 'c8-lost-furnace-reserve'],
        result:
          'Ansel takes twenty soldiers into the smoke passage. They return black with soot and carrying the missing chain pin. A buried furnace collapses behind them, destroying the reserve fuel, but they needed tools, not redemption.',
        next: 'c8-opening',
      },
    ],
  },

  'c8-opening': {
    id: 'c8-opening',
    kicker: 'The longest hour begins',
    title: 'A Door Wide Enough for One',
    location: 'The Black Gate Inner Ring',
    objective: 'Keep the yearly opening from becoming an invasion road.',
    threat: 'Critical',
    art: 'blackgate',
    activeConsequences: {
      complications: [
        'c8-pell-map-restored-chain',
        'c8-lost-furnace-bypass',
        'c8-chain-lifted-by-seed',
        'c8-chain-repaired-by-hand',
        'c8-chain-lit-by-ember',
        'c8-forced-vaor-gate-use',
        'c8-vaor-approved-gate-use',
        'c8-vaor-resisting-at-gate',
        'c8-ansel-restored-chain',
        'c8-lost-furnace-reserve',
        'c8-saved-wounded-wagon',
        'c8-yard-moved-as-one',
        'c8-oath-anchored-yard',
        'c8-futureless-saved-yard',
        'c8-broken-grate-saved-yard',
        'c8-heard-public-ash-terms',
        'c8-tested-ash-terms',
        'c8-delayed-ash-answer',
        'c7-gained-full-army',
        'c7-gained-chosen-company',
        'c7-gained-dangerous-reputation',
      ],
    },
    body: (state) => [
      'The Gate opens at sunset.',
      'First comes a red line. Then the two halves move apart by the width of one hand. Through the gap, you see a city of black towers beneath an orange sky. A hot wind carries voices speaking in several languages.',
      'The yearly opening lasts one hour. It has happened seventeen times. Every earlier year, the gap widened. Tonight someone beneath the Gate is pulling on the stolen future promises to force it farther.',
      chainMethodPressure(state),
      yardPreparationAtOpening(state),
      forceChoiceAtOpening(state),
      ashPreparationPressure(state),
      'Mortal keepers can hold every fire. Compact fire can fill weak links in return for the promised embassy. Destroying First Fort would feed the other seven and leave a permanent gap.',
    ],
    choices: [
      {
        id: 'c8-choose-united-wardens',
        label:
          'Unite the mortal wardens and let each fort choose its own keeper.',
        detail:
          'Reject devil aid and refuse to destroy a fort. The defence will depend on frightened people holding every weak point.',
        advantage:
          'Keep the Gate under mortal control without creating a new contract or permanent gap.',
        hideIfAnyFlags: chapterSevenDefenceLossFlags,
        addFlags: ['c8-united-wardens'],
        result:
          'You send one question around the ring: Who freely chooses a fire? Names return from Crown ranks, volunteers, steppe riders, and the Futureless.',
        next: 'c8-wardens-route',
      },
      {
        id: 'c8-choose-depleted-wardens',
        label:
          'Unite the mortal wardens with the supplies that survived the salt basin.',
        detail:
          'Reject devil aid and refuse to destroy a fort. Thin food, arrows, horses, or cold weather gear will leave the mortal defence with no reserve.',
        advantage:
          'Keep the Gate under mortal control, but accept more burns and no spare force if a second wall breaks.',
        showIfAnyFlags: chapterSevenDefenceLossFlags,
        addFlags: ['c8-united-wardens', 'c8-depleted-mortal-defense'],
        result:
          'Every remaining cloak, arrow, ration, and horse goes to a named post. The eight fires gain willing keepers. There is nothing left behind them except the people already carrying wounds.',
        next: 'c8-wardens-route',
      },
      {
        id: 'c8-choose-ash-compact',
        label: 'Accept the Ash Compact’s white fire under the public terms.',
        detail:
          'Grant safe passage to one peaceful embassy after the Gate is stable.',
        advantage:
          'Fill every weak link without sacrificing a fort or sending more people into the opening heat.',
        addFlags: ['c8-accepted-ash-compact'],
        result:
          'You speak the public terms. The white ember divides into eight lights, each waiting outside a fort until its mortal keeper allows it across.',
        next: 'c8-compact-route',
      },
      {
        id: 'c8-choose-sacrificed-fort',
        label:
          'Evacuate First Fort and break its foundation into the buried chain.',
        detail:
          'Create one permanent gap in the ring so the other seven can hold tonight.',
        advantage:
          'Concentrate the old defence without owing devils or relying on enough willing keepers.',
        addFlags: ['c8-sacrificed-first-fort'],
        result:
          'The First Fort evacuation bell sounds. Engineers open the channels beneath its foundation. You have chosen the stone that will not survive.',
        next: 'c8-sacrifice-route',
      },
    ],
  },

  'c8-wardens-route': {
    id: 'c8-wardens-route',
    kicker: 'Mortal hands on every fire',
    title: 'Eight Keepers',
    location: 'The Fortress Ring',
    objective:
      'Make eight independent groups act together without giving the Gate one command to steal.',
    threat: 'Critical',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-deployed-all-forts',
        'c8-deployed-strongpoints',
        'c8-deployed-mobile-force',
      ],
    },
    body: (state) => [
      'The Gate listens for one grand promise. You give it none. Each fort chooses a keeper and one practical task instead.',
      'Fourth Fort holds the weakest link. Ansel knows how to defend it, but Crown officers still treat the Futureless as prisoners.',
      deploymentPressure(state),
      'If you support Ansel, the officers will obey him. If he remains free to refuse you afterward, the volunteers will trust that the choice was truly his.',
      'Eight groups watch your signal while keeping their own captains. The red gap widens to the breadth of a face. A horn sounds from the city beyond.',
    ],
    choices: [
      {
        id: 'c8-command-eight-captains',
        label:
          'Spend your authority coordinating eight captains while leaving each final order local.',
        detail:
          'Spend 2 Command to create one plan without one controlling voice.',
        advantage:
          'All eight forts act together and the Gate has no single command to twist.',
        changes: { command: -2 },
        requires: { command: 2 },
        hideIfAnyFlags: ['c8-free-command-zone'],
        addFlags: ['c8-eight-local-captains'],
        result:
          'You set timing, signals, and retreat points. Each captain chooses the people and words. The ring moves together without becoming one obedient body.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-coordinate-from-free-zone',
        label: 'Coordinate the captains from the command-free yard.',
        detail:
          'Use the protected zone created at entry so copied orders cannot leave Fourth Fort.',
        advantage:
          'Give all eight captains one timing plan without spending more Command or exposing another keeper.',
        showIfAllFlags: ['c8-free-command-zone'],
        addFlags: ['c8-free-zone-coordinated-captains'],
        result:
          'Each captain enters the gold boundary, states a local signal, and leaves with authority still their own. The Gate copies your voice, but the false order dies at the yard edge.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-lend-futureless-oathfire',
        label:
          'Lend Ansel enough Oathfire to hold Fourth Fort without making a new promise.',
        detail:
          'Spend 2 Oathfire giving strength without taking ownership of his choice.',
        advantage:
          'The weakest fort holds and the Futureless stand as free defenders.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-ansel-borrowed-oathfire'],
        result:
          'Gold fire enters Ansel’s hands without words. “Borrowed,” he says. “Returned at dawn.” He closes his own fist around it and takes the weakest fire.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-run-final-signal',
        label: 'Carry the final signal through the open heat yourself.',
        detail:
          'Lose 2 Health crossing the inner ring while every fort waits on your lamp.',
        advantage:
          'Keep authority out of the signal and prove the defence through a visible mortal act.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: ['c8-carried-final-signal'],
        result:
          'The hot wind strips skin from your knuckles. You raise the lamp at the centre. Eight fires answer because eight people choose to answer it.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-let-ansel-name-keepers',
        label:
          'Let Ansel name the keepers and accept the risk of following him.',
        detail:
          'Use the ledger or refusal test to place the defence in the hands of the captain who survived all seventeen openings.',
        advantage:
          'Use local knowledge no outside commander possesses and restore Ansel’s public honour.',
        showIfAnyFlags: [
          'c8-complete-futureless-ledger',
          'c8-futureless-choice-proven',
        ],
        addFlags: ['c8-ansel-named-keepers'],
        result:
          'Ansel names people by the promises they still own. The pattern makes sense only after he speaks it. Every selected keeper steps forward without being ordered.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-compact-route': {
    id: 'c8-compact-route',
    kicker: 'Help with exact edges',
    title: 'The White Fire Contract',
    location: 'The Black Gate Inner Ring',
    objective: 'Set the limit of the Compact’s aid before accepting its fire.',
    threat: 'Critical',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-heard-public-ash-terms',
        'c8-tested-ash-terms',
        'c8-delayed-ash-answer',
        'c8-living-seed-weakened',
        'c8-living-seed-spent',
      ],
    },
    body: (state) => [
      'Eight white embers repeat the price: one peaceful embassy may enter after the Gate is stable, speak before witnesses, and leave under the same rules.',
      'Mortal names would make breaches easier to punish, but give the Compact a lasting hold on everyone listed.',
      'Public witnesses can guarantee the agreement. You can instead cut every mortal name or offer Vaor’s outer flame until the embassy leaves.',
      'The outer flame is usable heat, not Vaor’s mind. While it is held, you cannot call dragonfire. A broken agreement may extinguish that heat and burn him when he rekindles it.',
      vaorGateUse(state),
      ashPreparationPressure(state),
      seedContractConstraint(state),
    ],
    choices: [
      {
        id: 'c8-public-compact-no-names',
        label:
          'Accept only the spoken public terms and refuse every written mortal name.',
        detail:
          'The agreement will be harder to enforce against either side after tonight.',
        advantage:
          'Gain the white fire without giving the Compact a private claim on any defender.',
        addFlags: ['c8-compact-public-only'],
        result:
          'The Compact accepts witnesses in place of names. White fire enters each fort only after its keeper says yes.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-cut-names-with-resolve',
        label: 'Hold the contract in your mind and cut out every mortal name.',
        detail:
          'Spend 2 Resolve resisting a document that rewrites itself while you read.',
        advantage:
          'Create a clear agreement that can punish broken actions, never claim individual souls.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        hideIfAnyFlags: ['c8-tested-ash-terms'],
        addFlags: ['c8-compact-binds-actions'],
        result:
          'The letters crawl toward the people behind you. You force each line back to a place, action, or hour. When the contract closes, it knows no mortal name.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-use-tested-name-limit',
        label: 'Apply the name limit already exposed by your Oath test.',
        detail:
          'Use the earlier Oathfire test to hold the contract to actions, places, and hours.',
        advantage:
          'Create an enforceable agreement without spending more Resolve or letting it claim a person.',
        showIfAllFlags: ['c8-tested-ash-terms'],
        addFlags: ['c8-compact-binds-actions'],
        result:
          'The tested edge holds. Every crawling name falls away, leaving only actions, places, and the release hour the witnesses heard.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-ember-collateral',
        label:
          'Ask Vaor to let the Compact hold his outer flame until the embassy leaves.',
        detail:
          'Vaor may refuse. Agreement puts part of his gift inside a foreign contract.',
        advantage:
          'Keep every mortal outside the contract while making betrayal costly to both sides.',
        showIfAnyFlags: ['c5-freed-vaor'],
        addFlags: ['c8-ember-held-as-collateral'],
        result:
          'Vaor demands the release hour twice, then agrees. White fire circles his outer flame without taking it. The contract cannot reach any mortal defender.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-force-stolen-ember-collateral',
        label: 'Force the stolen ember into the Compact’s keeping.',
        detail:
          'Spend 2 Resolve against Vaor’s resistance. The contract will record that the flame was not freely given.',
        advantage:
          'Keep every mortal outside the contract, but create a claim Vaor may later challenge.',
        showIfAnyFlags: ['c5-took-ember-by-force'],
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: [
          'c8-ember-held-as-collateral',
          'c8-forced-vaor-contract-use',
        ],
        result:
          'Vaor fights the transfer. You force his outer flame beneath the white ring. The contract cannot reach a mortal defender, but it records the dragon’s refusal beside your name.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-share-pact-ember-collateral',
        label:
          'Ask Vaor to place the pact’s outer flame under the public contract.',
        detail:
          'Either bearer may refuse. Agreement ends when the embassy leaves under the same rules.',
        advantage:
          'Keep every mortal outside the contract while preserving the pact’s consent.',
        showIfAnyFlags: ['c5-vaor-pact'],
        addFlags: [
          'c8-ember-held-as-collateral',
          'c8-vaor-approved-contract-use',
        ],
        result:
          'You state the release condition. Vaor agrees, and white fire circles the pact’s outer flame. The contract cannot reach any mortal defender and must release the flame when the embassy leaves.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-sacrifice-route': {
    id: 'c8-sacrifice-route',
    kicker: 'One wall for seven',
    title: 'The Fall of First Fort',
    location: 'First Fort Evacuation Road',
    objective: 'Choose what leaves First Fort before its foundation collapses.',
    threat: 'Critical',
    art: 'futureless',
    body: () => [
      'Mara’s temporary aid station still holds wounded soldiers in First Fort. Its dry lower room holds furnace fuel and the complete copy Ansel sent out with Pell’s warning. The narrow evacuation bridge can carry people or records before the foundation falls, not both without help.',
      'The Gate widens another finger. Red light enters the fort windows. Every heartbeat spent here gives the other side more road.',
      'You feel the lost fort through the stones before it falls. You chose the sacrifice. You still decide what the sacrifice means.',
    ],
    choices: [
      {
        id: 'c8-command-full-evacuation',
        label:
          'Spend authority on a timed chain that carries wounded people and records together.',
        detail:
          'Spend 2 Command coordinating a narrow evacuation with no room for panic.',
        advantage:
          'Save every person and the duplicate Crown evidence before the fort falls.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-first-fort-fully-evacuated'],
        result:
          'Stretchers move between shield teams while records travel inside empty fuel drums. The last soldier clears the bridge as the first foundation stone drops.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-carry-wounded-from-fort',
        label: 'Carry the last wounded warden with Pell’s sealed packet.',
        detail:
          'Lose 2 Health saving a person and the compact duplicate while the fuel and other records burn.',
        advantage:
          'No living person becomes part of the fort’s price, and one physical copy of the Crown record survives.',
        changes: { health: -2 },
        requires: { health: 1 },
        addFlags: [
          'c8-saved-first-fort-wounded',
          'c8-saved-pell-packet',
          'c8-lost-fort-fuel',
        ],
        result:
          'Stone falls behind each step. You carry the final warden across your shoulders with Pell’s packet under one arm. The fuel drums and loose copies burn in the lower room.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-oath-memory-of-fort',
        label:
          'Bind the fort’s records into its signal bell before the walls fall.',
        detail:
          'Spend 2 Oathfire preserving proof as a memory any witness can hear.',
        advantage:
          'Save the wounded and turn the lost fort into evidence that cannot be quietly stolen.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-first-fort-became-witness'],
        result:
          'The bell rings once as the fort collapses. Every person in the ring hears seventeen opening dates and seventeen hidden Crown replies inside the note.',
        next: 'c8-collector-crossing',
      },
      {
        id: 'c8-save-people-abandon-proof',
        label: 'Evacuate every living person and leave all records behind.',
        detail:
          'Give Malrec room to deny the past so nobody dies protecting paper.',
        advantage:
          'Complete the fastest evacuation and close the ring before the Gate widens again.',
        addFlags: ['c8-first-fort-people-first', 'c8-lost-duplicate-records'],
        result:
          'You do not ask anyone to die for a ledger. The last stretcher clears the bridge. First Fort folds into the buried chain with its records inside.',
        next: 'c8-collector-crossing',
      },
    ],
  },

  'c8-collector-crossing': {
    id: 'c8-collector-crossing',
    kicker: 'The bargain comes to collect',
    title: 'One Arm Through the Gate',
    location: 'The Black Gate Inner Ring',
    objective: 'Stop a rival devil house from taking the Futureless contracts.',
    threat: 'Critical',
    art: 'futureless',
    activeConsequences: {
      complications: [
        'c8-united-wardens',
        'c8-depleted-mortal-defense',
        'c8-accepted-ash-compact',
        'c8-sacrificed-first-fort',
        'c8-eight-local-captains',
        'c8-ansel-borrowed-oathfire',
        'c8-carried-final-signal',
        'c8-ansel-named-keepers',
        'c8-free-zone-coordinated-captains',
        'c8-compact-public-only',
        'c8-compact-binds-actions',
        'c8-ember-held-as-collateral',
        'c8-oath-pell-sees-opening-contained',
      ],
    },
    body: (state) => [
      routeOutcome(state),
      'A long arm enters through the gap. It wears six brass rings and a black glove stitched with the names of Fourth Fort’s soldiers. No army follows. The collector needs only to touch the contracts and pull every sold promise into the Gate at once.',
      'Ansel tries to burn the papers. The black ink crawls away from the flame and toward the reaching fingers.',
      'You feel the collector searching through every promise around you. It pauses at your Oaths as if recognising a scent. Then it changes direction and reaches for your chest.',
      ...(has(state, 'c8-oath-pell-sees-opening-contained')
        ? [
            'The strand holding Pell alive brightens toward Fourth Fort. The collector follows it. Ansel cannot leave Pell’s side to invoke the contract limit; this claim must be stopped before it reaches them.',
          ]
        : []),
      collectorBarrier(state),
    ],
    choices: [
      {
        id: 'c8-cut-collector-hand',
        label:
          'Enter the furnace wind and cut the collector’s hand from the contracts.',
        detail: 'Lose 2 Health reaching the arm before it touches your Oaths.',
        advantage:
          'Drive the collector back and keep every Futureless contract on the mortal side.',
        changes: { health: -2 },
        requires: { health: 1 },
        hideIfAnyFlags: ['c8-found-contract-source'],
        addFlags: ['c8-severed-collector-hand'],
        result:
          'The glove closes around the heat above your heart. Your sword reaches the wrist first. The severed hand becomes ash, leaving one brass ring in the snow.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-cut-collector-source',
        label: 'Cut the buried source line you found beneath the contracts.',
        detail:
          'Use the Oathfire trace earned in Fourth Fort to sever the collector from its mortal anchor.',
        advantage:
          'Repel the arm without spending another resource and preserve its cracked house seal as evidence.',
        showIfAllFlags: ['c8-found-contract-source'],
        addFlags: ['c8-cut-collector-source-line'],
        result:
          'The black line is visible now. You drive your sword through it instead of the reaching arm. The collector loses its grip and leaves a cracked brass house seal in the snow.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-command-contract-shield',
        label: 'Build a moving shield line around Ansel and the contracts.',
        detail:
          'Spend 2 Command coordinating soldiers whose names the collector can call aloud.',
        advantage:
          'Protect the wardens while capturing the glove and its written list as evidence.',
        changes: { command: -2 },
        requires: { command: 2 },
        addFlags: ['c8-captured-collector-glove'],
        result:
          'Shields turn whenever the glove reaches. The collector calls names, but the soldiers answer one another instead. Mara pins the empty glove beneath her shield as the arm withdraws.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-oath-names-belong-to-living',
        label:
          'Swear that no name in the yard belongs to a contract before it belongs to its living bearer.',
        detail:
          'Spend 2 Oathfire forcing the collector to face every person as a choice, not property.',
        advantage:
          'Break its hold on the Futureless names and preserve the contracts as proof.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-freed-futureless-names'],
        result:
          'Gold fire removes each name from the black glove and returns it to the person who speaks it. The collector recoils from eighty separate choices.',
        next: 'c8-oath-ledger',
      },
      {
        id: 'c8-let-ansel-refuse-collection',
        label: 'Let Ansel refuse the collector’s demand for another payment.',
        detail:
          'Use the complete ledger or refusal test to prove the limit while the collector is close enough to kill him.',
        advantage:
          'Repel the claim without spending your strength and prove the Futureless never owed more than the named promise.',
        showIfAnyFlags: [
          'c8-complete-futureless-ledger',
          'c8-futureless-choice-proven',
        ],
        hideIfAnyFlags: ['c8-oath-pell-sees-opening-contained'],
        addFlags: ['c8-ansel-refused-second-price'],
        result:
          'Ansel steps between the hand and the papers. “One named promise. Nothing more.” The brass rings crack. The collector jerks backward, beaten by the limit it wrote itself.',
        next: 'c8-oath-ledger',
      },
    ],
  },

  'c8-oath-ledger': {
    id: 'c8-oath-ledger',
    kicker: 'Every promise at once',
    title: 'What You Cannot Keep for Free',
    location: 'The Black Gate Threshold',
    objective:
      'Keep the defence intact when the Gate pulls on every active Oath you carry.',
    threat: 'Critical',
    art: 'embassy',
    activeConsequences: {
      reactions: [
        'c8-mara-knows-home-desire',
        'c8-mara-western-commander',
        'c8-mara-knows-fear',
        'c8-lysara-knows-road-desire',
        'c8-lysara-equal-lockkeeper',
        'c8-lysara-knows-loyalty-fear',
        'c8-named-home-desire',
        'c8-named-chosen-duty',
        'c8-named-truth-desire',
      ],
    },
    lesson: {
      title: 'The visible Oath ledger',
      body: 'The Gate is pulling every active Oath at once. Four physical objects can break that pull: Caelan’s old inn key, his Crown badge, his Warden whistle, or a companion’s offered hand. Each object represents a different part of his future. Whichever one he uses will be placed at risk.',
    },
    body: (state) => [
      'The eight fires hold the gap at one person wide. Then the Gate changes its attack.',
      'Every Oath inside you pulls in a different direction. Greyhaven drags west. Vaor’s ember burns north. The steppe alliance holds behind you. The people at the threshold need you here.',
      steppeOathLedger(state),
      'Your father’s old inn key hangs beside your cracked Crown badge and Warden whistle. The key holds the hope of an unchanged homecoming. The badge carries service to Asterra. The whistle binds you to answer every Warden call.',
      personalWatchConfrontation(state),
      `${endangeredCompanion(state)} steps close enough to share one strand if you ask. The Gate forces a price onto a key, a badge, a whistle, or a willing person.`,
    ],
    choices: [
      {
        id: 'c8-surrender-homecoming',
        label:
          'Place your father’s inn key in the Gate and surrender your old homecoming.',
        detail:
          'Give up the private future in which this ends and your former life returns unchanged.',
        advantage:
          'All active duties remain intact and the Gate can no longer pull them in opposite directions.',
        addFlags: ['c8-surrendered-homecoming'],
        result:
          'You press the worn key into the red gap. It melts without heat. The old picture of home goes with it: the same rooms, the same uniform, the same person you were before the road changed. The grief is real. So is the freedom that follows it.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-release-crown-oath',
        label: 'Release your oldest Oath of service to Asterra.',
        detail:
          'Spend 2 Resolve surviving the backlash. Crown law will call you an oathbreaker.',
        advantage:
          'Keep your chosen future and every promise made freely during this journey.',
        changes: { resolve: -2 },
        requires: { resolve: 2 },
        addFlags: ['c8-released-crown-oath'],
        result:
          'You say the release clearly. The silver tree on your old badge splits. Pain crosses your chest, but the Crown can no longer pull your duty against the people before you.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-burn-lesser-oath',
        label: 'Burn the Warden promise tied to your old patrol whistle.',
        detail:
          'Spend 2 Oathfire ending the duty to answer every Warden call, no matter who sounds it.',
        advantage:
          'Preserve your personal future and the great Oaths protecting people now.',
        changes: { oathfire: -2 },
        requires: { oathfire: 2 },
        addFlags: ['c8-burned-lesser-oath'],
        result:
          'You place the brass whistle inside Vaor’s ember. It burns without sound. You may still answer any call you choose, but no magic can drag you toward all of them. The Gate closes one finger width around the freedom it failed to take.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-mara',
        label: 'Ask Mara to carry one Oath beside you.',
        detail:
          'Mara freely takes part of the burden and receives a mark the Gate may find again.',
        advantage:
          'Keep every promise and your personal future at the cost of exposing Mara to the Gate.',
        showIfRelationshipIntents: { mara: ['exploring', 'committed'] },
        addFlags: ['c8-shared-oath-mara'],
        result:
          'You ask Mara by name. She says yes before taking your hand. One strand of gold fire crosses into her palm, where a black mark remains. The Gate releases you and learns how to find her.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-lysara',
        label: 'Ask Lysara to carry one Oath beside you.',
        detail:
          'Lysara freely takes part of the burden and receives a mark the Gate may find again.',
        advantage:
          'Keep every promise and your personal future at the cost of exposing Lysara to the Gate.',
        showIfRelationshipIntents: { lysara: ['exploring', 'committed'] },
        addFlags: ['c8-shared-oath-lysara'],
        result:
          'You ask Lysara by name. She weighs the danger, then says yes and takes your hand. One strand of gold fire crosses into her palm, where a black mark remains. The Gate releases you and learns how to find her.',
        next: 'c8-embassy-terms',
      },
      {
        id: 'c8-share-oath-korran',
        label: 'Ask Korran to carry one Oath beside you.',
        detail:
          'Korran freely takes part of the burden and receives a mark the Gate may find again.',
        advantage:
          'Keep every promise and your personal future at the cost of exposing Korran to the Gate.',
        showIfRelationshipIntents: {
          mara: ['unresolved', 'interested', 'platonic', 'ended'],
          lysara: ['unresolved', 'interested', 'platonic', 'ended'],
        },
        addFlags: ['c8-shared-oath-korran'],
        result:
          'You ask Korran by name. He studies the Gate, then grips your hand by choice. One strand of gold fire crosses into his palm, where a black mark remains. The Gate releases you and learns how to find him.',
        next: 'c8-embassy-terms',
      },
    ],
  },

  'c8-embassy-terms': {
    id: 'c8-embassy-terms',
    kicker: 'The first open crossing',
    title: 'Vexa Ash',
    location: 'The Black Gate Threshold',
    objective: 'Decide whether the first public devil embassy enters Edrath.',
    threat: 'Immediate',
    art: 'embassy',
    activeConsequences: {
      reactions: [
        'c8-severed-collector-hand',
        'c8-captured-collector-glove',
        'c8-freed-futureless-names',
        'c8-ansel-refused-second-price',
        'c8-cut-collector-source-line',
        'c8-preserved-original-ledgers',
        'c8-linked-malrec-to-gate-record',
        'c8-living-copy-of-openings',
        'c8-many-witnessed-openings',
        'c8-gate-forgery-exposed',
        'c8-saved-pell-packet',
        'c8-surrendered-homecoming',
        'c8-released-crown-oath',
        'c8-burned-lesser-oath',
        'c8-shared-oath-mara',
        'c8-shared-oath-lysara',
        'c8-shared-oath-korran',
        'c8-first-fort-fully-evacuated',
        'c8-saved-first-fort-wounded',
        'c8-lost-fort-fuel',
        'c8-first-fort-became-witness',
        'c8-first-fort-people-first',
        'c8-lost-duplicate-records',
        'c8-ember-held-as-collateral',
        'c8-forced-vaor-contract-use',
        'c8-vaor-approved-contract-use',
      ],
    },
    introducesStoryTerms: ['Vexa Ash'],
    body: (state) => [
      'The hostile opening narrows to one person’s width. No army crossed.',
      ...pellOathOutcome(state),
      'A white ember holds the gap for one envoy without widening it.',
      'A horned woman in red ceremonial armour carries a white lantern. Weapons behind her remain sealed inside brass cases.',
      vexaGreeting(state),
      collectorConsequenceAtEmbassy(state),
      evidenceReactionAtEmbassy(state),
      oathPriceAtEmbassy(state),
      ...firstFortStatusAtEmbassy(state),
      ...outerFlameStatus(state),
      '“Someone in my world prepared a claim on Caelan Vey before his first Oath. Its price and his agreement are blank. It owns nothing yet.”',
    ],
    choices: [
      {
        id: 'c8-receive-vexa-publicly',
        label: 'Receive Vexa and her embassy before every witness.',
        detail:
          'Allow the crossing under a public agreement, with all gathered forces watching and every weapon sealed.',
        advantage:
          'Begin diplomacy without secrecy and force Vexa’s warning into the public record.',
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-entered-publicly'],
        result:
          'You lower your sword first. Vexa crosses beneath the white lantern, and every witness sees exactly who welcomed her and what she carried.',
        next: 'c8-ending-embassy',
      },
      {
        id: 'c8-hear-vexa-at-threshold',
        label:
          'Keep the embassy beyond the Gate and hear Vexa at the threshold.',
        detail:
          'Grant speech and safe return, but no entry into the mortal fortress ring tonight.',
        advantage:
          'Learn the warning while preserving a clear physical boundary until trust is tested.',
        hideIfAnyFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-held-at-threshold'],
        result:
          'You approach alone until one step separates snow from ash. Vexa accepts the boundary and sets her sealed cases beside the threshold without crossing it.',
        next: 'c8-ending-threshold',
      },
      {
        id: 'c8-receive-vexa-outer-fort',
        label: 'Honour the agreement inside an isolated outer fort.',
        detail:
          'Allow the peaceful embassy to enter and leave, but receive it away from the wounded and the lock rooms.',
        advantage:
          'Keep your exact promise while limiting what the envoys can reach or study.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-vexa-received-outer-fort'],
        result:
          'You open a controlled road to empty Second Fort. Vexa and two sealed envoys enter the isolated yard beneath raised bows without approaching the wounded or lock rooms.',
        next: 'c8-ending-threshold',
      },
      {
        id: 'c8-give-ansel-first-question',
        label: 'Let Ansel ask the first question on behalf of the Futureless.',
        detail:
          'Keep Vexa outside for now and place the harmed wardens at the centre of the meeting.',
        advantage:
          'The embassy must face the people already used by devil bargains before negotiating with rulers.',
        hideIfAnyFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-ansel-spoke-first'],
        result:
          'Ansel lowers his crossbow and asks which house bought his daughter’s future promise. Vexa remains beyond the threshold and gives the question her full attention.',
        next: 'c8-ending-witness',
      },
      {
        id: 'c8-give-ansel-first-question-after-entry',
        label:
          'Honour the entry agreement, then let Ansel ask the first question.',
        detail:
          'Bring the sealed embassy into the outer yard and place the harmed wardens at the centre of the meeting.',
        advantage:
          'Keep your exact promise while making the embassy answer the Futureless before negotiating with rulers.',
        showIfAllFlags: ['c8-accepted-ash-compact'],
        changes: { wayfire: 2 },
        addFlags: ['c8-ansel-spoke-first', 'c8-ansel-spoke-first-after-entry'],
        result:
          'Vexa and two sealed envoys cross into Second Fort’s isolated yard. Ansel asks which house bought his daughter’s future promise, and the embassy must answer him before any ruler.',
        next: 'c8-ending-witness',
      },
    ],
  },

  'c8-ending-embassy': {
    id: 'c8-ending-embassy',
    kicker: 'Chapter Eight complete',
    title: 'The Door Kept Open',
    location: 'Fourth Fort Embassy Hall',
    objective:
      'The Crown abandonment is exposed; identify who prepared Caelan’s unfinished claim.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    nextChapter: 'c9-embassy-watch',
    body: (state) => [
      'Vexa’s embassy moves from the public crossing to Fourth Fort’s hall. Soldiers keep their weapons, the envoys keep theirs sealed, and every chair faces the brass cases.',
      routeOutcome(state),
      survivingCrownEvidence(state),
      'Vexa keeps her seventeen devil contracts apart from the mortal evidence. Their seals belong to different rulers and houses, but one hand appears on both sides of the Gate.',
      'The final page carries your full name and predates your first command. Its price and your agreement are blank, so it owns nothing. The forts’ abandonment is answered. The author of this unfinished claim is the next mystery.',
    ],
    choices: [],
  },

  'c8-ending-threshold': {
    id: 'c8-ending-threshold',
    kicker: 'Chapter Eight complete',
    title: 'The Boundary You Chose',
    location: 'The Black Gate Fortress Ring',
    objective:
      'The Crown abandonment is exposed; identify who prepared Caelan’s unfinished claim.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    nextChapter: 'c9-embassy-watch',
    body: (state) => [
      vexaMeetingStatus(state),
      routeOutcome(state),
      survivingCrownEvidence(state),
      has(state, 'c8-vexa-received-outer-fort')
        ? 'Inside Second Fort, Vexa opens one brass case. Her copies record bargains from the hidden openings and remain separate from the surviving Crown evidence.'
        : 'Without crossing, Vexa opens one brass case. Her copies record bargains from the hidden openings and remain separate from the surviving Crown evidence.',
      'One unfinished page bears your name, but no price or agreement. It owns nothing. The forts’ abandonment is answered; who prepared this claim, and what price they learned to offer, becomes the next mystery.',
    ],
    choices: [],
  },

  'c8-ending-witness': {
    id: 'c8-ending-witness',
    kicker: 'Chapter Eight complete',
    title: 'The Promise Not Yet Sold',
    location: 'The Black Gate Fortress Ring',
    objective:
      'The Crown abandonment is exposed; identify who prepared Caelan’s unfinished claim.',
    threat: 'Immediate',
    art: 'embassy',
    final: true,
    nextChapter: 'c9-embassy-watch',
    body: (state) => [
      vexaMeetingStatus(state),
      'Ansel stands between two worlds and asks the question rulers avoided for seventeen years. Vexa answers him before she answers you. The house that bought the wardens’ future promises also paid mortal officials to hide every opening.',
      routeOutcome(state),
      survivingCrownEvidence(state),
      'Only after the Futureless hear the truth does Vexa present a separate draft bearing your name. Its price and your agreement remain blank, so it owns nothing.',
      'The Crown’s reason for abandoning the forts is answered. The next question is who prepared your unfinished claim and which future that author learned to threaten.',
    ],
    choices: [],
  },
};
