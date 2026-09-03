import type { WorkCenterId } from '@planforge/model';
import type { ChangeoverRule } from './types.js';

export function changeoverRule(
  rules: readonly ChangeoverRule[],
  workCenterId: WorkCenterId,
  fromFamily: string,
  toFamily: string,
): ChangeoverRule | null {
  if (fromFamily === toFamily) return null;
  return rules.find(
    (rule) => rule.workCenterId === workCenterId && rule.fromFamily === fromFamily && rule.toFamily === toFamily,
  ) ?? rules.find(
    (rule) => rule.workCenterId === workCenterId && rule.fromFamily === '*' && rule.toFamily === toFamily,
  ) ?? rules.find(
    (rule) => rule.workCenterId === workCenterId && rule.fromFamily === fromFamily && rule.toFamily === '*',
  ) ?? null;
}
