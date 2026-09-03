import type { DemandOrder, ScheduledOperation } from '@planforge/model';
import { changeoverRule } from './lookup.js';
import type { ChangeoverEvent, ChangeoverRule, ItemFamily } from './types.js';

export function detectChangeovers(
  operations: readonly ScheduledOperation[],
  orders: readonly DemandOrder[],
  families: readonly ItemFamily[],
  rules: readonly ChangeoverRule[],
): readonly ChangeoverEvent[] {
  const orderItem = new Map(orders.map((order) => [order.id, order.itemId]));
  const familyByItem = new Map(families.map((entry) => [entry.itemId, entry.family]));
  const centers = [...new Set(operations.map((entry) => entry.workCenterId))].sort();
  const result: ChangeoverEvent[] = [];
  for (const center of centers) {
    const sequence = operations.filter((entry) => entry.workCenterId === center).sort((a, b) => a.startMinute - b.startMinute || a.orderId.localeCompare(b.orderId));
    for (let index = 1; index < sequence.length; index += 1) {
      const previous = sequence[index - 1]!;
      const current = sequence[index]!;
      const fromFamily = familyByItem.get(orderItem.get(previous.orderId)!) ?? 'unknown';
      const toFamily = familyByItem.get(orderItem.get(current.orderId)!) ?? 'unknown';
      const rule = changeoverRule(rules, center, fromFamily, toFamily);
      if (!rule) continue;
      result.push({
        workCenterId: center,
        fromOrderId: previous.orderId,
        toOrderId: current.orderId,
        fromFamily,
        toFamily,
        minutes: rule.minutes,
        costMinor: rule.costMinor,
      });
    }
  }
  return result;
}
