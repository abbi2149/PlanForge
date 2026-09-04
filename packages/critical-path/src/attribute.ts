import { availabilityFor, type WorkCalendar } from '@planforge/calendar';
import type {
  Minute,
  OperationId,
  OrderId,
  ScheduledOperation,
  WorkCenterId,
} from '@planforge/model';
import type { DelayCause, FlowSegment } from './types.js';

export interface WaitSpan {
  readonly fromMinute: Minute;
  readonly toMinute: Minute;
  readonly cause: DelayCause;
  readonly blockingOrders: readonly OrderId[];
}

function boundariesWithin(
  from: Minute,
  to: Minute,
  candidates: readonly number[],
): readonly number[] {
  const inside = candidates.filter((value) => value > from && value < to);
  return [...new Set([from as number, ...inside, to as number])].sort((a, b) => a - b);
}

/**
 * Splits a waiting window at one work center into atomic spans and labels each
 * one. A minute is `calendar-closed` when the centre has no availability,
 * `resource-contention` when every available unit is already reserved, and
 * `idle-wait` when the centre was open with a free unit -- which happens when
 * the remaining gap is too short for the operation or when dispatch order held
 * it back.
 */
export function classifyWaitWindow(
  calendar: WorkCalendar,
  operations: readonly ScheduledOperation[],
  workCenterId: WorkCenterId,
  waitingOrderId: OrderId,
  from: Minute,
  to: Minute,
): readonly WaitSpan[] {
  if (to <= from) return [];
  const slices = availabilityFor(calendar, workCenterId, { start: from, end: to });
  const occupancy = operations.filter(
    (operation) =>
      operation.workCenterId === workCenterId &&
      operation.startMinute < to &&
      from < operation.endMinute,
  );
  const points = boundariesWithin(from, to, [
    ...slices.flatMap((slice) => [slice.start as number, slice.end as number]),
    ...occupancy.flatMap((operation) => [
      operation.startMinute as number,
      operation.endMinute as number,
    ]),
  ]);

  const spans: WaitSpan[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1]!;
    const end = points[index]!;
    const capacityUnits = slices
      .filter((slice) => slice.start <= start && end <= slice.end)
      .reduce((total, slice) => total + slice.capacityUnits, 0);
    const holders = occupancy.filter(
      (operation) => operation.startMinute <= start && end <= operation.endMinute,
    );
    let cause: DelayCause;
    if (capacityUnits === 0) cause = 'calendar-closed';
    else if (holders.length >= capacityUnits) cause = 'resource-contention';
    else cause = 'idle-wait';
    spans.push({
      fromMinute: start as Minute,
      toMinute: end as Minute,
      cause,
      blockingOrders:
        cause === 'resource-contention'
          ? [...new Set(holders.map((operation) => operation.orderId))]
              .filter((orderId) => orderId !== waitingOrderId)
              .sort()
          : [],
    });
  }
  return spans;
}

const sameLabel = (left: FlowSegment, right: WaitSpan | FlowSegment): boolean =>
  left.cause === right.cause &&
  left.blockingOrders.length === right.blockingOrders.length &&
  left.blockingOrders.every((orderId, index) => orderId === right.blockingOrders[index]);

/** Collapses adjacent segments that share a cause and the same blocking orders. */
export function mergeFlowSegments(segments: readonly FlowSegment[]): readonly FlowSegment[] {
  const merged: FlowSegment[] = [];
  for (const segment of segments) {
    const previous = merged.at(-1);
    if (
      previous &&
      previous.toMinute === segment.fromMinute &&
      previous.workCenterId === segment.workCenterId &&
      previous.operationId === segment.operationId &&
      sameLabel(previous, segment)
    ) {
      merged[merged.length - 1] = {
        ...previous,
        toMinute: segment.toMinute,
        minutes: (segment.toMinute - previous.fromMinute) as Minute,
      };
      continue;
    }
    merged.push(segment);
  }
  return merged;
}

export function waitSegments(
  spans: readonly WaitSpan[],
  workCenterId: WorkCenterId,
  operationId: OperationId,
): readonly FlowSegment[] {
  return spans.map((span) => ({
    fromMinute: span.fromMinute,
    toMinute: span.toMinute,
    minutes: (span.toMinute - span.fromMinute) as Minute,
    cause: span.cause,
    workCenterId,
    operationId,
    blockingOrders: span.blockingOrders,
  }));
}
