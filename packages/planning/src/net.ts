import type { Quantity } from '@planforge/model';
import type { PlannedRequirement } from './types.js';

export function netRequirements(
  gross: readonly PlannedRequirement[],
  opening: Readonly<Record<string, Quantity>>,
): readonly PlannedRequirement[] {
  const balance = new Map<string, number>(Object.entries(opening));
  return [...gross]
    .sort((a, b) => a.bucketStart - b.bucketStart || a.itemId.localeCompare(b.itemId))
    .map((entry) => {
      const available = balance.get(entry.itemId) ?? 0;
      const consumed = Math.min(available, entry.gross);
      const net = Math.max(0, entry.gross - available) as Quantity;
      balance.set(entry.itemId, available - consumed);
      return { ...entry, projectedAvailable: available as Quantity, net };
    });
}
