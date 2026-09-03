# Development notes

## Workspace checks

Run:

```bash
node scripts/check-workspaces.mjs
```

The script verifies that every directory in `packages/` has a valid `@planforge/*` manifest, that workspace dependencies exist, that TypeScript references match package dependencies, and that root path aliases/references cover the full workspace set.

## Clean builds

`npm run clean` removes package `dist/` folders and TypeScript build metadata. A clean compile is important because project-reference output can otherwise hide source or dependency mistakes.

## Adding a package

1. Create `packages/<name>/package.json` with an `@planforge/<name>` package name.
2. Add `src/index.ts` and a composite `tsconfig.json` extending the root base config.
3. Declare every PlanForge dependency in the package manifest and project references.
4. Add the package to root `tsconfig.json` and `tsconfig.base.json` paths.
5. Add public-behavior tests under `packages/<name>/test/`.
6. Run `npm run verify`.

## Generated output

Do not commit:

- `node_modules/`
- `dist/`
- `*.tsbuildinfo`
- coverage or temporary reports

These are excluded by `.gitignore` and rebuilt by verification.
