export interface KaizenCandidate {
  readonly id: string;
  readonly expectedBenefitMinor: number;
  readonly implementationCostMinor: number;
  readonly effortPoints: number;
  readonly riskPoints: number;
}

export interface KaizenScore {
  readonly id: string;
  readonly score: number;
  readonly netBenefitMinor: number;
}

export function scoreKaizen(candidates: readonly KaizenCandidate[]): readonly KaizenScore[] {
  return candidates
    .map((candidate) => {
      const netBenefitMinor = candidate.expectedBenefitMinor - candidate.implementationCostMinor;
      const denominator = Math.max(1, candidate.effortPoints + candidate.riskPoints);
      return { id: candidate.id, netBenefitMinor, score: netBenefitMinor / denominator };
    })
    .sort((a, b) => b.score - a.score || b.netBenefitMinor - a.netBenefitMinor || a.id.localeCompare(b.id));
}
