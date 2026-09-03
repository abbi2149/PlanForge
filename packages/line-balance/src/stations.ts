import type { WorkCenterId } from '@planforge/model';
import type { LineBalance, StationWorkCenter } from './types.js';

export function mapStations(balance: LineBalance, mapping: readonly StationWorkCenter[]): Readonly<Record<string, WorkCenterId>> {
  const known = new Set(balance.stations.map((station) => station.station));
  return Object.fromEntries(
    mapping
      .filter((entry) => known.has(entry.station))
      .sort((a, b) => a.station - b.station)
      .map((entry) => [String(entry.station), entry.workCenterId]),
  );
}

export function overloadedStations(balance: LineBalance): readonly number[] {
  return balance.stations.filter((station) => station.loadMinutes > balance.cycleTime).map((station) => station.station);
}
