export type WasteCategory =
  | 'transport'
  | 'inventory'
  | 'motion'
  | 'waiting'
  | 'overproduction'
  | 'overprocessing'
  | 'defects'
  | 'skills';

export interface WasteObservation {
  readonly category: WasteCategory;
  readonly minutes: number;
  readonly costMinor: number;
  readonly note: string;
}

export interface WasteSummary {
  readonly totalMinutes: number;
  readonly totalCostMinor: number;
  readonly byCategoryMinutes: Readonly<Record<string, number>>;
}

export function summarizeWaste(observations: readonly WasteObservation[]): WasteSummary {
  const byCategory: Record<string, number> = {};
  for (const observation of observations) {
    byCategory[observation.category] = (byCategory[observation.category] ?? 0) + observation.minutes;
  }
  return {
    totalMinutes: observations.reduce((sum, observation) => sum + observation.minutes, 0),
    totalCostMinor: observations.reduce((sum, observation) => sum + observation.costMinor, 0),
    byCategoryMinutes: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))),
  };
}
