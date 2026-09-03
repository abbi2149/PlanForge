import type { Minute, OperationId, Routing, ScheduledOperation } from '@planforge/model';

export function predecessorCompletion(
  routing: Routing,
  operationId: OperationId,
  scheduled: readonly ScheduledOperation[],
  orderId: string,
  releaseMinute: Minute,
): Minute {
  const operation = routing.operations.find((entry) => entry.id === operationId);
  if (!operation) return releaseMinute;
  return operation.predecessors.reduce((latest, predecessor) => {
    const entry = scheduled.find((candidate) => candidate.orderId === orderId && candidate.operationId === predecessor);
    return Math.max(latest, entry?.endMinute ?? releaseMinute) as Minute;
  }, releaseMinute);
}

export function allPredecessorsScheduled(
  routing: Routing,
  operationId: OperationId,
  scheduled: readonly ScheduledOperation[],
  orderId: string,
): boolean {
  const operation = routing.operations.find((entry) => entry.id === operationId);
  return operation?.predecessors.every((predecessor) =>
    scheduled.some((candidate) => candidate.orderId === orderId && candidate.operationId === predecessor),
  ) ?? false;
}
