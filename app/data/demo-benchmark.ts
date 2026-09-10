export type TaskKey = 'binding' | 'expression' | 'novelty' | 'diversity';
export type TargetKey = 'HER2' | 'PD-L1' | 'EGFR';

export type TaskDefinition = {
  key: TaskKey;
  label: string;
  metric: string;
  shortMetric: string;
  description: string;
  direction: 'higher' | 'lower';
  unit: string;
};

export type MetricObservation = {
  value: number;
  ci95: number;
  coverage: number;
  sampleCount: number;
  availability: 'available' | 'missing';
};

export type MetricSeries = {
  aggregate: MetricObservation & { aggregation: 'macro' | 'micro' };
  byTarget: Record<TargetKey, MetricObservation>;
};

export type DemoModel = {
  id: string;
  name: string;
  lab: string;
  family: string;
  parameters: string;
  access: string;
  released: string;
  status: 'Official' | 'Provisional';
  coverage: number;
  runs: number;
  color: string;
  description: string;
  scores: Record<TaskKey, MetricSeries>;
};

export const tasks: TaskDefinition[] = [
  {
    key: 'binding',
    label: 'Binding quality',
    metric: 'Binding hit rate',
    shortMetric: 'Hit rate',
    description: 'Share of evaluable generated candidates classified as target binders.',
    direction: 'higher',
    unit: '%',
  },
  {
    key: 'expression',
    label: 'Expression',
    metric: 'Expression success rate',
    shortMetric: 'Expression',
    description: 'Share of evaluable candidates that pass the expression criterion.',
    direction: 'higher',
    unit: '%',
  },
  {
    key: 'novelty',
    label: 'Novelty',
    metric: 'Novel sequence rate',
    shortMetric: 'Novelty',
    description: 'Share of candidates passing the benchmark novelty threshold.',
    direction: 'higher',
    unit: '%',
  },
  {
    key: 'diversity',
    label: 'Diversity',
    metric: 'Pairwise diversity',
    shortMetric: 'Diversity',
    description: 'Sequence-level diversity within each target-conditioned generation set.',
    direction: 'higher',
    unit: '%',
  },
];

export const targets: TargetKey[] = ['HER2', 'PD-L1', 'EGFR'];

function demoSeries(
  aggregateValue: number,
  byTarget: Record<TargetKey, number>,
  ci95: number,
  coverage: number | Record<TargetKey, number> = 100,
  sampleCount = 300,
): MetricSeries {
  const observation = (target: TargetKey): MetricObservation => ({
    value: byTarget[target],
    ci95,
    coverage: typeof coverage === 'number' ? coverage : coverage[target],
    sampleCount: Math.round(sampleCount / targets.length),
    availability: 'available',
  });

  return {
    aggregate: {
      value: aggregateValue,
      ci95,
      coverage: typeof coverage === 'number'
        ? coverage
        : Math.round(targets.reduce((sum, target) => sum + coverage[target], 0) / targets.length),
      sampleCount,
      availability: 'available',
      aggregation: 'macro',
    },
    byTarget: {
      HER2: observation('HER2'),
      'PD-L1': observation('PD-L1'),
      EGFR: observation('EGFR'),
    },
  };
}

export const demoModels: DemoModel[] = [
  {
    id: 'helixgen-3b',
    name: 'HelixGen-3B',
    lab: 'Open Protein Lab',
    family: 'Decoder-only PLM',
    parameters: '3.2B',
    access: 'Open weights',
    released: '2026-06',
    status: 'Official',
    coverage: 100,
    runs: 3,
    color: '#ff6b4a',
    description: 'A fictional target-conditioned sequence generator used to demonstrate the result schema and interface.',
    scores: {
      binding: demoSeries(48.7, { HER2: 51.2, 'PD-L1': 47.8, EGFR: 47.1 }, 2.1),
      expression: demoSeries(79.8, { HER2: 78.4, 'PD-L1': 81.2, EGFR: 79.7 }, 1.7),
      novelty: demoSeries(91.3, { HER2: 91.8, 'PD-L1': 89.6, EGFR: 92.4 }, 1.2),
      diversity: demoSeries(77.2, { HER2: 76.4, 'PD-L1': 78.2, EGFR: 77.1 }, 1.6),
    },
  },
  {
    id: 'abdesign-pro',
    name: 'AbDesign-Pro',
    lab: 'BioCompute',
    family: 'Diffusion model',
    parameters: '1.8B',
    access: 'API',
    released: '2026-02',
    status: 'Official',
    coverage: 100,
    runs: 3,
    color: '#426f62',
    description: 'A fictional diffusion baseline illustrating how hosted and open models can share one transparent protocol.',
    scores: {
      binding: demoSeries(45.3, { HER2: 48.4, 'PD-L1': 44.2, EGFR: 43.3 }, 1.8),
      expression: demoSeries(84.2, { HER2: 85.1, 'PD-L1': 83.4, EGFR: 84.2 }, 1.4),
      novelty: demoSeries(87.7, { HER2: 87.9, 'PD-L1': 88.7, EGFR: 86.6 }, 1.5),
      diversity: demoSeries(72.4, { HER2: 71.3, 'PD-L1': 72.4, EGFR: 73.6 }, 1.9),
    },
  },
  {
    id: 'nanoforge',
    name: 'NanoForge',
    lab: 'Sequence Works',
    family: 'Encoder-decoder PLM',
    parameters: '650M',
    access: 'Open weights',
    released: '2025-11',
    status: 'Official',
    coverage: 100,
    runs: 3,
    color: '#876bce',
    description: 'A fictional compact model demonstrating model cards, task-level ranking and target-aware comparison.',
    scores: {
      binding: demoSeries(41.9, { HER2: 44.7, 'PD-L1': 41.5, EGFR: 39.5 }, 2.6),
      expression: demoSeries(79.6, { HER2: 80.4, 'PD-L1': 78.8, EGFR: 79.6 }, 2.1),
      novelty: demoSeries(94.3, { HER2: 94.1, 'PD-L1': 93.3, EGFR: 95.4 }, 0.9),
      diversity: demoSeries(81.5, { HER2: 81.2, 'PD-L1': 82.5, EGFR: 80.7 }, 1.4),
    },
  },
  {
    id: 'proteinlm-x',
    name: 'ProteinLM-X',
    lab: 'Research Preview',
    family: 'Masked PLM',
    parameters: '7B',
    access: 'Research access',
    released: '2026-08',
    status: 'Provisional',
    coverage: 74,
    runs: 1,
    color: '#e2a42c',
    description: 'A fictional incomplete submission showing how provisional results remain visible without receiving an official rank.',
    scores: {
      binding: demoSeries(39.2, { HER2: 42.5, 'PD-L1': 38.6, EGFR: 36.5 }, 3.4, { HER2: 82, 'PD-L1': 76, EGFR: 64 }, 222),
      expression: demoSeries(75.5, { HER2: 76.2, 'PD-L1': 74.9, EGFR: 75.4 }, 3.1, { HER2: 82, 'PD-L1': 76, EGFR: 64 }, 222),
      novelty: demoSeries(96.3, { HER2: 96.4, 'PD-L1': 95.7, EGFR: 96.8 }, 1.1, { HER2: 82, 'PD-L1': 76, EGFR: 64 }, 222),
      diversity: demoSeries(83.5, { HER2: 83.4, 'PD-L1': 84.2, EGFR: 82.8 }, 2.7, { HER2: 82, 'PD-L1': 76, EGFR: 64 }, 222),
    },
  },
  {
    id: 'motif-sampler',
    name: 'MotifSampler',
    lab: 'Reference baseline',
    family: 'Retrieval baseline',
    parameters: '—',
    access: 'Open source',
    released: '2026-01',
    status: 'Official',
    coverage: 100,
    runs: 3,
    color: '#6d7772',
    description: 'A fictional non-neural reference baseline included to anchor interpretation of generative model scores.',
    scores: {
      binding: demoSeries(32.3, { HER2: 34.1, 'PD-L1': 30.8, EGFR: 31.9 }, 2.2),
      expression: demoSeries(88.1, { HER2: 88.4, 'PD-L1': 87.9, EGFR: 88.1 }, 1.1),
      novelty: demoSeries(30.0, { HER2: 28.7, 'PD-L1': 31.2, EGFR: 30.1 }, 2.8),
      diversity: demoSeries(42.3, { HER2: 41.5, 'PD-L1': 43.1, EGFR: 42.3 }, 2.5),
    },
  },
];

export function resultFor(model: DemoModel, task: TaskKey, target: TargetKey | 'All targets') {
  return target === 'All targets' ? model.scores[task].aggregate : model.scores[task].byTarget[target];
}

export function scoreFor(model: DemoModel, task: TaskKey, target: TargetKey | 'All targets') {
  return resultFor(model, task, target).value;
}
