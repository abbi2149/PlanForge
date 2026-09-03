import type { DowntimeEvent } from './types.js';

export interface DowntimePareto {
  readonly reason: string;
  readonly minutes: number;
  readonly cumulativeBasisPoints: number;
}

export function downtimePareto(events: readonly DowntimeEvent[]): readonly DowntimePareto[] {
  const totals = new Map<string, number>();
  for (const event of events) totals.set(event.reason, (totals.get(event.reason) ?? 0) + (event.end - event.start));
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const total = sorted.reduce((sum, [, minutes]) => sum + minutes, 0);
  let cumulative = 0;
  return sorted.map(([reason, minutes]) => {
    cumulative += minutes;
    return { reason, minutes, cumulativeBasisPoints: total === 0 ? 0 : Math.round((cumulative * 10_000) / total) };
  });
}
