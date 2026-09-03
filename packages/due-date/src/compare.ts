import type { DueDateEstimate } from './types.js';

export function sortPromises(estimates: readonly DueDateEstimate[]): readonly DueDateEstimate[] {
  return [...estimates].sort((a, b) => a.promisedMinute - b.promisedMinute || a.orderId.localeCompare(b.orderId));
}

export function promiseSpread(estimates: readonly DueDateEstimate[]): number {
  if (estimates.length <= 1) return 0;
  const sorted = sortPromises(estimates);
  return sorted.at(-1)!.promisedMinute - sorted[0]!.promisedMinute;
}
