import type { Quantity } from '@planforge/model';
import type { YieldRule } from './types.js';

export function simulatedOutput(orderId: string, planned: Quantity, rules: readonly YieldRule[]): Quantity {
  const loss = rules
    .filter((rule) => rule.orderId === orderId)
    .reduce((sum, rule) => Math.min(10_000, sum + Math.max(0, rule.lossBasisPoints)), 0);
  return Math.floor((planned * (10_000 - loss)) / 10_000) as Quantity;
}
