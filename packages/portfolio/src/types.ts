import type { ScenarioId } from '@planforge/model';

export interface PortfolioCandidate {
  readonly scenarioId: ScenarioId;
  readonly valueScore: number;
  readonly riskScore: number;
  readonly costMinor: number;
}

export interface PortfolioSelection {
  readonly selected: readonly PortfolioCandidate[];
  readonly totalValue: number;
  readonly totalRisk: number;
  readonly totalCostMinor: number;
}
