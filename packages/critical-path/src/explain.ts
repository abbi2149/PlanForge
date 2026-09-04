import {
  failure,
  success,
  type DemandOrder,
  type Minute,
  type ModelResult,
  type OrderId,
} from '@planforge/model';
import { routingForItem } from '@planforge/routing';
import { classifyWaitWindow, mergeFlowSegments, waitSegments } from './attribute.js';
import { criticalChainOperations, scheduledOperationsForOrder } from './chain.js';
import {
  DELAY_CAUSES,
  type CauseMinutes,
  type CriticalChainLink,
  type CriticalPathInput,
  type FlowSegment,
  type OrderCriticalPath,
} from './types.js';
import { validateCriticalPathInput } from './validate.js';

export function emptyCauseMinutes(): CauseMinutes {
  return Object.fromEntries(DELAY_CAUSES.map((cause) => [cause, 0 as Minute])) as CauseMinutes;
}

export function addCauseMinutes(left: CauseMinutes, right: CauseMinutes): CauseMinutes {
  return Object.fromEntries(
    DELAY_CAUSES.map((cause) => [cause, (left[cause] + right[cause]) as Minute]),
  ) as CauseMinutes;
}

export function causeMinutesOf(segments: readonly FlowSegment[]): CauseMinutes {
  const totals = new Map(DELAY_CAUSES.map((cause) => [cause, 0]));
  for (const segment of segments) {
    totals.set(segment.cause, (totals.get(segment.cause) ?? 0) + segment.minutes);
  }
  return Object.fromEntries(
    DELAY_CAUSES.map((cause) => [cause, (totals.get(cause) ?? 0) as Minute]),
  ) as CauseMinutes;
}

function explainValidated(input: CriticalPathInput, order: DemandOrder): OrderCriticalPath | null {
  const scheduled = scheduledOperationsForOrder(input.plan, order.id);
  if (scheduled.length === 0) return null;
  const routing = routingForItem(input.routings, order.itemId);
  if (!routing) return null;
  const chainOperations = criticalChainOperations(routing, scheduled);
  if (chainOperations.length === 0) return null;

  const segments: FlowSegment[] = [];
  const chain: CriticalChainLink[] = [];
  let cursor = order.releaseMinute;
  for (const operation of chainOperations) {
    const spans = classifyWaitWindow(
      input.calendar,
      input.plan.operations,
      operation.workCenterId,
      order.id,
      cursor,
      operation.startMinute,
    );
    segments.push(...waitSegments(spans, operation.workCenterId, operation.operationId));
    const processingMinutes = (operation.endMinute - operation.startMinute) as Minute;
    if (processingMinutes > 0) {
      segments.push({
        fromMinute: operation.startMinute,
        toMinute: operation.endMinute,
        minutes: processingMinutes,
        cause: 'processing',
        workCenterId: operation.workCenterId,
        operationId: operation.operationId,
        blockingOrders: [],
      });
    }
    chain.push({
      operationId: operation.operationId,
      workCenterId: operation.workCenterId,
      startMinute: operation.startMinute,
      endMinute: operation.endMinute,
      processingMinutes,
      waitMinutes: (operation.startMinute - cursor) as Minute,
    });
    cursor = operation.endMinute;
  }

  const merged = mergeFlowSegments(segments);
  const completionMinute = cursor;
  return {
    orderId: order.id,
    releaseMinute: order.releaseMinute,
    completionMinute,
    dueMinute: order.dueMinute,
    flowMinutes: (completionMinute - order.releaseMinute) as Minute,
    tardinessMinutes: Math.max(0, completionMinute - order.dueMinute) as Minute,
    chain,
    segments: merged,
    minutesByCause: causeMinutesOf(merged),
  };
}

/**
 * Explains where a single order's flow time went. Returns a failure when the
 * order is unknown to the model or absent from the plan, because both are
 * expected questions a caller can ask about a plan that did not schedule it.
 */
export function orderCriticalPath(
  input: CriticalPathInput,
  orderId: OrderId,
): ModelResult<OrderCriticalPath> {
  const valid = validateCriticalPathInput(input);
  if (!valid.ok) return valid;
  const order = input.orders.find((entry) => entry.id === orderId);
  if (!order) {
    return failure({ code: 'CRITICAL_PATH_UNKNOWN_ORDER', message: `unknown order ${orderId}` });
  }
  const explained = explainValidated(input, order);
  if (!explained) {
    return failure({
      code: 'CRITICAL_PATH_UNSCHEDULED_ORDER',
      message: `order ${orderId} has no scheduled operations`,
    });
  }
  return success(explained);
}

/**
 * Explains every scheduled order, ordered by order id. Assumes an input that
 * has already passed `validateCriticalPathInput`; `planCriticalPaths` validates
 * first and is the entry point most callers want.
 */
export function attributeOrderDelays(input: CriticalPathInput): readonly OrderCriticalPath[] {
  return [...input.orders]
    .sort((a, b) => a.id.localeCompare(b.id))
    .flatMap((order) => {
      const explained = explainValidated(input, order);
      return explained ? [explained] : [];
    });
}
