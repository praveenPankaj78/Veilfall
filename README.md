# Veilfall: The Ember Oath

**Caelan Vey’s complete twelve-chapter adventure**

Veilfall: The Ember Oath is a story-first dark fantasy decision RPG. Caelan Vey travels from the King’s Road beyond Greyhaven to a terminal choice at the Black Gate. The Broken Concord is the wider setting. Rook Sable and Ilyra Fen appear in the story but are not selectable protagonists in this release, and Caelan’s adventure reaches a complete ending without requiring another release.

## Release scope

- Twelve playable Caelan chapters, labelled I through XII from the registered chapter data.
- Persistent consequences, relationship intent and consent boundaries, chapter resources, local checkpoints, lethal outcomes, and four terminal Chapter XII endings.
- A chapter library for replaying unlocked chapters. Replaying an earlier chapter keeps its starting checkpoint and invalidates later chapter snapshots because they depend on the replaced path.
- Fade and Detailed content preferences. Fade keeps every choice and consequence while omitting detailed intimate prose. Detailed requires adult confirmation and does not change outcomes.
- Default, Large, and Extra large text settings that persist in the browser.
- Versioned JSON save export and validated import with a confirmation summary and recoverable pre-import backup.

The story contains dark fantasy violence, blood, injury, possible player-character death, coercive bargains, threats to freedom, and optional consensual adult intimacy. This project does not assign an age rating.

## Saves

Progress is stored locally in the browser. A browser save belongs to that browser and the exact site address, so moving the game to another address does not move the save automatically. Use **Settings, saves, and about** to export a JSON backup before changing browsers or site addresses, and import that backup after the move.

The current browser-save schema is version 17. Portable files use `veilfall-ember-oath-save` export format version 1 and include the current game, relationships and intent, content preference, completed chapters, ending state, replay checkpoints, and reading preference. Import validation occurs before existing progress is replaced.

## Play locally

1. Install dependencies with `npm install` if needed.
2. Start the development server with `npm run dev`.
3. Open the local address printed in the terminal.

The first cover action begins Chapter I immediately. The existing Chapter I estimate is approximately 30 to 40 minutes; total adventure playtime has not been measured.

## Validation

Run the release checks with:

```text
npm run check:story
npm run check:game
npm run check:release
npm run lint
npm run build
```

The project uses the existing Sites registration in `.openai/hosting.json` and the Vinext runtime. Local release work must not replace that registration. See [docs/WEB_RELEASE_READINESS.md](docs/WEB_RELEASE_READINESS.md) for build findings, test coverage, provenance notes, deployment prerequisites, and remaining owner actions.

## Canonical documentation

- `docs/CAELAN_SERIES_REVIEW.md` records the completed twelve-chapter narrative review.
- `docs/NARRATIVE_RULEBOOK.md` defines prose, mystery, choice, romance, intimacy, and location rules.
- `docs/PLAYER_EXPERIENCE_BIBLE.md` defines information pacing, onboarding, recaps, journal design, and comprehension goals.
- `docs/SYSTEMS_RULEBOOK.md` defines resources, relationships, travel, Wayfire, saves, and imported decisions.
- `docs/CROSSOVER_CONTINUITY_LEDGER.md` records protected crossover continuity.
- The chapter map files in `docs/` describe each implemented chapter.

## Credits and provenance status

The release uses the narrative, code, and local artwork present in this repository. The inspected release-facing files do not identify individual creators, provide per-artwork provenance, configure a player-support contact, or contain a repository-supported AI-use disclosure. These missing facts are owner actions and are not replaced with assumptions in the game.
