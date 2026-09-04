import { validateCalendar } from '@planforge/calendar';
import {
  failure,
  success,
  validateOrders,
  validateRoutings,
  type ModelResult,
} from '@planforge/model';
import { operationById, routingForItem, validateRouting } from '@planforge/routing';
import type { CriticalPathInput } from './types.js';

const scheduleKey = (orderId: string, operationId: string): string => `${orderId}/${operationId}`;

/**
 * Rejects plans that cannot be explained: attribution assumes a plan whose
 * operations respect release dates and routing precedence, so a violation is a
 * malformed input rather than an interesting result.
 */
export function validateCriticalPathInput(
  input: CriticalPathInput,
): ModelResult<CriticalPathInput> {
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

  const orders = new Map(input.orders.map((order) => [order.id as string, order]));
  const scheduled = new Map(
    input.plan.operations.map((operation) => [
      scheduleKey(operation.orderId, operation.operationId),
      operation,
    ]),
  );
  for (const operation of input.plan.operations) {
    const label = scheduleKey(operation.orderId, operation.operationId);
    const order = orders.get(operation.orderId);
    if (!order) {
      return failure({
        code: 'CRITICAL_PATH_UNKNOWN_ORDER',
        message: `plan schedules unknown order ${operation.orderId}`,
      });
    }
    if (operation.endMinute < operation.startMinute) {
      return failure({
        code: 'CRITICAL_PATH_OPERATION_WINDOW',
        message: `operation ${label} ends before it starts`,
      });
    }
    if (operation.startMinute < order.releaseMinute) {
      return failure({
        code: 'CRITICAL_PATH_RELEASE',
        message: `operation ${label} starts before order ${order.id} is released`,
      });
    }
    const routing = routingForItem(input.routings, order.itemId);
    if (!routing) {
      return failure({
        code: 'CRITICAL_PATH_MISSING_ROUTING',
        message: `no routing for item ${order.itemId}`,
      });
    }
    const spec = operationById(routing, operation.operationId);
    if (!spec) {
      return failure({
        code: 'CRITICAL_PATH_UNKNOWN_OPERATION',
        message: `routing ${routing.id} does not define ${operation.operationId}`,
      });
    }
    for (const predecessor of spec.predecessors) {
      const earlier = scheduled.get(scheduleKey(operation.orderId, predecessor));
      if (earlier && earlier.endMinute > operation.startMinute) {
        return failure({
          code: 'CRITICAL_PATH_PRECEDENCE',
          message: `operation ${label} starts before predecessor ${predecessor} ends`,
        });
      }
    }
  }
  return success(input);
}
