export interface DistributionSummary {
  readonly count: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly mean: number;
  readonly median: number;
  readonly p90: number;
  readonly p95: number;
}

export function mean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function percentile(values: readonly number[], percentileValue: number): number {
  if (values.length === 0) return 0;
  if (!Number.isFinite(percentileValue) || percentileValue < 0 || percentileValue > 100) {
    throw new RangeError('percentile must be between 0 and 100');
  }
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0]!;
  const position = (percentileValue / 100) * (sorted.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const lower = sorted[lowerIndex]!;
  const upper = sorted[upperIndex]!;
  if (lowerIndex === upperIndex) return lower;
  const fraction = position - lowerIndex;
  return lower + (upper - lower) * fraction;
}

export function median(values: readonly number[]): number {
  return percentile(values, 50);
}

export function variance(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const average = mean(values);
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
}

export function standardDeviation(values: readonly number[]): number {
  return Math.sqrt(variance(values));
}

export function summarizeDistribution(values: readonly number[]): DistributionSummary {
  if (values.length === 0) {
    return { count: 0, minimum: 0, maximum: 0, mean: 0, median: 0, p90: 0, p95: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: sorted.length,
    minimum: sorted[0]!,
    maximum: sorted.at(-1)!,
    mean: mean(sorted),
    median: percentile(sorted, 50),
    p90: percentile(sorted, 90),
    p95: percentile(sorted, 95),
  };
}
