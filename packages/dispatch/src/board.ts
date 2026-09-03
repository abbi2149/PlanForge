import type { DispatchBoard, DispatchContext, DispatchTicket } from './types.js';

export function buildDispatchBoard(context: DispatchContext): DispatchBoard {
  const byCenter = new Map<string, typeof context.operations>();
  for (const operation of context.operations) {
    const group = byCenter.get(operation.workCenterId) ?? [];
    byCenter.set(operation.workCenterId, [...group, operation]);
  }
  const tickets: DispatchTicket[] = [];
  for (const [center, operations] of [...byCenter.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const sorted = [...operations].sort((a, b) => a.startMinute - b.startMinute || a.orderId.localeCompare(b.orderId));
    sorted.forEach((operation, index) => {
      const status = context.now >= operation.endMinute
        ? 'done'
        : context.now >= operation.startMinute
          ? 'running'
          : index === 0 || sorted[index - 1]!.endMinute <= context.now
            ? 'ready'
            : 'queued';
      tickets.push({
        orderId: operation.orderId,
        operationId: operation.operationId,
        workCenterId: center as DispatchTicket['workCenterId'],
        plannedStart: operation.startMinute,
        plannedEnd: operation.endMinute,
        sequence: index + 1,
        status,
      });
    });
  }
  return { generatedAtMinute: context.now, tickets };
}
