import type { Quantity } from '@planforge/model';

export function sampleSize(lotSize: Quantity, inspectionBasisPoints: number, minimum: Quantity = 1 as Quantity): Quantity {
  if (lotSize <= 0) return 0 as Quantity;
  const calculated = Math.ceil((lotSize * Math.max(0, inspectionBasisPoints)) / 10_000);
  return Math.min(lotSize, Math.max(minimum, calculated)) as Quantity;
}

export function acceptanceNumber(sample: Quantity, acceptableDefectBasisPoints: number): Quantity {
  if (sample <= 0) return 0 as Quantity;
  return Math.floor((sample * Math.max(0, acceptableDefectBasisPoints)) / 10_000) as Quantity;
}
