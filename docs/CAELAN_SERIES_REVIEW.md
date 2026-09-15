# Caelan series final narrative review

Reviewed 14 September 2026. Scope: the twelve implemented chapters of **The Ember Oath**, including effective overlays, conditional scenes, menus, immediate results, lessons, journals, handoffs, replay, and terminal exports.

Release follow-up, 15 September 2026: the description selector and player-adulthood checkbox reviewed below have since been removed at the owner's request. Accepted private encounters now use the existing fuller passage. The original review below is retained as history; current regressions verify identical prose and mechanics regardless of legacy saved preferences, with explicit consent, refusal, relationship, and Oath corrections preserved. See [WEB_RELEASE_READINESS.md](WEB_RELEASE_READINESS.md).

## Verdict

The season is coherent and emotionally complete after the corrections below. Its strongest progression is playable: protect an escort, choose between injured people, confront compromised authority, decide how to treat Vaor, negotiate independent political consent, resist offers that confuse desire with acceptance, and finally write a law with limits. The four Gate laws answer that progression differently. Destination and relationship remain independent choices. Platonic and single conclusions retain the same world outcome and completion value.

The review confirmed no P0. It corrected twelve grouped P1 findings, eight grouped P2 findings, and one local P3 pattern. One subjective P2 concern remains: the concentration of legal explanation and successive hearings in the last third. This is an editorial reservation, not an unresolved continuity or completion defect.

No Chapter 13, Rook playable chapter, new ending, node ID change, choice ID change, or paid romance advantage was introduced. Earlier flags remain compatible. Corrections to obsolete finale relationship intent and the invalid post-opening door scar also apply on save load.

## Baseline and safety

The first repository command was `git status --short`. Twelve unrelated modified files were present: eleven files under `components/ui` and `hooks/use-mobile.ts`. Their original binary Git diff was saved outside the repository for comparison. None was edited, formatted, reverted, or included in a commit. No Git history operation was performed.

| Baseline command      | Observed result                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:story` | Pass: 47 reported file entries and 3,003 distinct rendered scene paragraphs. The old file count included duplicate Windows path spellings.                                 |
| `npm run check:game`  | Pass: 263 nodes; three endings in each of Chapters 1 to 11; four in Chapter 12; lethal routes in twelve chapters; 152,220 reachable choices; 15 to 18 decisions per route. |
| `npm run lint`        | Pass.                                                                                                                                                                      |
| `npm run build`       | Pass. Existing bundle-size and build-plugin notices were informational.                                                                                                    |

Authority was checked in order: series outline and character bible, world bible and map, narrative/player/revelation/systems/crossover rules, all twelve maps, runtime, then safeguards. No applicable AGENTS.md was found in the repository or its ancestors. Chapters 1 to 3 were read after `adventure-revision.ts` overlays and choice-economy changes, rather than approving retired base versions.

## Coverage and its limits

This is not a claim to have manually played 152,220 saves. The graph check exhaustively explores its existing bounded state abstraction and reports reachable **choices**, not unique complete season playthroughs. That structural coverage is combined with editorial inspection of the 263 effective nodes, their metadata and menus, conditional body/journal output, and targeted state fixtures.

Conditional inspection included every produced single flag and each character's relationship-intent boundaries. These diagnostic samples expose helper branches; impossible combinations are not treated as bugs without checking their actual route conditions. Examples of valid diagnostic-only output were deliberately left alone. Detailed and fade scenes were read together, including Vexa's explanation and Mara's and Lysara's private offers.

`scripts/series-review.mjs` extracts the actual interface transition, handoff, save-normalization, active-promise, defeat, and replay functions into an isolated in-memory save store. It adds four fresh continuous seasons and one low starting-resource boundary season. These runs retain actual resources across all eleven handoffs; they do not refill stats except through the game's own transitions. Local backtracking finds nonlethal choices. They cover 219 distinct decision nodes; the graph and chapter fixtures cover the other branches.

To reproduce the continuous route record, set `VEILFALL_SERIES_REVIEW_OUTPUT` to an output JSON path before running `npm run check:game`. The optional artifact contains every selected choice ID, chapter ending, health boundary, and finale export. It is diagnostic output, not a player save.

| Continuous run              | Vaor  | Chapter 7        | Fragment | Ash Road    | Vathis  | Gate / destination / relationship       |
| --------------------------- | ----- | ---------------- | -------- | ----------- | ------- | --------------------------------------- |
| 0, fresh                    | Free  | Chosen company   | Bargain  | Shared      | Revolt  | Seal / road / honest distance           |
| 1, fresh                    | Force | No formal allies | Bargain  | Shared      | Revolt  | Keeper / road / political truce         |
| 2, fresh, Oathfire priority | Pact  | No formal allies | Exposure | Burden Oath | Force   | Break / threshold / closure             |
| 3, fresh                    | Free  | Chosen company   | Theft    | Private     | Auction | Consent passage / fortress / friendship |
| 4, resource boundary        | Free  | Chosen company   | Bargain  | Shared      | Revolt  | Seal / road / honest distance           |

Run 0 follows these chapter endings: `ending-forward`, `c2-ending-testimony`, `c3-ending-courier`, `c4-ending-arrest`, `c5-ending-free`, `c6-ending-war`, `c7-ending-company`, `c8-ending-embassy`, `c9-ending-bargain`, `c10-ending-shared`, `c11-ending-revolt`, `c12-ending-sealed`. Run 4 starts at Health 2, Resolve 1, Command 1, Medicine 0, and Oathfire 0. Its first five chapter-end Health values are 2, 4, 6, 7, and 8. This proves a low starting-resource route, not survival from every arbitrary depleted mid-scene state.

| Additional boundary coverage            | Evidence / scenario                                                                                                                                                                                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All Vaor outcomes and later permissions | `c5-free-vaor`, `c5-take-ember-by-force`, `c5-pact-with-vaor`; existing `vaorUseFixtures` and `vaorChoiceFixtures`; new authenticated-copy test with stolen ember.                                                                                                               |
| All Chapter 7 forces                    | Graph reachability of `c7-ending-army`, `c7-ending-company`, `c7-ending-outlaw`; force qualification, separate army arrival, Teren injury, supplies, and rescue-summary fixtures. The full army is covered by chapter fixtures rather than the five continuous routes.           |
| All fragment routes                     | Bargain, admitted theft, and exposure in continuous runs and Chapter 9 walkthroughs; custody, true-name limits, original/copy/bark/witness evidence, and restitution fixtures.                                                                                                   |
| All Chapter 11 methods and rosters      | Existing walkthroughs named “shared bargain Futureless revolt”, “private admitted theft hostile Vexa Pell force”, “burden Oath exposure mixed auction”, and “Crown volunteers low resource force”.                                                                               |
| Four Gate laws and restricted freedoms  | Existing Chapter 12 walkthroughs pair revolt/bargain/seal, auction/Pell/review/hearing/consent, force/theft/command/door/break, and Crown/exposure/Mara/keeper. Added original-condition and old-save regressions.                                                               |
| Relationship boundaries                 | Four people times seven intents times three explicit ending changes: 84 combinations, each tested through actual choice application and save load. Includes committed, exploring, interested, platonic, ended, hostile, and unresolved, with attraction 99 to prove intent wins. |
| Partner-specific conclusions            | Existing Mara and Lysara inner/outer sealed-side tests and Vexa partnership/hostile-truce tests. Ilyra's absence is explicit; she offers no new finale consent. Generic distance, friendship, closure, and single choices remain complete.                                       |
| Intimacy parity                         | Existing Chapter 9 and 10 detailed/fade fixture comparisons, plus identical transitions and visible choices under both preferences on every continuous route decision. Information and consent language were also read; numerical equality alone is insufficient.                |
| Replay                                  | Every continuous run replays Chapter 4 from its actual saved starting snapshot. Later flags and snapshots disappear; the Chapter 4 starting checkpoint remains intact.                                                                                                           |
| Lethal and low-resource paths           | Existing per-chapter graph death checks and low-resource reachability, plus the continuous boundary run. Health zero remains fatal.                                                                                                                                              |

Browser inspection was attempted through the available browser tool at both localhost and 127.0.0.1 on the running development port. Both returned connection refused. No visual browser playtest is claimed. Equivalent transition, cost, journal, replay, and terminal behavior was exercised through the graph and actual-interface-function harness; layout, wrapping, and touch-target appearance remain a visual QA limitation.

## Final chapter scorecard

These are post-fix judgments. “Pass” means the reviewed material meets the contract; it does not mean every reader will prefer its prose.

| Chapter | Story clarity | Continuity | Dialogue / voice | Accessibility    | Choice agency | Consequence payoff | Pacing           |
| ------- | ------------- | ---------- | ---------------- | ---------------- | ------------- | ------------------ | ---------------- |
| 1       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 2       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 3       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 4       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 5       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 6       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 7       | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 8       | Pass          | Pass       | Pass             | Needs minor work | Pass          | Pass               | Needs minor work |
| 9       | Pass          | Pass       | Pass             | Needs minor work | Pass          | Pass               | Needs minor work |
| 10      | Pass          | Pass       | Pass             | Pass             | Pass          | Pass               | Pass             |
| 11      | Pass          | Pass       | Pass             | Needs minor work | Pass          | Pass               | Needs minor work |
| 12      | Pass          | Pass       | Pass             | Needs minor work | Pass          | Pass               | Needs minor work |

Chapter observations: 1 establishes work, roster, and danger before the impossible road. 2 gives materially different triage and road-repair outcomes. 3 earns Ordan evidence rather than equating suspicion with proof. 4 keeps Rook prepared and independent, ends his physical crossover, and answers the chase. 5 separates freedom, theft, pact, ember, and fire Nail. 6 gives Kharad and Ilyra independent authority. 7 preserves the practical difference between an army, a chosen company, and dangerous reputation. 8 turns deserted forts and sold promises into concrete defence choices. 9 keeps embassy entry, bargaining, intimacy, custody, and crossing separate. 10 teaches offer rules through a cup, a bridge, and private limits before greater stakes. 11 earns engine access and bounded Elian evidence by different methods. 12 resolves the Gate, then personal life, then sunrise without starting a second season.

## Confirmed findings, ordered by severity

### P1-01: An original ending condition became a wider restriction

Evidence: `c11-mythic-clan-refusal-retreat` ends door order when the opening stops **or** everyone reaches a safe side. `c12-door-order` required both and offered `c12-breach-door-order` after all real incoming routes had already set `c12-opening-stopped`. A player could receive an Oathscar after fulfilling the promise.

Fix: stopping the opening immediately records `c12-door-freedom-returned`. `c12-let-expedition-cross-safe-line-first` is a voluntary rear guard; `c12-move-wounded-through-open-lane` is available without a false breach. The old breach ID remains compatible but is hidden after completion. Save normalization removes only the obsolete post-opening scar, corrects its exact historical sentence, and preserves genuine pre-completion breach records. Finale export agrees. The journal also stops presenting completed command and hearing restrictions as active.

Recursive review: all mythic duration clauses, Chapter 11/12 maps, `obligationResult`, `majorConsequences`, finale export, and save application. Found and corrected the Chapter 11 map's conflicting command-duration sentence too. Prevention: original-condition, live transition, journal, export, history-migration, and non-transferred-freedom regressions; systems rulebook and continuity contract.

### P1-02: Local Oaths became reusable power outside their scope

Evidence: `c10-old-oath-price` listed the Harrowfen pursuit and Mileless Bridge duties as surviving active duties. `c12-support-law-with-no-one-falls` used the bridge Oath for magical Gate evacuation. `c12-support-law-with-road-communities` and `c12-support-law-with-homecoming` widened earlier authority or beneficiaries. `c11-test-mythic-shelter-transfer` extended the original escort duty to a different expedition without naming renewal. The active-promise panel also retained a neutral-custody duty after fulfilment, amendment, or breach.

Fix: completed local duties supply no new magic. Their finale choices preserve earned rescue practice, shield placement, and freely accepted help. The shelter choice explicitly renews Caelan's duty for this expedition before transferring his own freedom. Completed local duties and resolved fragment return disappear from the active list. Choice IDs, history flags, and rescue advantages remain.

Recursive review: every reference to `c3-oath-hold-town`, `c4-oath-no-one-falls`, `oath-bring-them-home`, road repair, destroyed Red Moot Oaths, released Crown duty, burden Oath, and return promise across all runtime modules, journals, and maps. The bridge's in-chapter anchor use remains valid. Prevention: scope, renewal, active-panel, and completed-power regressions; updated Chapter 10/11/12 contracts and systems guidance.

### P1-03: Finale relationship flags disagreed with relationship intent

Evidence: `c12-close-relationship-honestly`, `c12-choose-fulfilled-single-life`, and `c12-choose-enduring-friendship` recorded endings while a prior committed/exploring intent could remain active in the character sheet and saved game. Generic distance/closure prose assumed a current relationship even on unattached routes. Ilyra's active remembered bond fell through to “No partner owns this hour” without addressing her actual departure.

Fix: explicit closure and single life end active romantic claims; explicit friendship changes them to platonic. Other established boundaries and scores remain. Save load applies the same meaning. Generic choices describe Caelan's own decision rather than inventing another person's answer. Ilyra is remembered on her road east and cannot answer here. Named partnership choices retain their existing consent and physical-side gates.

Recursive review: all four relationship objects, finale menus/results/callbacks/export, high-attraction boundary tests, Mara/Lysara crossed/remained states, Vexa hostility, and Ilyra departure. Prevention: 84 application/load boundary combinations and existing partner-side fixtures; systems, narrative, crossover, and Chapter 12 rules.

### P1-04: Shared callbacks summoned absent or dead people

Evidence: at `c9-mortal-proof`, `c9-match-original-ledger-cuts` and `c9-authenticate-pell-packet` let Pell present surviving documents even without `c8-pell-survived`. `c12-shield-inner-wounded` and `c12-move-wounded-through-open-lane` named Pell regardless of the crossing roster. The Chapter 4 defeat body summoned Mara after `c4-send-mara-with-brann`. Destroyed-Oath pressure at `c10-old-oath-price` assigned actions to Ansel, Moot fighters, or Teren independently of the chosen roster.

Fix: Ansel, who is present at the embassy, presents surviving records. Finale rescue text uses the actual wounded travellers. Bridge death stays with Caelan's observations. Old Oath temptations address Caelan without placing absent beneficiaries beside him.

Recursive review: named companion actions in all twelve effective chapters, death prose, evidence helpers, all four Chapter 9 rosters, crossed/remained partner flags, and all destroyed-Oath pressure branches. Correctly gated Pell map choices and memories of absent people remain. Prevention: targeted absent-actor regressions plus existing roster matrix; crossover and revelation guidance.

### P1-05: Ansel's own sold promise became his daughter's

Evidence: `c8-give-ansel-first-question`, `c8-give-ansel-first-question-after-entry`, the `c8-ansel-spoke-first` callback at `c9-embassy-watch`, and `c10-roster-offer` / `c10-shared-offers` changed his promise to stay when his daughter returned into his daughter's sold future.

Fix: every occurrence preserves Ansel as maker and his daughter as beneficiary. No new fact about the daughter's status is asserted. Recursive review searched daughter, future, sold promise, Ansel, and both first-hearing flags in all chapters and journals. Prevention: both first-question results checked; revelation ledger, crossover checklist, and Chapter 8/10 maps name the exact ownership.

### P1-06: A shared route borrowed exclusive preparation or permission

Evidence: `c8-oath-ledger` with `c8-lysara-knows-road-desire` used the half seal earned only by the sibling equal-lockkeeper choice. `c7-choose-salt-trap` claimed marked escape lanes before the survey route. `c10-free-ledger` authenticated a copy through Vaor's cooling test even with a stolen ember and no permission; its ordinary-copy fallback invented cooling seals too.

Fix: real Lysara grips Caelan's wrist beside the false image. The ordinary cavalry approach leads toward thin salt without claiming survey marks. Authenticated witness threads and ordinary recorded marks provide the established nonmagical evidence comparison. Exact prepared options retain their separate advantage.

Recursive review: preparation flags, props, evidence provenance, gift/pact/theft helpers, choice visibility, and paid/free siblings across the graph. Prevention: focused seal, unsurveyed approach, and stolen-ember copy regressions, existing exact-preparation fixtures, and crossover/revelation guidance.

### P1-07: The final menu omitted material law consequences

Evidence: all four choices at `c12-four-laws`, IDs `c12-choose-sealed-gate`, `c12-choose-consent-passage`, `c12-choose-broken-gate`, `c12-choose-mortal-gatekeeper`. Important ally, stored-promise, refusal, and changed-sunrise consequences were clearer in later endings than before selection. Breakage's advantage claimed permanent central-control loss despite its stated replacement-law condition.

Fix: each detail now discloses its own missing terms before selection. The breakage advantage refers to the old Gate rather than forbidding any future law. The consent map no longer invents delegation as an alternative to the implemented year of service. `c12-changed-sunrise` uses “The Changed Boundary” instead of placing every destination on the mortal fortress's eastern edge.

Recursive review: four details, immediate results, law consequence, fragment custody, personal destination, relationship, changed sunrise, four terminal endings, and terminal import contracts. Prevention: per-law pre-selection requirements and existing cross-product finale fixtures; player-experience rulebook and Chapter 12 map.

### P1-08: One bridge guard disappeared from the accounting

Evidence: the Chapter 3 handoff sends three town guards. `c4-collapse` accounted for two endangered guards. `c4-send-mara-with-brann` sent one away but left only one in its result, despite later rescue commands using two.

Fix: the third already holds the rope beside Lysara. Mara escorts Brann with one guard, leaving two. Recursive review followed all collapse outcomes, wounded choices, crossings, Ordan rescue, and the next handoff. Prevention: three-arrivals/one-escort/two-remain regression and Chapter 4/crossover contracts.

### P1-09: Caelan's childhood contradicted his father's occupation

Evidence: `mara-returns`, before `flirt-mara`, `ask-marker`, and `admit-unease`, placed childhood games at his father's forge/workbench. Canon makes his father an innkeeper.

Fix: inn kitchen, bread, and table preserve the familiar physical exchange. Recursive review searched father, forge, workbench, inn, and childhood across the series and bible. Later sparring near a forge does not make it his father's and remains. Prevention: effective-scene biography regression and Chapter 1 contract.

### P1-10: A choice advertised a reward difference that did not exist

Evidence: `folded-road` / `take-high-ground` claimed additional Wayfire, but both it and free sibling `follow-silver-road` award five. The Oath ending's six remain distinct.

Fix: describe defensive ground, clear view, and Command rather than an extra reward. Recursive review compared extra/additional reward claims, costs, advantages, results, and free siblings across all effective choices. Prevention: comparative reward regression and player-experience guidance.

### P1-11: Rook's warning arrived at a different contractual time

Evidence: `c4-bargain-with-rook` promised a warning sent from the Underways if a route allowed it, while `c4-ending-bargain` delivered and counted the warning before separation.

Fix: the bargain explicitly promises the safe exit and warning before the roads divide, followed by independent pursuit of the buyer. Existing warning content and Rook's physical departure remain. Recursive review checked all three Rook endings, Chapter 5 map imports, crossover chronology, and future-use contracts. Prevention: warning-time clause in Chapter 4 and crossover review checklist; existing departure/ending fixtures remain.

### P1-12: Triage promised a guaranteed death the route did not deliver

Evidence: the effective `c2-medicine` body, with and without `captured-attacker`, said Garran's fever “will kill him without the dose.” The untreated route later permits a healer and reduced testimony. This distorted the known stakes before every treatment option.

Fix: untreated fever may leave him too weak to testify. Preserve the existing medical rescue and difference in testimony rather than adding a death. Recursive review followed medicine choices, testimony, healer, and handoff; uncertain warnings that he may not survive remain valid. Prevention: effective-overlay guaranteed-death regression, Chapter 2 contract, and player-experience rule on uncertainty.

### P2-01: The prose completed an action before the menu

Evidence: `c4-brass-span` put Caelan across the gears before selecting a crossing. `c9-choose-theft-route` proposed taking the fragment during the attack, but `c9-take-fragment-during-attack` occurs at `c9-recover-fragment` after attacks and private conversation.

Fix: wait at the brass edge; propose taking without permission, then use the already cracked hinge at the actual recovery. The legacy theft ID remains unchanged. Recursive review checked action chronology, recovery, and branch joins across all chapters. Prevention: narrative chronology rule and revised Chapter 4/9 maps; graph destinations remain tested.

### P2-02: A valid full-map route displayed an incomplete-record diagnostic

Evidence: `c5-north-road` omitted `c4-rook-full-copy` from Caelan's map-memory helper. Two early continuous test routes exposed the diagnostic despite retaining the original fragment.

Fix: acknowledge Caelan's original nine-mark fragment while Rook carries the allowed copy. Recursive review checked all four Chapter 4 map records and all later incomplete-record fallbacks against valid continuous paths. Prevention: four map-state tests and continuous-path diagnostic detection.

### P2-03: The quiet-minute setup selected a different caregiver

Evidence: `relationshipMinute` in `c5-mara-burns`, `c5-lysara-burns`, and `c5-sorin-care` said Sorin treated the burn while resetting plates, before the chosen caregiver acted.

Fix: resetting plates creates time for burn care; the selected scene determines who provides it. Recursive review checked care flags, all three scenes, later Vaor reactions, and death callbacks. Prevention: narrative caregiver rule and Chapter 5 contract. The fast-route branch where Sorin obtains the minute remains distinct.

### P2-04: Journals claimed optional or future achievements too early

Evidence: `c7-copied-gate-diversion` said the army had seen proof immediately upon copying it. `c8-living-seed-spent` said the seed had saved Pell even when another earlier use weakened it.

Fix: carried dated proof and the actual later chain lift. Recursive review compared flag production time with journal visibility, optional rescues, original/copy loss, and recaps in every chapter. Prevention: journal timing guidance and existing evidence/seed consequence fixtures; review regressions cover the related completed-duty journal pattern.

### P2-05: A later recap changed a physical loss or injury

Evidence: `c8-force-deployment` called the lost Chapter 7 wagon sunk despite its firm-ground wreck outcome. `c11-revolt-engine-phrase` changed `c11-revolt-worker-injured` from Sira's cut arm to a crushed hand needing Medicine.

Fix: wrecked wagon and Sira's still-bleeding arm. Recursive review compared injury/supply flags with their immediate results and all later callbacks, including Nilo, Lysara, Brann, Teren, Pell, and Vaor-related burns. Prevention: exact injury/roster checklist and existing lasting-injury fixtures; no invented treatment choice or new cost.

### P2-06: Narration supplied the moral verdict after the scene

Evidence: `c3-bill` interpreted Ordan's protection argument; `c5-ember-choice` interpreted duty hiding guilt/desire; all three Chapter 7 endings used `c7-company-storm-losses` to tell the player how to value the dead.

Fix: Caelan's fingers curl, his hand rests on Mara's bandage, and Teren leaves spaces for unidentified names. Recursive review searched interpretive narration, repeated understanding/knowing, and similar abstractions in all bodies/results/journals. Deliberate character disagreement remains. Prevention: narrative rulebook, not a new blanket word ban.

### P2-07: Story menus exposed implementation terminology

Evidence: Chapter 9 conversation and roster advantages referred to the next chapter number. Chapter 10/11 menus repeatedly named prior chapter numbers instead of the cup test, Ash Road, or shelter agreement. `c11-use-uncontracted-entry` described an older-save fallback. Chapter 12 fallback and custody menus referred to save compatibility, owned flags, or ending summaries.

Fix: event-based names and unverified public records. Exact affected IDs are retained in the implementation diff, including `c9-talk-with-vexa-only`, `c9-take-pell-and-lock-map`, `c10-use-prepared-pause`, `c11-use-uncontracted-entry`, `c11-use-recorded-clean-refusal`, `c11-use-method-proof-at-auction`, and the Chapter 12 compatibility choices. See the exact changed-choice inventory below for the complete menu set.

Recursive review searched every effective label/detail/advantage/result and objective for chapter/save/flag terminology, distinguishing useful interface headings from fiction. Prevention: objective implementation-text checks on every choice plus player-experience guidance. Chapter headings and replay controls remain.

### P2-08: Documentation described a different implemented season

Evidence: the outline restaged Rook's theft in Chapter 4 after Chapter 3 already performed it; crossover chronology said Ilyra was absent throughout Chapters 5 to 12; the Chapter 9 map used a fifteen-decision title, different theft timing, and an escort substitute for Vexa; the Chapter 11 map still said Chapter 12 was unimplemented. Chapter 12's Oath inventory and service-delegation language also disagreed with exact runtime terms.

Fix: align these specific contracts with canon and effective play. Recursive review compared all eleven handoffs and the finale with their maps and registered chapter contracts. Prevention: graph/import-derived checker coverage and contract/handoff count agreement, plus updated crossover checklist. There is no new playable crossover.

### P2-09: Late procedural density remains a subjective risk

Evidence: `c8-oath-ledger`, `c9-defining-route`, `c9-recover-fragment`, Chapter 11's separate hearing/auction route, and `c12-four-laws` put several precise rights and conditions near one another. Menus remain concrete and sentences meet the objective length limit, but a twelve-year-old reader may still reread them.

Decision: retain these terms. Removing them would conceal ownership, consent, or lasting cost; collapsing hearings would erase separately owed duties. No broad voice rewrite was justified. Future human playtesting should ask readers to explain each option in their own words, especially on a small screen. This remains “Needs minor work” in accessibility/pacing, not a failed legal or mechanical contract.

### P3-01: Conditional fragments began prose with lowercase letters

Evidence: Chapter 5 `vaorHistoryJudgment` and `evidenceLeavingDragonspine`, Chapter 6 `dragonspineHandoff` and `proofCarried`, and Chapter 12 `mortalFace` and `injuryPressure` joined lower-case fragments into standalone sentences.

Fix: capitalize sentence starts without changing content. Recursive review rendered all nodes under produced flags and relationship boundaries. Prevention: rendered-paragraph capitalization check, plus existing sentence-length checks. No broad rhythm rewrite.

## Sound areas and handoff audit

| Handoff     | Checked result                                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 to 2      | Folded road leads physically to Bellweather; route, people, wounds, and suspicion survive.                                                          |
| 2 to 3      | Treatment and road evidence reach Harrowfen with different testimony and injury consequences.                                                       |
| 3 to 4      | Ordan pursuit and Rook theft occur before the bridge chase; three guards are now accounted for.                                                     |
| 4 to 5      | Rook departs to the Underways; recovered fragment/map, warning, Mara return, and northward travel remain distinct.                                  |
| 5 to 6      | Free/forced/pact ember, separate fire Nail, witnesses, logs, and collapse losses reach Kharad.                                                      |
| 6 to 7      | Red Moot authority, Ilyra's bounded involvement, political force, and evidence constrain the hunt.                                                  |
| 7 to 8      | Separate armies, Teren injuries, supply losses, fort signals, and occupied Fourth Fort agree. Ilyra takes her own road.                             |
| 8 to 9      | Embassy entry or waiting state, Ansel's first question, Vaor collateral permission, Pell survival, and evidence remain separate.                    |
| 9 to 10     | Exact fragment route, true-name scope, chosen expedition, and explicit partner crossing survive. Vexa escorts even under hostile truce.             |
| 10 to 11    | Ash Road method, private limits, temporary burden duty, proof, rope, guide decision, and petition price carry forward.                              |
| 11 to 12    | Route, alliance, exact expedition, review/hearing/passage debts, bounded Elian channel, and named freedom restrictions arrive intact.               |
| 12 terminal | Four laws preserve their stored promises, custody, destination, relationship, transformed state, and changed sunrise. No live continuation control. |

Malrec's remembered daughter is a motive, not proof of her objective identity, death, or location. His remote engine seal does not locate his body. Vaor's gift, resistance to theft, and shared pact remain recognizably different. Vexa's true-name precision never purchases romance. Ilyra can read pressure without deciding Caelan's chapter. Mara's practical familiarity, Lysara's deliberate political limits, Rook's evasive preparation, and supporting characters' competence remain distinct.

The early-to-mythic arc does not depend only on finale narration. Vaor's decision, Red Moot refusal, the army's chosen command, separate offer acceptance, renewed shelter duty, and final refusal rights all make the player practice limits. Completion rewards are unchanged. Oathfire remains useful while slower, nonmagical routes can finish. Existing tests protect prepared advantages, lethal zero Health, destroyed Oaths, intimacy parity, and independent ending dimensions.

## Safeguards and final validation

New `scripts/story-loader.mjs` follows registered runtime imports rather than duplicating chapter loaders. This closes a real maintenance gap: the former literal-prose source list did not include every later chapter, even though other portions of the checker visited their rendered nodes. Windows paths are normalized before counting files. New chapters cannot silently disappear from the effective graph checks.

New `scripts/series-review.mjs` runs continuous actual transitions and focused regressions from `check-game.mjs`. `check-story.mjs` adds relationship-intent and adult-confirmed detailed render samples and detects uncapitalized paragraph fragments. Command flags inside Markdown code are excluded from the prose-only adjacent-hyphen rule; actual story prose remains checked. No subjective ordinary-word ban was added.

Existing narrative, player-experience, revelation, systems, crossover, and affected chapter maps were updated rather than creating competing author policy documents.

Final validation:

| Command | Result |
| --- | --- |
| `npm run check:story` | Pass: 40 unique files, 3,021 distinct rendered scene paragraphs. |
| `npm run check:game` | Pass: 263 nodes, three endings in Chapters 1 to 11, four in Chapter 12, lethal routes in twelve chapters, 152,220 reachable choices, 15 to 18 decisions per route. Added five continuous seasons and 219 distinct decision nodes pass. |
| `npm run lint` | Pass with no diagnostics. Two lint issues in the new test helpers were corrected before acceptance. |
| `npm run build` | Pass: all five build stages complete. Existing notices remain for a chunk above 500 kB, plugin timing, and static route classification. |
| `git diff --check` | Pass, no whitespace errors. |
| `git status --short` | Reviewed: 36 review-owned changed/new files and the original twelve user-owned modifications. |

The original and final diffs for the twelve user-owned files have identical SHA-256: `8A64BE2252A5F255134838D1EA0A05F84482CD78FF658E963F47AC1175C0957B`. The final implementation diff was inspected. Formatting-only expansion of `choice-economy.ts` and unchanged map rows was removed to keep the edits local.

Review-owned files:

- Runtime: `app/game-data.ts`, `app/adventure-revision.ts`, `app/choice-economy.ts`, `app/chapter-four.ts`, `app/chapter-five.ts`, `app/chapter-six.ts`, `app/chapter-seven.ts`, `app/chapter-eight.ts`, `app/chapter-nine.ts`, `app/chapter-ten.ts`, `app/chapter-eleven.ts`, `app/chapter-twelve.ts`, `app/story-memory.ts`, `app/page.tsx`.
- Chapter contracts: `docs/CHAPTER_ONE_MAP.md`, `docs/CHAPTER_TWO_MAP.md`, `docs/CHAPTER_FOUR_MAP.md`, `docs/CHAPTER_FIVE_MAP.md`, `docs/CHAPTER_SEVEN_MAP.md`, `docs/CHAPTER_EIGHT_MAP.md`, `docs/CHAPTER_NINE_MAP.md`, `docs/CHAPTER_TEN_MAP.md`, `docs/CHAPTER_ELEVEN_MAP.md`, `docs/CHAPTER_TWELVE_MAP.md`.
- Authority and safeguards: `docs/SERIES_CHAPTER_OUTLINE.md`, `docs/NARRATIVE_RULEBOOK.md`, `docs/PLAYER_EXPERIENCE_BIBLE.md`, `docs/PLAYER_REVELATION_LEDGER.md`, `docs/SYSTEMS_RULEBOOK.md`, `docs/CROSSOVER_CONTINUITY_LEDGER.md`.
- Validation: `scripts/check-story.mjs`, `scripts/check-game.mjs`, `scripts/continuity-contract.mjs`, new `scripts/story-loader.mjs`, new `scripts/series-review.mjs`.
- Review: new `docs/CAELAN_SERIES_REVIEW.md`.

Remaining limits are the documented late-scene density and unavailable visual browser verification. The older-save crossing inference was not broadened or used to infer new consent: modern saves retain explicit crossing flags, and the existing compatibility behavior is covered separately from fresh routes. Human readers may differ on the relative appeal of the four laws; the review does not rank one as morally superior.

## Exact changed-choice inventory

This inventory compares the effective registered choices with the original checkout, including overlays. Body-only helper corrections are identified in the findings above.

| Node ID                    | Choice ID                                     |
| -------------------------- | --------------------------------------------- |
| `folded-road`              | `take-high-ground`                            |
| `c4-wounded`               | `c4-send-mara-with-brann`                     |
| `c4-duty`                  | `c4-bargain-with-rook`                        |
| `c7-defining-choice`       | `c7-choose-salt-trap`                         |
| `c8-embassy-terms`         | `c8-give-ansel-first-question`                |
| `c8-embassy-terms`         | `c8-give-ansel-first-question-after-entry`    |
| `c9-defining-route`        | `c9-choose-theft-route`                       |
| `c9-mortal-proof`          | `c9-match-original-ledger-cuts`               |
| `c9-mortal-proof`          | `c9-authenticate-pell-packet`                 |
| `c9-private-choice`        | `c9-talk-with-vexa-only`                      |
| `c9-crossing-roster`       | `c9-take-pell-and-lock-map`                   |
| `c10-water-offer`          | `c10-use-prepared-pause`                      |
| `c11-vathis-gate`          | `c11-use-uncontracted-entry`                  |
| `c11-slow-street`          | `c11-use-recorded-clean-refusal`              |
| `c11-weather-contract`     | `c11-test-mythic-shelter-transfer`            |
| `c11-illusion-street`      | `c11-use-public-only-limit-on-illusion`       |
| `c11-obligation-inventory` | `c11-inventory-caelan-appearance-duty`        |
| `c11-revolt-crisis`        | `c11-protect-revolt-families-with-rope`       |
| `c11-revolt-engine-phrase` | `c11-record-refusers-then-repeat-phrase`      |
| `c11-auction-bid`          | `c11-bid-caelan-appearance-duty`              |
| `c11-auction-counterbid`   | `c11-use-method-proof-at-auction`             |
| `c11-auction-counterbid`   | `c11-accept-narrow-price-court-review`        |
| `c11-elian-answer`         | `c11-protect-elian-channel-from-ownership`    |
| `c11-inner-gate`           | `c11-lock-auction-deed-to-gate-limit`         |
| `c11-inner-gate`           | `c11-hold-force-engine-corridor`              |
| `c12-inner-gate`           | `c12-build-unallied-contact-line`             |
| `c12-first-collision`      | `c12-shield-inner-wounded`                    |
| `c12-stop-opening`         | `c12-seat-legacy-fragment-publicly`           |
| `c12-door-order`           | `c12-let-expedition-cross-safe-line-first`    |
| `c12-door-order`           | `c12-breach-door-order`                       |
| `c12-door-order`           | `c12-move-wounded-through-open-lane`          |
| `c12-oath-hearing`         | `c12-support-law-with-homecoming`             |
| `c12-oath-hearing`         | `c12-support-law-with-road-communities`       |
| `c12-oath-hearing`         | `c12-support-law-with-no-one-falls`           |
| `c12-four-laws`            | `c12-choose-sealed-gate`                      |
| `c12-four-laws`            | `c12-choose-consent-passage`                  |
| `c12-four-laws`            | `c12-choose-broken-gate`                      |
| `c12-four-laws`            | `c12-choose-mortal-gatekeeper`                |
| `c12-law-consequence`      | `c12-carry-law-to-custody`                    |
| `c12-fragment-custody`     | `c12-record-legacy-bargain-custody`           |
| `c12-fragment-custody`     | `c12-place-legacy-fragment-in-public-custody` |
| `c12-relationship-ending`  | `c12-choose-honest-distance`                  |
| `c12-relationship-ending`  | `c12-choose-enduring-friendship`              |
| `c12-relationship-ending`  | `c12-close-relationship-honestly`             |
