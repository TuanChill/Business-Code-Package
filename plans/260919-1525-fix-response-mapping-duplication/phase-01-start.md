---
title: "Phase 1: Start"
status: todo
---

# Phase 1: Shared status/code/message mapping table

## Overview

Create one canonical table mapping the 9 common HTTP error cases to their `(HttpStatus, BusinessCode)` pair, and make `api-response.ts`, `nextjs/helpers.ts`, `nestjs/exceptions.ts`, and `nestjs/exception-filter.ts` all read from it instead of each hard-coding their own copy.

**Scope correction (found during implementation, confirmed with user):** the *default message text* is NOT actually identical across the 4 sites and was never truly duplicated — it diverged intentionally/accidentally over time, and existing tests pin both variants:

| Case | HttpStatus | BusinessCode | `api-response.ts` / `nextjs/helpers.ts` message | `nestjs/exceptions.ts` message |
|---|---|---|---|---|
| Bad request | `BAD_REQUEST` | `INVALID_INPUT` | "Bad request" | "Bad request" (same) |
| Unauthorized | `UNAUTHORIZED` | `AUTH_FAILED` | "Unauthorized" | "Authentication failed" (via `getBusinessCodeMessage`) |
| Forbidden | `FORBIDDEN` | `PERMISSION_DENIED` | "Forbidden" | "Access denied" |
| Not found | `NOT_FOUND` | `RESOURCE_NOT_FOUND` | "Not found" | "Resource not found" |
| Conflict | `CONFLICT` | `RESOURCE_CONFLICT` | "Conflict" | "Resource conflict" |
| Validation error | `UNPROCESSABLE_ENTITY` | `VALIDATION_ERROR` | "Validation failed" | "Validation failed" (same) |
| Too many requests | `TOO_MANY_REQUESTS` | `RATE_LIMIT_EXCEEDED` | "Too many requests" | "Too many requests" (same) |
| Internal error | `INTERNAL_SERVER_ERROR` | `INTERNAL_ERROR` | "Internal server error" | "Internal server error" (same) |
| Service unavailable | `SERVICE_UNAVAILABLE` | `SERVICE_UNAVAILABLE` | (no shorthand) | "Service unavailable" |

Decision: the shared table holds **only `{ httpStatus, businessCode }`** — the part that's genuinely duplicated and the part that actually causes bugs when it drifts (e.g. `exception-filter.ts`'s `mapHttpStatusToBusinessCode` returning a different code than `ApiResponse.notFound()` would). Each of the 4 sites keeps declaring its own default message text locally, unchanged. This keeps Phase 1 a pure zero-behavior-change internal consolidation; unifying message text is explicitly out of scope here (see Phase 2 for the *unrelated* true message-text duplication between `business-codes.ts` and `i18n/locales/en.ts`).

## Requirements

- [ ] New module exports one table (object or `Map`) keyed by a stable semantic key (e.g. `BAD_REQUEST`, `UNAUTHORIZED`, ...), each entry holding `{ httpStatus, businessCode }` only — no message field
- [ ] No change to any existing public export's runtime behavior, including default message text — this is an internal consolidation, not an API or text change
- [ ] `api-response.ts` static shorthand methods (`badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `validationError`, `tooManyRequests`, `internalError`) read their `httpStatus`/`businessCode` from the table; default message strings stay as local literals exactly as today
- [ ] `nextjs/helpers.ts` shorthand functions (`jsonBadRequest`, `jsonUnauthorized`, `jsonForbidden`, `jsonNotFound`, `jsonConflict`, `jsonValidationError`, `jsonTooManyRequests`, `jsonInternalError`) keep delegating to `jsonError`/`ApiResponse.error` as today; only their `HttpStatus`/`BusinessCode` default parameter values are sourced from the table, message defaults stay local literals
- [ ] `nestjs/exceptions.ts` typed exception classes' default `(businessCode, HttpStatus)` pairs read from the table; each class's own default message string (or `getBusinessCodeMessage` fallback for `AuthException`) is untouched
- [ ] `nestjs/exception-filter.ts`'s `mapHttpStatusToBusinessCode` builds its `httpStatus -> businessCode` lookup from the table instead of a hand-written `Record<number, number>` literal

## Architecture

Put the table in `src/constants/` (e.g. `src/constants/response-mapping.ts`) since both `response/` and `nestjs/` already depend on `constants/`, avoiding a new cross-directory dependency. Keep it internal (not exported from `src/index.ts`) unless a consumer-facing use case shows up later — YAGNI.

## Related Code Files

- Create: `src/constants/response-mapping.ts`
- Modify: `src/response/api-response.ts`, `src/nextjs/helpers.ts`, `src/nestjs/exceptions.ts`, `src/nestjs/exception-filter.ts`

## Implementation Steps

1. Write `src/constants/response-mapping.ts` with the 9-entry `{ httpStatus, businessCode }` table above, sourced from the existing 4 files (do not invent new values).
2. Refactor `api-response.ts` shorthand statics to pull `httpStatus`/`businessCode` from the table; each method's own default message literal and existing override parameters (custom message, custom code, details) stay exactly as before.
3. Refactor `nextjs/helpers.ts` shorthand functions the same way — table for status/code, message defaults untouched.
4. Refactor `nestjs/exceptions.ts` typed exception classes' constructor `(businessCode, HttpStatus)` defaults the same way; message defaults/`getBusinessCodeMessage` fallback untouched.
5. Refactor `nestjs/exception-filter.ts`'s `mapHttpStatusToBusinessCode` to derive its `Record<number, number>` from the table (map `httpStatus -> businessCode`) instead of listing pairs by hand.
6. Run existing test suite; every existing assertion about status codes, business codes, and default messages must still pass unchanged.

## Todo

- [ ] Add `src/constants/response-mapping.ts` and its own unit test asserting the table's 9 entries match the values above
- [ ] Refactor the 4 consumers and re-run `npm test`

## Success Criteria

- `src/constants/response-mapping.ts` is the only place the 9 triples are literally declared
- All 4 consumers import from it; `grep` for the literal business-code constant names (e.g. `INVALID_INPUT`, `AUTH_FAILED`) outside the new table and its 4 consumers turns up nothing new
- Existing test suite passes unmodified (default messages/status/codes unchanged)
