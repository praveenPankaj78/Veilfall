# Browser package source exposure audit

Audit date: 16 September 2026. Game version: 1.0.0.

Upload `outputs/veilfall-ember-oath-beta.zip`, not the repository, source `itch` directory, media kit, or server build.

## Result

The rebuilt archive contains 45 runtime files: top-level `index.html` and `favicon.svg`, one minified JavaScript bundle, one minified CSS file, and 41 artwork files (35 PNG and 6 WebP). Its size is 95,564,866 bytes.

No standalone TypeScript/TSX sources, source maps, repository history, internal documents, test scripts, environment files, hosting registration, package manifest, dependency directories, or build tools are included. The archive's textual runtime files also pass checks for source-map references, embedded source-map content, development entries, local user paths, common private-key headers, and development package-script metadata.

The initial ZIP was already limited to runtime files. However, its compiled version display imported the entire package object, retaining unnecessary development command and dependency metadata in JavaScript. The import now selects only the version, so that metadata is removed without changing the displayed version or save schema.

## Protection and limits

- Explicit minification remains enabled and production source maps remain disabled. See [Vite build options](https://vite.dev/config/build-options.html).
- Packaging accepts only approved runtime paths and file types. An unexpected file stops packaging before the existing release ZIP is replaced.
- File contents are checked both before compression and after decompression. Every entry is compared byte for byte before writing the ZIP.
- Future legitimate assets or notices outside the allowlist need an intentional policy update. Required third-party notices must not be removed to conceal code; `THIRD_PARTY_NOTICES.txt` is an approved path.
- This is not encryption, DRM, or a comprehensive secret scanner. The pattern checks are safeguards against common accidental packaging mistakes, not proof that arbitrary runtime data contains no confidential information.
- Browsers must receive JavaScript, HTML/CSS, images, and story data to run this self-contained game. Players can inspect, save, pretty-print, and reverse-engineer them, including story text and ending logic. Removing a download button or restricting the page does not prevent authorized testers from extracting these assets.
- Do not ship credentials or unreleased confidential material in any browser bundle. Moving logic to a server would be a different architecture, not a packaging adjustment, and has not been done.

## Validation

- `npm run package:itch`: passed. The pre-existing large JavaScript chunk warning remains informational; no chapter-loading rewrite was made.
- `npm run check:itch-package`: passed, including 33 rejection fixtures, a valid-package control, and the actual 45-file ZIP.
- Integration check: a temporary package-manifest fixture in the build directory caused packaging to fail. The existing release ZIP's SHA-256 remained unchanged. The fixture was then removed.
- `npm run check:game`: passed (263 nodes, 152220 reachable choices, all twelve chapters).
- `npm run check:release`: passed, covering portable saves, migrations, checkpoints, terminal endings, reading preferences, romance boundaries, and legacy fields. A version-only import assertion was added.
- `npm run lint`: passed.
- `npm run build`: passed for the existing Sites/Vinext runtime. Its existing chunk-size warning and unknown route classification remain; no server output is included in the itch archive.
- Git whitespace validation: passed. Git still reports line-ending conversion notices for existing Windows worktree files.
- `npm run check:story`: reports pre-existing punctuation violations in `docs/ITCH_BETA_PAGE_KIT.md` and `docs/WEB_RELEASE_READINESS.md`. Those unrelated documents and the check rules were not changed for this packaging task.

No public upload, audience change, commit, push, obfuscation dependency, account service, or game/save mechanics change was made. This packaging audit does not claim a new device/browser playthrough or replace the release test matrix. Pre-existing UI modifications were preserved.
