import type { ItemId, MoneyMinor, Quantity } from '@planforge/model';

export interface ProfitabilityInput {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly revenueMinor: MoneyMinor;
  readonly materialMinor: MoneyMinor;
  readonly conversionMinor: MoneyMinor;
  readonly logisticsMinor: MoneyMinor;
}

export interface ProfitabilityResult {
  readonly itemId: ItemId;
  readonly contributionMinor: number;
  readonly contributionPerUnitMinor: number;
  readonly marginBasisPoints: number;
}
