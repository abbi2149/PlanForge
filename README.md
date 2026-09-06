# PlanForge

PlanForge is a deterministic finite-capacity manufacturing planning toolkit written in TypeScript. It models work calendars, routings, capacity, material availability, maintenance, quality, costing, dispatch rules, scenarios, simulation, and production reporting as small composable packages.

The project is designed for planning systems where the same logical input should produce the same logical output. Public results use stable ordering, integer physical units, explicit diagnostics, and SHA-256 digests over canonical data. Runtime code does not depend on wall-clock time, random values, or network services.

## What it does

At the center of the repository is a serial finite-capacity scheduler. A factory model supplies demand orders, routings, work-center calendars, optional BOMs, inventory, maintenance, quality profiles, and cost rates. `@planforge/api` validates that model and compiles it into a production plan.

Around the scheduler are focused planning capabilities for:

- work-center shifts, exceptions, and capacity reservations;
- routing validation and precedence graphs;
- BOM explosion and material requirements;
- inventory projection, lot aging, coverage, and reorder recommendations;
- dispatching, lateness, utilization, and schedule-stability analysis;
- critical-chain tracing and root-cause attribution of order delay;
- maintenance windows and production overlap analysis;
- quality capability, sampling, rework, and control signals;
- forecasting, backtesting, trend fitting, and seasonal aggregation;
- costing, overhead, variance, profitability, and cost-center analysis;
- scenarios, deterministic simulation ensembles, resilience, and risk;
- workforce, warehousing, procurement, shipping, traceability, OEE, lean, takt, WIP, and other manufacturing metrics;
- stable report generation and in-memory result storage;
- a JSON CLI for validating, compiling, and analyzing factory models.

## Repository layout

```text
bin/                    CLI entry point
packages/               Workspace packages
  model/                Shared domain types, units, diagnostics, canonical digests
  calendar/             Work-center calendar availability
  routing/              Routing graph and operation validation
  capacity/             Capacity ledger and reservations
  scheduler/            Finite-capacity scheduling and plan metrics
  inventory/            Inventory projection and stock policy helpers
  bom/                  Bill-of-material validation and explosion
  maintenance/          Preventive windows and maintenance impact
  quality/              Quality planning and statistical control helpers
  forecasting/          Deterministic forecasting and backtesting
  optimization/         Dispatch-rule scoring and sensitivity
  scenario/             Immutable scenario patching and comparison
  simulation/           Deterministic delay/yield simulation
  critical-path/        Critical-chain tracing and delay attribution
  reporting/            JSON/CSV/Markdown planning reports
  result-store/         Deterministic result storage abstractions
  api/                  Public factory-level API
  cli/                  CLI parsing and formatting
  ...                   Additional manufacturing planning capabilities
scripts/                Workspace maintenance utilities
test/                   Cross-package integration fixtures and tests
docs/                   Architecture and domain notes
examples/               Checked-in factory example
```

Every package is an npm workspace with its own `package.json`, TypeScript project, public `src/index.ts`, and compiled `dist/` output. Package dependencies point inward toward lower-level domain capabilities rather than through the CLI or application layer.

## Requirements

- Node.js 24
- npm
- TypeScript 5.9.x (installed by the root development dependencies)

Install dependencies:

```bash
npm install
```

Build every workspace:

```bash
npm run build
```

Run the complete test suite:

```bash
npm test
```

Run the repository verification sequence:

```bash
npm run verify
```

## CLI

After building, validate a factory document:

```bash
node bin/planforge.mjs validate examples/factory.json
```

Compile a production plan:

```bash
node bin/planforge.mjs compile examples/factory.json
```

Compile with another dispatch rule:

```bash
node bin/planforge.mjs compile examples/factory.json --dispatch earliest-due
```

Analyze the compiled plan:

```bash
node bin/planforge.mjs analyze examples/factory.json
```

Explain why every order finished when it did:

```bash
node bin/planforge.mjs explain examples/factory.json
```

Or trace a single order:

```bash
node bin/planforge.mjs explain examples/factory.json --order ORD-2
```

Compare two dispatch rules on the same model:

```bash
node bin/planforge.mjs compare examples/factory.json --against earliest-due
```

Use `--compact` for single-line JSON and `--output <file>` to write the result to disk.

Render the plan report as CSV or Markdown instead of JSON:

```bash
node bin/planforge.mjs compile examples/factory.json --format csv
node bin/planforge.mjs analyze examples/factory.json --format markdown
```

Print usage or the installed version at any time:

```bash
node bin/planforge.mjs --help
node bin/planforge.mjs --version
```

## Public API example

```js
import { readFile } from 'node:fs/promises';
import { compileFactory, analyzeFactory } from '@planforge/api';

const model = JSON.parse(await readFile('examples/factory.json', 'utf8'));
const compiled = compileFactory(model, {
  dispatchRule: 'earliest-due',
  validateMaterials: true,
});

if (!compiled.ok) {
  console.error(compiled.diagnostics);
  process.exitCode = 1;
} else {
  console.log(compiled.value.plan.digest);
  console.log(analyzeFactory(model, compiled.value.plan));
}
```

## Design principles

### Deterministic results

Collections that become public output are sorted with stable domain keys. Plan and stored-result digests use canonical JSON and SHA-256. Tests can therefore compare results across machines without relying on insertion order.

### Integer physical units

Minutes, quantities, basis points, and minor currency units are integer domain values. This avoids hidden floating-point drift in core scheduling and costing calculations. Statistical APIs intentionally return ordinary numbers where fractional values are meaningful.

### Expected failures are values

Validation and compile operations return `ModelResult<T>`. Expected domain errors carry structured diagnostics. Exceptions are reserved for programmer errors such as invalid helper parameters that cannot occur in a validated model.

### Small public packages

The monorepo keeps domain capabilities isolated. A package exports behavior through its public index rather than reaching into another package's private files. This makes dependency direction visible and keeps tests focused on public contracts.

### Offline runtime

Plan compilation, analysis, reporting, forecasting, and simulation require no network access. All examples and tests use checked-in data.

## Testing

The repository uses Node's built-in test runner for zero runtime test-framework dependency. Package tests exercise public compiled exports, while root integration tests execute the real CLI with temporary files. The current suite covers validation, scheduling, precedence, capacity, inventory shortages, BOM explosion, maintenance, quality, forecasting, scenario behavior, simulation, reporting, result storage, work allocation, warehousing, workforce, API integration, and CLI behavior.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/architecture.md](docs/architecture.md). The most important conventions are:

- ESM with explicit `.js` relative import extensions in TypeScript source;
- named exports from package `src/index.ts` files;
- `readonly` public model data;
- no implicit normalization of logical IDs;
- stable output ordering;
- no current-time or random behavior in planning logic;
- strict TypeScript project references;
- package dependencies declared in both `package.json` and `tsconfig.json` references.

## License

MIT. See [LICENSE](LICENSE).
