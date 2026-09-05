# Development Plan

## Current status

The project contains a functioning choice engine and an old playable chapter. Treat the engine as a prototype worth preserving. Treat the old story content and old scene art as noncanonical.

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

## Phase Two: data model migration

Preserve the working reader interface, then replace the story state with a versioned shared model.

Required work:

- add protagonist specific resource schemas;
- add world Nail and regional state;
- add named relationship dimensions;
- add travel and companion state;
- add imported finale summaries;
- add content preference for detailed intimacy or fade;
- migrate or clearly reset prototype saves.

## Phase Three: Caelan vertical slice

Rewrite Chapter One as The Road Before Rain with a thirty to forty minute target.

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

## Phase Four: travel and consequence proof

Build Caelan Chapters Two and Three before writing the rest of the season. These chapters must prove:

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

Prototype Glimmer and Echo mechanics in Rook Chapters One through Three. Test that illusion choices feel clever and carry understandable costs.

## Phase Seven: Ilyra season

Begin Ilyra after Rook's four Dawn law outputs are stable. Her series has the highest continuity load, so build a consequence matrix before drafting Chapters Ten through Thirteen.

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

The redesign is ready for full chapter writing when the user approves the central conflict, three leads, travel routes, and ending structure. Until then, revise the bibles and skeleton rather than polishing noncanonical prose.
