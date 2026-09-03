import type { BasisPoints, Quantity } from '@planforge/model';

export interface ReworkEstimate {
  readonly input: Quantity;
  readonly recovered: Quantity;
  readonly scrap: Quantity;
}

export function estimateRework(input: Quantity, recoveryBasisPoints: BasisPoints): ReworkEstimate {
  const recovered = Math.floor((input * recoveryBasisPoints) / 10_000) as Quantity;
  return { input, recovered, scrap: (input - recovered) as Quantity };
}

export function cumulativeYield(yields: readonly BasisPoints[]): BasisPoints {
  let ratio = 10_000;
  for (const value of yields) ratio = Math.floor((ratio * value) / 10_000);
  return Math.max(0, Math.min(10_000, ratio)) as BasisPoints;
}
