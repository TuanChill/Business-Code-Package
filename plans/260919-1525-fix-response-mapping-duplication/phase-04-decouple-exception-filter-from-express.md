---
title: "Phase 4: Decouple Exception Filter From Express"
status: todo
---

# Phase 4: Decouple Exception Filter From Express

## Overview

`src/nestjs/exception-filter.ts` imports `Response` from `express` and calls `response.status(code).json(body)`. NestJS itself supports multiple HTTP adapters (Express, Fastify); this filter only works correctly under Express today, even though nothing else in the package assumes Express.

## Open Decision (resolve before implementing)

Two ways to fix this, with different risk/scope trade-offs:

**Option A — structural response type (recommended default, lower risk).**
Replace `import { Response } from 'express'` with a minimal structural type (e.g. `interface MinimalResponse { status(code: number): { json(body: unknown): void } }`) and type `ctx.getResponse<MinimalResponse>()` against that instead of Express's concrete type. Removes the `express` type dependency and keeps today's exact runtime call shape (`response.status(x).json(y)`), so it works unchanged for the Express consumers already using this package (`template-nestjs`). Does **not** add real Fastify support, since Fastify's reply API is `.code(x).send(y)`, not `.status(x).json(y)` — this only removes the type-level coupling, not the runtime one.

**Option B — proper multi-adapter support via `HttpAdapterHost`.**
Use NestJS's own `httpAdapter.reply(response, body, statusCode)` (via injected `HttpAdapterHost`), which is adapter-agnostic at runtime (works on both Express and Fastify). This is the "correct" NestJS-idiomatic fix, but `ApiExceptionFilter` is currently constructed directly by consumers (`new ApiExceptionFilter()` in `main.ts`, not through Nest's DI container per the README/examples), so it doesn't have DI-injected dependencies today. Adding real DI support means either (a) requiring consumers to switch to the `APP_FILTER` provider pattern (a breaking change to the documented usage), or (b) accepting an optional `HttpAdapterHost` constructor param that falls back to today's Express-shaped call when absent (extra internal complexity for a capability with no confirmed consumer demand yet).

**Default: implement Option A.** It fixes the actual finding (unnecessary `express` type coupling) with no behavior or API change for existing consumers. Only pursue Option B if/when there's a real Fastify consumer — do not build multi-adapter support speculatively (YAGNI).

## Requirements

- [ ] No `import ... from 'express'` remains in `src/nestjs/exception-filter.ts` (or anywhere else in the package's runtime code)
- [ ] Existing Express-based behavior (status code + JSON body shape) is byte-for-byte unchanged
- [ ] `express` is not required as a dependency for consumers who only use the `nestjs` sub-path with a non-Express adapter and don't hit this filter (confirm it currently isn't a runtime `dependency`/`peerDependency` — check `package.json`)

## Related Code Files

- Modify: `src/nestjs/exception-filter.ts`

## Implementation Steps

1. Confirm `express` isn't already declared as a `dependency`/`peerDependency` in `package.json` (it should only ever have been a type-only import).
2. Define the minimal structural response type in `exception-filter.ts` (or a small shared `src/nestjs/types.ts` if other Nest files need it later — don't create one speculatively if this is the only user).
3. Replace `Response` (from `express`) with the structural type in `ctx.getResponse<...>()` and the `response` variable's type annotation.
4. Run `nestjs/exception-filter` tests and the `template-nestjs` manual smoke test path (success + `?fail=true` cases) to confirm identical HTTP responses.
5. Run full `tsc --noEmit` to catch any other file relying on the removed `express` import transitively.

## Todo

- [ ] Confirm `express` isn't a declared dependency
- [ ] Replace the Express-typed `Response` with a structural type
- [ ] Re-run exception-filter tests and confirm identical response bodies/status codes

## Success Criteria

- `grep -r "from 'express'" src/` returns nothing
- Existing exception-filter tests pass unchanged
- `template-nestjs` (or an equivalent local smoke test) still returns identical success/error response bodies after the change
