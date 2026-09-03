import type { Minute } from '@planforge/model';
import type { WipEntry } from './types.js';

export interface AgedWip extends WipEntry {
  readonly ageMinutes: Minute;
}

export function agedWip(entries: readonly WipEntry[], now: Minute, threshold: Minute): readonly AgedWip[] {
  return entries
    .map((entry) => ({ ...entry, ageMinutes: Math.max(0, now - entry.enteredMinute) as Minute }))
    .filter((entry) => entry.ageMinutes >= threshold)
    .sort((a, b) => b.ageMinutes - a.ageMinutes || a.orderId.localeCompare(b.orderId));
}
