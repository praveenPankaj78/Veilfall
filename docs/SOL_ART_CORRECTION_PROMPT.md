# Prompt for Sol: create or correct the requested Veilfall artwork

Work in this Veilfall repository using Sol. Your task is **image creation and visual image correction only**, based on Cursor's audited handoff. Cursor owns the integration fixes, runtime artwork assignments, relationship previews, scrolling, automated regression checks, compression pipeline integration, and final beta rebuild.

Read applicable repository instructions and the available image-generation skill, and use its supported image tool for creating or editing images. Do not delegate this work to a different model. Implement the requested image work; do not stop at writing suggested prompts.

## Inputs and scope

Read `docs/ART_FIX_REQUESTS.json` first. This file is created by Cursor after it audits the actual scenes and branches; the prompt alone does not establish that any new artwork is necessary.

- If the file is absent or `auditComplete` is false, report that the audited image handoff is not ready. Do not invent image requests or start speculative generation.
- If `auditComplete` is true, `imageWorkNeeded` is false, and `requests` is empty, report that no Sol work is needed. Do not generate extra artwork.
- Otherwise process every `pending` or `needs_revision` request. Reuse any already verified delivery for unchanged requests instead of regenerating it unnecessarily. Flag inconsistent manifest values instead of guessing.

Read each request's source references and relevant authored scene, plus `docs/CHARACTER_SERIES_BIBLE.md`, `docs/ART_EXPANSION.md`, and relevant entries in `docs/art-expansion-prompts.json`. Inspect the actual existing illustrations referenced by the request before creating or editing anything. Resolve conflicts from the authored scene and established character references, and record any necessary clarification in the delivery report.

Do not change story text, choice labels/results, flags, relationships, consent rules, scene order, endings, save format, or gameplay code. Do not edit `app/`, `public/art/`, `source/art/`, the shared optimizer, or the beta ZIP during this stage. Preserve all existing uncommitted work. Your outputs belong in your staging directory and the separate delivery manifest described below.

## Produce only the necessary new or corrected assets

For a **correction**, use the existing image as the editing reference. Preserve its style, framing, lighting, characters, and other content except for the explicitly requested correction. Inspect the source first and verify its hash against the handoff. A stale hash requires reconciliation before continuing with that request. If the requested correction would invalidate another use of the original illustration, supply a separately named variant and flag the necessary mapping distinction for Cursor; do not overwrite the shared original.

For a **new image**, use the scene brief and visual references to match the existing game's cinematic, painterly dark-fantasy style and established character appearances. Depict only the already-authored scene. No invented events, text, captions, logos, watermarks, anachronisms, or extra characters. Keep illustration quality consistent with the existing set rather than adding decorative assets merely to increase counts.

Respect each request's required and excluded state. An image intended to work across sibling branches must be visually true in every listed branch. Avoid depicting an optional companion, unselected action, future revelation, completed victory, or branch-specific damage unless that context is guaranteed. Do not solve a coverage gap by drawing an event absent from the story.

Preserve existing romance boundaries. Use only the specified adults and already-authored consensual encounter, depicted non-explicitly. Attraction or an old romance flag alone is not permission to depict intimacy in another scene. Ilyra's existing illustrated encounter is a chosen kiss; do not turn it into an invented love scene. A scene-neutral replacement must not erase a required romantic illustration from its valid route.

Use landscape 16:9 composition. The standard delivery sizes are 1536x864 and 800x450; keep important faces, hands, and scene information readable at the smaller size and within the hero's actual desktop/mobile crop. Inspect `app/globals.css` and the image component read-only if necessary to understand that crop. Aim for opaque images without incidental transparency. Do not stretch a differently proportioned image to force 16:9.

## Stage and visually verify the delivery

Save final source images under `work/sol-art-fixes/<request-id>/<outputBasename>.png`. Keep successive drafts separately named so an accepted result is not accidentally overwritten. Do not register these paths in runtime code; Cursor will integrate accepted files.

If useful, create isolated delivery previews in the same staging directory using the existing pipeline's settings: opaque WebP, flatten against `#181514`, 1536x864 quality 70 and 800x450 quality 66, effort 6. This is a preview of delivery quality, not authorization to modify the shared optimizer or its output directory. Do not run `npm run optimize:art` during this stage: it currently clears and rebuilds `public/art/`.

Visually inspect every final source and its 800px delivery preview. If necessary, also inspect a preview matching the reader's hero crop. Check:

- Correct character identities, appearance, clothing, anatomy, and number of people.
- Correct location, objects, action, and narrative moment.
- No unchosen branch outcome, absent companion, spoiler, or inappropriate intimacy.
- All requested corrections are present and all protected content remains intact.
- Readable composition at phone size, no unwanted text/watermarks, and no conspicuous compression defects or transparency.

Iterate on failed images using the image tool. If an image cannot satisfy a requirement, mark it unresolved with the exact reason; do not mark it ready or substitute a misleading image. Keep file sizes near the requested budget where practical without visibly degrading faces or scene readability. A failed size target should be reported for Cursor's integration decision, not concealed.

## Handoff back to Cursor

Write `docs/ART_FIX_DELIVERY.json` as valid JSON. Do not overwrite Cursor's request file. Use top-level `requestManifestSha256`, `summary`, and `deliveries` (array). Include one entry per processed request with:

- `requestId` and `status`: `ready`, `needs_clarification`, or `unresolved`. Ready means visually verified for integration; Cursor still performs final acceptance.
- `stagedSourcePath`, `sourceSha256`, and `dimensions`; use null for unavailable output rather than inventing a path.
- `stagedPreviewPaths`, `previewSizesBytes`, and the compression settings actually used.
- `proposedSourcePath`, `proposedDeliveryPaths`, `outputBasename`, and `alt`, matching the request or explaining any necessary change.
- `referenceImages`, actual creation/edit prompts, and a brief provenance/edit log.
- `visualChecks`: specific acceptance criteria checked and the observed results, including mobile readability and branch suitability.
- `integrationNotes`: exact request/node IDs, any shared-image variant requirement, and any visual restriction Cursor must preserve.
- `limitations`: unresolved issues or budget deviations; use an empty array when none remain.

Before writing the manifest, confirm every referenced output exists and hashes match. Preserve earlier valid deliveries if this is a revision pass. Do not report that integration, browser regression tests, or the beta rebuild have been completed; those belong to Cursor.

Finish with the delivery manifest path, a concise list of ready/unresolved requests, and previews or links to the completed images. State that Cursor should now resume `docs/ART_RELATIONSHIP_INTEGRATION_FIX_PROMPT.md`, accept/integrate the assets, run the checks, and rebuild the beta. Do not publish or replace the build yourself.
