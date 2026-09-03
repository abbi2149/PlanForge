import type { ProductionPlan } from '@planforge/model';

export interface PlanSummary {
  readonly name: string;
  readonly digest: string;
  readonly operationCount: number;
  readonly orderCount: number;
  readonly workCenterCount: number;
  readonly firstStart: number;
  readonly lastEnd: number;
  readonly warningCount: number;
}

export interface ReportSection {
  readonly title: string;
  readonly rows: readonly Readonly<Record<string, string | number>>[];
}

export interface ProductionReport {
  readonly title: string;
  readonly plan: Pick<ProductionPlan, 'name' | 'digest'>;
  readonly sections: readonly ReportSection[];
}
