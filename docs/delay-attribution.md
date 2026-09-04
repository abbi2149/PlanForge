# Delay attribution

`@planforge/critical-path` answers a question the plan metrics cannot: not *how
late* an order is, but *where its time went*.

## Critical chain

For one order, the package starts at the scheduled operation that finished last
and walks backwards through the routing, each step following the scheduled
predecessor with the greatest end minute. Ties break on operation id so the walk
is deterministic.

The result is the chain of operations that actually determined the completion
minute. Branches that finished earlier are off the chain: shortening them cannot
move the order.

Because every link starts no earlier than the previous link ended, the chain
partitions the order's whole flow time — release to completion — with no holes
and no overlaps.

## Causes

Each span between the release and the completion is attributed to one cause:

| Cause | Meaning |
| --- | --- |
| `processing` | A chain operation was running. |
| `calendar-closed` | The next operation's work center had no availability: outside its shifts, or inside a `closed` exception. |
| `resource-contention` | The work center was available but every capacity unit was reserved by another scheduled operation. |
| `idle-wait` | The work center was open with a free unit. |

A waiting window is split at every shift, exception, and reservation boundary,
each atomic span is labelled, and adjacent spans sharing a cause and the same
blocking orders are merged back together. `resource-contention` spans name the
orders that held the center, which is how `blockingOrders` in the plan summary is
built.

`idle-wait` is the residual and usually means the free gap was shorter than the
operation needed, or that dispatch order placed a different order first. A large
`idle-wait` total is worth investigating; it is not, by itself, a scheduling bug.

## Attribution is complete

The four cause totals always sum exactly to `flowMinutes`. This is the property
the package is built around, and the package tests assert it for every explained
order. It holds because the spans are contiguous and integer-valued.

## Malformed plans

Attribution assumes a plan whose operations respect release minutes and routing
precedence. `validateCriticalPathInput` rejects one that does not, with
`CRITICAL_PATH_RELEASE` or `CRITICAL_PATH_PRECEDENCE`, rather than reporting
negative waiting time. Asking about an unknown or unscheduled order is an
expected failure carrying a diagnostic, not an exception.

## Usage

```js
import { compileFactory, explainFactoryDelays, explainOrderDelay } from '@planforge/api';

const compiled = compileFactory(model, { includeReport: false });
const summary = explainFactoryDelays(model, compiled.value.plan);
const order = explainOrderDelay(model, compiled.value.plan, 'ORD-2');
```

From the CLI:

```bash
node bin/planforge.mjs explain examples/factory.json --order ORD-2
```
