export interface RiskItem {
  readonly id: string;
  readonly category: 'supply' | 'capacity' | 'quality' | 'maintenance' | 'delivery' | 'workforce';
  readonly probabilityBasisPoints: number;
  readonly impact: number;
  readonly mitigation?: string;
}

export interface RiskScore {
  readonly id: string;
  readonly category: RiskItem['category'];
  readonly exposure: number;
  readonly rank: number;
}

export interface RiskPortfolio {
  readonly scores: readonly RiskScore[];
  readonly totalExposure: number;
  readonly highestCategory: string | null;
}
