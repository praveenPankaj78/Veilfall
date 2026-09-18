import {
  nodes,
  type GameState,
  type StoryNode,
} from './game-data';
import {
  sceneArtwork,
  type SceneArtKey,
  type SceneArtwork,
} from './scene-art';

// Presentation-only assignments: authored story nodes and outcomes stay untouched.
function plate(basename: string, alt: string): SceneArtwork {
  return {
    src: `/art/${basename}.webp`,
    src800: `/art/${basename}-800.webp`,
    alt,
  };
}

export const additionalArtwork = {
  drownedmile: plate(
    'kings-road-drowned-mile',
    'Floodwater surrounds the treaty wagon and a stranded family on the low King’s Road',
  ),
  inspectionyard: plate(
    'eastwatch-saboteur',
    'A disguised saboteur flees from the treaty wagon outside Eastwatch',
  ),
  infirmary: plate(
    'bellweather-infirmary',
    'One sealed dose and makeshift beds in Bellweather’s common-room infirmary',
  ),
  archive: plate(
    'harrowfen-burning-archive',
    'A clerk holds threatened route records in Harrowfen’s canal-side archive',
  ),
  watchhouse: plate(
    'harrowfen-watch-house',
    'Smoke fills Harrowfen’s watch house around endangered orders and a trapped scout',
  ),
  stormspan: plate(
    'mileless-storm-span',
    'Waves strike a narrow black-stone span above the storm coast',
  ),
  mirrorstage: plate(
    'rook-mirrored-stage',
    'Rook rigs a mirrored curtain whose false officer repeats across the Mileless Bridge',
  ),
  royaldrill: plate(
    'dragonspine-royal-drill',
    'An iron extraction drill stands in the frozen royal camp beneath Dragonspine',
  ),
  orivane: plate(
    'orivane-concord-memory',
    'Orivane’s heart-fire separates the realms as one remembered village fades',
  ),
  brokenaxle: plate(
    'kharad-broken-axle',
    'Repair crews brace Kharad Vey’s failing western axle beneath the houses',
  ),
  brakeforge: plate(
    'kharad-brake-forge',
    'Dema’s crew confronts a cracked brake casting on Kharad Vey’s tilting forge deck',
  ),
  signalhorn: plate(
    'red-wind-signal-horn',
    'An empty signal horn carries a dead commander’s order through the red storm',
  ),
  saltfracture: plate(
    'salt-basin-fracture',
    'Crown riders reach the fragile salt crust above dark brine',
  ),
  fortledgers: plate(
    'fourth-fort-ledgers',
    'Seventeen years of ledgers lie hidden behind Fourth Fort’s duty board',
  ),
  buriedchain: plate(
    'black-gate-buried-chain',
    'An exposed section of the buried chain connects the cold fort ring',
  ),
  namebeads: plate(
    'vexa-name-beads',
    'Two brass beads demonstrate the limited pointing power of a freely spoken self-name',
  ),
  neutralfragment: plate(
    'gate-nail-neutral-custody',
    'The broken Gate Nail rests in its cracked case at the neutral table',
  ),
  fallingstones: plate(
    'ash-road-falling-stones',
    'Six pale stones tilt into the red depth as a rope marks solid ground',
  ),
  ledgershelter: plate(
    'free-ledger-shelter',
    'The Free Ledger clears listening marks beside a shelter with two open exits',
  ),
  publichearing: plate(
    'vathis-public-hearing',
    'Three petitioners bring separate claims to Vathis’s open public bench',
  ),
  liftingroofs: plate(
    'vathis-lifting-roofs',
    'Stone shelter roofs lift away from Vathis’s debt workers’ square',
  ),
  mararomance: plate(
    'mara-quiet-shelter',
    'Caelan and Mara share a quiet embrace beneath the shelter blanket',
  ),
  lysararomance: plate(
    'lysara-quiet-shelter',
    'Caelan and Lysara rest together with the treaty ribbon left outside the shelter',
  ),
  vexaromance: plate(
    'vexa-unbound-room',
    'Caelan and Vexa share a quiet moment in the unbound guest room',
  ),
  ilyraromance: plate(
    'ilyra-chosen-kiss',
    'Caelan and Ilyra share their chosen kiss in the hollow below Black Ridge',
  ),
  ridgeroad: plate(
    'eastwatch-ridge-road',
    'The treaty wagon crawls an exposed Eastwatch ridge beside a steep drop while a shepherd tower flashes a signal mirror',
  ),
  alderwood: plate(
    'kings-road-alderwood-rise',
    'The treaty escort continues along a rainy wooded King’s Road toward Bellweather before the ambush',
  ),
  snowspan: plate(
    'mileless-snow-span',
    'Cold blue flame bowls line a snowbound Mileless span while Crown soldiers cut steps on the slope ahead',
  ),
  brassspan: plate(
    'mileless-brass-span',
    'Huge brass gears carry a road platform between closing metal teeth in a Mileless Bridge cavern',
  ),
  upperlanding: plate(
    'bellweather-upper-landing',
    'Caelan and Mara share a quiet watch on Bellweather’s upper landing while rain and a shifting road show through the window',
  ),
  upperfork: plate(
    'dragonspine-upper-fork',
    'Caelan, Mara, Lysara, and Sorin face three unused paths at Dragonspine’s upper valley fork',
  ),
} satisfies Record<string, SceneArtwork>;

export const sceneArtOverrides: Partial<Record<string, string>> = {
  // Chapter I: unique plates on the three road forks, then one shared
  // post-reconvergence King’s Road plate until the ambush.
  'low-road': 'drownedmile',
  'inspection-yard': 'inspectionyard',
  'ridge-road': 'ridgeroad',
  'march-order': 'alderwood',
  'road-conversation': 'alderwood',
  // Chapter II: stay on the common-room infirmary through the indoor search, then
  // use the cellar road when that search goes below. Night-watch is the
  // reconverge on the upper landing. The storm-arrival exterior is only for the
  // threshold and the dawn after the inn is fixed.
  'c2-triage': 'infirmary',
  'c2-medicine': 'infirmary',
  'c2-eleven-years': 'infirmary',
  'c2-investigate': 'infirmary',
  'c2-ledger': 'infirmary',
  'c2-attacker': 'infirmary',
  'c2-night-watch': 'upperlanding',
  'c2-cellar': 'foldedcellar',
  // Chapter III: archive interior is unique. Healer and broker stay on the
  // Harrowfen canal-town plate rather than the archive or later watch-house.
  'c3-archive': 'archive',
  'c3-watch-house': 'watchhouse',
  // Chapter IV: each span has its own on-span plate. c4-stage-turn returns to
  // mileless-three-spans after reconvergence so a chosen span cannot leak.
  'c4-storm-span': 'stormspan',
  'c4-snow-span': 'snowspan',
  'c4-brass-span': 'brassspan',
  'c4-theatre-plan': 'mirrorstage',
  'c4-anchor': 'mirrorstage',
  // Chapter V: the glass-valley arrival stays on dragonspine-coldfire. The
  // royal camp is unique. The upper fork stays through the three climbs and
  // the grave door so later mountain beats do not snap back to the valley.
  'c5-royal-camp': 'royaldrill',
  'c5-three-climbs': 'upperfork',
  'c5-glass-stair': 'upperfork',
  'c5-frozen-river': 'upperfork',
  'c5-ash-tunnel': 'upperfork',
  'c5-grave-mouth': 'upperfork',
  'c5-heart-memory': 'orivane',
  'c6-broken-axle': 'brokenaxle',
  'c6-forge-duty': 'brakeforge',
  // Shrine duty is on the moving city, not the later ancestor-storm battle.
  'c6-shrine-duty': 'kharad',
  'c7-dead-horn': 'signalhorn',
  'c7-salt-trap': 'saltfracture',
  'c8-hidden-record': 'fortledgers',
  'c8-chain-plan': 'buriedchain',
  'c9-name-demonstration': 'namebeads',
  'c9-recover-fragment': 'neutralfragment',
  'c10-road-danger': 'fallingstones',
  'c10-free-ledger': 'ledgershelter',
  'c10-limits': 'ledgershelter',
  'c10-rest-choice': 'ledgershelter',
  'c10-guide-bargain': 'ledgershelter',
  'c11-petition-hearing': 'publichearing',
  'c11-revolt-crisis': 'liftingroofs',
};

export type VisibleArtwork = {
  hero: SceneArtwork;
  romance: SceneArtwork | null;
};

export type ScrollLanding = 'hero' | 'romance' | 'story';

export function artworkForScene(node: StoryNode): SceneArtwork {
  const key = sceneArtOverrides[node.id];
  if (key && key in additionalArtwork)
    return additionalArtwork[key as keyof typeof additionalArtwork];
  if (key && key in sceneArtwork) return sceneArtwork[key as SceneArtKey];
  if (node.art) return sceneArtwork[node.art];
  return sceneArtwork.departure;
}

export function artworkAssignmentKind(
  node: StoryNode,
): 'override' | 'node-art' | 'missing' {
  if (sceneArtOverrides[node.id]) return 'override';
  if (node.art) return 'node-art';
  return 'missing';
}

export function visibleArtworkForState(state: GameState): VisibleArtwork {
  const node = nodes[state.nodeId];
  return {
    hero: artworkForScene(node),
    romance: romanceArtworkForScene(state),
  };
}

export function scrollLandingAfterTransition(
  before: GameState,
  after: GameState,
): ScrollLanding {
  const previous = visibleArtworkForState(before);
  const next = visibleArtworkForState(after);
  const heroChanged = previous.hero.src !== next.hero.src;
  const romanceChanged =
    (previous.romance?.src ?? null) !== (next.romance?.src ?? null);
  if (heroChanged) return 'hero';
  if (romanceChanged) return 'romance';
  return 'story';
}

// The same exact authored event must be present on the current page. Historical
// attraction or a past encounter never enables an illustration in another scene.
export function romanceArtworkForScene(state: GameState): SceneArtwork | null {
  if (
    state.nodeId === 'c9-recover-fragment' &&
    state.flags.includes('c9-shared-private-night')
  ) {
    return additionalArtwork.vexaromance;
  }
  if (state.nodeId === 'c10-guide-bargain') {
    if (state.flags.includes('c10-rest-with-mara'))
      return additionalArtwork.mararomance;
    if (state.flags.includes('c10-rest-with-lysara'))
      return additionalArtwork.lysararomance;
  }
  if (
    state.nodeId === 'c7-marshal-parley' &&
    typeof ILYRA_KISS_RESULT === 'string' &&
    ILYRA_KISS_RESULT.length > 0 &&
    state.history.at(-1) === ILYRA_KISS_RESULT
  ) {
    return additionalArtwork.ilyraromance;
  }
  return null;
}

export const ILYRA_KISS_RESULT = nodes['c7-ilyra-future'].choices.find(
  (choice) => choice.id === 'c7-ilyra-deepen-bond',
)?.result;
