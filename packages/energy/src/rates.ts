import type { Minute } from '@planforge/model';
import type { EnergyRate } from './types.js';

export function rateAt(rates: readonly EnergyRate[], minute: Minute): EnergyRate | null {
  return [...rates]
    .filter((rate) => rate.start <= minute && minute < rate.end)
    .sort((a, b) => a.start - b.start || a.end - b.end)[0] ?? null;
}

export function splitByRates(start: Minute, end: Minute, rates: readonly EnergyRate[]): readonly EnergyRate[] {
  const boundaries = [...new Set([start, end, ...rates.flatMap((rate) => [rate.start, rate.end])])]
    .filter((point) => point >= start && point <= end)
    .sort((a, b) => a - b);
  const result: EnergyRate[] = [];
  for (let index = 1; index < boundaries.length; index += 1) {
    const sliceStart = boundaries[index - 1]!;
    const sliceEnd = boundaries[index]!;
    if (sliceEnd <= sliceStart) continue;
    const rate = rateAt(rates, sliceStart as Minute);
    if (rate) result.push({ ...rate, start: sliceStart as Minute, end: sliceEnd as Minute });
  }
  return result;
}
