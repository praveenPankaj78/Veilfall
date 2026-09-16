# Independent agent prompt: player-read clarity (third pass)

Copy everything below the line into a fresh agent session.

This is **not** a plot rewrite and **not** a repeat of the earlier glossary passes. Labels in Chapters VIII–XII were already turned into physical verbs. The one-opening picture for `invasion right` already exists. The four Gate-law details already use a six-job order. Do not churn those.

---

## Role

You are a prose editor for **Veilfall: The Ember Oath**. A player-comprehension review found that Chapters I–VII mostly read as a clear adventure, while Chapters VIII–XII still make a first-time player ask “which paper is this?” and “what am I doing right now?” even though the plot is already decided.

Your job is to make the **existing** facts land on a first reading. Write as if the player is a careful 13-year-old who has not memorised the world bible.

## Hard constraints

1. **Do not change plot, lore, outcomes, people present, destinations, romance/consent gates, or the four Gate laws.**
2. **Do not change mechanics.** Node IDs, choice IDs, `next`, flags, `addFlags`, visibility, costs, relationship effects, and `introducesStoryTerms` keys stay character-for-character. The key `invasion right` must remain. Player-facing English around it may change.
3. **Do not add scenes, choices, or lore.** Do not invent a fifth Gate law. Do not collapse hearings.
4. **Do not rewrite Chapters I–IV scene prose, labels, details, or advantages.** Out of scope.
5. **In Chapters V–VII, edit only the named recap-dump helpers below.** Do not “improve” travel, battle, flirtation, or briefing voice.
6. **Do not rephrase a label on the keep-list**, unless it still uses a leftover problem word from this prompt’s paper table.
7. No em dashes, no two adjacent hyphens. Second person, present tense, Caelan’s concrete voice. Most sentences 30 words or fewer. Semicolons may join at most two short clauses; never a list of four or more facts.
8. Immediate costs, who may refuse, duration, and lasting limits must remain visible before selection. You may reorder. You may not hide.
9. If you find a continuity bug, **stop and report it**. Do not silently change plot.

## Do not touch (already good)

Leave these patterns alone:

- `Ask Vexa to post/bid her people’s public backup promise`
- `Ask Sira, Oren, and Pellan to mark their first-hearing right`
- `Take the stair beside the gate. No posted price is attached`
- `Build the hearing from the people standing here`
- `The bead can point. It cannot own her`
- `Destroy the Oath to bring the Concord’s hidden victims before the Queen`
- Revolt lines about collars, families, tunnels, and separate answers
- Compact **white fire** used as a visible defence
- Intimate-scene bodies, consent outcomes, and who is present
- Chapter X water-cup tutorial (wanting is not a yes; silence accepts nothing)
- Lesson titles and lesson bodies that already attach a term to a picture
- Cover copy in `app/page.tsx` and chapter summaries in `app/game-data.ts`

If a string already answers “what do I physically do?” and does not mix two papers, keep it.

## What the player is getting lost on

The author’s idea is already simple: **a person is owned only after a visible yes to exact terms. Silence, desire, command, and paperwork are not a yes.**

Do not explain that idea again. Translate the **objects** so the player can keep them apart.

### 1. Chapter XI paper soup (main leftover confusion)

Players meet several different objects that are all called paper, claim, right, mark, or phrase. They blur into one “legal thing.” Keep the facts. Give each object **one picture name** and use it in labels, details, advantages, results, objectives, helpers, and journal.

| Object (facts stay) | Player-facing picture | Do not keep calling it |
| --- | --- | --- |
| Sableglass’s separate document that opens Malrec’s engine district | **engine key** or **house key-paper** | `engine paper` when the one-opening permit is also on screen |
| Auction prize: one Gate opening, one named force, one bell; owns no names/bodies/land | **one-opening paper** | repeating `invasion right` after the first mention in that node |
| Public proof against Sableglass that may change hands once | **damages mark** | `damages claim` in labels |
| Sira, Oren, and Pellan’s right to speak first | keep the keep-list label; elsewhere **first-speak mark** | unexplained `first-hearing right` in helpers |
| Vexa’s public promise that her people will honour one later seat | **backup promise** | `compact surety` |
| Caelan’s later duty to appear for review | **later-appearance duty** | `appearance duty` without saying he must show up |
| Empty Court chair that belongs to no house | **empty Court chair** | `free seat` / `free Court seat` |
| Phrase on the bought paper that opens the engine only while every bid term stays visible | **open-while-visible phrase** | bare `audit phrase` |
| Vexa pointing to the fragment case for this door only | **point for this door only** | `alignment` |

Rules:

- First mention of the auction prize in a node may still say `invasion right` **once**, immediately beside `one-opening paper`. Later sentences in that node use only the picture.
- Never put two of these objects in one sentence without both pictures.
- Search live strings (not flag IDs) for `engine paper`, `damages claim`, `free seat`, `audit`, `alignment`, `surety`, `appearance duty`, `invasion right`.

Examples (same flags and costs):

| Current | Rewrite toward |
| --- | --- |
| Have the Free Ledger guide mark the engine paper in public. | Have the Free Ledger guide mark Sableglass’s engine key in public. |
| List the public Sableglass damages claim. | List the public damages mark against Sableglass. |
| Place the one-opening paper with the Price Court’s free seat for the audit. | Place the one-opening paper on the empty Court chair so the Court can check every term. |
| Speak the audit phrase while every bid term remains visible. | Speak the open-while-visible phrase while every bid term remains visible. |
| Ask Vexa to point to the fragment case for this alignment only. | Ask Vexa to point to the fragment case for this door only. |
| The one-opening paper, the invasion right, still holds under the exact promise… | The one-opening paper still holds under the exact promise… |

Files: `app/chapter-eleven.ts` helpers and nodes, matching lines in `app/chapter-twelve.ts` (`routeSupport` and similar), `app/story-memory.ts`, and `app/choice-economy.ts` only when that file still supplies the opaque advantage.

### 2. Recap dumps: one sentence listing four or more facts

These helpers join carried proof or Oaths with commas or semicolons. A player cannot hear the list. **Keep every fact.** Split so each sentence holds at most two facts.

Rewrite these functions only:

- `app/chapter-five.ts` → `evidenceLeavingDragonspine`
- `app/chapter-six.ts` → the helper that returns `Your case can use …`
- `app/chapter-seven.ts` → the helper that returns `Your active steppe duties are plain: …`
- `app/chapter-eight.ts` → `steppeOathLedger`
- `app/chapter-nine.ts` → `preparedDefence`
- `app/chapter-ten.ts` → the helper that returns `Your surviving duties are to …`

Pattern:

Bad: `Your active steppe duties are plain: A; B; C; D; E.`

Good: `Your steppe duties are still exact. Kharad fighters answer commanders chosen by the Red Moot. Malrec’s hidden crime must face public judgment. The clans may leave after the Gate is safe.`

If a route produced no items, keep the existing empty-state sentence.

Do not add chapter numbers, flag names, or facts the route has not proved.

### 3. Helper stacking at the top of late scenes

In Chapters VIII–XII, some nodes open with three or more helper paragraphs of legal status, then ask a question. The player forgets the question.

For any node whose `body()` concatenates **three or more** helper return strings before the last paragraph:

1. Keep unique route facts.
2. Cut restatements of the consent thesis if that node already said them (`owns no names`, `owns no bodies`, `silence accepts nothing`, `cannot own her/you`).
3. Order the node: one physical situation, one unique route consequence, then the existing dramatic beat and the question.
4. Thesis reminder: **at most once per node**.

Priority nodes (inspect and fix if stacked):

- `c11-vathis-gate`, `c11-petition-hearing`, `c11-engine-control`, `c11-obligation-inventory`, `c11-auction-bid`, `c11-auction-result`
- `c9-embassy-watch`, `c9-futureless-answer`, `c9-defining-route`
- `c12-inner-gate`, `c12-four-laws`
- Helpers at the top of `app/chapter-eleven.ts` and `app/chapter-twelve.ts` (`routeCost`, `entryConsequence`, `fragmentState`, `obligationInventory`, `excludedInventory`, `lawSupport`, `routeSupport`). Fix the helper once and re-read every caller.

### 4. Objectives and last-paragraph questions that sound like office English

Rewrite only these kinds of lines. Keep the task.

| Current kind | Toward |
| --- | --- |
| `Place the embassy under clear neutral rules without changing Vexa’s recorded position.` | `Set one clear meeting place for the embassy. Do not move Vexa unless you choose to.` (`c9-embassy-watch`) |
| `Cross the toll without changing the fragment’s recorded custody.` | `Cross the toll without changing who holds the fragment.` (`c10-fragment-custody`) |
| `How do you enter without giving the gate a new claim?` | `How do you enter without promising the gate something extra?` (`c11-vathis-gate`) |
| `Which Ash Road record protects that hearing?` | `Which record you already carry keeps Sira, Oren, and Pellan from being spoken for as one?` (`c11-petition-hearing`) |
| `Set a bounded political truce with Vexa.` | `Set a public ceasefire with Vexa, with named limits.` (`c12-choose-vexa-political-truce`) |
| `Ask every living keeper to change holding freely.` | `Ask every living keeper to say, freely, who should hold the fragment.` (`c12-amend-neutral-fragment-custody`) |
| `Accept the offer as spoken and prepare the bounded bargain.` | `Accept the offer as spoken and write the ending into the bargain.` (`c9-choose-bargain-route`) |
| `Record that no Free Ledger renewal is owed.` | `Record that no extra Free Ledger hearing is owed.` (`c12-record-no-renewal-debt`) |

Search Chapters VIII–XII objectives and the last sentence of each `body()` for: `recorded`, `custody`, `claim`, `standing`, `bounded`, `alignment`, `political`, `renewal`. Fix only the opaque ones. Leave questions that already name a person, door, street, wagon, or wound.

### 5. Chapter XII four-law details still pack two jobs into one sentence

Node `c12-four-laws`. Labels may stay.

Each detail already follows this order: crossing; stored promises; allies; what Caelan personally loses or owes; duration / how it can be replaced; sunrise.

**Keep every disclosed fact.** If a sentence still contains two independent limits joined by `and`, split it. The result may be seven or eight short sentences. Do not hide “either realm may close,” “yearly renewal,” “witnessed identity, not true-name,” or “weaker defences suffer more.”

Example of packing to split:

- Current: `After a last free choice of side, no person, army, promise, offer, or message may cross, and nobody can force another person to leave.`
- Toward: `After a last free choice of side, no person, army, promise, offer, or message may cross. Nobody can force another person to leave.`

### 6. Journal lag

`app/story-memory.ts` must use the same picture names as the live scenes (engine key, one-opening paper, damages mark, empty Court chair). Do not add facts the route has not proved. Do not mention chapter numbers, flags, or saves.

After rewriting a live noun, search the journal/recap functions for the old noun and align it.

## Method

1. Read this prompt. Skim `docs/NARRATIVE_RULEBOOK.md` **Simple but immersive language** only.
2. Search player-facing strings (not flag IDs) for: `engine paper`, `damages claim`, `free seat`, `audit phrase`, `alignment`, `surety`, `appearance duty`, `invasion right`, `recorded position`, `recorded custody`, `bounded`, `Your case can use`, `Your active steppe duties`, `The steppe Oaths remain exact`, `Your prepared defence is visible`, `Your surviving duties are to`.
3. Edit: `app/chapter-five.ts` (named helper only), `app/chapter-six.ts` (named helper only), `app/chapter-seven.ts` (named helper only), `app/chapter-eight.ts` through `app/chapter-twelve.ts`, `app/story-memory.ts`, and `app/choice-economy.ts` only when that file still supplies the opaque advantage.
4. For each changed node, keep label / detail / advantage / result / objective / journal in the same vocabulary.
5. Do not “improve” rhythm, flirtation, or briefing voice in Chapters I–V except the named Chapter V helper.

## Acceptance

Done only if all of these are true:

1. A player who has not memorised the terms can point to **two different objects** in Chapter XI: Sableglass’s engine key, and the one-opening paper sold at auction.
2. No helper in the named recap-dump list still joins four or more facts with commas or semicolons.
3. Keep-list labels are unchanged, or changed only to insert a paper picture from the table.
4. Each four-law detail still discloses every previous limit, in the same six-job order, without two independent limits packed into one sentence.
5. Journal uses the same nouns as the live pictures.
6. IDs, flags, and costs are unchanged.
7. `npm run check:story` passes.
8. `npm run check:game` passes.
9. `git diff --check` is clean.

## Deliverable

Code edits plus a short editor’s note: files touched, three before/after examples, confirmation that keep-list labels were not churned, confirmation that `invasion right` remains the StoryTermKey, confirmation that Chapters I–IV scene prose was not rewritten.

Do not add new markdown rulebooks. Do not delete this prompt or `docs/PROSE_CLARITY_AGENT_PROMPT.md` until the owner asks.
