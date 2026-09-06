# Development Plan

## Current status

The project contains a functioning choice engine and the first three canonical Caelan chapters. The reader now includes named relationship values, a journal, returning player recaps, replay confirmation, responsive status controls, and versioned save migration.

The redesigned foundation now includes:

- one central world conflict;
- seven distinct mortal regions;
- three connected outer realms and Worldroot;
- exactly three playable leads;
- thirty six high level chapter plans with flexible boundaries;
- class resources and costs;
- staggered world changing finales;
- romance and intimacy rules;
- a canonical world map.

## Phase One: foundation approval

Review these questions before new chapter prose begins:

1. Does the mystery of the broken Concord feel strong enough to carry all three series?
2. Are the three leads different enough in method and personality?
3. Does each route contain places the player will want to reach without rushing the explanation?
4. Are the four broad final world states morally interesting?
5. Is the intended romance tone adventurous, mature, and meaningful without taking over the central plot?

Only decisions that change the chapter skeleton should be settled here. Names and small lore details can remain flexible.

## Phase Two: data model migration, in progress

Preserve the working reader interface, then replace the story state with a versioned shared model.

Required work:

- add protagonist specific resource schemas;
- add world Nail and regional state;
- add named relationship dimensions, with Trust and Attraction now implemented for Mara and Lysara;
- add travel and companion state;
- add imported finale summaries;
- add content preference for detailed intimacy or fade, now implemented with an adult confirmation gate;
- maintain versioned save migration or a clearly announced reset when the data model changes.

## Phase Three: Caelan vertical slice, complete

Chapter One is implemented as The Road Before Rain with a thirty to forty minute target.

Acceptance criteria:

- the player settles into Caelan's normal role before the first impossible event;
- the story visibly leaves Greyhaven;
- at least three approaches express Oathwarden play;
- costs are shown before choices;
- Mara has warmth, independence, and conflict potential;
- Lysara is intriguing without becoming a lore delivery device;
- one mystery is answered;
- the final road fold creates a clear next objective;
- no adjacent hyphens or em dash characters appear in game content;
- at least three full playthroughs produce meaningfully different state.

## Phase Four: travel and consequence proof, complete

Caelan Chapters Two and Three are implemented. Together they prove:

- a location can feel distinct in text and interface;
- travel choices affect arrival state;
- a World Nail can be explained without a lore dump;
- Rook's crossover creates curiosity without confusion;
- an Oath changes future options rather than acting as a temporary buff.

## Phase Five: complete Caelan season

Produce Chapters Four through Twelve in small batches. After every batch, test continuity for Oaths, allies, routes, romance, regional consequences, and player understanding.

Do not write the Cinder Deep finale until its possible contracts and imported world states are represented in data.

## Phase Six: Rook season

Begin Rook only after Caelan's finale outputs are stable. His opening should immediately reflect the selected Black Gate state without requiring a recap.

Prototype Health, Focus, Heat, Setup, Glimmer, and Echo mechanics in Rook Chapters One through Three. Each major chapter needs at least two prepared but audacious Stage options. Test that players feel surprised by the execution without feeling that Rook produced an answer from nowhere. Test humour separately during pressure, relief, and grief so it sharpens his voice without weakening consequences.

## Phase Seven: Ilyra season

Begin Ilyra after Rook's four Dawn law outputs are stable. Prototype Health, Mana, Strain, and named person specific Leverage before the main season draft. Her series has the highest continuity load, so build a consequence matrix before drafting Chapters Ten through Thirteen. The matrix must distinguish attraction from trust and record when manipulation succeeds, fails, creates exposure, or becomes genuine attachment.

Every crossover receives a personality audit. The active lead keeps the decisive action, and visiting leads retain their own objective and method. Reject any scene where Caelan, Rook, or Ilyra could exchange dialogue or actions without changing the scene.

Memory Shards must change actual narration, knowledge, and relationships. They cannot function as renamed mana potions.

## Player comprehension gate

Before writing the next chapter, test the current chapter against `docs/PLAYER_EXPERIENCE_BIBLE.md`.

Do not continue merely because the scene graph works. Continue when a first time player can identify the goal, class method, visible cost, new confirmed fact, and next anticipated event without an explanation from the writer.

Chapter numbers are not production quotas. Split a chapter when two major revelations compete for attention. Combine chapters when a section repeats the same objective or emotional decision.

## Phase Eight: mature content implementation

Add optional detailed intimate scenes only after age declarations, consent rules, relationship state, and fade preference work correctly.

Each scene receives a narrative review confirming that it changes story state, keeps both adults active, fits the established attraction, and does not use magic or power imbalance to bypass consent.

## Phase Nine: content operations

Create lightweight authoring checks for:

- forbidden adjacent hyphens and em dash characters;
- missing visible costs;
- broken passage links;
- unreachable endings;
- choices with no stored consequence;
- lore terms introduced before their definitions;
- romance scenes that lack age metadata or consent state;
- route and travel time contradictions.

## Phase Ten: monetisation and release

Keep Wayfire chapter access separate from moral choices and romance. Test a generous free path before adding ads. Players should understand what an ad grants and should never lose earned currency because a video fails.

Release order:

1. Caelan Chapters One through Three as a free foundation arc.
2. Caelan's full season.
3. Rook's season with Caelan import.
4. Ilyra's season with both imports.
5. Optional side stories only after the main saga is complete.

## Definition of ready for prose

The foundation and the first three canonical chapters are implemented. The next production gate is to test several imported routes from Chapter One through Chapter Three, record comprehension and pacing issues, and confirm that the World Nail explanation is understood before Chapter Four begins.
