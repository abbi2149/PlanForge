export function factoryFixture() {
  return {
    name: 'North Cell',
    items: [
      { id: 'FG-100', description: 'Finished assembly', unitCost: 2500, lotSize: 1 },
      { id: 'RM-10', description: 'Raw plate', unitCost: 400, lotSize: 1 },
    ],
    orders: [
      { id: 'ORD-1', itemId: 'FG-100', quantity: 2, releaseMinute: 0, dueMinute: 240, priority: 3 },
      { id: 'ORD-2', itemId: 'FG-100', quantity: 1, releaseMinute: 15, dueMinute: 360, priority: 1 },
    ],
    routings: [
      {
        id: 'ROUTE-FG',
        itemId: 'FG-100',
        operations: [
          {
            id: 'CUT',
            workCenterId: 'CUT-1',
            setupMinutes: 10,
            runMinutesPerUnit: 8,
            yieldBasisPoints: 10_000,
            predecessors: [],
          },
          {
            id: 'ASSEMBLE',
            workCenterId: 'ASM-1',
            setupMinutes: 5,
            runMinutesPerUnit: 12,
            yieldBasisPoints: 10_000,
            predecessors: ['CUT'],
          },
        ],
      },
    ],
    calendar: {
      horizonStart: 0,
      horizonEnd: 720,
      shifts: [
        { workCenterId: 'CUT-1', start: 0, end: 720, capacityUnits: 1, label: 'cut-shift' },
        { workCenterId: 'ASM-1', start: 0, end: 720, capacityUnits: 1, label: 'assembly-shift' },
      ],
      exceptions: [],
    },
    boms: [
      {
        itemId: 'FG-100',
        components: [{ itemId: 'RM-10', quantityPer: 2, scrapBasisPoints: 500 }],
      },
    ],
    inventoryLots: [{ id: 'LOT-1', itemId: 'RM-10', quantity: 20, availableMinute: 0, expiresMinute: 1000 }],
    materialRates: [{ itemId: 'RM-10', costMinorPerUnit: 400 }],
  };
}

export function simplePlan() {
  return {
    name: 'sample',
    digest: 'a'.repeat(64),
    warnings: [],
    operations: [
      { orderId: 'ORD-1', operationId: 'CUT', workCenterId: 'CUT-1', startMinute: 0, endMinute: 20, quantity: 2 },
      { orderId: 'ORD-1', operationId: 'ASM', workCenterId: 'ASM-1', startMinute: 20, endMinute: 50, quantity: 2 },
    ],
  };
}
