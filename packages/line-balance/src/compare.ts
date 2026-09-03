import type { LineBalance } from './types.js';

export interface BalanceDelta {
  readonly stationCount: number;
  readonly efficiencyBasisPoints: number;
  readonly balanceDelayBasisPoints: number;
}

export function compareBalances(left: LineBalance, right: LineBalance): BalanceDelta {
  return {
    stationCount: right.stations.length - left.stations.length,
    efficiencyBasisPoints: right.efficiencyBasisPoints - left.efficiencyBasisPoints,
    balanceDelayBasisPoints: right.balanceDelayBasisPoints - left.balanceDelayBasisPoints,
  };
}
