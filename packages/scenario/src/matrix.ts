import { digestOf, failure, success, type ModelResult, type ScenarioId } from '@planforge/model';
import { diffScenarioValues } from './diff.js';
import { applyScenarioPatches } from './patch.js';
import type { ScenarioDefinition, ScenarioDifference, ScenarioSnapshot } from './types.js';

export interface ScenarioMatrixEntry<T> {
  readonly scenario: ScenarioSnapshot<T>;
  readonly differences: readonly ScenarioDifference[];
}

export interface ScenarioMatrix<T> {
  readonly baselineDigest: string;
  readonly entries: readonly ScenarioMatrixEntry<T>[];
}

export function buildScenarioMatrix<T>(
  baseline: T,
  scenarios: readonly ScenarioDefinition[],
): ModelResult<ScenarioMatrix<T>> {
  const baselineDigest = digestOf(baseline);
  const entries: ScenarioMatrixEntry<T>[] = [];
  for (const definition of [...scenarios].sort((a, b) => a.id.localeCompare(b.id))) {
    const patched = applyScenarioPatches(baseline, definition.patches);
    if (!patched.ok) {
      return failure(
        ...patched.diagnostics.map((diagnostic) => ({
          ...diagnostic,
          details: { ...(diagnostic.details ?? {}), scenarioId: definition.id },
        })),
      );
    }
    const scenario: ScenarioSnapshot<T> = {
      id: definition.id,
      name: definition.name,
      digest: digestOf(patched.value),
      value: patched.value,
    };
    entries.push({ scenario, differences: diffScenarioValues(baseline, patched.value) });
  }
  return success({ baselineDigest, entries });
}

export function unchangedScenarioIds<T>(matrix: ScenarioMatrix<T>): readonly ScenarioId[] {
  return matrix.entries
    .filter((entry) => entry.scenario.digest === matrix.baselineDigest)
    .map((entry) => entry.scenario.id)
    .sort();
}

export function scenarioDifferenceCounts<T>(matrix: ScenarioMatrix<T>): Readonly<Record<string, number>> {
  return Object.fromEntries(
    matrix.entries
      .map((entry): [string, number] => [entry.scenario.id, entry.differences.length])
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}
