import { mean, percentile, type Minute } from '@planforge/model';
import { runSimulation } from './run.js';
import type { SimulationInput, SimulationResult } from './types.js';

export interface SimulationVariant {
  readonly name: string;
  readonly input: SimulationInput;
}

export interface SimulationVariantResult {
  readonly name: string;
  readonly result: SimulationResult;
}

export interface EnsembleSummary {
  readonly variants: number;
  readonly minimumMakespan: Minute;
  readonly maximumMakespan: Minute;
  readonly averageMakespan: number;
  readonly p90Makespan: number;
  readonly lateOrderFrequency: Readonly<Record<string, number>>;
}

export function runSimulationEnsemble(
  variants: readonly SimulationVariant[],
): readonly SimulationVariantResult[] {
  return [...variants]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((variant) => ({ name: variant.name, result: runSimulation(variant.input) }));
}

export function summarizeSimulationEnsemble(
  results: readonly SimulationVariantResult[],
): EnsembleSummary {
  const makespans = results.map((entry) => entry.result.makespan);
  const frequency: Record<string, number> = {};
  for (const entry of results) {
    for (const orderId of new Set(entry.result.lateOrders)) {
      frequency[orderId] = (frequency[orderId] ?? 0) + 1;
    }
  }
  return {
    variants: results.length,
    minimumMakespan: (makespans.length === 0 ? 0 : Math.min(...makespans)) as Minute,
    maximumMakespan: (makespans.length === 0 ? 0 : Math.max(...makespans)) as Minute,
    averageMakespan: mean(makespans),
    p90Makespan: percentile(makespans, 90),
    lateOrderFrequency: Object.fromEntries(Object.entries(frequency).sort(([a], [b]) => a.localeCompare(b))),
  };
}
