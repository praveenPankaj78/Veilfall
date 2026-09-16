export type GateLawReviewGroup = {
  label: string;
  body: string;
};

export type GateLawReview = {
  choiceId: string;
  title: string;
  summary: string;
  groups: GateLawReviewGroup[];
};

export const GATE_LAW_REVIEWS: Record<string, GateLawReview> = {
  'c12-choose-sealed-gate': {
    choiceId: 'c12-choose-sealed-gate',
    title: 'Seal the Cinder Deep',
    summary:
      'After a last free choice of side, no crossing remains. Caelan also loses the right to cross.',
    groups: [
      {
        label: 'Crossing',
        body: 'Final free choice of side. Thereafter no person, army, offer, promise, or message crosses.',
      },
      {
        label: 'Stored promises',
        body: 'Stored promises stay locked in the stone. They cannot be spent.',
      },
      {
        label: 'Allies and ordinary people',
        body: 'Allies who stay behind become stranded. Nobody can force another person to leave.',
      },
      {
        label: 'Caelan’s price',
        body: 'Caelan loses the right to cross after choosing a side.',
      },
      {
        label: 'Duration and replacement',
        body: 'Neither ruler reopens it alone. Separately chosen delegates of both realms must freely replace it.',
      },
      {
        label: 'Sunrise',
        body: 'Barred dawn. One road of light stays barred.',
      },
    ],
  },
  'c12-choose-consent-passage': {
    choiceId: 'c12-choose-consent-passage',
    title: 'Open a crossing only when both sides and the traveller say yes',
    summary:
      'A named willing traveller and keepers on both sides must agree. Caelan owes a year of public service without unwitnessed crossing.',
    groups: [
      {
        label: 'Crossing',
        body: 'Named willing traveller and chosen keepers on both sides. Any signer may withdraw before crossing.',
      },
      {
        label: 'Stored promises',
        body: 'Stored promises wait for public review and return to original living owners.',
      },
      {
        label: 'Allies and ordinary people',
        body: 'Allies need permission too. No one is moved by another person’s yes.',
      },
      {
        label: 'Caelan’s price',
        body: 'Caelan owes one year of public service and no unwitnessed crossing during it.',
      },
      {
        label: 'Duration and replacement',
        body: 'Either realm may close. Yearly renewal by both, and joint public dispute review.',
      },
      {
        label: 'Sunrise',
        body: 'Witnessed narrow dawn road. A narrow road of light opens only when witnesses on both sides name it.',
      },
    ],
  },
  'c12-choose-broken-gate': {
    choiceId: 'c12-choose-broken-gate',
    title: 'Break the Gate',
    summary:
      'No central Gate owner remains. Caelan keeps movement and loses central control of invasion.',
    groups: [
      {
        label: 'Crossing',
        body: 'No central Gate owner. Individual bargain refusal remains. Allies and invaders may cross.',
      },
      {
        label: 'Stored promises',
        body: 'Stored promises return to living makers or Worldroot without a new owner. Their release strikes both lines, and weaker defence suffers more.',
      },
      {
        label: 'Allies and ordinary people',
        body: 'Allies and invading armies can cross freely in both directions. People may refuse bargains.',
      },
      {
        label: 'Caelan’s price',
        body: 'Caelan keeps movement but loses central control of invasion.',
      },
      {
        label: 'Duration and replacement',
        body: 'Lasts until people establish another law. No central authority may close the road alone.',
      },
      {
        label: 'Sunrise',
        body: 'Unstable dawn road.',
      },
    ],
  },
  'c12-choose-mortal-gatekeeper': {
    choiceId: 'c12-choose-mortal-gatekeeper',
    title: 'Take the Gate into Caelan',
    summary:
      'Caelan may admit a named willing person or refuse armies. He hears every stored promise and cannot live wholly in either realm.',
    groups: [
      {
        label: 'Crossing',
        body: 'Caelan may admit a named willing person or refuse armies using publicly witnessed identity, never new true-name access. Travelers may refuse.',
      },
      {
        label: 'Stored promises',
        body: 'Separate promise voices enter him. He cannot spend, erase, or silence them.',
      },
      {
        label: 'Allies and ordinary people',
        body: 'Allies ask. Every traveller may refuse. He hears individual requests.',
      },
      {
        label: 'Caelan’s price',
        body: 'He cannot give away or abandon the boundary, and cannot live wholly in either realm.',
      },
      {
        label: 'Duration and replacement',
        body: 'Ends at death or a freely accepted replacement law releasing every voice.',
      },
      {
        label: 'Sunrise',
        body: 'Light bends around witnessed identity.',
      },
    ],
  },
};

export const GATE_LAW_CHOICE_IDS = Object.keys(GATE_LAW_REVIEWS);
