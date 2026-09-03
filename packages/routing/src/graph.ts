import type { OperationId, Routing } from '@planforge/model';
import type { RoutingGraphNode } from './types.js';

export function buildRoutingGraph(routing: Routing): readonly RoutingGraphNode[] {
  const successors = new Map<OperationId, OperationId[]>();
  for (const operation of routing.operations) successors.set(operation.id, []);
  for (const operation of routing.operations) {
    for (const predecessor of operation.predecessors) {
      successors.get(predecessor)?.push(operation.id);
    }
  }
  return routing.operations
    .map((operation) => ({
      id: operation.id,
      predecessors: [...operation.predecessors].sort(),
      successors: [...(successors.get(operation.id) ?? [])].sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function topologicalOrder(routing: Routing): readonly OperationId[] | null {
  const graph = buildRoutingGraph(routing);
  const degree = new Map(graph.map((node) => [node.id, node.predecessors.length]));
  const ready = graph.filter((node) => node.predecessors.length === 0).map((node) => node.id).sort();
  const order: OperationId[] = [];
  while (ready.length > 0) {
    const current = ready.shift()!;
    order.push(current);
    const node = graph.find((entry) => entry.id === current)!;
    for (const successor of node.successors) {
      const nextDegree = (degree.get(successor) ?? 0) - 1;
      degree.set(successor, nextDegree);
      if (nextDegree === 0) {
        ready.push(successor);
        ready.sort();
      }
    }
  }
  return order.length === graph.length ? order : null;
}
