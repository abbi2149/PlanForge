import type { MoneyMinor, Quantity } from '@planforge/model';
import type { ScrapEvent, ScrapSummary } from './types.js';

export function summarizeScrap(events: readonly ScrapEvent[]): readonly ScrapSummary[] {
  const items = [...new Set(events.map((event) => event.itemId))].sort();
  return items.map((itemId) => {
    const relevant = events.filter((event) => event.itemId === itemId);
    const reasons: Record<string, Quantity> = {};
    for (const event of relevant) reasons[event.reason] = ((reasons[event.reason] ?? 0) + event.quantity) as Quantity;
    return {
      itemId,
      quantity: relevant.reduce((sum, event) => sum + event.quantity, 0) as Quantity,
      costMinor: relevant.reduce((sum, event) => sum + event.quantity * event.unitCostMinor, 0) as MoneyMinor,
      reasons: Object.fromEntries(Object.entries(reasons).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, Quantity>>,
    };
  });
}
