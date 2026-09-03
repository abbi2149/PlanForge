import type { ItemId, MoneyMinor, Quantity } from '@planforge/model';
import type { MaterialRate } from './types.js';

export interface MaterialUsage {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}

export function materialCost(usages: readonly MaterialUsage[], rates: readonly MaterialRate[]): MoneyMinor {
  const byItem = new Map(rates.map((rate) => [rate.itemId, rate.costMinorPerUnit]));
  return usages.reduce((sum, usage) => sum + usage.quantity * (byItem.get(usage.itemId) ?? 0), 0) as MoneyMinor;
}

export function missingMaterialRates(usages: readonly MaterialUsage[], rates: readonly MaterialRate[]): readonly ItemId[] {
  const known = new Set(rates.map((rate) => rate.itemId));
  return [...new Set(usages.filter((usage) => !known.has(usage.itemId)).map((usage) => usage.itemId))].sort();
}
