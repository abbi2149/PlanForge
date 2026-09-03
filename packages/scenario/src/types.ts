import type { ScenarioId } from '@planforge/model';

export interface ScenarioPatch {
  readonly path: string;
  readonly value: unknown;
}

export interface ScenarioDefinition {
  readonly id: ScenarioId;
  readonly name: string;
  readonly patches: readonly ScenarioPatch[];
}

export interface ScenarioSnapshot<T> {
  readonly id: ScenarioId;
  readonly name: string;
  readonly digest: string;
  readonly value: T;
}

export interface ScenarioDifference {
  readonly path: string;
  readonly left: unknown;
  readonly right: unknown;
}
