# Web release readiness

Date reviewed: 2026-09-15  
Release build: 1.0.0  
Target: the existing OpenAI Sites project and its supported Vinext/Cloudflare runtime

## Readiness decision

The game build is release-capable for an Existing Sites deployment: the complete twelve-chapter path builds, resumes, exports a versioned save, validates imports, preserves replay checkpoints, and reaches four terminal Chapter XII endings without a dead continuation control.

Deployment is currently blocked at the hosting handoff, not in the game build. The preserved project ID in `.openai/hosting.json` is `appgprj_6a9db5a364748191829edd69a501dec8`, but the Sites service returned **Sites project not found** when that exact registration was inspected. This review did not create a replacement project or publish anything. The owner must restore access to or correct the existing registration before deployment.

Public distribution also needs a stable production address. Browser storage is origin-bound, so changing the scheme, host, or port does not move a save. Players should be told to export before any address change. A configured HTTPS `NEXT_PUBLIC_SITE_ORIGIN` may be supplied at deployment to enable the existing artwork as an absolute social-sharing image; no canonical or production URL is invented in source.

## Release identity and presentation

- Title: **Veilfall: The Ember Oath**.
- Release scope: **Caelan Vey’s complete twelve-chapter adventure**. The player-facing cover introduces it as **A complete adventure in 12 chapters**.
- The Broken Concord is presented as the wider setting, not the product title.
- Rook and Ilyra remain independent story characters and are not selectable protagonists.
- The cover, browser metadata, Open Graph/Twitter metadata, favicon, chapter header, chapter library, About area, package identity, and README now describe the complete release.
- Chapter presentation is derived from the twelve registered chapter definitions, including Roman numerals XI and XII and current completion/checkpoint counts.
- The only player-facing playtime claim is approximate and limited to Chapter 1: about 30–40 minutes. Total adventure playtime remains unmeasured and is not advertised.
- Chapter XII presents Caelan’s terminal ending and replay access; it does not imply that another release is needed to finish the story.

The opening remains one action from Chapter I. No registration, tutorial gate, promotion, account, cloud sync, payment, or database was added.

## Save architecture and compatibility

Browser progress is stored as one atomic document under `veilfall.saga.v17.save`. It includes the current `GameState`, chapter-start checkpoints, and reading preference, avoiding a new partial state split. Storage access and migrations are centralized in `app/save-system.ts`.

Portable files use:

- format: `veilfall-ember-oath-save`;
- export version: 1;
- save schema: 17 (schema 16 imports are migrated);
- maximum import size: 1,000,000 bytes;
- filename beginning `veilfall-the-ember-oath-save-` and ending `.json`.

Exports contain the current state, stats, relationship scores and intent, consent-boundary flags, completed chapters, terminal ending state, story history, chapter-start checkpoints, reading preference, build version, and export time. Retired `contentPreference` fields remain serialized for v16/v17 compatibility only; they no longer affect prose or choices. They do not use an account or network service.

Validation completes before storage changes. It covers file size; JSON and object shape; format/export/schema versions; timestamps; required types; stat integer bounds; chapter/node agreement; relationship structure and intent; arrays and preferences; node/choice validity; completed chapters; and checkpoint entry, prefix, decision-count, flag, completion, and current-path consistency.

A valid import first shows chapter, completed count, checkpoint count, ending state, and export time. Cancel leaves current progress untouched. Confirmation writes the existing atomic document to `veilfall.saga.v17.pre-import-backup` before replacement, and the UI can restore that backup. If backup creation or replacement fails, replacement is aborted and the prior current document remains. A damaged current save is left in place, reported visibly, and can be downloaded or copied to a separate recovery key; autosave stays blocked until the player explicitly starts fresh. Errors never claim a successful write and offer retry or current-session export as appropriate.

Existing keys from Chapter One v2/v3 and saga v4 through v16 are migrated using the established stamina-to-health, relationship intent, Chapter IX roster, final relationship, and Oath correction rules. Compatible legacy per-chapter checkpoints are folded into the atomic v17 document; invalid ones are excluded with a visible warning.

## Reading and accessibility controls

- Persistent Default, Large, and Extra large settings apply at the document root to story prose, choice labels/details/advantages/costs, immediate results, lessons, journal, chapter library, settings, and endings.
- Layout guards permit wrapping and remove narrow-screen minimums; status rows, chapter entries, dialog controls, and save controls reflow without horizontal scrolling at the tested 390×844 viewport.
- Story measure, paragraph spacing, and line height remain constrained for readable prose.
- Keyboard focus is a visible 3 px outline. Header icon buttons have accessible names, and mobile action targets are at least 44 px.
- Native buttons and accessible Sheet/AlertDialog components provide keyboard operation, initial dialog focus, Escape behavior, and focus restoration. Hidden file input is removed from tab order.
- Choosing a story action moves focus to the next scene heading with `preventScroll`, then scrolls the scene into view. New scenes use one polite live-region update rather than announcing the entire interface repeatedly.
- The retired description selector and player-adulthood checkbox are absent. Story choices still express affirmative consent, conversation, and refusal with visible labels.
- Static advantage labels and disabled-state wording avoid depending on hover or color alone.
- `prefers-reduced-motion: reduce` disables nonessential animation and smooth scrolling.
- Touch targets, wrapping, high zoom behavior, and mobile choice cards received targeted CSS changes without a broad redesign or edits to the unrelated modified UI primitives.

No automated accessibility scanner or real screen-reader session was available. The semantic tree, keyboard flow, focus movement/restoration, labels, live regions, 390×844 responsive viewport, and visible screenshots were inspected directly in Chromium.

## About, content, privacy, and diagnostics

The in-game About area states the twelve-chapter scope, dark fantasy violence, blood, injury, possible player-character death, coercive bargains, and threats to freedom. It says romance is optional without advertising adult scenes or a description setting. No age rating is invented.

The release displays build 1.0.0. Players can add a description, inspect, and copy a bug report containing build, chapter, node ID, browser user agent, language, viewport, and text setting. It automatically excludes relationships, flags, history, and save data. There is no feedback button or placeholder address because no real support destination is configured.

A source audit found no player-facing analytics, advertising, email collection, account service, database, or application fetch to a third-party service. Runtime requests observed in preview were same-origin HTML, JavaScript, CSS, favicon, framework image handling, and local `public/art` assets. No consent banner was added. Wrangler may report its own development CLI telemetry when running the local preview; that is not an application integration shipped in the player UI.

The direct dependency/license inventory is recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Release-facing files do not support claims about individual creator credits, per-artwork provenance, or AI use, so those remain owner-supplied facts.

## Production build findings

- `npm run build` produces the Vinext worker and client output expected by the existing `npm run start` Wrangler preview.
- The production preview returned 200 for the page, JavaScript, CSS, favicon, and local art; the framework image route redirected to a same-origin asset as expected.
- No release asset references a local machine path. Favicon and artwork paths are root-relative.
- Initialization uses a visible loading state and exits it even when reading storage fails. A recoverable error replaces a silent blank page.
- Only the current scene’s first art image receives eager priority; later scene images are lazy and include responsive `sizes` hints. System fonts avoid a blocking external font request.
- No development-only story controls, placeholder feedback destination, analytics, or inactive D1/R2 integration is exposed. `.openai/hosting.json` still has `d1: null` and `r2: null`.
- A large client chunk warning remains. After the single-passage follow-up, the client page bundle measured 1,337,494 bytes uncompressed and 391,742 bytes with gzip because the complete branching narrative is bundled with the application. Targeted image loading and initialization improvements were made, but risky chapter-level lazy loading was not introduced without evidence that it would preserve save/node availability and improve the first playable scene. This warning is a performance follow-up, not a functional build failure.

The preview was not run with a deterministic network throttle. Request behavior and loading fallbacks were inspected, but slow-network timing is not claimed as passed.

## Restricted itch.io beta package

First-player copy review: the cover introduces the entire twelve-chapter journey through shifting roads, armies, devil bargains, relationships, and fire powered by binding promises. It connects those choices to survival, the gate between worlds, and the player’s personal ending, without requiring knowledge of character names. Its action reads “Start your adventure”; the short instruction explains reading, choosing, Chapter 1 time, and browser saving. All twelve library summaries now describe their situations without relying on unfamiliar names. Settings explains text size, saves, and the complete story in plain language. Internal provenance/contact gaps and explanations of unselectable protagonists were removed from the player UI; the factual owner actions remain in this document. Bug-report details are available under “See what the report includes,” with a “Copy report” action and no placeholder destination.

A separate static browser target is available through `npm run package:itch`. It produces `outputs/veilfall-ember-oath-beta.zip` without changing the Existing Sites configuration. The archive contains `index.html` at its top level, hashed client files under `assets/`, all 41 repository artwork files under `art/`, and the favicon.

The static entry reuses the same game page, save system, accessibility UI, and CSS. A small `next/image` compatibility component emits ordinary lazy/eager `<img>` elements and converts repository-root artwork paths to paths relative to the uploaded `index.html`. Vite also uses `base: './'`, so script, stylesheet, artwork, and favicon requests work beneath an HTML-game subpath rather than assuming the origin root.

The package command validates the required top-level entries, rejects root-absolute references in generated `index.html`, writes the ZIP, and decompresses every entry in memory to confirm its byte length. `npm run preview:itch` serves the build at `/veilfall-beta/` for a subpath smoke test. The final browser pass loaded the cover and artwork, began Chapter I, made a choice, refreshed, and resumed the saved scene from that nested path.

This package has not been uploaded to itch.io and does not configure the game’s itch.io visibility or audience.

Loading follow-up: the browser package now streams its JavaScript and CSS with a percentage based on actual decoded bytes and build-recorded file sizes. At 100% it reports game initialization; artwork loads separately during play. A failed request or 30 seconds without progress exposes Retry. An inline message explains that opening source HTML through `file://` needs the local preview server. Run `npm run preview:itch` and visit `http://127.0.0.1:4174/veilfall-beta/`.

The updated loader was verified in the normal local browser preview and a deliberately slowed local transfer (32 KiB chunks with 250 ms delay): visible 1% and 41% states progressed to the playable cover. `node scripts/check-itch-loader.mjs` verifies byte percentages, the local-file guard, HTTP failure recovery, and a stalled-transfer timeout. The browser automation policy prevented navigating directly to `file://`, so that explanation was verified in source and the guard in the regression, not visually in Chrome. The Existing Sites build does not use this static loader.

## Single-passage romance follow-up — 15 September 2026

At the owner's request, removed the Fade/Detailed selector, player-adulthood checkbox, associated `StoryNode` UI hook, and explanatory settings copy. The cover and About area do not advertise adult scenes or this retired setting. The three existing fuller passages (Vexa in IX; Mara or Lysara in X) are unchanged and now render whenever their explicit intimacy choice has been taken. No new intimate prose was authored.

Every choice ID, result, relationship update, consent-boundary flag, prerequisite, conversation/refusal alternative, and subsequent route remains unchanged. In particular, romance does not automatically imply consent to a private encounter. Existing relationship and Oath review corrections remain intact. The save schema stays at 17 and export format at 1; legacy `contentPreference` data is retained only for compatible imports, exports, and checkpoints, with no effect on rendering or mechanics.

Focused regressions cover all three passages across all four legacy field combinations and both supported import schemas (24 import/render comparisons), absence of the retired UI, platonic and conflicting-commitment restrictions, required danger/limit/crossing flags, and conversation/refusal without the intimacy paragraph. The continuous-series regression now checks prose parity as well as mechanics and offered choices under legacy saved fields. The story paragraph count decreases by three because the three alternate passages were removed, not because a check was relaxed.

Browser verification used the packaged static build in isolated Chromium storage at `127.0.0.1:4177/veilfall-beta/`; the player's `4174` save was not touched. Verified the cover and revised Settings, imported old-default scene fixtures through Import Save, accepted each of the three encounters, checked Vexa's refresh/resume, and took Lysara's separate-rest option before testing acceptance. Keyboard activation worked and focus moved to the new scene heading. At a 390×844 viewport, Extra large text and choice details wrapped without horizontal overflow and the refusal button showed visible keyboard focus. No console warning or error was captured. These are viewport tests, not real Android/iPhone tests.

One unrelated visual follow-up was observed: with Extra large text in the narrow viewport, the existing sticky header can partly cover the scene title after automatic scrolling. The prose and choice controls remain reachable; scroll-offset/layout code was not changed in this scoped romance update. A complete screen-reader/device audit was not repeated.

Validation completed successfully: `npm run check:story` (43 files, 3,018 paragraphs), `npm run check:game` (263 nodes, 152,220 reachable choices; five continuous twelve-chapter routes), `npm run check:release`, `npm run lint`, `node node_modules/typescript/bin/tsc --noEmit --incremental false`, `node scripts/check-itch-loader.mjs`, `npm run build`, `npm run package:itch`, and `git diff --check`. Both builds retain the documented large-chunk warning. The static package contains 45 files, including top-level `index.html`, `assets/`, `art/`, and favicon; its size is approximately 95.6 MB. No upload, publishing, audience change, commit, or push occurred. Unrelated modified UI primitives and `hooks/use-mobile.ts` were left untouched.

## Test matrix

| Surface                                            | Coverage                                                                                                                                                                                                  | Result                                                                                                                                                                                                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated narrative                                | All registered story files and continuity routes                                                                                                                                                          | Pass: 43 files, 3,021 paragraphs; continuous routes cover 5 outcomes and 219 nodes.                                                                                                                                                                                                |
| Automated game graph                               | Node links, choices, endings, decision ranges, migrations                                                                                                                                                 | Pass: 263 nodes; 3 ending nodes in Chapters I–XI, 4 terminal Chapter XII endings, 12 lethal outcomes, 152,220 simulated choices, 15–18 decisions per surviving route.                                                                                                              |
| Release regressions                                | XII labels; export/import round trip; checkpoints; malformed, oversized, unsupported, and cancelled imports; storage failures; migrations; reading setting; terminal controls                             | Pass.                                                                                                                                                                                                                                                                              |
| Production build                                   | Vinext production build and Wrangler local preview                                                                                                                                                        | Pass with the documented large-chunk warning; page, favicon, and representative art returned 200, and no console warning/error was captured in the final Chromium pass.                                                                                                            |
| Restricted beta ZIP                                | Static Vite build, required top-level structure, ZIP decompression round trip, nested-path HTTP requests, fresh start, choice, refresh/resume                                                             | Pass. The packaged game remains local and was not uploaded.                                                                                                                                                                                                                        |
| Chromium desktop, isolated `127.0.0.1:4173` origin | Fresh cover/start, keyboard start, choice focus/scroll, refresh/resume, settings focus restoration, chapter library, diagnostics, invalid import, valid import summary/cancel/confirm, pre-import restore | Pass.                                                                                                                                                                                                                                                                              |
| Chromium narrow viewport, 390×844                  | Extra large text, seven-choice menu, wrapped advantages/costs, status/header controls, settings sheet, no horizontal overflow                                                                             | Pass after targeted wrapping and touch-target fixes. This is viewport emulation, not a real phone.                                                                                                                                                                                 |
| Previous Chapter IX content-control test (superseded) | Former two-version selector and adult-confirmation UI | Historical result only. These controls have been removed; see the single-passage follow-up above. |
| Chapter XI/XII replay fixture                      | Library labels, replay warning, restoration of XI checkpoint, invalidation/locking of later XII snapshot                                                                                                  | Pass.                                                                                                                                                                                                                                                                              |
| Chapter XII ending fixture                         | XII of XII header, complete-adventure ending text, replay action, absence of continuation                                                                                                                 | Pass.                                                                                                                                                                                                                                                                              |
| Save download in browser automation                | Export button and result announcement                                                                                                                                                                     | The action and UI state were observed, but neither Chromium automation harness surfaced the Blob download event. Portable JSON generation and round-trip parsing pass in the release regression. Perform one ordinary-browser download/open smoke test before public distribution. |
| Storage denial/quota failure in UI                 | Pure storage adapter failures and visible recovery source paths                                                                                                                                           | Automated adapter regressions pass; the browser harness could not safely force a real quota/permission denial, so that exact browser UI path remains unverified.                                                                                                                   |

Real Android Chrome, iPhone Safari, desktop Safari, Firefox, a screen reader, and a throttled slow connection were not available. These are not reported as passed.

## Validation commands

The completed release pass runs:

```text
npm run check:story
npm run check:game
npm run check:release
npm run lint
npm run build
git diff --check
git status --short
```

The final command output and worktree state should accompany the handoff. The known pre-existing changes in `components/ui` and `hooks/use-mobile.ts` were not formatted or modified by this release work.

## Remaining owner actions

1. Restore access to or correct the preserved Existing Sites registration. Do not create a replacement Site merely to bypass the current lookup failure.
2. Choose and retain the stable production HTTPS address. Set `NEXT_PUBLIC_SITE_ORIGIN` at deployment if an absolute social image is wanted, and warn existing testers to export before moving origins.
3. Supply a real support/contact destination if players should submit copied diagnostics. Do not ship a placeholder.
4. Supply or approve individual credits, artwork provenance/license records, and any required AI-use disclosure; complete legal review of direct and transitive dependency notices.
5. Run an ordinary-browser export/download/open smoke test and test at least current iPhone Safari and Android Chrome, plus a keyboard/screen-reader pass if available.
6. Measure complete-adventure playtime before adding a total-duration claim.

There is no known critical story-completion, save-validation, or production-build defect in the reviewed code. The inaccessible existing Sites registration is the current deployment blocker; the explicitly unverified device/download cases are distribution sign-off items.
