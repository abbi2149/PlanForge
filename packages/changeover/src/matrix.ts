import type { WorkCenterId } from '@planforge/model';
import type { ChangeoverRule } from './types.js';
import { changeoverRule } from './lookup.js';

export interface ChangeoverCell {
  readonly fromFamily: string;
  readonly toFamily: string;
  readonly minutes: number;
  readonly costMinor: number;
}

export function changeoverMatrix(
  rules: readonly ChangeoverRule[],
  workCenterId: WorkCenterId,
  families: readonly string[],
): readonly ChangeoverCell[] {
  const unique = [...new Set(families)].sort();
  return unique.flatMap((fromFamily) => unique.map((toFamily) => {
    const rule = changeoverRule(rules, workCenterId, fromFamily, toFamily);
    return { fromFamily, toFamily, minutes: rule?.minutes ?? 0, costMinor: rule?.costMinor ?? 0 };
  }));
}
