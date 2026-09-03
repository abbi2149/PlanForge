import type { ItemId, OperationId, OrderId, RoutingId, WorkCenterId } from './ids.js';
import type { BasisPoints, Minute, MoneyMinor, Quantity } from './units.js';

export interface Item {
  readonly id: ItemId;
  readonly description: string;
  readonly unitCost: MoneyMinor;
  readonly lotSize: Quantity;
}

export interface DemandOrder {
  readonly id: OrderId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly releaseMinute: Minute;
  readonly dueMinute: Minute;
  readonly priority: number;
}

export interface OperationSpec {
  readonly id: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly setupMinutes: Minute;
  readonly runMinutesPerUnit: Minute;
  readonly yieldBasisPoints: BasisPoints;
  readonly predecessors: readonly OperationId[];
}

export interface Routing {
  readonly id: RoutingId;
  readonly itemId: ItemId;
  readonly operations: readonly OperationSpec[];
}

export interface ScheduledOperation {
  readonly orderId: OrderId;
  readonly operationId: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly startMinute: Minute;
  readonly endMinute: Minute;
  readonly quantity: Quantity;
}

export interface ProductionPlan {
  readonly name: string;
  readonly digest: string;
  readonly operations: readonly ScheduledOperation[];
  readonly warnings: readonly string[];
}
