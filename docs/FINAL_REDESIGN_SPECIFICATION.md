# Executive Assessment

**Redesign Veilfall in place. Preserve its complete adventure and decision economy. Improve how it presents obligations, consequences, resources, and recovery from death. Do not rebuild the game from scratch.**

The strongest proposal ideas address real problems, but several diagnoses are stale or unsupported. The game already has explicit relationship intent, finale intent reconciliation, qualitative relationship descriptions, a journal, responsive layouts, validated portable saves, and chapter replay. Its late chapters already contain named people, physical action, and substantially shortened prose. Another wholesale rewrite would put those achievements at risk.

The approved redesign has six priorities: remove irrelevant finale confirmations; make obligation language conditional on the actual route; present promises consistently without replacing their mechanics; expose all decision resources on small screens; offer an exact retry of a fatal choice; and reduce artwork transfer and package size while retaining the existing visual identity.

Evidence baseline: repository build 1.0.1, inspected 16 September 2026. I inspected effective story data including overlays, transition and save code, chapter maps, narrative and systems documents, actual rendered route samples, the opening in the browser, and desktop/390-pixel layouts. The supplied location identifies the repository; no separate original problem statement was identified. The repository's player-read clarity prompts provide relevant prior problem descriptions, but their conclusions were independently checked.

Current checks: `check:story`, `check:game`, `check:release`, TypeScript, `build`, and `build:itch` pass. Lint reports an unused `state` parameter at `app/chapter-eleven.ts:1541`. The game checker reports 263 nodes, 152,220 explored reachable choices under its bounded abstraction, 15–18 decisions per chapter route, and five continuous season routes covering 219 distinct decision nodes. These are not exhaustive human playtests or proof of every complete state combination. Existing large-chunk warnings remain.

The existing ZIP is 95,565,916 bytes. Source artwork comprises 41 files totaling 95,670,425 bytes. The current static JavaScript is about 1.49 MB raw and 0.44 MB gzipped; CSS is about 0.21 MB raw. Artwork is the first optimization target. Total playtime, abandonment, emotional engagement, and physical-phone performance have not been independently measured.

No game code was changed during this review. Build and diagnostic artifacts were generated. Existing unrelated worktree changes were left intact.

# Existing Game: Core Strengths

## Current core loop

Read a situation and immediate objective; compare actions against resources, preparations, relationships, and promises; choose an approach; receive an authored result; carry its consequences into later scenes. Finish a chapter, receive its outcome and existing resource recovery, then continue. Death stops progress and currently offers a chapter restart. The finale resolves the Gate law, fragment custody, destination, relationship future, and changed sunrise.

This is a deterministic, authored decision RPG. Its depth comes from prior commitments and different consequences, rather than tactical movement, random combat rolls, or collecting equipment.

## Strengths worth preserving

| Strength | Evidence and player value |
| --- | --- |
| Complete narrative | Twelve implemented chapters and four terminal Gate laws; the player receives an ending without waiting for another protagonist's release. |
| Defined protagonist | Caelan's physical courage, command, and sworn power give decisions a coherent identity. |
| Informed risk | Immediate resource changes, requirements, and lethal warnings are visible; costly actions generally have authored advantages and regression coverage. |
| Preparation matters | Escort preparation, evidence provenance, available forces, companions, and earlier treatment affect later methods. |
| Distinct adventures | Escort, inn defence, pursuit, bridge, dragon, moving city, hunt, forts, embassy, Ash Road, Vathis, and Gate have different immediate jobs. |
| Consent and independent people | Friendship, refusal, conversation, political cooperation, and romance are distinct. Absent characters cannot supply a new yes. |
| Separate ending dimensions | A world decision does not automatically select Caelan's home or reward a romance. Independence remains subject to the chosen law's physical limits. |
| Persistent consequences | Injuries, destroyed promises, voluntary assistance, evidence, and political outcomes survive chapter transitions. |
| Reading accessibility | Text sizes, keyboard-oriented controls, scene announcements, reduced-motion handling, journal, and returning recap already exist. |
| Strong release foundations | Portable saves, legacy migration, backups, import validation, replay invalidation, relative asset packaging, and extensive story checks are implemented. |
| Atmospheric identity | Dark illustrated scenes and restrained typography already establish place and mood. A different aesthetic is a preference, not a verified repair. |

# Verified Problems and Root Causes

Severity here concerns player impact, not a claim that the game is broken or commercially unsuccessful.

| ID | Verified problem and root cause | Symptoms, frequency, severity, and type |
| --- | --- | --- |
| P1 | Finale prose is not always conditional on the obligation actually owed. | In a valid continuous route, `c12-price-court-review` says no review is owed, then explains breach. `c12-compact-passage` says no crossing was purchased, then discusses refusing it. Similar generic language appears around unrestricted command and voluntary testimony. Recurs on affected routes; high clarity priority. Narrative/state-presentation defect. |
| P2 | Administrative acknowledgments occupy the same interaction weight as decisions. | Players click to record that no renewal, Court review, or Compact crossing is due. These choices have no alternatives, costs, or added flags. Route-dependent and repeated in the finale; medium pacing/UX problem. The cause is irrelevant interaction, not simply too many words. |
| P3 | Late scenes repeat contract context and sometimes foreground the wrong job. | `c11-obligation-inventory` lists many possible assets and exclusions before choosing a method, although those assets can help revolt and force as well as auction. Repeated terms obscure the local objective. Concentrated in VIII, XI, XII and selected IX scenes; medium–high content/UX problem. |
| P4 | Promise presentation is incomplete and distributed. | `activePromises()` is a separate conditional list in the UI. It omits the initial `oath-safe-arrival` promise and mixes injuries into the same list. Story helpers, journal, export, and normalization separately describe related duties. Recurrent as promises accumulate; medium UX/maintenance risk. This does not prove every existing oath gate is wrong. |
| P5 | The mobile status strip exposes only Health and Resolve. | Command and Oathfire require opening Stats even while choices spend them. Confirmed at 390 pixels and in source. Frequent on mobile; medium decision-friction issue. The existing responsive layout itself is not absent. |
| P6 | Choice cards expose relationship bookkeeping and duplicate some costs. | Automatic forecasts such as “attraction may deepen” appear beside human dialogue. This encourages reading actions as point opportunities. Frequent social menus; medium presentation issue, not evidence that numeric internal relationships should be removed. |
| P7 | Failure recovery restores the chapter, not the fatal decision. | The death body is chapter-generic; retry can require replaying 15–18 decisions. Mechanism verified; actual death/abandonment frequency unknown. Medium UX cost when death occurs. Fair lethal labels already reduce arbitrary failure. |
| P8 | Large source images ship largely as their original files. | Approximately 95.6 MB ZIP; artwork dominates. Existing on-demand image loading already helps initial loading but not total distribution size. High distribution/performance priority; actual slow-device latency unmeasured. |
| P9 | UI promises more precise progress than the graph supports. | Percentage uses `chapterChoices / 15`, capped at 96 until a final node, although routes span 15–18 choices. Frequent near chapter endings; low UX problem, easily removed. |
| P10 | The first decision is meaningful, but introductory presentation delays reaching it. | Artwork, heading, tutorial, and prose precede choices. The opening already affects preparations and resources; B's claim of four ledger inspections before a meaningful decision is inaccurate. Medium onboarding hypothesis, supported by layout rather than measured abandonment. |

Not verified as major problems: lack of audio, insufficient ending count, insufficient romance scenes, the existing visual style, title collision, a need for event sourcing, a universal 4–6-hour target, or a broken relationship-state system. Physical Android/iPhone and assistive-technology coverage remain validation gaps, not demonstrated defects.

One generated continuous route illustrates the distinction between length and density: Chapter I presents 2,216 body words over 16 nodes including its ending; Chapter XII presents 1,346 over 19 nodes, plus 1,052 words in visible option labels/details. These counts exclude lessons and separately displayed prior-action results, and cover one route rather than the whole branching script. The finale's problem cannot be diagnosed from scene word count alone.

## Architecture and feasibility

`app/game-data.ts` defines state, choices, requirements, relationships, chapter registration, and the assembled graph. Chapters I–III receive effective overrides from `app/adventure-revision.ts`; IV–XII have separate content modules. `choice-economy.ts` supplies additional advantage text. Reviewing only base strings would review a different game.

`app/page.tsx` owns choice application, death presentation, chapter recovery/handoffs, replay, and UI. State is resources, relationship scores plus intent, flags, prose history, node/chapter identifiers, completion records, and defeat. `story-memory.ts` derives journal and terminal export. `save-system.ts` validates and migrates schema 18 and stores chapter checkpoints.

The main fragile boundaries are duplicated interpretation of flags, hand-authored recovery transitions, conditional chapter prose, and tests that extract actual UI functions. Existing flags and choice/node IDs are compatibility contracts. There is no demonstrated need to replace React, the graph, or the save architecture. Small shared read functions and an exact retry snapshot fit the current implementation.

Primary implementation anchors: [state model](C:/Users/prave/Projects/Veilfall/app/game-data.ts:48), [effective graph assembly](C:/Users/prave/Projects/Veilfall/app/game-data.ts:4047), [relationship reconciliation](C:/Users/prave/Projects/Veilfall/app/game-data.ts:589), [choice transition](C:/Users/prave/Projects/Veilfall/app/page.tsx:330), [current promise list](C:/Users/prave/Projects/Veilfall/app/page.tsx:406), [chapter restart](C:/Users/prave/Projects/Veilfall/app/page.tsx:976), [mobile status](C:/Users/prave/Projects/Veilfall/app/page.tsx:1733), [save schema](C:/Users/prave/Projects/Veilfall/app/save-system.ts:17), [terminal export](C:/Users/prave/Projects/Veilfall/app/story-memory.ts:1914), and [Gate laws](C:/Users/prave/Projects/Veilfall/app/chapter-twelve.ts:1217).

# Proposal A/B Recommendation Ledger

Each row has exactly one decision. KEEP can mean preserve an already-implemented behavior; it does not imply new work. Costs are relative: L = local, M = several coupled surfaces, H = broad rewrite/content production. Optional work remains outside approval even when potentially beneficial.

| ID / source | Recommendation and problem addressed | Decision | Benefit, cost, side effects, compatibility, interactions, and reason |
| --- | --- | --- | --- |
| L01 Both | Preserve Caelan, twelve chapters, oath identity, fair costs, consent, four Gate laws, saves. | KEEP | Core value; L preservation cost. Removing these changes the product. All other rows are constrained by them. |
| L02 A | Rename to The Ember Oath / A Veilfall Story. | DEFER | Potential positioning benefit, no verified player problem; M release/metadata cost. Title collision was not independently established. |
| L03 Both | Oath-first tagline and shorter sales pitch. | DEFER | Plausible marketing benefit, L cost; no evidence it fixes in-game comprehension. Do not promise that every oath spend closes a new future when current rules differ. |
| L04 B | Replace cover with faceless wrong-sea road; change store tags and romance placement. | DEFER | Audience positioning is untested; M asset/store work. Removes existing character appeal without evidence. |
| L05 B | Credits, contact, provenance and accurate AI disclosure. | DEFER | Useful release work, L–M; owner facts are missing. Never fabricate authorship, licenses, contact details, or AI use. Separate from game redesign. |
| L06 A | Three named acts, title cards, recaps. | DEFER | Could orient the journey, M content cost; current chapter progression and recaps already work. Adds interruption without proven need. |
| L07 A | Reduce every chapter to roughly 9–12 decisions and 20–30 minutes; promise 4–6 hours. | REJECT | H graph/balance/save risk; deletes earned preparation and content to meet unmeasured targets. Remove identified friction instead. |
| L08 A | Fixed arrival/investigation/tactical/quiet/crisis chapter template. | REJECT | H rewrite and repetitive rhythm. Existing chapters have distinct dramatic purposes. |
| L09 A | Shorter scenes and faster first meaningful choice. | KEEP WITH MODIFICATION | L–M. Shorten the first scene and redundant late context only. No global word quota or stopwatch claim; meaningful choice already starts the game. |
| L10 B | Ambush cold open with one retroactive preparation echo. | REJECT | H chronology/economy risk. A single echo cannot preserve all original preparation combinations, costs, relationships, and learning. |
| L11 A | Structured oath ledger with beneficiary, power, duty, breach, status. | KEEP WITH MODIFICATION | M. Use read-only records derived from existing state, with honest uncertainty where closure is not established. Do not create a second authoritative game-state system. |
| L12 A | Earn/spend Oathfire through separately assigned oath powers. | REJECT | H rebalance of twelve chapters; risks grinding, fuel exploits, and invalidating low-resource routes. Existing pool and scoped mythic costs remain. |
| L13 Both | Human intent labels with visible costs and concrete consequences. | KEEP WITH MODIFICATION | M targeted edit. Much is already implemented. Remove bookkeeping forecasts and remaining ambiguous wording without hiding irreversible prices. |
| L14 A | Replace relationship scores with a linear milestone ladder. | REJECT | H migration/gating risk. Trust, tension, attraction, and intent are different axes; friendship is not a lower romance tier. Existing intent already does the necessary job. |
| L15 A | Reconcile finale friendship/closure/single with character state. | KEEP | Already implemented through `resolveFinalRelationshipIntents` and load normalization. Retain regression coverage; do not implement twice. |
| L16 A | Add five specified companion beats per major character. | DEFER | H content and continuity cost; unverified gaps. Risks importing absent Ilyra or mechanical romance rewards. |
| L17 Both | Humanize VIII/IX–XII and make consequences concrete. | MERGE | M targeted pass: A's attention to affected people plus B's object clarity. Preserve the existing events and separate duties; no wholesale late-game replacement. |
| L18 B | Limit late chapters to three physical objects; merge papers/rights. | KEEP WITH MODIFICATION | M context reduction only. Keep distinct engine access, opening permit, evidence, testimony, and obligations; merge wording where synonymous, not legal effects. |
| L19 B | Preserve the Ash Road cup, desire/refusal lesson and private limits. | KEEP | Existing successful tutorial; L protection cost. Removing it weakens the later promise decisions. |
| L20 Both | Keep Gate law, destination and relationship separate. | KEEP | Already true. Preserve physical compatibility and individual consent; independent inputs do not mean consequence-free combinations. |
| L21 A | Separate confirmation summaries for each finale layer. | KEEP WITH MODIFICATION | M. Add review/confirm only for the four Gate laws; retain existing destination and relationship scenes. Avoid three redundant modal interruptions. |
| L22 A | Five-part terminal epilogue. | KEEP WITH MODIFICATION | L–M presentation of existing facts. No new aftermath plot, invented casualty census, or newly consenting partner. |
| L23 A/B | Shorter death checkpoint versus chapter-only retry. | KEEP WITH MODIFICATION | M save/transition work. Add exact pre-fatal-choice retry, retaining chapter restart for resource traps. No chapter checkpoint network or free healing. |
| L24 A | Explain decisive death causes. | KEEP | L with L23. Show the actual action, starting Health and Health cost; do not invent a causal biography. |
| L25 A | Spoiler-safe route map and unlock tracking. | DEFER | H discovery metadata/UI work. Existing replay provides meaningful alternatives; new tracking is not necessary for comprehension. |
| L26 A | Ending archive and New Oath replay mode. | DEFER | M–H multi-save lifecycle and migration work. Export already preserves a completed journey. Keep current replay invalidation honest. |
| L27 A | Shareable ending cards. | DEFER | M rendering/privacy/scope cost; distribution feature, not root-cause repair. |
| L28 Both | New art bible and stricter character/style consistency. | DEFER | M production process. Apply visual consistency checks to optimized assets, but no art replacement without a demonstrated defect. |
| L29 A | Character close-ups, injury/recovery and oathfire variants. | DEFER | H asset cost and extra downloads. Emotional staging can improve through existing text and composition first. |
| L30 A | Unique art for each terminal destination/relationship combination. | REJECT | H combinatorial content expansion conflicts with package reduction and independent endings. Four existing Gate images remain. |
| L31 B | Replace cinematic images with four-ink atlas; cap at 18 plates. | REJECT | H identity loss and sunk content removal. Compression does not require abandoning effective illustrations or imposing an arbitrary image count. |
| L32 Both | Ambient loops, oath sounds, mute/volume/sensory controls. | DEFER | M–H asset, licensing, autoplay and accessibility work. Silence alone is not evidence of an unfinished game. If later approved, default and control behavior need a separate specification. |
| L33 Both | Compress art, load it as needed, reduce package to 20/30 MB. | MERGE | M, high benefit. Keep current images and on-demand behavior; adopt a measured 30 MiB package ceiling and 2 MiB cold-entry budget, not an 18-image purge. |
| L34 A/B | Lazy-load story chapters versus retaining one story bundle. | DEFER | M–H graph/save-validation coupling. Optimize images first; story code splitting requires a measured startup problem after that work. |
| L35 A | Separate engine and build an event-based source of truth. | KEEP WITH MODIFICATION | M small shared transition/read functions only where needed. Reject event sourcing and wholesale state replacement; use current flags and tested behavior. |
| L36 B | Replace dashboard with a mobile book, pips, journal and small artwork band. | KEEP WITH MODIFICATION | M. Repair resource visibility and scene order; keep numeric values, useful desktop sheet, existing journal and art. Pips obscure exact affordability. |
| L37 B | Make threat weather in location; public Expected advantage off. | KEEP WITH MODIFICATION | L. Move explicit Threat text beside the objective on mobile; do not encode danger only as atmosphere. Preserve the itch build's already-hidden advantage panel and development review behavior. |
| L38 B | Body/command/oath on almost every menu; always 2–4 choices. | KEEP WITH MODIFICATION | L as editorial guidance only. Preserve earned extra methods and social/refusal choices. No hard menu cap and no artificial tactical options in intimate scenes. |
| L39 B | Distinct voices, fewer repetitive clauses, one unfamiliar concept at a time. | KEEP WITH MODIFICATION | M targeted late-scene editing. Keep second person/present tense and existing strong dialogue. Do not apply a blanket vocabulary purge or rewrite the season's voice. |
| L40 A | Add recovery scene after each chapter. | KEEP WITH MODIFICATION | L. Explain existing recovery and show actual deltas in the existing transition; no extra node, choice, reward, or forced companion encounter. |
| L41 B | Test physical Android Chrome and iPhone Safari. | KEEP | M validation effort; viewport simulation cannot establish device success. Record unavailable coverage honestly. |
| L42 B | Build a new shell and port the season into it. | REJECT | H regression risk with little demonstrated benefit. Change the current playable build incrementally. |

# Conflict Resolution

| Disagreement / underlying question | Assessment of A and B | Final decision |
| --- | --- | --- |
| Gradual preparation versus immediate ambush: how should the player learn responsibility? | A values a quick meaningful decision but globally trims content. B sacrifices chronological preparation for an action hook. The first decision already changes resources and preparation; the pear, pin, envoy and route choices provide causal context. | **Neither wholesale approach.** Preserve chronology and all opening mechanics. Shorten the first reading block and improve screen order. |
| Rebuild oaths versus retain current resources: is the problem mechanical or informational? | A's first-class promise concept helps readability but its economy replacement is expensive. B correctly protects resources but does not fully address scattered promise presentation. | **Modified A.** Shared derived promise records; unchanged Oathfire economy and existing restrictions. |
| Add character illustrations versus replace art with woodcuts: what fixes visual presentation? | Both add substantial production work. Neither establishes that the current style causes disengagement. Image bytes are directly measurable. | **Neither aesthetic replacement.** Retain images, optimize delivery and cropping. |
| Cut all chapters versus aggressively compress the late legal sequence: what causes fatigue? | A's global count target ignores early strength. B identifies procedural repetition but collapses independently owed duties. Current IX–XII route prose is already relatively short. | **Hybrid with strict limits.** Remove three empty-confirmation cases; repair route-specific prose and duplicated explanation. Preserve decisions that change rights, rescue outcomes or obligations. |
| Relationship ladder versus qualitative existing model: what produces coherence? | A combines trust progression and romantic intent into misleading tiers. B better matches the implemented model. | **B, plus a display clarification.** Preserve scores and explicit intent; show terminal distance separately from commitment rather than inventing a new commitment or breakup. |
| Short checkpoints versus chapter-only failure: how much replay is useful? | A reduces repetition but proposes checkpoint infrastructure. B preserves danger but retains unnecessary rereading. | **Modified A.** Exact last-fatal-choice retry, with chapter restart retained. |
| Event engine/lazy chapters versus one story file: where is technical risk justified? | A can reduce duplication but proposes a large migration. B correctly distinguishes text from art weight. Current global graph is reused by save validation and checks. | **Modified B.** Keep loading/state architecture, share only narrow helpers, optimize assets first. |
| 20 MB / 18 images versus 30 MB / more variants: what is the release budget? | B's image count is unrelated to actual bytes; A's extra variants oppose its own performance goal. | **Neither package recipe.** A 30 MiB measured package ceiling with all distinct existing story images retained; no new variants. |
| Three act loops versus six regional loops: what audio ships now? | Both are plausible aesthetic directions, neither fixes verified mechanics or comprehension. | **Neither in required scope.** Audio is deferred. |

# Rejected and Deferred Ideas

Rejected: a from-scratch rebuild; global decision quotas; a mandatory chapter template; retroactive preparation; per-oath mana pools or a new reward economy; a linear relationship ladder; merged ownership/permission rights; new endings or playable protagonists; an arbitrary 18-image cap; art for every ending combination; event sourcing; and a forced four-option ceiling.

Deferred: rebranding and store experiments; act cards; new companion scenes; discovery maps; archives and New Oath mode; sharing features; new illustration production; audio; chapter code splitting; and owner-supplied credits/contact/provenance work. Deferred is not permission to implement a small version opportunistically.

The first follow-up worth considering is an ending archive if real replay users find manual export burdensome. That should be evaluated separately from fixing reading clarity and failure recovery.

# EXISTING STRENGTHS THAT MUST NOT BE LOST

| Strength and why it matters | Threat from redesign | Required protection |
| --- | --- | --- |
| Preparation produces later advantages. | Cold open, chapter compression, new fuel rules. | Keep every existing preparation choice, cost, flag and later payoff except the explicitly approved presentation-only acknowledgments. |
| The player can understand a lethal or freedom price before accepting. | Shorter copy, hidden details, quieter UI. | Exact immediate costs and requirements stay on cards. Permanent restrictions, duration, exit and beneficiary are visible before commitment. |
| Consent belongs to individuals. | Three-object compression and collective shortcuts. | Preserve each owner's permission, refusal, provenance and accepted scope. Never treat group protection, a name, or intimacy as universal permission. |
| Meaningful failure and scarcity. | Retry becoming a heal or reroll. | Retry restores exactly the preceding state; no reward survives a discarded fatal action. Keep chapter restart for an unrecoverable local situation. |
| Friendship and single life are complete outcomes. | Linear romance progression and “best” ending framing. | No Gate advantage, survival bonus or completion penalty depends on romance. Existing intent gates remain authoritative. |
| The journey has varied rhythm. | Quotas, mandatory quiet scenes and repeated act structure. | Keep existing chapter identity and successful I–VII scenes; target specific comprehension failures. |
| Four different world laws. | Simplified finale cards hiding costs. | Preserve all crossing, stored-promise, ally, personal-price, duration and sunrise distinctions. |
| Persistent earned continuity. | Automatic traversal, new ledger and retry snapshots. | Use the actual transition rules; retain old IDs and test route-equivalent state. No absent army, witness or companion can appear. |
| Portable and recoverable progress. | Schema changes or new archives. | Migrate old saves, retain recovery copies, validate before replacement, and export retry support explicitly. |
| Dark illustrated identity and readable text. | Restyle or aggressive compression. | Keep every distinct story illustration, alt text and scene meaning; inspect faces, hands, dark gradients and crops. Preserve text settings and reduced motion. |
| Stable local gameplay. | Infrastructure rewrite and new online dependencies. | Keep the game playable without new accounts, services, analytics, currency or network-dependent mechanics. |

# FINAL REDESIGN SPECIFICATION

This section is authoritative for implementation. MUST requirements are the systems below and their acceptance criteria. Preserve the existing runtime wherever this section does not explicitly change behavior. The proposals and earlier editing prompts do not expand this scope.

## S1. Opening and reading order

**Current behavior:** The cover starts Chapter I directly. A large image, tutorial and roughly a scene's worth of prose precede a genuinely consequential preparation menu.

**Problem:** The presentation delays the first action; moving the ambush would also erase useful setup.

**New behavior and rules:** Keep the cover, title, chronology, all Chapter I nodes, all preparation choices and all their mechanical effects. Edit only the initial `gate-yard` body to at most 140 words and its lesson to at most 45 words. Preserve the escort job, approaching storm, Caelan's responsibility, Brann's request and the reason preparations matter. Teach Health reaching zero and the meanings of Resolve and Command before the first choice. Preserve first-use Oathfire teaching where it currently occurs. Do not claim a tested 60/90-second experience or total playtime.

On mobile, show scene title and objective before the illustration. Keep the illustration before the main narrative. Advancing a scene focuses its heading and reveals its objective, rather than scrolling to an image above all context. The prior action's result remains at the start of the new narrative and is not repeated verbatim in its first paragraph.

**Edge cases/interactions:** Extra large text may wrap normally; nothing is clipped to achieve a fold target. Imported games resume their existing node. This edit does not compress Mara, Tivik, Lysara, the altered order or the route decision.

**UI, balance and data:** Presentation only; no added state or balance change.

**Unchanged:** All opening IDs, flags, costs, requirements, next nodes, relationships and later callbacks.

**Acceptance:** S1.1 Before/after transition equivalence for every Chapter I choice. S1.2 Initial body/lesson meet the word limits without losing the required facts. S1.3 At 320 and 390 pixels, all text and choices remain reachable with each text size. S1.4 A new player can state the escort job and identify that the first decision changes preparation.

## S2. Late-scene relevance and automatic acknowledgments

**Current behavior:** Applicable and inapplicable contract language is interleaved; three nodes can require clicking a single “nothing owed” acknowledgment.

**Problem:** Irrelevant explanation and pretend decisions obscure the choices that matter.

**New behavior:** Edit affected VIII–XII prose and matching journal/recap text in place. The scene begins with the physical situation and local goal, names the people affected, and introduces only the carried facts needed for the current decision. Do not repeat the same consent principle more than once within a scene unless separate options require different actual terms.

**Rules:**

1. If an obligation is absent, do not describe its breach as an available act. If it has ended, describe its actual ending, not continued enforcement. Voluntary testimony must not be narrated as breaking a vow when declined; do not add a decline choice to a currently mandatory narrative beat.
2. Keep the existing picture names consistent. The engine key opens the engine district; the one-opening paper permits one named force for one opening/bell. Neither is a person's consent. Evidence, speaking priority, a later appearance duty and a public backup promise retain separate effects.
3. At `c11-obligation-inventory`, explain that the offered asset can support the chosen approach to the engine, not only an auction. Put each asset's owner, use, transfer limit and later duty with that option. Remove the duplicate inventory from surrounding prose, while keeping every decision-relevant exclusion visible before selection.
4. Preserve Sira, Oren and Pellan's different priorities, Ansel's testimony, Vexa's agency, the attacks and rescues, the Ash Road cup, and all existing Vathis methods. No new people, scenes, timers or terms.
5. Only these three existing choices may advance automatically: `c12-record-no-renewal-debt`, `c12-confirm-no-price-review`, `c12-record-no-compact-passage`.
6. Automatic advancement is allowed only when that choice is the node's sole visible choice, is enabled, and has no resource change, relationship change or added flag. Otherwise show the normal scene. Use its existing transition and historical result exactly once. Do not show an empty-confirmation screen or a new consent dialog.
7. Never automatically choose testimony, oath destruction, payment, breach, permission, command, evacuation priority, custody, romance, or a Gate law, even if only one option is currently available.
8. Keep all three IDs and nodes valid for old saves. Loading one of these nodes applies the same guarded advancement. Invalid/inconsistent input follows existing save validation, not a guessed route.

**Edge cases:** Automatic steps stop before the next substantive scene and cannot cross defeat, an ending, or a chapter handoff. Reopening the browser must not duplicate history or transitions. A newly added alternative must disable the shortcut until separately reviewed.

**UI/data/balance:** Present the next actual scene and focus it once. Preserve existing history and counter semantics internally; automatic acknowledgments are not advertised as player decisions. No resource or world-outcome change is authorized.

**Unchanged:** Every substantive option, cost, beneficiary, permission, route and finale outcome.

**Acceptance:** S2.1 Equivalent gameplay state and history after old manual versus new automatic acknowledgment chains. S2.2 Each of the three absent-duty cases produces zero clicks. S2.3 Owed-duty versions still show all original options and prices. S2.4 No unrestricted fixture is told it must breach a nonexistent promise. S2.5 All revolt/auction/force and bargain/theft/exposure routes remain reachable. S2.6 The inventory correctly explains non-auction uses.

## S3. Choice language, resource visibility and honest progress

**Current behavior:** Cards combine intent, detail, effects and automatic relationship forecasts. Mobile keeps only Health/Resolve visible; chapter percentage assumes fifteen choices.

**Problem:** Players must open a panel to compare affordability, while social choices expose unnecessary bookkeeping.

**New behavior and rules:** Every normal action retains its intent, concrete immediate tradeoff, exact resource cost/gain, unmet requirement, and lethal label. Remove automatic Trust/Respect/Attraction/Friction forecast badges. Where an action expresses romantic interest, commitment, friendship or closure, state that meaning plainly in its label/detail. Do not silently disguise a romance-coded action as neutral. Internal scores and all their effects remain unchanged.

Keep qualitative relationship requirements. Keep expected-advantage text available in the current development target and hidden in the itch target. Essential advantages must still be understandable from normal action detail; hidden development text cannot be their only explanation.

On mobile keep numeric Health, Resolve, Command and Oathfire visible while reading choices, with text labels or accessible names. Show Medicine beside choices that consume it, and in the existing Stats view from Chapter II. Move the explicit Threat label beside the objective/location. Avoid duplicated Journal/Stats controls occupying a second large toolbar. Keep the useful desktop character sheet.

Replace the computed percentage with `Chapter [roman] of XII` and `Chapter complete` at a final node. Do not substitute another guessed percentage, decision quota or timer.

**Edge cases:** Values may be zero or exceed their usual starting values; do not truncate them into pips. Extra large text wraps; the sticky region must not cover focus targets or prevent reaching the final option. Lethal text stays visible on disabled choices too.

**Data/balance:** No relationship or resource changes. Reading preferences retain their keys and meanings.

**Unchanged:** Choice eligibility, all numeric effects, consent boundaries and keyboard access.

**Acceptance:** S3.1 All four core values are visible at 320/390 pixels when a choice menu is on screen without opening a sheet. S3.2 Medicine affordability is visible on medicine-spending menus. S3.3 Existing lethal and unavailable choices retain exact warnings. S3.4 No social forecast names a hidden score axis; explicit intent remains understandable. S3.5 No fabricated progress percentage remains. S3.6 Keyboard and touch can activate every available option at all text sizes; unavailable options remain disabled and their requirements remain readable.

## S4. Promises and obligations as a shared read model

**Current behavior:** Flags drive oath mechanics, while separate prose functions reconstruct promises for different surfaces.

**Problem:** The UI omits some promises and makes it difficult to distinguish a surviving duty from a past price or injury.

**New behavior:** Add a compact Promises section to the existing journal, powered by shared derived records. Do not add a persistent second oath-state machine, separate fuel pools, rewards, equipment slots or an oath-management screen.

**Rules:** Each established promise/obligation record contains a stable identity, the promise in plain language, beneficiary/holder, its actual scope, any known benefit, ending/breach conditions that the story establishes, and the current known status. Default view shows current restrictions and unsettled promises; resolved history is expandable. Injuries have their own existing-content subsection.

Scope covers named magical vows, the fragment-return bargain, the Ash Road burden agreement, Vathis review/passage obligations and mythic freedom restrictions. A flag containing `oath` can merely record a use of magic; it is not automatically a new vow. Include the initial safe-arrival vow when sworn. Explicitly represent its incorporation into the later homecoming vow when both flags and the authored ending establish that fact. Do not double-count it as two independent current duties.

Use existing authoritative events for statuses: sworn, fulfilled, released, destroyed, breached or continued under another promise. If current data and authored facts do not establish whether an old promise ended, show `Outcome not established` and its known terms. Do not manufacture a breach, completion, new power or loss of power to fill the field. The implementation report must enumerate any such ambiguous entries rather than silently decide their canon.

Required boundaries: a destroyed Chapter IX oath never becomes spendable again; fragment return ceases to be pending after fulfillment, agreed amendment or acknowledged breach; cutting name-pointing does not erase the separate return duty; a door-order restriction ends when its original **either** condition is satisfied, including stopping the opening; the command restriction continues until its stated Gate-law change, even if Caelan has already chosen to honor it; volunteered testimony creates no hidden debt. Completed Harrowfen/bridge duties cannot gain new magical scope at the Gate. A renewed promise is labeled as renewed rather than a retroactive extension.

The journal, relevant promise reminders, finale review and ending summary use this same interpretation. Use targeted shared helpers; do not convert all narrative content into generated text.

**Edge cases:** Unknown legacy outcomes remain unknown. Do not infer consent from high attraction, or fulfillment from chapter number alone unless the authored scope explicitly ends there. Absence of an acquisition record creates no new promise.

**UI/balance/data:** Read-only derived records and static authored terms. Existing flags remain the gameplay and save source. No rewards or eligibility changes are authorized by this presentation work.

**Unchanged:** Oathfire gains/spends, existing destruction costs, all duty scope and mythic restrictions.

**Acceptance:** S4.1 Initial sworn promise appears. S4.2 No duplicated current duty after an explicitly established incorporation. S4.3 Destroyed/released/fulfilled/breached fixtures agree across journal, relevant scene and ending export. S4.4 Door OR-condition and command-duration regressions pass. S4.5 No unavailable vow or unnamed beneficiary is invented. S4.6 All uncertainty entries are listed for review and grant no new mechanic.

## S5. Finale review and relationship/ending presentation

**Current behavior:** Four detailed world-law buttons immediately commit. Destination and relationship follow separately; terminal prose and summaries repeat some facts. Intent already reconciles friendship, closure and single endings.

**Problem:** Dense, fully clickable law cards are hard to compare and easy to commit while reading. A final distance choice can be confused with either a breakup or a fresh promise.

**New behavior:** Each law has a short action card with its central world effect and Caelan's unavoidable price. Activating it opens a review without changing game state. Review contains six labeled groups: crossing; stored promises; allies/ordinary people; Caelan's price; duration/replacement; sunrise. `Back` changes nothing. `Swear this law` applies the existing choice exactly once.

**Rules:** Preserve these distinctions in full before confirmation:

| Law | Required terms |
| --- | --- |
| Seal | Final free choice of side; thereafter no person, army, offer, promise or message crosses. Stored promises cannot be spent. Allies can be stranded. Caelan also loses crossing. Neither ruler reopens it alone; separately chosen delegates of both realms must freely replace it. Barred dawn. |
| Consent passage | Named willing traveler and chosen keepers on both sides; withdrawal before crossing. Stored promises await public review and return to original living owners. Allies need permission. Caelan owes one year of public service and no unwitnessed crossing during it. Either realm may close; yearly renewal by both and joint public dispute review. Witnessed narrow dawn road. |
| Break | No central Gate owner; individual bargain refusal remains. Stored promises return to living makers or Worldroot without a new owner. Their release strikes both lines and weaker defence suffers more. Allies and invaders may cross. Caelan keeps movement but loses central control of invasion. Lasts until people establish another law. Unstable dawn road. |
| Keeper | Caelan may admit a named willing person or refuse armies using publicly witnessed identity, never new true-name access. Separate promise voices enter him; he cannot spend, erase or silence them. Allies ask; travelers may refuse. He hears individual requests, cannot give away or abandon the boundary, and cannot live wholly in either realm. Ends at death or a freely accepted replacement law releasing every voice. Light bends around witnessed identity. |

Preserve existing lawful destination variants, fragment custody, company positions and partner eligibility. Do not add confirmation dialogs to every normal choice. Destination/relationship scenes remain separate and disclose their route-specific constraints.

Keep relationship scores and seven existing intents. For terminal honest distance, show `Future left open across distance` as an ending qualifier on the relationship display. It does not by itself end an existing commitment or promise a reunion/new consent. Friendship, closure, single and partner commitments keep current reconciliation. Never reinterpret Ilyra's absence as a fresh answer.

Present the terminal epilogue in five concise sections: The realms; The company; Caelan and his promises; Relationships; The first dawn. Include destination in Caelan's section. Use only established facts; unknown fates stay unknown. Keep four terminal images. No new ending combinations, lore reveal or continuation.

**Edge cases/data:** Review selection is transient UI state and must not be saved as a choice. Reload/cancel leaves the law unchosen. Rapid double activation cannot commit twice. Ended/hostile/platonic states cannot be resurrected by the distance qualifier.

**Balance/unchanged:** All existing law flags, costs, custody options, consequences and romance eligibility remain unchanged.

**Acceptance:** S5.1 Review/cancel leaves complete gameplay state byte-equivalent. S5.2 Confirm matches the original law transition once. S5.3 All terms above appear before confirmation. S5.4 All four laws retain their route-specific personal options. S5.5 Distance, friendship, closure, single and partnership agree between character sheet, journal, terminal prose and export without inventing consent. S5.6 Keyboard focus enters review and returns to the invoking card on cancel.

## S6. Exact fatal-choice retry and explanation

**Current behavior:** Health zero ends play; the chapter checkpoint is the nearest normal retry.

**Problem:** A mistaken fatal choice can require substantial rereading without teaching its actual numerical cause.

**New behavior:** Death offers `Retry the last choice`, `Restart this chapter`, and the existing full restart. Last-choice retry exists only when a valid snapshot of the state immediately before the fatal player action is available.

**Rules:** Let `H` be Health before selection and `dH` the authored Health change. Continue using `max(0, H + dH)` and the existing lethal predicate. When an enabled action is fatal, retain one deep snapshot of the exact preceding state, then apply death normally. The defeat explanation names the selected action and states `Health before: H; Health cost: -dH; Health after: 0`, alongside the existing short chapter consequence.

Retry restores node, resources, relationships, flags, history and completion data exactly to that snapshot. It creates no healing, reroll, bonus, new evidence or retained fatal-action reward. Consume the snapshot when restored; choosing fatally again may create a new one. There is no normal-play undo button or arbitrary checkpoint selector.

If all local continuations are blocked or fatal, do not change their prices; the player can restart the chapter. Preserve the existing chapter-restart Health floor of 3 and all chapter checkpoint rules. That existing assistance applies only to chapter restart, never last-choice retry.

**Edge cases:** Old dead saves without a valid snapshot show the actual selected action if known, but do not invent pre-death Health. They keep chapter/full restart. Nonfatal actions never expose retry. Starting/replaying/importing another path clears incompatible retry data. Death never marks a terminal chapter complete.

**UI/data:** One optional pre-defeat snapshot and optional exact death-cause metadata, persisted with the current save as specified in S7. No new checkpoint network.

**Unchanged:** Availability checks, warnings, all resource prices, death at zero and chapter replay.

**Acceptance:** S6.1 A Health 2 / cost 2 fatal action retries to Health 2 and the exact preceding state. S6.2 Repeat death/retry creates no resource, flag, relationship, history or completion accumulation. S6.3 A dead-end state stays a dead end until chapter restart. S6.4 Reload/export/import while dead retains a valid retry. S6.5 Older dead saves work without guessed recovery.

## S7. Save compatibility and narrow technical changes

**Current behavior:** Schema 18 uses validated game data, checkpoints, reading preference, recoverable import backup and earlier-version migrations.

**Problem:** New retry data and automatic traversal must not damage reliable existing saves.

**New behavior and rules:** Use a new browser-save schema for the optional retry data, ordinarily version 19 if no intervening repository change has consumed that version. Keep portable format identity and export format version 1 unless its envelope genuinely changes. Migrate version 18 and currently supported older inputs; missing retry data becomes unavailable, never synthesized. Preserve existing storage-origin behavior and pre-upgrade recovery copies.

Validate retry snapshots as rigorously as game state: known node, same chapter/path, positive Health, no defeat, valid resources and relationships. The stored fatal choice must be visible, enabled and fatal from that snapshot, and applying it must reproduce the saved dead gameplay state, including its flags, relationships and history. Inconsistent optional retry data may be discarded with a clear notice if the main save is valid; invalid main progress must retain the existing reject-before-replacement behavior. Keep the current import size limit and rejection protections.

This verifies internal consistency, not authenticity of a person's entire play history. Portable client saves are editable; no anti-cheat system, signature service or server verification is required.

Persist current game and retry data together. Storage failure cannot leave an earlier snapshot attached to a later game. Existing storage failure notices, session play, export and recovery remain usable. Chapter replay continues to invalidate later dependent snapshots; no ending archive is introduced.

Use one tested transition implementation for normal choices, allowed automatic acknowledgments and retry validation. Extract only necessary pure functions from the UI. Keep existing graph assembly, IDs, chapter handoffs, flags and story modules. Update tests that extract UI functions to exercise the actual replacement boundary; never weaken them to accommodate a refactor.

**Edge cases/UI/balance:** Import preview, cancellation, backup restore, quota failure and unsupported future schemas retain their existing safe behavior. Save notices do not become fiction. No gameplay balance changes.

**Unchanged:** Portable saves, chapter unlocks, reading preference, legacy inactive content fields, and removal of retired currency.

**Acceptance:** S7.1 Existing valid legacy fixtures retain their intended normalized node/state, except the three expressly approved automatic acknowledgment cases. S7.2 Current living/dead saves round-trip, including retry availability. S7.3 A mismatched retry snapshot that fails to reproduce the supplied dead state is rejected or discarded, never used for recovery. S7.4 Invalid/oversized/cancelled imports do not replace progress. S7.5 Backup and storage-failure tests pass. S7.6 Earlier chapter replay discards later results and incompatible retry data while retaining its real starting checkpoint.

## S8. Artwork delivery without visual replacement

**Current behavior:** Images already load on demand, but large original assets dominate the shipped package.

**Problem:** Distribution and image decoding are expensive without adding narrative value at normal display sizes.

**New behavior and rules:** Retain every distinct currently used scene and four ending illustrations. Generate appropriately sized compressed delivery assets from existing originals; WebP is sufficient, with additional formats only if actually useful. Preserve source originals outside the shipped runtime copy. Remove only proven unused files from the package, not from the source archive.

Use suitable responsive variants and existing per-image loading behavior. Do not preload the season. The cover and first scene should share a downloaded asset where they use the same art. Story and controls cannot wait for a decorative image. Preserve dimensions, alt text, focal subjects, dark detail and image-error fallback.

Budgets: final ZIP at most **30 MiB (31,457,280 bytes)**. A clean visit through the cover and initial scene requires at most **2 MiB (2,097,152 bytes)** of transferred game/HTML/CSS/font/image payload using the actual delivery encoding. Also report raw-byte totals so server compression is not assumed. Asset requests triggered by later play are separate. Check both the static preview without assumed transfer compression and the intended hosted delivery before claiming the budget passes.

Do not achieve these targets by cutting story, terminal art, readable text, legal notices or save support. No AVIF-only dependency, new audio or story-splitting work is included. If quality and budgets cannot both be met, document measured options and the shortfall; do not silently substitute a new style.

**Edge cases/data/balance:** Relative paths must work beneath the itch subpath. Local preview must serve the actual format correctly. Slow/failed images leave text playable. No save or gameplay state changes.

**Unchanged:** Scene-to-art meaning, current palette, terminal images, package safety policy and existing hosting registration.

**Acceptance:** S8.1 ZIP and cold-entry budgets are measured from produced artifacts, with a request/byte manifest. S8.2 Every referenced image loads under the itch subpath. S8.3 Side-by-side inspection finds no lost narrative subject, severe banding or unreadable important feature at desktop/mobile sizes. S8.4 A failed image does not block a choice. S8.5 Package audit passes and no source originals, local paths, source maps or unapproved files leak into the ZIP.

## S9. Existing recovery, comprehension and release validation

**Current behavior:** Chapter handoffs already restore authored amounts and clamp some values. Recaps and accessibility features exist, but physical-device and comprehension coverage is incomplete.

**Problem:** Resource changes can feel detached from fiction; automated correctness cannot establish first-read clarity.

**New behavior and rules:** In the existing chapter transition, show the actual recovery delta and one context-appropriate sentence about travel/rest/treatment already established there. Do not introduce a new recovery node, imply a doctor/companion is present when absent, or change recovery formulas. Calculate displayed gain as `new value - old value`; never advertise healing that a cap prevented. Announce any actual loss caused by existing cap behavior honestly rather than silently changing that behavior.

Run the available story/game/release, type, lint, both build and package checks. Keep the current unused-parameter lint finding visible in the baseline; a semantics-preserving removal/rename is permitted if that edited area remains affected, but do not sweep unrelated files. Record remaining baseline failures separately from regressions.

Exercise 320/390-pixel portrait, short landscape, desktop, all text sizes, keyboard, reduced motion, and a screen-reader path through costs, a review, death, and import. Test actual Android Chrome and iPhone Safari before claiming release-device validation. If unavailable, mark the result unverified rather than claiming a viewport simulation passed the device.

For comprehension, use five first-time readers or players on the opening, an owed/absent-duty finale pair, the Vathis inventory and the four-law review. Without coaching, ask for the immediate objective, useful difference between offered methods, personal/other-person price, and who can refuse. At least four of five must identify the intended core facts for each sampled decision. This is a revision gate, not proof of commercial appeal or a statistical market study. Record timed playthroughs before changing duration claims.

**Edge cases/interactions:** Use real reachable route fixtures, including depleted resources and declined romance. Do not substitute impossible all-flags states for evidence of a player-facing defect.

**Data/balance/unchanged:** No telemetry or new persistent state; recovery amounts and existing continuation controls remain.

**Acceptance:** S9.1 Displayed recovery equals actual signed deltas at low and capped values. S9.2 Automated checks and affected manual paths are reported with failures, not just a pass count. S9.3 Device/assistive/human gaps are explicit. S9.4 Comprehension criterion is met before calling the editorial redesign validated.

# Must Implement / Optional / Do Not Implement

## MUST IMPLEMENT

- S1–S3: concise first screen, correct route-specific prose, three guarded no-debt skips, human choice annotations, visible resources and honest progress.
- S4: shared read-only promise interpretation and clear separation from injuries, without inventing new oath mechanics.
- S5: exact Gate-law review, coherent terminal presentation and honest-distance qualifier.
- S6–S7: exact fatal-choice retry, numerical explanation, save migration and validation.
- S8: compression and measured delivery budgets while preserving the art/content.
- S9: truthful existing recovery display and the specified regression/comprehension validation.

## OPTIONAL / NICE TO HAVE

Separate future approval may cover branding experiments, act recaps, audio, additional character art, ending archive, route-discovery map, sharing, story code splitting, and supplied credits/contact/provenance material. None is approved for the current implementation. Existing legally required notices remain mandatory preservation, not an optional addition.

## DO NOT IMPLEMENT

No new protagonist, chapter, ending law, currency, random combat, equipment system, oath fuel economy, romance tier ladder, account/cloud save service, generalized event log, chapter rewrite quota, art replacement, automatic substantive consent, or new permanent power/restriction. Do not include optional features because they appear inexpensive.

# Implementation Sequence

| Phase | Systems and expected outcome | Main risk | Gate before continuing |
| --- | --- | --- | --- |
| 0. Baseline | Inspect worktree, effective graph, tests and current supported saves. Capture representative reachable fixtures and package/request sizes. | Reviewing stale overlays or changing existing user work. | Record baseline passes/failures; retain current path/outcome snapshots. |
| 1. Asset delivery | S8 compression in isolation; gameplay remains unchanged. | Crops, dark-detail loss, paths and media types. | Visual comparison, package safety audit, request/ZIP budgets; playable static build. |
| 2. Shared promise reading | S4 derived records and narrowly shared transition boundary needed by later phases. | Divergent lifecycle interpretations or enabling expired vows. | Acquisition/destruction/fulfillment/release/breach and duration fixtures; legacy save parity. |
| 3. Presentation | S1, S3, S5, recovery display from S9. | Hidden price, wrong partner, focus/scroll regression, double law selection. | Opening transition parity, four-law review tests, all intent boundaries, responsive and keyboard pass. |
| 4. Route-aware text and skips | S2 conditional prose and three exact automatic steps. | Lost history, omitted consent, path drift or repeated traversal on load. | Manual-versus-automatic state equivalence, owed/absent pairs, continuous full-season tests. |
| 5. Death/save change | S6–S7 retry snapshot, cause display, new schema. | Resource duplication, incompatible snapshot, damaged backup or migration. | Repeated fatal retry, legacy dead/live saves, imports, quota failure and replay invalidation. |
| 6. Whole-game validation | All systems, device checks and comprehension sampling. | Individually correct changes combining into confusion. | Tests/builds/package audit; required route matrix; clearly recorded human/device results and unresolved limitations. |

Every phase must leave a playable build. Do not combine the prose, save migration and automatic-transition changes into one unreviewable replacement.

# Risks and Regression Watchlist

| Interaction | Failure to prevent | Required check |
| --- | --- | --- |
| Ledger × eligibility | Display helper starts granting fuel or powers. | Same available choice IDs and numeric effects before/after S4. |
| Trimming × informed consent | A duration, holder, exit, or permanent cost disappears. | Read every changed option and full law review in its actual reachable state. |
| Automatic steps × saves | Reload replays history or accidentally selects an owed duty. | Save at each of three old nodes, reload repeatedly, verify a single transition chain. |
| Retry × consequences | Death rewards, romance changes or completion survive rollback. | Whole-state equality to the pre-choice snapshot, repeatedly. |
| Retry × scarcity | Retry heals the player or rerolls an outcome. | Exact stat restoration; chapter restart remains the only existing recovery reset. |
| Review × input | One tap/double tap changes multiple ending flags. | Cancel parity, one commitment, no queued action after modal closes. |
| Finale × relationships | Distance is treated as consent, or friendship retains romantic claims. | Four companions × existing intents × relevant terminal choices; absent Ilyra and hostile Vexa. |
| Objects × provenance | Copy becomes original, document becomes person ownership, or a public mark reveals private desire. | Bargain/theft/exposure and shared/private/burden routes; each owner and transfer limit. |
| Compression × readability | Atmosphere improves bytes but destroys faces, dark details or focal action. | Side-by-side actual-size inspection and slow/image-failure path. |
| Recovery × pacing | New exposition or an extra reward appears after every chapter. | One existing transition, correct signed deltas, no added choice. |
| State refactor × tests | A reimplementation passes while the actual UI differs. | Tests invoke the real transition/handoff boundary and browser samples verify it. |

Minimum gameplay matrix: all twelve chapters; four Gate laws; all Vaor outcomes; army/company/outlaw; bargain/theft/exposure; shared/private/burden Ash Road methods; revolt/auction/force; intact/destroyed vows; owed/absent/fulfilled/breached freedom restrictions; inner/outer companion positions; friendship/single/distance/partnership; low resources; fatal choice; replay and migration. Use targeted coverage, not a claim to brute-force every combination. Keep the five existing continuous runs and add coverage for material new paths.

Whole-design check: no new mechanic duplicates the existing economy; no new RNG or content treadmill is introduced. Retry reduces repetition without creating a profitable loop. Promise records and shorter prose share an interpretation rather than becoming rival sources of truth. Removing three empty interactions does not combine rights or erase owed duties. The mobile strip exposes decision information without adding a dashboard of hidden variables. Audio, discovery systems and archives are excluded to keep the onboarding and save burden bounded.

# IMPLEMENTATION AGENT PROMPT

You are implementing the approved redesign of **Veilfall: The Ember Oath** in `C:\Users\prave\Projects\Veilfall`.

Read `docs/FINAL_REDESIGN_SPECIFICATION.md` completely. Its **FINAL REDESIGN SPECIFICATION**, **Must Implement / Optional / Do Not Implement**, acceptance criteria and preservation requirements are the authoritative design. This task is an incremental redesign of the existing completed game, not a new game or a from-scratch rewrite.

**If the implementation instructions and the Final Redesign Specification appear to conflict, the Final Redesign Specification takes precedence.**

Before changing anything, inspect the repository, applicable AGENTS.md files, worktree changes, package scripts, current runtime, tests and saves. In particular inspect `app/game-data.ts`, effective `app/adventure-revision.ts` overlays, chapter modules, `app/page.tsx`, `app/story-memory.ts`, `app/save-system.ts`, `app/choice-economy.ts`, the static image adapter, and the story/release/package checks. Verify the current version and baseline; do not assume this review's line numbers or schema number still match. Protect pre-existing user changes and hosting registration.

Implement only MUST scope S1–S9. Keep the twelve-chapter story, existing meaningful choices and consequences, resource economy, four Gate laws, consent rules, independent personal ending choices, portable saves, legacy migration and replay invalidation. Do not implement OPTIONAL work, proposal extras, speculative improvements, new content systems, or an architecture rewrite. Preserve unrelated behavior. Earlier prose-only prompts may describe historical work; they do not override the explicit approved changes in this specification.

Proceed in the documented implementation sequence with a playable build after each phase. Use the actual transition implementation; do not write a second approximation for tests or save replay. Preserve node/choice IDs. Only the three named no-debt acknowledgments may advance automatically, under their exact guards. Never auto-accept a substantive promise, breach, price or relationship choice. The promise journal is derived information, not a new source of gameplay authority. Retry restores the exact state before a fatal choice and must not create resources or retain its consequences.

You may change implementation details where technically necessary, but you must NOT silently change intended game design. If technical reality makes part of the specification impractical, find the closest implementation that preserves the intended player-facing behavior and explicitly document the deviation, evidence, tradeoff and affected acceptance criteria. If an oath's historical closure cannot be established from current canonical facts, use the specified uncertainty display and list the ambiguity; do not invent its resolution or new powers.

Run available tests and builds appropriate to each phase, then the final checks: `npm run check:story`, `npm run check:game`, `npm run check:release`, `npm run lint`, `node node_modules/typescript/bin/tsc --noEmit --incremental false`, `npm run build`, `npm run build:itch`, `npm run package:itch`, `npm run check:itch-package`, and the existing loader check where applicable. Inspect failures rather than hiding them, increasing warning limits, weakening assertions or deleting coverage. Keep baseline failures distinct from introduced failures. At review time lint reported an unused `state` parameter in Chapter XI; verify whether it remains and handle only an appropriate semantics-preserving correction, not unrelated cleanup.

Test affected gameplay paths through real reachable fixtures and the browser. Cover the required route matrix, all resource warnings, four-law review/cancel/confirm, relationship intents, new retry cycles, replay invalidation, legacy imports, malformed retry data, storage failures and relative packaged asset loading. Preserve keyboard focus, scene announcements, text sizes and reduced motion. Measure final ZIP size and cold-entry transfers, including actual server encoding and raw-byte totals. Inspect optimized art rather than assuming an encoder preserved quality.

Create an acceptance checklist with every S1.1–S9.4 criterion, implementation location, verification method, result and evidence. Use only criteria that actually exist under each system; do not invent intermediate numbers. Mark unavailable human, screen-reader or physical-device tests as unverified, never passed. Do not claim the redesign is fully validated until required checks are satisfied; clearly separate completed implementation from external validation still needed.

Finish with changed systems and reasons, commands/results, gameplay and visual verification, artifact sizes, save compatibility, material deviations, unresolved risks, and the acceptance checklist. Do not deploy, publish, add analytics, contact third parties, or modify unrelated work as part of this implementation task.

# Final Self-Critique

**Overdesign:** The most expensive tempting additions—new economy, art direction, event engine, archive and route map—were removed. The largest remaining risk is interpreting promise status; S4 explicitly limits it to known facts and grants no new mechanics.

**Root causes:** The design distinguishes repetitive reading from meaningful complexity. It removes only three proven empty-confirmation cases and repairs conditional prose; it does not collapse separately owed duties to make the screen look simpler.

**Independence from the proposals:** Agreement between A and B did not establish a need for audio, rebranding, a rebuild, or new art. Conversely, the review's resource-visibility and inaccurate-progress fixes follow the actual implementation rather than either report's priorities.

**False compromise:** The design chooses preservation over both aesthetic rebuilds and rejects the cold open outright. Its few hybrids combine compatible means to a verified outcome, not competing plot rules.

**Preservation and exploits:** Oathfire economics, all substantive route outcomes and consent boundaries remain. Retry is exact rollback, not healing. No new dominant resource strategy, random system, romantic reward or new ending tier is introduced.

**Remaining ambiguity:** Some old oath closures are not explicitly represented, and human comprehension is not established by automated tests. Those limitations are visible requirements, not silently invented canon or claimed validation. Total playtime and real-device performance still need measurement.

**Could it be smaller?** Yes: remove the empty confirmations and optimize images first. The additional mandatory work addresses independently verified presentation/recovery problems while staying within the existing game. If scope must be reduced further, preserve S2, S3 and S8 first; do not substitute deferred features for omitted essentials or call a partial implementation fully accepted.

**Acceptance quality:** Core behavior is verified through exact state equivalence, named guards, save round trips, preserved law terms, byte budgets and explicit route matrices. Editorial success additionally requires uncoached readers. Passing tests alone is not sufficient evidence that the game is easier to understand.
