import type { ChangeoverEvent } from './types.js';

export interface ChangeoverSummary {
  readonly eventCount: number;
  readonly totalMinutes: number;
  readonly totalCostMinor: number;
  readonly byWorkCenter: Readonly<Record<string, number>>;
}

export function summarizeChangeovers(events: readonly ChangeoverEvent[]): ChangeoverSummary {
  const byWorkCenter: Record<string, number> = {};
  for (const event of events) byWorkCenter[event.workCenterId] = (byWorkCenter[event.workCenterId] ?? 0) + event.minutes;
  return {
    eventCount: events.length,
    totalMinutes: events.reduce((sum, event) => sum + event.minutes, 0),
    totalCostMinor: events.reduce((sum, event) => sum + event.costMinor, 0),
    byWorkCenter: Object.fromEntries(Object.entries(byWorkCenter).sort(([a], [b]) => a.localeCompare(b))),
  };
}
