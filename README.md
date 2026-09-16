# Veilfall: The Ember Oath

**Caelan Vey’s complete twelve-chapter adventure**

Veilfall: The Ember Oath is a story-first dark fantasy decision RPG. Caelan Vey travels from the King’s Road beyond Greyhaven to a terminal choice at the Black Gate. The Broken Concord is the wider setting. Rook Sable and Ilyra Fen appear in the story but are not selectable protagonists in this release, and Caelan’s adventure reaches a complete ending without requiring another release.

## Release scope

- Twelve playable Caelan chapters, labelled I through XII from the registered chapter data.
- Persistent consequences, relationship intent and consent boundaries, chapter resources, local checkpoints, lethal outcomes, and four terminal Chapter XII endings.
- A chapter library for replaying unlocked chapters. Replaying an earlier chapter keeps its starting checkpoint and invalidates later chapter snapshots because they depend on the replaced path.
- Optional romance follows the player's explicit choices, relationship intent, and consent boundaries. Accepting a private encounter uses its single authored passage; conversation and refusal remain valid choices.
- Default, Large, and Extra large text settings that persist in the browser.
- Versioned JSON save export and validated import with a confirmation summary and recoverable pre-import backup.

The story contains dark fantasy violence, blood, injury, possible player-character death, coercive bargains, and threats to freedom. Romance is optional. This project does not assign an age rating.

## Saves

Progress is stored locally in the browser. A browser save belongs to that browser and the exact site address, so moving the game to another address does not move the save automatically. Use **Settings, saves, and about** to export a JSON backup before changing browsers or site addresses, and import that backup after the move.

The current browser-save schema is version 19. Portable files use `veilfall-ember-oath-save` export format version 1 and include the current game, relationships and intent, completed chapters, ending state, replay checkpoints, optional last-choice retry data, and reading preference. Version 16/17/18 portable saves and older browser saves still migrate. Version 18 browser documents remain untouched as a recovery copy when version 19 is first saved. Version 17 documents remain available as an older recovery copy. Retired description-preference fields remain inert; the unused currency is removed from normalized state and exports. Import validation occurs before existing progress is replaced.

## Play locally

1. Install dependencies with `npm install` if needed.
2. Start the development server with `npm run dev`.
3. Open the local address printed in the terminal.

The cover introduces the full twelve-chapter journey: crossing realms, facing armies, bargaining with devils, building relationships, and wielding fire through binding promises. It describes the player’s decisions without requiring knowledge of character or place names. “Start your adventure” begins Chapter I immediately. The existing Chapter I estimate is approximately 30 to 40 minutes; total adventure playtime has not been measured.

## Package the restricted itch.io beta

Run `npm run package:itch` to produce `outputs/veilfall-ember-oath-beta.zip`. This is a separate static browser build: it does not use or replace the Existing Sites registration.

The ZIP has `index.html` at its top level, hashed JavaScript and CSS in `assets/`, and the game artwork in `art/`. Asset URLs are relative so the package can run from itch.io’s uploaded HTML-game subpath. Browser saves remain tied to the exact itch.io game origin, and players can use the in-game Export Save control for backup or transfer.

Build 1.0.1 removes the unused Wayfire reserve throughout gameplay. Oathfire and every chapter remain unchanged. The itch target omits the separate Expected advantage panel, while local development at port 3000 retains it. Immediate costs, requirements, lethal warnings, action details, consent boundaries, and authored consequence tests remain visible or enforced as appropriate. The target is selected at build time, so a local preview of the itch ZIP behaves like its uploaded version.

Updated later-chapter screenshots are in `outputs/itch-scenic-screenshots-1.0.1/` and `outputs/veilfall-scenic-screenshots-1.0.1.zip`. Their actual-playthrough QA saves can be regenerated with `node scripts/create-release-qa-saves.mjs`; use them only in isolated test storage. Responsive checks cover 320-pixel portrait through wide desktop, including Extra large text and short landscape. Physical Android gameplay remains unverified because the tool blocked the USB preview setup; iPhone Safari still needs testing.

Packaging fails if unexpected files, source maps, development entries, or local user paths are found. Only approved runtime paths are accepted; the repository, TypeScript/TSX sources, tooling, environment files, hosting configuration, and internal documents are not shipped. Run `npm run check:itch-package` to audit the actual ZIP and test the rejection rules. Third-party notices are not treated as private source and must be retained where required.

This is not code secrecy: players receive compiled JavaScript, HTML/CSS, all playable story content, and artwork. Those files can be inspected, copied, or reverse-engineered in browser tools, even without a download button. Minification and disabled source maps do not encrypt them. Never put secrets or unreleased confidential content in a client build. See [docs/ITCH_PACKAGE_AUDIT.md](docs/ITCH_PACKAGE_AUDIT.md) for the audit scope and limitations.

Run `npm run preview:itch` to rebuild and serve the static package beneath `/veilfall-beta/`, which exercises the same subpath-relative asset behavior expected from an uploaded HTML game.

For local play, keep that command running and open `http://127.0.0.1:4174/veilfall-beta/`. Do not double-click `itch/index.html`: it is source code and Chrome cannot run it using `file://`. The source and packaged pages now explain this instead of appearing to load indefinitely.

The packaged loading bar measures the actual bytes downloaded for the game JavaScript and CSS, then shows “starting game” while React initializes. Artwork loads as needed and is not included in that percentage. Failed downloads and 30 seconds without progress show a Retry control. For slow-transfer preview testing, set `ITCH_PREVIEW_CHUNK_DELAY_MS=100` before running the preview script.

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
- `docs/SYSTEMS_RULEBOOK.md` defines resources, relationships, travel, free chapter progression, saves, and imported decisions.
- `docs/CROSSOVER_CONTINUITY_LEDGER.md` records protected crossover continuity.
- The chapter map files in `docs/` describe each implemented chapter.

## Credits and provenance status

The release uses the narrative, code, and local artwork present in this repository. The inspected release-facing files do not identify individual creators, provide per-artwork provenance, configure a player-support contact, or contain a repository-supported AI-use disclosure. These missing facts remain owner actions documented here, rather than technical notices in the player’s Settings. No creator or ownership claims have been invented.
