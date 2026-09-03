import { changeoverRule, type ChangeoverRule } from '@planforge/changeover';
import type { SequenceJob } from './types.js';

export function familyAwareSequence(jobs: readonly SequenceJob[], rules: readonly ChangeoverRule[]): readonly SequenceJob[] {
  const remaining = [...jobs].sort((a, b) => a.dueMinute - b.dueMinute || a.orderId.localeCompare(b.orderId));
  if (remaining.length <= 1) return remaining;
  const result = [remaining.shift()!];
  while (remaining.length > 0) {
    const previous = result.at(-1)!;
    remaining.sort((a, b) => {
      const aChange = changeoverRule(rules, previous.workCenterId, previous.family, a.family)?.minutes ?? 0;
      const bChange = changeoverRule(rules, previous.workCenterId, previous.family, b.family)?.minutes ?? 0;
      return aChange - bChange || a.dueMinute - b.dueMinute || b.priority - a.priority || a.orderId.localeCompare(b.orderId);
    });
    result.push(remaining.shift()!);
  }
  return result;
}
