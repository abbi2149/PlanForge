import type { FulfillmentRecord, ServiceLevelResult } from './types.js';

export function calculateServiceLevel(records: readonly FulfillmentRecord[]): ServiceLevelResult {
  if (records.length === 0) {
    return { orderCount: 0, onTimeBasisPoints: 0, inFullBasisPoints: 0, otifBasisPoints: 0, averageLateMinutes: 0 };
  }
  const onTime = records.filter((record) => record.completedMinute <= record.promisedMinute).length;
  const inFull = records.filter((record) => record.shippedQuantity >= record.requestedQuantity).length;
  const otif = records.filter((record) => record.completedMinute <= record.promisedMinute && record.shippedQuantity >= record.requestedQuantity).length;
  const late = records.map((record) => Math.max(0, record.completedMinute - record.promisedMinute));
  return {
    orderCount: records.length,
    onTimeBasisPoints: Math.round((onTime * 10_000) / records.length),
    inFullBasisPoints: Math.round((inFull * 10_000) / records.length),
    otifBasisPoints: Math.round((otif * 10_000) / records.length),
    averageLateMinutes: late.reduce((a, b) => a + b, 0) / records.length,
  };
}
