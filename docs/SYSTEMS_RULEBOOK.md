# Systems Rulebook

## Design goal

Systems should make story choices feel remembered. Numbers support identity and consequence. They should not turn reading into constant arithmetic.

## Core character stats

Each lead has three approach stats, one relationship value, and one series specific resource. Maelin's opening set is the reference model.

### Vitality

Measures strength, health, and the ability to endure injury. It can unlock forceful actions or absorb harm. At zero, the character gains a lasting injury and the story finds another route. Zero does not cause an unannounced game over.

### Resolve

Measures courage, focus, and confidence in personal identity. It resists fear, memory magic, possession, and pressure. Low Resolve changes perception and dialogue before it blocks actions.

### Guile

Measures deception, planning, stealth, and the use of secrets. High Guile opens indirect solutions and lets the player notice manipulated evidence.

### Mercy

Measures maintained human connection rather than moral purity. Mercy rises through costly care and falls through using people as tools. High Mercy creates allies and sacrifice options. Low Mercy creates fear, speed, and ruthless options. Both paths remain playable.

### Cinders

Cinders are fragments left when an impossible future burns away. They are the shared narrative currency.

Cinders can unlock:

* hidden memories
* alternate approaches
* short side scenes
* early access to the next chapter
* viewpoint echoes from another character

Cinders must never sell a required good ending. Free choices always allow a complete and satisfying story. Paid or ad earned Cinders buy breadth, speed, replay value, and extra context.

## Currency economy

The first chapter is free and awards 3 to 6 Cinders based on the final path. A normal chapter costs 4 Cinders to unlock early. One optional ad may award 2 Cinders. A daily return award may grant 1 Cinder up to three times per week.

The exact economy must be tested before launch. Measure frustration, return rate, completion rate, and the percentage of players who can continue without payment after two normal sessions.

Rules:

1. Show the cost before an ad or purchase action.
2. Never remove earned Cinders without a chosen action.
3. Do not interrupt an emotional scene with an ad prompt.
4. Place unlock prompts at chapter boundaries or optional sealed choices.
5. Give one free route forward at launch while retention is still being learned.

## Choice checks

Requirements are visible before selection. A locked choice names the needed stat. The story does not pretend the player could select it.

Checks use fixed thresholds rather than random rolls in core story scenes. This keeps consequences understandable and replayable. Luck may appear in optional events, where failure creates a different scene rather than empty punishment.

## Consequence ledger

Every choice writes one or more state entries.

* Numeric state stores stats, trust, hunger, heat, and currency.
* Boolean state stores facts such as saved Brann or touched the crown.
* Named state stores promises, injuries, romances, titles, and carried items.
* World state stores district control, faction power, and which history is official.

Naming uses clear past tense facts such as `saved_brann` or `broke_first_chain`. Writers should not encode judgment in flag names.

## Oath system for Maelin

From Chapter Three, Maelin can hold three active oaths. Each oath has a promise, a beneficiary, a granted action, a trigger, and a breaking cost.

Example:

Promise: No prisoner dies in my keeping.

Gift: Gain Resolve when protecting a restrained person.

Trigger: Any death of a restrained person in Maelin's current location.

Breaking cost: Gain an Oathscar and unlock one fierce action tied to guilt.

Oathscars are not simple penalties. They create a darker build with different powers and endings.

## Relationships

Do not show a universal approval bar. Track at least Trust, Fear, and Debt separately. A person may trust Maelin's honesty, fear her power, and still owe her a life.

Relationship changes appear through behavior first. The interface may show a brief consequence line, but important shifts must also change dialogue or action.

## Failure

Failure moves the story. It may cause injury, lost time, changed control of a location, a damaged relationship, or a harder route. Reloading should be a player choice, not the expected way to find the correct answer.

Character death is reserved for declared high risk choices, season finales, and endings. If death occurs, it creates a complete ending or passes lasting state into another viewpoint.

## Save model

The vertical slice uses local browser storage and one automatic save. Production should support account based cloud saves, three manual chronicle slots, and a completed chapter replay mode.

Save data should include a schema version, content version, current node, stats, flags, relationships, inventory, currency ledger, and an ordered choice history. Migrations must preserve old decisions when content updates.

## Content data model

Each scene needs an id, viewpoint, location, time marker, body blocks, conditional variants, choices, requirements, state changes, result text, content warnings when needed, and analytics labels.

Story content should remain separate from presentation code so writers can edit and test chapters without changing the interface.

## Balance targets

* Each chapter includes at least one option for two different approaches.
* No core stat remains unused for more than two chapters.
* A player who commits to one style sees unique strength and a meaningful weakness.
* At least 25 percent of scene text changes across a full replay route.
* A season supports at least four materially different end states.
* No single paid choice changes the canonical outcome by itself.

## Analytics with restraint

Track chapter starts, completions, choice ids, locked choice views, retries, exits, Cinder earnings, and unlock actions. Do not collect story input, private text, or unnecessary identity data. Use the information to find confusion and pacing problems, not to force every player toward the most popular choice.
