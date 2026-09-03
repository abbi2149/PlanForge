# Contributing

PlanForge is organized as a TypeScript workspace rather than a single application package. Changes should preserve package boundaries and deterministic behavior.

## Development loop

1. Install dependencies with `npm install`.
2. Run `npm run verify` before opening a pull request.
3. Add or update tests for externally observable behavior.
4. Keep generated `dist/` folders and `*.tsbuildinfo` files out of commits.

`npm run verify` cleans generated output, validates workspace metadata, compiles all TypeScript project references, rebuilds, and runs package plus integration tests.

## Code conventions

- Use two-space indentation, single quotes, semicolons, and trailing commas.
- Prefer small named functions over classes unless stateful behavior is the actual abstraction.
- Export public symbols through a package's `src/index.ts`.
- Use `import type` for type-only imports.
- Relative TypeScript imports include the future `.js` extension because packages emit Node ESM.
- Public domain interfaces are `readonly` unless mutability is part of the contract.
- Expected validation failures return `ModelResult<T>` with stable diagnostic codes.
- Do not trim, case-fold, or otherwise normalize logical identifiers unless a public API explicitly says it does so.
- Sort public arrays and object-derived entries deterministically.
- Avoid wall-clock time, randomness, locale-sensitive formatting, and network calls in domain logic.

## Package dependencies

A workspace package may depend only on packages declared in its `dependencies`. The matching TypeScript project must list those packages in `references`. `node scripts/check-workspaces.mjs` verifies the manifests, paths, references, and workspace names.

Lower-level packages should not import `@planforge/api` or `@planforge/cli`. Cross-cutting domain behavior belongs in a focused package rather than creating a reverse dependency into the application layer.

## Tests

Tests should exercise public exports. Avoid testing a private helper merely because it is convenient. Use small fixtures whose expected result can be checked by hand, and assert stable diagnostics or public results rather than internal implementation structure.

When a bug involves ordering, add at least one test that presents the same logical data in another input order and checks that the public result stays stable.

## Commit style

Keep commits focused on one coherent change: a domain capability, a bug fix, a test expansion, documentation, or build/tooling work. Do not bundle unrelated formatting or refactoring with behavior changes.
