# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (ESM + CJS + type declarations)
npm run build

# Build types only
npm run build:types

# Clean dist
npm run clean

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

To run a single test file:
```bash
npx jest src/response/api-response.spec.ts
```

## Architecture

This is a dual-package (ESM + CJS) TypeScript library published as `@tuanchill/business-codes`. Rollup builds both formats from the same source; `tsc` emits type declarations separately into `dist/types/`.

### Entry points

The package exposes five sub-path exports, each with its own source root:

| Import path | Source |
|---|---|
| `@tuanchill/business-codes` | `src/index.ts` |
| `@tuanchill/business-codes/nestjs` | `src/nestjs/index.ts` |
| `@tuanchill/business-codes/nextjs` | `src/nextjs/index.ts` |
| `@tuanchill/business-codes/i18n` | `src/i18n/index.ts` |
| `@tuanchill/business-codes/i18n/react` | `src/i18n/react/index.ts` |

### Source layout

- `src/constants/` — `HttpStatus` enum + helpers, `BusinessCode` enum + helpers (codes grouped by range: 0=success, 1xxx=auth, 2xxx=user, 3xxx=validation, 4xxx=resource, 5xxx=server, 6xxx=external, 7xxx=business logic)
- `src/response/` — `ApiResponse` class with static factory methods (`success`, `error`, `paginated`, `created`, `noContent`, shorthand error methods)
- `src/types/` — shared TypeScript interfaces (`PaginationMeta`, `ErrorDetails`, `SuccessParams`, etc.)
- `src/nestjs/` — `ApiExceptionFilter`, `ApiResponseInterceptor`, `SkipApiResponse` decorator, typed exception classes (`BusinessException`, `NotFoundException`, `ValidationException`, `AuthException`)
- `src/nextjs/` — response helpers (`jsonSuccess`, `jsonError`, `jsonCreated`, `jsonPaginated`, `jsonNotFound`, `withErrorHandler`, `parseBody`, `parsePagination`)
- `src/i18n/` — `MessageProvider` singleton, `getLocalizedMessage`/`setLocale`/`registerMessages`, locale files (`en.ts`, `vi.ts`)
- `src/i18n/react/` — `BusinessMessageProvider` React context + `useBusinessMessage` hook

### Key design constraints

- NestJS and React are **optional peer dependencies** — their modules must not be imported from the core entry point (`src/index.ts`).
- All framework-specific code lives in its own sub-path so consumers only pay for what they import.
- Tests live alongside source as `*.spec.ts` files; Jest is configured to pick them up from `src/`.
