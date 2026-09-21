---
title: "Phase 2: Dedupe English Message Tables"
status: todo
---

# Phase 2: Dedupe English Message Tables

## Overview

`src/constants/business-codes.ts`'s `businessCodeMessages: Record<number, string>` (used by `getBusinessCodeMessage()`, which `nestjs/exceptions.ts` calls for its default messages) and `src/i18n/locales/en.ts`'s `enMessages: MessageMap` (used by the i18n `MessageProvider`) both declare English text for the same business codes independently. Make one canonical and have the other derive from it.

## Requirements

- [ ] Diff the two tables key-by-key before merging — confirm whether any entries have already drifted (different wording for the same code). If drift exists, decide (with the user if the correct wording isn't obvious) which text wins; do not silently pick one.
- [ ] `businessCodeMessages` (in `constants/business-codes.ts`) stays canonical, since it's the lower-level module (`i18n/` already depends on nothing in `constants/` today — confirm no circular import risk before wiring `i18n/locales/en.ts` to import from `constants/business-codes.ts`)
- [ ] `enMessages` becomes a derived export (e.g. `export const enMessages: MessageMap = businessCodeMessages` or a thin re-export) instead of a re-typed literal
- [ ] No change to `getLocalizedMessage()`/`MessageProvider` runtime output for existing codes+locale='en' combinations

## Architecture

`businessCodeMessages` is currently a private (`const`, not exported) map only reachable through `getBusinessCodeMessage(code)`. Exporting the map itself (or exporting a typed `MessageMap`-shaped view of it) is the smallest change that lets `i18n/locales/en.ts` consume it without duplicating literals. Keep `vi.ts` untouched — Vietnamese translations are legitimate, non-duplicate content.

## Related Code Files

- Modify: `src/constants/business-codes.ts` (export `businessCodeMessages`, or export a getter), `src/i18n/locales/en.ts`

## Implementation Steps

1. Script or manually diff `businessCodeMessages` vs `enMessages` key sets and values; note any mismatches.
2. Resolve any mismatches (pick canonical wording; if ambiguous, ask the user before proceeding).
3. Export `businessCodeMessages` from `constants/business-codes.ts` (or add a dedicated export) with an explicit `MessageMap`-compatible type so `i18n/types.ts`'s `MessageMap` and this table stay structurally compatible without a hard dependency from `constants/` on `i18n/`.
4. Rewrite `i18n/locales/en.ts` to derive `enMessages` from the exported table instead of re-declaring every entry.
5. Run existing i18n tests (`getLocalizedMessage`, `MessageProvider`, React `useBusinessMessage`) — outputs for `locale: 'en'` must be byte-identical to before.

## Todo

- [ ] Diff both tables and resolve any mismatches
- [ ] Export canonical table from `constants/business-codes.ts` and rewire `i18n/locales/en.ts`
- [ ] Re-run i18n test suite

## Success Criteria

- Only one literal declaration of English business-code messages exists in the codebase
- `enMessages` and `businessCodeMessages` are reference-equal or one is provably derived from the other (test asserts this)
- All existing i18n tests pass unchanged
