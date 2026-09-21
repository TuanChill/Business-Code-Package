---
title: "fix-response-mapping-duplication"
description: "Fix the 4 architecture/maintainability issues found in the source review: 4-way duplicated HTTP-status/BusinessCode/message mapping, duplicated English message tables, closed Locale union, and Express-only coupling in ApiExceptionFilter."
status: pending
priority: P1
effort: ""
tags: [refactor, maintainability, i18n, nestjs]
created: 2026-09-19
---

# fix-response-mapping-duplication

## Overview

`@tuanchill/business-codes@1.1.0` is already published to GitHub Packages and consumed by two real projects (`Template-Nextjs`, `template-nestjs`). The prior architecture review of this repo found 4 concrete maintainability/extensibility issues, all confirmed by direct code reading:

1. The (HttpStatus, BusinessCode, default message) triple for the 9 common HTTP errors is hand-duplicated in 4 places: `src/response/api-response.ts` (static shorthand methods), `src/nextjs/helpers.ts` (`json*` helpers), `src/nestjs/exceptions.ts` (typed exception classes), and `src/nestjs/exception-filter.ts` (`mapHttpStatusToBusinessCode`). Any new HTTP-status mapping requires editing 4 files and staying in sync by hand.
2. `src/constants/business-codes.ts`'s `businessCodeMessages` and `src/i18n/locales/en.ts`'s `enMessages` are two independently-maintained English message tables covering (mostly) the same business codes.
3. `src/i18n/types.ts`'s `Locale = 'en' | 'vi'` is a closed union. `MessageProvider.registerMessages(locale: Locale, ...)` is therefore type-blocked from accepting any locale beyond `en`/`vi`, even though the runtime logic (`Map<Locale, MessageMap>` for custom messages) already supports arbitrary locales.
4. `src/nestjs/exception-filter.ts` imports `Response` from `express` and calls `response.status(...).json(...)`, hard-coupling the filter to the Express HTTP adapter even though NestJS itself is adapter-agnostic (Fastify is a common alternative).

Because this package is already published and consumed, every phase must preserve existing default behavior (same status codes, same business codes, same default messages) and be covered by tests before merging. This plan does not implement code — it defines phases for a follow-up `/ak:cook` (or manual) implementation pass.

## Goals

| # | Goal | Priority |
|---|------|----------|
| 1 | Single source of truth for the HTTP-status/BusinessCode/message mapping, consumed by all 4 current call sites | P1 |
| 2 | One canonical English message table; `i18n/locales/en.ts` derives from it instead of re-declaring it | P2 |
| 3 | Open `Locale` to accept custom locale strings while keeping `'en'`/`'vi'` autocomplete | P2 |
| 4 | Remove the hard `express` type dependency from `ApiExceptionFilter` | P3 |
| 5 | Prove no regression (existing + new tests, typecheck, build) and cut a release | P1 |

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | [Shared status/code/message mapping table](./phase-01-start.md) | Pending |
| 2 | [Dedupe English message tables](./phase-02-dedupe-english-message-tables.md) | Pending |
| 3 | [Open Locale type for custom locales](./phase-03-open-locale-type-for-custom-locales.md) | Pending |
| 4 | [Decouple exception filter from Express](./phase-04-decouple-exception-filter-from-express.md) | Pending |
| 5 | [Regression verification & release](./phase-05-regression-verification-and-release.md) | Pending |

Phases 1-4 are independent of each other and can be implemented/reviewed in any order (Phase 5 depends on all of them). Suggested order follows impact, per the original review: Phase 1 (highest maintainability payoff) → Phase 2 → Phase 3 → Phase 4 (lowest risk/impact, and the trickiest design call — see its Open Decision section) → Phase 5.

## Success Criteria

- [ ] All 4 findings resolved with no change to default runtime behavior (same status codes, business codes, and default messages for existing consumers)
- [ ] `npm test`, `npm run lint`, `npm run build` all pass
- [ ] `Template-Nextjs` and `template-nestjs` continue to work against the new version without code changes on their side (spot-checked, not necessarily re-published)
- [ ] New tests added for each phase's change (mapping table equivalence, message table equivalence, custom-locale registration, filter behavior under the new response abstraction)
- [ ] Version bumped and changelog/README updated if public API surface changed (Phase 3's `Locale` widening is the only phase with an API-surface change)

<!-- slug: fix-response-mapping-duplication -->
