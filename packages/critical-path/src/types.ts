import type { WorkCalendar } from '@planforge/calendar';
import type {
  DemandOrder,
  Minute,
  OperationId,
  OrderId,
  ProductionPlan,
  Routing,
  WorkCenterId,
} from '@planforge/model';

/**
 * Why a minute of an order's flow time was spent.
 *
 * `processing` is value-adding time on the critical chain. The remaining causes
 * are waiting time and are ordered here from least to most actionable.
 */
export type DelayCause = 'processing' | 'calendar-closed' | 'resource-contention' | 'idle-wait';

export const DELAY_CAUSES: readonly DelayCause[] = [
  'processing',
  'calendar-closed',
  'resource-contention',
  'idle-wait',
];

export interface CriticalPathInput {
  readonly plan: ProductionPlan;
  readonly orders: readonly DemandOrder[];
  readonly routings: readonly Routing[];
  readonly calendar: WorkCalendar;
}

/** One scheduled operation on an order's critical chain. */
export interface CriticalChainLink {
  readonly operationId: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly startMinute: Minute;
  readonly endMinute: Minute;
  readonly processingMinutes: Minute;
  /** Waiting minutes immediately before this link, back to the previous link or the release. */
  readonly waitMinutes: Minute;
}

/** A contiguous span of an order's flow time attributed to a single cause. */
export interface FlowSegment {
  readonly fromMinute: Minute;
  readonly toMinute: Minute;
  readonly minutes: Minute;
  readonly cause: DelayCause;
  readonly workCenterId: WorkCenterId;
  /** The chain operation that was running, or that was waiting to start. */
  readonly operationId: OperationId;
  /** Orders holding the work center during a `resource-contention` segment. */
  readonly blockingOrders: readonly OrderId[];
}

export type CauseMinutes = Readonly<Record<DelayCause, Minute>>;

export interface OrderCriticalPath {
  readonly orderId: OrderId;
  readonly releaseMinute: Minute;
  readonly completionMinute: Minute;
  readonly dueMinute: Minute;
  readonly flowMinutes: Minute;
  readonly tardinessMinutes: Minute;
  readonly chain: readonly CriticalChainLink[];
  readonly segments: readonly FlowSegment[];
  /** Attribution of `flowMinutes`; the four values always sum to `flowMinutes`. */
  readonly minutesByCause: CauseMinutes;
}

export interface WorkCenterDelay {
  readonly workCenterId: WorkCenterId;
  readonly minutesByCause: CauseMinutes;
  readonly waitMinutes: Minute;
  /** Orders that waited at, or were processed by, this work center on their critical chain. */
  readonly affectedOrders: readonly OrderId[];
}

export interface BlockingOrder {
  readonly orderId: OrderId;
  readonly blockedMinutes: Minute;
  readonly blockedOrders: readonly OrderId[];
}

export interface CriticalPathSummary {
  readonly planDigest: string;
  readonly orders: readonly OrderCriticalPath[];
  readonly minutesByCause: CauseMinutes;
  /** Share of total critical-chain flow time spent waiting rather than processing. */
  readonly waitShareBasisPoints: number;
  readonly workCenters: readonly WorkCenterDelay[];
  readonly blockingOrders: readonly BlockingOrder[];
  readonly lateOrders: readonly OrderId[];
}
