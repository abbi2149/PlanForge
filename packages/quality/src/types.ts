import type { BasisPoints, ItemId, OperationId, OrderId, Quantity } from '@planforge/model';

export interface QualityProfile {
  readonly itemId: ItemId;
  readonly expectedYieldBasisPoints: BasisPoints;
  readonly inspectionBasisPoints: BasisPoints;
  readonly reworkBasisPoints: BasisPoints;
}

export interface InspectionLot {
  readonly orderId: OrderId;
  readonly operationId: OperationId;
  readonly producedQuantity: Quantity;
  readonly sampleQuantity: Quantity;
  readonly defects: Quantity;
}

export interface QualityOutcome {
  readonly accepted: boolean;
  readonly defectBasisPoints: number;
  readonly estimatedGoodQuantity: Quantity;
  readonly estimatedReworkQuantity: Quantity;
}

export interface CapabilityStudy {
  readonly mean: number;
  readonly standardDeviation: number;
  readonly lowerSpecification: number;
  readonly upperSpecification: number;
}
