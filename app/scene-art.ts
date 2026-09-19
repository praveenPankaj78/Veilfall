export type SceneArtKey =
  | 'departure'
  | 'ambush'
  | 'folded'
  | 'inn'
  | 'othernights'
  | 'foldedcellar'
  | 'roadpin'
  | 'harrowfen'
  | 'shiftingmarket'
  | 'bridgereveal'
  | 'mileless'
  | 'crossroads'
  | 'nails'
  | 'dragonspine'
  | 'vaor'
  | 'ember'
  | 'kharad'
  | 'storm'
  | 'moot'
  | 'redwind'
  | 'saltbattle'
  | 'marshal'
  | 'blackgate'
  | 'futureless'
  | 'embassy'
  | 'cinderembassy'
  | 'twosidedattack'
  | 'gatecrossing'
  | 'ashroadoffer'
  | 'privateoffers'
  | 'vathisapproach'
  | 'vathisstreets'
  | 'vathisauction'
  | 'vathisengine'
  | 'blackgatecollision'
  | 'blackgatesealed'
  | 'blackgatepassage'
  | 'blackgatebroken'
  | 'blackgatekeeper';

export type SceneArtwork = {
  src: string;
  src800: string;
  alt: string;
};

function plate(basename: string, alt: string): SceneArtwork {
  return {
    src: `/art/${basename}.webp`,
    src800: `/art/${basename}-800.webp`,
    alt,
  };
}

export const sceneArtwork: Record<SceneArtKey, SceneArtwork> = {
  departure: plate(
    'caelan-east-gate',
    'Caelan and Mara travel with the diplomatic escort beyond Greyhaven',
  ),
  ambush: plate(
    'kings-road-ambush',
    'Caelan and Mara defend the diplomatic escort from black arrows on the rain-soaked King’s Road',
  ),
  folded: plate(
    'kings-road-folded',
    'Caelan and the wounded escort face an impossible sea across the King’s Road',
  ),
  inn: plate(
    'bellweather-inn',
    'Caelan leads the wounded escort into Bellweather Inn during a storm',
  ),
  othernights: plate(
    'bellweather-other-nights',
    'Caelan and Mara protect the wounded as other nights open inside Bellweather Inn',
  ),
  foldedcellar: plate(
    'bellweather-folded-cellar',
    'Caelan and Tivik follow an impossible road through the repeating cellar beneath Bellweather Inn',
  ),
  roadpin: plate(
    'bellweather-road-pin',
    'Caelan and Tivik discover the damaged iron road pin beneath Bellweather Inn',
  ),
  harrowfen: plate(
    'harrowfen-wrong-mile',
    'Caelan approaches Harrowfen while royal archers watch from the canal gate',
  ),
  shiftingmarket: plate(
    'harrowfen-shifting-market',
    'Caelan, Mara, and Tivik protect Harrowfen as alternate streets return around the old well',
  ),
  bridgereveal: plate(
    'mileless-bridge-reveal',
    'Caelan and his companions discover the Mileless Bridge crossing several worlds beneath different skies',
  ),
  mileless: plate(
    'mileless-bridge-chase',
    'Caelan pursues Rook and Ordan across the broken arches of the Mileless Bridge',
  ),
  crossroads: plate(
    'mileless-three-spans',
    'Caelan and his companions face three impossible roads beneath different skies',
  ),
  nails: plate(
    'nine-nails-revelation',
    'Caelan, Mara, Lysara, and Rook discover the hidden map of nine World Nails',
  ),
  dragonspine: plate(
    'dragonspine-coldfire',
    'Caelan, Mara, and Lysara climb the glass valleys while cold fire hunts them',
  ),
  vaor: plate(
    'vaor-memory-grave',
    'Caelan, Mara, Lysara, and Sorin stand before Vaor imprisoned in memory glass',
  ),
  ember: plate(
    'ember-bearer-vision',
    'Caelan carries Vaor’s ember while a vision of the Black Gate opens above him',
  ),
  kharad: plate(
    'kharad-vey-wheel-city',
    'Caelan and his companions approach Kharad Vey as the wheel town crosses the Ember Steppe',
  ),
  storm: plate(
    'ancestor-storm-attack',
    'Caelan and Korran defend the moving town from an ancestor storm',
  ),
  moot: plate(
    'red-moot-ilyra',
    'Caelan and Ilyra stand before the Red Moot while ancestor voices gather outside',
  ),
  redwind: plate(
    'red-wind-pursuit',
    'Caelan and the moving Kharad town flee Asterra Crown soldiers beneath a red ancestor storm',
  ),
  saltbattle: plate(
    'salt-basin-battle',
    'Caelan and Ilyra face the divided Crown March in the Salt Basin',
  ),
  marshal: plate(
    'marshal-field-confrontation',
    'Caelan confronts Marshal Teren Voss while a dead commander forms in the red storm',
  ),
  blackgate: plate(
    'black-gate-fortress-ring',
    'Caelan approaches the eight cold forts surrounding the colossal Black Gate',
  ),
  futureless: plate(
    'futureless-fort-breach',
    'Caelan and the defenders of Fourth Fort fight to save its wounded during the Gate breach',
  ),
  embassy: plate(
    'first-devil-embassy',
    'Vexa Ash leads the first devil embassy across the Black Gate under open safe conduct',
  ),
  cinderembassy: plate(
    'cinder-deep-embassy',
    'Caelan and Vexa face each other across the neutral Cinder Deep embassy table',
  ),
  twosidedattack: plate(
    'two-sided-assassination',
    'Mortal handbow assassins and rival devil chain wielders attack the embassy from opposite sides',
  ),
  gatecrossing: plate(
    'black-gate-crossing',
    'Caelan crosses the Black Gate with Vexa, willing allies, and the recovered Gate Nail fragment',
  ),
  ashroadoffer: plate(
    'ash-road-first-offer',
    'A clear cup of water rises from the ash before Caelan and the expedition',
  ),
  privateoffers: plate(
    'ash-road-private-offers',
    'Caelan and the expedition face separate glowing offers along the Ash Road',
  ),
  vathisapproach: plate(
    'vathis-approach',
    'Caelan leads the surviving expedition toward the divided towers of Vathis',
  ),
  vathisstreets: plate(
    'vathis-contract-streets',
    'Contract streets move between the black hand shaped towers of Vathis',
  ),
  vathisauction: plate(
    'vathis-invasion-auction',
    'Three Price Court seals hang above the circular invasion auction in Vathis',
  ),
  vathisengine: plate(
    'vathis-engine-gate',
    'Malrec’s white engine pulls contract chains as the inner Black Gate begins to open',
  ),
  blackgatecollision: plate(
    'black-gate-two-faces',
    'The mortal fortress ring and Vathis face each other through the widening Black Gate',
  ),
  blackgatesealed: plate(
    'black-gate-sealed',
    'The sealed Black Gate divides a pale mortal dawn from distant Cinder Deep fire',
  ),
  blackgatepassage: plate(
    'black-gate-mutual-passage',
    'Independent mortal and devil witnesses watch a narrow consent governed passage',
  ),
  blackgatebroken: plate(
    'black-gate-broken',
    'The shattered Black Gate releases many distinct promise lights into both realms',
  ),
  blackgatekeeper: plate(
    'caelan-living-gate',
    'Caelan carries ember lines of the Black Gate while distinct voices circle him',
  ),
};

export const COVER_ART = sceneArtwork.departure;

export function artworkSrcSet(art: SceneArtwork) {
  return `${art.src800} 800w, ${art.src} 1536w`;
}

export function deliveredArtworkSrcSet(art: SceneArtwork) {
  const srcSet = artworkSrcSet(art);
  if (process.env.NEXT_PUBLIC_VEILFALL_TARGET !== 'itch') return srcSet;
  return srcSet.replaceAll('/art/', './art/');
}

export function publicArtPath(src: string) {
  return `public${src}`;
}
