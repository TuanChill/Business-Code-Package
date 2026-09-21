---
title: "Phase 5: Regression Verification And Release"
status: todo
---

# Phase 5: Regression Verification And Release

## Overview

Close out the refactor: full regression pass across the whole package, confirm the two real consumer repos (`Template-Nextjs`, `template-nestjs`) aren't affected, then cut and publish a release via the existing GitHub Packages workflow.

## Requirements

- [ ] `npm test`, `npm run lint`, `npm run build` all pass with zero errors/warnings introduced by phases 1-4
- [ ] `npx tsc --noEmit` clean at the package root
- [ ] Test coverage added in phases 1-4 actually exercises the new shared modules (mapping table, canonical message table, custom-locale path, structural response type) — not just re-running old tests
- [ ] No unintended public API changes except the intentional `Locale` widening from Phase 3 (which is additive/non-breaking — existing `'en'`/`'vi'` usages keep compiling)
- [ ] Version bump follows semver: since Phase 3 is a type-level *widening* (backward compatible) and phases 1/2/4 are pure internal refactors, this is a **patch or minor** release, not major

## Architecture

No new architecture here — this phase is verification + release process, reusing the existing `.github/workflows/publish.yml` (publishes automatically on a `package.json` push to `main` when the version changes).

## Related Code Files

- Modify: `package.json` (version bump)
- Reference (no code change expected, verify only): `/Users/tuanchill/Desktop/Own/Template-Nextjs`, `/Users/tuanchill/Desktop/Own/template-nestjs`

## Implementation Steps

1. Run `npm test`, `npm run lint`, `npm run build`, `npx tsc --noEmit` locally; fix anything red.
2. Re-run the manual smoke tests already proven to work in this package's `examples/` (or the two cloned template repos, if still present locally) against the refactored code, using the same local-link approach used during the original consumer testing (Jest `moduleNameMapper` / local package link) — no need to re-publish just to verify.
3. Review the diff for phases 1-4 as a whole: confirm no stray console.log, no leftover dead code from the old duplicated implementations, no orphaned imports (e.g. `express` types fully removed per Phase 4).
4. Decide and apply the version bump (`npm version patch` or `minor`, per the semver note above).
5. Update `CHANGELOG`/`README` only if Phase 3's `Locale` widening needs documentation (custom-locale usage example) — don't touch unrelated docs.
6. Commit and push to `main`; confirm the `publish.yml` workflow's version-check step detects the bump and runs the publish job (mirrors the verification already done for `1.1.0`).

## Todo

- [ ] Full local verification pass (test/lint/build/typecheck) green
- [ ] Spot-check against a real consumer (local link, not necessarily a full re-publish-and-reinstall cycle)
- [ ] Version bump + push, confirm workflow publishes

## Success Criteria

- CI-equivalent local checks (test/lint/build/typecheck) all pass
- GitHub Packages shows the new version published, matching `package.json`
- No behavior change observed in a real consumer smoke test

## Risk Assessment

Because this package is already installed by 2 external-to-this-repo projects, the main risk is a silent behavior change slipping through (e.g. a slightly different default message string, or a status code drifting during the Phase 1 table consolidation). Mitigation: every phase's Implementation Steps explicitly require re-running the *existing* test suite unmodified as a regression gate, in addition to new tests — a passing existing suite is the strongest signal that defaults didn't drift.
