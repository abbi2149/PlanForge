import type { ThroughputRate } from './types.js';

export interface ThroughputDelta {
  readonly workCenterId: string;
  readonly unitsPerHour: number;
  readonly goodUnitsPerHour: number;
  readonly yieldBasisPoints: number;
}

export function compareThroughput(left: ThroughputRate, right: ThroughputRate): ThroughputDelta {
  return {
    workCenterId: right.workCenterId,
    unitsPerHour: right.unitsPerHour - left.unitsPerHour,
    goodUnitsPerHour: right.goodUnitsPerHour - left.goodUnitsPerHour,
    yieldBasisPoints: right.yieldBasisPoints - left.yieldBasisPoints,
  };
}
