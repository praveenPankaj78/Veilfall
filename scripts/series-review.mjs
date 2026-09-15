import vm from 'node:vm';
import ts from 'typescript';
import { writeFile } from 'node:fs/promises';
import { implementedChapterContracts } from './continuity-contract.mjs';

// Execute the actual UI transitions against an isolated in-memory save store.
// No browser save is read or changed, and no second copy of transition rules is used.
export async function checkSeriesReview(
  game,
  memory,
  pageSource,
  failures,
  save,
) {
  const ast = ts.createSourceFile(
    'page.tsx',
    pageSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const functions = new Map();
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name)
      functions.set(node.name.text, node.getText(ast));
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const chapters = [
    ...new Set(
      Object.keys(game.nodes).map((id) =>
        Number(id.match(/^c(\d+)-/)?.[1] ?? 1),
      ),
    ),
  ].sort((a, b) => a - b);
  const contracts = implementedChapterContracts.filter(
    (c) => c.series === 'caelan',
  );
  const names = [
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
  ];
  const starts = [...functions.keys()].filter((name) =>
    name.startsWith('startChapter'),
  );
  if (
    chapters.join() !== contracts.map((c) => c.chapter).join() ||
    starts.length !== chapters.length - 1
  )
    failures.push(
      'Registered chapter graph, continuity contracts, and UI handoffs have different coverage',
    );
  const wanted = [
    'defeatForChoice',
    'applyChoice',
    'activePromises',
    'recordChapterCheckpoint',
    'chapterStart',
    'replayChapter',
    ...starts,
  ];
  const code = [
    ...wanted.map((name) => functions.get(name)),
    `globalThis.runtime = { applyChoice, activePromises, replayChapter, normaliseState: normaliseGameState, starts: { ${starts.join(',')} } };`,
  ].join('\n');
  const context = {
    ...game,
    console,
    game: game.initialState,
    checkpointsRef: { current: {} },
    normaliseGameState: save.normaliseGameState,
    loadChapterState: (state) => {
      context.game = state;
    },
  };
  vm.runInNewContext(
    ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    }).outputText,
    context,
  );
  const runtime = context.runtime;
  const records = [];
  const observed = new Set();
  const priorities = [
    [],
    ['c5-take-ember-by-force', 'c7-take-no-formal-allies'],
    ['swear-safe-arrival', 'swear-home-oath', 'c5-pact-with-vaor'],
    ['c5-free-vaor'],
  ];
  // Independent continuous runs retain real resources across all eleven handoffs.
  // Chapter-local backtracking finds a nonlethal continuation, never adds resources.
  for (let run = 0; run < 5; run++) {
    context.checkpointsRef.current = {};
    context.game = structuredClone(game.initialState);
    if (run === 4)
      context.game.stats = {
        ...context.game.stats,
        health: 2,
        resolve: 1,
        command: 1,
        medicine: 0,
        oathfire: 0,
      };
    const record = {
      run,
      mode:
        run === 4
          ? 'low starting resources'
          : run === 2
            ? 'Oathfire priority'
            : 'fresh',
      chapters: [],
    };
    for (const contract of contracts) {
      const start = context.game;
      let attempts = 0;
      function walk(state, path) {
        if (++attempts > 50000 || path.length > 24) return null;
        if (state.defeat || state.stats.health <= 0) return null;
        const node = game.nodes[state.nodeId];
        if (node.final) return { state, path };
        const choices = node.choices.filter((c) => game.canChoose(c, state));
        function score(c) {
          if (priorities[run % priorities.length].includes(c.id)) return -1000;
          const costs = Object.entries(c.changes ?? {}).reduce(
            (sum, [key, value]) =>
              sum +
              (value < 0 ? -value * (key === 'health' ? 10 : 2) : -value / 10),
            0,
          );
          const fire = -(c.changes?.oathfire ?? 0);
          return (
            costs +
            (run === 2 && fire > 0 ? -20 : 0) +
            ((node.choices.indexOf(c) + run) % 4) / 4
          );
        }
        choices.sort((a, b) => score(a) - score(b));
        for (const choice of choices) {
          const next = runtime.applyChoice(state, choice);
          const result = walk(next, [...path, { state, choice }]);
          if (result) return result;
        }
        return null;
      }
      const result = walk(start, []);
      if (!result) {
        failures.push(
          `Continuous series route ${run} cannot complete Chapter ${contract.chapter}`,
        );
        break;
      }
      for (const { state, choice } of result.path) {
        const node = game.nodes[state.nodeId];
        observed.add(node.id);
        const text = [
          ...node.body(state),
          ...memory.knownTruths(state),
          ...memory.majorConsequences(state),
          choice.result,
        ].join('\n');
        if (
          /No Chapter \w+ .*recorded|No .* reached|test record is incomplete/i.test(
            text,
          )
        )
          failures.push(
            `Continuous route ${run} exposes an incomplete-state diagnostic at ${node.id}`,
          );
        // Retained legacy save fields must not change prose, mechanics, or choices.
        const detailed = {
          ...state,
          contentPreference: { intimacy: 'detailed', adultConfirmed: true },
        };
        const comparable = (s) =>
          JSON.stringify({ ...s, contentPreference: null });
        if (
          JSON.stringify(node.body(state)) !==
          JSON.stringify(node.body(detailed))
        )
          failures.push(`Legacy content fields change ${node.id} prose`);
        if (
          comparable(runtime.applyChoice(state, choice)) !==
          comparable(runtime.applyChoice(detailed, choice))
        )
          failures.push(`Legacy content fields change ${choice.id} mechanics`);
        if (
          node.choices
            .filter((c) => game.isChoiceVisible(c, state))
            .map((c) => c.id)
            .join() !==
          node.choices
            .filter((c) => game.isChoiceVisible(c, detailed))
            .map((c) => c.id)
            .join()
        )
          failures.push(
            `Legacy content fields change ${node.id} offered choices`,
          );
      }
      record.chapters.push({
        chapter: contract.chapter,
        startHealth: start.stats.health,
        endHealth: result.state.stats.health,
        choices: result.path.map((p) => p.choice.id),
        ending: result.state.nodeId,
      });
      context.game = result.state;
      if (contract.nextNode) {
        runtime.starts[`startChapter${names[contract.chapter - 1]}`]();
        if (
          context.game.nodeId !== contract.nextNode ||
          context.game.flags.join() !== result.state.flags.join() ||
          JSON.stringify(context.game.relationships) !==
            JSON.stringify(result.state.relationships)
        )
          failures.push(
            `Actual UI handoff from Chapter ${contract.chapter} drops continuity`,
          );
      }
    }
    record.finale = memory.caelanFinaleExport(context.game);
    if (
      !context.game.flags.includes('c12-series-complete') ||
      game.nodes[context.game.nodeId].choices.length
    )
      failures.push(`Continuous route ${run} lacks a terminal finale`);
    // Replay an earlier chapter using the actual UI implementation and snapshots.
    const originalFourth = JSON.stringify(context.checkpointsRef.current[4]);
    runtime.replayChapter(4);
    if (
      context.game.chapter !== 4 ||
      context.game.chapterChoices !== 0 ||
      context.game.flags.some((f) => /^c(?:[4-9]|1[012])-/.test(f))
    )
      failures.push(`Replay in route ${run} retained later story state`);
    if (
      Object.keys(context.checkpointsRef.current).some(
        (chapter) => Number(chapter) > 4,
      )
    )
      failures.push(`Replay in route ${run} retained a later checkpoint`);
    if (
      originalFourth &&
      JSON.stringify(context.checkpointsRef.current[4]) !== originalFourth
    )
      failures.push(`Replay in route ${run} modified its starting checkpoint`);
    records.push(record);
  }
  if (process.env.VEILFALL_SERIES_REVIEW_OUTPUT)
    await writeFile(
      process.env.VEILFALL_SERIES_REVIEW_OUTPUT,
      JSON.stringify(records, null, 2),
    );
  checkReviewRegressions(game, memory, runtime, failures);
  console.log(
    `Continuous series checks: ${records.length} twelve-chapter routes (four fresh, one low-resource boundary), ${observed.size} distinct decision nodes, actual UI handoffs and Chapter Four replay.`,
  );
}

function checkReviewRegressions(game, memory, runtime, failures) {
  const { nodes, initialState, isChoiceVisible } = game;
  const choice = (id) =>
    Object.values(nodes)
      .flatMap((n) => n.choices)
      .find((c) => c.id === id);
  const body = (id, flags = []) =>
    nodes[id].body({ ...initialState, nodeId: id, flags }).join(' ');
  const expect = (condition, message) => {
    if (!condition) failures.push(message);
  };
  expect(
    /father’s inn/.test(body('mara-returns')),
    'Mara’s childhood memory contradicts the innkeeper biography',
  );
  for (const flag of [
    'c4-lysara-mapped-nine',
    'c4-sensed-northern-nail',
    'c4-memorised-nine',
    'c4-rook-full-copy',
  ])
    expect(
      !/No Chapter Four map-record/.test(body('c5-north-road', [flag])),
      `Map record ${flag} is missing from the north-road callback`,
    );
  expect(
    /third town guard/.test(body('c4-collapse')) &&
      /two remaining guards/i.test(choice('c4-send-mara-with-brann').result),
    'Bridge guard accounting must preserve three arrivals minus one escort',
  );
  expect(
    !/Mara/.test(
      runtime.applyChoice(
        {
          ...initialState,
          chapter: 4,
          nodeId: 'c4-brass-span',
          stats: { ...initialState.stats, health: 1 },
          flags: ['c4-mara-escorted-brann'],
        },
        nodes['c4-brass-span'].choices.find(
          (c) => (c.changes?.health ?? 0) < 0,
        ),
      ).defeat?.body ?? '',
    ),
    'Bridge defeat summons Mara after her departure',
  );
  for (const c of Object.values(nodes).flatMap((n) => n.choices)) {
    if (/additional Wayfire|extra Wayfire/i.test(c.advantage ?? '')) {
      const owner = Object.values(nodes).find((n) => n.choices.includes(c));
      const freeSiblings = owner.choices.filter(
        (s) => s !== c && !Object.values(s.changes ?? {}).some((v) => v < 0),
      );
      expect(
        freeSiblings.every(
          (s) => (c.changes?.wayfire ?? 0) > (s.changes?.wayfire ?? 0),
        ),
        `${c.id} advertises an unearned extra Wayfire reward`,
      );
    }
    expect(
      !/older save|backward-compatible|owned-return flag|ending summary/i.test(
        `${c.label} ${c.detail} ${c.advantage}`,
      ),
      `${c.id} exposes implementation instructions in the choice menu`,
    );
  }
  for (const id of [
    'c8-give-ansel-first-question',
    'c8-give-ansel-first-question-after-entry',
  ])
    expect(
      /his promise to stay/.test(choice(id).result),
      `${id} transfers Ansel’s sold promise to his daughter`,
    );
  for (const flag of ['', 'captured-attacker'])
    expect(
      !/fever will kill/.test(body('c2-medicine', [flag])),
      'Effective triage guarantees a death the untreated route does not deliver',
    );
  for (const id of [
    'c9-match-original-ledger-cuts',
    'c9-authenticate-pell-packet',
  ])
    expect(
      !/Pell/.test(choice(id).result),
      `${id} requires a witness who can already be dead`,
    );
  expect(
    !/half-seal/.test(body('c8-oath-ledger', ['c8-lysara-knows-road-desire'])),
    'Lysara uses a seal earned only by a sibling preparation',
  );
  expect(
    !/marked escape lanes/.test(choice('c7-choose-salt-trap').result),
    'Unsurveyed salt approach claims surveyed escape lanes',
  );
  expect(
    !/army saw/.test(
      memory
        .majorConsequences({
          ...initialState,
          flags: ['c7-copied-gate-diversion'],
        })
        .join(' '),
    ),
    'Copying evidence prematurely records its presentation to the army',
  );
  expect(
    !/saved Pell/.test(
      memory
        .majorConsequences({ ...initialState, flags: ['c8-living-seed-spent'] })
        .join(' '),
    ),
    'Spent seed journal invents an optional earlier rescue',
  );
  expect(
    /Sira.*arm still bleeding/.test(
      body('c11-revolt-engine-phrase', ['c11-revolt-worker-injured']),
    ),
    'Sira’s arm injury changes at the engine',
  );
  expect(
    !/sank/.test(body('c8-force-deployment', ['c7-lost-gate-supplies'])),
    'Wrecked wagon sinks retrospectively',
  );
  expect(
    /before the roads divide/.test(choice('c4-bargain-with-rook').result),
    'Rook’s bargain promises a warning at a different time from its delivery',
  );
  expect(
    !/during the attack/.test(choice('c9-choose-theft-route').label),
    'The theft proposal contradicts its post-attack recovery',
  );
  for (const flags of [[], ['c4-mara-escorted-brann']])
    expect(
      !/you jump|both of you jump/.test(body('c4-brass-span', flags)),
      'The bridge is crossed before the crossing choice',
    );
  for (const id of ['c5-mara-burns', 'c5-lysara-burns'])
    expect(
      !/Sorin[^.]*treat the burn|he uses the same minute to treat/.test(
        body(id),
      ),
      'The setup overrides the selected burn caregiver',
    );
  const copyState = {
    ...initialState,
    flags: [
      'c9-mortal-cell-proved-authenticated-copy',
      'c5-took-ember-by-force',
    ],
  };
  for (const n of Object.values(nodes).filter((n) => n.id.startsWith('c10-')))
    expect(
      !/cooling under Vaor|seals cool at different speeds/.test(
        n.body(copyState).join(' '),
      ),
      `${n.id} invents permission for an evidence test`,
    );
  const retired = ['c11-freedom-door-order-restricted', 'c12-opening-stopped'];
  for (const flags of [retired, [...retired, 'c12-oathscar-door-order']]) {
    const state = runtime.normaliseState({
      ...initialState,
      chapter: 12,
      nodeId: 'c12-door-order',
      flags,
      history: [choice('c12-breach-door-order').result],
    });
    expect(
      state.flags.includes('c12-door-freedom-returned') &&
        !state.flags.includes('c12-oathscar-door-order'),
      'Either original retreat ending condition must release door order on load',
    );
    expect(
      !isChoiceVisible(choice('c12-breach-door-order'), state) &&
        isChoiceVisible(choice('c12-move-wounded-through-open-lane'), state),
      'A completed retreat Oath still punishes free crossing',
    );
    expect(
      memory.caelanFinaleExport(state).freedomRestrictions.doorOrder ===
        'fulfilled-returned',
      'Finale export resurrects a completed retreat restriction',
    );
    expect(
      !memory
        .majorConsequences(state)
        .some((p) => /cannot cross a contracted door first/.test(p)),
      'Journal resurrects a completed retreat restriction',
    );
    if (flags.includes('c12-oathscar-door-order'))
      expect(
        !state.history.some((p) => /scar burns across your wrist/.test(p)),
        'Corrected legacy finale retains an impossible scar in history',
      );
  }
  const before = {
    ...initialState,
    chapter: 12,
    nodeId: 'c12-stop-opening',
    flags: ['c11-freedom-door-order-restricted'],
  };
  const stop = Object.values(nodes)
    .flatMap((n) => n.choices)
    .find((c) => c.addFlags?.includes('c12-opening-stopped'));
  expect(
    runtime
      .applyChoice(before, stop)
      .flags.includes('c12-door-freedom-returned'),
    'Stopping the opening must immediately fulfil the retreat Oath',
  );
  expect(
    !game
      .resolveCompletedOathFlags(['c12-opening-stopped'])
      .includes('c12-door-freedom-returned'),
    'A freedom never transferred must not receive an invented fulfilment',
  );
  expect(
    game
      .resolveCompletedOathFlags([
        'c11-freedom-door-order-restricted',
        'c12-oathscar-door-order',
      ])
      .includes('c12-oathscar-door-order'),
    'An actual pre-completion breach must remain a breach',
  );
  for (const flag of [
    'c12-fragment-return-fulfilled',
    'c12-fragment-custody-amended',
    'c12-fragment-return-breached',
  ])
    expect(
      !runtime
        .activePromises({
          ...initialState,
          chapter: 12,
          flags: ['c9-return-promise-owned', flag],
        })
        .some((p) => /Return the Black Gate fragment/.test(p)),
      `${flag} leaves the old neutral-custody duty active in the journal`,
    );
  expect(
    !runtime
      .activePromises({
        ...initialState,
        chapter: 12,
        flags: ['c3-oath-hold-town', 'c4-oath-no-one-falls'],
      })
      .some((p) => /Harrowfen|Mileless Bridge/.test(p)),
    'Completed local duties remain active in the late journal',
  );
  expect(
    /completed Oath supplies no new power/.test(
      body('c12-four-laws', ['c12-law-support-no-one-falls']),
    ) &&
      /supplies no new magic/.test(
        choice('c12-support-law-with-no-one-falls').detail,
      ),
    'The Gate reuses the completed bridge Oath as magical fuel',
  );
  expect(
    /Renew Bring Them Home for this expedition/.test(
      choice('c11-test-mythic-shelter-transfer').detail,
    ),
    'The original escort promise silently gains new beneficiaries',
  );
  for (const [flags, pattern] of [
    [
      ['c11-freedom-command-restricted', 'c12-gate-sealed'],
      /now prevents any order/,
    ],
    [
      ['c11-freedom-hearing-restricted', 'c12-freedom-hearing-returned'],
      /cannot refuse their Price Court hearing/,
    ],
  ])
    expect(
      !memory
        .majorConsequences({ ...initialState, chapter: 12, flags })
        .some((p) => pattern.test(p)),
      'A completed mythic duty remains active in the journal',
    );
  for (const id of ['c12-first-collision', 'c12-door-order']) {
    const state = {
      ...initialState,
      nodeId: id,
      chapter: 12,
      flags: ['c9-roster-futureless', 'c11-route-revolt'],
    };
    for (const c of nodes[id].choices.filter((c) => isChoiceVisible(c, state)))
      expect(
        !/\bPell\b/.test(`${c.label} ${c.detail} ${c.result}`),
        `${c.id} puts Pell in an expedition he did not join`,
      );
  }
  const lawRequirements = {
    'c12-choose-sealed-gate': [
      /side/i,
      /delegates/i,
      /cannot be spent/i,
      /stranded/i,
      /sunrise/i,
    ],
    'c12-choose-consent-passage': [
      /withdraw/i,
      /joint bench/i,
      /living owners/i,
      /allies/i,
      /one year/i,
      /sunrise/i,
    ],
    'c12-choose-broken-gate': [
      /refuse bargains/i,
      /shield lines/i,
      /armies/i,
      /living makers/i,
      /Worldroot/i,
      /sunrise/i,
    ],
    'c12-choose-mortal-gatekeeper': [
      /hear individual/i,
      /refuse/i,
      /allies/i,
      /cannot spend or erase/i,
      /silence/i,
      /death/i,
      /sunrise/i,
    ],
  };
  for (const [id, patterns] of Object.entries(lawRequirements))
    expect(
      patterns.every((p) => p.test(choice(id).detail)),
      `${id} omits a pre-selection canonical consequence`,
    );
  for (const person of ['mara', 'lysara', 'ilyra', 'vexa'])
    for (const intent of [
      'committed',
      'exploring',
      'interested',
      'platonic',
      'ended',
      'hostile',
      'unresolved',
    ])
      for (const [id, flag, target] of [
        ['c12-close-relationship-honestly', 'c12-relationship-closed', 'ended'],
        [
          'c12-choose-fulfilled-single-life',
          'c12-relationship-single',
          'ended',
        ],
        [
          'c12-choose-enduring-friendship',
          'c12-relationship-friendship',
          'platonic',
        ],
      ]) {
        const state = {
          ...initialState,
          nodeId: 'c12-relationship-ending',
          chapter: 12,
          relationships: {
            ...initialState.relationships,
            [person]: {
              ...initialState.relationships[person],
              intent,
              attraction: 99,
            },
          },
        };
        const expected = ['committed', 'exploring', 'interested'].includes(
          intent,
        )
          ? target
          : intent;
        expect(
          runtime.applyChoice(state, choice(id)).relationships[person]
            .intent === expected,
          `${id} ignores ${person}'s ${intent} boundary`,
        );
        expect(
          runtime.normaliseState({ ...state, flags: [flag] }).relationships[
            person
          ].intent === expected,
          `Saved ${flag} restores ${person}'s ${intent} boundary incorrectly`,
        );
      }
}
