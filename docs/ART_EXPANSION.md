# September 2026 artwork expansion

The beta now contains 64 distinct illustrations: five scene plates in each of the twelve chapters and four additional illustrations tied to authored romantic encounters. This adds 25 images to the previous 39. Branch-specific scenes appear only when the player reaches them; five images per chapter describes chapter coverage across its branches, not a promise that every route visits every image.

## New chapter scenes

| Chapter | Added illustrations | Scene plates after update |
| --- | --- | --- |
| I | Flooded low road; Eastwatch wagon saboteur | 5 |
| II | Bellweather common-room infirmary | 5 |
| III | Burning archive; watch-house evidence | 5 |
| IV | Storm coast span; Rook's mirrored stage | 5 |
| V | Royal extraction drill; Orivane's Concord memory | 5 |
| VI | Broken city axle; brake forge | 5 |
| VII | Dead command horn; salt-basin fracture | 5 |
| VIII | Hidden fort ledgers; buried defense chain | 5 |
| IX | True-name bead demonstration; neutral Gate Nail case | 5 |
| X | Falling offer-bridge stones; Free Ledger shelter | 5 |
| XI | Public petition bench; lifting shelter roofs | 5 |
| XII | Existing collision and four Gate outcomes retained | 5 |

## Romance placement

The illustrations are non-explicit and accompany the existing prose. They neither create an encounter nor infer consent from attraction.

- Mara: Chapter X, `c10-guide-bargain`, only after `c10-rest-with-mara`.
- Lysara: Chapter X, `c10-guide-bargain`, only after `c10-rest-with-lysara`.
- Vexa: Chapter IX, `c9-recover-fragment`, only after `c9-shared-private-night`.
- Ilyra: Chapter VII, `c7-marshal-parley`, only when the immediately preceding history entry is the authored result of `c7-ilyra-deepen-bond`. Her existing route culminates in a chosen kiss; no new love scene has been added.

Scene assignments and encounter conditions live in `app/expanded-art.ts`. All story nodes, body functions, choices, and outcomes were compared with the pre-work runtime snapshot and remained identical. No save-schema change was needed.

## Asset provenance and delivery

The 25 new originals were generated with the built-in `image_gen` tool and saved in `source/art/`. Their complete prompts, targeted corrections, alt text, scene assignments, and output paths are recorded in [art-expansion-prompts.json](art-expansion-prompts.json). Existing source originals remain unchanged. Three generated drafts were corrected before delivery: Lysara's appearance in the infirmary, and optional companions inadvertently included in two shared Cinder Deep scenes.

`npm run optimize:art` builds opaque WebP plates at 1536 × 864 (quality 70) and 800 × 450 (quality 66), with encoding effort 6. Incidental transparency is flattened against the dark reader background. The responsive reader requests the smaller image on narrow screens; images load as needed. Source PNGs and internal documentation are excluded from the ZIP.

## Replacement build

- Path: `outputs/veilfall-ember-oath-beta.zip` (existing build replaced).
- Previous ZIP: 10,065,994 bytes (9.60 MiB).
- Replacement ZIP: 11,709,277 bytes (11.17 MiB).
- Increase: 1,643,283 bytes (1.57 MiB, 16.3%) for 64.1% more distinct artwork.
- Runtime package: 132 files, including 128 WebP delivery images.
- Previous ZIP retained locally in `work/veilfall-ember-oath-beta-before-art.zip`.

## Verification

Passed: `check:art`, `check:story`, `check:game`, `check:release`, lint, TypeScript, both production builds, the actual ZIP package audit, and the itch loader checks. The game regression suite covered five continuous twelve-chapter routes and 152,220 reachable choices.

The packaged game was inspected at desktop and phone widths on an isolated localhost origin. Six validated synthetic display fixtures checked all four romantic illustrations, the absence of romance art on the platonic variant, and Orivane's scene. The mobile reader selected 800-pixel artwork and had no horizontal overflow. No browser console errors were observed. These display checks do not claim testing on physical phones.
