# Systems Rulebook

## Design goal

Systems make story choices feel remembered. Every powerful method has a cost. Numbers support character identity and consequence without turning reading into constant arithmetic.

## Shared structure

Each lead has:

* one physical or magical resource spent on strong actions
* one mental control resource
* one skill or preparation resource
* relationship state appropriate to the scene
* Cinders as the shared chapter currency

Resources usually range from 0 to 6. A chapter begins with enough power to make several strong choices, but not every strong choice. Restoring a resource requires time, safety, food, treatment, honesty, or another action that has its own opportunity cost.

## Caelan’s resources

### Stamina

Powers shield charges, difficult climbs, forced movement, endurance, and taking a blow for another person. Heavy physical choices cost 1 or 2 Stamina. At zero, Caelan remains playable but cannot select actions that demand force or protection until he rests or receives treatment.

### Resolve

Powers command, resistance to fear, calm under pain, and later oath abilities. Keeping a difficult promise may restore Resolve. Breaking an active oath reduces it and creates an Oathscar with a different ability path.

### Insight

Represents tactical observation and preparation. The player earns it by checking equipment, studying people, or delaying action to understand a scene. Strong plans spend Insight because they use the prepared advantage.

### Rapport

Represents practical trust with the people in the current arc. It grows through honesty, humor, care, delegation, and respect for another person’s skill. Later production should split it into named relationships rather than one universal value.

### Oath slots

From Chapter Three, Caelan can hold three active promises. Each oath grants a clear ability and a clear duty.

Example:

Promise: No member of my escort is left behind.

Gift: Spend one less Stamina when rescuing a guard.

Trigger: Leaving a living escort member in known danger breaks the oath.

Breaking cost: Lose Resolve and gain the Oathscar ability Ruthless Retreat.

## Rook’s resources

### Dexterity

Powers stealth, climbing, escape, lock work, pickpocketing, and precise attacks. Injury, restraint, exhaustion, and carrying heavy objects reduce it. A failed Dexterity path changes position or raises Heat instead of simply ending play.

### Focus

Powers illusions. A false sound costs 1 Focus. A still visual disguise costs 1 or 2. A moving human figure costs 3 and demands concentration. Taking damage or maintaining another complex action may break the illusion.

### Heat

Measures attention from law officers, rivals, and the Lantern Court. Heat is not spent. Risky theft and recognizable tricks raise it. Laying low, planting a false trail, or paying a contact reduces it.

## Ilyra’s resources

### Mana

Powers wards, lenses, threads, and Glassforms. Small spells cost 1 Mana. Strong area effects cost 2 or 3. Mana returns through sleep, prepared focus stones, food, and calm concentration.

### Memory shards

Power rare spells that affect identity, history, or perception. Creating a shard removes a specific memory from Ilyra until she breaks the shard and gives up its stored spell. The interface names the memory before the player spends it.

### Strain

Rises when Ilyra casts without enough Mana or maintains several spells. High Strain causes tremors, sensory mistakes, and unreliable magical evidence. Rest and medical help reduce it.

## Orren’s resources

### Control

Keeps human judgment in charge during transformation. Anger, pain, deliberate shifting, and concealed violence consume Control. At low Control, physical power increases while dialogue, restraint, and fine movement become harder.

### Change

Measures how far Orren has transformed. Higher Change grants scent, speed, healing, and strength. Returning toward human form requires safety, familiar voices, or a chosen grounding action.

### Scent marks

Orren can hold a limited set of detailed scent memories. Marking a person, place, substance, or emotional trace occupies one slot. Comparing the right marks opens investigative conclusions. Replacing a mark means giving up older evidence.

## Cinders

Cinders are the shared narrative currency earned at chapter endings and selected rare discoveries.

Cinders can unlock:

* an optional memory scene
* an alternate problem solving route
* a romantic interlude that adds depth but no required plot fact
* a viewpoint echo from another lead
* early access to the next chapter

Cinders never purchase a required good ending. Free choices always support a complete story. Paid or ad earned Cinders buy breadth, speed, replay value, and extra context.

## Currency economy

The first chapter is free and awards 3 to 5 Cinders. A normal chapter may cost 4 Cinders to unlock early. One optional rewarded ad may grant 2 Cinders. Final values require player testing.

Rules:

1. Show the cost before an ad or purchase.
2. Never remove earned Cinders without a chosen action.
3. Never interrupt danger, grief, romance, or intimacy with an ad prompt.
4. Place unlock prompts at chapter boundaries or optional sealed scenes.
5. Keep at least one complete free route while retention is being tested.
6. The full detail and early fade romance settings have the same price and rewards.

## Choice checks

Requirements are visible before selection. A locked choice names the needed resource. Core story checks use fixed thresholds rather than random rolls, so players understand why an option is available.

A choice may both require and spend a resource. Requirement text means Caelan must have enough Stamina to attempt the action. The consequence preview tells the player how much will be spent.

## Failure

Failure moves the story. It may cause injury, lost time, higher Heat, lower Control, damaged trust, lost evidence, or a harder route. Reloading is a player choice, not the expected way to discover a correct answer.

Character death is reserved for declared high risk choices, season finales, and endings. Death creates a complete ending or lasting state for another viewpoint.

## Relationships and romance

Production relationship state tracks Trust, Attraction, Fear, and Debt separately. Flirting can raise Attraction while lowering Trust if used to avoid honesty. Protecting someone may raise Trust and Fear at the same time.

An intimate scene requires:

* all involved characters are at least twenty-five
* mutual Attraction and sufficient Trust
* no active captivity, magical compulsion, medical dependency, or direct command pressure
* an explicit player choice to continue
* a content setting for full detail or earlier fade

Intimacy changes conversation, trust, vulnerability, and later decisions. It does not grant combat power by itself.

## Save model

The vertical slice uses one automatic browser save. Production supports cloud saves, three chronicle slots, completed chapter replay, a schema version, content version, resource state, relationships, inventory, currency ledger, and ordered choice history.

## Content data model

Each scene needs an id, viewpoint, location, time marker, body blocks, conditional variants, choices, requirements, resource changes, result text, content settings, and analytics labels.

Story content remains separate from presentation code so writers can test chapters without changing the interface.

## Balance targets

* Every chapter supports at least two class approaches.
* A strong class action always spends or risks something.
* No core resource remains unused for more than two chapters.
* Committing to one style creates both strength and a meaningful weakness.
* At least 25 percent of scene text changes across a full replay route.
* A season supports at least four materially different end states.
* No purchase changes the canonical outcome by itself.
