import { firstCapacityGap, reserveCapacity, type CapacityLedger } from '@planforge/capacity';
import type { WorkCalendar } from '@planforge/calendar';
import { failure, success, type DemandOrder, type Minute, type ModelResult, type OperationSpec, type ScheduledOperation } from '@planforge/model';
import { scheduledDuration } from './duration.js';

export interface Placement {
  readonly ledger: CapacityLedger;
  readonly operation: ScheduledOperation;
}

export function placeOperation(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  order: DemandOrder,
  operation: OperationSpec,
  earliest: Minute,
): ModelResult<Placement> {
  const duration = scheduledDuration(operation, order.quantity);
  const start = firstCapacityGap(calendar, ledger, operation.workCenterId, earliest, duration, 1);
  if (start === null) {
    return failure({ code: 'SCHEDULER_CAPACITY', message: `no capacity for ${order.id}/${operation.id}` });
  }
  const end = (start + duration) as Minute;
  const reservation = {
    orderId: order.id,
    operationId: operation.id,
    workCenterId: operation.workCenterId,
    start,
    end,
    units: 1,
  };
  const reserved = reserveCapacity(calendar, ledger, reservation);
  if (!reserved.ok) return reserved;
  return success({
    ledger: reserved.value,
    operation: {
      orderId: order.id,
      operationId: operation.id,
      workCenterId: operation.workCenterId,
      startMinute: start,
      endMinute: end,
      quantity: order.quantity,
    },
  });
}
