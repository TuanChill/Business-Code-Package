---
phase: 4
title: "Verification & docs"
status: pending
priority: P2
effort: "1h"
dependencies: [2, 3]
---

# Phase 4: Verification & docs

## Overview

Full-suite verification pass: all tests green, build clean, coverage unaffected, examples type-check. Update `README.md` with a pointer to the examples.

## Requirements

- Functional: `npm test` runs all three Jest projects (library unit + NestJS e2e + Next.js/React) and all pass.
- Functional: `npm run build` produces a clean `dist/` with no `examples/` content.
- Functional: `npm run test:coverage` reports coverage only for `src/**`.
- Non-functional: `tsc --noEmit -p examples/tsconfig.json` passes (no type errors in examples).

## Implementation Steps

1. Run `npm test` — fix any remaining failures. Common issues to check:
   - Missing `import 'reflect-metadata'` in NestJS e2e spec.
   - `Response`/`Request` not available in node env (Node 18+ has them globally; if running Node 16, polyfill with `undici` or bump engine requirement).
   - jsdom project missing `setupFilesAfterEnv` for `@testing-library/jest-dom`.

2. Run `npm run build` — confirm `dist/` is clean. Verify `examples/` is not in the npm `files` field (it isn't — `"files": ["dist"]` already excludes it).

3. Run `npm run test:coverage` — confirm coverage percentages are not diluted by example files.

4. Run `tsc --noEmit -p examples/tsconfig.json` — fix any type errors in example source files (not test files, which ts-jest handles separately).

5. Update `README.md`: add an **Examples** section after the existing framework sections pointing to `examples/nestjs/` and `examples/nextjs/` with a one-line description of what each demonstrates.

6. Verify `npm run lint` passes (ESLint targets `src/` only per existing config — examples are outside scope, no change needed).

## Success Criteria

- [ ] `npm test` exits 0; all test suites listed in output (library, nestjs, nextjs).
- [ ] `npm run build` exits 0; `dist/` contains no `examples/` directory.
- [ ] `npm run test:coverage` shows `src/**` coverage unchanged from baseline.
- [ ] `tsc --noEmit -p examples/tsconfig.json` exits 0.
- [ ] `README.md` has an Examples section linking to both example directories.

## Risk Assessment

- **Risk:** Node 16 lacks global `fetch`/`Request`/`Response`. *Mitigation:* the package already requires `node >= 16`; `Response` global was added in Node 18. If CI runs Node 16, add `undici` polyfill or bump `engines.node` to `>=18`. Check CI matrix in `.github/`.
- **Risk:** coverage threshold (if configured) drops due to new uncovered paths. *Mitigation:* examples import from `src/` but tests exercise those paths — coverage should stay equal or improve.

## Next Steps

Done. The plan is complete. Consider adding a CI step that runs `tsc --noEmit -p examples/tsconfig.json` alongside `npm test` to keep examples type-safe as the library evolves.
