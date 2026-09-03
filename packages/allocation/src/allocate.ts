import type { Quantity } from '@planforge/model';
import type { AllocationLine, AllocationRequest, AllocationResult, SupplyPool } from './types.js';

export function allocateSupply(supply: readonly SupplyPool[], requests: readonly AllocationRequest[]): AllocationResult {
  const remainingSupply = new Map(supply.map((entry) => [`${entry.itemId}\u0000${entry.source}`, entry.quantity as number]));
  const lines: AllocationLine[] = [];
  const unfilled: Record<string, Quantity> = {};
  const sortedRequests = [...requests].sort((a, b) => b.priority - a.priority || a.requestId.localeCompare(b.requestId));
  for (const request of sortedRequests) {
    let remaining = request.quantity as number;
    const pools = supply
      .filter((entry) => entry.itemId === request.itemId)
      .sort((a, b) => b.priority - a.priority || a.source.localeCompare(b.source));
    for (const pool of pools) {
      if (remaining <= 0) break;
      const key = `${pool.itemId}\u0000${pool.source}`;
      const available = remainingSupply.get(key) ?? 0;
      const taken = Math.min(remaining, available);
      if (taken > 0) lines.push({ requestId: request.requestId, source: pool.source, quantity: taken as Quantity });
      remaining -= taken;
      remainingSupply.set(key, available - taken);
    }
    if (remaining > 0) unfilled[request.requestId] = remaining as Quantity;
  }
  return { lines, unfilled: Object.fromEntries(Object.entries(unfilled).sort(([a], [b]) => a.localeCompare(b))) };
}
