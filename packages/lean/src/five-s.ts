export interface AuditArea {
  readonly id: string;
  readonly sort: number;
  readonly setInOrder: number;
  readonly shine: number;
  readonly standardize: number;
  readonly sustain: number;
}

export interface FiveSScore {
  readonly id: string;
  readonly total: number;
  readonly basisPoints: number;
}

export function fiveSScore(area: AuditArea): FiveSScore {
  const values = [area.sort, area.setInOrder, area.shine, area.standardize, area.sustain];
  const total = values.reduce((sum, value) => sum + Math.max(0, Math.min(5, value)), 0);
  return { id: area.id, total, basisPoints: Math.round((total * 10_000) / 25) };
}

export function rankFiveS(areas: readonly AuditArea[]): readonly FiveSScore[] {
  return areas.map(fiveSScore).sort((a, b) => a.basisPoints - b.basisPoints || a.id.localeCompare(b.id));
}
