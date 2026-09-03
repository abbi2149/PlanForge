import type { Minute, WorkCenterId } from '@planforge/model';
import type { DowntimeEvent, DowntimeSummary } from './types.js';

export function summarizeDowntime(events: readonly DowntimeEvent[], workCenterId: WorkCenterId): DowntimeSummary {
  const relevant = events.filter((event) => event.workCenterId === workCenterId);
  const byCategory: Record<string, Minute> = {};
  for (const event of relevant) {
    byCategory[event.category] = ((byCategory[event.category] ?? 0) + (event.end - event.start)) as Minute;
  }
  return {
    workCenterId,
    totalMinutes: relevant.reduce((sum, event) => sum + (event.end - event.start), 0) as Minute,
    eventCount: relevant.length,
    byCategory: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, Minute>>,
  };
}
