# Veilfall: The Crown Below

Veilfall is an original, story first dark fantasy decision RPG. The player takes the role of Maelin Vey, a disgraced royal oathkeeper accused of murdering a king who is still alive.

This project includes a playable first chapter, branching consequences, persistent local saves, character stats, Cinders as a future unlock currency, three chapter endings, and original scene art.

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

## Creative status

Chapter One is a vertical slice. It proves the reading experience, branching structure, stat gates, currency loop, save behavior, chapter hooks, and the first shared character intersection. The wider series plan is defined in the documents but intentionally not hard coded yet.

All story, world, character, and lore material in this repository was created for Veilfall.
