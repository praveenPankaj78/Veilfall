# Development Plan

## Product strategy

Build one excellent character season before expanding the shared universe. The first release should prove that players finish chapters, care about Maelin, replay decisions, and want another viewpoint. World size is useful only when it produces emotional payoff.

## Current vertical slice

The included Chapter One proves these parts:

* direct entry into the playable story
* a responsive reading interface
* five visible stats and resources
* choices with stated tradeoffs
* conditional text based on earlier actions
* locked choices with clear requirements
* local automatic save and restart
* three distinct endings
* a crossover hook for Rook's series
* one original illustrated scene

## Phase One: narrative prototype

Time: 3 to 5 weeks

Goal: Turn Chapter One into a reliable test build and learn whether the premise creates interest.

Work:

1. Run ten observed playtests on phone and desktop.
2. Record where players pause, skim, misunderstand a choice, or stop caring.
3. Add a small internal scene validator for broken links, unreachable nodes, impossible checks, and missing consequence text.
4. Add the story style checker to continuous testing.
5. Revise Chapter One once from evidence rather than personal preference.
6. Write Chapter Two only after the first test round.

Exit criteria:

* At least 8 of 10 testers finish the chapter.
* At least 6 can explain Maelin's immediate goal and the central mystery.
* No choice feels like a disguised correct answer to most testers.
* A second play route changes enough text and consequence to feel worthwhile.

## Phase Two: Maelin season

Time: 10 to 14 weeks

Goal: Produce a complete ten chapter season with a strong ending and meaningful replay.

Chapter spine:

1. The Bell Beneath the Rain: escape the Low Cells and reach the crown prison.
2. A King Who Died Twice: cross a locked down Greyhaven with the living king.
3. Three Promises: choose Maelin's first active oaths.
4. The Mercy Riot: decide whether law or protection defines duty.
5. Trial of the Court Wolf: meet Orren as investigator, enemy, or secret ally.
6. The Knife at Tomorrow's Throat: follow Rook into a stolen possible day.
7. A General Without a Country: gather a force while districts choose sides.
8. The Funeral War: command living and willing dead defenders.
9. Seven Shadows at the Gate: play Maelin's part in the shared siege.
10. The Crown Breaker: save, seize, or damage the lock beneath the kingdom.

Production tasks:

* Move story nodes into versioned content files.
* Add save schema migration and three chronicle slots.
* Build the Oath system, relationship ledger, inventory, and chapter selection.
* Add content warnings and text size controls.
* Commission or generate one key illustration every two chapters.
* Add music and sound only after silent pacing works.
* Build author tools for node links, conditions, flags, and previews.

## Phase Three: launch foundation

Time: 6 to 8 weeks alongside final writing

Goal: Ship Maelin Season One on web and prepare a mobile wrapper if retention supports it.

Work:

* account based cloud saves with guest play
* privacy respectful analytics
* chapter entitlement and Cinder ledger
* rewarded ad integration at chapter boundaries only
* purchase restoration and clear regional pricing
* accessibility audit for screen readers, keyboard, contrast, text size, and reduced motion
* performance budget for lower cost mobile devices
* localization ready content structure
* crash and save recovery

Do not add ads until the full season economy can be tested without them. The story must first prove its value.

## Phase Four: second viewpoint

Time: begin after Maelin Chapter Six data is stable

Recommended lead: Rook Sable

Rook offers the strongest contrast to Maelin in voice, movement, ethics, and mechanics. His first season overlaps three Maelin events but spends most of its time in new places. It reveals who arranged Maelin's conviction and why someone stole her execution from history.

Release options:

* Alternate Maelin and Rook chapters after Rook launches.
* Sell complete character seasons while allowing the first two chapters of each free.
* Give viewpoint echoes as optional Cinder scenes to encourage discovery without forcing a series order.

## Phase Five: ensemble expansion

Introduce Vela or Ilyra next. Choose based on player response to horror, romance, magic cost, and investigative play. Do not launch more than two active series at once until the writing, continuity, and testing pipeline handles them reliably.

The full seven lead plan is a long horizon. Each new lead requires a distinct mechanic and a complete private conflict before receiving production approval.

## Team shape

A lean season team can begin with:

* one creative director and lead writer
* one narrative designer who owns state and branching
* one frontend game developer
* one editor focused on voice and continuity
* one visual artist or art director using a mixed commissioned and generated pipeline
* part time quality assurance and sensitivity readers as content requires

One person may cover several roles during the prototype. Editing and playtesting should remain separate passes even in a solo project.

## Writing pipeline

1. Define the chapter promise, answer, and final hook.
2. Create a one page beat map with decisions and state changes.
3. Review continuity before drafting prose.
4. Draft the critical route first.
5. Add branches that express different values rather than extra decoration.
6. Run automated link and style checks.
7. Read aloud and edit for voice.
8. Play every reachable route.
9. Test with readers who have not seen the outline.
10. Lock content, localize, and preserve a content version.

## Art direction and image policy

Use painterly realism with grounded medieval materials, deep charcoal, iron blue, aged crimson, and tarnished gold. Images mark locations, revelations, first appearances, and season turning points. Most scenes rely on prose, sound, and interface atmosphere so artwork remains special.

Generated images require a saved prompt, human review, a continuity check, and a record of where the asset is used. Do not generate living artist imitations. Characters need stable reference sheets before a second image is approved.

## Risk register

### Branch explosion

Control it with braided branches, typed state, chapter level convergence, and explicit continuity reviews.

### Lore before emotion

Require every reveal to change a relationship, risk, or personal goal.

### Weak choice impact

Show consequence in prose within one scene and pay it off again later.

### Too many protagonists

Finish Maelin's first season and prove Rook's contrast before adding another active line.

### Currency harms trust

Keep complete free routes, place offers only at boundaries, show prices early, and never sell the true ending.

### Artificial prose feel

Enforce the voice rules, use an editor, read aloud, test blind, and remove sentences that sound polished but say little.

## Immediate next work

1. Test all Chapter One routes.
2. Revise the chapter after reader evidence.
3. Outline Chapter Two with three returning consequences from Chapter One.
4. Build the scene graph validator.
5. Add a compact chapter menu and save slot only when Chapter Two exists.
