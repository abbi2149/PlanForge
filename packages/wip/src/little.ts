export function littleLawWip(throughputUnitsPerHour: number, flowHours: number): number {
  if (throughputUnitsPerHour < 0 || flowHours < 0) return 0;
  return throughputUnitsPerHour * flowHours;
}

export function littleLawFlowHours(wipUnits: number, throughputUnitsPerHour: number): number {
  if (wipUnits < 0 || throughputUnitsPerHour <= 0) return Number.POSITIVE_INFINITY;
  return wipUnits / throughputUnitsPerHour;
}
