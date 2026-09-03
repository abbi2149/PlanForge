import type { Minute, ProductionPlan, ScheduledOperation } from '@planforge/model';

export interface OperationShift {
  readonly key: string;
  readonly baselineStart: Minute;
  readonly candidateStart: Minute;
  readonly startDelta: number;
  readonly baselineEnd: Minute;
  readonly candidateEnd: Minute;
  readonly endDelta: number;
  readonly workCenterChanged: boolean;
}

export interface PlanStability {
  readonly comparedOperations: number;
  readonly missingOperations: readonly string[];
  readonly addedOperations: readonly string[];
  readonly movedOperations: number;
  readonly workCenterChanges: number;
  readonly totalAbsoluteStartShift: Minute;
  readonly maximumAbsoluteStartShift: Minute;
  readonly shifts: readonly OperationShift[];
}

const operationKey = (operation: ScheduledOperation): string =>
  `${operation.orderId}:${operation.operationId}`;

export function comparePlanStability(
  baseline: ProductionPlan,
  candidate: ProductionPlan,
): PlanStability {
  const left = new Map(baseline.operations.map((operation) => [operationKey(operation), operation]));
  const right = new Map(candidate.operations.map((operation) => [operationKey(operation), operation]));
  const keys = [...new Set([...left.keys(), ...right.keys()])].sort();
  const shifts: OperationShift[] = [];
  const missingOperations: string[] = [];
  const addedOperations: string[] = [];

  for (const key of keys) {
    const baselineOperation = left.get(key);
    const candidateOperation = right.get(key);
    if (!baselineOperation) {
      addedOperations.push(key);
      continue;
    }
    if (!candidateOperation) {
      missingOperations.push(key);
      continue;
    }
    shifts.push({
      key,
      baselineStart: baselineOperation.startMinute,
      candidateStart: candidateOperation.startMinute,
      startDelta: candidateOperation.startMinute - baselineOperation.startMinute,
      baselineEnd: baselineOperation.endMinute,
      candidateEnd: candidateOperation.endMinute,
      endDelta: candidateOperation.endMinute - baselineOperation.endMinute,
      workCenterChanged: baselineOperation.workCenterId !== candidateOperation.workCenterId,
    });
  }

  const absoluteStarts = shifts.map((shift) => Math.abs(shift.startDelta));
  return {
    comparedOperations: shifts.length,
    missingOperations,
    addedOperations,
    movedOperations: shifts.filter((shift) => shift.startDelta !== 0 || shift.endDelta !== 0).length,
    workCenterChanges: shifts.filter((shift) => shift.workCenterChanged).length,
    totalAbsoluteStartShift: absoluteStarts.reduce((sum, value) => sum + value, 0) as Minute,
    maximumAbsoluteStartShift: Math.max(0, ...absoluteStarts) as Minute,
    shifts,
  };
}
