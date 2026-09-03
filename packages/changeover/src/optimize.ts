import type { ChangeoverRule } from './types.js';
import { changeoverRule } from './lookup.js';

export function minimizeFamilySequence(
  families: readonly string[],
  workCenterId: Parameters<typeof changeoverRule>[1],
  rules: readonly ChangeoverRule[],
): readonly string[] {
  const remaining = [...families].sort();
  if (remaining.length <= 1) return remaining;
  const result = [remaining.shift()!];
  while (remaining.length > 0) {
    const current = result.at(-1)!;
    remaining.sort((a, b) => {
      const aMinutes = changeoverRule(rules, workCenterId, current, a)?.minutes ?? 0;
      const bMinutes = changeoverRule(rules, workCenterId, current, b)?.minutes ?? 0;
      return aMinutes - bMinutes || a.localeCompare(b);
    });
    result.push(remaining.shift()!);
  }
  return result;
}
