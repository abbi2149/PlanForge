import type { Minute } from '@planforge/model';
import type { TaktInput, TaktResult } from './types.js';

export function calculateTakt(input: TaktInput): TaktResult | null {
  const downtime = input.plannedDowntimeMinutes ?? (0 as Minute);
  const net = Math.max(0, input.availableMinutes - downtime) as Minute;
  const efficiency = input.efficiencyBasisPoints ?? 10_000;
  if (input.demand <= 0 || net <= 0 || efficiency <= 0) return null;
  const effective = Math.floor((net * Math.min(10_000, efficiency)) / 10_000) as Minute;
  if (effective <= 0) return null;
  const taktMinutes = effective / input.demand;
  return {
    netAvailableMinutes: net,
    effectiveMinutes: effective,
    demand: input.demand,
    taktMinutes,
    unitsPerHour: taktMinutes === 0 ? 0 : 60 / taktMinutes,
  };
}
