---
title: "NestJS & Next.js consumer examples with tests"
description: "Build runnable in-repo examples that consume @tchil/business-codes from NestJS and Next.js, with tests on both frameworks proving the package works end-to-end."
status: pending
priority: P2
branch: "main"
tags: [examples, testing, nestjs, nextjs]
blockedBy: []
blocks: []
created: "2026-05-31T08:38:47.586Z"
createdBy: "ck:plan"
source: skill
---

# NestJS & Next.js consumer examples with tests

## Overview

Add two consumer examples under `examples/` that import the package **by its public name** (`@tchil/business-codes/nestjs`, `@tchil/business-codes/nextjs`, `@tchil/business-codes/i18n/react`) and exercise the real integration surfaces. Tests run inside this repo's Jest via a multi-project config + `moduleNameMapper` (no build/publish/link step needed). `npm test` runs the existing unit tests **plus** the new example tests in one pass.

Scope is verification-by-example: prove the interceptor, exception filter, typed exceptions, Next.js `json*` helpers, `withErrorHandler`/`parseBody`/`parsePagination`, and the React `useBusinessMessage`/`BusinessMessageProvider` all behave correctly from a consumer's perspective.

## Decisions (confirmed with user)

- **Structure:** in-repo `examples/` (not standalone consumer projects). Import by package name, resolved to `src/` via Jest `moduleNameMapper`.
- **Next.js fidelity:** App Router route handlers returning standard Web `Response` (the helpers never touch `next/server`, so no `next` dependency).
- **Coverage:** server surfaces (NestJS + Next.js route handlers) **plus** React i18n hook/provider.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Test harness & deps](./phase-01-test-harness-deps.md) | Pending |
| 2 | [NestJS example + e2e tests](./phase-02-nestjs-example-e2e-tests.md) | Pending |
| 3 | [Next.js example + React i18n + tests](./phase-03-next-js-example-react-i18n-tests.md) | Pending |
| 4 | [Verification & docs](./phase-04-verification-docs.md) | Pending |

## Key constraints

- Build must stay clean: `tsc` (`include: ["src/**/*"]`) and Rollup inputs target `src/` only — examples must NOT enter the published `dist/`.
- NestJS and React stay **optional peer deps** — example code lives only under `examples/`, never imported from `src/index.ts`.
- ts-jest runs with `isolatedModules: true` (transpile-only via preset), so example files compile on demand without being added to the root tsconfig `include`.

## Dependencies

None (self-contained). New devDependencies are added in Phase 1.
