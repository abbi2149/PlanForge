import type { DemandProfile } from './types.js';
import type { DemandBucket } from './types.js';

export function demandProfile(itemId: DemandProfile['itemId'], buckets: readonly DemandBucket[]): DemandProfile {
  const relevant = buckets.filter((entry) => entry.itemId === itemId).sort((a, b) => a.bucket - b.bucket);
  const peak = [...relevant].sort((a, b) => b.quantity - a.quantity || a.bucket - b.bucket)[0];
  return {
    itemId,
    totalQuantity: relevant.reduce((sum, entry) => sum + entry.quantity, 0) as DemandProfile['totalQuantity'],
    peakBucket: peak?.bucket ?? 0,
    peakQuantity: peak?.quantity ?? (0 as DemandProfile['peakQuantity']),
    buckets: relevant,
  };
}
