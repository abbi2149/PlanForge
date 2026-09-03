export interface VariancePoint {
  readonly key: string;
  readonly planned: number;
  readonly actual: number;
}

export interface VarianceResult {
  readonly key: string;
  readonly absolute: number;
  readonly basisPoints: number;
  readonly favorable: boolean;
}
