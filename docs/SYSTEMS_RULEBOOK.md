# Systems Rulebook

## Design goal

Systems should make the player feel the protagonist's method and its cost. They support the story rather than interrupt it with constant arithmetic.

## Shared character states

Each protagonist tracks:

- Vitality: physical condition. Zero causes injury, capture, or a costly rescue rather than an unexplained restart.
- Morale: willingness to continue. It affects desperate choices and recovery.
- Coin: ordinary purchases, bribes, lodging, and supplies.
- Wayfire: account level progression currency used for optional paths, preparations, and future early access.
- Reputation: separate values for major regions and factions.
- Bonds: named relationship states with trust, attraction, respect, and conflict flags.
- World state: the condition of each Nail, route, people, and imported finale.

## Class economies

### Caelan

- Stamina starts at 8 and fuels physical actions.
- Resolve starts at 6 and resists fear, pain, and manipulation.
- Oathfire begins locked. Swearing a meaningful Oath fills it.
- Medicine records the strongest healing supplies currently available to the escort. The player learns every eligible patient and likely immediate result before spending it.
- Active Oaths are named duties with success and breach conditions.
- Oathscars record broken promises and alter powers, dialogue, and ending options.

Recovery:

- Stamina returns through food, rest, medicine, or surrendering the pace of pursuit.
- Resolve returns through honest connection, completed duties, and accepting help.
- Oathfire returns only by advancing an active Oath or freely accepting a new cost.

### Rook

- Dexterity starts at 8 and fuels movement, locks, sleight of hand, and escape.
- Focus starts at 7 and fuels disguise, planning, and illusion.
- Heat starts at 0 and rises when evidence, witnesses, or patterns point toward Rook.
- Echoes record lives borrowed through Glimmer. Some provide knowledge while others distort identity.

Recovery:

- Dexterity returns through rest and safe equipment maintenance.
- Focus returns through sleep, honest conversation, and time without maintaining a persona.
- Heat falls when Rook changes region, destroys a clue, frames a credible rival, or accepts a faction debt.

### Ilyra

- Mana starts at 9 and fuels prepared magic.
- Strain starts at 0 and rises when she forces spells or works without preparation.
- Memory Shards are named memories, not anonymous points.
- Corruption marks record magic performed through a true name without permission.

Recovery:

- Mana returns through rest, ritual, nourishing food, and safe emotional connection.
- Strain falls through sleep, grounding, or sharing the magical burden.
- Spent Memory Shards do not return automatically. A rare recovery always changes the memory or costs something else.

## Visible cost rule

Before selecting a choice, the player sees relevant changes in plain language, such as:

- Costs 2 Stamina
- Gains 1 Heat
- Risks a Memory Shard if the ward breaks
- Creates the Oath: Bring every survivor to the Gate

Exact downstream plot consequences remain unknown, but immediate mechanical costs do not.

## Checks and failure

Most choices do not roll. If the player has the required resource, skill, item, or relationship, the action succeeds and its cost applies.

Uncertain checks are reserved for moments when risk itself is dramatic. The game shows the likely range rather than a hidden percentage. Luck can shift the result, but never erases a carefully built advantage.

Failure moves the story forward through injury, lost time, increased Heat, damaged trust, altered routes, or a harder objective. It does not repeat the same passage.

## Wayfire economy

Wayfire is an optional progression currency. The fiction treats it as the warmth left when a person makes a choice they cannot take back.

Recommended launch rules:

- Main story chapters continue freely during the foundation arc. The player keeps all earned Wayfire.
- Wayfire can unlock optional scenes, preparations, alternate approaches, and future early access without changing consent or moral outcomes.
- Optional discoveries, difficult class solutions, and replay milestones grant reserve Wayfire.
- Ads may later grant bonus Wayfire, but no player should be forced to repeat content or choose a worse story outcome to continue.
- Currency is never spent inside a choice to purchase moral superiority, romance, consent, or survival.
- Premium purchase and ad rewards must use the same clear conversion rate.
- The player can preview optional content before deciding whether to spend Wayfire on it.

This keeps monetisation attached to optional access and preparation rather than narrative integrity. A later release may test chapter early access, but a completed chapter must always provide a clear free continuation path.

## Luck

Luck is a rare consumable capped at 3. It can:

- turn a costly failure into success with a complication;
- reveal an extra class approach;
- preserve one resource point after a dangerous action.

Luck cannot force affection, reverse a final world decision, or replace a missing required alliance.

## Relationship state

The playable Caelan foundation currently tracks two independent values for Mara and Lysara:

- Trust: belief that the protagonist will act honestly or reliably.
- Attraction: physical and romantic interest.

Later relationship depth can add two further values when the story begins testing long term commitment:

- Respect: belief in competence and values.
- Friction: unresolved hurt, rivalry, or conflicting aims.

High attraction alone can allow consensual temporary intimacy when context supports it. Commitment requires trust and respect. Friction can make flirtation sharper, but high friction also creates boundaries the protagonist must respect.

## Travel system

At each major departure, the player chooses a route or travel preparation. The choice may affect:

- time elapsed;
- supplies and Coin;
- class resources at arrival;
- companion presence;
- faction encounters;
- which local crisis has worsened.

Travel passages include at least one decision or relationship beat. Avoid empty summaries and random encounters with no later consequence.

## World Nail states

Each Nail has one of five states:

- Stable: the local law works normally.
- Frayed: strange effects appear but remain limited.
- Open: the local law can be manipulated.
- Broken: the failure changes the region permanently.
- Rewritten: a protagonist or faction has installed a new law.

Chapter data reads these states to select descriptions, routes, creatures, and ending options.

## Imported decisions

On starting a later series, the player may import a completed local save. If no save exists, the game offers three short world state questions with clear summaries.

Imported choices change circumstances, never basic comprehension. For example, Rook Chapter One always begins with locks opening, but the reason and duration depend on Caelan's Gate ending.

## Save model

Save after every choice. Store:

- current series, chapter, and passage;
- shared and class resources;
- named Oaths, Oathscars, Echoes, Memory Shards, and corruption marks;
- inventory and route state;
- faction reputation and relationship values;
- Nail states and regional outcomes;
- content preference for detailed intimacy or fade;
- completed finale summaries for import.

Use versioned migrations so later content updates do not invalidate long term saves.

### Chapter replay

Every unlocked chapter stores a chapter start snapshot. Replaying Chapter Four loads the snapshot created after Chapter Three: all Chapter One through Three choices, resources, relationships, and world effects remain exactly as they were. The replayed chapter starts fresh, so its choices, rewards, injuries, and points overwrite its previous result when the player finishes it again.

Replaying an earlier chapter invalidates every later chapter snapshot and result. Those later events were created by the old path and cannot remain true after its cause changes. The chapter library tells the player this before replay begins.

## Choice data shape

Every authored choice should include:

- visible intent label;
- optional class identity tag;
- visible immediate cost;
- requirements;
- state changes;
- consequence passage;
- memory text used in later callbacks;
- analytics identifier unrelated to prose wording.

## Balance rules

1. A class resource should matter at least twice per chapter.
2. No chapter should punish every use of the protagonist's signature ability.
3. At least one difficult problem should reward preparation from an earlier chapter.
4. Low resources create altered approaches, not dead ends.
5. Romance does not grant the universally strongest route.
6. Regional alliances should be as valuable as personal power in the final chapters.
7. Grand power always increases the scale of responsibility.
