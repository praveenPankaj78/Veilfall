# itch.io restricted beta page kit

Prepared 16 September 2026 for **Veilfall: The Ember Oath**, build 1.0.0.

This task prepares local files and page copy only. No itch.io project or YouTube video has been created, uploaded, or published. The existing game ZIP and hosting registration are unchanged.

## Form values

| Field | Recommended value |
| --- | --- |
| Title | Veilfall: The Ember Oath |
| Project URL | `veilfall-ember-oath` as the slug, if available. Keep the eventual address stable; avoid adding `beta` if this will be the long-term page. No account URL or availability is assumed. |
| Short description / tagline | Lead your people across two realms in a 12-chapter dark fantasy story shaped by your choices. |
| Classification | Games |
| Kind of project | HTML / HTML Game — playable in the browser, **not Downloadable**. |
| Release status | In development during beta testing and release polish. The description explicitly says all twelve chapters are already playable. Switch to Released when signing off the stable release. This field does not control who can access it. |
| Pricing | No payments |
| Suggested donation | Not applicable with No payments; do not configure paid access. |
| Upload | `outputs/veilfall-ember-oath-beta.zip`; mark it as the file played in the browser if that checkbox appears. Upload the ZIP, not the source `itch/index.html`. |
| Genre | Interactive Fiction |
| Tags | `dark-fantasy`, `choices-matter`, `story-rich`, `text-based`, `multiple-endings`, `singleplayer`, `romance`, `narrative`, `magic`. Select matching autocomplete tags; do not repeat the genre or platform. |
| AI generation disclosure | **Yes.** AI-assisted code changes are present; this page copy and the new cover also use generative AI. If additional categories appear, disclose the known code, promotional text, and cover graphics. Confirm the provenance of older story/art/audio before making broader claims. |
| App store links | Leave blank. No other store release was supplied or verified. |
| Custom noun | Leave blank; the default “game” is suitable. |
| Community | Comments, for tester feedback. |
| Visibility & access | Save as Draft while reviewing; use Restricted when inviting testers. Do not choose Public for this beta. |
| Cover image | `outputs/itch-promo-2026-09-16/veilfall-itch-cover.png` — 1408×1117, approximately the recommended 630×500 aspect ratio and above its minimum size. |
| Gameplay video or trailer | Leave blank until you upload the supplied MP4 to YouTube, then paste the actual YouTube watch URL. No placeholder URL. |
| Screenshots | The five PNGs in `outputs/itch-promo-2026-09-16/screenshots/`, in numbered order. |

These HTML settings follow [itch.io's HTML game instructions](https://itch.io/docs/creators/html5). The AI and screenshot recommendations follow its [quality guidelines](https://itch.io/docs/creators/quality-guidelines).

### Embed options after uploading

- Prefer **Click to launch in fullscreen**, which gives the reading interface the available browser viewport without a fixed embed dimension. Keep click-to-play enabled.
- If using Embed in page instead, begin with 960×720, enable the fullscreen button, and allow scrollbars. Test the uploaded game before inviting anyone.
- Leave Mobile Friendly unclaimed until actual Android Chrome and iPhone Safari tests are complete. A narrow desktop viewport is not a real-device test.
- Use Restricted download keys for individually controlled invitations, or an owner-chosen password for a shared small test group. Keep keys/passwords out of trailers and public descriptions. Restricted pages do not appear in itch.io search or browse. See [access control](https://itch.io/docs/creators/access-control).
- Test through an invited tester account, not only the owner session. Check start, refresh/resume, a save download and restore, scrolling, and fullscreen.
- Preserve the project/address when updating. Browser saves do not automatically move between browser origins; ask testers to export before moving the game.

## Paste-ready Description

### A promise can save a life. It can also bind you to an impossible duty.

You are a captain caught between two realms. Lead your people through shifting roads, besieged forts, and a city where everything has a price. Face armies, bargain with devils, and decide which promises are worth the power they give you.

**Veilfall: The Ember Oath** is an illustrated, reading-first dark fantasy RPG. Read each scene, choose your response, and manage the strength and trust you have left. Your decisions shape relationships, who survives, the fate of the gate between worlds, and the life you choose when the journey ends.

### What to expect

- A complete adventure across **12 playable chapters**, with a full ending.
- Choices with visible costs, lasting consequences, and multiple endings.
- Friendships and optional romance shaped by your decisions.
- Magic powered by binding promises: useful power with a duty attached.
- Adjustable text size, automatic browser saving, and save-file export/import.
- Play in your browser. No game installation is needed.

### About this beta

The full story is playable. This restricted beta is for testing clarity, choices, save reliability, and the reading experience—not a preview that stops halfway through the adventure.

Please tell me where you felt confused, encountered a bug, or found a choice that did not behave as expected. In **Settings**, describe the problem and use **Copy report**, then share it in the comments or with the person who invited you. Please avoid posting your full save or personal information publicly.

Progress is saved in this browser at this game address. Use **Export Save** for a backup before clearing browser data or moving to another browser or address.

**Content notes:** Dark fantasy violence, blood, injury, death, and coercive bargains. Romance is optional.

**AI assistance:** AI tools were used for code assistance, this promotional copy, and the new cover artwork.

---

Owner note, not part of the pasted description: expand the AI sentence if older narrative or artwork was also AI-generated. The current repository does not establish complete historical provenance. Do not claim that the entire project is human-made, AI-free, or licensed for redistribution without evidence. Confirm that you can use the existing artwork before uploading promotional material containing it.

## Media and screenshot captions

The screenshots are unaltered captures of the packaged game from a 1280×720 viewport, made in an isolated `127.0.0.1:4178` browser session. The browser's first four content captures measure 1265×712; the chapter-library capture measures 1280×720. No save injection, UI replacement, fake gameplay, or ending spoilers were used. The library is shown with its genuine early-playthrough unlock state.

| File | Optional caption / alt text |
| --- | --- |
| `01-title-screen.png` | Start a complete twelve-chapter dark fantasy adventure in your browser. |
| `02-story-and-character.png` | Illustrated scenes alongside your captain's resources and current objective. |
| `03-choices-and-costs.png` | Read the options, weigh the cost, and decide what happens next. |
| `04-first-black-arrow.png` | Lead the escort through danger in a story driven by your decisions. |
| `05-chapter-library.png` | Revisit unlocked chapters and explore a different path. |

The new cover is **AI-generated promotional art**, not a gameplay screenshot. It uses `public/art/caelan-east-gate.png` and `public/art/black-gate-fortress-ring.png` as character/style and environment references. It was made with the built-in image-generation tool; the exact prompt is saved as `outputs/itch-promo-2026-09-16/cover-prompt.txt`. The source reference artwork's historical authorship/license remains an owner verification item.

## YouTube teaser

File: `outputs/itch-promo-2026-09-16/veilfall-beta-teaser.mp4`.

- 34 seconds; 1280×720; 30 fps; H.264 video, AAC stereo audio; fast-start MP4.
- A captioned still-screen teaser with title cards and gentle transitions, **not recorded live gameplay**.
- Subtle oscillator-based ambient sound synthesized for this teaser at the owner's request. No borrowed recording, sampled music, voiceover, or generative-audio model is used. No background music has been added to the actual game.
- Title cards use locally installed Georgia/Arial fonts; font files and encoder binaries are not included in the upload kit.
- The renderer is `scripts/create-itch-teaser.mjs`. Its isolated encoder was provided by `imageio-ffmpeg` 0.6.0 / FFmpeg 7.1 in `work/media-tools`; project package dependencies were not changed.

Suggested YouTube title:

**Veilfall: The Ember Oath — Restricted Beta Teaser**

Suggested YouTube description:

> A first look at an illustrated, choice-driven dark fantasy adventure. Lead your people across two realms, weigh the cost of your promises, and shape your ending across twelve complete chapters.
>
> This video combines actual game screenshots with promotional cover art. It is a still-screen teaser, not recorded live gameplay. The subtle ambient soundtrack was synthesized for this video.
>
> The game is currently in restricted beta for invited testers.
>
> AI tools assisted with code, promotional copy, and cover artwork.

Upload it to your YouTube channel as **Unlisted**, allow embedding, then paste its actual watch link into itch.io's video field. Unlisted keeps it out of ordinary search/profile discovery but **anyone with the link can watch and reshare it**; it is not equivalent to Restricted itch.io access. See [YouTube's visibility guidance](https://support.google.com/youtube/answer/157177?hl=en-CA&ref_topic=9257440). Do not include beta access keys or passwords in the video or description.

## Capture finding for a separate code task

An existing Chapter I journal inconsistency was observed after selecting `swear-safe-arrival` at `march-order`: the scene grants Oathfire and records `oath-safe-arrival`, but the journal still says “No binding Oath or lasting injury is active.” `activePromises` in `app/page.tsx` recognizes `oath-bring-them-home` but does not list `oath-safe-arrival`. This task did not change gameplay code. The five supplied screenshots use the title, story, choice, ambush, and library screens rather than that inconsistent journal view. Correct the journal display in a separate scoped fix before treating the beta as fully signed off.

## Media validation

- Cover and all five screenshot files were opened for visual review; sampled teaser frames were checked for legible captions and layout.
- FFmpeg decoded the complete final MP4 without errors. Its audio measured approximately −31.9 dB mean and −22.6 dB peak; no clipping was detected.
- The local media gallery played the video through all 34 seconds in the Codex in-app browser, ending normally with no media error and a decoded video size of 1280×720.
- No real-device, itch.io upload, or YouTube processing test was performed in this media task. This does not replace the game's release-test matrix.
