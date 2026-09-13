# Crossover Continuity Ledger

This ledger is the canonical route check for every playable chapter. Update it before drafting a new crossover or moving a hero to a new region.

## Current chronological spine

1. Rook Chapter One begins on the morning Caelan's sealed route is altered. A pulse from the damaged Nail of Distance opens the Greyhaven river archive for one breath.
2. Rook Chapter Two follows his flight through the King's Road night market.
3. Caelan Chapter Four and Rook Chapter Three show the same Mileless Bridge crisis from different viewpoints.
4. At the final stable arch, Caelan takes the real fragment north toward Dragonspine. Rook takes his copied route down into the Underways.
5. Caelan Chapters Five through Nine continue through Dragonspine, the Ember Steppe, the Black Gate, and the first crossing into the Cinder Deep. Rook is not physically present.
6. Rook continues through the Underways, Brassreach, Serekh, the Unsea, and the Luminous Court.
7. Rook first meets Ilyra in Serekh. They meet again in the Unsea.
8. Caelan's changed sunrise reaches Rook later in his series and alters his approach to the Luminous Court. It does not launch Rook's story.

## Approved presence windows

- Caelan Chapter Four, Mileless Bridge: Rook enters by stealing the Distance fragment during the Harrowfen escape. He exits through the Underways at the final stable arch.
- Caelan Chapters Six and Seven, Ember Steppe: Ilyra enters while investigating the ancestor storm. She exits by another route after tracing the hidden thread.
- Rook Chapter Three, Mileless Bridge: Caelan enters by cornering Rook during the bridge collapse. He exits north with the real fragment.
- Rook in Serekh and the Unsea: Ilyra enters when their investigations seek the same altered law. Each exits with a different part of the answer.

## Route exit rules

1. A crossover changes relationships and world state, but does not merge routes by default.
2. Every visiting hero needs a visible arrival, personal objective, exit, and next destination.
3. A debt, clue, tool, wound, or promise may remain after a hero leaves. Later prose must describe it as a legacy, not as physical presence.
4. The next chapter may include one short reminder of the road an absent hero took. After that reminder, the absent hero cannot speak, move, or perform a new action from off route.
5. The active protagonist keeps the decisive action in the chapter.
6. Two playable heroes cannot meet before the first meeting recorded here.
7. If a new plot requires an extra meeting, update this ledger, the world map, and both series outlines before writing the scene.

## Protected protagonist plot lines

### Caelan

Caelan keeps the real Distance fragment after the Mileless Bridge, reaches Dragonspine, becomes the bearer of Vaor's ember through freedom, force, or pact, earns or refuses steppe and Crown forces, and defends the Black Gate through one of three strategies. He controls how Vexa's embassy is first heard, recovers the missing Black Gate Nail piece through bargain, theft, or exposure, and crosses into the Cinder Deep. Rook's departure cannot remove any of these decisions.

### Rook

Rook keeps a complete or partial map copy and the arrest, bargain, or trust relationship created with Caelan. He follows the buyer and Senna trail through the Underways, Brassreach, Serekh, the Unsea, and the Luminous Court. Leaving Caelan's road protects this plot rather than delaying it.

The split also fixes what Rook leaves behind. Arrest and bargain routes leave a marked mirrored coin. The bargain warning is spoken before departure. The trust route leaves silver wire around black wax showing one hidden royal camp entrance. These are legacy objects only. Rook performs no new action on Caelan's Dragonspine route.

### Ilyra

Ilyra meets Caelan on the Ember Steppe while tracing the ancestor storm, then leaves by her own route with the knowledge and relationship state she earned. Her independent story continues through Dragonspine, Serekh, the Unsea, and Worldroot. She first meets Rook in Serekh, not during Caelan's steppe chapters.

## Automated authority

`scripts/continuity-contract.mjs` is the machine readable version of this ledger. The full game graph check now protects:

1. Every implemented chapter entry, ending, and next chapter handoff.
2. The required plot terms carried through the Mileless split, Dragonspine, the Ember Steppe, the Black Gate, and the first embassy.
3. Approved visiting heroes and legacy only heroes for each chapter.
4. The first named introduction of every visiting playable hero.
5. The three canonical world routes.
6. The absence of active Rook choices after his Underways exit.
7. Flag lifecycle classification: choice mechanics, declared active complications or reactions, and exact future contracts count as consumers; journals, final summaries, and duplicate producers do not.
8. Paid choices need a later playable consequence beyond summary prose, and a free sibling cannot deliver the same result without earned preparation.
9. Every Chapter Eight ending carries exactly one explicit deployment selected before the independent counterorder.
10. Chapter Seven losses alter Chapter Eight staffing, options, costs, or results; they cannot survive only as an arrival receipt.
11. Chapter Eight evidence-loss combinations preserve the distinction among originals, authenticated copies, living bark, witnesses, forgeries, duplicates, and foreign contracts.
12. Personal watch choices receive a later Gate reaction before the Oath price is chosen.
13. Chapter Nine keeps Vexa's three entry locations physical until a visible transition occurs.
14. Every Chapter Nine route separately proves Malrec's mortal cell and House Sableglass before joining their evidence.
15. Oathfire clause cuts destroy one named active Oath, and released or burned Oaths never return as payment.
16. Fade and detailed intimacy prose produce identical story flags, information, relationships, and later choices.
17. Every Chapter Nine ending carries its defence route, surviving Oaths, Vexa relationship, evidence source, and voluntary ally roster into Chapter Ten.

Exact post-implementation contracts are also machine readable. Rook begins the Underways with only his last mirrored coin if two were destroyed on the bridge. A destroyed Dragonspine drill must be rebuilt before any later extraction. Vaor's memory-repair duty must be paid before later memory, testimony, or power cooperation. Preserved ancestor voices must be tested in the first Unsea investigation. A Kharad service debt gives the Red Moot one bounded post-Gate claim before the Crown can use it, and archived Orivane proof gives an independent Kharad custodian standing at the first Crown hearing. Hale's last-known-alive record proves neither death nor survival. Chapter Nine preserves Vexa's exact entry location and whether Ansel already received the first question. Chapter Ten must consume the exact Gate Nail recovery route, true-name access limit, surviving Oaths, evidence provenance, Vexa relationship, Vaor state, and ally roster before any new bargain can replace them.

Changing a protected route or crossover requires changing the design documents and the machine contract deliberately. An accidental prose edit will fail validation.

## New chapter checklist

Before a chapter is accepted, answer these questions in its chapter map:

1. Whose route is this?
2. Which playable heroes are physically present?
3. Which earlier choices arrive only as memories, tools, debts, or information?
4. Where does every visiting hero leave, and what is that hero's next canonical location?
5. Does any choice give a visiting hero work that belongs to the active protagonist or a current local companion?
6. Does the automated graph check reject an unapproved hero name, choice identifier, or active action in this chapter?
