import type { DemandOrder, Minute, ScheduledOperation } from '@planforge/model';

export interface ScheduleMetrics {
  readonly makespan: Minute;
  readonly averageFlowMinutes: number;
  readonly averageTardinessMinutes: number;
  readonly onTimeBasisPoints: number;
  readonly completedOrders: number;
}

export function scheduleMetrics(orders: readonly DemandOrder[], operations: readonly ScheduledOperation[]): ScheduleMetrics {
  const completion = new Map<string, Minute>();
  for (const operation of operations) completion.set(operation.orderId, Math.max(completion.get(operation.orderId) ?? 0, operation.endMinute) as Minute);
  const flows: number[] = [];
  const tardiness: number[] = [];
  let onTime = 0;
  for (const order of orders) {
    const end = completion.get(order.id);
    if (end === undefined) continue;
    flows.push(end - order.releaseMinute);
    tardiness.push(Math.max(0, end - order.dueMinute));
    if (end <= order.dueMinute) onTime += 1;
  }
  return {
    makespan: Math.max(0, ...completion.values()) as Minute,
    averageFlowMinutes: flows.length === 0 ? 0 : flows.reduce((a, b) => a + b, 0) / flows.length,
    averageTardinessMinutes: tardiness.length === 0 ? 0 : tardiness.reduce((a, b) => a + b, 0) / tardiness.length,
    onTimeBasisPoints: flows.length === 0 ? 0 : Math.round((onTime * 10_000) / flows.length),
    completedOrders: flows.length,
  };
}
