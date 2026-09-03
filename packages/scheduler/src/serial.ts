import { emptyLedger } from '@planforge/capacity';
import { digestOf, failure, success, type Minute, type ModelResult } from '@planforge/model';
import { topologicalOrder } from '@planforge/routing';
import { placeOperation } from './place.js';
import { predecessorCompletion } from './precedence.js';
import { orderPriorityComparator } from './priority.js';
import type { ScheduleInput, ScheduleResult } from './types.js';

export function scheduleSerial(input: ScheduleInput): ModelResult<ScheduleResult> {
  const dispatchRule = input.dispatchRule ?? 'priority';
  const orders = [...input.orders].sort(orderPriorityComparator(dispatchRule, input.routings, input.calendar.horizonStart));
  let ledger = input.initialLedger ?? emptyLedger();
  const operations = [] as ScheduleResult['operations'][number][];
  const warnings: string[] = [];
  const completionByOrder = new Map<string, Minute>();
  for (const order of orders) {
    const routing = input.routings.find((entry) => entry.itemId === order.itemId);
    if (!routing) return failure({ code: 'SCHEDULER_ROUTING', message: `no routing for ${order.itemId}` });
    const sequence = topologicalOrder(routing);
    if (!sequence) return failure({ code: 'SCHEDULER_ROUTING_CYCLE', message: `routing ${routing.id} is cyclic` });
    for (const operationId of sequence) {
      const operation = routing.operations.find((entry) => entry.id === operationId)!;
      const earliest = predecessorCompletion(routing, operation.id, operations, order.id, order.releaseMinute);
      const placed = placeOperation(input.calendar, ledger, order, operation, earliest);
      if (!placed.ok) return placed;
      ledger = placed.value.ledger;
      operations.push(placed.value.operation);
      completionByOrder.set(order.id, placed.value.operation.endMinute);
    }
    if ((completionByOrder.get(order.id) ?? order.releaseMinute) > order.dueMinute) warnings.push(`order ${order.id} completes late`);
  }
  const sorted = operations.sort((a, b) => a.startMinute - b.startMinute || a.workCenterId.localeCompare(b.workCenterId) || a.orderId.localeCompare(b.orderId));
  const makespan = Math.max(input.calendar.horizonStart, ...sorted.map((entry) => entry.endMinute)) as Minute;
  const lateOrders = orders.filter((order) => (completionByOrder.get(order.id) ?? order.releaseMinute) > order.dueMinute).map((order) => order.id).sort();
  const semantic = { name: input.name, operations: sorted, warnings: [...warnings].sort() };
  return success({ name: input.name, digest: digestOf(semantic), operations: sorted, warnings: semantic.warnings, makespan, lateOrders });
}
