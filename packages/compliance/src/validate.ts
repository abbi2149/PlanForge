import { failure, success, type ModelResult } from '@planforge/model';
import type { ComplianceRule } from './types.js';

export function validateComplianceRules(rules: readonly ComplianceRule[]): ModelResult<readonly ComplianceRule[]> {
  const ids = new Set<string>();
  for (const rule of rules) {
    if (rule.id.length === 0 || ids.has(rule.id) || rule.value.length === 0) {
      return failure({ code: 'COMPLIANCE_RULE', message: `invalid compliance rule ${rule.id}` });
    }
    ids.add(rule.id);
  }
  return success([...rules]);
}
