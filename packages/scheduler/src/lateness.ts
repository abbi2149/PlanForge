import type { DemandOrder, Minute, ScheduledOperation } from '@planforge/model';

export interface OrderLateness {
  readonly orderId: string;
  readonly dueMinute: Minute;
  readonly completionMinute: Minute;
  readonly latenessMinutes: number;
  readonly tardinessMinutes: Minute;
  readonly earlyMinutes: Minute;
  readonly priority: number;
}

export function completionByOrder(
  operations: readonly ScheduledOperation[],
): Readonly<Record<string, Minute>> {
  const completion = new Map<string, Minute>();
  for (const operation of operations) {
    const previous = completion.get(operation.orderId) ?? (0 as Minute);
    if (operation.endMinute > previous) completion.set(operation.orderId, operation.endMinute);
  }
  return Object.fromEntries([...completion.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function orderLateness(
  orders: readonly DemandOrder[],
  operations: readonly ScheduledOperation[],
): readonly OrderLateness[] {
  const completion = completionByOrder(operations);
  return [...orders]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((order) => {
      const completionMinute = completion[order.id] ?? order.releaseMinute;
      const latenessMinutes = completionMinute - order.dueMinute;
      return {
        orderId: order.id,
        dueMinute: order.dueMinute,
        completionMinute,
        latenessMinutes,
        tardinessMinutes: Math.max(0, latenessMinutes) as Minute,
        earlyMinutes: Math.max(0, -latenessMinutes) as Minute,
        priority: order.priority,
      };
    });
}

export function weightedTardiness(
  orders: readonly DemandOrder[],
  operations: readonly ScheduledOperation[],
): number {
  return orderLateness(orders, operations).reduce(
    (sum, entry) => sum + entry.tardinessMinutes * Math.max(1, entry.priority),
    0,
  );
}

export function serviceLevelBasisPoints(
  orders: readonly DemandOrder[],
  operations: readonly ScheduledOperation[],
): number {
  if (orders.length === 0) return 10_000;
  const onTime = orderLateness(orders, operations).filter((entry) => entry.tardinessMinutes === 0).length;
  return Math.round((onTime * 10_000) / orders.length);
}
