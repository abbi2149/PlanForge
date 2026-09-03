import type { Minute } from '@planforge/model';
import type { CarrierService } from './types.js';

const DAY = 1_440;

export function nextDeparture(readyMinute: Minute, service: CarrierService): Minute {
  const day = Math.floor(readyMinute / DAY);
  const minuteOfDay = readyMinute % DAY;
  if (minuteOfDay <= service.cutoffMinuteOfDay) return (day * DAY + service.cutoffMinuteOfDay) as Minute;
  return ((day + 1) * DAY + service.cutoffMinuteOfDay) as Minute;
}
