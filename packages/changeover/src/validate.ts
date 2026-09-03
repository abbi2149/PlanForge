import { failure, success, type ModelResult } from '@planforge/model';
import type { ChangeoverRule, ItemFamily } from './types.js';

export function validateChangeovers(rules: readonly ChangeoverRule[], families: readonly ItemFamily[]): ModelResult<true> {
  const familyItems = new Set<string>();
  for (const family of families) {
    if (familyItems.has(family.itemId) || family.family.length === 0) {
      return failure({ code: 'CHANGEOVER_FAMILY', message: `invalid family assignment for ${family.itemId}` });
    }
    familyItems.add(family.itemId);
  }
  const keys = new Set<string>();
  for (const rule of rules) {
    const key = `${rule.workCenterId}\u0000${rule.fromFamily}\u0000${rule.toFamily}`;
    if (keys.has(key) || rule.minutes < 0 || rule.costMinor < 0) {
      return failure({ code: 'CHANGEOVER_RULE', message: `invalid or duplicate changeover rule ${key}` });
    }
    keys.add(key);
  }
  return success(true);
}
