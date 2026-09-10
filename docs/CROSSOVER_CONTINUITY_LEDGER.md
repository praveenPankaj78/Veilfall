# Crossover Continuity Ledger

This ledger is the canonical route check for every playable chapter. Update it before drafting a new crossover or moving a hero to a new region.

## Current chronological spine

1. Rook Chapter One begins on the morning Caelan's sealed route is altered. A pulse from the damaged Nail of Distance opens the Greyhaven river archive for one breath.
2. Rook Chapter Two follows his flight through the King's Road night market.
3. Caelan Chapter Four and Rook Chapter Three show the same Mileless Bridge crisis from different viewpoints.
4. At the final stable arch, Caelan takes the real fragment north toward Dragonspine. Rook takes his copied route down into the Underways.
5. Caelan Chapters Five through Eight continue through Dragonspine, the Ember Steppe, and the Black Gate. Rook is not physically present.
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
4. The active protagonist keeps the decisive action in the chapter.
5. Two playable heroes cannot meet before the first meeting recorded here.
6. If a new plot requires an extra meeting, update this ledger, the world map, and both series outlines before writing the scene.

## Protected protagonist plot lines

### Caelan

Caelan keeps the real Distance fragment after the Mileless Bridge, reaches Dragonspine, becomes the bearer of Vaor's ember through freedom, force, or pact, earns or refuses steppe and Crown forces, defends the Black Gate through one of three strategies, and controls how Vexa's embassy is first heard. Rook's departure cannot remove any of these decisions.

### Rook

Rook keeps a complete or partial map copy and the arrest, bargain, or trust relationship created with Caelan. He follows the buyer and Senna trail through the Underways, Brassreach, Serekh, the Unsea, and the Luminous Court. Leaving Caelan's road protects this plot rather than delaying it.

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

Changing a protected route or crossover requires changing the design documents and the machine contract deliberately. An accidental prose edit will fail validation.

## New chapter checklist

Before a chapter is accepted, answer these questions in its chapter map:

1. Whose route is this?
2. Which playable heroes are physically present?
3. Which earlier choices arrive only as memories, tools, debts, or information?
4. Where does every visiting hero leave, and what is that hero's next canonical location?
5. Does any choice give a visiting hero work that belongs to the active protagonist or a current local companion?
6. Does the automated graph check reject an unapproved hero name, choice identifier, or active action in this chapter?
