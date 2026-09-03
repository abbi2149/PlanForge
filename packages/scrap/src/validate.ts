import { failure, success, type ModelResult } from '@planforge/model';
import type { ScrapEvent } from './types.js';

export function validateScrap(events: readonly ScrapEvent[]): ModelResult<readonly ScrapEvent[]> {
  for (const event of events) {
    if (event.quantity < 0 || event.unitCostMinor < 0 || event.reason.length === 0) {
      return failure({ code: 'SCRAP_EVENT', message: `invalid scrap event for ${event.itemId}` });
    }
  }
  return success([...events]);
}
