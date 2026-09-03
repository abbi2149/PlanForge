import type { ScenarioSnapshot } from './types.js';

export interface ScenarioScore {
  readonly scenarioId: string;
  readonly score: number;
}

export function rankScenarios<T>(
  scenarios: readonly ScenarioSnapshot<T>[],
  score: (value: T) => number,
): readonly ScenarioScore[] {
  return scenarios
    .map((scenario) => ({ scenarioId: scenario.id, score: score(scenario.value) }))
    .sort((a, b) => b.score - a.score || a.scenarioId.localeCompare(b.scenarioId));
}
