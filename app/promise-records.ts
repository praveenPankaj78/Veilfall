import type { GameState } from './game-data';

export type PromiseStatus =
  | 'sworn'
  | 'fulfilled'
  | 'released'
  | 'destroyed'
  | 'breached'
  | 'continued'
  | 'unknown';

export type PromiseRecord = {
  id: string;
  promise: string;
  beneficiary: string;
  scope: string;
  benefit: string;
  endingConditions: string;
  status: PromiseStatus;
  current: boolean;
  uncertain: boolean;
};

export type InjuryRecord = {
  id: string;
  summary: string;
};

function has(game: GameState, flag: string) {
  return game.flags.includes(flag);
}

function hasAny(game: GameState, flags: string[]) {
  return flags.some((flag) => has(game, flag));
}

function gateLawChosen(game: GameState) {
  return hasAny(game, [
    'c12-gate-sealed',
    'c12-gate-consent-passage',
    'c12-gate-broken',
    'c12-gatekeeper',
  ]);
}

function record(entry: PromiseRecord): PromiseRecord {
  return entry;
}

export function derivePromiseRecords(game: GameState): PromiseRecord[] {
  const records: PromiseRecord[] = [];
  const homecomingSworn = has(game, 'oath-bring-them-home');
  const safeArrivalSworn = has(game, 'oath-safe-arrival');

  if (safeArrivalSworn) {
    records.push(
      record({
        id: 'oath-safe-arrival',
        promise: 'Every living traveller will reach shelter.',
        beneficiary: 'The Greyhaven escort',
        scope: 'The journey from Eastwatch to the first safe shelter.',
        benefit: 'Oathfire and awareness of people placed in immediate danger.',
        endingConditions:
          'Ends if incorporated into the later homecoming vow, or if the original shelter duty is completed.',
        status: homecomingSworn ? 'continued' : 'sworn',
        current: !homecomingSworn,
        uncertain: false,
      }),
    );
  }

  if (homecomingSworn) {
    records.push(
      record({
        id: 'oath-bring-them-home',
        promise: has(game, 'c11-shelter-all-crossed-dry')
          ? safeArrivalSworn
            ? 'Bring the escort home alive, incorporating the earlier safe-arrival vow. This duty was renewed for the Vathis expedition during the owned rain; that named freedom ended when every traveller reached the far arch.'
            : 'Bring the escort home alive. This duty was renewed for the Vathis expedition during the owned rain; that named freedom ended when every traveller reached the far arch.'
          : safeArrivalSworn
            ? 'Bring the escort home alive, incorporating the earlier safe-arrival vow.'
            : 'Bring the escort home alive.',
        beneficiary: 'The Greyhaven escort and later companions bound by that same homecoming duty',
        scope:
          'Survivors of the original escort. Later uses may teach a witnessed route; they do not add new travellers as owed beneficiaries.',
        benefit: 'Oathfire and a magical path toward safety.',
        endingConditions: has(game, 'c11-shelter-all-crossed-dry')
          ? 'The original homecoming duty remains. The rain-crossing renewal ended when all exited; it added no later restriction and no new Gate power.'
          : 'Remains a personal duty. It supplies no new Gate power and binds no new traveller.',
        status: 'sworn',
        current: true,
        uncertain: false,
      }),
    );
  }

  if (homecomingSworn && has(game, 'c11-shelter-all-crossed-dry')) {
    records.push(
      record({
        id: 'c11-homecoming-rain-renewal',
        promise:
          'Renewed Bring Them Home so this expedition exited the owned rain together, giving up the right to leave first until the last traveller crossed.',
        beneficiary: 'The expedition that crossed the Purchased Weather Court',
        scope:
          'Duration: the rain. Success: all exit. Breach: leave first. No later restriction. This did not add travellers to the original homecoming vow.',
        benefit: 'Dry passage for every member through the owned roof.',
        endingConditions:
          'Ended when the last traveller reached the far arch.',
        status: 'fulfilled',
        current: false,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c2-oath-repair-road')) {
    records.push(
      record({
        id: 'c2-oath-repair-road',
        promise: 'Repair the damaged King’s Road.',
        beneficiary: 'Travellers who still use the King’s Road',
        scope: 'The road pin and the folded King’s Road around Bellweather.',
        benefit: 'Oathfire spent to hold or repair the road.',
        endingConditions:
          'No later authored scene records fulfillment, release, or breach.',
        status: 'unknown',
        current: true,
        uncertain: true,
      }),
    );
  }

  if (has(game, 'c2-oath-expose-crown')) {
    records.push(
      record({
        id: 'c2-oath-expose-crown',
        promise: 'Expose the Crown officer behind the attack.',
        beneficiary: 'The escort and the people harmed at Bellweather',
        scope: 'The Crown plot that paid for the Bellweather attack.',
        benefit: 'A binding duty that can later support proof against Ordan.',
        endingConditions:
          'No later authored scene records that this vow ended after Ordan’s exposure.',
        status: 'unknown',
        current: true,
        uncertain: true,
      }),
    );
  }

  if (has(game, 'c3-oath-hold-town')) {
    const localDutyEnded = game.chapter > 4;
    records.push(
      record({
        id: 'c3-oath-hold-town',
        promise: 'Do not let Harrowfen fall while Ordan is pursued.',
        beneficiary: 'Harrowfen',
        scope: 'The town’s survival during the pursuit of Ordan.',
        benefit: 'Oathfire that holds the town while the chase continues.',
        endingConditions:
          'The authored duty ends when the pursuit leaves Harrowfen’s immediate defence.',
        status: localDutyEnded ? 'fulfilled' : 'sworn',
        current: !localDutyEnded,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c4-oath-no-one-falls')) {
    const localDutyEnded = game.chapter > 4;
    records.push(
      record({
        id: 'c4-oath-no-one-falls',
        promise: 'Do not let anyone fall from the Mileless Bridge while you stand.',
        beneficiary: 'People on the Mileless Bridge with Caelan',
        scope: 'The crossing of the Mileless Bridge.',
        benefit: 'Oathfire used to hold people on the moving spans.',
        endingConditions:
          'The authored duty ends when the bridge crossing is complete. It grants no new Gate magic.',
        status: localDutyEnded ? 'fulfilled' : 'sworn',
        current: !localDutyEnded,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c4-oath-honest-with-mara')) {
    records.push(
      record({
        id: 'c4-oath-honest-with-mara',
        promise: 'Do not hide behind duty when speaking with Mara.',
        beneficiary: 'Mara Renn',
        scope: 'Honest speech with Mara about duty and desire.',
        benefit: 'A personal restriction, not a new combat power.',
        endingConditions:
          'No later authored scene records that this vow was released or destroyed.',
        status: 'unknown',
        current: true,
        uncertain: true,
      }),
    );
  }

  if (has(game, 'c5-oath-carry-vaor-grief')) {
    records.push(
      record({
        id: 'c5-oath-carry-vaor-grief',
        promise: 'Hear Vaor’s grief without turning away.',
        beneficiary: 'Vaor',
        scope: 'Witnessing the dragon’s remembered loss.',
        benefit: 'Permission to carry grief without owning Vaor.',
        endingConditions:
          'No separate completion flag exists beyond later Vaor pacts or refusals.',
        status: has(game, 'c5-vaor-pact') ? 'continued' : 'unknown',
        current: !has(game, 'c5-vaor-pact'),
        uncertain: !has(game, 'c5-vaor-pact'),
      }),
    );
  }

  if (has(game, 'c5-vaor-pact')) {
    records.push(
      record({
        id: 'c5-vaor-pact',
        promise:
          'Carry Vaor’s voice and ember until both of you agree the duty is complete.',
        beneficiary: 'Vaor and Caelan together',
        scope: 'The ember, Vaor’s voice, and uses both living wills permit.',
        benefit: 'A willing ember that can test truth when Vaor consents.',
        endingConditions:
          'Ends only when both Caelan and Vaor agree the duty is complete. Force, theft, or later refusal can break permission without completing the pact.',
        status: hasAny(game, [
          'c5-took-ember-by-force',
          'c9-forced-collateral-broken',
          'c9-stolen-ember-not-used',
        ])
          ? 'breached'
          : has(game, 'c9-vaor-collateral-released')
            ? 'released'
            : 'sworn',
        current: !(
          hasAny(game, [
            'c5-took-ember-by-force',
            'c9-forced-collateral-broken',
            'c9-stolen-ember-not-used',
            'c9-vaor-collateral-released',
          ])
        ),
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c6-oath-investigate-unsea')) {
    const destroyed = has(game, 'c9-destroyed-unsea-investigation-oath');
    records.push(
      record({
        id: 'c6-oath-investigate-unsea',
        promise: 'Discover which ancestor voices are truly conscious.',
        beneficiary: 'The living clans and the ancestor voices under investigation',
        scope: 'Investigation of Unsea / ancestor consciousness. No new Gate identity claim.',
        benefit: 'Oathfire tied to honest investigation.',
        endingConditions: 'Destroyed if that Chapter IX oath is spent as destruction.',
        status: destroyed ? 'destroyed' : 'sworn',
        current: !destroyed,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c6-oath-recognised-red-moot')) {
    const destroyed = has(game, 'c9-destroyed-red-moot-authority-oath');
    records.push(
      record({
        id: 'c6-oath-recognised-red-moot',
        promise:
          'Recognise the Red Moot’s living authority in every alliance you lead.',
        beneficiary: 'The Red Moot and participating fighters',
        scope: 'Alliances Caelan leads. It does not appoint a speaker for the Moot.',
        benefit: 'Recognised Moot authority in later hearings.',
        endingConditions: 'Destroyed if that Chapter IX oath is spent as destruction.',
        status: destroyed ? 'destroyed' : 'sworn',
        current: !destroyed,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c6-oath-crown-restitution')) {
    const destroyed = has(game, 'c9-destroyed-crown-restitution-oath');
    const released = has(game, 'c8-released-crown-oath');
    records.push(
      record({
        id: 'c6-oath-crown-restitution',
        promise:
          'Bring the Concord’s hidden victims before the Queen or oppose the throne that buries them.',
        beneficiary: 'Hidden victims of the Concord',
        scope: 'Restitution or opposition; it does not own those communities.',
        benefit: 'A claim line the harmed communities can control.',
        endingConditions:
          'Released if the Crown service Oath is given up. Destroyed if the Chapter IX restitution oath is spent as destruction.',
        status: destroyed ? 'destroyed' : released ? 'released' : 'sworn',
        current: !destroyed && !released,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c6-oath-defends-refusal')) {
    const destroyed = has(game, 'c9-destroyed-clan-refusal-oath');
    records.push(
      record({
        id: 'c6-oath-defends-refusal',
        promise: 'Defend the clans’ right to refuse future Crown control.',
        beneficiary: 'The steppe clans who refused Crown command',
        scope: 'The right to refuse. It does not command nonparticipants.',
        benefit: 'Withdrawal and refusal protection in later laws.',
        endingConditions: 'Destroyed if that Chapter IX oath is spent as destruction.',
        status: destroyed ? 'destroyed' : 'sworn',
        current: !destroyed,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c6-oath-honest-limit')) {
    const destroyed = has(game, 'c9-destroyed-honest-command-limit-oath');
    records.push(
      record({
        id: 'c6-oath-honest-limit',
        promise:
          'Bind only your own command, testimony, and defence of the Red Moot.',
        beneficiary: 'Caelan’s own command and the Red Moot’s defence',
        scope: 'Caelan’s personal authority. It cannot be widened into general command.',
        benefit: 'A hard limit on what later Oaths may enlarge.',
        endingConditions: 'Destroyed if that Chapter IX oath is spent as destruction.',
        status: destroyed ? 'destroyed' : 'sworn',
        current: !destroyed,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c7-oath-living-command')) {
    records.push(
      record({
        id: 'c7-oath-living-command',
        promise: 'No dead officer holds lawful rank over a living soldier.',
        beneficiary: 'Living soldiers of the Crown March and allied companies',
        scope: 'Living command only. Absent armies cannot be summoned.',
        benefit: 'A request can reach units that still freely answer.',
        endingConditions:
          'No authored scene records that this vow was destroyed or fulfilled as a closed historical duty.',
        status: 'unknown',
        current: true,
        uncertain: true,
      }),
    );
  }

  if (has(game, 'c7-oath-surrender-road')) {
    records.push(
      record({
        id: 'c7-oath-surrender-road',
        promise: 'Give safe ground to every soldier who lowers a weapon.',
        beneficiary: 'Soldiers who surrender during the Red Wind Hunt',
        scope: 'Safe ground for those who lower weapons in that hunt.',
        benefit: 'Mercy without owning the surrendered host.',
        endingConditions:
          'No later authored scene records whether the field duty closed after the hunt.',
        status: 'unknown',
        current: true,
        uncertain: true,
      }),
    );
  }

  if (has(game, 'c8-oath-pell-sees-opening-contained')) {
    const fulfilled = hasAny(game, [
      'c8-severed-collector-hand',
      'c8-cut-collector-source-line',
      'c8-captured-collector-glove',
      'c8-freed-futureless-names',
    ]);
    records.push(
      record({
        id: 'c8-oath-pell-sees-opening-contained',
        promise: 'Pell will see the invasion stopped tonight.',
        beneficiary: 'Pell',
        scope:
          'Keep Pell alive through the hostile opening. The bond can be followed back to him until the collector is driven off.',
        benefit: 'Oathfire and a steady heartbeat. Ansel cannot face the later collector for Caelan.',
        endingConditions:
          'Fulfilled when Pell sees the hostile opening contained and the collector is driven back. The fire then returns.',
        status: fulfilled ? 'fulfilled' : 'sworn',
        current: !fulfilled,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c8-burned-lesser-oath')) {
    records.push(
      record({
        id: 'c8-burned-lesser-oath',
        promise: 'The lesser patrol Oath that once pulled Caelan toward a side duty.',
        beneficiary: 'The patrol that originally received that lesser vow',
        scope: 'A lesser side duty, not the Crown restitution vow.',
        benefit: 'None after it is burned. Ash creates no new power.',
        endingConditions: 'Burned at the Gate forts.',
        status: 'destroyed',
        current: false,
        uncertain: false,
      }),
    );
  }

  if (hasAny(game, ['c10-offer-method-oath', 'c10-burden-oath-withdrawn'])) {
    const withdrawn = has(game, 'c10-burden-oath-withdrawn');
    const endedAtCity = game.chapter >= 11;
    records.push(
      record({
        id: 'c10-burden-agreement',
        promise: withdrawn
          ? 'The proposed Ash Road burden agreement was withdrawn before it bound anyone.'
          : 'Carry each consenting traveller’s Ash Road burden with a private account and a free exit.',
        beneficiary: 'Each consenting Ash Road traveller',
        scope:
          'Private accounts of what touched each offer. It ends at Vathis and cannot gain Gate-wide magical scope.',
        benefit: 'A group shield only while the burden is actually bound.',
        endingConditions:
          'Withdrawn before binding, or ended at Vathis when the road’s burden terms close.',
        status: withdrawn ? 'released' : endedAtCity ? 'fulfilled' : 'sworn',
        current: !withdrawn && !endedAtCity,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c9-return-promise-owned')) {
    const fulfilled = has(game, 'c12-fragment-return-fulfilled');
    const amended = has(game, 'c12-fragment-custody-amended');
    const breached = has(game, 'c12-fragment-return-breached');
    records.push(
      record({
        id: 'c9-return-promise-owned',
        promise:
          'Return the Black Gate fragment to neutral custody after Malrec’s inside opening is stopped, unless every living Gate keeper freely agrees otherwise.',
        beneficiary: 'The neutral fragment keepers named by the bargain',
        scope:
          'The fragment and its return. Cutting name-pointing does not erase this separate duty.',
        benefit: 'Paid-for pointing limited to the stated door and return.',
        endingConditions:
          'Ends on fulfillment, agreed amendment by every required living keeper, or acknowledged breach.',
        status: fulfilled
          ? 'fulfilled'
          : amended
            ? 'released'
            : breached
              ? 'breached'
              : 'sworn',
        current: !fulfilled && !amended && !breached,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-price-court-review-owed')) {
    const held = has(game, 'c12-price-court-review-held');
    const breached = has(game, 'c12-oathscar-review');
    records.push(
      record({
        id: 'c11-price-court-review-owed',
        promise: 'Complete one public Price Court review of the new Gate law.',
        beneficiary: 'The Price Court and the public named by the auction bid',
        scope: 'One public review. It owns no realm, fragment, voice, or person.',
        benefit: 'Unnamed forces remain delayed while the review is honoured.',
        endingConditions: 'Fulfilled by completing the review, or breached by crossing without it.',
        status: held ? 'fulfilled' : breached ? 'breached' : 'sworn',
        current: !held && !breached,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-alliance-ash-compact-passage')) {
    const honoured = has(game, 'c12-compact-passage-honoured');
    const breached = has(game, 'c12-oathscar-passage');
    records.push(
      record({
        id: 'c11-alliance-ash-compact-passage',
        promise: 'Honour exactly one witnessed Ash Compact crossing after the inside opening stops.',
        beneficiary: 'Vexa’s people under the Ash Compact price',
        scope: 'One unarmed, witnessed messenger. No second traveller and no private access.',
        benefit: 'Compact cooperation along the engine corridor.',
        endingConditions: 'Honoured by the one crossing, or breached by refusing it.',
        status: honoured ? 'fulfilled' : breached ? 'breached' : 'sworn',
        current: !honoured && !breached,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-alliance-free-ledger-refusers')) {
    const held = has(game, 'c12-free-ledger-renewal-held');
    records.push(
      record({
        id: 'c11-alliance-free-ledger-refusers',
        promise:
          'Hold a renewal hearing in which each affected Free Ledger group may speak and refuse for itself.',
        beneficiary: 'Sira, Oren, Pellan, and the groups they actually represent',
        scope: 'Named participants only. No guide petition owns nonparticipants.',
        benefit: 'Named refuser support for the final consent record.',
        endingConditions: 'Fulfilled by holding the hearing. No extra debt exists if this alliance was never made.',
        status: held ? 'fulfilled' : 'sworn',
        current: !held,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-freedom-command-restricted')) {
    const breached = has(game, 'c12-oathscar-command');
    const lawChanged = gateLawChosen(game);
    records.push(
      record({
        id: 'c11-freedom-command-restricted',
        promise:
          'Give no command beyond each fighter’s accepted limit until the Gate law changes.',
        beneficiary: 'The fighters who accepted those limits',
        scope:
          'Mythic command restriction. Honouring it in the field does not end it before the Gate law changes.',
        benefit: 'Mythic Oathfire that protected the refusal square.',
        endingConditions:
          'Continues until the chosen Gate law changes it. Breach leaves a command Oathscar.',
        status: breached ? 'breached' : lawChanged ? 'fulfilled' : 'sworn',
        current: !breached && !lawChanged,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-freedom-hearing-restricted')) {
    const returned = has(game, 'c12-freedom-hearing-returned');
    const breached = has(game, 'c12-oathscar-hearing');
    records.push(
      record({
        id: 'c11-freedom-hearing-restricted',
        promise: 'Do not refuse the hidden victims’ Price Court hearing until it ends.',
        beneficiary: 'The concealed victims named by that hearing restriction',
        scope: 'That hearing only. Voluntary testimony by others creates no hidden debt.',
        benefit: 'Mythic protection that made hidden victims impossible to erase.',
        endingConditions: 'Returns when the hearing finishes, or is breached by moving on.',
        status: returned ? 'fulfilled' : breached ? 'breached' : 'sworn',
        current: !returned && !breached,
        uncertain: false,
      }),
    );
  }

  if (has(game, 'c11-freedom-door-order-restricted')) {
    const returned = has(game, 'c12-door-freedom-returned');
    const breached = has(game, 'c12-oathscar-door-order');
    const openingStopped = has(game, 'c12-opening-stopped');
    const eitherEnded = returned || openingStopped;
    records.push(
      record({
        id: 'c11-freedom-door-order-restricted',
        promise:
          'Do not cross a contracted door first until the opening stops or every willing traveller reaches a freely chosen safe side.',
        beneficiary: 'Willing travellers who still need a safe side',
        scope:
          'The original either-condition. Stopping the opening is enough. The restriction does not survive that first satisfied ending.',
        benefit: 'Mythic Oathfire that kept the retreat open.',
        endingConditions:
          'Ends when either original condition is satisfied, including stopping the opening. Crossing first before that is a breach.',
        status: breached && !eitherEnded ? 'breached' : eitherEnded ? 'fulfilled' : 'sworn',
        current: !eitherEnded && !breached,
        uncertain: false,
      }),
    );
  }

  return records;
}

export function deriveInjuryRecords(game: GameState): InjuryRecord[] {
  const injuries: InjuryRecord[] = [];
  if (has(game, 'c2-caelan-injured')) {
    injuries.push({
      id: 'c2-caelan-injured',
      summary: 'Caelan hurt his back driving the road pin into place.',
    });
  }
  if (has(game, 'c7-wounded-on-ridge') || has(game, 'c7-ally-lasting-injury')) {
    injuries.push({
      id: 'c7-ridge-injuries',
      summary: 'Ridge injuries still limit the shield pace.',
    });
  }
  if (has(game, 'c7-teren-lasting-injury')) {
    injuries.push({
      id: 'c7-teren-lasting-injury',
      summary: 'Teren cannot hold a forward brace.',
    });
  }
  return injuries;
}

export function currentPromiseRecords(game: GameState) {
  return derivePromiseRecords(game).filter((entry) => entry.current);
}

export function resolvedPromiseRecords(game: GameState) {
  return derivePromiseRecords(game).filter((entry) => !entry.current);
}

export function promiseRecordById(game: GameState, id: string) {
  return derivePromiseRecords(game).find((entry) => entry.id === id) ?? null;
}

export function currentPromiseSummaries(game: GameState) {
  return currentPromiseRecords(game).map((entry) => entry.promise);
}

export function promiseStatusLabel(status: PromiseStatus) {
  if (status === 'unknown') return 'Outcome not established';
  if (status === 'continued') return 'Continued under another promise';
  if (status === 'sworn') return 'Sworn';
  if (status === 'fulfilled') return 'Fulfilled';
  if (status === 'released') return 'Released';
  if (status === 'destroyed') return 'Destroyed';
  return 'Breached';
}

export function uncertainPromiseEntries(game: GameState) {
  return derivePromiseRecords(game).filter((entry) => entry.uncertain);
}

export function activePromises(game: GameState) {
  return currentPromiseSummaries(game);
}

export function exportPromiseInterpretation(game: GameState) {
  return derivePromiseRecords(game).map((entry) => ({
    id: entry.id,
    status: entry.status,
    current: entry.current,
    uncertain: entry.uncertain,
    promise: entry.promise,
    beneficiary: entry.beneficiary,
  }));
}

export function finalePromiseNotes(game: GameState) {
  const parts: string[] = [];
  const pell = promiseRecordById(game, 'c8-oath-pell-sees-opening-contained');
  if (pell) {
    parts.push(
      pell.status === 'fulfilled'
        ? 'Pell’s Oath that he would see the invasion stopped is fulfilled; its fire returned when the collector was driven back.'
        : 'Pell’s Oath that he would see the invasion stopped is still binding.',
    );
  }
  const renewal = promiseRecordById(game, 'c11-homecoming-rain-renewal');
  if (renewal) {
    parts.push(
      'Bring Them Home was renewed for the owned-rain crossing, and that named freedom ended when every traveller reached the far arch.',
    );
  }
  return parts.join(' ');
}
