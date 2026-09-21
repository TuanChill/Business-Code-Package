---
title: "Phase 3: Open Locale Type For Custom Locales"
status: todo
---

# Phase 3: Open Locale Type For Custom Locales

## Overview

`src/i18n/types.ts` declares `type Locale = 'en' | 'vi'`, a closed union. The runtime (`MessageProvider.customMessages: Map<Locale, MessageMap>`, `registerMessages(locale, messages)`) already has no built-in restriction to only 2 locales — the type is the only thing blocking `registerMessages('fr', {...})`. Widen the type while keeping IDE autocomplete for the 2 built-in locales.

## Requirements

- [ ] `Locale` accepts any string locale tag, while `'en'`/`'vi'` still autocomplete in editors (use the `'en' | 'vi' | (string & {})` widening idiom, not a bare `string`, so autocomplete isn't lost)
- [ ] `registerMessages(locale: Locale, messages: MessageMap)` compiles for arbitrary locale strings (e.g. `registerMessages('fr', {...})`)
- [ ] `builtInMessages: Record<Locale, MessageMap>` in `message-provider.ts` — currently a literal `{ en: ..., vi: ... }` typed as `Record<Locale, MessageMap>`. Once `Locale` widens, this must change type (e.g. `Record<'en' | 'vi', MessageMap>`, distinct from the public `Locale` type) so the literal still type-checks without requiring an entry for every possible string
- [ ] `DEFAULT_UNKNOWN_MESSAGE: Record<Locale, string>` in `types.ts` has the same issue — narrow its type to the built-in locales, and make `getMessage()`'s fallback (`DEFAULT_UNKNOWN_MESSAGE[targetLocale] ?? DEFAULT_UNKNOWN_MESSAGE.en`) handle a `targetLocale` that isn't a key at all (already does via `??`, confirm behavior with a test)
- [ ] `I18nConfig.locale`, `I18nConfig.fallbackLocale`, `I18nConfig.customMessages` continue to type-check as-is (they already reference `Locale`, so widening `Locale` widens them for free)

## Architecture

Two distinct concepts currently share one type name:
1. The public `Locale` — what a consumer may pass to `setLocale`/`registerMessages`/`getMessage` (should be open).
2. The *built-in* locale set — exactly `'en' | 'vi'`, used internally for `builtInMessages` and `DEFAULT_UNKNOWN_MESSAGE`, which must stay closed/exhaustive.

Introduce a second, internal type (e.g. `BuiltInLocale = 'en' | 'vi'`) for #2, and widen the exported `Locale` for #1. This is the standard fix for "open the public type, keep the internal exhaustive map closed."

## Related Code Files

- Modify: `src/i18n/types.ts`, `src/i18n/message-provider.ts`

## Implementation Steps

1. Add `type BuiltInLocale = 'en' | 'vi'` in `types.ts` (or co-locate with `message-provider.ts` if it's only used there).
2. Change `export type Locale = 'en' | 'vi'` to `export type Locale = 'en' | 'vi' | (string & {})`.
3. Retype `builtInMessages` in `message-provider.ts` as `Record<BuiltInLocale, MessageMap>`.
4. Retype `DEFAULT_UNKNOWN_MESSAGE` in `types.ts` as `Record<BuiltInLocale, string>`, and verify `getMessage()`'s `DEFAULT_UNKNOWN_MESSAGE[targetLocale]` lookup still compiles (indexing a `Record<BuiltInLocale,...>` with a wide `Locale` key needs a safe lookup — e.g. cast or a small helper — pick the option that doesn't silently allow `undefined` message text to leak to callers).
5. Add a test: `registerMessages('fr', { 0: 'Opération réussie' })` then `getMessage(0, 'fr')` returns the custom text; `getMessage(999, 'fr')` (unknown code, custom locale) falls back to `fallbackLocale` then to `DEFAULT_UNKNOWN_MESSAGE.en`.
6. Run existing i18n tests — `'en'`/`'vi'` behavior must be unchanged.

## Todo

- [ ] Widen `Locale`, add `BuiltInLocale`, retype `builtInMessages` and `DEFAULT_UNKNOWN_MESSAGE`
- [ ] Add custom-locale registration test
- [ ] Re-run i18n test suite and full `tsc` build

## Success Criteria

- `registerMessages('fr', {...})` (or any non-`en`/`vi` string) compiles without a cast or `as any`
- `'en'`/`'vi'` still autocomplete when typing a `Locale`-typed argument in an editor
- Existing i18n tests pass unchanged; new custom-locale test passes
- Full package build (`npm run build`) and `tsc --noEmit` are clean
