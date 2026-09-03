import { failure, success, type ModelResult } from '@planforge/model';
import type { RiskItem } from './types.js';

export function validateRisks(items: readonly RiskItem[]): ModelResult<readonly RiskItem[]> {
  const ids = new Set<string>();
  for (const item of items) {
    if (item.id.length === 0 || ids.has(item.id) || item.probabilityBasisPoints < 0 || item.probabilityBasisPoints > 10_000 || item.impact < 0) {
      return failure({ code: 'RISK_ITEM', message: `invalid risk ${item.id}` });
    }
    ids.add(item.id);
  }
  return success([...items]);
}
