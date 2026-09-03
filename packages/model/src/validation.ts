import { failure, success, type ModelResult } from './result.js';
import type { DemandOrder, Item, Routing } from './domain.js';

export function validateItems(items: readonly Item[]): ModelResult<readonly Item[]> {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      return failure({ code: 'MODEL_DUPLICATE_ITEM', message: `duplicate item ${item.id}` });
    }
    ids.add(item.id);
    if (item.description.length === 0) {
      return failure({ code: 'MODEL_EMPTY_DESCRIPTION', message: `item ${item.id} has an empty description` });
    }
  }
  return success([...items]);
}

export function validateOrders(orders: readonly DemandOrder[]): ModelResult<readonly DemandOrder[]> {
  const ids = new Set<string>();
  for (const order of orders) {
    if (ids.has(order.id)) return failure({ code: 'MODEL_DUPLICATE_ORDER', message: `duplicate order ${order.id}` });
    ids.add(order.id);
    if (order.dueMinute < order.releaseMinute) {
      return failure({ code: 'MODEL_ORDER_WINDOW', message: `order ${order.id} is due before release` });
    }
    if (order.priority < 0 || !Number.isSafeInteger(order.priority)) {
      return failure({ code: 'MODEL_ORDER_PRIORITY', message: `order ${order.id} has invalid priority` });
    }
  }
  return success([...orders]);
}

export function validateRoutings(routings: readonly Routing[]): ModelResult<readonly Routing[]> {
  const routingIds = new Set<string>();
  for (const routing of routings) {
    if (routingIds.has(routing.id)) {
      return failure({ code: 'MODEL_DUPLICATE_ROUTING', message: `duplicate routing ${routing.id}` });
    }
    routingIds.add(routing.id);
    const operationIds = new Set(routing.operations.map((operation) => operation.id));
    if (operationIds.size !== routing.operations.length) {
      return failure({ code: 'MODEL_DUPLICATE_OPERATION', message: `routing ${routing.id} repeats an operation id` });
    }
    for (const operation of routing.operations) {
      for (const predecessor of operation.predecessors) {
        if (!operationIds.has(predecessor)) {
          return failure({ code: 'MODEL_UNKNOWN_PREDECESSOR', message: `operation ${operation.id} references ${predecessor}` });
        }
      }
    }
  }
  return success([...routings]);
}
