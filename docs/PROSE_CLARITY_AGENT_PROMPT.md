# Independent agent prompt: prose clarity, second pass

Copy everything below the line into a fresh agent session. This is **not** a repeat of the first glossary rewrite. Labels in Chapters IX–XII were already translated. Do not churn them.

---

## Role

You are a prose editor for **Veilfall: The Ember Oath**. A first pass (commit `fcc582f`) made many late-game **choice labels** readable. A second player-comprehension review found leftover confusion in a smaller set of terms, details, advantages, helpers, and journal lines.

Your job is to finish that translation **without rewriting scenes that already read clearly**.

## Hard constraints

1. **Do not change plot, lore, outcomes, people present, destinations, romance/consent gates, or the four Gate laws.**
2. **Do not change mechanics.** Node IDs, choice IDs, `next`, flags, `addFlags`, visibility, costs, relationship effects, and `introducesStoryTerms` keys stay character-for-character. The key `invasion right` must remain as the introduced story term. Player-facing English around it may change.
3. **Do not add scenes, choices, or lore.** Do not collapse hearings or invent a fifth Gate law.
4. **Do not rewrite Chapters I–VII.**
5. **Do not rephrase a label that already starts with a physical verb and names a person, object, or place**, unless it still contains a leftover problem word from the list below.
6. No em dashes, no two adjacent hyphens. Second person, present tense, Caelan’s concrete voice. Most sentences 30 words or fewer.
7. Immediate costs, who may refuse, duration, and lasting limits must remain visible before selection. You may reorder. You may not hide.
8. If you find a continuity bug, **stop and report it**. Do not silently change plot.

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

If a string already answers “what do I physically do?” keep it.

## Remaining problems (this pass only)

### 1. “Invasion right” sounds like Caelan is invading

This is the main leftover “what is the author suggesting?” bug.

**Keep:** the StoryTermKey `invasion right`, the intro node `c11-engine-control`, and the facts: one Gate opening, one named force, one bell, no ownership of names/bodies/land.

**Change:** later player-facing uses that drop the picture.

Pattern:

- First mention in a scene: `invasion right` **plus** the one-opening picture in the same sentence.
- Labels/objectives/advantages: lead with the picture, then the name if needed.

Examples (same flags and costs):

| Current | Rewrite toward |
| --- | --- |
| Hold the invasion right under the written limits. | Keep the one-opening paper yourself. It still allows only one Gate opening, one named force, and one bell. |
| Deny Sableglass the invasion right without damaging the public streets. | Stop Sableglass buying the one-opening paper, and leave the public streets intact. |
| Register a narrow invasion right that cannot widen after the sale. | Lock the one-opening paper so it cannot grow into an army after the sale. |
| Win the invasion right through a complete fallback… | Win the one-opening paper by accepting one later public review… |
| Your lawful invasion right holds… | The one-opening paper still holds… |

Do **not** make the player think they are launching Malrec’s invasion. They are buying or denying a permit so that invasion cannot widen.

Files: `app/chapter-eleven.ts` (body helpers `routeCost`, `auctionHolderConsequence`, objectives, labels, details, advantages, results), matching lines in `app/story-memory.ts`. Search the live strings for `invasion right` and fix every **player-facing** hit, not the flag IDs.

### 2. Chapter XII four-law details are still one wall

Node `c12-four-laws`. Labels may stay. **Details must keep every disclosed fact** (crossing, stored promises, allies, Caelan’s personal limit, duration/how it can be replaced, sunrise).

Rewrite each detail as **six short sentences in this order**, one job each:

1. Crossing
2. Stored promises
3. Allies
4. What Caelan personally loses or owes
5. How long it lasts / how it can be replaced
6. What sunrise looks like

Do not hide “either realm may close,” “yearly renewal,” “witnessed identity, not true-name,” or “weaker defences suffer more.” If a sentence is still over 30 words, split it. Do not add headings inside the string unless the live UI already preserves line breaks; prefer plain sentences in that fixed order.

Also rewrite `c12-choose-consent-passage` **label** from `Create controlled passage by mutual consent` toward `Open a crossing only when both sides and the traveller say yes.` Keep the choice ID.

### 3. Advantages still speak office English

Where a label was already fixed, rewrite the matching `advantage` (in the chapter file or `app/choice-economy.ts`) so it names a **visible benefit**: who is safer, faster, heard, protected, or able to refuse.

Bad: `Create a strong lawful bid and public standing for a revolt.`

Good: `Give Sira, Oren, and Pellan a first turn to speak, which can also support a workers’ refusal later.`

Bad: `Prevent military control from becoming political consent.`

Good: `Stop an army’s orders from counting as a civilian yes.`

Search Chapters VIII–XII advantages for `lawful`, `custody`, `consent`, `ownership`, `standing`, `holding`, `claim`, and `invasion right`. Fix only the opaque ones. Leave advantages that already name a person, door, street, or wound.

### 4. Same blank paper, two names

Chapter VIII endings and journal still say `unfinished claim` that `owns nothing`. Chapter IX live prose now says a paper under glass with yes-or-no lines.

Pick **one player-facing picture** and use it in VIII, IX, and `app/story-memory.ts`:

- the blank paper / unfinished page bearing Caelan’s ordinary name
- price and yes-or-no lines still empty
- therefore nobody owns him yet

You may keep one spoken use of `claim` in Vexa’s dialogue if she would say that word, but immediately attach it to the paper the player can see. Do not leave journal and live scene using different nouns with no reminder.

### 5. Leftover metaphors and helper dumps

Rewrite only these kinds of leftover lines. Keep the fact.

| Current kind | Toward |
| --- | --- |
| `Invoke Sableglass witness law and compel surrender of the fragment.` | `Use Sableglass’s own rule: if they used the fragment in a hidden attack, they must give it up.` (`c9-compel-sableglass-surrender`) |
| `Pass the evidence frame through under Sableglass witness law.` | `Send the evidence frame through under the house’s own attack-material rule.` (`c10` matching label) |
| `every silence remains unowned` | `a person who stays silent is not counted as having said yes` (`c12-build-law-from-present-consent` result) |
| `Which registered thing enters the sale?` | `Which of these do you put on the scale?` (`c11-auction-bid`) |
| `How do you put that fact beyond denial?` | `How do you make that fact public so the Court cannot ignore it?` (`c11-engine-control`) |
| `living command` with no reminder | one reminder: the Oath that lets a request reach only units who still freely answer |
| `hearing debt` in helpers | `no extra hearing is owed` / `you still owe the promised public hearing` |
| `c12-fragment-custody` body lecture (`A bargain may be kept… Theft and exposure keep their own holding rules.`) | one sentence of what is due now, then the last line asking what Caelan does with the fragment in his hand |

Helpers at the top of `app/chapter-eleven.ts` and `app/chapter-twelve.ts` (`routeCost`, `entryConsequence`, `lawSupport`, `obligationResult`, `fragmentState`) still inject old register between clear paragraphs. Fix the helper once and re-read every caller.

### 6. Journal lag

`app/story-memory.ts` still contains `unfinished claim`, `owns nothing`, and a bare `invasion right` gloss that does not match the live picture. Align journal/recap wording with the rewritten live nouns. Do not add facts the route has not proved. Do not mention chapter numbers, flags, or saves.

## Method

1. Read this prompt. Skim `docs/NARRATIVE_RULEBOOK.md` **Simple but immersive language** only.
2. Search player-facing strings (not flag IDs) for: `invasion right`, `unfinished claim`, `owns nothing`, `witness law`, `lawful bid`, `lawful mark`, `registered thing`, `beyond denial`, `unowned`, `political consent`, `hearing debt`, `living command`, `present consent`.
3. Edit the live source: `app/chapter-eight.ts` through `app/chapter-twelve.ts`, `app/story-memory.ts`, and `app/choice-economy.ts` only when that file still supplies the opaque advantage.
4. For each changed node, keep label/detail/advantage/result/objective/journal in the same vocabulary.
5. Do not “improve” rhythm, flirtation, or briefing voice in Chapters I–V. Out of scope.

## Acceptance

Done only if all of these are true:

1. A player who has not memorised the term can explain the Chapter XI auction as **buying or denying a one-opening permit**, not as Caelan invading.
2. Each of the four Gate-law details can be restated as six one-job sentences without missing a previously disclosed limit.
3. Already-plain labels from the keep-list are unchanged or changed only to insert the one-opening picture.
4. Journal uses the same nouns as the live paper/permit pictures.
5. IDs, flags, and costs are unchanged.
6. `npm run check:story` passes.
7. `npm run check:game` passes.
8. `git diff --check` is clean.

## Deliverable

Code edits plus a short editor’s note: files touched, three before/after examples, confirmation that keep-list labels were not churned, confirmation that `invasion right` remains the StoryTermKey.

Do not add new markdown rulebooks. Do not delete this prompt until the owner asks.
