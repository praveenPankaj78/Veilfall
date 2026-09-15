import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Render a still-screen teaser, not a claim of recorded live gameplay.
// Encoder is a local tooling dependency; no game dependencies are changed.
const root = process.cwd();
const assets = path.resolve(process.argv[2] ?? 'outputs/itch-promo-2026-09-16');
const encoderDirectory = path.join(
  root,
  'work/media-tools/imageio_ffmpeg/binaries',
);
const encoder =
  process.env.VEILFALL_FFMPEG ??
  path.join(
    encoderDirectory,
    readdirSync(encoderDirectory).find((name) =>
      /^ffmpeg.*\.exe$/.test(name),
    ) ?? 'missing',
  );
const work = path.join(root, 'work/itch-teaser');
mkdirSync(work, { recursive: true });
copyFileSync('C:/Windows/Fonts/georgia.ttf', path.join(work, 'serif.ttf'));
copyFileSync('C:/Windows/Fonts/arial.ttf', path.join(work, 'sans.ttf'));

function run(args) {
  const result = spawnSync(
    encoder,
    ['-hide_banner', '-loglevel', 'warning', '-y', ...args],
    {
      cwd: work,
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message ?? result.stderr);
}

function text(value, x, y, size = 28, color = '0xeee7d8', font = 'serif.ttf') {
  // Captions below intentionally avoid filtergraph punctuation needing escaping.
  return `drawtext=fontfile=${font}:text='${value}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`;
}

const slides = [
  { image: 'veilfall-itch-cover.png', seconds: 5, card: 'open' },
  {
    image: 'screenshots/02-story-and-character.png',
    seconds: 6,
    caption: 'Lead the people who depend on you.',
  },
  {
    image: 'screenshots/03-choices-and-costs.png',
    seconds: 6,
    caption: 'Read. Choose. Live with the consequences.',
  },
  {
    image: 'screenshots/04-first-black-arrow.png',
    seconds: 6,
    caption: 'Risk your strength. Keep your promises.',
  },
  {
    image: 'screenshots/05-chapter-library.png',
    seconds: 6,
    caption: 'Twelve chapters. One complete journey.',
  },
  { image: 'veilfall-itch-cover.png', seconds: 5, card: 'close' },
];
const duration = slides.reduce((sum, slide) => sum + slide.seconds, 0);
for (const [index, slide] of slides.entries()) {
  const imagePath = path.join(assets, slide.image);
  if (!existsSync(imagePath)) throw new Error(`Missing input: ${imagePath}`);
  const filters = slide.card
    ? [
        'scale=730:-2:flags=lanczos',
        'pad=1280:720:550:(oh-ih)/2:color=0x090c10',
        text('VEILFALL', 55, 142, 24, '0xcba06c'),
        text('The Ember Oath', 55, 184, 28),
        text(
          slide.card === 'open' ? 'EVERY PROMISE' : '12 CHAPTERS.',
          55,
          287,
          39,
        ),
        text(
          slide.card === 'open' ? 'HAS A PRICE.' : 'YOUR STORY.',
          55,
          341,
          39,
        ),
        text(
          slide.card === 'open'
            ? 'A dark fantasy story'
            : 'A complete adventure.',
          55,
          433,
          22,
          '0xb8b5af',
          'sans.ttf',
        ),
        text(
          slide.card === 'open'
            ? 'shaped by your choices.'
            : 'Play in your browser.',
          55,
          465,
          22,
          '0xb8b5af',
          'sans.ttf',
        ),
        text('RESTRICTED BETA', 55, 620, 17, '0xcba06c', 'sans.ttf'),
      ]
    : [
        'scale=1120:630:flags=lanczos',
        'pad=1280:720:80:16:color=0x090c10',
        'drawbox=x=79:y=15:w=1122:h=632:color=0x8a6748:t=1',
        text(slide.caption, '(w-text_w)/2', 670, 26),
      ];
  filters.push(
    'setsar=1',
    'format=yuv420p',
    'fade=t=in:st=0:d=0.35',
    `fade=t=out:st=${slide.seconds - 0.35}:d=0.35`,
  );
  run([
    '-loop',
    '1',
    '-framerate',
    '30',
    '-i',
    imagePath,
    '-t',
    String(slide.seconds),
    '-vf',
    filters.join(','),
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '18',
    '-r',
    '30',
    `slide-${index}.mp4`,
  ]);
  console.log(`Rendered slide ${index + 1}/${slides.length}`);
}

// A restrained A-minor drone made from oscillators, with slow modulation.
// No sampled music, external recording, speech, or generative-audio model.
const tone =
  '0.042*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*0.09*t))' +
  '+0.021*sin(2*PI*164.8138*t+0.5*sin(2*PI*0.07*t))' +
  '+0.012*sin(2*PI*220*t)*(0.6+0.4*sin(2*PI*0.13*t))' +
  '+0.008*sin(2*PI*261.6256*t)*(0.5+0.5*sin(2*PI*0.05*t))';
const inputs = slides.flatMap((_, index) => ['-i', `slide-${index}.mp4`]);
inputs.push('-f', 'lavfi', '-i', `aevalsrc=${tone}:s=48000:d=${duration}`);
const videoInputs = slides.map((_, index) => `[${index}:v:0]`).join('');
const graph =
  `${videoInputs}concat=n=${slides.length}:v=1:a=0[v];` +
  `[${slides.length}:a]lowpass=f=1800,afade=t=in:st=0:d=3,afade=t=out:st=${duration - 3}:d=3,pan=stereo|c0=c0|c1=c0[a]`;
const output = path.join(assets, 'veilfall-beta-teaser.mp4');
run([
  ...inputs,
  '-filter_complex',
  graph,
  '-map',
  '[v]',
  '-map',
  '[a]',
  '-t',
  String(duration),
  '-c:v',
  'libx264',
  '-preset',
  'medium',
  '-crf',
  '18',
  '-pix_fmt',
  'yuv420p',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  '-ar',
  '48000',
  '-movflags',
  '+faststart',
  output,
]);
run(['-i', output, '-f', 'null', '-']);
console.log(
  `Created and decode-checked ${duration}s, 1280x720, 30 fps H.264/AAC teaser: ${output}`,
);
