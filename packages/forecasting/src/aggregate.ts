import type { ItemId, Quantity } from '@planforge/model';
import type { DemandPoint } from './types.js';

export function aggregateDemand(points: readonly DemandPoint[]): readonly DemandPoint[] {
  const totals = new Map<string, number>();
  for (const point of points) {
    const key = `${point.itemId}\u0000${point.period}`;
    totals.set(key, (totals.get(key) ?? 0) + point.quantity);
  }
  return [...totals.entries()]
    .map(([key, value]) => {
      const [itemId, period] = key.split('\u0000');
      return { itemId: itemId as ItemId, period: Number(period), quantity: value as Quantity };
    })
    .sort((a, b) => a.itemId.localeCompare(b.itemId) || a.period - b.period);
}
