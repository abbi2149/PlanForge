import { failure, success, type ModelResult } from '@planforge/model';
import type { AllocationRequest, SupplyPool } from './types.js';

export function validateAllocation(supply: readonly SupplyPool[], requests: readonly AllocationRequest[]): ModelResult<true> {
  for (const pool of supply) {
    if (pool.quantity < 0 || !Number.isSafeInteger(pool.priority)) return failure({ code: 'ALLOCATION_SUPPLY', message: `invalid supply ${pool.source}` });
  }
  const ids = new Set<string>();
  for (const request of requests) {
    if (request.requestId.length === 0 || ids.has(request.requestId) || request.quantity < 0 || !Number.isSafeInteger(request.priority)) {
      return failure({ code: 'ALLOCATION_REQUEST', message: `invalid request ${request.requestId}` });
    }
    ids.add(request.requestId);
  }
  return success(true);
}
