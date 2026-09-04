# Veilfall: The Crown Below

Veilfall is an original, story first medieval fantasy decision RPG. The first series follows Caelan Vey, a respected royal oathkeeper whose ordinary escort duty is broken by an attack planned by someone using his face, voice, seal, and handwriting.

The project includes a playable first chapter, branching consequences, persistent local saves, character resources, Cinders as a future unlock currency, three chapter endings, and original scene art.

## Play locally

1. Open a terminal in this folder.
2. Run `npm install` if dependencies are not already present.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

The game saves progress in the browser on the current device. Use Restart inside the game to clear the save and test another route.

## Project map

* `app/game-data.ts` contains the playable chapter graph and story text.
* `app/page.tsx` contains the choice engine, save system, character sheet, and player interface.
* `public/art` contains original game artwork.
* `docs` contains the creative vision, world bible, character bible, narrative rules, systems rules, and development roadmap.

## Current creative scope

The shared saga has four playable leads, three men and one woman. Each has a clear problem solving style and a resource cost unique to the class. Their stories intersect at a few major events, while most chapters remain focused on one lead and one understandable goal.

Chapter One is a vertical slice. It establishes Caelan’s normal life, his work, his relationship with Mara Renn, the choice system, class resources, one central mystery, and the first three consequences of that mystery.

All story, world, character, and lore material in this repository was created for Veilfall.
