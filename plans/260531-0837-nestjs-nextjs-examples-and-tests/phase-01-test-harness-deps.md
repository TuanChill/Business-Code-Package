---
phase: 1
title: "Test harness & deps"
status: pending
priority: P1
effort: "1-2h"
dependencies: []
---

# Phase 1: Test harness & deps

## Overview

Set up the infrastructure that lets example code import `@tchil/business-codes/*` by name and run under this repo's Jest — without building, publishing, or linking. This phase unblocks Phases 2 and 3.

## Requirements

- Functional: example files resolve `@tchil/business-codes`, `/nestjs`, `/nextjs`, `/i18n`, `/i18n/react` to local `src/`.
- Functional: `npm test` runs existing `src/**/*.spec.ts` AND new `examples/**/*.spec.ts` in one command.
- Non-functional: published `dist/` must not include `examples/`; root `tsc` build stays green.

## Architecture

Jest **multi-project** config. Project A = existing library unit tests (node env, `roots: src`). Project B = NestJS example tests (node env, `roots: examples/nestjs`). Project C = Next.js + React tests (jsdom env, `roots: examples/nextjs`). All projects share a `moduleNameMapper` that points the package's sub-path exports at `src/`.

`moduleNameMapper` (order matters — most specific first):

```js
const businessCodesMap = {
  '^@tchil/business-codes/nestjs$': '<rootDir>/src/nestjs/index.ts',
  '^@tchil/business-codes/nextjs$': '<rootDir>/src/nextjs/index.ts',
  '^@tchil/business-codes/i18n/react$': '<rootDir>/src/i18n/react/index.ts',
  '^@tchil/business-codes/i18n$': '<rootDir>/src/i18n/index.ts',
  '^@tchil/business-codes$': '<rootDir>/src/index.ts',
};
```

Coverage stays scoped to `src/**` (examples are test fixtures, not shipped code).

## Related Code Files

- Modify: `jest.config.js` — convert to `projects: [...]`, keep `collectCoverageFrom` on `src/**` only.
- Modify: `package.json` — add devDependencies (see below); add `test:examples` script (optional convenience).
- Modify: `.gitignore` / `files` field check — confirm `examples/` is excluded from the npm package (the `files: ["dist"]` allowlist already excludes it; verify, don't expand).
- Create: `examples/tsconfig.json` — extends root, adds `examples` to `include`, sets `types` for jest/node. Used by editors/IDE; ts-jest transpiles per-file so this is for DX + a `tsc --noEmit` lint of examples in Phase 4.

## Implementation Steps

1. Add devDependencies (pin exact versions compatible with installed majors — Nest 11, React 18, Jest 30):
   - `@nestjs/testing` (^11), `@nestjs/platform-express` (^11), `supertest` (^7) + `@types/supertest`
   - `@testing-library/react` (^16), `@testing-library/jest-dom` (^6), `jest-environment-jsdom` (^30)
   - `@types/supertest` only if not bundled. (NestJS, express, rxjs, reflect-metadata, react, @types/react already present.)
2. Rewrite `jest.config.js` to the multi-project shape. Each project: `preset: 'ts-jest'`, its own `testEnvironment`, its own `roots`/`testMatch`, shared `moduleNameMapper`. The jsdom project adds `setupFilesAfterEnv: ['@testing-library/jest-dom']`.
3. Keep top-level `collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts']` so coverage still measures the library, not examples.
4. Add `examples/tsconfig.json` extending `../tsconfig.json` with `"include": ["**/*"]`, `"noEmit": true`, and `"paths"` mapping `@tchil/business-codes/*` → `../src/*` for IDE resolution.
5. Run `npx jest` to confirm the existing suite still passes under the multi-project config (regression gate before any example exists).

## Success Criteria

- [ ] `npx jest` runs and all pre-existing tests pass under the new multi-project config.
- [ ] A throwaway `examples/nestjs/smoke.spec.ts` importing `from '@tchil/business-codes'` resolves and runs (delete after verifying).
- [ ] `npm run build` still succeeds and `dist/` contains no `examples/` output.
- [ ] Coverage report (`npm run test:coverage`) still reports only `src/**` files.

## Risk Assessment

- **Risk:** multi-project config breaks `collectCoverageFrom`. *Mitigation:* set coverage keys at the top level (Jest merges); verify in step 3/criteria.
- **Risk:** `moduleNameMapper` regex matches `@tchil/business-codes` before the sub-paths. *Mitigation:* anchor every pattern with `$`; order specific→general.
- **Risk:** version mismatch between `@nestjs/testing` and installed `@nestjs/common` 11. *Mitigation:* pin all `@nestjs/*` to the same major already in `devDependencies`.

## Next Steps

Unblocks Phase 2 (NestJS) and Phase 3 (Next.js/React), which can proceed in parallel once the harness is green.
