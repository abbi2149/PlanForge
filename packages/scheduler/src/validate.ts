import { validateCalendar } from '@planforge/calendar';
import { failure, success, validateOrders, validateRoutings, type ModelResult } from '@planforge/model';
import { validateRouting } from '@planforge/routing';
import type { ScheduleInput } from './types.js';

export function validateScheduleInput(input: ScheduleInput): ModelResult<ScheduleInput> {
  if (input.name.length === 0) return failure({ code: 'SCHEDULER_NAME', message: 'schedule name cannot be empty' });
  const orderResult = validateOrders(input.orders);
  if (!orderResult.ok) return orderResult;
  const routingResult = validateRoutings(input.routings);
  if (!routingResult.ok) return routingResult;
  for (const routing of input.routings) {
    const result = validateRouting(routing);
    if (!result.ok) return result;
  }
  const calendarResult = validateCalendar(input.calendar);
  if (!calendarResult.ok) return calendarResult;
  const routedItems = new Set(input.routings.map((routing) => routing.itemId));
  const missing = [...new Set(input.orders.filter((order) => !routedItems.has(order.itemId)).map((order) => order.itemId))].sort();
  if (missing.length > 0) return failure({ code: 'SCHEDULER_MISSING_ROUTING', message: `missing routings: ${missing.join(', ')}` });
  return success(input);
}
