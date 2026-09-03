import type { Minute, Quantity } from '@planforge/model';

export function capacityAtCycleTime(availableMinutes: Minute, cycleMinutes: number): Quantity {
  if (availableMinutes <= 0 || !(cycleMinutes > 0)) return 0 as Quantity;
  return Math.floor(availableMinutes / cycleMinutes) as Quantity;
}

export function requiredAvailableMinutes(demand: Quantity, cycleMinutes: number): Minute {
  if (demand <= 0 || cycleMinutes <= 0) return 0 as Minute;
  return Math.ceil(demand * cycleMinutes) as Minute;
}

export function capacityGap(demand: Quantity, capacity: Quantity): number {
  return capacity - demand;
}
