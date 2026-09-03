import type { ItemId, OperationId, RoutingId, WorkCenterId } from '@planforge/model';
import type { BasisPoints, Minute } from '@planforge/model';

export interface RoutingOperationInput {
  readonly id: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly setupMinutes: Minute;
  readonly runMinutesPerUnit: Minute;
  readonly yieldBasisPoints: BasisPoints;
  readonly predecessors?: readonly OperationId[];
  readonly alternateWorkCenters?: readonly WorkCenterId[];
}

export interface RoutingInput {
  readonly id: RoutingId;
  readonly itemId: ItemId;
  readonly operations: readonly RoutingOperationInput[];
}

export interface RoutingGraphNode {
  readonly id: OperationId;
  readonly predecessors: readonly OperationId[];
  readonly successors: readonly OperationId[];
}
