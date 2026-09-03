import type { MoneyMinor } from '@planforge/model';
import type { LaborCostLine } from './types.js';

export interface LaborCostSummary {
  readonly regularCostMinor: MoneyMinor;
  readonly overtimeCostMinor: MoneyMinor;
  readonly totalCostMinor: MoneyMinor;
  readonly workerCount: number;
}

export function summarizeLaborCost(lines: readonly LaborCostLine[]): LaborCostSummary {
  const regular = lines.reduce((sum, line) => sum + line.regularCostMinor, 0) as MoneyMinor;
  const overtime = lines.reduce((sum, line) => sum + line.overtimeCostMinor, 0) as MoneyMinor;
  return { regularCostMinor: regular, overtimeCostMinor: overtime, totalCostMinor: (regular + overtime) as MoneyMinor, workerCount: new Set(lines.map((line) => line.workerId)).size };
}
