import type { ItemId, Quantity } from '@planforge/model';

export interface MixDemand {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}

export interface HeijunkaSlot {
  readonly slot: number;
  readonly itemId: ItemId;
}

export function levelMix(demand: readonly MixDemand[]): readonly HeijunkaSlot[] {
  const remaining = new Map(demand.map((entry) => [entry.itemId, entry.quantity as number]));
  const total = demand.reduce((sum, entry) => sum + entry.quantity, 0);
  const result: HeijunkaSlot[] = [];
  for (let slot = 1; slot <= total; slot += 1) {
    const candidates = [...remaining.entries()]
      .filter(([, quantity]) => quantity > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const next = candidates[0];
    if (!next) break;
    result.push({ slot, itemId: next[0] });
    remaining.set(next[0], next[1] - 1);
  }
  return result;
}
