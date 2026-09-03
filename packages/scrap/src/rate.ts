import type { Quantity } from '@planforge/model';

export function scrapRateBasisPoints(scrap: Quantity, produced: Quantity): number {
  const total = scrap + produced;
  return total === 0 ? 0 : Math.round((scrap * 10_000) / total);
}

export function firstPassYieldBasisPoints(good: Quantity, attempted: Quantity): number {
  return attempted === 0 ? 0 : Math.min(10_000, Math.round((good * 10_000) / attempted));
}
