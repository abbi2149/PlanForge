import type { OrderMixEntry, OrderMixResult } from './types.js';

export function calculateOrderMix(entries: readonly OrderMixEntry[]): readonly OrderMixResult[] {
  const grouped = new Map<string, number>();
  for (const entry of entries) grouped.set(entry.itemId, (grouped.get(entry.itemId) ?? 0) + entry.quantity);
  const total = [...grouped.values()].reduce((a, b) => a + b, 0);
  return [...grouped.entries()]
    .map(([itemId, quantity]) => ({ itemId: itemId as OrderMixResult['itemId'], quantity: quantity as OrderMixResult['quantity'], shareBasisPoints: total === 0 ? 0 : Math.round((quantity * 10_000) / total), rank: 0 }))
    .sort((a, b) => b.quantity - a.quantity || a.itemId.localeCompare(b.itemId))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
