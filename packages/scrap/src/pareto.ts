import type { ScrapEvent } from './types.js';

export interface ScrapPareto {
  readonly reason: string;
  readonly quantity: number;
  readonly cumulativeBasisPoints: number;
}

export function scrapPareto(events: readonly ScrapEvent[]): readonly ScrapPareto[] {
  const totals = new Map<string, number>();
  for (const event of events) totals.set(event.reason, (totals.get(event.reason) ?? 0) + event.quantity);
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const total = sorted.reduce((sum, [, quantity]) => sum + quantity, 0);
  let cumulative = 0;
  return sorted.map(([reason, quantity]) => {
    cumulative += quantity;
    return { reason, quantity, cumulativeBasisPoints: total === 0 ? 0 : Math.round((cumulative * 10_000) / total) };
  });
}
