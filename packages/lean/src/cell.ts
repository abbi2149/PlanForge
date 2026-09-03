import type { LeanCellScore, FlowCell } from './types.js';

export function scoreFlowCell(cells: readonly FlowCell[], taktMinutes: number): LeanCellScore {
  if (cells.length === 0 || taktMinutes <= 0) {
    return { taktMinutes, averageCycleMinutes: 0, cycleAdherenceBasisPoints: 0, bufferCoverageCycles: 0 };
  }
  const averageCycleMinutes = cells.reduce((sum, cell) => sum + cell.cycleMinutes, 0) / cells.length;
  const cycleAdherenceBasisPoints = Math.min(10_000, Math.round((taktMinutes * 10_000) / Math.max(taktMinutes, averageCycleMinutes)));
  const totalBuffer = cells.reduce((sum, cell) => sum + cell.bufferUnits, 0);
  return {
    taktMinutes,
    averageCycleMinutes,
    cycleAdherenceBasisPoints,
    bufferCoverageCycles: totalBuffer / cells.length,
  };
}

export function cellsAboveTakt(cells: readonly FlowCell[], taktMinutes: number): readonly FlowCell[] {
  return cells.filter((cell) => cell.cycleMinutes > taktMinutes).sort((a, b) => b.cycleMinutes - a.cycleMinutes || a.workCenterId.localeCompare(b.workCenterId));
}
