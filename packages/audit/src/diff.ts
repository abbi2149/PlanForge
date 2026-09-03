import { canonicalJson } from '@planforge/model';
import type { AuditDifference, AuditLog } from './types.js';

export function diffAuditLogs(left: AuditLog, right: AuditLog): readonly AuditDifference[] {
  const length = Math.max(left.events.length, right.events.length);
  const result: AuditDifference[] = [];
  for (let index = 0; index < length; index += 1) {
    const l = left.events[index];
    const r = right.events[index];
    if (!l && r) result.push({ sequence: index + 1, kind: 'missing-left', right: r });
    else if (l && !r) result.push({ sequence: index + 1, kind: 'missing-right', left: l });
    else if (l && r && canonicalJson(l) !== canonicalJson(r)) result.push({ sequence: index + 1, kind: 'changed', left: l, right: r });
  }
  return result;
}
