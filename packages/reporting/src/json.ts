import { canonicalJson } from '@planforge/model';
import type { ProductionReport } from './types.js';

export function reportToJson(report: ProductionReport, pretty = true): string {
  return pretty ? `${JSON.stringify(JSON.parse(canonicalJson(report)), null, 2)}
` : `${canonicalJson(report)}
`;
}
