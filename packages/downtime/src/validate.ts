import { failure, success, type ModelResult } from '@planforge/model';
import type { DowntimeEvent } from './types.js';

export function validateDowntime(events: readonly DowntimeEvent[]): ModelResult<readonly DowntimeEvent[]> {
  const ids = new Set<string>();
  for (const event of events) {
    if (event.id.length === 0 || ids.has(event.id) || event.end <= event.start || event.reason.length === 0) {
      return failure({ code: 'DOWNTIME_EVENT', message: `invalid downtime event ${event.id}` });
    }
    ids.add(event.id);
  }
  return success([...events]);
}
