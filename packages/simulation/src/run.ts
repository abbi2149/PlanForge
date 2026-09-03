import type { Minute } from '@planforge/model';
import { deterministicDelay } from './delay.js';
import { simulatedOutput } from './yield.js';
import type { SimulationInput, SimulationResult, SimulatedOperation } from './types.js';

export function runSimulation(input: SimulationInput): SimulationResult {
  const delayRules = input.delayRules ?? [];
  const yieldRules = input.yieldRules ?? [];
  const counters = new Map<string, number>();
  const centerReady = new Map<string, Minute>();
  const orderReady = new Map<string, Minute>();
  const operations: SimulatedOperation[] = [];
  for (const operation of [...input.plan.operations].sort((a, b) => a.startMinute - b.startMinute || a.orderId.localeCompare(b.orderId))) {
    const ordinal = (counters.get(operation.workCenterId) ?? 0) + 1;
    counters.set(operation.workCenterId, ordinal);
    const delay = deterministicDelay(operation, ordinal, delayRules);
    const duration = operation.endMinute - operation.startMinute;
    const simulatedStart = Math.max(
      operation.startMinute,
      centerReady.get(operation.workCenterId) ?? 0,
      orderReady.get(operation.orderId) ?? 0,
    ) as Minute;
    const simulatedEnd = (simulatedStart + duration + delay) as Minute;
    centerReady.set(operation.workCenterId, simulatedEnd);
    orderReady.set(operation.orderId, simulatedEnd);
    operations.push({
      orderId: operation.orderId,
      operationId: operation.operationId,
      workCenterId: operation.workCenterId,
      plannedStart: operation.startMinute,
      plannedEnd: operation.endMinute,
      simulatedStart,
      simulatedEnd,
      outputQuantity: simulatedOutput(operation.orderId, operation.quantity, yieldRules),
    });
  }
  const completionByOrder = Object.fromEntries([...orderReady.entries()].sort(([a], [b]) => a.localeCompare(b)));
  const due = new Map<string, Minute>(input.orders.map((order) => [order.id, order.dueMinute]));
  const lateOrders = Object.entries(completionByOrder)
    .filter(([orderId, completion]) => completion > (due.get(orderId) ?? Number.MAX_SAFE_INTEGER))
    .map(([orderId]) => orderId)
    .sort();
  return {
    operations,
    completionByOrder,
    lateOrders,
    makespan: Math.max(0, ...Object.values(completionByOrder)) as Minute,
  };
}
