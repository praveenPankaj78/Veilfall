# Prompt for Cursor / Grok 4.6: fix relationship and artwork integration

Work in this Veilfall repository. Identify, reproduce, and fix the four integration problems below, add focused regression coverage, and rebuild the beta. Implement the work; do not stop at a plan. Read applicable repository instructions first.

## Division of work: Cursor fixes integration; Sol creates or corrects images

You are responsible for the audit, relationship previews, artwork assignments and conditions, scrolling, regression tests, asset compression/integration, and final beta build. **All new image creation and all visual corrections to existing images belong to Sol.** Do not generate, inpaint, redraw, recolor, composite, or crop illustrations yourself, even if an image tool is available. Selecting an appropriate existing asset, adjusting presentation code, and ordinary resize/format/quality conversion through the existing delivery pipeline remain your responsibility. Do not use CSS cropping or effects to conceal incorrect content in an image.

Use this sequence:

1. Audit all four problems and implement the code fixes that can be completed with valid existing assets. Determine whether any genuine asset gaps or visual defects remain. Do not assume new images are necessary just because code integration is broken.
2. Write `docs/ART_FIX_REQUESTS.json` using the handoff contract below. If the audit establishes that no image work is needed, record that explicitly and complete the verification/build yourself; Sol is unnecessary.
3. If image work is needed, finish all independent code work and checks, leave the current working beta intact, and hand off the specific requests. Report this as an interim handoff, not a completed release. The user will run `docs/SOL_ART_CORRECTION_PROMPT.md` with Sol. Do not switch models, launch another task, or attempt the image work yourself.
4. After Sol returns `docs/ART_FIX_DELIVERY.json`, resume this same task. Validate the delivered files against the requests, integrate them, run all affected checks and browser verification, and replace the beta only when the full task passes. Any additional visual correction goes back to Sol with a precise amended request.

Do not wire pending filenames into production or use misleading placeholders. Prepare tests/metadata separately where useful, but keep existing playable asset references valid until the replacement files exist.

### Cursor-to-Sol handoff contract

Create the request file **after the actual audit**. Use valid JSON with top-level `auditComplete` (boolean), `imageWorkNeeded` (boolean), `auditSummary` (string), and `requests` (array). A completed audit with no image work has `auditComplete: true`, `imageWorkNeeded: false`, and an empty array. An incomplete audit must not masquerade as this no-work outcome.

Each request must contain:

- `id`: stable unique ID, such as `art-fix-001`; `kind`: `new` or `correction`; `status`: `pending`, `delivered`, or `needs_revision`.
- `reason`: observed image defect or branch-coverage gap, and why suitable existing artwork cannot solve it.
- `chapter`, `nodeIds`, `incomingChoiceIds`, and `sceneSummary`: precise placement and the already-authored event. Include relevant source file/function references and short exact prose excerpts as evidence.
- `requiredState` and `excludedState`: relevant flags, relationship/consent conditions, companion presence, sibling branches the image must support, and branches where it must never appear.
- `sourceToCorrect`: existing source path and SHA-256 for a correction, or null for a new image. Include other nodes using the same image so a correction cannot silently break them; request a new variant if it cannot remain valid for all current uses.
- `referenceImages`: actual existing source paths for character appearance, setting, and style; `mustShow`, `mustNotShow`, and `preserve`: explicit visual requirements, forbidden implications/spoilers, and elements to leave unchanged.
- `outputBasename`, `proposedSourcePath`, `proposedDeliveryPaths`, `proposedArtKey`, and `alt`: exact intended integration names and factual alt text. Proposed paths do not authorize overwriting shared runtime files during the Sol stage.
- `generationBrief`: self-contained image creation/editing instructions derived from the evidence, with landscape 16:9 composition and important subjects safe in the reader's hero crop.
- `acceptanceCriteria`: scene-specific visual checks, including consistency at 800px width and relevant hero cropping; `estimatedAssetBudgetBytes`: a realistic combined full/small WebP size target based on comparable assets.

Sol will return a separate delivery manifest. Keep request IDs stable across revisions and validate the original source hash before integrating a correction. If source/context changed after the request, reconcile it before overwriting anything.

## Objective and boundaries

Players report:

1. Some choices change a romantic interest's relationship without showing that consequence on the choice.
2. A new illustration appears, then an older illustration unexpectedly returns on the next scene.
3. When a new illustration appears, scrolling sometimes lands below it.
4. One branch receives appropriate new artwork while sibling branches receive inconsistent or unsuitable coverage.

Fix these as connected presentation problems. **Do not change the story or game mechanics.** Preserve all authored prose, choice labels/details/results, destinations, availability requirements, flags, stat costs/rewards, relationship rules, consent conditions, endings, and chapter order. New effect badges and artwork metadata are presentation changes; rewriting choices or changing their effects is not permitted.

Preserve the recent artwork expansion, the approximate five-illustrations-per-chapter objective, the four encounter-specific romantic illustrations, responsive WebP delivery, and existing saves. Romantic illustrations must remain non-explicit and depict only the already-authored encounter. Ilyra's existing illustrated encounter is a chosen kiss; do not invent a different culmination.

Use the smallest coherent fix that addresses the root causes across all chapters. Avoid unrelated refactors, dependency upgrades, full-repository formatting, speculative systems, and new persistence fields unless demonstrably necessary. Do not promise zero bugs; demonstrate the requested behavior and report verification limits honestly.

## Start from the current working tree

There are intentional uncommitted artwork changes and unrelated UI edits. Capture the current status and use the **current working tree**, including untracked files, as the baseline. Do not reset to HEAD, discard changes, or overwrite unrelated work.

Before editing:

- Run existing relevant checks and record pre-existing failures separately.
- Capture a reproducible baseline of authored runtime nodes/choices and representative transition outputs. Use `scripts/story-loader.mjs` and the existing transition harness: runtime overlays matter. Preserve prose and mechanics, allowing only explicitly identified presentation metadata to differ.
- Record current ZIP size and retain a backup of the current working beta before replacing it. At prompt creation, `outputs/veilfall-ember-oath-beta.zip` is 11,709,277 bytes (11.17 MiB); measure again rather than assuming it is unchanged.
- Create a short reproduction matrix: category, source node, choice ID, destination, relevant state, actual behavior, expected behavior. Add regression cases before or alongside the fixes.

## Repository map and concrete starting evidence

Verify these observations against the current files before editing; line numbers may move.

| Area | Relevant code |
| --- | --- |
| Choice badges and scrolling | `app/page.tsx`: `changeSummary`, `commitChoice`, `scrollAfterChoice`, scroll effect, `SceneArtImage`, hero and inline romance rendering |
| Relationship calculation | `app/game-data.ts`: `relationshipChanges`, `relationshipChangeNotes`, `nextRelationships`, `resolveFinalRelationshipIntents` |
| Actual transitions | `app/game-transition.ts`: `applyPlayerChoice`, automatic acknowledgments, chapter handoffs and retry helpers |
| Artwork selection | `app/scene-art.ts`, `app/expanded-art.ts`: `sceneArtOverrides`, `artworkForScene`, `romanceArtworkForScene` |
| Layout and delivery | `app/globals.css`, `itch/next-image.tsx`, `scripts/optimize-art.mjs` |
| Runtime and checks | `scripts/story-loader.mjs`, `scripts/check-art.mjs`, `scripts/check-game.mjs`, `scripts/check-release.mjs`, `scripts/series-review.mjs`, `scripts/create-release-qa-saves.mjs` |
| Art context | `docs/ART_EXPANSION.md`, `docs/art-expansion-prompts.json`, chapter maps and character bible |

Confirmed starting points:

- `relationshipChangeNotes(choice)` currently considers explicit intent and positive attraction, but omits trust/respect/friction-only changes and negative attraction. Its early returns can also conceal numeric effects accompanying an intent change. At `road-conversation`, `protect-lysara-secret` applies trust +1/respect +1, and `tell-brann-seed` applies trust -1/friction +1; both currently return no relationship notes.
- `nextRelationships` can end other existing relationships when committing to someone, with additional trust/friction changes. `resolveFinalRelationshipIntents` can change several partners through finale flags. A direct per-choice effects lookup alone cannot describe every actual consequence.
- `commitChoice` chooses the scroll target by comparing `nodes[next.nodeId].art` with `node.art`, but rendering uses `artworkForScene(node)`. For `c2-threshold -> c2-triage`, both raw art keys are `inn`, while the displayed illustration changes to the infirmary. The current comparison misses this change. Inline romance artwork is another displayed image it does not account for.
- `artworkForScene` uses isolated node overrides, then falls back to the old art key or `departure`. For example, the Chapter II sequence displays inn -> infirmary -> infirmary -> inn across `c2-threshold`, `c2-triage`, `c2-medicine`, `c2-eleven-years`. Inspect the prose to decide whether that return is appropriate; do not classify every repeated image as a bug.
- `check-art.mjs` counts five distinct scene plates over the union of a chapter's nodes and checks 64 assets plus romance conditions. That does **not** establish coherent ordering, balanced branch coverage, or five images encountered on a playable route. Prior isolated display fixtures also do not prove actual transition/scroll behavior.

## 1. Make relationship consequences visible and accurate

Derive a pure, state-aware preview from the same authoritative relationship calculation used by gameplay. Compare before and after values; do not build a second hand-maintained effects table or modify the mechanics to simplify the preview. Verify its result against `applyPlayerChoice`, including any automatic processing relevant to relationships.

Show understandable badges before selection for every affected person and changed dimension: trust, attraction, respect, friction, and relationship intent. Include reductions, indirect changes to other partners, and finale-wide changes. Group compactly by person and make positive/negative meaning readable without relying only on color. Distinguish trust/friendship from romantic attraction; a trust increase alone must not say romance increased. Positive attraction alone must not claim an intent transition that did not occur.

Show actual net changes after clamping and combined effects. If trust is already zero and remains zero, do not claim a numerical decrease. If intent is unchanged, do not claim a new commitment. Preserve existing stat, affordability, and lethal-choice information. Preview evaluation must never mutate game state, history, saves, checkpoints, or flags.

The itch build deliberately hides the separate `Expected advantage` text using `NEXT_PUBLIC_VEILFALL_TARGET`. Keep that behavior. Relationship consequences must remain visible in **both** build targets independently of that setting. Preserve choice availability and spoiler boundaries for inaccessible content.

Add cases for direct positive/negative changes, intent plus numeric changes, clamping, zero net effects, committing while another bond is active, all applicable finale friendship/single/closure outcomes, and no-effect choices. Assert that rendered badges agree with real resulting relationship state and that previews leave their input untouched.

## 2. Fix artwork continuity with scene context

Audit reachable transitions across all twelve chapters using the final merged runtime graph, actual available choices, and the real transition functions. Raw source order or `nodeOrder` is not a playable route. Include dynamic destinations, reconverging branches, automatic acknowledgments, and relevant flags/companion states.

Create a concise scene/branch coverage table recording logical scene beats, valid illustrations, branch conditions, and transitions. Read the prose and inspect the actual illustrations before assigning them. Extend an appropriate image across a continuing scene where needed; switch when the location, event, viewpoint, or authored cutaway changes. Explicitly document legitimate returns to earlier artwork.

Use one authoritative presentation resolver for rendered art and transition decisions. Include state only where context requires it. Artwork must resolve deterministically from authoritative game/save state, without dependence on which pages happened to render previously.

Do not solve continuity by globally retaining the last non-default image, forbidding every return to an older image, preloading every image, or merely changing React keys. Such approaches can leak branch-specific imagery after reconvergence or break save restore. Do not silently use Greyhaven/departure artwork to hide missing scene assignments. Missing files should retain a graceful visual fallback while coverage checks expose the missing assignment or asset.

Verify restoration through save/load, import, chapter replay, fatal-choice retry, and returning to the game. An image must not imply an unchosen action, absent companion, unresolved victory, or a future revelation.

## 3. Scroll to the newly displayed illustration reliably

Compare the **resolved visible artwork before and after the completed player transition**, including conditional romance art, not raw node art keys. Reuse the same resolver as rendering.

Define and implement these behaviors:

- When the hero illustration changes, land at that illustration with appropriate clearance below sticky UI.
- When only an inline romantic illustration appears or changes, ensure it is visible without skipping its immediately preceding result/context.
- When both change, begin at the earliest newly displayed illustration and preserve normal reading order.
- When the actual illustration is unchanged, retain the sensible text-first progression instead of repeatedly jumping back to the same picture.

Coordinate scrolling with the committed destination DOM and stable image geometry. Preserve image dimensions/aspect ratio so loading does not move the target. Respect reduced motion and keyboard focus; focus must not cause a second conflicting scroll. Account for mobile sticky elements, text-size settings, and responsive layout.

Cancel stale scheduled work on subsequent navigation/unmount. Do not add arbitrary long timeouts, repeated image-load scrolls, or effects that pull users back after they have started reading. Only intentional navigation should request this behavior; an unrelated render, menu toggle, resize, or late image decode must not hijack scroll. Inspect choice clicks, WebMCP choice execution if present, automatic transitions, imports, replay, handoffs, and retries for consistent entry behavior without blindly scrolling on every state update.

## 4. Balance branches without misrepresenting the story

For each illustrated fork, audit **all sibling branches**, not just the branch receiving the new image. Starting examples include low road/ridge road, Chapter III archive/healer/broker, Chapter IV snow/storm/brass spans, Chapter VI duties, and Chapter VII salt trap/order exposure/duel. These are audit targets, not a complete list or a claim that all currently fail.

Choose whichever fits the authored scene:

- Appropriate existing artwork for each sibling branch with comparable placement and scene coverage; or
- A genuinely branch-independent illustration covering the shared beat.

Do not show an archive burning on a route that never visits it, a salt trap on a duel route, or an intimate encounter on a platonic route. Branch-neutral means the image itself is neutral, not merely that its filename or alt text is generic. Do not force optional romances into other routes to equalize counts. Their absence on friendship/single routes is correct; general scene art should still be coherent there.

Preserve roughly five meaningful chapter illustrations on average while improving route coverage. Report both chapter-wide distinct assets and actual illustrations encountered on representative complete routes. Do not claim that a union count proves route coverage, pad counts with crops/duplicates, or enforce an exact count on every optional path at the expense of narrative accuracy. Explain intentional differences between short/optional routes.

Prefer suitable existing assets. If a new image or a visual correction is necessary, add a precise request for Sol using the handoff contract. This applies to corrections of existing illustrations as well as entirely new images. Do not silently substitute unsuitable neutral imagery to avoid the handoff, generate images yourself, or declare an unresolved art gap complete.

Retain romance gating at the existing encounters: Mara/Lysara at `c10-guide-bargain` with their respective rest flags, Vexa at `c9-recover-fragment` with `c9-shared-private-night`, and Ilyra following `c7-ilyra-deepen-bond`. Audit the existing Ilyra history-result comparison for missing-result and restoration edge cases. Do not infer consent from attraction or show an old encounter again merely because its historical flag remains set.

## Verification and completion criteria

Add focused regressions to the existing checks or a small clearly named integration check. Expectations must include independently specified node/choice/art examples; tests that just compare a resolver with itself cannot catch wrong assignments. Cover confirmed regressions and documented legitimate image returns. Keep asset existence/alt-text/delivery checks, but replace brittle fixed-total assertions where a justified coverage change makes them obsolete; do not weaken checks just to pass.

Use real reachable route states for integration coverage. Existing continuous-route helpers and QA-save generation are useful starting points. Synthetic states may supplement edge cases but must be labelled as such. Build a manageable coverage matrix spanning all chapters, every artwork-relevant sibling branch, four romantic encounters and their non-romantic alternatives, and all distinct ending artwork outcomes. Do not claim exhaustive state-space verification if only representative routes were exercised.

In an isolated browser origin/profile, exercise actual choices and restored states. Test desktop, a narrow phone, the 950px breakpoint, short landscape, enlarged text, reduced motion, and keyboard navigation. Check cached images, delayed images, image failure, and quick consecutive navigation. Verify image/target bounding rectangles relative to sticky UI, not merely DOM presence. Confirm no horizontal overflow, unexpected scroll-back, stale artwork, console errors, or failed asset requests. Keep screenshots of representative corrected flows. Do not overwrite a player's existing browser saves.

Demonstrate these acceptance conditions:

- Displayed relationship effects match the actual transition for the covered choices, including indirect effects.
- Every audited branch has appropriate artwork; every retained backward image transition has a documented narrative reason.
- The Chapter II raw-key/resolved-image mismatch and inline-romance scrolling cases work in the browser.
- Save/load, replay, retries, and reconvergence restore the same correct presentation without stale branch/romance art.
- Authored story content and gameplay outcomes match the captured baseline.

Run the repository's relevant checks and builds, fixing failures caused by this work:

```text
npm run check:story
npm run check:game
npm run check:release
npm run check:art
npm run lint
npx tsc --noEmit
npm run build
```

Run the new integration checks as well. When integrating Sol's delivery, inspect each image, verify its manifest/hash, copy accepted source files into their intended `source/art/` paths, register new basenames in the optimizer's allowlist, and update runtime mappings/alt text yourself. The current `scripts/optimize-art.mjs` clears and rebuilds `public/art/`; ensure the allowlist and all source files are complete before running it. Use `npm run optimize:art` when assets change and rerun affected checks. Preserve the current responsive WebP approach: 1536x864 at quality 70, 800x450 at quality 66, effort 6, opaque output. Avoid unnecessary re-encoding and do not package source PNGs or Sol's staging files. Keep package growth small; report exact before/after bytes and percentage with the reason for any increase.

After all required Sol requests are accepted and integrated, or a completed audit establishes that none are needed, run:

```text
npm run package:itch
npm run check:itch-package
node scripts/check-itch-loader.mjs
```

Replace `outputs/veilfall-ember-oath-beta.zip` with the corrected, verified build. Smoke-test the actual packaged game at a nested URL like its itch deployment, including relationship badges, image URLs, and scroll behavior. If packaging or package verification fails, keep/restore the previous working build and report the blocker; do not leave an unverified replacement marked complete. Do not publish externally.

Deliver a concise report of root causes and fixes, changed files, reproduction/regression evidence, branch coverage and intentional exceptions, story-preservation results, all check outcomes, replacement ZIP path/size, and any unresolved limitation. Include the status of every Sol request, or explicitly state that the completed audit required no image work. If browser verification is unavailable, say exactly what remains unverified. Completion requires implemented fixes and a validated replacement build, not just this audit report. A handoff awaiting Sol is an interim milestone; resume and finish after the assets arrive.
