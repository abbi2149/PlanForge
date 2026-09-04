import {
  orderCriticalPath,
  planCriticalPaths,
  type CriticalPathInput,
  type CriticalPathSummary,
  type OrderCriticalPath,
} from '@planforge/critical-path';
import type { ModelResult, OrderId, ProductionPlan } from '@planforge/model';
import type { FactoryModel } from './types.js';

function criticalPathInput(model: FactoryModel, plan: ProductionPlan): CriticalPathInput {
  return { plan, orders: model.orders, routings: model.routings, calendar: model.calendar };
}

/**
 * Explains where the flow time of every scheduled order went, and which work
 * centers and competing orders absorbed the waiting.
 */
export function explainFactoryDelays(
  model: FactoryModel,
  plan: ProductionPlan,
): ModelResult<CriticalPathSummary> {
  return planCriticalPaths(criticalPathInput(model, plan));
}

/** Explains a single order's critical chain and delay attribution. */
export function explainOrderDelay(
  model: FactoryModel,
  plan: ProductionPlan,
  orderId: OrderId,
): ModelResult<OrderCriticalPath> {
  return orderCriticalPath(criticalPathInput(model, plan), orderId);
}
