import type { MoneyMinor } from '@planforge/model';

export function applyOverhead(baseMinor: MoneyMinor, overheadBasisPoints: number): MoneyMinor {
  if (!Number.isInteger(overheadBasisPoints) || overheadBasisPoints < 0) throw new RangeError('overhead basis points must be non-negative');
  return Math.round((baseMinor * overheadBasisPoints) / 10_000) as MoneyMinor;
}

export function burdenedCost(baseMinor: MoneyMinor, overheadBasisPoints: number): MoneyMinor {
  return (baseMinor + applyOverhead(baseMinor, overheadBasisPoints)) as MoneyMinor;
}
